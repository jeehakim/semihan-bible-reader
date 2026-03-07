import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '../i18n/context'

const SESSION_KEY = 'shofar-tutorial-shown'
const SKIP_KEY = 'shofar-tutorial-skip'

const TARGET_IDS = ['org', 'team', 'schedule'] as const

type TargetId = (typeof TARGET_IDS)[number]

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

function getTargetRect(id: TargetId): Rect | null {
  if (typeof document === 'undefined') return null
  const el = document.querySelector(`[data-tutorial="${id}"]`)
  if (!el) return null
  return el.getBoundingClientRect()
}

export function TutorialTour() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const [doNotShowAgain, setDoNotShowAgain] = useState(false)

  const targetId = TARGET_IDS[step] ?? 'org'

  const updateRect = useCallback(() => {
    const r = getTargetRect(targetId)
    setRect(r)
  }, [targetId])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const shownThisSession = sessionStorage.getItem(SESSION_KEY)
    const skipPermanently = localStorage.getItem(SKIP_KEY)
    if (!shownThisSession && !skipPermanently) setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const el = document.querySelector(`[data-tutorial="${targetId}"]`)
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    const t1 = requestAnimationFrame(updateRect)
    const t2 = setTimeout(updateRect, 350)
    const onResize = () => updateRect()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', updateRect, true)
    return () => {
      cancelAnimationFrame(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [open, step, targetId, updateRect])

  function handleClose() {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(SESSION_KEY, '1')
    if (doNotShowAgain) localStorage.setItem(SKIP_KEY, '1')
    setOpen(false)
  }

  function handleNext() {
    if (step < TARGET_IDS.length - 1) setStep((s) => s + 1)
    else handleClose()
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1)
  }

  if (!open) return null

  const isFirst = step === 0
  const isLast = step === TARGET_IDS.length - 1

  return (
    <div className="tutorial-tour-overlay" role="dialog" aria-label={t('tutorial.title')}>
      {/* Spotlight: dark overlay with clear hole over target */}
      {rect && (
        <div
          className="tutorial-spotlight"
          style={{
            top: rect.top,
            left: rect.left,
            width: Math.max(rect.width, 1),
            height: Math.max(rect.height, 1),
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)'
          }}
          aria-hidden
        />
      )}

      {/* Tooltip card */}
      <div className="tutorial-tooltip" data-step={targetId}>
        <h3 className="tutorial-tooltip-title">
          {step === 0 && t('tutorial.step1Title')}
          {step === 1 && t('tutorial.step2Title')}
          {step === 2 && t('tutorial.step3Title')}
        </h3>
        <div className="tutorial-tooltip-body">
          {step === 0 && <p>{t('tutorial.step1Body')}</p>}
          {step === 1 && <p>{t('tutorial.step2Body')}</p>}
          {step === 2 && (
            <ul className="tutorial-fields">
              <li><strong>{t('schedule.startDate')}</strong> — {t('tutorial.fieldStartDate')}</li>
              <li><strong>{t('schedule.startBook')}</strong> — {t('tutorial.fieldStartBook')}</li>
              <li><strong>{t('schedule.startChapter')}</strong> — {t('tutorial.fieldStartChapter')}</li>
              <li><strong>{t('schedule.chaptersPerPerson')}</strong> — {t('tutorial.fieldChaptersPerPerson')}</li>
              <li><strong>{t('schedule.daysPerSet')}</strong> — {t('tutorial.fieldDaysPerSet')}</li>
              <li><strong>{t('schedule.sets')}</strong> — {t('tutorial.fieldSets')}</li>
            </ul>
          )}
        </div>
        <div className="tutorial-tooltip-actions">
          <div className="tutorial-tooltip-nav">
            {!isFirst && (
              <button type="button" className="tutorial-btn tutorial-btn-back" onClick={handleBack}>
                {t('tutorial.back')}
              </button>
            )}
            <button type="button" className="tutorial-btn tutorial-btn-next" onClick={handleNext}>
              {isLast ? t('tutorial.finish') : t('tutorial.next')}
            </button>
          </div>
          <label className="tutorial-checkbox">
            <input
              type="checkbox"
              checked={doNotShowAgain}
              onChange={(e) => setDoNotShowAgain(e.target.checked)}
            />
            <span>{t('tutorial.doNotShowAgain')}</span>
          </label>
          <button type="button" className="tutorial-close-btn" onClick={handleClose} aria-label={t('tutorial.close')}>
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
