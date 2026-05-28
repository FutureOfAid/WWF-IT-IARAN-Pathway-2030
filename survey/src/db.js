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
  const Database = require('better-sqlite3');
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
    open_comment TEXT
  );
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
    open_comment TEXT
  );
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
`;

async function init() {
  const schema = impl.kind === 'pg' ? SCHEMA_PG : SCHEMA_SQLITE;
  await impl.exec(schema);
}

module.exports = { ...impl, init };
