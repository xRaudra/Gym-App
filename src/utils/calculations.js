/**
 * BMI Calculation
 * @param {number} weightKg
 * @param {number} heightCm
 */
export function calcBMI(weightKg, heightCm) {
  const h = heightCm / 100
  return +(weightKg / (h * h)).toFixed(1)
}

export function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' }
  if (bmi < 25)   return { label: 'Healthy',     color: 'text-brand' }
  if (bmi < 30)   return { label: 'Overweight',  color: 'text-accent' }
  return           { label: 'Obese',             color: 'text-red-400' }
}

/**
 * BMR using Mifflin-St Jeor
 */
export function calcBMR(weightKg, heightCm, age, gender) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return gender === 'female' ? base - 161 : base + 5
}

/**
 * TDEE – moderately active (gym 3-5 days/week)
 */
export function calcTDEE(bmr) {
  return Math.round(bmr * 1.55)
}

/**
 * Calorie target based on goal
 */
export function calcCalorieTarget(tdee, goal) {
  if (goal === 'loss')  return Math.round(tdee - 400)
  if (goal === 'gain')  return Math.round(tdee + 300)
  return tdee
}

/**
 * Daily protein target (g)
 */
export function calcProteinTarget(weightKg, goal) {
  const multiplier = goal === 'loss' ? 2.0 : goal === 'gain' ? 1.8 : 1.6
  return Math.round(weightKg * multiplier)
}

/**
 * Full nutrition stats for a user profile
 */
export function calcNutrition(profile) {
  const { weight, height, age, gender, goal } = profile
  if (!weight || !height || !age) return null
  const bmi   = calcBMI(weight, height)
  const bmr   = calcBMR(weight, height, age, gender)
  const tdee  = calcTDEE(bmr)
  const calories = calcCalorieTarget(tdee, goal)
  const protein  = calcProteinTarget(weight, goal)
  return { bmi, bmr, tdee, calories, protein }
}

/**
 * Validate password strength
 */
export function validatePassword(pw) {
  const errors = []
  if (pw.length < 8)            errors.push('At least 8 characters')
  if (!/[A-Z]/.test(pw))        errors.push('One uppercase letter')
  if (!/[a-z]/.test(pw))        errors.push('One lowercase letter')
  if (!/[0-9]/.test(pw))        errors.push('One number')
  if (!/[^A-Za-z0-9]/.test(pw)) errors.push('One special character')
  return errors
}

/**
 * Day name helper
 */
export function getDayName(date = new Date()) {
  return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()]
}

export function getTodayDayIndex() {
  return new Date().getDay() // 0=Sun, 1=Mon, ...6=Sat
}

/**
 * Format date as readable string
 */
export function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Get percentage safely
 */
export function pct(consumed, target) {
  if (!target) return 0
  return Math.min(100, Math.round((consumed / target) * 100))
}
