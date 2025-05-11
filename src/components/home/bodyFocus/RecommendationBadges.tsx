
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain } from 'lucide-react';
import { HealthIssue } from '@/types/supabase';
import { getMainRecommendation, getSecondaryRecommendation } from './utils';

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
  const mainRecommendation = getMainRecommendation(topIssues, healthIssues);
  const secondaryRecommendation = getSecondaryRecommendation(topIssues);
  
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mb-5">
      <div className="text-xs font-medium uppercase text-gray-500 mb-2.5">
        Anbefalinger
      </div>
      
      <motion.div 
        className="mb-2.5"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 bg-white shadow-sm border border-gray-100">
          <div className="flex-shrink-0 h-7 w-7 rounded-full bg-[#9b87f5]/10 flex items-center justify-center">
            <Heart size={15} className="text-[#9b87f5]" />
          </div>
          <span className="text-sm text-gray-700 font-medium leading-snug">{mainRecommendation}</span>
        </div>
      </motion.div>
      
      {secondaryRecommendation && isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 bg-white shadow-sm border border-gray-100">
            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
              <Brain size={15} className="text-gray-500" />
            </div>
            <span className="text-sm text-gray-600 font-medium leading-snug">{secondaryRecommendation}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecommendationBadges;
