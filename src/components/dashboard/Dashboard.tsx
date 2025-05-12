
import React, { useEffect, useState } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSummary from './DashboardSummary';
import QuickActions from './QuickActions';
import LatestCheckinCard from './LatestCheckinCard';
import RecommendationsCard from './RecommendationsCard';
import CalendarCard from './CalendarCard';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import CollapsibleSection from './CollapsibleSection';
import { Apple, Badge, Calendar, CalendarDays } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNutritionRecommendations } from '@/hooks/useNutritionRecommendations';
import NutritionRecommendationsSection from '@/components/nutrition/NutritionRecommendationsSection';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    isLoading, 
    error, 
    latestCheckin, 
    recommendations, 
    handleCompleteRecommendation,
    refetch
  } = useDashboardData();
  
  const [scanDate, setScanDate] = useState<Date | undefined>(undefined);
  
  // Add state for collapsible sections
  const [openSections, setOpenSections] = useState({
    recommendations: true,
    history: false,
    checkin: true,
    nutrition: true, // New nutrition section
  });
  
  // Get nutrition recommendations
  const { ingredients, supplements, isLoading: nutritionLoading } = useNutritionRecommendations();
  
  // Handle toggle sections
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle scan date change
  const handleDateChange = (date: Date | undefined) => {
    setScanDate(date);
    // Here you could fetch data for this specific date
    console.log("Selected date:", date);
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState error={error} refetch={refetch} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-20">
      <div className="container px-4 py-6 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DashboardHeader />
          
          <div className="mb-6">
            <DashboardSummary latestCheckin={latestCheckin} />
          </div>
          
          <div className="mb-6">
            <QuickActions />
          </div>
          
          {/* Nutrition Section */}
          <CollapsibleSection 
            title="Ernæringsanbefalinger" 
            isOpen={openSections.nutrition}
            onToggle={() => toggleSection('nutrition')}
            icon={<Apple size={18} />}
            badge={
              <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded">
                Ny
              </span>
            }
          >
            {nutritionLoading ? (
              <div className="py-10 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
                <p className="mt-2 text-gray-500">Laster ernæringsinformasjon...</p>
              </div>
            ) : (
              <NutritionRecommendationsSection
                ingredients={ingredients.slice(0, 2)} // Show limited items on dashboard
                supplements={supplements.slice(0, 2)} // Show limited items on dashboard
              />
            )}
          </CollapsibleSection>
          
          <CollapsibleSection 
            title="Anbefalte tiltak" 
            isOpen={openSections.recommendations}
            onToggle={() => toggleSection('recommendations')}
            icon={<Badge size={18} />}
          >
            <RecommendationsCard 
              recommendations={recommendations} 
              onComplete={handleCompleteRecommendation} 
            />
          </CollapsibleSection>
          
          <div className="grid md:grid-cols-2 gap-6">
            <CollapsibleSection 
              title="Siste sjekk inn" 
              isOpen={openSections.checkin}
              onToggle={() => toggleSection('checkin')}
              icon={<CalendarDays size={18} />}
            >
              <LatestCheckinCard latestCheckin={latestCheckin} />
            </CollapsibleSection>
            
            <CollapsibleSection 
              title="Scan historikk" 
              isOpen={openSections.history}
              onToggle={() => toggleSection('history')}
              icon={<Calendar size={18} />}
            >
              <CalendarCard 
                date={scanDate}
                onDateChange={handleDateChange}
              />
            </CollapsibleSection>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
