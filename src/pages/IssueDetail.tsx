
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bug, Zap, Skull, Activity, PanelLeft, Info, BookOpen, Database, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DetailCard from '@/components/DetailCard';
import ScannerComponentTable from '@/components/ScannerComponentTable';
import { getIssueDetails } from '@/services/supabaseService';
import { HealthIssue, IssueDetail, IssueRecommendation, ScannerComponent } from '@/types/supabase';
import ChatButton from '@/components/ChatButton';
import { cn } from '@/lib/utils';

const IssueDetailPage: React.FC = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  
  const [issue, setIssue] = useState<HealthIssue | null>(null);
  const [details, setDetails] = useState<IssueDetail[]>([]);
  const [recommendations, setRecommendations] = useState<IssueRecommendation[]>([]);
  const [scannerComponents, setScannerComponents] = useState<ScannerComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    const loadIssueData = async () => {
      if (!issueId) return;

      try {
        const data = await getIssueDetails(issueId);
        setIssue(data.issue);
        setDetails(data.details);
        setRecommendations(data.recommendations);
        setScannerComponents(data.scannerComponents);
      } catch (error) {
        console.error('Error loading issue data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIssueData();
  }, [issueId]);

  const getIssueIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('bakter')) return <Bug className="text-danger" />;
    if (lowerName.includes('sopp')) return <Skull className="text-warning" />;
    return <Zap className="text-warning" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F8FC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5] mx-auto mb-4"></div>
          <p>Laster...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F8FC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">Fant ikke helseproblemet</h2>
          <Button onClick={() => navigate('/')}>Tilbake til forsiden</Button>
        </div>
      </div>
    );
  }
  
  // Determine load severity color
  const getSeverityColor = (load: number): string => {
    if (load < 40) return 'bg-[#77C17E] text-white';
    if (load < 70) return 'bg-[#F7D154] text-gray-800';
    return 'bg-[#EA384C] text-white';
  };
  
  const getSeverityText = (load: number): string => {
    if (load < 40) return 'Lav belastning';
    if (load < 70) return 'Moderat belastning';
    return 'Høy belastning';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F8FC] px-4 pb-20 pt-4">
      <Button 
        variant="ghost" 
        className="mb-4 -ml-2 gap-1" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={16} />
        <span>Tilbake</span>
      </Button>
      
      {/* Header section with key information */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-gray-100/20 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-full bg-white shadow-sm">
            {getIssueIcon(issue.name)}
          </div>
          <h1 className="text-2xl font-semibold">{issue.name}</h1>
        </div>
        
        <div className="flex items-center mb-4 gap-3">
          <Badge className={cn("px-3 py-1", getSeverityColor(issue.load))}>
            {getSeverityText(issue.load)}
          </Badge>
          <span className="text-gray-700 text-sm">Belastningsnivå: {issue.load}%</span>
        </div>
        
        <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <div className="flex items-center justify-between">
            <p className="text-gray-700 line-clamp-2">{issue.description}</p>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <Info size={18} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-3 text-sm text-gray-600">
            {issue.detailed_info || "Dine resultater viser forhøyede verdier som kan påvirke helsetilstanden din. Se anbefalinger nedenfor for hvordan du kan forbedre dette området."}
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-3 mb-4 bg-white/70 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex gap-1 items-center">
            <BookOpen size={14} />
            <span>Oversikt</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex gap-1 items-center">
            <PanelLeft size={14} />
            <span>Anbefalinger</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex gap-1 items-center">
            <Database size={14} />
            <span>Data</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {/* Details section */}
          {details.length > 0 ? (
            <Card className="mb-6 bg-white/70 backdrop-blur-sm border-gray-100/20">
              <CardHeader className="pb-0">
                <h2 className="text-lg font-medium">Detaljer</h2>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {details.map(detail => (
                  <DetailCard 
                    key={detail.id} 
                    detail={detail} 
                  />
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6 bg-white/70 backdrop-blur-sm border-gray-100/20">
              <CardContent className="pt-6">
                <h2 className="text-lg font-medium mb-3">Detaljert informasjon</h2>
                <p className="text-gray-700">
                  {issue.detailed_info || "Dine resultater viser forhøyede verdier som kan påvirke helsetilstanden din. Se anbefalinger nedenfor for hvordan du kan forbedre dette området."}
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Connected systems section */}
          <Card className="mb-6 bg-white/70 backdrop-blur-sm border-gray-100/20">
            <CardHeader className="pb-0">
              <h2 className="text-lg font-medium">Forbundet med</h2>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-white/50">Nervesystem</Badge>
                <Badge variant="outline" className="bg-white/50">Hormonsystem</Badge>
                {issue.name.toLowerCase().includes('tarm') && (
                  <Badge variant="outline" className="bg-white/50">Fordøyelsessystem</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations">
          {/* Specific advice section */}
          <div className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-100/20">
              <CardHeader className="pb-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded-full">
                    <LeafyGreen size={16} className="text-green-600" />
                  </div>
                  <h3 className="font-medium">Kosthold</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-gray-700">{issue.specific_advice?.diet || (recommendations[0]?.recommendation || "Ingen spesifikke kostholdsanbefalinger tilgjengelig.")}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 backdrop-blur-sm border-gray-100/20">
              <CardHeader className="pb-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-full">
                    <Activity size={16} className="text-blue-600" />
                  </div>
                  <h3 className="font-medium">Livsstil</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-gray-700">{issue.specific_advice?.lifestyle || (recommendations[1]?.recommendation || "Ingen spesifikke livsstilsanbefalinger tilgjengelig.")}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 backdrop-blur-sm border-gray-100/20">
              <CardHeader className="pb-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 rounded-full">
                    <Flask size={16} className="text-amber-600" />
                  </div>
                  <h3 className="font-medium">Tilskudd</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-gray-700">{issue.specific_advice?.supplements || (recommendations[2]?.recommendation || "Ingen spesifikke tilskuddsanbefalinger tilgjengelig.")}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="data">
          <Card className="bg-white/70 backdrop-blur-sm border-gray-100/20">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-[#9b87f5]" />
                <h2 className="text-lg font-medium">Rådata fra scanner</h2>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <p className="text-gray-700 mb-4">
                Disse dataene viser de detekterte komponentene i din skanneøkt med deres respektive nivåer. 
                Høyere prosentverdier indikerer sterkere deteksjoner.
              </p>
              
              {scannerComponents.length > 0 ? (
                <ScannerComponentTable components={scannerComponents} />
              ) : (
                <p className="text-gray-500 italic">Ingen rådata tilgjengelig for denne helseproblematikken.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <Button 
          className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center bg-[#9b87f5] hover:bg-[#8b76f0]"
          title="Chat med AI-assistenten"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
        <ChatButton />
      </div>
    </div>
  );
};

export default IssueDetailPage;

// Add the LeafyGreen and Flask icons
const LeafyGreen = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 22c1.25-1.25 2.5-2.5 3.75-2.5 2.5 0 0 2.5 2.5 2.5 1.25 0 2.5-1.25 3.75-2.5"/>
    <path d="M8 16.75c1.25-1.25 2.5-2.5 3.75-2.5 2.5 0 0 2.5 2.5 2.5 1.25 0 2.5-1.25 3.75-2.5"/>
    <path d="M14 11.5c1.25-1.25 2.5-2.5 3.75-2.5 2.5 0 0 2.5 2.5 2.5"/>
    <path d="M20 6.25c1.25-1.25 2.5-2.5 0-2.5s-2.5 1.25-3.75 2.5"/>
    <path d="M14 11.5c-1.25-1.25-2.5-2.5-3.75-2.5-2.5 0 0 2.5-2.5 2.5-1.25 0-2.5-1.25-3.75-2.5"/>
    <path d="M8 16.75c-1.25-1.25-2.5-2.5-3.75-2.5"/>
  </svg>
);

const Flask = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 2v7.31"></path>
    <path d="M14 9.3V2"></path>
    <path d="M8.5 2h7"></path>
    <path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
    <path d="M5.52 16h12.96"></path>
  </svg>
);
