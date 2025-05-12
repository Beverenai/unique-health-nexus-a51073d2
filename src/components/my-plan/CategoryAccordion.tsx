
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from 'lucide-react';
import { isPast, parseISO, format } from 'date-fns';
import { nb } from 'date-fns/locale';
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
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'PPP', { locale: nb });
  };
  
  const isRecommendationOverdue = (recommendation: PlanRecommendation) => {
    if (!recommendation.due_date) return false;
    const dueDate = parseISO(recommendation.due_date);
    return isPast(dueDate);
  };
  
  return (
    <Accordion type="multiple" className="w-full" defaultValue={['kosthold', 'tilskudd']}>
      {Object.entries(categories).map(([category, icon]) => (
        <AccordionItem key={category} value={category.toLowerCase()}>
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center">
              {icon}
              <span className="ml-2">{category}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 p-2">
              {recommendations
                .filter(rec => rec.category?.toLowerCase() === category.toLowerCase())
                .map(recommendation => (
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
                
              {recommendations.filter(rec => rec.category?.toLowerCase() === category.toLowerCase()).length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    Ingen anbefalinger i denne kategorien.
                  </p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CategoryAccordion;
