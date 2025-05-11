
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownIcon, RefreshCcw } from 'lucide-react';
import { PullIndicatorProps } from './types';

export const PullIndicator: React.FC<PullIndicatorProps> = ({ 
  springY, 
  rotate, 
  refreshing 
}) => {
  return (
    <motion.div 
      className="absolute top-0 left-0 w-full flex justify-center items-center"
      style={{ y: springY }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm">
        {refreshing ? (
          <RefreshCcw className="animate-spin h-6 w-6 text-primary" />
        ) : (
          <motion.div style={{ rotate }}>
            <ArrowDownIcon className="h-6 w-6 text-primary" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
