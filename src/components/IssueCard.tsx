
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, LeafyGreen, Moon, CloudFog, Bone, Heart, Activity, Salad, Eye, ArrowRight } from 'lucide-react';
import { HealthIssue } from '@/types/supabase';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface IssueCardProps {
  issue: HealthIssue;
  onClick?: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  const navigate = useNavigate();
  
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

  // Get background color based on issue type
  const getBackgroundColor = (name: string): string => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('nervesystem') || lowerName.includes('nakkevirvler')) {
      return 'bg-blue-50/80';
    } else if (lowerName.includes('tarm') || lowerName.includes('bakterie') || lowerName.includes('flora')) {
      return 'bg-green-50/80';
    } else if (lowerName.includes('hormon') || lowerName.includes('melatonin')) {
      return 'bg-purple-50/80';
    } else if (lowerName.includes('hjerte') || lowerName.includes('kardio')) {
      return 'bg-red-50/80';
    } else if (lowerName.includes('vitamin') || lowerName.includes('mineral')) {
      return 'bg-yellow-50/80';
    } else if (lowerName.includes('dehydrer') || lowerName.includes('væske')) {
      return 'bg-cyan-50/80';
    } else {
      return 'bg-slate-50/80';
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
    } else if (name.includes('vitamin') || name.includes('mineral')) {
      return <LeafyGreen className="text-yellow-600" size={22} />;
    } else {
      return <CloudFog className="text-slate-600" size={22} />;
    }
  };
  
  // Navigate to issue detail page
  const handleViewDetail = () => {
    navigate(`/issue/${issue.id}`);
  };

  return (
    <div 
      className={cn(
        "border border-gray-100/20 backdrop-blur-sm rounded-xl p-4 shadow-sm transition-all hover:shadow-md flex flex-col",
        getBackgroundColor(issue.name)
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full shadow-sm">
            {getIssueIcon()}
          </div>
          <h3 className="text-base font-medium text-gray-800">{issue.name}</h3>
        </div>
        <span className={cn("text-sm font-medium px-2 py-1 rounded-full", getTextColor(issue.load))}>
          {issue.load}%
        </span>
      </div>
      
      <div className="mt-2 mb-3">
        <Progress 
          value={issue.load} 
          className={cn("h-1.5 rounded-full", getProgressColor(issue.load))} 
        />
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {issue.description}
      </p>

      <div className="mt-auto">
        <Button 
          onClick={handleViewDetail}
          variant="ghost" 
          className="w-full justify-between text-gray-700 hover:bg-white/50 hover:text-gray-900 p-2 h-auto"
        >
          <span className="text-sm">Se detaljer</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default IssueCard;
