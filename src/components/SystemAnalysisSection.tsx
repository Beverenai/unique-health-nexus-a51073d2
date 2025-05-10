
import React from 'react';
import { ScannerComponent } from '@/types/supabase';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Activity, Brain, Heart, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Flask from '@/components/issue-detail/Flask';

interface SystemAnalysisSectionProps {
  components: ScannerComponent[];
}

// Map category names to body systems
const CATEGORY_TO_SYSTEM = {
  'Nervesystem': 'nervesystem',
  'Hormoner': 'hormonsystem',
  'Fordøyelse': 'fordøyelsessystem',
  'Sirkulasjon': 'sirkulasjonssystem',
  'Respirasjon': 'respirasjonssystem',
  'Muskulatur': 'muskelsystem',
  'Immunforsvar': 'immunsystem',
};

const SystemAnalysisSection: React.FC<SystemAnalysisSectionProps> = ({ components }) => {
  // Calculate average load for each system based on categories
  const systemLoads = components.reduce((acc, component) => {
    let systemKey = 'annet';
    
    // Check if this category belongs to a specific system
    Object.entries(CATEGORY_TO_SYSTEM).forEach(([categoryPattern, system]) => {
      if (component.category.toLowerCase().includes(categoryPattern.toLowerCase())) {
        systemKey = system;
      }
    });
    
    // Add component to the appropriate system
    if (!acc[systemKey]) {
      acc[systemKey] = { totalLoad: 0, count: 0 };
    }
    
    acc[systemKey].totalLoad += component.level;
    acc[systemKey].count += 1;
    
    return acc;
  }, {} as Record<string, { totalLoad: number, count: number }>);
  
  // Calculate average load for each system
  const systemAverages = Object.entries(systemLoads).map(([system, data]) => {
    return {
      name: getSystemDisplayName(system),
      value: Math.round(data.totalLoad / data.count),
      color: getSystemColor(Math.round(data.totalLoad / data.count))
    };
  }).sort((a, b) => b.value - a.value);
  
  // Get the top 3 affected systems
  const topSystems = systemAverages.slice(0, 3);
  
  function getSystemDisplayName(systemKey: string): string {
    const displayNames: Record<string, string> = {
      'nervesystem': 'Nervesystem',
      'hormonsystem': 'Hormonsystem',
      'fordøyelsessystem': 'Fordøyelsessystem',
      'sirkulasjonssystem': 'Hjerte-kar',
      'respirasjonssystem': 'Respirasjonssystem',
      'muskelsystem': 'Muskelsystem',
      'immunsystem': 'Immunsystem',
      'annet': 'Andre systemer'
    };
    
    return displayNames[systemKey] || systemKey;
  }
  
  function getSystemColor(level: number): string {
    if (level < 30) return '#77C17E';
    if (level < 70) return '#F7D154';
    return '#EA384C';
  }
  
  function getSystemIcon(name: string) {
    switch(name.toLowerCase()) {
      case 'nervesystem':
        return <Brain className="h-5 w-5" />;
      case 'hjerte-kar':
        return <Heart className="h-5 w-5" />;
      case 'respirasjonssystem':
        return <Activity className="h-5 w-5" />; // Replaced Lung with Activity
      case 'fordøyelsessystem':
        return <Flask className="h-5 w-5" />; // Using the Flask icon from issue-detail
      default:
        return <Stethoscope className="h-5 w-5" />;
    }
  }
  
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-100/20">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2">
          <Stethoscope size={20} className="text-[#9b87f5]" />
          <h2 className="text-lg font-medium">Systemanalyse</h2>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <p className="text-gray-700 mb-4">
          Basert på skanningen din, har vi identifisert disse kroppslige systemene som viser størst belastning:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {systemAverages.length > 0 ? (
            <div className="col-span-1 md:col-span-2">
              <div className="space-y-3">
                {topSystems.map((system) => (
                  <div key={system.name} className="bg-white/70 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "p-1.5 rounded-full", 
                        system.value < 30 ? "bg-[#77C17E]/10" : 
                        system.value < 70 ? "bg-[#F7D154]/10" : 
                        "bg-[#EA384C]/10"
                      )}>
                        {getSystemIcon(system.name)}
                      </div>
                      <span className="text-sm font-medium">{system.name}</span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded ml-auto font-medium",
                        system.value < 30 ? "bg-[#77C17E]/10 text-[#77C17E]" : 
                        system.value < 70 ? "bg-[#F7D154]/10 text-[#F7D154]" : 
                        "bg-[#EA384C]/10 text-[#EA384C]"
                      )}>
                        {system.value}% belastning
                      </span>
                    </div>
                    <div className="relative h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div 
                        className={cn("absolute top-0 left-0 h-full rounded-full", 
                          system.value < 30 ? "bg-[#77C17E]" : 
                          system.value < 70 ? "bg-[#F7D154]" : 
                          "bg-[#EA384C]"
                        )}
                        style={{ width: `${system.value}%` }}
                      />
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-2">
                      {system.value < 30 
                        ? `${system.name} fungerer innenfor normale parametere.`
                        : system.value < 70
                        ? `${system.name} viser moderat belastning. Tiltak anbefales.`
                        : `${system.name} viser høy belastning. Tiltak sterkt anbefalt.`
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Ingen systembelastning over terskelen ble funnet.</p>
          )}
          
          {systemAverages.length > 0 && (
            <div className="col-span-1 flex items-center justify-center">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={systemAverages.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {systemAverages.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
        
        {systemAverages.length > 0 && (
          <div className="bg-[#9b87f5]/5 rounded-lg p-4 border border-[#9b87f5]/10">
            <h4 className="font-medium text-sm mb-2">Sammenhenger mellom systemene</h4>
            <p className="text-sm text-gray-700">
              Alle kroppens systemer er sammenkoblet. Belastning i ett system kan påvirke andre.
              For eksempel kan et overbelastet {topSystems[0]?.name.toLowerCase() || 'nervesystem'} påvirke 
              {topSystems.length > 1 ? ` ${topSystems[1]?.name.toLowerCase() || 'fordøyelsen'}` : ' andre systemer'} gjennom
              komplekse biokjemiske feedback-mekanismer.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemAnalysisSection;
