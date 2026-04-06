import { useMemo } from 'react'
import { Flame, Zap, Dumbbell, Salad, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTracking } from '../contexts/TrackingContext'
import { calcNutrition, bmiCategory, pct } from '../utils/calculations'
import { getWeeklyOverview } from '../data/exercises'

const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function StatCard({ icon: Icon, label, value, sub, color = 'text-white' }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#1E1E1E]`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        <p className="text-gray-400 text-xs">{label}</p>
        {sub && <p className="text-gray-600 text-xs">{sub}</p>}
      </div>
    </div>
  )
}

// Inline SVG bar chart
function WeeklyBars({ data, label, color }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div>
      <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">{label}</p>
      <div className="flex items-end gap-1.5 h-20">
        {data.map((d, i) => {
          const h = Math.max(4, Math.round((d.value / max) * 72))
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`w-full rounded-t-md transition-all duration-500 ${d.isToday ? 'opacity-100' : 'opacity-60'} ${color}`}
                style={{ height: h }}
              />
              <span className={`text-[10px] ${d.isToday ? 'text-white' : 'text-gray-600'}`}>{d.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ProgressPage() {
  const { user } = useAuth()
  const { history } = useTracking()
  const profile = user?.profile || {}

  const nutrition = useMemo(() => calcNutrition({
    weight: +profile.weight,
    height: +profile.height,
    age: +profile.age,
    gender: profile.gender,
    goal: profile.goal,
  }), [profile])

  const bmi   = nutrition?.bmi
  const bmiCat = bmi ? bmiCategory(bmi) : null

  // Last 7 days data
  const last7 = history.slice(-7)
  const todayStr = new Date().toISOString().split('T')[0]

  const weeklyOverview = useMemo(() => getWeeklyOverview(profile.workOnSunday), [profile.workOnSunday])

  const calorieData = last7.map(d => ({
    label: DAYS_SHORT[new Date(d.date).getDay()],
    value: d.caloriesConsumed || 0,
    isToday: d.date === todayStr,
  }))

  const proteinData = last7.map(d => ({
    label: DAYS_SHORT[new Date(d.date).getDay()],
    value: d.proteinConsumed || 0,
    isToday: d.date === todayStr,
  }))

  const workoutData = last7.map(d => ({
    label: DAYS_SHORT[new Date(d.date).getDay()],
    value: (d.exercisesCompleted || []).length,
    isToday: d.date === todayStr,
  }))

  // Summary stats
  const totalDaysActive = history.filter(d => (d.exercisesCompleted || []).length > 0 || (d.mealsCompleted || []).length > 0).length
  const streak = useMemo(() => {
    let s = 0
    for (let i = history.length - 1; i >= 0; i--) {
      const d = history[i]
      if ((d.exercisesCompleted || []).length > 0 || (d.mealsCompleted || []).length > 0) s++
      else break
    }
    return s
  }, [history])

  const avgCalories = last7.length
    ? Math.round(last7.reduce((a, d) => a + (d.caloriesConsumed || 0), 0) / last7.length)
    : 0
  const avgProtein = last7.length
    ? Math.round(last7.reduce((a, d) => a + (d.proteinConsumed || 0), 0) / last7.length)
    : 0

  const workoutsThisWeek = weeklyOverview.filter(d => {
    const dayData = last7.find(h => new Date(h.date).getDay() === d.dayIndex)
    return (dayData?.exercisesCompleted || []).length > 0
  }).length

  const GOAL_LABEL = { loss: 'Weight Loss', maintenance: 'Stay Fit', gain: 'Muscle Gain' }

  return (
    <div className="page">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Your Progress</h1>
        <p className="text-gray-400 text-sm mt-0.5">30-day activity overview</p>
      </div>

      {/* BMI card */}
      {nutrition && (
        <div className="card mb-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Current BMI</p>
            <p className="text-4xl font-bold text-white mt-1">{bmi}</p>
            <p className={`text-sm font-semibold mt-0.5 ${bmiCat?.color}`}>{bmiCat?.label}</p>
          </div>
          <div className="flex-1 text-right">
            <p className="text-gray-400 text-xs">Goal</p>
            <p className="text-white font-medium text-sm">{GOAL_LABEL[profile.goal]}</p>
            <p className="text-gray-500 text-xs mt-1">{profile.weight}kg · {profile.height}cm</p>
            <div className="mt-2">
              <div className="text-xs text-gray-400 text-right">BMI range</div>
              <div className="flex items-center justify-end gap-1 mt-1">
                {[{ label: '<18.5', color: 'bg-blue-400' }, { label: '18.5–25', color: 'bg-brand' }, { label: '25–30', color: 'bg-accent' }, { label: '>30', color: 'bg-red-400' }].map(r => (
                  <span key={r.label} className={`w-2.5 h-2.5 rounded-full ${r.color} ${bmi < 18.5 && r.color === 'bg-blue-400' ? 'ring-2 ring-white' : bmi < 25 && r.color === 'bg-brand' ? 'ring-2 ring-white' : bmi < 30 && r.color === 'bg-accent' ? 'ring-2 ring-white' : bmi >= 30 && r.color === 'bg-red-400' ? 'ring-2 ring-white' : ''}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard icon={TrendingUp} label="Current streak"  value={`${streak}d`} sub="consecutive days" color="text-brand" />
        <StatCard icon={Dumbbell}   label="Workouts / week" value={workoutsThisWeek} sub="this week" color="text-orange-400" />
        <StatCard icon={Flame}      label="Avg daily calories" value={avgCalories} sub="last 7 days" color="text-accent" />
        <StatCard icon={Zap}        label="Avg daily protein"  value={`${avgProtein}g`} sub="last 7 days" color="text-brand" />
      </div>

      {/* Charts */}
      <div className="card mb-4">
        <WeeklyBars data={workoutData} label="Exercises completed (last 7 days)" color="bg-orange-400" />
      </div>
      <div className="card mb-4">
        <WeeklyBars data={proteinData} label="Protein (g) — last 7 days" color="bg-brand" />
        {nutrition && (
          <p className="text-gray-500 text-xs mt-2">Target: {nutrition.protein}g/day</p>
        )}
      </div>
      <div className="card mb-4">
        <WeeklyBars data={calorieData} label="Calories consumed — last 7 days" color="bg-accent" />
        {nutrition && (
          <p className="text-gray-500 text-xs mt-2">Target: {nutrition.calories} kcal/day</p>
        )}
      </div>

      {/* Weekly adherence */}
      <div className="card">
        <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-4">This Week's Workout Adherence</p>
        <div className="flex gap-2">
          {weeklyOverview.map(day => {
            const dayData = last7.find(h => new Date(h.date).getDay() === day.dayIndex)
            const done = (dayData?.exercisesCompleted || []).length > 0
            const isToday = day.dayIndex === new Date().getDay()
            return (
              <div key={day.dayIndex} className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-full aspect-square rounded-xl flex items-center justify-center border text-xs font-bold ${
                  done ? 'bg-brand/20 border-brand/40 text-brand' :
                  isToday ? 'bg-[#1E1E1E] border-brand text-white' :
                  'bg-[#1A1A1A] border-[#2A2A2A] text-gray-600'
                }`}>
                  {done ? '✓' : day.day[0]}
                </div>
                <span className={`text-[10px] ${isToday ? 'text-white' : 'text-gray-600'}`}>{day.day}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Motivation block */}
      <div className="mt-5 bg-gradient-to-br from-brand/10 to-transparent rounded-2xl p-5 border border-brand/20">
        <p className="text-brand text-sm font-bold mb-1">Keep going!</p>
        <p className="text-gray-300 text-sm">
          {streak === 0
            ? "Every champion was once a beginner. Start today and your future self will thank you."
            : streak < 7
            ? `${streak} days strong! Consistency is the secret. Small steps daily lead to massive results.`
            : `${streak}-day streak! You're building an unbreakable habit. This is where transformation happens.`
          }
        </p>
      </div>
    </div>
  )
}
