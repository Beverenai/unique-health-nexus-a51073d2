
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';

export type Symptom = {
  id: string;
  name: string;
  selected: boolean;
};

interface SymptomsSectionProps {
  symptoms: Symptom[];
  handleSymptomToggle: (id: string) => void;
}

const SymptomsSection: React.FC<SymptomsSectionProps> = ({ symptoms, handleSymptomToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Symptomer</CardTitle>
          <CardDescription>Har du opplevd noen av disse symptomene i dag?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {symptoms.map(symptom => (
              <Badge
                key={symptom.id}
                variant={symptom.selected ? "default" : "outline"}
                className={`cursor-pointer ${
                  symptom.selected 
                    ? 'bg-[#9b87f5] hover:bg-[#8a76e5]' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSymptomToggle(symptom.id)}
              >
                {symptom.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SymptomsSection;
