
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
      <Badge 
        variant="outline" 
        className="mb-2 block bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20 border-[#9b87f5]/20 text-sm py-1.5 px-3"
      >
        <Heart size={14} className="mr-1" /> {mainRecommendation}
      </Badge>
      
      {secondaryRecommendation && isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Badge 
            variant="outline" 
            className="block bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200 text-sm py-1.5 px-3"
          >
            <Brain size={14} className="mr-1" /> {secondaryRecommendation}
          </Badge>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecommendationBadges;
