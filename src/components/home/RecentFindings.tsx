
import React from 'react';
import { motion } from 'framer-motion';
import { HealthIssue } from '@/types/supabase';
import HealthIssuesCarousel from '@/components/HealthIssuesCarousel';

interface RecentFindingsProps {
  healthIssues: HealthIssue[];
}

const RecentFindings: React.FC<RecentFindingsProps> = ({ healthIssues }) => {
  return (
    <motion.div 
      className="mt-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <h2 className="text-xl font-playfair font-medium mb-4 text-gray-800">Nylige funn</h2>
      <HealthIssuesCarousel healthIssues={healthIssues.sort((a, b) => b.load - a.load).slice(0, 5)} />
    </motion.div>
  );
};

export default RecentFindings;
