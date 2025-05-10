
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

const ExplanationCard: React.FC = () => {
  return (
    <Card className="mb-6 bg-white border-none shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 bg-blue-100 p-2 rounded-full flex-shrink-0">
            <Info className="text-blue-600" size={16} />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Alt du ser her er basert på en grundig kroppsskanning som tolker over 200 millioner signaler fra kroppen din. 
            Det er ikke sanntidsdata, men et øyeblikksbilde av kroppens tilstand.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExplanationCard;
