import React, { useEffect, useState } from 'react';
import { CoherenceData, HealthIssue } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { getLatestCoherenceData, getHealthIssues } from '@/services';
import { seedDemoData } from '@/services/demoDataService';
import HomeHeader from '@/components/home/HomeHeader';
import HealthDataDisplay from '@/components/home/HealthDataDisplay';
import PriorityGroups from '@/components/home/PriorityGroups';
import ActionButtons from '@/components/home/ActionButtons';
import ExpandableHealthTable from '@/components/home/ExpandableHealthTable';
import RecentFindings from '@/components/home/RecentFindings';

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
  const [showHealthTable, setShowHealthTable] = useState<boolean>(false);
  
  // Fetch real data from Supabase when available
  useEffect(() => {
    const fetchData = async () => {
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
      }
    };
    
    fetchData();
  }, []);

  const toggleHealthTable = () => {
    setShowHealthTable(!showHealthTable);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F8FC] pt-4 pb-24 subtle-pattern">
      <main className="container max-w-md mx-auto px-4">
        <HomeHeader userName={userName} />
        <HealthDataDisplay coherenceData={coherenceData} scanDate={scanDate} />
        <PriorityGroups healthIssues={healthIssues} />
        <ActionButtons showHealthTable={showHealthTable} toggleHealthTable={toggleHealthTable} />
        <ExpandableHealthTable isVisible={showHealthTable} />
        <RecentFindings healthIssues={healthIssues} />
      </main>
    </div>
  );
};

export default Home;
