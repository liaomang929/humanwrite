import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

const platforms = [
  { key: 'general', label: '通用去AI味', icon: '✨' },
  { key: 'academic', label: '学术降重', icon: '🎓' },
  { key: 'business', label: '商务润色', icon: '💼' },
  { key: 'social', label: '社交媒体', icon: '📱' },
]

export default function AiCleanerDemo() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [platform, setPlatform] = useState('general')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showCompare, setShowCompare] = useState(false)

  usePageMeta({
    title: '净言 AI Cleaner — 让 AI 文本回归自然',
    description: '净言 AI Cleaner 是一款去AI味工具，通过AI大模型去除AI生成文本的痕迹，让内容更自然、更像人类写作。支持通用去AI味、学术降重、商务润色、社交媒体口语化。',
    keywords: '去AI味,AI Cleaner,降重,润色,AI文本,自然写作',
  })

  const handleClean = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), platform }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '处理失败')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result?.cleaned) return
    try {
      await navigator.clipboard.writeText(result.cleaned)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = result.cleaned
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const statsBar = result ? (
    <div className="flex items-center gap-4 flex-wrap text-xs">
      <span className="text-slate-400">
        原文 <span className="text-stone-300 font-medium">{result.stats.origChars}</span> 字
      </span>
      <span className="text-slate-500">→</span>
      <span className="text-slate-400">
        处理后 <span className="text-emerald-400 font-medium">{result.stats.resultChars}</span> 字
      </span>
      <span className="text-slate-600">·</span>
      <span className={`font-medium ${result.stats.reduction < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
        {result.stats.reduction < 0 ? '+' : ''}{result.stats.reduction}%
      </span>
    </div>
  ) : null

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 h-14 border-b border-slate-800 shrink-0 bg-[#0f172a]/90 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-stone-200 text-sm transition-colors"
          >
            ← 返回
          </button>
          <div className="w-px h-5 bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold">净</span>
            <span className="font-semibold text-sm">净言 AI Cleaner — 去AI味工具</span>
          </div>
        </div>
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">体验模式</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
          {/* Platform Selector */}
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <button
                key={p.key}
                onClick={() => setPlatform(p.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  platform === p.key
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800/30 text-slate-400 border border-transparent hover:bg-slate-800/50 hover:text-stone-300'
                }`}
              >
                <span>{p.icon}</span>
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">输入文本</label>
              <span className="text-xs text-slate-600">{text.length} 字</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="粘贴 AI 生成的文本，让净言帮你去除 AI 味..."
              className="w-full h-52 sm:h-64 bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 text-sm text-stone-300 leading-relaxed resize-none focus:outline-none focus:border-emerald-500/30 transition-colors placeholder:text-slate-600"
              spellCheck={false}
            />
            <button
              onClick={handleClean}
              disabled={loading || !text.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  处理中...
                </>
              ) : (
                <>
                  <span>✨</span> 去 AI 味
                </>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Output Area */}
          {result && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">处理结果</label>
                  {statsBar}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCompare(!showCompare)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all ${
                      showCompare
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-stone-200'
                    }`}
                  >
                    {showCompare ? '📄 查看结果' : '📑 对比原文'}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-stone-200 transition-all"
                  >
                    {copied ? '✓ 已复制' : '📋 复制'}
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
                {showCompare ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-700/50">
                    <div className="p-4">
                      <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-2">原文</div>
                      <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">{result.original}</div>
                    </div>
                    <div className="p-4 bg-emerald-500/[0.02]">
                      <div className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider mb-2">处理后</div>
                      <div className="text-sm text-stone-300 leading-relaxed whitespace-pre-wrap">{result.cleaned}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="text-sm text-stone-300 leading-relaxed whitespace-pre-wrap">{result.cleaned}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
