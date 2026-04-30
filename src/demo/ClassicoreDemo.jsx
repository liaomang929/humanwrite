import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { usePageMeta } from '../hooks/usePageMeta'
import { demoBooks, capsules, scripts } from './data/classicoreDemoData'

const platformLabels = { xiaohongshu: '小红书图文', douyin: '抖音短视频', wechat: '微信公众号' }
const platformIcons = { xiaohongshu: '📕', douyin: '🎵', wechat: '💬' }

export default function ClassicoreDemo() {
  const navigate = useNavigate()
  const [view, setView] = useState('list') // 'list' | 'workspace'
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [capsule, setCapsule] = useState(null)
  const [script, setScript] = useState(null)
  const [scriptPlatform, setScriptPlatform] = useState(null)
  const [copied, setCopied] = useState(false)
  const [tourDone, setTourDone] = useState(false)
  const tourRef = useRef(null)
  const [mobilePanel, setMobilePanel] = useState(0)
  const mobileScrollRef = useRef(null)

  usePageMeta({
    title: '典萃 ClassiCore Demo — 经典著作内容生产流水线',
    description: '典萃 ClassiCore AI 深度阅读伴侣 —— 基于 RAG 技术精准拆解书籍核心脉络，为自媒体创作者提供结构化知识胶囊，实现内容重生。',
    keywords: '典萃,ClassiCore,AI阅读,RAG,知识胶囊,拆书,自媒体创作',
  })

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('classicore-tour-done')
    if (hasSeen) { setTourDone(true); return }
    const timer = setTimeout(() => {
      tourRef.current = driver({
        showProgress: true,
        allowClose: false,
        overlayOpacity: 0.6,
        doneBtnText: '探索完成',
        nextBtnText: '下一步',
        prevBtnText: '上一步',
        steps: [
          {
            element: '#demo-book-list',
            popover: {
              title: '📚 经典著作仓库',
              description: '上传PDF自动拆解。支持多本书籍管理，AI自动提取核心脉络，让每一本经典都变成可消费的知识资产。',
              side: 'bottom',
            },
          },
          {
            element: '#demo-workspace',
            popover: {
              title: '🎯 三栏式工作台',
              description: '左栏主题列表 → 中栏知识胶囊 → 右栏脚本编辑器。结构化的拆书流水线，从原文到自媒体脚本一步到位。',
              side: 'left',
            },
          },
          {
            element: '#demo-capsule',
            popover: {
              title: '🧠 知识胶囊：原文+现代解读',
              description: 'AI自动提取原文精华并生成现代解读。不是简单的摘要，而是跨时空的"翻译"——让古典智慧照进现代场景。',
              side: 'bottom',
            },
          },
          {
            element: '#demo-script-gen',
            popover: {
              title: '📱 一键生成多平台脚本',
              description: '从知识胶囊到小红书/抖音/公众号脚本，AI自动适配平台风格。内容创作的"工业化流水线"。',
              side: 'left',
            },
          },
        ],
        onDestroyed: () => {
          setTourDone(true)
          sessionStorage.setItem('classicore-tour-done', '1')
        },
      })
      tourRef.current.drive()
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const handleMobileScroll = useCallback(() => {
    if (!mobileScrollRef.current) return
    const idx = Math.round(mobileScrollRef.current.scrollLeft / mobileScrollRef.current.clientWidth)
    setMobilePanel(idx)
  }, [])

  const scrollToPanel = useCallback((index) => {
    if (!mobileScrollRef.current) return
    mobileScrollRef.current.scrollTo({ left: mobileScrollRef.current.clientWidth * index, behavior: 'smooth' })
  }, [])

  const handleBookClick = (book) => {
    setSelectedBook(book)
    setSelectedTopic(null)
    setCapsule(null)
    setScript(null)
    setView('workspace')
  }

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic)
    setCapsule(capsules[topic.capsule_id] || null)
    setScript(null)
    scrollToPanel(1)
  }

  const handleGenerateScript = (platform) => {
    setScriptPlatform(platform)
    const demoScript = scripts[selectedTopic?.capsule_id]?.[platform]
    if (demoScript) {
      setScript(demoScript)
    } else {
      setScript(`# ${platformLabels[platform]} 脚本\n\n基于「${selectedTopic?.topic_name}」生成的内容脚本。\n\n在完整版中，AI将根据知识胶囊内容自动生成适配${platformLabels[platform]}平台风格的专业脚本。`)
    }
    scrollToPanel(2)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = script || ''
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 h-14 border-b border-slate-800 shrink-0 bg-[#0f172a]/90 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={() => {
            if (view === 'workspace') {
              setView('list'); setSelectedBook(null); setSelectedTopic(null); setCapsule(null); setScript(null)
            } else { navigate('/') }
          }} className="text-slate-400 hover:text-stone-200 text-sm transition-colors">
            ← {view === 'workspace' ? '返回书籍仓库' : '返回'}
          </button>
          <div className="w-px h-5 bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-xs font-bold">典</span>
            <span className="font-semibold text-sm">典萃 ClassiCore — 经典著作内容生产流水线</span>
          </div>
        </div>
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">体验模式</span>
        </div>
      </header>

      {/* Book List View */}
      {view === 'list' && (
        <main className="flex-1 overflow-y-auto p-6" id="demo-book-list">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-stone-100">书籍仓库</h1>
                <p className="text-sm text-slate-400 mt-1">管理你的经典著作库，上传 PDF 并生成知识胶囊</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 text-amber-400 rounded-xl hover:bg-amber-500/20 border border-amber-500/20 text-sm font-medium transition-all cursor-default">
                <span>+</span> 新建书籍
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {demoBooks.map(book => (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  className="group bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 cursor-pointer hover:border-amber-500/30 transition-all"
                >
                  <h3 className="font-semibold text-stone-200 group-hover:text-amber-400 transition-colors mb-1">{book.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{book.author}</p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">{book.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-slate-500">
                      <span>📄</span> PDF 已上传
                    </span>
                    <span className="text-green-500">✓</span>
                    <span className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20 font-medium">
                      <span>✨</span> 进入工作台
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Workspace View */}
      {view === 'workspace' && selectedBook && (
        <div className="flex-1 flex flex-col overflow-hidden" id="demo-workspace">
          {/* Unified scroll-snap (mobile) / flex-row (desktop) panels */}
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex-1 flex overflow-x-auto snap-x snap-mandatory scroll-smooth lg:overflow-visible lg:snap-none hide-scrollbar"
          >
            {/* Left Panel — Topics */}
            <div className="w-full flex-shrink-0 snap-start flex flex-col border-r border-slate-800 lg:w-72 lg:flex-none overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  主题列表 ({selectedBook.topics.length})
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {selectedBook.topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicClick(topic)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedTopic?.id === topic.id
                        ? 'bg-amber-500/10 border border-amber-500/20'
                        : 'bg-slate-800/30 border border-transparent hover:bg-slate-800/50'
                    }`}
                  >
                    <p className="text-sm font-medium text-stone-200 line-clamp-2">{topic.topic_name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-slate-500">第 {topic.page_start}-{topic.page_end} 页</span>
                      {topic.capsule_id && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">已生成</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Center Panel — Capsule */}
            <div className="w-full flex-shrink-0 snap-start flex flex-col min-w-0 border-r border-slate-800 lg:flex-1 lg:shrink overflow-hidden">
              {capsule && selectedTopic ? (
                <>
                  <div className="px-5 py-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <button onClick={() => scrollToPanel(0)} className="text-slate-400 hover:text-stone-200 text-sm transition-colors lg:hidden mr-1">
                        ←
                      </button>
                      <span className="text-amber-500/60">#</span>
                      <h2 className="text-sm font-semibold text-stone-200">{selectedTopic.topic_name}</h2>
                      <span className="text-[10px] text-slate-500 ml-auto">
                        第 {selectedTopic.page_start}-{selectedTopic.page_end} 页
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 space-y-5" id="demo-capsule">
                    {/* Original Text */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-amber-500/60 text-sm">💬</span>
                        <span className="text-xs font-medium text-slate-400">原文引用</span>
                      </div>
                      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                        <p className="text-sm text-stone-300 leading-relaxed">{capsule.original_text}</p>
                      </div>
                    </div>
                    {/* Modern Interpretation */}
                    {capsule.modern_interpretation && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-amber-500/60 text-sm">👤</span>
                          <span className="text-xs font-medium text-slate-400">现代解读</span>
                        </div>
                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
                          <p className="text-sm text-stone-300 leading-relaxed">{capsule.modern_interpretation}</p>
                        </div>
                      </div>
                    )}
                    {/* Script Generation */}
                    <div id="demo-script-gen">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-amber-500/60 text-sm">✨</span>
                        <span className="text-xs font-medium text-slate-400">生成脚本</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(platformLabels).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => handleGenerateScript(key)}
                            className="flex flex-col items-center gap-1.5 px-3 py-3 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 hover:border-amber-500/30 transition-all"
                          >
                            <span className="text-lg">{platformIcons[key]}</span>
                            <span className="text-xs text-slate-400">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl text-slate-700 mb-3">📖</div>
                    <p className="text-sm text-slate-600">从左栏选择一个主题</p>
                    <p className="text-xs text-slate-700 mt-1">点击主题将自动生成对应的知识胶囊</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel — Script Editor */}
            <div className="w-full flex-shrink-0 snap-start flex flex-col lg:w-96 lg:flex-none overflow-hidden">
              {script ? (
                <>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <button onClick={() => scrollToPanel(1)} className="text-slate-400 hover:text-stone-200 text-sm transition-colors lg:hidden mr-1">
                        ←
                      </button>
                      <span className="text-lg">{platformIcons[scriptPlatform]}</span>
                      <span className="text-sm font-medium text-stone-200">{platformLabels[scriptPlatform]}</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-stone-200 transition-all"
                    >
                      {copied ? <>✓ 已复制</> : <>📋 复制</>}
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <textarea
                      value={script}
                      readOnly
                      className="w-full h-full bg-transparent text-sm text-stone-300 leading-relaxed resize-none focus:outline-none font-sans"
                      spellCheck={false}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <span className="text-3xl text-slate-700 mb-3">📄</span>
                  <p className="text-sm text-slate-600">脚本编辑器</p>
                  <p className="text-xs text-slate-700 mt-1">选中胶囊后点击平台按钮，脚本将在此处展示</p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile dot indicators */}
          <div className="lg:hidden flex justify-center gap-3 py-2.5 border-t border-slate-800 shrink-0 bg-[#0f172a]">
            <button onClick={() => scrollToPanel(0)} className={`h-2 rounded-full transition-all duration-300 ${mobilePanel === 0 ? 'w-6 bg-amber-500' : 'w-2 bg-slate-700'}`} />
            <button onClick={() => scrollToPanel(1)} className={`h-2 rounded-full transition-all duration-300 ${mobilePanel === 1 ? 'w-6 bg-amber-500' : 'w-2 bg-slate-700'}`} />
            <button onClick={() => scrollToPanel(2)} className={`h-2 rounded-full transition-all duration-300 ${mobilePanel === 2 ? 'w-6 bg-amber-500' : 'w-2 bg-slate-700'}`} />
          </div>
        </div>
      )}
    </div>
  )
}
