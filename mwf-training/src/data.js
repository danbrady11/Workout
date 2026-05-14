export const DAYS = {
  monday: {
    label: 'Monday',
    name: 'Push',
    focus: 'Chest · Shoulders · Triceps',
    color: 'var(--push)',
    colorLight: 'var(--push-light)',
    tip: 'Rest 90–120 sec between sets. If you hit the top of the rep range easily on every set, bump the weight by 2.5 lbs next session.',
    exercises: [
      { id: 'chest-press',   name: 'Machine Chest Press',   tag: 'machine', sets: 4, repsDefault: 10, repsRange: '8–12',  note: 'Adjust seat so handles align with mid-chest' },
      { id: 'incline-press', name: 'Incline Machine Press', tag: 'machine', sets: 3, repsDefault: 11, repsRange: '10–12', note: 'Upper chest + front delt — keep elbows slightly tucked' },
      { id: 'lateral-raise', name: 'Machine Lateral Raise', tag: 'machine', sets: 3, repsDefault: 12, repsRange: '12–15', note: 'Lead with elbows, not wrists' },
      { id: 'tricep-push',   name: 'Cable Tricep Pushdown', tag: 'cable',   sets: 3, repsDefault: 12, repsRange: '12–15', note: 'Rope or bar — keep elbows pinned to sides' },
    ],
  },
  wednesday: {
    label: 'Wednesday',
    name: 'Pull',
    focus: 'Back · Biceps · Rear Delts',
    color: 'var(--pull)',
    colorLight: 'var(--pull-light)',
    tip: 'Think "pull your elbows to your hips" on rows and pulldowns — activates lats far more than pulling with your hands.',
    exercises: [
      { id: 'cable-row',    name: 'Seated Cable Row',      tag: 'cable',   sets: 4, repsDefault: 10, repsRange: '8–12',  note: 'Pull to lower chest, pause 1 sec at peak' },
      { id: 'lat-pulldown', name: 'Lat Pulldown',          tag: 'machine', sets: 3, repsDefault: 11, repsRange: '10–12', note: 'Wide grip — pull bar to upper chest, lean back slightly' },
      { id: 'rear-delt',   name: 'Machine Rear Delt Fly', tag: 'machine', sets: 3, repsDefault: 12, repsRange: '12–15', note: 'Go light, feel the squeeze' },
      { id: 'bicep-curl',  name: 'Machine Bicep Curl',    tag: 'machine', sets: 2, repsDefault: 12, repsRange: '12–15', note: 'Biceps are pre-fatigued from rows and pulldowns' },
    ],
  },
  friday: {
    label: 'Friday',
    name: 'Legs',
    focus: 'Quads · Hamstrings · Glutes',
    color: 'var(--legs)',
    colorLight: 'var(--legs-light)',
    tip: 'On the RDL, stop when you feel a strong hamstring stretch — usually just below the knee. Rounding the back defeats the purpose.',
    exercises: [
      { id: 'leg-press',    name: 'Leg Press',            tag: 'machine', sets: 4, repsDefault: 10, repsRange: '8–12',  note: "Feet shoulder-width mid-plate — don't lock out knees at top" },
      { id: 'rdl',          name: 'Romanian Deadlift',    tag: 'barbell', sets: 3, repsDefault: 11, repsRange: '10–12', note: 'Hinge at hips, soft knee, bar stays close to legs' },
      { id: 'leg-curl',     name: 'Leg Curl',             tag: 'machine', sets: 3, repsDefault: 12, repsRange: '10–15', note: 'Lying or seated — full ROM, control the eccentric' },
      { id: 'hip-abductor', name: 'Hip Abductor Machine', tag: 'machine', sets: 3, repsDefault: 12, repsRange: '12–15', note: 'Keep back flat against the pad throughout' },
    ],
  },
}

export const TAG_META = {
  machine: { label: 'Machine', color: 'var(--pull)',  bg: 'var(--pull-light)'  },
  cable:   { label: 'Cable',   color: '#6200ea',      bg: 'var(--gym-class-light)' },
  barbell: { label: 'Barbell', color: 'var(--legs)',  bg: 'var(--legs-light)'  },
}

export const ACTIVITY_TYPES = [
  { id: 'gym-class', label: 'Gym Class', color: 'var(--gym-class)', bg: 'var(--gym-class-light)' },
  { id: 'hiking',    label: 'Hiking',    color: 'var(--hike)',      bg: 'var(--hike-light)'      },
  { id: 'other',     label: 'Other',     color: 'var(--other)',     bg: 'var(--other-light)'     },
]

export const WORKOUT_TYPES = [
  { id: 'monday',    label: 'Push',  color: 'var(--push)', bg: 'var(--push-light)' },
  { id: 'wednesday', label: 'Pull',  color: 'var(--pull)', bg: 'var(--pull-light)' },
  { id: 'friday',    label: 'Legs',  color: 'var(--legs)', bg: 'var(--legs-light)' },
]
