const express = require('express');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');
const { seedDrivers } = require('./seed');
const { DRIVER_VERSION, DRIVERS } = require('./drivers');

// short_label is a synthetic, compact Italian display label kept in drivers.js
// (not a DB column, like title_en). Looked up by driver_id so the admin matrix
// can render readable Dxx legends without touching the schema or stored data.
const SHORT_LABEL_BY_ID = new Map(DRIVERS.map((d) => [d.driver_id, d.short_label]));

const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Normalize the configured token. Railway (and most env-var UIs) silently keep
// a trailing newline or space when a value is pasted, and some users wrap the
// value in quotes; an untrimmed/unquoted compare then fails the length check
// and returns 401 even though the "right" password was set. normalizeToken()
// strips surrounding whitespace (incl. NBSP / zero-width chars) and one layer
// of matching ASCII quotes. The provided credential is normalized the same way
// at the edge below so the two sides cannot diverge on whitespace/quoting.
function normalizeToken(raw) {
  // Strip ASCII whitespace (\s, which in JS already covers NBSP U+00A0 and BOM
  // U+FEFF) plus zero-width space/joiner (U+200B-U+200D), which \s does NOT
  // cover. Escapes are used (not literal invisible chars) so the source is
  // unambiguous and copy-safe.
  const TRIM = /^[\s\u00A0\u200B-\u200D\uFEFF]+|[\s\u00A0\u200B-\u200D\uFEFF]+$/g;
  let s = String(raw || '').replace(TRIM, '');
  if (s.length >= 2 && ((s[0] === '"' && s[s.length - 1] === '"') ||
                        (s[0] === "'" && s[s.length - 1] === "'"))) {
    s = s.slice(1, -1).replace(TRIM, '');
  }
  return s;
}

const ADMIN_TOKEN = normalizeToken(process.env.ADMIN_TOKEN);

// Survey lifecycle switch. Public collection is now CLOSED: the form no longer
// accepts new submissions and the public page shows aggregated results instead.
// Closed is the default so the live deploy is closed without any extra env var;
// set SURVEY_OPEN=1 (or true/yes/on) to re-open collection if a new round is
// needed. Admin functions (list/export/delete) are unaffected by this switch.
function envTruthy(raw) {
  return /^(1|true|yes|on)$/i.test(String(raw || '').trim());
}
const SURVEY_OPEN = envTruthy(process.env.SURVEY_OPEN);

