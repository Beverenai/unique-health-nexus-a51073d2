
import React from 'react';
import { HealthIssue } from '@/types/supabase';
import IssueCard from '@/components/IssueCard';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

interface HealthIssuesCarouselProps {
  healthIssues: HealthIssue[];
}

const HealthIssuesCarousel: React.FC<HealthIssuesCarouselProps> = ({ 
  healthIssues 
}) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Prioriterte områder</h2>
        <span className="text-xs px-2 py-1 bg-[#9b87f5]/10 text-[#9b87f5] font-medium rounded-full">
          {healthIssues.length} funn
        </span>
      </div>
      
      <Carousel className="w-full mb-4">
        <CarouselContent>
          {healthIssues.map(issue => (
            <CarouselItem key={issue.id} className="md:basis-2/3 lg:basis-1/2">
              <div className="p-1">
                <IssueCard 
                  key={issue.id} 
                  issue={issue}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 h-8 w-8 bg-white/80 backdrop-blur-sm border border-gray-100/20" />
          <CarouselNext className="static translate-y-0 h-8 w-8 bg-white/80 backdrop-blur-sm border border-gray-100/20" />
        </div>
      </Carousel>
      
      <p className="text-xs text-gray-500 text-center mt-2">
        Swipe for å se alle områder som krever oppmerksomhet
      </p>
    </div>
  );
};

export default HealthIssuesCarousel;
