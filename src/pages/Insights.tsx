
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthIssue } from '@/types/supabase';
import { useEffect, useState } from 'react';
import { getHealthIssues, seedDemoData } from '@/services/supabaseService';
import { mockHealthIssues as mockIssues } from '@/data/mockData';
import { SystemCard } from '@/components/insight/SystemCard';
import { ConnectionList } from '@/components/insight/ConnectionList';
import { RecommendationList } from '@/components/insight/RecommendationList';

const Insights: React.FC = () => {
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(mockIssues);
  
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

  return (
    <div className="min-h-screen pb-24 pt-4">
      <main className="container max-w-md mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2 text-center">Innsikter</h1>
          <p className="text-gray-500 text-center text-sm">Sammenhengen mellom dine helseutfordringer</p>
        </div>
        
        <SystemCard healthIssues={healthIssues} />
        
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Sammenhenger</CardTitle>
          </CardHeader>
          <CardContent>
            <ConnectionList healthIssues={healthIssues} />
          </CardContent>
        </Card>
        
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Anbefalte tiltak</CardTitle>
          </CardHeader>
          <CardContent>
            <RecommendationList healthIssues={healthIssues} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Insights;
