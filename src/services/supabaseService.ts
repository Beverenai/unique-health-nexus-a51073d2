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
        score: 63
      });

    // Add health issues
    const healthIssues = [
      {
        scan_id: scanId,
        name: 'Tungmetaller (Miljøgiftbelastning)',
        description: 'Indikasjoner på bly- og thalliumfrekvenser kan påvirke nervesystemet og energinivået negativt.',
        load: 26
      },
      {
        scan_id: scanId,
        name: 'Tarmflora (Parasittbelastning)',
        description: 'Tegn på parasittbelastning som påvirker immunsystemet og næringsopptaket.',
        load: 24
      },
      {
        scan_id: scanId,
        name: 'Stressnivå og søvnforstyrrelser (Koherensbrudd)',
        description: 'Høy energetisk forstyrrelse som indikerer systemisk stress som påvirker både søvnkvalitet og restitusjon.',
        load: 21
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

      // Add recommendations based on the issue
      if (issue.name.includes('Tungmetaller')) {
        await supabase.from('issue_recommendations').insert([
          { issue_id: issueId, recommendation: 'Støtt avgiftningsprosessen med antioksidanter og mineraltilskudd' },
          { issue_id: issueId, recommendation: 'Øk inntaket av koriander, spirulina og klorofyll-rike matvarer' },
          { issue_id: issueId, recommendation: 'Bruk sauna regelmessig for å eliminere tungmetaller gjennom svette' }
        ]);
        
        await supabase.from('issue_details').insert([
          { issue_id: issueId, title: 'Blyverdier', description: 'Forhøyede frekvenser av bly kan påvirke nervesystemet og kognitiv funksjon', impact: 28 },
          { issue_id: issueId, title: 'Thallium', description: 'Spor av thallium kan forstyrre energiproduksjon i cellene', impact: 25 },
          { issue_id: issueId, title: 'Avgiftningskapasitet', description: 'Redusert kapasitet til å eliminere tungmetaller gjennom lever og nyrer', impact: 22 }
        ]);
        
        await supabase.from('scanner_components').insert([
          { issue_id: issueId, category: 'Tungmetaller', name: 'Bly.dsd', level: 26 },
          { issue_id: issueId, category: 'Tungmetaller', name: 'Thallium.dsd', level: 24 },
          { issue_id: issueId, category: 'Avgiftning', name: 'Glutathion.dsd', level: 18 },
          { issue_id: issueId, category: 'Avgiftning', name: 'Leverenzymer.dsd', level: 22 }
        ]);
      }
      else if (issue.name.includes('Tarmflora')) {
        await supabase.from('issue_recommendations').insert([
          { issue_id: issueId, recommendation: 'Styrk tarmfloraen med probiotika og prebiotiske fibre' },
          { issue_id: issueId, recommendation: 'Følg en antiparasittisk diett i 3-4 uker' },
          { issue_id: issueId, recommendation: 'Inkluder antiparasittiske urter som malurt og nellik i kostholdet' }
        ]);
        
        await supabase.from('issue_details').insert([
          { issue_id: issueId, title: 'Parasittaktivitet', description: 'Tegn på parasittbelastning i tynntarmen', impact: 25 },
          { issue_id: issueId, title: 'Tarmpermeabilitet', description: 'Lett økt tarmpermeabilitet ("lekk tarm") påvirker immunsystemet', impact: 23 },
          { issue_id: issueId, title: 'Næringsopptak', description: 'Redusert opptak av vitaminer og mineraler grunnet parasittbelastning', impact: 21 }
        ]);
        
        await supabase.from('scanner_components').insert([
          { issue_id: issueId, category: 'Parasitter', name: 'Blastocystis.dsd', level: 24 },
          { issue_id: issueId, category: 'Parasitter', name: 'Giardia.dsd', level: 19 },
          { issue_id: issueId, category: 'Tarmhelse', name: 'Zonulin.dsd', level: 23 },
          { issue_id: issueId, category: 'Tarmhelse', name: 'Sekretorisk IgA.dsd', level: 18 }
        ]);
      }
      else if (issue.name.includes('Stressnivå')) {
        await supabase.from('issue_recommendations').insert([
          { issue_id: issueId, recommendation: 'Fokuser på restitusjon og stresshåndtering med daglige pusteøvelser' },
          { issue_id: issueId, recommendation: 'Etabler en fast døgnrytme med leggetid senest kl. 23:00' },
          { issue_id: issueId, recommendation: 'Reduser eksponering for blått lys minst 2 timer før leggetid' }
        ]);
        
        await supabase.from('issue_details').insert([
          { issue_id: issueId, title: 'HRV', description: 'Redusert hjerterytmevariabilitet indikerer kronisk stressbelastning', impact: 22 },
          { issue_id: issueId, title: 'Søvnkvalitet', description: 'Forstyrret søvnarkitektur med redusert dyp søvn', impact: 20 },
          { issue_id: issueId, title: 'Kortisoldøgnrytme', description: 'Ubalansert kortisolproduksjon gjennom døgnet påvirker energinivået', impact: 19 }
        ]);
        
        await supabase.from('scanner_components').insert([
          { issue_id: issueId, category: 'Stresshormoner', name: 'Kortisol.dsd', level: 21 },
          { issue_id: issueId, category: 'Stresshormoner', name: 'Adrenalin.dsd', level: 19 },
          { issue_id: issueId, category: 'Nervesystem', name: 'HRV.dsd', level: 22 },
          { issue_id: issueId, category: 'Søvn', name: 'Melatonin.dsd', level: 17 }
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

    // Create historical scans (past 4 weeks) with the specified scores
    const today = new Date();
    const pastDates = [
      new Date(today.getTime() - (28 * 24 * 60 * 60 * 1000)), // 4 weeks ago
      new Date(today.getTime() - (21 * 24 * 60 * 60 * 1000)), // 3 weeks ago
      new Date(today.getTime() - (14 * 24 * 60 * 60 * 1000)), // 2 weeks ago
      new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000)),  // 1 week ago
    ];

    // Specified scores for historical data
    const scores = [49, 55, 61, 63];

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
      if (i === 0) {
        // 4 weeks ago - mainly stress and severe toxin issues
        await supabase
          .from('health_issues')
          .insert({
            scan_id: scanId,
            name: 'Tungmetaller (Miljøgiftbelastning)',
            description: 'Betydelig tungmetallbelastning i vev og organer.',
            load: 38
          });
      } else if (i === 1) {
        // 3 weeks ago - improving but still significant issues
        await supabase
          .from('health_issues')
          .insert({
            scan_id: scanId,
            name: 'Tungmetaller (Miljøgiftbelastning)',
            description: 'Moderat tungmetallbelastning under gradvis bedring.',
            load: 32
          });
      } else if (i === 2) {
        // 2 weeks ago - continued improvement
        await supabase
          .from('health_issues')
          .insert({
            scan_id: scanId,
            name: 'Tarmflora (Parasittbelastning)',
            description: 'Tegn på lett parasittbelastning og tarmflora i ubalanse.',
            load: 28
          });
      }
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
