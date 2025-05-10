
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatusLabelProps {
  score: number;
  statusLabel: string;
  textColorClass: string;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({ score, statusLabel, textColorClass }) => {
  return (
    <motion.div 
      className={cn("mt-2 px-3 py-1 rounded-full bg-white shadow-sm text-xs font-medium", textColorClass)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      role="status"
      aria-label={`Coherence status: ${statusLabel}`}
    >
      {statusLabel}
    </motion.div>
  );
};
