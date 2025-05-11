
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Calendar size={24} className="text-gray-500" />
      </div>
      <h2 className="text-lg font-medium mb-2">Ingen dagslogger</h2>
      <p className="text-gray-500 text-center mb-6">
        Du har ikke registrert noen dagslogger enda.
      </p>
      <Button 
        onClick={() => navigate('/checkin')}
        className="bg-[#9b87f5] hover:bg-[#8a76e5]"
      >
        Opprett første dagslogg
      </Button>
    </div>
  );
};

export default EmptyState;
