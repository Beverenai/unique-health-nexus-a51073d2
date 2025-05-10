
import React from 'react';
import CoherenceRing from '@/components/CoherenceRing';
import { CoherenceData } from '@/types/supabase';
import { Card, CardContent } from '@/components/ui/card';

interface CoherenceDisplayProps {
  coherenceData: CoherenceData | null;
}

const CoherenceDisplay: React.FC<CoherenceDisplayProps> = ({ coherenceData }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <Card className="w-full bg-white border-none shadow-sm rounded-xl">
        <CardContent className="p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Koherens fra skanningen</h2>
          <CoherenceRing score={coherenceData?.score || 64} />
          
          <p className="text-center text-gray-600 max-w-sm mt-4 text-sm">
            {coherenceData?.message || "Din kroppskanning indikerer en total koherens-score som representerer kroppens balanse."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoherenceDisplay;
