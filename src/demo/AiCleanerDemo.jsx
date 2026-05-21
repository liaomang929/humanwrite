import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import ProductCTA from '../components/ProductCTA'

const platforms = [
  { key: 'general',  label: '通用去AI味', icon: '✨', desc: '适合所有场景' },
  { key: 'academic', label: '学术润色',   icon: '🎓', desc: '严谨自然表达' },
  { key: 'business', label: '商务润色',   icon: '💼', desc: '专业有温度' },
  { key: 'social',   label: '社交媒体',   icon: '📱', desc: '口语化传播' },
]

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');

  .ac-wrap {
    min-height: 100vh;
    display: flex; flex-direction: column;
    background: #0b0b14;
    font-family: 'DM Sans', sans-serif;
    color: #e8e4ff;
    -webkit-font-smoothing: antialiased;
    position: relative; overflow-x: hidden;
  }
  .ac-wrap::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 60% 40% at 15% 10%, rgba(78,207,179,.07) 0%, transparent 55%),
      radial-gradient(ellipse 50% 35% at 85% 90%, rgba(124,110,240,.06) 0%, transparent 50%);
  }
  .ac-wrap > * { position: relative; z-index: 1; }

  /* ── header ── */
  .ac-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 clamp(1rem,4vw,2rem); height: 60px;
    background: rgba(11,11,20,.85);
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(255,255,255,.07);
    position: sticky; top: 0; z-index: 50; flex-shrink: 0;
  }
  .ac-header-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .ac-site-logo {
    display: flex; align-items: center; gap: 9px; min-width: 0;
    text-decoration: none; font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 700; letter-spacing: -.02em; color: #e8e4ff;
  }
  .ac-site-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #4ecfb3;
    box-shadow: 0 0 10px rgba(78,207,179,.35); flex-shrink: 0;
  }
  .ac-nav-div { width: 1px; height: 16px; background: rgba(255,255,255,.09); flex-shrink: 0; }
  .ac-product-name { font-size: 13px; color: rgba(139,133,168,.75); font-weight: 400; white-space: nowrap; }
  .ac-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 100px;
    font-size: 11px; font-weight: 500;
    background: rgba(78,207,179,.1); color: #4ecfb3;
    border: 1px solid rgba(78,207,179,.22); flex-shrink: 0;
  }
  .ac-badge::before { content:''; width:5px; height:5px; border-radius:50%; background:#4ecfb3; }

  /* ── main ── */
  .ac-main { flex: 1; overflow-y: auto; }
  .ac-inner {
    max-width: 860px; margin: 0 auto;
    padding: clamp(1.5rem,4vw,2.5rem) clamp(1rem,4vw,2rem) 1rem;
    display: flex; flex-direction: column; gap: 1.25rem;
  }

  /* ── hero mini ── */
  .ac-page-hero {
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255,255,255,.07);
  }
  .ac-page-eyebrow {
    font-size: 10.5px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase;
    color: #4ecfb3; margin-bottom: .5rem;
    display: flex; align-items: center; gap: 6px;
  }
  .ac-page-eyebrow::before { content:''; width:14px; height:1px; background:#4ecfb3; }
  .ac-page-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.4rem,3vw,2rem);
    font-weight: 800; letter-spacing: -.035em;
    color: #e8e4ff; margin-bottom: .4rem; line-height: 1.1;
  }
  .ac-page-title em { font-style: normal; color: #4ecfb3; }
  .ac-page-sub { font-size: 13px; color: rgba(139,133,168,.75); font-weight: 300; line-height: 1.65; }

  /* ── platform selector ── */
  .ac-platforms { display: flex; flex-wrap: wrap; gap: 8px; }
  .ac-platform-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 14px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,.08);
    background: rgba(255,255,255,.03);
    cursor: pointer; transition: all .2s;
    font-family: 'DM Sans', sans-serif;
  }
  .ac-platform-btn:hover {
    border-color: rgba(78,207,179,.25);
    background: rgba(78,207,179,.05);
    color: #e8e4ff;
  }
  .ac-platform-btn.active {
    border-color: rgba(78,207,179,.4);
    background: rgba(78,207,179,.1);
    box-shadow: 0 0 0 1px rgba(78,207,179,.15);
  }
  .ac-plat-icon { font-size: 15px; }
  .ac-plat-info { text-align: left; }
  .ac-plat-label {
    font-size: 12.5px; font-weight: 500;
    color: #e8e4ff; display: block; line-height: 1.2;
  }
  .ac-platform-btn.active .ac-plat-label { color: #4ecfb3; }
  .ac-plat-desc { font-size: 10.5px; color: rgba(139,133,168,.6); display: block; }

  /* ── editor area ── */
  .ac-editor-wrap { display: flex; flex-direction: column; gap: 10px; }
  .ac-field-label {
    display: flex; align-items: center; justify-content: space-between;
  }
  .ac-label-text {
    font-size: 10.5px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
    color: rgba(74,70,102,.9);
  }
  .ac-char-count {
    font-size: 11px; color: rgba(74,70,102,.7);
    font-family: 'DM Mono', monospace;
  }
  .ac-textarea {
    width: 100%; height: 200px;
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 16px; padding: 1rem 1.1rem;
    font-size: 13.5px; font-family: 'DM Sans', sans-serif;
    color: #e8e4ff; line-height: 1.75; resize: none;
    transition: border-color .2s, box-shadow .2s;
    outline: none;
  }
  .ac-textarea::placeholder { color: rgba(74,70,102,.7); }
  .ac-textarea:focus {
    border-color: rgba(78,207,179,.3);
    box-shadow: 0 0 0 3px rgba(78,207,179,.06);
  }

  /* ── submit btn ── */
  .ac-submit {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px;
    background: linear-gradient(135deg, #4ecfb3, #38b2a0);
    border: none; border-radius: 14px;
    font-size: 14px; font-weight: 600; color: #0b1a17;
    font-family: 'Syne', sans-serif;
    cursor: pointer; transition: all .25s;
    position: relative; overflow: hidden;
  }
  .ac-submit::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,.12), transparent);
    opacity: 0; transition: opacity .2s;
  }
  .ac-submit:hover::before { opacity: 1; }
  .ac-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(78,207,179,.25); }
  .ac-submit:disabled { opacity: .38; cursor: not-allowed; transform: none; box-shadow: none; }
  .ac-spin {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(11,26,23,.3); border-top-color: #0b1a17;
    animation: ac-spin .7s linear infinite; flex-shrink: 0;
  }
  @keyframes ac-spin { to { transform: rotate(360deg) } }

  /* ── error ── */
  .ac-error {
    background: rgba(226,75,74,.08); border: 1px solid rgba(226,75,74,.2);
    border-radius: 12px; padding: .875rem 1rem;
    font-size: 13px; color: #f09595;
  }

  /* ── result ── */
  .ac-result-wrap { display: flex; flex-direction: column; gap: 10px; }
  .ac-result-hdr {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 8px;
  }
  .ac-result-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .ac-result-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

  /* stats */
  .ac-stats { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .ac-stat { font-size: 11.5px; color: rgba(139,133,168,.7); white-space: nowrap; }
  .ac-stat strong { color: #e8e4ff; font-weight: 500; font-family: 'DM Mono', monospace; }
  .ac-stat strong.teal { color: #4ecfb3; }
  .ac-stat-sep { font-size: 10px; color: rgba(74,70,102,.5); }
  .ac-change { font-size: 11.5px; font-weight: 600; font-family: 'DM Mono', monospace; white-space: nowrap; }
  .ac-change.pos { color: #4ecfb3; }
  .ac-change.neg { color: #f0c46c; }

  /* action buttons */
  .ac-action-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 9px;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
    font-size: 11.5px; color: rgba(139,133,168,.8);
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all .2s;
  }
  .ac-action-btn:hover { background: rgba(255,255,255,.08); color: #e8e4ff; border-color: rgba(255,255,255,.14); }
  .ac-action-btn.active { background: rgba(78,207,179,.1); color: #4ecfb3; border-color: rgba(78,207,179,.3); }
  .ac-action-btn svg { width: 12px; height: 12px; }

  /* output box */
  .ac-output-box {
    background: rgba(255,255,255,.025);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 16px; overflow: hidden;
    position: relative;
  }
  .ac-output-box::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(78,207,179,.4), transparent);
  }
  .ac-compare-grid {
    display: grid; grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 560px) {
    .ac-compare-grid { grid-template-columns: 1fr; }
  }
  .ac-compare-pane { padding: 1.1rem; }
  .ac-compare-pane + .ac-compare-pane { border-left: 1px solid rgba(255,255,255,.07); }
  @media (max-width: 560px) {
    .ac-compare-pane + .ac-compare-pane { border-left: none; border-top: 1px solid rgba(255,255,255,.07); }
  }
  .ac-pane-label {
    font-size: 9.5px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
    margin-bottom: .65rem;
  }
  .ac-pane-label.orig { color: rgba(74,70,102,.8); }
  .ac-pane-label.clean { color: #4ecfb3; }
  .ac-pane-text {
    font-size: 13px; line-height: 1.75; white-space: pre-wrap;
  }
  .ac-pane-text.orig { color: rgba(139,133,168,.65); }
  .ac-pane-text.clean { color: #e8e4ff; }
  .ac-single-pane { padding: 1.25rem 1.1rem; }
  .ac-single-text { font-size: 13.5px; line-height: 1.8; white-space: pre-wrap; color: #e8e4ff; }

  /* copy success */
  .ac-copy-success { color: #4ecfb3 !important; border-color: rgba(78,207,179,.3) !important; background: rgba(78,207,179,.1) !important; }

  /* ── cta area ── */
  .ac-cta-wrap {
    max-width: 860px; margin: 0 auto;
    padding: 0 clamp(1rem,4vw,2rem) clamp(2rem,5vw,3rem);
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
    description: '净言 AI Cleaner 是一款文本润色工具，通过AI大模型优化文本表达，让内容更自然流畅。支持通用润色、学术润色、商务润色、社交媒体口语化。',
    keywords: 'AI Cleaner,润色,AI文本,自然写作,表达优化',
  })

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
      <style>{CSS}</style>
      <div className="ac-wrap">

        {/* ── HEADER ── */}
        <header className="ac-header">
          <div className="ac-header-left">
            <Link to="/" className="ac-site-logo">
              <span className="ac-site-dot" />
              Blake Pierce
            </Link>
            <div className="ac-nav-div" />
            <span className="ac-product-name">净言</span>
          </div>
          <div className="ac-badge">免费体验</div>
        </header>

        {/* ── MAIN ── */}
        <main className="ac-main">
          <div className="ac-inner">

            {/* Page hero */}
            <div className="ac-page-hero">
              <div className="ac-page-eyebrow">AI 文本润色</div>
              <h1 className="ac-page-title">
                把 AI 写的，改得像<em>真人</em>写的
              </h1>
              <p className="ac-page-sub">
                去除 AI 味，让内容更自然流畅。支持通用润色、学术、商务、社交媒体四种场景。
              </p>
            </div>

            {/* Platform selector */}
            <div className="ac-platforms">
              {platforms.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPlatform(p.key)}
                  className={`ac-platform-btn${platform === p.key ? ' active' : ''}`}
                >
                  <span className="ac-plat-icon">{p.icon}</span>
                  <div className="ac-plat-info">
                    <span className="ac-plat-label">{p.label}</span>
                    <span className="ac-plat-desc">{p.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="ac-editor-wrap">
              <div className="ac-field-label">
                <span className="ac-label-text">输入文本</span>
                <span className="ac-char-count">{text.length} 字</span>
              </div>
              <textarea
                className="ac-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="粘贴 AI 生成的文本，让净言帮你去除 AI 味…"
                spellCheck={false}
              />
              <button
                className="ac-submit"
                onClick={handleClean}
                disabled={loading || !text.trim()}
              >
                {loading ? (
                  <>
                    <span className="ac-spin" />
                    处理中…
                  </>
                ) : (
                  <>✨ 去 AI 味</>
                )}
              </button>
            </div>

            {/* Error */}
            {error && <div className="ac-error">{error}</div>}

            {/* Result */}
            {result && (
              <div className="ac-result-wrap">
                <div className="ac-result-hdr">
                  <div className="ac-result-left">
                    <span className="ac-label-text">处理结果</span>
                    <div className="ac-stats">
                      <span className="ac-stat">原文 <strong>{result.stats.origChars}</strong></span>
                      <span className="ac-stat-sep">→</span>
                      <span className="ac-stat">处理后 <strong className="teal">{result.stats.resultChars}</strong></span>
                      <span className={`ac-change ${reduction < 0 ? 'neg' : 'pos'}`}>
                        {reduction < 0 ? '+' : ''}{reduction}%
                      </span>
                    </div>
                  </div>
                  <div className="ac-result-right">
                    <button
                      onClick={() => setShowCompare(v => !v)}
                      className={`ac-action-btn${showCompare ? ' active' : ''}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="8" height="18" rx="1.5" /><rect x="13" y="3" width="8" height="18" rx="1.5" />
                      </svg>
                      {showCompare ? '查看结果' : '对比原文'}
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`ac-action-btn${copied ? ' ac-copy-success' : ''}`}
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

                <div className="ac-output-box">
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
              </div>
            )}

          </div>
        </main>

        {/* CTA */}
        <div className="ac-cta-wrap">
          <ProductCTA
            productName="净言 AI Cleaner"
            description="净言 AI Cleaner 免费使用，如有个性化需求调整，联系我"
            note="「净言」"
          />
        </div>

      </div>
    </>
  )
}
