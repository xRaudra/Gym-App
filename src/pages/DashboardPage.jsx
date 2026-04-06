import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ChevronRight, CheckCircle2, Circle, Flame, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTracking } from '../contexts/TrackingContext'
import { calcNutrition, bmiCategory, pct, getDayName, getTodayDayIndex } from '../utils/calculations'
import { getTodayWorkout, DAY_TYPE_COLOR, DAY_TYPE_BG } from '../data/exercises'
import { generateDietPlan } from '../data/foods'

// ─── Circular progress ring ───────────────────────────────────────────────────
function Ring({ pct: p, label, consumed, target, unit, color, size = 120 }) {
  const r = (size - 16) / 2
  const circ = 2 * Math.PI * r
  const fill = Math.min(p, 100)
  const offset = circ - (fill / 100) * circ
  return (
    <div className="flex flex-col items-center">
      <div style={{ width: size, height: size }} className="relative">
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#2A2A2A" strokeWidth={10} fill="none" />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            stroke={color}
            strokeWidth={10}
            fill="none"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-bold text-lg leading-tight">{consumed}</span>
          <span className="text-gray-400 text-[10px]">/{target}{unit}</span>
        </div>
      </div>
      <span className="text-gray-400 text-xs mt-1.5 font-medium">{label}</span>
      <span className={`text-xs font-semibold mt-0.5 ${p >= 100 ? 'text-brand' : 'text-gray-500'}`}>{fill}%</span>
    </div>
  )
}

