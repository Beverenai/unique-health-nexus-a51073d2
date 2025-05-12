
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple, Sparkles, BookOpen } from 'lucide-react';
import { useNutritionRecommendations } from '@/hooks/useNutritionRecommendations';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import CollapsibleSection from '@/components/dashboard/CollapsibleSection';
import FoodSection from './FoodSection';
import SupplementsSection from './SupplementsSection';
import RecipesSection from './RecipesSection';

interface NutritionSectionsProps {
  openSections: {[key: string]: boolean};
  toggleSection: (section: string) => void;
}

const NutritionSections: React.FC<NutritionSectionsProps> = ({ 
  openSections, 
  toggleSection 
}) => {
  const navigate = useNavigate();
  const { ingredients, supplements, recipes, explanations, isLoading: nutritionLoading } = useNutritionRecommendations();

  return (
    <>
      {/* Food Section - only show if we have ingredients */}
      {ingredients.length > 0 && (
        <CollapsibleSection
          title="Matvarer"
          isOpen={openSections.food}
          onToggle={() => toggleSection('food')}
          icon={<Apple className="text-green-500" />}
          badge={
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
              {ingredients.length}
            </Badge>
          }
        >
          <FoodSection 
            ingredients={ingredients} 
            explanations={explanations} 
            isLoading={nutritionLoading} 
          />
        </CollapsibleSection>
      )}
      
      {/* Supplements Section - only show if we have supplements */}
      {supplements.length > 0 && (
        <CollapsibleSection
          title="Kosttilskudd"
          isOpen={openSections.supplements}
          onToggle={() => toggleSection('supplements')}
          icon={<Sparkles className="text-purple-500" />}
          badge={
            <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700">
              {supplements.length}
            </Badge>
          }
        >
          <SupplementsSection
            supplements={supplements}
            explanations={explanations}
            isLoading={nutritionLoading}
          />
        </CollapsibleSection>
      )}
      
      {/* Recipes Section - only show if we have recipes */}
      {recipes.length > 0 && (
        <CollapsibleSection
          title="Oppskrifter"
          isOpen={openSections.recipes}
          onToggle={() => toggleSection('recipes')}
          icon={<BookOpen className="text-blue-500" />}
          badge={
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
              {recipes.length}
            </Badge>
          }
        >
          <RecipesSection
            recipes={recipes}
            explanations={explanations}
            isLoading={nutritionLoading}
            onViewRecipe={(recipeId) => navigate(`/recipes/${recipeId}`)}
          />
        </CollapsibleSection>
      )}
    </>
  );
};

export default NutritionSections;
