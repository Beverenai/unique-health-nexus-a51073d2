
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getModernColor, getBodyStateDescription, getModernTextColor } from '@/utils/coherenceUtils';
import { CoherenceRingCanvas } from '@/components/coherence/CoherenceRingCanvas';

interface BodyBalanceRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BodyBalanceRing: React.FC<BodyBalanceRingProps> = ({ 
  score, 
  size = 'md', 
  className
}) => {
  const bodyState = getBodyStateDescription(score);
  const textColorClass = getModernTextColor(score);
  
  // Adjusted sizes for the rings
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };
  
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        className={cn(
          "relative flex items-center justify-center",
          sizeClasses[size],
          className
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100,
          delay: 0.2 
        }}
      >
        {/* Use the existing CoherenceRingCanvas for the visual ring element */}
        <CoherenceRingCanvas score={score} />
        
        {/* Inner white circle with text */}
        <motion.div 
          className="bg-white rounded-full flex items-center justify-center shadow-md relative z-10" 
          style={{width: '75%', height: '75%'}}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 100
          }}
        >
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <motion.div 
              className={cn("font-medium text-base", textColorClass)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {bodyState}
            </motion.div>
            
            <motion.div
              className="text-gray-500 text-xs mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {score}%
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BodyBalanceRing;
