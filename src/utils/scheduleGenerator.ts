import { bibleBooks } from '../data/bibleBooks'
import type { Member } from '../types'
import { addDays, formatDateISO, parseLocalDateString } from './dateUtils'

export interface GenerateScheduleParams {
  members: Member[]
  /** Start date as YYYY-MM-DD (local calendar day; avoids timezone bugs). */
  startDate: string
  startBookIndex: number
  startChapter: number
  chaptersPerPerson: number
  days: number
}

export interface ScheduleEntry {
  member_id: string
  memberName: string
  date: string
  book_name: string
  chapter: number
}

/**
 * Distribute N members across D days as evenly as possible.
 * e.g. 20 members, 5 days → [4,4,4,4,4]; 19 members, 5 days → [4,4,4,4,3]
 */
function getMembersPerDay(memberCount: number, days: number): number[] {
  if (days <= 0) return []
  const base = Math.floor(memberCount / days)
  const remainder = memberCount % days
  const result: number[] = []
  for (let d = 0; d < days; d++) {
    result.push(d < remainder ? base + 1 : base)
  }
  return result
}

export function generateSchedule(params: GenerateScheduleParams): ScheduleEntry[] {
  const { members, startDate: startDateStr, startBookIndex, startChapter, chaptersPerPerson, days } = params

  if (members.length === 0) {
    return []
  }

  const startDate = parseLocalDateString(startDateStr)
  const schedule: ScheduleEntry[] = []
  let currentBookIndex = startBookIndex
  let currentChapter = startChapter
  let memberIndex = 0

  const membersPerDay = getMembersPerDay(members.length, days)

  for (let day = 0; day < days; day++) {
    const date = addDays(startDate, day)
    const dateStr = formatDateISO(date)
    const personCountThisDay = membersPerDay[day]

    for (let personOfDay = 0; personOfDay < personCountThisDay; personOfDay++) {
      const member = members[memberIndex]

      for (let chapterCount = 0; chapterCount < chaptersPerPerson; chapterCount++) {
        const book = bibleBooks[currentBookIndex]

        if (!book) {
          return schedule
        }

        schedule.push({
          member_id: member.id,
          memberName: member.name,
          date: dateStr,
          book_name: book.korean,
          chapter: currentChapter
        })

        currentChapter++

        if (currentChapter > book.chapters) {
          currentBookIndex++
          currentChapter = 1

          if (currentBookIndex >= bibleBooks.length) {
            return schedule
          }
        }
      }

      memberIndex++
    }
  }

  return schedule
}
