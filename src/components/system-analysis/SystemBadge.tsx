
import React from 'react';
import { cn } from '@/lib/utils';

interface SystemBadgeProps {
  level: number;
  children: React.ReactNode;
}

const SystemBadge: React.FC<SystemBadgeProps> = ({ level, children }) => {
  return (
    <span className={cn(
      "text-xs px-2 py-0.5 rounded ml-auto font-medium",
      level < 30 ? "bg-[#77C17E]/10 text-[#77C17E]" : 
      level < 70 ? "bg-[#F7D154]/10 text-[#F7D154]" : 
      "bg-[#EA384C]/10 text-[#EA384C]"
    )}>
      {children}
    </span>
  );
};

export default SystemBadge;
