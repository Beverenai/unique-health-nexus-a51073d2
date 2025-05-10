
import React from 'react';

interface Recommendation {
  color: string;
  text: string;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
}

const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
  return (
    <div className="pt-5 mt-5 border-t border-gray-100">
      <h4 className="text-sm font-semibold mb-3 text-gray-800">Anbefalinger basert på helheten:</h4>
      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <div 
            key={index} 
            className={`flex items-start backdrop-blur-sm ${recommendation.color} p-4 rounded-xl shadow-sm`}
          >
            <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${recommendation.color.replace('bg-', '').replace('-50', '-400')} mt-1.5 mr-2`}></div>
            <span className="text-gray-700 text-sm">{recommendation.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;
