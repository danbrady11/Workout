import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage.js'
import { WORKOUT } from './data.js'
import { getTodayDayType, getPrefillWeight, getRepsDefault, getRepsRange, isHeavy } from './workoutLogic.js'
import WorkoutDay from './components/WorkoutDay.jsx'
import CalendarView from './components/CalendarView.jsx'

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function App() {
  const [activeView, setActiveView] = useState('workout')
  const [sessions, setSessions] = useLocalStorage('mwf_sessions_v2', {})
  const [calendar, setCalendar] = useLocalStorage('mwf_calendar', {})

  // Clock
  const [clockStartedAt, setClockStartedAt] = useState(null)
  const [clockAccum, setClockAccum] = useState(0)
  const clockTickRef = useRef(null)
  const [, setTick] = useState(0)

  const clockRunning = clockStartedAt !== null
  const clockElapsed = clockStartedAt
    ? clockAccum + Math.floor((Date.now() - clockStartedAt) / 1000)
    : clockAccum

  useEffect(() => {
    if (clockRunning) {
      clockTickRef.current = setInterval(() => setTick(t => t + 1), 1000)
    } else {
      clearInterval(clockTickRef.current)
    }
    return () => clearInterval(clockTickRef.current)
  }, [clockRunning])

  function clockStart()  { setClockStartedAt(Date.now() - clockAccum * 1000) }
  function clockPause()  { setClockAccum(clockElapsed); setClockStartedAt(null) }
  function clockReset()  { setClockStartedAt(null); setClockAccum(0) }

  const todayKey = toDateKey(new Date())

  // Determine today's day type
  const dayType = useMemo(() => {
    // If today already has a session started, use its stored type
    if (sessions[todayKey]?._dayType) return sessions[todayKey]._dayType
    return getTodayDayType(sessions, todayKey)
  }, [sessions, todayKey])

  // Build prefilled exercise data for today based on history
  // Only used if exercise has no saved data yet for today
  const prefillData = useMemo(() => {
    const result = {}
    WORKOUT.exercises.forEach(ex => {
      const weight = getPrefillWeight(sessions, todayKey, ex.id, dayType)
      const reps = getRepsDefault(ex.id, dayType)
      const range = getRepsRange(ex.id, dayType)
      result[ex.id] = { weight: weight !== null ? weight.toString() : '', reps: reps.toString(), repsRange: range }
    })
    return result
  }, [sessions, todayKey, dayType])

  const todaySession = sessions[todayKey] || {}

  function handleSessionChange(data) {
    // Always stamp the day type on save
    setSessions(s => ({ ...s, [todayKey]: { ...data, _dayType: dayType } }))
  }

  function handleSaveToCalendar() {
    const durationMins = clockElapsed > 0 ? Math.round(clockElapsed / 60) : undefined
    setCalendar(c => ({
      ...c,
      [todayKey]: {
        type: 'workout',
        dayType,
        notes: c[todayKey]?.notes || '',
        ...(durationMins ? { duration: durationMins.toString() } : {}),
      }
    }))
    clockReset()
    setActiveView('calendar')
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', minHeight: '100vh' }}>
      <header style={styles.header}>
        <div style={styles.logo}>EOS <span style={{ color: 'var(--accent)' }}>Training</span></div>
        <div style={styles.navTabs}>
          <button style={{ ...styles.navTab, ...(activeView === 'workout' ? styles.navActive : {}) }} onClick={() => setActiveView('workout')}>
            Workout
          </button>
          <button style={{ ...styles.navTab, ...(activeView === 'calendar' ? styles.navActive : {}) }} onClick={() => setActiveView('calendar')}>
            Calendar
          </button>
        </div>
      </header>

      <div style={{ display: activeView === 'workout' ? 'block' : 'none' }}>
        <WorkoutDay
          dayType={dayType}
          todaySession={todaySession}
          prefillData={prefillData}
          onSessionChange={handleSessionChange}
          onSaveToCalendar={handleSaveToCalendar}
          clockRunning={clockRunning}
          clockElapsed={clockElapsed}
          onClockStart={clockStart}
          onClockPause={clockPause}
          onClockReset={clockReset}
        />
      </div>

      <div style={{ display: activeView === 'calendar' ? 'block' : 'none' }}>
        <CalendarView
          calendarData={calendar}
          sessions={sessions}
          onCalendarChange={setCalendar}
        />
      </div>
    </div>
  )
}

const styles = {
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 100, boxShadow: 'var(--shadow)',
  },
  logo: {
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem',
    textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1, color: 'var(--text)',
  },
  navTabs: {
    display: 'flex', gap: '4px', background: 'var(--surface2)',
    padding: '4px', borderRadius: '10px', border: '1px solid var(--border)',
  },
  navTab: {
    padding: '8px 16px', border: 'none', background: 'transparent', color: 'var(--muted)',
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem',
    letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '7px',
    transition: 'all 0.15s', cursor: 'pointer',
  },
  navActive: { background: 'var(--accent)', color: '#fff', boxShadow: 'var(--shadow)' },
}
