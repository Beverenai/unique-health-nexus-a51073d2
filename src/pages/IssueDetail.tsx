
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailCard from '@/components/DetailCard';
import { getIssueDetails } from '@/services/supabaseService';
import { HealthIssue, IssueDetail, IssueRecommendation } from '@/types/supabase';
import ChatButton from '@/components/ChatButton';
import NavigationBar from '@/components/NavigationBar';

const IssueDetailPage: React.FC = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  
  const [issue, setIssue] = useState<HealthIssue | null>(null);
  const [details, setDetails] = useState<IssueDetail[]>([]);
  const [recommendations, setRecommendations] = useState<IssueRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssueData = async () => {
      if (!issueId) return;

      try {
        const data = await getIssueDetails(issueId);
        setIssue(data.issue);
        setDetails(data.details);
        setRecommendations(data.recommendations);
      } catch (error) {
        console.error('Error loading issue data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIssueData();
  }, [issueId]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">Fant ikke helseproblemet</h2>
          <Button onClick={() => navigate('/')}>Tilbake til forsiden</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-20 pt-6">
      <Button 
        variant="ghost" 
        className="mb-4 -ml-2 gap-1" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={16} />
        <span>Tilbake</span>
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">{issue.name}</h1>
        <div className="flex items-center mt-2 mb-4">
          <div className="h-2 bg-primary rounded-full" style={{ width: `${issue.load}%` }}></div>
          <span className="ml-2 text-sm text-gray-500">Belastning: {issue.load}%</span>
        </div>
        <p className="text-gray-700">{issue.description}</p>
      </div>
      
      {details.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Detaljer</h2>
          <div className="space-y-4">
            {details.map(detail => (
              <DetailCard 
                key={detail.id} 
                title={detail.title}
                description={detail.description}
                impact={detail.impact} 
              />
            ))}
          </div>
        </div>
      )}
      
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Anbefalinger</h2>
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={rec.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                    {index + 1}
                  </div>
                  <p>{rec.recommendation}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <ChatButton />
      <NavigationBar />
    </div>
  );
};

export default IssueDetailPage;
