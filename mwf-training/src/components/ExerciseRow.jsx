import React from 'react'
import { TAG_STYLES } from '../data.js'

export default function ExerciseRow({ exercise, sessionData, prevWeight, onChange }) {
  const tag = TAG_STYLES[exercise.tag]
  const doneSets = sessionData?.doneSets || 0
  const weight = sessionData?.weight || ''

  function toggleDot(i) {
    const current = doneSets
    // clicking a done dot reverts to that index, clicking undone dot advances
    const next = i < current ? i : i + 1
    onChange({ doneSets: next, weight })
  }

  function handleWeight(e) {
    onChange({ doneSets, weight: e.target.value })
  }

  return (
    <div style={styles.row}>
      {/* Left: name + meta */}
      <div>
        <div style={styles.name}>{exercise.name}</div>
        <div style={styles.note}>{exercise.note}</div>
        <span style={{ ...styles.tag, background: tag.bg, color: tag.color, border: `1px solid ${tag.border}` }}>
          {tag.label}
        </span>
      </div>

      {/* Middle: sets/reps + dots */}
      <div style={styles.setsCol}>
        <div style={styles.setsNum}>{exercise.sets}</div>
        <div style={styles.setsReps}>{exercise.reps}</div>
        <div style={styles.dots}>
          {Array.from({ length: exercise.sets }).map((_, i) => (
            <div
              key={i}
              onClick={() => toggleDot(i)}
              style={{
                ...styles.dot,
                background: i < doneSets ? 'var(--accent)' : 'transparent',
                borderColor: i < doneSets ? 'var(--accent)' : 'var(--border2)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Right: weight input + prev */}
      <div style={styles.weightCol}>
        <div style={styles.weightWrap}>
          <input
            type="number"
            inputMode="decimal"
            placeholder="lbs"
            value={weight}
            onChange={handleWeight}
            style={styles.weightInput}
          />
        </div>
        <div style={styles.prevLabel}>
          {prevWeight ? (
            <>prev: <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{prevWeight} lbs</span></>
          ) : (
            <span style={{ color: 'var(--muted2)' }}>no history</span>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 90px 88px',
    gap: '10px',
    padding: '1rem 0',
    borderBottom: '1px solid var(--border)',
    alignItems: 'start',
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '1.05rem',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  note: {
    fontSize: '0.72rem',
    color: 'var(--muted)',
    marginTop: '3px',
    lineHeight: 1.4,
  },
  tag: {
    display: 'inline-block',
    fontSize: '0.58rem',
    letterSpacing: '0.08em',
    padding: '2px 5px',
    borderRadius: '2px',
    marginTop: '5px',
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  setsCol: {
    textAlign: 'center',
  },
  setsNum: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.3rem',
    lineHeight: 1,
  },
  setsReps: {
    fontSize: '0.65rem',
    color: 'var(--muted)',
    letterSpacing: '0.05em',
    marginTop: '2px',
  },
  dots: {
    display: 'flex',
    gap: '4px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  dot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '1.5px solid',
    cursor: 'pointer',
    transition: 'all 0.15s',
    flexShrink: 0,
  },
  weightCol: {
    textAlign: 'center',
  },
  weightWrap: {
    display: 'flex',
    justifyContent: 'center',
  },
  weightInput: {
    width: '76px',
    background: 'var(--surface2)',
    border: '1px solid var(--border2)',
    borderRadius: '4px',
    color: 'var(--text)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.2rem',
    textAlign: 'center',
    padding: '5px 4px',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  prevLabel: {
    fontSize: '0.62rem',
    color: 'var(--muted)',
    marginTop: '5px',
    whiteSpace: 'nowrap',
  },
}
