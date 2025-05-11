
import { supabase } from "@/integrations/supabase/client";

export interface HealthSystemItem {
  id: string;
  area: string;
  symptoms: string;
  causes: string;
  recommendations: string;
  created_at?: string;
}

export const getHealthSystems = async (): Promise<HealthSystemItem[]> => {
  try {
    const { data, error } = await supabase
      .from('health_systems')
      .select('*')
      .order('area', { ascending: true });

    if (error) {
      console.error('Error fetching health systems:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getHealthSystems:', error);
    return [];
  }
};
