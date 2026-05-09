import { useState, useEffect, useCallback, useMemo } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { usePageMeta } from './hooks/usePageMeta'
import ClassicoreDemo from './demo/ClassicoreDemo'
import AiCleanerDemo from './demo/AiCleanerDemo'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'

// ── Constants ──────────────────────────────────────────────

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
  { id: 'products', label: '全部产品' },
]

const PRODUCTS = [
  {
    id: 'aicleaner',
    title: '净言',
    subtitle: 'AI Cleaner',
    tagline: '把AI写的东西，改得像真人',
    tags: ['去AI味', '文案优化', '更像真人', '免费使用'],
    description: '一键优化表达，去掉AI味。让你的内容更自然、更适合在微信等社交场景传播。',
    demoPath: '/demo/aicleaner',
    isFree: true,
    accent: 'from-emerald-500 to-teal-500',
    glowColor: 'rgba(16,185,129,0.12)',
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
        <path d="M20 4L23 17L36 20L23 23L20 36L17 23L4 20L17 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'classicore',
    title: '拆书',
    subtitle: 'ClassiCore',
    tagline: '一本书，直接变成你的内容素材',
    tags: ['内容拆解', '知识提炼', '快速输出', '素材生成'],
    description: '上传书籍内容，自动拆解重点。快速生成可复用的内容结构与表达。',
    demoPath: '/demo/classicore',
    accent: 'from-cyan-500 to-teal-500',
    glowColor: 'rgba(0,206,201,0.12)',
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

const TODAY_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }

// ── Helpers ────────────────────────────────────────────────

const getLeagueKey = (modelId) => modelId?.split('_')[0] ?? null
const pct = (v) => `${v.toFixed(1)}%`

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
}

