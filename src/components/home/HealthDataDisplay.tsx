
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
        staggerChildren: 0.2
      }
    }
  };
  
  const childAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Welcome animation for new scan (displays once)
  const [showWelcome, setShowWelcome] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2200);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.div
      className="relative mb-20 z-10"
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome animation overlay - simplified for Apple-like minimal aesthetic */}
      {showWelcome && (
        <motion.div 
          className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        >
          <motion.div 
            className="w-16 h-16 rounded-full bg-[#9b87f5]/10 flex items-center justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.1, 0.9] }}
            transition={{ duration: 1.8 }}
          >
            <motion.div 
              className="w-10 h-10 rounded-full bg-[#9b87f5]/30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
          </motion.div>
          <motion.p 
            className="text-gray-600 mt-4 font-medium text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Analyserer skanningsresultater...
          </motion.p>
        </motion.div>
      )}

      {/* Background decorative elements - simplified and more subtle */}
      <motion.div 
        className="absolute -z-10 top-10 left-5 w-20 h-20 bg-[#9b87f5]/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div variants={childAnimation} transition={{ duration: 0.6 }}>
        <ScanDateCard scanDate={new Date(coherenceData?.created_at || scanDate)} />
      </motion.div>
      
      <motion.div 
        variants={childAnimation} 
        transition={{ duration: 0.6 }}
        className="relative mt-4"
      >
        <BodyBalanceDisplay coherenceData={coherenceData} />
      </motion.div>
      
      {/* Health insights summary */}
      <motion.div 
        variants={childAnimation}
        transition={{ duration: 0.6 }}
        className="mt-5"
      >
        <HealthInsightSummary healthIssues={healthIssues} />
      </motion.div>
    </motion.div>
  );
};

export default HealthDataDisplay;
