import { useState, useEffect } from 'react'
import { useI18n } from '../i18n/context'

const SESSION_KEY = 'shofar-tutorial-shown'
const SKIP_KEY = 'shofar-tutorial-skip'

export function TutorialPopup() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [doNotShowAgain, setDoNotShowAgain] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const shownThisSession = sessionStorage.getItem(SESSION_KEY)
    const skipPermanently = localStorage.getItem(SKIP_KEY)
    if (!shownThisSession && !skipPermanently) setOpen(true)
  }, [])

  function handleClose() {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(SESSION_KEY, '1')
    if (doNotShowAgain) localStorage.setItem(SKIP_KEY, '1')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="tutorial-overlay" role="dialog" aria-label={t('tutorial.title')}>
      <div className="tutorial-popup">
        <h2 className="tutorial-title">{t('tutorial.title')}</h2>
        <ol className="tutorial-steps">
          <li>{t('tutorial.step1')}</li>
          <li>{t('tutorial.step2')}</li>
          <li>{t('tutorial.step3')}</li>
          <li>
            {t('tutorial.step4')}
            <p className="tutorial-step4-detail">{t('tutorial.step4Settings')}</p>
          </li>
        </ol>
        <label className="tutorial-checkbox">
          <input
            type="checkbox"
            checked={doNotShowAgain}
            onChange={(e) => setDoNotShowAgain(e.target.checked)}
          />
          <span>{t('tutorial.doNotShowAgain')}</span>
        </label>
        <button type="button" className="tutorial-close" onClick={handleClose}>
          {t('tutorial.close')}
        </button>
      </div>
    </div>
  )
}
