
import React from 'react';
import { cn } from '@/lib/utils';
import { getScoreColor, getScoreTextColor } from '@/data/mockData';

interface CoherenceRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const CoherenceRing: React.FC<CoherenceRingProps> = ({ 
  score, 
  size = 'lg', 
  showText = true,
  className
}) => {
  const colorName = getScoreColor(score);
  const textColorClass = getScoreTextColor(score);
  
  const sizeClasses = {
    sm: 'w-24 h-24 border-[6px]',
    md: 'w-40 h-40 border-[8px]',
    lg: 'w-56 h-56 border-[10px]'
  };
  
  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  return (
    <div className={cn(
      "health-score-ring animate-breathe",
      `border-${colorName}`,
      sizeClasses[size],
      className
    )}>
      <div className={cn("absolute -inset-1 rounded-full animate-pulse-ring", `bg-${colorName}/30`)} />
      
      {showText && (
        <div className="text-center">
          <div className={cn("font-bold transition-colors", textSizeClasses[size], textColorClass)}>
            {score}%
          </div>
          <div className="text-gray-500 mt-1 text-sm">
            Koherens
          </div>
        </div>
      )}
    </div>
  );
};

export default CoherenceRing;
