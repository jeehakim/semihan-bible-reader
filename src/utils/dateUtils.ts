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

/** Parse "YYYY-MM-DD" as local date (no timezone shift). Returns Invalid Date if string is invalid. */
export function parseLocalDateString(isoDate: string): Date {
  if (!isoDate || typeof isoDate !== 'string') return new Date(NaN)
  const parts = isoDate.trim().split('-').map(Number)
  const [y, m, d] = parts
  if (parts.length !== 3 || !Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return new Date(NaN)
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
