import { usePageMeta } from '../hooks/usePageMeta'

const PRODUCTS = [
  {
    id: 'logiclens',
    title: '逻辑透镜',
    subtitle: 'LogicLens',
    tagline: '基于机器学习的数据分析研究',
    description:
      '基于历史赛事数据与机器学习模型的个人数据分析项目。覆盖五大联赛，每日更新，数据公开透明。',
    tags: ['随机森林', '逻辑回归', '神经网络'],
    href: '/lab',
    accentColor: '#7c6ef0',
    status: '每日更新',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2.5" />
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
  },
  {
    id: 'jczq',
    title: '私域粉丝投票',
    subtitle: 'Fans Vote',
    tagline: '比赛分享和私域投票',
    description:
      '比赛分享和私域投票数据收集，了解粉丝热度与倾向，帮助运营者掌握受众真实态度。',
    tags: ['粉丝投票', '市场方向', '赛事热度'],
    href: '/demo/fansvote',
    accentColor: '#f0876c',
    status: '实时更新',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
        <path d="M7 3l-1 4 4-1" />
        <path d="M17 3l1 4-4-1" />
      </svg>
    ),
  },
  {
    id: 'classicore',
    title: '典萃【自媒体拆书】',
    subtitle: 'ClassiCore',
    tagline: '深度解构每一本好书 · 让知识成为你的创作源力',
    description:
      'AI 深度阅读伴侣。上传 PDF 自动拆解，生成知识胶囊，一键输出多平台创作脚本。',
    tags: ['知识胶囊', '深度拆解'],
    href: '/demo/classicore',
    accentColor: '#4ecfb3',
    status: '可用',
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
      'AI 文本润色工具。一键优化表达，去 AI 味，让内容更自然流畅，适合社交场景传播。',
    tags: ['AI润色', '文案优化', '免费使用'],
    href: '/demo/aicleaner',
    accentColor: '#f0c46c',
    status: '免费可用',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l2.5 7.5L22 13l-7.5 2.5L12 23l-2.5-7.5L2 13l7.5-2.5z" />
      </svg>
    ),
  },
  {
    id: 'shangan',
    title: '上岸雷达',
    subtitle: 'Gongkao Radar',
    tagline: '考公岗位智能匹配工具',
    description:
      '公务员考试岗位智能匹配与信息查询。精准筛选目标岗位，提升备考效率，让备考更有方向感。',
    tags: ['考公', '岗位匹配', '信息查询'],
    href: '/kg',
    accentColor: '#6cb4f0',
    status: '持续更新',
    featured: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.5 6.5L21 11l-6.5 3L12 22l-2.5-8L3 11l6.5-2.5z" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    ),
  },
]

const CATEGORIES = [
  {
    id: 'data',
    num: '01',
    title: '数据分析',
    tag: 'Data',
    description: '数据驱动决策，洞察比赛与趋势',
    productIds: ['logiclens', 'jczq'],
  },
  {
    id: 'tools',
    num: '02',
    title: '工具类',
    tag: 'Tools',
    description: '提升内容创作与信息处理效率',
    productIds: ['classicore', 'aicleaner'],
  },
  {
    id: 'exam',
    num: '03',
    title: '考公考编考研',
    tag: 'Utility',
    description: '精准匹配目标岗位，高效备考',
    productIds: ['shangan'],
  },
]

