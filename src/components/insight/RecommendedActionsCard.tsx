
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Info, CircleHelp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from '@/hooks/use-mobile';

interface Recommendation {
  color: string;
  text: string;
  importance?: 'high' | 'medium' | 'low';
  explanation?: string;
  category?: string;
}

interface RecommendedActionsCardProps {
  recommendations: Recommendation[];
}

// Group recommendations by category
const groupRecommendationsByCategory = (recommendations: Recommendation[]) => {
  const grouped: Record<string, Recommendation[]> = {};
  
  recommendations.forEach(rec => {
    const category = rec.category || 'Generelt';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(rec);
  });
  
  return grouped;
};

const RecommendedActionsCard: React.FC<RecommendedActionsCardProps> = ({ recommendations }) => {
  const navigate = useNavigate();
  const [completed, setCompleted] = React.useState<string[]>([]);
  const [openCategories, setOpenCategories] = React.useState<string[]>([]);
  const isMobile = useIsMobile();
  
  const groupedRecommendations = groupRecommendationsByCategory(recommendations);
  
  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  // Get all categories
  const categories = Object.keys(groupedRecommendations);
  
  // Default open the first category
  React.useEffect(() => {
    if (categories.length > 0 && openCategories.length === 0) {
      setOpenCategories([categories[0]]);
    }
  }, [categories]);
  
  const handleComplete = (text: string) => {
    setCompleted(prev => [...prev, text]);
    toast.success("Tiltak markert som fullført", {
      description: "Fortsett med de andre tiltakene for best resultat",
    });
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Get importance color
  const getImportanceColor = (importance?: 'high' | 'medium' | 'low') => {
    switch (importance) {
      case 'high': return 'bg-[#EA384C]';
      case 'medium': return 'bg-[#F7D154]';
      case 'low': return 'bg-[#77C17E]';
      default: return 'bg-[#9b87f5]';
    }
  };
  
  // Get category color
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Kosthold': 'bg-green-50 text-green-700',
      'Bevegelse': 'bg-blue-50 text-blue-700',
      'Søvn': 'bg-indigo-50 text-indigo-700',
      'Stress': 'bg-amber-50 text-amber-700',
      'Tilskudd': 'bg-purple-50 text-purple-700',
      'Generelt': 'bg-gray-50 text-gray-700'
    };
    
    return colors[category] || 'bg-gray-50 text-gray-700';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-5"
    >
      <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className={`${isMobile ? 'pb-0 p-4' : 'pb-0'}`}>
          <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-medium flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <span>Anbefalte tiltak</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CircleHelp className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-gray-400`} />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" side={isMobile ? "bottom" : "top"}>
                    <p className="text-sm">Tiltak som er tilpasset din situasjon basert på skanningen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "sm"}
              className={`${isMobile ? 'text-[10px] px-2 py-1 h-auto' : 'text-xs'} text-[#9b87f5] border-[#9b87f5]/20 hover:bg-[#9b87f5]/5`}
              onClick={() => navigate('/my-plan')}
            >
              Min plan
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className={`${isMobile ? 'pt-3 p-4' : 'pt-4'}`}>
          <motion.div variants={itemVariants} className="mb-3 sm:mb-4 flex flex-wrap gap-1 sm:gap-2">
            {categories.map((category) => (
              <Badge 
                key={category}
                variant="outline"
                className={`cursor-pointer text-xs ${openCategories.includes(category) 
                  ? getCategoryColor(category) 
                  : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </motion.div>
          
          <div className="space-y-3 sm:space-y-4">
            {categories.map((category) => (
              <Collapsible 
                key={category}
                open={openCategories.includes(category)}
                onOpenChange={() => toggleCategory(category)}
              >
                <CollapsibleTrigger className="w-full text-left mb-1.5 sm:mb-2">
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center gap-2"
                  >
                    <h3 className={`text-xs sm:text-sm font-medium ${openCategories.includes(category) ? 'text-[#9b87f5]' : 'text-gray-600'}`}>
                      {category}
                    </h3>
                    <div className={`h-px flex-1 ${openCategories.includes(category) ? 'bg-[#9b87f5]/20' : 'bg-gray-200'}`}></div>
                    <div className={`rounded-full p-0.5 ${openCategories.includes(category) ? 'bg-[#9b87f5]/10' : 'bg-gray-100'}`}>
                      {openCategories.includes(category) ? (
                        <CircleHelp className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-[#9b87f5]`} />
                      ) : (
                        <CircleHelp className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-gray-400`} />
                      )}
                    </div>
                  </motion.div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-2 sm:space-y-2.5 mb-3 sm:mb-4">
                  {groupedRecommendations[category].map((recommendation, index) => {
                    const isCompleted = completed.includes(recommendation.text);
                    const importanceColor = getImportanceColor(recommendation.importance);
                    
                    return (
                      <motion.div 
                        key={`${category}-${index}`}
                        variants={itemVariants}
                        whileHover={{ scale: isMobile ? 1 : 1.01 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className={`rounded-xl ${isCompleted ? 'bg-green-50/40 border-green-100' : 'bg-white border-gray-100'} shadow-sm border`}
                      >
                        <div className={`flex items-center gap-2 ${isMobile ? 'px-3 py-2.5' : 'px-4 py-3'}`}>
                          <div className={`flex-shrink-0 h-2 w-2 rounded-full ${isCompleted ? 'bg-green-500' : importanceColor}`}></div>
                          <span className={`${isMobile ? 'text-xs' : 'text-sm'} ${isCompleted ? 'text-green-700 line-through decoration-green-500/30' : 'text-gray-700'} leading-snug flex-1`}>
                            {recommendation.text}
                          </span>
                          
                          {recommendation.explanation && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} p-0 rounded-full`}
                                  >
                                    <Info size={isMobile ? 12 : 14} className="text-gray-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs" side={isMobile ? "bottom" : "top"}>
                                  <p className="text-xs">{recommendation.explanation}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          
                          {!isCompleted && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={`${isMobile ? 'h-6 text-[10px] px-2' : 'h-7 text-xs'} border-gray-200 hover:border-[#9b87f5] hover:text-[#9b87f5]`}
                              onClick={() => handleComplete(recommendation.text)}
                            >
                              Merk utført
                            </Button>
                          )}
                          
                          {isCompleted && (
                            <div className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} rounded-full bg-green-100/50 flex items-center justify-center`}>
                              <Check size={isMobile ? 12 : 14} className="text-green-600" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendedActionsCard;
