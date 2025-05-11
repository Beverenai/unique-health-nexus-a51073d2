
import { supabase } from "@/integrations/supabase/client";

// Helper function to get the current user ID or fallback to demo user
export const getUserId = async (): Promise<string> => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || DEMO_USER_ID;
};

// Demo user ID to use when not authenticated
export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

// Function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getUser();
  return !!data.user;
};

// Function to get user profile
export const getUserProfile = async () => {
  const { data: authData } = await supabase.auth.getUser();
  
  if (!authData.user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

// Function to update user profile
export const updateUserProfile = async (updates: any) => {
  const { data: authData } = await supabase.auth.getUser();
  
  if (!authData.user) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', authData.user.id);
  
  if (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
};

// Function to get user preferences
export const getUserPreferences = async () => {
  const { data: authData } = await supabase.auth.getUser();
  
  if (!authData.user) return null;
  
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', authData.user.id)
    .single();
  
  if (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
  
  return data;
};

// Function to update user preferences
export const updateUserPreferences = async (updates: any) => {
  const { data: authData } = await supabase.auth.getUser();
  
  if (!authData.user) {
    return { success: false, error: 'Not authenticated' };
  }
  
  const { data, error } = await supabase
    .from('user_preferences')
    .update(updates)
    .eq('user_id', authData.user.id);
  
  if (error) {
    console.error('Error updating preferences:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
};
