import { useState } from 'react'
import { useI18n } from '../i18n/context'
import { parseLocalDateString } from '../utils/dateUtils'
import type { ScheduleGroup } from '../types'

interface ScheduleDisplayProps {
  scheduleGroups: ScheduleGroup[]
  onCopy: (text: string) => void
  orgName?: string | null
  teamName?: string | null
}

function formatDateSafe(
  dateStr: string,
  formatDate: (d: Date) => string
): string {
  const d = parseLocalDateString(dateStr)
  if (isNaN(d.getTime())) return dateStr || '—'
  return formatDate(d)
}

export function ScheduleDisplay({ scheduleGroups, onCopy, orgName, teamName }: ScheduleDisplayProps) {
  const { t, formatDate } = useI18n()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const chapterLabel = t('scheduleDisplay.chapter')
  const scheduleTitle =
    orgName != null && orgName !== '' && teamName != null && teamName !== ''
      ? t('scheduleDisplay.scheduleTitle', { orgName, teamName })
      : teamName
        ? t('scheduleDisplay.schedule', { name: teamName })
        : t('scheduleDisplay.generatedSchedule')

  if (scheduleGroups.length === 0) {
    return (
      <div className="schedule-display empty">
        <p>{t('scheduleDisplay.empty')}</p>
      </div>
    )
  }

  function formatScheduleGroup(group: ScheduleGroup): string {
    let text = `${formatDateSafe(group.date, formatDate)}\n`

    group.assignments.forEach((assignment, index) => {
      const isFirstPerson = index === 0
      const showBookName = isFirstPerson ||
        assignment.bookName !== group.assignments[index - 1].bookName

      const name = (assignment.memberName ?? '').padEnd(6, ' ')

      if (showBookName) {
        text += `${name} ${assignment.bookName ?? ''} ${assignment.chapter ?? 0}${chapterLabel}\n`
      } else {
        text += `${name} ${assignment.chapter ?? 0}${chapterLabel}\n`
      }
    })

    return text
  }

  function handleCopy(index: number) {
    const text = formatScheduleGroup(scheduleGroups[index])
    onCopy(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  function handleCopyAll() {
    const body = scheduleGroups.map(formatScheduleGroup).join('\n')
    const allText = scheduleTitle ? `${scheduleTitle}\n\n${body}` : body
    onCopy(allText)
    setCopiedIndex(-1)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="schedule-display">
      <div className="schedule-header">
        <h2>{scheduleTitle}</h2>
        <button onClick={handleCopyAll} className="btn-copy-all">
          {copiedIndex === -1 ? t('scheduleDisplay.copied') : t('scheduleDisplay.copyAll')}
        </button>
      </div>

      <div className="schedule-list">
        {scheduleGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="schedule-group">
            <div className="schedule-group-header">
              <h3>{formatDateSafe(group.date, formatDate)}</h3>
              <button
                onClick={() => handleCopy(groupIndex)}
                className="btn-copy"
              >
                {copiedIndex === groupIndex ? t('scheduleDisplay.copied') : t('scheduleDisplay.copy')}
              </button>
            </div>

            <div className="schedule-assignments">
              {group.assignments.map((assignment, assignmentIndex) => {
                const isFirstPerson = assignmentIndex === 0
                const showBookName = isFirstPerson ||
                  assignment.bookName !== group.assignments[assignmentIndex - 1].bookName

                return (
                  <div key={assignmentIndex} className="assignment-item">
                    <span className="assignment-name">{assignment.memberName ?? ''}</span>
                    <span className="assignment-reading">
                      {showBookName && (
                        <span className="book-name">{assignment.bookName ?? ''} </span>
                      )}
                      <span className="chapter">{assignment.chapter ?? 0}{chapterLabel}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
