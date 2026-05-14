import React, { useMemo, useState } from 'react'
import ExerciseRow from './ExerciseRow.jsx'
import RestTimer from './RestTimer.jsx'
import SessionClock from './SessionClock.jsx'

export default function WorkoutDay({ dayData, todaySession, prevSession, onSessionChange, onSaveToCalendar, clockRunning, clockElapsed, onClockStart, onClockPause, onClockReset }) {
  const { name, focus, color, colorLight, tip, exercises } = dayData
  const [restTrigger, setRestTrigger] = useState(0) // increments on each set complete

  const { totalSets, doneSets } = useMemo(() => {
    let total = 0, done = 0
    exercises.forEach(ex => {
      total += ex.sets
      done += Math.min(todaySession?.[ex.id]?.doneSets || 0, ex.sets)
    })
    return { totalSets: total, doneSets: done }
  }, [exercises, todaySession])

  const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0
  const complete = pct === 100

  function handleExChange(exId, data) {
    onSessionChange({ ...todaySession, [exId]: data })
  }

  function handleSetComplete() {
    setRestTrigger(t => t + 1)
  }

  function handleReset() {
    if (window.confirm('Reset this session? All progress will be cleared.')) {
      onSessionChange({})
    }
  }

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Hero */}
      <div style={{ ...styles.hero, background: colorLight, borderColor: color + '33' }}>
        <div>
          <div style={{ ...styles.focus, color }}>{focus}</div>
          <div style={styles.title}>{name} Day</div>
        </div>
        <div style={styles.heroRight}>
          <div style={{ ...styles.statNum, color }}>~45</div>
          <div style={styles.statLbl}>min</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.progWrap}>
        <div style={styles.progTop}>
          <span>Session progress</span>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{pct}% · {doneSets}/{totalSets} sets</span>
        </div>
        <div style={styles.progTrack}>
          <div style={{ ...styles.progFill, width: `${pct}%` }} />
        </div>
        {pct > 0 && pct < 100 && (
          <div style={styles.autoSaveNote}>✓ Progress auto-saved</div>
        )}
      </div>

      {/* Session clock */}
      <SessionClock
        running={clockRunning}
        elapsed={clockElapsed}
        onStart={onClockStart}
        onPause={onClockPause}
        onReset={onClockReset}
      />

      {/* Rest timer — only shows when active */}
      <div style={{ marginTop: '0.75rem' }}>
        <RestTimer trigger={restTrigger} />
      </div>

      {/* Exercises */}
      <div style={styles.exSection}>
        {exercises.map(ex => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            sessionData={todaySession?.[ex.id]}
            prevWeight={prevSession?.[ex.id]?.weight || null}
            onChange={(data) => handleExChange(ex.id, data)}
            onSetComplete={handleSetComplete}
          />
        ))}
      </div>

      {/* Complete banner */}
      {complete && (
        <div style={styles.doneBanner}>
          🎉 {name} Day Complete — Great work!
        </div>
      )}

      {doneSets > 0 && (
        <button
          style={{
            ...styles.saveBtn,
            background: complete ? 'var(--accent)' : 'var(--surface)',
            color: complete ? '#fff' : 'var(--accent)',
            border: '2px solid var(--accent)',
          }}
          onClick={onSaveToCalendar}
        >
          {complete ? '✓ Save Session to Calendar' : 'Save Progress to Calendar'}
        </button>
      )}

      <button style={styles.resetBtn} onClick={handleReset}>
        Reset Session
      </button>

      <div style={styles.tip}>
        <strong style={{ ...styles.tipLabel, color }}>Pro Tip</strong>
        {tip}
      </div>
    </div>
  )
}

const styles = {
  hero: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  focus: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    textTransform: 'uppercase',
    lineHeight: 1,
    color: 'var(--text)',
  },
  heroRight: { textAlign: 'right' },
  statNum: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1,
  },
  statLbl: {
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },
  progWrap: {
    padding: '1rem 1.5rem',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
  },
  progTop: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
    color: 'var(--muted)',
    marginBottom: '8px',
  },
  progTrack: {
    height: '6px',
    background: 'var(--border)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progFill: {
    height: '100%',
    background: 'var(--accent)',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  autoSaveNote: {
    fontSize: '0.65rem',
    color: 'var(--accent)',
    marginTop: '6px',
    fontWeight: 500,
  },
  exSection: {
    padding: '0.75rem 1.25rem 0',
  },
  doneBanner: {
    margin: '0.5rem 1.25rem 0',
    padding: '1rem',
    background: 'var(--accent-light)',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.2rem',
    textTransform: 'uppercase',
    textAlign: 'center',
    borderRadius: 'var(--radius)',
  },
  saveBtn: {
    display: 'block',
    margin: '0.75rem 1.25rem 0',
    padding: '1rem',
    width: 'calc(100% - 2.5rem)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    borderRadius: 'var(--radius)',
    transition: 'all 0.2s',
    boxShadow: 'var(--shadow)',
  },
  resetBtn: {
    display: 'block',
    margin: '0.5rem 1.25rem 0',
    padding: '0.85rem',
    width: 'calc(100% - 2.5rem)',
    background: 'transparent',
    border: '1.5px solid var(--border2)',
    color: 'var(--muted)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.9rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    borderRadius: 'var(--radius)',
  },
  tip: {
    margin: '1rem 1.25rem 0',
    padding: '0.9rem 1rem',
    borderLeft: '3px solid var(--accent)',
    background: 'var(--accent-light)',
    borderRadius: '0 8px 8px 0',
    fontSize: '0.82rem',
    color: 'var(--text)',
    lineHeight: 1.6,
  },
  tipLabel: {
    display: 'block',
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    marginBottom: '4px',
    fontWeight: 700,
  },
}
