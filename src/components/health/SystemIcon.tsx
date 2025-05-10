
import React from 'react';
import { 
  Brain,
  Heart, 
  Activity, 
  Salad, 
  Eye,
  CloudFog, 
  LeafyGreen, 
  Droplet, 
  Bone, 
  Moon 
} from 'lucide-react';

interface SystemIconProps {
  name: string;
  size?: number;
}

const SystemIcon: React.FC<SystemIconProps> = ({ name, size = 16 }) => {
  // Determine icon based on system name
  const getIcon = () => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('tarm') || lowerName.includes('fordøyelse')) {
      return <Salad size={size} className="text-green-600" />;
    } else if (lowerName.includes('lymfe')) {
      return <Droplet size={size} className="text-blue-600" />;
    } else if (lowerName.includes('nakke') || lowerName.includes('rygg') || lowerName.includes('muskel')) {
      return <Bone size={size} className="text-amber-600" />;
    } else if (lowerName.includes('oksidativ') || lowerName.includes('stress')) {
      return <CloudFog size={size} className="text-rose-600" />;
    } else if (lowerName.includes('energi') || lowerName.includes('mitokondri')) {
      return <LeafyGreen size={size} className="text-yellow-600" />;
    } else if (lowerName.includes('hormon')) {
      return <Moon size={size} className="text-purple-600" />;
    } else if (lowerName.includes('immun')) {
      return <Activity size={size} className="text-indigo-600" />;
    } else if (lowerName.includes('hud') || lowerName.includes('bindevev')) {
      return <Eye size={size} className="text-orange-600" />;
    } else if (lowerName.includes('avgiftning') || lowerName.includes('lever')) {
      return <LeafyGreen size={size} className="text-emerald-600" />;
    } else if (lowerName.includes('hjerte') || lowerName.includes('kar')) {
      return <Heart size={size} className="text-red-600" />;
    } else if (lowerName.includes('psykisk') || lowerName.includes('nervesystem')) {
      return <Brain size={size} className="text-sky-600" />;
    } else {
      return <Activity size={size} className="text-gray-600" />;
    }
  };
  
  return <>{getIcon()}</>;
};

export default SystemIcon;
