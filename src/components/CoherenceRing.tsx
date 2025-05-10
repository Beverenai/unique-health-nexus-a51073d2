
import React from 'react';
import { cn } from '@/lib/utils';
import { getScoreColor, getScoreTextColor } from '@/data/mockData';

interface CoherenceRingProps {
  score: number;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const CoherenceRing: React.FC<CoherenceRingProps> = ({ 
  score, 
  message,
  size = 'lg', 
  showText = true,
  className
}) => {
  // New modern color assignments
  const getModernColor = (score: number): string => {
    if (score < 30) return 'from-rose-400 to-rose-300';
    if (score < 50) return 'from-amber-400 to-amber-300';
    if (score < 70) return 'from-blue-400 to-blue-300';
    return 'from-emerald-400 to-emerald-300';
  };
  
  const getModernTextColor = (score: number): string => {
    if (score < 30) return 'text-rose-600';
    if (score < 50) return 'text-amber-600';
    if (score < 70) return 'text-blue-600';
    return 'text-emerald-600';
  };
  
  const getStatusLabel = (score: number): string => {
    if (score < 30) return 'Krever oppmerksomhet';
    if (score < 50) return 'Under optimalt';
    if (score < 70) return 'Bra';
    return 'Utmerket';
  };
  
  const circleGradient = getModernColor(score);
  const textColorClass = getModernTextColor(score);
  const statusLabel = getStatusLabel(score);
  
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56'
  };
  
  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "relative flex items-center justify-center rounded-full",
        `bg-gradient-to-br ${circleGradient}`,
        sizeClasses[size],
        className
      )}>
        {/* Outer ring with pulse effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
        
        {/* Inner white circle */}
        <div className="bg-white rounded-full flex items-center justify-center" style={{width: '85%', height: '85%'}}>
          {showText && (
            <div className="text-center">
              <div className={cn("font-bold", textSizeClasses[size], textColorClass)}>
                {score}%
              </div>
              <div className="text-gray-500 mt-1 text-sm">
                Koherens
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Status label below ring */}
      <div className={cn("mt-4 px-4 py-1.5 rounded-full bg-white shadow-sm text-sm font-medium", textColorClass)}>
        {statusLabel}
      </div>
      
      {message && (
        <p className="text-gray-600 text-center max-w-sm mt-4 text-sm">
          {message}
        </p>
      )}
    </div>
  );
};

export default CoherenceRing;
