
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HealthIssue } from '@/types/supabase';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import HealthIssueCard from './HealthIssueCard';

interface HealthIssuesCarouselProps {
  healthIssues: HealthIssue[];
}

/**
 * A carousel component that displays health issues in a horizontally scrollable format
 */
const HealthIssuesCarousel: React.FC<HealthIssuesCarouselProps> = ({ healthIssues }) => {
  const navigate = useNavigate();
  
  const handleIssueClick = (issueId: string) => {
    navigate(`/issue/${issueId}`);
    console.log("Navigating from carousel to issue:", issueId);
  };

  return (
    <div className="mb-6">
      <Carousel className="w-full">
        <CarouselContent>
          {healthIssues.map(issue => (
            <CarouselItem key={issue.id} className="md:basis-2/3 lg:basis-1/2">
              <HealthIssueCard 
                issue={issue} 
                onClick={() => handleIssueClick(issue.id)}
              />
            </CarouselItem>
          ))}
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
