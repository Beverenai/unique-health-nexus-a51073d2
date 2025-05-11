import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHealthSystems, HealthSystemItem } from '@/services/healthSystemService';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import SystemIcon from '@/components/health/SystemIcon';
import { groupSystemsByCategory, SYSTEM_CATEGORIES } from '@/components/health/SystemCategories';
import HealthSystemCard from '@/components/health/HealthSystemCard';

const HealthSystemDetail = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthSystems, setHealthSystems] = useState<HealthSystemItem[]>([]);
  const [categorizedSystems, setCategorizedSystems] = useState<{[key: string]: HealthSystemItem[]}>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSystemIndex, setSelectedSystemIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getHealthSystems();
        setHealthSystems(result);
        
        // Group systems by category
        const grouped = groupSystemsByCategory(result);
        setCategorizedSystems(grouped);
        
        // Determine which category to select based on systemId param
        if (systemId) {
          const categoryIndex = parseInt(systemId, 10);
          const categoryKeys = Object.keys(grouped);
          if (categoryKeys[categoryIndex]) {
            setSelectedCategory(categoryKeys[categoryIndex]);
          } else {
            // If invalid index, select first category
            setSelectedCategory(categoryKeys[0] || '');
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching health systems:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [systemId]);
  
  const handleBack = () => {
    if (selectedSystemIndex !== null) {
      // If a specific system is selected, go back to category view
      setSelectedSystemIndex(null);
    } else {
      // Otherwise go back to insights page
      navigate('/insights');
    }
  };
  
  const handleSystemClick = (index: number) => {
    setSelectedSystemIndex(index);
  };
  
  const getBgGradient = (category: string): string => {
    switch(category) {
      case SYSTEM_CATEGORIES.DIGESTIVE:
        return 'from-green-50/30 to-green-100/10';
      case SYSTEM_CATEGORIES.NERVOUS:
        return 'from-blue-50/30 to-blue-100/10';
      case SYSTEM_CATEGORIES.HORMONAL:
        return 'from-purple-50/30 to-purple-100/10';
      case SYSTEM_CATEGORIES.MUSCULOSKELETAL:
        return 'from-amber-50/30 to-amber-100/10';
      case SYSTEM_CATEGORIES.IMMUNE:
        return 'from-rose-50/30 to-rose-100/10';
      default:
        return 'from-gray-50/30 to-gray-100/10';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5]"></div>
      </div>
    );
  }
  
  const systems = selectedCategory ? categorizedSystems[selectedCategory] || [] : [];
  const system = selectedSystemIndex !== null ? systems[selectedSystemIndex] : null;
  
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <ScrollArea className="h-full">
        <div className="container max-w-md mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack} 
            className="mb-4 pl-0 hover:pl-1 transition-all"
          >
            <ArrowLeft size={16} className="mr-1" /> Tilbake
          </Button>
          
          {/* Header showing selected category or system */}
          <div className="mb-6">
            <h1 className="text-2xl font-medium mb-1">
              {system ? system.area : selectedCategory}
            </h1>
            <p className="text-gray-500 text-sm">
              {system 
                ? "Detaljert informasjon om dette systemet" 
                : `${systems.length} systemer i denne kategorien`}
            </p>
          </div>
          
          {/* Background gradient based on category */}
          <div className={`fixed inset-0 -z-10 bg-gradient-to-br ${getBgGradient(selectedCategory)}`} />
          
          {/* Show either system list or specific system details */}
          {selectedSystemIndex === null ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Velg et system nedenfor for å se mer detaljert informasjon om symptomer, 
                årsaker og anbefalte tiltak for dette systemet.
              </p>
              
              {systems.map((system, index) => (
                <div
                  key={`${system.area}-${index}`}
                  onClick={() => handleSystemClick(index)}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40 cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <SystemIcon name={system.area} size={20} />
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-800">{system.area}</h2>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {system.symptoms.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            system && (
              <HealthSystemCard
                area={system.area}
                symptoms={system.symptoms}
                causes={system.causes}
                recommendations={system.recommendations}
                index={selectedSystemIndex}
              />
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HealthSystemDetail;
