import { useState, useEffect } from 'react'
import type { Member, ScheduleGroup } from './types'
import { useI18n } from './i18n/context'
import { TopNav } from './components/TopNav'
import { OrgManager } from './components/OrgManager'
import { TeamManager } from './components/TeamManager'
import { TeamDashboard } from './components/TeamDashboard'
import { ScheduleConfig } from './components/ScheduleConfig'
import { ScheduleDisplay } from './components/ScheduleDisplay'
import { AdSenseUnit } from './components/AdSenseUnit'
import { TutorialPopup } from './components/TutorialPopup'
import { bibleBooks } from './data/bibleBooks'
import { generateSchedule } from './utils/scheduleGenerator'
import { normalizeDateKey } from './utils/dateUtils'
import { api } from './lib/api'
import './App.css'

const lastBibleBook = bibleBooks[bibleBooks.length - 1]

const STORAGE_ORG_KEY = 'shofar-selected-org-id'
const STORAGE_TEAM_KEY = 'shofar-selected-team-id'
const DEFAULT_ORG_NAME = '세미한교회'
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function getStoredId(key: string): string | null {
  if (typeof window === 'undefined') return null
  const v = localStorage.getItem(key)
  return v && UUID_REGEX.test(v) ? v : null
}

function App() {
  const { t } = useI18n()
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(() => getStoredId(STORAGE_ORG_KEY))
  const [selectedOrgName, setSelectedOrgName] = useState<string | null>(null)
  const [teams, setTeams] = useState<{ id: string; name: string; completion_count: number }[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(() => getStoredId(STORAGE_TEAM_KEY))
  const [members, setMembers] = useState<Member[]>([])
  const [scheduleGroups, setScheduleGroups] = useState<ScheduleGroup[]>([])
  const [scheduleEntryCount, setScheduleEntryCount] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [visitCount, setVisitCount] = useState<number | null>(null)

  // Prepopulate default org (세미한교회) when none selected
  useEffect(() => {
    if (selectedOrgId) return
    let cancelled = false
    api.getOrganizations().then((list) => {
      if (cancelled) return
      const org = list.find((o) => o.name.trim() === DEFAULT_ORG_NAME)
      if (org) {
        setSelectedOrgId(org.id)
      } else {
        api.createOrganization(DEFAULT_ORG_NAME)
          .then((created) => {
            if (!cancelled) setSelectedOrgId(created.id)
          })
          .catch(async (e: unknown) => {
            if ((e as { status?: number }).status === 409) {
              const list2 = await api.getOrganizations().catch(() => [])
              const o = list2.find((x) => x.name.trim() === DEFAULT_ORG_NAME)
              if (!cancelled && o) setSelectedOrgId(o.id)
            }
          })
      }
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!selectedOrgId) {
      setSelectedOrgName(null)
      return
    }
    let cancelled = false
    api.getOrganizations().then((list) => {
      if (cancelled) return
      const org = list.find((o) => o.id === selectedOrgId)
      setSelectedOrgName(org?.name ?? null)
    }).catch(() => setSelectedOrgName(null))
    return () => { cancelled = true }
  }, [selectedOrgId])

  useEffect(() => {
    if (selectedOrgId) {
      localStorage.setItem(STORAGE_ORG_KEY, selectedOrgId)
      loadTeams(selectedOrgId)
    } else {
      localStorage.removeItem(STORAGE_ORG_KEY)
      localStorage.removeItem(STORAGE_TEAM_KEY)
      setTeams([])
      setSelectedTeamId(null)
    }
  }, [selectedOrgId])

  useEffect(() => {
    if (selectedTeamId) localStorage.setItem(STORAGE_TEAM_KEY, selectedTeamId)
    else localStorage.removeItem(STORAGE_TEAM_KEY)
  }, [selectedTeamId])

  useEffect(() => {
    const sessionId =
      typeof sessionStorage !== 'undefined'
        ? sessionStorage.getItem('shofar-visit-session-id') ||
          (() => {
            const id = crypto.randomUUID?.() ?? `s${Date.now()}-${Math.random().toString(36).slice(2)}`
            sessionStorage.setItem('shofar-visit-session-id', id)
            return id
          })()
        : ''
    if (sessionId) api.recordVisit(sessionId).then(({ count }) => setVisitCount(count)).catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedTeamId) {
      loadMembers(selectedTeamId)
      loadSchedules(selectedTeamId)
    } else {
      setMembers([])
      setScheduleGroups([])
      setScheduleEntryCount(0)
    }
  }, [selectedTeamId])

  async function loadTeams(orgId: string) {
    if (!orgId) return
    try {
      const data = await api.getTeams(orgId)
      setTeams(data)
      if (data.length > 0 && !selectedTeamId) {
        setSelectedTeamId(data[0].id)
      } else if (selectedTeamId && data.some((team) => team.id === selectedTeamId)) {
        loadMembers(selectedTeamId)
      } else if (data.length > 0) {
        setSelectedTeamId(data[0].id)
      } else {
        setSelectedTeamId(null)
      }
    } catch (e) {
      console.error(e)
    }
  }

  function handleOrgsUpdate() {
    if (selectedOrgId) loadTeams(selectedOrgId)
  }

  async function loadMembers(teamId: string) {
    try {
      const data = await api.getMembers(teamId)
      setMembers(data)
    } catch (e) {
      console.error(e)
    }
  }

  async function loadSchedules(teamId: string) {
    try {
      const data = await api.getSchedules(teamId)
      const grouped = groupSchedulesByDate(data)
      setScheduleGroups(grouped)
      setScheduleEntryCount(data.length)
    } catch (e) {
      console.error(e)
    }
  }

  function groupSchedulesByDate(
    schedules: { date: string; member_name: string; book_name: string; chapter: number }[]
  ): ScheduleGroup[] {
    const groups: { [date: string]: ScheduleGroup } = {}
    schedules.forEach((s) => {
      const dateKey = normalizeDateKey(s.date)
      if (!dateKey) return
      if (!groups[dateKey]) {
        groups[dateKey] = { date: dateKey, dayOfWeek: '', assignments: [] }
      }
      groups[dateKey].assignments.push({
        memberName: s.member_name ?? '',
        bookName: s.book_name ?? '',
        chapter: s.chapter ?? 0
      })
    })
    return Object.values(groups).sort((a, b) => a.date.localeCompare(b.date))
  }

  async function handleGenerate(config: {
    startDate: string
    startBookIndex: number
    startChapter: number
    chaptersPerPerson: number
    daysPerSet: number
    sets: number
  }) {
    if (!selectedTeamId) {
      alert(t('app.alertSelectTeam'))
      return
    }
    if (members.length === 0) {
      alert(t('app.alertAddMembers'))
      return
    }

    setIsGenerating(true)
    try {
      const schedule = generateSchedule({ members, ...config })
      // Only count a full read-through when the schedule *ends* at Rev 22 (last chapter of Bible).
      // Then the team has "finished Revelation ch 22 and is on Gen 1" for the next cycle.
      const lastEntry = schedule[schedule.length - 1]
      const completedReadThrough = !!(
        schedule.length > 0 &&
        lastEntry?.book_name === lastBibleBook.korean &&
        lastEntry?.chapter === lastBibleBook.chapters
      )
      const saved = await api.saveSchedules(selectedTeamId, schedule, completedReadThrough, scheduleEntryCount)
      const grouped = groupSchedulesByDate(saved ?? [])
      setScheduleGroups(grouped)
      setScheduleEntryCount(saved?.length ?? 0)
      if (completedReadThrough && selectedOrgId) {
        loadTeams(selectedOrgId)
      }
    } catch (e: unknown) {
      console.error(e)
      const err = e as { message?: string; status?: number }
      if (err.status === 409) {
        alert(t('app.alertScheduleConflict'))
        if (selectedTeamId) loadSchedules(selectedTeamId)
      } else {
        alert(err?.message || t('app.alertError'))
      }
    } finally {
      setIsGenerating(false)
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="app">
      <TutorialPopup />
      <TopNav />
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <p className="app-tagline">{t('app.tagline')}</p>
        <p className="app-multi-user-hint">{t('app.multiUserHint')}</p>
      </header>

      <div className="app-content">
        <aside className="left-panel">
          <OrgManager
            selectedOrgId={selectedOrgId}
            onSelectOrg={setSelectedOrgId}
            onOrgsUpdate={handleOrgsUpdate}
          />
          <TeamManager
            selectedOrgId={selectedOrgId}
            onTeamsUpdate={() => selectedOrgId && loadTeams(selectedOrgId)}
            selectedTeamId={selectedTeamId}
            onSelectTeam={setSelectedTeamId}
          />
        </aside>

        <main className="right-panel">
          <ScheduleConfig
            onGenerate={handleGenerate}
            onGenerateDisabled={(msg) => alert(msg)}
            isGenerating={isGenerating}
            selectedTeamId={selectedTeamId}
            memberCount={members.length}
          />
          <ScheduleDisplay
            scheduleGroups={scheduleGroups}
            onCopy={handleCopy}
            orgName={selectedOrgName}
            teamName={teams.find((t) => t.id === selectedTeamId)?.name}
          />
        </main>

        <div className="app-full-width">
          <AdSenseUnit />
          <TeamDashboard teams={teams} />
        </div>
      </div>

      <footer className="app-footer">
        <p className="app-footer-copyright">
          © {new Date().getFullYear()} Shofar AI
          {visitCount != null && (
            <span className="app-footer-visits"> · {t('app.visits')}: {visitCount.toLocaleString()}</span>
          )}
        </p>
      </footer>
    </div>
  )
}

export default App
