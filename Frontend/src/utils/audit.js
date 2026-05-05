const STORAGE_KEY = 'okb:audit'

function now() {
  return new Date().toISOString()
}

export function readAudit() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Failed to read audit', e)
    return []
  }
}

export function pushAudit(entry) {
  try {
    const current = readAudit()
    const record = { id: now() + ':' + Math.random().toString(36).slice(2, 8), timestamp: now(), ...entry }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...current]))
    return record
  } catch (e) {
    console.error('Failed to write audit', e)
  }
}

export function clearAudit() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear audit', e)
  }
}