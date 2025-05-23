
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Apple, Dumbbell, Sparkles, Brain, Coffee, Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { tables } from '@/integrations/supabase/client-extensions';
import { UserPlan, PlanRecommendation } from '@/types/database';

// Import the refactored components
import PlanHeader from '@/components/my-plan/PlanHeader';
import PlanSummaryCard from '@/components/my-plan/PlanSummaryCard';
import CategoryAccordion from '@/components/my-plan/CategoryAccordion';
import EmptyPlanState from '@/components/my-plan/EmptyPlanState';
import NutritionSections from '@/components/my-plan/NutritionSections';

const MyPlan = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [recommendations, setRecommendations] = useState<PlanRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track which sections are open
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({
    food: false,
    supplements: false,
    recipes: false
  });
  
  // Add categories with icons for different health recommendations
  const categories = {
    'Kosthold': <Apple className="text-green-500" />,
    'Bevegelse': <Dumbbell className="text-blue-500" />,
    'Tilskudd': <Sparkles className="text-purple-500" />,
    'Mental helse': <Brain className="text-amber-500" />,
    'Søvn': <Coffee className="text-indigo-500" />,
    'Stress': <Flame className="text-red-500" />
  };
  
  useEffect(() => {
    fetchPlans();
  }, [user]);
  
  const fetchPlans = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await tables.userPlans()
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single() as any;
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error code
        throw error;
      }
      
      if (data) {
        setPlan(data);
        await fetchRecommendations(data.id);
      } else {
        // If no plan exists, try to create a default one
        await createDefaultPlan();
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Kunne ikke hente helseplan');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchRecommendations = async (planId: string) => {
    try {
      const { data, error } = await tables.planRecommendations()
        .select('*')
        .eq('plan_id', planId)
        .order('priority', { ascending: false }) as any;
        
      if (error) throw error;
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Kunne ikke hente anbefalinger for planen');
    }
  };
  
  const createDefaultPlan = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30); // Default plan duration: 30 days
      
      const { data, error } = await tables.userPlans()
        .insert({
          user_id: user.id,
          title: 'Standard helseplan',
          description: 'En standard helseplan generert av systemet',
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active'
        } as any)
        .select()
        .single() as any;
        
      if (error) throw error;
      
      setPlan(data);
      toast.success('Standard helseplan opprettet!');
    } catch (error) {
      console.error('Error creating default plan:', error);
      toast.error('Kunne ikke opprette standard helseplan');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleSection = (sectionName: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };
  
  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }
  
  return (
    <div className="h-screen bg-white overflow-y-auto">
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <PlanHeader />
        
        {plan ? (
          <div className="space-y-6">
            {/* Plan Summary */}
            <PlanSummaryCard plan={plan} recommendations={recommendations} />
            
            {/* Nutrition Sections */}
            <NutritionSections
              openSections={openSections}
              toggleSection={toggleSection}
            />
            
            {/* Categories Accordion */}
            <CategoryAccordion categories={categories} recommendations={recommendations} />
            
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/insights')}
                className="bg-[#9b87f5] hover:bg-[#8a76e5]"
              >
                <img 
                  src="/lovable-uploads/7f3db508-ef1a-4c8f-8163-91404c131e30.png" 
                  alt="Unique+" 
                  className="h-5 w-5 mr-2" 
                />
                Se dine Unique+ innsikter
              </Button>
            </div>
          </div>
        ) : (
          <EmptyPlanState onCreatePlan={createDefaultPlan} />
        )}
      </div>
    </div>
  );
};

export default MyPlan;
