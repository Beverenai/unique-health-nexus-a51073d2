
import React from 'react';
import { HealthIssue } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { getSystemData } from '@/components/insight/SystemCard';
import { motion } from 'framer-motion';

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
      <Carousel className="w-full">
        <CarouselContent>
          {healthIssues.map(issue => {
            const { icon, bgColor } = getSystemData(issue.name, issue);
            
            return (
              <CarouselItem key={issue.id} className="md:basis-2/3 lg:basis-1/2">
                <motion.div 
                  className="p-1"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Card 
                    className={`p-4 ${bgColor} cursor-pointer hover:shadow-md transition-all backdrop-blur-sm border border-white/40`}
                    onClick={() => {
                      navigate(`/issue/${issue.id}`);
                      console.log("Navigating from carousel to issue:", issue.id);
                    }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm">
                        {icon}
                      </div>
                      <span className="ml-2 font-medium">{issue.name}</span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {issue.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-600 text-xs">Belastning</span>
                      <span className={`font-medium text-xs ${load => (
                        load < 40 ? 'text-[#77C17E]' : 
                        load < 60 ? 'text-[#F7D154]' : 
                        'text-[#EA384C]'
                      )(issue.load)}`}>{issue.load}%</span>
                    </div>
                    
                    <Progress 
                      value={issue.load} 
                      className={`h-1.5 rounded-full ${getProgressColor(issue.load)}`} 
                    />
                  </Card>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 h-8 w-8 bg-white/80 backdrop-blur-sm border border-gray-100/20 hover:bg-white/90 hover:border-[#9b87f5]/30" />
          <CarouselNext className="static translate-y-0 h-8 w-8 bg-white/80 backdrop-blur-sm border border-gray-100/20 hover:bg-white/90 hover:border-[#9b87f5]/30" />
        </div>
      </Carousel>
    </div>
  );
};

export default HealthIssuesCarousel;
