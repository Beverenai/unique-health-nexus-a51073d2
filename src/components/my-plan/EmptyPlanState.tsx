
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Plus } from 'lucide-react';

interface EmptyPlanStateProps {
  onCreatePlan: () => Promise<void>;
}

const EmptyPlanState: React.FC<EmptyPlanStateProps> = ({ onCreatePlan }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Heart size={24} className="text-[#9b87f5]" />
      </div>
      <h2 className="text-lg font-medium mb-2">Ingen helseplan</h2>
      <p className="text-gray-500 text-center mb-6">
        Du har ingen aktiv helseplan for øyeblikket.
      </p>
      <Button 
        onClick={() => onCreatePlan()}
        className="bg-[#9b87f5] hover:bg-[#8a76e5]"
      >
        <Plus size={16} className="mr-2" />
        Opprett personlig helseplan
      </Button>
    </div>
  );
};

export default EmptyPlanState;
