
import { supabase } from "./client";
import type { Database } from "@/types/database";

// Create a type-safe client that includes our custom tables
export const db = supabase;

// Type-safe table accessors - we're using direct supabase client access instead
// of creating typed wrappers since TypeScript is having issues with the type definitions
export const tables = {
  healthCheckins: () => supabase.from("health_checkins") as any,
  userPlans: () => supabase.from("user_plans") as any,
  planRecommendations: () => supabase.from("plan_recommendations") as any,
};
