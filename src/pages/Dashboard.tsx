
import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import QuickActions from '@/components/dashboard/QuickActions';
import RecommendationsCard from '@/components/dashboard/RecommendationsCard';
import CalendarCard from '@/components/dashboard/CalendarCard';
import LatestCheckinCard from '@/components/dashboard/LatestCheckinCard';
import DashboardSummary from '@/components/dashboard/DashboardSummary';

// Import new component files
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ErrorState from '@/components/dashboard/ErrorState';
import LoadingState from '@/components/dashboard/LoadingState';
import CollapsibleSection from '@/components/dashboard/CollapsibleSection';
import AccordionSection from '@/components/dashboard/AccordionSection';

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { recommendations, latestCheckin, isLoading, error, handleCompleteRecommendation, refetch } = useDashboardData();
  
  // Add a retry counter to avoid infinite retry loops
  const [retryCount, setRetryCount] = useState(0);
  const [openSections, setOpenSections] = useState({
    quickActions: true,
    recommendations: true,
    details: false
  });
  
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
  
  // Store open section preferences in localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('dashboardPreferences');
    if (savedPreferences) {
      setOpenSections(JSON.parse(savedPreferences));
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('dashboardPreferences', JSON.stringify(openSections));
  }, [openSections]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return (
      <div className="min-h-screen pb-20">
        <div className="container max-w-3xl mx-auto px-4 pt-6">
          <DashboardHeader />
          <ErrorState error={error} refetch={refetch} />
          <QuickActions />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-3xl mx-auto px-4 pt-6">
        <DashboardHeader />

        {/* Summary Component - Hero Section */}
        <div className="mb-6">
          <DashboardSummary latestCheckin={latestCheckin} />
        </div>
        
        {/* Quick Actions - Collapsible */}
        <CollapsibleSection
          title="Hurtighandlinger"
          isOpen={openSections.quickActions}
          onToggle={() => toggleSection('quickActions')}
        >
          <QuickActions />
        </CollapsibleSection>
        
        {/* Recommendations - Accordion Style */}
        <AccordionSection
          title="Langvarige anbefalinger"
          value="recommendations"
          isOpen={openSections.recommendations}
          onToggle={(value) => setOpenSections(prev => ({ 
            ...prev, 
            recommendations: value === "recommendations" 
          }))}
        >
          <RecommendationsCard 
            recommendations={recommendations} 
            onComplete={handleCompleteRecommendation} 
          />
        </AccordionSection>
        
        {/* Details Grid - More organized layout */}
        <CollapsibleSection
          title="Detaljer og kalender"
          isOpen={openSections.details}
          onToggle={() => toggleSection('details')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendar */}
            <CalendarCard date={date} onDateChange={setDate} />
            
            {/* Latest Check-in */}
            <LatestCheckinCard latestCheckin={latestCheckin} />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default Dashboard;
