
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailCard from '@/components/DetailCard';
import ChatButton from '@/components/ChatButton';
import { getIssueDetails } from '@/services/supabaseService';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { HealthIssue, IssueDetail, IssueRecommendation } from '@/types/supabase';

const IssueDetailPage: React.FC = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const detailsRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [issue, setIssue] = useState<HealthIssue | null>(null);
  const [details, setDetails] = useState<IssueDetail[]>([]);
  const [recommendations, setRecommendations] = useState<IssueRecommendation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!issueId) {
        navigate('/');
        return;
      }

      try {
        const { issue, details, recommendations } = await getIssueDetails(issueId);
        
        if (!issue) {
          toast.error('Fant ikke helseutfordringen');
          navigate('/');
          return;
        }

        setIssue(issue);
        setDetails(details);
        setRecommendations(recommendations);
      } catch (error) {
        console.error('Error fetching issue details:', error);
        toast.error('Det oppsto en feil ved lasting av detaljer');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [issueId, navigate]);

  // Determine color based on the load
  const getProgressColor = (load: number): string => {
    if (load < 30) return 'bg-success';
    if (load < 60) return 'bg-warning';
    return 'bg-danger';
  };

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laster...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="p-6">
        <h2>Issue not found</h2>
        <Button onClick={() => navigate('/')}>Go back</Button>
      </div>
    );
  }

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

        {recommendations.length > 0 && (
          <div className="health-card mb-8">
            <h2 className="text-lg font-medium mb-4">Anbefalinger</h2>
            <ul className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <li key={recommendation.id} className="flex">
                  <span className={cn(
                    "inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-white text-xs",
                    getProgressColor(issue.load)
                  )}>
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{recommendation.recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {details.length > 0 && (
          <Button 
            onClick={scrollToDetails}
            className="w-full mb-8 flex items-center justify-center"
            variant="outline"
          >
            Utforsk mer <ChevronDown size={16} className="ml-1" />
          </Button>
        )}

        {details.length > 0 && (
          <div ref={detailsRef} className="pt-4">
            <h2 className="text-lg font-medium mb-4">Detaljert analyse</h2>
            <div className="overflow-x-auto pb-4">
              <div className="flex">
                {details.map(detail => (
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

export default IssueDetailPage;
