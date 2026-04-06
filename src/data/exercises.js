// ─── Exercise Database ────────────────────────────────────────────────────────

const PUSH_A = [
  { id: 'bench_press',      name: 'Barbell Bench Press',      sets: 4, reps: '8–10', rest: '90s', muscles: 'Chest, Triceps, Front Deltoids', tip: 'Keep shoulder blades retracted and feet flat on floor.' },
  { id: 'incline_db_press', name: 'Incline Dumbbell Press',   sets: 3, reps: '10–12', rest: '75s', muscles: 'Upper Chest, Triceps',           tip: 'Set bench at 30–45°. Control the descent.' },
  { id: 'ohp_a',            name: 'Overhead Shoulder Press',  sets: 3, reps: '10–12', rest: '75s', muscles: 'Deltoids, Triceps',              tip: 'Press directly overhead, do not arch lower back excessively.' },
  { id: 'lateral_raise_a',  name: 'Dumbbell Lateral Raise',   sets: 3, reps: '12–15', rest: '60s', muscles: 'Side Deltoids',                  tip: 'Slight bend in elbows. Lead with elbows, not wrists.' },
  { id: 'tricep_pushdown',  name: 'Cable Tricep Pushdown',    sets: 3, reps: '12–15', rest: '60s', muscles: 'Triceps',                         tip: 'Keep elbows tucked at your sides throughout.' },
  { id: 'skull_crusher',    name: 'Skull Crushers (EZ-Bar)',  sets: 3, reps: '12–15', rest: '60s', muscles: 'Triceps (Long Head)',             tip: 'Lower bar to forehead slowly. Full extension at top.' },
]

const PUSH_B = [
  { id: 'db_bench',         name: 'Dumbbell Bench Press',     sets: 4, reps: '8–10', rest: '90s', muscles: 'Chest, Triceps',                  tip: 'Greater range of motion than barbell — feel the stretch.' },
  { id: 'cable_fly',        name: 'Cable Chest Fly',          sets: 3, reps: '12–15', rest: '60s', muscles: 'Chest (inner)',                   tip: 'Slight bend in elbows throughout. Squeeze hard at the top.' },
  { id: 'arnold_press',     name: 'Arnold Press',             sets: 3, reps: '10–12', rest: '75s', muscles: 'All 3 Deltoid Heads',             tip: 'Rotate palms outward as you press up.' },
  { id: 'cable_lateral',    name: 'Cable Lateral Raise',      sets: 3, reps: '15–20', rest: '45s', muscles: 'Side Deltoids',                   tip: 'Keep constant tension with cable version.' },
  { id: 'dips',             name: 'Tricep Dips',              sets: 3, reps: '10–12', rest: '75s', muscles: 'Triceps, Chest',                  tip: 'Lean slightly forward for chest; stay upright for triceps.' },
  { id: 'overhead_ext',     name: 'DB Overhead Tricep Ext.', sets: 3, reps: '12–15', rest: '60s', muscles: 'Triceps (Long Head)',             tip: 'Keep upper arms stationary, only move forearms.' },
]

const PULL_A = [
  { id: 'deadlift',         name: 'Conventional Deadlift',    sets: 4, reps: '5–6',  rest: '120s', muscles: 'Entire Back, Glutes, Hamstrings', tip: 'Hinge at hips, neutral spine. Drive through heels.' },
  { id: 'pulldown',         name: 'Lat Pulldown',             sets: 4, reps: '8–10', rest: '90s', muscles: 'Lats, Biceps',                    tip: 'Pull to upper chest, squeeze lats at bottom.' },
  { id: 'seated_row',       name: 'Seated Cable Row',         sets: 3, reps: '10–12', rest: '75s', muscles: 'Mid Back, Rhomboids',             tip: 'Drive elbows back, pause and squeeze at end of row.' },
  { id: 'face_pull_a',      name: 'Face Pulls',               sets: 3, reps: '15–20', rest: '60s', muscles: 'Rear Delts, Rotator Cuff',        tip: 'Pull to face height, externally rotate at the end.' },
  { id: 'barbell_curl',     name: 'Barbell Bicep Curl',       sets: 3, reps: '10–12', rest: '60s', muscles: 'Biceps',                          tip: 'Don\'t swing. Squeeze at top, slow negative.' },
  { id: 'hammer_curl',      name: 'Hammer Curl',              sets: 3, reps: '12–15', rest: '60s', muscles: 'Biceps, Brachialis',              tip: 'Neutral grip throughout. Alternate arms for control.' },
]

