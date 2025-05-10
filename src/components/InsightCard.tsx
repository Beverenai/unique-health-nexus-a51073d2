
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HealthIssue } from '@/types/supabase';
import { CloudFog, LeafyGreen, Moon, Brain } from 'lucide-react';

interface InsightCardProps {
  healthIssues: HealthIssue[];
}

const InsightCard: React.FC<InsightCardProps> = ({ healthIssues }) => {
  const sortedIssues = [...healthIssues].sort((a, b) => b.load - a.load);
  
  // Helper function to determine status based on load
  const getStatusText = (load: number): { text: string; color: string } => {
    if (load < 20) return { text: "Lav belastning", color: "text-green-500" };
    if (load < 50) return { text: "Moderat belastning", color: "text-yellow-500" };
    return { text: "Høy belastning", color: "text-red-500" };
  };

  // Find issues by type
  const findIssueByType = (keyword: string) => {
    return sortedIssues.find(issue => 
      issue.name.toLowerCase().includes(keyword.toLowerCase())
    );
  };
  
  const nervesystemIssue = findIssueByType("nervesystem");
  const tarmIssue = findIssueByType("tarmflora") || findIssueByType("tarm");
  const hormonIssue = findIssueByType("hormon");

  return (
    <Card className="mb-8 bg-[#F7F7F7] border-none shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2">Din kropp jobber med flere belastninger</h3>
        
        <p className="text-gray-700 mb-4">
          Skanningen viser at kroppen bruker energi på å håndtere flere utfordringer. 
          Du har lav belastning på nervesystemet, men moderate funn innen tarmhelse og hormonbalanse.
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain size={18} className="text-blue-500" />
              <span>🧠 Nervesystem:</span>
            </div>
            <span className="text-green-500 font-medium">
              {nervesystemIssue ? getStatusText(nervesystemIssue.load).text : "Lav belastning"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <LeafyGreen size={18} className="text-teal-500" />
              <span>🦠 Tarmhelse:</span>
            </div>
            <span className="text-yellow-500 font-medium">
              {tarmIssue ? getStatusText(tarmIssue.load).text : "Moderat belastning"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Moon size={18} className="text-purple-500" />
              <span>🔁 Hormonbalanse:</span>
            </div>
            <span className="text-yellow-500 font-medium">
              {hormonIssue ? getStatusText(hormonIssue.load).text : "Lett ubalanse"}
            </span>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <h4 className="text-sm font-medium mb-2">Anbefalinger:</h4>
          <ul className="text-sm space-y-1.5">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Spis mer fermentert mat og probiotika
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Prioriter jevn søvnrytme og stressreduksjon
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Drikk nok vann og vurder adaptogener
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
