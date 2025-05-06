
import { supabase } from "@/integrations/supabase/client";
import { HealthIssue, CoherenceData, IssueDetail, IssueRecommendation, ScannerComponent } from "@/types/supabase";

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
        return [];
      }

      scanId = scans[0].id;
    }

    const { data, error } = await supabase
      .from('health_issues')
      .select('*')
      .eq('scan_id', scanId);

    if (error) {
      console.error('Error fetching health issues:', error);
      return [];
    }

    return data as HealthIssue[];
  } catch (error) {
    console.error('Error in getHealthIssues:', error);
    return [];
  }
};

export const getIssueDetails = async (issueId: string): Promise<{
  issue: HealthIssue | null;
  details: IssueDetail[];
  recommendations: IssueRecommendation[];
  scannerComponents: ScannerComponent[];
}> => {
  // Get the issue
  const { data: issue, error: issueError } = await supabase
    .from('health_issues')
    .select('*')
    .eq('id', issueId)
    .single();

  if (issueError) {
    console.error('Error fetching issue:', issueError);
    return { issue: null, details: [], recommendations: [], scannerComponents: [] };
  }

  // Get the details
  const { data: details, error: detailsError } = await supabase
    .from('issue_details')
    .select('*')
    .eq('issue_id', issueId);

  if (detailsError) {
    console.error('Error fetching issue details:', detailsError);
    return { issue: issue as HealthIssue, details: [], recommendations: [], scannerComponents: [] };
  }

  // Get the recommendations
  const { data: recommendations, error: recommendationsError } = await supabase
    .from('issue_recommendations')
    .select('*')
    .eq('issue_id', issueId);

  if (recommendationsError) {
    console.error('Error fetching issue recommendations:', recommendationsError);
    return { 
      issue: issue as HealthIssue, 
      details: details as IssueDetail[] || [], 
      recommendations: [],
      scannerComponents: []
    };
  }

  // Get the scanner components
  const { data: scannerComponents, error: componentsError } = await supabase
    .from('scanner_components')
    .select('*')
    .eq('issue_id', issueId);

  if (componentsError) {
    console.error('Error fetching scanner components:', componentsError);
    return {
      issue: issue as HealthIssue,
      details: details as IssueDetail[] || [],
      recommendations: recommendations as IssueRecommendation[] || [],
      scannerComponents: []
    };
  }

  return {
    issue: issue as HealthIssue,
    details: details as IssueDetail[] || [],
    recommendations: recommendations as IssueRecommendation[] || [],
    scannerComponents: scannerComponents as ScannerComponent[] || []
  };
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

    // Add coherence data
    await supabase
      .from('coherence_data')
      .insert({
        scan_id: scanId,
        score: 75
      });

    // Add health issues
    const healthIssues = [
      {
        scan_id: scanId,
        name: 'Stress',
        description: 'Høye stressnivåer påvirker flere kroppssystemer negativt. Langvarig stress kan føre til nedsatt immunforsvar, fordøyelsesproblemer og økt risiko for hjerte- og karsykdommer.',
        load: 78
      },
      {
        scan_id: scanId,
        name: 'Søvnkvalitet',
        description: 'Din søvnkvalitet er under optimalt nivå. Dette kan påvirke din kognitive funksjon, metabolisme og generell velvære.',
        load: 65
      },
      {
        scan_id: scanId,
        name: 'Vitamin D Mangel',
        description: 'Dine vitamin D-nivåer er lavere enn anbefalt. Vitamin D er viktig for immunforsvar, benhelse og generell velvære.',
        load: 52
      }
    ];

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

      // Add recommendations for this issue
      if (issue.name === 'Stress') {
        await supabase.from('issue_recommendations').insert([
          { issue_id: issueId, recommendation: 'Praktiser daglig meditasjon eller pusteøvelser i 10-15 minutter' },
          { issue_id: issueId, recommendation: 'Reduser koffeininntak, spesielt etter kl 14:00' },
          { issue_id: issueId, recommendation: 'Sett av tid til regelmessig fysisk aktivitet, minst 30 minutter daglig' }
        ]);
        
        // Add details for stress
        await supabase.from('issue_details').insert([
          { issue_id: issueId, title: 'Kortisolnivå', description: 'Ditt kortisolnivå er forhøyet, noe som indikerer kronisk stress', impact: 85 },
          { issue_id: issueId, title: 'HRV (Hjerterytmevariabilitet)', description: 'Redusert HRV indikerer at kroppen er i en konstant stresstilstand', impact: 72 },
          { issue_id: issueId, title: 'Søvnkvalitet', description: 'Stress påvirker din søvn negativt, spesielt REM-søvnfasen', impact: 68 }
        ]);
      }
      else if (issue.name === 'Søvnkvalitet') {
        await supabase.from('issue_recommendations').insert([
          { issue_id: issueId, recommendation: 'Etabler en fast rutine for leggetid og oppvåkning' },
          { issue_id: issueId, recommendation: 'Unngå skjermbruk minst 1 time før leggetid' },
          { issue_id: issueId, recommendation: 'Hold soverommet mørkt, svalt og stille' }
        ]);
        
        // Add details for sleep
        await supabase.from('issue_details').insert([
          { issue_id: issueId, title: 'Søvneffektivitet', description: 'Tiden du tilbringer i sengen vs. faktisk søvntid er ikke optimal', impact: 70 },
          { issue_id: issueId, title: 'Dyp søvn', description: 'Din andel av dyp søvn er under det anbefalte nivået', impact: 65 },
          { issue_id: issueId, title: 'Søvnsykluser', description: 'Du gjennomgår færre komplette søvnsykluser enn ideelt', impact: 60 }
        ]);
      }
      else if (issue.name === 'Vitamin D Mangel') {
        await supabase.from('issue_recommendations').insert([
          { issue_id: issueId, recommendation: 'Ta et vitamin D-tilskudd på 1000-2000 IE daglig' },
          { issue_id: issueId, recommendation: 'Få 15-30 minutter med sollys daglig når mulig' },
          { issue_id: issueId, recommendation: 'Inkluder vitamin D-rike matvarer som fet fisk og egg i kostholdet' }
        ]);
        
        // Add details for vitamin D
        await supabase.from('issue_details').insert([
          { issue_id: issueId, title: 'Serum 25(OH)D nivå', description: 'Ditt blodnivå av vitamin D er under optimal verdi', impact: 60 },
          { issue_id: issueId, title: 'Kalsiumopptak', description: 'Lavt vitamin D påvirker kroppens evne til å absorbere kalsium', impact: 50 },
          { issue_id: issueId, title: 'Immunfunksjon', description: 'Vitamin D-mangel kan påvirke immunforsvarets effektivitet', impact: 45 }
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

    // Create historical scans (past 4 weeks)
    const today = new Date();
    const pastDates = [
      new Date(today.getTime() - (28 * 24 * 60 * 60 * 1000)), // 4 weeks ago
      new Date(today.getTime() - (21 * 24 * 60 * 60 * 1000)), // 3 weeks ago
      new Date(today.getTime() - (14 * 24 * 60 * 60 * 1000)), // 2 weeks ago
      new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000)),  // 1 week ago
    ];

    // Start with scores in the 50s, gradually improving
    const scores = [52, 58, 65, 70];

    for (let i = 0; i < pastDates.length; i++) {
      // Create a scan
      const { data: scan, error: scanError } = await supabase
        .from('scans')
        .insert({ 
          user_id: userId, 
          status: 'completed',
          created_at: pastDates[i].toISOString()
        })
        .select();

      if (scanError || !scan || scan.length === 0) {
        console.error(`Error creating historical scan ${i}:`, scanError);
        continue;
      }

      const scanId = scan[0].id;

      // Add coherence data
      await supabase
        .from('coherence_data')
        .insert({
          scan_id: scanId,
          score: scores[i]
        });

      // Add one health issue for this historical scan
      await supabase
        .from('health_issues')
        .insert({
          scan_id: scanId,
          name: 'Stress',
          description: 'Høye stressnivåer påvirker flere kroppssystemer negativt.',
          load: 80 - (i * 5) // Gradually decreasing stress levels
        });
    }

    console.log('Historical data seeded successfully');
  } catch (error) {
    console.error('Error in seedHistoricalData:', error);
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
