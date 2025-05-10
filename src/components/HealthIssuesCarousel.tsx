
import React from 'react';
import { HealthIssue } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { getSystemData } from '@/components/insight/SystemCard';

interface HealthIssuesCarouselProps {
  healthIssues: HealthIssue[];
}

const HealthIssuesCarousel: React.FC<HealthIssuesCarouselProps> = ({ 
  healthIssues 
}) => {
  const navigate = useNavigate();
  
  const getProgressColor = (load: number): string => {
    if (load < 40) return 'bg-[#77C17E]';
    if (load < 60) return 'bg-[#F7D154]';
    return 'bg-[#EA384C]';
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Toppfunn</h2>
        <span className="text-xs px-2 py-1 bg-[#9b87f5]/10 text-[#9b87f5] font-medium rounded-full">
          {healthIssues.length} prioriterte
        </span>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {healthIssues.map(issue => {
            const { icon, bgColor } = getSystemData(issue.name, issue);
            
            return (
              <CarouselItem key={issue.id} className="md:basis-2/3 lg:basis-1/2">
                <div className="p-1">
                  <Card 
                    className={`p-4 ${bgColor} cursor-pointer hover:shadow-md transition-all`}
                    onClick={() => navigate(`/issue/${issue.id}`)}
                  >
                    <div className="flex items-center mb-2">
                      <div className="bg-white p-1.5 rounded-full shadow-sm">
                        {icon}
                      </div>
                      <span className="ml-2 font-medium">{issue.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-600">Belastning</span>
                      <span className="font-medium">{issue.load}%</span>
                    </div>
                    
                    <Progress 
                      value={issue.load} 
                      className={`h-1.5 rounded-full ${getProgressColor(issue.load)}`} 
                    />
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 h-8 w-8 bg-white/80 backdrop-blur-sm border border-gray-100/20" />
          <CarouselNext className="static translate-y-0 h-8 w-8 bg-white/80 backdrop-blur-sm border border-gray-100/20" />
        </div>
      </Carousel>
    </div>
  );
};

export default HealthIssuesCarousel;
