
import React from 'react';
import { IssueDetail } from '@/types/supabase';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DetailCardProps {
  detail: IssueDetail;
}

const DetailCard: React.FC<DetailCardProps> = ({ detail }) => {
  // Determine color based on the impact
  const getProgressColor = (impact: number): string => {
    if (impact < 30) return 'bg-[#77C17E]';
    if (impact < 60) return 'bg-[#F7D154]';
    return 'bg-[#EA384C]';
  };
  
  const getTextColor = (impact: number): string => {
    if (impact < 30) return 'text-[#77C17E]';
    if (impact < 60) return 'text-[#F7D154]';
    return 'text-[#EA384C]';
  };

  return (
    <div className="bg-white/80 rounded-xl p-4 shadow-sm border border-gray-100/20">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-base">{detail.title}</h4>
        <span className={cn("font-medium text-sm", getTextColor(detail.impact))}>
          {detail.impact}%
        </span>
      </div>
      
      <Progress 
        value={detail.impact} 
        className={cn("h-1.5 mb-3", getProgressColor(detail.impact))} 
      />
      
      <p className="text-sm text-gray-600">
        {detail.description}
      </p>
    </div>
  );
};

export default DetailCard;
