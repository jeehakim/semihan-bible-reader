import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { config, isProd } from './config.js'
import { query, initSchema, ping, randomUUID } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = config.port

// --- Security (no-login app behind Cloudflare) ---
// Body size limit to reduce DoS via huge payloads
app.use(express.json({ limit: '100kb' }))

// Security headers (Cloudflare may add TLS; we set app-level headers)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  if (isProd) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  next()
})

// CORS: allow same-origin; optional ALLOWED_ORIGIN (set in Railway Variables or .env)
app.use(
  cors({
    origin: config.allowedOrigin ? [config.allowedOrigin] : true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  })
)

// Input limits (no-login: anyone can call API; keep abuse bounded)
const MAX_NAME_LENGTH = 200
const MAX_ARRAY_LENGTH = 500
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function trimName(str) {
  if (str == null || typeof str !== 'string') return ''
  return str.trim().slice(0, MAX_NAME_LENGTH)
}

function safeUuid(id) {
  return typeof id === 'string' && UUID_REGEX.test(id) ? id : null
}

// --- Organizations (multi-tenant) ---
app.get('/api/organizations', async (req, res) => {
  try {
    const search = typeof req.query.search === 'string' ? trimName(req.query.search) : ''
    let sql = 'SELECT id, name, order_index, created_at FROM organizations'
    const params = []
    if (search) {
      sql += ' WHERE name ILIKE $1'
      params.push('%' + search + '%')
    }
    sql += ' ORDER BY order_index, created_at'
    const result = await query(sql, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.post('/api/organizations', async (req, res) => {
  try {
    const name = trimName(req.body?.name)
    if (!name) {
      return res.status(400).json({ error: 'name is required' })
    }
    const id = randomUUID()
    const next = await query('SELECT COALESCE(MAX(order_index), -1) + 1 AS next FROM organizations')
    const order_index = next.rows[0]?.next ?? 0
    await query('INSERT INTO organizations (id, name, order_index) VALUES ($1, $2, $3)', [id, name, order_index])
    const row = await query('SELECT id, name, order_index, created_at FROM organizations WHERE id = $1', [id])
    res.status(201).json(row.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.patch('/api/organizations/:id', async (req, res) => {
  try {
    const id = safeUuid(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid organization id' })
    const name = trimName(req.body?.name)
    if (name === undefined) return res.status(400).json({ error: 'name is required' })
    const result = await query('UPDATE organizations SET name = $1 WHERE id = $2', [name, id])
    if (result.rowCount === 0) return res.status(404).json({ error: 'Organization not found' })
    const row = await query('SELECT id, name, order_index, created_at FROM organizations WHERE id = $1', [id])
    res.json(row.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

// Organization deletion disabled to prevent accidental loss of all teams and members
app.delete('/api/organizations/:id', (req, res) => {
  res.status(403).json({
    error: 'Organization deletion is disabled to protect teams and members data.'
  })
})

// --- Teams (scoped by orgId) ---
app.get('/api/teams', async (req, res) => {
  try {
    const orgId = req.query.orgId
    const oid = typeof orgId === 'string' ? safeUuid(orgId) : null
    if (!oid) {
      return res.status(400).json({ error: 'orgId is required' })
    }
    const result = await query(
      'SELECT id, org_id, name, order_index, completion_count, created_at FROM teams WHERE org_id = $1 ORDER BY order_index, created_at',
      [oid]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.post('/api/teams', async (req, res) => {
  try {
    const name = trimName(req.body?.name)
    const orgId = req.body?.orgId
    const oid = typeof orgId === 'string' ? safeUuid(orgId) : null
    if (!name) {
      return res.status(400).json({ error: 'name is required' })
    }
    if (!oid) {
      return res.status(400).json({ error: 'orgId is required' })
    }
    const org = await query('SELECT id FROM organizations WHERE id = $1', [oid])
    if (org.rows.length === 0) return res.status(404).json({ error: 'Organization not found' })
    const id = randomUUID()
    const maxOrder = await query('SELECT COALESCE(MAX(order_index), -1) + 1 AS next FROM teams WHERE org_id = $1', [oid])
    const order_index = maxOrder.rows[0]?.next ?? 0
    await query(
      'INSERT INTO teams (id, org_id, name, order_index, completion_count) VALUES ($1, $2, $3, $4, 0)',
      [id, oid, name, order_index]
    )
    const row = await query('SELECT id, org_id, name, order_index, completion_count, created_at FROM teams WHERE id = $1', [id])
    res.status(201).json(row.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.patch('/api/teams/:id', async (req, res) => {
  try {
    const id = safeUuid(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid team id' })
    const { name, order_index } = req.body || {}
    const existing = await query('SELECT id FROM teams WHERE id = $1', [id])
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Team not found' })
    if (name !== undefined) {
      await query('UPDATE teams SET name = $1 WHERE id = $2', [trimName(name), id])
    }
    if (typeof order_index === 'number') {
      await query('UPDATE teams SET order_index = $1 WHERE id = $2', [order_index, id])
    }
    const row = await query('SELECT id, org_id, name, order_index, completion_count, created_at FROM teams WHERE id = $1', [id])
    res.json(row.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.delete('/api/teams/:id', async (req, res) => {
  try {
    const id = safeUuid(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid team id' })
    const result = await query('DELETE FROM teams WHERE id = $1', [id])
    if (result.rowCount === 0) return res.status(404).json({ error: 'Team not found' })
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.post('/api/teams/reorder', async (req, res) => {
  try {
    const { orgId, teamIds } = req.body || {}
    const oid = typeof orgId === 'string' ? safeUuid(orgId) : null
    if (!oid) return res.status(400).json({ error: 'orgId is required' })
    if (!Array.isArray(teamIds) || teamIds.length === 0) {
      return res.status(400).json({ error: 'teamIds array is required' })
    }
    if (teamIds.length > MAX_ARRAY_LENGTH) {
      return res.status(400).json({ error: 'Too many teams' })
    }
    const validIds = teamIds.filter((id) => safeUuid(id))
    if (validIds.length !== teamIds.length) {
      return res.status(400).json({ error: 'Invalid team id in list' })
    }
    for (let index = 0; index < validIds.length; index++) {
      await query('UPDATE teams SET order_index = $1 WHERE id = $2 AND org_id = $3', [index, validIds[index], oid])
    }
    const rows = await query(
      'SELECT id, org_id, name, order_index, completion_count, created_at FROM teams WHERE org_id = $1 ORDER BY order_index',
      [oid]
    )
    res.json(rows.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

function mapMember(row) {
  return row ? { ...row, is_active: Boolean(row.is_active) } : null
}

app.get('/api/teams/:teamId/members', async (req, res) => {
  try {
    const teamId = safeUuid(req.params.teamId)
    if (!teamId) return res.status(400).json({ error: 'Invalid team id' })
    const result = await query(
      'SELECT id, team_id, name, order_index, is_active, created_at FROM members WHERE team_id = $1 AND is_active = true ORDER BY order_index, created_at',
      [teamId]
    )
    res.json(result.rows.map(mapMember))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.post('/api/teams/:teamId/members', async (req, res) => {
  try {
    const teamId = safeUuid(req.params.teamId)
    if (!teamId) return res.status(400).json({ error: 'Invalid team id' })
    const name = trimName(req.body?.name)
    if (!name) {
      return res.status(400).json({ error: 'name is required' })
    }
    const team = await query('SELECT id FROM teams WHERE id = $1', [teamId])
    if (team.rows.length === 0) return res.status(404).json({ error: 'Team not found' })
    const maxOrder = await query('SELECT COALESCE(MAX(order_index), -1) + 1 AS next FROM members WHERE team_id = $1', [teamId])
    const order_index = maxOrder.rows[0]?.next ?? 0
    const id = randomUUID()
    await query(
      'INSERT INTO members (id, team_id, name, order_index, is_active) VALUES ($1, $2, $3, $4, true)',
      [id, teamId, name, order_index]
    )
    const row = await query('SELECT id, team_id, name, order_index, is_active, created_at FROM members WHERE id = $1', [id])
    res.status(201).json(mapMember(row.rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.patch('/api/members/:id', async (req, res) => {
  try {
    const id = safeUuid(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid member id' })
    const { name, order_index } = req.body || {}
    const existing = await query('SELECT id FROM members WHERE id = $1', [id])
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Member not found' })
    if (name !== undefined) {
      await query('UPDATE members SET name = $1 WHERE id = $2', [trimName(name), id])
    }
    if (typeof order_index === 'number') {
      await query('UPDATE members SET order_index = $1 WHERE id = $2', [order_index, id])
    }
    const row = await query('SELECT id, team_id, name, order_index, is_active, created_at FROM members WHERE id = $1', [id])
    res.json(mapMember(row.rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.delete('/api/members/:id', async (req, res) => {
  try {
    const id = safeUuid(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid member id' })
    const result = await query('DELETE FROM members WHERE id = $1', [id])
    if (result.rowCount === 0) return res.status(404).json({ error: 'Member not found' })
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

// Reorder members within a team (bulk order_index update)
app.post('/api/teams/:teamId/members/reorder', async (req, res) => {
  try {
    const teamId = safeUuid(req.params.teamId)
    if (!teamId) return res.status(400).json({ error: 'Invalid team id' })
    const { memberIds } = req.body || {}
    if (!Array.isArray(memberIds)) {
      return res.status(400).json({ error: 'memberIds array is required' })
    }
    if (memberIds.length > MAX_ARRAY_LENGTH) {
      return res.status(400).json({ error: 'Too many members' })
    }
    const validIds = memberIds.filter((id) => safeUuid(id))
    if (validIds.length !== memberIds.length) {
      return res.status(400).json({ error: 'Invalid member id in list' })
    }
    for (let index = 0; index < validIds.length; index++) {
      await query('UPDATE members SET order_index = $1 WHERE id = $2 AND team_id = $3', [index, validIds[index], teamId])
    }
    const rows = await query(
      'SELECT id, team_id, name, order_index, is_active, created_at FROM members WHERE team_id = $1 ORDER BY order_index',
      [teamId]
    )
    res.json(rows.rows.map(mapMember))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.get('/api/schedules', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  try {
    const teamId = req.query.teamId
    let sql = `
      SELECT id, team_id, member_id, member_name, date, book_name, chapter, created_at
      FROM schedules
    `
    const params = []
    if (teamId) {
      const tid = safeUuid(teamId)
      if (!tid) return res.status(400).json({ error: 'Invalid team id' })
      sql += ' WHERE team_id = $1'
      params.push(tid)
    }
    sql += ' ORDER BY date, created_at'
    const result = await query(sql, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

// Date format YYYY-MM-DD
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
function safeScheduleEntry(e) {
  if (!e || typeof e !== 'object') return null
  const member_id = safeUuid(e.member_id)
  const memberName = trimName(e.memberName)
  const date = typeof e.date === 'string' && DATE_REGEX.test(e.date.trim()) ? e.date.trim() : null
  const book_name = trimName(e.book_name)
  const chapter = typeof e.chapter === 'number' && Number.isInteger(e.chapter) && e.chapter >= 1 && e.chapter <= 150 ? e.chapter : null
  if (!member_id || !memberName || !date || !book_name || chapter == null) return null
  return { member_id, memberName, date, book_name, chapter }
}

app.post('/api/schedules', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  try {
    const { teamId, entries, completedReadThrough } = req.body || {}
    if (!teamId || !Array.isArray(entries)) {
      return res.status(400).json({ error: 'teamId and entries array are required' })
    }
    const tid = safeUuid(teamId)
    if (!tid) return res.status(400).json({ error: 'Invalid team id' })
    if (entries.length > MAX_ARRAY_LENGTH) {
      return res.status(400).json({ error: 'Too many schedule entries' })
    }
    const validEntries = entries.map(safeScheduleEntry).filter(Boolean)
    if (validEntries.length !== entries.length) {
      return res.status(400).json({ error: 'Invalid schedule entry format' })
    }
    await query('DELETE FROM schedules WHERE team_id = $1', [tid])
    for (const e of validEntries) {
      await query(
        `INSERT INTO schedules (id, team_id, member_id, member_name, date, book_name, chapter)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [randomUUID(), tid, e.member_id, e.memberName, e.date, e.book_name, e.chapter]
      )
    }
    if (completedReadThrough === true) {
      await query('UPDATE teams SET completion_count = completion_count + 1 WHERE id = $1', [tid])
    }
    const rows = await query(
      'SELECT id, team_id, member_id, member_name, date, book_name, chapter FROM schedules WHERE team_id = $1 ORDER BY date',
      [tid]
    )
    res.json(rows.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

// Health check for Railway (verifies DB connection)
app.get('/api/health', async (req, res) => {
  const dbOk = await ping()
  if (!dbOk) {
    return res.status(503).json({ ok: false, database: 'disconnected' })
  }
  res.json({ ok: true, database: 'connected' })
})

// Visit counter: increment and return total (one call per page load from client)
app.get('/api/visit', async (req, res) => {
  try {
    await query('UPDATE visit_count SET n = n + 1 WHERE id = 1')
    const result = await query('SELECT n AS count FROM visit_count WHERE id = 1')
    const row = result.rows[0]
    res.json({ count: row ? Number(row.count) : 0 })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

// Serve static frontend (React build)
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'))
})

async function start() {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL must be set. In Railway: reference the private DATABASE_URL from your Postgres service (avoids egress fees).')
  }
  console.log('Database: using DATABASE_URL (private)')
  await initSchema()
  const dbOk = await ping()
  if (!dbOk) {
    throw new Error('Database ping failed after schema init. Check DATABASE_URL is correct and the Postgres service is running.')
  }
  console.log('Database connected and schema ready')
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
  })
}
start().catch((err) => {
  console.error('Startup failed:', err)
  process.exit(1)
})
