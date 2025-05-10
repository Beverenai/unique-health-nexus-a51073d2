
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HealthIssue } from '@/types/supabase';
import { Brain, Stomach, Moon, Bone, Heart, Lungs, Eye } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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

  const getStatusProgressColor = (load: number): string => {
    if (load < 20) return 'bg-[#88C999]'; // Green for low load
    if (load < 50) return 'bg-[#F6C85E]'; // Yellow for moderate load
    return 'bg-[#EF5E5E]';  // Red for high load
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
  const hjerteIssue = findIssueByType("hjerte") || findIssueByType("kardio");
  const lungeIssue = findIssueByType("lunge") || findIssueByType("puste");
  
  // Get icon and data for a system
  const getSystemData = (name: string, issue: HealthIssue | undefined) => {
    let icon;
    let color = "";
    
    // Determine icon based on system name
    switch (name.toLowerCase()) {
      case "nervesystem":
        icon = <Brain size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        break;
      case "fordøyelsessystem":
        icon = <Stomach size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        break;
      case "hormonsystem":
        icon = <Moon size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        break;
      case "muskelsystem":
        icon = <Bone size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        break;
      case "hjerte-karsystem":
        icon = <Heart size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        break;
      case "respirasjonssystem":
        icon = <Lungs size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        break;
      default:
        icon = <Eye size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
    }
    
    return { icon, status: issue ? getStatusText(issue.load) : { text: "Ingen data", color: "text-gray-400" } };
  };
  
  // List of body systems to display
  const bodySystems = [
    { name: "Nervesystem", issue: nervesystemIssue },
    { name: "Fordøyelsessystem", issue: tarmIssue },
    { name: "Hormonsystem", issue: hormonIssue },
    { name: "Muskelsystem", issue: muskelIssue },
    { name: "Hjerte-karsystem", issue: hjerteIssue },
    { name: "Respirasjonssystem", issue: lungeIssue }
  ];

  // Identify connections between systems
  const getConnections = () => {
    const connections = [];
    
    if (tarmIssue && hormonIssue) {
      connections.push({
        from: "Fordøyelsessystem",
        to: "Hormonsystem",
        description: "Din tarmflora påvirker hormonbalansen"
      });
    }
    
    if (muskelIssue && nervesystemIssue) {
      connections.push({
        from: "Muskelsystem", 
        to: "Nervesystem",
        description: "Nakkeproblemer påvirker nervesystemet"
      });
    }

    if (hormonIssue && nervesystemIssue) {
      connections.push({
        from: "Hormonsystem",
        to: "Nervesystem",
        description: "Hormonell ubalanse påvirker nervesystemet"
      });
    }
    
    return connections;
  };
  
  const connections = getConnections();
  
  return (
    <Card className="mb-8 bg-gradient-to-br from-[#F9FAFE] to-[#F7F7F7] border-none shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-5">
        <h3 className="text-xl font-medium mb-3 text-[#1E1E1E]">Kroppen din som et helhetlig system</h3>
        
        <p className="text-[#1E1E1E] mb-5 leading-relaxed text-sm">
          Skanningen indikerer sammenhenger mellom ulike systemer i kroppen din. 
          Se hvordan systemene påvirker hverandre og hvilke tiltak som kan ha størst effekt.
        </p>
        
        <div className="space-y-4 mb-5">
          {bodySystems.map((system) => {
            const { icon, status } = getSystemData(system.name, system.issue);
            return (
              <div key={system.name} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-[#1E1E1E]">{system.name}:</span>
                  </div>
                  <span className={`${status.color} font-medium`}>
                    {system.issue ? status.text : "Ingen data"}
                  </span>
                </div>
                
                {system.issue && (
                  <div className="mb-3">
                    <Progress 
                      value={system.issue.load} 
                      className={`h-1.5 w-full rounded-full ${getStatusProgressColor(system.issue.load)}`} 
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {connections.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-3 text-[#1E1E1E]">Systemforbindelser:</h4>
            <ul className="text-sm space-y-3">
              {connections.map((connection, idx) => (
                <li key={idx} className="flex items-start p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-[#88C999] mr-2 mt-0.5">•</span>
                  <span className="text-[#1E1E1E]">
                    <span className="font-medium">{connection.from} → {connection.to}:</span> {connection.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="pt-4 mt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium mb-2 text-[#1E1E1E]">Anbefalinger basert på helheten:</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="text-[#88C999] mr-2">•</span>
              <span className="text-[#1E1E1E]">Fokuser på tarmhelse med prebiotika og probiotika for å påvirke både tarmflora og hormoner</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#88C999] mr-2">•</span>
              <span className="text-[#1E1E1E]">Reduser stress som kan påvirke både hormonbalanse og muskelskjelettproblemer</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#88C999] mr-2">•</span>
              <span className="text-[#1E1E1E]">Vurder fysisk behandling for nakken som kan forbedre nervesignaler i hele kroppen</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
