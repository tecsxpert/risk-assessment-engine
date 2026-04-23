import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllRisks, searchRisks, exportRisksCSV } from '../services/riskService'
import LoadingSkeleton from '../components/LoadingSkeleton'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import Pagination from '../components/Pagination'

// ── constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10

const COLUMNS = [
  { key: 'id',          label: 'ID',         sortable: true  },
  { key: 'title',       label: 'Title',       sortable: true  },
  { key: 'category',    label: 'Category',    sortable: true  },
  { key: 'severity',    label: 'Severity',    sortable: true  },
  { key: 'status',      label: 'Status',      sortable: true  },
  { key: 'score',       label: 'Risk Score',  sortable: true  },
  { key: 'owner',       label: 'Owner',       sortable: false },
  { key: 'createdDate', label: 'Created',     sortable: true  },
  { key: 'actions',     label: 'Actions',     sortable: false },
]

const SEVERITY_COLOURS = {
  HIGH:   'bg-red-100 text-red-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  LOW:    'bg-green-100 text-green-800',
}

// ── helpers ──────────────────────────────────────────────────────────────────
function scoreColour(score) {
  if (score >= 75) return 'text-red-600 font-semibold'
  if (score >= 40) return 'text-yellow-600 font-semibold'
  return 'text-green-600 font-semibold'
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// ── safe array extractor — handles all Spring Page response shapes ────────────
function extractList(data) {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.content)) return data.content
  const found = Object.values(data).find(v => Array.isArray(v))
  return found ?? []
}

// ── debounce hook ─────────────────────────────────────────────────────────────
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// ── sort icon component — defined OUTSIDE to prevent remount ──────────────────
function SortIcon({ colKey, sortBy, sortDir }) {
  if (sortBy !== colKey)
    return <span className="ml-1 text-gray-300 text-xs">↕</span>
  return (
    <span className="ml-1 text-xs">
      {sortDir === 'asc' ? '↑' : '↓'}
    </span>
  )
}

