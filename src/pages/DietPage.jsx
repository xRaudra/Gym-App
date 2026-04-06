import { useMemo } from 'react'
import { CheckCircle2, Circle, Flame, Zap, Clock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTracking } from '../contexts/TrackingContext'
import { calcNutrition, pct } from '../utils/calculations'
import { generateDietPlan, planTotals } from '../data/foods'

function MacroBar({ label, consumed, target, color }) {
  const p = pct(consumed, target)
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className={color}>{consumed}/{target}{label === 'Protein' ? 'g' : ' kcal'}</span>
      </div>
      <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${p}%` }}
        />
      </div>
    </div>
  )
}

function MealCard({ meal, completed, onToggle }) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${completed ? 'border-brand/30 bg-brand/5' : 'border-border bg-surface'}`}
    >
      {/* Time badge + title row */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(meal.id, meal.calories, meal.protein)}
            className="flex-shrink-0 mt-0.5 touch-manipulation active:scale-90 transition-transform"
          >
            {completed
              ? <CheckCircle2 size={26} className="text-brand" />
              : <Circle size={26} className="text-gray-600" />
            }
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-brand text-xs font-semibold uppercase tracking-wide">{meal.label}</span>
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <Clock size={10} />{meal.time}
              </span>
            </div>
            <p className={`font-semibold text-base ${completed ? 'line-through' : ''}`} style={{ color: completed ? 'var(--text-subtle)' : 'var(--text)' }}>
              {meal.name}
            </p>
          </div>
        </div>

        {/* Macros */}
        <div className="flex gap-4 mt-3 pl-9">
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-orange-400" />
            <span className="text-orange-400 font-semibold text-sm">{meal.calories}</span>
            <span className="text-gray-500 text-xs">kcal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-brand" />
            <span className="text-brand font-semibold text-sm">{meal.protein}g</span>
            <span className="text-gray-500 text-xs">protein</span>
          </div>
        </div>

        {/* Food items list */}
        {meal.items && meal.items.length > 0 && (
          <div className="mt-3 pl-9 flex flex-wrap gap-1.5">
            {meal.items.map(item => (
              <span key={item.id} className="px-2.5 py-1 rounded-lg text-xs border" style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                {item.name} <span style={{ color: 'var(--text-subtle)' }}>({item.unit})</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DietPage() {
  const { user } = useAuth()
  const { today, toggleMeal } = useTracking()
  const profile = user?.profile || {}

  const nutrition = useMemo(() => calcNutrition({
    weight: +profile.weight,
    height: +profile.height,
    age: +profile.age,
    gender: profile.gender,
    goal: profile.goal,
  }), [profile])

  const meals = useMemo(() => {
    if (!nutrition) return []
    return generateDietPlan(profile.dietaryPreference, nutrition.calories, nutrition.protein)
  }, [profile.dietaryPreference, nutrition])

  const planTotal = planTotals(meals)
  const mealsCompleted = today?.mealsCompleted || []

  const GOAL_LABEL = { loss: 'Weight Loss', gain: 'Muscle Gain', maintenance: 'Maintenance' }
  const PREF_LABEL = { veg: 'Vegetarian', 'non-veg': 'Non-Vegetarian', eggetarian: 'Eggetarian' }

  return (
    <div className="page">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Diet Plan</h1>
        <div className="flex gap-2 mt-1.5">
          {profile.dietaryPreference && (
            <span className="text-xs px-2.5 py-1 bg-brand/10 text-brand rounded-full border border-brand/20 font-medium">
              {PREF_LABEL[profile.dietaryPreference]}
            </span>
          )}
          {profile.goal && (
            <span className="text-xs px-2.5 py-1 bg-accent/10 text-accent rounded-full border border-accent/20 font-medium">
              {GOAL_LABEL[profile.goal]}
            </span>
          )}
        </div>
      </div>

      {/* Macro summary card */}
      {nutrition && (
        <div className="card mb-5">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-4">Daily Targets vs Consumed</p>
          <div className="space-y-3">
            <MacroBar
              label="Protein"
              consumed={today?.proteinConsumed || 0}
              target={nutrition.protein}
              color="text-brand"
            />
            <MacroBar
              label="Calories"
              consumed={today?.caloriesConsumed || 0}
              target={nutrition.calories}
              color="text-orange-400"
            />
          </div>
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center text-xs text-gray-400">
            <div>
              <div className="font-semibold" style={{ color: 'var(--text)' }}>{planTotal.calories}</div>
              <div>Plan kcal</div>
            </div>
            <div>
              <div className="text-brand font-semibold">{planTotal.protein}g</div>
              <div>Plan protein</div>
            </div>
            <div>
              <div className="font-semibold" style={{ color: 'var(--text)' }}>{mealsCompleted.length}/{meals.length}</div>
              <div>Meals done</div>
            </div>
          </div>
        </div>
      )}

      {/* Meal list */}
      <div className="space-y-3">
        {meals.map(meal => (
          <MealCard
            key={meal.id}
            meal={meal}
            completed={mealsCompleted.includes(meal.id)}
            onToggle={toggleMeal}
          />
        ))}
      </div>

      {/* All done celebration */}
      {meals.length > 0 && mealsCompleted.length === meals.length && (
        <div className="card border border-brand/30 bg-brand/5 text-center py-5 mt-4">
          <div className="text-3xl mb-2">🥗</div>
          <p className="text-brand font-bold text-lg">All meals logged!</p>
          <p className="text-gray-400 text-sm mt-1">Excellent discipline. You're fuelling your gains perfectly.</p>
        </div>
      )}

      {/* Nutrition note */}
      <div className="mt-6 rounded-2xl p-4 border border-border" style={{ backgroundColor: 'var(--bg-raised)' }}>
        <p className="text-brand text-xs font-semibold uppercase tracking-wider mb-2">Nutrition Tip</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Spread your protein evenly across meals — aim for {nutrition ? Math.round(nutrition.protein / 5) : '25–30'}g per meal for optimal muscle protein synthesis. Pre-workout and post-workout meals are most important.
        </p>
      </div>
    </div>
  )
}
