export const DAYS = {
  monday: {
    label: 'Monday',
    name: 'Push',
    focus: 'Chest · Shoulders · Triceps',
    color: 'var(--push)',
    tip: 'Rest 90–120 sec between sets. If you hit 12 reps easily on every set, bump the weight next session.',
    exercises: [
      { id: 'chest-press',    name: 'Machine Chest Press',   tag: 'machine', sets: 4, reps: '8–12',  note: 'Adjust seat so handles align with mid-chest' },
      { id: 'incline-press',  name: 'Incline Machine Press', tag: 'machine', sets: 3, reps: '10–12', note: 'Upper chest + front delt — keep elbows slightly tucked' },
      { id: 'lateral-raise',  name: 'Machine Lateral Raise', tag: 'machine', sets: 3, reps: '12–15', note: 'Lead with elbows, not wrists' },
      { id: 'tricep-push',    name: 'Cable Tricep Pushdown', tag: 'cable',   sets: 3, reps: '12–15', note: 'Rope or bar — keep elbows pinned to sides' },
    ],
  },
  wednesday: {
    label: 'Wednesday',
    name: 'Pull',
    focus: 'Back · Biceps · Rear Delts',
    color: 'var(--pull)',
    tip: 'Think "pull your elbows to your hips" on rows and pulldowns — activates lats far more than pulling with your hands.',
    exercises: [
      { id: 'cable-row',      name: 'Seated Cable Row',      tag: 'cable',   sets: 4, reps: '8–12',  note: 'Pull to lower chest, pause 1 sec at the peak' },
      { id: 'lat-pulldown',   name: 'Lat Pulldown',          tag: 'machine', sets: 3, reps: '10–12', note: 'Wide grip — pull bar to upper chest, lean back slightly' },
      { id: 'rear-delt',      name: 'Machine Rear Delt Fly', tag: 'machine', sets: 3, reps: '12–15', note: 'Go light, feel the squeeze — shoulder health exercise' },
      { id: 'bicep-curl',     name: 'Machine Bicep Curl',    tag: 'machine', sets: 2, reps: '12–15', note: 'Finisher — biceps are pre-fatigued from rows and pulldowns' },
    ],
  },
  friday: {
    label: 'Friday',
    name: 'Legs',
    focus: 'Quads · Hamstrings · Glutes',
    color: 'var(--legs)',
    tip: 'On the RDL, stop when you feel a strong hamstring stretch — usually just below the knee. Rounding the back defeats the purpose.',
    exercises: [
      { id: 'leg-press',      name: 'Leg Press',             tag: 'machine', sets: 4, reps: '8–12',  note: 'Feet shoulder-width mid-plate — don\'t lock out knees at top' },
      { id: 'rdl',            name: 'Romanian Deadlift',     tag: 'barbell', sets: 3, reps: '10–12', note: 'Hinge at hips, soft knee, bar stays close to legs' },
      { id: 'leg-curl',       name: 'Leg Curl',              tag: 'machine', sets: 3, reps: '10–15', note: 'Lying or seated — full ROM, control the eccentric' },
      { id: 'hip-abductor',   name: 'Hip Abductor Machine',  tag: 'machine', sets: 3, reps: '12–15', note: 'Keep back flat against the pad throughout' },
    ],
  },
}

export const TAG_STYLES = {
  machine: { bg: '#0a1a2a', color: 'var(--pull)',  border: '#0a2a4a', label: 'Machine' },
  cable:   { bg: '#1a0a2a', color: '#c084fc',      border: '#3a1a5a', label: 'Cable'   },
  barbell: { bg: '#2a1a00', color: 'var(--legs)',  border: '#4a3000', label: 'Barbell' },
}

export const ACTIVITY_TYPES = [
  { id: 'gym-class', label: 'Gym Class', color: 'var(--gym-class)' },
  { id: 'hiking',    label: 'Hiking',    color: 'var(--hike)'      },
  { id: 'other',     label: 'Other',     color: 'var(--other)'     },
]

export const WORKOUT_TYPES = [
  { id: 'monday',    label: 'Push',  color: 'var(--push)' },
  { id: 'wednesday', label: 'Pull',  color: 'var(--pull)' },
  { id: 'friday',    label: 'Legs',  color: 'var(--legs)' },
]
