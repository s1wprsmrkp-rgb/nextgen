export type UserRole = 'talent' | 'provider';

export type TalentCategory =
  | 'Music'
  | 'Sports'
  | 'Film'
  | 'Photography'
  | 'Art & Design'
  | 'Coding'
  | 'Teaching'
  | 'Public Speaking'
  | 'Dance'
  | 'Entrepreneurship & Innovation';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type OpportunityType =
  | 'Competition'
  | 'Internship'
  | 'Audition'
  | 'Scholarship'
  | 'Project'
  | 'Collaboration'
  | 'Workshop'
  | 'Mentorship';

export type VerificationStatus =
  | 'Self-declared'
  | 'Evidence-backed'
  | 'Institution verified'
  | 'Mentor verified'
  | 'Community recognition';

export type EvidenceType =
  | 'Video'
  | 'Audio'
  | 'Image'
  | 'Project'
  | 'Certificate'
  | 'Achievement'
  | 'External portfolio';

export interface Skill {
  name: string;
  level: ExperienceLevel;
  verification: VerificationStatus;
  category?: TalentCategory;
  endorsements?: number;
}

export interface Evidence {
  id: string;
  title: string;
  type: EvidenceType;
  description: string;
  date: string;
  verificationStatus: VerificationStatus;
  url?: string;
  fileMeta?: string;
  thumbnailUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  verificationStatus: VerificationStatus;
}

export interface AISummary {
  primaryTalentTitle: string;
  structuredSkills: string[];
  strengths: string[];
  evidenceSummary: string;
  recommendedNextSteps: string[];
  recommendedOpportunityTypes: string[];
  coachNote: string;
}

export interface TalentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  talentTitle: string;
  avatarUrl: string;
  location: string;
  categories: TalentCategory[];
  skills: Skill[];
  experienceLevel: ExperienceLevel;
  interests: string[];
  careerGoals: string[];
  evidence: Evidence[];
  achievements: Achievement[];
  profileConfidence: number; // 0-100 percentage
  aiSummary: AISummary;
}

export interface Opportunity {
  id: string;
  title: string;
  provider: string;
  providerLogo?: string;
  category: TalentCategory;
  type: OpportunityType;
  description: string;
  requirements: string[];
  requiredSkills: string[];
  experienceLevel: ExperienceLevel | 'Any';
  eligibility: string;
  location: string;
  remoteOnsite: 'Remote' | 'Onsite' | 'Hybrid';
  deadline: string;
  isDemo: boolean;
  stipendOrPrize?: string;
  applicantCount: number;
}

export interface MatchScoreDetails {
  percentage: number;
  skillScore: number;       // 30%
  categoryScore: number;    // 20%
  experienceScore: number;  // 15%
  eligibilityScore: number; // 15%
  locationScore: number;    // 10%
  interestScore: number;    // 10%
  reasons: string[];
  gaps?: string[];
}

export interface OpportunityMatch {
  opportunity: Opportunity;
  match: MatchScoreDetails;
}

export interface TalentMatch {
  talent: TalentProfile;
  match: MatchScoreDetails;
}

export interface Application {
  id: string;
  opportunityId: string;
  talentId: string;
  talentName: string;
  talentTitle: string;
  opportunityTitle: string;
  providerName: string;
  status: 'Submitted' | 'Under Review' | 'Invited' | 'Shortlisted';
  submittedAt: string;
  note?: string;
}

export interface Invitation {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  providerName: string;
  talentId: string;
  talentName: string;
  message: string;
  sentAt: string;
  status: 'Invited' | 'Accepted';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl: string;
  titleOrOrg: string;
  category: TalentCategory | 'Organization / Scout';
  location: string;
  registeredAt: string;
  verificationStatus: VerificationStatus;
  evidenceCount?: number;
  profileConfidence?: number;
}

export interface RegistrationMetrics {
  totalUsers: number;
  totalRegistered: number;
  totalTalents: number;
  talentCount: number;
  totalProviders: number;
  providerCount: number;
  newToday: number;
  byCategory: Record<string, number>;
  categoryDistribution: { category: string; count: number; percentage: number }[];
}

