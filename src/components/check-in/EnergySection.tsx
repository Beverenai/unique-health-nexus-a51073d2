
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnergySectionProps {
  energy: number;
  setEnergy: (value: number) => void;
}

const EnergySection: React.FC<EnergySectionProps> = ({ energy, setEnergy }) => {
  const getEnergyDescription = (value: number): string => {
    if (value <= 2) return 'Utmattet';
    if (value <= 4) return 'Lav';
    if (value <= 6) return 'Moderat';
    if (value <= 8) return 'God';
    return 'Høy';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Zap size={18} className="mr-2 text-amber-500" />
            Energinivå
          </CardTitle>
          <CardDescription>Hvordan er energinivået ditt i dag?</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="mb-5">
            <Slider
              value={[energy]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setEnergy(value[0])}
              className="mt-2"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Utmattet</span>
            <span className="font-medium text-amber-500">{getEnergyDescription(energy)}</span>
            <span>Høy</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnergySection;
