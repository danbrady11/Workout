import { WORKOUT } from './data.js'

// Which exercises are "legs" (heavy on A) vs "upper" (heavy on B)
export const LEG_EXERCISE_IDS = new Set(['leg-press', 'rdl'])
export const UPPER_EXERCISE_IDS = new Set(['chest-press', 'cable-row', 'shoulder-press', 'lat-pulldown'])

export const DAY_TYPES = { A: 'A', B: 'B' }

// A day: legs heavy, upper light
// B day: upper heavy, legs light
export function isHeavy(exId, dayType) {
  if (dayType === 'A') return LEG_EXERCISE_IDS.has(exId)
  if (dayType === 'B') return UPPER_EXERCISE_IDS.has(exId)
  return true // baseline: everything heavy
}

// Round to nearest 2.5
function round25(n) {
  return Math.round(n / 2.5) * 2.5
}

/**
 * Determine today's day type by looking at past sessions.
 * sessions: { 'YYYY-MM-DD': { _dayType: 'A'|'B'|'baseline', ... } }
 * First session ever = baseline. After that, alternate A→B→A→B.
 */
export function getTodayDayType(sessions, todayKey) {
  const pastKeys = Object.keys(sessions)
    .filter(k => k !== todayKey)
    .sort()

  if (pastKeys.length === 0) return 'baseline'

  const last = sessions[pastKeys[pastKeys.length - 1]]
  const lastType = last?._dayType

  if (!lastType || lastType === 'baseline') return 'A'
  return lastType === 'A' ? 'B' : 'A'
}

/**
 * Find the most recent session of a specific day type (for heavy reference).
 */
export function getLastSessionOfType(sessions, todayKey, dayType) {
  const keys = Object.keys(sessions)
    .filter(k => k !== todayKey && (sessions[k]._dayType === dayType || sessions[k]._dayType === 'baseline'))
    .sort()
    .reverse()
  return keys.length > 0 ? sessions[keys[0]] : null
}

/**
 * Get the most recent HEAVY weight recorded for an exercise.
 * For A day heavy exercises (legs): look at last A session (or baseline)
 * For B day heavy exercises (upper): look at last B session (or baseline)
 */
export function getLastHeavyWeight(sessions, todayKey, exId) {
  // Which day type makes this exercise heavy?
  const heavyDayType = LEG_EXERCISE_IDS.has(exId) ? 'A' : 'B'

  const keys = Object.keys(sessions)
    .filter(k => {
      if (k === todayKey) return false
      const dt = sessions[k]._dayType
      return dt === heavyDayType || dt === 'baseline'
    })
    .sort()
    .reverse()

  for (const k of keys) {
    const w = sessions[k][exId]?.weight
    if (w) return parseFloat(w)
  }
  return null
}

/**
 * Calculate prefilled weight for an exercise given today's day type.
 * - Baseline: no prefill (null)
 * - Heavy day: lastHeavyWeight + 2.5
 * - Light day: lastHeavyWeight * 0.80, rounded to 2.5
 */
export function getPrefillWeight(sessions, todayKey, exId, dayType) {
  if (dayType === 'baseline') return null

  const lastHeavy = getLastHeavyWeight(sessions, todayKey, exId)
  if (lastHeavy === null) return null

  const heavy = isHeavy(exId, dayType)
  if (heavy) {
    return round25(lastHeavy + 2.5)
  } else {
    return round25(lastHeavy * 0.80)
  }
}

/**
 * Get reps default for an exercise given day type.
 * Heavy = 8, Light = 12, Baseline = 10
 */
export function getRepsDefault(exId, dayType) {
  if (dayType === 'baseline') return 10
  return isHeavy(exId, dayType) ? 8 : 12
}

/**
 * Get reps range label.
 */
export function getRepsRange(exId, dayType) {
  if (dayType === 'baseline') return '8–12'
  return isHeavy(exId, dayType) ? '6–8' : '10–12'
}
