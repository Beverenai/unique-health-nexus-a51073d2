
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarClock, Moon, Zap, SmilePlus, ThumbsUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Check } from 'lucide-react';

type Symptom = {
  id: string;
  name: string;
  selected: boolean;
};

const commonSymptoms: Symptom[] = [
  { id: '1', name: 'Hodepine', selected: false },
  { id: '2', name: 'Trøtthet', selected: false },
  { id: '3', name: 'Magesmerter', selected: false },
  { id: '4', name: 'Søvnløshet', selected: false },
  { id: '5', name: 'Svimmelhet', selected: false },
  { id: '6', name: 'Muskelsmerte', selected: false },
  { id: '7', name: 'Stressfølelse', selected: false },
  { id: '8', name: 'Kvalme', selected: false },
];

const CheckIn = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [mood, setMood] = useState<number>(5);
  const [energy, setEnergy] = useState<number>(5);
  const [sleepQuality, setSleepQuality] = useState<number>(5);
  const [painLevel, setPainLevel] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>(commonSymptoms);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSymptomToggle = (id: string) => {
    setSymptoms(symptoms.map(symptom => 
      symptom.id === id ? { ...symptom, selected: !symptom.selected } : symptom
    ));
  };
  
  const getMoodDescription = (value: number): string => {
    if (value <= 2) return 'Dårlig';
    if (value <= 4) return 'Under middels';
    if (value <= 6) return 'Middels';
    if (value <= 8) return 'Bra';
    return 'Utmerket';
  };
  
  const getEnergyDescription = (value: number): string => {
    if (value <= 2) return 'Utmattet';
    if (value <= 4) return 'Lav';
    if (value <= 6) return 'Moderat';
    if (value <= 8) return 'God';
    return 'Høy';
  };
  
  const getSleepDescription = (value: number): string => {
    if (value <= 2) return 'Veldig dårlig';
    if (value <= 4) return 'Dårlig';
    if (value <= 6) return 'OK';
    if (value <= 8) return 'God';
    return 'Utmerket';
  };
  
  const handleSubmit = async () => {
    if (!user) {
      toast.error('Du må være logget inn for å lagre dagsloggen');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const selectedSymptoms = symptoms
        .filter(symptom => symptom.selected)
        .map(symptom => symptom.name);
      
      // Using raw SQL query with RPC instead of from() method
      const { data, error } = await supabase.rpc('add_health_checkin', {
        p_user_id: user.id,
        p_date: new Date().toISOString().split('T')[0],
        p_mood: mood,
        p_energy_level: energy,
        p_sleep_quality: sleepQuality,
        p_pain_level: painLevel,
        p_symptoms: selectedSymptoms,
        p_notes: notes
      });
        
      if (error) throw error;
      
      toast.success('Dagslogg lagret!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving check-in:', error);
      toast.error('Kunne ikke lagre dagsloggen');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-md mx-auto px-4 pt-6">
        <header className="mb-6">
          <div className="flex items-center mb-2">
            <button 
              onClick={() => navigate(-1)}
              className="mr-2 p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Dagslogg</h1>
          </div>
          <p className="text-gray-500">
            Registrer hvordan du føler deg i dag
          </p>
        </header>
        
        <div className="space-y-6">
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Noter</CardTitle>
                <CardDescription>Legg til eventuelle kommentarer om dagen din</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Skriv eventuelle tanker eller observasjoner her..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </motion.div>
          
          <div className="flex justify-center pt-4 mb-10">
            <Button
              onClick={handleSubmit}
              className="w-full max-w-sm bg-[#9b87f5] hover:bg-[#8a76e5]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Lagrer...' : 'Lagre dagslogg'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
