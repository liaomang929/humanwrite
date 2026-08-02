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
    key: 'kuaishou',
    label: '快手',
    copyId: '3855839273',
    tooltip: '快手 ID：3855839273',
  },
  {
    key: 'qq',
    label: 'QQ',
    copyId: '68419964',
    tooltip: 'QQ：68419964',
  },
]

const ANALYST_STATS = {
  recent: { wins: 3, total: 5, profit: '+1.8', label: '近5场推荐' },
  model: { rate: '72%', label: '赛季综合准确率', extra: '基于逻辑透镜模型' },
}

const LOTTERY_IMAGES = [
  '/images/lottery-1.jpg',
  '/images/lottery-2.jpg',
  '/images/lottery-3.jpg',
  '/images/lottery-4.jpg',
]

/* ── Styles ─────────────────────────────────────────────── */

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
  }
  .bp-wrap > * { position: relative; z-index: 1; }

  /* ── nav ── */
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
    transition: color .2s; cursor: pointer;
  }
  .bp-nav-links a:hover { color: var(--bp-primary); }

  @media (max-width: 500px) {
    .bp-nav-links.desktop { display: none; }
  }

  /* ── hero ── */
  .bp-hero {
    min-height: 100vh;
    max-width: 1200px; margin: 0 auto;
    display: flex; flex-direction: column; justify-content: center;
    padding: calc(56px + clamp(1.5rem, 3vw, 2.5rem)) clamp(1.25rem,4vw,3.5rem);
  }

  .bp-hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(1.5rem, 4vw, 3rem);
    align-items: center;
  }

  .bp-hero-copy {
    display: flex; flex-direction: column; justify-content: center;
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
    margin-bottom: 1rem;
  }

  .bp-hero-bio {
    font-size: 14px;
    color: var(--bp-secondary);
    line-height: 1.7;
    max-width: 440px;
    font-weight: 300;
    margin-bottom: 1.5rem;
  }

  .bp-social-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 1.5rem;
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

  .bp-hero-visual {
    position: relative; aspect-ratio: 4/3; border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--bp-border);
    background: var(--bp-card);
  }
  .bp-hero-visual::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 60% at 50% 30%, rgba(124,110,240,.18), transparent);
    z-index: 1;
  }
  .bp-hero-visual-inner {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem;
    z-index: 2;
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
  .bp-nav { animation: bp-up .6s var(--bp-ease) both; }

  /* ── responsive ── */
  @media (max-width: 900px) {
    .bp-hero-grid { grid-template-columns: 1fr; }
    .bp-hero-visual { aspect-ratio: 16/10; min-height: 200px; }
    .bp-carousel { max-height: 70vh; }
  }

  @media (max-width: 600px) {
    .bp-stats-grid { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .bp-reveal, .bp-logo-dot {
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

function DataDashboardPreview() {
  return (
    <div className="bp-mock" style={{ width: '100%', height: '100%', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="bp-mock-pills" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {['英超', '西甲', '意甲'].map(l => (
          <span key={l} style={{ fontSize: '9px', padding: '3px 8px', borderRadius: '100px', background: 'rgba(255,255,255,.06)', color: 'var(--bp-secondary)' }}>{l}</span>
        ))}
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(124,110,240,.5)', width: '60%' }} />
      <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,.08)', width: '80%' }} />
      <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,.08)', width: '45%' }} />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px', marginTop: 'auto' }}>
        {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
          <div key={i} style={{ flex: 1, borderRadius: '4px 4px 0 0', background: 'rgba(124,110,240,.3)', height: `${h}%` }} />
        ))}
      </div>
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

        <header className="bp-nav">
          <div className="bp-nav-inner">
            <a href="/" className="bp-logo">
              <span className="bp-logo-dot" />
              Blake Pierce
            </a>
            <ul className="bp-nav-links desktop">
              <li><a href="#stats">战绩</a></li>
              <li><a href="#about">联系</a></li>
            </ul>
          </div>
        </header>

        {/* ═══ 第一屏：HERO ═══ */}
        <section className="bp-hero">
          <div className="bp-hero-grid">
            <div className="bp-hero-copy">
              <div className="bp-hero-eyebrow">足球数据分析师 / 独立工作室</div>
              <h1 className="bp-hero-name">Blake Pierce</h1>
              <div className="bp-hero-subname">一包华子</div>
              <p className="bp-hero-tagline">用数据看懂比赛，用逻辑解读机构意图。</p>
              <div className="bp-hero-divider" />
              <p className="bp-hero-bio">
                分析足球比赛，也写代码做数据产品。
                用机器学习解读比赛，用实战验证判断。
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

              <a href="/lab" className="bp-hero-cta">
                探索逻辑透镜 →
              </a>
            </div>

            <div className="bp-hero-visual">
              <div className="bp-hero-visual-inner">
                <DataDashboardPreview />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 第二屏：战绩展示 ═══ */}
        <section id="stats" className="bp-section" style={{ scrollMarginTop: '72px' }}>
          <div className="bp-sec-label bp-reveal">战绩展示</div>

          <div className="bp-stats-grid bp-reveal">
            <div className="bp-stat-card">
              <div className="bp-stat-eyebrow">{ANALYST_STATS.recent.label}</div>
              <div className="bp-stat-num green">
                {ANALYST_STATS.recent.wins}/{ANALYST_STATS.recent.total}
              </div>
              <div className="bp-stat-label">
                {ANALYST_STATS.recent.profit} 净赢
              </div>
            </div>
            <div className="bp-stat-card">
              <div className="bp-stat-eyebrow">数据模型</div>
              <div className="bp-stat-num accent">{ANALYST_STATS.model.rate}</div>
              <div className="bp-stat-label">{ANALYST_STATS.model.label}</div>
              <div className="bp-stat-sub">{ANALYST_STATS.model.extra}</div>
            </div>
          </div>

          <div className="bp-reveal">
            <LotteryCarousel images={LOTTERY_IMAGES} />
          </div>

          {/* ── 我中奖了吗 工具入口 ── */}
          <a href="/lottery/" className="bp-lottery-tool bp-reveal" target="_self">
            <div className="bp-lt-icon">🎰</div>
            <div className="bp-lt-body">
              <div className="bp-lt-title">我中奖了吗？</div>
              <div className="bp-lt-desc">录入彩票号码，一键查询双色球 / 大乐透开奖结果</div>
            </div>
            <div className="bp-lt-arrow">→</div>
          </a>

        </section>

        {/* ═══ 第三屏：关于 / 联系 ═══ */}
        <section id="about" className="bp-about-wrap bp-reveal" style={{ scrollMarginTop: '72px' }}>
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
            <div className="bp-about-item" onClick={() => handleCopy('3855839273')}>
              <span className="bp-about-item-label">🎬</span>
              <span className="bp-about-item-value">3855839273</span>
              <span style={{ color: 'var(--bp-muted)', fontSize: '11px', marginLeft: 'auto' }}>快手</span>
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
