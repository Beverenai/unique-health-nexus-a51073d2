
import React from 'react';
import { cn } from '@/lib/utils';
import SystemIcon from './SystemIcon';
import SystemProgressBar from './SystemProgressBar';
import SystemBadge from './SystemBadge';

interface SystemItemProps {
  name: string;
  value: number;
}

const SystemItem: React.FC<SystemItemProps> = ({ name, value }) => {
  const getStatusText = (level: number): string => {
    if (level < 30) return `${name} fungerer innenfor normale parametere.`;
    if (level < 70) return `${name} viser moderat belastning. Tiltak anbefales.`;
    return `${name} viser høy belastning. Tiltak sterkt anbefalt.`;
  };
  
  return (
    <div className="bg-white/70 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className={cn(
          "p-1.5 rounded-full", 
          value < 30 ? "bg-[#77C17E]/10" : 
          value < 70 ? "bg-[#F7D154]/10" : 
          "bg-[#EA384C]/10"
        )}>
          <SystemIcon name={name} />
        </div>
        <span className="text-sm font-medium">{name}</span>
        <SystemBadge level={value}>
          {value}% belastning
        </SystemBadge>
      </div>
      
      <SystemProgressBar value={value} />
      
      <p className="text-xs text-gray-600 mt-2">
        {getStatusText(value)}
      </p>
    </div>
  );
};

export default SystemItem;
