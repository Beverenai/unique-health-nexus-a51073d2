
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BarChart2, Apple, Dumbbell, Sparkles, Brain, Coffee, Flame, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { tables } from '@/integrations/supabase/client-extensions';
import { UserPlan, PlanRecommendation } from '@/types/database';
import { Badge } from '@/components/ui/badge';

// Import the refactored components
import PlanHeader from '@/components/my-plan/PlanHeader';
import PlanSummaryCard from '@/components/my-plan/PlanSummaryCard';
import CategoryAccordion from '@/components/my-plan/CategoryAccordion';
import EmptyPlanState from '@/components/my-plan/EmptyPlanState';
import { useNutritionRecommendations } from '@/hooks/useNutritionRecommendations';
import CollapsibleSection from '@/components/dashboard/CollapsibleSection';
import IngredientCard from '@/components/nutrition/IngredientCard';
import SupplementCard from '@/components/nutrition/SupplementCard';
import RecipeCard from '@/components/nutrition/RecipeCard';

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
  
  // Get nutrition recommendations
  const { ingredients, supplements, recipes, explanations, isLoading: nutritionLoading } = useNutritionRecommendations();
  
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
  
  // Function to navigate to recipe details page
  const handleViewRecipe = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`);
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
        <PlanHeader />
        
        {plan ? (
          <div className="space-y-6">
            {/* Plan Summary */}
            <PlanSummaryCard plan={plan} recommendations={recommendations} />
            
            {/* Food Section */}
            <CollapsibleSection
              title="Matvarer"
              isOpen={openSections.food}
              onToggle={() => toggleSection('food')}
              icon={<Apple className="text-green-500" />}
              badge={ingredients.length > 0 ? (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                  {ingredients.length}
                </Badge>
              ) : null}
            >
              {nutritionLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
                  <p className="mt-2 text-gray-500">Laster matvarer...</p>
                </div>
              ) : ingredients.length > 0 ? (
                <div className="space-y-3">
                  {ingredients.slice(0, 3).map(ingredient => (
                    <IngredientCard 
                      key={ingredient.id} 
                      ingredient={ingredient} 
                      reason={explanations[ingredient.id]} 
                    />
                  ))}
                  
                  {ingredients.length > 3 && (
                    <div className="flex justify-center mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/nutrition/food')}
                        className="flex items-center gap-1"
                      >
                        <Apple size={14} />
                        <span>Se alle matvarer</span>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <Apple size={24} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">Ingen matvareanbefalinger for øyeblikket</p>
                </div>
              )}
            </CollapsibleSection>
            
            {/* Supplements Section */}
            <CollapsibleSection
              title="Kosttilskudd"
              isOpen={openSections.supplements}
              onToggle={() => toggleSection('supplements')}
              icon={<Sparkles className="text-purple-500" />}
              badge={supplements.length > 0 ? (
                <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700">
                  {supplements.length}
                </Badge>
              ) : null}
            >
              {nutritionLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
                  <p className="mt-2 text-gray-500">Laster kosttilskudd...</p>
                </div>
              ) : supplements.length > 0 ? (
                <div className="space-y-3">
                  {supplements.slice(0, 3).map(supplement => (
                    <SupplementCard 
                      key={supplement.id} 
                      supplement={supplement} 
                      reason={explanations[supplement.id]} 
                    />
                  ))}
                  
                  {supplements.length > 3 && (
                    <div className="flex justify-center mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/nutrition/supplements')}
                        className="flex items-center gap-1"
                      >
                        <Sparkles size={14} />
                        <span>Se alle kosttilskudd</span>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <Sparkles size={24} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">Ingen kosttilskuddsanbefalinger for øyeblikket</p>
                </div>
              )}
            </CollapsibleSection>
            
            {/* Recipes Section */}
            <CollapsibleSection
              title="Oppskrifter"
              isOpen={openSections.recipes}
              onToggle={() => toggleSection('recipes')}
              icon={<BookOpen className="text-blue-500" />}
              badge={recipes.length > 0 ? (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                  {recipes.length}
                </Badge>
              ) : null}
            >
              {nutritionLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
                  <p className="mt-2 text-gray-500">Laster oppskrifter...</p>
                </div>
              ) : recipes.length > 0 ? (
                <div className="space-y-3">
                  {recipes.slice(0, 3).map(recipe => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      reason={explanations[recipe.id]}
                      onClick={() => handleViewRecipe(recipe.id)}
                    />
                  ))}
                  
                  <div className="flex justify-center mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/recipes')}
                      className="flex items-center gap-1"
                    >
                      <BookOpen size={14} />
                      <span>Se alle oppskrifter</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <BookOpen size={24} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">Ingen oppskriftsanbefalinger for øyeblikket</p>
                </div>
              )}
            </CollapsibleSection>
            
            {/* Categories Accordion */}
            <CategoryAccordion categories={categories} recommendations={recommendations} />
            
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/insights')}
                className="bg-[#9b87f5] hover:bg-[#8a76e5]"
              >
                <BarChart2 size={16} className="mr-2" />
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
