
export interface NutritionIngredient {
  id: string;
  name: string;
  category: string;
  benefits: string[];
  nutrients: string[];
  description?: string;
  imageUrl?: string;
  user_id?: string;
  created_at?: string;
}

export interface NutritionSupplement {
  id: string;
  name: string;
  category: string;
  benefits: string[];
  dosage: string;
  description?: string;
  warning?: string;
  imageUrl?: string;
  user_id?: string;
  created_at?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  difficulty_level?: string;
  image_url?: string;
  instructions?: RecipeInstruction[];
  nutritional_info?: RecipeNutrition;
  tags?: string[];
  health_benefits?: string[];
  user_id?: string;
  created_at?: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  name: string;
  amount?: string;
  unit?: string;
  created_at?: string;
}

export interface RecipeInstruction {
  step: number;
  text: string;
}

export interface RecipeNutrition {
  kalorier: number;
  protein: number;
  karbohydrater: number;
  fett: number;
  [key: string]: number;
}

export interface HealthIssueNutrition {
  id: string;
  health_issue_id: string;
  ingredient_id?: string;
  supplement_id?: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  created_at?: string;
}

export interface HealthIssueRecipe {
  id: string;
  health_issue_id: string;
  recipe_id: string;
  reason?: string;
  priority?: string;
  created_at?: string;
}
