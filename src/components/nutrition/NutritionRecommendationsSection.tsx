
import React from 'react';
import { Ingredient } from './IngredientCard';
import { Supplement } from './SupplementCard';
import IngredientCard from './IngredientCard';
import SupplementCard from './SupplementCard';
import RecipeCard from './RecipeCard';
import RecipeDetailModal from './RecipeDetailModal';
import { Apple, Sparkles, BookOpen } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Recipe } from '@/types/nutrition';
import { useRecipes } from '@/hooks/useRecipes';
import { TabView } from '@/components/ui/tab-view';
import TabViewItem from '@/components/ui/tab-view-item';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NutritionRecommendationsSectionProps {
  ingredients: Ingredient[];
  supplements: Supplement[];
  recipes?: Recipe[];
  explanations?: {
    [id: string]: string;
  };
}

const NutritionRecommendationsSection: React.FC<NutritionRecommendationsSectionProps> = ({
  ingredients,
  supplements,
  recipes: propRecipes,
  explanations = {}
}) => {
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(null);
  const { featuredRecipes, isLoading: recipesLoading } = useRecipes();
  const navigate = useNavigate();
  
  const recipes = propRecipes || featuredRecipes;

  // Tab configuration
  const tabs = [
    {
      id: 'ingredients',
      label: `Matvarer (${ingredients.length})`,
      icon: <Apple size={18} />,
      content: (
        <div className="mt-2">
          {ingredients.length > 0 ? (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3 pb-2">
                {ingredients.map(ingredient => (
                  <motion.div
                    key={ingredient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IngredientCard 
                      ingredient={ingredient} 
                      reason={explanations[ingredient.id]} 
                    />
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Apple size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">Ingen matvareanbefalinger for øyeblikket</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'supplements',
      label: `Kosttilskudd (${supplements.length})`,
      icon: <Sparkles size={18} />,
      content: (
        <div className="mt-2">
          {supplements.length > 0 ? (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3 pb-2">
                {supplements.map(supplement => (
                  <motion.div
                    key={supplement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SupplementCard 
                      supplement={supplement} 
                      reason={explanations[supplement.id]} 
                    />
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Sparkles size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">Ingen kosttilskuddsanbefalinger for øyeblikket</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'recipes',
      label: `Oppskrifter (${recipes?.length || 0})`,
      icon: <BookOpen size={18} />,
      content: (
        <div className="mt-2">
          {recipesLoading ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
              <p className="mt-2 text-gray-500">Laster oppskrifter...</p>
            </div>
          ) : recipes && recipes.length > 0 ? (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3 pb-2">
                {recipes.map(recipe => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RecipeCard 
                      recipe={recipe} 
                      reason={explanations[recipe.id]}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">Ingen oppskriftsanbefalinger for øyeblikket</p>
            </div>
          )}
          
          <div className="mt-3 flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => navigate('/recipes')}
            >
              <BookOpen size={14} />
              <span>Se alle oppskrifter</span>
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div>
      <TabView tabs={tabs} className="overflow-visible" />
      
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
};

export default NutritionRecommendationsSection;
