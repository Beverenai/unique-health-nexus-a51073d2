
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HealthIssue } from '@/types/supabase';
import { CloudFog, LeafyGreen, Moon, Brain } from 'lucide-react';

interface InsightCardProps {
  healthIssues: HealthIssue[];
}

// Helper function to determine which icon to show based on the primary health issue
const getInsightIcon = (issues: HealthIssue[]) => {
  if (!issues.length) return <Moon className="text-indigo-500" />;
  
  const primaryIssue = issues[0].name.toLowerCase();
  
  if (primaryIssue.includes('stress') || primaryIssue.includes('søvn')) {
    return <Moon className="text-indigo-500" />;
  } else if (primaryIssue.includes('tarm') || primaryIssue.includes('parasitt')) {
    return <LeafyGreen className="text-teal-500" />;
  } else if (primaryIssue.includes('tungmetall') || primaryIssue.includes('miljø')) {
    return <CloudFog className="text-blue-500" />;
  } else {
    return <Brain className="text-indigo-500" />;
  }
};

// Helper function to generate a summary based on health issues
const generateInsightSummary = (issues: HealthIssue[]): string => {
  if (!issues.length) {
    return "Vi har ingen helseproblemer å rapportere. Fortsett med din nåværende livsstil.";
  }

  // Get the top issues (max 3)
  const topIssues = issues.slice(0, 3);
  const issueNames = topIssues.map(issue => issue.name.toLowerCase());
  
  // Create different types of summaries based on the combination of issues
  if (issueNames.some(name => name.includes('tungmetall')) && 
      issueNames.some(name => name.includes('tarm'))) {
    return "Kroppen jobber aktivt med miljøgifter og tarmhelse. Fokuser på restitusjon og kosthold denne uken.";
  }
  
  if (issueNames.some(name => name.includes('tungmetall')) || 
      issueNames.some(name => name.includes('miljø'))) {
    if (issueNames.some(name => name.includes('stress'))) {
      return "Kroppen håndterer miljøgifter og stress samtidig. Vi anbefaler å prioritere avgiftning og avslapningsøvelser.";
    }
    return "Kroppen viser tegn på miljøgiftbelastning. Støtt kroppens avgiftningssystem med antioksidanter.";
  } 
  
  if (issueNames.some(name => name.includes('tarm')) || 
      issueNames.some(name => name.includes('parasitt'))) {
    return "Tarmfloraen din trenger støtte. Fokuser på probiotika og antiinflamatorisk kosthold denne uken.";
  }
  
  if (issueNames.some(name => name.includes('stress')) || 
      issueNames.some(name => name.includes('søvn'))) {
    return "Kroppen viser tegn på stressbelastning. Prioriter restitusjon og stresshåndteringsteknikker.";
  }
  
  // Generic fallback
  return "Kroppen jobber aktivt med å gjenopprette balanse. Vi anbefaler å prioritere restitusjon og kosthold denne uken.";
};

const InsightCard: React.FC<InsightCardProps> = ({ healthIssues }) => {
  const sortedIssues = [...healthIssues].sort((a, b) => b.load - a.load);
  const insightSummary = generateInsightSummary(sortedIssues);
  const icon = getInsightIcon(sortedIssues);

  return (
    <Card className="mb-8 bg-[#F7F7F7] border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="mt-1 bg-white p-2 rounded-full">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Sammendrag fra skanningen</h3>
            <p className="text-gray-700">{insightSummary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
