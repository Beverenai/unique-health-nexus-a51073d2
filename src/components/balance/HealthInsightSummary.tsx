
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { generateInsightSummary } from '@/utils/coherenceUtils';
import { HealthIssue } from '@/types/supabase';

interface HealthInsightSummaryProps {
  healthIssues: HealthIssue[];
  className?: string;
}

const HealthInsightSummary: React.FC<HealthInsightSummaryProps> = ({ 
  healthIssues,
  className 
}) => {
  const insights = generateInsightSummary(healthIssues);
  
  return (
    <Card className={`p-4 bg-white/70 backdrop-blur-sm border border-white/40 shadow-sm rounded-xl ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Nøkkelinnsikt</h3>
      
      <ul className="space-y-2">
        {insights.map((insight, index) => (
          <motion.li 
            key={index}
            className="flex items-start"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#9b87f5] mt-1.5 mr-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm">{insight}</span>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
};

export default HealthInsightSummary;
