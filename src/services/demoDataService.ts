
import { supabase } from "@/integrations/supabase/client";
import { mockHealthIssues } from "@/data/mockData";

// Demo user ID to use when not authenticated
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

// Helper function to get the current user ID or fallback to demo user
const getUserId = async (): Promise<string> => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || DEMO_USER_ID;
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
