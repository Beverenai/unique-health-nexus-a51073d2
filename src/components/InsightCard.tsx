
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HealthIssue } from '@/types/supabase';
import { Brain, LeafyGreen, Moon, Bone } from 'lucide-react';

interface InsightCardProps {
  healthIssues: HealthIssue[];
}

const InsightCard: React.FC<InsightCardProps> = ({ healthIssues }) => {
  const sortedIssues = [...healthIssues].sort((a, b) => b.load - a.load);
  
  // Helper function to determine status based on load - updated with new colors
  const getStatusText = (load: number): { text: string; color: string } => {
    if (load < 20) return { text: "Stabilt", color: "text-[#88C999]" }; // green
    if (load < 50) return { text: "Ubalanse", color: "text-[#F6C85E]" }; // yellow
    return { text: "Høy belastning", color: "text-[#EF5E5E]" }; // red
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
  const muskelIssue = findIssueByType("kompresjon") || findIssueByType("nakkevirvler"); 
  
  return (
    <Card className="mb-8 bg-[#F7F7F7] border-none shadow-sm rounded-xl">
      <CardContent className="p-5">
        <h3 className="text-xl font-medium mb-3 text-[#1E1E1E]">Kroppen din viser tegn til belastning og ubalanse</h3>
        
        <p className="text-[#1E1E1E] mb-5 leading-relaxed text-sm">
          Skanningen indikerer at kroppen forsøker å håndtere både biokjemiske og fysiske utfordringer. 
          Du har lett ubalanse i tarmflora og hormoner, samt tegn til muskulær kompresjon i nakkeområdet.
        </p>
        
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain size={20} className="text-[#88C999]" />
              <span className="text-[#1E1E1E]">🧠 Nervesystem:</span>
            </div>
            <span className="text-[#88C999] font-medium">
              {nervesystemIssue ? getStatusText(nervesystemIssue.load).text : "Stabilt"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <LeafyGreen size={20} className="text-[#F6C85E]" />
              <span className="text-[#1E1E1E]">🦠 Tarmflora:</span>
            </div>
            <span className="text-[#F6C85E] font-medium">
              {tarmIssue ? getStatusText(tarmIssue.load).text : "Ubalanse"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Moon size={20} className="text-[#F6C85E]" />
              <span className="text-[#1E1E1E]">🔁 Hormonbalanse:</span>
            </div>
            <span className="text-[#F6C85E] font-medium">
              {hormonIssue ? getStatusText(hormonIssue.load).text : "Ujevnhet"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bone size={20} className="text-[#EF5E5E]" />
              <span className="text-[#1E1E1E]">🦴 Muskelsystem:</span>
            </div>
            <span className="text-[#EF5E5E] font-medium">
              {muskelIssue ? getStatusText(muskelIssue.load).text : "Kompresjon C4–C5"}
            </span>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <h4 className="text-sm font-medium mb-2 text-[#1E1E1E]">Anbefalinger:</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="text-[#88C999] mr-2">•</span>
              <span className="text-[#1E1E1E]">Vurder justering/behandling av nakkeområdet (f.eks. fysioterapi)</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#88C999] mr-2">•</span>
              <span className="text-[#1E1E1E]">Styrk tarmflora med fermentert mat og probiotika</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#88C999] mr-2">•</span>
              <span className="text-[#1E1E1E]">Optimaliser søvn og reduser stress for bedre hormonell regulering</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
