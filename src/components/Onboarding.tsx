
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: 'Velkommen til Unique',
      description: 'Din personlige digitale helseassistent basert på kroppens signaler.',
      image: '🧬'
    },
    {
      title: 'Koherens-score',
      description: 'Koherens-score forteller deg kroppens totale helse og balanse, enkelt og tydelig.',
      image: '📊'
    },
    {
      title: 'Kom i gang',
      description: 'Utforsk helseresultatene dine, få tilpassede råd, og chat direkte med vår AI-assistent.',
      image: '🚀'
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save to localStorage that onboarding is completed
      localStorage.setItem('onboardingCompleted', 'true');
      // Fade out before calling onComplete
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{steps[currentStep].image}</div>
          <h2 className="text-2xl font-medium mb-2">{steps[currentStep].title}</h2>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full",
                  currentStep === index ? "bg-primary" : "bg-gray-300"
                )}
              />
            ))}
          </div>
          
          <Button onClick={nextStep}>
            {currentStep === steps.length - 1 ? 'Kom i gang' : 'Neste'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
