
import React from 'react';
import CoherenceRing from '@/components/CoherenceRing';
import { CoherenceData } from '@/types/supabase';
import { Card } from '@/components/ui/card';

interface CoherenceDisplayProps {
  coherenceData: CoherenceData | null;
}

const CoherenceDisplay: React.FC<CoherenceDisplayProps> = ({ coherenceData }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-10">
      <Card className="w-full bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-3xl overflow-hidden">
        <div className="p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Kroppens koherensnivå</h2>
          <CoherenceRing score={coherenceData?.score || 64} />
          
          <p className="text-center text-gray-600 max-w-sm mt-6 leading-relaxed">
            {coherenceData?.message || "Din kroppskanning indikerer en total koherens-score som representerer kroppens balanse."}
          </p>
          
          <div className="mt-6 pt-4 border-t border-gray-100 w-full">
            <p className="text-xs text-gray-500 text-center">
              Koherens representerer harmonien i kroppens biologiske systemer. 
              Høyere score indikerer bedre balanse mellom nervesystem, hormoner og biokjemiske prosesser.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CoherenceDisplay;
