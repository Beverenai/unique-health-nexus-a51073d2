
import React from 'react';
import { ScannerComponent } from '@/types/supabase';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { InfoIcon } from 'lucide-react';
import { CustomTooltip } from '@/components/ui/tooltip';

interface ScannerComponentTableProps {
  components: ScannerComponent[];
}

const ScannerComponentTable: React.FC<ScannerComponentTableProps> = ({ components }) => {
  const getProgressColor = (level: number): string => {
    if (level < 30) return 'bg-[#77C17E]';
    if (level < 70) return 'bg-[#F7D154]';
    return 'bg-[#EA384C]';
  };
  
  const getTextColor = (level: number): string => {
    if (level < 30) return 'text-[#77C17E]';
    if (level < 70) return 'text-[#F7D154]';
    return 'text-[#EA384C]';
  };
  
  const getStatusText = (level: number): string => {
    if (level < 30) return 'Lav belastning';
    if (level < 70) return 'Moderat belastning';
    return 'Høy belastning';
  };
  
  // Group components by category
  const groupedComponents = components.reduce((acc, component) => {
    const category = component.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {} as Record<string, ScannerComponent[]>);
  
  // Sort categories by highest component level
  const sortedCategories = Object.keys(groupedComponents).sort((a, b) => {
    const maxLevelA = Math.max(...groupedComponents[a].map(c => c.level));
    const maxLevelB = Math.max(...groupedComponents[b].map(c => c.level));
    return maxLevelB - maxLevelA;
  });
  
  return (
    <div className="space-y-6">
      {sortedCategories.map((category) => (
        <div key={category} className="bg-white/50 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3 text-gray-700 uppercase flex items-center gap-2">
            {category}
            <CustomTooltip content={
              <p className="max-w-xs text-xs">
                Verdier over 60% kan indikere betydelige utfordringer i denne kategorien.
              </p>
            }>
              <InfoIcon size={14} className="text-gray-400 cursor-help" />
            </CustomTooltip>
          </h3>
          
          <div className="space-y-3">
            {groupedComponents[category]
              .sort((a, b) => b.level - a.level) // Sort components by level descending
              .map((component) => (
                <div key={component.id} className="bg-white/70 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{component.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100">
                        {getStatusText(component.level)}
                      </span>
                      <span className={cn("text-sm font-medium", getTextColor(component.level))}>
                        {component.level}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={component.level} 
                    className={cn("h-1.5", getProgressColor(component.level))} 
                  />
                  
                  {component.level > 40 && (
                    <p className="text-xs text-gray-600 mt-2 italic">
                      Dette nivået er høyere enn anbefalt og kan påvirke din generelle helse.
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScannerComponentTable;
