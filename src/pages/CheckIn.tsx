
import React from 'react';
import { Button } from "@/components/ui/button";
import MoodSection from '@/components/check-in/MoodSection';
import EnergySection from '@/components/check-in/EnergySection';
import SleepSection from '@/components/check-in/SleepSection';
import SymptomsSection from '@/components/check-in/SymptomsSection';
import NotesSection from '@/components/check-in/NotesSection';
import CheckInHeader from '@/components/check-in/CheckInHeader';
import { useCheckIn } from '@/hooks/useCheckIn';

const CheckIn = () => {
  const {
    mood,
    setMood,
    energy,
    setEnergy,
    sleepQuality,
    setSleepQuality,
    notes,
    setNotes,
    symptoms,
    handleSymptomToggle,
    isSubmitting,
    handleSubmit
  } = useCheckIn();
  
  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-md mx-auto px-4 pt-6">
        <CheckInHeader />
        
        <div className="space-y-6">
          <MoodSection mood={mood} setMood={setMood} />
          <EnergySection energy={energy} setEnergy={setEnergy} />
          <SleepSection sleepQuality={sleepQuality} setSleepQuality={setSleepQuality} />
          <SymptomsSection symptoms={symptoms} handleSymptomToggle={handleSymptomToggle} />
          <NotesSection notes={notes} setNotes={setNotes} />
          
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
