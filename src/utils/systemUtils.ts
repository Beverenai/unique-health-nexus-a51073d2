
import { HealthIssue } from '@/types/supabase';
import { Connection } from '@/components/insight/ConnectionList';

export const findIssueByType = (issues: HealthIssue[], keyword: string): HealthIssue | undefined => {
  return issues.find(issue => 
    issue.name.toLowerCase().includes(keyword.toLowerCase()) ||
    issue.description.toLowerCase().includes(keyword.toLowerCase())
  );
};

export const getSystemConnections = (issues: HealthIssue[]): Connection[] => {
  const connections: Connection[] = [];
  
  // Find issues by broader categories to match our mock data
  const tarmIssue = findIssueByType(issues, "tarmflora") || 
                   findIssueByType(issues, "tarm") ||
                   findIssueByType(issues, "bakteriell") ||
                   findIssueByType(issues, "fordøyelse");
  
  const hormonIssue = findIssueByType(issues, "hormon");
  
  const muskelIssue = findIssueByType(issues, "kompresjon") || 
                      findIssueByType(issues, "nakkevirvler") ||
                      findIssueByType(issues, "muskel");
  
  const nervesystemIssue = findIssueByType(issues, "nervesystem") || 
                          findIssueByType(issues, "miljøgift") ||
                          findIssueByType(issues, "tungmetall");
  
  const immunIssue = findIssueByType(issues, "immun") || 
                    findIssueByType(issues, "sopp");
  
  // Add connections based on found issues
  if (tarmIssue && hormonIssue) {
    connections.push({
      from: "Fordøyelsessystem",
      to: "Hormonsystem",
      description: "Tarmmikrobiota påvirker produksjonen og reguleringen av flere hormoner, inkludert stresshormonet kortisol"
    });
  }
  
  if (muskelIssue && nervesystemIssue) {
    connections.push({
      from: "Muskelsystem", 
      to: "Nervesystem",
      description: "Spenninger i muskulaturen kan skape press på nerverøtter og forårsake smerte og dysfunksjon"
    });
  }

  if (hormonIssue && nervesystemIssue) {
    connections.push({
      from: "Hormonsystem",
      to: "Nervesystem",
      description: "Hormoner som kortisol og adrenalin påvirker nervesystemets funksjon og stressrespons"
    });
  }
  
  // Add new connections based on the mock health issues
  if (tarmIssue && immunIssue) {
    connections.push({
      from: "Fordøyelsessystem",
      to: "Immunsystem",
      description: "Over 70% av immunsystemet er lokalisert i tarmveggen, og tarmfloraen spiller en nøkkelrolle i immunregulering"
    });
  }
  
  if (nervesystemIssue && immunIssue) {
    connections.push({
      from: "Nervesystem",
      to: "Immunsystem",
      description: "Nervesystemet kommuniserer med immunsystemet via nevroimmunologiske forbindelser og påvirker immunresponsen"
    });
  }
  
  // Add specific connections for our mock data
  const bakteriellIssue = findIssueByType(issues, "bakteriell");
  const miljøgiftIssue = findIssueByType(issues, "miljøgift");
  const soppIssue = findIssueByType(issues, "sopp");
  
  if (bakteriellIssue && miljøgiftIssue) {
    connections.push({
      from: "Fordøyelsessystem",
      to: "Detox-system",
      description: "Bakteriell ubalanse reduserer kroppens evne til å håndtere og eliminere miljøgifter"
    });
  }
  
  if (soppIssue && bakteriellIssue) {
    connections.push({
      from: "Immunsystem",
      to: "Fordøyelsessystem",
      description: "Soppbelastning og bakteriell ubalanse skaper en negativ feedback-loop som svekker begge systemer"
    });
  }
  
  // Add a connection between digestive and nervous system
  if (tarmIssue && nervesystemIssue) {
    connections.push({
      from: "Fordøyelsessystem", 
      to: "Nervesystem",
      description: "Tarmen produserer over 90% av kroppens serotonin, en nevrotransmitter som påvirker humør og nervefunksjon"
    });
  }

  // Make sure we always have at least one connection for demonstration purposes
  if (connections.length === 0) {
    connections.push({
      from: "Nervesystem", 
      to: "Fordøyelsessystem",
      description: "Vagusnerven fra nervesystemet kommuniserer direkte med mage-tarmkanalen og påvirker fordøyelsen"
    });
  }
  
  return connections;
};
