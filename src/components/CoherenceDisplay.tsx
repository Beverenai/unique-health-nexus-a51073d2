
import React from 'react';
import CoherenceRing from '@/components/CoherenceRing';
import { CoherenceData } from '@/types/supabase';

interface CoherenceDisplayProps {
  coherenceData: CoherenceData | null;
}

const CoherenceDisplay: React.FC<CoherenceDisplayProps> = ({ coherenceData }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <CoherenceRing score={coherenceData?.score || 64} />
    </div>
  );
};

export default CoherenceDisplay;