function MissedBanner({ message }) {
  return (
    <div className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 flex items-center gap-3">
      <Bell size={16} className="text-accent flex-shrink-0" />
      <span className="text-sm text-accent">{message}</span>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { today } = useTracking()
  const profile = user?.profile || {}

  const nutrition = useMemo(() => calcNutrition({
    weight: +profile.weight,
    height: +profile.height,
    age: +profile.age,
    gender: profile.gender,
    goal: profile.goal,
  }), [profile])

  const todayDayIdx = getTodayDayIndex()
  const workout = useMemo(() => getTodayWorkout(todayDayIdx, profile.workOnSunday), [todayDayIdx, profile.workOnSunday])

  const meals = useMemo(() => {
    if (!nutrition) return []
    return generateDietPlan(profile.dietaryPreference, nutrition.calories, nutrition.protein)
  }, [profile.dietaryPreference, nutrition])

  const bmi = nutrition ? nutrition.bmi : null
  const bmiCat = bmi ? bmiCategory(bmi) : null

  const proteinPct  = today ? pct(today.proteinConsumed || 0, nutrition?.protein || 1) : 0
  const caloriesPct = today ? pct(today.caloriesConsumed || 0, nutrition?.calories || 1) : 0

  const exCompleted = today?.exercisesCompleted?.length || 0
  const totalEx = workout.exercises?.length || 0
  const mealsCompleted = today?.mealsCompleted?.length || 0
  const hour = new Date().getHours()

  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = (user?.name || user?.username || '').split(' ')[0]

  // Notifications
  const notifs = []
  if (hour >= 14 && mealsCompleted === 0) notifs.push("You haven't logged any meals today. Stay on track!")
  if (hour >= 20 && exCompleted === 0 && workout.type !== 'rest') notifs.push('Workout not completed today. Every session counts!')

  return (
    <div className="page">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm">{getDayName()}, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
          <h1 className="text-2xl font-bold text-white">{greeting}, {firstName}! 💪</h1>
        </div>
        {bmi && (
          <div className="text-right">
            <p className="text-gray-400 text-xs">BMI</p>
            <p className="text-white font-bold text-xl">{bmi}</p>
            <p className={`text-xs font-medium ${bmiCat?.color}`}>{bmiCat?.label}</p>
          </div>
        )}
      </div>

      {/* Notifications */}
      {notifs.map((n, i) => <MissedBanner key={i} message={n} />)}
      {notifs.length > 0 && <div className="mb-4" />}

      {/* Macro rings */}
      <div className="card mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-4">Today's Nutrition</p>
        <div className="flex justify-around">
          <Ring
            pct={proteinPct}
            label="Protein"
            consumed={today?.proteinConsumed || 0}
            target={nutrition?.protein || '—'}
            unit="g"
            color="#22C55E"
          />
          <Ring
            pct={caloriesPct}
            label="Calories"
            consumed={today?.caloriesConsumed || 0}
            target={nutrition?.calories || '—'}
            unit=""
            color="#F97316"
          />
        </div>
      </div>

      {/* Today's workout preview */}
      <Link to="/workout" className="block mb-4">
        <div className={`card border ${DAY_TYPE_BG[workout.type]}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">Today's Workout</p>
              <p className={`font-bold text-base mt-0.5 ${DAY_TYPE_COLOR[workout.type]}`}>{workout.label}</p>
            </div>
            <ChevronRight size={20} className="text-gray-500" />
          </div>
          {/* progress bar */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">{exCompleted}/{totalEx} exercises</span>
            {exCompleted === totalEx && totalEx > 0 && (
              <span className="text-brand text-xs font-semibold flex items-center gap-1"><CheckCircle2 size={12} />Done</span>
            )}
          </div>
          <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${workout.type === 'rest' ? 'bg-gray-500' : DAY_TYPE_COLOR[workout.type].replace('text-', 'bg-')}`}
              style={{ width: totalEx ? `${(exCompleted / totalEx) * 100}%` : '0%' }}
            />
          </div>
          {/* First 3 exercises preview */}
          <div className="mt-3 space-y-1.5">
            {(workout.exercises || []).slice(0, 3).map(ex => (
              <div key={ex.id} className="flex items-center gap-2 text-sm">
                {(today?.exercisesCompleted || []).includes(ex.id)
                  ? <CheckCircle2 size={14} className="text-brand flex-shrink-0" />
                  : <Circle size={14} className="text-gray-600 flex-shrink-0" />
                }
                <span className="text-gray-300 truncate">{ex.name}</span>
                <span className="text-gray-500 text-xs ml-auto flex-shrink-0">{ex.sets}×{ex.reps}</span>
              </div>
            ))}
            {totalEx > 3 && <p className="text-gray-500 text-xs pl-5">+{totalEx - 3} more…</p>}
          </div>
        </div>
      </Link>

      {/* Today's diet preview */}
      <Link to="/diet" className="block mb-4">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">Today's Meals</p>
              <p className="font-bold text-base mt-0.5 text-white">{mealsCompleted}/{meals.length} meals logged</p>
            </div>
            <ChevronRight size={20} className="text-gray-500" />
          </div>
          <div className="flex gap-1.5 mb-3">
            {meals.map(m => (
              <div
                key={m.id}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${(today?.mealsCompleted || []).includes(m.id) ? 'bg-brand' : 'bg-[#2A2A2A]'}`}
              />
            ))}
          </div>
          <div className="space-y-1.5">
            {meals.slice(0, 3).map(m => (
              <div key={m.id} className="flex items-center gap-2 text-sm">
                {(today?.mealsCompleted || []).includes(m.id)
                  ? <CheckCircle2 size={14} className="text-brand flex-shrink-0" />
                  : <Circle size={14} className="text-gray-600 flex-shrink-0" />
                }
                <span className="text-gray-300 truncate">{m.label}</span>
                <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                  <span className="text-orange-400 text-xs flex items-center gap-0.5"><Flame size={10} />{m.calories}</span>
                  <span className="text-brand text-xs flex items-center gap-0.5"><Zap size={10} />{m.protein}g</span>
                </div>
              </div>
            ))}
            {meals.length > 3 && <p className="text-gray-500 text-xs pl-5">+{meals.length - 3} more meals…</p>}
          </div>
        </div>
      </Link>

      {/* Calorie & Protein quick stats */}
      {nutrition && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="card text-center">
            <p className="text-gray-400 text-xs mb-1">Daily Calories</p>
            <p className="text-white text-2xl font-bold">{nutrition.calories}</p>
            <p className="text-gray-500 text-xs">kcal target</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-400 text-xs mb-1">Daily Protein</p>
            <p className="text-brand text-2xl font-bold">{nutrition.protein}g</p>
            <p className="text-gray-500 text-xs">protein target</p>
          </div>
        </div>
      )}
    </div>
  )
}
