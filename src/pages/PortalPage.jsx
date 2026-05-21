import { useState, useEffect, useCallback } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'

const PRODUCTS = [
  {
    id: 'logiclens',
    title: '逻辑透镜',
    subtitle: 'LogicLens',
    tagline: '用数据看见比赛',
    description:
      '基于历史赛事数据与机器学习模型的个人数据分析项目。覆盖五大联赛，每日更新，数据公开透明。',
    tags: ['随机森林', '逻辑回归', '神经网络'],
    href: '/lab',
    accentColor: '#7c6ef0',
    status: '每日更新',
    hero: true,
    bento: 'hero',
    preview: 'data-dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2.5" />
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
  },
  {
    id: 'shangan',
    title: '上岸雷达',
    subtitle: 'Gongkao Radar',
    tagline: '考公岗位智能匹配',
    description:
      '公务员考试岗位智能匹配与信息查询。精准筛选目标岗位，提升备考效率。',
    tags: ['考公', '岗位匹配'],
    href: '/kg',
    accentColor: '#6cb4f0',
    status: '持续更新',
    bento: 'tall',
    preview: 'job-search',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.5 6.5L21 11l-6.5 3L12 22l-2.5-8L3 11l6.5-2.5z" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    ),
  },
  {
    id: 'classicore',
    title: '典萃',
    subtitle: 'ClassiCore',
    tagline: 'AI 深度阅读伴侣',
    description:
      '上传 PDF 自动拆解，生成知识胶囊，一键输出多平台创作脚本。',
    tags: ['知识胶囊', '深度拆解'],
    href: '/demo/classicore',
    accentColor: '#4ecfb3',
    status: '可用',
    bento: 'normal',
    preview: 'book-reader',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="6" height="18" rx="1.5" />
        <rect x="15" y="3" width="6" height="18" rx="1.5" />
        <line x1="9" y1="6" x2="15" y2="6" />
        <line x1="9" y1="10" x2="15" y2="10" />
        <line x1="9" y1="14" x2="12" y2="14" />
      </svg>
    ),
  },
  {
    id: 'aicleaner',
    title: '净言',
    subtitle: 'AI Cleaner',
    tagline: '把 AI 写的东西，改得像真人',
    description:
      'AI 文本润色工具。一键优化表达，去 AI 味，让内容更自然流畅。',
    tags: ['AI润色', '免费使用'],
    href: '/demo/aicleaner',
    accentColor: '#f0c46c',
    status: '免费可用',
    bento: 'normal',
    preview: 'ai-text',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l2.5 7.5L22 13l-7.5 2.5L12 23l-2.5-7.5L2 13l7.5-2.5z" />
      </svg>
    ),
  },
  {
    id: 'lottery',
    title: '我中奖了吗？',
    subtitle: 'Lottery Check',
    tagline: '拍一张，等天意',
    description:
      '彩票中奖查询工具。支持大乐透、双色球，录入号码即可批量核验。',
    tags: ['大乐透', '双色球'],
    href: '/lottery/',
    accentColor: '#e86c9a',
    status: '可用',
    bento: 'normal',
    preview: 'lottery-balls',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="16" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <path d="M3 9h18" />
      </svg>
    ),
  },
  {
    id: 'jczq',
    title: '私域粉丝投票',
    subtitle: 'Fans Vote',
    tagline: '比赛分享和私域投票',
    description:
      '比赛分享和私域投票数据收集，了解粉丝热度与倾向。',
    tags: ['粉丝投票', '赛事热度'],
    href: '/demo/fansvote',
    accentColor: '#f0876c',
    status: '实时更新',
    bento: 'wide',
    preview: 'vote-poll',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
        <path d="M7 3l-1 4 4-1" />
        <path d="M17 3l1 4-4-1" />
      </svg>
    ),
  },
]

