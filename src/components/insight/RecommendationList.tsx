
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Recommendation {
  color: string;
  text: string;
  importance?: 'high' | 'medium' | 'low';
  explanation?: string;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
}

const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
  const navigate = useNavigate();
  const [completedRecommendations, setCompletedRecommendations] = useState<string[]>([]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      } 
    }
  };

  const handleMarkComplete = (text: string) => {
    setCompletedRecommendations(prev => [...prev, text]);
    
    toast.success("Anbefaling markert som utført", {
      description: "God jobb! Dette er registrert i din fremgangslogg.",
      action: {
        label: "Vis plan",
        onClick: () => navigate("/my-plan")
      }
    });
  };
  
  const isCompleted = (text: string) => {
    return completedRecommendations.includes(text);
  };

  // Get importance color
  const getImportanceColor = (importance?: 'high' | 'medium' | 'low') => {
    switch (importance) {
      case 'high': return 'bg-[#EA384C]';
      case 'medium': return 'bg-[#F7D154]';
      case 'low': return 'bg-[#77C17E]';
      default: return 'bg-[#9b87f5]';
    }
  };

  return (
    <motion.div 
      className="pt-5 mt-5 border-t border-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h4 
        className="text-sm font-semibold mb-3 text-gray-800 flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center">
          <span className="w-1 h-4 bg-[#9b87f5] rounded-full mr-2"></span>
          Anbefalinger basert på helheten
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-xs text-[#9b87f5] p-1 h-auto flex items-center gap-1"
          onClick={() => navigate('/my-plan')}
        >
          Min plan
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      </motion.h4>
      
      <div className="space-y-2.5">
        {recommendations.map((recommendation, index) => {
          const completed = isCompleted(recommendation.text);
          const importanceColor = getImportanceColor(recommendation.importance);
          
          return (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400 }}
              className={`rounded-xl ${completed ? 'bg-green-50/40 border-green-100' : 'bg-white border-gray-100'} shadow-sm border`}
            >
              <div className="flex items-center gap-2.5 px-4 py-3">
                <div className={`flex-shrink-0 h-2 w-2 rounded-full ${completed ? 'bg-green-500' : importanceColor}`}></div>
                <span className={`text-sm ${completed ? 'text-green-700 line-through decoration-green-500/30' : 'text-gray-700'} leading-snug flex-1`}>
                  {recommendation.text}
                </span>
                
                {recommendation.explanation && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
                          <Info size={14} className="text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{recommendation.explanation}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {!completed && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs border-gray-200 hover:border-[#9b87f5] hover:text-[#9b87f5]"
                    onClick={() => handleMarkComplete(recommendation.text)}
                  >
                    Merk utført
                  </Button>
                )}
                
                {completed && (
                  <div className="h-7 w-7 rounded-full bg-green-100/50 flex items-center justify-center">
                    <Check size={14} className="text-green-600" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <motion.div 
        className="mt-6 text-center" 
        variants={itemVariants}
      >
        <motion.button 
          className="flex items-center mx-auto space-x-1 text-sm text-[#9b87f5] font-medium hover:underline group"
          whileHover={{ y: -2 }}
          onClick={() => navigate('/my-plan')}
        >
          <span>Se alle anbefalinger</span>
          <svg 
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default RecommendationList;
