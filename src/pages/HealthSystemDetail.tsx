
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import SystemIcon from '@/components/health/SystemIcon';
import { Separator } from '@/components/ui/separator';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList
} from '@/components/ui/breadcrumb';

interface HealthInfoItem {
  area: string;
  symptoms: string;
  causes: string;
  recommendations: string;
}

// This is the same health data from Insights.tsx
const healthInfoData = [
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

const HealthSystemDetail: React.FC = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  
  // Find the health info based on the systemId
  const healthInfo = healthInfoData.find((item, index) => 
    systemId ? index === parseInt(systemId) : false
  );
  
  // If health info is not found, navigate back to insights
  if (!healthInfo) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0"
          onClick={() => navigate('/insights')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tilbake til innsikter
        </Button>
        <p>Kroppssystem ikke funnet.</p>
      </div>
    );
  }
  
  const { area, symptoms, causes, recommendations } = healthInfo;
  
  // Determine gradient color based on system type
  const getBgGradient = (area: string): string => {
    const areaLower = area.toLowerCase();
    
    if (areaLower.includes('tarm') || areaLower.includes('fordøyelse')) {
      return 'from-green-50 to-green-100/50';
    } else if (areaLower.includes('lymfe')) {
      return 'from-blue-50 to-blue-100/50';
    } else if (areaLower.includes('nakke') || areaLower.includes('rygg')) {
      return 'from-amber-50 to-amber-100/50';
    } else if (areaLower.includes('oksidativ') || areaLower.includes('stress')) {
      return 'from-rose-50 to-rose-100/50';
    } else if (areaLower.includes('energi') || areaLower.includes('mitokondri')) {
      return 'from-yellow-50 to-yellow-100/50';
    } else if (areaLower.includes('hormon')) {
      return 'from-purple-50 to-purple-100/50';
    } else if (areaLower.includes('immun')) {
      return 'from-indigo-50 to-indigo-100/50';
    } else if (areaLower.includes('hud') || areaLower.includes('bindevev')) {
      return 'from-orange-50 to-orange-100/50';
    } else if (areaLower.includes('avgiftning') || areaLower.includes('lever')) {
      return 'from-emerald-50 to-emerald-100/50';
    } else if (areaLower.includes('psykisk')) {
      return 'from-sky-50 to-sky-100/50';
    } else {
      return 'from-gray-50 to-gray-100/50';
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="container max-w-lg mx-auto px-4 py-4 flex flex-col h-full">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Button 
                  variant="ghost" 
                  className="p-0" 
                  onClick={() => navigate('/insights')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Innsikter
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {area}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Health System Card */}
        <Card className={`bg-gradient-to-br ${getBgGradient(area)} border-none shadow-md mb-4`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-2.5 rounded-full shadow-sm">
                <SystemIcon name={area} size={28} />
              </div>
              <h1 className="text-xl font-semibold">{area}</h1>
            </div>
            
            {/* Main Content with ScrollArea to prevent page scrolling */}
            <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-medium mb-2">Tegn i kroppen:</h2>
                  <div className="bg-white/70 p-4 rounded-lg shadow-sm">
                    <p className="text-sm">{symptoms}</p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-sm font-medium mb-2">Mulige årsaker:</h2>
                  <div className="bg-white/70 p-4 rounded-lg shadow-sm">
                    <p className="text-sm">{causes}</p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-sm font-medium mb-2">Anbefalte tiltak:</h2>
                  <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-white/50">
                    <p className="text-sm">{recommendations}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthSystemDetail;
