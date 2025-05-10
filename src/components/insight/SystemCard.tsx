
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { HealthIssue } from '@/types/supabase';
import { Brain, Salad, Moon, Bone, Heart, Activity, Eye } from 'lucide-react';

interface SystemCardProps {
  name: string;
  issue?: HealthIssue;
}

export const getStatusText = (load: number): { text: string; color: string } => {
  if (load < 20) return { text: "Stabilt", color: "text-emerald-600" }; 
  if (load < 50) return { text: "Ubalanse", color: "text-amber-600" }; 
  return { text: "Høy belastning", color: "text-rose-600" }; 
};

export const getStatusProgressColor = (load: number): string => {
  if (load < 20) return 'bg-emerald-400'; 
  if (load < 50) return 'bg-amber-400'; 
  return 'bg-rose-400';  
};

export const getSystemData = (name: string, issue: HealthIssue | undefined) => {
  let icon;
  let bgColor = "";
  
  // Determine icon based on system name
  switch (name.toLowerCase()) {
    case "nervesystem":
      icon = <Brain size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
      bgColor = "bg-blue-50";
      break;
    case "fordøyelsessystem":
      icon = <Salad size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
      bgColor = "bg-green-50";
      break;
    case "hormonsystem":
      icon = <Moon size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
      bgColor = "bg-purple-50";
      break;
    case "muskelsystem":
      icon = <Bone size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
      bgColor = "bg-amber-50";
      break;
    case "hjerte-karsystem":
      icon = <Heart size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
      bgColor = "bg-rose-50";
      break;
    case "respirasjonssystem":
      icon = <Activity size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
      bgColor = "bg-sky-50";
      break;
    default:
      icon = <Eye size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
      bgColor = "bg-slate-50";
  }
  
  return { 
    icon, 
    status: issue ? getStatusText(issue.load) : { text: "Ingen data", color: "text-gray-400" },
    bgColor 
  };
};

const SystemCard: React.FC<SystemCardProps> = ({ name, issue }) => {
  const { icon, status, bgColor } = getSystemData(name, issue);
  
  return (
    <div className={`p-4 rounded-xl ${bgColor} relative`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-full shadow-sm">
            {icon}
          </div>
          <span className="text-gray-800 font-medium">{name}</span>
        </div>
        <span className={`${status.color} text-sm font-medium`}>
          {issue ? status.text : "Ingen data"}
        </span>
      </div>
      
      {issue && (
        <div className="mt-2">
          <Progress 
            value={issue.load} 
            className={`h-1.5 w-full rounded-full ${getStatusProgressColor(issue.load)}`} 
          />
        </div>
      )}
    </div>
  );
};

export default SystemCard;
