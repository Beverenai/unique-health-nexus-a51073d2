import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CoherenceData, HealthIssue } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { getLatestCoherenceData, getHealthIssues, seedDemoData } from '@/services/supabaseService';

// Import components
import ChatButton from '@/components/ChatButton';
import ScanDateCard from '@/components/ScanDateCard';
import CoherenceDisplay from '@/components/CoherenceDisplay';
import ExplanationCard from '@/components/ExplanationCard';
import InsightCard from '@/components/InsightCard';
import IssuesByPriorityGroup from '@/components/IssuesByPriorityGroup';

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
      } catch (error) {
        console.error('Error fetching data:', error);
        // Keep using mock data (already set as default state)
      }
    };
    
    fetchData();
  }, []);

  // Group health issues by priority (based on load value)
  const highPriorityIssues = healthIssues.filter(issue => issue.load >= 60);
  const moderatePriorityIssues = healthIssues.filter(issue => issue.load >= 30 && issue.load < 60);
  const lowPriorityIssues = healthIssues.filter(issue => issue.load < 30);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F8FC] pt-4 pb-24">
      <main className="container max-w-md mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-center">Oversikt</h1>
        
        <ScanDateCard scanDate={new Date(coherenceData?.created_at || scanDate)} />
        
        <ExplanationCard />
        
        <CoherenceDisplay coherenceData={coherenceData} />
        
        <div className="mt-8 space-y-8">
          {highPriorityIssues.length > 0 && (
            <IssuesByPriorityGroup 
              title="Høy prioritet" 
              issues={highPriorityIssues}
              priorityType="high"
            />
          )}
          
          {moderatePriorityIssues.length > 0 && (
            <IssuesByPriorityGroup 
              title="Moderat prioritet" 
              issues={moderatePriorityIssues}
              priorityType="medium"
            />
          )}
          
          {lowPriorityIssues.length > 0 && (
            <IssuesByPriorityGroup 
              title="Lav prioritet" 
              issues={lowPriorityIssues}
              priorityType="low"
            />
          )}
        </div>
        
        <InsightCard healthIssues={healthIssues} />
      </main>
      
      <ChatButton />
    </div>
  );
};

export default Home;
