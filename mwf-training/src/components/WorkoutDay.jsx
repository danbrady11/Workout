import React, { useMemo } from 'react'
import ExerciseRow from './ExerciseRow.jsx'

export default function WorkoutDay({ dayKey, dayData, todaySession, prevSession, onSessionChange, onFinish }) {
  const { name, focus, color, tip, exercises } = dayData

  // total dots possible and done
  const { totalDots, doneDots } = useMemo(() => {
    let total = 0, done = 0
    exercises.forEach(ex => {
      total += ex.sets
      done += Math.min(todaySession?.[ex.id]?.doneSets || 0, ex.sets)
    })
    return { totalDots: total, doneDots: done }
  }, [exercises, todaySession])

  const pct = totalDots > 0 ? Math.round((doneDots / totalDots) * 100) : 0
  const complete = pct === 100

  function handleExChange(exId, data) {
    onSessionChange({ ...todaySession, [exId]: data })
  }

  function handleReset() {
    onSessionChange({})
  }

  function handleFinish() {
    if (complete) onFinish()
  }

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <div>
          <div style={{ ...styles.focus, color }}>{focus}</div>
          <div style={styles.title}>{name} Day</div>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.statNum}>~45</div>
          <div style={styles.statLbl}>minutes</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.progWrap}>
        <div style={styles.progTop}>
          <span>Session progress</span>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{pct}%</span>
        </div>
        <div style={styles.progTrack}>
          <div style={{ ...styles.progFill, width: `${pct}%` }} />
        </div>
      </div>

      {/* Column headers */}
      <div style={styles.exSection}>
        <div style={styles.colHead}>
          <span>Exercise</span>
          <span style={{ textAlign: 'center' }}>Sets / Reps</span>
          <span style={{ textAlign: 'center' }}>Weight</span>
        </div>

        {exercises.map(ex => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            sessionData={todaySession?.[ex.id]}
            prevWeight={prevSession?.[ex.id]?.weight || null}
            onChange={(data) => handleExChange(ex.id, data)}
          />
        ))}
      </div>

      {/* Complete banner */}
      {complete && (
        <div style={styles.doneBanner}>
          ✓ {name} Day Complete — Great work!
        </div>
      )}

      {/* Finish / Save button */}
      {complete && (
        <button style={styles.finishBtn} onClick={handleFinish}>
          Save to Calendar
        </button>
      )}

      {/* Reset */}
      <button style={styles.resetBtn} onClick={handleReset}>
        Reset Session
      </button>

      {/* Tip */}
      <div style={styles.tip}>
        <strong style={styles.tipLabel}>Pro Tip</strong>
        {tip}
      </div>
    </div>
  )
}

const styles = {
  hero: {
    padding: '1.5rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  focus: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.65rem',
    fontWeight: 500,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
    textTransform: 'uppercase',
    lineHeight: 1,
  },
  heroRight: { textAlign: 'right' },
  statNum: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '2rem',
    color: 'var(--accent)',
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
    fontSize: '0.65rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: '6px',
  },
  progTrack: {
    height: '2px',
    background: 'var(--border)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progFill: {
    height: '100%',
    background: 'var(--accent)',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  exSection: {
    padding: '0 1.5rem',
  },
  colHead: {
    display: 'grid',
    gridTemplateColumns: '1fr 90px 88px',
    gap: '10px',
    padding: '0.75rem 0 0.5rem',
    fontSize: '0.6rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--muted2)',
    borderBottom: '1px solid var(--border)',
  },
  doneBanner: {
    margin: '1rem 1.5rem 0',
    padding: '1rem 1.25rem',
    background: 'var(--accent)',
    color: '#0e0e0e',
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '1.2rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textAlign: 'center',
    borderRadius: '4px',
  },
  finishBtn: {
    display: 'block',
    margin: '0.6rem 1.5rem 0',
    padding: '0.65rem',
    width: 'calc(100% - 3rem)',
    background: 'var(--surface2)',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    borderRadius: '4px',
    transition: 'all 0.15s',
  },
  resetBtn: {
    display: 'block',
    margin: '0.6rem 1.5rem 0',
    padding: '0.65rem',
    width: 'calc(100% - 3rem)',
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--muted)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.8rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    borderRadius: '4px',
    transition: 'all 0.15s',
  },
  tip: {
    margin: '1.25rem 1.5rem 2.5rem',
    padding: '0.9rem 1rem',
    borderLeft: '3px solid var(--accent)',
    background: 'var(--surface)',
    borderRadius: '0 4px 4px 0',
    fontSize: '0.8rem',
    color: 'var(--muted)',
    lineHeight: 1.6,
  },
  tipLabel: {
    display: 'block',
    fontSize: '0.58rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: '4px',
    fontWeight: 600,
  },
}
