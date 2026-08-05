import { useLocation } from 'react-router-dom'

const PRODUCT_LINKS = [
  { href: '/lottery/', label: '财富密码' },
  { href: '/odds/', label: '足球当铺' },
  { href: '/xianyu/', label: '藏宝图' },
]

const STYLES = `
  .pn-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    height: 48px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 clamp(1.25rem, 4vw, 3.5rem);
    background: rgba(0, 0, 0, .72);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, .08);
  }
  .pn-brand {
    display: flex; align-items: center; gap: 9px;
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: -.02em; color: #f5f5f7; text-decoration: none;
  }
  .pn-brand::before {
    content: '';
    width: 7px; height: 7px; border-radius: 50%;
    background: #0a84ff;
    box-shadow: 0 0 12px #0a84ff;
    animation: bp-pulse 2.4s ease-in-out infinite;
  }
  .pn-links { display: flex; align-items: center; gap: 1.25rem; list-style: none; margin: 0; padding: 0; }
  .pn-links a {
    color: #86868b; text-decoration: none; font-size: 13px;
    transition: color .2s; cursor: pointer; white-space: nowrap;
  }
  .pn-links a:hover { color: #f5f5f7; }
  .pn-links a.pn-anchor { color: #6e6e73; }
  .pn-links a.pn-anchor:hover { color: #f5f5f7; }

  @media (max-width: 560px) {
    .pn-links { gap: .9rem; }
    .pn-links a { font-size: 12px; }
    .pn-anchor { display: none; }
  }
`

export default function PortalNav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      <style>{STYLES}</style>
      <nav className="pn-nav">
        <a href="/" className="pn-brand" aria-label="返回主页">BlakePierce</a>
        <div className="pn-links">
          {isHome && (
            <>
              <a href="#stats" className="pn-anchor">战绩</a>
              <a href="#about" className="pn-anchor">联系</a>
            </>
          )}
          {PRODUCT_LINKS.map(l => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </div>
      </nav>
    </>
  )
}
