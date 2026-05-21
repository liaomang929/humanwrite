import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

const PAGE_LABELS = {
  '/': '门户首页',
  '/lab': '逻辑透镜',
  '/demo/classicore': '典萃',
  '/demo/aicleaner': '净言',
  '/demo/fansvote': '私域粉丝投票',
  '/terms': '用户协议',
  '/privacy': '隐私政策',
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
  .st-wrap { min-height:100vh; background:#0a0a0f; color:#f0eeff; font-family:'DM Sans',sans-serif; -webkit-font-smoothing:antialiased; padding:2rem clamp(1rem,4vw,2.5rem) 3rem; }
  .st-inner { max-width:960px; margin:0 auto; }
  .st-h1 { font-family:'Syne',sans-serif; font-size:clamp(1.5rem,3vw,2rem); font-weight:800; letter-spacing:-.03em; margin-bottom:.35rem; }
  .st-sub { font-size:13px; color:#8b85a8; margin-bottom:2rem; }
  .st-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; margin-bottom:2rem; }
  .st-card { background:#111118; border:1px solid rgba(255,255,255,.07); border-radius:16px; padding:1.25rem; }
  .st-num { font-family:'Syne',sans-serif; font-size:2rem; font-weight:800; letter-spacing:-.03em; line-height:1; margin-bottom:4px; }
  .st-lbl { font-size:11px; color:#4a4666; letter-spacing:.06em; text-transform:uppercase; }
  .st-sec-title { font-family:'Syne',sans-serif; font-size:1rem; font-weight:700; margin-bottom:1rem; color:#f0eeff; }
  .st-chart { display:flex; align-items:flex-end; gap:6px; height:120px; margin-bottom:2rem; padding-top:1rem; border-bottom:1px solid rgba(255,255,255,.07); }
  .st-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; min-width:0; }
  .st-bar { width:100%; max-width:32px; border-radius:4px 4px 0 0; background:linear-gradient(180deg,#7c6ef0,#4ecfb3); min-height:4px; transition:height .3s; }
  .st-bar-lbl { font-size:9px; color:#4a4666; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }
  .st-table { width:100%; border-collapse:collapse; font-size:13px; }
  .st-table th { text-align:left; font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:#4a4666; padding:8px 12px; border-bottom:1px solid rgba(255,255,255,.07); }
  .st-table td { padding:10px 12px; border-bottom:1px solid rgba(255,255,255,.05); color:#8b85a8; }
  .st-table td:first-child { color:#f0eeff; font-weight:500; }
  .st-table tr:hover td { background:rgba(255,255,255,.02); }
  .st-err { text-align:center; padding:4rem 1rem; color:#8b85a8; }
  .st-err code { display:block; margin-top:1rem; font-size:12px; color:#7c6ef0; background:rgba(124,110,240,.1); padding:8px 14px; border-radius:8px; }
  .st-updated { font-size:11px; color:#4a4666; margin-top:2rem; text-align:center; }
`

function labelForPath(path) {
  return PAGE_LABELS[path] || path
}

export default function StatsPage() {
  const [params] = useSearchParams()
  const key = params.get('key') || ''
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  usePageMeta({
    title: '访问统计',
    description: 'Blake Pierce 门户访问统计',
  })

  useEffect(() => {
    let el = document.querySelector('meta[name="robots"]')
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('name', 'robots')
      document.head.appendChild(el)
    }
    el.setAttribute('content', 'noindex, nofollow')
    return () => { el?.remove() }
  }, [])

  useEffect(() => {
    if (!key) {
      setError('缺少访问密钥')
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/analytics/stats?key=${encodeURIComponent(key)}`)
      .then(r => {
        if (!r.ok) throw new Error(r.status === 403 ? '密钥无效' : '加载失败')
        return r.json()
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [key])

  const maxPv = data?.daily?.length
    ? Math.max(...data.daily.map(d => d.pv), 1)
    : 1

  return (
    <>
      <style>{STYLES}</style>
      <div className="st-wrap">
        <div className="st-inner">
          {loading && <div className="st-err">加载中…</div>}

          {!loading && error && (
            <div className="st-err">
              <p>{error}</p>
              <code>https://www.blakeai.cn/stats?key=你的密钥</code>
            </div>
          )}

          {!loading && data && (
            <>
              <h1 className="st-h1">访问统计</h1>
              <p className="st-sub">Blake Pierce 门户 · 全站 PV / UV · 仅你可见</p>

              <div className="st-grid">
                {[
                  { num: data.today.pv, lbl: '今日 PV' },
                  { num: data.today.uv, lbl: '今日 UV' },
                  { num: data.yesterday.pv, lbl: '昨日 PV' },
                  { num: data.yesterday.uv, lbl: '昨日 UV' },
                  { num: data.week.pv, lbl: '7 日 PV' },
                  { num: data.week.uv, lbl: '7 日 UV' },
                  { num: data.month.pv, lbl: '30 日 PV' },
                  { num: data.month.uv, lbl: '30 日 UV' },
                ].map(s => (
                  <div key={s.lbl} className="st-card">
                    <div className="st-num">{s.num.toLocaleString()}</div>
                    <div className="st-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>

              <div className="st-sec-title">近 14 天趋势</div>
              <div className="st-chart">
                {data.daily.map(d => (
                  <div key={d.date} className="st-bar-col" title={`${d.date}: PV ${d.pv} / UV ${d.uv}`}>
                    <div className="st-bar" style={{ height: `${Math.max(4, (d.pv / maxPv) * 100)}%` }} />
                    <div className="st-bar-lbl">{d.date.slice(5)}</div>
                  </div>
                ))}
              </div>

              <div className="st-sec-title">页面分布（近 30 天）</div>
              <table className="st-table">
                <thead>
                  <tr><th>页面</th><th>PV</th><th>UV</th></tr>
                </thead>
                <tbody>
                  {data.pages.map(row => (
                    <tr key={row.path}>
                      <td>{labelForPath(row.path)}<span style={{ color: '#4a4666', fontSize: 11, marginLeft: 8 }}>{row.path}</span></td>
                      <td>{row.pv.toLocaleString()}</td>
                      <td>{row.uv.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="st-updated">更新于 {new Date(data.updated_at).toLocaleString('zh-CN')}</div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
