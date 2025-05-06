
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { HealthIssue } from '@/types/supabase';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface IssueCardProps {
  issue: HealthIssue;
  onClick: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  // Determine color based on the load
  const getProgressColor = (load: number): string => {
    if (load < 30) return 'bg-success';
    if (load < 60) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div 
      className="health-card mb-3 transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{issue.name}</h3>
        <ChevronRight size={18} className="text-gray-400" />
      </div>
      
      <div className="mt-2 flex items-center space-x-2">
        <Progress 
          value={issue.load} 
          className={cn("h-2 flex-grow", getProgressColor(issue.load))} 
        />
        <span className="text-sm font-medium">{issue.load}%</span>
      </div>
      
      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
        {issue.description}
      </p>
    </div>
  );
};

export default IssueCard;
