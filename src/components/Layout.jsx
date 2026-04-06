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
  const nav = user?.role === 'admin' ? ADMIN_NAV : MEMBER_NAV

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A]">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-[#2A2A2A] flex justify-around items-center h-16 px-2 z-50 safe-area-inset-bottom">
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
  )
}
