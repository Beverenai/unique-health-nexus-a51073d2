
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Check, ChevronRight } from 'lucide-react';
import { HealthIssue } from '@/types/supabase';
import { getMainRecommendation, getSecondaryRecommendation } from './utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface RecommendationBadgesProps {
  topIssues: HealthIssue[];
  healthIssues: HealthIssue[];
  isExpanded: boolean;
}

const RecommendationBadges: React.FC<RecommendationBadgesProps> = ({ 
  topIssues, 
  healthIssues, 
  isExpanded 
}) => {
  const navigate = useNavigate();
  const [completedRecommendations, setCompletedRecommendations] = useState<string[]>([]);
  
  const mainRecommendation = getMainRecommendation(topIssues, healthIssues);
  const secondaryRecommendation = getSecondaryRecommendation(topIssues);

  const handleMarkComplete = (recommendation: string) => {
    // Add to completed recommendations
    setCompletedRecommendations(prev => [...prev, recommendation]);
    
    // Show success toast
    toast.success("Anbefaling markert som utført", {
      description: "God jobb! Dette er registrert i din fremgangslogg.",
      action: {
        label: "Vis plan",
        onClick: () => navigate("/my-plan")
      }
    });
  };
  
  const isCompleted = (recommendation: string) => {
    return completedRecommendations.includes(recommendation);
  };
  
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mb-5">
      <div className="text-xs font-medium uppercase text-gray-500 mb-2.5 flex items-center justify-between">
        <span>Anbefalinger</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-[#9b87f5] p-1 h-auto"
          onClick={() => navigate('/my-plan')}
        >
          Se alle <ChevronRight size={12} />
        </Button>
      </div>
      
      <motion.div 
        className="mb-2.5"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 bg-white shadow-sm border ${isCompleted(mainRecommendation) ? 'border-green-100 bg-green-50/40' : 'border-gray-100'}`}>
          <div className="flex-shrink-0 h-7 w-7 rounded-full bg-[#9b87f5]/10 flex items-center justify-center">
            {isCompleted(mainRecommendation) ? (
              <Check size={15} className="text-green-500" />
            ) : (
              <Heart size={15} className="text-[#9b87f5]" />
            )}
          </div>
          <span className={`text-sm ${isCompleted(mainRecommendation) ? 'text-green-700 line-through decoration-green-500/30' : 'text-gray-700'} font-medium leading-snug flex-1`}>
            {mainRecommendation}
          </span>
          
          {!isCompleted(mainRecommendation) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-[#9b87f5] hover:text-[#7a68d2] hover:bg-[#9b87f5]/5"
              onClick={() => handleMarkComplete(mainRecommendation)}
            >
              Utført
            </Button>
          )}
        </div>
      </motion.div>
      
      {secondaryRecommendation && isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 bg-white shadow-sm border ${isCompleted(secondaryRecommendation) ? 'border-green-100 bg-green-50/40' : 'border-gray-100'}`}>
            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
              {isCompleted(secondaryRecommendation) ? (
                <Check size={15} className="text-green-500" />
              ) : (
                <Brain size={15} className="text-gray-500" />
              )}
            </div>
            <span className={`text-sm ${isCompleted(secondaryRecommendation) ? 'text-green-700 line-through decoration-green-500/30' : 'text-gray-600'} font-medium leading-snug flex-1`}>
              {secondaryRecommendation}
            </span>
            
            {!isCompleted(secondaryRecommendation) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                onClick={() => handleMarkComplete(secondaryRecommendation)}
              >
                Utført
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecommendationBadges;
