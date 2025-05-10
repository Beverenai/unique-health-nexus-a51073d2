import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CoherenceRing from '@/components/CoherenceRing';
import IssueCard from '@/components/IssueCard';
import ChatButton from '@/components/ChatButton';
import NavigationBar from '@/components/NavigationBar';
import InsightCard from '@/components/InsightCard';
import { supabase } from '@/integrations/supabase/client';
import { getLatestCoherenceData, getHealthIssues, seedDemoData, seedHistoricalData } from '@/services/supabaseService';
import { CoherenceData, HealthIssue } from '@/types/supabase';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [coherenceData, setCoherenceData] = useState<CoherenceData | null>(null);
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // This will ensure we have some demo data to work with
    const initializeData = async () => {
      await seedDemoData();
      await seedHistoricalData();
    };
    
    initializeData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      // Check if there's a real user
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      try {
        // Always load data regardless of authentication
        let coherenceData = await getLatestCoherenceData();
        let issues = await getHealthIssues();
        
        if (!coherenceData || issues.length === 0) {
          // Seed demo data if no data is present
          await seedDemoData();
          // Fetch data again after seeding
          coherenceData = await getLatestCoherenceData();
          issues = await getHealthIssues();
        }
        
        setCoherenceData(coherenceData);
        setHealthIssues(issues);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Det oppsto en feil ved lasting av data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleIssueClick = (issueId: string) => {
    navigate(`/issue/${issueId}`);
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

  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-20 pt-10">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Unique</h1>
          <p className="text-gray-500">Din personlige helseassistent</p>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center mb-8">
        <CoherenceRing score={coherenceData?.score || 0} />
        <p className="text-gray-600 mt-6 text-center max-w-xs">
          {coherenceData?.message || "Din kroppskanning indikerer en total koherens-score på " + (coherenceData?.score || 0) + "%."}
        </p>
      </div>

      {healthIssues.length > 0 && (
        <InsightCard healthIssues={healthIssues} />
      )}

      {healthIssues.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Prioriterte områder</h2>
          {healthIssues.map(issue => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              onClick={() => handleIssueClick(issue.id)} 
            />
          ))}
        </div>
      )}

      <ChatButton />
      <NavigationBar />
    </div>
  );
};

export default HomePage;
