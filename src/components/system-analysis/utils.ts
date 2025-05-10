
import { ScannerComponent } from '@/types/supabase';

// Map category names to body systems
export const CATEGORY_TO_SYSTEM: Record<string, string> = {
  'Nervesystem': 'nervesystem',
  'Hormoner': 'hormonsystem',
  'Fordøyelse': 'fordøyelsessystem',
  'Sirkulasjon': 'sirkulasjonssystem',
  'Respirasjon': 'respirasjonssystem',
  'Muskulatur': 'muskelsystem',
  'Immunforsvar': 'immunsystem',
};

export interface SystemLoad {
  name: string;
  value: number;
  color: string;
}

// Calculate system loads from components
export const calculateSystemLoads = (components: ScannerComponent[]): Record<string, { totalLoad: number, count: number }> => {
  return components.reduce((acc, component) => {
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
};

// Get system display name
export const getSystemDisplayName = (systemKey: string): string => {
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
};

// Get color based on system load
export const getSystemColor = (level: number): string => {
  if (level < 30) return '#77C17E';
  if (level < 70) return '#F7D154';
  return '#EA384C';
};

// Calculate average load for each system
export const getSystemAverages = (systemLoads: Record<string, { totalLoad: number, count: number }>): SystemLoad[] => {
  return Object.entries(systemLoads).map(([system, data]) => {
    return {
      name: getSystemDisplayName(system),
      value: Math.round(data.totalLoad / data.count),
      color: getSystemColor(Math.round(data.totalLoad / data.count))
    };
  }).sort((a, b) => b.value - a.value);
};
