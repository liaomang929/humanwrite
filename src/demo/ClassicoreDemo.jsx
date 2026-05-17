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
            <source src="/11.mp4" type="video/mp4" />
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

        {/* Description */}
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

        {/* CTA */}
        <div className="mt-12">
          <ProductCTA productName="典萃【自媒体拆书工具】" note="「典萃拆书」" />
        </div>
      </div>
    </div>
  )
}
