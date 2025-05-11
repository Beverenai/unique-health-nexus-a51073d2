
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { tables } from '@/integrations/supabase/client-extensions';

interface Recommendation {
  id: string;
  text: string;
  priority: string;
  completed: boolean;
  completed_at?: string;
}

interface Checkin {
  id: string;
  date: string;
  user_id: string;
  mood: number;
  energy_level: number;
  sleep_quality: number;
  notes?: string;
  symptoms?: string[];
  created_at: string;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [latestCheckin, setLatestCheckin] = useState<Checkin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      setUserId(user.id);
      fetchData();
    }
  }, [user]);
  
  const fetchData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Fetch recommendations
      const { data: recommendationData, error: recommendationError } = await tables.planRecommendations()
        .select('*')
        .eq('completed', false)
        .order('priority', { ascending: false })
        .limit(3);
        
      if (recommendationError) throw recommendationError;
      setRecommendations(recommendationData as any);
      
      // Fetch the latest checkin
      const { data: checkinData, error: checkinError } = await tables.healthCheckins()
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(1);
        
      if (checkinError) {
        console.error('Error fetching checkin:', checkinError);
      } else if (checkinData && checkinData.length > 0) {
        setLatestCheckin(checkinData[0] as any);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Kunne ikke hente dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRecommendation = async (id: string) => {
    try {
      const { error } = await tables.planRecommendations()
        .update({ 
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setRecommendations(recommendations.filter(rec => rec.id !== id));
      toast.success('Anbefaling markert som fullført!');
    } catch (error) {
      console.error('Error completing recommendation:', error);
      toast.error('Kunne ikke oppdatere anbefalingen');
    }
  };
  
  return {
    recommendations,
    latestCheckin,
    isLoading,
    handleCompleteRecommendation
  };
};

export type { Recommendation, Checkin };
