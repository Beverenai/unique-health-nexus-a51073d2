
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemChart } from '@/components/system-analysis';
import { ChartData } from '@/components/system-analysis/types';
import { HealthIssue } from '@/types/supabase';
import { getSystemColor } from '@/components/system-analysis/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface InsightsSummaryCardProps {
  healthIssues: HealthIssue[];
}

const InsightsSummaryCard: React.FC<InsightsSummaryCardProps> = ({ healthIssues }) => {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  const topIssues = [...healthIssues].sort((a, b) => b.load - a.load).slice(0, 5);
  
  // Create chart data
  const chartData: ChartData[] = topIssues.map(issue => ({
    name: issue.name,
    value: issue.load,
    color: getSystemColor(issue.load),
    description: issue.description
  }));
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
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
        damping: 25,
        stiffness: 500
      } 
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="mb-5 bg-white/80 backdrop-blur-xl border-white/20 shadow-lg rounded-2xl overflow-hidden">
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <motion.div className="flex items-center gap-2 mb-4" variants={itemVariants}>
            <div className="bg-[#9b87f5]/10 p-1.5 sm:p-2 rounded-full">
              <Lightbulb size={isMobile ? 16 : 18} className="text-[#9b87f5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-800">Hovedfunn</h3>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            className={`flex flex-col ${isMobile ? 'gap-4' : 'md:flex-row gap-6'} items-center mb-6`}
          >
            <div className="flex justify-center">
              <SystemChart data={chartData} size={isMobile ? "md" : "lg"} />
            </div>
            
            <div className="flex-1 w-full">
              <h4 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Dine 5 viktigste helseutfordringer:</h4>
              <div className="space-y-2">
                {topIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    className="bg-white rounded-lg p-2.5 sm:p-3 shadow-sm border border-gray-100"
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: isMobile ? 1 : 1.01 }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: getSystemColor(issue.load) }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-800 truncate text-sm sm:text-base">{issue.name}</p>
                          <span className="text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-gray-100">
                            {issue.load}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-[#9b87f5]/5 rounded-xl p-3 sm:p-4 text-xs sm:text-sm">
              <p className="text-gray-700 leading-relaxed">
                {topIssues[0]?.load > 70 
                  ? 'Skanningen indikerer flere systemer med høy belastning som kan påvirke hverandre. Følg anbefalingene nedenfor for å adressere de viktigste områdene først.'
                  : 'Skanningen viser moderate belastninger i noen systemer. Ved å følge anbefalingene kan du forbedre disse områdene og skape bedre balanse.'}
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InsightsSummaryCard;
