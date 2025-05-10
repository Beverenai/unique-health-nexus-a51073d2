
import { supabase } from "@/integrations/supabase/client";
import { CoherenceData } from "@/types/supabase";
import { mockHealthIssues } from "@/data/mockData";

// Demo user ID to use when not authenticated
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

// Helper function to get the current user ID or fallback to demo user
const getUserId = async (): Promise<string> => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || DEMO_USER_ID;
};

export const getLatestCoherenceData = async (): Promise<CoherenceData | null> => {
  try {
    const { data: scans, error: scanError } = await supabase
      .from('scans')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);

    if (scanError || !scans || scans.length === 0) {
      console.error('Error fetching latest scan:', scanError);
      return null;
    }

    const latestScanId = scans[0].id;

    const { data, error } = await supabase
      .from('coherence_data')
      .select('*')
      .eq('scan_id', latestScanId)
      .single();

    if (error) {
      console.error('Error fetching coherence data:', error);
      return null;
    }

    return data as CoherenceData;
  } catch (error) {
    console.error('Error in getLatestCoherenceData:', error);
    return null;
  }
};

export const getHistoricalCoherenceData = async (): Promise<any[]> => {
  try {
    const userId = await getUserId();
    
    // First get all scans
    const { data: scans, error: scanError } = await supabase
      .from('scans')
      .select('id, created_at, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (scanError || !scans) {
      console.error('Error fetching scans:', scanError);
      return [];
    }

    // Now get coherence data for all scans
    const historicalData = await Promise.all(
      scans.map(async (scan) => {
        const { data: coherenceData, error: coherenceError } = await supabase
          .from('coherence_data')
          .select('score')
          .eq('scan_id', scan.id)
          .single();

        if (coherenceError || !coherenceData) {
          return {
            id: scan.id,
            date: scan.created_at,
            score: 0,
            status: scan.status
          };
        }

        return {
          id: scan.id,
          date: scan.created_at,
          score: coherenceData.score,
          status: scan.status
        };
      })
    );

    return historicalData.filter(data => data.score > 0);
  } catch (error) {
    console.error('Error in getHistoricalCoherenceData:', error);
    return [];
  }
};
