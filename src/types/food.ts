export type Rarity = 'C' | 'UC' | 'SR' | 'SSR';

export type MealTime = 'breakfast' | 'lunch' | 'afternoon' | 'dinner' | 'all';

export type DietaryType = 'all' | 'vegan' | 'vegetarian' | 'meat' | 'eatclean' | 'keto' | 'lowcarb';

export type HealthGoal = 'balanced' | 'muscle_gain' | 'weight_loss' | 'detox';

export type TimePeriod = 'morning' | 'midday' | 'afternoon' | 'night';

export interface NutritionInfo {
  calories: number; // kcal
  protein: number;  // g
  carbs: number;    // g
  fat: number;      // g
  fiber: number;    // g
  sodium?: number;  // mg
  keyVitamins?: string[];
}

export interface FoodItem {
  id: string;
  name: {
    vi: string;
    en: string;
  };
  subtitle: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  image: string;
  category: {
    vi: string;
    en: string;
  };
  mealTime: MealTime[];
  dietaryType: DietaryType;
  goal: HealthGoal[];
  rarity: Rarity;
  prepTimeMinutes: number;
  nutrition: NutritionInfo;
  healthBenefits: {
    vi: string[];
    en: string[];
  };
  ingredients: {
    vi: string[];
    en: string[];
  };
  isFavorite?: boolean;
}

export interface FilterOptions {
  count: number; // 1, 3, 5
  dietary: DietaryType;
  goal: HealthGoal | 'all';
  mealTime: MealTime | 'auto';
}
