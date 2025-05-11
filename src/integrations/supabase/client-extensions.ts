
import { supabase } from "./client";
import type { Database } from "@/types/database";

// Create a type-safe client that includes our custom tables
export const db = supabase as unknown as ReturnType<typeof supabase.from<keyof Database["public"]["Tables"]>>;

// Type-safe table accessors
export const tables = {
  healthCheckins: () => supabase.from("health_checkins"),
  userPlans: () => supabase.from("user_plans"),
  planRecommendations: () => supabase.from("plan_recommendations"),
};
