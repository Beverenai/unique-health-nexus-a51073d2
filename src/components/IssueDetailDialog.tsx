
import React from 'react';
import { HealthIssue } from '@/types/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Brain, LeafyGreen, Moon, CloudFog, Bone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface IssueDetailDialogProps {
  issue: HealthIssue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IssueDetailDialog: React.FC<IssueDetailDialogProps> = ({ issue, open, onOpenChange }) => {
  if (!issue) return null;

  // Determine color based on the load
  const getProgressColor = (load: number): string => {
    if (load < 20) return 'bg-[#88C999]'; // Green for low load
    if (load < 50) return 'bg-[#F6C85E]'; // Yellow for moderate load
    return 'bg-[#EF5E5E]';  // Red for high load
  };

  const getTextColor = (load: number): string => {
    if (load < 20) return 'text-[#88C999]'; // Green for low load
    if (load < 50) return 'text-[#F6C85E]'; // Yellow for moderate load
    return 'text-[#EF5E5E]';  // Red for high load
  };

  // Get icon based on issue name
  const getIssueIcon = () => {
    const name = issue.name.toLowerCase();
    
    if (name.includes('nervesystem') || name.includes('nakkevirvler') || name.includes('kompresjon')) {
      return <Bone className="text-[#1E1E1E]" size={28} />;
    } else if (name.includes('tarm') || name.includes('bakterie') || name.includes('flora')) {
      return <LeafyGreen className="text-[#1E1E1E]" size={28} />;
    } else if (name.includes('hormon') || name.includes('melatonin') || name.includes('kortisol')) {
      return <Moon className="text-[#1E1E1E]" size={28} />;
    } else {
      return <CloudFog className="text-[#1E1E1E]" size={28} />;
    }
  };

  // Example biological explanations based on issue type
  const getBiologicalExplanation = () => {
    const name = issue.name.toLowerCase();
    
    if (name.includes('tarm') || name.includes('bakterie') || name.includes('flora')) {
      return "Tarmen inneholder billioner av bakterier som hjelper med fordøyelse, immunfunksjon og produksjon av næringsstoffer. Ubalanse i denne mikrobiomet kan forstyrre disse funksjonene og føre til inflammasjon.";
    } else if (name.includes('hormon')) {
      return "Hormoner er kroppens kjemiske budbringere som regulerer alt fra energiproduksjon til søvn og stemning. Ubalanser i dette systemet påvirker mange kroppslige funksjoner samtidig.";
    } else if (name.includes('kompresjon') || name.includes('nakkevirvler')) {
      return "Nakkevirvlene beskytter ryggmargen og nervebaner som kommuniserer mellom hjernen og kroppen. Kompresjon kan forstyrre nervesignaler og påvirke omkringliggende vev og blodforsyning.";
    } else if (name.includes('nervesystem')) {
      return "Nervesystemet er kroppens kommunikasjonsnettverk. God nervefunksjon er avgjørende for alle kroppslige prosesser og reaksjoner på ytre og indre stimuli.";
    } else {
      return "Denne tilstanden påvirker kroppens naturlige balanse og selvregulerende systemer, noe som kan føre til redusert funksjon og økt belastning over tid.";
    }
  };

  // Example possible causes based on issue type
  const getPossibleCauses = () => {
    const name = issue.name.toLowerCase();
    
    if (name.includes('tarm') || name.includes('bakterie') || name.includes('flora')) {
      return [
        "Ubalansert kosthold med høyt inntak av prosessert mat",
        "Overdreven antibiotikabruk som dreper gunstige bakterier",
        "Kronisk stress som endrer tarmmiljøet",
        "Miljøtoksiner og forurensning"
      ];
    } else if (name.includes('hormon')) {
      return [
        "Irregulære søvnmønstre og forstyrrelser i døgnrytmen",
        "Kronisk stress og høy kortisolproduksjon",
        "Miljøkjemikalier som forstyrrer hormonsystemet",
        "Næringsstoffmangler som påvirker hormonsyntese"
      ];
    } else if (name.includes('kompresjon') || name.includes('nakkevirvler')) {
      return [
        "Dårlig arbeidsstilling og ergonomi over tid",
        "Overdreven skjermbruk med fremoverlent holdning",
        "Tidligere skader eller traumer i nakkeområdet",
        "Muskelspenninger fra stress og bekymringer"
      ];
    } else if (name.includes('nervesystem')) {
      return [
        "Langvarig stress som påvirker nervesystemets balanse",
        "Manglende restitusjon og hvile",
        "Næringsmessige ubalanser som påvirker nervefunksjon",
        "Miljøfaktorer og elektromagnetisk eksponering"
      ];
    } else {
      return [
        "Livsstilsfaktorer inkludert kosthold og aktivitetsnivå",
        "Miljøeksponering og forurensning",
        "Genetisk predisposisjon",
        "Kronisk stress og psykologiske faktorer"
      ];
    }
  };

  // Example educational links
  const getEducationalLinks = () => {
    const name = issue.name.toLowerCase();
    
    if (name.includes('tarm') || name.includes('bakterie') || name.includes('flora')) {
      return [
        { title: "Mikrobiomet og dets innvirkning på helsen", url: "#" },
        { title: "Prebiotika vs. Probiotika: Hvilken forskjell?", url: "#" },
        { title: "Kosthold for optimal tarmhelse", url: "#" }
      ];
    } else if (name.includes('hormon')) {
      return [
        { title: "Balansere stress- og søvnhormoner naturlig", url: "#" },
        { title: "Hormonsykluser og deres betydning", url: "#" },
        { title: "Kosthold og hormoner: Den skjulte sammenhengen", url: "#" }
      ];
    } else if (name.includes('kompresjon') || name.includes('nakkevirvler')) {
      return [
        { title: "Ergonomi for nakke og rygg i hverdagen", url: "#" },
        { title: "Øvelser for å redusere nakkebelastning", url: "#" },
        { title: "Forstå sammenhengen mellom nakke og nervesystem", url: "#" }
      ];
    } else {
      return [
        { title: "Helhetlig tilnærming til optimal helse", url: "#" },
        { title: "Forebyggende helsetiltak i hverdagen", url: "#" },
        { title: "Kronisk belastning og langtidseffekter", url: "#" }
      ];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh] bg-white">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className={cn("bg-[#F7F7F7] p-3 rounded-full")}>
              {getIssueIcon()}
            </div>
            <DialogTitle className="text-xl text-[#1E1E1E]">
              {issue.name}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 pt-2">
          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            <Progress 
              value={issue.load} 
              className={cn("h-2.5 flex-grow", getProgressColor(issue.load))} 
            />
            <span className={cn("text-sm font-medium", getTextColor(issue.load))}>
              {issue.load}%
            </span>
          </div>
          
          {/* Status summary */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-[#1E1E1E]">Oppsummering</h3>
            <p className="text-[#1E1E1E] leading-relaxed">
              {issue.description}
            </p>
          </div>
          
          {/* Biological explanation */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-[#1E1E1E]">Biologisk forklaring</h3>
            <p className="text-[#1E1E1E] leading-relaxed">
              {getBiologicalExplanation()}
            </p>
          </div>
          
          {/* Possible causes */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-[#1E1E1E]">Mulige årsaker</h3>
            <ul className="list-disc pl-5 space-y-1">
              {getPossibleCauses().map((cause, index) => (
                <li key={index} className="text-[#1E1E1E] leading-relaxed">
                  {cause}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-[#1E1E1E]">Anbefalte tiltak</h3>
            {issue.recommendations && issue.recommendations.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {issue.recommendations.map((rec, index) => (
                  <li key={index} className="text-[#1E1E1E] leading-relaxed">
                    {rec}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#1E1E1E]">Ingen spesifikke anbefalinger tilgjengelig.</p>
            )}
          </div>
          
          {/* Educational links */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-[#1E1E1E]">Lær mer</h3>
            <ul className="space-y-1">
              {getEducationalLinks().map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    <span className="mr-1">•</span> {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDetailDialog;
