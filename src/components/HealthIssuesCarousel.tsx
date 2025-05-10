
import React from 'react';
import { HealthIssue } from '@/types/supabase';
import IssueCard from '@/components/IssueCard';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

interface HealthIssuesCarouselProps {
  healthIssues: HealthIssue[];
  onIssueClick: (issue: HealthIssue) => void;
}

const HealthIssuesCarousel: React.FC<HealthIssuesCarouselProps> = ({ 
  healthIssues, 
  onIssueClick 
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Prioriterte områder</h2>
      
      <Carousel className="w-full mb-8">
        <CarouselContent>
          {healthIssues.map(issue => (
            <CarouselItem key={issue.id} className="md:basis-2/3 lg:basis-1/2">
              <div className="p-1">
                <IssueCard 
                  key={issue.id} 
                  issue={issue}
                  onClick={() => onIssueClick(issue)} 
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 h-8 w-8 bg-white/80 backdrop-blur-sm" />
          <CarouselNext className="static translate-y-0 h-8 w-8 bg-white/80 backdrop-blur-sm" />
        </div>
      </Carousel>
    </div>
  );
};

export default HealthIssuesCarousel;
