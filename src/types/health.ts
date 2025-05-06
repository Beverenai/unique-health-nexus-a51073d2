
export interface HealthIssue {
  id: string;
  name: string;
  description: string;
  load: number; // 0-100%
  recommendations: string[];
  details?: HealthDetail[];
}

export interface HealthDetail {
  id: string;
  title: string;
  description: string;
  impact: number; // 0-100%
}

export interface CoherenceData {
  score: number; // 0-100%
  issues: HealthIssue[];
}
