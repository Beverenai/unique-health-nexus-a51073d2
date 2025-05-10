
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HealthIssue } from '@/types/supabase';
import { Brain, Salad, Moon, Bone, Heart, Activity, Eye } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface InsightCardProps {
  healthIssues: HealthIssue[];
}

const InsightCard: React.FC<InsightCardProps> = ({ healthIssues }) => {
  const sortedIssues = [...healthIssues].sort((a, b) => b.load - a.load);
  
  // Helper function to determine status based on load - updated with new colors
  const getStatusText = (load: number): { text: string; color: string } => {
    if (load < 20) return { text: "Stabilt", color: "text-emerald-600" }; 
    if (load < 50) return { text: "Ubalanse", color: "text-amber-600" }; 
    return { text: "Høy belastning", color: "text-rose-600" }; 
  };

  const getStatusProgressColor = (load: number): string => {
    if (load < 20) return 'bg-emerald-400'; 
    if (load < 50) return 'bg-amber-400'; 
    return 'bg-rose-400';  
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
    let bgColor = "";
    
    // Determine icon based on system name
    switch (name.toLowerCase()) {
      case "nervesystem":
        icon = <Brain size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        bgColor = "bg-blue-50";
        break;
      case "fordøyelsessystem":
        icon = <Salad size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        bgColor = "bg-green-50";
        break;
      case "hormonsystem":
        icon = <Moon size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        bgColor = "bg-purple-50";
        break;
      case "muskelsystem":
        icon = <Bone size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        bgColor = "bg-amber-50";
        break;
      case "hjerte-karsystem":
        icon = <Heart size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        bgColor = "bg-rose-50";
        break;
      case "respirasjonssystem":
        icon = <Activity size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        bgColor = "bg-sky-50";
        break;
      default:
        icon = <Eye size={20} className={issue ? getStatusText(issue.load).color : "text-gray-400"} />;
        bgColor = "bg-slate-50";
    }
    
    return { 
      icon, 
      status: issue ? getStatusText(issue.load) : { text: "Ingen data", color: "text-gray-400" },
      bgColor 
    };
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
    <Card className="mb-8 bg-white border-none shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Kroppen din som et helhetlig system</h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
          Skanningen indikerer sammenhenger mellom ulike systemer i kroppen din. 
          Se hvordan systemene påvirker hverandre og hvilke tiltak som kan ha størst effekt.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {bodySystems.map((system) => {
            const { icon, status, bgColor } = getSystemData(system.name, system.issue);
            return (
              <div key={system.name} className={`p-4 rounded-xl ${bgColor} relative`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-1.5 rounded-full shadow-sm">
                      {icon}
                    </div>
                    <span className="text-gray-800 font-medium">{system.name}</span>
                  </div>
                  <span className={`${status.color} text-sm font-medium`}>
                    {system.issue ? status.text : "Ingen data"}
                  </span>
                </div>
                
                {system.issue && (
                  <div className="mt-2">
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
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold mb-4 text-gray-800">Systemforbindelser:</h4>
            <div className="space-y-3">
              {connections.map((connection, idx) => (
                <div key={idx} className="flex items-start p-3 bg-white rounded-lg shadow-sm border border-gray-50">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2"></div>
                  <div>
                    <span className="text-gray-800">
                      <span className="font-medium">{connection.from} → {connection.to}:</span> {connection.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="pt-5 mt-5 border-t border-gray-100">
          <h4 className="text-sm font-semibold mb-3 text-gray-800">Anbefalinger basert på helheten:</h4>
          <div className="space-y-2">
            <div className="flex items-start bg-emerald-50 p-3 rounded-lg">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2"></div>
              <span className="text-gray-700 text-sm">Fokuser på tarmhelse med prebiotika og probiotika for å påvirke både tarmflora og hormoner</span>
            </div>
            <div className="flex items-start bg-amber-50 p-3 rounded-lg">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 mr-2"></div>
              <span className="text-gray-700 text-sm">Reduser stress som kan påvirke både hormonbalanse og muskelskjelettproblemer</span>
            </div>
            <div className="flex items-start bg-blue-50 p-3 rounded-lg">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2"></div>
              <span className="text-gray-700 text-sm">Vurder fysisk behandling for nakken som kan forbedre nervesignaler i hele kroppen</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
