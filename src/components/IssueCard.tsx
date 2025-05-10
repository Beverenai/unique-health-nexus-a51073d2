
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
  // Determine color based on the load - using the new color palette
  const getProgressColor = (load: number): string => {
    if (load < 40) return 'bg-[#77C17E]'; // Green for low load
    if (load < 60) return 'bg-[#F7D154]'; // Yellow for moderate load
    return 'bg-[#EA384C]';  // Red for high load
  };

  const getTextColor = (load: number): string => {
    if (load < 40) return 'text-[#77C17E]'; // Green for low load
    if (load < 60) return 'text-[#F7D154]'; // Yellow for moderate load
    return 'text-[#EA384C]';  // Red for high load
  };

  // Get background color - flatter design
  const getBackgroundColor = (name: string): string => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('nervesystem') || lowerName.includes('nakkevirvler')) {
      return 'bg-blue-50';
    } else if (lowerName.includes('tarm') || lowerName.includes('bakterie') || lowerName.includes('flora')) {
      return 'bg-green-50';
    } else if (lowerName.includes('hormon') || lowerName.includes('melatonin')) {
      return 'bg-purple-50';
    } else if (lowerName.includes('hjerte') || lowerName.includes('kardio')) {
      return 'bg-red-50';
    } else {
      return 'bg-slate-50';
    }
  };

  // Get icon based on issue name
  const getIssueIcon = () => {
    const name = issue.name.toLowerCase();
    
    if (name.includes('nervesystem') || name.includes('nakkevirvler') || name.includes('kompresjon')) {
      return <Brain className="text-blue-600" size={22} />;
    } else if (name.includes('tarm') || name.includes('bakterie') || name.includes('flora')) {
      return <Salad className="text-green-600" size={22} />;
    } else if (name.includes('hormon') || name.includes('melatonin') || name.includes('kortisol')) {
      return <Moon className="text-purple-600" size={22} />;
    } else if (name.includes('hjerte') || name.includes('kardio')) {
      return <Heart className="text-rose-600" size={22} />;
    } else if (name.includes('lunge') || name.includes('puste')) {
      return <Activity className="text-sky-600" size={22} />;
    } else if (name.includes('muskel')) {
      return <Bone className="text-amber-600" size={22} />;
    } else if (name.includes('øye') || name.includes('syn')) {
      return <Eye className="text-indigo-600" size={22} />;
    } else {
      return <CloudFog className="text-slate-600" size={22} />;
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
      className={`health-card mb-5 border border-gray-100 rounded-xl p-5 shadow-sm ${getBackgroundColor(issue.name)}`}
      style={{ borderRadius: "20px" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={cn("bg-white p-2.5 rounded-full shadow-sm")}>
            {getIssueIcon()}
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{issue.name}</h3>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <Progress 
          value={issue.load} 
          className={cn("h-2.5 flex-grow rounded-full", getProgressColor(issue.load))} 
        />
        <span className={cn("text-sm font-medium", getTextColor(issue.load))}>
          {issue.load}%
        </span>
      </div>
      
      <p className="text-sm text-gray-600 my-4 leading-relaxed">
        <span className="font-medium">Skanningen viser:</span> {issue.description}
      </p>

      {relatedSystems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {relatedSystems.map(system => (
            <span 
              key={system}
              className="text-xs px-2.5 py-1.5 bg-white shadow-sm rounded-full text-gray-600"
            >
              {system}
            </span>
          ))}
        </div>
      )}

      {issue.recommendations && issue.recommendations.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2 text-gray-800">Anbefalte tiltak:</p>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {issue.recommendations[0]}
          </p>
        </div>
      )}
      
      <Button 
        onClick={onClick} 
        variant="outline" 
        className="w-full mt-2 justify-between bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 rounded-xl"
      >
        <span>Se detaljer</span>
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default IssueCard;
