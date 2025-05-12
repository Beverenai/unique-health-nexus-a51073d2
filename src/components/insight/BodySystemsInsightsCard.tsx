import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Brain, Lightbulb } from 'lucide-react';
import { HealthIssue } from '@/types/supabase';
import SystemIcon from '@/components/system-analysis/SystemIcon';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface BodySystemsInsightsCardProps {
  healthIssues: HealthIssue[];
}

// Group issues by body system
const groupIssuesBySystem = (issues: HealthIssue[]) => {
  const systems: Record<string, HealthIssue[]> = {
    'Nervesystem': [],
    'Fordøyelsessystem': [],
    'Muskelsystem': [],
    'Hormonsystem': [],
    'Immunsystem': [],
    'Hjerte-karsystem': []
  };

  issues.forEach(issue => {
    // Assign issue to a system based on keywords in name or description
    const name = issue.name.toLowerCase();
    const desc = issue.description.toLowerCase();
    
    if (name.includes('nerve') || name.includes('hjerne') || desc.includes('nervesystem')) {
      systems['Nervesystem'].push(issue);
    } else if (name.includes('tarm') || name.includes('fordøy') || desc.includes('tarm') || desc.includes('bakterie')) {
      systems['Fordøyelsessystem'].push(issue);
    } else if (name.includes('muskel') || name.includes('ledd') || desc.includes('muskel') || desc.includes('skjelett')) {
      systems['Muskelsystem'].push(issue);
    } else if (name.includes('hormon') || name.includes('thyroid') || desc.includes('hormon')) {
      systems['Hormonsystem'].push(issue);
    } else if (name.includes('immun') || name.includes('allergi') || desc.includes('immun')) {
      systems['Immunsystem'].push(issue);
    } else if (name.includes('hjerte') || name.includes('kar') || desc.includes('blod') || desc.includes('sirkulasjon')) {
      systems['Hjerte-karsystem'].push(issue);
    } else {
      // Default to nervous system if no match
      systems['Nervesystem'].push(issue);
    }
  });

  // Filter out empty systems
  return Object.entries(systems)
    .filter(([_, issues]) => issues.length > 0)
    .sort((a, b) => {
      // Sort by highest load in each system
      const maxLoadA = Math.max(...a[1].map(issue => issue.load));
      const maxLoadB = Math.max(...b[1].map(issue => issue.load));
      return maxLoadB - maxLoadA;
    });
};

const BodySystemsInsightsCard: React.FC<BodySystemsInsightsCardProps> = ({ healthIssues }) => {
  const navigate = useNavigate();
  const groupedIssues = groupIssuesBySystem(healthIssues);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      } 
    }
  };

  // Get system background color
  const getSystemBgColor = (system: string) => {
    switch(system.toLowerCase()) {
      case 'nervesystem': return 'bg-blue-50/90';
      case 'fordøyelsessystem': return 'bg-green-50/90';
      case 'muskelsystem': return 'bg-amber-50/90';
      case 'hormonsystem': return 'bg-purple-50/90';
      case 'immunsystem': return 'bg-indigo-50/90';
      case 'hjerte-karsystem': return 'bg-red-50/90';
      default: return 'bg-slate-50/90';
    }
  };

  const getSystemAccentColor = (system: string) => {
    switch(system.toLowerCase()) {
      case 'nervesystem': return 'text-blue-600';
      case 'fordøyelsessystem': return 'text-green-600';
      case 'muskelsystem': return 'text-amber-600';
      case 'hormonsystem': return 'text-purple-600';
      case 'immunsystem': return 'text-indigo-600';
      case 'hjerte-karsystem': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  // Update to use the correct route format with index
  const handleNavigateToSystem = (system: string, index: number) => {
    // Pass the index of the system in the array as the systemId parameter
    navigate(`/health-system/${index}`);
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="mb-5 bg-white/80 backdrop-blur-xl border-white/20 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <motion.div className="flex items-center gap-2 mb-1" variants={itemVariants}>
            <div className="bg-[#9b87f5]/10 p-1.5 sm:p-2 rounded-full">
              <Lightbulb size={18} className="text-[#9b87f5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-800">Systemoversikt</h3>
          </motion.div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="space-y-4">
            {groupedIssues.map(([system, issues], idx) => {
              const topIssue = issues.sort((a, b) => b.load - a.load)[0];
              const systemBgColor = getSystemBgColor(system);
              const systemTextColor = getSystemAccentColor(system);
              
              return (
                <motion.div 
                  key={system} 
                  className={`p-4 rounded-xl ${systemBgColor} border border-white/40 shadow-sm`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        <SystemIcon name={system} />
                      </div>
                      <h4 className="font-medium">{system}</h4>
                    </div>
                    <Badge className={`bg-white/50 ${systemTextColor} border-none`}>
                      {issues.length} {issues.length === 1 ? 'funn' : 'funn'}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Hovedutfordring:</span> {topIssue.name} ({topIssue.load}% belastning)
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {topIssue.description.length > 120 
                        ? `${topIssue.description.substring(0, 120)}...` 
                        : topIssue.description}
                    </p>
                  </div>
                  
                  {/* Specialist recommendation when relevant */}
                  {system === 'Muskelsystem' && (
                    <div className="bg-white/70 p-3 rounded-lg mb-3 text-xs shadow-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Anbefaling:</span> Oppsøk osteopat som kan se på 
                        {topIssue.name.toLowerCase().includes('nakke') 
                          ? ' C3-C5 området i ryggsøylen.' 
                          : ' lumbale ryggrad og bekkenbalanse.'}
                      </p>
                    </div>
                  )}
                  
                  {system === 'Fordøyelsessystem' && (
                    <div className="bg-white/70 p-3 rounded-lg mb-3 text-xs shadow-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Anbefaling:</span> Vurder bakterietest og 
                        konsultasjon med funksjonsmedisinsk terapeut for tarmflorabalansering.
                      </p>
                    </div>
                  )}

                  <Button 
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-between font-normal ${systemTextColor} hover:bg-white/50`}
                    onClick={() => handleNavigateToSystem(system, idx)}
                  >
                    <span>Se alle funn</span>
                    <ChevronRight size={16} />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BodySystemsInsightsCard;
