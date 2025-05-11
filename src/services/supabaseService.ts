import { supabase } from "@/integrations/supabase/client";
import { HealthIssue, CoherenceData, IssueDetail, IssueRecommendation, ScannerComponent } from "@/types/supabase";
import { mockHealthIssues } from "@/data/mockData";

// Demo user ID to use when not authenticated
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

// Helper function to get the current user ID or fallback to demo user
const getUserId = async (): Promise<string> => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || DEMO_USER_ID;
};

export const getLatestCoherenceData = async (): Promise<CoherenceData | null> => {
  try {
    const { data: scans, error: scanError } = await supabase
      .from('scans')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);

    if (scanError || !scans || scans.length === 0) {
      console.error('Error fetching latest scan:', scanError);
      return null;
    }

    const latestScanId = scans[0].id;

    const { data, error } = await supabase
      .from('coherence_data')
      .select('*')
      .eq('scan_id', latestScanId)
      .single();

    if (error) {
      console.error('Error fetching coherence data:', error);
      return null;
    }

    return data as CoherenceData;
  } catch (error) {
    console.error('Error in getLatestCoherenceData:', error);
    return null;
  }
};

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

export const sendChatMessage = async (message: string, isUser = true): Promise<{success: boolean, data?: any}> => {
  try {
    const userId = await getUserId();
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ 
        user_id: userId,
        message,
        is_user: isUser,
        context: null
      })
      .select();

    if (error) {
      console.error('Error sending chat message:', error);
      return { success: false };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    return { success: false };
  }
};

export const getChatMessages = async (): Promise<any[]> => {
  try {
    const userId = await getUserId();
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getChatMessages:', error);
    return [];
  }
};

// Function to seed initial data for development
export const seedDemoData = async (): Promise<void> => {
  try {
    const userId = await getUserId();
    
    // Check if user already has data
    const { data: existingScans } = await supabase
      .from('scans')
      .select('id')
      .eq('user_id', userId);

    if (existingScans && existingScans.length > 0) {
      console.log('User already has scan data, skipping seed');
      return;
    }

    // Create a scan
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .insert({ user_id: userId, status: 'completed' })
      .select();

    if (scanError || !scan || scan.length === 0) {
      console.error('Error creating scan:', scanError);
      return;
    }

    const scanId = scan[0].id;

    // Add coherence data with score of 64%
    await supabase
      .from('coherence_data')
      .insert({
        scan_id: scanId,
        score: 64
      });

    // Add health issues based on mock data to ensure consistency
    const healthIssues = mockHealthIssues.map(mockIssue => ({
      scan_id: scanId,
      name: mockIssue.name,
      description: mockIssue.description,
      load: mockIssue.load
    }));

    const issuePromises = healthIssues.map(async (issue) => {
      const { data: createdIssue, error } = await supabase
        .from('health_issues')
        .insert(issue)
        .select();

      if (error || !createdIssue || createdIssue.length === 0) {
        console.error('Error creating health issue:', error);
        return null;
      }

      const issueId = createdIssue[0].id;

      // Add recommendations and details based on the issue type
      if (issue.name.includes('Tarmflora') || issue.name.includes('Bakteriell')) {
        await supabase.from('issue_recommendations').insert([
          { issue_id: issueId, recommendation: 'Spis mer fermentert mat og probiotika' },
          { issue_id: issueId, recommendation: 'Øk inntaket av fiberrike matvarer' },
          { issue_id: issueId, recommendation: 'Vurder å redusere inntak av prosessert mat' }
        ]);
        
        await supabase.from('issue_details').insert([
          { issue_id: issueId, title: 'Bakterielt mangfold', description: 'Redusert bakteriell diversitet i tarmfloraen', impact: 45 },
          { issue_id: issueId, title: 'Inflammasjon', description: 'Lett inflammatorisk respons i tarmslimhinnen', impact: 40 },
          { issue_id: issueId, title: 'Tarmpermeabilitet', description: 'Svakt forhøyet tarmpermeabilitet', impact: 35 }
        ]);
        
        await supabase.from('scanner_components').insert([
          { issue_id: issueId, category: 'Tarmflora', name: 'Bakteriell diversitet.dsd', level: 45 },
          { issue_id: issueId, category: 'Tarmflora', name: 'Inflammasjonsmarkører.dsd', level: 40 },
          { issue_id: issueId, category: 'Tarmhelse', name: 'Slimhinnefunksjon.dsd', level: 35 }
        ]);
      }
      else if (issue.name.includes('Hormonelle') || issue.name.includes('miljøgift')) {
        await supabase.from('issue_recommendations').insert([
          { issue_id: issueId, recommendation: 'Prioriter jevn søvnrytme og stressreduksjon' },
          { issue_id: issueId, recommendation: 'Vurder adaptogene urter som støtter binyrefunksjonen' },
          { issue_id: issueId, recommendation: 'Drikk nok vann og vurder adaptogener' }
        ]);
        
        await supabase.from('issue_details').insert([
          { issue_id: issueId, title: 'Kortisoldøgnrytme', description: 'Uregelmessig kortisolprofil gjennom døgnet', impact: 38 },
          { issue_id: issueId, title: 'Østrogennivåer', description: 'Moderat variasjon i østrogenaktivitet', impact: 35 },
          { issue_id: issueId, title: 'Hormonregulering', description: 'Påvirket regulering av stress- og kjønnshormoner', impact: 30 }
        ]);
        
        await supabase.from('scanner_components').insert([
          { issue_id: issueId, category: 'Hormoner', name: 'Kortisol.dsd', level: 38 },
          { issue_id: issueId, category: 'Hormoner', name: 'Østrogen.dsd', level: 35 },
          { issue_id: issueId, category: 'Regulering', name: 'Hypothalamus-hypofyse.dsd', level: 30 }
        ]);
      }
      else if (issue.name.includes('nervesystem') || issue.name.includes('sopp')) {
        await supabase.from('issue_recommendations').insert([
          { issue_id: issueId, recommendation: 'Fortsett med nåværende aktivitetsnivå og balansert livsstil' },
          { issue_id: issueId, recommendation: 'Vedlikehold god søvnhygiene' },
          { issue_id: issueId, recommendation: 'Oppretthold regelmessig bevegelse og fysisk aktivitet' }
        ]);
        
        await supabase.from('issue_details').insert([
          { issue_id: issueId, title: 'Nevrotransmittere', description: 'Balanserte nivåer av nevrotransmittere', impact: 15 },
          { issue_id: issueId, title: 'Stressrespons', description: 'God regulering av stressrespons', impact: 10 },
          { issue_id: issueId, title: 'HRV', description: 'Normal hjerterytmevariabilitet', impact: 12 }
        ]);
        
        await supabase.from('scanner_components').insert([
          { issue_id: issueId, category: 'Nervesystem', name: 'Serotonin-dopamin.dsd', level: 15 },
          { issue_id: issueId, category: 'Nervesystem', name: 'HRV.dsd', level: 12 },
          { issue_id: issueId, category: 'Stressaktivering', name: 'Sympatisk aktivering.dsd', level: 10 }
        ]);
      }

      return createdIssue[0];
    });

    await Promise.all(issuePromises);
    console.log('Demo data seeded successfully');
  } catch (error) {
    console.error('Error in seedDemoData:', error);
  }
};

