
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className="mb-6">
      <div className="flex items-center mb-2">
        <button 
          onClick={() => navigate(-1)}
          className="mr-2 p-1 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">Dagslogg rapport</h1>
      </div>
      <p className="text-gray-500">
        Din helse de siste dagene
      </p>
    </header>
  );
};

export default ReportHeader;
