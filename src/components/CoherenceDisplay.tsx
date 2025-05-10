
import React from 'react';
import CoherenceRing from '@/components/CoherenceRing';
import { CoherenceData } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowUpRight, Activity, User } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface CoherenceDisplayProps {
  coherenceData: CoherenceData | null;
}

const CoherenceDisplay: React.FC<CoherenceDisplayProps> = ({ coherenceData }) => {
  const score = coherenceData?.score || 64;
  const scoreDate = coherenceData?.created_at ? new Date(coherenceData.created_at) : new Date();
  
  const getScoreStatus = (score: number) => {
    if (score >= 85) return { text: 'Utmerket', color: 'text-emerald-600' };
    if (score >= 70) return { text: 'God', color: 'text-green-600' };
    if (score >= 50) return { text: 'Middels', color: 'text-amber-600' };
    return { text: 'Trenger oppmerksomhet', color: 'text-red-600' };
  };
  
  const status = getScoreStatus(score);
  
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
      className="flex flex-col items-center justify-center mb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <Card className="w-full overflow-visible bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg border-white/40 shadow-lg rounded-3xl relative z-20">
        <motion.div className="p-6 flex flex-col items-center" variants={itemVariants}>
          <div className="flex items-center justify-between w-full mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Koherensnivå</h2>
            <span className={`text-sm font-medium ${status.color} bg-white/80 px-2 py-0.5 rounded-full border border-gray-100/30 shadow-sm`}>
              {status.text}
            </span>
          </div>
          
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/10 to-[#9b87f5]/5 rounded-full blur-xl"></div>
            <CoherenceRing score={score} />
          </motion.div>
          
          <div className="flex justify-between w-full mt-6 text-sm">
            <motion.div className="flex items-center" variants={itemVariants}>
              <div className="bg-[#9b87f5]/10 p-1.5 rounded-full mr-2">
                <Activity size={14} className="text-[#9b87f5]" />
              </div>
              <div>
                <p className="text-gray-500">Måleverdi</p>
                <p className="font-semibold">{score}% koherens</p>
              </div>
            </motion.div>
            
            <motion.div className="flex items-center" variants={itemVariants}>
              <div className="bg-[#9b87f5]/10 p-1.5 rounded-full mr-2">
                <User size={14} className="text-[#9b87f5]" />
              </div>
              <div>
                <p className="text-gray-500">Målt</p>
                <p className="font-semibold">{format(scoreDate, 'd. MMM', { locale: nb })}</p>
              </div>
            </motion.div>
          </div>
          
          <motion.button 
            className="w-full mt-4 py-3 flex items-center justify-center bg-[#9b87f5]/10 hover:bg-[#9b87f5]/20 text-[#9b87f5] font-medium rounded-xl transition-all"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Se detaljer om koherens <ArrowUpRight size={16} className="ml-1" />
          </motion.button>
        </motion.div>
      </Card>
      
      <motion.div 
        className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow w-11/12 -mt-4 z-10"
        variants={itemVariants}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-gray-600 text-center">
          {coherenceData?.message || 
            'Din kroppsskanning indikerer en total koherens-score på 64%. Følg anbefalingene for å forbedre balansen.'}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CoherenceDisplay;
