import { useState, useEffect, useRef } from 'react'
import { api } from '../lib/api'
import { useI18n } from '../i18n/context'
import type { Organization } from '../types'

const SEARCH_DEBOUNCE_MS = 300

interface OrgManagerProps {
  selectedOrgId: string | null
  onSelectOrg: (id: string | null) => void
  onOrgsUpdate?: () => void
}

export function OrgManager({ selectedOrgId, onSelectOrg, onOrgsUpdate }: OrgManagerProps) {
  const { t } = useI18n()
  const [orgSearch, setOrgSearch] = useState('')
  const [searchResults, setSearchResults] = useState<Organization[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [currentOrgName, setCurrentOrgName] = useState<string | null>(null)
  const [newOrgName, setNewOrgName] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load current org name when selectedOrgId is set (e.g. on mount or when switching back)
  useEffect(() => {
    if (!selectedOrgId) {
      setCurrentOrgName(null)
      return
    }
    let cancelled = false
    api
      .getOrganizations()
      .then((list) => {
        if (cancelled) return
        const org = list.find((o) => o.id === selectedOrgId)
        setCurrentOrgName(org?.name ?? null)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [selectedOrgId])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const term = orgSearch.trim()
    if (!term) {
      setSearchResults([])
      setSearchLoading(false)
      return
    }
    setSearchLoading(true)
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null
      api
        .getOrganizations(term)
        .then((data) => setSearchResults(data))
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false))
    }, SEARCH_DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [orgSearch])

  async function addOrg() {
    const name = (newOrgName.trim() || orgSearch.trim()).trim()
    if (!name) return
    setCreateLoading(true)
    try {
      const org = await api.createOrganization(name)
      setNewOrgName('')
      setOrgSearch('')
      setSearchResults([])
      setCurrentOrgName(org.name)
      onSelectOrg(org.id)
      onOrgsUpdate?.()
    } catch (e) {
      console.error(e)
      alert((e as Error).message)
    } finally {
      setCreateLoading(false)
    }
  }

  async function deleteOrg(id: string) {
    if (!confirm(t('org.confirmDelete'))) return
    setCreateLoading(true)
    try {
      await api.deleteOrganization(id)
      if (selectedOrgId === id) {
        setCurrentOrgName(null)
        onSelectOrg(null)
      }
      setSearchResults((prev) => prev.filter((o) => o.id !== id))
      onOrgsUpdate?.()
    } catch (e) {
      console.error(e)
      alert((e as Error).message)
    } finally {
      setCreateLoading(false)
    }
  }

  function selectOrg(org: Organization) {
    setCurrentOrgName(org.name)
    onSelectOrg(org.id)
    onOrgsUpdate?.()
  }

  const showCreate = orgSearch.trim().length > 0
  const createName = newOrgName.trim() || orgSearch.trim()
  const hasSearchResults = searchResults.length > 0
  const noResults = orgSearch.trim().length > 0 && !searchLoading && !hasSearchResults

  return (
    <div className="org-manager">
      <div className="panel-header">
        <h2>{t('org.title')}</h2>
      </div>

      {selectedOrgId && currentOrgName && (
        <div className="org-current">
          <span className="org-current-label">{t('org.using')}</span>
          <span className="org-current-name">{currentOrgName}</span>
          <button
            type="button"
            className="btn-icon btn-danger"
            onClick={() => deleteOrg(selectedOrgId)}
            disabled={createLoading}
            title={t('org.delete')}
          >
            {t('org.delete')}
          </button>
        </div>
      )}

      <div className="org-search">
        <input
          type="search"
          value={orgSearch}
          onChange={(e) => setOrgSearch(e.target.value)}
          placeholder={t('org.searchPlaceholder')}
          disabled={createLoading}
          aria-label={t('org.searchPlaceholder')}
        />
      </div>

      {searchLoading && <p className="org-search-status">{t('org.searching')}</p>}

      {!searchLoading && showCreate && (
        <div className="org-list">
          {hasSearchResults ? (
            <>
              <p className="org-list-heading">{t('org.matchingOrgs')}</p>
              {searchResults.map((org) => (
                <div
                  key={org.id}
                  className={`org-card ${selectedOrgId === org.id ? 'selected' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectOrg(org)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && selectOrg(org)}
                >
                  <span className="org-card-name">{org.name}</span>
                  <span className="org-join-hint">{t('org.clickToJoin')}</span>
                </div>
              ))}
            </>
          ) : noResults ? (
            <p className="empty-hint">{t('org.noSearchResults')}</p>
          ) : null}
        </div>
      )}

      <div className="add-org">
        <input
          type="text"
          value={newOrgName}
          onChange={(e) => setNewOrgName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addOrg()}
          placeholder={noResults ? t('org.createWithName') : t('org.namePlaceholder')}
          disabled={createLoading}
        />
        <button
          onClick={addOrg}
          disabled={createLoading || !createName}
          className="btn-primary"
        >
          {t('org.addOrg')}
        </button>
      </div>
      <p className="org-create-hint">{t('org.createHint')}</p>
    </div>
  )
}
