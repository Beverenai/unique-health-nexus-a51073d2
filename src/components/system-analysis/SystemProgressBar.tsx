
import React from 'react';
import { cn } from '@/lib/utils';

interface SystemProgressBarProps {
  value: number;
}

const SystemProgressBar: React.FC<SystemProgressBarProps> = ({ value }) => {
  const getProgressColor = (level: number): string => {
    if (level < 30) return 'bg-[#77C17E]';
    if (level < 70) return 'bg-[#F7D154]';
    return 'bg-[#EA384C]';
  };
  
  return (
    <div className="relative h-1.5 rounded-full bg-gray-100 overflow-hidden">
      <div 
        className={cn("absolute top-0 left-0 h-full rounded-full", 
          getProgressColor(value)
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default SystemProgressBar;
