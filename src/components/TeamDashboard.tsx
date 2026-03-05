import { useState } from 'react'
import { useI18n } from '../i18n/context'
import type { Team } from '../types'

interface TeamDashboardProps {
  teams: Pick<Team, 'id' | 'name' | 'completion_count'>[]
}

export function TeamDashboard({ teams }: TeamDashboardProps) {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="team-dashboard">
      <div
        className="team-dashboard-header"
        onClick={() => setExpanded((e) => !e)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setExpanded((e2) => !e2)}
        aria-expanded={expanded}
      >
        <span className="team-dashboard-chevron" aria-hidden>
          {expanded ? '▼' : '▶'}
        </span>
        <h2 className="team-dashboard-title">{t('dashboard.title')}</h2>
      </div>
      {expanded && (
        <div className="team-dashboard-body">
          {teams.length === 0 ? (
            <p className="team-dashboard-empty">{t('dashboard.empty')}</p>
          ) : (
            <ul className="team-dashboard-list">
              {teams.map((team) => (
                <li key={team.id} className="team-dashboard-item">
                  <span className="team-dashboard-team-name">{team.name}</span>
                  <span className="team-dashboard-completion" title={t('dashboard.completion')}>
                    {t('dashboard.completion')}: <strong>{team.completion_count}</strong>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
