import React, { useState } from 'react'
import { ACTIVITY_TYPES, WORKOUT_TYPES } from '../data.js'

const ALL_TYPES = [
  ...WORKOUT_TYPES.map(t => ({ ...t, category: 'workout' })),
  ...ACTIVITY_TYPES.map(t => ({ ...t, category: 'activity' })),
]

function typeInfo(typeId) {
  return ALL_TYPES.find(t => t.id === typeId) || { label: typeId, color: 'var(--muted)' }
}

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function toDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function CalendarView({ calendarData, onCalendarChange }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState(null) // { type, notes }

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function openDay(day) {
    if (!day) return
    const key = toDateKey(viewYear, viewMonth, day)
    setSelectedDate(key)
    const existing = calendarData[key]
    setEditEntry(existing ? { type: existing.type, notes: existing.notes || '' } : { type: '', notes: '' })
    setModalOpen(true)
  }

  function saveEntry() {
    if (!editEntry.type) return
    onCalendarChange({ ...calendarData, [selectedDate]: editEntry })
    setModalOpen(false)
  }

  function deleteEntry() {
    const next = { ...calendarData }
    delete next[selectedDate]
    onCalendarChange(next)
    setModalOpen(false)
  }

  function formatSelectedDate(key) {
    if (!key) return ''
    const [y, m, d] = key.split('-')
    return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`
  }

  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  return (
    <div>
      {/* Month nav */}
      <div style={styles.calHeader}>
        <div style={styles.monthLabel}>{MONTHS[viewMonth]} {viewYear}</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button style={styles.navBtn} onClick={prevMonth}>‹</button>
          <button style={styles.navBtn} onClick={nextMonth}>›</button>
        </div>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {ALL_TYPES.map(t => (
          <div key={t.id} style={styles.legItem}>
            <div style={{ ...styles.legDot, background: t.color }} />
            <span>{t.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={styles.gridWrap}>
        {/* DOW headers */}
        <div style={styles.dowRow}>
          {DOW.map(d => <div key={d} style={styles.dowCell}>{d}</div>)}
        </div>

        {/* Day cells */}
        <div style={styles.dayGrid}>
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} style={styles.emptyCell} />
            const key = toDateKey(viewYear, viewMonth, day)
            const entry = calendarData[key]
            const isToday = key === todayKey
            const info = entry ? typeInfo(entry.type) : null

            return (
              <div
                key={key}
                onClick={() => openDay(day)}
                style={{
                  ...styles.dayCell,
                  background: isToday ? 'var(--surface2)' : 'var(--surface)',
                  border: isToday ? '1px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                <div style={{
                  ...styles.dayNum,
                  color: isToday ? 'var(--accent)' : 'var(--text)',
                  fontWeight: isToday ? 600 : 300,
                }}>
                  {day}
                </div>
                {info && (
                  <div style={{ ...styles.entryDot, background: info.color }} title={info.label} />
                )}
                {entry?.notes && (
                  <div style={styles.noteDot} title={entry.notes}>·</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent activity list */}
      <div style={styles.recentSection}>
        <div style={styles.recentLabel}>Recent Activity</div>
        {Object.entries(calendarData)
          .sort(([a], [b]) => b.localeCompare(a))
          .slice(0, 8)
          .map(([key, entry]) => {
            const info = typeInfo(entry.type)
            const [y, m, d] = key.split('-')
            const dateStr = `${MONTHS[parseInt(m)-1].slice(0,3)} ${parseInt(d)}`
            return (
              <div key={key} style={styles.recentRow} onClick={() => { setSelectedDate(key); setEditEntry({ type: entry.type, notes: entry.notes || '' }); setModalOpen(true) }}>
                <div style={{ ...styles.recentDot, background: info.color }} />
                <div style={styles.recentDate}>{dateStr}</div>
                <div style={{ ...styles.recentType, color: info.color }}>{info.label}</div>
                {entry.notes && <div style={styles.recentNote}>{entry.notes}</div>}
              </div>
            )
          })}
        {Object.keys(calendarData).length === 0 && (
          <div style={styles.emptyMsg}>No activity logged yet — tap a day to add one.</div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={styles.overlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalDate}>{formatSelectedDate(selectedDate)}</div>
              <button style={styles.closeBtn} onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.fieldLabel}>Activity Type</div>
              <div style={styles.typeGrid}>
                {ALL_TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setEditEntry(e => ({ ...e, type: t.id }))}
                    style={{
                      ...styles.typeBtn,
                      border: editEntry.type === t.id ? `1.5px solid ${t.color}` : '1px solid var(--border)',
                      color: editEntry.type === t.id ? t.color : 'var(--muted)',
                      background: editEntry.type === t.id ? 'var(--surface2)' : 'var(--surface)',
                    }}
                  >
                    <div style={{ ...styles.typeBtnDot, background: t.color }} />
                    {t.label}
                  </button>
                ))}
              </div>

              <div style={{ ...styles.fieldLabel, marginTop: '1.25rem' }}>Notes</div>
              <textarea
                value={editEntry.notes}
                onChange={e => setEditEntry(en => ({ ...en, notes: e.target.value }))}
                placeholder="Weight used, distance, how it felt..."
                style={styles.textarea}
                rows={3}
              />

              <div style={styles.modalActions}>
                {calendarData[selectedDate] && (
                  <button style={styles.deleteBtn} onClick={deleteEntry}>Delete</button>
                )}
                <button
                  style={{ ...styles.saveBtn, opacity: editEntry.type ? 1 : 0.4 }}
                  onClick={saveEntry}
                  disabled={!editEntry.type}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  calHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border)',
  },
  monthLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  navBtn: {
    width: '34px', height: '34px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    borderRadius: '4px',
    fontSize: '1.2rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
    lineHeight: 1,
  },
  legend: {
    display: 'flex',
    gap: '12px',
    padding: '0.75rem 1.5rem',
    borderBottom: '1px solid var(--border)',
    flexWrap: 'wrap',
  },
  legItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.65rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },
  legDot: {
    width: '7px', height: '7px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  gridWrap: {
    padding: '1rem 1.5rem',
  },
  dowRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    marginBottom: '4px',
  },
  dowCell: {
    textAlign: 'center',
    fontSize: '0.6rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    padding: '4px 0',
  },
  dayGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  emptyCell: {
    height: '54px',
  },
  dayCell: {
    height: '54px',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    transition: 'border-color 0.15s',
    position: 'relative',
  },
  dayNum: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.95rem',
    lineHeight: 1,
  },
  entryDot: {
    width: '7px', height: '7px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  noteDot: {
    fontSize: '0.7rem',
    color: 'var(--muted)',
    lineHeight: 1,
  },
  recentSection: {
    padding: '0 1.5rem 2rem',
    borderTop: '1px solid var(--border)',
    marginTop: '0.5rem',
  },
  recentLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    padding: '1rem 0 0.5rem',
  },
  recentRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    padding: '0.6rem 0',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
  },
  recentDot: {
    width: '7px', height: '7px',
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '2px',
  },
  recentDate: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--muted)',
    minWidth: '50px',
  },
  recentType: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    minWidth: '80px',
  },
  recentNote: {
    fontSize: '0.75rem',
    color: 'var(--muted)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
  },
  emptyMsg: {
    fontSize: '0.8rem',
    color: 'var(--muted)',
    padding: '1rem 0',
    fontStyle: 'italic',
  },
  // Modal
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modal: {
    background: 'var(--surface)',
    border: '1px solid var(--border2)',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '420px',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.1rem 1.25rem',
    borderBottom: '1px solid var(--border)',
  },
  modalDate: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.2rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--muted)',
    fontSize: '1rem',
    padding: '4px',
    lineHeight: 1,
  },
  modalBody: {
    padding: '1.25rem',
  },
  fieldLabel: {
    fontSize: '0.6rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: '0.6rem',
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px',
  },
  typeBtn: {
    padding: '8px 6px',
    borderRadius: '4px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.15s',
  },
  typeBtnDot: {
    width: '8px', height: '8px',
    borderRadius: '50%',
  },
  textarea: {
    width: '100%',
    background: 'var(--surface2)',
    border: '1px solid var(--border2)',
    borderRadius: '4px',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.85rem',
    fontWeight: 300,
    padding: '0.6rem 0.75rem',
    outline: 'none',
    resize: 'vertical',
    lineHeight: 1.5,
  },
  modalActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '1rem',
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    padding: '0.6rem 1rem',
    background: 'transparent',
    border: '1px solid var(--other)',
    color: 'var(--other)',
    borderRadius: '4px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  saveBtn: {
    padding: '0.6rem 1.5rem',
    background: 'var(--accent)',
    border: 'none',
    color: '#0e0e0e',
    borderRadius: '4px',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    transition: 'opacity 0.15s',
  },
}
