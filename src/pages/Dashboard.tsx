
import React, { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import QuickActions from '@/components/dashboard/QuickActions';
import RecommendationsCard from '@/components/dashboard/RecommendationsCard';
import CalendarCard from '@/components/dashboard/CalendarCard';
import LatestCheckinCard from '@/components/dashboard/LatestCheckinCard';

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { recommendations, latestCheckin, isLoading, handleCompleteRecommendation } = useDashboardData();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-3xl mx-auto px-4 pt-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>
          <p className="text-gray-500">
            Velkommen tilbake! Her er en oversikt over din helse.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />
            
            {/* Today's Recommendations */}
            <RecommendationsCard 
              recommendations={recommendations} 
              onComplete={handleCompleteRecommendation} 
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Calendar */}
            <CalendarCard date={date} onDateChange={setDate} />
            
            {/* Latest Check-in */}
            <LatestCheckinCard latestCheckin={latestCheckin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
