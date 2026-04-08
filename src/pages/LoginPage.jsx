import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, User, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
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

  // ── Shared hero background ─────────────────────────────────────────────────
  const Hero = ({ children }) => (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Splash image */}
      <img
        src="/splash.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top"
        draggable={false}
      />
      {/* Gradient overlay — lighter at top, heavy black at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/95" />
      {/* Content */}
      <div className="relative flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )

  // ── Role selector ──────────────────────────────────────────────────────────
  if (!role) {
    return (
      <Hero>
        {/* Top branding */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-brand/20 border border-brand/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span className="text-brand text-xs font-semibold tracking-widest uppercase">Your Digital Trainer</span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              Grit n<br />
              <span className="text-brand">Gain.</span>
            </h1>
            <p className="text-gray-300 mt-3 text-base max-w-xs mx-auto leading-relaxed">
              Build strength. Track progress.<br />Become unstoppable.
            </p>
          </div>
        </div>

        {/* Bottom sheet */}
        <div className="px-5 pb-10 space-y-3 animate-slide-up">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold text-center mb-4">
            Continue as
          </p>

          {/* Member button */}
          <button
            onClick={() => setRole('member')}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/10 active:scale-95 transition-all duration-150"
            style={{ backgroundColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}
          >
            <div className="w-11 h-11 bg-brand/20 border border-brand/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <User size={22} className="text-brand" />
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-white text-base">Member</div>
              <div className="text-gray-400 text-sm">Workouts, diet & progress</div>
            </div>
            <span className="text-gray-500 text-lg">›</span>
          </button>

          {/* Admin button */}
          <button
            onClick={() => setRole('admin')}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/10 active:scale-95 transition-all duration-150"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}
          >
            <div className="w-11 h-11 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={22} className="text-gray-300" />
            </div>
            <div className="text-left flex-1">
              <div className="font-bold text-white text-base">Admin</div>
              <div className="text-gray-400 text-sm">Manage members & data</div>
            </div>
            <span className="text-gray-500 text-lg">›</span>
          </button>

          <p className="text-center text-gray-500 text-sm pt-3">
            New member?{' '}
            <Link to="/register" className="text-brand font-semibold">Create account</Link>
          </p>
        </div>
      </Hero>
    )
  }

  // ── Login form ─────────────────────────────────────────────────────────────
  return (
    <Hero>
      {/* Back button */}
      <div className="px-5 pt-12">
        <button
          onClick={() => { setRole(null); setError('') }}
          className="flex items-center gap-2 text-gray-300 active:scale-95 transition-transform w-fit"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="flex-1" />

      {/* Bottom form sheet */}
      <div
        className="mx-4 mb-8 rounded-3xl border border-white/10 p-6 animate-slide-up"
        style={{ backgroundColor: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${role === 'admin' ? 'bg-white/10 border-white/20' : 'bg-brand/20 border-brand/30'}`}>
            {role === 'admin'
              ? <ShieldCheck size={24} className="text-gray-200" />
              : <User size={24} className="text-brand" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{role === 'admin' ? 'Admin Login' : 'Welcome back'}</h2>
            <p className="text-gray-400 text-sm">Let's crush it today.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
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
                placeholder="Enter your password"
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

          <button type="submit" disabled={loading} className="btn-primary mt-1">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {role === 'member' && (
          <p className="text-gray-500 mt-4 text-sm text-center">
            No account?{' '}
            <Link to="/register" className="text-brand font-semibold">Register here</Link>
          </p>
        )}
      </div>
    </Hero>
  )
}
