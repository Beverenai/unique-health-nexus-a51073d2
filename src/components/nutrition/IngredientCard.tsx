
import React from 'react';
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Info } from 'lucide-react';
import { CustomTooltip } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  benefits: string[];
  nutrients: string[];
  description?: string;
  imageUrl?: string;
}

interface IngredientCardProps {
  ingredient: Ingredient;
  reason?: string;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient, reason }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden border-white/20 backdrop-blur-sm">
        <div className="flex items-start p-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-800">{ingredient.name}</h3>
              {reason && (
                <CustomTooltip content={reason}>
                  <Info size={14} className="text-gray-400 cursor-help" />
                </CustomTooltip>
              )}
            </div>
            
            {ingredient.description && (
              <CardDescription className="mt-1 text-sm text-gray-500">
                {ingredient.description}
              </CardDescription>
            )}
            
            <div className="mt-3 flex flex-wrap gap-1.5">
              {ingredient.benefits.map((benefit, index) => (
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
              {ingredient.nutrients.map((nutrient, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                >
                  {nutrient}
                </Badge>
              ))}
            </div>
          </div>
          
          {ingredient.imageUrl && (
            <div className="ml-3 h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={ingredient.imageUrl} 
                alt={ingredient.name}
                className="w-full h-full object-cover" 
              />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default IngredientCard;
