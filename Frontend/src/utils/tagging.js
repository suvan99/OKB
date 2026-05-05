const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'you', 'your', 'our', 'who', 'what', 'when', 'where', 'why', 'how', 'a', 'an', 'of', 'to', 'in', 'on', 'by', 'as', 'is', 'be', 'or', 'it'
])

export function suggestTagsFromText(text, maxTags = 5) {
  if (!text) return []
  const freq = Object.create(null)
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w))

  tokens.forEach((t) => { freq[t] = (freq[t] || 0) + 1 })
  const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a])
  return sorted.slice(0, maxTags)
}

export function mergeTags(existing = [], suggested = []) {
  const set = new Set(existing.map((t) => t.toLowerCase()))
  suggested.forEach((s) => set.add(s.toLowerCase()))
  return Array.from(set)
}