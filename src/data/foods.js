// ─── Food Database ────────────────────────────────────────────────────────────
// Each item: { id, name, unit, calories, protein, tags[] }
// tags: 'veg' | 'non-veg' | 'egg' | 'carb' | 'fat'

export const FOODS = [
  // Veg Proteins
  { id: 'paneer',        name: 'Paneer (Cottage Cheese)', unit: '100g',   calories: 265, protein: 18, tags: ['veg'] },
  { id: 'tofu',          name: 'Tofu (Firm)',             unit: '100g',   calories: 76,  protein: 8,  tags: ['veg'] },
  { id: 'soya_chunks',   name: 'Soya Chunks (cooked)',    unit: '100g',   calories: 112, protein: 17, tags: ['veg'] },
  { id: 'chana_dal',     name: 'Chana Dal (cooked)',      unit: '1 cup',  calories: 270, protein: 15, tags: ['veg'] },
  { id: 'moong_dal',     name: 'Moong Dal (cooked)',      unit: '1 cup',  calories: 212, protein: 14, tags: ['veg'] },
  { id: 'rajma',         name: 'Rajma / Kidney Beans',    unit: '1 cup',  calories: 225, protein: 15, tags: ['veg'] },
  { id: 'chickpeas',     name: 'Boiled Chickpeas',        unit: '1 cup',  calories: 270, protein: 15, tags: ['veg'] },
  { id: 'greek_yogurt',  name: 'Greek Yogurt (low fat)',  unit: '200g',   calories: 120, protein: 17, tags: ['veg'] },
  { id: 'milk',          name: 'Full Cream Milk',         unit: '250ml',  calories: 150, protein: 8,  tags: ['veg'] },
  { id: 'peanut_butter', name: 'Peanut Butter',           unit: '2 tbsp', calories: 188, protein: 8,  tags: ['veg', 'fat'] },

  // Non-veg Proteins
  { id: 'chicken_breast',name: 'Chicken Breast (grilled)', unit: '150g',  calories: 248, protein: 47, tags: ['non-veg'] },
  { id: 'chicken_curry', name: 'Chicken Curry (home)',    unit: '1 bowl', calories: 280, protein: 30, tags: ['non-veg'] },
  { id: 'tuna',          name: 'Canned Tuna (in water)',  unit: '100g',   calories: 116, protein: 26, tags: ['non-veg'] },
  { id: 'salmon',        name: 'Grilled Salmon',          unit: '150g',   calories: 294, protein: 34, tags: ['non-veg', 'fat'] },
  { id: 'turkey_breast', name: 'Turkey Breast (grilled)', unit: '150g',   calories: 195, protein: 42, tags: ['non-veg'] },
  { id: 'whole_eggs',    name: 'Whole Eggs',              unit: '2 eggs', calories: 143, protein: 12, tags: ['non-veg', 'egg'] },
  { id: 'egg_whites',    name: 'Egg Whites',              unit: '4 whites',calories: 68, protein: 14, tags: ['non-veg', 'egg'] },
  { id: 'egg_bhurji',    name: 'Egg Bhurji (2 eggs)',     unit: '1 plate',calories: 200, protein: 14, tags: ['non-veg', 'egg'] },
  { id: 'boiled_eggs',   name: 'Boiled Eggs',             unit: '2 eggs', calories: 155, protein: 13, tags: ['non-veg', 'egg'] },

  // Carbs
  { id: 'oats',          name: 'Rolled Oats (cooked)',    unit: '100g dry',calories: 389,protein: 17, tags: ['veg', 'carb'] },
  { id: 'brown_rice',    name: 'Brown Rice (cooked)',     unit: '1 cup',  calories: 216, protein: 5,  tags: ['veg', 'carb'] },
  { id: 'white_rice',    name: 'White Rice (cooked)',     unit: '1 cup',  calories: 206, protein: 4,  tags: ['veg', 'carb'] },
  { id: 'roti',          name: 'Whole Wheat Roti',        unit: '2 pieces',calories: 200,protein: 6,  tags: ['veg', 'carb'] },
  { id: 'sweet_potato',  name: 'Boiled Sweet Potato',     unit: '150g',   calories: 129, protein: 3,  tags: ['veg', 'carb'] },
  { id: 'banana',        name: 'Banana',                  unit: '1 medium',calories: 105,protein: 1,  tags: ['veg', 'carb', 'fat'] },
  { id: 'bread',         name: 'Whole Wheat Bread',       unit: '2 slices',calories: 140,protein: 6,  tags: ['veg', 'carb'] },
  { id: 'quinoa',        name: 'Quinoa (cooked)',         unit: '1 cup',  calories: 222, protein: 8,  tags: ['veg', 'carb'] },

  // Fats / Snacks
  { id: 'almonds',       name: 'Almonds',                 unit: '30g (handful)',calories: 174,protein: 6, tags: ['veg', 'fat'] },
  { id: 'avocado',       name: 'Avocado',                 unit: '½ medium',calories: 160,protein: 2,  tags: ['veg', 'fat'] },
  { id: 'mixed_nuts',    name: 'Mixed Nuts',              unit: '30g',    calories: 173, protein: 5,  tags: ['veg', 'fat'] },

  // Veg Meals (complete)
  { id: 'dal_rice',      name: 'Dal + Rice + Sabzi',      unit: '1 plate',calories: 450, protein: 16, tags: ['veg'] },
  { id: 'paneer_curry',  name: 'Paneer Curry + Roti',     unit: '1 plate',calories: 500, protein: 22, tags: ['veg'] },
  { id: 'upma',          name: 'Vegetable Upma',          unit: '1 bowl', calories: 280, protein: 8,  tags: ['veg', 'carb'] },
  { id: 'poha',          name: 'Poha (with peanuts)',     unit: '1 bowl', calories: 250, protein: 7,  tags: ['veg', 'carb'] },
  { id: 'idli_sambar',   name: 'Idli + Sambar (3 idli)',  unit: '1 plate',calories: 320, protein: 10, tags: ['veg'] },
  { id: 'curd_rice',     name: 'Curd Rice',               unit: '1 bowl', calories: 280, protein: 9,  tags: ['veg'] },
  { id: 'veg_salad',     name: 'Mixed Veg Salad',         unit: '1 bowl', calories: 120, protein: 4,  tags: ['veg'] },
]

