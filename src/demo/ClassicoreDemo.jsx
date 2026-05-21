import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import ProductCTA from '../components/ProductCTA'

const ACCENT = '#4ecfb3'
const PRODUCT_URL = 'http://8.163.73.185:5073'

const FEATURES = [
  {
    id: 'pdf',
    bento: 'hero',
    icon: '📄',
    title: 'PDF 拆解',
    desc: '上传书籍自动提取核心脉络',
    preview: 'pdf',
  },
  {
    id: 'capsule',
    bento: 'normal',
    icon: '🧠',
    title: '知识胶囊',
    desc: '原文精讲 + 现代解读，吃透每本书',
    preview: 'capsule',
  },
  {
    id: 'script',
    bento: 'normal',
    icon: '📱',
    title: '多平台脚本',
    desc: '一分钟生成文案、语音脚本与视频拍摄方案',
    preview: 'script',
  },
]

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  :root {
    --cc-bg: #0a0a0f;
    --cc-card: #111118;
    --cc-card-h: #16161f;
    --cc-primary: #f0eeff;
    --cc-secondary: #8b85a8;
    --cc-muted: #4a4666;
    --cc-accent: ${ACCENT};
    --cc-border: rgba(255,255,255,0.07);
    --cc-border-h: rgba(255,255,255,0.13);
    --cc-display: 'Syne', sans-serif;
    --cc-body: 'DM Sans', sans-serif;
    --cc-ease: cubic-bezier(.23,1,.32,1);
  }

  .cc-wrap {
    font-family: var(--cc-body);
    background: var(--cc-bg);
    min-height: 100vh;
    color: var(--cc-primary);
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow-x: hidden;
  }
  .cc-wrap::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 70% 50% at 80% -5%, rgba(78,207,179,.1) 0%, transparent 55%),
      radial-gradient(ellipse 45% 35% at 5% 90%, rgba(124,110,240,.05) 0%, transparent 50%);
  }
  .cc-wrap > * { position: relative; z-index: 1; }

  /* nav */
  .cc-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    background: rgba(10,10,15,.78);
    border-bottom: 1px solid var(--cc-border);
  }
  .cc-nav-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 0 clamp(1.25rem,4vw,2.5rem);
    height: 56px; display: flex; align-items: center; justify-content: space-between;
  }
  .cc-nav-left { display: flex; align-items: center; gap: 1rem; }
  .cc-site-logo {
    display: flex; align-items: center; gap: 9px;
    text-decoration: none; font-family: var(--cc-display);
    font-size: 16px; font-weight: 700; letter-spacing: -.02em; color: var(--cc-primary);
  }
  .cc-site-dot {
    width: 7px; height: 7px; border-radius: 50%; background: var(--cc-accent);
    box-shadow: 0 0 10px rgba(78,207,179,.4);
  }
  .cc-nav-div { width: 1px; height: 16px; background: var(--cc-border-h); }
  .cc-product-name { font-size: 13px; color: var(--cc-secondary); font-weight: 400; }
  .cc-nav-cta {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 13px; font-weight: 500; color: var(--cc-secondary);
    text-decoration: none; padding: 6px 14px; border-radius: 8px;
    border: 1px solid var(--cc-border);
    background: transparent;
    transition: color .2s, border-color .2s, background .2s;
    white-space: nowrap; flex-shrink: 0;
  }
  .cc-nav-cta:hover {
    color: var(--cc-primary);
    border-color: var(--cc-border-h);
    background: rgba(255,255,255,.04);
  }
  .cc-nav-cta svg { width: 13px; height: 13px; opacity: .55; transition: opacity .2s, transform .2s; }
  .cc-nav-cta:hover svg { opacity: .9; transform: translate(1px, -1px); }

  /* hero */
  .cc-hero {
    max-width: 1100px; margin: 0 auto;
    padding: calc(56px + clamp(3rem,8vw,5.5rem)) clamp(1.25rem,4vw,2.5rem) clamp(2rem,4vw,3rem);
    text-align: center;
  }
  .cc-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase;
    color: var(--cc-accent); margin-bottom: 1.2rem;
  }
  .cc-eyebrow::before { content:''; width:20px; height:1px; background:var(--cc-accent); }
  .cc-h1 {
    font-family: var(--cc-display);
    font-size: clamp(1.75rem, 4.2vw, 3.2rem);
    font-weight: 800; line-height: 1.08; letter-spacing: -.04em;
    margin-bottom: 1rem; max-width: 900px; margin-left: auto; margin-right: auto;
    display: flex; align-items: baseline; justify-content: center;
    flex-wrap: nowrap; gap: .1em;
    white-space: nowrap;
  }
  .cc-h1-tag {
    font-size: .46em; font-weight: 600; letter-spacing: -.01em;
    color: var(--cc-secondary); flex-shrink: 1;
  }
  .cc-h1 em { font-style: normal; color: var(--cc-accent); flex-shrink: 0; }
  .cc-sub {
    font-size: clamp(.95rem,1.8vw,1.1rem); color: var(--cc-secondary);
    font-weight: 300; line-height: 1.75; max-width: 520px;
    margin: 0 auto;
  }

  /* manifesto */
  .cc-manifesto {
    max-width: 1100px; margin: 0 auto;
    padding: 0 clamp(1.25rem,4vw,2.5rem) clamp(2.5rem,5vw,4rem);
    text-align: center;
  }
  .cc-manifesto-text {
    font-family: var(--cc-display);
    font-size: clamp(1.1rem,2.5vw,1.5rem);
    font-weight: 600; letter-spacing: -.02em; line-height: 1.45;
    color: var(--cc-secondary);
  }
  .cc-manifesto-text strong { color: var(--cc-primary); font-weight: 700; }

  /* video */
  .cc-video-section {
    max-width: 1100px; margin: 0 auto;
    padding: 0 clamp(1.25rem,4vw,2.5rem) clamp(3rem,6vw,5rem);
  }
  .cc-video-label {
    font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
    color: var(--cc-muted); margin-bottom: 1rem; text-align: center;
  }
  .cc-video-wrap {
    position: relative; border-radius: 24px; overflow: hidden; cursor: pointer;
    background: #000; border: 1px solid var(--cc-border);
    box-shadow: 0 24px 64px rgba(0,0,0,.45), 0 0 0 1px rgba(78,207,179,.06);
    aspect-ratio: 16/9;
    transition: box-shadow .4s, transform .4s var(--cc-ease);
  }
  .cc-video-wrap:hover {
    box-shadow: 0 32px 80px rgba(0,0,0,.5), 0 0 48px rgba(78,207,179,.08);
    transform: translateY(-2px);
  }
  .cc-video-wrap video { width: 100%; height: 100%; object-fit: contain; background: #000; display: block; }
  .cc-play-overlay {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,.15); transition: background .3s;
  }
  .cc-play-btn {
    width: 72px; height: 72px; border-radius: 50%;
    background: rgba(255,255,255,.12); backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,.2);
    display: flex; align-items: center; justify-content: center;
    transition: transform .3s var(--cc-ease), background .3s;
  }
  .cc-video-wrap:hover .cc-play-btn { transform: scale(1.06); background: rgba(78,207,179,.2); }
  .cc-play-btn svg { width: 28px; height: 28px; color: #fff; margin-left: 4px; }
  .cc-controls {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 1rem 1.25rem;
    background: linear-gradient(transparent, rgba(0,0,0,.75));
    display: flex; align-items: center; gap: .75rem;
    transition: opacity .3s;
  }
  .cc-ctrl-btn {
    background: none; border: none; cursor: pointer; color: #fff;
    padding: 0; display: flex; align-items: center; flex-shrink: 0;
  }
  .cc-ctrl-btn svg { width: 20px; height: 20px; }
  .cc-progress {
    flex: 1; height: 4px; border-radius: 2px;
    background: rgba(255,255,255,.2); cursor: pointer;
  }
  .cc-progress-fill {
    height: 100%; border-radius: 2px; background: var(--cc-accent);
    transition: width .1s linear;
  }
  .cc-time {
    font-size: 11px; color: rgba(255,255,255,.65);
    font-family: 'DM Mono', monospace; flex-shrink: 0;
  }

  /* bento features */
  .cc-section {
    max-width: 1100px; margin: 0 auto;
    padding: clamp(2rem,5vw,4rem) clamp(1.25rem,4vw,2.5rem);
  }
  .cc-sec-label {
    font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
    color: var(--cc-muted); margin-bottom: 1.5rem;
  }
  .cc-bento {
    display: grid; grid-template-columns: repeat(12, 1fr); gap: 14px;
  }
  .cc-bento-hero { grid-column: span 8; }
  .cc-bento-normal { grid-column: span 4; }

  .cc-feat {
    background: var(--cc-card); border: 1px solid var(--cc-border);
    border-radius: 20px; overflow: hidden;
    transition: border-color .35s, transform .35s var(--cc-ease), box-shadow .35s;
  }
  .cc-feat:hover {
    border-color: var(--cc-border-h);
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0,0,0,.35);
  }
  .cc-feat-preview {
    min-height: 100px; padding: 1.25rem;
    background: linear-gradient(160deg, rgba(78,207,179,.1), var(--cc-card));
    border-bottom: 1px solid var(--cc-border);
  }
  .cc-feat.cc-bento-hero .cc-feat-preview { min-height: 140px; }
  .cc-feat-body { padding: 1.25rem 1.4rem 1.5rem; }
  .cc-feat-icon { font-size: 1.4rem; margin-bottom: .5rem; }
  .cc-feat-title {
    font-family: var(--cc-display); font-size: 1rem; font-weight: 700;
    letter-spacing: -.02em; margin-bottom: .35rem;
  }
  .cc-feat-desc { font-size: 13px; color: var(--cc-secondary); line-height: 1.65; font-weight: 300; }

  /* preview mockups */
  .cc-mock-pdf { display: flex; gap: 10px; height: 100%; align-items: stretch; }
  .cc-mock-page {
    flex: 1; border-radius: 10px; border: 1px solid rgba(255,255,255,.08);
    background: rgba(255,255,255,.03); padding: 12px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .cc-mock-line { height: 4px; border-radius: 2px; background: rgba(255,255,255,.08); }
  .cc-mock-line.accent { background: rgba(78,207,179,.35); }
  .cc-mock-capsule { display: flex; flex-direction: column; gap: 8px; }
  .cc-mock-block {
    padding: 10px 12px; border-radius: 10px;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.06);
    font-size: 10px; color: var(--cc-secondary); line-height: 1.5;
  }
  .cc-mock-block.hl { border-color: rgba(78,207,179,.25); color: var(--cc-primary); }
  .cc-mock-platforms { display: flex; flex-direction: column; gap: 6px; }
  .cc-mock-plat {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; border-radius: 8px;
    background: rgba(255,255,255,.04); font-size: 10px; color: var(--cc-secondary);
  }
  .cc-mock-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cc-accent); flex-shrink: 0; }

  /* saas CTA */
  .cc-saas {
    max-width: 1100px; margin: 0 auto;
    padding: 0 clamp(1.25rem,4vw,2.5rem) clamp(3rem,6vw,4rem);
  }
  .cc-saas-card {
    position: relative; border-radius: 24px; overflow: hidden;
    background: linear-gradient(135deg, rgba(78,207,179,.1) 0%, rgba(56,189,248,.06) 100%);
    border: 1px solid rgba(78,207,179,.22);
    padding: clamp(1.75rem,4vw,2.5rem);
    display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center;
  }
  .cc-saas-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(78,207,179,.5), transparent);
  }
  .cc-saas-inner { display: flex; align-items: flex-start; gap: 1rem; }
  .cc-saas-icon {
    width: 52px; height: 52px; border-radius: 16px; flex-shrink: 0;
    background: rgba(78,207,179,.15); border: 1px solid rgba(78,207,179,.3);
    display: flex; align-items: center; justify-content: center; font-size: 24px;
  }
  .cc-saas-title-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }
  .cc-saas-title { font-family: var(--cc-display); font-size: 1.15rem; font-weight: 700; letter-spacing: -.02em; }
  .cc-saas-tag {
    font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
    color: var(--cc-accent); background: rgba(78,207,179,.12);
    border: 1px solid rgba(78,207,179,.28); padding: 2px 9px; border-radius: 100px;
  }
  .cc-saas-desc { font-size: 13.5px; color: var(--cc-secondary); line-height: 1.7; font-weight: 300; margin: 0; }
  .cc-saas-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: 100px;
    background: rgba(78,207,179,.18); border: 1px solid rgba(78,207,179,.45);
    color: var(--cc-accent); font-size: 14px; font-weight: 600;
    text-decoration: none; white-space: nowrap; flex-shrink: 0;
    transition: background .25s, transform .25s, box-shadow .25s;
  }
  .cc-saas-btn:hover {
    background: rgba(78,207,179,.28);
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(78,207,179,.18);
  }
  .cc-saas-btn svg { width: 14px; height: 14px; }

  /* contact section */
  .cc-contact { max-width: 640px; margin: 0 auto; padding: 0 clamp(1.25rem,4vw,2.5rem) clamp(2rem,4vw,3rem); }

  /* footer */
  .cc-footer-wrap { border-top: 1px solid var(--cc-border); margin-top: 1rem; }
  .cc-footer {
    max-width: 1100px; margin: 0 auto;
    padding: 1.75rem clamp(1.25rem,4vw,2.5rem);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .875rem;
  }
  .cc-footer-l { font-size: 12px; color: var(--cc-muted); display: flex; flex-direction: column; gap: 3px; }
  .cc-footer-r { display: flex; align-items: center; gap: 1.1rem; flex-wrap: wrap; }
  .cc-footer-r a { font-size: 11.5px; color: var(--cc-muted); text-decoration: none; transition: color .2s; }
  .cc-footer-r a:hover { color: var(--cc-secondary); }

  /* scroll reveal */
  .cc-reveal {
    opacity: 0; transform: translateY(24px);
    transition: opacity .75s var(--cc-ease), transform .75s var(--cc-ease);
  }
  .cc-reveal.cc-visible { opacity: 1; transform: translateY(0); }

  @keyframes cc-up { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform: translateY(0) } }
  .cc-hero > * { animation: cc-up .65s var(--cc-ease) both; }
  .cc-hero > *:nth-child(1) { animation-delay: .04s; }
  .cc-hero > *:nth-child(2) { animation-delay: .1s; }
  .cc-hero > *:nth-child(3) { animation-delay: .16s; }

  @media (max-width: 900px) {
    .cc-bento > * { grid-column: 1 / -1 !important; }
    .cc-saas-card { grid-template-columns: 1fr; }
    .cc-saas-btn { justify-content: center; width: 100%; }
  }
  @media (max-width: 480px) {
    .cc-h1 { font-size: clamp(1.35rem, 5.5vw, 1.75rem); }
    .cc-h1-tag { font-size: .42em; }
  }

  @media (prefers-reduced-motion: reduce) {
    .cc-reveal, .cc-feat, .cc-video-wrap, .cc-hero > * { animation: none !important; transition: none !important; }
    .cc-reveal { opacity: 1; transform: none; }
  }
