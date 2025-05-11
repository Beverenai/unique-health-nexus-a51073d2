
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Symptom } from '@/components/check-in/SymptomsSection';
import { tables } from '@/integrations/supabase/client-extensions';

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

export const useCheckIn = () => {
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
      
      const { data, error } = await tables.healthCheckins()
        .insert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          mood: mood,
          energy_level: energy,
          sleep_quality: sleepQuality,
          pain_level: painLevel > 0 ? painLevel : null,
          symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : null,
          notes: notes || null
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
  
  return {
    mood,
    setMood,
    energy,
    setEnergy,
    sleepQuality,
    setSleepQuality,
    painLevel,
    setPainLevel,
    notes,
    setNotes,
    symptoms,
    handleSymptomToggle,
    isSubmitting,
    handleSubmit
  };
};
