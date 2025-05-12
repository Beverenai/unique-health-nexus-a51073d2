
import React from 'react';
import { Ingredient } from './IngredientCard';
import { Supplement } from './SupplementCard';
import IngredientCard from './IngredientCard';
import SupplementCard from './SupplementCard';
import RecipeCard from './RecipeCard';
import RecipeDetailModal from './RecipeDetailModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Sparkles, BookOpen } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Recipe } from '@/types/nutrition';
import { useRecipes } from '@/hooks/useRecipes';

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
  
  const recipes = propRecipes || featuredRecipes;

  return (
    <div className="space-y-4">
      <Tabs defaultValue="ingredients" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ingredients" className="flex items-center gap-2">
            <Apple size={16} />
            <span>Matvarer ({ingredients.length})</span>
          </TabsTrigger>
          <TabsTrigger value="supplements" className="flex items-center gap-2">
            <Sparkles size={16} />
            <span>Kosttilskudd ({supplements.length})</span>
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <BookOpen size={16} />
            <span>Oppskrifter ({recipes?.length || 0})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ingredients" className="mt-4">
          {ingredients.length > 0 ? (
            <ScrollArea className="h-[340px] pr-4">
              <div className="space-y-3">
                {ingredients.map(ingredient => (
                  <IngredientCard 
                    key={ingredient.id} 
                    ingredient={ingredient} 
                    reason={explanations[ingredient.id]} 
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <Apple size={24} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">Ingen matvareanbefalinger for øyeblikket</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="supplements" className="mt-4">
          {supplements.length > 0 ? (
            <ScrollArea className="h-[340px] pr-4">
              <div className="space-y-3">
                {supplements.map(supplement => (
                  <SupplementCard 
                    key={supplement.id} 
                    supplement={supplement} 
                    reason={explanations[supplement.id]} 
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <Sparkles size={24} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">Ingen kosttilskuddsanbefalinger for øyeblikket</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recipes" className="mt-4">
          {recipesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
              <p className="mt-2 text-gray-500">Laster oppskrifter...</p>
            </div>
          ) : recipes && recipes.length > 0 ? (
            <ScrollArea className="h-[340px] pr-4">
              <div className="space-y-3">
                {recipes.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    reason={explanations[recipe.id]}
                    onClick={() => setSelectedRecipe(recipe)}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <BookOpen size={24} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">Ingen oppskriftsanbefalinger for øyeblikket</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
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
