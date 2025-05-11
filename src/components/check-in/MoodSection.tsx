
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { SmilePlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface MoodSectionProps {
  mood: number;
  setMood: (value: number) => void;
}

const MoodSection: React.FC<MoodSectionProps> = ({ mood, setMood }) => {
  const getMoodDescription = (value: number): string => {
    if (value <= 2) return 'Dårlig';
    if (value <= 4) return 'Under middels';
    if (value <= 6) return 'Middels';
    if (value <= 8) return 'Bra';
    return 'Utmerket';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <SmilePlus size={18} className="mr-2 text-[#9b87f5]" />
            Humør
          </CardTitle>
          <CardDescription>Hvordan føler du deg i dag?</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="mb-5">
            <Slider
              value={[mood]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setMood(value[0])}
              className="mt-2"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Dårlig</span>
            <span className="font-medium text-[#9b87f5]">{getMoodDescription(mood)}</span>
            <span>Utmerket</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MoodSection;
