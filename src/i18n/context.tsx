import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Locale } from './translations'
import { translations, LOCALE_LABELS, LOCALE_FLAGS, DAY_NAMES } from './translations'

const STORAGE_KEY = 'shofar-lang'
const DEFAULT_LOCALE: Locale = 'ko'

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
  if (stored && (stored === 'ko' || stored === 'en' || stored === 'es' || stored === 'ja' || stored === 'fa' || stored === 'zh')) return stored
  return DEFAULT_LOCALE
}

type Params = Record<string, string | number>

function interpolate(str: string, params?: Params): string {
  if (!params) return str
  return str.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`))
}

type TFunction = (key: string, params?: Params) => string

function getNested(obj: unknown, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = obj
  for (const p of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[p]
  }
  return typeof current === 'string' ? current : undefined
}

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TFunction
  dayNames: string[]
  formatDate: (date: Date) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale === 'fa' ? 'fa' : locale === 'zh' ? 'zh-Hans' : locale
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr'
  }, [locale])

  const t = useCallback<TFunction>(
    (key, params) => {
      const msg = getNested(translations[locale], key)
      return interpolate(msg ?? key, params)
    },
    [locale]
  )

  const dayNames = DAY_NAMES[locale]
  const formatDate = useCallback(
    (date: Date) => {
      const month = date.getMonth() + 1
      const day = date.getDate()
      const year = date.getFullYear()
      const dayOfWeek = dayNames[date.getDay()]
      const mm = String(month).padStart(2, '0')
      const dd = String(day).padStart(2, '0')
      return `${mm}/${dd}/${year} (${dayOfWeek})`
    },
    [dayNames]
  )

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const value: I18nContextValue = {
    locale,
    setLocale,
    t,
    dayNames,
    formatDate
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export { LOCALE_LABELS, LOCALE_FLAGS }
export type { Locale }
