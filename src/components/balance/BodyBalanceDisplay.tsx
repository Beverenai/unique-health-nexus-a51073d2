
import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowUpRight, Activity, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { CoherenceData } from '@/types/supabase';
import BodyBalanceRing from './BodyBalanceRing';
import { getHealthMessage } from '@/utils/coherenceUtils';

interface BodyBalanceDisplayProps {
  coherenceData: CoherenceData | null;
}

const BodyBalanceDisplay: React.FC<BodyBalanceDisplayProps> = ({ coherenceData }) => {
  const score = coherenceData?.score || 64;
  const scanDate = coherenceData?.created_at ? new Date(coherenceData.created_at) : new Date();
  const healthMessage = getHealthMessage(score);
  
  // Simple animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        className="absolute -z-10 top-40 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#9b87f5]/5 rounded-full blur-[80px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <Card className="w-full overflow-visible bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border-white/40 shadow-lg rounded-3xl relative z-20">
        <motion.div className="p-6 flex flex-col items-center" variants={itemVariants}>
          <div className="flex items-center justify-between w-full mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Kroppens nåværende balanse</h2>
          </div>
          
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/10 to-[#9b87f5]/5 rounded-full blur-xl"></div>
            <BodyBalanceRing score={score} />
          </motion.div>
          
          <motion.div className="w-full mt-2 text-sm text-center" variants={itemVariants}>
            <div className="flex items-center justify-center">
              <Calendar size={14} className="text-[#9b87f5] mr-1" />
              <p className="text-gray-500">
                Basert på skanning {format(scanDate, 'd. MMMM yyyy', { locale: nb })}
              </p>
            </div>
          </motion.div>
          
          <motion.button 
            className="w-full mt-4 py-3 flex items-center justify-center bg-[#9b87f5]/10 hover:bg-[#9b87f5]/20 text-[#9b87f5] font-medium rounded-xl transition-all"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(155, 135, 245, 0.1), 0 10px 10px -5px rgba(155, 135, 245, 0.04)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            Se detaljer om kroppsbalanse <ArrowUpRight size={16} className="ml-1" />
          </motion.button>
        </motion.div>
      </Card>
      
      <motion.div 
        className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-sm w-11/12 mt-4 z-10"
        variants={itemVariants}
        transition={{ delay: 0.6 }}
        whileHover={{ 
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)"
        }}
      >
        <p className="text-sm text-gray-600 text-center">
          {healthMessage}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default BodyBalanceDisplay;
