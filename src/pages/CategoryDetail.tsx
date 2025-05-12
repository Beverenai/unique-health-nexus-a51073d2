
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tables } from '@/integrations/supabase/client-extensions';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { PlanRecommendation } from '@/types/database';
import { getCategoryIcon } from '@/utils/categoryUtils';
import { useNutritionRecommendations } from '@/hooks/useNutritionRecommendations';
import CategoryHeader from '@/components/category-detail/CategoryHeader';
import RecommendationsList from '@/components/category-detail/RecommendationsList';
import IngredientCard from '@/components/nutrition/IngredientCard';
import SupplementCard from '@/components/nutrition/SupplementCard';

const CategoryDetail = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<PlanRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get nutrition data
  const { 
    ingredients, 
    supplements, 
    explanations, 
    isLoading: nutritionLoading 
  } = useNutritionRecommendations();
  
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
  
  const renderNutritionItems = () => {
    if (nutritionLoading) {
      return (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
          <p className="mt-2 text-gray-500">Laster...</p>
        </div>
      );
    }

    // For "tilskudd" category, show supplements
    if (categoryName?.toLowerCase() === 'tilskudd') {
      return (
        <div className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold mb-2">Anbefalte kosttilskudd</h2>
          <div className="space-y-3">
            {supplements.map(supplement => (
              <SupplementCard 
                key={supplement.id} 
                supplement={supplement} 
                reason={explanations[supplement.id]} 
              />
            ))}
          </div>
        </div>
      );
    }
    
    // For "kosthold" category, show ingredients/food
    if (categoryName?.toLowerCase() === 'kosthold') {
      return (
        <div className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold mb-2">Anbefalte matvarer</h2>
          <div className="space-y-3">
            {ingredients.map(ingredient => (
              <IngredientCard 
                key={ingredient.id} 
                ingredient={ingredient} 
                reason={explanations[ingredient.id]} 
              />
            ))}
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  if (isLoading && nutritionLoading) {
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
        
        {/* Show standard recommendations for all categories */}
        {recommendations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Anbefalinger</h2>
            <RecommendationsList recommendations={recommendations} />
          </div>
        )}
        
        {/* Show specialized content for nutrition categories */}
        {renderNutritionItems()}
        
        {/* Show a message if there is no content */}
        {recommendations.length === 0 && 
         !['tilskudd', 'kosthold'].includes(categoryName?.toLowerCase() || '') && (
          <div className="text-center py-6 bg-white/70 backdrop-blur shadow-sm rounded-xl border border-gray-100/40">
            <p className="text-gray-500">
              Ingen anbefalinger funnet for denne kategorien.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
