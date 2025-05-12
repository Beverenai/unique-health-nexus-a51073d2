
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Utensils, Heart, Share2, ChevronLeft } from 'lucide-react';
import { Recipe, RecipeIngredient, RecipeInstruction } from '@/types/nutrition';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const RecipeDetail = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe & { ingredients?: RecipeIngredient[] }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) return;
      
      setIsLoading(true);
      try {
        // Fetch recipe details
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', recipeId)
          .single();
          
        if (recipeError) throw recipeError;
        if (!recipeData) {
          setError('Oppskriften ble ikke funnet');
          setIsLoading(false);
          return;
        }
        
        // Fetch recipe ingredients
        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .select('*')
          .eq('recipe_id', recipeId);
          
        if (ingredientsError) throw ingredientsError;
        
        // Parse JSON fields if they are strings
        let parsedInstructions = recipeData.instructions;
        if (typeof parsedInstructions === 'string') {
          try {
            parsedInstructions = JSON.parse(parsedInstructions);
          } catch (e) {
            console.error('Failed to parse instructions JSON:', e);
          }
        }
        
        let parsedNutritionalInfo = recipeData.nutritional_info;
        if (typeof parsedNutritionalInfo === 'string') {
          try {
            parsedNutritionalInfo = JSON.parse(parsedNutritionalInfo);
          } catch (e) {
            console.error('Failed to parse nutritional_info JSON:', e);
          }
        }
        
        // Combine recipe with ingredients and parsed data
        setRecipe({
          ...recipeData,
          instructions: parsedInstructions,
          nutritional_info: parsedNutritionalInfo,
          ingredients: ingredientsData || []
        });
        
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Kunne ikke hente oppskriften');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipe();
  }, [recipeId]);

  const formatTime = (minutes?: number): string => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} t${mins > 0 ? ` ${mins} min` : ''}`;
  };
  
  const totalTime = recipe ? (recipe.prep_time || 0) + (recipe.cook_time || 0) : 0;
  
  const handleSave = () => {
    toast.success("Oppskrift lagret i dine favoritter");
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.name || 'Oppskrift',
        text: recipe?.description || '',
        url: window.location.href,
      })
      .then(() => toast.success("Oppskrift delt"))
      .catch(() => toast.error("Deling avbrutt"));
    } else {
      toast.success("Delingslink kopiert til utklippstavlen");
    }
  };

  // Ensure instructions are properly parsed from JSON if needed
  const getProcessedInstructions = (): RecipeInstruction[] => {
    if (!recipe?.instructions) return [];
    
    // If already an array, return it directly
    if (Array.isArray(recipe.instructions)) {
      return recipe.instructions;
    }
    
    // If it's a string (JSON), try to parse it
    if (typeof recipe.instructions === 'string') {
      try {
        return JSON.parse(recipe.instructions);
      } catch (e) {
        console.error('Failed to parse instructions:', e);
        return [];
      }
    }
    
    // If it's already a parsed object but not an array
    if (typeof recipe.instructions === 'object') {
      // Try to convert it to array if possible
      if (Array.isArray(Object.values(recipe.instructions))) {
        return Object.values(recipe.instructions);
      }
    }
    
    return [];
  };
  
  const instructions = getProcessedInstructions();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }
  
  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Tilbake
        </Button>
        <div className="text-center py-12">
          <p className="text-xl text-red-500 mb-4">{error || 'Oppskrift ikke funnet'}</p>
          <Button onClick={() => navigate('/recipes')}>
            Se alle oppskrifter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Tilbake
        </Button>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100/40 overflow-hidden">
          {recipe.image_url && (
            <div className="w-full h-64 overflow-hidden">
              <img 
                src={recipe.image_url} 
                alt={recipe.name}
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-2">{recipe.name}</h1>
            
            {recipe.description && (
              <p className="text-gray-600 mb-4">{recipe.description}</p>
            )}
            
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm">Totalt: {formatTime(totalTime)}</span>
              </div>
              
              {recipe.prep_time !== null && (
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <ChefHat size={16} className="text-gray-500" />
                  <span className="text-sm">Forberedelse: {formatTime(recipe.prep_time)}</span>
                </div>
              )}
              
              {recipe.cook_time !== null && (
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <Utensils size={16} className="text-gray-500" />
                  <span className="text-sm">Tilberedning: {formatTime(recipe.cook_time)}</span>
                </div>
              )}
              
              {recipe.servings !== null && (
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <Users size={16} className="text-gray-500" />
                  <span className="text-sm">Porsjoner: {recipe.servings}</span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Helsefordeler:</h3>
              <div className="flex flex-wrap gap-1.5">
                {recipe.health_benefits?.map((benefit, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
            
            {recipe.nutritional_info && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Næringsinnhold (per porsjon):</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(recipe.nutritional_info as Record<string, number>).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-2 rounded">
                      <div className="text-sm font-medium capitalize">{key}</div>
                      <div className="text-lg">{value}{key === 'kalorier' ? '' : 'g'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Ingredienser:</h3>
              <ul className="list-disc list-inside space-y-1">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">
                    {ingredient.amount && ingredient.unit 
                      ? `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`
                      : ingredient.name
                    }
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Fremgangsmåte:</h3>
              <ol className="list-decimal list-inside space-y-3">
                {instructions.map((instruction: RecipeInstruction, index: number) => (
                  <li key={index} className="text-gray-700 pl-2">
                    <span className="font-medium">Steg {instruction.step}: </span>
                    {instruction.text}
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={handleSave} className="flex-1">
                <Heart size={16} className="mr-2" />
                Lagre
              </Button>
              <Button variant="outline" onClick={handleShare} className="flex-1">
                <Share2 size={16} className="mr-2" />
                Del
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
