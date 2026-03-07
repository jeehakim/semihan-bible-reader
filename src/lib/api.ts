const API_BASE = import.meta.env.VITE_API_URL || ''

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options
  })
  if (res.status === 204) return undefined as T
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || res.statusText) as Error & { status?: number }
    err.status = res.status
    throw err
  }
  return data as T
}

export const api = {
  getOrganizations: (search?: string) =>
    request<import('../types').Organization[]>(
      search ? `/organizations?search=${encodeURIComponent(search)}` : '/organizations'
    ),
  createOrganization: (name: string) =>
    request<import('../types').Organization>('/organizations', {
      method: 'POST',
      body: JSON.stringify({ name })
    }),
  updateOrganization: (id: string, name: string) =>
    request<import('../types').Organization>(`/organizations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name })
    }),
  deleteOrganization: (id: string) => request(`/organizations/${id}`, { method: 'DELETE' }),

  getTeams: (orgId: string) =>
    request<{ id: string; org_id?: string; name: string; order_index: number; completion_count: number; created_at: string }[]>(
      `/teams?orgId=${encodeURIComponent(orgId)}`
    ),
  createTeam: (name: string, orgId: string) =>
    request<{ id: string; org_id?: string; name: string; order_index: number; completion_count: number; created_at: string }>('/teams', {
      method: 'POST',
      body: JSON.stringify({ name, orgId })
    }),
  updateTeam: (id: string, data: { name?: string; order_index?: number }) =>
    request<{ id: string; org_id?: string; name: string; order_index: number; completion_count: number; created_at: string }>(
      `/teams/${id}`,
      { method: 'PATCH', body: JSON.stringify(data) }
    ),
  deleteTeam: (id: string) => request(`/teams/${id}`, { method: 'DELETE' }),
  reorderTeams: (orgId: string, teamIds: string[]) =>
    request<{ id: string; org_id?: string; name: string; order_index: number; completion_count: number; created_at: string }[]>(
      '/teams/reorder',
      { method: 'POST', body: JSON.stringify({ orgId, teamIds }) }
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
    completedReadThrough?: boolean,
    expectedScheduleCount?: number
  ) =>
    request<{ id: string; team_id: string; member_id: string; member_name: string; date: string; book_name: string; chapter: number }[]>(
      `/schedules`,
      {
        method: 'POST',
        body: JSON.stringify({ teamId, entries, completedReadThrough, expectedScheduleCount }),
        cache: 'no-store'
      }
    ),

  /** Record a visit (by IP + session) and return the total visitor count. */
  recordVisit: (sessionId: string) =>
    request<{ count: number }>('/visit', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
      cache: 'no-store'
    })
}
