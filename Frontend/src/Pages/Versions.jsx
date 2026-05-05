import React from 'react'
import { FaHistory, FaUndo } from 'react-icons/fa'

const STORAGE_KEY = 'okb:sops'

function readSops() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch (e) { return [] }
}

function writeSops(sops) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sops))
}

export default function Versions() {
  const sops = readSops()
  const allVersions = []
  sops.forEach((s) => {
    ; (s.versions || []).forEach((v, i) => allVersions.push({ sopId: s.id, title: s.title, index: i, version: v }))
  })

  function revert(sopId, index) {
    const s = sops.map((x) => {
      if (x.id !== sopId) return x
      const ver = x.versions[index]
      if (!ver) return x
      const current = { content: x.content, tags: x.tags, updatedAt: x.updatedAt }
      const newVersions = [...x.versions]
      newVersions.splice(index, 1)
      return { ...x, content: ver.content, tags: ver.tags, updatedAt: new Date().toISOString(), versions: [current, ...newVersions] }
    })
    writeSops(s)
    alert('Reverted version')
    window.location.reload()
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaHistory /> All Versions</h1>
      <p className="text-gray-600 mb-6">View version snapshots across all SOPs and revert if needed.</p>

      {allVersions.length === 0 ? (
        <p className="text-sm text-gray-500">No versions found.</p>
      ) : (
        <div className="space-y-3">
          {allVersions.map((v, i) => (
            <div key={i} className="bg-white p-3 rounded shadow-sm flex justify-between">
              <div>
                <div className="font-medium">{v.title} — version {v.index}</div>
                <div className="text-xs text-gray-500">{(v.version.tags || []).join(', ')}</div>
                <div className="text-xs text-gray-400">{v.version.content.slice(0, 200)}</div>
              </div>
              <div>
                <button onClick={() => revert(v.sopId, v.index)} className="flex items-center gap-2 px-2 py-1 rounded bg-teal-50 text-teal-700 hover:bg-teal-100"><FaUndo /> Revert</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}