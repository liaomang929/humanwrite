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

const LEAGUE_FLAG = {
  '英超': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  '西甲': '🇪🇸',
  '意甲': '🇮🇹',
  '德甲': '🇩🇪',
  '法甲': '🇫🇷',
  '日职': '🇯🇵',
  '荷甲': '🇳🇱',
  '葡超': '🇵🇹',
  '欧冠': '⭐',
  '欧联': '🌟',
  '世界杯': '🏆',
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

/* ─── Inline styles ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');

  .ll-wrap {
    min-height: 100vh;
    background: var(--bg-primary, #0a0a0f);
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    color: var(--text-primary, #f0eeff);
    position: relative;
    overflow-x: hidden;
  }
  .ll-wrap::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 70% 50% at 80% -5%,  rgba(124,110,240,.09) 0%, transparent 60%),
      radial-gradient(ellipse 40% 35% at 5% 85%,   rgba(56,189,248,.05)  0%, transparent 50%);
  }
  .ll-wrap > * { position: relative; z-index: 1; }

  /* ── nav ── */
  .ll-nav {
    position: sticky; top: 0; z-index: 50;
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    background: rgba(10,10,15,.82);
    border-bottom: 1px solid rgba(255,255,255,.07);
  }
  .ll-nav-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 0 clamp(1rem,4vw,2.5rem);
    height: 60px; display: flex; align-items: center; justify-content: space-between;
  }
  .ll-logo {
    display: flex; align-items: center; gap: 9px;
    text-decoration: none;
  }
  .ll-logo-icon {
    width: 30px; height: 30px; border-radius: 9px;
    background: linear-gradient(135deg, #7c6ef0, #4ecfb3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ll-logo-icon svg { width: 14px; height: 14px; }
  .ll-logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700; letter-spacing: -.02em;
    color: var(--text-primary, #f0eeff);
  }
  .ll-logo-sub {
    font-size: 10px; color: rgba(139,133,168,.6);
    letter-spacing: .06em; text-transform: uppercase;
    border-left: 1px solid rgba(255,255,255,.1);
    padding-left: 9px; margin-left: 2px;
  }
  .ll-nav-links { display: flex; align-items: center; gap: 2px; }
  .ll-nav-btn {
    background: none; border: none; cursor: pointer;
    padding: 6px 12px; border-radius: 8px;
    font-size: 13px; color: rgba(139,133,168,.85);
    font-family: 'DM Sans', sans-serif;
    transition: color .2s, background .2s;
  }
  .ll-nav-btn:hover { color: var(--text-primary, #f0eeff); background: rgba(255,255,255,.05); }
  .ll-back {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 8px;
    font-size: 13px; color: rgba(139,133,168,.6);
    text-decoration: none;
    transition: color .2s, background .2s;
  }
  .ll-back:hover { color: var(--text-primary, #f0eeff); background: rgba(255,255,255,.05); }
  .ll-mobile-menu-btn {
    display: none;
    background: none; border: none; cursor: pointer;
    width: 36px; height: 36px; border-radius: 8px;
    color: rgba(139,133,168,.85);
    align-items: center; justify-content: center;
    transition: background .2s;
  }
  .ll-mobile-menu-btn:hover { background: rgba(255,255,255,.06); }
  @media (max-width: 768px) {
    .ll-nav-links.desktop { display: none; }
    .ll-mobile-menu-btn { display: flex; }
    .ll-logo-sub { display: none; }
  }
  .ll-mobile-menu {
    overflow: hidden; transition: max-height .28s ease;
    background: rgba(14,14,24,.95);
    border-bottom: 1px solid rgba(255,255,255,.06);
  }
  .ll-mobile-menu-inner { padding: 8px 16px 12px; }
  .ll-mobile-item {
    display: block; width: 100%; text-align: left;
    padding: 10px 12px; border-radius: 8px;
    background: none; border: none; cursor: pointer;
    font-size: 14px; color: rgba(139,133,168,.85);
    font-family: 'DM Sans', sans-serif;
    transition: color .2s, background .2s;
  }
  .ll-mobile-item:hover { color: var(--text-primary, #f0eeff); background: rgba(255,255,255,.05); }

  /* ── hero ── */
  .ll-hero {
    max-width: 1100px; margin: 0 auto;
    padding: clamp(2rem,5vw,4rem) clamp(1rem,4vw,2.5rem) clamp(1.5rem,3vw,2.5rem);
  }
  .ll-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 10.5px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase;
    color: #7c6ef0; margin-bottom: 1.1rem;
  }
  .ll-hero-eyebrow::before { content:''; display:inline-block; width:16px; height:1px; background:#7c6ef0; }
  .ll-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.8rem,4vw,3rem);
    font-weight: 800; line-height: 1.05; letter-spacing: -.04em;
    color: var(--text-primary, #f0eeff);
    margin-bottom: .9rem;
  }
  .ll-hero-title em { font-style: normal; color: transparent; -webkit-text-stroke: 1.5px rgba(240,235,255,.28); }
  .ll-hero-desc {
    font-size: 14px; color: rgba(139,133,168,.85);
    max-width: 560px; line-height: 1.75; font-weight: 300; margin-bottom: 1.5rem;
  }
  .ll-hero-meta {
    display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
    padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,.07);
  }
  .ll-meta-item { display: flex; align-items: center; gap: 6px; }
  .ll-meta-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ecfb3; flex-shrink: 0; }
  .ll-meta-text { font-size: 12px; color: rgba(139,133,168,.7); }
  .ll-date-badge {
    margin-left: auto;
    font-size: 11.5px; font-weight: 500;
    color: rgba(139,133,168,.6);
    font-family: 'DM Mono', monospace;
    letter-spacing: .02em;
  }

  /* ── main ── */
  .ll-main { max-width: 1100px; margin: 0 auto; padding: 0 clamp(1rem,4vw,2.5rem) 3rem; }

  /* ── stat cards ── */
  .ll-stat-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
    margin-bottom: 1.75rem;
  }
  .ll-stat-card {
    background: rgba(17,17,26,.9);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 18px; padding: 1.25rem 1.25rem 1rem;
    position: relative; overflow: hidden;
  }
  .ll-stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--_accent, rgba(124,110,240,.5)), transparent);
  }
  .ll-stat-eyebrow {
    display: flex; align-items: center; gap: 5px;
    font-size: 10.5px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
    color: rgba(74,70,102,.9); margin-bottom: .7rem;
  }
  .ll-stat-eyebrow svg { width: 11px; height: 11px; }
  .ll-stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 2.4rem; font-weight: 800; line-height: 1;
    letter-spacing: -.04em; margin-bottom: 2px;
  }
  .ll-stat-num.green { color: #4ecfb3; }
  .ll-stat-num.blue  { color: #7c6ef0; }
  .ll-stat-sub {
    font-size: 11.5px; color: rgba(139,133,168,.6);
    font-family: 'DM Mono', monospace; margin-bottom: .75rem;
  }
  .ll-srows { border-top: 1px solid rgba(255,255,255,.06); padding-top: .6rem; display: flex; flex-direction: column; gap: 4px; }
  .ll-srow { display: flex; align-items: center; justify-content: space-between; }
  .ll-srow-lbl { font-size: 11px; color: rgba(139,133,168,.7); }
  .ll-srow-right { display: flex; align-items: center; gap: 5px; }
  .ll-srow-count { font-size: 9.5px; color: rgba(74,70,102,.8); font-family: 'DM Mono', monospace; }
  .ll-pill {
    font-size: 9.5px; font-weight: 600; padding: 1px 6px; border-radius: 4px;
    font-family: 'DM Mono', monospace;
  }
  .ll-pill.green { background: rgba(78,207,179,.14); color: #4ecfb3; }
  .ll-pill.amber { background: rgba(240,196,108,.14); color: #f0c46c; }
  .ll-league-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .ll-ltag {
    font-size: 9.5px; padding: 2px 6px; border-radius: 4px;
    background: rgba(255,255,255,.05); color: rgba(139,133,168,.7);
  }

  /* ── quote banner ── */
  .ll-quote {
    background: rgba(124,110,240,.06);
    border: 1px solid rgba(124,110,240,.15);
    border-left: 3px solid #7c6ef0;
    border-radius: 12px; padding: 1rem 1.1rem;
    margin-bottom: 1.75rem;
  }
  .ll-quote-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700; color: var(--text-primary, #f0eeff);
    margin-bottom: 5px;
  }
  .ll-quote-body { font-size: 12.5px; color: rgba(139,133,168,.8); line-height: 1.65; }

  /* ── section header ── */
  .ll-sec-hdr {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 0 .75rem;
    border-top: 1px solid rgba(255,255,255,.07);
    margin-bottom: .75rem;
  }
  .ll-sec-left { display: flex; align-items: center; gap: 10px; }
  .ll-sec-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700; letter-spacing: -.02em;
    color: var(--text-primary, #f0eeff);
  }
  .ll-sec-badge {
    font-size: 10.5px; font-weight: 600;
    padding: 2px 8px; border-radius: 100px;
    background: rgba(124,110,240,.15);
    color: #7c6ef0;
    font-family: 'DM Mono', monospace;
  }
  .ll-sec-date { font-size: 11.5px; color: rgba(74,70,102,.8); font-family: 'DM Mono', monospace; }
  .ll-info-btn {
    display: inline-flex; align-items: center; gap: 4px;
    background: none; border: 1px solid rgba(255,255,255,.08);
    border-radius: 8px; padding: 4px 10px; cursor: pointer;
    font-size: 11.5px; color: rgba(139,133,168,.7);
    font-family: 'DM Sans', sans-serif;
    transition: border-color .2s, color .2s;
  }
  .ll-info-btn:hover { border-color: rgba(124,110,240,.4); color: #7c6ef0; }
  .ll-info-btn svg { width: 11px; height: 11px; }
  .ll-tooltip {
    position: absolute; right: 0; top: calc(100% + 8px); z-index: 20;
    background: #1a1a2e; border: 1px solid rgba(124,110,240,.25);
    border-radius: 12px; padding: 12px 14px;
    box-shadow: 0 12px 40px rgba(0,0,0,.5);
    width: 240px;
  }
  .ll-tooltip p { font-size: 12px; color: rgba(139,133,168,.85); line-height: 1.65; margin: 0; }

  /* ── match cards ── */
  .ll-match-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 10px;
    margin-bottom: 1.5rem;
  }
  .ll-mcard {
    background: rgba(17,17,26,.9);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 16px;
    padding: 1rem 1.1rem;
    position: relative; overflow: hidden;
    transition: border-color .25s, transform .25s, box-shadow .25s;
  }
  .ll-mcard:hover {
    border-color: rgba(124,110,240,.22);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,.3);
  }
  .ll-mcard::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124,110,240,.35), transparent);
    opacity: 0; transition: opacity .25s;
  }
  .ll-mcard:hover::before { opacity: 1; }
  .ll-mcard-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
  }
  .ll-league-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10.5px; font-weight: 500; letter-spacing: .04em;
    color: rgba(139,133,168,.7);
  }
  .ll-match-num {
    font-size: 9.5px; font-family: 'DM Mono', monospace;
    color: rgba(74,70,102,.7);
    background: rgba(255,255,255,.04);
    padding: 2px 6px; border-radius: 4px;
  }
  .ll-teams {
    display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px;
  }
  .ll-team-row {
    display: flex; align-items: center; gap: 7px;
  }
  .ll-team-dot {
    width: 4px; height: 4px; border-radius: 50%;
    flex-shrink: 0;
  }
  .ll-team-dot.home { background: #7c6ef0; }
  .ll-team-dot.away { background: rgba(139,133,168,.4); }
  .ll-team-name {
    font-size: 13.5px; font-weight: 500;
    color: var(--text-primary, #f0eeff);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ll-team-name.away { color: rgba(139,133,168,.8); font-weight: 400; }
  .ll-vs { font-size: 9.5px; color: rgba(74,70,102,.6); text-align: center; line-height: 1; margin: 1px 0 1px 11px; }
  .ll-prob-row {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    gap: 4px; margin-top: 8px;
    border-top: 1px solid rgba(255,255,255,.06); padding-top: 8px;
  }
  .ll-prob-cell {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
  }
  .ll-prob-label { font-size: 9px; color: rgba(74,70,102,.8); letter-spacing: .04em; }
  .ll-prob-val {
    font-family: 'DM Mono', monospace;
    font-size: 13.5px; font-weight: 500;
    color: var(--text-primary, #f0eeff);
  }
  .ll-prob-val.best { color: #4ecfb3; }
  .ll-prob-bar-track {
    width: 100%; height: 2px; background: rgba(255,255,255,.06); border-radius: 1px; overflow: hidden;
  }
  .ll-prob-bar-fill { height: 100%; border-radius: 1px; }
  .ll-no-pred {
    margin-top: 8px; padding: 6px 0;
    text-align: center; font-size: 11px;
    color: rgba(74,70,102,.8);
    border-top: 1px solid rgba(255,255,255,.06);
  }

  /* ── yesterday ── */
  .ll-ym-wrap {
    background: rgba(17,17,26,.9);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 16px; overflow: hidden;
    margin-bottom: 1.25rem;
  }
  .ll-ym-hdr {
    display: flex; align-items: center; gap: 6px;
    padding: .7rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,.06);
    font-size: 11px; font-weight: 500; color: rgba(139,133,168,.7);
    letter-spacing: .05em; text-transform: uppercase;
  }
  .ll-ym-hdr svg { width: 12px; height: 12px; }
  .ll-ym-viewport { max-height: 220px; overflow: hidden; position: relative; }
  .ll-ym-viewport.scroll { overflow: hidden; }
  @keyframes ll-scroll { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }
  .ll-ym-list.animated { animation: ll-scroll 18s linear infinite; }
  .ll-ym-row {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 1rem;
    border-bottom: 1px solid rgba(255,255,255,.04);
    transition: background .15s;
  }
  .ll-ym-row:hover { background: rgba(255,255,255,.02); }
  .ll-ym-league {
    font-size: 10px; font-weight: 500; color: rgba(74,70,102,.9);
    width: 26px; flex-shrink: 0; text-align: center;
  }
  .ll-ym-teams { flex: 1; font-size: 12px; color: rgba(139,133,168,.8); min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ll-pred-badge {
    font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 5px; flex-shrink: 0;
    font-family: 'DM Mono', monospace;
  }
  .ll-pred-badge.home { background: rgba(78,207,179,.15); color: #4ecfb3; }
  .ll-pred-badge.away { background: rgba(124,110,240,.15); color: #7c6ef0; }
  .ll-pred-badge.draw { background: rgba(240,196,108,.12); color: #f0c46c; }
  .ll-pred-badge.none { background: rgba(255,255,255,.05); color: rgba(74,70,102,.8); }

  /* ── states ── */
  .ll-loading { padding: 2rem 0; display: flex; flex-direction: column; gap: 10px; }
  .ll-skel {
    background: linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.07) 50%, rgba(255,255,255,.04) 75%);
    background-size: 200% 100%;
    animation: ll-shimmer 1.5s infinite;
    border-radius: 14px;
  }
  @keyframes ll-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .ll-empty, .ll-error {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 5rem 2rem; text-align: center;
  }
  .ll-state-icon {
    width: 56px; height: 56px; border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1rem;
  }
  .ll-state-title { font-family:'Syne',sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 6px; }
  .ll-state-sub { font-size: 13px; color: rgba(139,133,168,.7); }
  .ll-retry-btn {
    margin-top: 1.25rem; padding: 10px 24px;
    background: #7c6ef0; color: #fff; border: none; border-radius: 100px;
    font-size: 13.5px; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background .2s, transform .2s;
  }
  .ll-retry-btn:hover { background: #8f82f5; transform: translateY(-1px); }

  /* ── top btn ── */
  .ll-top-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 22px; border-radius: 100px;
    background: rgba(124,110,240,.15); border: 1px solid rgba(124,110,240,.3);
    color: #7c6ef0; font-size: 13px; font-weight: 500;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all .2s;
  }
  .ll-top-btn:hover { background: rgba(124,110,240,.25); transform: translateY(-1px); }
  .ll-top-btn svg { width: 13px; height: 13px; }

  /* ── share ── */
  .ll-share-btn {
    background: none; border: none; cursor: pointer;
    color: #7c6ef0; font-size: 13px; font-family: 'DM Sans', sans-serif;
    transition: color .2s;
  }
  .ll-share-btn:hover { color: #8f82f5; }

  /* ── footer ── */
  .ll-footer {
    text-align: center; padding: 1.5rem 1rem 2.5rem;
    border-top: 1px solid rgba(255,255,255,.06);
    margin-top: 1rem;
  }
  .ll-footer-links { display: flex; align-items: center; justify-content: center; gap: .75rem; flex-wrap: wrap; margin-bottom: .6rem; }
  .ll-footer-link { font-size: 11px; color: rgba(74,70,102,.9); text-decoration: none; transition: color .2s; }
  .ll-footer-link:hover { color: rgba(139,133,168,.8); }
  .ll-footer-sep { font-size: 9px; color: rgba(74,70,102,.5); }
  .ll-footer-copy { font-size: 10.5px; color: rgba(74,70,102,.7); margin-bottom: .35rem; }
  .ll-footer-note { font-size: 9.5px; color: rgba(74,70,102,.5); }

  @media (max-width: 640px) {
    .ll-stat-grid { grid-template-columns: 1fr 1fr; }
    .ll-match-grid { grid-template-columns: 1fr; }
    .ll-date-badge { display: none; }
  }
`

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
  return (
    <button onClick={copy} className="ll-share-btn">
      {copied ? '✅ 已复制链接' : '分享给朋友'}
    </button>
  )
}

function MatchCard({ m }) {
  const probs = m.prediction?.probabilities
  const maxKey = probs
    ? Object.entries(probs).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
    : null
  const barColors = { home: '#7c6ef0', draw: '#f0c46c', away: '#4ecfb3' }

  return (
    <div className="ll-mcard">
      <div className="ll-mcard-top">
        <span className="ll-league-badge">
          <span>{LEAGUE_FLAG[m.leagueLabel] || '🌐'}</span>
          {m.leagueLabel || '其他'}
        </span>
        <span className="ll-match-num">{m.num}</span>
      </div>

      <div className="ll-teams">
        <div className="ll-team-row">
          <div className="ll-team-dot home" />
          <span className="ll-team-name">{m.home_cn}</span>
        </div>
        <div className="ll-vs">vs</div>
        <div className="ll-team-row">
          <div className="ll-team-dot away" />
          <span className="ll-team-name away">{m.away_cn}</span>
        </div>
      </div>

      {m.hasPrediction ? (
        <div className="ll-prob-row">
          {[
            { key: 'home', label: '主队' },
            { key: 'draw', label: '平局' },
            { key: 'away', label: '客队' },
          ].map(({ key, label }) => (
            <div key={key} className="ll-prob-cell">
              <span className="ll-prob-label">{label}</span>
              <span className={`ll-prob-val${key === maxKey ? ' best' : ''}`}>
                {probs[key].toFixed(1)}%
              </span>
              <div className="ll-prob-bar-track">
                <div
                  className="ll-prob-bar-fill"
                  style={{
                    width: `${probs[key]}%`,
                    background: key === maxKey ? barColors[key] : 'rgba(255,255,255,.12)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ll-no-pred">分析数据准备中…</div>
      )}
    </div>
  )
}

export default function LogicLensLab() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [data, setData] = useState({ leagues: [], fixtures: [], predictions: {}, stats: null })
  const [yesterdayMatches, setYesterdayMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showHow, setShowHow] = useState(false)

  usePageMeta({
    title: '逻辑透镜 - 数据实验室 | Blake Pierce',
    description: '基于历史赛事数据与机器学习模型的数据分析研究项目。个人兴趣驱动，覆盖五大联赛，每日更新。仅供研究参考。',
    keywords: '逻辑透镜,LogicLens,数据实验室,足球数据,数据分析,数据研究,机器学习',
  })

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null)
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

  const todayStr = new Date().toLocaleDateString('zh-CN', TODAY_OPTIONS)
  const todayShort = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })

  return (
    <>
      <style>{CSS}</style>
      <div className="ll-wrap">

        {/* ── NAV ── */}
        <header className="ll-nav">
          <div className="ll-nav-inner">
            <Link to="/" className="ll-logo">
              <div className="ll-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="2.5" />
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                </svg>
              </div>
              <span className="ll-logo-text">逻辑透镜</span>
              <span className="ll-logo-sub">LogicLens Lab</span>
            </Link>

            <nav className="ll-nav-links desktop">
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="ll-nav-btn">
                  {item.label}
                </button>
              ))}
              <Link to="/" className="ll-back">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                返回首页
              </Link>
            </nav>

            <button
              className="ll-mobile-menu-btn"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="菜单"
            >
              {menuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu */}
          <div className="ll-mobile-menu" style={{ maxHeight: menuOpen ? 300 : 0 }}>
            <div className="ll-mobile-menu-inner">
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="ll-mobile-item">
                  {item.label}
                </button>
              ))}
              <Link to="/" className="ll-mobile-item" style={{ textDecoration: 'none' }}>
                ← 返回首页
              </Link>
            </div>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="ll-hero">
          <div className="ll-hero-eyebrow">数据实验室</div>
          <h1 className="ll-hero-title">
            我跟数据，<br />有一个<em>约定</em>
          </h1>
          <p className="ll-hero-desc">
            基于历史赛事数据与机器学习模型的个人研究项目。随机森林、支持向量机、神经网络——
            你不需要懂，我懂就够了。
          </p>
          <div className="ll-hero-meta">
            <div className="ll-meta-item">
              <div className="ll-meta-dot" />
              <span className="ll-meta-text">五大联赛覆盖</span>
            </div>
            <div className="ll-meta-item">
              <div className="ll-meta-dot" style={{ background: '#7c6ef0' }} />
              <span className="ll-meta-text">每日更新</span>
            </div>
            <div className="ll-meta-item">
              <div className="ll-meta-dot" style={{ background: '#f0c46c' }} />
              <span className="ll-meta-text">数据公开透明</span>
            </div>
            <span className="ll-date-badge">{todayStr}</span>
          </div>
        </section>

        {/* ── MAIN ── */}
        <main className="ll-main">

          {loading ? (
            <div className="ll-loading">
              <div className="ll-skel" style={{ height: 100 }} />
              <div className="ll-skel" style={{ height: 60 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="ll-skel" style={{ height: 140 }} />
                <div className="ll-skel" style={{ height: 140 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 10 }}>
                {[1,2,3,4].map(i => <div key={i} className="ll-skel" style={{ height: 130 }} />)}
              </div>
            </div>

          ) : error ? (
            <div className="ll-error">
              <div className="ll-state-icon" style={{ background: 'rgba(226,75,74,.12)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E24B4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <div className="ll-state-title" style={{ color: 'var(--text-primary,#f0eeff)' }}>加载失败</div>
              <div className="ll-state-sub">{error}</div>
              <button onClick={fetchData} className="ll-retry-btn">重新加载</button>
            </div>

          ) : isEmpty ? (
            <div className="ll-empty">
              <div className="ll-state-icon" style={{ background: 'rgba(255,255,255,.05)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(139,133,168,.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="ll-state-title" style={{ color: 'rgba(139,133,168,.8)' }}>今日暂无赛事数据</div>
              <div className="ll-state-sub">请在比赛日再来查看分析</div>
            </div>

          ) : (
            <>
              {/* Stat cards */}
              <div className="ll-stat-grid">
                <div className="ll-stat-card" style={{ '--_accent': 'rgba(78,207,179,.5)' }}>
                  <div className="ll-stat-eyebrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                    </svg>
                    昨日准确率
                  </div>
                  <div className="ll-stat-num green">
                    {data.stats?.yesterday?.rate != null
                      ? `${(data.stats.yesterday.rate * 100).toFixed(0)}%`
                      : '--'}
                  </div>
                  <div className="ll-stat-sub">
                    {data.stats?.yesterday ? `${data.stats.yesterday.hits} 中 / ${data.stats.yesterday.total} 场` : '暂无数据'}
                  </div>
                  {data.stats?.yesterday?.leagues && Object.keys(data.stats.yesterday.leagues).length > 0 && (
                    <div className="ll-srows">
                      {Object.entries(data.stats.yesterday.leagues).slice(0, 3).map(([league, ld]) => (
                        <div className="ll-srow" key={league}>
                          <span className="ll-srow-lbl">{leagueLabelMap[league] || LEAGUE_DISPLAY[league] || league}</span>
                          <div className="ll-srow-right">
                            <span className="ll-srow-count">{ld.hits}/{ld.total}</span>
                            {ld.rate != null && (
                              <span className={`ll-pill ${ld.rate >= 0.5 ? 'green' : 'amber'}`}>
                                {(ld.rate * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="ll-stat-card" style={{ '--_accent': 'rgba(124,110,240,.5)' }}>
                  <div className="ll-stat-eyebrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    近 7 天
                  </div>
                  <div className="ll-stat-num blue">
                    {data.stats?.week?.rate != null
                      ? `${(data.stats.week.rate * 100).toFixed(0)}%`
                      : '--'}
                  </div>
                  <div className="ll-stat-sub">
                    {data.stats?.week ? `${data.stats.week.hits} 中 / ${data.stats.week.total} 场` : '暂无数据'}
                  </div>
                  {data.stats?.week?.days && data.stats.week.days.length > 0 ? (
                    <div className="ll-srows">
                      {data.stats.week.days.slice(0, 3).map((day, i) => (
                        <div className="ll-srow" key={i}>
                          <span className="ll-srow-lbl">{day.date || `第${i + 1}天`}</span>
                          <div className="ll-srow-right">
                            <span className="ll-srow-count">{day.hits}/{day.total}</span>
                            {day.rate != null && (
                              <span className={`ll-pill ${day.rate >= 0.5 ? 'green' : 'amber'}`}>
                                {(day.rate * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="ll-league-tags">
                      {ALL_LEAGUES.map(lg => (
                        <span key={lg} className="ll-ltag">{lg}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quote */}
              <div className="ll-quote">
                <div className="ll-quote-title">我跟数据有一个约定</div>
                <div className="ll-quote-body">
                  你了解随机森林吗？你了解向量机吗？你了解神经网络吗？
                  不，你不需要了解，我懂就可以了。
                </div>
              </div>

              {/* Today's matches */}
              <section id="today" style={{ scrollMarginTop: 72 }}>
                <div className="ll-sec-hdr">
                  <div className="ll-sec-left">
                    <span className="ll-sec-title">今日赛事</span>
                    <span className="ll-sec-badge">{enrichedMatches.length} 场</span>
                    <span className="ll-sec-date">{todayShort}</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => setShowHow(v => !v)} className="ll-info-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                      </svg>
                      研究方向
                    </button>
                    {showHow && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowHow(false)} />
                        <div className="ll-tooltip">
                          <p>基于每个赛事近万场比赛，每场比赛 30 多个特征进行训练和建模，持续不断优化和完善。</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="ll-match-grid">
                  {enrichedMatches.map((m) => (
                    <MatchCard key={m.num} m={m} />
                  ))}
                </div>
              </section>

              {/* Stats section */}
              <section id="stats" style={{ scrollMarginTop: 72, marginTop: '1.5rem' }}>
                <div className="ll-sec-hdr">
                  <div className="ll-sec-left">
                    <span className="ll-sec-title">平台统计</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(74,70,102,.7)' }}>历史数据公开透明，用数据说话</span>
                </div>

                {yesterdayMatches.length > 0 ? (
                  <div className="ll-ym-wrap">
                    <div className="ll-ym-hdr">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                      </svg>
                      昨日平台分析记录
                    </div>
                    <div className={`ll-ym-viewport ${yesterdayMatches.length > 3 ? 'scroll' : ''}`}>
                      <div className={`ll-ym-list ${yesterdayMatches.length > 3 ? 'animated' : ''}`}>
                        {yesterdayMatches.map((m, i) => (
                          <div key={i} className="ll-ym-row">
                            <span className="ll-ym-league">{LEAGUE_DISPLAY[m.league_key] || m.league_key?.split('-').pop() || m.league}</span>
                            <span className="ll-ym-teams">{m.home_cn} vs {m.away_cn}</span>
                            {m.prediction ? (
                              <span className={`ll-pred-badge ${m.prediction.prediction === '主胜' ? 'home' : m.prediction.prediction === '客胜' ? 'away' : 'draw'}`}>
                                {m.prediction.prediction === '主胜' ? '主' : m.prediction.prediction === '客胜' ? '客' : '平'}
                              </span>
                            ) : (
                              <span className="ll-pred-badge none">--</span>
                            )}
                          </div>
                        ))}
                        {yesterdayMatches.length > 3 && yesterdayMatches.map((m, i) => (
                          <div key={`dup-${i}`} className="ll-ym-row">
                            <span className="ll-ym-league">{LEAGUE_DISPLAY[m.league_key] || m.league_key?.split('-').pop() || m.league}</span>
                            <span className="ll-ym-teams">{m.home_cn} vs {m.away_cn}</span>
                            {m.prediction ? (
                              <span className={`ll-pred-badge ${m.prediction.prediction === '主胜' ? 'home' : m.prediction.prediction === '客胜' ? 'away' : 'draw'}`}>
                                {m.prediction.prediction === '主胜' ? '主' : m.prediction.prediction === '客胜' ? '客' : '平'}
                              </span>
                            ) : (
                              <span className="ll-pred-badge none">--</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(74,70,102,.8)', fontSize: 13 }}>
                    暂无昨日分析记录
                  </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '1.25rem', marginBottom: '1.5rem' }}>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="ll-top-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                    回到顶部
                  </button>
                </div>
              </section>
            </>
          )}
        </main>

        {/* CTA */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(1rem,4vw,2.5rem) 2.5rem' }}>
          <ProductCTA productName="逻辑透镜数据实验室" note="「逻辑透镜」" />
        </div>

        {/* Footer */}
        <footer className="ll-footer">
          <div className="ll-footer-links">
            <Link to="/terms" className="ll-footer-link">用户协议</Link>
            <span className="ll-footer-sep">·</span>
            <Link to="/privacy" className="ll-footer-link">隐私政策</Link>
            <span className="ll-footer-sep">·</span>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="ll-footer-link">
              鄂ICP备2026022715号
            </a>
          </div>
          <div className="ll-footer-copy">© {new Date().getFullYear()} Blake Pierce · All rights reserved.</div>
          <div className="ll-footer-note">本平台为个人数据研究项目，所有数据仅供学习交流参考。</div>
          {enrichedMatches.length > 0 && (
            <div style={{ marginTop: '.75rem', fontSize: 12, color: 'rgba(74,70,102,.8)' }}>
              觉得有用？<ShareButton /> 试试
            </div>
          )}
        </footer>

      </div>
    </>
  )
}
