import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogOut, User, Pencil, Check, X, Sun, Moon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { calcNutrition, bmiCategory } from '../utils/calculations'

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{value || '—'}</span>
    </div>
  )
}

function EditableField({ label, value, type = 'text', onChange, min, max, placeholder }) {
  const [editing, setEditing] = useState(false)
  const [local, setLocal] = useState(value)

  const save = () => { onChange(local); setEditing(false) }
  const cancel = () => { setLocal(value); setEditing(false) }

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type={type}
            value={local}
            onChange={e => setLocal(e.target.value)}
            min={min} max={max}
            placeholder={placeholder}
            className="w-24 py-1.5 px-2 text-sm rounded-lg border border-brand text-right"
            style={{ padding: '0.375rem 0.5rem', borderRadius: '0.5rem' }}
          />
          <button onClick={save} className="text-brand active:scale-90"><Check size={18} /></button>
          <button onClick={cancel} className="text-gray-500 active:scale-90"><X size={18} /></button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm font-medium active:scale-95" style={{ color: 'var(--text)' }}>
          {value || '—'} <Pencil size={12} className="text-gray-500" />
        </button>
      )}
    </div>
  )
}


export default function ProfilePage() {
  const { user, updateProfile, updateUser, logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()
  const profile = user?.profile || {}

  const [tab, setTab] = useState('profile')   // 'profile' | 'password'
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  const nutrition = calcNutrition({
    weight: +profile.weight,
    height: +profile.height,
    age: +profile.age,
    gender: profile.gender,
    goal: profile.goal,
  })
  const bmiCat = nutrition ? bmiCategory(nutrition.bmi) : null

  const handleLogout = () => { logout(); navigate('/login') }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    setPwError(''); setPwSuccess(false)
    if (pwForm.newPw !== pwForm.confirm) return setPwError('New passwords do not match.')
    const res = updateUser({ currentPassword: pwForm.current, newPassword: pwForm.newPw })
    if (!res.ok) return setPwError(res.error)
    setPwSuccess(true)
    setPwForm({ current: '', newPw: '', confirm: '' })
  }

  const Chip = ({ value, options, field }) => (
    <div className="flex flex-wrap gap-2 py-2">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => updateProfile({ [field]: o.value })}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all active:scale-95 ${
            value === o.value ? 'bg-brand/15 border-brand text-brand' : 'bg-surface-raised border-border text-gray-400'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )

  return (
    <div className="page">
      {/* Avatar header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
          <User size={32} className="text-brand" />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{user?.name}</h2>
          <p className="text-gray-400 text-sm">@{user?.username}</p>
          <p className="text-gray-500 text-xs">{user?.email}</p>
        </div>
        {user?.role === 'admin' && (
          <span className="ml-auto px-2.5 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full border border-accent/20">Admin</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-surface rounded-xl p-1 mb-5 border border-border">
        {['profile', 'password'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'text-white' : 'text-gray-500'}`}
            style={tab === t ? { backgroundColor: 'var(--bg-raised)', color: 'var(--text)' } : {}}
          >
            {t === 'profile' ? 'My Profile' : 'Change Password'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="space-y-4 animate-fade-in">
          {/* Nutrition stats */}
          {nutrition && (
            <div className="card">
              <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">Calculated Targets</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--bg-raised)' }}>
                  <p className="text-gray-500 text-xs">BMI</p>
                  <p className="font-bold text-xl" style={{ color: 'var(--text)' }}>{nutrition.bmi}</p>
                  <p className={`text-xs font-medium ${bmiCat?.color}`}>{bmiCat?.label}</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--bg-raised)' }}>
                  <p className="text-gray-500 text-xs">Daily Calories</p>
                  <p className="font-bold text-xl" style={{ color: 'var(--text)' }}>{nutrition.calories}</p>
                  <p className="text-gray-500 text-xs">kcal/day</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--bg-raised)' }}>
                  <p className="text-gray-500 text-xs">Daily Protein</p>
                  <p className="text-brand font-bold text-xl">{nutrition.protein}g</p>
                  <p className="text-gray-500 text-xs">protein/day</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--bg-raised)' }}>
                  <p className="text-gray-500 text-xs">TDEE</p>
                  <p className="font-bold text-xl" style={{ color: 'var(--text)' }}>{nutrition.tdee}</p>
                  <p className="text-gray-500 text-xs">maintenance</p>
                </div>
              </div>
            </div>
          )}

          {/* Editable body metrics */}
          <div className="card">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1">Body Metrics</p>
            <EditableField label="Age" value={profile.age ? `${profile.age} yrs` : ''} type="number" min={13} max={90}
              onChange={v => updateProfile({ age: +v.replace(/\D/g,'') })} placeholder="Age" />
            <EditableField label="Height" value={profile.height ? `${profile.height} cm` : ''} type="number" min={100} max={250}
              onChange={v => updateProfile({ height: +v.replace(/\D/g,'') })} placeholder="cm" />
            <EditableField label="Weight" value={profile.weight ? `${profile.weight} kg` : ''} type="number" min={30} max={250}
              onChange={v => updateProfile({ weight: +v.replace(/\D/g,'') })} placeholder="kg" />
          </div>

          {/* Gender */}
          <div className="card">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Gender</p>
            <Chip value={profile.gender} field="gender" options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Prefer not to say' },
            ]} />
          </div>

          {/* Goal */}
          <div className="card">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Fitness Goal</p>
            <Chip value={profile.goal} field="goal" options={[
              { value: 'loss', label: 'Lose Weight' },
              { value: 'maintenance', label: 'Stay Fit' },
              { value: 'gain', label: 'Build Muscle' },
            ]} />
          </div>

          {/* Diet pref */}
          <div className="card">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Dietary Preference</p>
            <Chip value={profile.dietaryPreference} field="dietaryPreference" options={[
              { value: 'veg', label: 'Vegetarian' },
              { value: 'non-veg', label: 'Non-Vegetarian' },
              { value: 'eggetarian', label: 'Eggetarian' },
            ]} />
          </div>

          {/* Sunday workout */}
          <div className="card">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-2">Sunday Workout</p>
            <div className="flex gap-3">
              {[{ v: true, label: 'Yes' }, { v: false, label: 'No' }].map(o => (
                <button
                  key={String(o.v)}
                  onClick={() => updateProfile({ workOnSunday: o.v })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all active:scale-95 ${
                    profile.workOnSunday === o.v ? 'bg-brand/15 border-brand text-brand' : 'bg-surface-raised border-border text-gray-400'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <InfoRow label="Member since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} />
        </div>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePasswordChange} className="space-y-4 animate-fade-in">
          <div>
            <label className="label">Current Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} placeholder="Current password" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} className="pr-12" />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" placeholder="New password" value={pwForm.newPw} onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))} />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" placeholder="Confirm new password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
          </div>
          {pwError && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{pwError}</div>}
          {pwSuccess && <div className="bg-brand/10 border border-brand/30 rounded-xl px-4 py-3 text-brand text-sm">Password changed successfully!</div>}
          <button type="submit" className="btn-primary">Update Password</button>
        </form>
      )}

      {/* Theme toggle */}
      <div className="mt-6 flex items-center justify-between py-4 px-4 rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-raised)' }}>
        <div className="flex items-center gap-3">
          {theme === 'dark' ? <Moon size={18} className="text-brand" /> : <Sun size={18} className="text-accent" />}
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Appearance</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 overflow-hidden ${theme === 'dark' ? 'bg-brand' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${theme === 'dark' ? 'left-[26px]' : 'left-0.5'}`} />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full mt-3 flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/30 text-red-400 font-semibold text-sm active:scale-95 transition-transform"
      >
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  )
}
