import { NavLink, Outlet } from 'react-router-dom'
import { Home, Dumbbell, Salad, TrendingUp, User, ShieldCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const MEMBER_NAV = [
  { to: '/dashboard', icon: Home,       label: 'Home'     },
  { to: '/workout',   icon: Dumbbell,   label: 'Workout'  },
  { to: '/diet',      icon: Salad,      label: 'Diet'     },
  { to: '/progress',  icon: TrendingUp, label: 'Progress' },
  { to: '/profile',   icon: User,       label: 'Profile'  },
]

const ADMIN_NAV = [
  { to: '/dashboard', icon: Home,        label: 'Home'    },
  { to: '/workout',   icon: Dumbbell,    label: 'Workout' },
  { to: '/diet',      icon: Salad,       label: 'Diet'    },
  { to: '/admin',     icon: ShieldCheck, label: 'Admin'   },
  { to: '/profile',   icon: User,        label: 'Profile' },
]

export default function Layout() {
  const { user } = useAuth()
  const nav       = user?.role === 'admin' ? ADMIN_NAV : MEMBER_NAV
  const firstName = (user?.name || user?.username || '').split(' ')[0]

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── Desktop sidebar (md+) ────────────────────────────────── */}
      <aside
        className="hidden md:flex fixed inset-y-0 left-0 w-56 flex-col z-40"
        style={{ backgroundColor: 'var(--nav-bg)', borderRight: '1px solid var(--border)' }}
      >
        {/* Brand mark */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(255,236,100,0.1)',
                border: '1.5px solid rgba(255,236,100,0.22)',
              }}
            >
              <span className="font-black text-[15px] leading-none" style={{ color: '#ffec64' }}>G</span>
            </div>
            <div>
              <p className="text-sm font-black leading-tight" style={{ color: 'var(--text)' }}>
                Grit n Gain
              </p>
              <p className="text-[10px] text-gray-600 leading-tight">Digital Trainer</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand/10 text-brand border border-brand/20'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info footer */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
              style={{ background: '#ffec64', color: '#080808' }}
            >
              {firstName?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight truncate" style={{ color: 'var(--text)' }}>
                {user?.name || user?.username || 'Member'}
              </p>
              <p className="text-[10px] text-gray-600 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content area ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:ml-56 min-w-0">
        <main className="flex-1 overflow-y-auto">
          {/* Max-width wrapper — centers content on wide desktop screens */}
          <div className="md:max-w-3xl lg:max-w-4xl md:mx-auto">
            <Outlet />
          </div>
        </main>

        {/* ── Mobile bottom navigation ─────────────────────────── */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 px-2 z-50 border-t"
          style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--border)' }}
        >
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all touch-manipulation ${
                  isActive ? 'text-brand' : 'text-gray-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[10px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
