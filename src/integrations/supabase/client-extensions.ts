
import { supabase } from "./client";
import type { Database } from "@/types/database";

// Create a type-safe client that includes our custom tables
export const db = supabase;

// Use explicit type casting to avoid TypeScript errors
export const tables = {
  healthCheckins: () => supabase.from('health_checkins') as unknown as ReturnType<typeof supabase.from>,
  userPlans: () => supabase.from('user_plans') as unknown as ReturnType<typeof supabase.from>,
  planRecommendations: () => supabase.from('plan_recommendations') as unknown as ReturnType<typeof supabase.from>,
};
