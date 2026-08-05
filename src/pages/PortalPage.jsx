import { useEffect, useState, useCallback } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'

/* ── Config ──────────────────────────────────────────────── */

const SOCIAL_LINKS = [
  {
    key: 'wechat',
    label: '微信',
    copyId: 'lmloveac',
    tooltip: '微信号：lmloveac',
    primary: true,
  },
  {
    key: 'qq',
    label: 'QQ',
    copyId: '68419964',
    tooltip: 'QQ：68419964',
  },
]

/* 数据源：藏宝图（/xianyu/）战绩记录模板 · 统计截至 2026-08-04 */
const ANALYST_STATS = {
  single: {
    label: '单场战绩',
    total: 17,
    hits: 13,
    rate: '76.5%',
    streak: '连红 1 场',
  },
  parlay: {
    label: '二串一战绩',
    total: 17,
    hits: 10,
    rate: '58.8%',
    streak: '连红 1 单',
  },
}

/* 产品矩阵：与全局导航一致，featured 卡占 Bento 大格 */
const PRODUCTS = [
  {
    key: 'odds',
    name: '足球当铺',
    tagline: '每日二串一工作台',
    desc: '亚盘拆盘，单场 + 二串一实盘记录，盘口思路每日更新。',
    href: '/odds/',
    emoji: '⚽',
    accent: '#4ecfb3',
    featured: true,
  },
  {
    key: 'lottery',
    name: '财富密码',
    tagline: '开奖速查',
    desc: '录入号码，一键查询双色球 / 大乐透开奖结果。',
    href: '/lottery/',
    emoji: '🎰',
    accent: '#d4af37',
  },
  {
    key: 'xianyu',
    name: '藏宝图',
    tagline: '战绩归档',
    desc: '单场 / 2串1 战绩记录与流量打法沉淀。',
    href: '/xianyu/',
    emoji: '🗺️',
    accent: '#5dade2',
  },
]

const LOTTERY_IMAGES = [
  '/images/lottery-1.jpg',
  '/images/lottery-2.jpg',
  '/images/lottery-3.jpg',
  '/images/lottery-4.jpg',
]

/* ── Styles ─────────────────────────────────────────────── */