// ─── Meal Plan Generation ─────────────────────────────────────────────────────

function foodsFor(pref) {
  if (pref === 'veg')       return FOODS.filter(f => f.tags.includes('veg'))
  if (pref === 'eggetarian') return FOODS.filter(f => f.tags.includes('veg') || f.tags.includes('egg'))
  return FOODS // non-veg: all
}

// Distribute calories across meals: 25% / 10% / 30% / 15% / 20%
const MEAL_SLOTS = [
  { id: 'breakfast',  label: 'Breakfast',        time: '7:00 – 8:00 AM',  pct: 0.25 },
  { id: 'snack1',     label: 'Mid-Morning Snack', time: '10:30 – 11:00 AM',pct: 0.10 },
  { id: 'lunch',      label: 'Lunch',             time: '1:00 – 2:00 PM',  pct: 0.30 },
  { id: 'preworkout', label: 'Pre-Workout Snack', time: '4:30 – 5:00 PM',  pct: 0.15 },
  { id: 'dinner',     label: 'Dinner',            time: '7:30 – 8:30 PM',  pct: 0.20 },
]

// Hand-crafted meal plan templates keyed by dietaryPreference and slot
const MEAL_TEMPLATES = {
  veg: {
    breakfast: [
      { name: 'Oats with Milk & Banana',   items: ['oats', 'milk', 'banana'],           calories: 544, protein: 26 },
      { name: 'Paneer Bhurji + Roti',      items: ['paneer', 'roti'],                   calories: 465, protein: 24 },
      { name: 'Poha with Peanuts + Milk',  items: ['poha', 'milk', 'peanut_butter'],    calories: 538, protein: 23 },
    ],
    snack1: [
      { name: 'Almonds + Greek Yogurt',    items: ['almonds', 'greek_yogurt'],           calories: 294, protein: 23 },
      { name: 'Banana + Peanut Butter',    items: ['banana', 'peanut_butter'],           calories: 293, protein: 9  },
      { name: 'Mixed Nuts + Milk',         items: ['mixed_nuts', 'milk'],                calories: 323, protein: 13 },
    ],
    lunch: [
      { name: 'Dal + Brown Rice + Sabzi',  items: ['chana_dal', 'brown_rice', 'veg_salad'],calories: 636, protein: 24 },
      { name: 'Rajma + Roti + Curd',       items: ['rajma', 'roti', 'greek_yogurt'],     calories: 665, protein: 39 },
      { name: 'Paneer Curry + Roti',       items: ['paneer_curry'],                      calories: 500, protein: 22 },
    ],
    preworkout: [
      { name: 'Sweet Potato + Soya Chunks',items: ['sweet_potato', 'soya_chunks'],       calories: 241, protein: 20 },
      { name: 'Bread + Peanut Butter',     items: ['bread', 'peanut_butter'],            calories: 328, protein: 14 },
      { name: 'Banana + Greek Yogurt',     items: ['banana', 'greek_yogurt'],            calories: 225, protein: 18 },
    ],
    dinner: [
      { name: 'Moong Dal + Roti + Salad',  items: ['moong_dal', 'roti', 'veg_salad'],   calories: 532, protein: 24 },
      { name: 'Tofu Stir-Fry + Quinoa',   items: ['tofu', 'quinoa', 'veg_salad'],       calories: 418, protein: 19 },
      { name: 'Chickpea Curry + Brown Rice',items: ['chickpeas', 'brown_rice'],          calories: 486, protein: 20 },
    ],
  },
  'non-veg': {
    breakfast: [
      { name: 'Egg Omelette + Brown Bread + Milk',items: ['whole_eggs', 'bread', 'milk'],calories: 443, protein: 30 },
      { name: 'Oats with Milk & Banana',   items: ['oats', 'milk', 'banana'],           calories: 544, protein: 26 },
      { name: 'Egg Bhurji + Roti + Milk',  items: ['egg_bhurji', 'roti', 'milk'],       calories: 500, protein: 28 },
    ],
    snack1: [
      { name: 'Almonds + Boiled Eggs',     items: ['almonds', 'boiled_eggs'],            calories: 329, protein: 19 },
      { name: 'Tuna + Whole Wheat Bread',  items: ['tuna', 'bread'],                    calories: 256, protein: 32 },
      { name: 'Greek Yogurt + Nuts',       items: ['greek_yogurt', 'almonds'],           calories: 294, protein: 23 },
    ],
    lunch: [
      { name: 'Chicken Breast + Rice + Salad', items: ['chicken_breast','brown_rice','veg_salad'],calories: 584, protein: 56 },
      { name: 'Chicken Curry + Roti',      items: ['chicken_curry', 'roti'],             calories: 480, protein: 36 },
      { name: 'Grilled Salmon + Quinoa',   items: ['salmon', 'quinoa', 'veg_salad'],    calories: 636, protein: 41 },
    ],
    preworkout: [
      { name: 'Banana + Boiled Eggs',      items: ['banana', 'boiled_eggs'],             calories: 260, protein: 14 },
      { name: 'Bread + Peanut Butter + Egg Whites', items: ['bread', 'peanut_butter', 'egg_whites'], calories: 396, protein: 28 },
      { name: 'Sweet Potato + Tuna',       items: ['sweet_potato', 'tuna'],              calories: 245, protein: 29 },
    ],
    dinner: [
      { name: 'Grilled Chicken + Sweet Potato + Salad', items: ['chicken_breast','sweet_potato','veg_salad'], calories: 497, protein: 54 },
      { name: 'Turkey Breast + Quinoa',    items: ['turkey_breast', 'quinoa'],           calories: 417, protein: 50 },
      { name: 'Dal + Chicken + Roti',      items: ['moong_dal', 'chicken_breast', 'roti'], calories: 655, protein: 68 },
    ],
  },
  eggetarian: {
    breakfast: [
      { name: 'Egg White Omelette + Oats + Milk', items: ['egg_whites','oats','milk'],  calories: 607, protein: 39 },
      { name: 'Egg Bhurji + Roti + Milk',  items: ['egg_bhurji', 'roti', 'milk'],       calories: 500, protein: 28 },
      { name: 'Paneer Paratha + Greek Yogurt', items: ['paneer', 'roti', 'greek_yogurt'],calories: 505, protein: 35 },
    ],
    snack1: [
      { name: 'Boiled Eggs + Almonds',     items: ['boiled_eggs', 'almonds'],            calories: 329, protein: 19 },
      { name: 'Greek Yogurt + Banana',     items: ['greek_yogurt', 'banana'],            calories: 225, protein: 18 },
      { name: 'Egg Whites + Bread',        items: ['egg_whites', 'bread'],              calories: 208, protein: 20 },
    ],
    lunch: [
      { name: 'Egg Curry + Brown Rice + Salad',  items: ['whole_eggs', 'brown_rice', 'veg_salad'],calories: 469, protein: 21 },
      { name: 'Paneer Curry + Roti + Greek Yogurt',items: ['paneer_curry', 'greek_yogurt'],calories: 620, protein: 39 },
      { name: 'Dal + Quinoa + Boiled Eggs',items: ['chana_dal', 'quinoa', 'boiled_eggs'],calories: 647, protein: 36 },
    ],
    preworkout: [
      { name: 'Banana + Boiled Eggs',      items: ['banana', 'boiled_eggs'],             calories: 260, protein: 14 },
      { name: 'Sweet Potato + Egg Whites', items: ['sweet_potato', 'egg_whites'],        calories: 197, protein: 17 },
      { name: 'Bread + Peanut Butter + Egg', items: ['bread', 'peanut_butter', 'whole_eggs'],calories: 471, protein: 26 },
    ],
    dinner: [
      { name: 'Moong Dal + Egg Bhurji + Roti', items: ['moong_dal','egg_bhurji','roti'],calories: 612, protein: 36 },
      { name: 'Paneer + Quinoa + Salad',   items: ['paneer', 'quinoa', 'veg_salad'],    calories: 507, protein: 27 },
      { name: 'Egg White Omelette + Dal + Roti', items: ['egg_whites','chana_dal','roti'],calories: 538, protein: 37 },
    ],
  },
}

