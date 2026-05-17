import { usePageMeta } from '../hooks/usePageMeta'

const PRODUCTS = [
  {
    id: 'logiclens',
    title: '逻辑透镜',
    subtitle: 'LogicLens',
    tagline: '基于机器学习的数据分析研究',
    description:
      '基于历史赛事数据与机器学习模型的个人数据分析项目。覆盖五大联赛，每日更新，数据公开透明。',
    tags: ['随机森林', '逻辑回归', '神经网络'],
    href: '/lab',
    gradient: 'from-brand-blue to-brand-indigo',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2.5" />
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
  },
  {
    id: 'classicore',
    title: '典萃【自媒体拆书】',
    subtitle: 'ClassiCore',
    tagline: '深度解构每一本好书 · 让知识成为你的创作源力',
    description:
      'AI 深度阅读伴侣。上传PDF自动拆解，生成知识胶囊，一键输出多平台创作脚本。',
    tags: ['知识胶囊', '深度拆解'],
    href: '/demo/classicore',
    gradient: 'from-brand-cyan to-brand-emerald',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="6" height="18" rx="1.5" />
        <rect x="15" y="3" width="6" height="18" rx="1.5" />
        <line x1="9" y1="6" x2="15" y2="6" />
        <line x1="9" y1="10" x2="15" y2="10" />
        <line x1="9" y1="14" x2="12" y2="14" />
      </svg>
    ),
  },
  {
    id: 'aicleaner',
    title: '净言',
    subtitle: 'AI Cleaner',
    tagline: '把AI写的东西，改得像真人',
    description:
      'AI 文本润色工具。一键优化表达，去AI味，让内容更自然流畅，适合社交场景传播。',
    tags: ['AI润色', '文案优化', '免费使用'],
    href: '/demo/aicleaner',
    gradient: 'from-brand-emerald to-brand-cyan',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l2.5 7.5L22 13l-7.5 2.5L12 23l-2.5-7.5L2 13l7.5-2.5z" />
      </svg>
    ),
  },
  {
    id: 'shangan',
    title: '上岸雷达',
    subtitle: 'Gongkao Radar',
    tagline: '考公岗位智能匹配工具',
    description:
      '公务员考试岗位智能匹配与信息查询。精准筛选目标岗位，提升备考效率。',
    tags: ['考公', '岗位匹配', '信息查询'],
    href: '/kg',
    gradient: 'from-brand-amber to-gold-dark',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.5 6.5L21 11l-6.5 3L12 22l-2.5-8L3 11l6.5-2.5z" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    ),
  },
  {
    id: 'jczq',
    title: '私域粉丝投票',
    subtitle: 'Fans Vote',
    tagline: '比赛分享和私域投票',
    description:
      '比赛分享和私域投票数据收集，了解粉丝热度与倾向。',
    tags: ['粉丝投票', '市场方向', '赛事热度'],
    href: '/demo/fansvote',
    gradient: 'from-brand-rose to-brand-amber',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
        <path d="M7 3l-1 4 4-1" />
        <path d="M17 3l1 4-4-1" />
      </svg>
    ),
  },
]

const CATEGORIES = [
  {
    id: 'data',
    num: '01',
    title: '数据分析',
    description: '数据驱动决策，洞察比赛与趋势',
    productIds: ['logiclens', 'jczq'],
  },
  {
    id: 'tools',
    num: '02',
    title: '工具类',
    description: '提升内容创作与信息处理效率',
    productIds: ['classicore', 'aicleaner'],
  },
  {
    id: 'exam',
    num: '03',
    title: '考公考编考研',
    description: '精准匹配目标岗位，高效备考',
    productIds: ['shangan'],
  },
]

