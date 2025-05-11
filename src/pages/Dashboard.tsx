
import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import QuickActions from '@/components/dashboard/QuickActions';
import RecommendationsCard from '@/components/dashboard/RecommendationsCard';
import CalendarCard from '@/components/dashboard/CalendarCard';
import LatestCheckinCard from '@/components/dashboard/LatestCheckinCard';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { recommendations, latestCheckin, isLoading, error, handleCompleteRecommendation, refetch } = useDashboardData();
  
  // Add a retry counter to avoid infinite retry loops
  const [retryCount, setRetryCount] = useState(0);
  
  // Auto-retry once if there's an error (but only once)
  useEffect(() => {
    if (error && retryCount === 0) {
      const timer = setTimeout(() => {
        setRetryCount(1);
        refetch();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, refetch]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen pb-20">
        <div className="container max-w-3xl mx-auto px-4 pt-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">
              Dashboard
            </h1>
          </header>
          
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Kunne ikke laste dashbordet</AlertTitle>
            <AlertDescription className="mt-2">
              {error}
              <Button 
                onClick={refetch}
                variant="outline" 
                size="sm" 
                className="ml-2 mt-2"
              >
                <RefreshCcw size={16} className="mr-2" />
                Prøv igjen
              </Button>
            </AlertDescription>
          </Alert>
          
          <QuickActions />
        </div>
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
