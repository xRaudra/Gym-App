import { supabase } from './supabase'

// ─── Session (device-local only) ─────────────────────────────────────────────
export function getCurrentUserId() {
  return localStorage.getItem('gp_current_user') || null
}
export function setCurrentUserId(id) {
  if (id) localStorage.setItem('gp_current_user', id)
  else localStorage.removeItem('gp_current_user')
}

// ─── User helpers ─────────────────────────────────────────────────────────────
function toAppUser(row) {
  if (!row) return null
  return { ...row, createdAt: row.created_at }
}

export async function getUsers() {
  const { data } = await supabase.from('users').select('*').order('created_at')
  return (data || []).map(toAppUser)
}

export async function getUserById(id) {
  const { data } = await supabase.from('users').select('*').eq('id', id).maybeSingle()
  return toAppUser(data)
}

export async function getUserByUsername(username) {
  const { data } = await supabase.from('users').select('*').ilike('username', username).maybeSingle()
  return toAppUser(data)
}

export async function getUserByEmail(email) {
  const { data } = await supabase.from('users').select('*').ilike('email', email).maybeSingle()
  return toAppUser(data)
}

export async function upsertUser(user) {
  const { createdAt, ...rest } = user
  await supabase.from('users').upsert({ ...rest, created_at: createdAt || user.created_at || new Date().toISOString() })
}

export async function deleteUser(id) {
  await supabase.from('users').delete().eq('id', id)
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
  const { data } = await supabase.from('tracking').select('*').eq('user_id', userId).eq('date', date).maybeSingle()
  return toAppTracking(data, userId, date)
}

export async function saveTodayTracking(userId, tracking) {
  const date = new Date().toISOString().split('T')[0]
  await supabase.from('tracking').upsert({
    id: `${userId}_${date}`,
    user_id: userId,
    date,
    exercises_completed: tracking.exercisesCompleted || [],
    meals_completed: tracking.mealsCompleted || [],
    protein_consumed: tracking.proteinConsumed || 0,
    calories_consumed: tracking.caloriesConsumed || 0,
  })
}

export async function getUserTrackingHistory(userId, days = 30) {
  const dates = []
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  const { data } = await supabase.from('tracking').select('*').eq('user_id', userId).in('date', dates)
  const map = {}
  if (data) data.forEach(r => { map[r.date] = r })
  return dates.reverse().map(date => toAppTracking(map[date] || null, userId, date))
}

// ─── Seed admin ───────────────────────────────────────────────────────────────
export async function seedAdminIfNeeded() {
  const { data } = await supabase.from('users').select('id').eq('username', 'xRaudra').maybeSingle()
  if (!data) {
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
