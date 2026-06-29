// Database abstraction. Uses PostgreSQL when DATABASE_URL is set (Railway),
// otherwise falls back to local SQLite for development.
//
// Both drivers expose the same async interface: query(sql, params) -> { rows }.
// We use $1/$2 placeholders everywhere; sqlite wrapper rewrites them to ?.
const path = require('path');
const fs = require('fs');

const USE_PG = !!process.env.DATABASE_URL;

let impl;

if (USE_PG) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSL === 'disable' ? false : { rejectUnauthorized: false },
  });
  impl = {
    kind: 'pg',
    query: (sql, params = []) => pool.query(sql, params),
    exec: (sql) => pool.query(sql),
    close: () => pool.end(),
  };
} else {
  let Database;
  try {
    Database = require('better-sqlite3');
  } catch (e) {
    console.error(
      '\nNo DATABASE_URL is set, and the SQLite fallback (better-sqlite3) is\n' +
      'unavailable. On Railway you must attach a PostgreSQL plugin and expose\n' +
      'its DATABASE_URL to this service. For local development, install build\n' +
      'tools (python3, make, g++) and run `npm install` again to compile\n' +
      'better-sqlite3.\n',
    );
    throw e;
  }
  const dataDir = process.env.SQLITE_DIR || path.join(__dirname, '..', 'db');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, 'survey.sqlite');
  const sdb = new Database(dbPath);
  sdb.pragma('journal_mode = WAL');
  sdb.pragma('foreign_keys = ON');

  const rewrite = (sql) => sql.replace(/\$(\d+)/g, '?');

  impl = {
    kind: 'sqlite',
    query: async (sql, params = []) => {
      const text = rewrite(sql);
      const lower = text.trim().toLowerCase();
      const stmt = sdb.prepare(text);
      if (lower.startsWith('select') || lower.includes(' returning ')) {
        const rows = stmt.all(...params);
        return { rows };
      }
      const info = stmt.run(...params);
      return { rows: [], rowCount: info.changes, lastInsertRowid: info.lastInsertRowid };
    },
    exec: async (sql) => sdb.exec(sql),
    close: () => sdb.close(),
  };
}

const SCHEMA_PG = `
  CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    driver_id TEXT NOT NULL,
    title TEXT NOT NULL,
    short_definition TEXT DEFAULT '',
    category TEXT,
    geography_lens TEXT,
    version TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    order_index INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    UNIQUE (driver_id, version)
  );
  CREATE TABLE IF NOT EXISTS survey_responses (
    id SERIAL PRIMARY KEY,
    response_id TEXT UNIQUE NOT NULL,
    submitted_at TEXT NOT NULL,
    respondent_group TEXT,
    role_or_function TEXT,
    consent INTEGER DEFAULT 0,
    completion_status TEXT DEFAULT 'submitted',
    driver_version TEXT NOT NULL,
    open_comment TEXT,
    client_id TEXT
  );
  ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS client_id TEXT;
  CREATE INDEX IF NOT EXISTS idx_responses_client ON survey_responses(client_id);
  CREATE TABLE IF NOT EXISTS response_items (
    id SERIAL PRIMARY KEY,
    response_id TEXT NOT NULL,
    driver_id TEXT NOT NULL,
    importance_score INTEGER,
    uncertainty_score INTEGER,
    driver_comment TEXT,
    driver_version TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_items_response ON response_items(response_id);
  CREATE INDEX IF NOT EXISTS idx_items_driver ON response_items(driver_id);
  -- Scenario sense-check feedback. Independent table: it never touches the
  -- driver-survey tables above, so existing responses are fully preserved.
  -- One row per (respondent, scenario) submission; a respondent may comment on
  -- multiple scenarios (no same-device lock here, unlike the closed driver survey).
  CREATE TABLE IF NOT EXISTS scenario_feedback (
    id SERIAL PRIMARY KEY,
    feedback_id TEXT UNIQUE NOT NULL,
    submitted_at TEXT NOT NULL,
    scenario_id TEXT NOT NULL,
    scenario_version TEXT NOT NULL,
    respondent_group TEXT NOT NULL,
    respondent_name TEXT,
    respondent_email TEXT,
    plausibility_score INTEGER,
    credible_elements TEXT,
    weak_elements TEXT,
    blind_spots TEXT,
    signals TEXT,
    title_comment TEXT,
    general_comment TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_feedback_scenario ON scenario_feedback(scenario_id);
  CREATE INDEX IF NOT EXISTS idx_feedback_group ON scenario_feedback(respondent_group);
`;

const SCHEMA_SQLITE = `
  CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_id TEXT NOT NULL,
    title TEXT NOT NULL,
    short_definition TEXT DEFAULT '',
    category TEXT,
    geography_lens TEXT,
    version TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    order_index INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    UNIQUE (driver_id, version)
  );
  CREATE TABLE IF NOT EXISTS survey_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    response_id TEXT UNIQUE NOT NULL,
    submitted_at TEXT NOT NULL,
    respondent_group TEXT,
    role_or_function TEXT,
    consent INTEGER DEFAULT 0,
    completion_status TEXT DEFAULT 'submitted',
    driver_version TEXT NOT NULL,
    open_comment TEXT,
    client_id TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_responses_client ON survey_responses(client_id);
  CREATE TABLE IF NOT EXISTS response_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    response_id TEXT NOT NULL,
    driver_id TEXT NOT NULL,
    importance_score INTEGER,
    uncertainty_score INTEGER,
    driver_comment TEXT,
    driver_version TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_items_response ON response_items(response_id);
  CREATE INDEX IF NOT EXISTS idx_items_driver ON response_items(driver_id);
  CREATE TABLE IF NOT EXISTS scenario_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feedback_id TEXT UNIQUE NOT NULL,
    submitted_at TEXT NOT NULL,
    scenario_id TEXT NOT NULL,
    scenario_version TEXT NOT NULL,
    respondent_group TEXT NOT NULL,
    respondent_name TEXT,
    respondent_email TEXT,
    plausibility_score INTEGER,
    credible_elements TEXT,
    weak_elements TEXT,
    blind_spots TEXT,
    signals TEXT,
    title_comment TEXT,
    general_comment TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_feedback_scenario ON scenario_feedback(scenario_id);
  CREATE INDEX IF NOT EXISTS idx_feedback_group ON scenario_feedback(respondent_group);
`;

async function init() {
  const schema = impl.kind === 'pg' ? SCHEMA_PG : SCHEMA_SQLITE;
  await impl.exec(schema);
  // SQLite (and only SQLite) lacks ADD COLUMN IF NOT EXISTS, and a DB created
  // before client_id existed won't pick it up from CREATE TABLE IF NOT EXISTS.
  // Add it idempotently for those pre-existing dev databases by attempting the
  // ALTER and swallowing only the "duplicate column" error (column already
  // present). Postgres uses ADD COLUMN IF NOT EXISTS inline in SCHEMA_PG.
  if (impl.kind === 'sqlite') {
    try {
      await impl.exec(`ALTER TABLE survey_responses ADD COLUMN client_id TEXT`);
      await impl.exec(
        `CREATE INDEX IF NOT EXISTS idx_responses_client ON survey_responses(client_id)`,
      );
    } catch (e) {
      if (!/duplicate column name/i.test(String(e && e.message))) {
        console.error('client_id migration failed', e);
      }
    }
  }
}

module.exports = { ...impl, init };
