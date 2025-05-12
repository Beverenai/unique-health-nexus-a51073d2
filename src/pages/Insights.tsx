
import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HealthIssue } from '@/types/supabase';
import { getHealthIssues } from '@/services/healthIssueService';
import { getHealthSystems, HealthSystemItem } from '@/services/healthSystemService';
import { seedDemoData } from '@/services/demoDataService';
import { mockHealthIssues } from '@/data/mockData';
import { getSystemConnections } from '@/utils/systemUtils';
import BodySystemsInsightsCard from '@/components/insight/BodySystemsInsightsCard';
import EnhancedRecommendationsCard from '@/components/insight/EnhancedRecommendationsCard';
import SpecialistRecommendationsCard from '@/components/insight/SpecialistRecommendationsCard';
import HealthSystemGrid from '@/components/health/HealthSystemGrid';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SystemConnectionsCard from '@/components/insight/SystemConnectionsCard';

const Insights: React.FC = () => {
  const navigate = useNavigate();
  // Initialize with the correct mock data that now matches the expected type
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(mockHealthIssues);
  const [healthSystemData, setHealthSystemData] = useState<HealthSystemItem[]>([]);
  const [lastScanDate, setLastScanDate] = useState<Date | null>(null);
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
    },
    {
      color: "bg-green-50",
      text: "Oppsøk osteopat for vurdering av C3-C5 området i nakken.",
      importance: "high",
      explanation: "Nervekompresjon i dette området kan påvirke flere systemer i kroppen og bør undersøkes av fagperson.",
      category: "Spesialister"
    },
    {
      color: "bg-amber-50",
      text: "Ta Omega-3 tilskudd (2-3g EPA/DHA daglig) for å redusere inflammasjon.",
      importance: "medium",
      explanation: "Omega-3 fettsyrer har dokumentert anti-inflammatorisk effekt som kan dempe systemisk betennelse.",
      category: "Tilskudd"
    }
  ]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await seedDemoData();
        const issuesResult = await getHealthIssues();
        if (issuesResult && issuesResult.length > 0) {
          setHealthIssues(issuesResult);
          
          // Set the last scan date from the created_at field of the first health issue
          if (issuesResult[0]?.created_at) {
            setLastScanDate(new Date(issuesResult[0].created_at));
          }
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

  // Get system connections based on health issues
  const systemConnections = getSystemConnections(healthIssues);

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <ScrollArea className="h-full pb-0 insights-scroll-area">
        <main className={`container mx-auto px-3 py-3 ${isMobile ? 'max-w-[100%]' : 'max-w-lg'}`}>
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <h1 className="text-xl sm:text-2xl font-semibold text-center flex-1">Unique+</h1>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-[#9b87f5]"
                onClick={() => navigate('/history')}
              >
                <History size={18} className="mr-1" />
                Historikk
              </Button>
            </div>
            <p className="text-gray-500 text-center text-xs sm:text-sm">
              Avansert analyse basert på din skanning {lastScanDate ? `fra ${lastScanDate.toLocaleDateString('nb-NO', {day: 'numeric', month: 'long'})}` : ''}
            </p>
          </div>
          
          {/* Body Systems Insights */}
          <BodySystemsInsightsCard healthIssues={healthIssues} />
          
          {/* Specialist Recommendations */}
          <SpecialistRecommendationsCard healthIssues={healthIssues} />
          
          {/* Enhanced Recommendations */}
          <EnhancedRecommendationsCard recommendations={recommendations} />
          
          {/* System Connections Card - replaces SystemAnalysisSection */}
          {systemConnections.length > 0 && (
            <SystemConnectionsCard connections={systemConnections} />
          )}
          
          {/* Health systems grid */}
          <div className="mb-0 sm:mb-6">
            <HealthSystemGrid 
              healthData={healthSystemData}
              title="Alle kroppssystemer"
              description="Trykk på en kategori for å se systemene innen denne kategori"
            />
          </div>
        </main>
      </ScrollArea>
    </div>
  );
};

export default Insights;
