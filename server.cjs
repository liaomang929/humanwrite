const http = require('http');
const fs = require('fs');
const path = require('path');
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