// For demo purposes, seed historical data if none exists
export const seedHistoricalData = async (): Promise<void> => {
  try {
    const userId = await getUserId();
    
    // Check if user already has multiple scans
    const { data: existingScans, error: scanError } = await supabase
      .from('scans')
      .select('id')
      .eq('user_id', userId);

    if (scanError) {
      console.error('Error checking existing scans:', scanError);
      return;
    }

    if (existingScans && existingScans.length > 1) {
      console.log('User already has multiple scans, skipping historical seed');
      return;
    }

    // Check if there are already health check-ins
    const { data: existingCheckins, error: checkinsError } = await supabase
      .from('health_checkins')
      .select('id')
      .eq('user_id', userId);
      
    if (!checkinsError && existingCheckins && existingCheckins.length > 0) {
      console.log('User already has health check-ins, skipping seed');
      return;
    }

    // Create historical health check-ins (past 7 days)
    const today = new Date();
    const pastDates = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - i));
      return date;
    });

    // Random data for check-ins
    const randomCheckIns = pastDates.map((date, index) => ({
      user_id: userId,
      date: date.toISOString().split('T')[0],
      mood: Math.floor(Math.random() * 4) + 5, // 5-8 range
      energy_level: Math.floor(Math.random() * 5) + 4, // 4-8 range
      sleep_quality: Math.floor(Math.random() * 4) + 6, // 6-9 range
      pain_level: Math.floor(Math.random() * 3) + 1, // 1-3 range
      notes: index % 2 === 0 ? 'Følte meg bra i dag' : 'Litt sliten, men ellers ok'
    }));

    // Insert check-ins
    for (const checkIn of randomCheckIns) {
      await supabase.from('health_checkins').insert(checkIn);
    }

    // Create user plan if none exists
    const { data: existingPlans, error: plansError } = await supabase
      .from('user_plans')
      .select('id')
      .eq('user_id', userId);
      
    if (plansError || !existingPlans || existingPlans.length === 0) {
      // Create a plan
      const { data: planData, error: planError } = await supabase
        .from('user_plans')
        .insert({
          user_id: userId,
          title: 'Min Helseplan',
          description: 'Tilpasset helseplan basert på din siste skanning',
          status: 'active'
        })
        .select();

      if (planError || !planData || planData.length === 0) {
        console.error('Error creating user plan:', planError);
      } else {
        // Add recommendations to the plan
        const planId = planData[0].id;
        const recommendations = [
          { text: 'Drikk mer vann', category: 'Hydrasjon', priority: 'high' },
          { text: 'Ta en 20-minutters gåtur hver dag', category: 'Aktivitet', priority: 'medium' },
          { text: 'Meditere i 10 minutter', category: 'Mental Helse', priority: 'medium' },
          { text: 'Spis mer fermentert mat', category: 'Fordøyelse', priority: 'low' }
        ];
        
        for (const rec of recommendations) {
          await supabase
            .from('plan_recommendations')
            .insert({
              plan_id: planId,
              ...rec
            });
        }
      }
    }

    console.log('Dashboard demo data seeded successfully');
  } catch (error) {
    console.error('Error in seedDashboardData:', error);
  }
};

export const getHistoricalCoherenceData = async (): Promise<any[]> => {
  try {
    const userId = await getUserId();
    
    // First get all scans
    const { data: scans, error: scanError } = await supabase
      .from('scans')
      .select('id, created_at, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (scanError || !scans) {
      console.error('Error fetching scans:', scanError);
      return [];
    }

    // Now get coherence data for all scans
    const historicalData = await Promise.all(
      scans.map(async (scan) => {
        const { data: coherenceData, error: coherenceError } = await supabase
          .from('coherence_data')
          .select('score')
          .eq('scan_id', scan.id)
          .single();

        if (coherenceError || !coherenceData) {
          return {
            id: scan.id,
            date: scan.created_at,
            score: 0,
            status: scan.status
          };
        }

        return {
          id: scan.id,
          date: scan.created_at,
          score: coherenceData.score,
          status: scan.status
        };
      })
    );

    return historicalData.filter(data => data.score > 0);
  } catch (error) {
    console.error('Error in getHistoricalCoherenceData:', error);
    return [];
  }
};
