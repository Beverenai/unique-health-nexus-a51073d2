
import { HealthIssue } from '@/types/supabase';
import { getStatusText } from '@/components/insight/SystemCard';
import { getBodyStateDescription } from '@/utils/coherenceUtils';

// Find top issues for focus
export const getTopIssues = (healthIssues: HealthIssue[], limit = 2) => {
  return [...healthIssues].sort((a, b) => b.load - a.load).slice(0, limit);
};

// Determine primary body system focus
export const getPrimarySystemFocus = (healthIssues: HealthIssue[]) => {
  const hasTarmIssue = healthIssues.some(issue => 
    issue.name.toLowerCase().includes('tarm') || 
    issue.description.toLowerCase().includes('tarm'));
  
  const hasHormoneIssue = healthIssues.some(issue => 
    issue.name.toLowerCase().includes('hormon') || 
    issue.description.toLowerCase().includes('hormon'));
    
  const hasMuscleIssue = healthIssues.some(issue => 
    issue.name.toLowerCase().includes('kompresjon') || 
    issue.name.toLowerCase().includes('nakke') || 
    issue.description.toLowerCase().includes('muskel'));
    
  const hasNutrientIssue = healthIssues.some(issue => 
    issue.name.toLowerCase().includes('vitamin') || 
    issue.name.toLowerCase().includes('mineral') || 
    issue.description.toLowerCase().includes('mangel'));

  if (hasTarmIssue) {
    return {
      name: 'Fordøyelsessystemet',
      icon: 'Salad',
      color: 'bg-emerald-50',
      textColor: 'text-emerald-500'
    };
  }
  if (hasHormoneIssue) {
    return {
      name: 'Hormonsystemet',
      icon: 'Activity',
      color: 'bg-purple-50',
      textColor: 'text-purple-500'
    };
  }
  if (hasMuscleIssue) {
    return {
      name: 'Muskel og skjelett',
      icon: 'Activity',
      color: 'bg-amber-50',
      textColor: 'text-amber-500'
    };
  }
  if (hasNutrientIssue) {
    return {
      name: 'Ernæring',
      icon: 'Salad',
      color: 'bg-green-50',
      textColor: 'text-green-500'
    };
  }
  
  return {
    name: 'Nervesystemet',
    icon: 'Brain',
    color: 'bg-blue-50',
    textColor: 'text-blue-500'
  };
};

// Generate summary based on coherence score and issues
export const getSummaryText = (coherenceScore: number, topIssues: HealthIssue[]) => {
  const baseText = `Kroppen din er i en tilstand av ${getBodyStateDescription(coherenceScore).toLowerCase()}.`;
  
  if (topIssues.length > 0) {
    return `${baseText} Hovedfokus bør være på ${topIssues[0].name.toLowerCase()}.`;
  }
  
  return `${baseText} Det er ingen betydelige belastninger å fokusere på nå.`;
};

// Find main recommended action
export const getMainRecommendation = (topIssues: HealthIssue[], healthIssues: HealthIssue[]) => {
  if (topIssues.length === 0) return 'Fortsett med gode vaner for å opprettholde balansen';
  
  const hasTarmIssue = healthIssues.some(issue => 
    issue.name.toLowerCase().includes('tarm') || 
    issue.description.toLowerCase().includes('tarm'));
  
  const hasHormoneIssue = healthIssues.some(issue => 
    issue.name.toLowerCase().includes('hormon') || 
    issue.description.toLowerCase().includes('hormon'));
    
  const hasMuscleIssue = healthIssues.some(issue => 
    issue.name.toLowerCase().includes('kompresjon') || 
    issue.name.toLowerCase().includes('nakke') || 
    issue.description.toLowerCase().includes('muskel'));
    
  const hasNutrientIssue = healthIssues.some(issue => 
    issue.name.toLowerCase().includes('vitamin') || 
    issue.name.toLowerCase().includes('mineral') || 
    issue.description.toLowerCase().includes('mangel'));
  
  if (hasTarmIssue) {
    return 'Fokuser på tarmflora med mat som inneholder probiotika og prebiotika';
  }
  if (hasHormoneIssue) {
    return 'Reduser stress og prioriter regelmessig døgnrytme';
  }
  if (hasMuscleIssue) {
    return 'Vurder fysioterapi eller kiropraktikk for å forbedre kroppsstruktur';
  }
  if (hasNutrientIssue) {
    return 'Vurder kosttilskudd og juster kostholdet for bedre næringsinntak';
  }
  
  return topIssues[0]?.recommendations?.[0] || 'Se detaljerte anbefalinger for hvert helseproblem';
};

// Get secondary recommendation
export const getSecondaryRecommendation = (topIssues: HealthIssue[]) => {
  if (topIssues.length < 2) return null;
  return topIssues[1]?.recommendations?.[0] || null;
};
