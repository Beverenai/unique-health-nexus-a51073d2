
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HealthIssue } from '@/types/supabase';
import { useCarouselStyles } from './useCarouselStyles';
import { getSystemData } from '@/components/insight/SystemCard';

interface HealthIssueCardProps {
  issue: HealthIssue;
  onClick: () => void;
}

const HealthIssueCard: React.FC<HealthIssueCardProps> = ({ issue, onClick }) => {
  const { getProgressColor, getTextColor } = useCarouselStyles();
  const { icon, bgColor } = getSystemData(issue.name, issue);

  return (
    <motion.div 
      className="p-1"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Card 
        className={`p-4 ${bgColor} cursor-pointer hover:shadow-md transition-all backdrop-blur-sm border border-white/40`}
        onClick={onClick}
      >
        <div className="flex items-center mb-3">
          <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm">
            {icon}
          </div>
          <span className="ml-2 font-medium">{issue.name}</span>
        </div>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {issue.description}
        </p>
        
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-gray-600 text-xs">Belastning</span>
          <span className={`font-medium text-xs ${getTextColor(issue.load)}`}>
            {issue.load}%
          </span>
        </div>
        
        <Progress 
          value={issue.load} 
          className={`h-1.5 rounded-full ${getProgressColor(issue.load)}`} 
        />
      </Card>
    </motion.div>
  );
};

export default HealthIssueCard;
