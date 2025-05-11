
import React from 'react';
import { motion } from 'framer-motion';
import HealthSystemCards from '@/components/health/HealthSystemCards';
import { HealthSystemItem } from '@/services/healthSystemService';

// Note: This component is no longer actively used as the health information 
// has been moved to the Insights page. Keeping for reference.

// Sample health information data - using the same structure as the original table
const healthInfoData: HealthSystemItem[] = [
  {
    id: "1",
    area: "Tarm og fordøyelse",
    symptoms: "Slimhinner og bakterieflora viser ubalanse",
    causes: "Stress, antibiotika, bearbeidet mat",
    recommendations: "Spis fermentert mat, ta probiotika, unngå sukker i 1 uke"
  },
  {
    id: "2",
    area: "Lymfesystem",
    symptoms: "Flere lymfekanaler viser treg flyt",
    causes: "Lav væskeinntak, lite bevegelse, miljøgifter",
    recommendations: "Drikk mer vann, bruk urtete (nesle, løvetann), lett aktivitet daglig"
  },
  {
    id: "3",
    area: "Nakke og rygg (C4–C5)",
    symptoms: "Spenning og blokkering i nakkevirvler",
    causes: "Feil arbeidsstilling, stress, lav søvnkvalitet",
    recommendations: "Lett tøying, ergonomisk sittestilling, massasje"
  },
  {
    id: "4",
    area: "Oksidativt stress",
    symptoms: "Cellemiljøet viser høy belastning",
    causes: "Miljøgifter, lavt antioksidantinntak, stress",
    recommendations: "Øk inntak av C-vitamin, bær, og grønne bladgrønnsaker"
  },
  {
    id: "5",
    area: "Energisystem (mitokondrier)",
    symptoms: "Redusert energiproduksjon i cellene",
    causes: "Søvnunderskudd, tungmetaller, langvarig stress",
    recommendations: "Sov jevnt, ta Q10 og magnesium, reduser skjermtid før leggetid"
  },
  {
    id: "6",
    area: "Hormonelle reseptorer",
    symptoms: "Lav sensitivitet i kroppens signalreseptorer",
    causes: "Kronisk stress, inflammasjon, hormonell ubalanse",
    recommendations: "Adaptogener (ashwagandha), meditasjon, dagslys om morgenen"
  },
  {
    id: "7",
    area: "Immunforsvar",
    symptoms: "Hvite blodceller viser lav regulering",
    causes: "Langvarig stress, dårlig søvn, tarmubalanse",
    recommendations: "Søvnhygiene, C-vitamin, probiotika, reduser stimulering om kvelden"
  },
  {
    id: "8",
    area: "Hud og bindevev",
    symptoms: "Redusert elastisitet og regenereringsevne",
    causes: "Lavt kollagen, lite bevegelse, oksidativt stress",
    recommendations: "Kollagentilskudd, bær, bevegelse og tøying"
  },
  {
    id: "9",
    area: "Avgiftningskapasitet",
    symptoms: "Leveren og nyrene jobber hardt med eliminasjon",
    causes: "Kjemikalier, kosthold, medikamenter",
    recommendations: "Reduser eksponering, bruk melkefrø og løvetann, drikk mye vann"
  },
  {
    id: "10",
    area: "Psykisk stress",
    symptoms: "Signalene fra nervesystemet viser overbelastning",
    causes: "For mange bekymringer, ytre krav, lite restitusjon",
    recommendations: "Avslapningsteknikker, pusteøvelser, natur, dagbok"
  }
];

interface ExpandableHealthTableProps {
  isVisible: boolean;
}

// NOTE: This component is deprecated and no longer used in the application.
// Health information has been moved to the Insights page.
const ExpandableHealthTable: React.FC<ExpandableHealthTableProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <motion.div 
      className="mt-6"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <HealthSystemCards 
        title="Helseinformasjon" 
        description="Detaljert oversikt over helsetilstanden din"
        healthData={healthInfoData}
      />
    </motion.div>
  );
};

export default ExpandableHealthTable;
