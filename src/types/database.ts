
import { Json } from "@/integrations/supabase/types";

// Define interface for the Database to extend Supabase types
export interface Database {
  public: {
    Tables: {
      health_checkins: {
        Row: HealthCheckIn;
        Insert: Omit<HealthCheckIn, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<HealthCheckIn, 'id' | 'user_id'>>;
      };
      user_plans: {
        Row: UserPlan;
        Insert: Omit<UserPlan, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<UserPlan, 'id' | 'user_id'>>;
      };
      plan_recommendations: {
        Row: PlanRecommendation;
        Insert: Omit<PlanRecommendation, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<PlanRecommendation, 'id' | 'plan_id'>>;
      };
      user_preferences: {
        Row: UserPreference;
        Insert: Omit<UserPreference, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<UserPreference, 'user_id'>>;
      };
      user_progress: {
        Row: UserProgress;
        Insert: Omit<UserProgress, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<UserProgress, 'id' | 'user_id'>>;
      };
      recipes: {
        Row: Recipe;
        Insert: Omit<Recipe, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Recipe, 'id'>>;
      };
      recipe_ingredients: {
        Row: RecipeIngredient;
        Insert: Omit<RecipeIngredient, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<RecipeIngredient, 'id' | 'recipe_id'>>;
      };
      health_issue_recipes: {
        Row: HealthIssueRecipe;
        Insert: Omit<HealthIssueRecipe, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<HealthIssueRecipe, 'id'>>;
      };
      // Include existing tables
      chat_messages: any;
      coherence_data: any;
      scans: any;
      health_issues: any;
      health_systems: any;
      issue_details: any;
      issue_recommendations: any;
      profiles: any;
      scanner_components: any;
    };
  };
}

// Define types for health check-ins
export interface HealthCheckIn {
  id: string;
  user_id: string;
  date: string;
  mood: number;
  energy_level: number;
  sleep_quality: number;
  pain_level: number | null;
  symptoms: string[] | null;
  notes: string | null;
  created_at: string;
}

// Define types for user plans
export interface UserPlan {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  status: string;
  created_at: string;
}

// Define types for plan recommendations
export interface PlanRecommendation {
  id: string;
  plan_id: string;
  text: string;
  category: string;
  priority: string;
  completed: boolean;
  completed_at: string | null;
  due_date: string | null;
  source: string | null;
  issue_id: string | null;
  created_at: string;
  explanation?: string | null; // Added the missing explanation property
}

// Define types for user preferences
export interface UserPreference {
  user_id: string;
  notification_settings: Json;
  theme: string;
  language: string;
  health_goals: string[] | null;
  created_at: string;
  updated_at: string;
}

// Define types for user progress
export interface UserProgress {
  id: string;
  user_id: string;
  date: string;
  score: number;
  notes: string | null;
  created_at: string;
}

// Define types for recipes
export interface Recipe {
  id: string;
  name: string;
  description: string | null;
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  difficulty_level: string | null;
  image_url: string | null;
  instructions: Json | null;
  nutritional_info: Json | null;
  tags: string[] | null;
  health_benefits: string[] | null;
  user_id: string | null;
  created_at: string;
}

// Define types for recipe ingredients
export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  name: string;
  amount: string | null;
  unit: string | null;
  created_at: string;
}

// Define types for health issue recipes
export interface HealthIssueRecipe {
  id: string;
  health_issue_id: string;
  recipe_id: string;
  reason: string | null;
  priority: string | null;
  created_at: string;
}