/* ─── Styles injected once ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  :root {
    --bp-bg:        #0a0a0f;
    --bp-card:      #111118;
    --bp-card-h:    #16161f;
    --bp-surface:   #0e0e17;
    --bp-primary:   #f0eeff;
    --bp-secondary: #8b85a8;
    --bp-muted:     #4a4666;
    --bp-accent:    #7c6ef0;
    --bp-teal:      #4ecfb3;
    --bp-warm:      #f0876c;
    --bp-amber:     #f0c46c;
    --bp-border:    rgba(255,255,255,0.07);
    --bp-border-h:  rgba(255,255,255,0.13);
    --bp-r-sm: 10px;
    --bp-r-md: 16px;
    --bp-r-lg: 24px;
    --bp-display: 'Syne', sans-serif;
    --bp-body:    'DM Sans', sans-serif;
  }

  .bp-wrap { font-family: var(--bp-body); background: var(--bp-bg); min-height: 100vh; color: var(--bp-primary); -webkit-font-smoothing: antialiased; position: relative; overflow-x: hidden; }

  /* background glow */
  .bp-wrap::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 80% 55% at 72% -8%,  rgba(124,110,240,.11) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 8% 82%,   rgba(78,207,179,.06)  0%, transparent 50%);
  }
  .bp-wrap > * { position: relative; z-index: 1; }

  /* nav */
  .bp-nav {
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    background: rgba(10,10,15,.85);
    border-bottom: 1px solid var(--bp-border);
  }
  .bp-nav-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 clamp(1.25rem,4vw,3.5rem);
    height: 64px; display: flex; align-items: center; justify-content: space-between;
  }
  .bp-logo {
    display: flex; align-items: center; gap: 9px;
    text-decoration: none; font-family: var(--bp-display);
    font-size: 17px; font-weight: 700; letter-spacing: -.02em; color: var(--bp-primary);
  }
  .bp-logo-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--bp-accent); flex-shrink: 0;
  }
  .bp-nav-links { display: flex; gap: 1.75rem; list-style: none; margin: 0; padding: 0; }
  .bp-nav-links a {
    color: var(--bp-secondary); text-decoration: none; font-size: 14px;
    transition: color .2s;
  }
  .bp-nav-links a:hover { color: var(--bp-primary); }

  /* hero */
  .bp-hero {
    max-width: 1200px; margin: 0 auto;
    padding: clamp(4rem,11vw,8.5rem) clamp(1.25rem,4vw,3.5rem) clamp(3rem,7vw,6rem);
  }
  .bp-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase;
    color: var(--bp-accent); margin-bottom: 1.4rem;
  }
  .bp-eyebrow::before { content:''; display:inline-block; width:20px; height:1px; background:var(--bp-accent); }
  .bp-h1 {
    font-family: var(--bp-display); font-size: clamp(2.6rem,6.5vw,5rem);
    font-weight: 800; line-height: 1.03; letter-spacing: -.04em;
    color: var(--bp-primary); margin-bottom: 1.4rem; max-width: 760px;
  }
  .bp-h1 em { font-style: normal; color: transparent; -webkit-text-stroke: 1.5px rgba(240,235,255,.32); }
  .bp-sub {
    font-size: clamp(.95rem,1.8vw,1.1rem); color: var(--bp-secondary);
    max-width: 500px; line-height: 1.8; font-weight: 300; margin-bottom: 2.25rem;
  }
  .bp-actions { display: flex; gap: .875rem; flex-wrap: wrap; }
  .bp-btn-p {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 11px 22px; background: var(--bp-accent); color: #fff;
    text-decoration: none; font-size: 13.5px; font-weight: 500;
    border-radius: 100px; border: none; cursor: pointer;
    transition: background .2s, transform .2s, box-shadow .2s;
  }
  .bp-btn-p:hover { background: #8f82f5; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(124,110,240,.3); }
  .bp-btn-g {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 11px 22px; background: transparent; color: var(--bp-secondary);
    text-decoration: none; font-size: 13.5px; font-weight: 400;
    border-radius: 100px; border: 1px solid var(--bp-border-h); cursor: pointer;
    transition: color .2s, border-color .2s;
  }
  .bp-btn-g:hover { color: var(--bp-primary); border-color: rgba(255,255,255,.24); }

  /* stats */
  .bp-stats {
    max-width: 1200px; margin: 0 auto;
    padding: 1.75rem clamp(1.25rem,4vw,3.5rem) clamp(2rem,5vw,4rem);
    border-top: 1px solid var(--bp-border);
    display: flex; gap: 2.25rem; flex-wrap: wrap;
  }
  .bp-stat-num { font-family: var(--bp-display); font-size: 1.75rem; font-weight: 700; letter-spacing: -.03em; line-height: 1; color: var(--bp-primary); }
  .bp-stat-lbl { font-size: 11.5px; color: var(--bp-muted); margin-top: 2px; }
  .bp-stat-div { width: 1px; background: var(--bp-border); align-self: stretch; }

  /* section */
  .bp-section { max-width: 1200px; margin: 0 auto; padding: clamp(2.5rem,5vw,4.5rem) clamp(1.25rem,4vw,3.5rem); }
  .bp-sec-hdr {
    display: flex; align-items: baseline; gap: .875rem;
    margin-bottom: 1.75rem; padding-bottom: 1.1rem;
    border-bottom: 1px solid var(--bp-border);
  }
  .bp-sec-num { font-family: var(--bp-display); font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--bp-muted); flex-shrink: 0; }
  .bp-sec-tg { flex: 1; }
  .bp-sec-title { font-family: var(--bp-display); font-size: 1.15rem; font-weight: 700; letter-spacing: -.02em; color: var(--bp-primary); margin-bottom: 1px; }
  .bp-sec-desc { font-size: 12.5px; color: var(--bp-muted); }
  .bp-sec-tag {
    font-size: 10.5px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
    color: var(--bp-accent); border: 1px solid rgba(124,110,240,.28);
    padding: 3px 9px; border-radius: 100px; flex-shrink: 0;
  }

  /* grid */
  .bp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px,1fr)); gap: 14px; }

  /* card */
  .bp-card {
    background: var(--bp-card); border: 1px solid var(--bp-border);
    border-radius: var(--bp-r-lg); padding: 1.6rem;
    display: flex; flex-direction: column; gap: .875rem;
    text-decoration: none; color: inherit;
    transition: background .3s, border-color .3s, transform .3s, box-shadow .3s;
    position: relative; overflow: hidden; cursor: pointer;
  }
  .bp-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--_accent, var(--bp-accent)), transparent);
    opacity: 0; transition: opacity .3s;
  }
  .bp-card:hover { background: var(--bp-card-h); border-color: var(--bp-border-h); transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,0,0,.38); }
  .bp-card:hover::before { opacity: 1; }

  /* featured card */
  .bp-card.bp-featured {
    grid-column: 1 / -1;
    display: grid; grid-template-columns: 1fr auto;
    gap: 2rem; align-items: center;
  }
  .bp-featured-icon-lg {
    width: 96px; height: 96px; border-radius: 24px;
    display: flex; align-items: center; justify-content: center;
    font-size: 42px; flex-shrink: 0;
    border: 1px solid rgba(255,255,255,.06);
  }

  /* card internals */
  .bp-card-hdr { display: flex; align-items: flex-start; gap: 13px; }
  .bp-icon {
    width: 46px; height: 46px; border-radius: 13px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(255,255,255,.06);
  }
  .bp-icon svg { width: 20px; height: 20px; }
  .bp-card-name {
    font-family: var(--bp-display); font-size: 1rem; font-weight: 700;
    letter-spacing: -.02em; color: var(--bp-primary);
    display: flex; align-items: center; gap: 7px; flex-wrap: wrap; margin-bottom: 2px;
  }
  .bp-card-en { font-family: var(--bp-display); font-size: .7rem; font-weight: 500; letter-spacing: .05em; text-transform: uppercase; color: var(--bp-muted); }
  .bp-card-tagline { font-size: 12.5px; color: var(--bp-secondary); font-weight: 300; }
  .bp-card-desc { font-size: 13px; color: var(--bp-secondary); line-height: 1.65; flex: 1; }
  .bp-tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .bp-tag { font-size: 10.5px; font-weight: 500; padding: 3px 9px; border-radius: 100px; border: 1px solid var(--bp-border-h); color: var(--bp-muted); }
  .bp-card-foot {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: auto; padding-top: .7rem; border-top: 1px solid var(--bp-border);
  }
  .bp-status { font-size: 11px; color: var(--bp-muted); display: flex; align-items: center; gap: 5px; }
  .bp-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--bp-teal); }
  .bp-cta { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 500; color: var(--bp-secondary); transition: color .2s; }
  .bp-card:hover .bp-cta { color: var(--bp-primary); }
  .bp-arrow {
    display: inline-flex; align-items: center; justify-content: center;
    width: 23px; height: 23px; border-radius: 50%; background: var(--bp-border-h);
    transition: background .25s, transform .25s; font-size: 12px;
  }
  .bp-card:hover .bp-arrow { background: var(--bp-accent); color: #fff; transform: translateX(2px); }

  /* about */
  .bp-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.75rem; align-items: start; }
  .bp-about-card, .bp-skills-card {
    background: var(--bp-card); border: 1px solid var(--bp-border);
    border-radius: var(--bp-r-lg); padding: 1.85rem;
    display: flex; flex-direction: column; gap: 1.1rem;
  }
  .bp-avatar {
    width: 52px; height: 52px; border-radius: 15px;
    background: rgba(124,110,240,.18); border: 1px solid rgba(124,110,240,.28);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--bp-display); font-size: 1.1rem; font-weight: 700; color: var(--bp-accent);
  }
  .bp-about-name { font-family: var(--bp-display); font-size: 1.2rem; font-weight: 700; letter-spacing: -.02em; color: var(--bp-primary); margin-bottom: 2px; }
  .bp-about-role { font-size: 12.5px; color: var(--bp-muted); font-weight: 300; }
  .bp-about-bio { font-size: 13.5px; color: var(--bp-secondary); line-height: 1.8; font-weight: 300; }
  .bp-about-note { font-size: 11.5px; color: var(--bp-muted); border-left: 2px solid var(--bp-border-h); padding-left: 11px; font-style: italic; line-height: 1.6; }
  .bp-skills-title { font-size: 10.5px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--bp-muted); }
  .bp-skill-row { display: flex; align-items: center; gap: 11px; }
  .bp-skill-lbl { font-size: 12.5px; color: var(--bp-secondary); width: 80px; flex-shrink: 0; }
  .bp-track { flex: 1; height: 3px; background: var(--bp-border); border-radius: 2px; overflow: hidden; }
  .bp-fill { height: 100%; border-radius: 2px; }
  .bp-covers { display: flex; flex-wrap: wrap; gap: 7px; margin-top: .25rem; }
  .bp-cover-tag { font-size: 11.5px; padding: 4px 11px; border: 1px solid var(--bp-border-h); border-radius: 100px; color: var(--bp-secondary); }

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

  /* animations */
  @keyframes bp-up { from { opacity:0; transform: translateY(18px) } to { opacity:1; transform: translateY(0) } }
  .bp-hero > * { animation: bp-up .7s cubic-bezier(.23,1,.32,1) both; }
  .bp-hero > *:nth-child(1){animation-delay:.05s}
  .bp-hero > *:nth-child(2){animation-delay:.12s}
  .bp-hero > *:nth-child(3){animation-delay:.2s}
  .bp-hero > *:nth-child(4){animation-delay:.28s}

  @media (max-width: 760px) {
    .bp-card.bp-featured { grid-template-columns: 1fr; }
    .bp-featured-icon-lg { display: none; }
    .bp-about-grid { grid-template-columns: 1fr; }
    .bp-stat-div { display: none; }
  }
  @media (max-width: 500px) {
    .bp-grid { grid-template-columns: 1fr; }
  }
