
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Scan } from 'lucide-react';

const NewScanButton: React.FC = () => {
  const handleNewScan = () => {
    toast.success('Starter ny skanning...', {
      description: 'Dette ville starte en ny skanning i en reell applikasjon.'
    });
  };

  return (
    <div className="fixed bottom-8 right-8 z-30">
      <Button 
        className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-medium px-6 py-6 rounded-full shadow-lg transition-all hover:shadow-xl"
        onClick={handleNewScan}
      >
        <Scan size={20} />
        <span className="ml-2">Ny skanning</span>
      </Button>
    </div>
  );
};

export default NewScanButton;
