import Database from 'better-sqlite3'
import { randomUUID } from 'crypto'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = process.env.DATABASE_DIR || path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}
const dbPath = path.join(dataDir, 'scheduler.db')

export function getDb() {
  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  return db
}

export function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      completion_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id TEXT PRIMARY KEY,
      team_id TEXT NOT NULL,
      member_id TEXT NOT NULL,
      member_name TEXT NOT NULL,
      date TEXT NOT NULL,
      book_name TEXT NOT NULL,
      chapter INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_members_team ON members(team_id);
    CREATE INDEX IF NOT EXISTS idx_members_order ON members(team_id, order_index);
    CREATE INDEX IF NOT EXISTS idx_schedules_team ON schedules(team_id);
    CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(team_id, date);

    CREATE TABLE IF NOT EXISTS visit_count (id INTEGER PRIMARY KEY CHECK (id = 1), n INTEGER NOT NULL DEFAULT 0);
    INSERT OR IGNORE INTO visit_count (id, n) VALUES (1, 0);
  `)
  // Migration: add completion_count to existing teams tables
  try {
    const cols = db.prepare("PRAGMA table_info(teams)").all()
    if (cols.every((c) => c.name !== 'completion_count')) {
      db.exec('ALTER TABLE teams ADD COLUMN completion_count INTEGER NOT NULL DEFAULT 0')
    }
  } catch (_) {}
}

export { randomUUID }
