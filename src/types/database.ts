
import { Json } from "@/integrations/supabase/types";

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
