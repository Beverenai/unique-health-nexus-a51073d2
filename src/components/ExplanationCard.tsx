
import React from 'react';
import { Info } from 'lucide-react';

const ExplanationCard: React.FC = () => {
  return (
    <div className="mb-8 bg-white/70 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 bg-[#9b87f5]/10 p-2 rounded-full flex-shrink-0">
            <Info className="text-[#9b87f5]" size={16} />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Alt du ser her er basert på en grundig kroppsskanning som tolker over 200 millioner signaler fra kroppen din. 
            Det er ikke sanntidsdata, men et øyeblikksbilde av kroppens tilstand.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExplanationCard;
