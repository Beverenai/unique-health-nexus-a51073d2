
import React, { useEffect, useState } from 'react';
import HomeContent from '@/components/home/HomeContent';
import HomeLoading from '@/components/home/HomeLoading';
import BackgroundDecorations from '@/components/home/BackgroundDecorations';
import HomeDataProvider from '@/components/home/HomeDataProvider';
import { seedHistoricalData } from '@/services/supabaseService';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { toast } from 'sonner';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { trigger } = useHapticFeedback();
  
  // Seed dashboard data when the home page loads
  useEffect(() => {
    // Seed health check-ins and recommendations data
    seedHistoricalData();
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Re-seed data
      await seedHistoricalData();
      toast.success('Data oppdatert', { duration: 2000 });
      trigger('success');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Kunne ikke oppdatere data');
      trigger('error');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="h-screen bg-white overflow-y-auto">
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="container max-w-md mx-auto px-4 pb-20">
          <div className="relative">
            <HomeDataProvider>
              {({ coherenceData, healthIssues, scanDate, userName, isLoading }) => (
                <>
                  {isLoading || refreshing ? (
                    <HomeLoading />
                  ) : (
                    <HomeContent
                      coherenceData={coherenceData}
                      healthIssues={healthIssues}
                      userName={userName}
                      scanDate={scanDate}
                    />
                  )}
                </>
              )}
            </HomeDataProvider>
          </div>
        </main>
      </PullToRefresh>
      
      <BackgroundDecorations />
    </div>
  );
};

export default Home;
