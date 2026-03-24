export interface SkillAnalysis {
  skill: string;
  status: 'present' | 'missing' | 'partial';
  evidence: string;
}

export interface PathwayCourse {
  title: string;
  domain: string;
  level: string;
  duration: string;
  reasoning: string;
  days_saved: number;
}

export interface ReasoningTrace {
  approach: string;
  skipped_courses: string[];
  confidence: number;
  total_days_saved: number;
}

export interface CandidateSummary {
  name: string;
  experience_years: string;
  domains: string[];
}

export interface AnalysisResponse {
  readiness_score: number;
  skills_analysis: SkillAnalysis[];
  pathway: PathwayCourse[];
  reasoning_trace: ReasoningTrace;
  candidate_summary: CandidateSummary;
}
