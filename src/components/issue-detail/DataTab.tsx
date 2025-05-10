
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Activity, ChevronDown } from 'lucide-react';
import { ScannerComponent } from '@/types/supabase';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import ScannerComponentTable from '@/components/ScannerComponentTable';
import SystemAnalysisSection from '@/components/SystemAnalysisSection';

interface DataTabProps {
  scannerComponents: ScannerComponent[];
}

const DataTab: React.FC<DataTabProps> = ({ scannerComponents }) => {
  const [isLowPriorityOpen, setIsLowPriorityOpen] = useState(false);
  
  // Split components by importance threshold (20%)
  const importantComponents = scannerComponents.filter(comp => comp.level >= 20);
  const lessImportantComponents = scannerComponents.filter(comp => comp.level < 20);
  
  // Check if we have components to display
  const hasImportantFindings = importantComponents.length > 0;
  const hasLessImportantFindings = lessImportantComponents.length > 0;
  
  return (
    <div className="space-y-6">
      {/* System Analysis Section */}
      {hasImportantFindings && (
        <SystemAnalysisSection components={importantComponents} />
      )}
      
      {/* Important Findings Section */}
      <Card className="bg-white/70 backdrop-blur-sm border-gray-100/20">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-[#9b87f5]" />
            <h2 className="text-lg font-medium">Viktige funn ({importantComponents.length})</h2>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <p className="text-gray-700 mb-4">
            Disse komponentene viser høyere nivåer (20% eller mer) i din skanneøkt og kan kreve oppmerksomhet.
          </p>
          
          {hasImportantFindings ? (
            <ScannerComponentTable components={importantComponents} />
          ) : (
            <p className="text-gray-500 italic">Ingen viktige funn (over 20%) ble oppdaget i din skanneøkt.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Less Important Findings - Collapsible */}
      {hasLessImportantFindings && (
        <Card className="bg-white/70 backdrop-blur-sm border-gray-100/20">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-gray-400" />
                <h2 className="text-lg font-medium text-gray-700">Andre detekterte komponenter ({lessImportantComponents.length})</h2>
              </div>
              <Collapsible open={isLowPriorityOpen} onOpenChange={setIsLowPriorityOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronDown className={`h-4 w-4 transition-transform ${isLowPriorityOpen ? "rotate-180" : ""}`} />
                    <span className="sr-only">Vis mindre viktige funn</span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <p className="text-gray-700 mb-4">
                    Disse komponentene viser lavere nivåer (under 20%) i din skanneøkt og krever mindre umiddelbar oppmerksomhet.
                  </p>
                  <ScannerComponentTable components={lessImportantComponents} />
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            {!isLowPriorityOpen && (
              <p className="text-gray-500 text-sm">
                Klikk på pilen for å se {lessImportantComponents.length} komponenter med lavere nivåer (under 20%).
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataTab;
