
import { HealthIssue } from '@/types/supabase';

// Get top health issues sorted by load (highest first)
export const getTopIssues = (healthIssues: HealthIssue[], count: number = 3): HealthIssue[] => {
  return [...healthIssues]
    .sort((a, b) => b.load - a.load)
    .slice(0, count);
};

// Generate a summary text based on coherence score and top issues
export const getSummaryText = (coherenceScore: number, topIssues: HealthIssue[]): string => {
  if (coherenceScore >= 70) {
    return "Din kropp viser god balanse. Fortsett med de gode vanene, og legg spesiell vekt på disse områdene for å opprettholde eller forbedre balansen.";
  } else if (coherenceScore >= 50) {
    return `Din kropp har moderat balanse med ${topIssues.length > 0 ? topIssues.length + ' ' : ''}identifiserte belastninger. Fokuser på disse områdene for å forbedre helheten.`;
  } else {
    return "Din kropp viser tegn på ubalanse og kan trenge oppmerksomhet. Følg anbefalingene under for å forbedre balansen.";
  }
};

// Get a primary body system to focus on
export const getPrimarySystemFocus = (healthIssues: HealthIssue[]) => {
  // Default systems if no health issues to analyze
  const systems = {
    'Nervesystem': { 
      count: 0, 
      load: 0, 
      color: 'bg-blue-50', 
      textColor: 'text-blue-500',
      icon: 'Brain'
    },
    'Fordøyelsessystem': { 
      count: 0, 
      load: 0, 
      color: 'bg-green-50', 
      textColor: 'text-green-500',
      icon: 'Salad'
    },
    'Muskler og ledd': { 
      count: 0, 
      load: 0, 
      color: 'bg-amber-50', 
      textColor: 'text-amber-500',
      icon: 'Activity'
    },
  };

  // Analyze health issues descriptions to map to body systems
  // This is a simple heuristic approach
  healthIssues.forEach(issue => {
    const description = issue.description.toLowerCase();
    
    if (description.includes('nerve') || 
        description.includes('hjerne') || 
        description.includes('nakke') ||
        description.includes('stress')) {
      systems['Nervesystem'].count++;
      systems['Nervesystem'].load += issue.load;
    } 
    else if (description.includes('tarm') || 
             description.includes('fordøyelse') || 
             description.includes('mage')) {
      systems['Fordøyelsessystem'].count++;
      systems['Fordøyelsessystem'].load += issue.load;
    }
    else {
      systems['Muskler og ledd'].count++;
      systems['Muskler og ledd'].load += issue.load;
    }
  });
  
  // Find the primary system based on combined load
  let primarySystem = 'Nervesystem';
  let maxLoad = 0;
  
  Object.entries(systems).forEach(([name, data]) => {
    if (data.load > maxLoad) {
      maxLoad = data.load;
      primarySystem = name;
    }
  });
  
  return { 
    name: primarySystem, 
    ...systems[primarySystem as keyof typeof systems]
  };
};

// Get main recommendation based on top issues
export const getMainRecommendation = (topIssues: HealthIssue[], healthIssues: HealthIssue[]): string => {
  if (topIssues.length > 0 && topIssues[0].recommendations && topIssues[0].recommendations.length > 0) {
    return topIssues[0].recommendations[0];
  }
  
  // Fallback recommendations based on body systems
  const primarySystem = getPrimarySystemFocus(healthIssues);
  
  switch (primarySystem.name) {
    case 'Nervesystem':
      return 'Praktiser daglig avspenningsøvelser og mindfulness for nervesystemet';
    case 'Fordøyelsessystem':
      return 'Inkluder fermentert mat og fiber i kosten for tarmbalanse';
    case 'Muskler og ledd':
      return 'Gjør regelmessige bevegelses- og styrkeøvelser for muskler og ledd';
    default:
      return 'Sørg for tilstrekkelig hvile og balansert kosthold';
  }
};

// Get secondary recommendation
export const getSecondaryRecommendation = (topIssues: HealthIssue[]): string | null => {
  if (topIssues.length > 1 && topIssues[1].recommendations && topIssues[1].recommendations.length > 0) {
    return topIssues[1].recommendations[0];
  }
  
  return null;
};
