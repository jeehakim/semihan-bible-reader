export interface Team {
  id: string
  name: string
  order_index: number
  completion_count: number
  created_at: string
}

export interface Member {
  id: string
  team_id: string
  name: string
  order_index: number
  is_active: boolean
  created_at: string
}

export interface Schedule {
  id: string
  member_id: string
  date: string
  book_name: string
  chapter: number
  created_at: string
  member?: Member
}

export interface Config {
  id: string
  key: string
  value: {
    startBookIndex?: number
    startChapter?: number
    chaptersPerPerson?: number
    recycleIntervalDays?: number
  }
  updated_at: string
}

export interface ScheduleGroup {
  date: string
  dayOfWeek: string
  assignments: {
    memberName: string
    bookName: string
    chapter: number
  }[]
}
