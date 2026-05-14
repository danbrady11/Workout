import React, { useState } from 'react'
import { DAYS } from './data.js'
import { useLocalStorage } from './useLocalStorage.js'
import WorkoutDay from './components/WorkoutDay.jsx'
import CalendarView from './components/CalendarView.jsx'

const DAY_KEYS = ['monday', 'wednesday', 'friday']

function getTodayDayKey() {
  const d = new Date().getDay()
  if (d === 1) return 'monday'
  if (d === 3) return 'wednesday'
  if (d === 5) return 'friday'
  return 'monday'
}

function toDateKey(date) {
  // Use local date, not UTC
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function App() {
  const [activeView, setActiveView] = useState('workout')
  const [activeDay, setActiveDay] = useState(getTodayDayKey())

  // sessions: { 'YYYY-MM-DD-monday': { exId: { doneSets, weight, reps } } }
  const [sessions, setSessions] = useLocalStorage('mwf_sessions', {})
  // calendar: { 'YYYY-MM-DD': { type, notes } }
  const [calendar, setCalendar] = useLocalStorage('mwf_calendar', {})

  const todayKey = toDateKey(new Date())
  const sessionKey = `${todayKey}-${activeDay}`

  // Most recent previous session for this day (not today)
  function getPrevSession(dayKey) {
    const suffix = `-${dayKey}`
    const currentKey = `${todayKey}-${dayKey}`
    const keys = Object.keys(sessions)
      .filter(k => k.endsWith(suffix) && k !== currentKey)
      .sort()
      .reverse()
    return keys.length > 0 ? sessions[keys[0]] : null
  }

  function handleSessionChange(dayKey, data) {
    // Autosave on every change
    setSessions(s => ({ ...s, [`${todayKey}-${dayKey}`]: data }))
  }

  function handleSaveToCalendar(dayKey) {
    const existing = calendar[todayKey]
    setCalendar(c => ({
      ...c,
      [todayKey]: {
        type: dayKey,
        notes: existing?.notes || '',
      }
    }))
    setActiveView('calendar')
  }

  const dayData = DAYS[activeDay]
  const todaySession = sessions[sessionKey] || {}
  const prevSession = getPrevSession(activeDay)

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', minHeight: '100vh' }}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>MWF <span style={{ color: 'var(--accent)' }}>Training</span></div>
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

      {/* Workout view */}
      {activeView === 'workout' && (
        <div>
          <div style={styles.dayTabs}>
            {DAY_KEYS.map(dk => {
              const d = DAYS[dk]
              const isActive = activeDay === dk
              const color = dk === 'monday' ? 'var(--push)' : dk === 'wednesday' ? 'var(--pull)' : 'var(--legs)'
              const colorLight = dk === 'monday' ? 'var(--push-light)' : dk === 'wednesday' ? 'var(--pull-light)' : 'var(--legs-light)'
              // count done sets for badge
              const sess = sessions[`${todayKey}-${dk}`] || {}
              const done = DAYS[dk].exercises.reduce((sum, ex) => sum + (sess[ex.id]?.doneSets || 0), 0)
              const total = DAYS[dk].exercises.reduce((sum, ex) => sum + ex.sets, 0)
              return (
                <button
                  key={dk}
                  onClick={() => setActiveDay(dk)}
                  style={{
                    ...styles.dayTab,
                    color: isActive ? color : 'var(--muted)',
                    background: isActive ? colorLight : 'var(--surface)',
                    borderBottom: isActive ? `3px solid ${color}` : '3px solid transparent',
                    boxShadow: isActive ? 'var(--shadow)' : 'none',
                  }}
                >
                  <span style={styles.dayTabLabel}>{d.label}</span>
                  <span style={{ ...styles.dayTabName, color: isActive ? color : 'var(--text)' }}>{d.name}</span>
                  {done > 0 && (
                    <span style={{ ...styles.dayBadge, background: color, color: '#fff' }}>
                      {done}/{total}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <WorkoutDay
            key={activeDay}
            dayData={dayData}
            todaySession={todaySession}
            prevSession={prevSession}
            onSessionChange={(data) => handleSessionChange(activeDay, data)}
            onSaveToCalendar={() => handleSaveToCalendar(activeDay)}
          />
        </div>
      )}

      {/* Calendar view */}
      {activeView === 'calendar' && (
        <CalendarView
          calendarData={calendar}
          sessions={sessions}
          onCalendarChange={setCalendar}
        />
      )}
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
  },
  navActive: {
    background: 'var(--accent)',
    color: '#fff',
    boxShadow: 'var(--shadow)',
  },
  dayTabs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
  },
  dayTab: {
    padding: '0.9rem 0.5rem 0.75rem',
    textAlign: 'center',
    border: 'none',
    borderRight: '1px solid var(--border)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    textTransform: 'uppercase',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    position: 'relative',
  },
  dayTabLabel: {
    fontSize: '0.58rem',
    letterSpacing: '0.15em',
    fontWeight: 500,
    color: 'var(--muted)',
  },
  dayTabName: {
    fontSize: '1.15rem',
    lineHeight: 1,
  },
  dayBadge: {
    fontSize: '0.55rem',
    fontWeight: 700,
    padding: '1px 5px',
    borderRadius: '10px',
    letterSpacing: '0.05em',
    marginTop: '2px',
  },
}
