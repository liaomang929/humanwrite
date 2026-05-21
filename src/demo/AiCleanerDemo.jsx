import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import ProductCTA from '../components/ProductCTA'

const ACCENT = '#f0c46c'

const PLATFORMS = [
  { key: 'general',  label: '通用去AI味', icon: '✨' },
  { key: 'academic', label: '学术润色',   icon: '🎓' },
  { key: 'business', label: '商务润色',   icon: '💼' },
  { key: 'social',   label: '社交媒体',   icon: '📱' },
]

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --ac-bg: #0a0a0f;
    --ac-card: #111118;
    --ac-primary: #f0eeff;
    --ac-secondary: #8b85a8;
    --ac-muted: #4a4666;
    --ac-accent: ${ACCENT};
    --ac-border: rgba(255,255,255,0.07);
    --ac-border-h: rgba(255,255,255,0.13);
    --ac-display: 'Syne', sans-serif;
    --ac-body: 'DM Sans', sans-serif;
    --ac-ease: cubic-bezier(.23,1,.32,1);
    --ac-w: 920px;
    --ac-px: clamp(1.25rem, 4vw, 2.5rem);
  }

  .ac-wrap {
    font-family: var(--ac-body);
    background: var(--ac-bg);
    min-height: 100vh;
    color: var(--ac-primary);
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow-x: hidden;
  }
  .ac-wrap::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 70% 50% at 75% -5%, rgba(240,196,108,.09) 0%, transparent 55%),
      radial-gradient(ellipse 45% 35% at 5% 90%, rgba(124,110,240,.04) 0%, transparent 50%);
  }
  .ac-wrap > * { position: relative; z-index: 1; }

  .ac-content {
    width: 100%; max-width: var(--ac-w); margin: 0 auto;
    padding-left: var(--ac-px); padding-right: var(--ac-px);
  }

  /* nav */
  .ac-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    background: rgba(10,10,15,.78);
    border-bottom: 1px solid var(--ac-border);
  }
  .ac-nav-inner {
    max-width: var(--ac-w); margin: 0 auto;
    padding: 0 var(--ac-px); height: 56px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ac-nav-left { display: flex; align-items: center; gap: 1rem; }
  .ac-site-logo {
    display: flex; align-items: center; gap: 9px;
    text-decoration: none; font-family: var(--ac-display);
    font-size: 16px; font-weight: 700; letter-spacing: -.02em; color: var(--ac-primary);
  }
  .ac-site-dot {
    width: 7px; height: 7px; border-radius: 50%; background: var(--ac-accent);
    box-shadow: 0 0 10px rgba(240,196,108,.35);
  }
  .ac-nav-div { width: 1px; height: 16px; background: var(--ac-border-h); }
  .ac-product-name { font-size: 13px; color: var(--ac-secondary); font-weight: 400; }
  .ac-nav-badge {
    font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
    color: var(--ac-accent); background: rgba(240,196,108,.1);
    border: 1px solid rgba(240,196,108,.28); padding: 4px 11px; border-radius: 100px;
  }

  /* intro */
  .ac-intro {
    padding: calc(56px + clamp(2.5rem, 6vw, 4rem)) 0 clamp(2rem, 4vw, 2.75rem);
    text-align: center;
  }
  .ac-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase;
    color: var(--ac-accent); margin-bottom: 1rem;
  }
  .ac-eyebrow::before { content:''; width:20px; height:1px; background:var(--ac-accent); }
  .ac-h1 {
    font-family: var(--ac-display);
    font-size: clamp(1.85rem, 4.5vw, 3rem);
    font-weight: 800; line-height: 1.1; letter-spacing: -.04em;
    margin: 0 auto 1rem; max-width: 640px;
  }
  .ac-h1 em { font-style: normal; color: var(--ac-accent); }
  .ac-manifesto {
    font-family: var(--ac-display);
    font-size: clamp(1rem, 2vw, 1.25rem);
    font-weight: 600; letter-spacing: -.02em; line-height: 1.45;
    color: var(--ac-secondary); max-width: 520px; margin: 0 auto;
  }
  .ac-manifesto strong { color: var(--ac-primary); font-weight: 700; }

  /* unified tool panel */
  .ac-panel {
    background: var(--ac-card);
    border: 1px solid var(--ac-border);
    border-radius: 24px;
    overflow: hidden;
    margin-bottom: clamp(2rem, 4vw, 3rem);
    box-shadow: 0 20px 56px rgba(0,0,0,.32);
  }
  .ac-panel::before {
    content: ''; display: block; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(240,196,108,.35), transparent);
  }

  .ac-plat-row {
    display: grid; grid-template-columns: repeat(4, 1fr);
    border-bottom: 1px solid var(--ac-border);
  }
  .ac-plat-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 14px 10px; cursor: pointer; border: none;
    background: transparent; font-family: var(--ac-body);
    font-size: 12.5px; font-weight: 500; color: var(--ac-secondary);
    border-right: 1px solid var(--ac-border);
    transition: background .2s, color .2s;
  }
  .ac-plat-btn:last-child { border-right: none; }
  .ac-plat-btn:hover { background: rgba(255,255,255,.03); color: var(--ac-primary); }
  .ac-plat-btn.active {
    background: rgba(240,196,108,.08); color: var(--ac-accent);
    box-shadow: inset 0 -2px 0 var(--ac-accent);
  }
  .ac-plat-icon { font-size: 14px; line-height: 1; }

  .ac-panel-body {
    display: grid; grid-template-columns: 1fr 300px;
    min-height: 320px;
  }
  .ac-input-col {
    padding: 1.35rem 1.4rem 1.4rem;
    display: flex; flex-direction: column; gap: 12px;
    border-right: 1px solid var(--ac-border);
  }
  .ac-demo-col {
    padding: 1.35rem 1.25rem;
    background: linear-gradient(180deg, rgba(240,196,108,.04) 0%, transparent 100%);
    display: flex; flex-direction: column; gap: 10px;
    justify-content: center;
  }
  .ac-demo-label {
    font-size: 9.5px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
    color: var(--ac-muted); margin-bottom: 2px;
  }
  .ac-demo-before {
    font-size: 11.5px; color: var(--ac-muted); line-height: 1.6;
    text-decoration: line-through; opacity: .8;
  }
  .ac-demo-after {
    font-size: 12px; color: var(--ac-primary); line-height: 1.6;
    padding: .75rem .85rem; border-radius: 12px;
    background: rgba(240,196,108,.07);
    border: 1px solid rgba(240,196,108,.16);
  }

  .ac-field-hdr { display: flex; align-items: center; justify-content: space-between; }
  .ac-field-label {
    font-size: 10px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
    color: var(--ac-muted);
  }
  .ac-char-count { font-size: 11px; color: var(--ac-muted); font-family: 'DM Mono', monospace; }
  .ac-textarea {
    flex: 1; min-height: 220px; width: 100%; resize: none; outline: none;
    background: rgba(255,255,255,.02);
    border: 1px solid var(--ac-border); border-radius: 16px;
    padding: 1rem 1.05rem;
    font-size: 13.5px; font-family: var(--ac-body);
    color: var(--ac-primary); line-height: 1.75;
    transition: border-color .2s, box-shadow .2s;
  }
  .ac-textarea::placeholder { color: var(--ac-muted); }
  .ac-textarea:focus {
    border-color: rgba(240,196,108,.35);
    box-shadow: 0 0 0 3px rgba(240,196,108,.06);
  }
  .ac-submit {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px; border-radius: 100px; cursor: pointer;
    background: rgba(240,196,108,.16); border: 1px solid rgba(240,196,108,.4);
    color: var(--ac-accent); font-size: 14px; font-weight: 600;
    font-family: var(--ac-display);
    transition: background .2s, transform .2s;
  }
  .ac-submit:hover:not(:disabled) {
    background: rgba(240,196,108,.26); transform: translateY(-1px);
  }
  .ac-submit:disabled { opacity: .35; cursor: not-allowed; transform: none; }
  .ac-spin {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(240,196,108,.25); border-top-color: var(--ac-accent);
    animation: ac-spin .7s linear infinite;
  }
  @keyframes ac-spin { to { transform: rotate(360deg) } }

  .ac-error {
    margin-bottom: 1rem;
    background: rgba(226,75,74,.08); border: 1px solid rgba(226,75,74,.2);
    border-radius: 14px; padding: .875rem 1rem; font-size: 13px; color: #f09595;
  }

  /* result — same width panel */
  .ac-result {
    background: var(--ac-card);
    border: 1px solid var(--ac-border);
    border-radius: 24px; overflow: hidden;
    margin-bottom: clamp(2rem, 4vw, 3rem);
  }
  .ac-result-hdr {
    padding: 1rem 1.35rem;
    border-bottom: 1px solid var(--ac-border);
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 10px;
  }
  .ac-result-left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .ac-stats { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .ac-stat { font-size: 11.5px; color: var(--ac-secondary); }
  .ac-stat strong { color: var(--ac-primary); font-family: 'DM Mono', monospace; font-weight: 500; }
  .ac-stat strong.gold { color: var(--ac-accent); }
  .ac-stat-sep { font-size: 10px; color: var(--ac-muted); }
  .ac-change { font-size: 11.5px; font-weight: 600; font-family: 'DM Mono', monospace; }
  .ac-change.pos { color: var(--ac-accent); }
  .ac-change.neg { color: #4ecfb3; }
  .ac-result-actions { display: flex; gap: 6px; }
  .ac-action-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 100px;
    background: transparent; border: 1px solid var(--ac-border);
    font-size: 11.5px; color: var(--ac-secondary);
    cursor: pointer; font-family: var(--ac-body); transition: all .2s;
  }
  .ac-action-btn:hover { border-color: var(--ac-border-h); color: var(--ac-primary); }
  .ac-action-btn.active { background: rgba(240,196,108,.1); color: var(--ac-accent); border-color: rgba(240,196,108,.3); }
  .ac-action-btn.copied { color: var(--ac-accent); border-color: rgba(240,196,108,.3); background: rgba(240,196,108,.1); }
  .ac-action-btn svg { width: 12px; height: 12px; }
  .ac-compare-grid { display: grid; grid-template-columns: 1fr 1fr; }
  .ac-compare-pane { padding: 1.2rem 1.35rem 1.4rem; }
  .ac-compare-pane + .ac-compare-pane { border-left: 1px solid var(--ac-border); }
  .ac-pane-label {
    font-size: 9.5px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
    margin-bottom: .6rem;
  }
  .ac-pane-label.orig { color: var(--ac-muted); }
  .ac-pane-label.clean { color: var(--ac-accent); }
  .ac-pane-text { font-size: 13px; line-height: 1.75; white-space: pre-wrap; }
  .ac-pane-text.orig { color: var(--ac-secondary); opacity: .85; }
  .ac-pane-text.clean { color: var(--ac-primary); }
  .ac-single-pane { padding: 1.25rem 1.35rem 1.4rem; }
  .ac-single-text { font-size: 13.5px; line-height: 1.8; white-space: pre-wrap; color: var(--ac-primary); }

  .ac-contact { padding-bottom: clamp(2rem, 4vw, 3rem); }
  .ac-footer-wrap { border-top: 1px solid var(--ac-border); }
  .ac-footer {
    max-width: var(--ac-w); margin: 0 auto;
    padding: 1.75rem var(--ac-px);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .875rem;
  }
  .ac-footer-l { font-size: 12px; color: var(--ac-muted); display: flex; flex-direction: column; gap: 3px; }
  .ac-footer-r { display: flex; align-items: center; gap: 1.1rem; flex-wrap: wrap; }
  .ac-footer-r a { font-size: 11.5px; color: var(--ac-muted); text-decoration: none; transition: color .2s; }
  .ac-footer-r a:hover { color: var(--ac-secondary); }

  .ac-reveal {
    opacity: 0; transform: translateY(20px);
    transition: opacity .7s var(--ac-ease), transform .7s var(--ac-ease);
  }
  .ac-reveal.ac-visible { opacity: 1; transform: translateY(0); }

  @keyframes ac-up { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform: translateY(0) } }
  .ac-intro > * { animation: ac-up .6s var(--ac-ease) both; }
  .ac-intro > *:nth-child(1) { animation-delay: .04s; }
  .ac-intro > *:nth-child(2) { animation-delay: .1s; }
  .ac-intro > *:nth-child(3) { animation-delay: .16s; }

  @media (max-width: 820px) {
    .ac-panel-body { grid-template-columns: 1fr; }
    .ac-input-col { border-right: none; border-bottom: 1px solid var(--ac-border); }
    .ac-demo-col { min-height: auto; }
    .ac-plat-btn { font-size: 11px; padding: 12px 6px; }
    .ac-plat-btn span:not(.ac-plat-icon) { display: none; }
    .ac-plat-btn .ac-plat-icon { font-size: 18px; }
  }
  @media (max-width: 560px) {
    .ac-compare-grid { grid-template-columns: 1fr; }
    .ac-compare-pane + .ac-compare-pane { border-left: none; border-top: 1px solid var(--ac-border); }
  }
  @media (prefers-reduced-motion: reduce) {
    .ac-reveal, .ac-intro > * { animation: none !important; transition: none !important; }
    .ac-reveal { opacity: 1; transform: none; }
  }
