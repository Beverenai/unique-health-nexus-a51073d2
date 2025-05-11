
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { generateInsightSummary } from '@/utils/coherenceUtils';
import { HealthIssue } from '@/types/supabase';
import { Activity, TrendingUp, Zap } from 'lucide-react';

interface HealthInsightSummaryProps {
  healthIssues: HealthIssue[];
  className?: string;
}

const HealthInsightSummary: React.FC<HealthInsightSummaryProps> = ({ 
  healthIssues,
  className 
}) => {
  const insights = generateInsightSummary(healthIssues);
  
  // Icons to use for insights based on index
  const insightIcons = [
    <Activity size={14} className="text-[#9b87f5]" />,
    <TrendingUp size={14} className="text-[#77C17E]" />,
    <Zap size={14} className="text-[#F7D154]" />
  ];
  
  return (
    <Card className={`p-4 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border-white/40 shadow-md rounded-xl ${className}`}>
      <h3 className="text-base font-medium text-gray-800 mb-3">Nøkkelinnsikt</h3>
      
      {insights.length > 0 ? (
        <motion.ul 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {insights.map((insight, index) => (
            <motion.li 
              key={index}
              className="flex items-center bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-white/60 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (0.1 * index) }}
              whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              <div className="bg-[#9b87f5]/10 p-1.5 rounded-full mr-2.5">
                {insightIcons[index % insightIcons.length]}
              </div>
              <span className="text-gray-700 text-sm">{insight}</span>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <p className="text-gray-500 text-sm text-center py-2">Ingen innsikter tilgjengelig</p>
      )}
    </Card>
  );
};

export default HealthInsightSummary;
