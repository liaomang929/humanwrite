import { useRef, useState, useEffect, useCallback } from 'react'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'

const kellyColor = (v) => {
  if (v > 0.05) return '#4ade80'   // green — value
  if (v > 0)    return '#facc15'    // yellow — slight edge
  if (v > -0.05) return '#fb923c'  // orange — slight negative
  return '#f87171'                  // red — no value
}

const kellyLabel = (v) => {
  if (v > 0.1) return '高价值'
  if (v > 0.05) return '有价值'
  if (v > 0) return '微利'
  if (v > -0.05) return '偏低'
  return '无价值'
}

function calcKelly(odds) {
  // Normalised implied probability per outcome
  const implied = odds.map(o => 1 / o)
  const total = implied.reduce((a, b) => a + b, 0)
  return odds.map((o, i) => {
    const fairP = implied[i] / total
    // Kelly fraction = (fairP * odds - 1) / (odds - 1)
    return (fairP * o - 1) / (o - 1)
  })
}

const STYLES = {
  wrapper: {
    position: 'absolute',
    left: '-9999px',
    top: 0,
    width: 640,
    background: '#0a0a1a',
    padding: '32px 28px',
    fontFamily: '"PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif',
    color: '#e8e8ed',
    lineHeight: 1.5,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))',
    color: '#a5b4fc',
    border: '1px solid rgba(99,102,241,0.3)',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 4,
  },
  matchInfo: {
    fontSize: 14,
    color: '#888899',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#888899',
    textTransform: 'uppercase' ,
    letterSpacing: '0.05em',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  oddsRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
  },
  oddsCell: {
    flex: 1,
    padding: '12px 8px',
    borderRadius: 10,
    textAlign: 'center',
  },
  oddsLabel: {
    fontSize: 11,
    color: '#555566',
    marginBottom: 4,
  },
  oddsValue: {
    fontSize: 20,
    fontWeight: 700,
  },
  conclusionBox: {
    background: 'rgba(34,197,94,0.06)',
    border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 1.7,
    marginBottom: 24,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    paddingTop: 20,
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  },
}

