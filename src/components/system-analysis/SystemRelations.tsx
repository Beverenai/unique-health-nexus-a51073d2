
import React from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SystemRelationsProps {
  topSystem: string;
  secondSystem: string;
}

const SystemRelations: React.FC<SystemRelationsProps> = ({ topSystem, secondSystem }) => {
  const displayTopSystem = topSystem || 'nervesystem';
  const displaySecondSystem = secondSystem || 'fordøyelsessystem';
  
  // Get personalized description based on the systems involved
  const getConnectionDescription = (sys1: string, sys2: string): string => {
    // Map of common system interactions with more specific explanations
    const systemInteractions: Record<string, Record<string, string>> = {
      'nervesystem': {
        'fordøyelsessystem': 'Vagusnerven fra nervesystemet kommuniserer direkte med mage-tarmkanalen og påvirker fordøyelsesprosessen og tarmfloraen.',
        'hormonsystem': 'Nervesystemet regulerer hypotalamus og hypofysen, som er hovedkontrollsenteret for hormonproduksjon i kroppen.',
        'immunsystem': 'Nervesystemet kommuniserer med immunsystemet via nevroimmunologiske forbindelser og kan endre immunrespons ved stress.',
        'muskelsystem': 'Nervesystemet kontrollerer alle muskelkontraksjoner og er avgjørende for bevegelse og koordinasjon.'
      },
      'fordøyelsessystem': {
        'nervesystem': 'Tarmen produserer over 90% av kroppens serotonin, en nevrotransmitter som påvirker humør og nevrologisk funksjon.',
        'immunsystem': 'Over 70% av immunsystemet er lokalisert i tarmveggen, og tarmfloraen spiller en nøkkelrolle i immunregulering.',
        'hormonsystem': 'Tarmmikrobiomet påvirker produksjonen og reguleringen av flere hormoner, inkludert stresshormonet kortisol.'
      },
      'hormonsystem': {
        'nervesystem': 'Hormoner som kortisol og adrenalin påvirker nervesystemets funksjon og stressrespons.',
        'immunsystem': 'Hormoner som kortisol har kraftig anti-inflammatorisk virkning og demper immunrespons.',
        'fordøyelsessystem': 'Hormoner som insulin, glukagon og ghrelin regulerer matinntak og stoffskifte.'
      },
      'immunsystem': {
        'nervesystem': 'Kronisk inflammasjon kan påvirke hjernefunksjon og føre til nevroinflammasjon og kognitive problemer.',
        'fordøyelsessystem': 'Immunsystemets respons på matallergener og patogener påvirker tarmmikrobiomet og fordøyelseshelse.',
        'hormonsystem': 'Cytokiner fra immunsystemet kan påvirke hormonproduksjon og hormonsensitivitet i vev.'
      },
      'muskelsystem': {
        'nervesystem': 'Muskelspenninger kan skape press på nerverøtter og føre til smerte og dysfunksjon i nervesystemet.',
        'hormonsystem': 'Fysisk aktivitet påvirker insulinsensitivitet og produksjon av veksthormoner.'
      }
    };
    
    // Convert to lowercase for matching
    const sys1Lower = sys1.toLowerCase();
    const sys2Lower = sys2.toLowerCase();
    
    // Check if we have a specific interaction for these systems
    if (systemInteractions[sys1Lower]?.[sys2Lower]) {
      return systemInteractions[sys1Lower][sys2Lower];
    } else if (systemInteractions[sys2Lower]?.[sys1Lower]) {
      return systemInteractions[sys2Lower][sys1Lower];
    }
    
    // Generic fallback
    return `${sys1} og ${sys2} kommuniserer gjennom komplekse biokjemiske feedback-mekanismer som påvirker din helhetlige helse.`;
  };
  
  // Generate a specific description based on the two systems
  const connectionDescription = getConnectionDescription(displayTopSystem, displaySecondSystem);
  
  return (
    <motion.div 
      className="bg-gradient-to-br from-[#9b87f5]/10 to-[#9b87f5]/5 backdrop-blur-sm rounded-xl p-5 border border-[#9b87f5]/20 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <motion.h4 
        className="font-semibold text-gray-800 mb-3 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center">
          <span className="bg-[#9b87f5]/20 p-1.5 rounded-full mr-2">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#9b87f5]">
              <path d="M2 2a2 2 0 0 1 2-2h5.5A2 2 0 0 1 11 2c0 1.6.8 3 2 4 1.9 1.6 3 4 3 6.5V14c0 2.2 1.8 4 4 4v2H0v-2c2.2 0 4-1.8 4-4v-1.5c0-2.5 1.1-4.9 3-6.5 1.2-1 2-2.4 2-4 0-1.1-.9-2-2-2H2z" />
              <path d="M18.4 2.2c2.1.6 3.6 2.5 3.6 4.8v1" />
            </svg>
          </span>
          <span>Viktigste systemsammenhenger</span>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info size={14} className="text-gray-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-[220px]">
                Basert på din skanning viser vi de viktigste sammenhengene mellom kroppssystemer.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.h4>
      
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-3">
        <motion.div 
          className="bg-white/80 rounded-lg px-3 py-1.5 text-sm font-medium text-[#9b87f5] shadow-sm border border-[#9b87f5]/10"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(155, 135, 245, 0.15)" }}
        >
          {displayTopSystem}
        </motion.div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          <ArrowRight size={16} className="text-gray-400 hidden sm:block" />
          <ArrowRight size={16} className="text-gray-400 rotate-90 block sm:hidden mx-auto" />
          
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-[#9b87f5]/20 text-[#9b87f5] text-xs font-medium rounded-full px-1.5 py-0.5
                      hidden sm:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            påvirker
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="bg-white/80 rounded-lg px-3 py-1.5 text-sm font-medium text-[#9b87f5] shadow-sm border border-[#9b87f5]/10"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(155, 135, 245, 0.15)" }}
        >
          {displaySecondSystem}
        </motion.div>
      </div>
      
      <motion.p 
        className="text-sm text-gray-700 leading-relaxed bg-white/50 p-3 rounded-lg shadow-sm border border-gray-100/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {connectionDescription}
      </motion.p>
      
      <motion.div 
        className="mt-3 pt-3 border-t border-[#9b87f5]/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button 
          className="text-xs text-[#9b87f5] font-medium flex items-center hover:underline"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          Se alle systemsammenhenger
          <ArrowRight size={12} className="ml-1" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SystemRelations;
