
import React, { useEffect, useState } from 'react';
import { CoherenceData, HealthIssue } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { getLatestCoherenceData, getHealthIssues } from '@/services';
import { seedDemoData } from '@/services/demoDataService';
import { Gauge, List, Lightbulb } from 'lucide-react';
import { TabView } from '@/components/ui/tab-view';
import HomeHeader from '@/components/home/HomeHeader';
import ScanDateCard from '@/components/ScanDateCard';
import OverviewTab from '@/components/home/tabs/OverviewTab';
import PrioritiesTab from '@/components/home/tabs/PrioritiesTab';
import FindingsTab from '@/components/home/tabs/FindingsTab';
import BodyFocusSummary from '@/components/home/BodyFocusSummary';

// Hardcoded mock data to ensure it always displays
const mockCoherenceData: CoherenceData = {
  score: 64,
  message: "Kroppen din er i balanse, men håndterer noen belastninger.",
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
    recommendations: ["Vurder kiropraktikk, massasje og spesifikke øvelser for nakkeområdet."]
  },
  {
    id: "issue-4",
    scan_id: "mock-scan-id",
    name: "Vitamin D mangel",
    description: "Analysen indikerer lave nivåer av vitamin D som kan påvirke immunsystemet.",
    load: 72,
    created_at: new Date().toISOString(),
    recommendations: ["Daglig tilskudd av vitamin D, økt eksponering for sollys når mulig."]
  },
  {
    id: "issue-5",
    scan_id: "mock-scan-id",
    name: "Lett dehydrering",
    description: "Cellulære signaler tyder på redusert væskebalanse.",
    load: 25,
    created_at: new Date().toISOString(),
    recommendations: ["Øk daglig vanninntak, vurder elektrolytter ved trening."]
  }
];

const Home = () => {
  const [coherenceData, setCoherenceData] = useState<CoherenceData | null>(mockCoherenceData);
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(mockHealthIssues);
  const [scanDate, setScanDate] = useState<Date>(new Date());
  const [userName, setUserName] = useState<string>("Demo");
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch real data from Supabase when available
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Try seeding demo data first
        await seedDemoData();
        
        // Then try to load it
        const coherenceResult = await getLatestCoherenceData();
        if (coherenceResult) {
          setCoherenceData(coherenceResult);
        }
        
        const issuesResult = await getHealthIssues();
        if (issuesResult && issuesResult.length > 0) {
          setHealthIssues(issuesResult);
        }

        // Try to get user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.first_name) {
            setUserName(profile.first_name);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Keep using mock data (already set as default state)
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Define tab structure
  const tabs = [
    {
      id: "overview",
      label: "Oversikt",
      icon: <Gauge size={16} />,
      content: <OverviewTab coherenceData={coherenceData} healthIssues={healthIssues} />
    },
    {
      id: "priorities",
      label: "Prioriteter",
      icon: <List size={16} />,
      content: <PrioritiesTab healthIssues={healthIssues} />
    },
    {
      id: "findings",
      label: "Funn",
      icon: <Lightbulb size={16} />,
      content: <FindingsTab healthIssues={healthIssues} />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F8FC] pt-4 pb-24 subtle-pattern">
      <main className="container max-w-md mx-auto px-4">
        <HomeHeader userName={userName} />
        <ScanDateCard scanDate={new Date(coherenceData?.created_at || scanDate)} />
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
          </div>
        ) : (
          <>
            <div className="my-6">
              <BodyFocusSummary 
                coherenceScore={coherenceData?.score || 64} 
                healthIssues={healthIssues} 
              />
            </div>
            <TabView tabs={tabs} className="pt-2" />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
