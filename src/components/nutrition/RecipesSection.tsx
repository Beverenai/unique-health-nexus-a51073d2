
import React, { useState } from 'react';
import RecipeCard from './RecipeCard';
import RecipeDetailModal from './RecipeDetailModal';
import { useRecipes } from '@/hooks/useRecipes';
import { Recipe, RecipeIngredient } from '@/types/nutrition';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from 'lucide-react';

interface RecipesSectionProps {
  healthIssueId?: string;
  limit?: number;
}

const RecipesSection: React.FC<RecipesSectionProps> = ({ healthIssueId, limit }) => {
  const { recipes, recipesByHealthIssue, featuredRecipes, isLoading } = useRecipes(healthIssueId);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<(Recipe & { ingredients?: RecipeIngredient[] }) | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  let displayRecipes = activeTab === 'recommended' && healthIssueId 
    ? recipesByHealthIssue[healthIssueId] || []
    : activeTab === 'featured' 
      ? featuredRecipes 
      : recipes;
  
  // Apply search filter
  if (searchTerm.trim() !== '') {
    const searchLower = searchTerm.toLowerCase();
    displayRecipes = displayRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(searchLower) ||
      recipe.description?.toLowerCase().includes(searchLower) ||
      recipe.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      recipe.health_benefits?.some(benefit => benefit.toLowerCase().includes(searchLower))
    );
  }
  
  // Apply limit if specified
  if (limit && displayRecipes.length > limit) {
    displayRecipes = displayRecipes.slice(0, limit);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Søk oppskrifter..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="text-sm">Alle oppskrifter</TabsTrigger>
          <TabsTrigger value="featured" className="text-sm">Utvalgte</TabsTrigger>
          {healthIssueId && (
            <TabsTrigger value="recommended" className="text-sm">Anbefalt for deg</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
              <p className="mt-2 text-gray-500">Laster oppskrifter...</p>
            </div>
          ) : displayRecipes.length > 0 ? (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {displayRecipes.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onClick={() => setSelectedRecipe(recipe)} 
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <BookOpen size={24} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">Ingen oppskrifter funnet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="featured" className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
              <p className="mt-2 text-gray-500">Laster utvalgte oppskrifter...</p>
            </div>
          ) : featuredRecipes.length > 0 ? (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {featuredRecipes.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onClick={() => setSelectedRecipe(recipe)} 
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <BookOpen size={24} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">Ingen utvalgte oppskrifter</p>
            </div>
          )}
        </TabsContent>
        
        {healthIssueId && (
          <TabsContent value="recommended" className="mt-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
                <p className="mt-2 text-gray-500">Laster anbefalte oppskrifter...</p>
              </div>
            ) : recipesByHealthIssue[healthIssueId]?.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {recipesByHealthIssue[healthIssueId].map(recipe => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      onClick={() => setSelectedRecipe(recipe)} 
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8">
                <BookOpen size={24} className="mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500">Ingen anbefalte oppskrifter for din helseprofil</p>
              </div>
            )}
          </TabsContent>
        )}
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

export default RecipesSection;
