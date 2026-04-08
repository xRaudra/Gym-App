import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { TrackingProvider } from './contexts/TrackingContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import WelcomePage      from './pages/WelcomePage'
import IntroSliderPage  from './pages/IntroSliderPage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import OnboardingPage   from './pages/OnboardingPage'
import DashboardPage  from './pages/DashboardPage'
import WorkoutPage    from './pages/WorkoutPage'
import DietPage       from './pages/DietPage'
import ProgressPage   from './pages/ProgressPage'
import ProfilePage    from './pages/ProfilePage'
import AdminPage      from './pages/AdminPage'

// Guard: redirect to login if not authenticated
function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return <Navigate to="/welcome" replace />
  if (!user.profile?.completedOnboarding) return <Navigate to="/onboarding" replace />
  return children
}

// Guard: redirect to dashboard if already authenticated
function RequireGuest({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user && user.profile?.completedOnboarding) return <Navigate to="/dashboard" replace />
  return children
}

// Guard: admin only
function RequireAdmin({ children }) {
  const { user } = useAuth()
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/welcome"  element={<RequireGuest><WelcomePage /></RequireGuest>} />
      <Route path="/intro"    element={<RequireGuest><IntroSliderPage /></RequireGuest>} />
      <Route path="/login"    element={<RequireGuest><LoginPage /></RequireGuest>} />
      <Route path="/register" element={<RequireGuest><RegisterPage /></RequireGuest>} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Protected — wrapped in layout */}
      <Route path="/" element={<RequireAuth><TrackingProvider><Layout /></TrackingProvider></RequireAuth>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="workout"   element={<WorkoutPage />} />
        <Route path="diet"      element={<DietPage />} />
        <Route path="progress"  element={<ProgressPage />} />
        <Route path="profile"   element={<ProfilePage />} />
        <Route path="admin"     element={<RequireAdmin><AdminPage /></RequireAdmin>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
