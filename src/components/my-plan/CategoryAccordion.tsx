
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ChevronRight } from 'lucide-react';
import { isPast, parseISO, format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { PlanRecommendation } from '@/types/database';
import CollapsibleSection from '@/components/dashboard/CollapsibleSection';
import { motion } from 'framer-motion';

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
  
  // If there are no categories with recommendations, don't render any sections
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
    <div className="space-y-6">
      {categoriesWithRecommendations.map(([category, icon]) => {
        // Get recommendations for this category
        const categoryRecommendations = recommendations
          .filter(rec => rec.category?.toLowerCase() === category.toLowerCase());
        
        // Show only top 3 recommendations
        const topRecommendations = categoryRecommendations.slice(0, 3);
        const hasMoreRecommendations = categoryRecommendations.length > 3;
        
        // Determine badge color based on category
        let badgeClass = "ml-2 bg-green-50 text-green-700";
        let bgColor = "";
        
        switch (category.toLowerCase()) {
          case 'mental helse':
            badgeClass = "ml-2 bg-amber-50 text-amber-700";
            break;
          case 'bevegelse':
            badgeClass = "ml-2 bg-blue-50 text-blue-700";
            break;
          case 'søvn':
            badgeClass = "ml-2 bg-indigo-50 text-indigo-700";
            break;
          case 'stress':
            badgeClass = "ml-2 bg-red-50 text-red-700";
            break;
          case 'tilskudd':
            badgeClass = "ml-2 bg-purple-50 text-purple-700";
            break;
        }
        
        return (
          <CollapsibleSection
            key={category}
            title={category}
            isOpen={true} // Default to open
            onToggle={() => {}} // No toggle functionality needed
            icon={icon}
            badge={
              <Badge variant="outline" className={badgeClass}>
                {categoryRecommendations.length}
              </Badge>
            }
          >
            <div className="space-y-3">
              {topRecommendations.map(recommendation => (
                <motion.div
                  key={recommendation.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="overflow-hidden border-white/20 backdrop-blur-sm bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-800">{recommendation.text}</h3>
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
                          <p className="mt-1 text-sm text-gray-500">
                            {recommendation.explanation}
                          </p>
                        )}
                      </div>
                      
                      <Button 
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0 ml-2"
                      >
                        <ThumbsUp size={16} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {hasMoreRecommendations && (
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSeeAll(category)}
                    className="flex items-center gap-1 text-sm text-[#9b87f5] border-[#9b87f5]/30 hover:bg-[#9b87f5]/10 hover:text-[#9b87f5] hover:border-[#9b87f5]/50"
                  >
                    Se alle {categoryRecommendations.length} {category.toLowerCase()}
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </div>
          </CollapsibleSection>
        );
      })}
    </div>
  );
};

export default CategoryAccordion;