/**
 * Generate a full day meal plan.
 * Returns array of 5 meals, each with { id, label, time, name, items, calories, protein }
 * Scales closest template to hit calorie/protein targets per slot.
 */
export function generateDietPlan(dietaryPreference, calorieTarget, proteinTarget) {
  const pref = dietaryPreference || 'veg'
  const templates = MEAL_TEMPLATES[pref] || MEAL_TEMPLATES['veg']

  // Pick a consistent set (use same index each day for consistency — can rotate by weekday later)
  const day = new Date().getDay() % 3  // 0,1,2 rotation

  return MEAL_SLOTS.map(slot => {
    const slotTemplates = templates[slot.id]
    const chosen = slotTemplates[day % slotTemplates.length]
    const targetCal = Math.round(calorieTarget * slot.pct)

    // Scale the template by a ratio to better match target calories
    const ratio = Math.max(0.7, Math.min(1.4, targetCal / chosen.calories))
    const scaledCals = Math.round(chosen.calories * ratio)
    const scaledProt = Math.round(chosen.protein * ratio)

    // Build items display
    const items = chosen.items.map(id => FOODS.find(f => f.id === id)).filter(Boolean)

    return {
      id: slot.id,
      label: slot.label,
      time: slot.time,
      name: chosen.name,
      items,
      calories: scaledCals,
      protein: scaledProt,
      scaleFactor: +ratio.toFixed(2),
    }
  })
}

// Get total macros for a plan
export function planTotals(meals) {
  return meals.reduce((acc, m) => ({ calories: acc.calories + m.calories, protein: acc.protein + m.protein }), { calories: 0, protein: 0 })
}
