
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User, Stethoscope } from 'lucide-react';
import { HealthIssue } from '@/types/supabase';
import { getSystemColor } from '@/components/system-analysis/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SpecialistRecommendation {
  specialistType: string;
  focus: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  relevantIssues: string[];
  benefitAreas: string[];
}

interface SpecialistRecommendationsCardProps {
  healthIssues: HealthIssue[];
}

const SpecialistRecommendationsCard: React.FC<SpecialistRecommendationsCardProps> = ({ healthIssues }) => {
  // Generate specialist recommendations based on the health issues
  const generateRecommendations = (issues: HealthIssue[]): SpecialistRecommendation[] => {
    const recommendations: SpecialistRecommendation[] = [];
    
    const highLoadIssues = issues.filter(issue => issue.load > 65);
    const mediumLoadIssues = issues.filter(issue => issue.load <= 65 && issue.load > 40);
    
    // Check for musculoskeletal issues
    const musculoskeletalIssues = issues.filter(issue => 
      issue.name.toLowerCase().includes('nakke') || 
      issue.name.toLowerCase().includes('rygg') || 
      issue.name.toLowerCase().includes('muskel') ||
      issue.name.toLowerCase().includes('ledd') ||
      issue.description.toLowerCase().includes('kompresjon')
    );
    
    if (musculoskeletalIssues.length > 0) {
      const highestIssue = musculoskeletalIssues.sort((a, b) => b.load - a.load)[0];
      const isNeckRelated = highestIssue.name.toLowerCase().includes('nakke') || 
                           highestIssue.description.toLowerCase().includes('nakke');
      
      recommendations.push({
        specialistType: 'Osteopat',
        focus: isNeckRelated ? 'C3-C5 området' : 'Lumbalcolumna og bekken',
        description: isNeckRelated 
          ? 'Fokus på nakkemobilitet, spesielt C3-C5 virvlene som kan påvirke nervesignaler.'
          : 'Vurdering av ryggsøylen og bekkenstabilitet for å redusere kompresjon.',
        priority: highestIssue.load > 65 ? 'high' : 'medium',
        relevantIssues: musculoskeletalIssues.map(i => i.name),
        benefitAreas: ['Redusert smerte', 'Bedre mobilitet', 'Bedre nervefunksjon']
      });
    }
    
    // Check for digestive issues
    const digestiveIssues = issues.filter(issue => 
      issue.name.toLowerCase().includes('tarm') || 
      issue.name.toLowerCase().includes('fordøy') || 
      issue.name.toLowerCase().includes('bakterie') ||
      issue.description.toLowerCase().includes('tarm')
    );
    
    if (digestiveIssues.length > 0) {
      recommendations.push({
        specialistType: 'Funksjonsmedisinsk terapeut',
        focus: 'Tarmflora og matintoleranser',
        description: 'Omfattende vurdering av tarmflorabalanse og matintoleranser, med fokus på å gjenopprette sunne bakteriekulturer.',
        priority: digestiveIssues.some(i => i.load > 65) ? 'high' : 'medium',
        relevantIssues: digestiveIssues.map(i => i.name),
        benefitAreas: ['Forbedret fordøyelse', 'Redusert betennelse', 'Bedre næringsopptak']
      });
    }
    
    // Check for hormone issues
    const hormoneIssues = issues.filter(issue => 
      issue.name.toLowerCase().includes('hormon') || 
      issue.name.toLowerCase().includes('thyroid') || 
      issue.description.toLowerCase().includes('cortisol')
    );
    
    if (hormoneIssues.length > 0) {
      recommendations.push({
        specialistType: 'Endokrinolog',
        focus: 'Hormonbalanse',
        description: 'Komplett hormonprofil med fokus på stresshormoner og thyroidfunksjon.',
        priority: hormoneIssues.some(i => i.load > 60) ? 'high' : 'medium',
        relevantIssues: hormoneIssues.map(i => i.name),
        benefitAreas: ['Bedre energi', 'Forbedret søvn', 'Bedre stresshåndtering']
      });
    }
    
    // Add general health practitioner if there are multiple high load issues
    if (highLoadIssues.length > 2) {
      recommendations.push({
        specialistType: 'Integrativ lege',
        focus: 'Helhetlig vurdering',
        description: 'Koordinere behandling mellom spesialister og sikre en helhetlig tilnærming til helseutfordringene.',
        priority: 'high',
        relevantIssues: highLoadIssues.map(i => i.name),
        benefitAreas: ['Koordinert behandling', 'Helhetsperspektiv', 'Grunnleggende blodprøver']
      });
    }
    
    return recommendations;
  };
  
  const recommendations = generateRecommendations(healthIssues);
  const [openItems, setOpenItems] = useState<string[]>([]);
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      } 
    }
  };

  // Priority styling
  const getPriorityStyle = (priority: 'high' | 'medium' | 'low') => {
    switch(priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  
  if (recommendations.length === 0) return null;
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="mb-5 bg-white/80 backdrop-blur-xl border-white/20 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <motion.div className="flex items-center gap-2 mb-1" variants={itemVariants}>
            <div className="bg-[#9b87f5]/10 p-1.5 sm:p-2 rounded-full">
              <Stethoscope size={18} className="text-[#9b87f5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-800">Spesialistanbefalinger</h3>
          </motion.div>
          <motion.p className="text-sm text-gray-500" variants={itemVariants}>
            Basert på skanneresultatene dine anbefaler vi følgende spesialister:
          </motion.p>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            {recommendations.map((rec, index) => {
              const id = `specialist-${index}`;
              const isOpen = openItems.includes(id);
              
              return (
                <motion.div 
                  key={id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100/40"
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                >
                  <Collapsible open={isOpen} onOpenChange={() => toggleItem(id)}>
                    <CollapsibleTrigger className="w-full text-left p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#9b87f5]/10 p-2 rounded-full">
                          <User size={16} className="text-[#9b87f5]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{rec.specialistType}</h4>
                          <p className="text-xs text-gray-500">Fokus: {rec.focus}</p>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getPriorityStyle(rec.priority)}`}>
                        {rec.priority === 'high' ? 'Høy prioritet' : 
                         rec.priority === 'medium' ? 'Medium prioritet' : 'Lav prioritet'}
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="px-4 pb-4">
                        <div className="bg-gray-50/80 rounded-lg p-3">
                          <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                          
                          {rec.relevantIssues.length > 0 && (
                            <div className="mb-2">
                              <p className="text-xs font-medium text-gray-700">Relevante funn:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {rec.relevantIssues.map((issue, i) => (
                                  <span 
                                    key={i} 
                                    className="text-xs bg-white px-2 py-1 rounded-full shadow-sm border border-gray-100"
                                  >
                                    {issue}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {rec.benefitAreas.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-gray-700">Fordeler:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {rec.benefitAreas.map((benefit, i) => (
                                  <span 
                                    key={i} 
                                    className="text-xs bg-[#9b87f5]/5 px-2 py-1 rounded-full text-[#9b87f5] shadow-sm"
                                  >
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SpecialistRecommendationsCard;
