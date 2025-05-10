
import React from 'react';
import CoherenceRing from '@/components/CoherenceRing';
import { CoherenceData } from '@/types/supabase';
import { Card } from '@/components/ui/card';

interface CoherenceDisplayProps {
  coherenceData: CoherenceData | null;
}

const CoherenceDisplay: React.FC<CoherenceDisplayProps> = ({ coherenceData }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <Card className="w-full bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-3xl overflow-hidden">
        <div className="p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Kroppens koherensnivå</h2>
          <CoherenceRing score={coherenceData?.score || 64} />
        </div>
      </Card>
    </div>
  );
};

export default CoherenceDisplay;
