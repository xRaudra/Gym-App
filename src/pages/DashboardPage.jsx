import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Calendar, ChevronRight, Flame, Zap, Dumbbell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTracking } from '../contexts/TrackingContext'
import { calcNutrition, pct, getTodayDayIndex } from '../utils/calculations'
import { getTodayWorkout, DAY_TYPE_COLOR } from '../data/exercises'
import { generateDietPlan } from '../data/foods'

// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const CATEGORIES = [
  { label: 'Strength',    emoji: '🏋️',  color: '#ffec64', bg: 'rgba(255,236,100,0.08)', border: 'rgba(255,236,100,0.18)' },
  { label: 'Cardio',      emoji: '🏃',  color: '#ffec64', bg: 'rgba(255,236,100,0.08)', border: 'rgba(255,236,100,0.18)' },
  { label: 'Flexibility', emoji: '🧘',  color: '#67DE6D', bg: 'rgba(103,222,109,0.08)', border: 'rgba(103,222,109,0.18)' },
  { label: 'Endurance',   emoji: '⚡',  color: '#ffec64', bg: 'rgba(255,236,100,0.08)', border: 'rgba(255,236,100,0.18)' },
]

// ─── Week strip ───────────────────────────────────────────────────────────────
function WeekStrip() {
  const today = new Date()
  const dow   = today.getDay()
  return (
    <div className="flex justify-between items-center mb-6 px-0.5">
      {DAYS.map((day, i) => {
        const d = new Date(today)
        d.setDate(today.getDate() - dow + i)
        const isToday = i === dow
        return (
          <div key={day} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-semibold" style={{ color: isToday ? '#ffec64' : '#555' }}>
              {day}
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={isToday
                ? { background: '#ffec64', color: '#080808' }
                : { color: '#666' }
              }
            >
              {d.getDate()}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user }   = useAuth()
  const { today }  = useTracking()
  const profile    = user?.profile || {}

  const nutrition = useMemo(() => calcNutrition({
    weight: +profile.weight, height: +profile.height,
    age: +profile.age, gender: profile.gender, goal: profile.goal,
  }), [profile])

  const todayDayIdx = getTodayDayIndex()
  const workout = useMemo(
    () => getTodayWorkout(todayDayIdx, profile.workOnSunday),
    [todayDayIdx, profile.workOnSunday]
  )

  const meals = useMemo(() => {
    if (!nutrition) return []
    return generateDietPlan(profile.dietaryPreference, nutrition.calories, nutrition.protein)
  }, [profile.dietaryPreference, nutrition])

  const caloriesPct = today ? pct(today.caloriesConsumed || 0, nutrition?.calories || 1) : 0
  const exCompleted    = today?.exercisesCompleted?.length || 0
  const totalEx        = workout.exercises?.length || 0
  const mealsCompleted = today?.mealsCompleted?.length || 0

  const hour      = new Date().getHours()
  const firstName = (user?.name || user?.username || '').split(' ')[0]
  const now       = new Date()
  const dateStr   = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`

  const notif =
    (hour >= 14 && mealsCompleted === 0)
      ? "You haven't logged any meals today. Stay on track!"
      : (hour >= 20 && exCompleted === 0 && workout.type !== 'rest')
      ? 'Workout not yet completed. Every session counts!'
      : null

  return (
    <div className="page">

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-base font-black flex-shrink-0"
            style={{ background: '#ffec64', color: '#080808' }}
          >
            {firstName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-xs text-gray-500">Hello 👋</p>
            <p className="font-bold text-base leading-tight" style={{ color: 'var(--text)' }}>
              {firstName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
          >
            <Calendar size={16} className="text-gray-400" />
          </button>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}
          >
            <Bell size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* ── Date ──────────────────────────────────────────────── */}
      <p className="text-xs text-gray-500 font-medium mb-5 pl-0.5">{dateStr}</p>

      {/* ── Week strip ────────────────────────────────────────── */}
      <WeekStrip />

      {/* ── Notification ──────────────────────────────────────── */}
      {notif && (
        <div
          className="mb-5 rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: 'rgba(255,236,100,0.07)', border: '1px solid rgba(255,236,100,0.2)' }}
        >
          <Bell size={14} style={{ color: '#ffec64', flexShrink: 0 }} />
          <span className="text-sm" style={{ color: 'rgba(255,236,100,0.8)' }}>{notif}</span>
        </div>
      )}

      {/* ── Continue Workout ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-black text-base" style={{ color: 'var(--text)' }}>Continue Workout</h2>
        <Link to="/workout" className="text-xs font-semibold flex items-center gap-0.5" style={{ color: '#ffec64' }}>
          See all <ChevronRight size={13} />
        </Link>
      </div>

      <Link to="/workout" className="block mb-5">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1c1a06 0%, #252206 100%)',
            border: '1px solid rgba(255,236,100,0.15)',
          }}
        >
          {/* Glow */}
          <div
            className="absolute right-0 inset-y-0 w-32 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at right center, rgba(255,236,100,0.07) 0%, transparent 70%)' }}
          />

          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${DAY_TYPE_COLOR[workout.type]}`}>
                {workout.type}
              </p>
              <h3 className="text-lg font-black leading-tight mb-1 text-white">{workout.label}</h3>
              <p className="text-gray-500 text-sm mb-3">One workout. Total impact.</p>

              <span
                className="inline-block text-xs px-3 py-1 rounded-full font-semibold mb-4"
                style={{ background: 'rgba(255,236,100,0.12)', color: '#ffec64' }}
              >
                {totalEx} Exercises
              </span>

              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-black"
                  style={{ background: '#ffec64', color: '#080808' }}
                >
                  <Zap size={13} fill="#080808" /> Start Now
                </div>
              </div>
            </div>

            {/* Icon block */}
            <div
              className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center flex-shrink-0 self-center"
              style={{ background: 'rgba(255,236,100,0.07)', border: '1px solid rgba(255,236,100,0.12)' }}
            >
              <Dumbbell size={32} style={{ color: '#ffec64' }} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-gray-600 mb-1.5">
              <span>{exCompleted}/{totalEx} completed</span>
              <span>{totalEx ? Math.round((exCompleted / totalEx) * 100) : 0}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1f1d08' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${totalEx ? (exCompleted / totalEx) * 100 : 0}%`, background: '#ffec64' }}
              />
            </div>
          </div>
        </div>
      </Link>

      {/* ── Workout Categories ────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-black text-base" style={{ color: 'var(--text)' }}>Workout Categories</h2>
        <Link to="/workout" className="text-xs font-semibold flex items-center gap-0.5" style={{ color: '#ffec64' }}>
          See all <ChevronRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {CATEGORIES.map(({ label, emoji, color, bg, border }) => (
          <Link to="/workout" key={label}>
            <div
              className="rounded-2xl p-3 flex flex-col items-center gap-2"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <span className="text-[22px] leading-none">{emoji}</span>
              <span className="text-[10px] font-bold text-center leading-tight" style={{ color }}>
                {label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Healthy Diet ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-black text-base" style={{ color: 'var(--text)' }}>Healthy Diet</h2>
        <Link to="/diet" className="text-xs font-semibold text-brand flex items-center gap-0.5">
          See all <ChevronRight size={13} />
        </Link>
      </div>

      <Link to="/diet" className="block mb-5">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #061608 0%, #081e09 100%)',
            border: '1px solid rgba(103,222,109,0.15)',
          }}
        >
          <div
            className="absolute right-0 inset-y-0 w-32 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at right center, rgba(103,222,109,0.07) 0%, transparent 70%)' }}
          />

          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand mb-1">Nutrition</p>
              <h3 className="text-lg font-black leading-tight mb-1 text-white">
                {mealsCompleted}/{meals.length} Meals Logged
              </h3>
              <p className="text-gray-500 text-sm mb-3">Fuel your gains. Eat right.</p>

              {/* Meal dots */}
              <div className="flex gap-1.5 mb-4">
                {meals.slice(0, 6).map(m => (
                  <div
                    key={m.id}
                    className="flex-1 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: (today?.mealsCompleted || []).includes(m.id)
                        ? '#67DE6D' : 'rgba(103,222,109,0.1)',
                    }}
                  />
                ))}
              </div>

              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-black"
                  style={{ background: '#67DE6D', color: '#080808' }}
                >
                  <Flame size={13} fill="#080808" /> Log Meal
                </div>
              </div>
            </div>

            {/* Icon block */}
            <div
              className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center flex-shrink-0 self-center"
              style={{ background: 'rgba(103,222,109,0.07)', border: '1px solid rgba(103,222,109,0.12)' }}
            >
              <Flame size={32} style={{ color: '#67DE6D' }} />
            </div>
          </div>

          {/* Calorie progress */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-gray-600 mb-1.5">
              <span>{today?.caloriesConsumed || 0} / {nutrition?.calories || '—'} kcal</span>
              <span>{caloriesPct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#081408' }}>
              <div
                className="h-full rounded-full transition-all duration-500 bg-brand"
                style={{ width: `${Math.min(caloriesPct, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Link>

      {/* ── Quick Stats ───────────────────────────────────────── */}
      {nutrition && (
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
          >
            <p className="text-xs text-gray-500 mb-1">Daily Calories</p>
            <p className="text-2xl font-black" style={{ color: '#ffec64' }}>{nutrition.calories}</p>
            <p className="text-gray-600 text-xs">kcal target</p>
          </div>
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}
          >
            <p className="text-xs text-gray-500 mb-1">Daily Protein</p>
            <p className="text-2xl font-black text-brand">{nutrition.protein}g</p>
            <p className="text-gray-600 text-xs">protein target</p>
          </div>
        </div>
      )}

    </div>
  )
}
