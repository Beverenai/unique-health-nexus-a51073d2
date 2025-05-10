
import React, { useEffect, useState } from 'react';
import { CoherenceData, HealthIssue } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { getLatestCoherenceData, getHealthIssues, seedDemoData } from '@/services/supabaseService';
import CoherenceDisplay from '@/components/CoherenceDisplay';
import ScanDateCard from '@/components/ScanDateCard';
import HealthIssuesCarousel from '@/components/HealthIssuesCarousel';
import { useNavigate } from 'react-router-dom';
import { PriorityGroup } from '@/components/PriorityGroup';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const navigate = useNavigate();
  const [coherenceData, setCoherenceData] = useState<CoherenceData | null>(mockCoherenceData);
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(mockHealthIssues);
  const [scanDate, setScanDate] = useState<Date>(new Date());
  const [userName, setUserName] = useState<string>("Demo");
  
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

  // Group health issues by priority (based on load value)
  const highPriorityIssues = healthIssues.filter(issue => issue.load >= 60);
  const moderatePriorityIssues = healthIssues.filter(issue => issue.load >= 30 && issue.load < 60);
  const lowPriorityIssues = healthIssues.filter(issue => issue.load < 30);

  const priorityGroups = [
    { 
      title: "Høy prioritet", 
      issues: highPriorityIssues, 
      color: "bg-red-50 border-red-200",
      textColor: "text-red-600",
      badge: "bg-[#EA384C]/10 text-[#EA384C] border-[#EA384C]/20" 
    },
    { 
      title: "Moderat prioritet", 
      issues: moderatePriorityIssues, 
      color: "bg-amber-50 border-amber-200",
      textColor: "text-amber-600",
      badge: "bg-[#F7D154]/10 text-amber-700 border-[#F7D154]/20" 
    },
    { 
      title: "Lav prioritet", 
      issues: lowPriorityIssues, 
      color: "bg-green-50 border-green-200",
      textColor: "text-green-600",
      badge: "bg-[#77C17E]/10 text-[#77C17E] border-[#77C17E]/20" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F8FC] pt-4 pb-24">
      <main className="container max-w-md mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-2 text-center">Hei, {userName}</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Slik ser helsen din ut i dag</p>
        
        <ScanDateCard scanDate={new Date(coherenceData?.created_at || scanDate)} />
        
        <CoherenceDisplay coherenceData={coherenceData} />
        
        <div className="mt-8 space-y-4">
          {priorityGroups.map((group) => (
            group.issues.length > 0 && (
              <PriorityGroup 
                key={group.title}
                title={group.title}
                count={group.issues.length}
                color={group.color}
                textColor={group.textColor}
                badgeColor={group.badge}
                onClick={() => navigate(`/priority/${group.title.toLowerCase().replace(' ', '-')}`)}
              />
            )
          ))}
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full flex justify-between items-center"
              onClick={() => navigate('/insights')}
            >
              <span>Se alle innsikter</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
        
        <div className="mt-8">
          <HealthIssuesCarousel healthIssues={healthIssues.sort((a, b) => b.load - a.load).slice(0, 5)} />
        </div>
      </main>
    </div>
  );
};

export default Home;
