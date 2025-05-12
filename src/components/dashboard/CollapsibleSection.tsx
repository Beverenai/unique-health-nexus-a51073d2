
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  isOpen, 
  onToggle, 
  children, 
  className = "mb-6 bg-white/70 backdrop-blur shadow-sm rounded-xl border border-gray-100/40 overflow-hidden"
}) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className={className}
    >
      <div className="px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">{title}</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} 
            />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="px-6 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleSection;
