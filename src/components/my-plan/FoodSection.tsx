
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple } from 'lucide-react';
import { Button } from "@/components/ui/button";
import IngredientCard from '@/components/nutrition/IngredientCard';
import { Ingredient } from '@/components/nutrition/IngredientCard';

interface FoodSectionProps {
  ingredients: Ingredient[];
  explanations: Record<string, string>;
  isLoading: boolean;
}

const FoodSection: React.FC<FoodSectionProps> = ({ 
  ingredients, 
  explanations, 
  isLoading 
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
        <p className="mt-2 text-gray-500">Laster matvarer...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ingredients.slice(0, 4).map(ingredient => (
        <IngredientCard 
          key={ingredient.id} 
          ingredient={ingredient} 
          reason={explanations[ingredient.id]} 
        />
      ))}
      
      {ingredients.length > 4 && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/category/kosthold')}
            className="flex items-center gap-1"
          >
            <Apple size={14} />
            <span>Se alle {ingredients.length} matvarer</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FoodSection;
