
import React from 'react';
import { motion } from 'framer-motion';
import { HealthIssue } from '@/types/supabase';
import PriorityGroups from '@/components/home/PriorityGroups';

interface PrioritiesTabProps {
  healthIssues: HealthIssue[];
}

const PrioritiesTab: React.FC<PrioritiesTabProps> = ({ healthIssues }) => {
  return (
    <motion.div
      className="pt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PriorityGroups healthIssues={healthIssues} />
    </motion.div>
  );
};

export default PrioritiesTab;
