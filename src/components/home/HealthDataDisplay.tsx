
import React from 'react';
import { motion } from 'framer-motion';
import { CoherenceData } from '@/types/supabase';
import ScanDateCard from '@/components/ScanDateCard';
import CoherenceDisplay from '@/components/CoherenceDisplay';

interface HealthDataDisplayProps {
  coherenceData: CoherenceData | null;
  scanDate: Date;
}

const HealthDataDisplay: React.FC<HealthDataDisplayProps> = ({ coherenceData, scanDate }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ScanDateCard scanDate={new Date(coherenceData?.created_at || scanDate)} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      >
        <CoherenceDisplay coherenceData={coherenceData} />
      </motion.div>
    </>
  );
};

export default HealthDataDisplay;
