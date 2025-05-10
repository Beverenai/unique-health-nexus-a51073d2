
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const NewScanButton: React.FC = () => {
  const handleNewScan = () => {
    toast.success('Starter ny skanning...', {
      description: 'Dette ville starte en ny skanning i en reell applikasjon.'
    });
  };

  return (
    <div className="fixed bottom-20 inset-x-0 flex justify-center z-30">
      <Button 
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-6 rounded-full shadow-lg"
        onClick={handleNewScan}
      >
        Start ny skanning
      </Button>
    </div>
  );
};

export default NewScanButton;
