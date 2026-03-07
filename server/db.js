import pg from 'pg'
import { randomUUID } from 'crypto'
import { config, requireConfig } from './config.js'

const { Pool } = pg

let pool = null

export function getPool() {
  if (!pool) {
    requireConfig({ databaseUrl: true })
    pool = new Pool({
      connectionString: config.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30000,
    })
  }
  return pool
}

/** Run a query; returns pg result (use .rows, .rowCount). */
export async function query(sql, params = []) {
  const p = getPool()
  return p.query(sql, params)
}

/** Returns true if DB is reachable. Use for health check. */
export async function ping() {
  try {
    await query('SELECT 1')
    return true
  } catch {
    return false
  }
}

export async function initSchema() {
  const q = (sql, params) => query(sql, params)
  await q(`
    CREATE TABLE IF NOT EXISTS organizations (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await q(`
    CREATE TABLE IF NOT EXISTS teams (
      id UUID PRIMARY KEY,
      org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      completion_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await q(`CREATE INDEX IF NOT EXISTS idx_teams_org ON teams(org_id)`)
  await q(`
    CREATE TABLE IF NOT EXISTS members (
      id UUID PRIMARY KEY,
      team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await q(`CREATE INDEX IF NOT EXISTS idx_members_team ON members(team_id)`)
  await q(`CREATE INDEX IF NOT EXISTS idx_members_order ON members(team_id, order_index)`)
  await q(`
    CREATE TABLE IF NOT EXISTS schedules (
      id UUID PRIMARY KEY,
      team_id UUID NOT NULL,
      member_id UUID NOT NULL,
      member_name TEXT NOT NULL,
      date DATE NOT NULL,
      book_name TEXT NOT NULL,
      chapter INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  await q(`CREATE INDEX IF NOT EXISTS idx_schedules_team ON schedules(team_id)`)
  await q(`CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(team_id, date)`)
  await q(`
    CREATE TABLE IF NOT EXISTS visitor_sessions (
      id UUID PRIMARY KEY,
      ip TEXT NOT NULL,
      session_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(ip, session_id)
    )
  `)
  await q(`CREATE INDEX IF NOT EXISTS idx_visitor_sessions_created ON visitor_sessions(created_at)`)

  const defaultOrgId = '00000000-0000-4000-8000-000000000001'
  const orgCheck = await q('SELECT 1 FROM organizations WHERE id = $1', [defaultOrgId])
  if (orgCheck.rows.length === 0) {
    const next = await q('SELECT COALESCE(MAX(order_index), -1) + 1 AS next FROM organizations')
    const order_index = next.rows[0]?.next ?? 0
    await q(
      'INSERT INTO organizations (id, name, order_index) VALUES ($1, $2, $3)',
      [defaultOrgId, 'Default', order_index]
    )
  }
}

export { randomUUID }
