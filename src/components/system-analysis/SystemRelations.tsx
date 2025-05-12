
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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
    return `${sys1} og ${sys2} kommuniserer gjennom biokjemiske feedback-mekanismer som påvirker din helhetlige helse.`;
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
      <div className="mb-4">
        <h4 className="text-base font-medium text-gray-700">Systemsammenheng</h4>
      </div>
      
      {/* Systems connection visualization - simplified */}
      <div className="flex flex-col items-center space-y-4 mb-5">
        <div className="flex items-center justify-center w-full gap-3">
          <div className="p-2 px-4 bg-[#9b87f5]/10 rounded-lg text-[#9b87f5] font-medium">
            {displayTopSystem}
          </div>
          
          <CustomTooltip content="Påvirker">
            <div className="flex items-center">
              <ArrowRight size={20} className="text-[#9b87f5]" />
            </div>
          </CustomTooltip>
          
          <div className="p-2 px-4 bg-green-50 rounded-lg text-green-700 font-medium">
            {displaySecondSystem}
          </div>
        </div>
        
        {/* Connection description */}
        <div className="p-4 bg-gray-50 rounded-lg text-gray-700 text-sm w-full">
          {connectionDescription}
        </div>
      </div>
    </motion.div>
  );
};

export default SystemRelations;
