
import React from 'react';
import { Brain, Heart, Activity, Stethoscope } from 'lucide-react';
import Flask from '@/components/issue-detail/Flask';

interface SystemIconProps {
  name: string;
}

const SystemIcon: React.FC<SystemIconProps> = ({ name }) => {
  switch(name.toLowerCase()) {
    case 'nervesystem':
      return <Brain className="h-5 w-5" />;
    case 'hjerte-kar':
      return <Heart className="h-5 w-5" />;
    case 'respirasjonssystem':
      return <Activity className="h-5 w-5" />; 
    case 'fordøyelsessystem':
      return <Flask className="h-5 w-5" />; 
    default:
      return <Stethoscope className="h-5 w-5" />;
  }
};

export default SystemIcon;
