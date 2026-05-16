import React, { useMemo, useState } from 'react'
import ExerciseRow from './ExerciseRow.jsx'
import FinisherSection from './FinisherSection.jsx'
import RestTimer from './RestTimer.jsx'
import SessionClock from './SessionClock.jsx'
import { WORKOUT } from '../data.js'

const { exercises, finisher } = WORKOUT

export default function WorkoutDay({ todaySession, prevSession, onSessionChange, onSaveToCalendar, clockRunning, clockElapsed, onClockStart, onClockPause, onClockReset }) {

  const [restTrigger, setRestTrigger] = useState(0)

  const { totalSets, doneSets } = useMemo(() => {
    let total = 0, done = 0
    exercises.forEach(ex => {
      total += ex.sets
      done += Math.min(todaySession?.[ex.id]?.doneSets || 0, ex.sets)
    })
    return { totalSets: total, doneSets: done }
  }, [todaySession])

  const finisherRounds = todaySession?._finisher?.completedRounds || 0
  const finisherDone = finisherRounds >= finisher.rounds

  const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0
  const mainDone = pct === 100
  const allDone = mainDone && finisherDone

  function handleExChange(exId, data) {
    onSessionChange({ ...todaySession, [exId]: data })
  }

  function handleFinisherChange(data) {
    onSessionChange({ ...todaySession, _finisher: data })
  }

  function handleSetComplete() {
    setRestTrigger(t => t + 1)
  }

  function handleReset() {
    if (window.confirm('Reset this session? All progress will be cleared.')) {
      onSessionChange({})
      onClockReset()
    }
  }

  return (
    <div style={{ paddingBottom: '2.5rem' }}>
      {/* Hero */}
      <div style={styles.hero}>
        <div>
          <div style={styles.heroSub}>Full Body · EOS Gym</div>
          <div style={styles.heroTitle}>Today's Workout</div>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.statNum}>~60</div>
          <div style={styles.statLbl}>min</div>
        </div>
      </div>

      {/* Progress */}
      <div style={styles.progWrap}>
        <div style={styles.progTop}>
          <span>Main lifts</span>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{pct}% · {doneSets}/{totalSets} sets</span>
        </div>
        <div style={styles.progTrack}>
          <div style={{ ...styles.progFill, width: `${pct}%` }} />
        </div>
        {doneSets > 0 && !allDone && <div style={styles.autoSave}>✓ Auto-saved</div>}
      </div>

      {/* Session clock */}
      <SessionClock
        running={clockRunning}
        elapsed={clockElapsed}
        onStart={onClockStart}
        onPause={onClockPause}
        onReset={onClockReset}
      />

      {/* Rest timer */}
      <div style={{ marginTop: '0.75rem' }}>
        <RestTimer trigger={restTrigger} />
      </div>

      {/* Main exercises */}
      <div style={styles.exSection}>
        <div style={styles.sectionLabel}>Main Lifts</div>
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

      {/* Finisher */}
      {mainDone && (
        <div style={styles.exSection}>
          <div style={{ ...styles.sectionLabel, color: 'var(--legs)' }}>KB Finisher</div>
          <FinisherSection
            finisherData={todaySession?._finisher}
            onChange={handleFinisherChange}
          />
        </div>
      )}

      {/* Complete banner */}
      {allDone && (
        <div style={styles.doneBanner}>
          🎉 Session Complete — Crush it!
        </div>
      )}

      {/* Save */}
      {doneSets > 0 && (
        <button
          style={{
            ...styles.saveBtn,
            background: allDone ? 'var(--accent)' : 'var(--surface)',
            color: allDone ? '#fff' : 'var(--accent)',
            border: '2px solid var(--accent)',
          }}
          onClick={onSaveToCalendar}
        >
          {allDone ? '✓ Save Session to Calendar' : 'Save Progress to Calendar'}
        </button>
      )}

      <button style={styles.resetBtn} onClick={handleReset}>Reset Session</button>

      <div style={styles.tip}>
        <strong style={styles.tipLabel}>Tip</strong>
        {WORKOUT.tip}
      </div>
    </div>
  )
}

const styles = {
  hero: {
    padding: '1.5rem',
    background: 'var(--accent-light)',
    borderBottom: '1px solid var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroSub: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: '4px',
  },
  heroTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    textTransform: 'uppercase',
    lineHeight: 1,
    color: 'var(--text)',
  },
  heroRight: { textAlign: 'right' },
  statNum: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', color: 'var(--accent)', lineHeight: 1 },
  statLbl: { fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' },
  progWrap: {
    padding: '1rem 1.5rem',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
  },
  progTop: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '8px',
  },
  progTrack: { height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' },
  progFill: { height: '100%', background: 'var(--accent)', borderRadius: '3px', transition: 'width 0.3s ease' },
  autoSave: { fontSize: '0.65rem', color: 'var(--accent)', marginTop: '6px', fontWeight: 500 },
  exSection: { padding: '0.75rem 1.25rem 0' },
  sectionLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: '0.6rem',
    paddingBottom: '0.4rem',
    borderBottom: '1px solid var(--border)',
  },
  doneBanner: {
    margin: '0.75rem 1.25rem 0',
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
    cursor: 'pointer',
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
    cursor: 'pointer',
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
    color: 'var(--accent)',
    marginBottom: '4px',
    fontWeight: 700,
  },
}
