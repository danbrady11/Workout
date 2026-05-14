import React from 'react'
import { TAG_META } from '../data.js'

export default function ExerciseRow({ exercise, sessionData, prevWeight, onChange }) {
  const tag = TAG_META[exercise.tag]

  // weight: auto-prefill with prevWeight + 2.5 if no current value set
  const suggestedWeight = prevWeight ? (parseFloat(prevWeight) + 2.5).toString() : ''
  const weight = sessionData?.weight ?? suggestedWeight
  const reps   = sessionData?.reps   ?? exercise.repsDefault.toString()
  const doneSets = sessionData?.doneSets || 0

  function update(patch) {
    onChange({ doneSets, weight, reps, ...sessionData, ...patch })
  }

  function toggleDot(i) {
    const next = i < doneSets ? i : i + 1
    update({ doneSets: next })
  }

  const isAutoWeight = !sessionData?.weight && !!suggestedWeight

  return (
    <div style={styles.card}>
      {/* Exercise name + meta */}
      <div style={styles.topRow}>
        <div>
          <div style={styles.name}>{exercise.name}</div>
          <div style={styles.note}>{exercise.note}</div>
        </div>
        <span style={{ ...styles.tag, color: tag.color, background: tag.bg }}>
          {tag.label}
        </span>
      </div>

      {/* Inputs row */}
      <div style={styles.inputsRow}>
        {/* Sets tracker */}
        <div style={styles.inputGroup}>
          <div style={styles.inputLabel}>Sets</div>
          <div style={styles.dots}>
            {Array.from({ length: exercise.sets }).map((_, i) => (
              <button
                key={i}
                onClick={() => toggleDot(i)}
                style={{
                  ...styles.dot,
                  background: i < doneSets ? 'var(--accent)' : 'var(--surface)',
                  borderColor: i < doneSets ? 'var(--accent)' : 'var(--border2)',
                  color: i < doneSets ? '#fff' : 'var(--muted)',
                }}
                aria-label={`Set ${i+1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div style={styles.setsSub}>{doneSets}/{exercise.sets} done</div>
        </div>

        {/* Reps */}
        <div style={styles.inputGroup}>
          <div style={styles.inputLabel}>Reps <span style={styles.rangeHint}>({exercise.repsRange})</span></div>
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={e => update({ reps: e.target.value })}
            style={styles.numInput}
          />
        </div>

        {/* Weight */}
        <div style={styles.inputGroup}>
          <div style={styles.inputLabel}>Weight (lbs)</div>
          <input
            type="number"
            inputMode="decimal"
            step="2.5"
            value={weight}
            onChange={e => update({ weight: e.target.value })}
            placeholder="0"
            style={{
              ...styles.numInput,
              borderColor: isAutoWeight ? 'var(--accent)' : 'var(--border2)',
              background: isAutoWeight ? 'var(--accent-light)' : 'var(--surface)',
            }}
          />
          <div style={styles.prevHint}>
            {prevWeight
              ? <span>Last: <strong>{prevWeight}</strong> → <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{suggestedWeight}</span></span>
              : <span style={{ color: 'var(--muted2)' }}>No history yet</span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1rem',
    marginBottom: '0.75rem',
    boxShadow: 'var(--shadow)',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '1rem',
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.15rem',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: 'var(--text)',
    lineHeight: 1.2,
  },
  note: {
    fontSize: '0.78rem',
    color: 'var(--muted)',
    marginTop: '3px',
    lineHeight: 1.4,
  },
  tag: {
    flexShrink: 0,
    fontSize: '0.62rem',
    letterSpacing: '0.08em',
    padding: '3px 8px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  inputsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '0.75rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  inputLabel: {
    fontSize: '0.62rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    fontWeight: 500,
  },
  rangeHint: {
    fontWeight: 400,
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: '0.6rem',
  },
  dots: {
    display: 'flex',
    gap: '5px',
    flexWrap: 'wrap',
  },
  dot: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    border: '1.5px solid',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
    flexShrink: 0,
  },
  setsSub: {
    fontSize: '0.62rem',
    color: 'var(--muted)',
  },
  numInput: {
    width: '100%',
    background: 'var(--surface)',
    border: '1.5px solid var(--border2)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.4rem',
    textAlign: 'center',
    padding: '8px 4px',
    outline: 'none',
    transition: 'border-color 0.15s, background 0.15s',
  },
  prevHint: {
    fontSize: '0.65rem',
    color: 'var(--muted)',
    lineHeight: 1.4,
  },
}
