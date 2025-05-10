
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, LeafyGreen, Moon, CloudFog, Bone, Heart, Activity, Salad, Eye, ArrowRight } from 'lucide-react';
import { HealthIssue } from '@/types/supabase';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
      return 'from-blue-50/90 to-blue-100/50';
    } else if (lowerName.includes('tarm') || lowerName.includes('bakterie') || lowerName.includes('flora')) {
      return 'from-green-50/90 to-green-100/50';
    } else if (lowerName.includes('hormon') || lowerName.includes('melatonin')) {
      return 'from-purple-50/90 to-purple-100/50';
    } else if (lowerName.includes('hjerte') || lowerName.includes('kardio')) {
      return 'from-red-50/90 to-red-100/50';
    } else if (lowerName.includes('vitamin') || lowerName.includes('mineral')) {
      return 'from-yellow-50/90 to-yellow-100/50';
    } else if (lowerName.includes('dehydrer') || lowerName.includes('væske')) {
      return 'from-cyan-50/90 to-cyan-100/50';
    } else {
      return 'from-slate-50/90 to-slate-100/50';
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
  
  // Navigate to issue detail page - using consistent path format
  const handleViewDetail = () => {
    // Check if onClick handler is provided (for custom behavior)
    if (onClick) {
      onClick();
      return;
    }
    
    // Use consistent navigation path - always use /issue/[id]
    navigate(`/issue/${issue.id}`);
    console.log("Navigating to issue:", issue.id);
  };

  return (
    <motion.div 
      className={cn(
        "border border-white/40 bg-gradient-to-br rounded-xl p-4 shadow-sm hover:shadow-card transition-all",
        getBackgroundColor(issue.name),
        "backdrop-blur-sm"
      )}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full shadow-sm">
            {getIssueIcon()}
          </div>
          <h3 className="text-base font-playfair font-medium text-gray-800">{issue.name}</h3>
        </div>
        <div className={cn(
          "px-2.5 py-1 rounded-full text-sm font-medium", 
          getTextColor(issue.load),
          "bg-white/50 border border-white/60 shadow-sm"
        )}>
          {issue.load}%
        </div>
      </div>
      
      <div className="mt-2 mb-3">
        <Progress 
          value={issue.load} 
          className={cn(
            "h-1.5 rounded-full", 
            getProgressColor(issue.load),
            "shadow-sm overflow-hidden"
          )} 
        />
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {issue.description}
      </p>

      <div className="mt-auto">
        <Button 
          onClick={handleViewDetail}
          variant="ghost" 
          className="w-full justify-between text-gray-700 hover:bg-white/70 hover:text-gray-900 p-2 h-auto group"
        >
          <span className="text-sm">Se detaljer</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};

export default IssueCard;
