import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useI18n, LOCALE_LABELS, LOCALE_FLAGS, type Locale } from '../i18n/context'

const NAV_LINKS = [
  { label: 'ShofarGPT', href: 'https://shofar.ai' },
  { label: 'Persecution Watch', href: 'https://watch.shofar.ai' },
  { label: 'ChMS/CRM', href: 'https://chms.shofar.ai' },
  { label: 'Social Media', href: 'https://media.shofar.ai', disabled: true }
]

const LOCALES: Locale[] = ['ko', 'en', 'he', 'es', 'ja', 'zh', 'fa']

export function TopNav() {
  const { theme, toggleTheme } = useTheme()
  const { t, locale, setLocale } = useI18n()
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <nav className="top-nav">
      <a href="/" className="top-nav-brand" aria-label={t('nav.home')}>
        <img src="/logo.png" alt="" className="top-nav-logo" width={36} height={36} />
        <span className="top-nav-brand-name">Shofar AI</span>
        <span className="top-nav-brand-product">{t('nav.productName')}</span>
      </a>

      <div className="top-nav-right">
        <ul className="top-nav-links">
          {NAV_LINKS.map(({ label, href, disabled }) => (
            <li key={href}>
              {disabled ? (
                <span className="top-nav-link top-nav-link--disabled" aria-disabled="true">
                  {label}
                </span>
              ) : (
                <a href={href} target="_blank" rel="noopener noreferrer" className="top-nav-link">
                  {label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="top-nav-lang" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangOpen((o) => !o)}
            className="top-nav-lang-trigger"
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            aria-label={t('nav.language')}
            title={t('nav.language')}
          >
            <span className="top-nav-lang-flag" aria-hidden>{LOCALE_FLAGS[locale]}</span>
            <span className="top-nav-lang-label">{LOCALE_LABELS[locale]}</span>
            <span className="top-nav-lang-chevron" aria-hidden>{langOpen ? '▲' : '▼'}</span>
          </button>
          {langOpen && (
            <ul
              className="top-nav-lang-dropdown"
              role="listbox"
              aria-label={t('nav.language')}
            >
              {LOCALES.map((loc) => (
                <li key={loc} role="option" aria-selected={locale === loc}>
                  <button
                    type="button"
                    className={`top-nav-lang-option ${locale === loc ? 'active' : ''}`}
                    onClick={() => {
                      setLocale(loc)
                      setLangOpen(false)
                    }}
                  >
                    <span className="top-nav-lang-flag" aria-hidden>{LOCALE_FLAGS[loc]}</span>
                    {LOCALE_LABELS[loc]}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="top-nav-theme-toggle"
          aria-label={theme === 'dark' ? t('nav.themeToLight') : t('nav.themeToDark')}
          title={theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
        >
          {theme === 'dark' ? (
            <span className="theme-icon" aria-hidden>☀️</span>
          ) : (
            <span className="theme-icon" aria-hidden>🌙</span>
          )}
        </button>
      </div>
    </nav>
  )
}