function SignalStrength({ probs, prediction }) {
  const key = prediction === '主胜' ? 'home' : prediction === '平局' ? 'draw' : 'away'
  const prob = probs?.[key] ?? 0
  const active = prob >= 45 ? 4 : prob >= 35 ? 3 : prob >= 25 ? 2 : 1
  const label = ['', '弱', '中', '强', '很强'][active]
  const heights = [4, 7, 10, 13]
  return (
    <div className="sig-wrap">
      <span className="sig-label">信号</span>
      <div className="sig-bars">
        {heights.map((h, i) => (
          <div key={i} className={`sig-bar ${i < active ? 'on' : 'off'}`} style={{ height: `${h}px` }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{label}</span>
    </div>
  )
}

function ProbBars({ probs }) {
  if (!probs) return null
  const items = [
    { label: '主胜', key: 'home', cls: 'red' },
    { label: '平局', key: 'draw', cls: 'amber' },
    { label: '客胜', key: 'away', cls: 'blue' },
  ]
  return (
    <>
      {items.map(({ label, key, cls }) => (
        <div className="pb-row" key={key}>
          <span className="pb-label">{label}</span>
          <div className="pb-track">
            <div className={`pb-fill ${cls}`} style={{ width: `${Math.max(probs[key], 2)}%` }} />
          </div>
          <span className="pb-pct">{pct(probs[key])}</span>
        </div>
      ))}
    </>
  )
}

function LeagueBadge({ label }) {
  return <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-500 rounded">{label}</span>
}

// ── Payment Modal ──────────────────────────────────────────

function PaymentModal({ isOpen, onClose }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 max-w-sm w-full shadow-2xl mx-auto max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center mb-3">
          <h3 className="text-base font-bold text-gray-900">解锁今日全部比赛数据</h3>
          <p className="text-xs text-gray-500 mt-0.5">开通后，可查看今日全部比赛的概率</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg py-2.5 px-3 mb-3 text-center border border-amber-100">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-[10px] text-amber-600 font-medium">⏱ 5月限时优惠</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-400 line-through">￥99</span>
            <span className="text-xl font-bold text-gray-900">￥19</span>
            <span className="text-xs text-gray-400">/ 月</span>
          </div>
          <p className="text-[10px] text-amber-500 mt-0.5">6月恢复原价，抓紧开通</p>
        </div>
        <div className="space-y-2 mb-3">
          {[
            ['微信扫码支付 19元', '保存下方二维码图片,微信扫码支付,备注[重要]:手机号'],
            ['5分钟内开通权限', '开通后可查看全部比赛分析'],
            ['点击首页"三"汉堡按钮', '输入已开通手机号授权即可'],
          ].map(([title, desc], i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${i === 2 ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
                {i + 1}
              </span>
              <div>
                <p className="text-xs font-medium text-gray-900">{title}</p>
                <p className="text-[11px] text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-lg py-3 mb-2 text-center border border-dashed border-gray-200">
          <img src="/456.jpg" alt="微信收款码" className="w-28 h-28 mx-auto rounded-lg object-contain" />
          <p className="text-[10px] text-gray-400 mt-1">微信扫码支付 19元</p>
        </div>
        <p className="text-[11px] text-gray-400 text-center mb-3">如开通遇到任何问题，请加微信：lmloveac</p>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg transition-all">
          立即开通获取全部数据权限
        </button>
        <p className="text-[9px] text-gray-400 text-center mt-2 leading-relaxed">
          本平台仅提供体育赛事数据分析与研究，不构成任何投注建议。
        </p>
      </div>
    </div>
  )
}

function PurchaseModal({ isOpen, onClose }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl mx-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 8l10 6 10-6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">了解商业版</h3>
          <p className="text-gray-500 text-sm leading-relaxed">如需了解商业版功能与定价，请通过以下方式联系我们</p>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-bold text-sm">QQ</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">QQ 号码</p>
              <p className="text-base font-semibold text-gray-900">68419964</p>
            </div>
            <button onClick={() => { navigator.clipboard?.writeText('68419964'); alert('QQ 号已复制') }} className="ml-auto shrink-0 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
              复制
            </button>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <span className="text-green-600 font-bold text-sm">微</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">微信号</p>
              <p className="text-base font-semibold text-gray-900">lmloveac</p>
            </div>
            <button onClick={() => { navigator.clipboard?.writeText('lmloveac'); alert('微信号已复制') }} className="ml-auto shrink-0 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100">
              复制
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mb-5">添加好友时请备注「商业版」，我们将尽快与您联系</p>
        <button onClick={onClose} className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg transition-all">
          知道了
        </button>
      </div>
    </div>
  )
}

function PhoneBindModal({ isOpen, onClose, vipPhone, onBind }) {
  const [input, setInput] = useState(vipPhone || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  if (!isOpen) return null
  const handleBind = async () => {
    if (!input.trim()) return
    setLoading(true); setResult(null)
    try {
      const r = await fetch(`/api/logiclens/vip/status?phone=${encodeURIComponent(input.trim())}`)
      const d = await r.json()
      if (d.vip) { setResult('success'); onBind(input.trim()) }
      else { setResult('notfound') }
    } catch { setResult('error') }
    finally { setLoading(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white border border-gray-200 rounded-2xl p-5 max-w-sm w-full shadow-2xl mx-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <h3 className="text-base font-bold text-gray-900 mb-1">会员绑定</h3>
        <p className="text-xs text-gray-400 mb-4">输入你开通时提供的手机号，解锁全部分析</p>
        <input type="tel" placeholder="请输入手机号" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 mb-3" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleBind()} />
        {result === 'notfound' && <p className="text-xs text-red-400 mb-3">该手机号未开通会员，请联系管理员</p>}
        {result === 'error' && <p className="text-xs text-red-400 mb-3">验证失败，请重试</p>}
        {result === 'success' && <p className="text-xs text-emerald-600 mb-3">✅ 绑定成功，已解锁全部分析</p>}
        <button onClick={handleBind} disabled={loading || !input.trim()} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-40 transition-all">
          {loading ? '验证中...' : '绑定解锁'}
        </button>
      </div>
    </div>
  )
}

// ── App ─────────────────────────────────────────────────────

export default function App() {
  return (
    <Routes>
      <Route path="/demo/classicore" element={<ClassicoreDemo />} />
      <Route path="/demo/aicleaner" element={<AiCleanerDemo />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/*" element={<LandingPage />} />
    </Routes>
  )
}

// ── Admin Page ──────────────────────────────────────────────

const ADMIN_PASSWORD = 'admin123'

function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [users, setUsers] = useState([])
  const [phone, setPhone] = useState('')
  const [days, setDays] = useState(30)
  const [remark, setRemark] = useState('')
  const [msg, setMsg] = useState('')

  const fetchUsers = useCallback(() => {
    fetch('/api/logiclens/vip/list')
      .then(r => r.json())
      .then(d => setUsers(d.users || []))
      .catch(() => {})
  }, [])

  useEffect(() => { if (authed) fetchUsers() }, [authed, fetchUsers])

  const activate = async () => {
    if (!phone || !days) return
    setMsg('')
    try {
      const r = await fetch('/api/logiclens/vip/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, days, remark: remark || undefined }),
      })
      const d = await r.json()
      if (d.ok) {
        setMsg(`✅ 开通成功，到期时间: ${new Date(d.expires_at).toLocaleDateString('zh-CN')}`)
        setPhone(''); setDays(30); setRemark('')
        fetchUsers()
      } else { setMsg(`❌ ${d.error}`) }
    } catch { setMsg('❌ 请求失败') }
  }

  const deactivate = async (phone) => {
    if (!confirm(`确定要停用 ${phone} 吗？`)) return
    await fetch(`/api/logiclens/vip/deactivate?phone=${encodeURIComponent(phone)}`)
    fetchUsers()
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-sm w-full">
          <h1 className="text-lg font-bold text-gray-900 mb-1">管理员登录</h1>
          <p className="text-xs text-gray-400 mb-4">VIP 会员管理系统</p>
          <input type="password" placeholder="请输入管理员密码" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm mb-3 outline-none focus:border-blue-400" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && pw === ADMIN_PASSWORD && setAuthed(true)} />
          <button onClick={() => pw === ADMIN_PASSWORD ? setAuthed(true) : alert('密码错误')} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-all">登录</button>
          <Link to="/" className="block text-center text-xs text-gray-400 mt-3 hover:text-gray-600">← 返回首页</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">VIP 会员管理</h1>
          <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">← 返回首页</Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">开通会员</h2>
          <div className="flex gap-2 mb-2">
            <input placeholder="手机号" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400" value={phone} onChange={e => setPhone(e.target.value)} />
            <input type="number" min={1} className="w-20 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 text-center" value={days} onChange={e => setDays(Number(e.target.value))} />
            <span className="text-xs text-gray-400 self-center">天</span>
          </div>
          <input placeholder="备注（微信号，选填）" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 mb-3" value={remark} onChange={e => setRemark(e.target.value)} />
          {msg && <p className="text-xs mb-3">{msg}</p>}
          <button onClick={activate} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg transition-all">开通 {days} 天</button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">会员列表</h2>
          {users.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">暂无会员</p>
          ) : (
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{u.phone}</p>
                    <p className="text-xs text-gray-400">{u.remark && <span>{u.remark} · </span>}到期: {new Date(u.expires_at).toLocaleDateString('zh-CN')}{!u.active && <span className="text-red-400 ml-1">(已停用)</span>}</p>
                  </div>
                  {u.active && <button onClick={() => deactivate(u.phone)} className="shrink-0 px-2.5 py-1 text-[10px] font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100">停用</button>}
                </div>
              ))}
            </div>
          )}
          <button onClick={fetchUsers} className="w-full mt-3 py-2 rounded-xl text-xs font-medium text-gray-500 bg-gray-50 hover:bg-gray-100">刷新列表</button>
        </div>
      </div>
    </div>
  )
}

// ── LandingPage ─────────────────────────────────────────────

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showPay, setShowPay] = useState(false)
  const [showPurchase, setShowPurchase] = useState(false)
  const [showPhoneBind, setShowPhoneBind] = useState(false)
  const [data, setData] = useState({ leagues: [], fixtures: [], predictions: {}, stats: null })
  const [yesterdayMatches, setYesterdayMatches] = useState([])
  const [vipPhone, setVipPhone] = useState(() => localStorage.getItem('vip_phone') || '')
  const [vipStatus, setVipStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showHow, setShowHow] = useState(false)
  const [showProducts, setShowProducts] = useState(false)

  usePageMeta({
    title: '逻辑透镜 — 体育数据研究 | 今日赛事分析 | HumanWrite',
    description: '基于10+赛季历史数据与机器学习模型，一键获取足球赛事胜平负概率与分析结果。每日更新，覆盖五大联赛。',
    keywords: '足球预测,赛事分析,胜平负,赛事分析,逻辑透镜,LogicLens,五大联赛,足球数据分析,概率预测',
  })

  // ── Data Fetching ──

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

  // ── VIP status check ──

  useEffect(() => {
    if (!vipPhone) { setVipStatus(null); return }
    let cancelled = false
    fetch(`/api/logiclens/vip/status?phone=${encodeURIComponent(vipPhone)}`)
      .then(r => r.json())
      .then(d => { if (!cancelled) setVipStatus(d.vip === true) })
      .catch(() => { if (!cancelled) setVipStatus(null) })
    return () => { cancelled = true }
  }, [vipPhone])

  // ── Derived ──

  const isVIP = vipStatus === true

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

  const freeMatch = useMemo(() => {
    const withPred = enrichedMatches.filter((m) => m.hasPrediction)
    const byLeague = {}
    withPred.forEach((m) => {
      const lk = m.leagueKey || 'other'
      if (!byLeague[lk]) byLeague[lk] = []
      byLeague[lk].push(m)
    })
    for (const lk of LEAGUE_PRIORITY) {
      if (byLeague[lk]?.length) return byLeague[lk][0]
    }
    return withPred[0] || null
  }, [enrichedMatches])

  const freeMatchNum = freeMatch?.num
  const lockedMatches = useMemo(() => {
    return enrichedMatches.filter((m) => m.num !== freeMatchNum)
  }, [enrichedMatches, freeMatchNum])

  const isEmpty = !loading && !error && enrichedMatches.length === 0

  // ── Scroll ──

  const scrollTo = useCallback((id) => {
    setMenuOpen(false)
    if (id === 'products') {
      setShowProducts(true)
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // ── Share ──

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

  // ── Stats count ──

  const todayStr = new Date().toLocaleDateString('zh-CN', TODAY_OPTIONS)

  // ── Render ──

  const recClass = (pred) => {
    if (!pred) return ''
    const v = pred.prediction
    if (v === '主胜') return 'home'
    if (v === '平局') return 'draw'
    return 'away'
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-secondary)' }}>
      {/* ═══ Header ═══ */}
      <header className="sticky top-0 z-40" style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid var(--color-border-light)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div style={{ width: 22, height: 22, background: 'var(--color-blue)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-eye" style={{ fontSize: 14, color: '#E6F1FB' }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>逻辑透镜</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="px-3 py-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPhoneBind(true)}
                className="hidden sm:inline text-xs px-2 py-1.5 rounded-lg"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                已开通？
              </button>
              <button
                onClick={() => setShowPay(true)}
                className="text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-white"
                style={{ background: 'var(--color-blue)' }}
              >
                开通会员 ¥19/月
              </button>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ color: 'var(--color-text-secondary)' }}
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

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[300px]' : 'max-h-0'}`}>
          <div style={{ borderTop: '0.5px solid var(--color-border-light)', background: 'var(--color-bg)' }}>
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="block w-full text-left px-3 py-3 text-sm rounded-lg" style={{ color: 'var(--color-text-secondary)' }}>
                  {item.label}
                </button>
              ))}
              <button onClick={() => { setShowPhoneBind(true); setMenuOpen(false) }} className="block w-full text-left px-3 py-3 text-sm rounded-lg" style={{ color: 'var(--color-text-tertiary)' }}>
                已开通？绑定手机号
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════════════════ */}
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
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--color-red-light)' }}>
              <i className="ti ti-alert-circle" style={{ fontSize: 22, color: 'var(--color-red)' }} />
            </div>
            <p style={{ color: 'var(--color-text-secondary)' }} className="mb-4 text-sm">{error}</p>
            <button onClick={fetchData} className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: 'var(--color-blue)' }}>重新加载</button>
          </div>
        ) : isEmpty ? (
          <div className="text-center py-20 px-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--color-bg-secondary)' }}>
              <i className="ti ti-calendar-off" style={{ fontSize: 22, color: 'var(--color-text-tertiary)' }} />
            </div>
            <p className="text-lg font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>今日暂无赛事数据</p>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>请在比赛日再来查看预测分析</p>
          </div>
        ) : (
          <>
            {/* ═══ SECTION: Stats ═══ */}
            <section className="scroll-mt-16 pt-6 sm:pt-8 px-4 sm:px-0">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 14 }}>
                {/* 昨日统计 */}
                <div className="stat-card">
                  <div className="stat-eyebrow">
                    <i className="ti ti-calendar" style={{ fontSize: 13 }} />
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
                            <span style={{ color: 'var(--color-text-tertiary)', fontSize: 9 }}>{ld.hits}/{ld.total}</span>
                            {ld.rate != null && <span className={`pill ${ld.rate >= 0.5 ? 'pill-green' : 'pill-amber'}`}>{(ld.rate * 100).toFixed(0)}%</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div onClick={() => scrollTo('stats')} className="vlink" style={{ fontSize: 10, color: 'var(--color-blue)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
                    <i className="ti ti-list" style={{ fontSize: 11 }} />查看每场详情
                  </div>
                </div>

                {/* 近7天统计 */}
                <div className="stat-card">
                  <div className="stat-eyebrow">
                    <i className="ti ti-chart-line" style={{ fontSize: 13 }} />
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
                            <span style={{ color: 'var(--color-text-tertiary)', fontSize: 9 }}>{day.hits}/{day.total}</span>
                            {day.rate != null && <span className={`pill ${day.rate >= 0.5 ? 'pill-green' : 'pill-amber'}`}>{(day.rate * 100).toFixed(0)}%</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="stat-rows" style={{ borderTop: 'none', paddingTop: 2 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {ALL_LEAGUES.map(lg => (
                        <span key={lg} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          {lg}
                          {lg === '世界杯' && <span style={{ fontSize: 10, lineHeight: 1 }}>🔥</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero */}
              <div style={{ marginBottom: 4, padding: '0 2px' }}>
                <h1 style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3, marginBottom: 4 }}>
                  今天怎么看？<br className="sm:hidden" />点一下，直接给你答案
                </h1>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  基于历史数据建模，每日自动更新，结果可持续验证。
                </p>
              </div>
            </section>

            {/* ═══ SECTION: Today's Matches ═══ */}
            <section id="today" className="scroll-mt-16" style={{ marginTop: 6 }}>
              <div className="sec-header">
                <div className="sec-title">
                  今日赛事 · {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                  <span className="sec-badge">{enrichedMatches.length}场</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button onClick={() => setShowHow(v => !v)} className="sec-link" style={{ fontSize: 10, background: 'none', border: 'none', cursor: 'pointer' }}>
                      <i className="ti ti-info-circle" style={{ fontSize: 11 }} />预测原理
                    </button>
                    {showHow && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowHow(false)} />
                        <div className="absolute right-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-xl p-4 shadow-lg w-64">
                          <p className="text-xs text-gray-600 leading-relaxed">
                            基于每个赛事近万场，每场比赛 30 多个特征训练建模而计算出来的概率，所有预测均可回看验证，并持续训练更新和优化
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  {!isVIP && (
                    <button onClick={() => setShowPay(true)} className="sec-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <i className="ti ti-lock-open" style={{ fontSize: 11 }} />解锁全部
                    </button>
                  )}
                </div>
              </div>

              {/* Free Match */}
              {freeMatch && freeMatch.prediction && (
                <div className="free-card">
                  <div className="fc-top">
                    <div style={{ display: 'flex', gap: 6 }}>
                      {freeMatch.leagueLabel && <span className="league-pill">{freeMatch.leagueLabel}</span>}
                      <span className="free-pill">今日免费</span>
                    </div>
                    <span className="match-num">{freeMatch.num}</span>
                  </div>
                  <div className="teams-row">
                    <span className="team-name">{freeMatch.home_cn}</span>
                    <span className="vs-badge">VS</span>
                    <span className="team-name">{freeMatch.away_cn}</span>
                  </div>
                  <ProbBars probs={freeMatch.prediction.probabilities} />
                  <div className="rec-row">
                    <div className={`rec-badge ${recClass(freeMatch.prediction)}`}>
                      <i className="ti ti-circle-check" style={{ fontSize: 13 }} />
                      概率：{freeMatch.prediction.prediction}
                    </div>
                    <SignalStrength probs={freeMatch.prediction.probabilities} prediction={freeMatch.prediction.prediction} />
                  </div>
                </div>
              )}

              {/* Locked Matches */}
              {lockedMatches.length > 0 && (
                <div className={isVIP ? 'vip-active' : ''}>
                  <div className="lcard-wrap">
                    {lockedMatches.map((m) => (
                      <div key={m.num} className="lcard">
                        <div className="lc-top" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span className="lc-league">{m.leagueLabel || '其他'} · {m.num}</span>
                          {!isVIP && <i className="ti ti-lock" style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }} />}
                        </div>
                        <div className="lc-teams">
                          {m.home_cn}<br />vs {m.away_cn}
                        </div>
                        {m.hasPrediction ? (
                          <>
                            <div className="lc-blur-row">
                              <span className="blur-text" style={isVIP ? { filter: 'none', userSelect: 'auto' } : {}}>主胜 {(m.prediction.probabilities.home).toFixed(1)}%</span>
                              <span className="blur-text" style={isVIP ? { filter: 'none', userSelect: 'auto' } : {}}>平 {(m.prediction.probabilities.draw).toFixed(1)}%</span>
                              <span className="blur-text" style={isVIP ? { filter: 'none', userSelect: 'auto' } : {}}>客胜 {(m.prediction.probabilities.away).toFixed(1)}%</span>
                            </div>
                            <div className="lcard-foot">
                              <span className="rec-blur" style={isVIP ? { filter: 'none', userSelect: 'auto' } : {}}>概率：{m.prediction.prediction}</span>
                              {!isVIP && <i className="ti ti-lock" style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }} />}
                            </div>
                          </>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '8px 0' }}>
                            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>预测数据准备中</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Unlock CTA */}
              {!isVIP && (
                <div className="unlock-bar">
                  <div className="ub-left">
                    <strong>还有 {lockedMatches.length} 场等你查看</strong>
                    开通会员 · 仅需 ¥19/月
                  </div>
                  <button onClick={() => setShowPay(true)} className="ub-btn">立即开通</button>
                </div>
              )}

              {/* Hint */}
              {!isVIP && (
              <div className="hint-bar">
                <i className="ti ti-info-circle" style={{ fontSize: 14, color: 'var(--color-amber-text)', flexShrink: 0, marginTop: 1 }} />
                <div className="hint-text">
                  <strong>模糊数字是真实数据。</strong>开通会员即可看到完整概率与分析结论。
                  <br /><span style={{ opacity: 0.7 }}>本平台仅提供体育赛事数据分析与研究，不构成任何投注建议。</span>
                </div>
              </div>
              )}
            </section>

            {/* ═══ SECTION: Stats Detail ═══ */}
            <section id="stats" className="scroll-mt-16 px-4 sm:px-0">
              <div style={{ borderTop: '0.5px solid var(--color-border-light)', padding: '16px 0 12px' }}>
                <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 2 }}>平台统计</h2>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12 }}>历史数据公开透明，用数据说话</p>
              </div>

              {yesterdayMatches.length > 0 ? (
                <div className="ym-container">
                  <div className="ym-header">
                    <i className="ti ti-calendar" style={{ fontSize: 12 }} />昨日平台分析
                  </div>
                  <div className={`ym-viewport ${yesterdayMatches.length > 3 ? 'ym-scroll' : ''}`}>
                    <div className="ym-list">
                      {yesterdayMatches.map((m, i) => (
                        <div key={i} className="ym-row">
                          <span className="ym-league">{LEAGUE_DISPLAY[m.league_key] || m.league_key?.split('-').pop() || m.league}</span>
                          <span className="ym-teams">{m.home_cn} vs {m.away_cn}</span>
                          {m.prediction ? (
                            <div className="ym-badges">
                              <span className={`ym-pred ${m.prediction.prediction === '主胜' ? 'pred-home' : m.prediction.prediction === '客胜' ? 'pred-away' : 'pred-draw'}`}>
                                {m.prediction.prediction === '主胜' ? '主' : m.prediction.prediction === '客胜' ? '客' : '平'}
                              </span>
                            </div>
                          ) : (
                            <span className="ym-pred pred-none">--</span>
                          )}
                        </div>
                      ))}
                      {/* Duplicate for seamless scroll loop */}
                      {yesterdayMatches.length > 3 && yesterdayMatches.map((m, i) => (
                        <div key={`dup-${i}`} className="ym-row">
                          <span className="ym-league">{LEAGUE_DISPLAY[m.league_key] || m.league_key?.split('-').pop() || m.league}</span>
                          <span className="ym-teams">{m.home_cn} vs {m.away_cn}</span>
                          {m.prediction ? (
                            <div className="ym-badges">
                              <span className={`ym-pred ${m.prediction.prediction === '主胜' ? 'pred-home' : m.prediction.prediction === '客胜' ? 'pred-away' : 'pred-draw'}`}>
                                {m.prediction.prediction === '主胜' ? '主' : m.prediction.prediction === '客胜' ? '客' : '平'}
                              </span>
                            </div>
                          ) : (
                            <span className="ym-pred pred-none">--</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p style={{ color: 'var(--color-text-tertiary)' }} className="text-sm">暂无昨日分析记录</p>
                </div>
              )}

              <div className="text-center mb-6" style={{ marginTop: 12 }}>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl" style={{ background: 'var(--color-blue)' }}>
                  <i className="ti ti-arrow-up" style={{ fontSize: 13 }} />回到顶部
                </button>
              </div>
            </section>

            {/* ═══ SECTION: Products ═══ */}
            {showProducts && (
            <section id="products" className="scroll-mt-16 px-4 sm:px-0" style={{ paddingTop: 8, paddingBottom: 20 }}>
              <div style={{ borderTop: '0.5px solid var(--color-border-light)', padding: '16px 0 12px' }}>
                <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 2 }}>更多产品</h2>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>用数据和技术，为你创造更多价值</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
                {PRODUCTS.map((p) => (
                  <article key={p.id} className="group relative rounded-2xl border border-gray-200 bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300 p-5 sm:p-6 flex flex-col" style={{ '--glow-color': p.glowColor }}>
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(600px circle at 50% 50%, ${p.glowColor}, transparent 60%)` }} />
                    <div className="relative flex flex-col flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${p.accent} flex items-center justify-center text-white`}>{p.icon}</div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
                          <p className="text-xs text-gray-400 font-mono tracking-wider">{p.subtitle}</p>
                          <p className="text-xs text-gray-400/80 mt-0.5">{p.tagline}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.tags.map((t) => <span key={t} className="inline-block px-3 py-1 text-xs font-medium tracking-wider rounded-full bg-gray-100 text-gray-500 border border-gray-200">{t}</span>)}
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">{p.description}</p>
                      <div className="flex flex-col gap-2.5">
                        <Link to={p.demoPath} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${p.isFree ? 'text-gray-900 bg-gray-100 hover:bg-gray-200' : 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'}`}>
                          {p.isFree ? '✨ 免费使用' : '立即体验'}
                        </Link>
                        {!p.isFree && (
                          <button onClick={() => setShowPurchase(true)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all min-h-[44px]">
                            了解商业版
                            <svg className="w-4 h-4 opacity-60" viewBox="0 0 16 16" fill="none"><path d="M10 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 6H5a2 2 0 00-2 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Bottom banner */}
              <div className="rounded-2xl p-6 sm:p-8 text-center shadow-lg" style={{ background: 'linear-gradient(135deg, #185FA5 0%, #0C447C 100%)' }}>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">今天怎么看？点一下就知道</h3>
                <p className="text-sm sm:text-base mb-5" style={{ color: '#B5D4F4' }}>不用分析，不靠感觉，直接看数据给出的答案</p>
                <button onClick={() => scrollTo('today')} className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white rounded-xl" style={{ background: 'var(--color-blue)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  查看今日预测
                </button>
              </div>
            </section>)}
          </>
        )}
      </main>

      {/* ═══ Footer ═══ */}
      <footer className="text-center pb-6 pt-2">
        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          &copy; {new Date().getFullYear()} HumanWrite. All rights reserved.
        </p>
        <p className="mt-1.5">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-tertiary)', fontSize: 10, textDecoration: 'none' }}>
            鄂ICP备2026022715号
          </a>
          <span style={{ color: 'var(--color-text-tertiary)', fontSize: 10, margin: '0 6px' }}>|</span>
          <a href="http://www.beian.gov.cn/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-tertiary)', fontSize: 10, textDecoration: 'none' }}>
            <i className="ti ti-shield-check" style={{ fontSize: 10, marginRight: 2 }} />公安备案
          </a>
        </p>
        <p className="mt-1.5" style={{ color: 'var(--color-text-tertiary)', fontSize: 10 }}>
          <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>用户协议</Link>
          <span style={{ margin: '0 6px' }}>·</span>
          <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>隐私政策</Link>
        </p>
        <p className="mt-2 text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
          本平台仅提供体育赛事数据分析与研究，不构成任何投注建议。
        </p>
        {vipStatus === true && <p className="mt-2 text-[10px]" style={{ color: 'var(--color-green)' }}>✅ 会员已开通</p>}
        {enrichedMatches.length > 0 && <p className="mt-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>觉得有用？<ShareButton />试试</p>}
      </footer>

      {/* ═══ Modals ═══ */}
      <PaymentModal isOpen={showPay} onClose={() => setShowPay(false)} />
      <PhoneBindModal isOpen={showPhoneBind} onClose={() => setShowPhoneBind(false)} vipPhone={vipPhone} onBind={(phone) => { localStorage.setItem('vip_phone', phone); setVipPhone(phone); setShowPhoneBind(false) }} />
      <PurchaseModal isOpen={showPurchase} onClose={() => setShowPurchase(false)} />

      {/* ═══ Mobile Floating CTA ═══ */}
      {!isVIP && !loading && !error && !isEmpty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
          <button onClick={() => setShowPay(true)} className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all min-h-[44px]" style={{ background: 'var(--color-blue)' }}>
            开通会员 ¥19/月
            <i className="ti ti-chevron-right" style={{ fontSize: 14 }} />
          </button>
        </div>
      )}
    </div>
  )
}
