import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) return setError('Please fill in both fields.')
    setLoading(true)
    const res = await login(username.trim(), password)
    setLoading(false)
    if (!res.ok) return setError(res.error)
    if (!res.user.profile?.completedOnboarding) return navigate('/onboarding')
    navigate(res.user.role === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Splash image */}
      <img
        src="/splash.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top"
        draggable={false}
      />

      {/* Gradient: light top → very dark bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/96" />

      {/* Content */}
      <div className="relative flex flex-col min-h-screen">

        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-end px-6 pb-10">
          <div className="mb-1">
            <span className="inline-flex items-center gap-1.5 bg-brand/20 border border-brand/30 rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-brand text-[11px] font-bold tracking-widest uppercase">Grit n Gain</span>
            </span>
          </div>

          <h1 className="text-[2.75rem] font-black text-white leading-[1.05] tracking-tight mb-3">
            Built on Grit,<br />
            <span className="text-brand">Delivered</span> by Gain.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
            Train smarter. Track every rep.<br />Become the strongest version of you.
          </p>
        </div>

        {/* Login card */}
        <div
          className="mx-4 mb-8 rounded-3xl border border-white/10 p-6 animate-slide-up"
          style={{ backgroundColor: 'rgba(8,8,8,0.88)', backdropFilter: 'blur(24px)' }}
        >
          <h2 className="text-lg font-bold text-white mb-1">Sign in</h2>
          <p className="text-gray-500 text-sm mb-5">Enter your credentials to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                placeholder="Your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                autoCapitalize="none"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-gray-600 mt-4 text-sm text-center">
            New member?{' '}
            <Link to="/register" className="text-brand font-semibold">Create account</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
