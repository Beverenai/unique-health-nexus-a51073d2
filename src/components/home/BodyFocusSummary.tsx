
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Heart, Lightbulb, Activity, Salad } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HealthIssue } from '@/types/supabase';
import { useNavigate } from 'react-router-dom';
import { getStatusText } from '@/components/insight/SystemCard';
import { getBodyStateDescription } from '@/utils/coherenceUtils';

interface BodyFocusSummaryProps {
  coherenceScore: number;
  healthIssues: HealthIssue[];
  className?: string;
}

const BodyFocusSummary: React.FC<BodyFocusSummaryProps> = ({ 
  coherenceScore, 
  healthIssues,
  className
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
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
  const secondarySystem = hasHormoneIssue && !hasTarmIssue ? 
    { name: 'Nervesystemet', icon: <Brain className="h-5 w-5 text-blue-500" /> } : 
    { name: 'Hormonsystemet', icon: <Activity className="h-5 w-5 text-purple-500" /> };
  
  // Generate summary based on coherence score and issues
  const getSummaryText = () => {
    return `Kroppen din er i en tilstand av ${getBodyStateDescription(coherenceScore).toLowerCase()}.`;
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
    
    return topIssues[0]?.recommendations?.[0] || 'Se detaljerte anbefalinger for hvert helseproblem';
  };
  
  // Get secondary recommendation
  const getSecondaryRecommendation = () => {
    if (topIssues.length < 2) return null;
    return topIssues[1]?.recommendations?.[0] || null;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl border-white/20 shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
            <div className="bg-[#9b87f5]/10 p-2 rounded-full">
              <Lightbulb size={20} className="text-[#9b87f5]" />
            </div>
            <h3 className="text-lg font-medium">Kroppens fokusområder</h3>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-gray-700 mb-5 text-sm">
            {getSummaryText()} {topIssues.length > 0 ? 
              `Hovedfokus bør være på ${topIssues[0].name.toLowerCase()}.` : 
              'Det er ingen betydelige belastninger å fokusere på nå.'}
          </motion.p>
          
          <div className="mb-5 space-y-3">
            <motion.div variants={itemVariants} className="text-xs font-medium uppercase text-gray-500 mb-1">
              Hovedfokus bør være på
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className={`${primarySystem.color} rounded-lg p-3 flex items-start gap-3 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-white/30 to-transparent" />
              
              <div className="bg-white rounded-full p-1.5 shadow-sm z-10">
                {primarySystem.icon}
              </div>
              <div className="z-10">
                <h4 className="font-medium text-gray-800">{primarySystem.name}</h4>
                <p className="text-sm text-gray-600 mt-0.5">
                  {topIssues.length > 0 
                    ? `Relatert til ${topIssues[0].name.toLowerCase()}`
                    : 'Generell balanse og vedlikehold'}
                </p>
              </div>
              
              {/* Visual connector */}
              {isExpanded && topIssues.length > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -bottom-8 left-1/2 w-px h-8 bg-gradient-to-b from-[#9b87f5]/40 to-transparent z-0"
                />
              )}
            </motion.div>
            
            {topIssues.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase text-gray-500">
                    Høyeste belastninger
                  </span>
                  
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="text-xs text-[#9b87f5] hover:text-[#7E69AB] transition-colors"
                  >
                    {isExpanded ? 'Vis mindre' : 'Vis mer'}
                  </button>
                </div>
                
                <div className="space-y-2">
                  {topIssues.slice(0, isExpanded ? undefined : 1).map((issue, index) => {
                    const { text: statusText, color: statusColor } = getStatusText(issue.load);
                    return (
                      <motion.div
                        key={issue.id}
                        className="bg-white/60 rounded-lg p-3 border border-gray-100/80 shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
                        onClick={() => navigate(`/issue/${issue.id}`)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: 0.1 * index, duration: 0.3 }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{issue.name}</span>
                          <span className={`${statusColor} text-xs font-medium px-1.5 py-0.5 rounded-full`}>
                            {issue.load}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {issue.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
          
          <motion.div variants={itemVariants} className="mb-5">
            <div className="text-xs font-medium uppercase text-gray-500 mb-2">
              Anbefalinger
            </div>
            <Badge 
              variant="outline" 
              className="mb-2 block bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20 border-[#9b87f5]/20 text-sm py-1.5 px-3"
            >
              <Heart size={14} className="mr-1" /> {getMainRecommendation()}
            </Badge>
            
            {getSecondaryRecommendation() && isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge 
                  variant="outline" 
                  className="block bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200 text-sm py-1.5 px-3"
                >
                  <Brain size={14} className="mr-1" /> {getSecondaryRecommendation()}
                </Badge>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              variant="outline" 
              className="w-full border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm hover:shadow transition-all"
              onClick={() => navigate('/insights')}
            >
              <span>Se fullstendig systemanalyse</span>
              <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BodyFocusSummary;
