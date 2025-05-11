
import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HealthIssue } from '@/types/supabase';
import { getHealthIssues } from '@/services/healthIssueService';
import { getHealthSystems, HealthSystemItem } from '@/services/healthSystemService';
import { seedDemoData } from '@/services/demoDataService';
import { mockHealthIssues } from '@/data/mockData';
import { getSystemConnections } from '@/utils/systemUtils';
import InsightsSummaryCard from '@/components/insight/InsightsSummaryCard';
import SystemConnectionsCard from '@/components/insight/SystemConnectionsCard';
import RecommendedActionsCard from '@/components/insight/RecommendedActionsCard';
import HealthSystemGrid from '@/components/health/HealthSystemGrid';
import { useIsMobile } from '@/hooks/use-mobile';

const Insights: React.FC = () => {
  // Initialize with the correct mock data that now matches the expected type
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(mockHealthIssues);
  const [healthSystemData, setHealthSystemData] = useState<HealthSystemItem[]>([]);
  const isMobile = useIsMobile();
  const [recommendations, setRecommendations] = useState<{
    color: string; 
    text: string; 
    importance?: 'high' | 'medium' | 'low'; 
    explanation?: string;
    category?: string;
  }[]>([
    { 
      color: "bg-blue-50", 
      text: "Støtt nervesystemet med magnesium og B-vitaminer for å redusere overbelastning.", 
      importance: "high",
      explanation: "Magnesium og B-vitaminer er essensielle for nervefunksjon og kan hjelpe med å redusere stress og nervøsitet.",
      category: "Tilskudd"
    },
    { 
      color: "bg-green-50", 
      text: "Forbedre tarmfloraen med daglig inntak av fermentert mat og probiotika.", 
      importance: "medium",
      explanation: "Fermentert mat inneholder levende bakteriekulturer som bidrar til å gjenopprette en sunn tarmflora.",
      category: "Kosthold"
    },
    { 
      color: "bg-purple-50", 
      text: "Prøv regelmessig yoga eller meditasjon for å balansere hormonsystemet.", 
      importance: "low",
      explanation: "Mindfulness-øvelser kan bidra til å redusere stresshormoner og skape bedre balanse i hormonsystemet.",
      category: "Stress"
    },
    { 
      color: "bg-amber-50", 
      text: "Reduser inntak av prosessert mat og sukker i 2 uker.",
      importance: "high",
      explanation: "Prosessert mat og sukker kan bidra til betennelse i kroppen og forverre tarmfloraproblemer.",
      category: "Kosthold"
    },
    { 
      color: "bg-red-50", 
      text: "Ta 15 minutters gåtur etter hvert måltid for å støtte fordøyelsen.",
      importance: "medium",
      explanation: "Lett fysisk aktivitet etter måltider kan forbedre blodsirkulasjonen og støtte fordøyelsesprosessen.",
      category: "Bevegelse"
    },
    { 
      color: "bg-indigo-50", 
      text: "Sørg for 7-8 timer kvalitetssøvn hver natt for nervesystemet.",
      importance: "high",
      explanation: "Søvn er avgjørende for nervesystemets restitusjon og kroppens generelle helbredelsesprosesser.",
      category: "Søvn"
    }
  ]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await seedDemoData();
        const issuesResult = await getHealthIssues();
        if (issuesResult && issuesResult.length > 0) {
          setHealthIssues(issuesResult);
        }
        
        // Fetch health systems data
        const healthSystemsResult = await getHealthSystems();
        if (healthSystemsResult && healthSystemsResult.length > 0) {
          setHealthSystemData(healthSystemsResult);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const connections = getSystemConnections(healthIssues);

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <ScrollArea className="h-full pb-20">
        <main className={`container mx-auto px-3 py-3 ${isMobile ? 'max-w-[100%]' : 'max-w-lg'}`}>
          <div className="mb-5">
            <h1 className="text-xl sm:text-2xl font-semibold mb-1.5 text-center">Innsikter</h1>
            <p className="text-gray-500 text-center text-xs sm:text-sm">Sammenhengen mellom dine helseutfordringer</p>
          </div>
          
          {/* Main insights summary */}
          <InsightsSummaryCard healthIssues={healthIssues} />
          
          {/* System connections */}
          <SystemConnectionsCard connections={connections} />
          
          {/* Recommended actions */}
          <RecommendedActionsCard recommendations={recommendations} />
          
          {/* Health systems grid */}
          <div className="mb-20 sm:mb-6">
            <HealthSystemGrid 
              healthData={healthSystemData}
              title="Kroppssystemer"
              description="Trykk på en kategori for å se systemene innen denne kategorien"
            />
          </div>
        </main>
      </ScrollArea>
    </div>
  );
};

export default Insights;
