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
  return date.toISOString().slice(0, 10)
}

export default function App() {
  const [activeView, setActiveView] = useState('workout')
  const [activeDay, setActiveDay] = useState(getTodayDayKey())

  // sessions: { 'YYYY-MM-DD-monday': { 'chest-press': { doneSets, weight }, ... } }
  const [sessions, setSessions] = useLocalStorage('mwf_sessions', {})
  // calendar: { 'YYYY-MM-DD': { type, notes } }
  const [calendar, setCalendar] = useLocalStorage('mwf_calendar', {})

  const todayKey = toDateKey(new Date())
  const sessionKey = `${todayKey}-${activeDay}`

  // Find the most recent previous session for this day (for prev weights)
  function getPrevSession(dayKey) {
    const prefix = `-${dayKey}`
    const keys = Object.keys(sessions)
      .filter(k => k.endsWith(prefix) && k !== sessionKey)
      .sort()
      .reverse()
    return keys.length > 0 ? sessions[keys[0]] : null
  }

  function handleSessionChange(dayKey, data) {
    const key = `${todayKey}-${dayKey}`
    setSessions(s => ({ ...s, [key]: data }))
  }

  function handleFinish(dayKey) {
    // Save to calendar as a workout entry
    const existing = calendar[todayKey]
    if (!existing) {
      setCalendar(c => ({ ...c, [todayKey]: { type: dayKey, notes: '' } }))
    }
    setActiveView('calendar')
  }

  const dayData = DAYS[activeDay]
  const todaySession = sessions[sessionKey] || {}
  const prevSession = getPrevSession(activeDay)

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>MWF <span style={{ color: 'var(--accent)' }}>Training</span></div>
        <div style={styles.navTabs}>
          <button
            style={{ ...styles.navTab, ...(activeView === 'workout' ? styles.navTabActive : {}) }}
            onClick={() => setActiveView('workout')}
          >
            Workout
          </button>
          <button
            style={{ ...styles.navTab, ...(activeView === 'calendar' ? styles.navTabActive : {}) }}
            onClick={() => setActiveView('calendar')}
          >
            Calendar
          </button>
        </div>
      </header>

      {/* Workout view */}
      {activeView === 'workout' && (
        <div>
          {/* Day tabs */}
          <div style={styles.dayTabs}>
            {DAY_KEYS.map(dk => {
              const d = DAYS[dk]
              const isActive = activeDay === dk
              const color = dk === 'monday' ? 'var(--push)' : dk === 'wednesday' ? 'var(--pull)' : 'var(--legs)'
              return (
                <button
                  key={dk}
                  onClick={() => setActiveDay(dk)}
                  style={{
                    ...styles.dayTab,
                    color: isActive ? color : 'var(--muted)',
                    background: isActive ? 'var(--bg)' : 'var(--surface)',
                    borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
                  }}
                >
                  <span style={styles.dayTabLabel}>{d.label}</span>
                  <span style={styles.dayTabName}>{d.name}</span>
                </button>
              )
            })}
          </div>

          <WorkoutDay
            key={activeDay}
            dayKey={activeDay}
            dayData={dayData}
            todaySession={todaySession}
            prevSession={prevSession}
            onSessionChange={(data) => handleSessionChange(activeDay, data)}
            onFinish={() => handleFinish(activeDay)}
          />
        </div>
      )}

      {/* Calendar view */}
      {activeView === 'calendar' && (
        <CalendarView
          calendarData={calendar}
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
    padding: '1.25rem 1.5rem 1rem',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    background: 'var(--bg)',
    zIndex: 100,
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '1.7rem',
    textTransform: 'uppercase',
    letterSpacing: '-0.01em',
    lineHeight: 1,
  },
  navTabs: {
    display: 'flex',
    gap: '4px',
    background: 'var(--surface)',
    padding: '4px',
    borderRadius: '7px',
    border: '1px solid var(--border)',
  },
  navTab: {
    padding: '6px 14px',
    border: 'none',
    background: 'transparent',
    color: 'var(--muted)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    borderRadius: '4px',
    transition: 'all 0.15s',
  },
  navTabActive: {
    background: 'var(--accent)',
    color: '#0e0e0e',
  },
  dayTabs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    borderBottom: '1px solid var(--border)',
  },
  dayTab: {
    padding: '0.9rem 1rem',
    textAlign: 'center',
    border: 'none',
    borderRight: '1px solid var(--border)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  dayTabLabel: {
    fontSize: '0.58rem',
    letterSpacing: '0.18em',
    fontWeight: 500,
  },
  dayTabName: {
    fontSize: '1.1rem',
  },
}
