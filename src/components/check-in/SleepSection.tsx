
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SleepSectionProps {
  sleepQuality: number;
  setSleepQuality: (value: number) => void;
}

const SleepSection: React.FC<SleepSectionProps> = ({ sleepQuality, setSleepQuality }) => {
  const getSleepDescription = (value: number): string => {
    if (value <= 2) return 'Veldig dårlig';
    if (value <= 4) return 'Dårlig';
    if (value <= 6) return 'OK';
    if (value <= 8) return 'God';
    return 'Utmerket';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Moon size={18} className="mr-2 text-blue-500" />
            Søvnkvalitet
          </CardTitle>
          <CardDescription>Hvordan sov du i natt?</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="mb-5">
            <Slider
              value={[sleepQuality]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setSleepQuality(value[0])}
              className="mt-2"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Dårlig</span>
            <span className="font-medium text-blue-500">{getSleepDescription(sleepQuality)}</span>
            <span>Utmerket</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SleepSection;
