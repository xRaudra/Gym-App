import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getTodayTracking, saveTodayTracking, getUserTrackingHistory } from '../utils/storage'
import { useAuth } from './AuthContext'

const TrackingContext = createContext(null)

export function TrackingProvider({ children }) {
  const { user } = useAuth()
  const [today, setToday] = useState(null)
  const [history, setHistory] = useState([])

  const loadToday = useCallback(() => {
    if (!user) return
    setToday(getTodayTracking(user.id))
  }, [user])

  const loadHistory = useCallback(() => {
    if (!user) return
    setHistory(getUserTrackingHistory(user.id, 30))
  }, [user])

  useEffect(() => {
    loadToday()
    loadHistory()
  }, [loadToday, loadHistory])

  const toggleExercise = useCallback((exerciseId) => {
    if (!user || !today) return
    const list = today.exercisesCompleted || []
    const updated = list.includes(exerciseId)
      ? list.filter(id => id !== exerciseId)
      : [...list, exerciseId]
    const next = { ...today, exercisesCompleted: updated }
    setToday(next)
    saveTodayTracking(user.id, next)
  }, [user, today])

  const toggleMeal = useCallback((mealId, mealCalories, mealProtein) => {
    if (!user || !today) return
    const list = today.mealsCompleted || []
    const wasCompleted = list.includes(mealId)
    const updated = wasCompleted
      ? list.filter(id => id !== mealId)
      : [...list, mealId]
    const next = {
      ...today,
      mealsCompleted: updated,
      caloriesConsumed: Math.max(0,
        wasCompleted
          ? (today.caloriesConsumed || 0) - mealCalories
          : (today.caloriesConsumed || 0) + mealCalories
      ),
      proteinConsumed: Math.max(0,
        wasCompleted
          ? (today.proteinConsumed || 0) - mealProtein
          : (today.proteinConsumed || 0) + mealProtein
      ),
    }
    setToday(next)
    saveTodayTracking(user.id, next)
    loadHistory()
  }, [user, today, loadHistory])

  const resetToday = useCallback(() => {
    if (!user) return
    const fresh = {
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      exercisesCompleted: [],
      mealsCompleted: [],
      proteinConsumed: 0,
      caloriesConsumed: 0,
    }
    setToday(fresh)
    saveTodayTracking(user.id, fresh)
    loadHistory()
  }, [user, loadHistory])

  return (
    <TrackingContext.Provider value={{ today, history, toggleExercise, toggleMeal, resetToday, loadToday, loadHistory }}>
      {children}
    </TrackingContext.Provider>
  )
}

export function useTracking() {
  const ctx = useContext(TrackingContext)
  if (!ctx) throw new Error('useTracking must be inside TrackingProvider')
  return ctx
}
