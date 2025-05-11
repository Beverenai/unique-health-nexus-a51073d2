
import React from 'react';
import { motion } from 'framer-motion';
import { HealthIssue } from '@/types/supabase';
import HealthIssueItem from './HealthIssueItem';

interface TopIssuesListProps {
  topIssues: HealthIssue[];
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const TopIssuesList: React.FC<TopIssuesListProps> = ({ 
  topIssues, 
  isExpanded, 
  onToggleExpand 
}) => {
  if (topIssues.length === 0) {
    return null;
  }
  
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium uppercase text-gray-500">
          Høyeste belastninger
        </span>
        
        <button 
          onClick={onToggleExpand} 
          className="text-xs text-[#9b87f5] hover:text-[#7E69AB] transition-colors"
        >
          {isExpanded ? 'Vis mindre' : 'Vis mer'}
        </button>
      </div>
      
      <div className="space-y-2">
        {topIssues.slice(0, isExpanded ? undefined : 1).map((issue, index) => (
          <HealthIssueItem 
            key={issue.id} 
            issue={issue} 
            index={index} 
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TopIssuesList;
