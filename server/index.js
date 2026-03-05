import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { getDb, initSchema, randomUUID } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'

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

// CORS: allow same-origin; optional ALLOWED_ORIGIN for your Cloudflare domain (e.g. https://scheduler.shofar.ai)
const allowedOrigin = process.env.ALLOWED_ORIGIN
app.use(
  cors({
    origin: allowedOrigin ? [allowedOrigin] : true,
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

// Ensure DB and schema exist on startup
const db = getDb()
initSchema(db)

// API routes
app.get('/api/teams', (req, res) => {
  try {
    const rows = db.prepare(
      'SELECT id, name, order_index, completion_count, created_at FROM teams ORDER BY order_index, created_at'
    ).all()
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.post('/api/teams', (req, res) => {
  try {
    const name = trimName(req.body?.name)
    if (!name) {
      return res.status(400).json({ error: 'name is required' })
    }
    const id = randomUUID()
    const maxOrder = db.prepare('SELECT COALESCE(MAX(order_index), -1) + 1 AS next FROM teams').get()
    const order_index = maxOrder.next
    db.prepare(
      'INSERT INTO teams (id, name, order_index, completion_count) VALUES (?, ?, ?, 0)'
    ).run(id, name, order_index)
    const row = db.prepare('SELECT id, name, order_index, completion_count, created_at FROM teams WHERE id = ?').get(id)
    res.status(201).json(row)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.patch('/api/teams/:id', (req, res) => {
  try {
    const id = safeUuid(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid team id' })
    const { name, order_index } = req.body || {}
    const existing = db.prepare('SELECT id FROM teams WHERE id = ?').get(id)
    if (!existing) return res.status(404).json({ error: 'Team not found' })
    if (name !== undefined) {
      db.prepare('UPDATE teams SET name = ? WHERE id = ?').run(trimName(name), id)
    }
    if (typeof order_index === 'number') {
      db.prepare('UPDATE teams SET order_index = ? WHERE id = ?').run(order_index, id)
    }
    const row = db.prepare('SELECT id, name, order_index, completion_count, created_at FROM teams WHERE id = ?').get(id)
    res.json(row)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.delete('/api/teams/:id', (req, res) => {
  try {
    const id = safeUuid(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid team id' })
    const result = db.prepare('DELETE FROM teams WHERE id = ?').run(id)
    if (result.changes === 0) return res.status(404).json({ error: 'Team not found' })
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.post('/api/teams/reorder', (req, res) => {
  try {
    const { teamIds } = req.body || {}
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
    const stmt = db.prepare('UPDATE teams SET order_index = ? WHERE id = ?')
    validIds.forEach((id, index) => {
      stmt.run(index, id)
    })
    const rows = db.prepare(
      'SELECT id, name, order_index, completion_count, created_at FROM teams ORDER BY order_index'
    ).all()
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

function mapMember(row) {
  return row ? { ...row, is_active: Boolean(row.is_active) } : null
}

app.get('/api/teams/:teamId/members', (req, res) => {
  try {
    const teamId = safeUuid(req.params.teamId)
    if (!teamId) return res.status(400).json({ error: 'Invalid team id' })
    const rows = db.prepare(
      'SELECT id, team_id, name, order_index, is_active, created_at FROM members WHERE team_id = ? AND is_active = 1 ORDER BY order_index, created_at'
    ).all(teamId)
    res.json(rows.map(mapMember))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.post('/api/teams/:teamId/members', (req, res) => {
  try {
    const teamId = safeUuid(req.params.teamId)
    if (!teamId) return res.status(400).json({ error: 'Invalid team id' })
    const name = trimName(req.body?.name)
    if (!name) {
      return res.status(400).json({ error: 'name is required' })
    }
    const team = db.prepare('SELECT id FROM teams WHERE id = ?').get(teamId)
    if (!team) return res.status(404).json({ error: 'Team not found' })
    const maxOrder = db.prepare('SELECT COALESCE(MAX(order_index), -1) + 1 AS next FROM members WHERE team_id = ?').get(teamId)
    const order_index = maxOrder.next
    const id = randomUUID()
    db.prepare(
      'INSERT INTO members (id, team_id, name, order_index, is_active) VALUES (?, ?, ?, ?, 1)'
    ).run(id, teamId, name, order_index)
    const row = db.prepare('SELECT id, team_id, name, order_index, is_active, created_at FROM members WHERE id = ?').get(id)
    res.status(201).json(mapMember(row))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.patch('/api/members/:id', (req, res) => {
  try {
    const id = safeUuid(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid member id' })
    const { name, order_index } = req.body || {}
    const existing = db.prepare('SELECT id FROM members WHERE id = ?').get(id)
    if (!existing) return res.status(404).json({ error: 'Member not found' })
    if (name !== undefined) {
      db.prepare('UPDATE members SET name = ? WHERE id = ?').run(trimName(name), id)
    }
    if (typeof order_index === 'number') {
      db.prepare('UPDATE members SET order_index = ? WHERE id = ?').run(order_index, id)
    }
    const row = db.prepare('SELECT id, team_id, name, order_index, is_active, created_at FROM members WHERE id = ?').get(id)
    res.json(mapMember(row))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.delete('/api/members/:id', (req, res) => {
  try {
    const id = safeUuid(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid member id' })
    const result = db.prepare('DELETE FROM members WHERE id = ?').run(id)
    if (result.changes === 0) return res.status(404).json({ error: 'Member not found' })
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

// Reorder members within a team (bulk order_index update)
app.post('/api/teams/:teamId/members/reorder', (req, res) => {
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
    const stmt = db.prepare('UPDATE members SET order_index = ? WHERE id = ? AND team_id = ?')
    validIds.forEach((id, index) => {
      stmt.run(index, id, teamId)
    })
    const rows = db.prepare(
      'SELECT id, team_id, name, order_index, is_active, created_at FROM members WHERE team_id = ? ORDER BY order_index'
    ).all(teamId)
    res.json(rows.map(mapMember))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

app.get('/api/schedules', (req, res) => {
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
      sql += ' WHERE team_id = ?'
      params.push(tid)
    }
    sql += ' ORDER BY date, created_at'
    const rows = db.prepare(sql).all(...params)
    res.json(rows)
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

app.post('/api/schedules', (req, res) => {
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
    db.prepare('DELETE FROM schedules WHERE team_id = ?').run(tid)
    const insert = db.prepare(`
      INSERT INTO schedules (id, team_id, member_id, member_name, date, book_name, chapter)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    for (const e of validEntries) {
      insert.run(
        randomUUID(),
        tid,
        e.member_id,
        e.memberName,
        e.date,
        e.book_name,
        e.chapter
      )
    }
    if (completedReadThrough === true) {
      db.prepare('UPDATE teams SET completion_count = completion_count + 1 WHERE id = ?').run(tid)
    }
    const rows = db.prepare(
      'SELECT id, team_id, member_id, member_name, date, book_name, chapter FROM schedules WHERE team_id = ? ORDER BY date'
    ).all(tid)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: isProd ? 'Server error' : err.message })
  }
})

// Health check for Railway
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

// Serve static frontend (React build)
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
