
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CoherenceData, HealthIssue } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { getLatestCoherenceData, getHealthIssues, seedDemoData, seedHistoricalData } from '@/services/supabaseService';

// Import components
import ChatButton from '@/components/ChatButton';
import NavigationBar from '@/components/NavigationBar';
import InsightCard from '@/components/InsightCard';
import IssueDetailDialog from '@/components/IssueDetailDialog';
import ScanDateCard from '@/components/ScanDateCard';
import CoherenceDisplay from '@/components/CoherenceDisplay';
import HealthIssuesCarousel from '@/components/HealthIssuesCarousel';
import NewScanButton from '@/components/NewScanButton';
import ExplanationCard from '@/components/ExplanationCard';

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
  }
];

const Home = () => {
  const [coherenceData, setCoherenceData] = useState<CoherenceData | null>(mockCoherenceData);
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(mockHealthIssues);
  const [selectedIssue, setSelectedIssue] = useState<HealthIssue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleIssueClick = (issue: HealthIssue) => {
    setSelectedIssue(issue);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      
      <main className="container max-w-md mx-auto px-4 pt-4 pb-24">
        <ScanDateCard scanDate={new Date(coherenceData?.created_at || scanDate)} />
        
        <ExplanationCard />
        
        <CoherenceDisplay coherenceData={coherenceData} />
        
        <HealthIssuesCarousel 
          healthIssues={healthIssues}
          onIssueClick={handleIssueClick}
        />
        
        <InsightCard healthIssues={healthIssues} />
        
        <IssueDetailDialog
          issue={selectedIssue}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </main>
      
      <NewScanButton />
      <ChatButton />
    </div>
  );
};

export default Home;
