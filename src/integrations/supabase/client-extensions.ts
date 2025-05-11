
import { supabase } from "./client";
import type { Database } from "@/types/database";

// Create a type-safe client that includes our custom tables
export const db = supabase;

// Use type assertions to properly define tables that aren't yet in the generated types
export const tables = {
  healthCheckins: () => {
    // We need to cast using any at the function call level
    return db.from('health_checkins' as any);
  },
  userPlans: () => {
    // We need to cast using any at the function call level
    return db.from('user_plans' as any);
  },
  planRecommendations: () => {
    // We need to cast using any at the function call level
    return db.from('plan_recommendations' as any);
  },
  chatMessages: () => db.from('chat_messages'),
  healthIssues: () => db.from('health_issues'),
};

/**
 * Helper function for calling RPC functions that might not be in the type definitions
 * @param functionName The name of the RPC function to call
 * @param params Parameters to pass to the function
 * @returns The PostgrestQueryBuilder for the RPC call
 */
export const rpcCall = <T = any>(functionName: string, params?: Record<string, any>) => {
  return db.rpc(functionName as any, params) as any;
};
