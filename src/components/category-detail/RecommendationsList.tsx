
import React from 'react';
import { PlanRecommendation } from '@/types/database';
import RecommendationItem from './RecommendationItem';

interface RecommendationsListProps {
  recommendations: PlanRecommendation[];
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-6 bg-white/70 backdrop-blur shadow-sm rounded-xl border border-gray-100/40">
        <p className="text-gray-500">
          Ingen anbefalinger funnet.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {recommendations.map(recommendation => (
        <RecommendationItem 
          key={recommendation.id} 
          recommendation={recommendation} 
        />
      ))}
    </div>
  );
};

export default RecommendationsList;
