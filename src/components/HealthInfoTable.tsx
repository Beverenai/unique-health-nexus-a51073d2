
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HealthInfoItem {
  area: string;
  symptoms: string;
  causes: string;
  recommendations: string;
}

interface HealthInfoTableProps {
  title?: string;
  description?: string;
}

const healthInfoData: HealthInfoItem[] = [
  {
    area: "Tarm og fordøyelse",
    symptoms: "Slimhinner og bakterieflora viser ubalanse",
    causes: "Stress, antibiotika, bearbeidet mat",
    recommendations: "Spis fermentert mat, ta probiotika, unngå sukker i 1 uke"
  },
  {
    area: "Lymfesystem",
    symptoms: "Flere lymfekanaler viser treg flyt",
    causes: "Lav væskeinntak, lite bevegelse, miljøgifter",
    recommendations: "Drikk mer vann, bruk urtete (nesle, løvetann), lett aktivitet daglig"
  },
  {
    area: "Nakke og rygg (C4–C5)",
    symptoms: "Spenning og blokkering i nakkevirvler",
    causes: "Feil arbeidsstilling, stress, lav søvnkvalitet",
    recommendations: "Lett tøying, ergonomisk sittestilling, massasje"
  },
  {
    area: "Oksidativt stress",
    symptoms: "Cellemiljøet viser høy belastning",
    causes: "Miljøgifter, lavt antioksidantinntak, stress",
    recommendations: "Øk inntak av C-vitamin, bær, og grønne bladgrønnsaker"
  },
  {
    area: "Energisystem (mitokondrier)",
    symptoms: "Redusert energiproduksjon i cellene",
    causes: "Søvnunderskudd, tungmetaller, langvarig stress",
    recommendations: "Sov jevnt, ta Q10 og magnesium, reduser skjermtid før leggetid"
  },
  {
    area: "Hormonelle reseptorer",
    symptoms: "Lav sensitivitet i kroppens signalreseptorer",
    causes: "Kronisk stress, inflammasjon, hormonell ubalanse",
    recommendations: "Adaptogener (ashwagandha), meditasjon, dagslys om morgenen"
  },
  {
    area: "Immunforsvar",
    symptoms: "Hvite blodceller viser lav regulering",
    causes: "Langvarig stress, dårlig søvn, tarmubalanse",
    recommendations: "Søvnhygiene, C-vitamin, probiotika, reduser stimulering om kvelden"
  },
  {
    area: "Hud og bindevev",
    symptoms: "Redusert elastisitet og regenereringsevne",
    causes: "Lavt kollagen, lite bevegelse, oksidativt stress",
    recommendations: "Kollagentilskudd, bær, bevegelse og tøying"
  },
  {
    area: "Avgiftningskapasitet",
    symptoms: "Leveren og nyrene jobber hardt med eliminasjon",
    causes: "Kjemikalier, kosthold, medikamenter",
    recommendations: "Reduser eksponering, bruk melkefrø og løvetann, drikk mye vann"
  },
  {
    area: "Psykisk stress",
    symptoms: "Signalene fra nervesystemet viser overbelastning",
    causes: "For mange bekymringer, ytre krav, lite restitusjon",
    recommendations: "Avslapningsteknikker, pusteøvelser, natur, dagbok"
  }
];

const HealthInfoTable: React.FC<HealthInfoTableProps> = ({ 
  title = "Detaljert helseinformasjon",
  description
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? healthInfoData : healthInfoData.slice(0, 3);
  
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Card className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm border-none shadow-lg mb-8 overflow-hidden">
      <CardHeader className="pb-2 border-b border-gray-100/40">
        <CardTitle className="text-xl font-playfair">{title}</CardTitle>
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <motion.div 
          className="overflow-x-auto"
          initial="hidden"
          animate="visible"
          variants={tableVariants}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px] font-medium text-gray-700">Område</TableHead>
                <TableHead className="font-medium text-gray-700">Tegn i kroppen</TableHead>
                <TableHead className="font-medium text-gray-700">Mulige årsaker</TableHead>
                <TableHead className="font-medium text-gray-700">Tiltak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleItems.map((item, index) => (
                <motion.tr 
                  key={index} 
                  className={index % 2 === 0 ? "bg-gray-50/50 hover:bg-gray-100/50 transition-colors" : "hover:bg-gray-100/50 transition-colors"}
                  variants={itemVariants}
                >
                  <TableCell className="font-medium">{item.area}</TableCell>
                  <TableCell>{item.symptoms}</TableCell>
                  <TableCell>{item.causes}</TableCell>
                  <TableCell className="p-4">
                    <div className="p-2 bg-white/50 rounded-lg border border-gray-100/40 shadow-sm">
                      {item.recommendations}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
        
        {healthInfoData.length > 3 && (
          <div className="flex justify-center py-3 border-t border-gray-100/40 bg-white/30">
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <span>{expanded ? 'Vis mindre' : 'Vis mer'}</span>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${expanded ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthInfoTable;
