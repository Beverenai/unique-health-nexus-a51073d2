
import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CoherenceData } from '@/types/supabase';
import BodyBalanceRing from './BodyBalanceRing';
import { getHealthMessage } from '@/utils/coherenceUtils';
import { useNavigate } from 'react-router-dom';

interface BodyBalanceDisplayProps {
  coherenceData: CoherenceData | null;
}

const BodyBalanceDisplay: React.FC<BodyBalanceDisplayProps> = ({ coherenceData }) => {
  const navigate = useNavigate();
  const score = coherenceData?.score || 64;
  const healthMessage = getHealthMessage(score);
  
  // Simple animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <Card className="w-full overflow-visible bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-lg border-white/40 shadow-lg rounded-xl relative">
        <motion.div className="p-5 flex flex-col items-center" variants={itemVariants}>
          <motion.h2 
            className="text-lg font-medium text-gray-800 mb-3"
            variants={itemVariants}
          >
            Kroppens balanse
          </motion.h2>
          
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BodyBalanceRing score={score} />
          </motion.div>
          
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-sm w-full mt-4 text-center"
            variants={itemVariants}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-gray-700">
              {healthMessage}
            </p>
          </motion.div>
          
          <motion.button 
            className="w-full mt-4 py-2.5 flex items-center justify-center bg-[#9b87f5]/10 hover:bg-[#9b87f5]/20 text-[#9b87f5] font-medium rounded-xl transition-all"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/insights')}
          >
            Se detaljer <ArrowUpRight size={14} className="ml-1" />
          </motion.button>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default BodyBalanceDisplay;
