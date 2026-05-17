import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'
import Logo from '../components/Logo'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

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
    <AuthLayout>
      {/* Back — mobile only */}
      <button
        onClick={() => navigate(-1)}
        className="lg:hidden flex items-center gap-2 text-gray-500 hover:text-gray-300 active:scale-95 transition-all w-fit mb-6"
      >
        <ArrowLeft size={17} />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Logo — mobile only */}
      <Logo size={44} className="mb-6 lg:hidden" variant="light" />

      {/* Center section — grows to fill space and centers content on desktop */}
      <div className="lg:flex-1 lg:flex lg:flex-col lg:justify-center">
        {/* Heading */}
        <div className="mb-5 lg:text-center">
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Welcome Back</h1>
          <p className="text-sm mt-1 text-gray-500">Enter your username and password to access your account.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3 w-full">
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
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

          <div className="flex justify-end -mt-1">
            <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Footer — sits at the bottom of the panel on desktop */}
      <p className="mt-6 lg:mt-0 lg:py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold" style={{ color: 'var(--text)' }}>Sign Up</Link>
      </p>
    </AuthLayout>
  )
}
