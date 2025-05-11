
import React from 'react';
import { motion } from 'framer-motion';
import { CoherenceData, HealthIssue } from '@/types/supabase';
import BodyBalanceDisplay from '@/components/balance/BodyBalanceDisplay';
import HealthInsightSummary from '@/components/balance/HealthInsightSummary';
import TabViewItem from '@/components/ui/tab-view-item';

interface OverviewTabProps {
  coherenceData: CoherenceData | null;
  healthIssues: HealthIssue[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ coherenceData, healthIssues }) => {
  // Only show top 3 insights for a cleaner overview
  const topIssues = [...healthIssues].sort((a, b) => b.load - a.load).slice(0, 3);

  // Create a staggered animation effect using custom delays
  return (
    <div className="space-y-5">
      <TabViewItem isActive={true}>
        <BodyBalanceDisplay coherenceData={coherenceData} />
      </TabViewItem>
      
      <TabViewItem isActive={true} transitionDelay={0.1}>
        <HealthInsightSummary healthIssues={topIssues} className="mt-4" />
      </TabViewItem>
    </div>
  );
};

export default OverviewTab;
