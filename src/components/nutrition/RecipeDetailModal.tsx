
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Utensils, Heart, Share2 } from 'lucide-react';
import { Recipe, RecipeIngredient, RecipeInstruction } from '@/types/nutrition';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';

interface RecipeDetailModalProps {
  recipe: Recipe & { ingredients?: RecipeIngredient[] };
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, isOpen, onClose }) => {
  const formatTime = (minutes?: number): string => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} t${mins > 0 ? ` ${mins} min` : ''}`;
  };
  
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  
  const handleSave = () => {
    // In a real app, this would save the recipe to the user's favorites
    toast.success("Oppskrift lagret i dine favoritter");
  };
  
  const handleShare = () => {
    // In a real app, this would share the recipe
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: recipe.description,
        url: window.location.href,
      })
      .then(() => toast.success("Oppskrift delt"))
      .catch(() => toast.error("Deling avbrutt"));
    } else {
      toast.success("Delingslink kopiert til utklippstavlen");
    }
  };

  const instructions = recipe.instructions 
    ? Array.isArray(recipe.instructions) 
      ? recipe.instructions 
      : JSON.parse(recipe.instructions as unknown as string)
    : [];
    
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">{recipe.name}</DialogTitle>
          <DialogDescription>
            {recipe.description}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="pr-4 max-h-[calc(90vh-180px)]">
          {recipe.image_url && (
            <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
              <img 
                src={recipe.image_url} 
                alt={recipe.name}
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 mb-4">
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
          
          <div className="mb-4">
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
            <div className="mb-4">
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
          
          <Separator className="my-4" />
          
          <div className="mb-4">
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
          
          <Separator className="my-4" />
          
          <div className="mb-4">
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
        </ScrollArea>
        
        <DialogFooter className="mt-4 flex space-x-2">
          <Button variant="outline" onClick={handleSave}>
            <Heart size={16} className="mr-2" />
            Lagre
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 size={16} className="mr-2" />
            Del
          </Button>
          <Button onClick={onClose}>Lukk</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailModal;
