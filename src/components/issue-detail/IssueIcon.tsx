
import React from 'react';
import { Bug, Skull, Zap } from 'lucide-react';

interface IssueIconProps {
  name: string;
  className?: string;
}

const IssueIcon: React.FC<IssueIconProps> = ({ name, className }) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('bakter')) return <Bug className={className || "text-danger"} />;
  if (lowerName.includes('sopp')) return <Skull className={className || "text-warning"} />;
  return <Zap className={className || "text-warning"} />;
};

export default IssueIcon;
