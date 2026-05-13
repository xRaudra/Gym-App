import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { getUserByEmail, upsertUser } from '../utils/storage'
import { validatePassword } from '../utils/calculations'
import AuthLayout from '../components/AuthLayout'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email,       setEmail]       = useState('')
  const [newPw,       setNewPw]       = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [showPw,      setShowPw]      = useState(false)
  const [foundUser,   setFoundUser]   = useState(null)
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [done,        setDone]        = useState(false)

  const handleLookup = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Please enter your email.')
    setLoading(true)
    const u = await getUserByEmail(email.trim().toLowerCase())
    setLoading(false)
    if (!u) return setError('No account found with this email address.')
    setFoundUser(u)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    if (newPw !== confirm) return setError('Passwords do not match.')
    const errs = validatePassword(newPw)
    if (errs.length) return setError('Please fix password requirements.')
    setLoading(true)
    await upsertUser({ ...foundUser, password: newPw })
    setLoading(false)
    setDone(true)
  }

  return (
    <AuthLayout>
      <Link
        to="/login"
        className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors w-fit mb-8"
      >
        <span className="text-sm font-medium">← Back to login</span>
      </Link>

      <div className="mb-8">
        <h2 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Reset Password</h2>
        <p className="text-sm mt-1 text-gray-500">
          {!foundUser ? 'Enter your registered email to continue.' : `Account found: set a new password for ${foundUser.username}.`}
        </p>
      </div>

      {done ? (
        <div className="space-y-4 w-full lg:max-w-sm">
          <div className="bg-brand/10 border border-brand/30 rounded-xl px-4 py-4 text-brand text-sm font-medium">
            Password updated! You can now sign in with your new password.
          </div>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Back to Sign In
          </button>
        </div>

      ) : !foundUser ? (
        <form onSubmit={handleLookup} className="space-y-4 w-full lg:max-w-sm">
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Searching…' : 'Continue'}
          </button>
        </form>

      ) : (
        <form onSubmit={handleReset} className="space-y-4 w-full lg:max-w-sm">
          <div>
            <label className="label">New Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                autoComplete="new-password"
                className="pr-12"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {newPw && (
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1">
                {[
                  [newPw.length >= 8,            '8+ chars'],
                  [/[A-Z]/.test(newPw),          'Uppercase'],
                  [/[a-z]/.test(newPw),          'Lowercase'],
                  [/[0-9]/.test(newPw),          'Number'],
                  [/[^A-Za-z0-9]/.test(newPw),   'Special char'],
                ].map(([met, text]) => (
                  <span key={text} className={`text-xs ${met ? 'text-brand' : 'text-gray-500'}`}>
                    {met ? '✓' : '○'} {text}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
            {confirm && newPw !== confirm && (
              <p className="text-red-400 text-xs mt-1 px-1">Passwords don't match</p>
            )}
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Updating…' : 'Set New Password'}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
