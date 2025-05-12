
import React from 'react';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CustomTooltip } from '@/components/ui/tooltip';

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
      className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-[#9b87f5]/10 p-2 rounded-full">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9b87f5]">
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <h4 className="text-lg font-medium">Systemsammenhenger</h4>
        
        <CustomTooltip 
          content={
            <p className="text-xs max-w-[220px]">
              Slik påvirker disse systemene hverandre i kroppen din
            </p>
          }
        >
          <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
            <Info size={14} className="text-gray-500" />
          </Button>
        </CustomTooltip>
      </motion.div>
      
      {/* Systems connection visualization */}
      <motion.div 
        className="flex items-center justify-center gap-4 mb-5"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="p-3 px-4 bg-[#9b87f5]/10 rounded-lg text-[#9b87f5] font-medium">
          {displayTopSystem}
        </div>
        
        <div className="flex flex-col items-center">
          <svg width="32" height="10" viewBox="0 0 32 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5H31M31 5L27 1M31 5L27 9" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs text-gray-500 mt-1">påvirker</span>
        </div>
        
        <div className="p-3 px-4 bg-green-50 rounded-lg text-green-700 font-medium">
          {displaySecondSystem}
        </div>
      </motion.div>
      
      {/* Connection description */}
      <motion.div 
        className="p-4 bg-gray-50 rounded-lg text-gray-700 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {connectionDescription}
      </motion.div>
    </motion.div>
  );
};

export default SystemRelations;
