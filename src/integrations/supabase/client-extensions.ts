
import { supabase } from "./client";
import type { Database } from "@/types/database";

// Create a type-safe client that includes our custom tables
export const db = supabase;

// Use explicit casting to avoid TypeScript errors for tables not yet in the generated types
export const tables = {
  healthCheckins: () => supabase.from('health_checkins') as any,
  userPlans: () => supabase.from('user_plans') as any,
  planRecommendations: () => supabase.from('plan_recommendations') as any,
  chatMessages: () => supabase.from('chat_messages'),
  healthIssues: () => supabase.from('health_issues'),
};
