
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
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
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Set a timeout to prevent infinite loading state
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError('Det tok for lang tid å laste data. Prøv å laste siden på nytt.');
        toast.error('Timeout når data skulle lastes');
      }
    }, 10000); // 10 seconds timeout

    if (user) {
      setUserId(user.id);
      fetchData(user.id);
    } else {
      // If no user, try to use demo data
      const demoUserId = '00000000-0000-0000-0000-000000000000';
      setUserId(demoUserId);
      fetchData(demoUserId);
    }
    
    return () => clearTimeout(loadingTimeout);
  }, [user]);
  
  const fetchData = async (currentUserId: string) => {
    if (!currentUserId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching dashboard data for user:', currentUserId);
      
      // Fetch recommendations
      const { data: recommendationData, error: recommendationError } = await tables.planRecommendations()
        .select('*')
        .eq('completed', false)
        .order('priority', { ascending: false })
        .limit(3);
        
      if (recommendationError) {
        console.error('Error fetching recommendations:', recommendationError);
        toast.error('Kunne ikke hente anbefalinger');
      } else if (recommendationData) {
        console.log('Recommendations loaded:', recommendationData.length);
        setRecommendations(recommendationData as unknown as Recommendation[]);
      }
      
      // Fetch the latest checkin
      const { data: checkinData, error: checkinError } = await tables.healthCheckins()
        .select('*')
        .eq('user_id', currentUserId)
        .order('date', { ascending: false })
        .limit(1);
        
      if (checkinError) {
        console.error('Error fetching checkin:', checkinError);
        toast.error('Kunne ikke hente siste dagslogg');
      } else if (checkinData && checkinData.length > 0) {
        console.log('Latest checkin loaded:', checkinData[0]);
        setLatestCheckin(checkinData[0] as unknown as Checkin);
      } else {
        console.log('No checkins found for user:', currentUserId);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Det oppstod en feil ved henting av data');
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
        } as any)
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
    error,
    handleCompleteRecommendation,
    refetch: () => fetchData(userId || '00000000-0000-0000-0000-000000000000')
  };
};

export type { Recommendation, Checkin };
