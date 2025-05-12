
import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import QuickActions from '@/components/dashboard/QuickActions';
import RecommendationsCard from '@/components/dashboard/RecommendationsCard';
import CalendarCard from '@/components/dashboard/CalendarCard';
import LatestCheckinCard from '@/components/dashboard/LatestCheckinCard';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

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
        <motion.header 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>
          <p className="text-gray-500">
            Velkommen tilbake! Her er en oversikt over din helse.
          </p>
        </motion.header>

        {/* Summary Component - Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <DashboardSummary latestCheckin={latestCheckin} />
        </motion.div>
        
        {/* Quick Actions - Collapsible */}
        <Collapsible
          open={openSections.quickActions}
          onOpenChange={() => toggleSection('quickActions')}
          className="mb-6 bg-white/70 backdrop-blur shadow-sm rounded-xl border border-gray-100/40 overflow-hidden"
        >
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-medium">Hurtighandlinger</h2>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${openSections.quickActions ? '' : '-rotate-90'}`} 
                />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="px-6 pb-4">
            <QuickActions />
          </CollapsibleContent>
        </Collapsible>
        
        {/* Recommendations - Accordion Style */}
        <Accordion 
          type="single" 
          defaultValue={openSections.recommendations ? "recommendations" : ""}
          onValueChange={(value) => setOpenSections(prev => ({ ...prev, recommendations: value === "recommendations" }))}
          className="mb-6"
        >
          <AccordionItem value="recommendations" className="bg-white/70 backdrop-blur shadow-sm rounded-xl border border-gray-100/40 overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <h2 className="text-lg font-medium">Langvarige anbefalinger</h2>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <RecommendationsCard 
                recommendations={recommendations} 
                onComplete={handleCompleteRecommendation} 
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Details Grid - More organized layout */}
        <Collapsible
          open={openSections.details}
          onOpenChange={() => toggleSection('details')}
          className="mb-6 bg-white/70 backdrop-blur shadow-sm rounded-xl border border-gray-100/40 overflow-hidden"
        >
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-medium">Detaljer og kalender</h2>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${openSections.details ? '' : '-rotate-90'}`} 
                />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="px-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <CalendarCard date={date} onDateChange={setDate} />
              
              {/* Latest Check-in */}
              <LatestCheckinCard latestCheckin={latestCheckin} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default Dashboard;
