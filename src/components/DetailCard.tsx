
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
    if (impact < 30) return 'bg-success';
    if (impact < 60) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="health-card w-[280px] flex-shrink-0 mr-4 h-full">
      <h4 className="font-medium text-base">{detail.title}</h4>
      
      <div className="mt-2 flex items-center space-x-2">
        <Progress 
          value={detail.impact} 
          className={cn("h-2 flex-grow", getProgressColor(detail.impact))} 
        />
        <span className="text-sm font-medium">{detail.impact}%</span>
      </div>
      
      <p className="text-sm text-gray-500 mt-3">
        {detail.description}
      </p>
    </div>
  );
};

export default DetailCard;
