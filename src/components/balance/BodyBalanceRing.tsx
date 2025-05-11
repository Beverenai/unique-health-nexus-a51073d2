
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
  size = 'lg', 
  className
}) => {
  const bodyState = getBodyStateDescription(score);
  const textColorClass = getModernTextColor(score);
  
  // Adjusted sizes for the rings
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-36 h-36',
    lg: 'w-48 h-48'
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
          className="bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative z-10" 
          style={{width: '75%', height: '75%'}}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 100
          }}
        >
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div 
              className={cn("font-medium text-lg mb-1", textColorClass)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {bodyState}
            </motion.div>
            
            <motion.div
              className="text-gray-500 text-xs px-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {score < 60 ? "Følg anbefalingene" : "Oppretthold balansen"}
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Animated pulse rings */}
        <div 
          className="absolute inset-0 rounded-full animate-pulse-ring opacity-30" 
          style={{ border: `1px solid ${getModernColor(score)}` }} 
        />
        
        <motion.div 
          className="absolute inset-0 rounded-full opacity-10" 
          style={{ border: `4px solid ${getModernColor(score)}` }}
          animate={{ 
            scale: [1, 1.03, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};

export default BodyBalanceRing;
