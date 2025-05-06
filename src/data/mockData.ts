
import { CoherenceData, HealthDetail } from '../types/health';

export const mockCoherenceData: CoherenceData = {
  score: 73, // 0-100%
  issues: [
    {
      id: "stress",
      name: "Stress & Nervesystem",
      description: "Kroppen din viser tegn på forhøyet stressnivå, som påvirker nervesystemet og hormonbalansen.",
      load: 42, // 0-100%
      recommendations: [
        "Ta 10 minutter dyp pust hver morgen og kveld",
        "Reduser koffein og øk inntak av magnesiumrike matvarer",
        "Få 7-8 timer søvn i et mørkt, kjølig rom"
      ],
      details: [
        {
          id: "cortisol",
          title: "Forhøyet kortisol",
          description: "Kortisolnivåene dine er høyere enn optimalt, noe som kan påvirke energinivået og søvnkvaliteten.",
          impact: 45
        },
        {
          id: "vagus",
          title: "Vagusnerve aktivitet",
          description: "Redusert vagusnerve stimulering påvirker din evne til å komme tilbake til en avslappet tilstand.",
          impact: 38
        },
        {
          id: "adrenalin",
          title: "Adrenalin",
          description: "Vedvarende forhøyet adrenalinnivå kan føre til anspenthet og søvnforstyrrelser.",
          impact: 35
        }
      ]
    },
    {
      id: "digestion",
      name: "Fordøyelse & Tarmhelse",
      description: "Signalene tyder på forstyrrelser i tarmfloraen og redusert opptak av næringsstoffer.",
      load: 37, // 0-100%
      recommendations: [
        "Inkluder fermenterte matvarer som kefir eller sauerkraut daglig",
        "Unngå prosessert mat og raffinert sukker i 2 uker",
        "Drikk 2L filtrert vann daglig mellom måltidene"
      ],
      details: [
        {
          id: "microbiome",
          title: "Tarmflora balanse",
          description: "Redusert mangfold i tarmfloraen kan påvirke immunforsvaret og fordøyelsen.",
          impact: 40
        },
        {
          id: "enzyme",
          title: "Fordøyelsesenzymer",
          description: "Moderat reduksjon i enzymproduksjon påvirker opptaket av næringsstoffer.",
          impact: 32
        },
        {
          id: "inflammation",
          title: "Tarminflammajson",
          description: "Mild inflammasjon i tarmen kan påvirke opptaket av næringsstoffer og føre til ubehag.",
          impact: 35
        }
      ]
    },
    {
      id: "toxins",
      name: "Toksiner & Avgiftning",
      description: "Kroppen viser tegn på samlet belastning fra miljøgifter og redusert avgiftningskapasitet.",
      load: 28, // 0-100%
      recommendations: [
        "Start dagen med en kopp varm sitronsaft og vann",
        "Ta daglige svette-økter (trening eller sauna) i 15-20 minutter",
        "Øk inntaket av korsblomst-grønnsaker som brokkoli og grønnkål"
      ],
      details: [
        {
          id: "liver",
          title: "Leverbelastning",
          description: "Moderat påvirkning av leverfunksjon og fase 2-avgiftning.",
          impact: 30
        },
        {
          id: "heavymetals",
          title: "Tungmetaller",
          description: "Spor av tungmetaller som kan påvirke energiproduksjon og kognitive funksjoner.",
          impact: 25
        },
        {
          id: "lymph",
          title: "Lymfesirkulasjon",
          description: "Lett redusert lymfesirkulasjon som kan påvirke avfallshåndtering i vevet.",
          impact: 26
        }
      ]
    },
    {
      id: "immune",
      name: "Immunforsvar",
      description: "Lettere svekket immunforsvar med mulighet for økt betennelse i kroppen.",
      load: 18, // 0-100%, under 20% so not shown in priority areas
      recommendations: [
        "Øk vitamin D- og sink-inntak gjennom kosthold eller tilskudd",
        "Få 15-20 minutter direkte sollys daglig",
        "Praktiser stressreduksjonsteknikker for å redusere betennelse"
      ],
      details: []
    }
  ]
};

// Helper functions to get colors based on health scores
export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'success'; // Green
  if (score >= 50) return 'warning'; // Yellow
  return 'danger'; // Red
};

export const getScoreTextColor = (score: number): string => {
  if (score >= 80) return 'text-success'; 
  if (score >= 50) return 'text-warning';
  return 'text-danger';
};

export const getScoreBgColor = (score: number): string => {
  if (score >= 80) return 'bg-success';
  if (score >= 50) return 'bg-warning';
  return 'bg-danger';
};

// Get priority issues (those with load > 20%)
export const getPriorityIssues = (data: CoherenceData) => {
  return data.issues
    .filter(issue => issue.load > 20)
    .sort((a, b) => b.load - a.load)
    .slice(0, 3);
};
