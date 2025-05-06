export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Scan = {
  id: string;
  user_id: string;
  created_at: string;
  status: string;
};

export type CoherenceData = {
  id: string;
  scan_id: string;
  score: number;
  message?: string;
  created_at: string;
};

export type HealthIssue = {
  id: string;
  scan_id: string;
  name: string;
  description: string;
  load: number;
  created_at: string;
  recommendations?: string[];
  detailed_info?: string;
  specific_advice?: {
    diet: string;
    lifestyle: string;
    supplements: string;
  };
};

export type ScannerComponent = {
  id: string;
  issue_id: string;
  category: string;
  name: string;
  level: number;
  created_at: string;
};

export type IssueRecommendation = {
  id: string;
  issue_id: string;
  recommendation: string;
  created_at: string;
};

export type IssueDetail = {
  id: string;
  issue_id: string;
  title: string;
  description: string;
  impact: number;
  created_at: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  message: string;
  is_user: boolean;
  created_at: string;
  context: any | null;
};
