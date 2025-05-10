
import React from 'react';
import { ArrowRight, Brain, LeafyGreen, Moon, CloudFog, Bone, Heart, Activity, Salad, Eye } from 'lucide-react';
import { HealthIssue } from '@/types/supabase';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface IssueCardProps {
  issue: HealthIssue;
  onClick: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  // Determine color based on the load - organic colors
  const getProgressColor = (load: number): string => {
    if (load < 20) return 'bg-[#88C999]'; // Green for low load
    if (load < 50) return 'bg-[#F6C85E]'; // Yellow for moderate load
    return 'bg-[#EF5E5E]';  // Red for high load
  };

  const getTextColor = (load: number): string => {
    if (load < 20) return 'text-[#88C999]'; // Green for low load
    if (load < 50) return 'text-[#F6C85E]'; // Yellow for moderate load
    return 'text-[#EF5E5E]';  // Red for high load
  };

  // Get background gradient based on issue type
  const getBackgroundGradient = (name: string): string => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('nervesystem') || lowerName.includes('nakkevirvler')) {
      return 'bg-gradient-to-br from-white to-[#F7F7F7]';
    } else if (lowerName.includes('tarm') || lowerName.includes('bakterie') || lowerName.includes('flora')) {
      return 'bg-gradient-to-br from-white to-[#F9FBF7]';
    } else if (lowerName.includes('hormon') || lowerName.includes('melatonin')) {
      return 'bg-gradient-to-br from-white to-[#F9F8FB]';
    } else {
      return 'bg-gradient-to-br from-white to-[#F7F7F7]';
    }
  };

  // Get icon based on issue name - expanded with more organ types
  const getIssueIcon = () => {
    const name = issue.name.toLowerCase();
    
    if (name.includes('nervesystem') || name.includes('nakkevirvler') || name.includes('kompresjon')) {
      return <Brain className="text-[#1E1E1E]" size={22} />;
    } else if (name.includes('tarm') || name.includes('bakterie') || name.includes('flora')) {
      return <Salad className="text-[#1E1E1E]" size={22} />;
    } else if (name.includes('hormon') || name.includes('melatonin') || name.includes('kortisol')) {
      return <Moon className="text-[#1E1E1E]" size={22} />;
    } else if (name.includes('hjerte') || name.includes('kardio')) {
      return <Heart className="text-[#1E1E1E]" size={22} />;
    } else if (name.includes('lunge') || name.includes('puste')) {
      return <Activity className="text-[#1E1E1E]" size={22} />;
    } else if (name.includes('muskel')) {
      return <Bone className="text-[#1E1E1E]" size={22} />;
    } else if (name.includes('øye') || name.includes('syn')) {
      return <Eye className="text-[#1E1E1E]" size={22} />;
    } else {
      return <CloudFog className="text-[#1E1E1E]" size={22} />;
    }
  };

  // Get related systems for this issue
  const getRelatedSystems = (): string[] => {
    const name = issue.name.toLowerCase();
    
    if (name.includes('tarm')) {
      return ['Hormonsystem', 'Nervesystem'];
    } else if (name.includes('hormon')) {
      return ['Fordøyelsessystem', 'Nervesystem'];
    } else if (name.includes('nakkevirvler')) {
      return ['Nervesystem'];
    } else {
      return [];
    }
  };

  const relatedSystems = getRelatedSystems();

  return (
    <div 
      className={`health-card mb-5 transition-all hover:shadow-md border border-gray-100 rounded-xl p-5 shadow-sm ${getBackgroundGradient(issue.name)}`}
      style={{ borderRadius: "16px" }}
    >
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
          className={cn("h-2.5 flex-grow rounded-full", getProgressColor(issue.load))} 
        />
        <span className={cn("text-sm font-medium", getTextColor(issue.load))}>
          {issue.load}%
        </span>
      </div>
      
      <p className="text-sm text-[#1E1E1E] my-4 leading-relaxed">
        {issue.description}
      </p>

      {relatedSystems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {relatedSystems.map(system => (
            <span 
              key={system}
              className="text-xs px-2 py-1 bg-[#F7F7F7] rounded-full text-gray-600"
            >
              {system}
            </span>
          ))}
        </div>
      )}

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
        className="w-full mt-2 justify-between bg-[#F7F7F7] text-[#1E1E1E] border-none hover:bg-gray-100 rounded-xl"
      >
        <span>Utforsk mer</span>
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default IssueCard;
