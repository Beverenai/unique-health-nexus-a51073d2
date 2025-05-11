
import React from 'react';
import { motion } from 'framer-motion';
import { CoherenceData } from '@/types/supabase';
import ScanDateCard from '@/components/ScanDateCard';
import BodyBalanceDisplay from '@/components/balance/BodyBalanceDisplay';
import HealthInsightSummary from '@/components/balance/HealthInsightSummary';

interface HealthDataDisplayProps {
  coherenceData: CoherenceData | null;
  scanDate: Date;
  healthIssues: any[];
}

const HealthDataDisplay: React.FC<HealthDataDisplayProps> = ({ 
  coherenceData, 
  scanDate,
  healthIssues
}) => {
  // Create a staggered animation effect
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const childAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div
      className="relative mb-20 z-10"
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
    >
      {/* Background decorative elements */}
      <div className="absolute -z-10 top-10 left-5 w-20 h-20 bg-[#9b87f5]/10 rounded-full blur-3xl"></div>
      <div className="absolute -z-10 bottom-10 right-5 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
      
      <motion.div variants={childAnimation} transition={{ duration: 0.6 }}>
        <ScanDateCard scanDate={new Date(coherenceData?.created_at || scanDate)} />
      </motion.div>
      
      <motion.div variants={childAnimation} transition={{ duration: 0.8, type: "spring", stiffness: 100 }}>
        <BodyBalanceDisplay coherenceData={coherenceData} />
      </motion.div>
      
      {/* Health insights summary */}
      <motion.div 
        variants={childAnimation}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-4"
      >
        <HealthInsightSummary healthIssues={healthIssues} />
      </motion.div>
    </motion.div>
  );
};

export default HealthDataDisplay;
