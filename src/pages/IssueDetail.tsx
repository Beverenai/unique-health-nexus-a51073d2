
import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailCard from '@/components/DetailCard';
import ChatButton from '@/components/ChatButton';
import { mockCoherenceData } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const IssueDetail: React.FC = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const detailsRef = useRef<HTMLDivElement>(null);
  
  // Find the selected issue
  const issue = mockCoherenceData.issues.find(i => i.id === issueId);
  
  if (!issue) {
    return (
      <div className="p-6">
        <h2>Issue not found</h2>
        <Button onClick={() => navigate('/')}>Go back</Button>
      </div>
    );
  }

  // Determine color based on the load
  const getProgressColor = (load: number): string => {
    if (load < 30) return 'bg-success';
    if (load < 60) return 'bg-warning';
    return 'bg-danger';
  };

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">{issue.name}</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 flex items-center space-x-3">
          <Progress 
            value={issue.load} 
            className={cn("h-3 flex-grow", getProgressColor(issue.load))} 
          />
          <span className="font-medium">{issue.load}%</span>
        </div>

        <div className="health-card mb-6">
          <h2 className="text-lg font-medium mb-3">Om dette området</h2>
          <p className="text-gray-700">{issue.description}</p>
        </div>

        <div className="health-card mb-8">
          <h2 className="text-lg font-medium mb-4">Anbefalinger</h2>
          <ul className="space-y-3">
            {issue.recommendations.map((recommendation, index) => (
              <li key={index} className="flex">
                <span className={cn(
                  "inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-white text-xs",
                  getProgressColor(issue.load)
                )}>
                  {index + 1}
                </span>
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>

        {issue.details && issue.details.length > 0 && (
          <Button 
            onClick={scrollToDetails}
            className="w-full mb-8 flex items-center justify-center"
            variant="outline"
          >
            Utforsk mer <ChevronDown size={16} className="ml-1" />
          </Button>
        )}

        {issue.details && issue.details.length > 0 && (
          <div ref={detailsRef} className="pt-4">
            <h2 className="text-lg font-medium mb-4">Detaljert analyse</h2>
            <div className="overflow-x-auto pb-4">
              <div className="flex">
                {issue.details.map(detail => (
                  <DetailCard key={detail.id} detail={detail} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatButton />
    </div>
  );
};

export default IssueDetail;
