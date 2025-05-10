
import React from 'react';

interface SystemRelationsProps {
  topSystem: string;
  secondSystem: string;
}

const SystemRelations: React.FC<SystemRelationsProps> = ({ topSystem, secondSystem }) => {
  const displayTopSystem = topSystem || 'nervesystem';
  const displaySecondSystem = secondSystem || 'fordøyelsessystem';
  
  return (
    <div className="bg-[#9b87f5]/5 rounded-lg p-4 border border-[#9b87f5]/10">
      <h4 className="font-medium text-sm mb-2">Sammenhenger mellom systemene</h4>
      <p className="text-sm text-gray-700">
        Alle kroppens systemer er sammenkoblet. Belastning i ett system kan påvirke andre.
        For eksempel kan et overbelastet {displayTopSystem.toLowerCase()} påvirke {displaySecondSystem} gjennom
        komplekse biokjemiske feedback-mekanismer.
      </p>
    </div>
  );
};

export default SystemRelations;
