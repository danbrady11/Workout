import React, { useState } from 'react'
import { ACTIVITY_TYPES, WORKOUT_TYPES, DAYS } from '../data.js'

const ALL_TYPES = [
  ...WORKOUT_TYPES.map(t => ({ ...t, category: 'workout' })),
  ...ACTIVITY_TYPES.map(t => ({ ...t, category: 'activity' })),
]

function typeInfo(typeId) {
  return ALL_TYPES.find(t => t.id === typeId) || { label: typeId, color: 'var(--muted)', bg: 'var(--surface2)' }
}

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function toDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatDate(key) {
  if (!key) return ''
  const [y, m, d] = key.split('-')
  return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`
}

// Render a full workout session detail
function SessionDetail({ dayKey, sessionData }) {
  const day = DAYS[dayKey]
  if (!day || !sessionData) return null
  return (
    <div style={sd.wrap}>
      {day.exercises.map(ex => {
        const data = sessionData[ex.id]
        if (!data) return null
        const done = data.doneSets || 0
        const weight = data.weight || '—'
        const reps = data.reps || ex.repsDefault
        return (
          <div key={ex.id} style={sd.row}>
            <div style={sd.exName}>{ex.name}</div>
            <div style={sd.exStats}>
              <span style={sd.badge}>{done}×{reps} reps</span>
              <span style={sd.badge}>{weight} lbs</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const sd = {
  wrap: { marginTop: '0.75rem' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' },
  exName: { fontSize: '0.8rem', fontWeight: 500, color: 'var(--text)' },
  exStats: { display: 'flex', gap: '6px', flexShrink: 0 },
  badge: { fontSize: '0.7rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px', color: 'var(--muted)', fontWeight: 500 },
}

export default function CalendarView({ calendarData, sessions, onCalendarChange }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState(null)

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
    onCalendarChange({ ...calendarData, [selectedDate]: { ...calendarData[selectedDate], ...editEntry } })
    setModalOpen(false)
  }

  function deleteEntry() {
    const next = { ...calendarData }
    delete next[selectedDate]
    onCalendarChange(next)
    setModalOpen(false)
  }

  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  // Get session for a date+dayType combo
  function getSession(dateKey, dayType) {
    return sessions?.[`${dateKey}-${dayType}`] || null
  }

  const selectedEntry = selectedDate ? calendarData[selectedDate] : null
  const selectedSession = selectedEntry?.type && ['monday','wednesday','friday'].includes(selectedEntry.type)
    ? getSession(selectedDate, selectedEntry.type)
    : null

  return (
    <div>
      {/* Month nav */}
      <div style={styles.calHeader}>
        <div style={styles.monthLabel}>{MONTHS[viewMonth]} {viewYear}</div>
        <div style={{ display: 'flex', gap: '8px' }}>
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
        <div style={styles.dowRow}>
          {DOW.map(d => <div key={d} style={styles.dowCell}>{d}</div>)}
        </div>
        <div style={styles.dayGrid}>
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />
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
                  background: isToday ? 'var(--accent-light)' : 'var(--surface)',
                  border: isToday ? '2px solid var(--accent)' : '1px solid var(--border)',
                  boxShadow: isToday ? '0 0 0 0px' : 'var(--shadow)',
                }}
              >
                <div style={{
                  ...styles.dayNum,
                  color: isToday ? 'var(--accent)' : 'var(--text)',
                  fontWeight: isToday ? 700 : 400,
                }}>
                  {day}
                </div>
                {info && (
                  <div style={{ ...styles.entryPill, background: info.bg, color: info.color }}>
                    {info.label.slice(0, 3)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent activity list */}
      <div style={styles.recentSection}>
        <div style={styles.sectionLabel}>Recent Activity</div>
        {Object.entries(calendarData)
          .sort(([a], [b]) => b.localeCompare(a))
          .slice(0, 10)
          .map(([key, entry]) => {
            const info = typeInfo(entry.type)
            const [, m, d] = key.split('-')
            const dateStr = `${MONTHS[parseInt(m)-1].slice(0,3)} ${parseInt(d)}`
            const sess = ['monday','wednesday','friday'].includes(entry.type) ? getSession(key, entry.type) : null
            return (
              <div key={key} style={styles.recentRow} onClick={() => { setSelectedDate(key); setEditEntry({ type: entry.type, notes: entry.notes || '' }); setModalOpen(true) }}>
                <div style={{ ...styles.recentAccent, background: info.color }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.recentTop}>
                    <span style={styles.recentDate}>{dateStr}</span>
                    <span style={{ ...styles.recentType, color: info.color, background: info.bg }}>{info.label}</span>
                  </div>
                  {entry.notes && <div style={styles.recentNote}>{entry.notes}</div>}
                  {sess && (
                    <div style={styles.recentSets}>
                      {DAYS[entry.type]?.exercises.map(ex => {
                        const d = sess[ex.id]
                        if (!d?.doneSets) return null
                        return (
                          <span key={ex.id} style={styles.miniSet}>
                            {ex.name.split(' ').slice(-1)[0]}: {d.doneSets}×{d.reps||ex.repsDefault} @ {d.weight||'?'}lb
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        {Object.keys(calendarData).length === 0 && (
          <div style={styles.emptyMsg}>No activity logged yet — tap a day on the calendar to add one.</div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && editEntry && (
        <div style={styles.overlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalDate}>{formatDate(selectedDate)}</div>
              <button style={styles.closeBtn} onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div style={styles.modalBody}>
              {/* If it's a saved workout, show session detail */}
              {selectedSession && selectedEntry && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={styles.fieldLabel}>Workout Log</div>
                  <div style={{ ...styles.sessionCard, borderColor: typeInfo(selectedEntry.type).color }}>
                    <SessionDetail dayKey={selectedEntry.type} sessionData={selectedSession} />
                  </div>
                </div>
              )}

              <div style={styles.fieldLabel}>Activity Type</div>
              <div style={styles.typeGrid}>
                {ALL_TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setEditEntry(e => ({ ...e, type: t.id }))}
                    style={{
                      ...styles.typeBtn,
                      border: editEntry.type === t.id ? `2px solid ${t.color}` : '1.5px solid var(--border)',
                      color: editEntry.type === t.id ? t.color : 'var(--muted)',
                      background: editEntry.type === t.id ? t.bg : 'var(--surface)',
                      fontWeight: editEntry.type === t.id ? 700 : 500,
                    }}
                  >
                    <div style={{ ...styles.typeDot, background: t.color }} />
                    {t.label}
                  </button>
                ))}
              </div>

              <div style={{ ...styles.fieldLabel, marginTop: '1.25rem' }}>Notes</div>
              <textarea
                value={editEntry.notes}
                onChange={e => setEditEntry(en => ({ ...en, notes: e.target.value }))}
                placeholder="How it went, distance, PRs, how you felt..."
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
    background: 'var(--surface)',
  },
  monthLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  navBtn: {
    width: '40px', height: '40px',
    background: 'var(--surface)',
    border: '1.5px solid var(--border2)',
    color: 'var(--text)',
    borderRadius: '8px',
    fontSize: '1.3rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: 'var(--shadow)',
  },
  legend: {
    display: 'flex',
    gap: '10px',
    padding: '0.6rem 1.5rem',
    borderBottom: '1px solid var(--border)',
    flexWrap: 'wrap',
    background: 'var(--surface)',
  },
  legItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.62rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  },
  legDot: {
    width: '7px', height: '7px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  gridWrap: {
    padding: '1rem 1.25rem',
    background: 'var(--bg)',
  },
  dowRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    marginBottom: '4px',
  },
  dowCell: {
    textAlign: 'center',
    fontSize: '0.62rem',
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
  dayCell: {
    minHeight: '58px',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: '5px 4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    transition: 'transform 0.1s',
  },
  dayNum: {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    lineHeight: 1,
  },
  entryPill: {
    fontSize: '0.55rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    padding: '1px 4px',
    borderRadius: '3px',
  },
  recentSection: {
    padding: '0 1.25rem 2rem',
    background: 'var(--bg)',
  },
  sectionLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.7rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    padding: '1rem 0 0.5rem',
    borderBottom: '1px solid var(--border)',
    marginBottom: '0.25rem',
  },
  recentRow: {
    display: 'flex',
    gap: '10px',
    padding: '0.75rem 0',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
    alignItems: 'flex-start',
  },
  recentAccent: {
    width: '3px',
    borderRadius: '2px',
    flexShrink: 0,
    alignSelf: 'stretch',
    minHeight: '20px',
  },
  recentTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '3px',
  },
  recentDate: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: 'var(--muted)',
  },
  recentType: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '2px 7px',
    borderRadius: '4px',
  },
  recentNote: {
    fontSize: '0.78rem',
    color: 'var(--muted)',
    marginTop: '2px',
  },
  recentSets: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '5px',
  },
  miniSet: {
    fontSize: '0.65rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '2px 6px',
    color: 'var(--muted)',
  },
  emptyMsg: {
    fontSize: '0.85rem',
    color: 'var(--muted)',
    padding: '1.5rem 0',
    textAlign: 'center',
  },
  // Modal
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modal: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '440px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-md)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.1rem 1.25rem',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    background: 'var(--surface)',
    zIndex: 1,
  },
  modalDate: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.2rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  closeBtn: {
    width: '32px', height: '32px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    color: 'var(--muted)',
    borderRadius: '6px',
    fontSize: '0.9rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modalBody: {
    padding: '1.25rem',
  },
  sessionCard: {
    background: 'var(--surface2)',
    border: '1px solid',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
  },
  fieldLabel: {
    fontSize: '0.62rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: '0.6rem',
    fontWeight: 600,
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px',
  },
  typeBtn: {
    padding: '10px 6px',
    borderRadius: '8px',
    fontFamily: 'var(--font-display)',
    fontSize: '0.78rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.15s',
  },
  typeDot: {
    width: '8px', height: '8px',
    borderRadius: '50%',
  },
  textarea: {
    width: '100%',
    background: 'var(--surface2)',
    border: '1.5px solid var(--border2)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    padding: '0.65rem 0.75rem',
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
    padding: '0.7rem 1.1rem',
    background: 'var(--other-light)',
    border: '1.5px solid var(--other)',
    color: 'var(--other)',
    borderRadius: '8px',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  saveBtn: {
    padding: '0.7rem 1.5rem',
    background: 'var(--accent)',
    border: 'none',
    color: '#fff',
    borderRadius: '8px',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.9rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    transition: 'opacity 0.15s',
  },
}
