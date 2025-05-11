
import React, { useState, useEffect } from 'react';
import { Network } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SystemRelationshipDiagram from './SystemRelationshipDiagram';
import RelatedSystemCard from './RelatedSystemCard';
import { HealthSystemItem } from '@/services/healthSystemService';
import { HealthIssue } from '@/types/supabase';
import { SYSTEM_CATEGORIES, categorizeSystem } from '@/components/health/SystemCategories';

// Filter options
type FilterOption = 'all' | 'high-impact' | 'medium-impact' | 'low-impact';

interface RelatedSystemsTabProps {
  healthData: HealthSystemItem[];
  currentIssue?: HealthIssue;
}

const RelatedSystemsTab: React.FC<RelatedSystemsTabProps> = ({ 
  healthData,
  currentIssue 
}) => {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Group systems by category
  const systemsByCategory = healthData.reduce<Record<string, HealthSystemItem[]>>(
    (acc, system) => {
      const category = categorizeSystem(system.area);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(system);
      return acc;
    }, 
    {}
  );
  
  // Calculate impact level for a system based on the current issue
  // This is a placeholder - in a real app, you would have more sophisticated logic
  const getSystemImpactLevel = (system: HealthSystemItem): 'high' | 'medium' | 'low' => {
    const area = system.area.toLowerCase();
    
    // Connect to current issue if available
    if (currentIssue) {
      const issueName = currentIssue.name.toLowerCase();
      const issueDescription = currentIssue.description.toLowerCase();
      
      // Check for direct mentions in the current issue
      if (
        issueName.includes(area) || 
        issueDescription.includes(area) ||
        system.symptoms.toLowerCase().includes(issueName)
      ) {
        return 'high';
      }
      
      // Check for related terms - this could be expanded with more sophisticated mapping
      if (
        (issueName.includes('bakteriell') && (area.includes('tarm') || area.includes('immun'))) ||
        (issueName.includes('sopp') && (area.includes('tarm') || area.includes('immun'))) ||
        (issueName.includes('miljøgift') && (area.includes('avgift') || area.includes('lever')))
      ) {
        return 'high';
      }
    }
    
    // Generic logic for demo purposes
    if (area.includes('tarm') || area.includes('immun') || area.includes('fordøyelse')) {
      return 'high';
    } else if (area.includes('hormon') || area.includes('nerve')) {
      return 'medium';
    }
    
    return 'low';
  };
  
  // Filter systems based on selected filter
  const filterSystems = (systems: HealthSystemItem[]) => {
    if (filter === 'all') return systems;
    
    return systems.filter(system => {
      const impactLevel = getSystemImpactLevel(system);
      
      if (filter === 'high-impact' && impactLevel === 'high') return true;
      if (filter === 'medium-impact' && impactLevel === 'medium') return true;
      if (filter === 'low-impact' && impactLevel === 'low') return true;
      
      return false;
    });
  };
  
  // Get systems to display based on filters
  const getFilteredSystems = () => {
    if (activeCategory) {
      return filterSystems(systemsByCategory[activeCategory] || []);
    }
    return filterSystems(healthData);
  };
  
  const filteredSystems = getFilteredSystems();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <>
      <Card className="mb-6 bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm border-none shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-[#9b87f5]/10">
              <Network size={18} className="text-[#9b87f5]" />
            </div>
            <CardTitle className="text-lg font-medium">Sammenhenger mellom systemer</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Dette helseproblemet påvirker flere systemer i kroppen din. Se hvordan de henger sammen.
          </p>
        </CardHeader>
        <CardContent>
          <SystemRelationshipDiagram 
            systems={healthData} 
            currentIssue={currentIssue} 
            getSystemImpact={getSystemImpactLevel}
          />
        </CardContent>
      </Card>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Relaterte systemer</h2>
            <p className="text-sm text-gray-600">
              {filteredSystems.length} systemer med potensiell sammenheng til ditt helseproblem
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? "bg-[#9b87f5] hover:bg-[#8b76f0]" : ""}
            >
              Alle
            </Button>
            <Button 
              variant={filter === 'high-impact' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('high-impact')}
              className={filter === 'high-impact' ? "bg-[#EA384C] hover:bg-red-600" : ""}
            >
              Høy
            </Button>
            <Button 
              variant={filter === 'medium-impact' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('medium-impact')}
              className={filter === 'medium-impact' ? "bg-[#F7D154] hover:bg-amber-500 text-gray-800" : ""}
            >
              Medium
            </Button>
            <Button 
              variant={filter === 'low-impact' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('low-impact')}
              className={filter === 'low-impact' ? "bg-[#77C17E] hover:bg-green-600" : ""}
            >
              Lav
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge 
            variant="outline" 
            className={`bg-white/50 hover:bg-white/80 cursor-pointer ${!activeCategory ? 'border-[#9b87f5] text-[#9b87f5]' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            Alle kategorier
          </Badge>
          {Object.keys(systemsByCategory).map(category => (
            <Badge 
              key={category}
              variant="outline" 
              className={`bg-white/50 hover:bg-white/80 cursor-pointer ${activeCategory === category ? 'border-[#9b87f5] text-[#9b87f5]' : ''}`}
              onClick={() => setActiveCategory(prev => prev === category ? null : category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      <motion.div 
        className="grid gap-4 grid-cols-1 sm:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredSystems.map((system, index) => (
          <motion.div 
            key={`${system.id}-${index}`}
            variants={itemVariants}
          >
            <RelatedSystemCard 
              system={system} 
              impactLevel={getSystemImpactLevel(system)} 
            />
          </motion.div>
        ))}
        
        {filteredSystems.length === 0 && (
          <motion.div 
            className="col-span-2 py-8 px-4 text-center bg-gray-50/50 rounded-lg"
            variants={itemVariants}
          >
            <p className="text-gray-500">
              Ingen systemer funnet med de valgte filtrene. Prøv et annet filter.
            </p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default RelatedSystemsTab;
