
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SupplementCard from '@/components/nutrition/SupplementCard';
import { Supplement } from '@/components/nutrition/SupplementCard';

interface SupplementsSectionProps {
  supplements: Supplement[];
  explanations: Record<string, string>;
  isLoading: boolean;
}

const SupplementsSection: React.FC<SupplementsSectionProps> = ({ 
  supplements, 
  explanations, 
  isLoading 
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto"></div>
        <p className="mt-2 text-gray-500">Laster kosttilskudd...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {supplements.slice(0, 4).map(supplement => (
        <SupplementCard 
          key={supplement.id} 
          supplement={supplement} 
          reason={explanations[supplement.id]} 
        />
      ))}
      
      {supplements.length > 4 && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/category/tilskudd')}
            className="flex items-center gap-1"
          >
            <Sparkles size={14} />
            <span>Se alle {supplements.length} kosttilskudd</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SupplementsSection;
