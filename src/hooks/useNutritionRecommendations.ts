
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

        // Mock data for ingredients with expanded selection
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
          },
          {
            id: '4',
            name: 'Laks',
            category: 'Protein',
            benefits: ['Hjernehelse', 'Anti-inflammatorisk'],
            nutrients: ['Omega-3', 'Protein', 'Vitamin D'],
            description: 'Fet fisk rik på omega-3 fettsyrer og protein.',
            imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
          },
          {
            id: '5',
            name: 'Valnøtter',
            category: 'Nøtter',
            benefits: ['Hjernehelse', 'Kolesterolreduserende'],
            nutrients: ['Omega-3', 'Antioksidanter', 'Protein'],
            description: 'Form som ligner hjernen, og er faktisk bra for hjernen.',
            imageUrl: 'https://images.unsplash.com/photo-1563412887837-8f9b1417eba1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
          },
          {
            id: '6',
            name: 'Brokkoli',
            category: 'Grønnsaker',
            benefits: ['Detox', 'Kreftforebyggende'],
            nutrients: ['Vitamin C', 'Folat', 'Fiber'],
            description: 'Korsblomst med sterke antioksidanter og sulforforbindelser.',
            imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
          },
          {
            id: '7',
            name: 'Ingefær',
            category: 'Urter',
            benefits: ['Anti-inflammatorisk', 'Fordøyelse'],
            nutrients: ['Gingerol', 'Antioksidanter'],
            description: 'Kraftig rot med anti-inflammatoriske egenskaper.',
            imageUrl: 'https://images.unsplash.com/photo-1573414405945-71179a439a74?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
          },
          {
            id: '8',
            name: 'Chiafrø',
            category: 'Frø',
            benefits: ['Omega-3', 'Fordøyelse'],
            nutrients: ['Fiber', 'Protein', 'Omega-3'],
            description: 'Små frø med høyt innhold av fiber og omega-3.',
            imageUrl: 'https://images.unsplash.com/photo-1541595825372-7b8995a66baa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
          },
        ];
        
        // Expanded mock data for supplements
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
          },
          {
            id: '4',
            name: 'Probiotika',
            category: 'Tarmhelse',
            benefits: ['Fordøyelse', 'Immunforsvar', 'Tarmflora'],
            dosage: '10-50 milliarder CFU daglig',
            description: 'Gode bakterier som støtter tarmfloraen og fordøyelsen.'
          },
          {
            id: '5',
            name: 'Sink',
            category: 'Mineraler',
            benefits: ['Immunforsvar', 'Sårheling', 'Hormonfunksjon'],
            dosage: '15-30mg daglig',
            description: 'Viktig mineral for immunforsvar og cellefunksjon.'
          },
          {
            id: '6',
            name: 'C-vitamin',
            category: 'Vitaminer',
            benefits: ['Immunforsvar', 'Kollagenproduksjon', 'Antioksidant'],
            dosage: '500-1000mg daglig',
            description: 'Støtter immunforsvaret og er viktig for vevshelse.'
          },
          {
            id: '7',
            name: 'Kurkumin',
            category: 'Planteekstrakter',
            benefits: ['Anti-inflammatorisk', 'Antioksidant', 'Leddhelse'],
            dosage: '500-1000mg daglig',
            description: 'Aktiv forbindelse i gurkemeie med kraftige anti-inflammatoriske egenskaper.'
          },
        ];
        
        // Expanded explanations
        const mockExplanations: Record<string, string> = {
          '1': 'Basert på lavt antioksidantnivå i blodet',
          '2': 'Anbefalt for bedre fettbalanse og hjertehelse',
          '3': 'Hjelper med jernmangel identifisert i skanningen',
          '4': 'Støtter omega-3-nivåer og hjernehelse',
          '5': 'Anbefalt for bedre hjernefunksjon og kognisjon',
          '6': 'Støtter avgiftningssystemet og beskytter mot toksiner',
          '7': 'Hjelper med kronisk betennelsestilstand',
          '8': 'Øker omega-3-inntaket og støtter fordøyelsen'
        };
        
        // Fetch real recipes from the database
        const { data: recipes, error: recipesError } = await supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (recipesError) throw recipesError;
        
        // Fetch ingredients for each recipe
        const recipeIds = recipes.map((r: any) => r.id);
        
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
        
        // Add ingredients to each recipe and parse JSON data
        const recipesWithIngredients = recipes.map((r: any) => {
          // Parse JSON fields if they are strings
          let parsedInstructions = r.instructions;
          if (typeof parsedInstructions === 'string') {
            try {
              parsedInstructions = JSON.parse(parsedInstructions);
            } catch (e) {
              console.error('Failed to parse instructions JSON:', e);
            }
          }
          
          let parsedNutritionalInfo = r.nutritional_info;
          if (typeof parsedNutritionalInfo === 'string') {
            try {
              parsedNutritionalInfo = JSON.parse(parsedNutritionalInfo);
            } catch (e) {
              console.error('Failed to parse nutritional_info JSON:', e);
            }
          }
          
          return {
            ...r,
            instructions: parsedInstructions,
            nutritional_info: parsedNutritionalInfo,
            ingredients: ingredientsByRecipeId[r.id] || []
          };
        });
        
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