const PULL_B = [
  { id: 'rdl',              name: 'Romanian Deadlift',        sets: 4, reps: '8–10', rest: '90s', muscles: 'Hamstrings, Glutes, Lower Back',  tip: 'Soft knees, push hips back. Feel hamstring stretch.' },
  { id: 'pullup',           name: 'Pull-ups / Assisted',      sets: 4, reps: '6–10', rest: '90s', muscles: 'Lats, Biceps, Core',              tip: 'Full hang at bottom, chin over bar at top.' },
  { id: 'bent_row',         name: 'Bent-over Barbell Row',    sets: 3, reps: '10–12', rest: '75s', muscles: 'Lats, Mid Back, Biceps',          tip: '45° torso. Pull bar to lower chest/navel.' },
  { id: 'face_pull_b',      name: 'Band Pull-Aparts',         sets: 3, reps: '15–20', rest: '45s', muscles: 'Rear Delts, Traps',               tip: 'Keep arms at shoulder height throughout.' },
  { id: 'preacher_curl',    name: 'Preacher Curl / EZ-Bar',   sets: 3, reps: '12–15', rest: '60s', muscles: 'Biceps (Short Head)',             tip: 'Full ROM — don\'t let the weight pull you back.' },
  { id: 'conc_curl',        name: 'Concentration Curl',       sets: 3, reps: '12–15', rest: '60s', muscles: 'Biceps (Peak)',                   tip: 'Elbow braced on inner thigh. Twist pinky up at top.' },
]

const LEGS_A = [
  { id: 'barbell_squat',    name: 'Barbell Back Squat',       sets: 4, reps: '8–10', rest: '120s', muscles: 'Quads, Glutes, Core',             tip: 'Chest up, knees track over toes. Break parallel if able.' },
  { id: 'leg_press',        name: 'Leg Press',                sets: 3, reps: '10–12', rest: '90s', muscles: 'Quads, Glutes, Hamstrings',       tip: 'Feet shoulder-width. Don\'t lock out knees at top.' },
  { id: 'leg_curl',         name: 'Lying Leg Curl',           sets: 3, reps: '12–15', rest: '75s', muscles: 'Hamstrings',                      tip: 'Pause at top contraction. Slow negative phase.' },
  { id: 'calf_raise_a',     name: 'Standing Calf Raise',      sets: 4, reps: '15–20', rest: '60s', muscles: 'Calves (Gastrocnemius)',           tip: 'Full stretch at bottom, strong squeeze at top.' },
  { id: 'plank_a',          name: 'Plank',                    sets: 3, reps: '45 sec', rest: '60s', muscles: 'Core, Shoulders',                tip: 'Straight line head to heels. Squeeze glutes and abs.' },
  { id: 'crunches_a',       name: 'Cable/Bodyweight Crunches',sets: 3, reps: '20',   rest: '45s', muscles: 'Rectus Abdominis',                tip: 'Focus on curling ribcage to pelvis, not just lifting head.' },
]

