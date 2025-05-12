
import React from 'react';
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Info, BookOpen } from 'lucide-react';
import { CustomTooltip } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Recipe, RecipeIngredient } from '@/types/nutrition';
import { Button } from '@/components/ui/button';

interface RecipeCardProps {
  recipe: Recipe & { ingredients?: RecipeIngredient[] };
  reason?: string;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, reason, onClick }) => {
  const formatTime = (minutes?: number): string => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} t${mins > 0 ? ` ${mins} min` : ''}`;
  };

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden border-white/20 backdrop-blur-sm">
        <div className="flex items-start">
          {recipe.image_url && (
            <div className="w-1/3 h-[180px]">
              <img 
                src={recipe.image_url} 
                alt={recipe.name}
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div className={`flex-1 p-4 ${recipe.image_url ? 'w-2/3' : 'w-full'}`}>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-800">{recipe.name}</h3>
              {reason && (
                <CustomTooltip content={reason}>
                  <Info size={14} className="text-gray-400 cursor-help" />
                </CustomTooltip>
              )}
            </div>
            
            {recipe.description && (
              <CardDescription className="mt-1 text-sm text-gray-500 line-clamp-2">
                {recipe.description}
              </CardDescription>
            )}
            
            <div className="mt-2 flex flex-wrap gap-2">
              {recipe.difficulty_level && (
                <Badge variant="outline" className="text-xs">
                  {recipe.difficulty_level}
                </Badge>
              )}
              
              <div className="flex items-center text-xs text-gray-500">
                <Clock size={14} className="mr-1" />
                {formatTime(totalTime)}
              </div>
              
              {recipe.servings && (
                <div className="flex items-center text-xs text-gray-500">
                  <Users size={14} className="mr-1" />
                  {recipe.servings}
                </div>
              )}
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1.5">
              {recipe.health_benefits?.map((benefit, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-green-50 text-green-700 hover:bg-green-100"
                >
                  {benefit}
                </Badge>
              ))}
            </div>
            
            <div className="mt-2 flex flex-wrap gap-1.5">
              {recipe.tags?.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs flex items-center gap-1 text-blue-600"
                onClick={(e) => { 
                  e.stopPropagation();
                  onClick?.();
                }}
              >
                <BookOpen size={14} />
                <span>Se oppskrift</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RecipeCard;
