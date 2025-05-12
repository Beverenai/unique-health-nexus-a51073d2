
import React, { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingState from '@/components/dashboard/LoadingState';
import ErrorState from '@/components/dashboard/ErrorState';
import AccordionSection from '@/components/dashboard/AccordionSection';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Check, CalendarDays, ListChecks, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Dashboard: React.FC = () => {
  const { recommendations, latestCheckin, isLoading, error, handleCompleteRecommendation, refetch } = useDashboardData();
  
  // State for accordion sections
  const [openSection, setOpenSection] = useState<string | null>('checkup');
  
  const handleSectionToggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState error={error} refetch={refetch} />;
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-md mx-auto px-4 pt-6">
        <DashboardHeader />
        
        {/* Latest Health Check-up Results */}
        <AccordionSection 
          title="Siste helsesjekk" 
          value="checkup" 
          isOpen={openSection === 'checkup'}
          onToggle={handleSectionToggle}
        >
          {latestCheckin ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {format(new Date(latestCheckin.date), 'PPP', { locale: nb })}
                  </span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Fullført
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Humør</span>
                    <span className="text-sm text-gray-600">{latestCheckin.mood}/10</span>
                  </div>
                  <Progress value={latestCheckin.mood * 10} className="h-2 bg-gray-100" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Energinivå</span>
                    <span className="text-sm text-gray-600">{latestCheckin.energy_level}/10</span>
                  </div>
                  <Progress value={latestCheckin.energy_level * 10} className="h-2 bg-gray-100" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Søvnkvalitet</span>
                    <span className="text-sm text-gray-600">{latestCheckin.sleep_quality}/10</span>
                  </div>
                  <Progress value={latestCheckin.sleep_quality * 10} className="h-2 bg-gray-100" />
                </div>
                
                {latestCheckin.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{latestCheckin.notes}</p>
                  </div>
                )}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/check-in'}
              >
                Ny helsesjekk
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Du har ikke gjennomført noen helsesjekk ennå.</p>
              <Button 
                onClick={() => window.location.href = '/check-in'}
              >
                Gjennomfør helsesjekk
              </Button>
            </div>
          )}
        </AccordionSection>
        
        {/* Recommended Actions */}
        <AccordionSection 
          title="Anbefalte tiltak" 
          value="recommendations" 
          isOpen={openSection === 'recommendations'}
          onToggle={handleSectionToggle}
        >
          {recommendations && recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((recommendation) => (
                <div 
                  key={recommendation.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 flex items-start gap-4"
                >
                  <div className="flex-1">
                    <p className="text-sm">{recommendation.text}</p>
                    
                    <div className="flex items-center mt-2">
                      <Badge variant={recommendation.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                        {recommendation.priority === 'high' ? 'Høy prioritet' : 'Normal prioritet'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-green-600"
                    onClick={() => handleCompleteRecommendation(recommendation.id)}
                  >
                    <Check size={16} />
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/my-plan'}
              >
                Se full helseplan
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Ingen aktive anbefalinger for øyeblikket.</p>
              <Button 
                onClick={() => window.location.href = '/my-plan'}
              >
                Se helseplan
              </Button>
            </div>
          )}
        </AccordionSection>
        
        {/* Activity Overview (Simplified) */}
        <AccordionSection 
          title="Aktivitetsoversikt" 
          value="activity" 
          isOpen={openSection === 'activity'}
          onToggle={handleSectionToggle}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                <Activity size={18} className="text-purple-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Registrer aktivitet</h4>
                <p className="text-xs text-gray-500">
                  Hold oversikt over trening og daglig aktivitet
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <ListChecks size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Fullfør tiltak</h4>
                <p className="text-xs text-gray-500">
                  Gjennomfør anbefalte tiltak fra helseplanen din
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
            >
              Se aktivitetslogg
            </Button>
          </div>
        </AccordionSection>
      </div>
    </div>
  );
};

export default Dashboard;