export default function PortalPage() {
  usePageMeta({
    title: 'Blake Pierce — 独立开发者 / 数据爱好者',
    description:
      '个人产品门户：逻辑透镜、典萃 ClassiCore、净言 AI Cleaner、上岸雷达、私域粉丝投票。',
    keywords: 'Blake Pierce,廖莽,LogicLens,数据实验室,典萃,ClassiCore,净言,上岸雷达,私域粉丝投票',
  })

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* ═══ Header ═══ */}
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-3 no-underline">
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#080c16',
                }}
              >
                B
              </div>
              <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Blake Pierce
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              <a href="#products" className="nav-link">产品</a>
              <a href="#about" className="nav-link">关于</a>
            </nav>
          </div>
        </div>
      </header>

      {/* ═══ Hero ═══ */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="hero-name">Blake Pierce</div>
        <div className="hero-title">独立开发者 · 数据爱好者 · AI 实践者</div>
        <div className="hero-divider" />
        <p className="hero-bio">
          用数据和技术做点有意思的东西。从机器学习赛事分析到AI驱动的阅读与写作工具，
          持续探索技术创造价值的可能性。
        </p>
      </section>

      {/* ═══ Products ═══ */}
      <section id="products" className="max-w-6xl mx-auto px-6 sm:px-10 pb-24 sm:pb-32 scroll-mt-20">
        <div className="section-overline">Products</div>
        <h2 className="section-title">产品</h2>
        <p className="section-subtitle">用数据和技术，创造有价值的工具和服务</p>

        <div className="mt-10 space-y-14">
          {CATEGORIES.map((cat) => (
            <div key={cat.id}>
              {/* Category header */}
              <div className="flex items-center gap-4 mb-1">
                <span
                  className="text-xs font-medium tracking-widest"
                  style={{ color: 'var(--gold)', fontFeatureSettings: "'tnum'" }}
                >
                  {cat.num}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {cat.title}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: 'linear-gradient(90deg, var(--border), transparent)' }}
                />
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
                {cat.description}
              </p>

              {/* Product cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRODUCTS.filter((p) => cat.productIds.includes(p.id)).map((p) => (
                  <a
                    key={p.id}
                    href={p.href}
                    className="product-card group no-underline"
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className={`product-icon bg-gradient-to-br ${p.gradient} text-white`}
                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      >
                        {p.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 style={{ fontSize: 17, fontWeight: 550, color: 'var(--text-primary)' }}>
                            {p.title}
                          </h3>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 400 }}>
                            {p.subtitle}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                          {p.tagline}
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6, marginBottom: 14 }}>
                          {p.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {p.tags.map((t) => (
                            <span key={t} className="product-tag">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
                      <span className="product-cta">
                        进入
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ About ═══ */}
      <section id="about" className="max-w-6xl mx-auto px-6 sm:px-10 pb-24 sm:pb-32 scroll-mt-20">
        <div className="section-overline">About</div>
        <h2 className="section-title">关于</h2>

        <div className="mt-8 max-w-3xl space-y-4">
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            我是 Blake Pierce，一名独立开发者。热衷于用数据、机器学习和人工智能技术，
            构建能够解决实际问题的工具和产品。
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            目前维护的产品覆盖了体育数据分析、AI 阅读与写作、考公岗位匹配、私域粉丝投票等领域。
            所有项目均为个人兴趣驱动，保持对技术的好奇心。
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            本平台所有数据仅供学习交流参考，不构成任何形式的建议或决策依据。
          </p>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
              &copy; {new Date().getFullYear()} Blake Pierce
            </p>
            <div className="flex items-center gap-4">
              <a href="/terms" className="footer-link">用户协议</a>
              <span style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>·</span>
              <a href="/privacy" className="footer-link">隐私政策</a>
              <span style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>·</span>
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="footer-link">
                鄂ICP备2026022715号
              </a>
            </div>
          </div>
          <p className="mt-4 text-center sm:text-left" style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>
            本平台为个人项目，所有数据仅供学习交流参考。
          </p>
        </div>
      </footer>
    </div>
  )
}
