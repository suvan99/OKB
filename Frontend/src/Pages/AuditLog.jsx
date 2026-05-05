import React from 'react'
import { readAudit, clearAudit } from '../utils/audit'
import { FaSync, FaTrash, FaClock } from 'react-icons/fa'

export default function AuditLog() {
  const [entries, setEntries] = React.useState(() => readAudit())

  function refresh() {
    setEntries(readAudit())
  }

  function handleClear() {
    if (!confirm('Clear audit log?')) return
    clearAudit()
    refresh()
  }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><FaClock /> Audit Log</h1>
        <div>
          <button onClick={refresh} className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100 mr-2"><FaSync /> Refresh</button>
          <button onClick={handleClear} className="flex items-center gap-2 px-3 py-1 rounded bg-red-50 text-red-700"><FaTrash /> Clear</button>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">No audit entries.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => (
            <li key={e.id} className="bg-white p-3 rounded shadow-sm">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium">{e.action.toUpperCase()} — {e.type}</div>
                  <div className="text-xs text-gray-500">{e.title || ''} {e.id}</div>
                </div>
                <div className="text-xs text-gray-400">{new Date(e.timestamp).toLocaleString()}</div>
              </div>
              {e.details && <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(e.details, null, 2)}</pre>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}