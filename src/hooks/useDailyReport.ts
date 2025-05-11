
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale'; // Fixed import for Norwegian locale
import { useAuth } from '@/context/AuthContext';
import { tables } from '@/integrations/supabase/client-extensions';
import { HealthCheckIn } from '@/types/database';

type CheckIn = HealthCheckIn;

export const useDailyReport = () => {
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [lastWeekCheckIns, setLastWeekCheckIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCheckIns = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get all check-ins for the user with proper type assertion
        const { data, error } = await tables.healthCheckins()
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        // Type assertion to ensure data is treated as CheckIn[]
        const typedData = data as unknown as CheckIn[];
        setCheckIns(typedData);
        
        // Process data for the last 7 days for the chart
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        
        const lastWeekData = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const formattedDate = format(date, 'yyyy-MM-dd');
          
          // Find check-in for this date if it exists
          const checkIn = typedData.find(ci => ci.date === formattedDate);
          
          lastWeekData.unshift({
            date: formattedDate,
            mood: checkIn?.mood || 0,
            energy: checkIn?.energy_level || 0,
            sleep: checkIn?.sleep_quality || 0,
            label: format(date, 'EEE', { locale: nb }) // Using imported nb locale
          });
        }
        
        setLastWeekCheckIns(lastWeekData);
      } catch (error) {
        console.error('Error fetching check-ins:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCheckIns();
  }, [user]);
  
  return {
    checkIns,
    lastWeekCheckIns,
    loading,
    latestCheckIn: checkIns.length > 0 ? checkIns[0] : null
  };
};
