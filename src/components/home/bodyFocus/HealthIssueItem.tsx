
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HealthIssue } from '@/types/supabase';
import { getStatusText } from '@/components/insight/SystemCard';

interface HealthIssueItemProps {
  issue: HealthIssue;
  index: number;
}

const HealthIssueItem: React.FC<HealthIssueItemProps> = ({ issue, index }) => {
  const navigate = useNavigate();
  const { text: statusText, color: statusColor } = getStatusText(issue.load);

  return (
    <motion.div
      className="bg-white/60 rounded-lg p-3 border border-gray-100/80 shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/issue/${issue.id}`)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay: 0.1 * index, duration: 0.3 }
      }}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{issue.name}</span>
        <span className={`${statusColor} text-xs font-medium px-1.5 py-0.5 rounded-full`}>
          {issue.load}%
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
        {issue.description}
      </p>
    </motion.div>
  );
};

export default HealthIssueItem;
