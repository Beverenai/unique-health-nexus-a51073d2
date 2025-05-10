
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HealthIssue } from '@/types/supabase';
import SystemCard from '@/components/insight/SystemCard';
import ConnectionList from '@/components/insight/ConnectionList';
import RecommendationList from '@/components/insight/RecommendationList';
import { findIssueByType, getSystemConnections } from '@/utils/systemUtils';

interface InsightCardProps {
  healthIssues: HealthIssue[];
}

const InsightCard: React.FC<InsightCardProps> = ({ healthIssues }) => {
  const sortedIssues = [...healthIssues].sort((a, b) => b.load - a.load);
  
  // Find issues by type
  const nervesystemIssue = findIssueByType(sortedIssues, "nervesystem");
  const tarmIssue = findIssueByType(sortedIssues, "tarmflora") || findIssueByType(sortedIssues, "tarm");
  const hormonIssue = findIssueByType(sortedIssues, "hormon");
  const muskelIssue = findIssueByType(sortedIssues, "kompresjon") || findIssueByType(sortedIssues, "nakkevirvler");
  const hjerteIssue = findIssueByType(sortedIssues, "hjerte") || findIssueByType(sortedIssues, "kardio");
  const lungeIssue = findIssueByType(sortedIssues, "lunge") || findIssueByType(sortedIssues, "puste");
  
  // List of body systems to display
  const bodySystems = [
    { name: "Nervesystem", issue: nervesystemIssue },
    { name: "Fordøyelsessystem", issue: tarmIssue },
    { name: "Hormonsystem", issue: hormonIssue },
    { name: "Muskelsystem", issue: muskelIssue },
    { name: "Hjerte-karsystem", issue: hjerteIssue },
    { name: "Respirasjonssystem", issue: lungeIssue }
  ];

  // Get system connections
  const connections = getSystemConnections(sortedIssues);

  // Recommendations based on system analysis
  const recommendations = [
    {
      color: "bg-emerald-50",
      text: "Fokuser på tarmhelse med prebiotika og probiotika for å påvirke både tarmflora og hormoner"
    },
    {
      color: "bg-amber-50",
      text: "Reduser stress som kan påvirke både hormonbalanse og muskelskjelettproblemer"
    },
    {
      color: "bg-blue-50",
      text: "Vurder fysisk behandling for nakken som kan forbedre nervesignaler i hele kroppen"
    }
  ];
  
  return (
    <Card className="mb-8 bg-white border-none shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Kroppen din som et helhetlig system</h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
          Skanningen indikerer sammenhenger mellom ulike systemer i kroppen din. 
          Se hvordan systemene påvirker hverandre og hvilke tiltak som kan ha størst effekt.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {bodySystems.map((system) => (
            <SystemCard 
              key={system.name}
              name={system.name}
              issue={system.issue}
            />
          ))}
        </div>
        
        <ConnectionList connections={connections} />
        
        <RecommendationList recommendations={recommendations} />
      </CardContent>
    </Card>
  );
};

export default InsightCard;
