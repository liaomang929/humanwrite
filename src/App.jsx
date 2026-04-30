import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { usePageMeta } from './hooks/usePageMeta'
import InsightDemo from './demo/InsightDemo'
import ClassicoreDemo from './demo/ClassicoreDemo'
import AiCleanerDemo from './demo/AiCleanerDemo'

const products = [
  {
    id: "insight",
    title: "球之见",
    subtitle: "The Insight",
    tagline: "让店主获客更有底气",
    tags: ["闭环逻辑", "资深专家方案", "分析师工具"],
    description:
      "专门为彩店店主、体育分析师打造的“带教式”分析管理工具。解决你的三大痛点：分析没思路、文案写不出、方案难变现。先试用 7 天，逻辑通了再谈钱。",
    demoPath: "/demo/insight",
    purchaseUrl: "https://insight.humanwrite.com/pricing",
    accent: "from-indigo-500 to-purple-600",
    glowColor: "rgba(99,102,241,0.15)",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="2" x2="20" y2="8" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="32" x2="20" y2="38" stroke="currentColor" strokeWidth="1.5" />
        <line x1="2" y1="20" x2="8" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="32" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "aicleaner",
    title: "净言",
    subtitle: "AI Cleaner",
    tagline: "让 AI 文本回归自然",
    tags: ["去AI味", "降重", "润色"],
    description:
      "输入 AI 生成的文本，一键去除机器味。支持通用去AI味、学术降重、商务润色、社交媒体口语化四大场景。基于 OpenAI 大模型，让你的内容更像人类所写。",
    demoPath: "/demo/aicleaner",
    purchaseUrl: "https://humanwrite.com/aicleaner/pricing",
    accent: "from-emerald-500 to-teal-500",
    glowColor: "rgba(16,185,129,0.15)",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
        <path d="M20 4L23 17L36 20L23 23L20 36L17 23L4 20L17 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "classicore",
    title: "典萃",
    subtitle: "ClassiCore",
    tagline: "让知识创作效率提升 10 倍",
    tags: ["硬核拆书", "RAG技术", "自媒体重生", "知识胶囊"],
    description:
      "AI 驱动的深度阅读伴侣。基于 RAG 技术精准拆解书籍核心脉络，为自媒体创作者提供结构化的知识胶囊，实现内容重生。",
    demoPath: "/demo/classicore",
    purchaseUrl: "https://classicore.humanwrite.com/pricing",
    accent: "from-cyan-500 to-teal-500",
    glowColor: "rgba(0,206,201,0.15)",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="4" width="14" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="22" y="4" width="14" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="11" y1="14" x2="11" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="14" x2="29" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="22" x2="11" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="22" x2="29" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="30" x2="11" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="30" x2="29" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

function Tag({ children }) {
  return (
    <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider rounded-full bg-deep-600/60 text-text-secondary border border-deep-500/40">
      {children}
    </span>
  )
}

function CTAButton({ onClick, children }) {
  const base =
    "relative group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 overflow-hidden"
  return (
    <button
      onClick={onClick}
      className={`${base} border border-deep-500 text-text-primary hover:border-accent-light hover:text-white hover:shadow-[0_0_20px_rgba(162,155,254,0.08)] hover:scale-[1.02] active:scale-[0.98]`}
    >
      {children}
      <svg className="w-4 h-4 opacity-60" viewBox="0 0 16 16" fill="none">
        <path d="M10 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 6H5a2 2 0 00-2 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function PurchaseModal({ isOpen, onClose }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-deep-800 border border-card-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl mx-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">获取商业版</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            感谢您对 HumanWrite 产品的关注！
          </p>
        </div>

        <div className="bg-deep-900/50 rounded-xl p-5 mb-6 space-y-3">
          <p className="text-text-secondary text-sm leading-relaxed">
            商业版目前采用<strong className="text-white">邀请制</strong>，请添加商务 QQ 获取专属方案：
          </p>
          <div className="flex items-center justify-center gap-3 py-3">
            <span className="text-base font-semibold text-text-secondary">QQ：</span>
            <span className="text-2xl font-bold text-white tracking-wider">68419964</span>
          </div>
          <div className="flex items-center justify-center gap-3 pb-1">
            <span className="text-base font-semibold text-text-secondary">微信：</span>
            <span className="text-2xl font-bold text-white tracking-wider">lmloveac</span>
          </div>
          <div className="border-t border-deep-600 pt-3 space-y-1.5">
            <p className="text-xs text-text-muted">我们的专家团队将为您提供：</p>
            <ul className="text-sm text-text-secondary space-y-1">
              <li className="flex items-center gap-2">— 一对一产品演示</li>
              <li className="flex items-center gap-2">— 定制化部署方案</li>
              <li className="flex items-center gap-2">— 专属技术支持</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/15 transition-all border border-white/10"
        >
          我知道了
        </button>
      </div>
    </div>
  )
}

function DecorativeGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/5 blur-[120px]" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/demo/insight" element={<InsightDemo />} />
      <Route path="/demo/classicore" element={<ClassicoreDemo />} />
      <Route path="/demo/aicleaner" element={<AiCleanerDemo />} />
      <Route path="/*" element={<LandingPage />} />
    </Routes>
  )
}

function LandingPage() {
  const [showPurchase, setShowPurchase] = useState(false)
  usePageMeta({})
  return (
    <div className="relative min-h-screen bg-deep-900 text-text-primary overflow-hidden">
      <DecorativeGrid />

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-6 sm:pb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">HumanWrite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-4">
          产品矩阵
        </h1>
        <p className="max-w-lg mx-auto text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed">
          逻辑驱动 · 技术赋能 · 工业级稳固
        </p>
      </header>

      {/* Product Cards */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {products.map((p) => (
            <article
              key={p.id}
              className="group relative rounded-2xl border border-card-border bg-deep-800/60 backdrop-blur-sm p-5 sm:p-6 md:p-8 transition-all duration-500 hover:border-transparent"
              style={{ "--glow-color": p.glowColor }}
            >
              {/* Hover glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at 50% 50%, ${p.glowColor}, transparent 60%)`,
                }}
              />

              {/* Content */}
              <div className="relative">
                {/* Icon & Title Row */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${p.accent} flex items-center justify-center text-white`}>
                    {p.icon}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">{p.title}</h2>
                    <p className="text-sm text-text-muted font-mono tracking-wider">{p.subtitle}</p>
                    <p className="text-xs text-text-muted/60 mt-0.5">{p.tagline}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed mb-8 text-sm md:text-base">
                  {p.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to={p.demoPath} className="relative group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 overflow-hidden bg-white text-deep-900 hover:shadow-[0_0_24px_rgba(255,255,255,0.12)] hover:scale-[1.02] active:scale-[0.98]">
                    {p.id === 'insight' ? '🎯' : p.id === 'aicleaner' ? '✨' : '📚'} {p.id === 'aicleaner' ? '免费使用' : '立即体验 Demo'}
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  {p.id !== 'aicleaner' && (
                    <CTAButton onClick={() => setShowPurchase(true)}>
                      获取商业版
                    </CTAButton>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <PurchaseModal isOpen={showPurchase} onClose={() => setShowPurchase(false)} />

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-center">
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} HumanWrite. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
