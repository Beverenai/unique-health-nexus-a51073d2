
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import RecipeCard from '@/components/nutrition/RecipeCard';
import { Recipe, RecipeIngredient } from '@/types/nutrition';

interface RecipesSectionProps {
  recipes: (Recipe & { ingredients?: RecipeIngredient[] })[];
  explanations: Record<string, string>;
  isLoading: boolean;
  onViewRecipe: (recipeId: string) => void;
}

const RecipesSection: React.FC<RecipesSectionProps> = ({ 
  recipes, 
  explanations, 
  isLoading,
  onViewRecipe
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
        <p className="mt-2 text-gray-500">Laster oppskrifter...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recipes.slice(0, 3).map(recipe => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          reason={explanations[recipe.id]}
          onClick={() => onViewRecipe(recipe.id)}
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
          <span>Se alle {recipes.length} oppskrifter</span>
        </Button>
      </div>
    </div>
  );
};

export default RecipesSection;
