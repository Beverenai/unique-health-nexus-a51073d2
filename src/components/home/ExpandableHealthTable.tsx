
import React from 'react';
import { motion } from 'framer-motion';
import HealthInfoTable from '@/components/HealthInfoTable';

interface ExpandableHealthTableProps {
  isVisible: boolean;
}

const ExpandableHealthTable: React.FC<ExpandableHealthTableProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <motion.div 
      className="mt-6"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <HealthInfoTable 
        title="Helseinformasjon" 
        description="Detaljert oversikt over helsetilstanden din"
      />
    </motion.div>
  );
};

export default ExpandableHealthTable;
