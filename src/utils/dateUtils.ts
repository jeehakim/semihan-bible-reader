export function getKoreanDayOfWeek(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return days[date.getDay()]
}

export function formatDateKorean(date: Date): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = getKoreanDayOfWeek(date)
  return `${month}/${day}(${dayOfWeek})`
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/** Format date as YYYY-MM-DD in local time (avoids UTC date shift). */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Normalize API date (YYYY-MM-DD or ISO "YYYY-MM-DDTHH:mm:ss.sssZ") to YYYY-MM-DD for grouping and display. */
export function normalizeDateKey(dateStr: string): string {
  if (!dateStr || typeof dateStr !== 'string') return ''
  const s = dateStr.trim()
  const tIndex = s.indexOf('T')
  const dateOnly = tIndex >= 0 ? s.slice(0, tIndex) : s
  const match = dateOnly.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (!match) return dateOnly
  const [, y, m, d] = match
  const month = String(Number(m)).padStart(2, '0')
  const day = String(Number(d)).padStart(2, '0')
  return `${y}-${month}-${day}`
}

/** Parse "YYYY-MM-DD" or ISO date string as local date. Returns Invalid Date if string is invalid. */
export function parseLocalDateString(isoDate: string): Date {
  const normalized = normalizeDateKey(isoDate)
  if (!normalized) return new Date(NaN)
  const [y, m, d] = normalized.split('-').map(Number)
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return new Date(NaN)
  if (m < 1 || m > 12 || d < 1 || d > 31) return new Date(NaN)
  const date = new Date(y, m - 1, d)
  return isNaN(date.getTime()) ? new Date(NaN) : date
}

/** Today's date as YYYY-MM-DD in local time (never use toISOString for date inputs). */
export function getLocalDateString(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
