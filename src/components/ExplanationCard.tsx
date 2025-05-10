
import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ExplanationCard: React.FC = () => {
  return (
    <Card className="mb-8 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 bg-[#9b87f5]/10 p-2 rounded-full flex-shrink-0">
            <Info className="text-[#9b87f5]" size={16} />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Alt du ser her er basert på en grundig kroppsskanning som tolker over 200 millioner signaler fra kroppen din. 
            Trykk på et område for å se mer detaljer og anbefalinger.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExplanationCard;