// ════════════════════════════════════════════════════════════════════════════
export default function ListPage() {
  const navigate = useNavigate()

  // ── state ──────────────────────────────────────────────────────────────────
  const [risks, setRisks]                   = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)
  const [page, setPage]                     = useState(0)
  const [totalPages, setTotalPages]         = useState(0)
  const [totalElements, setTotalElements]   = useState(0)
  const [sortBy, setSortBy]                 = useState('id')
  const [sortDir, setSortDir]               = useState('asc')
  const [searchInput, setSearchInput]       = useState('')
  const [statusFilter, setStatusFilter]     = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [isSearching, setIsSearching]       = useState(false)

  const searchQuery = useDebounce(searchInput, 300)

  // ── reset page to 0 when filters or search change ─────────────────────────
  useEffect(() => {
    setPage(0)
  }, [searchQuery, statusFilter, severityFilter])

  // ── main fetch function ───────────────────────────────────────────────────
  const fetchRisks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let res

      if (searchQuery.trim()) {
        // ── search mode ──────────────────────────────────────────────────────
        setIsSearching(true)
        res = await searchRisks(searchQuery)
        const list = extractList(res.data)
        setRisks(list)
        setTotalPages(res.data?.totalPages   ?? 1)
        setTotalElements(res.data?.totalElements ?? list.length)

      } else {
        // ── normal paginated fetch from GET /all ─────────────────────────────
        setIsSearching(false)
        res = await getAllRisks(page, PAGE_SIZE, sortBy, sortDir)

        /*
         * Spring Page response shape:
         * {
         *   content:          [...],   ← the actual records
         *   totalPages:       5,
         *   totalElements:    48,
         *   number:           0,       ← current page (0-indexed)
         *   size:             10,
         *   first:            true,
         *   last:             false,
         *   empty:            false
         * }
         */
        const data = res.data
        setRisks(extractList(data))
        setTotalPages(data?.totalPages    ?? 1)
        setTotalElements(data?.totalElements ?? 0)
      }

    } catch (err) {
      console.error('ListPage fetch error:', err)
      setError(
        err.message === 'Network Error'
          ? 'Cannot reach the server. Make sure the backend is running on port 8080.'
          : err.response?.status === 401
          ? 'Session expired. Please log in again.'
          : err.response?.status === 403
          ? 'You do not have permission to view this data.'
          : 'Failed to load risks. Please try again.'
      )
      setRisks([])
    } finally {
      setLoading(false)
    }
  }, [page, sortBy, sortDir, searchQuery])

  // ── run fetch on dependency change ────────────────────────────────────────
  useEffect(() => {
    fetchRisks()
  }, [fetchRisks])

  // ── sort handler ──────────────────────────────────────────────────────────
  function handleSort(key) {
    if (sortBy === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortDir('asc')
    }
    setPage(0)
  }

  // ── page change handler ───────────────────────────────────────────────────
  function handlePageChange(newPage) {
    if (newPage < 0 || newPage >= totalPages) return
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── CSV export ────────────────────────────────────────────────────────────
  async function handleExport() {
    try {
      const res = await exportRisksCSV()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a   = document.createElement('a')
      a.href    = url
      a.download = `risks-export-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Export failed. Please try again.')
    }
  }

  // ── clear all filters ─────────────────────────────────────────────────────
  function handleClearFilters() {
    setSearchInput('')
    setStatusFilter('')
    setSeverityFilter('')
    setPage(0)
  }

  // ── client-side filter for status and severity ────────────────────────────
  const visibleRisks = (Array.isArray(risks) ? risks : []).filter(r => {
    const matchStatus   = statusFilter   ? r.status   === statusFilter   : true
    const matchSeverity = severityFilter ? r.severity === severityFilter : true
    return matchStatus && matchSeverity
  })

  const hasActiveFilters = searchInput || statusFilter || severityFilter

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Navbar ── */}
      <nav className="bg-primary text-white px-6 py-4 flex items-center
                      justify-between shadow sticky top-0 z-10">
        <h1 className="text-lg font-medium tracking-wide">
          Risk Assessment Engine
        </h1>
        <div className="flex gap-4 text-sm">
          <button onClick={() => navigate('/')}
            className="hover:underline opacity-80 hover:opacity-100">
            Dashboard
          </button>
          <button onClick={() => navigate('/risks')}
            className="underline font-semibold">
            Risks
          </button>
          <button onClick={() => navigate('/analytics')}
            className="hover:underline opacity-80 hover:opacity-100">
            Analytics
          </button>
        </div>
      </nav>

      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center
                        sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-medium text-gray-800">
              Risk Register
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {loading
                ? 'Loading...'
                : `${totalElements} risk${totalElements !== 1 ? 's' : ''} total`}
              {isSearching && !loading && (
                <span className="ml-2 text-primary font-medium">
                  — search results for "{searchQuery}"
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-primary text-primary text-sm
                         rounded hover:bg-blue-50 transition"
            >
              Export CSV
            </button>
            <button
              onClick={() => navigate('/risks/new')}
              className="px-4 py-2 bg-primary text-white text-sm rounded
                         hover:opacity-90 transition"
            >
              + New Risk
            </button>
          </div>
        </div>

        {/* ── Search and filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">

          {/* search input */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2
                             text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by title, category, owner..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-primary"
            />
          </div>

          {/* status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary
                       bg-white"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="MITIGATED">Mitigated</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* severity filter */}
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary
                       bg-white"
          >
            <option value="">All Severities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* clear filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-800
                         border border-gray-300 rounded hover:bg-gray-50
                         transition whitespace-nowrap"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200
                          text-red-700 rounded flex items-center
                          justify-between text-sm">
            <span>⚠ {error}</span>
            <button
              onClick={fetchRisks}
              className="ml-4 underline font-medium hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Table card ── */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200
                        overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              {/* thead */}
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {COLUMNS.map(col => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`
                        px-4 py-3 text-left text-xs font-semibold
                        text-gray-500 uppercase tracking-wider
                        whitespace-nowrap select-none
                        ${col.sortable
                          ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-700'
                          : ''}
                        ${sortBy === col.key ? 'text-primary bg-blue-50' : ''}
                      `}
                    >
                      {col.label}
                      {col.sortable && (
                        <SortIcon
                          colKey={col.key}
                          sortBy={sortBy}
                          sortDir={sortDir}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* tbody */}
              <tbody className="divide-y divide-gray-100">

                {/* loading state */}
                {loading && (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-4 py-6">
                      <LoadingSkeleton rows={PAGE_SIZE} />
                    </td>
                  </tr>
                )}

                {/* empty state */}
                {!loading && visibleRisks.length === 0 && (
                  <tr>
                    <td colSpan={COLUMNS.length}>
                      <EmptyState
                        message={
                          searchInput
                            ? `No risks found matching "${searchInput}"`
                            : hasActiveFilters
                            ? 'No risks match the selected filters.'
                            : 'No risks recorded yet. Click + New Risk to add one.'
                        }
                      />
                    </td>
                  </tr>
                )}

                {/* data rows */}
                {!loading && visibleRisks.map(risk => (
                  <tr
                    key={risk.id}
                    onClick={() => navigate(`/risks/${risk.id}`)}
                    className="hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {/* ID */}
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      #{risk.id}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3 font-medium text-gray-800
                                   max-w-xs">
                      <div className="truncate" title={risk.title}>
                        {risk.title}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-gray-600">
                      {risk.category ?? '—'}
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-3">
                      {risk.severity ? (
                        <span className={`px-2 py-1 rounded text-xs font-medium
                          ${SEVERITY_COLOURS[risk.severity]
                            ?? 'bg-gray-100 text-gray-600'}`}>
                          {risk.severity}
                        </span>
                      ) : '—'}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge value={risk.status} />
                    </td>

                    {/* Score */}
                    <td className={`px-4 py-3 ${scoreColour(risk.score)}`}>
                      <div className="flex items-center gap-2">
                        <span>{risk.score ?? '—'}</span>
                        {risk.score != null && (
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full
                                          overflow-hidden">
                            <div
                              className={`h-full rounded-full
                                ${risk.score >= 75 ? 'bg-red-500'
                                : risk.score >= 40 ? 'bg-yellow-400'
                                : 'bg-green-500'}`}
                              style={{
                                width: `${Math.min(risk.score, 100)}%`
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="px-4 py-3 text-gray-600">
                      {risk.owner ?? '—'}
                    </td>

                    {/* Created Date */}
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatDate(risk.createdDate)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div
                        className="flex gap-2"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => navigate(`/risks/${risk.id}/edit`)}
                          className="px-3 py-1 text-xs border border-primary
                                     text-primary rounded hover:bg-blue-50
                                     transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/risks/${risk.id}`)}
                          className="px-3 py-1 text-xs border border-gray-300
                                     text-gray-600 rounded hover:bg-gray-50
                                     transition"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination footer ── */}
          {!loading && totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50
                            flex flex-col sm:flex-row items-center
                            justify-between gap-3">

              {/* record count info */}
              <p className="text-xs text-gray-500">
                Showing{' '}
                <span className="font-medium text-gray-700">
                  {page * PAGE_SIZE + 1}
                </span>
                {' '}–{' '}
                <span className="font-medium text-gray-700">
                  {Math.min((page + 1) * PAGE_SIZE, totalElements)}
                </span>
                {' '}of{' '}
                <span className="font-medium text-gray-700">
                  {totalElements}
                </span>
                {' '}risks
              </p>

              {/* page controls */}
              <div className="flex items-center gap-1">

                {/* first page */}
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={page === 0}
                  className="px-2 py-1 text-xs border border-gray-300 rounded
                             disabled:opacity-40 hover:bg-gray-100 transition"
                  title="First page"
                >
                  «
                </button>

                {/* previous page */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="px-3 py-1 text-xs border border-gray-300 rounded
                             disabled:opacity-40 hover:bg-gray-100 transition"
                >
                  Prev
                </button>

                {/* page number pills */}
                {Array.from({ length: totalPages }, (_, i) => i)
                  .filter(i =>
                    i === 0 ||
                    i === totalPages - 1 ||
                    Math.abs(i - page) <= 1
                  )
                  .reduce((acc, i, idx, arr) => {
                    if (idx > 0 && i - arr[idx - 1] > 1) {
                      acc.push('...')
                    }
                    acc.push(i)
                    return acc
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`ellipsis-${idx}`}
                        className="px-2 py-1 text-xs text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item)}
                        className={`px-3 py-1 text-xs border rounded transition
                          ${page === item
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 hover:bg-gray-100'}`}
                      >
                        {item + 1}
                      </button>
                    )
                  )
                }

                {/* next page */}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page + 1 >= totalPages}
                  className="px-3 py-1 text-xs border border-gray-300 rounded
                             disabled:opacity-40 hover:bg-gray-100 transition"
                >
                  Next
                </button>

                {/* last page */}
                <button
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={page + 1 >= totalPages}
                  className="px-2 py-1 text-xs border border-gray-300 rounded
                             disabled:opacity-40 hover:bg-gray-100 transition"
                  title="Last page"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── page size info when only 1 page ── */}
        {!loading && totalPages <= 1 && visibleRisks.length > 0 && (
          <p className="text-xs text-gray-400 text-right mt-2">
            Showing all {visibleRisks.length} risk
            {visibleRisks.length !== 1 ? 's' : ''}
          </p>
        )}

      </div>
    </div>
  )
}