// Keys
export const KEYS = {
  USERS: 'gp_users',
  CURRENT_USER: 'gp_current_user',
  TRACKING: 'gp_tracking',
}

// --- Users ---
export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]')
  } catch {
    return []
  }
}

export function saveUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users))
}

export function getUserById(id) {
  return getUsers().find(u => u.id === id) || null
}

export function getUserByUsername(username) {
  return getUsers().find(u => u.username.toLowerCase() === username.toLowerCase()) || null
}

export function getUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null
}

export function upsertUser(user) {
  const users = getUsers()
  const idx = users.findIndex(u => u.id === user.id)
  if (idx >= 0) users[idx] = user
  else users.push(user)
  saveUsers(users)
}

export function deleteUser(id) {
  saveUsers(getUsers().filter(u => u.id !== id))
}

// --- Current session ---
export function getCurrentUserId() {
  return localStorage.getItem(KEYS.CURRENT_USER) || null
}

export function setCurrentUserId(id) {
  if (id) localStorage.setItem(KEYS.CURRENT_USER, id)
  else localStorage.removeItem(KEYS.CURRENT_USER)
}

export function getCurrentUser() {
  const id = getCurrentUserId()
  return id ? getUserById(id) : null
}

// --- Daily Tracking ---
export function getTodayKey(userId) {
  const today = new Date().toISOString().split('T')[0]
  return `${userId}_${today}`
}

export function getDateKey(userId, date) {
  return `${userId}_${date}`
}

export function getAllTracking() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.TRACKING) || '{}')
  } catch {
    return {}
  }
}

export function getTracking(key) {
  return getAllTracking()[key] || null
}

export function getTodayTracking(userId) {
  return getTracking(getTodayKey(userId)) || {
    userId,
    date: new Date().toISOString().split('T')[0],
    exercisesCompleted: [],
    mealsCompleted: [],
    proteinConsumed: 0,
    caloriesConsumed: 0,
  }
}

export function saveTracking(key, data) {
  const all = getAllTracking()
  all[key] = data
  localStorage.setItem(KEYS.TRACKING, JSON.stringify(all))
}

export function saveTodayTracking(userId, data) {
  saveTracking(getTodayKey(userId), data)
}

export function getUserTrackingHistory(userId, days = 30) {
  const all = getAllTracking()
  const result = []
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const date = d.toISOString().split('T')[0]
    const key = getDateKey(userId, date)
    result.push({ date, ...(all[key] || { exercisesCompleted: [], mealsCompleted: [], proteinConsumed: 0, caloriesConsumed: 0 }) })
  }
  return result.reverse()
}

// --- Seed admin on first run ---
export function seedAdminIfNeeded() {
  const users = getUsers()
  if (!users.find(u => u.username === 'xRaudra')) {
    upsertUser({
      id: 'admin_xraudra',
      username: 'xRaudra',
      email: 'admin@gympro.app',
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
