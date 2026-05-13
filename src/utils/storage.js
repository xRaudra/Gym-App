import { supabase } from './supabase'

// ─── Session ──────────────────────────────────────────────────────────────────
export function getCurrentUserId() {
  return localStorage.getItem('gp_current_user') || null
}
export function setCurrentUserId(id) {
  if (id) localStorage.setItem('gp_current_user', id)
  else localStorage.removeItem('gp_current_user')
}

// ─── Local users store (source of truth, never wiped on logout) ──────────────
const LOCAL_USERS_KEY = 'gp_users_db'

function getLocalUsers() {
  try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || [] } catch { return [] }
}
function saveLocalUsers(users) {
  try { localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users)) } catch {}
}
function putLocalUser(user) {
  if (!user?.id) return
  const users = getLocalUsers()
  const i = users.findIndex(u => u.id === user.id)
  if (i >= 0) users[i] = user
  else users.push(user)
  saveLocalUsers(users)
}
function removeLocalUser(id) {
  saveLocalUsers(getLocalUsers().filter(u => u.id !== id))
}

// ─── Supabase row → app object ────────────────────────────────────────────────
function toAppUser(row) {
  if (!row) return null
  return { ...row, createdAt: row.created_at }
}

// ─── Supabase sync (best-effort, errors never crash the app) ─────────────────
async function syncUserToSupabase(user) {
  try {
    const { createdAt, ...rest } = user
    const { error } = await supabase
      .from('users')
      .upsert({ ...rest, created_at: createdAt || user.created_at || new Date().toISOString() })
    if (error) console.warn('[storage] Supabase upsert failed, using local store:', error.message)
  } catch (e) {
    console.warn('[storage] Supabase unreachable, using local store:', e.message)
  }
}

// ─── User helpers ─────────────────────────────────────────────────────────────
export async function getUsers() {
  // Try Supabase first for admin page (needs all users)
  try {
    const { data, error } = await supabase.from('users').select('*').order('created_at')
    if (!error && data?.length) {
      // Sync any new Supabase users into local store
      data.forEach(row => putLocalUser(toAppUser(row)))
      return data.map(toAppUser)
    }
  } catch {}
  // Fall back to local store
  return getLocalUsers()
}

export async function getUserById(id) {
  if (!id) return null
  // Local first — always fast and reliable
  const local = getLocalUsers().find(u => u.id === id)
  if (local) return local
  // Try Supabase as fallback
  try {
    const { data } = await supabase.from('users').select('*').eq('id', id).maybeSingle()
    if (data) { putLocalUser(toAppUser(data)); return toAppUser(data) }
  } catch {}
  return null
}

export async function getUserByUsername(username) {
  if (!username) return null
  const lower = username.toLowerCase()
  // Local first
  const local = getLocalUsers().find(u => u.username?.toLowerCase() === lower)
  if (local) return local
  // Supabase fallback
  try {
    const { data } = await supabase.from('users').select('*').ilike('username', username).maybeSingle()
    if (data) { putLocalUser(toAppUser(data)); return toAppUser(data) }
  } catch {}
  return null
}

export async function getUserByEmail(email) {
  if (!email) return null
  const lower = email.toLowerCase()
  // Local first
  const local = getLocalUsers().find(u => u.email?.toLowerCase() === lower)
  if (local) return local
  // Supabase fallback
  try {
    const { data } = await supabase.from('users').select('*').ilike('email', email).maybeSingle()
    if (data) { putLocalUser(toAppUser(data)); return toAppUser(data) }
  } catch {}
  return null
}

export async function upsertUser(user) {
  // Always write to local store first — this is what keeps auth reliable
  putLocalUser(user)
  // Best-effort sync to Supabase
  await syncUserToSupabase(user)
}

export async function deleteUser(id) {
  removeLocalUser(id)
  try {
    await supabase.from('users').delete().eq('id', id)
  } catch (e) {
    console.warn('[storage] Supabase delete failed:', e.message)
  }
}

export async function getCurrentUser() {
  const id = getCurrentUserId()
  return id ? getUserById(id) : null
}

// ─── Tracking ─────────────────────────────────────────────────────────────────
function toAppTracking(row, userId, date) {
  if (!row) return {
    userId, date,
    exercisesCompleted: [],
    mealsCompleted: [],
    proteinConsumed: 0,
    caloriesConsumed: 0,
  }
  return {
    userId: row.user_id,
    date: row.date,
    exercisesCompleted: row.exercises_completed || [],
    mealsCompleted: row.meals_completed || [],
    proteinConsumed: row.protein_consumed || 0,
    caloriesConsumed: row.calories_consumed || 0,
  }
}

export async function getTodayTracking(userId) {
  const date = new Date().toISOString().split('T')[0]
  try {
    const { data } = await supabase.from('tracking').select('*').eq('user_id', userId).eq('date', date).maybeSingle()
    return toAppTracking(data, userId, date)
  } catch {
    return toAppTracking(null, userId, date)
  }
}

export async function saveTodayTracking(userId, tracking) {
  const date = new Date().toISOString().split('T')[0]
  try {
    await supabase.from('tracking').upsert({
      id: `${userId}_${date}`,
      user_id: userId,
      date,
      exercises_completed: tracking.exercisesCompleted || [],
      meals_completed: tracking.mealsCompleted || [],
      protein_consumed: tracking.proteinConsumed || 0,
      calories_consumed: tracking.caloriesConsumed || 0,
    })
  } catch (e) {
    console.warn('[storage] Tracking save failed:', e.message)
  }
}

export async function getUserTrackingHistory(userId, days = 30) {
  const dates = []
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  try {
    const { data } = await supabase.from('tracking').select('*').eq('user_id', userId).in('date', dates)
    const map = {}
    if (data) data.forEach(r => { map[r.date] = r })
    return dates.reverse().map(date => toAppTracking(map[date] || null, userId, date))
  } catch {
    return dates.reverse().map(date => toAppTracking(null, userId, date))
  }
}

// ─── Seed admin ───────────────────────────────────────────────────────────────
export async function seedAdminIfNeeded() {
  const existing = await getUserByUsername('xRaudra')
  if (!existing) {
    await upsertUser({
      id: 'admin_xraudra',
      username: 'xRaudra',
      email: 'admin@gritngain.app',
      password: 'Qwerty@12345',
      role: 'admin',
      name: 'Saurabh Pandey',
      profile: {
        gender: 'male',
        age: 28,
        height: 175,
        weight: 75,
        dietaryPreference: 'non-veg',
        preferredFoods: ['chicken_breast', 'eggs', 'oats', 'banana', 'almonds'],
        goal: 'maintenance',
        workOnSunday: false,
        completedOnboarding: true,
      },
      createdAt: new Date().toISOString(),
    })
  }
}
