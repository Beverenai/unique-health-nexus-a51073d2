
import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface AccordionSectionProps {
  title: string;
  value: string;
  isOpen: boolean;
  onToggle: (value: string) => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ 
  title, 
  value, 
  isOpen, 
  onToggle, 
  children 
}) => {
  return (
    <Accordion 
      type="single" 
      value={isOpen ? value : ""}
      onValueChange={(val) => onToggle(val)}
      className="mb-6"
    >
      <AccordionItem value={value} className="bg-white/70 backdrop-blur shadow-sm rounded-xl border border-gray-100/40 overflow-hidden">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <h2 className="text-lg font-medium">{title}</h2>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionSection;
