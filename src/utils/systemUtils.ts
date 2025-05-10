
import { HealthIssue } from '@/types/supabase';
import { Connection } from '@/components/insight/ConnectionList';

export const findIssueByType = (issues: HealthIssue[], keyword: string): HealthIssue | undefined => {
  return issues.find(issue => 
    issue.name.toLowerCase().includes(keyword.toLowerCase())
  );
};

export const getSystemConnections = (issues: HealthIssue[]): Connection[] => {
  const connections: Connection[] = [];
  
  const tarmIssue = findIssueByType(issues, "tarmflora") || findIssueByType(issues, "tarm");
  const hormonIssue = findIssueByType(issues, "hormon");
  const muskelIssue = findIssueByType(issues, "kompresjon") || findIssueByType(issues, "nakkevirvler");
  const nervesystemIssue = findIssueByType(issues, "nervesystem");
  
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
      description: "Nakkeproblemer påvirker nervesystemet"
    });
  }

  if (hormonIssue && nervesystemIssue) {
    connections.push({
      from: "Hormonsystem",
      to: "Nervesystem",
      description: "Hormonell ubalanse påvirker nervesystemet"
    });
  }
  
  return connections;
};