export default function SharePoster({ match, analysis, siteUrl }) {
  const posterRef = useRef(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [capturing, setCapturing] = useState(false)

  const odds = [
    parseFloat(match.oddsWin) || 0,
    parseFloat(match.oddsDraw) || 0,
    parseFloat(match.oddsLoss) || 0,
  ]
  const kelly = calcKelly(odds)

  const handicapOdds = [
    parseFloat(match.handicapWin) || 0,
    parseFloat(match.handicapDraw) || 0,
    parseFloat(match.handicapLoss) || 0,
  ]

  // Extract conclusion from analysis content (everything after 【推荐结论】)
  const extractConclusion = (content) => {
    if (!content) return match.analysisNote || ''
    const idx = content.indexOf('【推荐结论】')
    if (idx !== -1) {
      return content.slice(idx + 6).trim()
    }
    return match.analysisNote || content.slice(0, 120) + '...'
  }

  const conclusion = extractConclusion(analysis?.content || '')

  useEffect(() => {
    QRCode.toDataURL(siteUrl, {
      width: 120,
      margin: 1,
      color: { dark: '#e8e8ed', light: '#0a0a1a' },
    }).then(setQrDataUrl).catch(() => {})
  }, [siteUrl])

  const generatePoster = useCallback(async () => {
    if (!posterRef.current) return
    setCapturing(true)
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a1a',
        allowTaint: false,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `球之见-${match.homeTeam}-vs-${match.awayTeam}-复盘.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Poster generation failed', err)
    } finally {
      setCapturing(false)
    }
  }, [match])

  const oddsLabels = ['胜', '平', '负']
  const oddsColors = ['#f87171', '#c084fc', '#60a5fa']
  const oddsBgs = [
    'rgba(239,68,68,0.12)',
    'rgba(168,85,247,0.12)',
    'rgba(59,130,246,0.12)',
  ]
  const hLabels = ['让胜', '让平', '让负']
  const hColors = ['#4ade80', '#fb923c', '#22d3ee']
  const hBgs = [
    'rgba(34,197,94,0.08)',
    'rgba(251,146,60,0.08)',
    'rgba(6,182,212,0.08)',
  ]

  return (
    <>
      {/* Hidden poster */}
      <div ref={posterRef} style={STYLES.wrapper}>
        {/* Logo + Title */}
        <div style={STYLES.badge}>
          <span>🏆</span>
          <span>球之见 · 赛事复盘报告</span>
        </div>

        {/* Match header */}
        <div style={STYLES.title}>
          {match.homeTeam} <span style={{ color: '#555566', fontSize: 16 }}>VS</span> {match.awayTeam}
        </div>
        <div style={STYLES.matchInfo}>
          {match.league} | {match.matchTime}
        </div>

        {/* 欧赔对比 */}
        <div style={STYLES.sectionTitle}>📊 欧赔对比</div>
        <div style={STYLES.oddsRow}>
          {odds.map((v, i) => (
            <div key={`eo-${i}`} style={{ ...STYLES.oddsCell, background: oddsBgs[i] }}>
              <div style={{ ...STYLES.oddsLabel }}>{oddsLabels[i]}</div>
              <div style={{ ...STYLES.oddsValue, color: oddsColors[i] }}>{v.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* 亚盘对比 */}
        <div style={STYLES.sectionTitle}>📈 亚盘对比</div>
        {match.handicapLine && (
          <div style={{ fontSize: 12, color: '#555566', marginBottom: 8 }}>
            盘口：{match.handicapLine}
          </div>
        )}
        <div style={STYLES.oddsRow}>
          {handicapOdds.map((v, i) => (
            <div key={`ho-${i}`} style={{ ...STYLES.oddsCell, background: hBgs[i] }}>
              <div style={{ ...STYLES.oddsLabel }}>{hLabels[i]}</div>
              <div style={{ ...STYLES.oddsValue, color: hColors[i] }}>{v.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* 凯利指数 */}
        <div style={STYLES.sectionTitle}>🧮 凯利指数</div>
        <div style={STYLES.oddsRow}>
          {kelly.map((v, i) => (
            <div key={`kf-${i}`} style={{ ...STYLES.oddsCell, background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ ...STYLES.oddsLabel }}>{oddsLabels[i]}</div>
              <div style={{ ...STYLES.oddsValue, color: kellyColor(v), fontSize: 18 }}>
                {v >= 0 ? '+' : ''}{v.toFixed(2)}
              </div>
              <div style={{ fontSize: 10, color: kellyColor(v), marginTop: 2 }}>{kellyLabel(v)}</div>
            </div>
          ))}
        </div>

        {/* 最终逻辑结论 */}
        <div style={STYLES.sectionTitle}>💡 最终逻辑结论</div>
        <div style={STYLES.conclusionBox}>
          {conclusion || '暂无分析结论'}
        </div>

        {/* Footer: Logo + QR */}
        <div style={STYLES.footer}>
          <div style={STYLES.logo}>球</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#e8e8ed', marginBottom: 2 }}>球之见</div>
            <div style={{ fontSize: 12, color: '#555566' }}>球场迷雾，由此可见！</div>
          </div>
          {qrDataUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <img src={qrDataUrl} alt="QR" width={72} height={72} style={{ borderRadius: 6 }} />
              <span style={{ fontSize: 10, color: '#555566' }}>扫码关注</span>
            </div>
          )}
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={generatePoster}
        disabled={capturing}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/15 text-white/70 hover:bg-white/10 disabled:opacity-50"
      >
        {capturing ? (
          <>⏳ 生成中...</>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            分享海报
          </>
        )}
      </button>
    </>
  )
}
