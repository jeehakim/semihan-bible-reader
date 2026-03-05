/**
 * App config from environment. No hardcoded secrets.
 * Railway injects DATABASE_URL when Postgres is added; set others in Variables.
 */
function env(key, defaultValue) {
  const v = process.env[key]
  if (v !== undefined && v !== '') return v
  return defaultValue
}

export const config = {
  /** Postgres connection URL. On Railway use the private DATABASE_URL (no egress fees). */
  databaseUrl: env('DATABASE_URL', ''),
  port: Number(env('PORT', '3000')) || 3000,
  nodeEnv: env('NODE_ENV', 'development'),
  /** Optional: restrict CORS to this origin (e.g. https://scheduler.shofar.ai). */
  allowedOrigin: env('ALLOWED_ORIGIN', ''),
}

export const isProd = config.nodeEnv === 'production'

/** Validate required config (e.g. DATABASE_URL when using Postgres). */
export function requireConfig(checks) {
  const missing = []
  if (checks.databaseUrl && !config.databaseUrl) missing.push('DATABASE_URL')
  if (missing.length) {
    throw new Error(`Missing required config: ${missing.join(', ')}. In Railway: Variables → Add variable → reference Postgres → DATABASE_URL (use private URL to avoid egress fees).`)
  }
}
