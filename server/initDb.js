import { getDb, initSchema } from './db.js'

const db = getDb()
initSchema(db)
console.log('Database initialized at', db.name)
db.close()