`

function ProductCard({ product }) {
  const iconBg = `${product.accentColor}22`
  const iconColor = product.accentColor

  if (product.featured) {
    return (
      <a
        href={product.href}
        className="bp-card bp-featured"
        style={{ '--_accent': product.accentColor }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div className="bp-card-hdr">
            <div className="bp-icon" style={{ background: iconBg, color: iconColor }}>
              {product.icon}
            </div>
            <div>
              <div className="bp-card-name">
                {product.title}
                <span className="bp-card-en">{product.subtitle}</span>
              </div>
              <div className="bp-card-tagline">{product.tagline}</div>
            </div>
          </div>
          <p className="bp-card-desc">{product.description}</p>
          <div className="bp-tags">
            {product.tags.map(t => <span key={t} className="bp-tag">{t}</span>)}
          </div>
          <div className="bp-card-foot">
            <div className="bp-status"><span className="bp-dot" />{product.status}</div>
            <div className="bp-cta">进入 <span className="bp-arrow">→</span></div>
          </div>
        </div>
        <div className="bp-featured-icon-lg" style={{ background: iconBg, color: iconColor }}>
          {product.icon && (
            <span style={{ transform: 'scale(2.2)', display: 'block' }}>{product.icon}</span>
          )}
        </div>
      </a>
    )
  }

  return (
    <a
      href={product.href}
      className="bp-card"
      style={{ '--_accent': product.accentColor }}
    >
      <div className="bp-card-hdr">
        <div className="bp-icon" style={{ background: iconBg, color: iconColor }}>
          {product.icon}
        </div>
        <div>
          <div className="bp-card-name">
            {product.title}
            <span className="bp-card-en">{product.subtitle}</span>
          </div>
          <div className="bp-card-tagline">{product.tagline}</div>
        </div>
      </div>
      <p className="bp-card-desc">{product.description}</p>
      <div className="bp-tags">
        {product.tags.map(t => <span key={t} className="bp-tag">{t}</span>)}
      </div>
      <div className="bp-card-foot">
        <div className="bp-status"><span className="bp-dot" />{product.status}</div>
        <div className="bp-cta">进入 <span className="bp-arrow">→</span></div>
      </div>
    </a>
  )
}

export default function PortalPage() {
  usePageMeta({
    title: 'Blake Pierce — 独立开发者 / 数据爱好者',
    description:
      '个人产品门户：逻辑透镜、典萃 ClassiCore、净言 AI Cleaner、上岸雷达、私域粉丝投票。',
    keywords: 'Blake Pierce,廖莽,LogicLens,数据实验室,典萃,ClassiCore,净言,上岸雷达,私域粉丝投票',
  })

  return (
    <>
      <style>{STYLES}</style>

      <div className="bp-wrap">

        {/* NAV */}
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

        {/* HERO */}
        <section className="bp-hero">
          <div className="bp-eyebrow">独立开发者 · 数据爱好者</div>
          <h1 className="bp-h1">
            用数据和技术，<br />构建<em>真正有用</em>的工具
          </h1>
          <p className="bp-sub">
            覆盖体育数据分析、AI 内容创作、公务员备考、私域运营等领域。
            所有项目均为个人兴趣驱动，保持对技术的好奇心。
          </p>
          <div className="bp-actions">
            <a href="#products" className="bp-btn-p">查看所有产品 →</a>
            <a href="#about" className="bp-btn-g">了解我</a>
          </div>
        </section>

        {/* STATS */}
        <div className="bp-stats">
          {[
            { num: '5', lbl: '在线产品' },
            { num: '5+', lbl: '覆盖领域' },
            { num: '每日', lbl: '数据更新' },
            { num: '开放', lbl: '数据透明' },
          ].map((s, i, arr) => (
            <>
              <div key={s.lbl}>
                <div className="bp-stat-num">{s.num}</div>
                <div className="bp-stat-lbl">{s.lbl}</div>
              </div>
              {i < arr.length - 1 && <div key={`d${i}`} className="bp-stat-div" />}
            </>
          ))}
        </div>

        {/* PRODUCTS */}
        <main id="products" className="bp-section" style={{ scrollMarginTop: '80px' }}>
          {CATEGORIES.map((cat, ci) => (
            <div key={cat.id} style={{ marginBottom: ci < CATEGORIES.length - 1 ? '3rem' : 0 }}>
              <div className="bp-sec-hdr">
                <span className="bp-sec-num">{cat.num}</span>
                <div className="bp-sec-tg">
                  <div className="bp-sec-title">{cat.title}</div>
                  <div className="bp-sec-desc">{cat.description}</div>
                </div>
                <span className="bp-sec-tag">{cat.tag}</span>
              </div>

              <div className="bp-grid">
                {PRODUCTS
                  .filter(p => cat.productIds.includes(p.id))
                  .map(p => <ProductCard key={p.id} product={p} />)
                }
              </div>
            </div>
          ))}
        </main>

        {/* ABOUT */}
        <section id="about" className="bp-section" style={{ scrollMarginTop: '80px' }}>
          <div className="bp-sec-hdr">
            <span className="bp-sec-num">—</span>
            <div className="bp-sec-tg">
              <div className="bp-sec-title">关于</div>
            </div>
            <span className="bp-sec-tag">About</span>
          </div>

          <div className="bp-about-grid">
            <div className="bp-about-card">
              <div className="bp-avatar">BP</div>
              <div>
                <div className="bp-about-name">Blake Pierce</div>
                <div className="bp-about-role">独立开发者 · 数据爱好者</div>
              </div>
              <p className="bp-about-bio">
                热衷于用数据、机器学习和人工智能技术，构建能够解决实际问题的工具和产品。
                目前维护的产品覆盖了体育数据分析、AI 阅读与写作、考公岗位匹配、私域粉丝投票等领域。
              </p>
              <p className="bp-about-bio">所有项目均为个人兴趣驱动，保持对技术的好奇心。</p>
              <p className="bp-about-note">
                本平台所有数据仅供学习交流参考，不构成任何形式的建议或决策依据。
              </p>
            </div>

            <div className="bp-skills-card">
              <div className="bp-skills-title">技术方向</div>
              {[
                { lbl: '机器学习', pct: 88, color: '#7c6ef0' },
                { lbl: '数据分析', pct: 92, color: '#4ecfb3' },
                { lbl: 'AI 应用',  pct: 80, color: '#f0876c' },
                { lbl: '全栈开发', pct: 75, color: '#f0c46c' },
              ].map(s => (
                <div key={s.lbl} className="bp-skill-row">
                  <span className="bp-skill-lbl">{s.lbl}</span>
                  <div className="bp-track">
                    <div className="bp-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--bp-border)' }}>
                <div className="bp-skills-title" style={{ marginBottom: '.65rem' }}>产品覆盖</div>
                <div className="bp-covers">
                  {['体育数据', 'AI 写作', '考公工具', '私域运营', '内容创作'].map(c => (
                    <span key={c} className="bp-cover-tag">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
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
