
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Heart, Lightbulb, Activity, Salad } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HealthIssue } from '@/types/supabase';
import { useNavigate } from 'react-router-dom';
import { getStatusText } from '@/components/insight/SystemCard';

interface BodyFocusSummaryProps {
  coherenceScore: number;
  healthIssues: HealthIssue[];
}

const BodyFocusSummary: React.FC<BodyFocusSummaryProps> = ({ coherenceScore, healthIssues }) => {
  const navigate = useNavigate();
  
  // Find top issues for focus
  const topIssues = [...healthIssues].sort((a, b) => b.load - a.load).slice(0, 2);
  
  // Determine overall body focus areas
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

  // Get primary body system focus
  const getPrimarySystemFocus = () => {
    if (hasTarmIssue) {
      return {
        name: 'Fordøyelsessystemet',
        icon: <Salad className="h-5 w-5 text-emerald-500" />,
        color: 'bg-emerald-50'
      };
    }
    if (hasHormoneIssue) {
      return {
        name: 'Hormonsystemet',
        icon: <Activity className="h-5 w-5 text-purple-500" />,
        color: 'bg-purple-50'
      };
    }
    if (hasMuscleIssue) {
      return {
        name: 'Muskel og skjelett',
        icon: <Activity className="h-5 w-5 text-amber-500" />,
        color: 'bg-amber-50'
      };
    }
    if (hasNutrientIssue) {
      return {
        name: 'Ernæring',
        icon: <Salad className="h-5 w-5 text-green-500" />,
        color: 'bg-green-50'
      };
    }
    
    return {
      name: 'Nervesystemet',
      icon: <Brain className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-50'
    };
  };
  
  const primarySystem = getPrimarySystemFocus();
  
  // Generate summary based on coherence score and issues
  const getSummaryText = () => {
    if (coherenceScore > 75) {
      return 'Kroppen din er hovedsakelig i balanse. Fokuser på vedlikehold.';
    } else if (coherenceScore > 60) {
      return 'Kroppen jobber med noen belastninger. Fokuser på støtte til disse systemene.';
    } else if (coherenceScore > 40) {
      return 'Kroppen håndterer moderate belastninger. Prioriter støtte til de mest belastede systemene.';
    } else {
      return 'Kroppen opplever flere belastninger. Målrettet støtte til hovedsystemene anbefales.';
    }
  };
  
  // Find main recommended action
  const getMainRecommendation = () => {
    if (topIssues.length === 0) return 'Fortsett med gode vaner for å opprettholde balansen';
    
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
    
    return topIssues[0].recommendations?.[0] || 'Se detaljerte anbefalinger for hvert helseproblem';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#9b87f5]/10 p-2 rounded-full">
              <Lightbulb size={20} className="text-[#9b87f5]" />
            </div>
            <h3 className="text-lg font-medium">Kroppens fokusområder</h3>
          </div>
          
          <p className="text-gray-700 mb-5 text-sm">
            {getSummaryText()}
          </p>
          
          <div className="mb-5 space-y-3">
            <div className="text-xs font-medium uppercase text-gray-500 mb-1">
              Hovedfokus bør være på
            </div>
            
            <div className={`${primarySystem.color} rounded-lg p-3 flex items-start gap-3`}>
              <div className="bg-white rounded-full p-1.5 shadow-sm">
                {primarySystem.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{primarySystem.name}</h4>
                <p className="text-sm text-gray-600 mt-0.5">
                  {topIssues.length > 0 
                    ? `Relatert til ${topIssues[0].name.toLowerCase()}`
                    : 'Generell balanse og vedlikehold'}
                </p>
              </div>
            </div>
            
            {topIssues.length > 0 && (
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase text-gray-500">
                    Høyeste belastninger
                  </span>
                </div>
                
                {topIssues.map((issue) => {
                  const { text: statusText, color: statusColor } = getStatusText(issue.load);
                  return (
                    <div 
                      key={issue.id}
                      className="bg-gray-50 rounded-lg p-3 mb-2 border border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{issue.name}</span>
                        <span className={`${statusColor} text-xs`}>{issue.load}%</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {issue.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="mb-5">
            <div className="text-xs font-medium uppercase text-gray-500 mb-2">
              Hovedanbefaling
            </div>
            <Badge 
              variant="outline" 
              className="bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20 border-[#9b87f5]/20 text-sm py-1.5 px-3"
            >
              <Heart size={14} className="mr-1" /> {getMainRecommendation()}
            </Badge>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-2 border-gray-200 flex items-center justify-center"
            onClick={() => navigate('/insights')}
          >
            <span>Se fullstendig systemanalyse</span>
            <ArrowRight size={14} className="ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BodyFocusSummary;
