
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HealthSystemCard from './HealthSystemCard';

interface HealthInfoItem {
  area: string;
  symptoms: string;
  causes: string;
  recommendations: string;
}

interface HealthSystemCardsProps {
  title?: string;
  description?: string;
  healthData: HealthInfoItem[];
}

// Function to get all unique system categories
const getSystemCategories = (data: HealthInfoItem[]): string[] => {
  const systemTypes = new Set<string>();
  
  // Add "Alle" option
  systemTypes.add("Alle");
  
  // Get categories based on the first word of each area
  data.forEach(item => {
    const firstWord = item.area.split(' ')[0];
    if (firstWord && firstWord.length > 2) {  // Ignore very short words
      systemTypes.add(firstWord);
    }
  });
  
  return Array.from(systemTypes);
};

const HealthSystemCards: React.FC<HealthSystemCardsProps> = ({ 
  title = "Detaljert helseinformasjon", 
  description,
  healthData 
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? healthData : healthData.slice(0, 3);
  const systemCategories = getSystemCategories(healthData);
  const [activeTab, setActiveTab] = useState("Alle");
  
  const filteredItems = activeTab === "Alle" 
    ? visibleItems 
    : visibleItems.filter(item => item.area.startsWith(activeTab));
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      } 
    }
  };
  
  return (
    <Card className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm border-none shadow-lg mb-8 overflow-hidden">
      <CardHeader className="pb-2 border-b border-gray-100/40">
        <CardTitle className="text-xl font-playfair">{title}</CardTitle>
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
      </CardHeader>
      <CardContent className="p-4">
        {/* System filter tabs */}
        <div className="mb-4 overflow-x-auto pb-1 scrollbar-none">
          <Tabs defaultValue="Alle" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white/50 border border-white/60 h-9">
              {systemCategories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm px-3 py-1.5 text-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-3">
              <motion.div 
                className="grid gap-4 sm:grid-cols-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredItems.map((item, index) => (
                  <HealthSystemCard 
                    key={`${item.area}-${index}`}
                    area={item.area}
                    symptoms={item.symptoms}
                    causes={item.causes}
                    recommendations={item.recommendations}
                    index={index}
                  />
                ))}
                
                {filteredItems.length === 0 && (
                  <p className="text-center py-6 text-gray-500">
                    Ingen data tilgjengelig for denne kategorien.
                  </p>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Show more/less button */}
        {healthData.length > 3 && (
          <div className="flex justify-center pt-3 border-t border-gray-100/40 bg-white/30 mt-2">
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <span>{expanded ? 'Vis mindre' : 'Vis mer'}</span>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${expanded ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthSystemCards;
