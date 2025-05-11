
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Salad } from 'lucide-react';
import { HealthIssue } from '@/types/supabase';
import { getPrimarySystemFocus } from './utils';

interface SystemFocusCardProps {
  healthIssues: HealthIssue[];
  topIssues: HealthIssue[];
  isExpanded?: boolean;
}

const SystemFocusCard: React.FC<SystemFocusCardProps> = ({ 
  healthIssues, 
  topIssues, 
  isExpanded = false 
}) => {
  const primarySystem = getPrimarySystemFocus(healthIssues);
  
  // Choose the icon based on the system type
  const renderIcon = () => {
    switch (primarySystem.icon) {
      case 'Brain':
        return <Brain className="h-5 w-5 text-blue-500" />;
      case 'Activity':
        return <Activity className={`h-5 w-5 ${primarySystem.textColor}`} />;
      case 'Salad':
      default:
        return <Salad className={`h-5 w-5 ${primarySystem.textColor}`} />;
    }
  };

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      className={`${primarySystem.color} rounded-lg p-3 flex items-start gap-3 relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-white/30 to-transparent" />
      
      <div className="bg-white rounded-full p-1.5 shadow-sm z-10">
        {renderIcon()}
      </div>
      <div className="z-10">
        <h4 className="font-medium text-gray-800">{primarySystem.name}</h4>
        <p className="text-sm text-gray-600 mt-0.5">
          {topIssues.length > 0 
            ? `Relatert til ${topIssues[0].name.toLowerCase()}`
            : 'Generell balanse og vedlikehold'}
        </p>
      </div>
      
      {/* Visual connector */}
      {isExpanded && topIssues.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute -bottom-8 left-1/2 w-px h-8 bg-gradient-to-b from-[#9b87f5]/40 to-transparent z-0"
        />
      )}
    </motion.div>
  );
};

export default SystemFocusCard;
