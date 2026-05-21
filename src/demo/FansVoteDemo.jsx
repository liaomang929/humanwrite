import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import ProductCTA from '../components/ProductCTA'

const SCREENSHOTS = [
  { src: '/images/fansvote-1.jpg', label: '赛事投票', desc: '浏览当日赛事，预测比赛结果' },
  { src: '/images/fansvote-2.jpg', label: '投票统计', desc: '实时查看各选项投票分布' },
  { src: '/images/fansvote-3.jpg', label: '个人战绩', desc: '跟踪预测准确率与净赢手数' },
  { src: '/images/fansvote-4.jpg', label: '历史记录', desc: '回顾过往投票与结算结果' },
  { src: '/images/fansvote-5.jpg', label: '分享邀请', desc: '一键分享投票链接到私域社群' },
]

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: '赛事投票',
    desc: '每日更新比赛列表，主/客/平三种选项，轻松表达你的判断。',
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: '实时统计',
    desc: '投票结果实时展示，百分比与条形图直观呈现市场热度分布。',
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.376 3.622a1 1 0 013.002 3.002L7.368 18.635a2 2 0 01-.855.506l-2.872.838a.5.5 0 01-.62-.62l.838-2.872a2 2 0 01.506-.854z" />
      </svg>
    ),
    title: '战绩追踪',
    desc: '自动结算赛果，记录净赢手数、胜盘率等关键指标，持续提升预测水平。',
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
      </svg>
    ),
    title: '分享传播',
    desc: '一键复制投票链接，分享到微信群或朋友圈，邀请好友一起参与。',
  },
]

export default function FansVoteDemo() {
  usePageMeta({
    title: '私域粉丝投票 — 产品展示',
    description: '比赛分享和私域投票工具，了解粉丝热度与倾向',
    keywords: '私域粉丝投票,粉丝投票,赛事投票,市场方向',
  })

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 no-underline" style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f0876c', boxShadow: '0 0 10px rgba(240,135,108,.4)', flexShrink: 0 }} />
                Blake Pierce
              </Link>
              <span style={{ width: 1, height: 16, background: 'var(--border)' }} />
              <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>私域粉丝投票</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#f0876c', border: '1px solid rgba(240,135,108,.28)', padding: '3px 10px', borderRadius: 100 }}>
              实时更新
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 pb-20">
        {/* Title */}
        <div className="mb-10">
          <div className="section-overline">Fans Vote</div>
          <h1 className="section-title" style={{ fontSize: 24 }}>私域粉丝投票</h1>
          <p className="section-subtitle">比赛分享和私域投票数据收集，了解粉丝热度与倾向</p>
        </div>

        {/* Screenshot Gallery */}
        <div className="mb-16">
          <h2 className="text-base font-medium mb-6" style={{ color: 'var(--text-primary)' }}>界面预览</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin"
            style={{ scrollbarWidth: 'thin' }}>
            {SCREENSHOTS.map((s, i) => (
              <div key={i} className="snap-center shrink-0">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    width: 240,
                    background: 'var(--bg-card)',
                    border: '0.5px solid var(--border)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  <div className="overflow-hidden" style={{ height: 480 }}>
                    <img src={s.src} alt={s.label} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{s.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-base font-medium mb-6" style={{ color: 'var(--text-primary)' }}>核心功能</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="rounded-xl p-5 flex items-start gap-4"
                style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold)' }}
                >
                  {f.icon}
                </div>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{f.title}</div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <ProductCTA productName="私域粉丝投票" note="「粉丝投票」" />
      </div>
    </div>
  )
}
