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
import { bibleBooks } from './data/bibleBooks'
import { generateSchedule } from './utils/scheduleGenerator'
import { api } from './lib/api'
import './App.css'

const lastBibleBook = bibleBooks[bibleBooks.length - 1]

function App() {
  const { t } = useI18n()
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
  const [teams, setTeams] = useState<{ id: string; name: string; completion_count: number }[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [scheduleGroups, setScheduleGroups] = useState<ScheduleGroup[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [visitCount, setVisitCount] = useState<number | null>(null)

  useEffect(() => {
    if (selectedOrgId) loadTeams(selectedOrgId)
    else setTeams([])
  }, [selectedOrgId])

  useEffect(() => {
    api.recordVisit().then(({ count }) => setVisitCount(count)).catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedTeamId) {
      loadMembers(selectedTeamId)
      loadSchedules(selectedTeamId)
    } else {
      setMembers([])
      setScheduleGroups([])
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
    } catch (e) {
      console.error(e)
    }
  }

  function groupSchedulesByDate(
    schedules: { date: string; member_name: string; book_name: string; chapter: number }[]
  ): ScheduleGroup[] {
    const groups: { [date: string]: ScheduleGroup } = {}
    schedules.forEach((s) => {
      if (!groups[s.date]) {
        groups[s.date] = { date: s.date, dayOfWeek: '', assignments: [] }
      }
      groups[s.date].assignments.push({
        memberName: s.member_name,
        bookName: s.book_name,
        chapter: s.chapter
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
      const saved = await api.saveSchedules(selectedTeamId, schedule, completedReadThrough)
      // Update UI from save response so we always show the new schedule (avoids cache)
      const grouped = groupSchedulesByDate(saved ?? [])
      setScheduleGroups(grouped)
      if (completedReadThrough && selectedOrgId) {
        loadTeams(selectedOrgId)
      }
    } catch (e) {
      console.error(e)
      alert(t('app.alertError'))
    } finally {
      setIsGenerating(false)
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="app">
      <TopNav />
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <p className="app-tagline">{t('app.tagline')}</p>
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
