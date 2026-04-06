import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Dumbbell, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState(null)         // null | 'member' | 'admin'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) return setError('Please enter both fields.')
    setLoading(true)
    const res = await login(username.trim(), password)
    setLoading(false)
    if (!res.ok) return setError(res.error)
    if (role === 'admin' && res.user.role !== 'admin')
      return setError('You do not have admin access.')
    if (!res.user.profile?.completedOnboarding) return navigate('/onboarding')
    navigate('/dashboard')
  }

  // ── Role selector ──────────────────────────────────────────────────────────
  if (!role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-fade-in" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-brand/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-brand/20">
            <Dumbbell size={40} className="text-brand" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>GymPro</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Your digital personal trainer</p>
        </div>

        <p className="text-gray-400 mb-6 text-sm tracking-wide uppercase font-medium">Sign in as</p>

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => setRole('member')}
            className="w-full flex items-center gap-4 p-5 bg-surface rounded-2xl border border-border active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <User size={24} className="text-brand" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Member</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Access your workout & diet plans</div>
            </div>
          </button>

          <button
            onClick={() => setRole('admin')}
            className="w-full flex items-center gap-4 p-5 bg-surface rounded-2xl border border-border active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} className="text-accent" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Admin</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage members & gym data</div>
            </div>
          </button>
        </div>

        <p className="text-gray-500 mt-10 text-sm">
          New member?{' '}
          <Link to="/register" className="text-brand font-medium">Register here</Link>
        </p>
      </div>
    )
  }

  // ── Login form ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col px-6 pt-12 animate-fade-in" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Back */}
      <button onClick={() => { setRole(null); setError('') }} className="text-gray-400 text-sm mb-8 flex items-center gap-1 w-fit">
        ← Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${role === 'admin' ? 'bg-accent/10 border-accent/20' : 'bg-brand/10 border-brand/20'}`}>
          {role === 'admin' ? <ShieldCheck size={28} className="text-accent" /> : <User size={28} className="text-brand" />}
        </div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{role === 'admin' ? 'Admin Login' : 'Member Login'}</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Welcome back — let's crush it today.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="label">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      {role === 'member' && (
        <p className="text-gray-500 mt-8 text-sm text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand font-medium">Register</Link>
        </p>
      )}
    </div>
  )
}
