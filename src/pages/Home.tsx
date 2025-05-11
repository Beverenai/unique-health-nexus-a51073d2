import React from 'react';
import HomeContent from '@/components/home/HomeContent';
import HomeLoading from '@/components/home/HomeLoading';
import BackgroundDecorations from '@/components/home/BackgroundDecorations';
import HomeDataProvider from '@/components/home/HomeDataProvider';
import { seedHistoricalData } from '@/services/supabaseService';
import { useEffect } from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container max-w-md mx-auto px-4 pb-20">
        <div className="relative">
          <HomeDataProvider>
            {({ coherenceData, healthIssues, scanDate, userName, isLoading }) => (
              <>
                {isLoading ? (
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
      
      <BackgroundDecorations />
    </div>
  );
};

// Seed dashboard data when the home page loads
useEffect(() => {
  // Seed health check-ins and recommendations data
  seedHistoricalData();
}, []);

export default Home;
