
import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { HealthIssue } from '@/types/supabase';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface IssueCardProps {
  issue: HealthIssue;
  onClick: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  // Determine color based on the load
  const getProgressColor = (load: number): string => {
    if (load < 40) return 'bg-success';
    if (load < 70) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="health-card mb-5 transition-all hover:shadow-md border border-gray-100 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">{issue.name}</h3>
      </div>
      
      <div className="mt-2 flex items-center space-x-2">
        <Progress 
          value={issue.load} 
          className={cn("h-2 flex-grow", getProgressColor(issue.load))} 
        />
        <span className="text-sm font-medium">{issue.load}%</span>
      </div>
      
      <p className="text-sm text-gray-500 my-3">
        {issue.description}
      </p>

      <div className="mt-3">
        <p className="text-sm font-medium mb-1">Anbefaling:</p>
        <p className="text-sm text-gray-600 mb-3">
          {issue.recommendations && issue.recommendations[0]}
        </p>
      </div>
      
      <Button 
        onClick={onClick} 
        variant="outline" 
        className="w-full mt-2 justify-between"
      >
        <span>Utforsk mer</span>
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default IssueCard;
