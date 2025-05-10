
import React from 'react';
import { HealthIssue } from '@/types/supabase';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import IssueCard from './IssueCard';

interface IssuesByPriorityGroupProps {
  title: string;
  issues: HealthIssue[];
  priorityType: 'high' | 'medium' | 'low';
}

const IssuesByPriorityGroup: React.FC<IssuesByPriorityGroupProps> = ({ title, issues, priorityType }) => {
  // Get the background color for the group header based on priority
  const getHeaderColor = () => {
    switch (priorityType) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-amber-50 border-amber-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  
  // Get accent color for the badge
  const getBadgeColor = () => {
    switch (priorityType) {
      case 'high':
        return 'bg-[#EA384C]/10 text-[#EA384C] border-[#EA384C]/20';
      case 'medium':
        return 'bg-[#F7D154]/10 text-amber-700 border-[#F7D154]/20';
      case 'low':
        return 'bg-[#77C17E]/10 text-[#77C17E] border-[#77C17E]/20';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  return (
    <div className="mb-8">
      <div className={`flex items-center justify-between p-3 mb-3 rounded-xl ${getHeaderColor()} border`}>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-gray-800">{title}</h2>
          <Badge className={`${getBadgeColor()} border`}>
            {issues.length} {issues.length === 1 ? 'funn' : 'funn'}
          </Badge>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {issues.map(issue => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
};

export default IssuesByPriorityGroup;
