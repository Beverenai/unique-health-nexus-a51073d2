
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HealthIssue } from '@/types/supabase';
import { Brain, DropletIcon, LeafyGreen } from 'lucide-react';

interface InsightCardProps {
  healthIssues: HealthIssue[];
}

// Helper function to determine which icon to show based on the primary health issue
const getInsightIcon = (issues: HealthIssue[]) => {
  if (!issues.length) return <LeafyGreen className="text-green-500" />;
  
  const primaryIssue = issues[0].name.toLowerCase();
  
  if (primaryIssue.includes('stress') || primaryIssue.includes('mental')) {
    return <Brain className="text-blue-500" />;
  } else if (primaryIssue.includes('søvn') || primaryIssue.includes('sleep')) {
    return <LeafyGreen className="text-green-500" />;
  } else if (primaryIssue.includes('vitamin') || primaryIssue.includes('mineral')) {
    return <DropletIcon className="text-cyan-500" />;
  } else {
    return <LeafyGreen className="text-green-500" />;
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
  if (issueNames.some(name => name.includes('stress'))) {
    if (issueNames.some(name => name.includes('søvn') || name.includes('sleep'))) {
      return "Kroppen din viser tegn på stress og søvnproblemer. Vi anbefaler å prioritere avspenningsøvelser og god søvnhygiene denne uken.";
    } else if (issueNames.some(name => name.includes('vitamin'))) {
      return "Kroppen din håndterer stress samtidig som den viser tegn på vitaminmangel. Fokuser på restitusjon og et næringsrikt kosthold.";
    }
    return "Kroppen jobber med å håndtere stress. Vi anbefaler å prioritere enkle avspenningsøvelser og nok hvile denne uken.";
  } 
  
  if (issueNames.some(name => name.includes('søvn') || name.includes('sleep'))) {
    return "Søvnkvaliteten din er under optimalt nivå. Prioriter god søvnhygiene og konsistente leggetider denne uken.";
  }
  
  if (issueNames.some(name => name.includes('vitamin d'))) {
    return "Vitamin D-nivåene dine er lavere enn anbefalt. Øk eksponeringen for sol og vurder kosttilskudd etter anbefaling fra helsepersonell.";
  }
  
  // Generic fallback
  return "Kroppen din jobber aktivt med å gjenopprette balanse. Vi anbefaler å prioritere restitusjon og holde et sunt kosthold denne uken.";
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
