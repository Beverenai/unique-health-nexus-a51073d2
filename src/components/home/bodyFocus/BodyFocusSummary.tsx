
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { HealthIssue } from '@/types/supabase';
import { getTopIssues, getSummaryText } from './utils';
import SystemFocusCard from './SystemFocusCard';
import TopIssuesList from './TopIssuesList';
import RecommendationBadges from './RecommendationBadges';

interface BodyFocusSummaryProps {
  coherenceScore: number;
  healthIssues: HealthIssue[];
  className?: string;
}

const BodyFocusSummary: React.FC<BodyFocusSummaryProps> = ({ 
  coherenceScore, 
  healthIssues,
  className
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get top issues for focus
  const topIssues = getTopIssues(healthIssues, 2);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl border-white/20 shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
            <div className="bg-[#9b87f5]/10 p-2 rounded-full">
              <Lightbulb size={20} className="text-[#9b87f5]" />
            </div>
            <h3 className="text-lg font-medium">Kroppens fokusområder</h3>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-gray-700 mb-5 text-sm">
            {getSummaryText(coherenceScore, topIssues)}
          </motion.p>
          
          <div className="mb-5 space-y-3">
            <motion.div variants={itemVariants} className="text-xs font-medium uppercase text-gray-500 mb-1">
              Hovedfokus bør være på
            </motion.div>
            
            <SystemFocusCard 
              healthIssues={healthIssues} 
              topIssues={topIssues}
              isExpanded={isExpanded}
            />
            
            {topIssues.length > 0 && (
              <TopIssuesList 
                topIssues={topIssues} 
                isExpanded={isExpanded}
                onToggleExpand={() => setIsExpanded(!isExpanded)}
              />
            )}
          </div>
          
          <RecommendationBadges 
            topIssues={topIssues} 
            healthIssues={healthIssues}
            isExpanded={isExpanded}
          />
          
          <motion.div variants={itemVariants}>
            <Button 
              variant="outline" 
              className="w-full border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm hover:shadow transition-all"
              onClick={() => navigate('/insights')}
            >
              <span>Se fullstendig systemanalyse</span>
              <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BodyFocusSummary;
