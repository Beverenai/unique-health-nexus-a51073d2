
import React from 'react';
import { ScannerComponent } from '@/types/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

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
  
  // Group components by category
  const groupedComponents = components.reduce((acc, component) => {
    const category = component.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {} as Record<string, ScannerComponent[]>);
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedComponents).map(([category, categoryComponents]) => (
        <div key={category} className="bg-white/50 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3 text-gray-700 uppercase">{category}</h3>
          <div className="space-y-3">
            {categoryComponents.map((component) => (
              <div key={component.id} className="bg-white/70 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{component.name}</span>
                  <span className={cn("text-sm font-medium", getTextColor(component.level))}>
                    {component.level}%
                  </span>
                </div>
                <Progress value={component.level} className={cn("h-1", getProgressColor(component.level))} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScannerComponentTable;
