
import React from 'react';
import { motion } from 'framer-motion';
import { CoherenceData, HealthIssue } from '@/types/supabase';
import BodyBalanceDisplay from '@/components/balance/BodyBalanceDisplay';
import HealthInsightSummary from '@/components/balance/HealthInsightSummary';

interface OverviewTabProps {
  coherenceData: CoherenceData | null;
  healthIssues: HealthIssue[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ coherenceData, healthIssues }) => {
  // Only show top 3 insights for a cleaner overview
  const topIssues = [...healthIssues].sort((a, b) => b.load - a.load).slice(0, 3);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <BodyBalanceDisplay coherenceData={coherenceData} />
      <HealthInsightSummary healthIssues={topIssues} className="mt-4" />
    </motion.div>
  );
};

export default OverviewTab;
