import React from 'react'
import { WORKOUT } from '../data.js'

const { finisher } = WORKOUT

export default function FinisherSection({ finisherData, onChange }) {
  const completedRounds = finisherData?.completedRounds || 0
  const kbWeight = finisherData?.kbWeight || ''

  function toggleRound(i) {
    const next = i < completedRounds ? i : i + 1
    onChange({ ...finisherData, completedRounds: next })
  }

  function setKbWeight(val) {
    onChange({ ...finisherData, kbWeight: val })
  }

  const allDone = completedRounds >= finisher.rounds

  return (
    <div style={styles.wrap}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>🔥 {finisher.label}</div>
          <div style={styles.sub}>{finisher.rounds} rounds · {finisher.note}</div>
        </div>
        <div style={styles.kbWrap}>
          <div style={styles.kbLabel}>KB Weight</div>
          <input
            type="number"
            inputMode="decimal"
            placeholder="lbs"
            value={kbWeight}
            onChange={e => setKbWeight(e.target.value)}
            style={styles.kbInput}
          />
        </div>
      </div>

      {/* Movements list */}
      <div style={styles.movements}>
        {finisher.movements.map((m, i) => (
          <div key={m.id} style={styles.movement}>
            <div style={styles.movNum}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={styles.movName}>
                {m.name}
                {m.side && <span style={styles.side}>{m.side}</span>}
                <span style={styles.reps}>× {m.reps}</span>
              </div>
              <div style={styles.movNote}>{m.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Round tracker */}
      <div style={styles.roundsRow}>
        <div style={styles.roundsLabel}>Rounds complete</div>
        <div style={styles.roundDots}>
          {Array.from({ length: finisher.rounds }).map((_, i) => (
            <button
              key={i}
              onClick={() => toggleRound(i)}
              style={{
                ...styles.roundDot,
                background: i < completedRounds ? 'var(--legs)' : 'var(--surface)',
                borderColor: i < completedRounds ? 'var(--legs)' : 'var(--border2)',
                color: i < completedRounds ? '#fff' : 'var(--muted)',
              }}
            >
              {i + 1}
            </button>
          ))}
          <span style={styles.roundCount}>{completedRounds}/{finisher.rounds}</span>
        </div>
        {allDone && <div style={styles.donePill}>✓ Finisher Done</div>}
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    margin: '0 1.25rem 0.75rem',
    background: 'var(--legs-light)',
    border: '1.5px solid var(--legs)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1rem',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    gap: '12px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '1.15rem',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: 'var(--legs)',
  },
  sub: { fontSize: '0.72rem', color: 'var(--muted)', marginTop: '3px' },
  kbWrap: { textAlign: 'center', flexShrink: 0 },
  kbLabel: { fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' },
  kbInput: {
    width: '70px', background: 'var(--surface)', border: '1.5px solid var(--border2)',
    borderRadius: '8px', color: 'var(--text)', fontFamily: 'var(--font-display)',
    fontWeight: 700, fontSize: '1.2rem', textAlign: 'center', padding: '6px 4px', outline: 'none',
  },
  movements: { padding: '0.5rem 1rem' },
  movement: { display: 'flex', gap: '10px', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)', alignItems: 'flex-start' },
  movNum: {
    width: '22px', height: '22px', borderRadius: '50%',
    background: 'var(--legs)', color: '#fff',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px',
  },
  movName: {
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem',
    textTransform: 'uppercase', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
  },
  side: {
    fontSize: '0.65rem', fontWeight: 700, background: 'var(--legs)', color: '#fff',
    borderRadius: '4px', padding: '1px 6px', letterSpacing: '0.08em',
  },
  reps: { fontSize: '0.8rem', color: 'var(--legs)', fontWeight: 700 },
  movNote: { fontSize: '0.72rem', color: 'var(--muted)', marginTop: '2px' },
  roundsRow: {
    display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
    padding: '0.75rem 1rem', borderTop: '1px solid rgba(0,0,0,0.08)',
  },
  roundsLabel: { fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 },
  roundDots: { display: 'flex', gap: '6px', alignItems: 'center' },
  roundDot: {
    width: '38px', height: '38px', borderRadius: '8px', border: '1.5px solid',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s', cursor: 'pointer',
  },
  roundCount: { fontSize: '0.75rem', color: 'var(--muted)', marginLeft: '4px' },
  donePill: {
    fontSize: '0.75rem', fontWeight: 700, color: 'var(--legs)',
    background: 'var(--surface)', border: '1px solid var(--legs)',
    borderRadius: '20px', padding: '3px 10px',
  },
}
