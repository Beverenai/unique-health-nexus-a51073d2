
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Ingredient } from '@/components/nutrition/IngredientCard';
import { Supplement } from '@/components/nutrition/SupplementCard';
import { Recipe, RecipeIngredient } from '@/types/nutrition';

interface NutritionData {
  ingredients: Ingredient[];
  supplements: Supplement[];
  recipes: (Recipe & { ingredients?: RecipeIngredient[] })[];
  explanations: Record<string, string>;
  isLoading: boolean;
  error: Error | null;
}

export const useNutritionRecommendations = () => {
  const { user } = useAuth();
  const [data, setData] = useState<NutritionData>({
    ingredients: [],
    supplements: [],
    recipes: [],
    explanations: {},
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchNutritionData = async () => {
      if (!user) return;
      
      try {
        // For demonstration, we're using mock data for ingredients and supplements
        // In a real implementation, we would fetch from Supabase tables
        
        // Example query structure for future implementation:
        // const { data: ingredients, error: ingredientsError } = await supabase
        //   .from('nutrition_ingredients')
        //   .select('*')
        //   .eq('user_id', user.id);

        // Mock data for ingredients and supplements
        const mockIngredients: Ingredient[] = [
          {
            id: '1',
            name: 'Blåbær',
            category: 'Bær',
            benefits: ['Antioksidant', 'Forbedrer syn'],
            nutrients: ['Vitamin C', 'Fiber', 'Mangan'],
            description: 'Rike på antioksidanter som beskytter mot frie radikaler.',
            imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
          },
          {
            id: '2',
            name: 'Avokado',
            category: 'Frukt',
            benefits: ['Hjertehelse', 'Anti-inflammatorisk'],
            nutrients: ['Vitamin K', 'Folat', 'Sunt fett'],
            description: 'Inneholder enumettet fett som er bra for hjertet.',
            imageUrl: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
          },
          {
            id: '3',
            name: 'Spinat',
            category: 'Grønnsaker',
            benefits: ['Øker jernopptaket', 'Støtter immunforsvaret'],
            nutrients: ['Jern', 'Vitamin A', 'Vitamin K'],
            description: 'Næringsrik grønn bladgrønnsak som er rik på jern.',
            imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
          }
        ];
        
        const mockSupplements: Supplement[] = [
          {
            id: '1',
            name: 'Vitamin D3',
            category: 'Vitaminer',
            benefits: ['Benstruktur', 'Immunforsvar', 'Humør'],
            dosage: '1000-2000 IU daglig',
            description: 'Viktig for kalsiumopptak og immunforsvar.',
            warning: 'Unngå overdosering, konsulter lege ved høye doser.'
          },
          {
            id: '2',
            name: 'Omega-3',
            category: 'Fettsyrer',
            benefits: ['Hjernefunksjon', 'Hjertehelse', 'Reduserer inflammasjon'],
            dosage: '1-2 gram daglig',
            description: 'Essensielle fettsyrer fra fisk eller alger.'
          },
          {
            id: '3',
            name: 'Magnesium',
            category: 'Mineraler',
            benefits: ['Muskelfunksjon', 'Nervesystem', 'Søvnkvalitet'],
            dosage: '300-400mg daglig',
            description: 'Viktig for over 300 biokjemiske reaksjoner i kroppen.'
          }
        ];
        
        const mockExplanations: Record<string, string> = {
          '1': 'Basert på lavt antioksidantnivå i blodet',
          '2': 'Anbefalt for bedre fettbalanse og hjertehelse',
          '3': 'Hjelper med jernmangel identifisert i skanningen'
        };
        
        // Fetch real recipes from the database
        const { data: recipes, error: recipesError } = await supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (recipesError) throw recipesError;
        
        // Fetch ingredients for each recipe
        const recipeIds = recipes.map((recipe: Recipe) => recipe.id);
        
        const { data: recipeIngredients, error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .select('*')
          .in('recipe_id', recipeIds);
          
        if (ingredientsError) throw ingredientsError;
        
        // Group ingredients by recipe_id
        const ingredientsByRecipeId: { [key: string]: RecipeIngredient[] } = {};
        recipeIngredients.forEach((ingredient: RecipeIngredient) => {
          if (!ingredientsByRecipeId[ingredient.recipe_id]) {
            ingredientsByRecipeId[ingredient.recipe_id] = [];
          }
          ingredientsByRecipeId[ingredient.recipe_id].push(ingredient);
        });
        
        // Add ingredients to each recipe
        const recipesWithIngredients = recipes.map((recipe: Recipe) => ({
          ...recipe,
          ingredients: ingredientsByRecipeId[recipe.id] || []
        }));
        
        setData({
          ingredients: mockIngredients,
          supplements: mockSupplements,
          recipes: recipesWithIngredients,
          explanations: mockExplanations,
          isLoading: false,
          error: null
        });
        
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
        setData(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error as Error 
        }));
      }
    };
    
    fetchNutritionData();
  }, [user]);
  
  return data;
};
