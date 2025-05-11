
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HealthSystemCard from './HealthSystemCard';
import SystemCategories from './SystemCategories';
import { HealthSystemItem } from '@/services/healthSystemService';

interface HealthSystemCardsProps {
  title?: string;
  description?: string;
  healthData: HealthSystemItem[];
}

const HealthSystemCards: React.FC<HealthSystemCardsProps> = ({ 
  title = "Kroppssystemer og balanse", 
  description,
  healthData 
}) => {
  const [view, setView] = useState<'categories' | 'systems'>('categories');
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  
  const handleSystemSelect = (index: number) => {
    setSelectedSystem(index);
    setView('systems');
  };
  
  const handleBack = () => {
    setView('categories');
    setSelectedSystem(null);
  };
  
  return (
    <Card className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm border-none shadow-lg mb-8">
      <CardHeader className="pb-2 border-b border-gray-100/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-medium">{title}</CardTitle>
          
          {view === 'systems' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[#9b87f5] flex items-center"
              onClick={handleBack}
            >
              ← Tilbake til kategorier
            </motion.button>
          )}
        </div>
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {view === 'categories' ? (
            <SystemCategories 
              healthData={healthData} 
              onSelectSystem={handleSystemSelect} 
            />
          ) : (
            <div>
              {selectedSystem !== null && (
                <HealthSystemCard 
                  area={healthData[selectedSystem].area}
                  symptoms={healthData[selectedSystem].symptoms}
                  causes={healthData[selectedSystem].causes}
                  recommendations={healthData[selectedSystem].recommendations}
                  index={selectedSystem}
                />
              )}
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default HealthSystemCards;
