import { useState, useEffect } from 'react'
import { getBibleBookOptions, getChapterOptions } from '../data/bibleBooks'
import { getLocalDateString } from '../utils/dateUtils'
import { useI18n } from '../i18n/context'

interface ScheduleConfigProps {
  onGenerate: (config: {
    startDate: string
    startBookIndex: number
    startChapter: number
    chaptersPerPerson: number
    daysPerSet: number
    sets: number
  }) => void
  /** Called when user clicks Generate but preconditions fail (e.g. no team/members). */
  onGenerateDisabled?: (message: string) => void
  isGenerating: boolean
  selectedTeamId: string | null
  memberCount: number
}

export function ScheduleConfig({ onGenerate, onGenerateDisabled, isGenerating, selectedTeamId, memberCount }: ScheduleConfigProps) {
  const { t } = useI18n()
  const [startDate, setStartDate] = useState('')
  const [startBookIndex, setStartBookIndex] = useState(10)
  const [startChapter, setStartChapter] = useState(13)
  const [chaptersPerPerson, setChaptersPerPerson] = useState(1)
  const [daysPerSet, setDaysPerSet] = useState(1)
  const [sets, setSets] = useState(7)

  const bookOptions = getBibleBookOptions()
  const chapterOptions = getChapterOptions(startBookIndex)

  useEffect(() => {
    setStartDate(getLocalDateString())
  }, [])

  function handleGenerate() {
    if (!startDate) {
      onGenerateDisabled?.(t('schedule.startDate'))
      return
    }
    if (!selectedTeamId) {
      onGenerateDisabled?.(t('app.alertSelectTeam'))
      return
    }
    if (memberCount === 0) {
      onGenerateDisabled?.(t('app.alertAddMembers'))
      return
    }
    onGenerate({
      startDate,
      startBookIndex,
      startChapter,
      chaptersPerPerson,
      daysPerSet,
      sets
    })
  }

  const isDisabled = isGenerating || !startDate || !selectedTeamId || memberCount === 0
  const disabledReason =
    !selectedTeamId
      ? t('app.alertSelectTeam')
      : memberCount === 0
        ? t('app.alertAddMembers')
        : !startDate
          ? t('schedule.startDate')
          : null

  return (
    <div className="schedule-config">
      <h2>{t('schedule.title')}</h2>

      <div className="config-form">
        <div className="form-group">
          <label>{t('schedule.startDate')}</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isGenerating}
          />
        </div>

        <div className="form-group">
          <label>{t('schedule.startBook')}</label>
          <select
            value={startBookIndex}
            onChange={(e) => {
              setStartBookIndex(Number(e.target.value))
              setStartChapter(1)
            }}
            disabled={isGenerating}
          >
            {bookOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t('schedule.startChapter')}</label>
          <select
            value={startChapter}
            onChange={(e) => setStartChapter(Number(e.target.value))}
            disabled={isGenerating}
          >
            {chapterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t('schedule.chaptersPerPerson')}</label>
          <input
            type="number"
            min="1"
            max="10"
            value={chaptersPerPerson}
            onChange={(e) => setChaptersPerPerson(Number(e.target.value))}
            disabled={isGenerating}
          />
        </div>

        <div className="form-group">
          <label>{t('schedule.daysPerSet')}</label>
          <input
            type="number"
            min="1"
            max="30"
            value={daysPerSet}
            onChange={(e) => setDaysPerSet(Number(e.target.value))}
            disabled={isGenerating}
          />
        </div>

        <div className="form-group">
          <label>{t('schedule.sets')}</label>
          <input
            type="number"
            min="1"
            max="30"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
            disabled={isGenerating}
          />
        </div>

        {selectedTeamId && memberCount > 0 && (
          <p className="config-hint">
            {t('schedule.hint', { n: memberCount, days: daysPerSet * sets })}
          </p>
        )}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          title={isDisabled ? disabledReason ?? undefined : undefined}
          className={`btn-generate ${isDisabled ? 'btn-generate--disabled' : ''}`}
          aria-disabled={isDisabled}
        >
          {isGenerating ? t('schedule.generating') : t('schedule.generate')}
        </button>
      </div>
    </div>
  )
}
