import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserPlus, Trash2, ShieldCheck, ShieldOff, Eye, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getUsers, deleteUser as deleteUserFromStore, upsertUser } from '../utils/storage'
import { calcNutrition, bmiCategory, formatDate } from '../utils/calculations'

const PREF_LABELS = { veg: 'Veg', 'non-veg': 'Non-Veg', eggetarian: 'Egg' }
const GOAL_LABELS = { loss: 'Weight Loss', maintenance: 'Maintenance', gain: 'Muscle Gain' }

function MemberRow({ member, currentUserId, onView, onToggleAdmin, onDelete }) {
  const isRoot = member.username === 'xRaudra'
  const isCurrentUser = member.id === currentUserId
  const p = member.profile || {}
  const nut = calcNutrition({ weight: +p.weight, height: +p.height, age: +p.age, gender: p.gender, goal: p.goal })
  const bmiCat = nut ? bmiCategory(nut.bmi) : null

  return (
    <div className="card mb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold">{member.name}</span>
            {member.role === 'admin' && (
              <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold rounded-full border border-accent/20">ADMIN</span>
            )}
            {isCurrentUser && (
              <span className="px-2 py-0.5 bg-brand/10 text-brand text-[10px] font-bold rounded-full border border-brand/20">You</span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-0.5">@{member.username} · {member.email}</p>
          <p className="text-gray-500 text-xs mt-0.5">Joined {formatDate(member.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          <button onClick={() => onView(member)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-raised border border-border text-gray-400 active:scale-90">
            <Eye size={15} />
          </button>
          {!isRoot && !isCurrentUser && (
            <>
              <button onClick={() => onToggleAdmin(member)} className={`w-8 h-8 flex items-center justify-center rounded-lg border active:scale-90 ${member.role === 'admin' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-surface-raised border-border text-gray-400'}`}>
                {member.role === 'admin' ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
              </button>
              <button onClick={() => onDelete(member)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 active:scale-90">
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick stats */}
      {nut && (
        <div className="flex gap-3 mt-3 pt-3 border-t border-border">
          <div className="text-xs text-gray-400">BMI: <span className={`font-semibold ${bmiCat?.color}`}>{nut.bmi} ({bmiCat?.label})</span></div>
          <div className="text-xs text-gray-400">·</div>
          <div className="text-xs text-gray-400">Goal: <span className="text-gray-300">{GOAL_LABELS[p.goal] || '—'}</span></div>
          <div className="text-xs text-gray-400">·</div>
          <div className="text-xs text-gray-400">Diet: <span className="text-gray-300">{PREF_LABELS[p.dietaryPreference] || '—'}</span></div>
        </div>
      )}
    </div>
  )
}

function AddMemberModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: 'Member@123' })
  const [err, setErr] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleAdd = () => {
    if (!form.name || !form.username || !form.email) return setErr('All fields required.')
    const users = getUsers()
    if (users.find(u => u.username.toLowerCase() === form.username.toLowerCase())) return setErr('Username taken.')
    if (users.find(u => u.email.toLowerCase() === form.email.toLowerCase())) return setErr('Email already in use.')
    const member = {
      id: `user_${Date.now()}`,
      ...form,
      role: 'member',
      profile: { gender:'', age:'', height:'', weight:'', dietaryPreference:'', preferredFoods:[], goal:'maintenance', workOnSunday:false, completedOnboarding:false },
      createdAt: new Date().toISOString(),
    }
    upsertUser(member)
    onAdd()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end z-50" onClick={onClose}>
      <div className="bg-[#141414] rounded-t-3xl p-6 w-full border-t border-border animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">Add Member</h3>
          <button onClick={onClose} className="text-gray-400 active:scale-90"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <input type="text" placeholder="Full Name" value={form.name} onChange={set('name')} />
          <input type="text" placeholder="Username" value={form.username} onChange={set('username')} />
          <input type="email" placeholder="Email" value={form.email} onChange={set('email')} />
          <input type="text" placeholder="Password" value={form.password} onChange={set('password')} />
          <p className="text-gray-500 text-xs px-1">Default password: Member@123 — member should change on first login.</p>
        </div>
        {err && <p className="text-red-400 text-sm mt-3">{err}</p>}
        <button onClick={handleAdd} className="btn-primary mt-4">Add Member</button>
      </div>
    </div>
  )
}

function MemberDetailModal({ member, onClose }) {
  const p = member?.profile || {}
  const nut = calcNutrition({ weight: +p.weight, height: +p.height, age: +p.age, gender: p.gender, goal: p.goal })
  const bmiCat = nut ? bmiCategory(nut.bmi) : null
  if (!member) return null
  return (
    <div className="fixed inset-0 bg-black/70 flex items-end z-50" onClick={onClose}>
      <div className="bg-[#141414] rounded-t-3xl p-6 w-full border-t border-border animate-slide-up max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">{member.name}</h3>
          <button onClick={onClose} className="text-gray-400 active:scale-90"><X size={20} /></button>
        </div>
        <div className="space-y-2 text-sm">
          {[
            ['Username', `@${member.username}`],
            ['Email', member.email],
            ['Role', member.role],
            ['Joined', formatDate(member.createdAt)],
            ['Gender', p.gender],
            ['Age', p.age ? `${p.age} yrs` : '—'],
            ['Height', p.height ? `${p.height} cm` : '—'],
            ['Weight', p.weight ? `${p.weight} kg` : '—'],
            ['Diet', PREF_LABELS[p.dietaryPreference] || '—'],
            ['Goal', GOAL_LABELS[p.goal] || '—'],
            ['Sunday workout', p.workOnSunday ? 'Yes' : 'No'],
            ['Onboarding', p.completedOnboarding ? 'Complete' : 'Pending'],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between py-2 border-b border-[#2A2A2A]">
              <span className="text-gray-400">{label}</span>
              <span className="text-white font-medium">{val || '—'}</span>
            </div>
          ))}
          {nut && (
            <>
              <div className="flex justify-between py-2 border-b border-[#2A2A2A]">
                <span className="text-gray-400">BMI</span>
                <span className={`font-semibold ${bmiCat?.color}`}>{nut.bmi} — {bmiCat?.label}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2A2A2A]">
                <span className="text-gray-400">Daily Calories</span>
                <span className="text-white font-medium">{nut.calories} kcal</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Daily Protein</span>
                <span className="text-brand font-medium">{nut.protein}g</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState(() => getUsers())
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [viewMember, setViewMember] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const refresh = () => setUsers(getUsers())

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter(u => u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [users, search])

  const members   = filtered.filter(u => u.role === 'member')
  const admins    = filtered.filter(u => u.role === 'admin')
  const totalAll  = users.length
  const totalMem  = users.filter(u => u.role === 'member').length
  const totalAdm  = users.filter(u => u.role === 'admin').length

  const handleToggleAdmin = (member) => {
    const updated = { ...member, role: member.role === 'admin' ? 'member' : 'admin' }
    upsertUser(updated)
    refresh()
  }

  const handleDelete = (member) => {
    deleteUserFromStore(member.id)
    refresh()
    setConfirmDelete(null)
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage members & roles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total Users', value: totalAll, color: 'text-white' },
          { label: 'Members',     value: totalMem, color: 'text-brand' },
          { label: 'Admins',      value: totalAdm, color: 'text-accent' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + add */}
      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-brand text-black font-semibold px-4 rounded-2xl text-sm active:scale-95 flex-shrink-0"
        >
          <UserPlus size={16} /> Add
        </button>
      </div>

      {/* Admins */}
      {admins.length > 0 && (
        <div className="mb-5">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-3">Admins ({admins.length})</p>
          {admins.map(m => (
            <MemberRow key={m.id} member={m} currentUserId={user?.id}
              onView={setViewMember} onToggleAdmin={handleToggleAdmin}
              onDelete={setConfirmDelete} />
          ))}
        </div>
      )}

      {/* Members */}
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-3">Members ({members.length})</p>
        {members.length === 0 && (
          <div className="card text-center py-8 text-gray-500">No members found.</div>
        )}
        {members.map(m => (
          <MemberRow key={m.id} member={m} currentUserId={user?.id}
            onView={setViewMember} onToggleAdmin={handleToggleAdmin}
            onDelete={setConfirmDelete} />
        ))}
      </div>

      {/* Modals */}
      {showAdd && <AddMemberModal onClose={() => setShowAdd(false)} onAdd={refresh} />}
      {viewMember && <MemberDetailModal member={viewMember} onClose={() => setViewMember(null)} />}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6">
          <div className="bg-[#141414] rounded-2xl p-6 w-full max-w-sm border border-border animate-fade-in">
            <h3 className="text-white font-bold text-lg mb-2">Remove Member?</h3>
            <p className="text-gray-400 text-sm mb-5">
              Are you sure you want to remove <span className="text-white font-medium">{confirmDelete.name}</span> (@{confirmDelete.username})? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1 py-3">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="btn-danger flex-1">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
