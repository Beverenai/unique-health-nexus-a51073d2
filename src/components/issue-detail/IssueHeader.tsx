
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HealthIssue } from '@/types/supabase';
import { cn } from '@/lib/utils';
import IssueIcon from './IssueIcon';

interface IssueHeaderProps {
  issue: HealthIssue;
}

const IssueHeader: React.FC<IssueHeaderProps> = ({ issue }) => {
  const [isInfoOpen, setIsInfoOpen] = React.useState(false);

  // Determine load severity color
  const getSeverityColor = (load: number): string => {
    if (load < 40) return 'bg-[#77C17E] text-white';
    if (load < 70) return 'bg-[#F7D154] text-gray-800';
    return 'bg-[#EA384C] text-white';
  };
  
  const getSeverityText = (load: number): string => {
    if (load < 40) return 'Lav belastning';
    if (load < 70) return 'Moderat belastning';
    return 'Høy belastning';
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-gray-100/20 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-full bg-white shadow-sm">
          <IssueIcon name={issue.name} />
        </div>
        <h1 className="text-2xl font-semibold">{issue.name}</h1>
      </div>
      
      <div className="flex items-center mb-4 gap-3">
        <Badge className={cn("px-3 py-1", getSeverityColor(issue.load))}>
          {getSeverityText(issue.load)}
        </Badge>
        <span className="text-gray-700 text-sm">Belastningsnivå: {issue.load}%</span>
      </div>
      
      <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <div className="flex items-center justify-between">
          <p className="text-gray-700 line-clamp-2">{issue.description}</p>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              <Info size={18} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-3 text-sm text-gray-600">
          {issue.detailed_info || "Dine resultater viser forhøyede verdier som kan påvirke helsetilstanden din. Se anbefalinger nedenfor for hvordan du kan forbedre dette området."}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default IssueHeader;
