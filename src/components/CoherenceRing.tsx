
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CoherenceRingCanvas } from '@/components/coherence/CoherenceRingCanvas';
import { StatusLabel } from '@/components/coherence/StatusLabel';
import { getModernColor, getModernTextColor, getStatusLabel } from '@/utils/coherenceUtils';

interface CoherenceRingProps {
  score: number;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  showLabel?: boolean;
}

const CoherenceRing: React.FC<CoherenceRingProps> = ({ 
  score, 
  message,
  size = 'lg', 
  showText = true,
  showLabel = false,
  className
}) => {
  const textColorClass = getModernTextColor(score);
  const statusLabel = getStatusLabel(score);
  
  // Adjusted sizes to be smaller
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-36 h-36',
    lg: 'w-48 h-48' // Reduced from w-56 h-56
  };
  
  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl' // Reduced from text-5xl
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
          {showText && (
            <div className="text-center">
              <motion.div 
                className={cn("font-bold", textSizeClasses[size], textColorClass)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {score}%
              </motion.div>
              <motion.div 
                className="text-gray-500 mt-1 text-xs" /* Reduced from text-sm */
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Koherens
              </motion.div>
            </div>
          )}
        </motion.div>
        
        {/* Animated pulse ring */}
        <div 
          className="absolute inset-0 rounded-full animate-pulse-ring opacity-40" 
          style={{ border: `1px solid ${getModernColor(score)}` }} 
        />
      </motion.div>
      
      {/* Status label below ring */}
      {showLabel && (
        <StatusLabel 
          score={score} 
          statusLabel={statusLabel} 
          textColorClass={textColorClass} 
        />
      )}
      
      {message && (
        <motion.p 
          className="text-gray-600 text-center max-w-sm mt-2 text-xs" /* Reduced from text-sm and mt-4 */
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default CoherenceRing;
