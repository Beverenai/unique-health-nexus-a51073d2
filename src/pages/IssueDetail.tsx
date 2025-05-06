
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bug, Zap, Skull, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DetailCard from '@/components/DetailCard';
import ScannerComponentTable from '@/components/ScannerComponentTable';
import { getIssueDetails } from '@/services/supabaseService';
import { HealthIssue, IssueDetail, IssueRecommendation, ScannerComponent } from '@/types/supabase';
import ChatButton from '@/components/ChatButton';
import NavigationBar from '@/components/NavigationBar';
import { cn } from '@/lib/utils';

const IssueDetailPage: React.FC = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  
  const [issue, setIssue] = useState<HealthIssue | null>(null);
  const [details, setDetails] = useState<IssueDetail[]>([]);
  const [recommendations, setRecommendations] = useState<IssueRecommendation[]>([]);
  const [scannerComponents, setScannerComponents] = useState<ScannerComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("recommendations");

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laster...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">Fant ikke helseproblemet</h2>
          <Button onClick={() => navigate('/')}>Tilbake til forsiden</Button>
        </div>
      </div>
    );
  }
  
  // Determine load severity color
  const getSeverityColor = (load: number): string => {
    if (load < 40) return 'bg-success text-success-foreground';
    if (load < 70) return 'bg-warning text-warning-foreground';
    return 'bg-danger text-danger-foreground';
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 pb-20 pt-6">
      <Button 
        variant="ghost" 
        className="mb-4 -ml-2 gap-1" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={16} />
        <span>Tilbake</span>
      </Button>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-gray-100">
          {getIssueIcon(issue.name)}
        </div>
        <h1 className="text-2xl font-semibold">{issue.name}</h1>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="h-2 bg-primary rounded-full" style={{ width: `${issue.load}%` }}></div>
        <Badge className={cn("ml-2", getSeverityColor(issue.load))}>
          Belastning: {issue.load}%
        </Badge>
      </div>
      
      <p className="text-gray-700 mb-6">{issue.description}</p>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="recommendations">Anbefalinger</TabsTrigger>
          <TabsTrigger value="rawData">Rådata fra scanner</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations">
          {/* Detailed information section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-3">Detaljert informasjon</h2>
              <p className="text-gray-700">
                {issue.detailed_info || "Dine resultater viser forhøyede verdier som kan påvirke helsetilstanden din. Se anbefalinger nedenfor for hvordan du kan forbedre dette området."}
              </p>
            </CardContent>
          </Card>
          
          {details.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4">Detaljer</h2>
              <div className="space-y-4">
                {details.map(detail => (
                  <DetailCard 
                    key={detail.id} 
                    detail={detail} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Specific advice section */}
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Spesifikke råd</h2>
            
            <Card className="mb-4">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Kosthold</h3>
                <p>{issue.specific_advice?.diet || (recommendations[0]?.recommendation || "Ingen spesifikke kostholdsanbefalinger tilgjengelig.")}</p>
              </CardContent>
            </Card>
            
            <Card className="mb-4">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Livsstil</h3>
                <p>{issue.specific_advice?.lifestyle || (recommendations[1]?.recommendation || "Ingen spesifikke livsstilsanbefalinger tilgjengelig.")}</p>
              </CardContent>
            </Card>
            
            <Card className="mb-4">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Tilskudd</h3>
                <p>{issue.specific_advice?.supplements || (recommendations[2]?.recommendation || "Ingen spesifikke tilskuddsanbefalinger tilgjengelig.")}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="rawData">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={20} className="text-primary" />
                <h2 className="text-lg font-medium">Rådata fra scanner</h2>
              </div>
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
      
      <div className="text-center py-4">
        <p className="text-sm text-gray-500 italic">
          Chat med AI-assistenten vår for mer personlig veiledning om {issue.name.toLowerCase()}.
        </p>
      </div>
      
      <ChatButton />
      <NavigationBar />
    </div>
  );
};

export default IssueDetailPage;
