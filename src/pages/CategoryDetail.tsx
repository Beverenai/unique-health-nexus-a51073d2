
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tables } from '@/integrations/supabase/client-extensions';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { PlanRecommendation } from '@/types/database';
import { getCategoryIcon } from '@/utils/categoryUtils';
import CategoryHeader from '@/components/category-detail/CategoryHeader';
import RecommendationsList from '@/components/category-detail/RecommendationsList';

const CategoryDetail = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<PlanRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the category icon
  const categoryIcon = getCategoryIcon(categoryName);
  
  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [categoryName, user]);
  
  const fetchRecommendations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // First get the active plan
      const { data: planData, error: planError } = await tables.userPlans()
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single() as any;
        
      if (planError) throw planError;
      
      if (planData) {
        // Then fetch all recommendations for this plan
        const { data: recData, error: recError } = await tables.planRecommendations()
          .select('*')
          .eq('plan_id', planData.id)
          .order('priority', { ascending: false }) as any;
          
        if (recError) throw recError;
        
        // Filter recommendations by category
        const filteredRecommendations = recData.filter((rec: PlanRecommendation) => 
          rec.category?.toLowerCase() === categoryName?.toLowerCase()
        );
        
        setRecommendations(filteredRecommendations);
      }
    } catch (error) {
      console.error('Error fetching category recommendations:', error);
      toast.error('Kunne ikke hente anbefalinger for kategorien');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-md mx-auto px-4 pt-6">
        <CategoryHeader 
          categoryName={categoryName} 
          categoryIcon={categoryIcon} 
        />
        
        <RecommendationsList recommendations={recommendations} />
      </div>
    </div>
  );
};

export default CategoryDetail;