const STYLES = `
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
  }
  .bp-wrap > * { position: relative; z-index: 1; }

  /* ── hero ── */
  .bp-hero {
    min-height: calc(100vh - 48px);
    max-width: 1200px; margin: 0 auto;
    display: flex; flex-direction: column; justify-content: center;
    padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1.25rem,4vw,3.5rem);
  }

  .bp-hero-copy {
    display: flex; flex-direction: column; justify-content: center;
    align-items: center; text-align: center;
  }

  .bp-hero-eyebrow {
    font-size: clamp(11px, 1.2vw, 12px);
    font-weight: 500; letter-spacing: .14em; text-transform: uppercase;
    color: var(--bp-accent); margin-bottom: 1.2rem;
  }

  .bp-hero-name {
    font-family: var(--bp-display);
    font-size: clamp(1.8rem,5vw,3.5rem);
    font-weight: 800; line-height: 1.1; letter-spacing: -.035em;
    margin-bottom: .2rem;
  }

  .bp-hero-subname {
    font-size: clamp(1.6rem, 4vw, 2.8rem);
    font-weight: 600;
    color: var(--bp-primary);
    margin-bottom: .7rem;
    letter-spacing: .04em;
  }

  .bp-hero-tagline {
    font-size: clamp(1rem,2vw,1.2rem);
    color: var(--bp-secondary);
    font-weight: 300; line-height: 1.6; margin-bottom: 1.5rem;
    max-width: 420px;
  }

  .bp-hero-divider {
    width: 32px; height: 2px;
    background: var(--bp-accent);
    border-radius: 2px;
    margin: 0 auto 1rem;
  }

  .bp-hero-bio {
    font-size: 14px;
    color: var(--bp-secondary);
    line-height: 1.7;
    max-width: 440px;
    font-weight: 300;
    margin: 0 auto 1.5rem;
  }

  .bp-social-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 1.5rem;
    justify-content: center;
  }

  .bp-social-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 8px 16px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    color: var(--bp-primary);
    text-decoration: none;
    background: rgba(255,255,255,.06);
    border: 1px solid var(--bp-border);
    transition: all .25s var(--bp-ease);
    cursor: pointer;
  }
  .bp-social-btn:hover {
    background: rgba(255,255,255,.1);
    border-color: var(--bp-border-h);
    transform: translateY(-1px);
  }
  .bp-social-btn.primary {
    background: rgba(124,110,240,.15);
    border-color: rgba(124,110,240,.3);
    color: var(--bp-accent);
  }
  .bp-social-btn.primary:hover {
    background: rgba(124,110,240,.25);
    border-color: rgba(124,110,240,.4);
  }

  .bp-hero-cta {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 26px; background: var(--bp-accent); color: #fff;
    text-decoration: none; font-size: 14px; font-weight: 500;
    border-radius: 100px;
    transition: transform .25s, box-shadow .25s;
    border: none; cursor: pointer; align-self: flex-start;
  }
  .bp-hero-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(124,110,240,.35);
  }

  /* ── products bento ── */
  .bp-products {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    grid-template-rows: repeat(2, 1fr);
    gap: 12px;
  }
  .bp-pcard {
    display: flex; flex-direction: column; justify-content: space-between; gap: 1.1rem;
    padding: 1.5rem 1.6rem;
    border-radius: 22px;
    background: var(--bp-card);
    border: 1px solid var(--bp-border);
    text-decoration: none; color: var(--bp-primary);
    overflow: hidden;
    transition: border-color .35s, transform .35s var(--bp-ease), box-shadow .35s;
  }
  .bp-pcard:hover {
    border-color: var(--bp-border-h);
    transform: translateY(-2px);
    box-shadow: 0 18px 44px rgba(0,0,0,.32);
  }
  .bp-pcard-feature { grid-row: span 2; }
  .bp-pc-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
  .bp-pc-icon {
    width: 50px; height: 50px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; flex-shrink: 0;
  }
  .bp-pc-badge {
    font-size: 10px; letter-spacing: .1em; text-transform: uppercase;
    color: var(--bp-muted); border: 1px solid var(--bp-border);
    padding: 4px 10px; border-radius: 100px; white-space: nowrap;
  }
  .bp-pc-body { min-width: 0; }
  .bp-pc-name {
    font-family: var(--bp-display);
    font-size: clamp(1.15rem, 2.4vw, 1.45rem);
    font-weight: 700; letter-spacing: -.02em; line-height: 1.2;
  }
  .bp-pc-tagline {
    font-size: 12.5px; font-weight: 500; margin-top: 3px; letter-spacing: .02em;
  }
  .bp-pc-desc {
    font-size: 13px; color: var(--bp-secondary); font-weight: 300;
    line-height: 1.65; margin-top: 10px; max-width: 340px;
  }
  .bp-pc-cta {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 500; color: var(--bp-accent); margin-top: auto;
  }
  .bp-pc-cta .arr { transition: transform .25s var(--bp-ease); }
  .bp-pcard:hover .bp-pc-cta .arr { transform: translateX(4px); }

  @media (max-width: 720px) {
    .bp-products { grid-template-columns: 1fr; }
    .bp-pcard-feature { grid-row: auto; }
    .bp-pcard { padding: 1.25rem 1.35rem; }
  }

  /* ── section ── */
  .bp-section {
    max-width: 1200px; margin: 0 auto;
    padding: clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,3.5rem);
  }
  .bp-sec-label {
    font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
    color: var(--bp-muted); margin-bottom: 1.5rem;
  }

  /* ── stats ── */
  .bp-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 1.5rem;
  }

  .bp-stat-card {
    background: var(--bp-card);
    border: 1px solid var(--bp-border);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    transition: border-color .35s;
  }

  .bp-stat-eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--bp-muted);
    margin-bottom: 4px;
  }
  .bp-stat-num {
    font-family: var(--bp-display);
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -.03em;
    line-height: 1;
    margin-bottom: 2px;
    color: var(--bp-primary);
  }
  .bp-stat-num.accent { color: var(--bp-accent); }
  .bp-stat-num.green { color: #4ecfb3; }
  .bp-stat-label {
    font-size: 12px;
    color: var(--bp-secondary);
    font-weight: 400;
  }
  .bp-stat-sub {
    font-size: 10.5px;
    color: var(--bp-muted);
    margin-top: 2px;
  }

  /* ── lottery carousel ── */
  .bp-carousel {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    background: var(--bp-card);
    border: 1px solid var(--bp-border);
    margin-bottom: 1.5rem;
    aspect-ratio: 3/4;
    max-height: 70vh;
  }

  .bp-carousel-slide {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    opacity: 0;
    transition: opacity .8s var(--bp-ease);
  }
  .bp-carousel-slide.active { opacity: 1; }

  .bp-carousel-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
  }

  .bp-carousel-dots {
    position: absolute;
    bottom: 16px; left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 10;
  }
  .bp-carousel-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: rgba(255,255,255,.25);
    border: none; cursor: pointer; padding: 0;
    transition: background .3s, transform .3s;
  }
  .bp-carousel-dot.active {
    background: #fff;
    transform: scale(1.3);
  }

  /* ── 我中奖了吗 工具卡 ── */
  .bp-lottery-tool {
    display: flex; align-items: center; gap: 1.25rem;
    padding: 1.25rem 1.5rem;
    background: linear-gradient(135deg, rgba(212,175,55,.10), rgba(212,175,55,.04));
    border: 1px solid rgba(212,175,55,.25);
    border-radius: 18px;
    text-decoration: none;
    transition: all .3s var(--bp-ease);
    margin-bottom: 1.5rem;
    position: relative; overflow: hidden;
  }
  .bp-lottery-tool:hover {
    background: linear-gradient(135deg, rgba(212,175,55,.15), rgba(212,175,55,.06));
    border-color: rgba(212,175,55,.4);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(212,175,55,.12);
  }
  .bp-lottery-tool::before {
    content: ''; position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,175,55,.5), transparent);
  }
  .bp-lt-icon {
    flex-shrink: 0;
    width: 48px; height: 48px; border-radius: 14px;
    background: linear-gradient(135deg, #E8C84A, #C9991A);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: #1A1200;
    box-shadow: 0 4px 16px rgba(212,175,55,.25);
  }
  .bp-lt-body { flex: 1; min-width: 0; }
  .bp-lt-title {
    font-family: var(--bp-display);
    font-size: 16px; font-weight: 700;
    color: var(--bp-primary); letter-spacing: .02em;
    margin-bottom: 2px;
  }
  .bp-lt-desc {
    font-size: 12px; color: var(--bp-secondary);
    font-weight: 300;
  }
  .bp-lt-arrow {
    flex-shrink: 0;
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(212,175,55,.12);
    display: flex; align-items: center; justify-content: center;
    color: #D4AF37;
    font-size: 16px;
    transition: transform .25s var(--bp-ease);
  }
  .bp-lottery-tool:hover .bp-lt-arrow {
    transform: translateX(4px);
  }

  /* ── about ── */
  .bp-about-wrap {
    max-width: 600px; margin: 0 auto; text-align: center;
    padding: clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,3.5rem) clamp(2rem,4vw,3rem);
  }
  .bp-about-avatar {
    width: 56px; height: 56px; border-radius: 16px; margin: 0 auto 1rem;
    background: rgba(124,110,240,.15); border: 1px solid rgba(124,110,240,.25);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--bp-display); font-size: 1.2rem; font-weight: 700; color: var(--bp-accent);
  }
  .bp-about-name {
    font-family: var(--bp-display); font-size: 1.3rem; font-weight: 700;
    letter-spacing: -.02em; margin-bottom: 2px;
  }
  .bp-about-role {
    font-size: 13px; color: var(--bp-muted); margin-bottom: .75rem;
  }
  .bp-about-bio {
    font-size: 13.5px; color: var(--bp-secondary); line-height: 1.75;
    font-weight: 300; max-width: 480px; margin: 0 auto 1.25rem;
  }

  .bp-about-list {
    display: flex; flex-direction: column; gap: 8px;
    max-width: 360px; margin: 0 auto;
  }
  .bp-about-item {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 18px;
    border-radius: 12px;
    background: var(--bp-card);
    border: 1px solid var(--bp-border);
    font-size: 13px;
    color: var(--bp-primary);
    cursor: pointer;
    transition: border-color .25s;
  }
  .bp-about-item:hover {
    border-color: var(--bp-border-h);
  }
  .bp-about-item-label {
    color: var(--bp-muted);
    min-width: 32px;
  }
  .bp-about-item-value {
    font-weight: 500;
    font-family: 'DM Mono', 'DM Sans', monospace;
    color: var(--bp-secondary);
  }

  /* ── footer ── */
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

  /* ── scroll reveal ── */
  .bp-reveal {
    opacity: 0; transform: translateY(28px);
    transition: opacity .8s var(--bp-ease), transform .8s var(--bp-ease);
  }
  .bp-reveal.bp-visible { opacity: 1; transform: translateY(0); }

  /* ── animations ── */
  @keyframes bp-pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--bp-accent); }
    50% { opacity: .7; box-shadow: 0 0 16px var(--bp-accent); }
  }
  @keyframes bp-up { from { opacity:0; transform: translateY(18px) } to { opacity:1; transform: translateY(0) } }

  /* ── responsive ── */
  @media (max-width: 900px) {
    .bp-carousel { max-height: 70vh; }
  }

  @media (max-width: 600px) {
    .bp-stats-grid { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .bp-reveal {
      animation: none !important; transition: none !important;
    }
    .bp-reveal { opacity: 1; transform: none; }
  }
`