const LEGS_B = [
  { id: 'goblet_squat',     name: 'Goblet Squat',             sets: 4, reps: '10–12', rest: '90s', muscles: 'Quads, Glutes, Core',             tip: 'Goblet position keeps torso upright — great for depth.' },
  { id: 'db_lunge',         name: 'Dumbbell Walking Lunge',   sets: 3, reps: '10 each', rest: '75s', muscles: 'Quads, Glutes, Hamstrings',     tip: 'Long stride, front shin vertical, back knee nearly touches floor.' },
  { id: 'leg_ext',          name: 'Leg Extension',            sets: 3, reps: '15–20', rest: '60s', muscles: 'Quads (Isolation)',               tip: 'Squeeze at top, control descent fully.' },
  { id: 'calf_raise_b',     name: 'Seated Calf Raise',        sets: 4, reps: '15–20', rest: '60s', muscles: 'Calves (Soleus)',                 tip: 'Works the soleus — bend knees slightly on seated version.' },
  { id: 'leg_raise',        name: 'Hanging Leg Raise',        sets: 3, reps: '12–15', rest: '60s', muscles: 'Lower Abs, Hip Flexors',          tip: 'Slight posterior pelvic tilt. Don\'t swing.' },
  { id: 'russian_twist',    name: 'Russian Twists',           sets: 3, reps: '20 total', rest: '45s', muscles: 'Obliques',                    tip: 'Feet off floor for harder variation. Rotate torso, not arms.' },
]

const REST_DAY = [
  { id: 'rest_walk',        name: 'Light Walk',               sets: 1, reps: '20–30 min', rest: '—', muscles: 'Active Recovery',              tip: 'Moderate pace. Great for circulation and recovery.' },
  { id: 'rest_stretch',     name: 'Full Body Stretch',        sets: 1, reps: '15 min',    rest: '—', muscles: 'Flexibility',                   tip: 'Hold each stretch 30 seconds. Focus on tight areas.' },
  { id: 'rest_foam',        name: 'Foam Rolling',             sets: 1, reps: '10 min',    rest: '—', muscles: 'Recovery',                      tip: 'Slow rolls over quads, hamstrings, upper back.' },
]

// ─── Weekly plan mapping ──────────────────────────────────────────────────────
// dayIndex: 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
export const WEEKLY_SCHEDULE = {
  0: { type: 'rest',  label: 'Rest / Recovery',          exercises: REST_DAY },
  1: { type: 'push',  label: 'Push Day A — Chest & Arms',exercises: PUSH_A },
  2: { type: 'pull',  label: 'Pull Day A — Back & Biceps',exercises: PULL_A },
  3: { type: 'legs',  label: 'Legs & Core A',            exercises: LEGS_A },
  4: { type: 'push',  label: 'Push Day B — Chest & Arms',exercises: PUSH_B },
  5: { type: 'pull',  label: 'Pull Day B — Back & Biceps',exercises: PULL_B },
  6: { type: 'legs',  label: 'Legs & Core B',            exercises: LEGS_B },
}

export const DAY_TYPE_COLOR = {
  push: 'text-orange-400',
  pull: 'text-blue-400',
  legs: 'text-purple-400',
  rest: 'text-gray-400',
}

export const DAY_TYPE_BG = {
  push: 'bg-orange-400/10 border-orange-400/20',
  pull: 'bg-blue-400/10 border-blue-400/20',
  legs: 'bg-purple-400/10 border-purple-400/20',
  rest: 'bg-gray-700/20 border-gray-600/20',
}

export function getTodayWorkout(dayIndex, workOnSunday) {
  const plan = WEEKLY_SCHEDULE[dayIndex]
  if (dayIndex === 0 && !workOnSunday) {
    return { ...WEEKLY_SCHEDULE[0], label: 'Rest Day — You earned it!' }
  }
  if (dayIndex === 0 && workOnSunday) {
    return { ...WEEKLY_SCHEDULE[6], label: 'Bonus Legs & Core B (Sunday)' }
  }
  return plan
}

export function getWeeklyOverview(workOnSunday) {
  return [0,1,2,3,4,5,6].map(i => {
    const plan = WEEKLY_SCHEDULE[i]
    if (i === 0 && !workOnSunday) return { dayIndex: i, day: 'Sun', label: 'Rest', type: 'rest', exercises: REST_DAY }
    if (i === 0 && workOnSunday)  return { dayIndex: i, day: 'Sun', label: WEEKLY_SCHEDULE[6].label, type: WEEKLY_SCHEDULE[6].type, exercises: LEGS_B }
    return { dayIndex: i, day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i], label: plan.label, type: plan.type, exercises: plan.exercises }
  })
}
