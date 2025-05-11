
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
      <div className="text-xs font-medium uppercase text-gray-500 mb-2">
        Anbefalinger
      </div>
      
      <motion.div 
        className="group mb-2 rounded-xl bg-gradient-to-r from-[#f2f2f7] to-[#f5f5fa] p-[1px] shadow-sm"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5">
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#9b87f5]/10 flex items-center justify-center">
            <Heart size={14} className="text-[#9b87f5]" />
          </div>
          <span className="text-sm text-gray-700 font-medium leading-tight">{mainRecommendation}</span>
        </div>
      </motion.div>
      
      {secondaryRecommendation && isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group rounded-xl bg-gradient-to-r from-[#f8f8f8] to-[#f1f1f5] p-[1px] shadow-sm"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Brain size={14} className="text-gray-500" />
            </div>
            <span className="text-sm text-gray-600 font-medium leading-tight">{secondaryRecommendation}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecommendationBadges;
