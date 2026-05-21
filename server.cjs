const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();
const { Pool } = require('pg');
const port = process.env.PORT || 8080;

// ── PostgreSQL ──────────────────────────────────────────────
const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'logiclens_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'logiclens',
});

// Try dates in order, return results from the first date that has data
function doQuery(dates, lk, res) {
  const seen = new Set();
  function attempt(idx) {
    while (idx < dates.length && seen.has(dates[idx])) idx++;
    if (idx >= dates.length) {
      json(res, { fixtures: [], date: dates[0] });
      return;
    }
    const dt = dates[idx];
    seen.add(dt);
    let sql = 'SELECT num, home_cn, away_cn, home_en, away_en, league, league_key, kickoff FROM fixtures WHERE match_date=$1';
    const params = [dt];
    if (lk) { sql += ' AND league_key=$2'; params.push(lk); }
    sql += ' ORDER BY num';
    pool.query(sql, params)
      .then(r => {
        if (r.rows.length) json(res, { fixtures: r.rows, date: dt });
        else attempt(idx + 1);
      })
      .catch(e => { console.error('DB error /fixtures:', e.message); attempt(idx + 1); });
  }
  attempt(0);
}

function doPrecomputedQuery(matchDate, lk, res, onEmpty) {
  let sql = 'SELECT num, prediction, prediction_label, confidence, probabilities, model_id FROM predictions WHERE match_date=$1';
  const params = [matchDate];
  if (lk) { sql += ' AND league_key=$2'; params.push(lk); }
  sql += ' ORDER BY num';
  pool.query(sql, params)
    .then(r => {
      if (!r.rows.length) { onEmpty(); return; }
      const predictions = {};
      for (const row of r.rows) {
        predictions[row.num] = {
          prediction: row.prediction,
          prediction_label: row.prediction_label,
          confidence: row.confidence,
          probabilities: row.probabilities || {},
          model_id: row.model_id,
        };
      }
      json(res, { predictions });
    })
    .catch(e => { console.error('DB error /precomputed:', e.message); onEmpty(); });
}

// ── MIME types ─────────────────────────────────────────────
const mimes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};