const SPOTLIGHT_ORDER = ['logiclens', 'shangan', 'classicore', 'aicleaner', 'lottery', 'jczq']
const SPOTLIGHT_PRODUCTS = SPOTLIGHT_ORDER.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean)

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  :root {
    --bp-bg:        #0a0a0f;
    --bp-card:      #111118;
    --bp-card-h:    #16161f;
    --bp-primary:   #f0eeff;
    --bp-secondary: #8b85a8;
    --bp-muted:     #4a4666;
    --bp-accent:    #7c6ef0;
    --bp-border:    rgba(255,255,255,0.07);
    --bp-border-h:  rgba(255,255,255,0.13);
    --bp-display:   'Syne', sans-serif;
    --bp-body:      'DM Sans', sans-serif;
    --bp-ease:      cubic-bezier(.23,1,.32,1);
  }

  .bp-wrap {
    font-family: var(--bp-body);
    background: var(--bp-bg);
    min-height: 100vh;
    color: var(--bp-primary);
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow-x: hidden;
  }

  .bp-wrap::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 80% 55% at 72% -8%,  rgba(124,110,240,.11) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 8% 82%,   rgba(78,207,179,.06)  0%, transparent 50%);
    transition: background 1s ease;
  }
  .bp-wrap > * { position: relative; z-index: 1; }

  /* nav */
  .bp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    background: rgba(10,10,15,.72);
    border-bottom: 1px solid var(--bp-border);
  }
  .bp-nav-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 clamp(1.25rem,4vw,3.5rem);
    height: 56px; display: flex; align-items: center; justify-content: space-between;
  }
  .bp-logo {
    display: flex; align-items: center; gap: 9px;
    text-decoration: none; font-family: var(--bp-display);
    font-size: 16px; font-weight: 700; letter-spacing: -.02em; color: var(--bp-primary);
  }
  .bp-logo-dot {
    width: 7px; height: 7px; border-radius: 50%; background: var(--bp-accent);
    box-shadow: 0 0 12px var(--bp-accent);
    animation: bp-pulse 2.4s ease-in-out infinite;
  }
  .bp-nav-links { display: flex; gap: 1.5rem; list-style: none; margin: 0; padding: 0; }
  .bp-nav-links a {
    color: var(--bp-secondary); text-decoration: none; font-size: 13px;
    transition: color .2s;
  }
  .bp-nav-links a:hover { color: var(--bp-primary); }

  /* spotlight hero */
  .bp-spotlight {
    min-height: 100vh;
    max-width: 1200px; margin: 0 auto;
    padding: calc(56px + clamp(3rem,8vw,6rem)) clamp(1.25rem,4vw,3.5rem) clamp(2rem,5vw,4rem);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem,5vw,4rem);
    align-items: center;
  }
  .bp-spotlight-copy { position: relative; min-height: 280px; }
  .bp-spotlight-slide {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; justify-content: center;
    opacity: 0; transform: translateY(16px);
    transition: opacity .65s var(--bp-ease), transform .65s var(--bp-ease);
    pointer-events: none;
  }
  .bp-spotlight-slide.active { opacity: 1; transform: translateY(0); pointer-events: auto; }
  .bp-sp-eyebrow {
    font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase;
    color: var(--_accent, var(--bp-accent)); margin-bottom: 1.2rem;
  }
  .bp-sp-title {
    font-family: var(--bp-display);
    font-size: clamp(2.8rem,7vw,5.5rem);
    font-weight: 800; line-height: 1.02; letter-spacing: -.045em;
    margin-bottom: .6rem;
  }
  .bp-sp-subtitle {
    font-family: var(--bp-display);
    font-size: clamp(.75rem,1.2vw,.85rem);
    font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
    color: var(--bp-muted); margin-bottom: 1rem;
  }
  .bp-sp-tagline {
    font-size: clamp(1rem,2vw,1.2rem); color: var(--bp-secondary);
    font-weight: 300; line-height: 1.6; margin-bottom: 2rem; max-width: 420px;
  }
  .bp-sp-cta {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 26px; background: var(--_accent, var(--bp-accent)); color: #fff;
    text-decoration: none; font-size: 14px; font-weight: 500;
    border-radius: 100px;
    transition: transform .25s, box-shadow .25s;
  }
  .bp-sp-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px color-mix(in srgb, var(--_accent, var(--bp-accent)) 35%, transparent);
  }
  .bp-sp-dots {
    display: flex; gap: 8px; margin-top: 2.5rem;
  }
  .bp-sp-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--bp-border-h); border: none; cursor: pointer; padding: 0;
    transition: background .3s, transform .3s;
  }
  .bp-sp-dot.active {
    background: var(--_accent, var(--bp-accent));
    transform: scale(1.25);
  }

  /* spotlight visual */
  .bp-spotlight-visual {
    position: relative; aspect-ratio: 4/3; border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--bp-border);
    background: var(--bp-card);
  }
  .bp-spotlight-visual::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 60% at 50% 30%, color-mix(in srgb, var(--_accent, #7c6ef0) 18%, transparent), transparent);
  }
  .bp-spotlight-visual-inner {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem;
    transition: opacity .65s var(--bp-ease), transform .65s var(--bp-ease);
    opacity: 0; transform: scale(.96);
  }
  .bp-spotlight-visual-inner.active { opacity: 1; transform: scale(1); }

  /* manifesto */
  .bp-manifesto {
    max-width: 1200px; margin: 0 auto;
    padding: clamp(3rem,8vw,6rem) clamp(1.25rem,4vw,3.5rem);
    text-align: center;
  }
  .bp-manifesto-text {
    font-family: var(--bp-display);
    font-size: clamp(1.4rem,3.5vw,2.4rem);
    font-weight: 700; letter-spacing: -.03em; line-height: 1.35;
    color: var(--bp-primary);
    max-width: 720px; margin: 0 auto;
  }
  .bp-manifesto-text em {
    font-style: normal;
    color: transparent;
    -webkit-text-stroke: 1px rgba(240,235,255,.35);
  }

  /* section */
  .bp-section {
    max-width: 1200px; margin: 0 auto;
    padding: clamp(2rem,5vw,4rem) clamp(1.25rem,4vw,3.5rem);
  }
  .bp-sec-label {
    font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
    color: var(--bp-muted); margin-bottom: 1.5rem;
  }

  /* bento grid */
  .bp-bento {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 14px;
  }
  .bp-bento-hero   { grid-column: span 8; grid-row: span 2; }
  .bp-bento-tall   { grid-column: span 4; grid-row: span 2; }
  .bp-bento-wide   { grid-column: span 8; }
  .bp-bento-normal { grid-column: span 4; }

  /* bento card */
  .bp-bento-card {
    background: var(--bp-card);
    border: 1px solid var(--bp-border);
    border-radius: 20px;
    text-decoration: none; color: inherit;
    display: flex; flex-direction: column;
    overflow: hidden; cursor: pointer;
    transition: border-color .35s, transform .35s var(--bp-ease), box-shadow .35s;
    min-height: 200px;
  }
  .bp-bento-card:hover {
    border-color: var(--bp-border-h);
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(0,0,0,.4);
  }
  .bp-bento-preview {
    flex: 1; min-height: 120px; position: relative; overflow: hidden;
    background: linear-gradient(160deg, color-mix(in srgb, var(--_accent) 12%, var(--bp-card)), var(--bp-card));
  }
  .bp-bento-body { padding: 1.25rem 1.4rem 1.4rem; display: flex; flex-direction: column; gap: .5rem; }
  .bp-bento-card.bp-bento-hero .bp-bento-preview { min-height: 200px; }
  .bp-bento-card.bp-bento-tall .bp-bento-preview { min-height: 160px; }
  .bp-bento-name {
    font-family: var(--bp-display); font-size: 1.05rem; font-weight: 700;
    letter-spacing: -.02em; display: flex; align-items: center; gap: 8px;
  }
  .bp-bento-en {
    font-size: .65rem; font-weight: 500; letter-spacing: .06em;
    text-transform: uppercase; color: var(--bp-muted);
  }
  .bp-bento-tagline { font-size: 12.5px; color: var(--bp-secondary); font-weight: 300; }
  .bp-bento-foot {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: auto; padding-top: .5rem;
  }
  .bp-bento-status { font-size: 10.5px; color: var(--bp-muted); display: flex; align-items: center; gap: 5px; }
  .bp-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ecfb3; }
  .bp-bento-arrow {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--bp-border-h);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; transition: background .25s, transform .25s;
  }
  .bp-bento-card:hover .bp-bento-arrow {
    background: var(--_accent, var(--bp-accent)); color: #fff; transform: translateX(2px);
  }

  /* preview mockups */
  .bp-mock { width: 100%; height: 100%; padding: 1.25rem; display: flex; flex-direction: column; gap: 8px; }
  .bp-mock-bar { height: 6px; border-radius: 3px; background: rgba(255,255,255,.08); }
  .bp-mock-bar.accent { background: color-mix(in srgb, var(--_accent) 50%, transparent); width: 60%; }
  .bp-mock-pills { display: flex; gap: 6px; flex-wrap: wrap; }
  .bp-mock-pill {
    font-size: 9px; padding: 3px 8px; border-radius: 100px;
    background: rgba(255,255,255,.06); color: var(--bp-secondary);
  }
  .bp-mock-chart { display: flex; align-items: flex-end; gap: 6px; height: 60px; margin-top: auto; }
  .bp-mock-col {
    flex: 1; border-radius: 4px 4px 0 0;
    background: color-mix(in srgb, var(--_accent) 30%, transparent);
  }
  .bp-mock-text-before {
    font-size: 10px; color: var(--bp-muted); text-decoration: line-through;
    opacity: .6; line-height: 1.5;
  }
  .bp-mock-text-after {
    font-size: 11px; color: var(--bp-primary); line-height: 1.5;
  }
  .bp-mock-books { display: flex; gap: 10px; height: 100%; align-items: stretch; }
  .bp-mock-book {
    flex: 1; border-radius: 8px; border: 1px solid rgba(255,255,255,.08);
    background: rgba(255,255,255,.03); padding: 10px;
    display: flex; flex-direction: column; gap: 5px;
  }
  .bp-mock-book-line { height: 4px; border-radius: 2px; background: rgba(255,255,255,.08); }
  .bp-mock-balls { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; justify-content: center; height: 100%; }
  .bp-mock-ball {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600;
    background: color-mix(in srgb, var(--_accent) 25%, transparent);
    border: 1px solid color-mix(in srgb, var(--_accent) 40%, transparent);
  }
  .bp-mock-ball.blue { background: rgba(59,130,246,.2); border-color: rgba(59,130,246,.4); color: #93c5fd; }
  .bp-mock-poll-row { display: flex; align-items: center; gap: 8px; }
  .bp-mock-poll-label { font-size: 10px; color: var(--bp-secondary); width: 48px; flex-shrink: 0; }
  .bp-mock-poll-track { flex: 1; height: 6px; background: rgba(255,255,255,.06); border-radius: 3px; overflow: hidden; }
  .bp-mock-poll-fill { height: 100%; border-radius: 3px; background: var(--_accent); }
  .bp-mock-poll-pct { font-size: 10px; color: var(--bp-muted); width: 28px; text-align: right; }
  .bp-mock-job-row {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; border-radius: 8px;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.06);
  }
  .bp-mock-job-title { font-size: 10px; color: var(--bp-primary); font-weight: 500; }
  .bp-mock-job-meta { font-size: 9px; color: var(--bp-muted); }

  /* about */
  .bp-about {
    max-width: 640px; margin: 0 auto; text-align: center;
    padding: clamp(3rem,8vw,6rem) clamp(1.25rem,4vw,3.5rem);
  }
  .bp-about-avatar {
    width: 64px; height: 64px; border-radius: 18px; margin: 0 auto 1.5rem;
    background: rgba(124,110,240,.15); border: 1px solid rgba(124,110,240,.25);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--bp-display); font-size: 1.3rem; font-weight: 700; color: var(--bp-accent);
  }
  .bp-about-name {
    font-family: var(--bp-display); font-size: 1.5rem; font-weight: 700;
    letter-spacing: -.02em; margin-bottom: 4px;
  }
  .bp-about-role { font-size: 13px; color: var(--bp-muted); margin-bottom: 1.5rem; }
  .bp-about-bio {
    font-size: 14px; color: var(--bp-secondary); line-height: 1.85;
    font-weight: 300; margin-bottom: 1rem;
  }
  .bp-about-note {
    font-size: 11.5px; color: var(--bp-muted); font-style: italic;
    margin-top: 1.5rem; line-height: 1.6;
  }
  .bp-about-tags { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 1.5rem; }
  .bp-about-tag {
    font-size: 11.5px; padding: 5px 12px; border-radius: 100px;
    border: 1px solid var(--bp-border-h); color: var(--bp-secondary);
  }

  /* footer */
  .bp-footer-wrap { border-top: 1px solid var(--bp-border); }
  .bp-footer {
    max-width: 1200px; margin: 0 auto;
    padding: 1.75rem clamp(1.25rem,4vw,3.5rem);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .875rem;
  }
  .bp-footer-l { font-size: 12px; color: var(--bp-muted); display: flex; flex-direction: column; gap: 3px; }
  .bp-footer-r { display: flex; align-items: center; gap: 1.1rem; flex-wrap: wrap; }
  .bp-footer-r a { font-size: 11.5px; color: var(--bp-muted); text-decoration: none; transition: color .2s; }
  .bp-footer-r a:hover { color: var(--bp-secondary); }

  /* scroll reveal */
  .bp-reveal {
    opacity: 0; transform: translateY(28px);
    transition: opacity .8s var(--bp-ease), transform .8s var(--bp-ease);
  }
  .bp-reveal.bp-visible { opacity: 1; transform: translateY(0); }

  /* animations */
  @keyframes bp-pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--bp-accent); }
    50% { opacity: .7; box-shadow: 0 0 16px var(--bp-accent); }
  }
  @keyframes bp-up { from { opacity:0; transform: translateY(18px) } to { opacity:1; transform: translateY(0) } }
  .bp-nav { animation: bp-up .6s var(--bp-ease) both; }

  @media (max-width: 900px) {
    .bp-spotlight { grid-template-columns: 1fr; min-height: auto; }
    .bp-spotlight-copy { min-height: 240px; }
    .bp-spotlight-visual { aspect-ratio: 16/10; }
    .bp-bento > * { grid-column: 1 / -1 !important; grid-row: auto !important; }
    .bp-bento-card.bp-bento-hero .bp-bento-preview,
    .bp-bento-card.bp-bento-tall .bp-bento-preview { min-height: 140px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .bp-spotlight-slide, .bp-spotlight-visual-inner, .bp-reveal, .bp-bento-card, .bp-logo-dot {
      animation: none !important; transition: none !important;
    }
    .bp-spotlight-slide { opacity: 1; transform: none; position: relative; }
    .bp-spotlight-slide:not(.active) { display: none; }
    .bp-spotlight-visual-inner { opacity: 1; transform: none; position: relative; }
    .bp-spotlight-visual-inner:not(.active) { display: none; }
    .bp-reveal { opacity: 1; transform: none; }
  }
`

function ProductPreview({ type, accentColor }) {
  const style = { '--_accent': accentColor }

  switch (type) {
    case 'data-dashboard':
      return (
        <div className="bp-mock" style={style}>
          <div className="bp-mock-pills">
            {['英超', '西甲', '意甲'].map(l => <span key={l} className="bp-mock-pill">{l}</span>)}
          </div>
          <div className="bp-mock-bar accent" />
          <div className="bp-mock-bar" style={{ width: '80%' }} />
          <div className="bp-mock-bar" style={{ width: '45%' }} />
          <div className="bp-mock-chart">
            {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
              <div key={i} className="bp-mock-col" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      )
    case 'ai-text':
      return (
        <div className="bp-mock" style={style}>
          <div className="bp-mock-text-before">首先，我们需要明确一点。其次，值得注意的是……</div>
          <div className="bp-mock-text-after">说白了，核心就一件事——把 AI 味去掉，像人写的。</div>
          <div className="bp-mock-bar accent" style={{ marginTop: 'auto' }} />
        </div>
      )
    case 'book-reader':
      return (
        <div className="bp-mock bp-mock-books" style={style}>
          <div className="bp-mock-book">
            {[100, 80, 90, 60].map((w, i) => (
              <div key={i} className="bp-mock-book-line" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="bp-mock-book">
            {[70, 100, 85].map((w, i) => (
              <div key={i} className="bp-mock-book-line" style={{ width: `${w}%`, background: i === 0 ? `color-mix(in srgb, ${accentColor} 40%, transparent)` : undefined }} />
            ))}
          </div>
        </div>
      )
    case 'lottery-balls':
      return (
        <div className="bp-mock bp-mock-balls" style={style}>
          {['03', '12', '18', '25', '33'].map(n => <div key={n} className="bp-mock-ball">{n}</div>)}
          {['07', '11'].map(n => <div key={n} className="bp-mock-ball blue">{n}</div>)}
        </div>
      )
    case 'vote-poll':
      return (
        <div className="bp-mock" style={style}>
          {[{ l: '主胜', p: 62 }, { l: '平局', p: 23 }, { l: '客胜', p: 15 }].map(r => (
            <div key={r.l} className="bp-mock-poll-row">
              <span className="bp-mock-poll-label">{r.l}</span>
              <div className="bp-mock-poll-track"><div className="bp-mock-poll-fill" style={{ width: `${r.p}%` }} /></div>
              <span className="bp-mock-poll-pct">{r.p}%</span>
            </div>
          ))}
        </div>
      )
    case 'job-search':
      return (
        <div className="bp-mock" style={style}>
          <div className="bp-mock-pills">
            {['武汉', '本科', '行政'].map(t => <span key={t} className="bp-mock-pill">{t}</span>)}
          </div>
          {['湖北省直机关 · 综合管理', '武汉市江岸区 · 文秘岗'].map(j => (
            <div key={j} className="bp-mock-job-row">
              <div>
                <div className="bp-mock-job-title">{j}</div>
                <div className="bp-mock-job-meta">匹配度 92%</div>
              </div>
            </div>
          ))}
        </div>
      )
    default:
      return null
  }
}

function BentoCard({ product }) {
  const bentoClass = `bp-bento-${product.bento || 'normal'}`
  return (
    <a
      href={product.href}
      className={`bp-bento-card ${bentoClass} bp-reveal`}
      style={{ '--_accent': product.accentColor }}
    >
      <div className="bp-bento-preview">
        <ProductPreview type={product.preview} accentColor={product.accentColor} />
      </div>
      <div className="bp-bento-body">
        <div className="bp-bento-name">
          {product.title}
          <span className="bp-bento-en">{product.subtitle}</span>
        </div>
        <div className="bp-bento-tagline">{product.tagline}</div>
        <div className="bp-bento-foot">
          <div className="bp-bento-status"><span className="bp-dot" />{product.status}</div>
          <div className="bp-bento-arrow">→</div>
        </div>
      </div>
    </a>
  )
}

export default function PortalPage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  const current = SPOTLIGHT_PRODUCTS[activeSlide]

  usePageMeta({
    title: 'Blake Pierce — 独立开发者 / 数据爱好者',
    description:
      '个人产品门户：逻辑透镜、典萃 ClassiCore、净言 AI Cleaner、我中奖了吗、上岸雷达、私域粉丝投票。',
    keywords: 'Blake Pierce,廖莽,LogicLens,数据实验室,典萃,ClassiCore,净言,我中奖了吗,大乐透,双色球,上岸雷达,私域粉丝投票',
  })

  const nextSlide = useCallback(() => {
    setActiveSlide(i => (i + 1) % SPOTLIGHT_PRODUCTS.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(nextSlide, 5500)
    return () => clearInterval(timer)
  }, [paused, nextSlide])

  useEffect(() => {
    const els = document.querySelectorAll('.bp-reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('bp-visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{STYLES}</style>

      <div className="bp-wrap" style={{ '--_accent': current?.accentColor }}>

        <header className="bp-nav">
          <div className="bp-nav-inner">
            <a href="/" className="bp-logo">
              <span className="bp-logo-dot" />
              Blake Pierce
            </a>
            <ul className="bp-nav-links">
              <li><a href="#products">产品</a></li>
              <li><a href="#about">关于</a></li>
            </ul>
          </div>
        </header>

        {/* SPOTLIGHT HERO */}
        <section
          className="bp-spotlight"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="bp-spotlight-copy">
            {SPOTLIGHT_PRODUCTS.map((p, i) => (
              <div
                key={p.id}
                className={`bp-spotlight-slide${i === activeSlide ? ' active' : ''}`}
                style={{ '--_accent': p.accentColor }}
              >
                <div className="bp-sp-eyebrow">{p.status}</div>
                <h1 className="bp-sp-title">{p.title}</h1>
                <div className="bp-sp-subtitle">{p.subtitle}</div>
                <p className="bp-sp-tagline">{p.tagline}</p>
                <a href={p.href} className="bp-sp-cta">立即体验 →</a>
                <div className="bp-sp-dots">
                  {SPOTLIGHT_PRODUCTS.map((_, di) => (
                    <button
                      key={di}
                      type="button"
                      className={`bp-sp-dot${di === activeSlide ? ' active' : ''}`}
                      style={{ '--_accent': SPOTLIGHT_PRODUCTS[di].accentColor }}
                      aria-label={`切换到 ${SPOTLIGHT_PRODUCTS[di].title}`}
                      onClick={() => setActiveSlide(di)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bp-spotlight-visual" style={{ '--_accent': current?.accentColor }}>
            {SPOTLIGHT_PRODUCTS.map((p, i) => (
              <div
                key={p.id}
                className={`bp-spotlight-visual-inner${i === activeSlide ? ' active' : ''}`}
                style={{ '--_accent': p.accentColor }}
              >
                <ProductPreview type={p.preview} accentColor={p.accentColor} />
              </div>
            ))}
          </div>
        </section>

        {/* MANIFESTO */}
        <div className="bp-manifesto bp-reveal">
          <p className="bp-manifesto-text">
            6 个工具，1 个目标：<br />让数据和技术，<em>真正有用</em>
          </p>
        </div>

        {/* BENTO PRODUCTS */}
        <main id="products" className="bp-section" style={{ scrollMarginTop: '72px' }}>
          <div className="bp-sec-label bp-reveal">全部产品</div>
          <div className="bp-bento">
            {PRODUCTS.map(p => <BentoCard key={p.id} product={p} />)}
          </div>
        </main>

        {/* ABOUT */}
        <section id="about" className="bp-about bp-reveal" style={{ scrollMarginTop: '72px' }}>
          <div className="bp-about-avatar">BP</div>
          <div className="bp-about-name">Blake Pierce</div>
          <div className="bp-about-role">独立开发者 · 数据爱好者</div>
          <p className="bp-about-bio">
            热衷于用数据、机器学习和 AI 技术，构建能够解决实际问题的工具。
            目前维护 6 款产品，覆盖体育数据分析、AI 阅读与写作、考公岗位匹配、私域运营等领域。
          </p>
          <div className="bp-about-tags">
            {['体育数据', 'AI 写作', '考公工具', '私域运营', '内容创作', '彩票查询'].map(c => (
              <span key={c} className="bp-about-tag">{c}</span>
            ))}
          </div>
          <p className="bp-about-note">
            本平台所有数据仅供学习交流参考，不构成任何形式的建议或决策依据。
          </p>
        </section>

        <div className="bp-footer-wrap">
          <footer className="bp-footer">
            <div className="bp-footer-l">
              <span>© {new Date().getFullYear()} Blake Pierce</span>
              <span>本平台为个人项目，所有数据仅供学习交流参考。</span>
            </div>
            <div className="bp-footer-r">
              <a href="/terms">用户协议</a>
              <span style={{ color: 'var(--bp-muted)', fontSize: 10 }}>·</span>
              <a href="/privacy">隐私政策</a>
              <span style={{ color: 'var(--bp-muted)', fontSize: 10 }}>·</span>
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                鄂ICP备2026022715号
              </a>
            </div>
          </footer>
        </div>

      </div>
    </>
  )
}
