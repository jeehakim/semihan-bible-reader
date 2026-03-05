const API_BASE = import.meta.env.VITE_API_URL || ''

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options
  })
  if (res.status === 204) return undefined as T
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || res.statusText)
  return data as T
}

export const api = {
  getTeams: () =>
    request<{ id: string; name: string; order_index: number; completion_count: number; created_at: string }[]>('/teams'),
  createTeam: (name: string) =>
    request<{ id: string; name: string; order_index: number; completion_count: number; created_at: string }>('/teams', {
      method: 'POST',
      body: JSON.stringify({ name })
    }),
  updateTeam: (id: string, data: { name?: string; order_index?: number }) =>
    request<{ id: string; name: string; order_index: number; completion_count: number; created_at: string }>(
      `/teams/${id}`,
      { method: 'PATCH', body: JSON.stringify(data) }
    ),
  deleteTeam: (id: string) => request(`/teams/${id}`, { method: 'DELETE' }),
  reorderTeams: (teamIds: string[]) =>
    request<{ id: string; name: string; order_index: number; completion_count: number; created_at: string }[]>(
      '/teams/reorder',
      { method: 'POST', body: JSON.stringify({ teamIds }) }
    ),

  getMembers: (teamId: string) => request<import('../types').Member[]>(`/teams/${teamId}/members`),
  addMember: (teamId: string, name: string) =>
    request<import('../types').Member>(`/teams/${teamId}/members`, { method: 'POST', body: JSON.stringify({ name }) }),
  updateMember: (id: string, data: { name?: string; order_index?: number }) =>
    request<import('../types').Member>(`/members/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteMember: (id: string) => request(`/members/${id}`, { method: 'DELETE' }),
  reorderMembers: (teamId: string, memberIds: string[]) =>
    request<import('../types').Member[]>(`/teams/${teamId}/members/reorder`, { method: 'POST', body: JSON.stringify({ memberIds }) }),

  getSchedules: (teamId?: string) =>
    request<{ id: string; team_id: string; member_id: string; member_name: string; date: string; book_name: string; chapter: number }[]>(
      teamId ? `/schedules?teamId=${encodeURIComponent(teamId)}&_=${Date.now()}` : `/schedules?_=${Date.now()}`,
      { cache: 'no-store' }
    ),
  saveSchedules: (
    teamId: string,
    entries: { member_id: string; memberName: string; date: string; book_name: string; chapter: number }[],
    completedReadThrough?: boolean
  ) =>
    request<{ id: string; team_id: string; member_id: string; member_name: string; date: string; book_name: string; chapter: number }[]>(
      `/schedules`,
      {
        method: 'POST',
        body: JSON.stringify({ teamId, entries, completedReadThrough }),
        cache: 'no-store'
      }
    ),

  /** Record a visit and return the total visit count. */
  recordVisit: () =>
    request<{ count: number }>('/visit', { cache: 'no-store' })
}
