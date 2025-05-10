
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
      className="relative mb-20 z-10" /* Increased margin-bottom to 20 */
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
        <CoherenceDisplay coherenceData={coherenceData} />
      </motion.div>
      
      {/* Health summary */}
      <motion.div 
        className="mt-8 bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm p-4"
        variants={childAnimation}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <span className="w-1 h-4 bg-[#9b87f5] rounded-full mr-2"></span>
          Daglig helsesammendrag
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Generell balanse</span>
            <span className="font-medium text-gray-800">74%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Energinivå</span>
            <span className="font-medium text-gray-800">68%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Restitusjon</span>
            <span className="font-medium text-gray-800">82%</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HealthDataDisplay;
