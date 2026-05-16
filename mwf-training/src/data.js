// Single full-body workout
export const WORKOUT = {
  name: 'Full Body',
  color: 'var(--accent)',
  colorLight: 'var(--accent-light)',
  tip: 'Rest 90–120 sec between main sets. If you hit the top of the rep range on all sets, add 2.5–5 lbs next session.',
  exercises: [
    { id: 'leg-press',      name: 'Leg Press',              tag: 'machine', sets: 3, repsDefault: 10, repsRange: '8–12',  note: "Feet shoulder-width mid-plate — don't lock out knees at top" },
    { id: 'chest-press',    name: 'Machine Chest Press',    tag: 'machine', sets: 3, repsDefault: 10, repsRange: '8–12',  note: 'Adjust seat so handles align with mid-chest' },
    { id: 'cable-row',      name: 'Cable Row',              tag: 'cable',   sets: 3, repsDefault: 10, repsRange: '8–12',  note: 'Pull to lower chest, pause 1 sec at peak' },
    { id: 'rdl',            name: 'Romanian Deadlift',      tag: 'barbell', sets: 3, repsDefault: 10, repsRange: '8–12',  note: 'Hinge at hips, soft knee — stop at hamstring stretch' },
    { id: 'shoulder-press', name: 'Machine Shoulder Press', tag: 'machine', sets: 3, repsDefault: 10, repsRange: '8–12',  note: 'Controlled — don\'t shrug at the top' },
    { id: 'lat-pulldown',   name: 'Lat Pulldown',           tag: 'machine', sets: 3, repsDefault: 10, repsRange: '8–12',  note: 'Wide grip — pull to upper chest, slight lean back' },
  ],
  finisher: {
    label: 'KB Finisher',
    rounds: 3,
    note: 'Minimal rest between movements, ~60 sec between rounds',
    movements: [
      { id: 'kb-sdl-l',   name: 'KB Suitcase Deadlift',  side: 'Left',  reps: 10, note: 'Tall spine, KB outside left foot — drive through heel' },
      { id: 'kb-swing-1', name: 'KB Swing',               side: null,    reps: 15, note: 'Hip hinge — power from glutes, not arms' },
      { id: 'kb-sdl-r',   name: 'KB Suitcase Deadlift',  side: 'Right', reps: 10, note: 'Same cue, KB outside right foot' },
      { id: 'kb-swing-2', name: 'KB Swing',               side: null,    reps: 15, note: 'Stay explosive through all 15' },
    ],
  },
}

export const TAG_META = {
  machine: { label: 'Machine', color: 'var(--pull)',  bg: 'var(--pull-light)'  },
  cable:   { label: 'Cable',   color: '#6200ea',      bg: 'var(--gym-class-light)' },
  barbell: { label: 'Barbell', color: 'var(--legs)',  bg: 'var(--legs-light)'  },
  kb:      { label: 'Kettlebell', color: 'var(--hike)', bg: 'var(--hike-light)' },
}

export const ACTIVITY_TYPES = [
  { id: 'gym-class', label: 'Gym Class', color: 'var(--gym-class)', bg: 'var(--gym-class-light)' },
  { id: 'hiking',    label: 'Hiking',    color: 'var(--hike)',      bg: 'var(--hike-light)'      },
  { id: 'other',     label: 'Other',     color: 'var(--other)',     bg: 'var(--other-light)'     },
]

// Single workout type for calendar
export const WORKOUT_TYPE = { id: 'workout', label: 'Workout', color: 'var(--accent)', bg: 'var(--accent-light)' }

export const ALL_CALENDAR_TYPES = [
  WORKOUT_TYPE,
  ...ACTIVITY_TYPES,
]
