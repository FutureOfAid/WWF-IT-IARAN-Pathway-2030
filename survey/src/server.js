const express = require('express');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');
const { seedDrivers } = require('./seed');
const { DRIVER_VERSION } = require('./drivers');

const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

function requireAdmin(req, res, next) {
  if (!ADMIN_TOKEN) return next(); // open mode for first deploy; see README
  const provided = req.query.token || req.get('x-admin-token');
  if (provided !== ADMIN_TOKEN) return res.status(401).json({ error: 'unauthorized' });
  return next();
}

app.get('/api/health', async (req, res) => {
  res.json({ ok: true, db: db.kind, driver_version: DRIVER_VERSION });
});

app.get('/api/drivers', async (req, res) => {
  const { rows } = await db.query(
    `SELECT driver_id, title, short_definition, category, geography_lens,
            version, status, order_index
     FROM drivers
     WHERE active = 1 AND version = $1
     ORDER BY order_index ASC, driver_id ASC`,
    [DRIVER_VERSION],
  );
  res.json({ driver_version: DRIVER_VERSION, drivers: rows });
});

function validateScore(v) {
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}

app.post('/api/responses', async (req, res) => {
  try {
    const body = req.body || {};
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) return res.status(400).json({ error: 'no_items' });

    const response_id = crypto.randomUUID();
    const submitted_at = new Date().toISOString();
    const respondent_group = (body.respondent_group || '').toString().slice(0, 200);
    const role_or_function = (body.role_or_function || '').toString().slice(0, 200);
    const consent = body.consent ? 1 : 0;
    const open_comment = (body.open_comment || '').toString().slice(0, 4000);
    const completion_status = body.completion_status === 'partial' ? 'partial' : 'submitted';

    await db.query(
      `INSERT INTO survey_responses
       (response_id, submitted_at, respondent_group, role_or_function,
        consent, completion_status, driver_version, open_comment)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [response_id, submitted_at, respondent_group, role_or_function,
       consent, completion_status, DRIVER_VERSION, open_comment],
    );

    let stored = 0;
    for (const item of items) {
      if (!item || typeof item.driver_id !== 'string') continue;
      const importance = validateScore(item.importance_score);
      const uncertainty = validateScore(item.uncertainty_score);
      const comment = (item.driver_comment || '').toString().slice(0, 2000);
      if (importance == null && uncertainty == null && !comment) continue;
      await db.query(
        `INSERT INTO response_items
         (response_id, driver_id, importance_score, uncertainty_score,
          driver_comment, driver_version)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [response_id, item.driver_id, importance, uncertainty, comment, DRIVER_VERSION],
      );
      stored += 1;
    }

    res.json({ ok: true, response_id, items_stored: stored });
  } catch (e) {
    console.error('POST /api/responses', e);
    res.status(500).json({ error: 'server_error' });
  }
});

// Aggregate summary per driver. driver_summary is computed dynamically so it
// always reflects current data; materialising is a future option.
app.get('/api/driver-summary', async (req, res) => {
  const { rows } = await db.query(
    `SELECT d.driver_id, d.title, d.category,
            COUNT(ri.id) AS n_responses,
            AVG(ri.importance_score)  AS importance_average,
            AVG(ri.uncertainty_score) AS uncertainty_average
     FROM drivers d
     LEFT JOIN response_items ri
       ON ri.driver_id = d.driver_id
     WHERE d.active = 1 AND d.version = $1
     GROUP BY d.driver_id, d.title, d.category, d.order_index
     ORDER BY d.order_index ASC, d.driver_id ASC`,
    [DRIVER_VERSION],
  );

  // Compute population stddev in JS so the SQL stays portable across pg/sqlite.
  const stddevs = await db.query(
    `SELECT driver_id, importance_score, uncertainty_score FROM response_items`,
  );
  const byDriver = new Map();
  for (const r of stddevs.rows) {
    if (!byDriver.has(r.driver_id)) byDriver.set(r.driver_id, { imp: [], unc: [] });
    if (r.importance_score != null)  byDriver.get(r.driver_id).imp.push(Number(r.importance_score));
    if (r.uncertainty_score != null) byDriver.get(r.driver_id).unc.push(Number(r.uncertainty_score));
  }
  const stddev = (xs) => {
    if (xs.length < 2) return null;
    const m = xs.reduce((a, b) => a + b, 0) / xs.length;
    const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length;
    return Math.sqrt(v);
  };

  const out = rows.map((r) => {
    const s = byDriver.get(r.driver_id) || { imp: [], unc: [] };
    const imp_avg = r.importance_average == null ? null : Number(r.importance_average);
    const unc_avg = r.uncertainty_average == null ? null : Number(r.uncertainty_average);
    return {
      driver_id: r.driver_id,
      title: r.title,
      category: r.category,
      n_responses: Number(r.n_responses) || 0,
      importance_average:  imp_avg,
      importance_stddev:   stddev(s.imp),
      uncertainty_average: unc_avg,
      uncertainty_stddev:  stddev(s.unc),
      critical_uncertainty_score:
        imp_avg != null && unc_avg != null ? imp_avg * unc_avg : null,
    };
  });
  res.json({ driver_version: DRIVER_VERSION, summary: out });
});

app.get('/api/admin/responses', requireAdmin, async (req, res) => {
  const responses = await db.query(
    `SELECT response_id, submitted_at, respondent_group, role_or_function,
            consent, completion_status, driver_version, open_comment
     FROM survey_responses ORDER BY submitted_at DESC`,
  );
  const items = await db.query(
    `SELECT response_id, driver_id, importance_score, uncertainty_score,
            driver_comment, driver_version FROM response_items`,
  );
  res.json({ responses: responses.rows, items: items.rows });
});

app.get('/api/admin/export.csv', requireAdmin, async (req, res) => {
  const { rows } = await db.query(
    `SELECT sr.response_id, sr.submitted_at, sr.respondent_group,
            sr.role_or_function, sr.consent, sr.driver_version AS response_driver_version,
            ri.driver_id, ri.importance_score, ri.uncertainty_score,
            ri.driver_comment, ri.driver_version AS item_driver_version
     FROM survey_responses sr
     LEFT JOIN response_items ri ON ri.response_id = sr.response_id
     ORDER BY sr.submitted_at DESC, ri.driver_id ASC`,
  );
  const header = [
    'response_id','submitted_at','respondent_group','role_or_function','consent',
    'response_driver_version','driver_id','importance_score','uncertainty_score',
    'driver_comment','item_driver_version',
  ];
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [header.join(',')];
  for (const r of rows) lines.push(header.map((h) => esc(r[h])).join(','));
  res.set('Content-Type', 'text/csv; charset=utf-8');
  res.set('Content-Disposition', 'attachment; filename="wwf_pathway_2030_responses.csv"');
  res.send(lines.join('\n'));
});

// Importance × uncertainty matrix points: one (x, y, count) per (importance, uncertainty) pair.
app.get('/api/matrix', async (req, res) => {
  const { rows } = await db.query(
    `SELECT driver_id, importance_score AS x, uncertainty_score AS y
     FROM response_items
     WHERE importance_score IS NOT NULL AND uncertainty_score IS NOT NULL`,
  );
  res.json({ points: rows });
});

const PORT = process.env.PORT || 3001;

(async () => {
  await db.init();
  await seedDrivers();
  app.listen(PORT, () => {
    console.log(`WWF-IT-Pathway-2030 survey running on :${PORT} (db=${db.kind})`);
  });
})().catch((e) => { console.error(e); process.exit(1); });
