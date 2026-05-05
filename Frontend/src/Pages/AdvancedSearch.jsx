import React, { useState } from 'react'
import { FaSearch, FaFilter } from 'react-icons/fa'
import { sopAPI } from '../utils/api'

export default function AdvancedSearch() {
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function doSearch() {
    setError(null)
    const trimmedQuery = query.trim()
    const trimmedTag = tag.trim()

    if (!trimmedQuery && !trimmedTag) {
      setResults([])
      setError('Enter a query or tag to search.')
      return
    }

    setLoading(true)
    try {
      const response = await sopAPI.search(trimmedQuery, trimmedTag)
      setResults(response.data)
      if (response.data.length === 0) {
        setError('No SOPs found for this search.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaSearch /> Advanced Search</h1>
      <p className="text-gray-600 mb-6">Search across SOP titles, content, and tags with filters.</p>

      <div className="bg-white rounded p-4 shadow-sm space-y-3">
        <div>
          <label className="flex text-sm font-medium text-gray-700 items-center gap-2"><FaSearch /> Query</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2" />
        </div>

        <div>
          <label className="flex text-sm font-medium text-gray-700 items-center gap-2"><FaFilter /> Tag filter</label>
          <input value={tag} onChange={(e) => setTag(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2" placeholder="e.g., hr" />
        </div>

        <div>
          <button onClick={doSearch} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"><FaSearch /> Search</button>
        </div>
      </div>

      <div className="mt-6">
        {loading && <p className="text-sm text-gray-500">Searching...</p>}
        {error && !loading && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && results.length === 0 && <p className="text-sm text-gray-500">No results.</p>}
        {!loading && results.length > 0 && (
          <ul className="space-y-3">
            {results.map((r) => (
              <li key={r._id} className="bg-white p-3 rounded shadow-sm">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-gray-500">{(r.tags || []).join(', ')}</div>
                    <div className="text-xs text-gray-400 mt-1">{r.content?.slice(0, 200)}</div>
                  </div>
                  <div className="text-xs text-gray-400">Updated {new Date(r.updatedAt).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}