function json(res, data, code) {
  res.writeHead(code || 200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// --- helpers ---
function dateStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function todayStr() {
  const n = new Date();
  return dateStr(n);
}
// Before 11:30 CST, return yesterday's date (fallback when today has no data)
function yesterdayStr() {
  const n = new Date();
  return dateStr(new Date(n.getFullYear(), n.getMonth(), n.getDate() - 1));
}
function effectiveToday() {
  const n = new Date();
  const h = n.getHours(), mi = n.getMinutes();
  if (h < 11 || (h === 11 && mi < 30)) return yesterdayStr();
  return todayStr();
}
function isBefore1130() {
  const n = new Date();
  const h = n.getHours(), mi = n.getMinutes();
  return h < 11 || (h === 11 && mi < 30);
}

// ── Analytics ───────────────────────────────────────────────
const ANALYTICS_INIT_SQL = `
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  path VARCHAR(512) NOT NULL,
  visitor_hash VARCHAR(64) NOT NULL,
  user_agent TEXT,
  referer TEXT,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views (viewed_at);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views (path);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views (visitor_hash, viewed_at);
`;

pool.query(ANALYTICS_INIT_SQL)
  .then(() => console.log('Analytics table ready'))
  .catch(e => console.error('Analytics init error:', e.message));

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (xf) return xf.split(',')[0].trim();
  return req.socket.remoteAddress || '';
}

function isBot(ua) {
  if (!ua) return true;
  return /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|bingpreview|headless/i.test(ua);
}

function shanghaiDateStr(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(d);
}

function visitorHash(ip, ua) {
  const salt = process.env.ANALYTICS_SALT || process.env.ANALYTICS_SECRET || 'bp-default-salt';
  const day = shanghaiDateStr();
  return crypto.createHash('sha256').update(`${ip}|${day}|${ua || ''}|${salt}`).digest('hex').slice(0, 32);
}

function analyticsKeyOk(u) {
  const key = u.searchParams.get('key');
  return key && process.env.ANALYTICS_SECRET && key === process.env.ANALYTICS_SECRET;
}

async function recordPageView(req, res) {
  try {
    const ua = req.headers['user-agent'] || '';
    if (isBot(ua)) { json(res, { ok: true, skipped: 'bot' }); return; }

    let body = {};
    try { body = JSON.parse(await readBody(req) || '{}'); } catch { body = {}; }
    let pagePath = typeof body.path === 'string' ? body.path : '/';
    if (!pagePath.startsWith('/')) pagePath = '/' + pagePath;
    if (pagePath.length > 512) pagePath = pagePath.slice(0, 512);
    if (pagePath === '/stats') { json(res, { ok: true, skipped: 'stats' }); return; }

    const ip = clientIp(req);
    const vHash = visitorHash(ip, ua);
    const referer = (req.headers.referer || '').slice(0, 1024);

    await pool.query(
      'INSERT INTO page_views (path, visitor_hash, user_agent, referer) VALUES ($1, $2, $3, $4)',
      [pagePath, vHash, ua.slice(0, 512), referer || null],
    );
    json(res, { ok: true });
  } catch (e) {
    console.error('Analytics record error:', e.message);
    json(res, { ok: false }, 500);
  }
}

async function analyticsStats(req, res, u) {
  if (!analyticsKeyOk(u)) { json(res, { error: 'forbidden' }, 403); return; }
  try {
    const today = shanghaiDateStr();
    const yesterday = shanghaiDateStr(new Date(Date.now() - 86400000));

    const [todayRes, yestRes, weekRes, monthRes, dailyRes, pagesRes] = await Promise.all([
      pool.query(
        `SELECT COUNT(*)::int AS pv, COUNT(DISTINCT visitor_hash)::int AS uv
         FROM page_views WHERE (viewed_at AT TIME ZONE 'Asia/Shanghai')::date = $1::date`,
        [today],
      ),
      pool.query(
        `SELECT COUNT(*)::int AS pv, COUNT(DISTINCT visitor_hash)::int AS uv
         FROM page_views WHERE (viewed_at AT TIME ZONE 'Asia/Shanghai')::date = $1::date`,
        [yesterday],
      ),
      pool.query(
        `SELECT COUNT(*)::int AS pv, COUNT(DISTINCT visitor_hash)::int AS uv
         FROM page_views WHERE viewed_at >= NOW() - INTERVAL '7 days'`,
      ),
      pool.query(
        `SELECT COUNT(*)::int AS pv, COUNT(DISTINCT visitor_hash)::int AS uv
         FROM page_views WHERE viewed_at >= NOW() - INTERVAL '30 days'`,
      ),
      pool.query(
        `SELECT (viewed_at AT TIME ZONE 'Asia/Shanghai')::date AS date,
                COUNT(*)::int AS pv, COUNT(DISTINCT visitor_hash)::int AS uv
         FROM page_views WHERE viewed_at >= NOW() - INTERVAL '14 days'
         GROUP BY 1 ORDER BY 1`,
      ),
      pool.query(
        `SELECT path, COUNT(*)::int AS pv, COUNT(DISTINCT visitor_hash)::int AS uv
         FROM page_views WHERE viewed_at >= NOW() - INTERVAL '30 days'
         GROUP BY path ORDER BY pv DESC LIMIT 20`,
      ),
    ]);

    json(res, {
      today: todayRes.rows[0] || { pv: 0, uv: 0 },
      yesterday: yestRes.rows[0] || { pv: 0, uv: 0 },
      week: weekRes.rows[0] || { pv: 0, uv: 0 },
      month: monthRes.rows[0] || { pv: 0, uv: 0 },
      daily: dailyRes.rows.map(r => ({
        date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date).slice(0, 10),
        pv: r.pv,
        uv: r.uv,
      })),
      pages: pagesRes.rows,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Analytics stats error:', e.message);
    json(res, { error: 'server error' }, 500);
  }
}

// ── HTTP Server ────────────────────────────────────────────
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
  const p = u.pathname;

  // ── LogicLens API ──────────────────────────────────────
  if (p.startsWith('/api/logiclens/')) {

    // GET /api/logiclens/leagues
    if (p === '/api/logiclens/leagues') {
      pool.query('SELECT key, label, country, name, model_count, latest_model, match_count, teams FROM leagues ORDER BY key')
        .then(r => json(res, { leagues: r.rows }))
        .catch(e => { console.error('DB error /leagues:', e.message); json(res, { leagues: [] }); });
      return;
    }

    // GET /api/logiclens/stats
    if (p === '/api/logiclens/stats') {
      pool.query('SELECT data FROM stats ORDER BY stat_date DESC LIMIT 1')
        .then(r => {
          if (r.rows.length && r.rows[0].data) {
            json(res, r.rows[0].data);
          } else {
            json(res, {
              yesterday: { total: 0, hits: 0, rate: 0, rate_display: '暂无数据', leagues: {} },
              week: { total: 0, hits: 0, rate: 0, rate_display: '暂无数据', leagues: {} },
            });
          }
        })
        .catch(e => { console.error('DB error /stats:', e.message); json(res, {}); });
      return;
    }

    // GET /api/logiclens/yesterday — yesterday's fixtures + predictions
    if (p === '/api/logiclens/yesterday') {
      const yd = yesterdayStr();
      Promise.all([
        pool.query('SELECT num, home_cn, away_cn, league, league_key FROM fixtures WHERE match_date=$1 ORDER BY num', [yd]),
        pool.query('SELECT num, prediction, prediction_label, confidence, probabilities FROM predictions WHERE match_date=$1 ORDER BY num', [yd]),
      ])
        .then(([fixturesRes, predsRes]) => {
          const predMap = {};
          for (const row of predsRes.rows) {
            predMap[row.num] = {
              prediction: row.prediction,
              prediction_label: row.prediction_label,
              confidence: row.confidence,
              probabilities: row.probabilities,
            };
          }
          const matches = fixturesRes.rows.map(f => ({
            num: f.num,
            home_cn: f.home_cn,
            away_cn: f.away_cn,
            league: f.league,
            league_key: f.league_key,
            prediction: predMap[f.num] || null,
          }));
          json(res, { date: yd, matches });
        })
        .catch(e => { console.error('DB error /yesterday:', e.message); json(res, { matches: [] }); });
      return;
    }

    // GET /api/logiclens/fixtures/today?league_key=X&date=YYYY-MM-DD
    if (p === '/api/logiclens/fixtures/today') {
      const reqDate = u.searchParams.get('date');
      const lk = u.searchParams.get('league_key');
      // Try today first (supports manual early-run)
      const tryDays = reqDate ? [reqDate] : [todayStr(), effectiveToday()];
      doQuery(tryDays, lk, res);
      return;
    }

    // GET /api/logiclens/precomputed/{date}?league_key=X
    const pm = p.match(/^\/api\/logiclens\/precomputed\/(\d{4}-\d{2}-\d{2})$/);
    if (pm) {
      let matchDate = pm[1];
      const lk = u.searchParams.get('league_key');

      // Try requested date first; if before 11:30 and today has data, show it
      let fallback = null;
      if (isBefore1130()) {
        // If requested date is today but has no data, fall back to yesterday
        fallback = yesterdayStr();
      }

      doPrecomputedQuery(matchDate, lk, res, () => {
        // Fallback: no data on requested date
        if (fallback) doPrecomputedQuery(fallback, lk, res, () => json(res, { predictions: {} }));
        else json(res, { predictions: {} });
      });
      return;
    }

    json(res, { error: 'not found' }, 404);
    return;
  }

  // ── Analytics API (before /api/ proxy) ─────────────────
  if (p === '/api/analytics/view' && req.method === 'POST') {
    recordPageView(req, res);
    return;
  }
  if (p === '/api/analytics/stats' && req.method === 'GET') {
    analyticsStats(req, res, u);
    return;
  }

  // ── Proxy /api/* → AI Cleaner (port 3003) ─────────────
  if (p.startsWith('/api/')) {
    const opts = {
      hostname: 'localhost', port: 3003,
      path: req.url, method: req.method,
      headers: req.headers,
    };
    const proxy = http.request(opts, pr => { res.writeHead(pr.statusCode, pr.headers); pr.pipe(res); });
    proxy.on('error', () => { res.writeHead(502); res.end('API proxy error'); });
    req.pipe(proxy);
    return;
  }

  // ── Redirect /logiclens → portal ────────────────────────
  if (p.startsWith('/logiclens')) {
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }

  // ── Portal static files ────────────────────────────────
  const PORTAL_ROOT = path.join(__dirname, "dist");
  let fp = p === '/' ? '/index.html' : p;
    fp = path.join(PORTAL_ROOT, fp);
  if (!fp.startsWith(PORTAL_ROOT)) { res.writeHead(403); res.end(); return; }
  const ext = path.extname(fp);
  fs.readFile(fp, (err, data) => {
    if (err) {
      if (!path.extname(req.url)) {
        fp = path.join(PORTAL_ROOT, 'index.html');
        return fs.readFile(fp, (e2, d2) => {
          if (e2) { res.writeHead(500); res.end(); }
          else { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(d2); }
        });
      }
      res.writeHead(404); res.end('Not Found'); return;
    }
    res.writeHead(200, { 'Content-Type': mimes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log('Server running on port ' + port));
