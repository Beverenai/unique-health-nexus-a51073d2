
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthIssue } from '@/types/supabase';
import { useEffect, useState } from 'react';
import { getHealthIssues } from '@/services/healthIssueService';
import { seedDemoData } from '@/services/demoDataService';
import { mockHealthIssues } from '@/data/mockData';
import ConnectionList from '@/components/insight/ConnectionList';
import RecommendationList from '@/components/insight/RecommendationList';
import { getSystemConnections } from '@/utils/systemUtils';
import ConnectionChart from '@/components/insight/ConnectionChart';
import HealthSystemGrid from '@/components/health/HealthSystemGrid';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getHealthSystems, HealthSystemItem } from '@/services/healthSystemService';
import InsightCard from '@/components/InsightCard';

const Insights: React.FC = () => {
  // Initialize with the correct mock data that now matches the expected type
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(mockHealthIssues);
  const [healthSystemData, setHealthSystemData] = useState<HealthSystemItem[]>([]);
  const [recommendations, setRecommendations] = useState<{color: string, text: string}[]>([
    { color: "bg-blue-50", text: "Støtt nervesystemet med magnesium og B-vitaminer for å redusere overbelastning." },
    { color: "bg-green-50", text: "Forbedre tarmfloraen med daglig inntak av fermentert mat og probiotika." },
    { color: "bg-purple-50", text: "Prøv regelmessig yoga eller meditasjon for å balansere hormonsystemet." }
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
      <ScrollArea className="h-full pb-16">
        <main className="container max-w-lg mx-auto px-4 py-4">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2 text-center">Innsikter</h1>
            <p className="text-gray-500 text-center text-sm">Sammenhengen mellom dine helseutfordringer</p>
          </div>
          
          <HealthSystemGrid 
            healthData={healthSystemData}
            title="Kroppssystemer"
            description="Trykk på en kategori for å se systemene innen denne kategorien"
          />
          
          <InsightCard healthIssues={healthIssues} />
          
          <Card className="mb-6 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Sammenhenger</CardTitle>
            </CardHeader>
            <CardContent>
              <ConnectionChart healthIssues={healthIssues} />
              <ConnectionList connections={connections} />
            </CardContent>
          </Card>
          
          <Card className="mb-6 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Anbefalte tiltak</CardTitle>
            </CardHeader>
            <CardContent>
              <RecommendationList recommendations={recommendations} />
            </CardContent>
          </Card>
        </main>
      </ScrollArea>
    </div>
  );
};

export default Insights;
