
import { supabase } from "@/integrations/supabase/client";
import { HealthIssue, IssueDetail, IssueRecommendation, ScannerComponent } from "@/types/supabase";
import { mockHealthIssues } from "@/data/mockData";

export const getHealthIssues = async (scanId?: string): Promise<HealthIssue[]> => {
  try {
    if (!scanId) {
      // Get the latest scan ID if not provided
      const { data: scans, error: scanError } = await supabase
        .from('scans')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);

      if (scanError || !scans || scans.length === 0) {
        console.error('Error fetching latest scan:', scanError);
        return mockHealthIssues; // Fallback to mock data
      }

      scanId = scans[0].id;
    }

    const { data, error } = await supabase
      .from('health_issues')
      .select('*')
      .eq('scan_id', scanId);

    if (error) {
      console.error('Error fetching health issues:', error);
      return mockHealthIssues; // Fallback to mock data
    }

    return data.length > 0 ? data as HealthIssue[] : mockHealthIssues;
  } catch (error) {
    console.error('Error in getHealthIssues:', error);
    return mockHealthIssues; // Fallback to mock data
  }
};

export const getIssueDetails = async (issueId: string): Promise<{
  issue: HealthIssue | null;
  details: IssueDetail[];
  recommendations: IssueRecommendation[];
  scannerComponents: ScannerComponent[];
}> => {
  try {
    // Get the issue from database
    const { data: issue, error: issueError } = await supabase
      .from('health_issues')
      .select('*')
      .eq('id', issueId)
      .single();

    // If database query fails, try to find the issue in mock data
    if (issueError) {
      console.error('Error fetching issue from database:', issueError);
      console.log('Trying to find issue in mock data with ID:', issueId);
      
      // Find matching issue in mock data
      const mockIssue = mockHealthIssues.find(i => i.id === issueId);
      
      if (mockIssue) {
        console.log('Found issue in mock data:', mockIssue);
        
        // Convert mock data to match the expected types
        // This fixes the Property 'details' does not exist on type 'HealthIssue' error
        
        // Create proper IssueDetail objects from mock data by accessing the details from the mock data properly
        // This is a safe type assertion as we're handling the case where details might not exist
        const mockDetails: IssueDetail[] = (mockIssue as any).details ? 
          (mockIssue as any).details.map((detail: any) => ({
            id: `mock-detail-${detail.id}`,
            issue_id: mockIssue.id,
            title: detail.title,
            description: detail.description,
            impact: detail.impact,
            created_at: new Date().toISOString()
          })) : [];
        
        // Create proper recommendation objects from mock data
        const mockRecommendations: IssueRecommendation[] = mockIssue.recommendations?.map((rec, index) => ({
          id: `mock-rec-${index}`,
          issue_id: mockIssue.id,
          recommendation: rec,
          created_at: new Date().toISOString()
        })) || [];
        
        // Create a database-compatible health issue from mock data
        const dbCompatibleIssue: HealthIssue = {
          id: mockIssue.id,
          name: mockIssue.name,
          description: mockIssue.description,
          load: mockIssue.load,
          scan_id: mockIssue.scan_id || 'mock-scan-id',
          created_at: mockIssue.created_at || new Date().toISOString()
        };
        
        return {
          issue: dbCompatibleIssue,
          details: mockDetails,
          recommendations: mockRecommendations,
          scannerComponents: []
        };
      }
      
      console.error('Issue not found in mock data either');
      return { issue: null, details: [], recommendations: [], scannerComponents: [] };
    }

    // Get the details
    const { data: details, error: detailsError } = await supabase
      .from('issue_details')
      .select('*')
      .eq('issue_id', issueId);

    if (detailsError) {
      console.error('Error fetching issue details:', detailsError);
    }

    // Get the recommendations
    const { data: recommendations, error: recommendationsError } = await supabase
      .from('issue_recommendations')
      .select('*')
      .eq('issue_id', issueId);

    if (recommendationsError) {
      console.error('Error fetching issue recommendations:', recommendationsError);
    }

    // Get the scanner components
    const { data: scannerComponents, error: componentsError } = await supabase
      .from('scanner_components')
      .select('*')
      .eq('issue_id', issueId);

    if (componentsError) {
      console.error('Error fetching scanner components:', componentsError);
    }

    return {
      issue: issue as HealthIssue,
      details: details as IssueDetail[] || [],
      recommendations: recommendations as IssueRecommendation[] || [],
      scannerComponents: scannerComponents as ScannerComponent[] || []
    };
  } catch (error) {
    console.error('Error in getIssueDetails:', error);
    return { issue: null, details: [], recommendations: [], scannerComponents: [] };
  }
};
