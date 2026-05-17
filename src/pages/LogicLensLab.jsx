import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import ProductCTA from '../components/ProductCTA'

const LEAGUE_PRIORITY = [
  'England-Premier-League',
  'Spain-La-Liga',
  'Italy-Serie-A',
  'Germany-Bundesliga-1',
  'France-Ligue-1',
]

const LEAGUE_DISPLAY = {
  'England-Premier-League': '英超',
  'Spain-La-Liga': '西甲',
  'Italy-Serie-A': '意甲',
  'Germany-Bundesliga-1': '德甲',
  'France-Ligue-1': '法甲',
  'Japan-J-1': '日职',
  'Netherlands-Eredivisie': '荷甲',
  'Portugal-Liga-1': '葡超',
}
const ALL_LEAGUES = [
  '英超', '西甲', '意甲', '德甲', '法甲',
  '日职', '荷甲', '葡超', '欧冠', '欧联', '世界杯',
]

const NAV_ITEMS = [
  { id: 'today', label: '今日赛事' },
  { id: 'stats', label: '平台统计' },
]

const TODAY_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
const getLeagueKey = (modelId) => modelId?.split('_')[0] ?? null

function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export default function LogicLensLab() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [data, setData] = useState({ leagues: [], fixtures: [], predictions: {}, stats: null })
  const [yesterdayMatches, setYesterdayMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showHow, setShowHow] = useState(false)

  usePageMeta({
    title: '逻辑透镜 - 数据实验室 | HumanWrite',
    description: '基于历史赛事数据与机器学习模型的数据分析研究项目。个人兴趣驱动，覆盖五大联赛，每日更新。仅供研究参考。',
    keywords: '逻辑透镜,LogicLens,数据实验室,足球数据,数据分析,数据研究,机器学习',
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const now = new Date()
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      const [leaguesRes, fixturesRes, predictionsRes, statsRes, yesterdayRes] = await Promise.all([
        fetch('/api/logiclens/leagues').catch(() => ({ ok: false })),
        fetch('/api/logiclens/fixtures/today').catch(() => ({ ok: false })),
        fetch(`/api/logiclens/precomputed/${dateStr}`).catch(() => ({ ok: false })),
        fetch('/api/logiclens/stats').catch(() => ({ ok: false })),
        fetch('/api/logiclens/yesterday').catch(() => ({ ok: false })),
      ])
      const [leagues, fixtures, predictions, stats, yesterday] = await Promise.all([
        leaguesRes.ok ? leaguesRes.json() : { leagues: [] },
        fixturesRes.ok ? fixturesRes.json() : { fixtures: [] },
        predictionsRes.ok ? predictionsRes.json() : { predictions: {} },
        statsRes.ok ? statsRes.json() : null,
        yesterdayRes.ok ? yesterdayRes.json() : { matches: [] },
      ])
      setYesterdayMatches(yesterday.matches ?? [])
      setData({
        leagues: leagues.leagues ?? [],
        fixtures: fixtures.fixtures ?? [],
        predictions: predictions.predictions ?? {},
        stats,
      })
    } catch {
      setError('数据加载失败，请检查网络后重试')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const leagueLabelMap = useMemo(() => {
    const m = {}
    data.leagues.forEach((l) => { m[l.key] = l.label })
    return m
  }, [data.leagues])

  const enrichedMatches = useMemo(() => {
    return data.fixtures.map((f) => {
      const pred = data.predictions[f.num]
      const leagueKey = pred ? getLeagueKey(pred.model_id) : (f.league_key || null)
      return {
        ...f,
        prediction: pred,
        leagueKey,
        leagueLabel: leagueKey
          ? LEAGUE_DISPLAY[leagueKey] || leagueLabelMap[leagueKey] || leagueKey
          : null,
        hasPrediction: !!pred,
      }
    })
  }, [data.fixtures, data.predictions, leagueLabelMap])

  const isEmpty = !loading && !error && enrichedMatches.length === 0

  const scrollTo = useCallback((id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  function ShareButton() {
    const [copied, setCopied] = useState(false)
    const copy = useCallback(() => {
      const url = location.href
      const ta = document.createElement('textarea')
      ta.value = url; ta.style.position = 'fixed'; ta.style.left = '-9999px'; ta.style.top = '-9999px'
      ta.readOnly = true; document.body.appendChild(ta); ta.select()
      document.execCommand('copy'); document.body.removeChild(ta)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }, [])
    return <button onClick={copy} className="text-blue-500 hover:text-blue-600">{copied ? '✅ 已复制' : '分享给朋友'}</button>
  }

  const todayStr = new Date().toLocaleDateString('zh-CN', TODAY_OPTIONS)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      {/* ═══ Header ═══ */}
      <header className="glass-header sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
              <div style={{ width: 22, height: 22, background: 'var(--blue)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#E6F1FB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="2.5" />
                  <circle cx="12" cy="12" r="8.5" />
                </svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>逻辑透镜</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="px-3 py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {item.label}
                </button>
              ))}
              <Link to="/" className="px-3 py-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>← 返回首页</Link>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="菜单"
              >
                {menuOpen ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
          <div style={{ borderTop: '0.5px solid var(--border)', background: 'var(--bg-card)' }}>
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="block w-full text-left px-3 py-3 text-sm rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                  {item.label}
                </button>
              ))}
              <Link to="/" className="block w-full text-left px-3 py-3 text-sm rounded-lg" style={{ color: 'var(--text-tertiary)' }}>
                ← 返回首页
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-0 sm:px-6">
        {loading ? (
          <div className="px-4 sm:px-0 pt-6 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20 px-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(226, 75, 74, 0.15)' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#E24B4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-4 text-sm">{error}</p>
            <button onClick={fetchData} className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white" style={{ background: 'var(--blue)' }}>重新加载</button>
          </div>
        ) : isEmpty ? (
          <div className="text-center py-20 px-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-card)' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-lg font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>今日暂无赛事数据</p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>请在比赛日再来查看数据分析</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <section className="scroll-mt-16 pt-6 sm:pt-8 px-4 sm:px-0">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 14 }}>
                <div className="stat-card">
                  <div className="stat-eyebrow">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                    </svg>
                    昨日统计
                  </div>
                  <div className="stat-number green">
                    {data.stats?.yesterday?.rate != null
                      ? `${(data.stats.yesterday.rate * 100).toFixed(0)}%`
                      : '--'}
                  </div>
                  <div className="stat-subtitle">
                    {data.stats?.yesterday ? `${data.stats.yesterday.hits}/${data.stats.yesterday.total}` : '暂无数据'}
                  </div>
                  {data.stats?.yesterday?.leagues && Object.keys(data.stats.yesterday.leagues).length > 0 && (
                    <div className="stat-rows">
                      {Object.entries(data.stats.yesterday.leagues).slice(0, 3).map(([league, ld]) => (
                        <div className="srow" key={league}>
                          <span className="srow-label">{leagueLabelMap[league] || LEAGUE_DISPLAY[league] || league}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ color: 'var(--text-tertiary)', fontSize: 9 }}>{ld.hits}/{ld.total}</span>
                            {ld.rate != null && <span className={`pill ${ld.rate >= 0.5 ? 'pill-green' : 'pill-amber'}`}>{(ld.rate * 100).toFixed(0)}%</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="stat-card">
                  <div className="stat-eyebrow">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    近7天统计
                  </div>
                  <div className="stat-number blue">
                    {data.stats?.week?.rate != null
                      ? `${(data.stats.week.rate * 100).toFixed(0)}%`
                      : '--'}
                  </div>
                  <div className="stat-subtitle">
                    {data.stats?.week ? `${data.stats.week.hits}/${data.stats.week.total}` : '暂无数据'}
                  </div>
                  {data.stats?.week?.days && data.stats.week.days.length > 0 && (
                    <div className="stat-rows">
                      {data.stats.week.days.slice(0, 3).map((day, i) => (
                        <div className="srow" key={i}>
                          <span className="srow-label">{day.date || `第${i + 1}天`}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ color: 'var(--text-tertiary)', fontSize: 9 }}>{day.hits}/{day.total}</span>
                            {day.rate != null && <span className={`pill ${day.rate >= 0.5 ? 'pill-green' : 'pill-amber'}`}>{(day.rate * 100).toFixed(0)}%</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="stat-rows" style={{ borderTop: 'none', paddingTop: 2 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {ALL_LEAGUES.map(lg => (
                        <span key={lg} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: 'var(--bg-card)', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          {lg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 4, padding: '0 2px' }}>
                <h1 style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3, marginBottom: 4 }}>
                  我跟数据有一个约定
                </h1>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  你了解随机森林吗？你了解向量机吗？你了解神经网络吗？不，你不需要了解，我懂就可以了。
                </p>
              </div>
            </section>

            {/* Today's Matches */}
            <section id="today" className="scroll-mt-16" style={{ marginTop: 6 }}>
              <div className="sec-header">
                <div className="sec-title">
                  今日赛事 · {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                  <span className="sec-badge">{enrichedMatches.length}场</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button onClick={() => setShowHow(v => !v)} className="sec-link">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                      </svg>
                      研究方向
                    </button>
                    {showHow && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowHow(false)} />
                        <div className="absolute right-0 top-full mt-2 z-20 bg-midnight-700 border border-surface-border rounded-xl p-4 shadow-lg w-64">
                          <p className="text-xs text-text-secondary leading-relaxed">
                            基于每个赛事近万场比赛，每场比赛 30 多个比赛特征进行训练和建模。并持续不断优化和完善
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {enrichedMatches.length > 0 && (
                <div className="lcard-wrap">
                  {enrichedMatches.map((m) => (
                    <div key={m.num} className="lcard">
                      <div className="lc-top" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span className="lc-league">{m.leagueLabel || '其他'} · {m.num}</span>
                      </div>
                      <div className="lc-teams">
                        {m.home_cn}<br />vs {m.away_cn}
                      </div>
                      {m.hasPrediction ? (
                        <div className="lc-blur-row">
                          <span>主队 {(m.prediction.probabilities.home).toFixed(1)}%</span>
                          <span>平局 {(m.prediction.probabilities.draw).toFixed(1)}%</span>
                          <span>客队 {(m.prediction.probabilities.away).toFixed(1)}%</span>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '8px 0' }}>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>分析数据准备中</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Stats Detail */}
            <section id="stats" className="scroll-mt-16 px-4 sm:px-0">
              <div style={{ borderTop: '0.5px solid var(--border)', padding: '16px 0 12px' }}>
                <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 2, color: 'var(--text-primary)' }}>平台统计</h2>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>历史数据公开透明，用数据说话</p>
              </div>

              {yesterdayMatches.length > 0 ? (
                <div className="ym-container">
                  <div className="ym-header">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                    </svg>
                    昨日平台分析
                  </div>
                  <div className={`ym-viewport ${yesterdayMatches.length > 3 ? 'ym-scroll' : ''}`}>
                    <div className="ym-list">
                      {yesterdayMatches.map((m, i) => (
                        <div key={i} className="ym-row">
                          <span className="ym-league">{LEAGUE_DISPLAY[m.league_key] || m.league_key?.split('-').pop() || m.league}</span>
                          <span className="ym-teams">{m.home_cn} vs {m.away_cn}</span>
                          {m.prediction ? (
                            <div className="ym-badges">
                              <span className={`ym-pred ${m.prediction.prediction === '主胜' ? 'tag-home' : m.prediction.prediction === '客胜' ? 'tag-away' : 'tag-draw'}`}>
                                {m.prediction.prediction === '主胜' ? '主' : m.prediction.prediction === '客胜' ? '客' : '平'}
                              </span>
                            </div>
                          ) : (
                            <span className="ym-pred tag-none">--</span>
                          )}
                        </div>
                      ))}
                      {yesterdayMatches.length > 3 && yesterdayMatches.map((m, i) => (
                        <div key={`dup-${i}`} className="ym-row">
                          <span className="ym-league">{LEAGUE_DISPLAY[m.league_key] || m.league_key?.split('-').pop() || m.league}</span>
                          <span className="ym-teams">{m.home_cn} vs {m.away_cn}</span>
                          {m.prediction ? (
                            <div className="ym-badges">
                              <span className={`ym-pred ${m.prediction.prediction === '主胜' ? 'tag-home' : m.prediction.prediction === '客胜' ? 'tag-away' : 'tag-draw'}`}>
                                {m.prediction.prediction === '主胜' ? '主' : m.prediction.prediction === '客胜' ? '客' : '平'}
                              </span>
                            </div>
                          ) : (
                            <span className="ym-pred tag-none">--</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p style={{ color: 'var(--text-tertiary)' }} className="text-sm">暂无昨日分析记录</p>
                </div>
              )}

              <div className="text-center mb-6" style={{ marginTop: 12 }}>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: 'var(--blue)' }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                  回到顶部
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-12">
        <ProductCTA productName="逻辑透镜数据实验室" note="「逻辑透镜」" />
      </div>

      <footer className="text-center pb-6 pt-2">
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          &copy; {new Date().getFullYear()} HumanWrite. All rights reserved.
        </p>
        <p className="mt-1.5">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-tertiary)', fontSize: 10, textDecoration: 'none' }}>
            鄂ICP备2026022715号
          </a>
        </p>
        <p className="mt-1.5" style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>
          <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>用户协议</Link>
          <span style={{ margin: '0 6px' }}>·</span>
          <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>隐私政策</Link>
        </p>
        <p className="mt-2 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
          本平台为个人数据研究项目，所有数据仅供学习交流参考。
        </p>
        {enrichedMatches.length > 0 && (
          <p className="mt-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            觉得有用？<ShareButton />试试
          </p>
        )}
      </footer>
    </div>
  )
}
