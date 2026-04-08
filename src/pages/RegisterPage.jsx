import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { validatePassword } from '../utils/calculations'

function PwRule({ met, text }) {
  return (
    <span className={`flex items-center gap-1.5 text-xs ${met ? 'text-brand' : 'text-gray-500'}`}>
      {met ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
      {text}
    </span>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const pwErrors = validatePassword(form.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (pwErrors.length) return setError('Please fix password requirements.')
    setLoading(true)
    const res = await register({ name: form.name, username: form.username, email: form.email, password: form.password })
    setLoading(false)
    if (!res.ok) return setError(res.error)
    navigate('/onboarding')
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-10 pb-10 animate-fade-in" style={{ backgroundColor: 'var(--bg)' }}>
      <Link to="/login" className="text-gray-400 text-sm mb-8 flex items-center gap-1 w-fit">← Back</Link>

      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Create Account</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Join Grit n Gain and start your fitness journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input type="text" placeholder="Your full name" value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label">Username</label>
          <input type="text" placeholder="Choose a username" value={form.username} onChange={set('username')} autoComplete="username" />
        </div>
        <div>
          <label className="label">Email Address</label>
          <input type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} autoComplete="email" />
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={form.password}
              onChange={set('password')}
              autoComplete="new-password"
              className="pr-12"
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1">
              <PwRule met={form.password.length >= 8}        text="8+ chars" />
              <PwRule met={/[A-Z]/.test(form.password)}      text="Uppercase" />
              <PwRule met={/[a-z]/.test(form.password)}      text="Lowercase" />
              <PwRule met={/[0-9]/.test(form.password)}      text="Number" />
              <PwRule met={/[^A-Za-z0-9]/.test(form.password)} text="Special char" />
            </div>
          )}
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <input type="password" placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
          {form.confirm && form.password !== form.confirm && (
            <p className="text-red-400 text-xs mt-1 px-1">Passwords don't match</p>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-gray-500 mt-6 text-sm text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-brand font-medium">Sign in</Link>
      </p>
    </div>
  )
}
