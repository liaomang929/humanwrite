import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import ProductCTA from '../components/ProductCTA'

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
      setProgress(el.currentTime / el.duration)
      setCurrentTime(el.currentTime)
      setDuration(el.duration || 0)
      setIsPlaying(!el.paused)
    }
    el.addEventListener('timeupdate', update)
    el.addEventListener('loadedmetadata', () => setDuration(el.duration || 0))
    el.addEventListener('play', () => setIsPlaying(true))
    el.addEventListener('pause', () => setIsPlaying(false))
    return () => {
      el.removeEventListener('timeupdate', update)
      el.removeEventListener('loadedmetadata', () => setDuration(el.duration || 0))
      el.removeEventListener('play', () => setIsPlaying(true))
      el.removeEventListener('pause', () => setIsPlaying(false))
    }
  }, [])

  const togglePlay = () => {
    const el = videoRef.current
    if (!el) return
    el.paused ? el.play() : el.pause()
  }

  const handleVideoClick = () => {
    setShowControls((v) => !v)
    togglePlay()
  }

  const formatTime = (s) => {
    if (!s || !isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#080c16',
                }}
              >
                B
              </div>
              <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>
                Blake Pierce
              </span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              返回首页
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-12 pb-20">
        {/* Title */}
        <div className="mb-8">
          <div className="section-overline">ClassiCore</div>
          <h1 className="section-title" style={{ fontSize: 24 }}>典萃【自媒体拆书工具】 — 产品演示</h1>
          <p className="section-subtitle">深度解构每一本好书 · 让知识成为你的创作源力</p>
        </div>

        {/* Video Player */}
        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer"
          style={{
            background: '#000',
            border: '0.5px solid var(--border)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            aspectRatio: '16/9',
          }}
          onClick={handleVideoClick}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            style={{ background: '#000' }}
            playsInline
            preload="auto"
          >
            <source src="/2222.mp4" type="video/mp4" />
            您的浏览器不支持视频播放
          </video>

          {/* Overlay play button when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              >
                <svg className="w-7 h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          {/* Bottom controls bar */}
          <div
            className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-3 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              opacity: showControls ? 1 : 0,
            }}
          >
            <button onClick={(e) => { e.stopPropagation(); togglePlay() }} className="text-white shrink-0">
              {isPlaying ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Progress bar */}
            <div
              className="flex-1 h-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              onClick={(e) => {
                e.stopPropagation()
                const el = videoRef.current
                if (!el) return
                const rect = e.currentTarget.getBoundingClientRect()
                const pct = (e.clientX - rect.left) / rect.width
                el.currentTime = pct * el.duration
              }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${progress * 100}%`, background: 'var(--gold)' }}
              />
            </div>

            <span className="text-xs text-white/70 font-mono shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>📄 PDF 拆解</div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>上传书籍自动提取核心脉络</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>🧠 知识胶囊</div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>原文精讲 + 现代解读，吃透每本书</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>📱 多平台脚本</div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>一分钟生成文案、语音脚本与视频拍摄方案</p>
          </div>
        </div>

        {/* ═══ SaaS 入口区块 ═══ */}
        <div
          className="mt-10 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(78,207,179,0.08) 0%, rgba(56,189,248,0.06) 100%)',
            border: '1px solid rgba(78,207,179,0.25)',
            position: 'relative',
          }}
        >
          {/* 顶部光晕装饰 */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(78,207,179,0.6), transparent)',
          }} />

          <div className="px-6 sm:px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* 左侧文案 */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* 图标 */}
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: 'rgba(78,207,179,0.15)',
                border: '1px solid rgba(78,207,179,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                🚀
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                    正式版已上线，立即体验
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: '#4ecfb3', background: 'rgba(78,207,179,0.15)',
                    border: '1px solid rgba(78,207,179,0.3)',
                    padding: '2px 8px', borderRadius: 100,
                  }}>
                    SaaS · 对外开放
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  典萃拆书 SaaS 版现已开放，上传 PDF 即可自动拆解，生成多平台创作脚本。
                </p>
              </div>
            </div>

            {/* 右侧按钮 */}
            <a
              href="http://8.163.73.185:5073"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 24px',
                background: 'rgba(78,207,179,0.18)',
                border: '1px solid rgba(78,207,179,0.45)',
                borderRadius: 100,
                color: '#4ecfb3',
                fontSize: 14, fontWeight: 600,
                textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(78,207,179,0.28)'
                e.currentTarget.style.borderColor = 'rgba(78,207,179,0.7)'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(78,207,179,0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(78,207,179,0.18)'
                e.currentTarget.style.borderColor = 'rgba(78,207,179,0.45)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              进入产品
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <ProductCTA productName="典萃【自媒体拆书工具】" note="「典萃拆书」" />
        </div>
      </div>
    </div>
  )
}
