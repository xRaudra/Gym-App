import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getCurrentUser, setCurrentUserId, getUserByUsername,
  getUserByEmail, upsertUser, seedAdminIfNeeded,
} from '../utils/storage'
import { validatePassword } from '../utils/calculations'

const AuthContext = createContext(null)

const USER_CACHE_KEY = 'gp_user_cache'

function getCachedUser() {
  try { return JSON.parse(localStorage.getItem(USER_CACHE_KEY)) } catch { return null }
}
function setCachedUser(u) {
  if (u) localStorage.setItem(USER_CACHE_KEY, JSON.stringify(u))
  else localStorage.removeItem(USER_CACHE_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCachedUser())  // instant load from cache
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      await seedAdminIfNeeded()
      const u = await getCurrentUser()
      setUser(u)
      setCachedUser(u)
      setLoading(false)
    }
    init()
  }, [])

  const login = useCallback(async (username, password) => {
    const found = await getUserByUsername(username)
    if (!found) return { ok: false, error: 'Username not found.' }
    if (found.password !== password) return { ok: false, error: 'Incorrect password.' }
    setCurrentUserId(found.id)
    setUser(found)
    setCachedUser(found)
    return { ok: true, user: found }
  }, [])

  const register = useCallback(async (data) => {
    const { username, email, password, name } = data
    if (!username || !email || !password || !name)
      return { ok: false, error: 'All fields are required.' }
    if (await getUserByUsername(username))
      return { ok: false, error: 'Username already taken.' }
    if (await getUserByEmail(email))
      return { ok: false, error: 'Email already registered.' }
    const pwErrors = validatePassword(password)
    if (pwErrors.length) return { ok: false, error: `Password must include: ${pwErrors.join(', ')}.` }

    const newUser = {
      id: `user_${Date.now()}`,
      username, email, password, name,
      role: 'member',
      profile: {
        gender: '',
        age: '',
        height: '',
        weight: '',
        dietaryPreference: '',
        preferredFoods: [],
        goal: 'maintenance',
        workOnSunday: false,
        completedOnboarding: false,
      },
      createdAt: new Date().toISOString(),
    }
    await upsertUser(newUser)
    setCurrentUserId(newUser.id)
    setUser(newUser)
    return { ok: true, user: newUser }
  }, [])

  const logout = useCallback(() => {
    setCurrentUserId(null)
    setUser(null)
    setCachedUser(null)
  }, [])

  const updateProfile = useCallback(async (profileData) => {
    if (!user) return
    const updated = { ...user, profile: { ...user.profile, ...profileData } }
    await upsertUser(updated)
    setUser(updated)
    setCachedUser(updated)
  }, [user])

  const updateUser = useCallback(async (fields) => {
    if (!user) return { ok: true }
    if (fields.newPassword) {
      const pwErrors = validatePassword(fields.newPassword)
      if (pwErrors.length) return { ok: false, error: `Password must include: ${pwErrors.join(', ')}.` }
      if (fields.currentPassword && user.password !== fields.currentPassword)
        return { ok: false, error: 'Current password is incorrect.' }
    }
    const { newPassword, currentPassword, confirmPassword, ...rest } = fields
    const updated = {
      ...user,
      ...rest,
      ...(newPassword ? { password: newPassword } : {}),
    }
    await upsertUser(updated)
    setUser(updated)
    setCachedUser(updated)
    return { ok: true }
  }, [user])

  const refreshUser = useCallback(async () => {
    const u = await getCurrentUser()
    setUser(u)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
