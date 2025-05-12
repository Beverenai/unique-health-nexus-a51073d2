
import React from 'react';
import { Apple, Dumbbell, Sparkles, Brain, Coffee, Flame } from 'lucide-react';

export const getCategoryIcon = (categoryName: string | undefined) => {
  if (!categoryName) return null;
  
  const categoryMapping: Record<string, React.ReactNode> = {
    'kosthold': <Apple size={20} className="text-green-500" />,
    'bevegelse': <Dumbbell size={20} className="text-blue-500" />,
    'tilskudd': <Sparkles size={20} className="text-purple-500" />,
    'mental helse': <Brain size={20} className="text-amber-500" />,
    'søvn': <Coffee size={20} className="text-indigo-500" />,
    'stress': <Flame size={20} className="text-red-500" />
  };
  
  const key = Object.keys(categoryMapping).find(
    key => key.toLowerCase() === categoryName.toLowerCase()
  );
  
  return key ? categoryMapping[key] : null;
};

export const getCategoryBadgeClass = (categoryName: string | undefined) => {
  if (!categoryName) return "";
  
  switch (categoryName.toLowerCase()) {
    case 'mental helse':
      return "bg-amber-50 text-amber-700";
    case 'bevegelse':
      return "bg-blue-50 text-blue-700";
    case 'søvn':
      return "bg-indigo-50 text-indigo-700";
    case 'stress':
      return "bg-red-50 text-red-700";
    case 'tilskudd':
      return "bg-purple-50 text-purple-700";
    case 'kosthold':
    default:
      return "bg-green-50 text-green-700";
  }
};
