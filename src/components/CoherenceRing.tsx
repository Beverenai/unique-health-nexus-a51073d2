
import React from 'react';
import { cn } from '@/lib/utils';

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
  // Color assignments using the requested color palette
  const getModernColor = (score: number): string => {
    if (score < 40) return '#EA384C'; // Red for high load/low score
    if (score < 60) return '#F7D154'; // Yellow for moderate load
    return '#77C17E'; // Green for low load/high score
  };
  
  const getModernTextColor = (score: number): string => {
    if (score < 40) return 'text-[#EA384C]'; 
    if (score < 60) return 'text-[#F7D154]';
    return 'text-[#77C17E]';
  };
  
  const getStatusLabel = (score: number): string => {
    if (score < 40) return 'Krever oppmerksomhet';
    if (score < 60) return 'Moderat';
    return 'God';
  };
  
  const color = getModernColor(score);
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
        sizeClasses[size],
        className
      )}>
        {/* Ring with flat design - no pulsing effect */}
        <div 
          className="absolute inset-0 rounded-full" 
          style={{
            background: color,
            opacity: 0.2
          }}
        />
        
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
