
import React from 'react';
import { ArrowRight, Brain, LeafyGreen, Moon, CloudFog } from 'lucide-react';
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
    if (load < 20) return 'bg-[#7BCFA0]'; // Green for low load
    if (load < 50) return 'bg-[#FFA963]'; // Orange for moderate load
    return 'bg-[#F15B5B]';  // Red for high load
  };

  const getTextColor = (load: number): string => {
    if (load < 20) return 'text-[#7BCFA0]'; // Green for low load
    if (load < 50) return 'text-[#FFA963]'; // Orange for moderate load
    return 'text-[#F15B5B]';  // Red for high load
  };

  // Get icon based on issue name
  const getIssueIcon = () => {
    const name = issue.name.toLowerCase();
    
    if (name.includes('nervesystem') || name.includes('nakkevirvler') || name.includes('kompresjon')) {
      return <Brain className="text-[#1E1E1E]" size={22} />;
    } else if (name.includes('tarm') || name.includes('bakterie') || name.includes('flora')) {
      return <LeafyGreen className="text-[#1E1E1E]" size={22} />;
    } else if (name.includes('hormon') || name.includes('melatonin') || name.includes('kortisol')) {
      return <Moon className="text-[#1E1E1E]" size={22} />;
    } else {
      return <CloudFog className="text-[#1E1E1E]" size={22} />;
    }
  };

  return (
    <div className="health-card mb-5 transition-all hover:shadow-md border border-gray-100 rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={cn("bg-[#F7F7F7] p-2 rounded-full")}>
            {getIssueIcon()}
          </div>
          <h3 className="text-lg font-medium text-[#1E1E1E]">{issue.name}</h3>
        </div>
      </div>
      
      <div className="mt-3 flex items-center space-x-2">
        <Progress 
          value={issue.load} 
          className={cn("h-2.5 flex-grow", getProgressColor(issue.load))} 
        />
        <span className={cn("text-sm font-medium", getTextColor(issue.load))}>
          {issue.load}%
        </span>
      </div>
      
      <p className="text-sm text-[#1E1E1E] my-4 leading-relaxed">
        {issue.description}
      </p>

      {issue.recommendations && issue.recommendations.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2 text-[#1E1E1E]">Tiltak:</p>
          <p className="text-sm text-[#1E1E1E] mb-4 leading-relaxed">
            {issue.recommendations[0]}
          </p>
        </div>
      )}
      
      <Button 
        onClick={onClick} 
        variant="outline" 
        className="w-full mt-2 justify-between bg-[#F7F7F7] text-[#1E1E1E] border-none hover:bg-gray-100"
      >
        <span>Utforsk mer</span>
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default IssueCard;
