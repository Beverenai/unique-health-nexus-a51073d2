
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecipesSection from '@/components/nutrition/RecipesSection';

const Recipes = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-20">
      <div className="container px-4 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Tilbake
          </Button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold flex items-center">
              <BookOpen className="mr-2 h-6 w-6 text-[#9b87f5]" />
              Oppskrifter
            </h1>
          </div>
          <p className="text-gray-600 mt-1">
            Oppdag sunne og næringsrike oppskrifter tilpasset dine behov
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100/40 p-6">
          <RecipesSection />
        </div>
      </div>
    </div>
  );
};

export default Recipes;
