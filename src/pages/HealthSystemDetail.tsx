
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { getHealthSystems, HealthSystemItem } from '@/services/healthSystemService';
import SystemIcon from '@/components/health/SystemIcon';
import { motion } from 'framer-motion';

const HealthSystemDetail: React.FC = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const [systemData, setSystemData] = useState<HealthSystemItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemData = async () => {
      setLoading(true);
      try {
        const allSystems = await getHealthSystems();
        const index = parseInt(systemId || '0', 10);
        
        if (!isNaN(index) && index >= 0 && index < allSystems.length) {
          setSystemData(allSystems[index]);
        }
      } catch (error) {
        console.error('Error fetching system data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemData();
  }, [systemId]);

  // Determine background color based on system type
  const getBgGradient = (area: string = ''): string => {
    const areaLower = area.toLowerCase();
    
    if (areaLower.includes('tarm') || areaLower.includes('fordøyelse')) {
      return 'from-green-50 to-green-100/50';
    } else if (areaLower.includes('lymfe')) {
      return 'from-blue-50 to-blue-100/50';
    } else if (areaLower.includes('nakke') || areaLower.includes('rygg')) {
      return 'from-amber-50 to-amber-100/50';
    } else if (areaLower.includes('oksidativ') || areaLower.includes('stress')) {
      return 'from-rose-50 to-rose-100/50';
    } else if (areaLower.includes('energi') || areaLower.includes('mitokondri') || areaLower.includes('celle')) {
      return 'from-yellow-50 to-yellow-100/50';
    } else if (areaLower.includes('hormon')) {
      return 'from-purple-50 to-purple-100/50';
    } else if (areaLower.includes('immun') || areaLower.includes('blod')) {
      return 'from-indigo-50 to-indigo-100/50';
    } else if (areaLower.includes('hud') || areaLower.includes('bindevev')) {
      return 'from-orange-50 to-orange-100/50';
    } else if (areaLower.includes('avgiftning') || areaLower.includes('lever')) {
      return 'from-emerald-50 to-emerald-100/50';
    } else if (areaLower.includes('psykisk') || areaLower.includes('følelse')) {
      return 'from-sky-50 to-sky-100/50';
    } else {
      return 'from-gray-50 to-gray-100/50';
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <ScrollArea className="h-full pb-16">
        <main className="container max-w-lg mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 pl-0 flex items-center text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            Tilbake
          </Button>

          {loading ? (
            <p className="text-center py-12">Laster informasjon...</p>
          ) : !systemData ? (
            <p className="text-center py-12">Fant ikke systemet.</p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className={`bg-gradient-to-br ${getBgGradient(systemData.area)} backdrop-blur-sm border-none shadow-lg mb-8`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/80 p-2.5 rounded-full shadow-sm">
                      <SystemIcon name={systemData.area} size={28} />
                    </div>
                    <h1 className="text-2xl font-medium">{systemData.area}</h1>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-medium mb-2">Tegn i kroppen</h2>
                      <p className="text-gray-700">{systemData.symptoms}</p>
                    </div>

                    <div>
                      <h2 className="text-lg font-medium mb-2">Mulige årsaker</h2>
                      <p className="text-gray-700">{systemData.causes}</p>
                    </div>

                    <div>
                      <h2 className="text-lg font-medium mb-2">Anbefalte tiltak</h2>
                      <div className="p-4 bg-white/50 rounded-lg border border-gray-100/40 shadow-sm">
                        <p className="text-gray-700">{systemData.recommendations}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related systems could be added here */}
            </motion.div>
          )}
        </main>
      </ScrollArea>
    </div>
  );
};

export default HealthSystemDetail;
