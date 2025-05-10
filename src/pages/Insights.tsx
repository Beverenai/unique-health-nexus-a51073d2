
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthIssue } from '@/types/supabase';
import { useEffect, useState } from 'react';
import { getHealthIssues } from '@/services/healthIssueService';
import { seedDemoData } from '@/services/demoDataService';
import { mockHealthIssues } from '@/data/mockData';
import SystemCard from '@/components/insight/SystemCard';
import ConnectionList from '@/components/insight/ConnectionList';
import RecommendationList from '@/components/insight/RecommendationList';
import { getSystemConnections } from '@/utils/systemUtils';
import ConnectionChart from '@/components/insight/ConnectionChart';
import HealthSystemGrid from '@/components/health/HealthSystemGrid';

// Sample health information data - using the same structure as the original table
const healthInfoData = [
  {
    area: "Tarm og fordøyelse",
    symptoms: "Slimhinner og bakterieflora viser ubalanse",
    causes: "Stress, antibiotika, bearbeidet mat",
    recommendations: "Spis fermentert mat, ta probiotika, unngå sukker i 1 uke"
  },
  {
    area: "Lymfesystem",
    symptoms: "Flere lymfekanaler viser treg flyt",
    causes: "Lav væskeinntak, lite bevegelse, miljøgifter",
    recommendations: "Drikk mer vann, bruk urtete (nesle, løvetann), lett aktivitet daglig"
  },
  {
    area: "Nakke og rygg (C4–C5)",
    symptoms: "Spenning og blokkering i nakkevirvler",
    causes: "Feil arbeidsstilling, stress, lav søvnkvalitet",
    recommendations: "Lett tøying, ergonomisk sittestilling, massasje"
  },
  {
    area: "Oksidativt stress",
    symptoms: "Cellemiljøet viser høy belastning",
    causes: "Miljøgifter, lavt antioksidantinntak, stress",
    recommendations: "Øk inntak av C-vitamin, bær, og grønne bladgrønnsaker"
  },
  {
    area: "Energisystem (mitokondrier)",
    symptoms: "Redusert energiproduksjon i cellene",
    causes: "Søvnunderskudd, tungmetaller, langvarig stress",
    recommendations: "Sov jevnt, ta Q10 og magnesium, reduser skjermtid før leggetid"
  },
  {
    area: "Hormonelle reseptorer",
    symptoms: "Lav sensitivitet i kroppens signalreseptorer",
    causes: "Kronisk stress, inflammasjon, hormonell ubalanse",
    recommendations: "Adaptogener (ashwagandha), meditasjon, dagslys om morgenen"
  },
  {
    area: "Immunforsvar",
    symptoms: "Hvite blodceller viser lav regulering",
    causes: "Langvarig stress, dårlig søvn, tarmubalanse",
    recommendations: "Søvnhygiene, C-vitamin, probiotika, reduser stimulering om kvelden"
  },
  {
    area: "Hud og bindevev",
    symptoms: "Redusert elastisitet og regenereringsevne",
    causes: "Lavt kollagen, lite bevegelse, oksidativt stress",
    recommendations: "Kollagentilskudd, bær, bevegelse og tøying"
  },
  {
    area: "Avgiftningskapasitet",
    symptoms: "Leveren og nyrene jobber hardt med eliminasjon",
    causes: "Kjemikalier, kosthold, medikamenter",
    recommendations: "Reduser eksponering, bruk melkefrø og løvetann, drikk mye vann"
  },
  {
    area: "Psykisk stress",
    symptoms: "Signalene fra nervesystemet viser overbelastning",
    causes: "For mange bekymringer, ytre krav, lite restitusjon",
    recommendations: "Avslapningsteknikker, pusteøvelser, natur, dagbok"
  }
];

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
      <main className="container max-w-lg mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2 text-center">Innsikter</h1>
          <p className="text-gray-500 text-center text-sm">Sammenhengen mellom dine helseutfordringer</p>
        </div>
        
        <HealthSystemGrid 
          healthData={healthInfoData}
        />
        
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Helsebelastninger</CardTitle>
          </CardHeader>
          <CardContent>
            <ConnectionChart healthIssues={healthIssues} />
          </CardContent>
        </Card>
        
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