`

export default function AiCleanerDemo() {
  const [text, setText] = useState('')
  const [platform, setPlatform] = useState('general')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showCompare, setShowCompare] = useState(false)

  usePageMeta({
    title: '净言 AI Cleaner — 让 AI 文本回归自然',
    description: '净言 AI Cleaner 是一款文本润色工具，通过 AI 大模型优化文本表达，让内容更自然流畅。支持通用润色、学术润色、商务润色、社交媒体口语化。',
    keywords: '净言,AI Cleaner,润色,去AI味,AI文本,自然写作',
  })

  useEffect(() => {
    const els = document.querySelectorAll('.ac-reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('ac-visible') }),
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' },
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [result])

  const handleClean = async () => {
    if (!text.trim()) return
    setLoading(true); setError(''); setResult(null)
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
    } catch {
      const ta = document.createElement('textarea')
      ta.value = result.cleaned
      document.body.appendChild(ta); ta.select()
      document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const reduction = result?.stats?.reduction ?? 0

  return (
    <>
      <style>{STYLES}</style>
      <div className="ac-wrap">

        <header className="ac-nav">
          <div className="ac-nav-inner">
            <div className="ac-nav-left">
              <Link to="/" className="ac-site-logo">
                <span className="ac-site-dot" />
                Blake Pierce
              </Link>
              <div className="ac-nav-div" />
              <span className="ac-product-name">净言</span>
            </div>
            <span className="ac-nav-badge">免费可用</span>
          </div>
        </header>

        <div className="ac-content ac-intro">
          <div className="ac-eyebrow">AI Cleaner · 净言</div>
          <h1 className="ac-h1">把 AI 写的，改得像<em>真人</em>写的</h1>
          <p className="ac-manifesto">
            粘贴文本 · 选择场景 · <strong>一键去 AI 味</strong>
          </p>
        </div>

        <div className="ac-content ac-reveal">
          {error && <div className="ac-error">{error}</div>}

          <div className="ac-panel">
            <div className="ac-plat-row">
              {PLATFORMS.map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPlatform(p.key)}
                  className={`ac-plat-btn${platform === p.key ? ' active' : ''}`}
                >
                  <span className="ac-plat-icon">{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            <div className="ac-panel-body">
              <div className="ac-input-col">
                <div className="ac-field-hdr">
                  <span className="ac-field-label">输入文本</span>
                  <span className="ac-char-count">{text.length} 字</span>
                </div>
                <textarea
                  className="ac-textarea"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="粘贴 AI 生成的文本…"
                  spellCheck={false}
                />
                <button
                  type="button"
                  className="ac-submit"
                  onClick={handleClean}
                  disabled={loading || !text.trim()}
                >
                  {loading ? (<><span className="ac-spin" />处理中…</>) : '去 AI 味'}
                </button>
              </div>

              <div className="ac-demo-col">
                <div className="ac-demo-label">效果示例</div>
                <div className="ac-demo-before">
                  首先，我们需要明确一点。其次，值得注意的是……
                </div>
                <div className="ac-demo-after">
                  说白了，核心就一件事——把 AI 味去掉，像人写的。
                </div>
              </div>
            </div>
          </div>

          {result && (
            <div className="ac-result ac-reveal">
              <div className="ac-result-hdr">
                <div className="ac-result-left">
                  <span className="ac-field-label">处理结果</span>
                  <div className="ac-stats">
                    <span className="ac-stat">原文 <strong>{result.stats.origChars}</strong></span>
                    <span className="ac-stat-sep">→</span>
                    <span className="ac-stat">处理后 <strong className="gold">{result.stats.resultChars}</strong></span>
                    <span className={`ac-change ${reduction < 0 ? 'neg' : 'pos'}`}>
                      {reduction < 0 ? '+' : ''}{reduction}%
                    </span>
                  </div>
                </div>
                <div className="ac-result-actions">
                  <button
                    type="button"
                    onClick={() => setShowCompare(v => !v)}
                    className={`ac-action-btn${showCompare ? ' active' : ''}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="8" height="18" rx="1.5" /><rect x="13" y="3" width="8" height="18" rx="1.5" />
                    </svg>
                    {showCompare ? '查看结果' : '对比原文'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`ac-action-btn${copied ? ' copied' : ''}`}
                  >
                    {copied ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        已复制
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                        复制
                      </>
                    )}
                  </button>
                </div>
              </div>
              {showCompare ? (
                <div className="ac-compare-grid">
                  <div className="ac-compare-pane">
                    <div className="ac-pane-label orig">原文</div>
                    <div className="ac-pane-text orig">{result.original}</div>
                  </div>
                  <div className="ac-compare-pane">
                    <div className="ac-pane-label clean">处理后</div>
                    <div className="ac-pane-text clean">{result.cleaned}</div>
                  </div>
                </div>
              ) : (
                <div className="ac-single-pane">
                  <div className="ac-single-text">{result.cleaned}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ac-content ac-contact ac-reveal">
          <ProductCTA
            productName="净言 AI Cleaner"
            description="净言免费使用，如需定制润色规则或接入 API，联系我"
            note="「净言」"
          />
        </div>

        <div className="ac-footer-wrap">
          <footer className="ac-footer">
            <div className="ac-footer-l">
              <span>© {new Date().getFullYear()} Blake Pierce</span>
              <span>本平台为个人项目，所有数据仅供学习交流参考。</span>
            </div>
            <div className="ac-footer-r">
              <a href="/terms">用户协议</a>
              <span style={{ color: 'var(--ac-muted)', fontSize: 10 }}>·</span>
              <a href="/privacy">隐私政策</a>
              <span style={{ color: 'var(--ac-muted)', fontSize: 10 }}>·</span>
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                鄂ICP备2026022715号
              </a>
              <span style={{ color: 'var(--ac-muted)', fontSize: 10 }}>·</span>
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
