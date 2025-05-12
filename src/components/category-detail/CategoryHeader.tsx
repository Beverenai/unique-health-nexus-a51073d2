
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CategoryHeaderProps {
  categoryName: string | undefined;
  categoryIcon: React.ReactNode;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ categoryName, categoryIcon }) => {
  const navigate = useNavigate();

  const formatCategoryName = () => {
    if (!categoryName) return '';
    
    // Capitalize the first letter
    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  };

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-2 -ml-3"
        onClick={() => navigate('/my-plan')}
      >
        <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
        Tilbake
      </Button>
      
      <div className="flex items-center mb-2">
        <div className="h-8 w-8 rounded-full bg-gray-50/80 flex items-center justify-center mr-2">
          {categoryIcon}
        </div>
        <h1 className="text-2xl font-bold">{formatCategoryName()}</h1>
      </div>
      
      <p className="text-gray-500 text-sm">
        Her er alle anbefalingene for {categoryName?.toLowerCase()}.
      </p>
    </div>
  );
};

export default CategoryHeader;