function tokensMatch(provided) {
  // Compare as UTF-8 bytes. Length differences can't be hidden, so we fall
  // through to a fixed-cost compare against ADMIN_TOKEN on mismatch to keep the
  // timing roughly constant rather than returning early on length alone.
  const a = Buffer.from(String(provided), 'utf8');
  const b = Buffer.from(ADMIN_TOKEN, 'utf8');
  if (a.length !== b.length) {
    crypto.timingSafeEqual(b, b);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

// Gate every admin view and results/export API. Fails closed: if ADMIN_TOKEN
// is not configured the endpoints are unavailable rather than world-readable,
// so survey results can never be exposed by a misconfigured deploy.
//
// The credential may arrive three ways, accepted consistently:
//   - X-Admin-Token header (admin.html uses this)
//   - ?token= query param (used for the CSV download link)
//   - token field on a form/JSON body (defensive: some proxies drop headers)
// Note: when passing ?token= manually, a value containing "&" (e.g. WWF&I)
// MUST be percent-encoded as %26 or the browser treats it as a new query param.
// The admin UI already encodeURIComponent()s the token, so this only matters
// for hand-built URLs.
function requireAdmin(req, res, next) {
  if (!ADMIN_TOKEN) {
    return res.status(503).json({ error: 'admin_token_not_configured' });
  }
  const fromBody = req.body && typeof req.body.token === 'string' ? req.body.token : '';
  const provided = normalizeToken(req.query.token || req.get('x-admin-token') || fromBody || '');
  if (!tokensMatch(provided)) return res.status(401).json({ error: 'unauthorized' });
  return next();
}

// Secret-safe admin diagnostics. Lets an operator verify what the *running*
// process actually holds for ADMIN_TOKEN without leaking it. Exposes only:
//   - admin_configured: is a non-empty token present at all
//   - admin_token_len:  byte length after normalization (catches stray quotes /
//                       whitespace that change the length)
//   - admin_token_sha256_prefix: first 8 hex chars of SHA-256(token). To check
//     a candidate, compute `echo -n 'WWF&I' | sha256sum` locally and compare
//     the first 8 chars. A full hash is never returned, so the prefix alone is
//     not brute-forceable into the secret.
// This is enough to distinguish "env var stale/wrong" from "value matches".
app.get('/api/health', async (req, res) => {
  const adminConfigured = ADMIN_TOKEN.length > 0;
  res.json({
    ok: true,
    db: db.kind,
    driver_version: DRIVER_VERSION,
    survey_open: SURVEY_OPEN,
    admin_configured: adminConfigured,
    admin_token_len: adminConfigured ? ADMIN_TOKEN.length : 0,
    admin_token_sha256_prefix: adminConfigured
      ? crypto.createHash('sha256').update(ADMIN_TOKEN, 'utf8').digest('hex').slice(0, 8)
      : null,
  });
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

// Scores are on a pedagogical 4-level scale (1–4) for importance and
// uncertainty. Older responses collected under earlier driver versions may
// carry 1–5 values; those rows are never re-validated, so DB compatibility is
// preserved — this only constrains newly submitted items.
function validateScore(v) {
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1 || n > 4) return null;
  return n;
}

app.post('/api/responses', async (req, res) => {
  try {
    // Collection is closed: reject new submissions server-side, not just in the
    // UI, so a direct POST cannot bypass the closed survey. Existing data and
    // admin functions are untouched.
    if (!SURVEY_OPEN) {
      return res.status(403).json({ error: 'survey_closed' });
    }
    const body = req.body || {};
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) return res.status(400).json({ error: 'no_items' });

    // Respondent type is mandatory: a response with no group is rejected so the
    // category can be relied on downstream. The frontend also enforces this, but
    // the server is the source of truth.
    const respondent_group = (body.respondent_group || '').toString().slice(0, 200);
    if (!respondent_group.trim()) {
      return res.status(400).json({ error: 'respondent_group_required' });
    }

    // Same-device anti-duplication. The client sends a stable client_id stored
    // in its localStorage; if we already hold a response for that id we reject
    // with 409 so one browser cannot submit twice even if its local flag was
    // cleared and re-acquired. client_id is optional (private mode / storage off
    // -> null), in which case this guard is simply skipped and we fall back to
    // the client-side flag only. Deleting a response server-side does NOT clear
    // the client's localStorage flag, so that browser stays blocked unless its
    // storage is cleared (documented limitation; no admin reset workflow).
    const client_id = (body.client_id || '').toString().slice(0, 100) || null;
    if (client_id) {
      const existing = await db.query(
        `SELECT 1 FROM survey_responses WHERE client_id = $1 LIMIT 1`,
        [client_id],
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'already_submitted' });
      }
    }

    const response_id = crypto.randomUUID();
    const submitted_at = new Date().toISOString();
    const role_or_function = (body.role_or_function || '').toString().slice(0, 200);
    const consent = body.consent ? 1 : 0;
    const open_comment = (body.open_comment || '').toString().slice(0, 4000);
    const completion_status = body.completion_status === 'partial' ? 'partial' : 'submitted';

    await db.query(
      `INSERT INTO survey_responses
       (response_id, submitted_at, respondent_group, role_or_function,
        consent, completion_status, driver_version, open_comment, client_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [response_id, submitted_at, respondent_group, role_or_function,
       consent, completion_status, DRIVER_VERSION, open_comment, client_id],
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

// Aggregate summary per active driver, computed dynamically from the live
// response data so it always reflects current responses. The coordinates here
// (importance_average, uncertainty_average) are the single source of truth for
// BOTH the admin matrix and the public results chart — neither view hardcodes
// or estimates positions. Foresight orientation is fixed downstream as
// x = uncertainty_average, y = importance_average.
async function computeDriverSummary() {
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

  return rows.map((r) => {
    const s = byDriver.get(r.driver_id) || { imp: [], unc: [] };
    const imp_avg = r.importance_average == null ? null : Number(r.importance_average);
    const unc_avg = r.uncertainty_average == null ? null : Number(r.uncertainty_average);
    return {
      driver_id: r.driver_id,
      title: r.title,
      short_label: SHORT_LABEL_BY_ID.get(r.driver_id) || r.title,
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
}

app.get('/api/driver-summary', requireAdmin, async (req, res) => {
  const summary = await computeDriverSummary();
  res.json({ driver_version: DRIVER_VERSION, summary });
});

// Public, unauthenticated results feed for the closed-survey results page. It
// reuses computeDriverSummary() so the public chart shows the SAME live
// coordinates as the admin matrix. Only aggregate, non-identifying fields are
// exposed (per-driver averages, counts, labels) — never raw responses,
// comments, respondent groups or the response list. total_responses lets the
// page show the sample size without revealing individual submissions.
app.get('/api/public-results', async (req, res) => {
  try {
    const summary = await computeDriverSummary();
    const totals = await db.query(`SELECT COUNT(*) AS n FROM survey_responses`);
    const total_responses = Number(totals.rows[0] && totals.rows[0].n) || 0;
    const publicSummary = summary.map((d) => ({
      driver_id: d.driver_id,
      title: d.title,
      short_label: d.short_label,
      category: d.category,
      n_responses: d.n_responses,
      importance_average: d.importance_average,
      uncertainty_average: d.uncertainty_average,
      critical_uncertainty_score: d.critical_uncertainty_score,
    }));
    res.json({
      driver_version: DRIVER_VERSION,
      survey_open: SURVEY_OPEN,
      total_responses,
      summary: publicSummary,
    });
  } catch (e) {
    console.error('GET /api/public-results', e);
    res.status(500).json({ error: 'server_error' });
  }
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

// Delete a single response (and its items) by response_id. Scoped to one
// response so charts/lists can be cleaned of test or erroneous submissions
// without touching any other data. Children are removed first, then the
// parent; if the parent did not exist we report 404 so the UI can surface it.
app.delete('/api/admin/responses/:responseId', requireAdmin, async (req, res) => {
  try {
    const responseId = String(req.params.responseId || '');
    if (!responseId) return res.status(400).json({ error: 'missing_response_id' });

    await db.query(`DELETE FROM response_items WHERE response_id = $1`, [responseId]);
    const result = await db.query(
      `DELETE FROM survey_responses WHERE response_id = $1`,
      [responseId],
    );

    // pg reports affected rows in rowCount; the sqlite wrapper also returns
    // rowCount (info.changes). Treat 0 as "nothing matched" -> 404.
    if (!result.rowCount) return res.status(404).json({ error: 'not_found' });

    res.json({ ok: true, response_id: responseId });
  } catch (e) {
    console.error('DELETE /api/admin/responses/:responseId', e);
    res.status(500).json({ error: 'server_error' });
  }
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

// Foresight matrix points: x = uncertainty, y = importance (strategic-foresight
// convention), one (x, y) per scored response item.
app.get('/api/matrix', requireAdmin, async (req, res) => {
  const { rows } = await db.query(
    `SELECT driver_id, uncertainty_score AS x, importance_score AS y
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
