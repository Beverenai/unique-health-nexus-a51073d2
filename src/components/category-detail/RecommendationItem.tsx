
import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isPast, parseISO, format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { PlanRecommendation } from '@/types/database';

interface RecommendationItemProps {
  recommendation: PlanRecommendation;
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({ recommendation }) => {
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
    <motion.div 
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
  );
};

export default RecommendationItem;
