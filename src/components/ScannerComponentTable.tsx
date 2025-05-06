
import React from 'react';
import { ScannerComponent } from '@/types/supabase';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ScannerComponentTableProps {
  components: ScannerComponent[];
}

const ScannerComponentTable: React.FC<ScannerComponentTableProps> = ({ components }) => {
  // Group components by category
  const groupedComponents = components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, ScannerComponent[]>);

  // Sort categories by highest level component
  const sortedCategories = Object.keys(groupedComponents).sort((a, b) => {
    const maxLevelA = Math.max(...groupedComponents[a].map(c => c.level));
    const maxLevelB = Math.max(...groupedComponents[b].map(c => c.level));
    return maxLevelB - maxLevelA;
  });

  // Function to get color based on level
  const getLevelColor = (level: number): string => {
    if (level < 20) return 'bg-success';
    if (level < 30) return 'bg-warning';
    return 'bg-danger';
  };

  // Function to clean name from .dsd extension
  const cleanComponentName = (name: string): string => {
    return name.replace(/\.dsd$/, '');
  };

  return (
    <div className="space-y-6">
      {sortedCategories.map(category => (
        <div key={category} className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-medium text-lg mb-4">{category}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Detektert komponent</TableHead>
                <TableHead className="text-right">Nivå</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedComponents[category]
                .sort((a, b) => b.level - a.level) // Sort by level descending
                .map(component => (
                  <TableRow key={component.id}>
                    <TableCell className="font-medium">
                      {cleanComponentName(component.name)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress 
                          value={component.level} 
                          className={cn("h-2 w-24", getLevelColor(component.level))} 
                        />
                        <span className="w-10 text-right">{component.level}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default ScannerComponentTable;
