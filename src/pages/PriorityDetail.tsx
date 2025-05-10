
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HealthIssue } from '@/types/supabase';
import IssueCard from '@/components/IssueCard';
import { getHealthIssues } from '@/services/healthIssueService';
import { seedDemoData } from '@/services/demoDataService';
import { mockHealthIssues } from '@/data/mockData';

const PriorityDetail: React.FC = () => {
  const { priorityId } = useParams<{ priorityId: string }>();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<HealthIssue[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get priority title from URL
  const getPriorityTitle = () => {
    switch (priorityId) {
      case 'høy-prioritet':
        return 'Høy prioritet';
      case 'moderat-prioritet':
        return 'Moderat prioritet';
      case 'lav-prioritet':
        return 'Lav prioritet';
      default:
        return 'Funn';
    }
  };
  
  // Get color for header based on priority
  const getHeaderColor = () => {
    switch (priorityId) {
      case 'høy-prioritet':
        return 'bg-red-50 border-red-200';
      case 'moderat-prioritet':
        return 'bg-amber-50 border-amber-200';
      case 'lav-prioritet':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        await seedDemoData();
        let healthIssues = await getHealthIssues();
        
        // Filter issues based on priority - using the SAME thresholds as Home.tsx
        let filteredIssues: HealthIssue[] = [];
        
        if (priorityId === 'høy-prioritet') {
          filteredIssues = healthIssues.filter(issue => issue.load >= 60);
        } else if (priorityId === 'moderat-prioritet') {
          filteredIssues = healthIssues.filter(issue => issue.load >= 30 && issue.load < 60);
        } else if (priorityId === 'lav-prioritet') {
          filteredIssues = healthIssues.filter(issue => issue.load < 30);
        } else {
          filteredIssues = healthIssues;
        }
        
        setIssues(filteredIssues);
      } catch (error) {
        console.error('Error fetching health issues:', error);
        
        // Fallback to mock data
        let mockIssues = mockHealthIssues;
        
        // Filter mock issues the same way
        if (priorityId === 'høy-prioritet') {
          mockIssues = mockHealthIssues.filter(issue => issue.load >= 60);
        } else if (priorityId === 'moderat-prioritet') {
          mockIssues = mockHealthIssues.filter(issue => issue.load >= 30 && issue.load < 60);
        } else if (priorityId === 'lav-prioritet') {
          mockIssues = mockHealthIssues.filter(issue => issue.load < 30);
        }
        
        setIssues(mockIssues);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIssues();
  }, [priorityId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F8FC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-4">
      <main className="container max-w-md mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-4 -ml-2 gap-1" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} />
          <span>Tilbake</span>
        </Button>
        
        <div className={`p-4 mb-6 rounded-xl ${getHeaderColor()} border`}>
          <h1 className="text-xl font-semibold mb-1">{getPriorityTitle()}</h1>
          <p className="text-sm text-gray-600">
            {issues.length} {issues.length === 1 ? 'funn' : 'funn'} som krever oppmerksomhet
          </p>
        </div>
        
        <div className="space-y-4">
          {issues.length > 0 ? (
            issues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Ingen funn i denne kategorien</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PriorityDetail;
