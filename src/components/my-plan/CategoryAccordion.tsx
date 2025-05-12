
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ChevronRight } from 'lucide-react';
import { isPast, parseISO, format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlanRecommendation } from '@/types/database';

interface CategoryAccordionProps {
  categories: Record<string, JSX.Element>;
  recommendations: PlanRecommendation[];
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ categories, recommendations }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'PPP', { locale: nb });
  };
  
  const isRecommendationOverdue = (recommendation: PlanRecommendation) => {
    if (!recommendation.due_date) return false;
    const dueDate = parseISO(recommendation.due_date);
    return isPast(dueDate);
  };
  
  // Filter categories to only include those that have matching recommendations
  const categoriesWithRecommendations = Object.entries(categories).filter(([category]) => 
    recommendations.some(rec => rec.category?.toLowerCase() === category.toLowerCase())
  );
  
  // If there are no categories with recommendations, don't render the accordion
  if (categoriesWithRecommendations.length === 0) {
    return (
      <div className="text-center py-4 bg-white/70 backdrop-blur shadow-sm rounded-xl border border-gray-100/40 p-6">
        <p className="text-gray-500">
          Ingen kategorier har anbefalinger for øyeblikket.
        </p>
      </div>
    );
  }
  
  const handleSeeAll = (category: string) => {
    navigate(`/category/${category.toLowerCase()}`);
  };
  
  return (
    <Accordion type="multiple" className="w-full" defaultValue={['kosthold', 'tilskudd']}>
      {categoriesWithRecommendations.map(([category, icon]) => {
        // Get recommendations for this category
        const categoryRecommendations = recommendations
          .filter(rec => rec.category?.toLowerCase() === category.toLowerCase());
        
        // Show only top 3 recommendations in the accordion
        const topRecommendations = categoryRecommendations.slice(0, 3);
        const hasMoreRecommendations = categoryRecommendations.length > 3;
        
        return (
          <AccordionItem key={category} value={category.toLowerCase()}>
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center">
                {icon}
                <span className="ml-2">{category}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 p-2">
                {topRecommendations.map(recommendation => (
                  <div 
                    key={recommendation.id}
                    className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{recommendation.text}</span>
                        {recommendation.due_date && (
                          <Badge 
                            variant="secondary"
                            className={`ml-2 text-xs ${
                              isRecommendationOverdue(recommendation) 
                                ? 'bg-red-500 text-white' 
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {formatDate(recommendation.due_date)}
                          </Badge>
                        )}
                      </div>
                      {recommendation.explanation && (
                        <p className="text-xs text-gray-500">
                          {recommendation.explanation}
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <ThumbsUp size={16} />
                    </Button>
                  </div>
                ))}
                
                {hasMoreRecommendations && (
                  <div className="flex justify-center mt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleSeeAll(category)}
                      className="text-sm text-[#9b87f5] border-[#9b87f5]/30 hover:bg-[#9b87f5]/10 hover:text-[#9b87f5] hover:border-[#9b87f5]/50 w-full"
                    >
                      Se alle
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default CategoryAccordion;
