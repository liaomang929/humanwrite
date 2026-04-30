import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { usePageMeta } from '../hooks/usePageMeta'
import SharePoster from './SharePoster'
import { matches, selectedMatches, analyses } from './data/insightDemoData'

const navItems = [
  { key: '1', label: '赛事数据', icon: '📊' },
  { key: '2', label: '选场预测', icon: '🎯' },
  { key: '3', label: '辅助分析', icon: '🤖' },
  { key: '4', label: '文案制作', icon: '📝' },
]

const predictionStyleMap = {
  '胜': { bg: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' },
  '平': { bg: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' },
  '负': { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' },
  '让胜': { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' },
  '让平': { bg: 'rgba(251,146,60,0.15)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' },
  '让负': { bg: 'rgba(6,182,212,0.15)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.3)' },
}

const s = {
  page: 'min-h-screen bg-[#0a0a1a] text-white',
  header: 'sticky top-0 z-50 h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#0a0a1a]/90 backdrop-blur-md',
  sidebar: 'fixed left-0 top-16 bottom-0 w-[220px] border-r border-white/10 bg-[#0a0a1a]/80 backdrop-blur-sm p-4 overflow-y-auto hidden lg:block',
  main: 'ml-0 lg:ml-[220px] p-6 min-h-[calc(100vh-4rem)]',
  card: 'bg-white/[0.05] border border-white/10 rounded-xl p-5',
  cardHover: 'hover:bg-white/[0.08] transition-all duration-200',
  statBox: 'rounded-xl p-4',
  chip: 'text-xs px-2.5 py-1 rounded-md',
  btn: 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
  btnPrimary: 'bg-[#818cf8] text-white hover:bg-[#6d78f0]',
  btnGhost: 'border border-white/15 text-white/70 hover:bg-white/10',
  tag: 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
  greenTag: 'bg-green-500/10 text-green-400 border border-green-500/20',
}

export default function InsightDemo() {
  const navigate = useNavigate()
  const [page, setPage] = useState('1')
  const [deviceMode, setDeviceMode] = useState('desktop') // 'desktop' | 'mobile'
  const [tourDone, setTourDone] = useState(false)
  const tourRef = useRef(null)

  usePageMeta({
    title: '球之见 Demo — 球场迷雾，由此可见！',
    description: '球之见智能分析系统 Demo —— 赛事数据、选场预测、AI 球之见逻辑分析、文案制作。为彩店店主、体育分析师打造的带教式分析管理工具。',
    keywords: '球之见,体育分析,赛事数据,AI预测,足彩分析,竞彩推荐',
  })

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('insight-tour-done')
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
            element: '#demo-matches',
            popover: {
              title: '📊 实时赛事数据',
              description: '覆盖英超、西甲、德甲、欧冠等主流联赛，一键抓取500彩票网实时数据。所有赔率、让球信息一目了然，无需手动录入。',
              side: 'left',
            },
          },
          {
            element: '#demo-match-card',
            popover: {
              title: '🎯 智能选场系统',
              description: '基于联赛等级、赔率差异等多维度评分，自动推荐重点比赛。支持手动勾选，最多可选6场，保存后进入预测流程。',
              side: 'bottom',
            },
          },
          {
            element: '#demo-analysis',
            popover: {
              title: '🤖 AI 球之见逻辑分析',
              description: '一键生成专业级比赛分析报告：基本面数据、盘口解析、数据模型预测。每份报告都是15年实战逻辑的数字化沉淀。',
              side: 'left',
            },
          },
          {
            element: '#demo-predictions',
            popover: {
              title: '📝 结构化预测体系',
              description: '胜平负+让球双维度预测，信心指数+分析笔记+热门标记。完整的预测-分析-复盘工作流，让每一场推荐都有据可循。',
              side: 'right',
            },
          },
        ],
        onDestroyed: () => {
          setTourDone(true)
          sessionStorage.setItem('insight-tour-done', '1')
        },
      })
      tourRef.current.drive()
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  const renderMatchCard = (m, idx) => (
    <div
      id={idx === 0 ? 'demo-match-card' : undefined}
      key={m.matchId}
      className={`${s.card} ${s.cardHover} cursor-pointer`}
    >
      <div className="flex items-center flex-wrap gap-2 mb-3">
        <span className={`${s.chip} bg-white/10 text-white/60`}>#{m.matchId}</span>
        <span className={`${s.chip} bg-orange-500/20 text-orange-400`}>{m.league}</span>
        {m.handicapLine && <span className={`${s.chip} bg-white/5 text-white/50`}>让步: {m.handicapLine}</span>}
        <span className="text-xs text-white/35 ml-auto">{m.matchTime}</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium text-white/90">{m.homeTeam}</span>
        <span className="text-xs text-white/30 px-2">VS</span>
        <span className="font-medium text-white/90">{m.awayTeam}</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {[['胜', m.oddsWin, '#f87171', 'rgba(239,68,68,0.12)'],
          ['平', m.oddsDraw, '#c084fc', 'rgba(168,85,247,0.12)'],
          ['负', m.oddsLoss, '#60a5fa', 'rgba(59,130,246,0.12)'],
        ].map(([lbl, odds, clr, bg]) => (
          <div key={lbl} className="rounded-lg py-2 text-center" style={{ background: bg }}>
            <div className="text-[11px] text-white/40 mb-0.5">{lbl}</div>
            <div className="text-sm font-medium" style={{ color: clr }}>{odds || '-'}</div>
          </div>
        ))}
      </div>
      {(m.handicapWin || m.handicapDraw || m.handicapLoss) && (
        <div className="grid grid-cols-3 gap-1.5">
          {[['让胜', m.handicapWin, '#4ade80', 'rgba(34,197,94,0.08)'],
            ['让平', m.handicapDraw, '#fb923c', 'rgba(251,146,60,0.08)'],
            ['让负', m.handicapLoss, '#22d3ee', 'rgba(6,182,212,0.08)'],
          ].map(([lbl, odds, clr, bg]) => (
            <div key={lbl} className="rounded-lg py-1.5 text-center" style={{ background: bg }}>
              <div className="text-[11px] text-white/35 mb-0.5">{lbl}</div>
              <div className="text-xs font-medium" style={{ color: clr }}>{odds || '-'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderPredictCard = (m) => {
    const preds = m.prediction ? (Array.isArray(m.prediction) ? m.prediction : [m.prediction]) : []
    return (
      <div key={m.matchId} className={`${s.card} ${s.cardHover} cursor-pointer border-2 ${preds.length > 0 ? 'border-green-500/40' : 'border-white/10'}`}
        style={{ background: preds.length > 0 ? 'rgba(34,197,94,0.06)' : undefined }}>
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <span className={`${s.chip} bg-white/10 text-white/60`}>#{m.matchId}</span>
          <span className={`${s.chip} bg-orange-500/20 text-orange-400`}>{m.league}</span>
          {m.isHot && <span className={`${s.chip} bg-red-500/15 text-red-400`}>🔥 热门</span>}
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-white/90">{m.homeTeam}</span>
          <span className="text-xs text-white/30 px-2">VS</span>
          <span className="font-semibold text-white/90">{m.awayTeam}</span>
        </div>
        {preds.length > 0 ? (
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/45">预测结果</span>
              <span className="text-xs text-amber-400">{'★'.repeat(m.confidence || 3)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {preds.map(p => (
                <span key={p} className="text-xs font-medium px-3 py-1 rounded-md" style={predictionStyleMap[p]}>
                  {p}
                </span>
              ))}
            </div>
            {m.analysisNote && (
              <div className="mt-2 text-xs text-white/50 leading-relaxed">{m.analysisNote}</div>
            )}
          </div>
        ) : (
          <div className="pt-3 border-t border-white/10 text-center">
            <div className="text-xs text-white/35">尚未录入预测</div>
          </div>
        )}
      </div>
    )
  }

  const renderAnalysisCard = (a) => {
    const match = [...matches, ...selectedMatches].find(m => m.matchId === a.matchId)
    return (
      <div key={a.matchId} className={`${s.card} border-green-500/30`} style={{ background: 'rgba(34,197,94,0.04)' }}>
        <div className="flex items-center flex-wrap gap-2 mb-4">
          <span className={`${s.chip} bg-orange-500/20 text-orange-400`}>{match?.league}</span>
          <span className={`${s.chip} bg-white/10 text-white/55`}>#{a.matchId}</span>
        </div>
        <div className="text-base font-medium text-white/90 mb-4">
          {match?.homeTeam} <span className="text-xs text-white/30 mx-2">VS</span> {match?.awayTeam}
        </div>
        <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-400 text-sm">🤖 球之见逻辑分析</span>
          </div>
          <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{a.content}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={s.page}>
      {/* Header */}
      <header className={s.header}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-white/40 hover:text-white/70 text-sm transition-colors">
            ← 返回
          </button>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">球</span>
            <span className="font-semibold text-sm hidden sm:inline">球之见 - 球场迷雾，由此可见！</span>
            <span className="font-semibold text-sm sm:hidden">球之见</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Device toggle */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              网页版
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              手机版
            </button>
          </div>
          <span className={`${s.tag} ${s.greenTag}`}>体验模式</span>
        </div>
      </header>

      {deviceMode === 'desktop' ? (
        <>
          {/* Desktop Sidebar */}
          <nav className={s.sidebar}>
            <div className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => {
                    setPage(item.key)
                    if (!tourDone) {
                      tourRef.current?.destroy()
                      setTourDone(true)
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                    page === item.key
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                      : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Desktop Main Content */}
          <main className={s.main}>
            <DesktopContent
              page={page}
              matches={matches}
              selectedMatches={selectedMatches}
              analyses={analyses}
              renderMatchCard={renderMatchCard}
              renderPredictCard={renderPredictCard}
              renderAnalysisCard={renderAnalysisCard}
            />
          </main>
        </>
      ) : (
        /* Mobile View */
        <MobileView
          matches={matches}
          selectedMatches={selectedMatches}
          analyses={analyses}
          predictionStyleMap={predictionStyleMap}
          navItems={navItems}
        />
      )}
    </div>
  )
}

/* ===================== Desktop Content ===================== */
function DesktopContent({ page, matches, selectedMatches, analyses, renderMatchCard, renderPredictCard, renderAnalysisCard }) {
  const s_desktop = {
    card: 'bg-white/[0.05] border border-white/10 rounded-xl p-5',
    statBox: 'rounded-xl p-4',
    btn: 'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
    btnPrimary: 'bg-[#818cf8] text-white hover:bg-[#6d78f0]',
    btnGhost: 'border border-white/15 text-white/70 hover:bg-white/10',
    chip: 'text-xs px-2.5 py-1 rounded-md',
  }

  return (
    <>
      {/* Page: 赛事数据 */}
      {page === '1' && (
        <div className="space-y-6" id="demo-matches">
          <div className={s_desktop.card}>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: '今日比赛总数', value: matches.length, unit: '场', bg: 'bg-white/[0.06]', color: 'text-white/90' },
                { label: '已选重点比赛', value: selectedMatches.length, unit: '场', bg: 'bg-indigo-500/10 border border-indigo-500/20', color: 'text-indigo-300' },
                { label: '推荐选择', value: Math.min(6, matches.length), unit: '场', bg: 'bg-amber-500/8 border border-amber-500/20', color: 'text-amber-300' },
              ].map(stat => (
                <div key={stat.label} className={`${s_desktop.statBox} ${stat.bg}`}>
                  <div className="text-xs text-white/45 mb-2">{stat.label}</div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-medium ${stat.color}`}>{stat.value}</span>
                    <span className="text-sm text-white/40">{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button className={`${s_desktop.btn} ${s_desktop.btnGhost}`} disabled>🔄 抓取中...</button>
              <button className={`${s_desktop.btn} ${s_desktop.btnGhost}`}>⭐ 智能推荐</button>
              <button className={`${s_desktop.btn} ${s_desktop.btnPrimary}`}>✓ 保存选择</button>
            </div>
          </div>

          {matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {matches.map((m, i) => renderMatchCard(m, i))}
            </div>
          ) : (
            <div className={`${s_desktop.card} text-center py-12`}>
              <div className="text-4xl mb-4">⚽</div>
              <h3 className="text-white/65 text-base mb-2">暂无比赛数据</h3>
              <p className="text-white/35 text-sm">点击上方「抓取今日比赛数据」获取最新赛事信息</p>
            </div>
          )}
        </div>
      )}

      {/* Page: 选场预测 */}
      {page === '2' && (
        <div className="space-y-6" id="demo-predictions">
          <div className={s_desktop.card}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className={`${s_desktop.statBox} bg-indigo-500/10 border border-indigo-500/20`}>
                <div className="text-xs text-indigo-300 mb-1.5">重点比赛选择</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-medium text-indigo-300">{selectedMatches.length}</span>
                  <span className="text-sm text-indigo-400">场</span>
                  <span className="text-xs text-indigo-400/60 ml-2">建议选择 <strong className="text-indigo-300">{Math.min(6, selectedMatches.length)}</strong> 场</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className={`${s_desktop.btn} ${s_desktop.btnGhost}`}>⭐ 智能推荐</button>
                <button className={`${s_desktop.btn} ${s_desktop.btnPrimary}`}>✓ 保存选择</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {selectedMatches.map(m => renderPredictCard(m))}
          </div>
        </div>
      )}

      {/* Page: 辅助分析 */}
      {page === '3' && (
        <div className="space-y-6" id="demo-analysis">
          <div className={s_desktop.card}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <span className="text-indigo-300 text-xl">🤖</span>
                </div>
                <div>
                  <div className="font-medium text-white/90">球之见逻辑分析</div>
                  <div className="text-xs text-white/45 mt-0.5">基于比赛数据和预测，生成专业分析报告</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`${s_desktop.statBox} bg-indigo-500/10 border border-indigo-500/20`}>
                  <div className="text-xs text-indigo-300 mb-1">分析进度</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-medium text-indigo-300">{analyses.length}</span>
                    <span className="text-xs text-indigo-400">场</span>
                    <span className="text-xs text-indigo-400/50 ml-1">/ {selectedMatches.length} 场</span>
                  </div>
                </div>
                <button className={`${s_desktop.btn} ${s_desktop.btnPrimary}`}>⚡ 一键生成所有分析</button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {analyses.map(a => {
              const m = [...matches, ...selectedMatches].find(x => x.matchId === a.matchId)
              return (
                <div key={a.matchId}>
                  {renderAnalysisCard(a)}
                  {m && (
                    <div className="flex justify-end mt-2">
                      <SharePoster match={m} analysis={a} siteUrl={window.location.origin} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Page: 文案制作 */}
      {page === '4' && (
        <div className="space-y-6">
          <div className={s_desktop.card}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <span className="text-indigo-300 text-xl">📝</span>
              </div>
              <div>
                <div className="font-medium text-white/90">文案自动制作</div>
                <div className="text-xs text-white/45 mt-0.5">基于比赛分析和预测结果，自动生成自媒体推文</div>
              </div>
            </div>
          </div>

          {analyses.slice(0, 2).map(a => {
            const match = [...matches, ...selectedMatches].find(m => m.matchId === a.matchId)
            return (
              <div key={`copy-${a.matchId}`} className={s_desktop.card}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`${s_desktop.chip} bg-orange-500/20 text-orange-400`}>{match?.league}</span>
                  <span className="font-medium text-sm text-white/80">{match?.homeTeam} VS {match?.awayTeam}</span>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                    {'【比赛前瞻】' + match?.homeTeam + ' vs ' + match?.awayTeam + '\n' +
                     '联赛：' + match?.league + ' | 时间：' + match?.matchTime + '\n\n' +
                     '⚽ 比赛分析：' + match?.homeTeam + '近期状态出色，' + match?.awayTeam + '客场战斗力不容小觑。\n' +
                     '📊 数据模型显示，本场比赛预计进球数2-3球。\n' +
                     '💡 更多专业分析，尽在球之见智能分析系统。'}
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <button className={`${s_desktop.btn} ${s_desktop.btnGhost} text-xs`}>📋 复制文案</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

/* ===================== Mobile View ===================== */
const mobileNavItems = [
  { key: '1', label: '首页', icon: '🏠' },
  { key: '2', label: '公众号', icon: '📝' },
  { key: '3', label: '直播', icon: '🎙️' },
  { key: '4', label: '分析', icon: '🤖' },
]

// 近7日命中率模拟数据
const hitRateData = [
  { day: '4/24', rate: 75, total: 8, correct: 6 },
  { day: '4/25', rate: 62, total: 13, correct: 8 },
  { day: '4/26', rate: 80, total: 10, correct: 8 },
  { day: '4/27', rate: 55, total: 11, correct: 6 },
  { day: '4/28', rate: 71, total: 14, correct: 10 },
  { day: '4/29', rate: 66, total: 12, correct: 8 },
  { day: '4/30', rate: 83, total: 6, correct: 5 },
]

const wechatArticles = {
  M001: `#曼城VS阿森纳 #英超争冠 🔥

**英超天王山之战：曼城主场猎"枪"**

今晚22:00，伊蒂哈德球场迎来本赛季英超最关键的战役——榜首曼城对阵追赶者阿森纳。

**📊 赛前数据**
- 曼城主场5连胜，场均2.4球
- 阿森纳客场3胜2平，萨卡伤疑
- 盘口：主让半球中水

**🔍 球之见逻辑分析**
曼城的控制力在主场上半场尤其恐怖，近5个主场半场全部领先。阿森纳的防线在客场面对高压逼抢时失误率上升30%。

机构开出半球盘且水位持续下调，对主队信心明确。欧赔主胜集中在1.85区间，平赔高企至3.60以上，负赔离散。

**💡 推荐：主胜（胜）**
信心指数：★★★★

---

关注球之见，获取更多英超专业分析！ ⚽`,
  M002: `#巴萨VS皇马 #国家德比  🔥

**国家德比前瞻：诺坎普的荣誉之战**

今晚22:00，本赛季第二次国家德比在诺坎普上演。巴萨主场迎战皇马，双方仅差3分。

**📊 赛前数据**
- 巴萨主场4连胜，莱万状态回升
- 皇马客场4胜1平，贝林厄姆高效
- 盘口：平手

**🔍 球之见逻辑分析**
国家德比历来胶着。平手盘反映实力相当，但欧赔2.45-3.30-2.90的格局暗示巴萨略有利好。

值得注意的是，平赔低开至3.30，防范力度极强。近5次国家德比有3场战平，本场大概率延续这一趋势。

**💡 推荐：双选胜·平（主队不败）**
信心指数：★★★

---

关注球之见，获取更多西甲专业分析！ ⚽`,
}

const liveScripts = {
  M001: `【开场】
"好的各位观众朋友，欢迎来到球之见直播！

今晚焦点战——曼城 VS 阿森纳！英超天王山之战就在伊蒂哈德！"

【赛前】
"先看数据——曼城近10场联赛8胜2平，主场5连胜！哈兰德连续4场破门，状态火热！

阿森纳这边，6胜3平1负，客场3胜2平。但是——萨卡伤疑！这对阿森纳的边路进攻影响太大了！"

【盘口】
"盘口方面——主让半球中水，机构对曼城信心在增强！

欧赔主胜1.85，平赔3.60，负赔4.20。这个赔率格局，平赔顶得比较高啊！"

【预测】
"综合来看，曼城主场统治力太强了。

阿森纳客场硬仗能力一直是个问号，少了萨卡更是难上加难。

我看好曼城主场取胜！比分可能是2-0或2-1！"

【结尾】
"这是球之见为您带来的赛前分析，比赛将在22:00准时开始！

关注球之见，球场迷雾，由此可见！"`,

  M004: `【开场】
"朋友们晚上好！欢迎来到球之见直播间！

今晚德甲重头戏——拜仁慕尼黑 VS 多特蒙德！"

【赛前】
"来看数据——拜仁近10场9胜1平！主场全胜！凯恩34球领跑射手榜，这是要破纪录的节奏啊！

多特方面，5胜2平3负，客场2胜2平1负。问题在防线——场均失1.8球！

这个数据面对拜仁的进攻线，有点悬啊！"

【盘口】
"看看盘口——一球中低水！欧赔1.55-4.20-5.50！

拜仁这个主胜赔率，机构赔付控制得非常严格。一球盘深开低水，正路信号明确！"

【预测】
"实力碾压局！拜仁的主场——安联球场的恐怖气氛，多特的年轻球员能不能顶住？

我看好拜仁大胜！比分预测3-1或4-1！

凯恩今天可能又要进球了！"

【结尾】
"比赛将在21:30开始！锁定球之见直播，我们赛后再见！"`,
}

/* ---------- Mobile: 首页 ---------- */
function MobileHomePage() {
  const avgRate = Math.round(hitRateData.reduce((s, d) => s + d.rate, 0) / hitRateData.length)
  const totalCorrect = hitRateData.reduce((s, d) => s + d.correct, 0)
  const totalGames = hitRateData.reduce((s, d) => s + d.total, 0)

  return (
    <>
      {/* Microphone + Quick Stats */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-5 text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 cursor-pointer hover:scale-105 transition-transform active:scale-95">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </div>
        <p className="text-xs text-white/50 mb-1">点击话筒语音提问</p>
        <p className="text-sm text-white/70">"今晚有哪些重点比赛？"</p>
      </div>

      {/* 近7日命中率 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white/85">📈 近7日命中率</h3>
          <span className="text-xs text-green-400 font-medium">{avgRate}%</span>
        </div>
        <div className="bg-white/[0.05] border border-white/10 rounded-xl p-4">
          {/* Bar chart */}
          <div className="flex items-end justify-between gap-1.5 h-20 mb-3">
            {hitRateData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${d.rate}%`,
                    background: d.rate >= 70
                      ? 'linear-gradient(to top, rgba(34,197,94,0.6), rgba(34,197,94,0.3))'
                      : d.rate >= 60
                      ? 'linear-gradient(to top, rgba(250,204,21,0.6), rgba(250,204,21,0.3))'
                      : 'linear-gradient(to top, rgba(239,68,68,0.6), rgba(239,68,68,0.3))',
                  }}
                />
              </div>
            ))}
          </div>
          {/* Day labels */}
          <div className="flex justify-between gap-1.5">
            {hitRateData.map((d, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="text-[10px] text-white/40">{d.day}</div>
                <div className="text-[10px] font-medium text-white/70">{d.rate}%</div>
              </div>
            ))}
          </div>
          {/* Summary */}
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-medium text-white/85">{totalGames}</div>
              <div className="text-[10px] text-white/45">总推荐</div>
            </div>
            <div>
              <div className="text-lg font-medium text-green-400">{totalCorrect}</div>
              <div className="text-[10px] text-white/45">命中</div>
            </div>
            <div>
              <div className="text-lg font-medium text-amber-400">{avgRate}%</div>
              <div className="text-[10px] text-white/45">命中率</div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's matches preview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-white/85">⚽ 今日推荐比赛</h3>
          <span className="text-[10px] text-indigo-400">查看全部 →</span>
        </div>
        <div className="space-y-2">
          {[
            { league: '英超', home: '曼彻斯特城', away: '阿森纳', time: '22:00', hot: true },
            { league: '西甲', home: '巴塞罗那', away: '皇家马德里', time: '22:00', hot: true },
            { league: '德甲', home: '拜仁慕尼黑', away: '多特蒙德', time: '21:30', hot: false },
          ].map((m, i) => (
            <div key={i} className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 shrink-0">{m.league}</span>
              <div className="flex-1 flex items-center justify-between min-w-0">
                <span className="text-xs text-white/80 truncate">{m.home}</span>
                <span className="text-[10px] text-white/30 mx-1">VS</span>
                <span className="text-xs text-white/80 truncate">{m.away}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-white/40">{m.time}</span>
                {m.hot && <span className="text-[10px]">🔥</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ---------- Mobile: 公众号 ---------- */
function MobileWechatPage({ analyses, matches, selectedMatches, copiedIdx, onCopy }) {
  const allMatches = [...matches, ...selectedMatches]
  const [selectedMatchId, setSelectedMatchId] = useState('M001')
  const [generated, setGenerated] = useState(false)

  const matchList = [
    { id: 'M001', league: '英超', home: '曼彻斯特城', away: '阿森纳' },
    { id: 'M002', league: '西甲', home: '巴塞罗那', away: '皇家马德里' },
    { id: 'M004', league: '德甲', home: '拜仁慕尼黑', away: '多特蒙德' },
  ]

  const content = wechatArticles[selectedMatchId] || ''

  return (
    <>
      <div className="bg-white/[0.05] border border-white/10 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📝</span>
          <div>
            <div className="text-sm font-medium text-white/85">公众号文案生成</div>
            <div className="text-[10px] text-white/45">AI自动生成公众号推文</div>
          </div>
        </div>
        {/* Match selector */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto">
          {matchList.map(m => (
            <button
              key={m.id}
              onClick={() => { setSelectedMatchId(m.id); setGenerated(false) }}
              className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${
                selectedMatchId === m.id
                  ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                  : 'bg-white/[0.03] text-white/50 border-white/10 hover:bg-white/[0.06]'
              }`}
            >
              {m.league} {m.home}
            </button>
          ))}
        </div>
        <button
          onClick={() => setGenerated(true)}
          className="w-full py-2.5 rounded-xl text-[11px] font-medium bg-[#818cf8] text-white hover:bg-[#6d78f0] transition-all"
        >
          ✨ 生成公众号文案
        </button>
      </div>

      {generated && content && (
        <div className="bg-white/[0.05] border border-white/10 rounded-xl overflow-hidden">
          {/* WeChat article preview header */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white font-bold">球</span>
              <span className="text-xs font-medium text-white/80">球之见</span>
            </div>
            <h4 className="text-sm font-bold text-white/90 leading-snug">
              {selectedMatchId === 'M001' ? '英超天王山之战：曼城主场猎"枪"' :
               selectedMatchId === 'M002' ? '国家德比前瞻：诺坎普的荣誉之战' :
               '德甲巅峰对决：拜仁主场势不可挡'}
            </h4>
          </div>
          <div className="p-4">
            <div className="text-[13px] text-white/75 leading-relaxed whitespace-pre-wrap font-[system-ui]">{content}</div>
          </div>
          <div className="px-4 pb-4">
            <button
              onClick={() => onCopy(content, 0)}
              className="w-full py-2.5 rounded-xl text-[11px] font-medium border border-white/15 text-white/50 hover:bg-white/5 transition-all"
            >
              {copiedIdx === 0 ? '✓ 已复制' : '📋 复制全文'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* ---------- Mobile: 直播 ---------- */
function MobileLivePage({ analyses, matches, selectedMatches, copiedIdx, onCopy }) {
  const [selectedMatchId, setSelectedMatchId] = useState('M001')
  const [generated, setGenerated] = useState(false)

  const matchList = [
    { id: 'M001', league: '英超', home: '曼彻斯特城', away: '阿森纳' },
    { id: 'M004', league: '德甲', home: '拜仁慕尼黑', away: '多特蒙德' },
  ]

  const content = liveScripts[selectedMatchId] || ''

  return (
    <>
      <div className="bg-white/[0.05] border border-white/10 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎙️</span>
          <div>
            <div className="text-sm font-medium text-white/85">直播文案生成</div>
            <div className="text-[10px] text-white/45">AI一键生成直播解说脚本</div>
          </div>
        </div>
        {/* Match selector */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto">
          {matchList.map(m => (
            <button
              key={m.id}
              onClick={() => { setSelectedMatchId(m.id); setGenerated(false) }}
              className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${
                selectedMatchId === m.id
                  ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                  : 'bg-white/[0.03] text-white/50 border-white/10 hover:bg-white/[0.06]'
              }`}
            >
              {m.league} {m.home}
            </button>
          ))}
        </div>
        <button
          onClick={() => setGenerated(true)}
          className="w-full py-2.5 rounded-xl text-[11px] font-medium bg-[#818cf8] text-white hover:bg-[#6d78f0] transition-all"
        >
          🎬 生成直播脚本
        </button>
      </div>

      {generated && content && (
        <div className="bg-white/[0.05] border border-amber-500/20 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600/15 to-orange-600/15 px-4 py-3 border-b border-amber-500/20 flex items-center gap-2">
            <span className="text-sm">🔴</span>
            <span className="text-xs font-medium text-amber-300">LIVE · 直播脚本</span>
            <span className="text-[10px] text-white/40 ml-auto">
              {selectedMatchId === 'M001' ? '曼城 vs 阿森纳' : '拜仁 vs 多特蒙德'}
            </span>
          </div>
          <div className="p-4">
            <div className="text-[13px] text-white/75 leading-relaxed whitespace-pre-wrap">{content}</div>
          </div>
          <div className="px-4 pb-4">
            <button
              onClick={() => onCopy(content, 0)}
              className="w-full py-2.5 rounded-xl text-[11px] font-medium border border-white/15 text-white/50 hover:bg-white/5 transition-all"
            >
              {copiedIdx === 0 ? '✓ 已复制' : '📋 复制脚本'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* ---------- Mobile: 分析 ---------- */
function MobileAnalysisPage({ analyses, matches, selectedMatches }) {
  const allMatches = [...matches, ...selectedMatches]
  const [expandedId, setExpandedId] = useState(null)

  return (
    <>
      <div className="bg-white/[0.05] border border-white/10 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🤖</span>
          <div>
            <div className="text-sm font-medium text-white/85">辅助分析</div>
            <div className="text-[10px] text-white/45">AI 球之见逻辑分析引擎</div>
          </div>
        </div>
      </div>

      {/* Analysis menu items */}
      <div className="space-y-2">
        <div className="bg-white/[0.05] border border-white/10 rounded-xl p-3 flex items-center gap-3">
          <span className="text-lg">📊</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-white/85">基本面分析</div>
            <div className="text-[10px] text-white/45">球队状态、交锋记录、伤停信息</div>
          </div>
          <span className="text-indigo-400 text-[10px]">3场可用</span>
        </div>
        <div className="bg-white/[0.05] border border-white/10 rounded-xl p-3 flex items-center gap-3">
          <span className="text-lg">📈</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-white/85">盘口解析</div>
            <div className="text-[10px] text-white/45">赔率变化、水位走势、盘口对比</div>
          </div>
          <span className="text-indigo-400 text-[10px]">3场可用</span>
        </div>
        <div className="bg-white/[0.05] border border-white/10 rounded-xl p-3 flex items-center gap-3">
          <span className="text-lg">🧮</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-white/85">数据模型</div>
            <div className="text-[10px] text-white/45">进球数预测、控球率、射门比</div>
          </div>
          <span className="text-indigo-400 text-[10px]">3场可用</span>
        </div>
      </div>

      {/* Detailed analyses (expandable) */}
      <div className="space-y-3">
        {analyses.map(a => {
          const match = allMatches.find(m => m.matchId === a.matchId)
          const isExpanded = expandedId === a.matchId
          return (
            <div key={a.matchId}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : a.matchId)}
                className="w-full bg-white/[0.05] border border-green-500/20 rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 shrink-0">{match?.league}</span>
                  <span className="text-xs text-white/80 truncate">{match?.homeTeam} VS {match?.awayTeam}</span>
                </div>
                <span className={`text-white/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {isExpanded && (
                <div className="bg-green-500/5 border-x border-b border-green-500/20 rounded-b-xl p-3 -mt-1">
                  <div className="text-[12px] text-white/70 leading-relaxed whitespace-pre-wrap">{a.content}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

function MobileView({ matches, selectedMatches, analyses, predictionStyleMap, navItems }) {
  const [tab, setTab] = useState('1')
  const [copiedIdx, setCopiedIdx] = useState(null)

  const handleCopy = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      {/* Phone Frame */}
      <div className="relative w-[390px] h-[calc(100vh-6rem)] max-h-[820px] min-h-[700px] bg-[#0a0a1a] rounded-[3rem] border border-white/15 shadow-[0_0_80px_rgba(99,102,241,0.08)] overflow-hidden flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0a0a1a] rounded-b-2xl z-10 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-16 h-1.5 rounded-full bg-white/30" />
        </div>

        {/* Mobile Status Bar */}
        <div className="pt-8 px-6 pb-2 flex items-center justify-between text-[11px] text-white/40 shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 9l4 4-4 4" /><path d="M7 17l4-8 4 8" /><path d="M15 17l4-4-4-4" />
            </svg>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="10" rx="1" />
              <rect x="4" y="9" width="16" height="6" rx="1" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Mobile App Header */}
        <div className="px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold">球</span>
            <span className="text-sm font-semibold text-white/90">球之见</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">体验模式</span>
        </div>

        {/* Mobile Content (scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-4 scroll-smooth">
          {tab === '1' && <MobileHomePage />}
          {tab === '2' && (
            <MobileWechatPage
              analyses={analyses}
              matches={matches}
              selectedMatches={selectedMatches}
              copiedIdx={copiedIdx}
              onCopy={handleCopy}
            />
          )}
          {tab === '3' && (
            <MobileLivePage
              analyses={analyses}
              matches={matches}
              selectedMatches={selectedMatches}
              copiedIdx={copiedIdx}
              onCopy={handleCopy}
            />
          )}
          {tab === '4' && (
            <MobileAnalysisPage analyses={analyses} matches={matches} selectedMatches={selectedMatches} />
          )}
        </div>

        {/* Bottom Tab Bar */}
        <div className="shrink-0 border-t border-white/10 bg-[#0a0a1a]/95 backdrop-blur-md px-2 pb-5 pt-1.5">
          <div className="flex items-center justify-around">
            {mobileNavItems.map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all min-w-0 ${
                  tab === item.key
                    ? 'text-indigo-300'
                    : 'text-white/35 hover:text-white/55'
                }`}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
