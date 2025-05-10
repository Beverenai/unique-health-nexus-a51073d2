
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
      description: "Din tarmflora påvirker hormonbalansen"
    });
  }
  
  if (muskelIssue && nervesystemIssue) {
    connections.push({
      from: "Muskelsystem", 
      to: "Nervesystem",
      description: "Muskelproblemer påvirker nervesystemet"
    });
  }

  if (hormonIssue && nervesystemIssue) {
    connections.push({
      from: "Hormonsystem",
      to: "Nervesystem",
      description: "Hormonell ubalanse påvirker nervesystemet"
    });
  }
  
  // Add new connections based on the mock health issues
  if (tarmIssue && immunIssue) {
    connections.push({
      from: "Fordøyelsessystem",
      to: "Immunsystem",
      description: "Bakteriell ubalanse påvirker immunforsvaret"
    });
  }
  
  if (nervesystemIssue && immunIssue) {
    connections.push({
      from: "Nervesystem",
      to: "Immunsystem",
      description: "Miljøgifter påvirker immunforsvarets funksjon"
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
      description: "Bakteriell ubalanse reduserer kroppens evne til å håndtere miljøgifter"
    });
  }
  
  if (soppIssue && bakteriellIssue) {
    connections.push({
      from: "Immunsystem",
      to: "Fordøyelsessystem",
      description: "Soppbelastning og bakteriell ubalanse påvirker hverandre negativt"
    });
  }
  
  return connections;
};
