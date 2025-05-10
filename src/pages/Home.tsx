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

// Hardcoded mock data to ensure it always displays
const mockCoherenceData: CoherenceData = {
  score: 64,
  message: "Din kroppskanning indikerer en total koherens-score på 64%.",
  id: "mock-id",
  scan_id: "mock-scan-id",
  created_at: new Date().toISOString()
};

const mockHealthIssues: HealthIssue[] = [
  {
    id: "issue-1",
    scan_id: "mock-scan-id",
    name: "Tarmflora i ubalanse",
    description: "Bakterielle mønstre viser redusert mangfold og lett inflammasjon.",
    load: 45,
    created_at: new Date().toISOString(),
    recommendations: ["Spis mer fermentert mat og probiotika", "Øk inntaket av fiberrike matvarer"]
  },
  {
    id: "issue-2",
    scan_id: "mock-scan-id",
    name: "Hormonelle svingninger",
    description: "Skanningen indikerer ubalanser i kortisol og østrogen.",
    load: 38,
    created_at: new Date().toISOString(),
    recommendations: ["Prioriter jevn søvnrytme og stressreduksjon", "Vurder adaptogene urter"]
  },
  {
    id: "issue-3",
    scan_id: "mock-scan-id",
    name: "Godt fungerende nervesystem",
    description: "Ingen tegn til stresspåvirkning eller nevrologisk ubalanse.",
    load: 15,
    created_at: new Date().toISOString(),
    recommendations: ["Fortsett med nåværende aktivitetsnivå og balansert livsstil"]
  }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [coherenceData, setCoherenceData] = useState<CoherenceData | null>(mockCoherenceData);
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(mockHealthIssues);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // This will ensure we have some demo data to work with
    const initializeData = async () => {
      try {
        await seedDemoData();
        await seedHistoricalData();
      } catch (error) {
        console.error('Error seeding data:', error);
        // Fallback to mock data is handled by default state
      }
    };
    
    initializeData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      // Check if there's a real user
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      try {
        // Try to load data from Supabase
        let coherenceData = await getLatestCoherenceData();
        let issues = await getHealthIssues();
        
        if (!coherenceData || issues.length === 0) {
          // Seed demo data if no data is present
          try {
            await seedDemoData();
            // Fetch data again after seeding
            coherenceData = await getLatestCoherenceData();
            issues = await getHealthIssues();
          } catch (seedError) {
            console.error('Error seeding demo data:', seedError);
            // Keep using the mock data (already set in state)
          }
        }
        
        // Only update state if we got valid data from Supabase
        if (coherenceData) {
          setCoherenceData(coherenceData);
        }
        
        if (issues && issues.length > 0) {
          setHealthIssues(issues);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // No need to show an error toast since we're falling back to mock data
        // Mock data is already set as the default state
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
        <CoherenceRing score={coherenceData?.score || 64} />
        <p className="text-gray-600 mt-6 text-center max-w-xs">
          {coherenceData?.message || "Din kroppskanning indikerer en total koherens-score på 64%."}
        </p>
      </div>

      {/* Always show InsightCard with health issues */}
      <InsightCard healthIssues={healthIssues} />

      {/* Always show IssueCards */}
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

      <ChatButton />
      <NavigationBar />
    </div>
  );
};

export default HomePage;
