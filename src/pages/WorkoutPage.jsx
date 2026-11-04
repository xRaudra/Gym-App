import { useState, useMemo } from 'react'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Dumbbell, Info } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTracking } from '../contexts/TrackingContext'
import { getWeeklyOverview, DAY_TYPE_COLOR, DAY_TYPE_BG } from '../data/exercises'
import { getTodayDayIndex } from '../utils/calculations'

const REST_COLOR = 'text-gray-400'

function ExerciseCard({ ex, completed, onToggle }) {
  const [expanded, setExpanded] = useState(false)
  const isYoga = !!ex.subtitle

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${completed ? 'border-brand/30 bg-brand/5' : 'border-border bg-surface'}`}>
      {/* Header row */}
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => onToggle(ex.id)}
          className="flex-shrink-0 touch-manipulation active:scale-90 transition-transform"
        >
          {completed
            ? <CheckCircle2 size={26} className="text-brand" />
            : <Circle size={26} className="text-gray-600" />
          }
        </button>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-base ${completed ? 'line-through' : ''}`} style={{ color: completed ? 'var(--text-subtle)' : 'var(--text)' }}>{ex.name}</p>
          <p className="text-gray-500 text-xs mt-0.5">{isYoga ? ex.subtitle : ex.muscles}</p>
        </div>
        <div className="text-right flex-shrink-0">
          {isYoga ? (
            <>
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{ex.reps}</p>
              <p className="text-gray-500 text-xs">Mindful breath</p>
            </>
          ) : (
            <>
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{ex.sets}×{ex.reps}</p>
              <p className="text-gray-500 text-xs">Rest: {ex.rest}</p>
            </>
          )}
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-gray-500 ml-1 touch-manipulation active:scale-90"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 space-y-3">
          {/* Exercise image */}
          {ex.image && (
            <img
              src={ex.image}
              alt={ex.name}
              className="w-full rounded-xl object-cover"
              style={{ height: '160px' }}
              loading="lazy"
            />
          )}

          {/* Equipment badge */}
          {ex.equipment && (
            <div className="flex items-center gap-2">
              <Dumbbell size={13} className="text-brand flex-shrink-0" />
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{ex.equipment}</span>
            </div>
          )}

          {/* Step-by-step instructions */}
          {ex.steps && ex.steps.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>How To</p>
              {ex.steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-brand text-xs font-bold flex-shrink-0 w-4 text-right mt-0.5">{i + 1}</span>
                  <p className="text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>{step}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tip */}
          {ex.tip && (
            <div className="rounded-xl p-3 flex gap-2" style={{ backgroundColor: 'var(--bg-raised)' }}>
              <Info size={14} className="text-brand flex-shrink-0 mt-0.5" />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{ex.tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DayTab({ day, isToday, workout, onSelect, selected }) {
  const active = selected === day.dayIndex
  const color = DAY_TYPE_COLOR[workout.type] || REST_COLOR
  return (
    <button
      onClick={() => onSelect(day.dayIndex)}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all flex-shrink-0 touch-manipulation ${
        active ? 'bg-surface-raised border border-border-light' : ''
      }`}
    >
      <span className="text-gray-400 text-xs font-medium">{day.day}</span>
      <div className={`w-2 h-2 rounded-full ${active ? color.replace('text-', 'bg-') : 'bg-gray-700'}`} />
      {isToday && <span className="text-[9px] text-brand font-semibold">Today</span>}
    </button>
  )
}

export default function WorkoutPage() {
  const { user } = useAuth()
  const { today, toggleExercise } = useTracking()
  const profile = user?.profile || {}
  const todayIdx = getTodayDayIndex()
  const [selectedDay, setSelectedDay] = useState(todayIdx)

  const weeklyOverview = useMemo(() => getWeeklyOverview(profile.workOnSunday), [profile.workOnSunday])
  const currentDayPlan = weeklyOverview[selectedDay]
  const exercises = currentDayPlan?.exercises || []
  const completed = today?.exercisesCompleted || []
  const isToday = selectedDay === todayIdx
  const doneCount = isToday ? exercises.filter(e => completed.includes(e.id)).length : 0

  const typeColor = DAY_TYPE_COLOR[currentDayPlan?.type] || REST_COLOR
  const typeBg = DAY_TYPE_BG[currentDayPlan?.type] || 'bg-gray-700/20 border-gray-600/20'

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Workout Plan</h1>
          <p className="text-gray-400 text-sm mt-0.5">Push/Pull/Legs — Beginner</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs">This week</p>
          <p className="font-bold text-base" style={{ color: 'var(--text)' }}>
            {weeklyOverview.filter((_, i) => i !== 0 || profile.workOnSunday).filter(d => d.type !== 'rest').length} sessions
          </p>
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-1 overflow-x-auto pb-3 -mx-4 px-4 mb-5 scrollbar-hide">
        {weeklyOverview.map(day => (
          <DayTab
            key={day.dayIndex}
            day={day}
            isToday={day.dayIndex === todayIdx}
            workout={day}
            onSelect={setSelectedDay}
            selected={selectedDay}
          />
        ))}
      </div>

      {/* Day header card */}
      <div className={`card border ${typeBg} mb-5`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-medium">
              {weeklyOverview[selectedDay]?.day}{isToday ? ' • Today' : ''}
            </p>
            <p className={`text-lg font-bold mt-0.5 ${typeColor}`}>{currentDayPlan?.label}</p>
          </div>
          {currentDayPlan?.type !== 'rest' && isToday && (
            <div className="text-right">
              <p className="font-bold text-2xl" style={{ color: 'var(--text)' }}>{doneCount}/{exercises.length}</p>
              <p className="text-gray-400 text-xs">completed</p>
            </div>
          )}
        </div>
        {currentDayPlan?.type !== 'rest' && isToday && exercises.length > 0 && (
          <div className="mt-3 h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${(doneCount / exercises.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Exercise list */}
      {currentDayPlan?.type === 'rest' ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">😴</div>
          <p className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Rest & Recover</p>
          <p className="text-gray-400 mt-2 max-w-xs mx-auto text-sm">
            Recovery is where muscles grow. Light activity below is optional but beneficial.
          </p>
          <div className="mt-6 space-y-3">
            {exercises.map(ex => (
              <div key={ex.id} className="card text-left">
                <p className="font-medium" style={{ color: 'var(--text)' }}>{ex.name}</p>
                <p className="text-gray-400 text-sm mt-0.5">{ex.reps}</p>
                <p className="text-gray-500 text-xs mt-1 italic">{ex.tip}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {exercises.map(ex => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              completed={isToday && completed.includes(ex.id)}
              onToggle={isToday ? toggleExercise : () => {}}
            />
          ))}
          {!isToday && (
            <div className="bg-surface rounded-xl border border-border px-4 py-3 mt-2">
              <p className="text-gray-400 text-xs text-center flex items-center justify-center gap-2">
                <Dumbbell size={14} />
                Switch to today's tab to log exercises
              </p>
            </div>
          )}
          {isToday && doneCount === exercises.length && exercises.length > 0 && (
            <div className="card border border-brand/30 bg-brand/5 text-center py-5">
              <div className="text-3xl mb-2">🔥</div>
              <p className="text-brand font-bold text-lg">Workout Complete!</p>
              <p className="text-gray-400 text-sm mt-1">Outstanding effort today. Rest up and recover.</p>
            </div>
          )}
        </div>
      )}

      {/* Coach tip */}
      <div className="mt-6 rounded-2xl p-4 border border-border" style={{ backgroundColor: 'var(--bg-raised)' }}>
        <p className="text-brand text-xs font-semibold uppercase tracking-wider mb-2">Coach's Tip</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {currentDayPlan?.type === 'push' && "Focus on the mind-muscle connection. Slow the negative (lowering) phase to 3 seconds for maximum chest activation."}
          {currentDayPlan?.type === 'pull' && "Pull with your elbows, not your hands. Visualise your hands as hooks and drive your elbows into your pockets on every pull."}
          {currentDayPlan?.type === 'legs' && "Never skip the warm-up squat set. Light squats before heavy ones protect your knees and improve depth."}
          {currentDayPlan?.type === 'rest' && "Sleep 7–9 hours. Protein synthesis peaks during sleep — this is when your muscles actually grow."}
          {currentDayPlan?.type === 'yoga' && "Breathe steadily throughout every pose — inhale to lengthen, exhale to deepen. Never push into pain; work to the edge of comfort."}
        </p>
      </div>
    </div>
  )
}
