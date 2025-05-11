
import { supabase } from "./client";
import type { Database } from "@/types/database";

// Create a type-safe client that includes our custom tables
export const db = supabase;

// Use any type casting to avoid TypeScript errors with tables that aren't properly typed yet
export const tables = {
  healthCheckins: () => supabase.from('health_checkins') as any,
  userPlans: () => supabase.from('user_plans') as any,
  planRecommendations: () => supabase.from('plan_recommendations') as any,
};
