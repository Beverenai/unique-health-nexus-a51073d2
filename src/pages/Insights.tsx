
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthIssue } from '@/types/supabase';
import { useEffect, useState } from 'react';
import { getHealthIssues, seedDemoData } from '@/services/supabaseService';
import { mockHealthIssues } from '@/data/mockData';
import SystemCard from '@/components/insight/SystemCard';
import ConnectionList from '@/components/insight/ConnectionList';
import RecommendationList from '@/components/insight/RecommendationList';
import { getSystemConnections } from '@/utils/systemUtils';

const Insights: React.FC = () => {
  // Initialize with the correct mock data that now matches the expected type
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(mockHealthIssues);
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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const connections = getSystemConnections(healthIssues);

  return (
    <div className="min-h-screen pb-24 pt-4">
      <main className="container max-w-md mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2 text-center">Innsikter</h1>
          <p className="text-gray-500 text-center text-sm">Sammenhengen mellom dine helseutfordringer</p>
        </div>
        
        {healthIssues.map((issue) => (
          <div key={issue.id} className="mb-4">
            <SystemCard name={issue.name} issue={issue} />
          </div>
        ))}
        
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Sammenhenger</CardTitle>
          </CardHeader>
          <CardContent>
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
    </div>
  );
};

export default Insights;
