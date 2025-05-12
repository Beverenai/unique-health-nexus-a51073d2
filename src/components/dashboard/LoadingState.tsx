
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
    </div>
  );
};

export default LoadingState;
