
import React from 'react';
import { ScannerComponent } from '@/types/supabase';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';
import { calculateSystemLoads, getSystemAverages } from './utils';
import SystemItem from './SystemItem';
import SystemChart from './SystemChart';
import SystemRelations from './SystemRelations';

interface SystemAnalysisSectionProps {
  components: ScannerComponent[];
}

const SystemAnalysisSection: React.FC<SystemAnalysisSectionProps> = ({ components }) => {
  // Calculate system loads and averages
  const systemLoads = calculateSystemLoads(components);
  const systemAverages = getSystemAverages(systemLoads);
  
  // Get the top 3 affected systems
  const topSystems = systemAverages.slice(0, 3);
  
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
                  <SystemItem 
                    key={system.name} 
                    name={system.name} 
                    value={system.value} 
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Ingen systembelastning over terskelen ble funnet.</p>
          )}
          
          {systemAverages.length > 0 && (
            <div className="col-span-1 flex items-center justify-center">
              <SystemChart data={systemAverages.slice(0, 5)} />
            </div>
          )}
        </div>
        
        {systemAverages.length > 0 && (
          <SystemRelations 
            topSystem={topSystems[0]?.name} 
            secondSystem={topSystems.length > 1 ? topSystems[1]?.name.toLowerCase() : 'andre systemer'} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SystemAnalysisSection;