/* ── Components ─────────────────────────────────────────── */

function CopyToast({ show }) {
  if (!show) return null
  return (
    <div
      style={{
        position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 200, padding: '10px 20px', borderRadius: '100px',
        background: 'rgba(17,17,24,.95)', border: '1px solid rgba(255,255,255,.1)',
        color: '#f0eeff', fontSize: '13px', fontWeight: 500,
        backdropFilter: 'blur(12px)',
        animation: 'bp-up .3s var(--bp-ease) both',
      }}
    >
      ✅ 已复制
    </div>
  )
}

function LotteryCarousel({ images }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setActive(i => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (paused || images.length <= 1) return
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [paused, next, images.length])

  if (!images.length) return null

  return (
    <div
      className="bp-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <div key={i} className={`bp-carousel-slide${i === active ? ' active' : ''}`}>
          <img
            src={src}
            alt={`中奖实票 ${i + 1}`}
            className="bp-carousel-img"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
      {images.length > 1 && (
        <div className="bp-carousel-dots">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`bp-carousel-dot${i === active ? ' active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`第 ${i + 1} 张`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */

export default function PortalPage() {
  const [copied, setCopied] = useState(false)

  usePageMeta({
    title: 'Blake Pierce — 足球数据分析师 / 独立开发者',
    description:
      'Blake Pierce 的个人主页。足球比赛数据分析、AI 工具开发。用数据看懂比赛，用技术创造工具。',
    keywords:
      'Blake Pierce,廖莽,足球分析,足球预测,逻辑透镜,LogicLens,五大联赛预测,体育数据',
  })

  useEffect(() => {
    const els = document.querySelectorAll('.bp-reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('bp-visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 1800)
      return () => clearTimeout(t)
    }
  }, [copied])

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(() => setCopied(true))
  }

  return (
    <>
      <style>{STYLES}</style>

      <div className="bp-wrap">

        {/* ═══ 第一屏：HERO ═══ */}
        <section className="bp-hero">
          <div className="bp-hero-copy">
            <div className="bp-hero-eyebrow">足球数据分析师 / 独立工作室</div>
            <div className="bp-hero-subname">一包华子</div>
            <p className="bp-hero-tagline">用数据看懂比赛，用逻辑解读机构意图。</p>
            <div className="bp-hero-divider" />
            <p className="bp-hero-bio">
              一句话献给你！
              <br />
              看懂盘口之前，先学会克制自己。
              <br />
              足球比赛不是用来证明你多聪明的，而是考验你——何时该上，何时该退。
            </p>

            <div className="bp-social-row">
              {SOCIAL_LINKS.map(s => (
                <button
                  key={s.key}
                  className={`bp-social-btn${s.primary ? ' primary' : ''}`}
                  onClick={() => handleCopy(s.copyId)}
                  title={s.tooltip}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 产品区：Bento ═══ */}
        <section className="bp-section bp-reveal">
          <div className="bp-sec-label bp-reveal">我的产品</div>
          <div className="bp-products">
            {PRODUCTS.map(p => (
              <a
                key={p.key}
                href={p.href}
                className={`bp-pcard${p.featured ? ' bp-pcard-feature' : ''}`}
                style={{
                  background: `radial-gradient(120% 110% at 15% 0%, ${p.accent}16, transparent 55%), var(--bp-card)`,
                }}
              >
                <div className="bp-pc-top">
                  <span
                    className="bp-pc-icon"
                    style={{ background: `${p.accent}1f`, color: p.accent }}
                  >
                    {p.emoji}
                  </span>
                  {p.featured && <span className="bp-pc-badge">每日更新</span>}
                </div>
                <div className="bp-pc-body">
                  <div className="bp-pc-name">{p.name}</div>
                  <div className="bp-pc-tagline" style={{ color: p.accent }}>{p.tagline}</div>
                  <div className="bp-pc-desc">{p.desc}</div>
                </div>
                <span className="bp-pc-cta">
                  进入
                  <span className="arr">→</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ═══ 第二屏：战绩展示 ═══ */}
        <section id="stats" className="bp-section" style={{ scrollMarginTop: '64px' }}>
          <div className="bp-sec-label bp-reveal">战绩展示</div>

          <div className="bp-stats-grid bp-reveal">
            <div className="bp-stat-card">
              <div className="bp-stat-eyebrow">{ANALYST_STATS.single.label}</div>
              <div className="bp-stat-num green">{ANALYST_STATS.single.rate}</div>
              <div className="bp-stat-label">
                {ANALYST_STATS.single.total} 场 · 命中 {ANALYST_STATS.single.hits} 场
              </div>
              <div className="bp-stat-sub">{ANALYST_STATS.single.streak}</div>
            </div>
            <div className="bp-stat-card">
              <div className="bp-stat-eyebrow">{ANALYST_STATS.parlay.label}</div>
              <div className="bp-stat-num accent">{ANALYST_STATS.parlay.rate}</div>
              <div className="bp-stat-label">
                {ANALYST_STATS.parlay.total} 单 · 红单 {ANALYST_STATS.parlay.hits} 单
              </div>
              <div className="bp-stat-sub">{ANALYST_STATS.parlay.streak}</div>
            </div>
          </div>

          <div className="bp-reveal">
            <LotteryCarousel images={LOTTERY_IMAGES} />
          </div>

        </section>

        {/* ═══ 第三屏：关于 / 联系 ═══ */}
        <section id="about" className="bp-about-wrap bp-reveal" style={{ scrollMarginTop: '64px' }}>
          <div className="bp-about-avatar">BP</div>
          <div className="bp-about-name">Blake Pierce</div>
          <div className="bp-about-role">足球数据分析师 · 独立开发者</div>
          <p className="bp-about-bio">
            分析比赛，也做数据产品。如果你对足球分析感兴趣，欢迎联系。
          </p>

          <div className="bp-about-list">
            <div className="bp-about-item" onClick={() => handleCopy('lmloveac')}>
              <span className="bp-about-item-label">💬</span>
              <span className="bp-about-item-value">lmloveac</span>
              <span style={{ color: 'var(--bp-muted)', fontSize: '11px', marginLeft: 'auto' }}>微信</span>
            </div>
            <div className="bp-about-item" onClick={() => handleCopy('68419964')}>
              <span className="bp-about-item-label">💎</span>
              <span className="bp-about-item-value">68419964</span>
              <span style={{ color: 'var(--bp-muted)', fontSize: '11px', marginLeft: 'auto' }}>QQ</span>
            </div>
          </div>
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
              <span style={{ color: 'var(--bp-muted)', fontSize: 10 }}>·</span>
              <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=42011102006235" target="_blank" rel="noopener noreferrer">
                鄂公网安备42011102006235号
              </a>
            </div>
          </footer>
        </div>

        <CopyToast show={copied} />

      </div>
    </>
  )
}
