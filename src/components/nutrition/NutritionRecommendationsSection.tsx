
import React from 'react';
import { Ingredient } from './IngredientCard';
import { Supplement } from './SupplementCard';
import IngredientCard from './IngredientCard';
import SupplementCard from './SupplementCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Sparkles } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface NutritionRecommendationsSectionProps {
  ingredients: Ingredient[];
  supplements: Supplement[];
  explanations?: {
    [id: string]: string;
  };
}

const NutritionRecommendationsSection: React.FC<NutritionRecommendationsSectionProps> = ({
  ingredients,
  supplements,
  explanations = {}
}) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="ingredients" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ingredients" className="flex items-center gap-2">
            <Apple size={16} />
            <span>Matvarer ({ingredients.length})</span>
          </TabsTrigger>
          <TabsTrigger value="supplements" className="flex items-center gap-2">
            <Sparkles size={16} />
            <span>Kosttilskudd ({supplements.length})</span>
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
      </Tabs>
    </div>
  );
};

export default NutritionRecommendationsSection;