`

function FeaturePreview({ type }) {
  switch (type) {
    case 'pdf':
      return (
        <div className="cc-mock-pdf">
          <div className="cc-mock-page">
            {[100, 85, 92, 70, 88].map((w, i) => (
              <div key={i} className={`cc-mock-line${i === 1 ? ' accent' : ''}`} style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="cc-mock-page">
            {[60, 100, 75].map((w, i) => (
              <div key={i} className="cc-mock-line accent" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      )
    case 'capsule':
      return (
        <div className="cc-mock-capsule">
          <div className="cc-mock-block">原文：系统1的运行是无意识且快速的……</div>
          <div className="cc-mock-block hl">现代解读：双系统理论揭示了认知底层架构……</div>
        </div>
      )
    case 'script':
      return (
        <div className="cc-mock-platforms">
          {['小红书文案', '语音脚本', '视频拍摄方案'].map(p => (
            <div key={p} className="cc-mock-plat"><span className="cc-mock-dot" />{p}</div>
          ))}
        </div>
      )
    default:
      return null
  }
}

export default function ClassicoreDemo() {
  const videoRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)

  usePageMeta({
    title: '典萃 ClassiCore — 产品演示',
    description: '典萃 ClassiCore 深度阅读伴侣产品演示',
    keywords: '典萃,ClassiCore,拆书,演示',
  })

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const update = () => {
      setProgress(el.duration ? el.currentTime / el.duration : 0)
      setCurrentTime(el.currentTime)
      setDuration(el.duration || 0)
      setIsPlaying(!el.paused)
    }
    const onMeta = () => setDuration(el.duration || 0)
    el.addEventListener('timeupdate', update)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('play', () => setIsPlaying(true))
    el.addEventListener('pause', () => setIsPlaying(false))
    return () => {
      el.removeEventListener('timeupdate', update)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('play', () => setIsPlaying(true))
      el.removeEventListener('pause', () => setIsPlaying(false))
    }
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('.cc-reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('cc-visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const togglePlay = () => {
    const el = videoRef.current
    if (!el) return
    el.paused ? el.play() : el.pause()
  }

  const handleVideoClick = () => {
    setShowControls(v => !v)
    togglePlay()
  }

  const formatTime = (s) => {
    if (!s || !isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <>
      <style>{STYLES}</style>

      <div className="cc-wrap">

        <header className="cc-nav">
          <div className="cc-nav-inner">
            <div className="cc-nav-left">
              <Link to="/" className="cc-site-logo">
                <span className="cc-site-dot" />
                Blake Pierce
              </Link>
              <div className="cc-nav-div" />
              <span className="cc-product-name">ClassiCore</span>
            </div>
            <a
              href={PRODUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cc-nav-cta"
            >
              立即使用
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          </div>
        </header>

        {/* HERO */}
        <section className="cc-hero">
          <div className="cc-eyebrow">ClassiCore · 典萃</div>
          <h1 className="cc-h1">
            典萃<span className="cc-h1-tag">【自媒体拆书工具】</span><em>产品演示</em>
          </h1>
          <p className="cc-sub">
            解构每一本好书，让知识成为你的创作源力
          </p>
        </section>

        {/* MANIFESTO */}
        <div className="cc-manifesto cc-reveal">
          <p className="cc-manifesto-text">
            上传 PDF，<strong>自动拆解</strong> · 提炼<strong>核心主题</strong> · <strong>一键生成</strong>文字和语音脚本
          </p>
        </div>

        {/* VIDEO */}
        <section className="cc-video-section cc-reveal">
          <div className="cc-video-label">产品演示视频</div>
          <div
            className="cc-video-wrap"
            onClick={handleVideoClick}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            <video ref={videoRef} playsInline preload="auto">
              <source src="/2222.mp4" type="video/mp4" />
              您的浏览器不支持视频播放
            </video>

            {!isPlaying && (
              <div className="cc-play-overlay">
                <div className="cc-play-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}

            <div className="cc-controls" style={{ opacity: showControls ? 1 : 0 }}>
              <button type="button" className="cc-ctrl-btn" onClick={(e) => { e.stopPropagation(); togglePlay() }}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <div
                className="cc-progress"
                onClick={(e) => {
                  e.stopPropagation()
                  const el = videoRef.current
                  if (!el || !el.duration) return
                  const rect = e.currentTarget.getBoundingClientRect()
                  el.currentTime = ((e.clientX - rect.left) / rect.width) * el.duration
                }}
              >
                <div className="cc-progress-fill" style={{ width: `${progress * 100}%` }} />
              </div>
              <span className="cc-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
          </div>
        </section>

        {/* FEATURES BENTO */}
        <section className="cc-section">
          <div className="cc-sec-label cc-reveal">核心能力</div>
          <div className="cc-bento">
            {FEATURES.map(f => (
              <div key={f.id} className={`cc-feat cc-bento-${f.bento} cc-reveal`}>
                <div className="cc-feat-preview">
                  <FeaturePreview type={f.preview} />
                </div>
                <div className="cc-feat-body">
                  <div className="cc-feat-icon">{f.icon}</div>
                  <div className="cc-feat-title">{f.title}</div>
                  <p className="cc-feat-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SAAS CTA */}
        <section className="cc-saas cc-reveal">
          <div className="cc-saas-card">
            <div className="cc-saas-inner">
              <div className="cc-saas-icon">🚀</div>
              <div>
                <div className="cc-saas-title-row">
                  <span className="cc-saas-title">正式版已上线，立即体验</span>
                  <span className="cc-saas-tag">SaaS · 对外开放</span>
                </div>
                <p className="cc-saas-desc">
                  典萃拆书 SaaS 版现已开放，上传 PDF 即可自动拆解，生成多平台创作脚本。
                </p>
              </div>
            </div>
            <a
              href={PRODUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cc-saas-btn"
            >
              进入产品
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          </div>
        </section>

        {/* CONTACT CTA */}
        <div className="cc-contact cc-reveal">
          <ProductCTA productName="典萃【自媒体拆书工具】" note="「典萃拆书」" />
        </div>

        <div className="cc-footer-wrap">
          <footer className="cc-footer">
            <div className="cc-footer-l">
              <span>© {new Date().getFullYear()} Blake Pierce</span>
              <span>本平台为个人项目，所有数据仅供学习交流参考。</span>
            </div>
            <div className="cc-footer-r">
              <a href="/terms">用户协议</a>
              <span style={{ color: 'var(--cc-muted)', fontSize: 10 }}>·</span>
              <a href="/privacy">隐私政策</a>
              <span style={{ color: 'var(--cc-muted)', fontSize: 10 }}>·</span>
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                鄂ICP备2026022715号
              </a>
              <span style={{ color: 'var(--cc-muted)', fontSize: 10 }}>·</span>
              <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=42011102006235" target="_blank" rel="noopener noreferrer">
                鄂公网安备42011102006235号
              </a>
            </div>
          </footer>
        </div>

      </div>
    </>
  )
}
