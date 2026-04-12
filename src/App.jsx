import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { TrackingProvider } from './contexts/TrackingContext'
import { ThemeProvider } from './contexts/ThemeContext'
import GymLoader from './components/GymLoader'

// Lazy-load every page — each becomes its own JS chunk
const Layout        = lazy(() => import('./components/Layout'))
const WelcomePage   = lazy(() => import('./pages/WelcomePage'))
const LoginPage     = lazy(() => import('./pages/LoginPage'))
const RegisterPage  = lazy(() => import('./pages/RegisterPage'))
const OnboardingPage= lazy(() => import('./pages/OnboardingPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const WorkoutPage   = lazy(() => import('./pages/WorkoutPage'))
const DietPage      = lazy(() => import('./pages/DietPage'))
const ProgressPage  = lazy(() => import('./pages/ProgressPage'))
const ProfilePage   = lazy(() => import('./pages/ProfilePage'))
const AdminPage     = lazy(() => import('./pages/AdminPage'))

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <GymLoader />
  if (!user) return <Navigate to="/welcome" replace />
  if (!user.profile?.completedOnboarding) return <Navigate to="/onboarding" replace />
  return children
}

function RequireGuest({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <GymLoader />
  if (user && user.profile?.completedOnboarding) return <Navigate to="/dashboard" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user } = useAuth()
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Suspense fallback={<GymLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/welcome"    element={<RequireGuest><WelcomePage /></RequireGuest>} />
        <Route path="/login"      element={<RequireGuest><LoginPage /></RequireGuest>} />
        <Route path="/register"   element={<RequireGuest><RegisterPage /></RequireGuest>} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected */}
        <Route path="/" element={
          <RequireAuth>
            <TrackingProvider>
              <Layout />
            </TrackingProvider>
          </RequireAuth>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="workout"   element={<WorkoutPage />} />
          <Route path="diet"      element={<DietPage />} />
          <Route path="progress"  element={<ProgressPage />} />
          <Route path="profile"   element={<ProfilePage />} />
          <Route path="admin"     element={<RequireAdmin><AdminPage /></RequireAdmin>} />
        </Route>

        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </Suspense>
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
