
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Recipe, RecipeIngredient, RecipeInstruction } from '@/types/nutrition';

interface RecipeWithIngredients extends Recipe {
  ingredients: RecipeIngredient[];
}

interface UseRecipesResult {
  recipes: RecipeWithIngredients[];
  recipesByHealthIssue: { [healthIssueId: string]: RecipeWithIngredients[] };
  featuredRecipes: RecipeWithIngredients[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useRecipes = (healthIssueId?: string): UseRecipesResult => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<RecipeWithIngredients[]>([]);
  const [recipesByHealthIssue, setRecipesByHealthIssue] = useState<{ [key: string]: RecipeWithIngredients[] }>({});
  const [featuredRecipes, setFeaturedRecipes] = useState<RecipeWithIngredients[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecipes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (recipesError) throw recipesError;
      
      // Fetch all ingredients for these recipes
      const recipeIds = recipesData.map((recipe: any) => recipe.id);
      
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select('*')
        .in('recipe_id', recipeIds);
        
      if (ingredientsError) throw ingredientsError;
      
      // Group ingredients by recipe_id
      const ingredientsByRecipe: { [key: string]: RecipeIngredient[] } = {};
      ingredientsData.forEach((ingredient: RecipeIngredient) => {
        if (!ingredientsByRecipe[ingredient.recipe_id]) {
          ingredientsByRecipe[ingredient.recipe_id] = [];
        }
        ingredientsByRecipe[ingredient.recipe_id].push(ingredient);
      });
      
      // Combine recipes with their ingredients and process JSON data
      const recipesWithIngredients: RecipeWithIngredients[] = recipesData.map((recipe: any) => {
        // Parse JSON fields if they are strings
        let parsedInstructions = recipe.instructions;
        if (typeof parsedInstructions === 'string') {
          try {
            parsedInstructions = JSON.parse(parsedInstructions);
          } catch (e) {
            console.error('Failed to parse instructions JSON:', e);
          }
        }
        
        let parsedNutritionalInfo = recipe.nutritional_info;
        if (typeof parsedNutritionalInfo === 'string') {
          try {
            parsedNutritionalInfo = JSON.parse(parsedNutritionalInfo);
          } catch (e) {
            console.error('Failed to parse nutritional_info JSON:', e);
          }
        }
        
        return {
          ...recipe,
          instructions: parsedInstructions,
          nutritional_info: parsedNutritionalInfo,
          ingredients: ingredientsByRecipe[recipe.id] || []
        };
      });
      
      setRecipes(recipesWithIngredients);
      
      // Set featured recipes (first 3 recipes or all if less than 3)
      setFeaturedRecipes(recipesWithIngredients.slice(0, 3));
      
      // If healthIssueId is provided, fetch recipes related to that health issue
      if (healthIssueId) {
        await fetchRecipesByHealthIssue(healthIssueId, recipesWithIngredients);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchRecipesByHealthIssue = async (issueId: string, allRecipes: RecipeWithIngredients[]) => {
    try {
      const { data, error } = await supabase
        .from('health_issue_recipes')
        .select('*')
        .eq('health_issue_id', issueId);
        
      if (error) throw error;
      
      // Map health issue recipes to their full recipe data
      const issueRecipes = data.map(relation => {
        return allRecipes.find(recipe => recipe.id === relation.recipe_id);
      }).filter(recipe => recipe !== undefined);
      
      setRecipesByHealthIssue(prev => ({
        ...prev,
        [issueId]: issueRecipes as RecipeWithIngredients[]
      }));
      
    } catch (err) {
      console.error('Error fetching recipes by health issue:', err);
    }
  };
  
  useEffect(() => {
    fetchRecipes();
  }, [user, healthIssueId]);
  
  return {
    recipes,
    recipesByHealthIssue,
    featuredRecipes,
    isLoading,
    error,
    refetch: fetchRecipes
  };
};
