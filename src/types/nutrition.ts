
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

export interface HealthIssueNutrition {
  id: string;
  health_issue_id: string;
  ingredient_id?: string;
  supplement_id?: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  created_at?: string;
}
