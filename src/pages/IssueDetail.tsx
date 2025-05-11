
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, PanelLeft, Database, MessageSquare, Network, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getIssueDetails } from '@/services/healthIssueService';
import { getHealthSystems, HealthSystemItem } from '@/services/healthSystemService';
import { HealthIssue, IssueDetail, IssueRecommendation, ScannerComponent } from '@/types/supabase';
import ChatButton from '@/components/ChatButton';
import { toast } from 'sonner';

// Import refactored components
import IssueHeader from '@/components/issue-detail/IssueHeader';
import OverviewTab from '@/components/issue-detail/OverviewTab';
import RecommendationsTab from '@/components/issue-detail/RecommendationsTab';
import DataTab from '@/components/issue-detail/DataTab';
import RelatedSystemsTab from '@/components/issue-detail/RelatedSystemsTab';

const IssueDetailPage: React.FC = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  
  const [issue, setIssue] = useState<HealthIssue | null>(null);
  const [details, setDetails] = useState<IssueDetail[]>([]);
  const [recommendations, setRecommendations] = useState<IssueRecommendation[]>([]);
  const [scannerComponents, setScannerComponents] = useState<ScannerComponent[]>([]);
  const [healthData, setHealthData] = useState<HealthSystemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    const loadData = async () => {
      if (!issueId) {
        setError("Manglende henvisnings-ID");
        setLoading(false);
        return;
      }

      try {
        console.log("Loading issue with ID:", issueId);
        const issueData = await getIssueDetails(issueId);
        
        if (!issueData.issue) {
          console.error('No issue found with ID:', issueId);
          setError("Kunne ikke finne helseproblemet med ID: " + issueId);
          toast.error("Kunne ikke finne helseproblemet", {
            description: "Vennligst gå tilbake og prøv igjen"
          });
          setLoading(false);
          return;
        }
        
        // Load health systems data
        const systemsData = await getHealthSystems();
        
        console.log("Issue data loaded successfully:", issueData.issue);
        setIssue(issueData.issue);
        setDetails(issueData.details);
        setRecommendations(issueData.recommendations);
        setScannerComponents(issueData.scannerComponents);
        setHealthData(systemsData);
        setError(null);
      } catch (error) {
        console.error('Error loading issue data:', error);
        setError("Feil ved lasting av helseproblemet");
        toast.error("Feil ved lasting av data", {
          description: "Vennligst prøv igjen senere"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [issueId]);

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

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#F8F8FC] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="text-red-500 h-8 w-8" />
          </div>
          <h2 className="text-xl font-medium mb-4">Fant ikke helseproblemet</h2>
          <p className="mb-6 text-gray-600">{error || "Helseproblemet kunne ikke lastes. Det kan være slettet eller utilgjengelig."}</p>
          <Button onClick={() => navigate('/')}>Tilbake til forsiden</Button>
        </div>
      </div>
    );
  }

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
      <IssueHeader issue={issue} />
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-4 mb-4 bg-white/70 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex gap-1 items-center">
            <BookOpen size={14} />
            <span>Oversikt</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex gap-1 items-center">
            <PanelLeft size={14} />
            <span>Anbefalinger</span>
          </TabsTrigger>
          <TabsTrigger value="related-systems" className="flex gap-1 items-center">
            <Network size={14} />
            <span>Relaterte systemer</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex gap-1 items-center">
            <Database size={14} />
            <span>Data</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab 
            details={details} 
            detailedInfo={issue.detailed_info} 
          />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <RecommendationsTab 
            recommendations={recommendations} 
            issue={issue} 
          />
        </TabsContent>
        
        <TabsContent value="related-systems">
          <RelatedSystemsTab 
            healthData={healthData}
            currentIssue={issue}
          />
        </TabsContent>
        
        <TabsContent value="data">
          <DataTab scannerComponents={scannerComponents} />
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
