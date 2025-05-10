
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemRelationsProps {
  topSystem: string;
  secondSystem: string;
}

const SystemRelations: React.FC<SystemRelationsProps> = ({ topSystem, secondSystem }) => {
  const displayTopSystem = topSystem || 'nervesystem';
  const displaySecondSystem = secondSystem || 'fordøyelsessystem';
  
  return (
    <motion.div 
      className="bg-gradient-to-br from-[#9b87f5]/10 to-[#9b87f5]/5 backdrop-blur-sm rounded-xl p-5 border border-[#9b87f5]/20 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <motion.h4 
        className="font-semibold text-gray-800 mb-3 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span className="bg-[#9b87f5]/20 p-1.5 rounded-full mr-2">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#9b87f5]">
            <path d="M2 2a2 2 0 0 1 2-2h5.5A2 2 0 0 1 11 2c0 1.6.8 3 2 4 1.9 1.6 3 4 3 6.5V14c0 2.2 1.8 4 4 4v2H0v-2c2.2 0 4-1.8 4-4v-1.5c0-2.5 1.1-4.9 3-6.5 1.2-1 2-2.4 2-4 0-1.1-.9-2-2-2H2z" />
            <path d="M18.4 2.2c2.1.6 3.6 2.5 3.6 4.8v1" />
          </svg>
        </span>
        Systemsammenhenger
      </motion.h4>
      
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-3">
        <motion.div 
          className="bg-white/80 rounded-lg px-3 py-1.5 text-sm font-medium text-[#9b87f5] shadow-sm border border-[#9b87f5]/10"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(155, 135, 245, 0.15)" }}
        >
          {displayTopSystem}
        </motion.div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ArrowRight size={16} className="text-gray-400 hidden sm:block" />
          <ArrowRight size={16} className="text-gray-400 rotate-90 block sm:hidden mx-auto" />
        </motion.div>
        
        <motion.div 
          className="bg-white/80 rounded-lg px-3 py-1.5 text-sm font-medium text-[#9b87f5] shadow-sm border border-[#9b87f5]/10"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(155, 135, 245, 0.15)" }}
        >
          {displaySecondSystem}
        </motion.div>
      </div>
      
      <motion.p 
        className="text-sm text-gray-700 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Alle kroppens systemer er sammenkoblet. Belastning i ett system kan påvirke andre.
        For eksempel kan et overbelastet <span className="font-medium text-[#9b87f5]">{displayTopSystem.toLowerCase()}</span> påvirke 
        <span className="font-medium text-[#9b87f5]"> {displaySecondSystem.toLowerCase()}</span> gjennom
        komplekse biokjemiske feedback-mekanismer.
      </motion.p>
      
      <motion.div 
        className="mt-3 pt-3 border-t border-[#9b87f5]/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button 
          className="text-xs text-[#9b87f5] font-medium flex items-center hover:underline"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          Lær mer om systeminteraksjoner
          <ArrowRight size={12} className="ml-1" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SystemRelations;
