import React, { useEffect, useState } from 'react'
import { suggestTagsFromText, mergeTags } from '../utils/tagging'
import { pushAudit } from '../utils/audit'
import { sopAPI } from '../utils/api'
import { FaTags, FaMagic, FaCheck } from 'react-icons/fa'

export default function AutoTagging() {
  const [sops, setSops] = useState([])
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [suggestions, setSuggestions] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadSops() {
      setLoading(true)
      setError(null)
      try {
        const response = await sopAPI.getAll()
        setSops(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load SOPs')
      } finally {
        setLoading(false)
      }
    }

    loadSops()
  }, [])

  useEffect(() => {
    const s = {}
    sops.forEach((sop) => {
      s[sop._id] = suggestTagsFromText([sop.title, sop.content].join(' '), 5)
    })
    setSuggestions(s)
  }, [sops])

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function applyTagsToSelected() {
    if (selectedIds.size === 0) {
      return alert('Select SOPs to apply suggested tags')
    }

    setError(null)

    try {
      const updates = await Promise.all(
        Array.from(selectedIds).map(async (id) => {
          const sop = sops.find((item) => item._id === id)
          if (!sop) return null
          const suggested = suggestions[id] || []
          if (suggested.length === 0) return sop

          const merged = mergeTags(sop.tags || [], suggested)
          const response = await sopAPI.update(id, {
            title: sop.title,
            content: sop.content,
            tags: merged,
          })

          pushAudit({ action: 'auto-tag', type: 'sop', id, title: sop.title, details: { added: suggested } })
          return response.data.sop
        })
      )

      setSops((prev) =>
        prev.map((sop) => {
          const updated = updates.find((item) => item && item._id === sop._id)
          return updated || sop
        })
      )
      setSelectedIds(new Set())
      alert('Suggested tags applied')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply tags to selected SOPs')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaTags /> Auto‑Tagging</h1>
      <p className="text-gray-600 mb-6">Automatically suggest tags for SOPs and apply them in bulk.</p>

      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <button onClick={applyTagsToSelected} disabled={loading || sops.length === 0} className="flex items-center gap-2 px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"><FaMagic /> Apply suggestions to selected</button>
        </div>

        {loading && <p className="text-sm text-gray-500">Loading SOPs…</p>}
        {error && !loading && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && sops.length === 0 && <p className="text-sm text-gray-500">No SOPs available.</p>}

        <div className="grid gap-3">
          {sops.map((sop) => {
            const isSelected = selectedIds.has(sop._id)
            return (
              <div key={sop._id} className={`bg-white p-4 rounded shadow-sm flex justify-between items-start transition border ${isSelected ? 'border-teal-500 bg-teal-50' : 'border-transparent'}`}>
                <div>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(sop._id)}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="font-medium">{sop.title}</span>
                  </label>
                  <p className="text-xs text-gray-500">Tags: {(sop.tags || []).join(', ')}</p>
                  <p className="text-xs text-gray-400">Updated {new Date(sop.updatedAt).toLocaleString()}</p>
                </div>
                <div className="text-sm text-right">
                  <div className="text-xs text-gray-600">Suggestions</div>
                  <div className="mt-1">
                    {(suggestions[sop._id] || []).map((t) => (
                      <span key={t} className="inline-block bg-gray-100 text-sm text-gray-700 px-2 py-0.5 rounded mr-1">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}