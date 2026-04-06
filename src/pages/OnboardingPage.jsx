import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { FOODS } from '../data/foods'

const TOTAL_STEPS = 4

const FOOD_PREF_OPTIONS = {
  veg: ['paneer', 'tofu', 'soya_chunks', 'chana_dal', 'moong_dal', 'rajma', 'chickpeas', 'greek_yogurt', 'oats', 'brown_rice', 'quinoa', 'almonds', 'peanut_butter'],
  'non-veg': ['chicken_breast', 'salmon', 'tuna', 'turkey_breast', 'whole_eggs', 'paneer', 'oats', 'brown_rice', 'almonds', 'peanut_butter'],
  eggetarian: ['whole_eggs', 'boiled_eggs', 'egg_whites', 'paneer', 'greek_yogurt', 'oats', 'brown_rice', 'almonds', 'tofu', 'rajma'],
}

function StepDot({ total, current }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= current ? 'bg-brand w-6' : 'bg-gray-700 w-3'}`} />
      ))}
    </div>
  )
}

function ChipSelect({ options, selected, onChange, multi = true }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = multi ? selected.includes(opt.value) : selected === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              if (multi) {
                onChange(active ? selected.filter(v => v !== opt.value) : [...selected, opt.value])
              } else {
                onChange(opt.value)
              }
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 border ${
              active ? 'bg-brand/15 border-brand text-brand' : 'bg-surface border-border text-gray-400'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default function OnboardingPage() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    gender: '',
    age: '',
    height: '',
    weight: '',
    dietaryPreference: '',
    preferredFoods: [],
    goal: 'maintenance',
    workOnSunday: false,
  })
  const [error, setError] = useState('')

  const set = (k, v) => setData(d => ({ ...d, [k]: v }))

  const validateStep = () => {
    if (step === 0) {
      if (!data.gender) return 'Please select your gender.'
      if (!data.age || data.age < 13 || data.age > 90) return 'Please enter a valid age (13–90).'
    }
    if (step === 1) {
      if (!data.height || data.height < 100 || data.height > 250) return 'Enter height in cm (100–250).'
      if (!data.weight || data.weight < 30 || data.weight > 250)  return 'Enter weight in kg (30–250).'
    }
    if (step === 2) {
      if (!data.dietaryPreference) return 'Please select a dietary preference.'
    }
    return ''
  }

  const next = () => {
    const err = validateStep()
    if (err) return setError(err)
    setError('')
    setStep(s => s + 1)
  }

  const back = () => { setError(''); setStep(s => s - 1) }

  const finish = () => {
    const err = validateStep()
    if (err) return setError(err)
    updateProfile({ ...data, completedOnboarding: true })
    navigate('/dashboard')
  }

  const foodOptions = (FOOD_PREF_OPTIONS[data.dietaryPreference] || []).map(id => {
    const f = FOODS.find(x => x.id === id)
    return f ? { value: f.id, label: f.name } : null
  }).filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col px-6 pt-10 pb-8 animate-fade-in" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-gray-400 text-sm mb-3">Step {step + 1} of {TOTAL_STEPS}</p>
        <StepDot total={TOTAL_STEPS} current={step} />
      </div>

      {/* Step 0 — Personal info */}
      {step === 0 && (
        <div className="animate-slide-up space-y-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Tell us about you</h2>
            <p className="text-gray-400 mt-1">We'll personalise everything for you.</p>
          </div>
          <div>
            <label className="label">Gender</label>
            <ChipSelect
              multi={false}
              selected={data.gender}
              onChange={v => set('gender', v)}
              options={[
                { value: 'male',   label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other',  label: 'Prefer not to say' },
              ]}
            />
          </div>
          <div>
            <label className="label">Age</label>
            <input type="number" placeholder="e.g. 25" value={data.age} onChange={e => set('age', e.target.value)} min={13} max={90} />
          </div>
        </div>
      )}

      {/* Step 1 — Body metrics */}
      {step === 1 && (
        <div className="animate-slide-up space-y-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Your body metrics</h2>
            <p className="text-gray-400 mt-1">Used to calculate your calorie & protein needs.</p>
          </div>
          <div>
            <label className="label">Height (cm)</label>
            <input type="number" placeholder="e.g. 175" value={data.height} onChange={e => set('height', e.target.value)} min={100} max={250} />
          </div>
          <div>
            <label className="label">Weight (kg)</label>
            <input type="number" placeholder="e.g. 70" value={data.weight} onChange={e => set('weight', e.target.value)} min={30} max={250} />
          </div>
        </div>
      )}

      {/* Step 2 — Diet preference */}
      {step === 2 && (
        <div className="animate-slide-up space-y-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Dietary Preference</h2>
            <p className="text-gray-400 mt-1">Your meal plans will be tailored to this.</p>
          </div>
          <div>
            <label className="label">I eat</label>
            <ChipSelect
              multi={false}
              selected={data.dietaryPreference}
              onChange={v => set('dietaryPreference', v)}
              options={[
                { value: 'veg',        label: 'Vegetarian' },
                { value: 'non-veg',    label: 'Non-Vegetarian' },
                { value: 'eggetarian', label: 'Eggetarian' },
              ]}
            />
          </div>
          {data.dietaryPreference && (
            <div>
              <label className="label">Preferred foods (pick favourites)</label>
              <ChipSelect
                multi={true}
                selected={data.preferredFoods}
                onChange={v => set('preferredFoods', v)}
                options={foodOptions}
              />
              <p className="text-gray-500 text-xs mt-2 px-1">Optional — helps us personalise your diet plan.</p>
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Goals & Schedule */}
      {step === 3 && (
        <div className="animate-slide-up space-y-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Your Goal & Schedule</h2>
            <p className="text-gray-400 mt-1">This shapes your workout intensity and calories.</p>
          </div>
          <div>
            <label className="label">Primary Goal</label>
            <ChipSelect
              multi={false}
              selected={data.goal}
              onChange={v => set('goal', v)}
              options={[
                { value: 'loss',        label: 'Lose Weight' },
                { value: 'maintenance', label: 'Stay Fit' },
                { value: 'gain',        label: 'Build Muscle' },
              ]}
            />
          </div>
          <div>
            <label className="label">Workout on Sundays?</label>
            <div className="flex gap-3">
              {['Yes','No'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set('workOnSunday', opt === 'Yes')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all active:scale-95 ${
                    (opt === 'Yes') === data.workOnSunday
                      ? 'bg-brand/15 border-brand text-brand'
                      : 'bg-surface border-border text-gray-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-surface rounded-2xl p-4 border border-border space-y-2 mt-4">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-3">Your Profile Summary</p>
            <Row label="Name" value={user?.name} />
            <Row label="Gender" value={capitalize(data.gender)} />
            <Row label="Age" value={`${data.age} yrs`} />
            <Row label="Height" value={`${data.height} cm`} />
            <Row label="Weight" value={`${data.weight} kg`} />
            <Row label="Diet" value={PREF_LABELS[data.dietaryPreference]} />
            <Row label="Goal" value={GOAL_LABELS[data.goal]} />
            <Row label="Sunday workout" value={data.workOnSunday ? 'Yes' : 'No'} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
      )}

      {/* Navigation */}
      <div className="mt-auto pt-8 flex gap-3">
        {step > 0 && (
          <button onClick={back} className="btn-secondary flex items-center justify-center gap-2 flex-1">
            <ChevronLeft size={18} /> Back
          </button>
        )}
        {step < TOTAL_STEPS - 1 ? (
          <button onClick={next} className="btn-primary flex items-center justify-center gap-2 flex-1">
            Continue <ChevronRight size={18} />
          </button>
        ) : (
          <button onClick={finish} className="btn-primary flex items-center justify-center gap-2 flex-1">
            <Check size={18} /> Let's Go!
          </button>
        )}
      </div>
    </div>
  )
}

const PREF_LABELS = { veg: 'Vegetarian', 'non-veg': 'Non-Vegetarian', eggetarian: 'Eggetarian' }
const GOAL_LABELS = { loss: 'Lose Weight', maintenance: 'Stay Fit', gain: 'Build Muscle' }
const capitalize = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
const Row = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="font-medium" style={{ color: 'var(--text)' }}>{value || '—'}</span>
  </div>
)
