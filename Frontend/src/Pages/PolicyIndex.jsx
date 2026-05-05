import React from 'react'
import { FaFolder, FaTags } from 'react-icons/fa'

const STORAGE_KEY = 'okb:sops'

function readSops() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch (e) { return [] }
}

export default function PolicyIndex() {
  const sops = readSops()
  const byTag = {}
  sops.forEach((s) => {
    const tags = s.tags && s.tags.length ? s.tags : ['untagged']
    tags.forEach((t) => {
      const name = t.toLowerCase()
      byTag[name] = byTag[name] || []
      byTag[name].push(s)
    })
  })

  const tags = Object.keys(byTag).sort()

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaFolder /> Policy Index</h1>
      <p className="text-gray-600 mb-6">Browse policies organized by tags.</p>

      {tags.length === 0 ? (
        <p className="text-sm text-gray-500">No policies available.</p>
      ) : (
        <div className="space-y-6">
          {tags.map((tag) => (
            <section key={tag} className="bg-white rounded p-4 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2"><FaTags className="text-teal-600" /> {tag}</h2>
              <ul className="mt-2 space-y-2">
                {byTag[tag].map((s) => (
                  <li key={s.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-xs text-gray-500">{(s.tags || []).join(', ')}</div>
                    </div>
                    <div className="text-xs text-gray-400">Updated {new Date(s.updatedAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}