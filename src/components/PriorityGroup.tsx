
import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PriorityGroupProps {
  title: string;
  count: number;
  color: string;
  textColor: string;
  badgeColor: string;
  onClick: () => void;
}

export const PriorityGroup: React.FC<PriorityGroupProps> = ({ 
  title, 
  count, 
  color,
  textColor,
  badgeColor,
  onClick 
}) => {
  return (
    <button 
      className={cn(
        "flex items-center justify-between p-4 w-full rounded-xl transition-all", 
        color,
        "border hover:shadow-sm"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <h3 className={cn("text-lg font-medium", textColor)}>{title}</h3>
        <Badge className={cn(badgeColor, "border")}>
          {count} {count === 1 ? 'funn' : 'funn'}
        </Badge>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </button>
  );
};
