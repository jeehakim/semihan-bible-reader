import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { useI18n } from '../i18n/context'
import type { Team, Member } from '../types'

interface TeamManagerProps {
  onTeamsUpdate: () => void
  selectedTeamId: string | null
  onSelectTeam: (id: string | null) => void
}

export function TeamManager({ onTeamsUpdate, selectedTeamId, onSelectTeam }: TeamManagerProps) {
  const { t } = useI18n()
  const [teams, setTeams] = useState<Team[]>([])
  const [teamSearch, setTeamSearch] = useState('')
  const [membersByTeam, setMembersByTeam] = useState<Record<string, Member[]>>({})
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set())
  const [newTeamName, setNewTeamName] = useState('')
  const [newMemberNameByTeam, setNewMemberNameByTeam] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [editingTeamName, setEditingTeamName] = useState('')
  const [draggedTeamId, setDraggedTeamId] = useState<string | null>(null)
  const [dragOverTeamId, setDragOverTeamId] = useState<string | null>(null)
  const [draggedMember, setDraggedMember] = useState<{ teamId: string; memberId: string } | null>(null)
  const [dragOverMemberId, setDragOverMemberId] = useState<string | null>(null)

  useEffect(() => {
    loadTeams()
  }, [])

  async function loadTeams() {
    try {
      const data = await api.getTeams()
      setTeams(data)
      if (data.length > 0 && !selectedTeamId) {
        onSelectTeam(data[0].id)
      }
      for (const t of data) {
        const members = await api.getMembers(t.id)
        setMembersByTeam((prev) => ({ ...prev, [t.id]: members }))
      }
    } catch (e) {
      console.error(e)
    }
  }

  function toggleTeam(teamId: string) {
    setExpandedTeams((prev) => {
      const next = new Set(prev)
      if (next.has(teamId)) next.delete(teamId)
      else next.add(teamId)
      return next
    })
  }

  async function addTeam() {
    if (!newTeamName.trim()) return
    setLoading(true)
    try {
      await api.createTeam(newTeamName.trim())
      setNewTeamName('')
      await loadTeams()
      onTeamsUpdate()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function updateTeamName(teamId: string) {
    if (!editingTeamName.trim()) return
    setLoading(true)
    try {
      await api.updateTeam(teamId, { name: editingTeamName.trim() })
      setEditingTeamId(null)
      setEditingTeamName('')
      await loadTeams()
      onTeamsUpdate()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function deleteTeam(teamId: string) {
    if (!confirm(t('team.confirmDelete'))) return
    setLoading(true)
    try {
      await api.deleteTeam(teamId)
      if (selectedTeamId === teamId) onSelectTeam(teams.find((t) => t.id !== teamId)?.id ?? null)
      await loadTeams()
      onTeamsUpdate()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function addMember(teamId: string) {
    const name = newMemberNameByTeam[teamId]?.trim()
    if (!name) return
    setLoading(true)
    try {
      await api.addMember(teamId, name)
      setNewMemberNameByTeam((prev) => ({ ...prev, [teamId]: '' }))
      const members = await api.getMembers(teamId)
      setMembersByTeam((prev) => ({ ...prev, [teamId]: members }))
      onTeamsUpdate()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function removeMember(teamId: string, memberId: string) {
    setLoading(true)
    try {
      await api.deleteMember(memberId)
      const members = await api.getMembers(teamId)
      setMembersByTeam((prev) => ({ ...prev, [teamId]: members }))
      onTeamsUpdate()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function reorderTeams(draggedId: string, targetId: string) {
    if (draggedId === targetId) return
    const fromIndex = teams.findIndex((x) => x.id === draggedId)
    const toIndex = teams.findIndex((x) => x.id === targetId)
    if (fromIndex === -1 || toIndex === -1) return
    const reordered = [...teams]
    const [removed] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, removed)
    setLoading(true)
    try {
      const updated = await api.reorderTeams(reordered.map((t) => t.id))
      setTeams(updated)
      onTeamsUpdate()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setDraggedTeamId(null)
    }
  }

  async function reorderMembersWithinTeam(
    teamId: string,
    draggedMemberId: string,
    targetMemberId: string
  ) {
    if (draggedMemberId === targetMemberId) return
    const members = membersByTeam[teamId] ?? []
    const fromIndex = members.findIndex((m) => m.id === draggedMemberId)
    const toIndex = members.findIndex((m) => m.id === targetMemberId)
    if (fromIndex === -1 || toIndex === -1) return
    const reordered = [...members]
    const [removed] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, removed)
    setLoading(true)
    try {
      const updated = await api.reorderMembers(teamId, reordered.map((m) => m.id))
      setMembersByTeam((prev) => ({ ...prev, [teamId]: updated }))
      onTeamsUpdate()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setDraggedMember(null)
    }
  }

  const searchLower = teamSearch.trim().toLowerCase()
  const filteredTeams = searchLower
    ? teams.filter((team) => team.name.toLowerCase().includes(searchLower))
    : teams

  return (
    <div className="team-manager">
      <div className="panel-header">
        <h2>{t('team.title')}</h2>
      </div>

      <div className="team-search">
        <input
          type="search"
          value={teamSearch}
          onChange={(e) => setTeamSearch(e.target.value)}
          placeholder={t('team.searchPlaceholder')}
          disabled={loading}
          aria-label={t('team.searchPlaceholder')}
        />
      </div>

      <div className="add-team">
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTeam()}
          placeholder={t('team.teamNamePlaceholder')}
          disabled={loading}
        />
        <button onClick={addTeam} disabled={loading || !newTeamName.trim()} className="btn-primary">
          {t('team.addTeam')}
        </button>
      </div>

      <div className="team-list">
        {filteredTeams.length === 0 && (
          <p className="empty-hint">
            {teams.length === 0 ? t('team.emptyHint') : t('team.noSearchResults')}
          </p>
        )}
        {filteredTeams.map((team) => {
          const isExpanded = expandedTeams.has(team.id)
          const members = membersByTeam[team.id] ?? []
          const isSelected = selectedTeamId === team.id
          const newMemberName = newMemberNameByTeam[team.id] ?? ''
          const isEditing = editingTeamId === team.id

          return (
            <div
              key={team.id}
              className={`team-card ${isSelected ? 'selected' : ''} ${dragOverTeamId === team.id ? 'drag-over' : ''} ${draggedTeamId === team.id ? 'dragging' : ''}`}
              data-team-id={team.id}
              data-selected={isSelected || undefined}
              onDragOver={(e) => {
                e.preventDefault()
                if (draggedTeamId && draggedTeamId !== team.id) setDragOverTeamId(team.id)
              }}
              onDragLeave={() => setDragOverTeamId(null)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOverTeamId(null)
                const draggedId = e.dataTransfer.getData('text/plain')
                if (draggedId && draggedId !== team.id) reorderTeams(draggedId, team.id)
              }}
            >
              <div
                className="team-card-header"
                onClick={() => toggleTeam(team.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleTeam(team.id)}
                aria-expanded={isExpanded}
              >
                <span
                  className="team-card-drag-handle"
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation()
                    setDraggedTeamId(team.id)
                    e.dataTransfer.setData('text/plain', team.id)
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                  onDragEnd={() => setDraggedTeamId(null)}
                  onClick={(e) => e.stopPropagation()}
                  title={t('team.dragToReorder')}
                  aria-hidden
                >
                  ⋮⋮
                </span>
                <span className="team-card-chevron" aria-hidden>
                  {isExpanded ? '▼' : '▶'}
                </span>
                <div className="team-card-title-row">
                  {isEditing ? (
                    <input
                      type="text"
                      className="team-name-input"
                      value={editingTeamName}
                      onChange={(e) => setEditingTeamName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') updateTeamName(team.id)
                        if (e.key === 'Escape') setEditingTeamId(null)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  ) : (
                    <span className="team-card-title">{team.name}</span>
                  )}
                  <button
                    type="button"
                    className="btn-select-team"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectTeam(team.id)
                    }}
                    title={t('team.selectForSchedule')}
                  >
                    {isSelected ? t('team.selected') : t('team.select')}
                  </button>
                </div>
                <span className="team-card-badge">{t('team.membersCount', { n: members.length })}</span>
                <div className="team-card-actions" onClick={(e) => e.stopPropagation()}>
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => updateTeamName(team.id)}
                        disabled={loading}
                      >
                        {t('team.save')}
                      </button>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => setEditingTeamId(null)}
                      >
                        {t('team.cancel')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => {
                          setEditingTeamId(team.id)
                          setEditingTeamName(team.name)
                        }}
                        disabled={loading}
                        title={t('team.editName')}
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="btn-icon btn-danger"
                        onClick={() => deleteTeam(team.id)}
                        disabled={loading}
                        title={t('team.deleteTeam')}
                      >
                        {t('team.delete')}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="team-card-body">
                  <div className="add-member">
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) =>
                        setNewMemberNameByTeam((prev) => ({ ...prev, [team.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && addMember(team.id)}
                      placeholder={t('member.namePlaceholder')}
                      disabled={loading}
                    />
                    <button
                      onClick={() => addMember(team.id)}
                      disabled={loading || !newMemberName.trim()}
                      className="btn-primary"
                    >
                      {t('member.add')}
                    </button>
                  </div>
                  <ul className="member-list">
                    {members.map((member) => (
                      <li
                        key={member.id}
                        className={`member-item ${dragOverMemberId === member.id ? 'drag-over' : ''} ${draggedMember?.teamId === team.id && draggedMember?.memberId === member.id ? 'dragging' : ''}`}
                        data-member-id={member.id}
                        onDragOver={(e) => {
                          e.preventDefault()
                          if (
                            draggedMember?.teamId === team.id &&
                            draggedMember?.memberId !== member.id
                          )
                            setDragOverMemberId(member.id)
                        }}
                        onDragLeave={() => setDragOverMemberId(null)}
                        onDrop={(e) => {
                          e.preventDefault()
                          setDragOverMemberId(null)
                          const draggedId = e.dataTransfer.getData('text/plain')
                          if (
                            draggedMember?.teamId === team.id &&
                            draggedId &&
                            draggedId !== member.id
                          )
                            reorderMembersWithinTeam(team.id, draggedId, member.id)
                        }}
                      >
                        <span
                          className="member-drag-handle"
                          draggable
                          onDragStart={(e) => {
                            e.stopPropagation()
                            setDraggedMember({ teamId: team.id, memberId: member.id })
                            e.dataTransfer.setData('text/plain', member.id)
                            e.dataTransfer.effectAllowed = 'move'
                          }}
                          onDragEnd={() => setDraggedMember(null)}
                          title={t('member.dragToReorder')}
                          aria-hidden
                        >
                          ⋮⋮
                        </span>
                        <span className="member-name">{member.name}</span>
                        <div className="member-actions">
                          <button
                            type="button"
                            onClick={() => removeMember(team.id, member.id)}
                            disabled={loading}
                            className="btn-icon btn-danger"
                          >
                            {t('member.delete')}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {members.length === 0 && (
                    <p className="empty-hint">{t('member.emptyHint')}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
