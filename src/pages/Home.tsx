
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
    recommendations: ["Fermentert mat, pre- og probiotika, vurder test av matintoleranser."]
  },
  {
    id: "issue-2",
    scan_id: "mock-scan-id",
    name: "Hormonell ubalanse",
    description: "Kortisol og melatonin viser avvik som kan påvirke søvn og stressrespons.",
    load: 38,
    created_at: new Date().toISOString(),
    recommendations: ["Regelmessig døgnrytme, dagslys, adaptogener."]
  },
  {
    id: "issue-3",
    scan_id: "mock-scan-id",
    name: "Kompresjon i nakkevirvler C4–C5",
    description: "Signalene indikerer redusert sirkulasjon og stress i nakke/skulderområdet.",
    load: 65,
    created_at: new Date().toISOString(),
    recommendations: ["Vurder kiropraktikk, massasje eller lette tøyninger."]
  },
  {
    id: "issue-4",
    scan_id: "mock-scan-id",
    name: "Godt fungerende nervesystem",
    description: "Ingen tegn til stresspåvirkning eller nevrologisk ubalanse.",
    load: 15,
    created_at: new Date().toISOString(),
    recommendations: ["Fortsett med nåværende aktivitetsnivå og balansert livsstil."]
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
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#1E1E1E]">Laster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] px-6 pb-20 pt-10">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-[#1E1E1E]">Unique</h1>
          <p className="text-gray-500">Din personlige helseassistent</p>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center mb-8">
        <CoherenceRing score={coherenceData?.score || 64} />
        <p className="text-[#1E1E1E] mt-6 text-center max-w-xs">
          {coherenceData?.message || "Din kroppskanning indikerer en total koherens-score på 64%."}
        </p>
      </div>

      {/* Always show InsightCard with health issues */}
      <InsightCard healthIssues={healthIssues} />

      {/* Swipeable cards using Carousel */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4 text-[#1E1E1E]">Prioriterte områder</h2>
        
        <Carousel className="w-full mb-8">
          <CarouselContent>
            {healthIssues.map(issue => (
              <CarouselItem key={issue.id} className="md:basis-2/3 lg:basis-1/2">
                <div className="p-1">
                  <IssueCard 
                    key={issue.id} 
                    issue={issue}
                    onClick={() => handleIssueClick(issue.id)} 
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-4">
            <CarouselPrevious className="static translate-y-0 h-8 w-8 bg-white/80 backdrop-blur-sm" />
            <CarouselNext className="static translate-y-0 h-8 w-8 bg-white/80 backdrop-blur-sm" />
          </div>
        </Carousel>
      </div>

      <ChatButton />
      <NavigationBar />
    </div>
  );
};

export default HomePage;
