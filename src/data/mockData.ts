
import { CoherenceData } from '../types/health';
import { HealthIssue } from '../types/supabase';

// Mock health issues for development
export const mockHealthIssues: HealthIssue[] = [
  {
    id: "bacterial",
    name: "Bakteriell ubalanse",
    description: "Høy bakterieaktivitet i tarmen påvirker fordøyelsen og energinivået.",
    load: 75,
    scan_id: "mock-scan-id-1",
    created_at: new Date().toISOString(),
    recommendations: [
      "Øk inntaket av probiotika og prebiotiske fibre",
      "Ta probiotiske tilskudd daglig i 6–8 uker",
      "Reduser stressnivået ved hjelp av meditasjon eller yoga"
    ],
  },
  {
    id: "toxins",
    name: "Miljøgiftbelastning",
    description: "Forhøyede tungmetallnivåer påvirker nervesystem og generell energi.",
    load: 55,
    scan_id: "mock-scan-id-1",
    created_at: new Date().toISOString(),
    recommendations: [
      "Støtt avgiftningssystemet med antioksidanter og mineraler",
      "Øk inntaket av klorofyllrike matvarer",
      "Vurder regelmessig detoksifikasjonsprotokoller"
    ],
  },
  {
    id: "fungal",
    name: "Soppbelastning",
    description: "Mulig soppvekst påvirker luftveiene og kan forårsake tretthet.",
    load: 45,
    scan_id: "mock-scan-id-1",
    created_at: new Date().toISOString(),
    recommendations: [
      "Reduser sukkerinntaket og vurder anti-fungal kosthold",
      "Unngå fuktige miljøer som kan fremme soppvekst",
      "Støtt immunsystemet med spesifikke urter og næringsstoffer"
    ],
  }
];

export const mockCoherenceData: CoherenceData = {
  score: 72, // 0-100%
  message: "Din kropp viser god totalbalanse, men det er rom for forbedring.",
  issues: [
    {
      id: "bacterial",
      name: "Bakteriell ubalanse",
      description: "Høy bakterieaktivitet i tarmen påvirker fordøyelsen og energinivået.",
      load: 75, // 0-100% (high - red)
      recommendations: [
        "Øk inntaket av probiotika og prebiotiske fibre",
        "Ta probiotiske tilskudd daglig i 6–8 uker",
        "Reduser stressnivået ved hjelp av meditasjon eller yoga"
      ],
      details: [
        {
          id: "spirillum",
          title: "Spirillum Serpens",
          description: "Dine resultater viser betydelig forhøyede nivåer av Spirillum Serpens (38%), som kan forstyrre din fordøyelse og føre til redusert næringsopptak og energi.",
          impact: 78
        },
        {
          id: "digest",
          title: "Fordøyelse",
          description: "Redusert evne til å fordøye proteiner og fett kan føre til ubehag og oppblåsthet.",
          impact: 65
        },
        {
          id: "absorption",
          title: "Næringsopptak",
          description: "Begrenset opptak av B-vitaminer og mineraler påvirker energinivået.",
          impact: 70
        }
      ],
      detailed_info: "Dine resultater viser betydelig forhøyede nivåer av Spirillum Serpens (38%), som kan forstyrre din fordøyelse og føre til redusert næringsopptak og energi.",
      specific_advice: {
        diet: "Øk inntak av fermentert mat som yoghurt, kimchi og surkål.",
        lifestyle: "Reduser stressnivået ved hjelp av meditasjon eller yoga.",
        supplements: "Ta probiotiske tilskudd daglig i 6–8 uker."
      }
    },
    {
      id: "toxins",
      name: "Miljøgiftbelastning",
      description: "Forhøyede tungmetallnivåer påvirker nervesystem og generell energi.",
      load: 55, // 0-100% (medium - yellow)
      recommendations: [
        "Støtt avgiftningssystemet med antioksidanter og mineraler",
        "Øk inntaket av klorofyllrike matvarer",
        "Vurder regelmessig detoksifikasjonsprotokoller"
      ],
      details: [
        {
          id: "metals",
          title: "Tungmetaller",
          description: "Forhøyede nivåer av kvikksølv og bly kan påvirke nervesystemet og kognitiv funksjon.",
          impact: 58
        },
        {
          id: "detox",
          title: "Avgiftningskapasitet",
          description: "Moderat redusert avgiftningskapasitet i leveren påvirker eliminering av miljøgifter.",
          impact: 52
        },
        {
          id: "oxidative",
          title: "Oksidativt stress",
          description: "Økt oksidativt stress relatert til miljøgiftbelastning kan skade cellulære strukturer.",
          impact: 55
        }
      ],
      detailed_info: "Dine resultater indikerer en moderat belastning av miljøgifter, spesielt tungmetaller som kan akkumuleres i vev og forstyrre normale biologiske funksjoner.",
      specific_advice: {
        diet: "Øk inntaket av klorofyllrike matvarer som spirulina, koriander og ville blåbær.",
        lifestyle: "Bruk svette-terapi som sauna regelmessig for å støtte utrensing gjennom huden.",
        supplements: "Vurder tilskudd av klorella, aktivert kull og N-acetyl cystein (NAC)."
      }
    },
    {
      id: "fungal",
      name: "Soppbelastning",
      description: "Mulig soppvekst påvirker luftveiene og kan forårsake tretthet.",
      load: 45, // 0-100% (medium - yellow)
      recommendations: [
        "Reduser sukkerinntaket og vurder anti-fungal kosthold",
        "Unngå fuktige miljøer som kan fremme soppvekst",
        "Støtt immunsystemet med spesifikke urter og næringsstoffer"
      ],
      details: [
        {
          id: "candida",
          title: "Candida aktivitet",
          description: "Moderat forhøyet aktivitet av Candida-stammer kan forstyrre tarmfloraen.",
          impact: 48
        },
        {
          id: "respiratory",
          title: "Luftveispåvirkning",
          description: "Mulig påvirkning på slimhinner i luftveiene kan gi irritasjon og tretthet.",
          impact: 42
        },
        {
          id: "immune",
          title: "Immunrespons",
          description: "Forhøyet immunrespons mot sopp kan føre til inflammasjon og utmattelse.",
          impact: 45
        }
      ],
      detailed_info: "Scannene indikerer moderat soppbelastning som kan påvirke både fordøyelsessystemet og luftveiene, noe som kan bidra til din opplevde tretthet og energimangel.",
      specific_advice: {
        diet: "Reduser sukkerinntaket drastisk og eliminer raffinerte karbohydrater i minst 3 uker.",
        lifestyle: "Sikre god ventilasjon i hjemmet og unngå fuktige områder som kan fremme soppvekst.",
        supplements: "Vurder naturlige antimykotiske tilskudd som oreganoolje, hvitløk og pau d'arco."
      }
    }
  ]
};

// Helper functions to get colors based on health scores
export const getScoreColor = (score: number): string => {
  if (score >= 70) return 'success'; // Green
  if (score >= 40) return 'warning'; // Yellow
  return 'danger'; // Red
};

export const getScoreTextColor = (score: number): string => {
  if (score >= 70) return 'text-success'; 
  if (score >= 40) return 'text-warning';
  return 'text-danger';
};

export const getScoreBgColor = (score: number): string => {
  if (score >= 70) return 'bg-success';
  if (score >= 40) return 'bg-warning';
  return 'bg-danger';
};

// Get priority issues (those with load > 20%)
export const getPriorityIssues = (data: CoherenceData) => {
  return data.issues
    .filter(issue => issue.load > 20)
    .sort((a, b) => b.load - a.load)
    .slice(0, 3);
};
