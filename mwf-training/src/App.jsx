import React, { useState, useEffect, useRef } from 'react'
import { useLocalStorage } from './useLocalStorage.js'
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

  // sessions: { 'YYYY-MM-DD': { exId: { doneSets, weight, reps }, _finisher: {...} } }
  const [sessions, setSessions] = useLocalStorage('mwf_sessions_v2', {})
  const [calendar, setCalendar] = useLocalStorage('mwf_calendar', {})

  // Clock state — lives here so it survives tab switches
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
  const todaySession = sessions[todayKey] || {}

  // Most recent previous session (not today)
  function getPrevSession() {
    const keys = Object.keys(sessions)
      .filter(k => k !== todayKey)
      .sort()
      .reverse()
    return keys.length > 0 ? sessions[keys[0]] : null
  }

  function handleSessionChange(data) {
    setSessions(s => ({ ...s, [todayKey]: data }))
  }

  function handleSaveToCalendar() {
    const durationMins = clockElapsed > 0 ? Math.round(clockElapsed / 60) : undefined
    setCalendar(c => ({
      ...c,
      [todayKey]: {
        type: 'workout',
        notes: c[todayKey]?.notes || '',
        ...(durationMins ? { duration: durationMins.toString() } : {}),
      }
    }))
    clockReset()
    setActiveView('calendar')
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', minHeight: '100vh' }}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>EOS <span style={{ color: 'var(--accent)' }}>Training</span></div>
        <div style={styles.navTabs}>
          <button
            style={{ ...styles.navTab, ...(activeView === 'workout' ? styles.navActive : {}) }}
            onClick={() => setActiveView('workout')}
          >
            Workout
          </button>
          <button
            style={{ ...styles.navTab, ...(activeView === 'calendar' ? styles.navActive : {}) }}
            onClick={() => setActiveView('calendar')}
          >
            Calendar
          </button>
        </div>
      </header>

      {/* Workout view — always mounted so clock never dies */}
      <div style={{ display: activeView === 'workout' ? 'block' : 'none' }}>
        <WorkoutDay
          todaySession={todaySession}
          prevSession={getPrevSession()}
          onSessionChange={handleSessionChange}
          onSaveToCalendar={handleSaveToCalendar}
          clockRunning={clockRunning}
          clockElapsed={clockElapsed}
          onClockStart={clockStart}
          onClockPause={clockPause}
          onClockReset={clockReset}
        />
      </div>

      {/* Calendar view — always mounted */}
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    background: 'var(--surface)',
    zIndex: 100,
    boxShadow: 'var(--shadow)',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '1.7rem',
    textTransform: 'uppercase',
    letterSpacing: '-0.01em',
    lineHeight: 1,
    color: 'var(--text)',
  },
  navTabs: {
    display: 'flex',
    gap: '4px',
    background: 'var(--surface2)',
    padding: '4px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
  },
  navTab: {
    padding: '8px 16px',
    border: 'none',
    background: 'transparent',
    color: 'var(--muted)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.9rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    borderRadius: '7px',
    transition: 'all 0.15s',
    cursor: 'pointer',
  },
  navActive: {
    background: 'var(--accent)',
    color: '#fff',
    boxShadow: 'var(--shadow)',
  },
}
