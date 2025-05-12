
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSystemColor } from '@/components/system-analysis/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type RecommendationType = {
  color: string;
  text: string;
  importance?: 'high' | 'medium' | 'low';
  explanation?: string;
  category?: string;
};

interface EnhancedRecommendationsCardProps {
  recommendations: RecommendationType[];
}

const EnhancedRecommendationsCard: React.FC<EnhancedRecommendationsCardProps> = ({ recommendations }) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("all");

  // Group recommendations by category
  const getCategories = () => {
    const categories = new Set(recommendations.map(r => r.category || 'Annet'));
    return ['all', ...Array.from(categories)];
  };

  const categories = getCategories();

  // Filter recommendations by category
  const filteredRecommendations = activeTab === 'all' 
    ? recommendations
    : recommendations.filter(r => r.category?.toLowerCase() === activeTab.toLowerCase());
  
  // Sort recommendations by importance
  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    const importancePriority = { high: 3, medium: 2, low: 1, undefined: 0 };
    return (importancePriority[b.importance || 'undefined'] || 0) - (importancePriority[a.importance || 'undefined'] || 0);
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper function to get appropriate styling for recommendation importance
  const getImportanceStyles = (importance?: 'high' | 'medium' | 'low') => {
    switch(importance) {
      case 'high':
        return 'border-red-200 bg-red-50/80';
      case 'medium':
        return 'border-amber-200 bg-amber-50/80';
      case 'low':
        return 'border-green-200 bg-green-50/80';
      default:
        return 'border-gray-200 bg-white/80';
    }
  };

  // Helper function for badge text
  const getImportanceText = (importance?: 'high' | 'medium' | 'low') => {
    switch(importance) {
      case 'high':
        return 'Høy prioritet';
      case 'medium':
        return 'Medium prioritet';
      case 'low':
        return 'Lav prioritet';
      default:
        return 'Generelt';
    }
  };

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
              <BadgeCheck size={18} className="text-[#9b87f5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-800">Anbefalte tiltak</h3>
          </motion.div>
          <motion.p className="text-sm text-gray-500" variants={itemVariants}>
            Spesifikke anbefalinger basert på dine funn:
          </motion.p>
        </CardHeader>
        
        <CardContent className="p-4">
          {categories.length > 2 && (
            <Tabs defaultValue="all" className="mb-4" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 h-auto p-1 bg-gray-100/70">
                <TabsTrigger 
                  value="all" 
                  className={`text-xs py-1.5 ${activeTab === 'all' ? 'font-medium' : ''}`}
                >
                  Alle
                </TabsTrigger>
                {categories.slice(1, 3).map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category} 
                    className={`text-xs py-1.5 ${activeTab === category ? 'font-medium' : ''}`}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          
          <div className="space-y-3">
            {sortedRecommendations.map((recommendation, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className={`border rounded-xl p-3.5 ${getImportanceStyles(recommendation.importance)}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {recommendation.category && (
                        <span className="text-xs px-2 py-0.5 bg-white/70 rounded-full border border-gray-100 shadow-sm">
                          {recommendation.category}
                        </span>
                      )}
                      {recommendation.importance && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          recommendation.importance === 'high' ? 'bg-red-100/80 text-red-700' :
                          recommendation.importance === 'medium' ? 'bg-amber-100/80 text-amber-700' :
                          'bg-green-100/80 text-green-700'
                        }`}>
                          {getImportanceText(recommendation.importance)}
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-sm text-gray-800">{recommendation.text}</p>
                    
                    {recommendation.explanation && (
                      <p className="mt-1.5 text-xs text-gray-600">
                        {recommendation.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredRecommendations.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">
                Ingen anbefalinger funnet for denne kategorien.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedRecommendationsCard;
