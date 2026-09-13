import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserRole,
  TalentProfile,
  Opportunity,
  Application,
  Invitation,
  Evidence,
  TalentCategory,
  UserAccount,
  RegistrationMetrics,
} from '../types';
import {
  SAMPLE_TALENT_RAHUL,
  SAMPLE_OTHER_TALENTS,
  SAMPLE_OPPORTUNITIES,
  INITIAL_APPLICATIONS,
  INITIAL_REGISTERED_USERS,
} from '../data/mockData';
import { calculateMatchScore } from '../services/matching';
import { analyzeTalentProfile } from '../services/ai';

export type AppView =
  | 'landing'
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'registration-dashboard'
  | 'talent-dashboard'
  | 'talent-profile'
  | 'portfolio'
  | 'talent-passport'
  | 'opportunities'
  | 'opportunity-detail'
  | 'ai-analysis'
  | 'provider-dashboard'
  | 'provider-opportunities'
  | 'provider-talents'
  | 'create-opportunity';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  registeredUsers: UserAccount[];
  registrationMetrics: RegistrationMetrics;
  authMessage: string | null;
  setAuthMessage: (msg: string | null) => void;
  login: (identifier: string, role: UserRole) => boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; otp: string; message: string }>;
  verifyOtpAndLogin: (
    phone: string,
    otp: string,
    role: UserRole,
    customName?: string
  ) => { success: boolean; error?: string };
  logout: () => void;
  registerUser: (params: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    titleOrOrg?: string;
    category?: TalentCategory | 'Organization / Scout';
    location?: string;
  }) => UserAccount;
  switchUser: (userId: string) => void;
  simulateNewRegistration: (customRole?: UserRole, customCategory?: string) => UserAccount;
  talentProfile: TalentProfile;
  setTalentProfile: React.Dispatch<React.SetStateAction<TalentProfile>>;
  allTalents: TalentProfile[];
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  applications: Application[];
  invitations: Invitation[];
  selectedOpportunityId: string | null;
  setSelectedOpportunityId: (id: string | null) => void;
  selectedTalentId: string | null;
  setSelectedTalentId: (id: string | null) => void;
  isAnalyzingAI: boolean;
  aiAnalysisCompleted: boolean;
  triggerAIAnalysis: () => Promise<void>;
  addEvidence: (evidence: Omit<Evidence, 'id' | 'date'>) => void;
  updateProfile: (updates: Partial<TalentProfile>) => void;
  applyToOpportunity: (oppId: string, note?: string) => boolean;
  toggleSaveOpportunity: (oppId: string) => void;
  createOpportunity: (newOpp: Omit<Opportunity, 'id' | 'isDemo' | 'applicantCount'>) => string;
  inviteTalent: (talentId: string, oppId: string, message: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('talent');
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // Registered users persistent registry
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('tb_registered_users');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_REGISTERED_USERS;
  });

  // Track whether user has active verified session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tb_is_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Current logged in user (null if not authenticated)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const isAuth = localStorage.getItem('tb_is_authenticated') === 'true';
      if (isAuth) {
        const saved = localStorage.getItem('tb_current_user');
        if (saved) return JSON.parse(saved);
        return INITIAL_REGISTERED_USERS[0];
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const isAuth = localStorage.getItem('tb_is_authenticated') === 'true';
      const savedView = localStorage.getItem('tb_current_view') as AppView;
      if (savedView) return savedView;
      if (isAuth) {
        const savedUser = localStorage.getItem('tb_current_user');
        if (savedUser) {
          const u = JSON.parse(savedUser);
          return u.role === 'provider' ? 'provider-dashboard' : 'talent-dashboard';
        }
      }
    } catch {
      // fallback
    }
    return 'landing';
  });

  // Active OTP storage: map cleanPhone -> { otp, expiresAt }
  const [pendingOtps, setPendingOtps] = useState<Record<string, { otp: string; expiresAt: number }>>({});

  const [talentProfile, setTalentProfile] = useState<TalentProfile>(() => {
    const saved = localStorage.getItem('tb_talent_profile');
    return saved ? JSON.parse(saved) : SAMPLE_TALENT_RAHUL;
  });

  const [allTalents, setAllTalents] = useState<TalentProfile[]>(() => {
    return SAMPLE_OTHER_TALENTS;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('tb_opportunities');
    return saved ? JSON.parse(saved) : SAMPLE_OPPORTUNITIES;
  });

  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>([]);

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('tb_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>('opp-music-01');
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>('talent-rahul-01');
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiAnalysisCompleted, setAiAnalysisCompleted] = useState(false);

  // Sync users to local storage
  useEffect(() => {
    try {
      localStorage.setItem('tb_registered_users', JSON.stringify(registeredUsers));
    } catch {
      // ignore
    }
  }, [registeredUsers]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('tb_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('tb_current_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('tb_is_authenticated', isAuthenticated ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem('tb_current_view', currentView);
    } catch {
      // ignore
    }
  }, [currentView]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('tb_talent_profile', JSON.stringify(talentProfile));
    } catch {
      // ignore
    }
  }, [talentProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('tb_opportunities', JSON.stringify(opportunities));
    } catch {
      // ignore
    }
  }, [opportunities]);

  useEffect(() => {
    try {
      localStorage.setItem('tb_applications', JSON.stringify(applications));
    } catch {
      // ignore
    }
  }, [applications]);

  // Real-time Registration Metrics computation
  const registrationMetrics: RegistrationMetrics = useMemo(() => {
    const total = registeredUsers.length;
    const talents = registeredUsers.filter(u => u.role === 'talent');
    const providers = registeredUsers.filter(u => u.role === 'provider');

    // Count categories
    const catMap: Record<string, number> = {
      Sports: 0,
      Music: 0,
      Coding: 0,
      Film: 0,
      Dance: 0,
      'Art & Design': 0,
    };
    registeredUsers.forEach(u => {
      const cat = u.category || (u.role === 'provider' ? 'Organization / Scout' : 'General');
      catMap[cat] = (catMap[cat] || 0) + 1;
    });

    const categoryDistribution = Object.entries(catMap)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / (total || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalUsers: total,
      totalRegistered: total,
      totalTalents: talents.length,
      talentCount: talents.length,
      totalProviders: providers.length,
      providerCount: providers.length,
      newToday: Math.min(total, 14),
      byCategory: catMap,
      categoryDistribution,
    };
  }, [registeredUsers]);

  // Helper to normalize phone numbers to clean digits
  const normalizeDigits = (val: string): string => {
    return val.replace(/\D/g, '');
  };

  // Send OTP to user's mobile number
  const sendOtp = async (phone: string): Promise<{ success: boolean; otp: string; message: string }> => {
    const digits = normalizeDigits(phone);
    if (digits.length < 7) {
      throw new Error('Please enter a valid mobile number with at least 10 digits.');
    }

    // Generate realistic 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    setPendingOtps(prev => ({
      ...prev,
      [digits]: { otp: generatedOtp, expiresAt },
    }));

    return {
      success: true,
      otp: generatedOtp,
      message: `SMS sent to ${phone}. Your verification OTP is: ${generatedOtp}`,
    };
  };

  // Verify OTP and establish authenticated session
  const verifyOtpAndLogin = (
    phone: string,
    enteredOtp: string,
    targetRole: UserRole,
    customName?: string
  ): { success: boolean; error?: string } => {
    const digits = normalizeDigits(phone);
    const pending = pendingOtps[digits];
    const trimmedOtp = enteredOtp.trim();

    // Universal test codes or matched active code
    const isCodeValid =
      trimmedOtp === '123456' ||
      trimmedOtp === '000000' ||
      (pending && pending.otp === trimmedOtp && pending.expiresAt > Date.now());

    if (!isCodeValid) {
      return {
        success: false,
        error: 'Invalid verification code. Please enter the 6-digit OTP shown in the SMS dispatch.',
      };
    }

    // Check if phone matches an existing registered user
    const existing = registeredUsers.find(u => {
      if (u.phone) {
        const uDigits = normalizeDigits(u.phone);
        if (uDigits === digits || uDigits.slice(-10) === digits.slice(-10)) return true;
      }
      return false;
    });

    if (existing) {
      setCurrentUser(existing);
      setIsAuthenticated(true);
      setRole(existing.role);

      if (existing.role === 'talent') {
        const matchedTalent = allTalents.find(
          t => (t.phone && normalizeDigits(t.phone) === digits) || t.email === existing.email
        );
        if (matchedTalent) {
          setTalentProfile(matchedTalent);
        }
        setCurrentView('talent-dashboard');
      } else {
        setCurrentView('provider-dashboard');
      }

      setAuthMessage(`Welcome back, ${existing.name}! Logged in successfully.`);
      return { success: true };
    }

    // New user registration via Phone + OTP
    const formattedPhone = phone.startsWith('+') ? phone : `+91 ${digits.slice(-10)}`;
    const displayName =
      customName?.trim() ||
      (targetRole === 'talent'
        ? `Talent Member (${digits.slice(-4)})`
        : `Provider Partner (${digits.slice(-4)})`);

    const newAccount: UserAccount = {
      id: `usr-${Date.now()}`,
      name: displayName,
      email: `${digits.slice(-10)}@mobile.talentbridge.in`,
      phone: formattedPhone,
      role: targetRole,
      avatarUrl:
        targetRole === 'talent'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=120&q=80',
      titleOrOrg: targetRole === 'talent' ? 'Verified Athlete & Talent' : 'Talent Scout / Provider',
      category: targetRole === 'talent' ? 'Sports' : 'Organization / Scout',
      location: 'India',
      registeredAt: 'Just now',
      verificationStatus: 'Evidence-backed',
      evidenceCount: targetRole === 'talent' ? 1 : undefined,
      profileConfidence: targetRole === 'talent' ? 82 : undefined,
    };

    setRegisteredUsers(prev => [newAccount, ...prev]);
    setCurrentUser(newAccount);
    setIsAuthenticated(true);
    setRole(targetRole);

    if (targetRole === 'talent') {
      const newProfile: TalentProfile = {
        id: `talent-${Date.now()}`,
        name: displayName,
        email: newAccount.email,
        phone: formattedPhone,
        talentTitle: 'Athlete & Emerging Talent',
        avatarUrl: newAccount.avatarUrl,
        location: 'India',
        categories: ['Sports'],
        experienceLevel: 'Intermediate',
        interests: ['Athletics', 'Track & Field', 'Competitions', 'Trials'],
        careerGoals: ['Find scouts', 'Get sponsorships', 'National trials'],
        profileConfidence: 82,
        skills: [
          {
            name: 'Sprint & Speed',
            level: 'Advanced',
            verification: 'Evidence-backed',
            endorsements: 8,
          },
          {
            name: 'Agility & Endurance',
            level: 'Intermediate',
            verification: 'Self-declared',
            endorsements: 4,
          },
        ],
        evidence: [
          {
            id: `ev-init-${Date.now()}`,
            title: 'Initial Athletic Performance Log & Timing Sheet',
            type: 'Achievement',
            description: 'Verified electronic timing run and training baseline record.',
            date: 'Just now',
            verificationStatus: 'Evidence-backed',
            fileMeta: 'Verified Mobile Baseline',
          },
        ],
        achievements: [],
        aiSummary: {
          primaryTalentTitle: 'Athlete & Emerging Talent',
          structuredSkills: ['Sprint & Speed', 'Agility & Endurance'],
          strengths: ['High physical discipline and verified baseline logs'],
          evidenceSummary: 'Candidate verified mobile registration with baseline speed trial evidence.',
          recommendedNextSteps: ['Upload state/national meet certificate', 'Run AI skill calibration'],
          recommendedOpportunityTypes: ['Competition', 'Scholarship', 'Mentorship'],
          coachNote: 'Strong athletic profile with potential for state and national trials.',
        },
      };

      setTalentProfile(newProfile);
      setAllTalents(prev => [newProfile, ...prev]);
      setCurrentView('talent-dashboard');
    } else {
      setCurrentView('provider-dashboard');
    }

    setAuthMessage(`Mobile verified! Welcome to TalentBridge, ${displayName}.`);
    return { success: true };
  };

  // Standard login handler supporting both Email and Phone
  const login = (identifier: string, targetRole: UserRole): boolean => {
    const trimmed = identifier.trim().toLowerCase();
    const digits = normalizeDigits(trimmed);

    const existing = registeredUsers.find(u => {
      if (u.email.toLowerCase() === trimmed) return true;
      if (u.phone && digits.length >= 7) {
        const uDigits = normalizeDigits(u.phone);
        if (uDigits === digits || uDigits.slice(-10) === digits.slice(-10)) return true;
      }
      return false;
    });

    if (existing) {
      setCurrentUser(existing);
      setIsAuthenticated(true);
      setRole(existing.role);
      if (existing.role === 'talent') {
        const matchedTalent = allTalents.find(
          t => t.email.toLowerCase() === existing.email.toLowerCase() || (t.phone && existing.phone && normalizeDigits(t.phone) === normalizeDigits(existing.phone))
        );
        if (matchedTalent) {
          setTalentProfile(matchedTalent);
        }
        setCurrentView('talent-dashboard');
      } else {
        setCurrentView('provider-dashboard');
      }
      setAuthMessage(`Logged in as ${existing.name}`);
      return true;
    }

    // Create session account if not found
    const newAccount: UserAccount = {
      id: `usr-${Date.now()}`,
      name: identifier.includes('@') ? identifier.split('@')[0] : `Member (${digits.slice(-4)})`,
      email: identifier.includes('@') ? trimmed : `${digits}@mobile.talentbridge.in`,
      phone: !identifier.includes('@') ? identifier : undefined,
      role: targetRole,
      avatarUrl: targetRole === 'talent'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=120&q=80',
      titleOrOrg: targetRole === 'talent' ? 'Verified Member' : 'Partner Organization',
      category: targetRole === 'talent' ? 'Sports' : 'Organization / Scout',
      location: 'India',
      registeredAt: 'Just now',
      verificationStatus: 'Self-declared',
      evidenceCount: 1,
      profileConfidence: 75,
    };

    setRegisteredUsers(prev => [newAccount, ...prev]);
    setCurrentUser(newAccount);
    setIsAuthenticated(true);
    setRole(targetRole);
    if (targetRole === 'talent') {
      setCurrentView('talent-dashboard');
    } else {
      setCurrentView('provider-dashboard');
    }
    setAuthMessage(`Signed in as ${newAccount.name}`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('tb_is_authenticated');
      localStorage.removeItem('tb_current_user');
      localStorage.setItem('tb_current_view', 'landing');
    } catch {
      // ignore
    }
    setRole('talent');
    setCurrentView('landing');
    setAuthMessage('You have been logged out successfully.');
  };

  // Register user
  const registerUser = ({
    name,
    email,
    phone,
    role: newRole,
    titleOrOrg,
    category,
    location,
  }: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    titleOrOrg?: string;
    category?: TalentCategory | 'Organization / Scout';
    location?: string;
  }): UserAccount => {
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim(),
      role: newRole,
      avatarUrl: newRole === 'talent'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=120&q=80',
      titleOrOrg: titleOrOrg?.trim() || (newRole === 'talent' ? 'Emerging Talent' : 'Talent Scout / Provider'),
      category: category || (newRole === 'talent' ? 'Sports' : 'Organization / Scout'),
      location: location?.trim() || 'India',
      registeredAt: 'Just now',
      verificationStatus: 'Evidence-backed',
      evidenceCount: newRole === 'talent' ? 1 : undefined,
      profileConfidence: newRole === 'talent' ? 78 : undefined,
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setRole(newRole);

    if (newRole === 'talent') {
      const newProfile: TalentProfile = {
        id: `talent-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        talentTitle: newUser.titleOrOrg,
        avatarUrl: newUser.avatarUrl,
        location: newUser.location,
        categories: [newUser.category === 'Organization / Scout' ? 'Sports' : (newUser.category as TalentCategory)],
        experienceLevel: 'Intermediate',
        interests: ['Competitions', 'Auditions', 'Sponsorships'],
        careerGoals: ['Get discovered', 'Find competitions'],
        profileConfidence: 78,
        skills: [
          { name: 'Core Discipline Skill', level: 'Intermediate', verification: 'Evidence-backed', endorsements: 1 }
        ],
        evidence: [],
        achievements: [],
        aiSummary: {
          primaryTalentTitle: newUser.titleOrOrg,
          structuredSkills: ['Core Discipline Skill'],
          strengths: ['Newly authenticated talent profile ready for evidence logging'],
          evidenceSummary: 'Initial profile created.',
          recommendedNextSteps: ['Upload first piece of evidence to boost confidence score'],
          recommendedOpportunityTypes: ['Competition', 'Audition'],
          coachNote: 'Welcome to TalentBridge! Upload your verified evidence to get matched.',
        }
      };
      setTalentProfile(newProfile);
      setAllTalents(prev => [newProfile, ...prev]);
    }

    setAuthMessage(`Account registered for ${newUser.name}. Logged in.`);
    return newUser;
  };

  // Switch between existing user accounts (e.g. testing as Rahul Kumar vs Rohan Sandhu athlete vs Apex Sports provider)
  const switchUser = (userId: string) => {
    const user = registeredUsers.find(u => u.id === userId);
    if (!user) return;

    setCurrentUser(user);
    setIsAuthenticated(true);
    setRole(user.role);

    // If switching to a talent
    const matchedTalent = allTalents.find(
      t => t.id === user.id || t.email === user.email || (t.phone && user.phone && normalizeDigits(t.phone) === normalizeDigits(user.phone))
    );
    if (matchedTalent) {
      setTalentProfile(matchedTalent);
    }

    if (user.role === 'talent') {
      setCurrentView('talent-dashboard');
    } else {
      setCurrentView('provider-dashboard');
    }

    setAuthMessage(`Switched session to ${user.name} (${user.role})`);
  };

  // Simulate new registration for the dashboard watcher
  const simulateNewRegistration = (customRole?: UserRole, customCategory?: string): UserAccount => {
    const isProvider = customRole ? customRole === 'provider' : Math.random() > 0.7;
    const talentNames = ['Aarav Singh', 'Manish Gill', 'Deepika Rao', 'Suraj Yadav', 'Neha Choudhury', 'Karthik Balan'];
    const providerNames = ['National Olympic Cell', 'Vanguard Youth Sports Academy', 'Indie Records Lab', 'TechBuilders Inc'];

    const chosenName = isProvider
      ? providerNames[Math.floor(Math.random() * providerNames.length)]
      : talentNames[Math.floor(Math.random() * talentNames.length)];

    const categories: TalentCategory[] = ['Sports', 'Music', 'Coding', 'Film', 'Dance', 'Art & Design'];
    const chosenCategory = customCategory || (isProvider ? 'Organization / Scout' : categories[Math.floor(Math.random() * categories.length)]);

    const simulatedUser: UserAccount = {
      id: `usr-sim-${Date.now()}`,
      name: chosenName,
      email: `${chosenName.toLowerCase().replace(/\s+/g, '.')}@talentbridge.org`,
      role: isProvider ? 'provider' : 'talent',
      avatarUrl: isProvider
        ? 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=120&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      titleOrOrg: isProvider ? 'Talent Scouting Board' : `${chosenCategory} Emerging Athlete & Creator`,
      category: chosenCategory as any,
      location: 'New Delhi / Bengaluru',
      registeredAt: 'Just now',
      verificationStatus: 'Institution verified',
      evidenceCount: isProvider ? undefined : 2,
      profileConfidence: isProvider ? undefined : 86,
    };

    setRegisteredUsers(prev => [simulatedUser, ...prev]);
    return simulatedUser;
  };


  const triggerAIAnalysis = async () => {
    setIsAnalyzingAI(true);
    setAiAnalysisCompleted(false);
    try {
      const result = await analyzeTalentProfile(talentProfile);
      setTalentProfile(prev => ({
        ...prev,
        profileConfidence: result.profileConfidence,
        aiSummary: result.aiSummary,
      }));
      setAiAnalysisCompleted(true);
    } catch (err) {
      console.error('AI Analysis failed', err);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const addEvidence = (item: Omit<Evidence, 'id' | 'date'>) => {
    const newEvidence: Evidence = {
      ...item,
      id: `ev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    setTalentProfile(prev => {
      const updatedEvidence = [newEvidence, ...prev.evidence];
      // Automatically enhance profile confidence slightly when new evidence is added
      const newConfidence = Math.min(96, prev.profileConfidence + 3);
      return {
        ...prev,
        evidence: updatedEvidence,
        profileConfidence: newConfidence,
      };
    });
  };

  const updateProfile = (updates: Partial<TalentProfile>) => {
    setTalentProfile(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const applyToOpportunity = (oppId: string, note?: string): boolean => {
    const existing = applications.find(a => a.opportunityId === oppId && a.talentId === talentProfile.id);
    if (existing) return false;

    const opp = opportunities.find(o => o.id === oppId);
    if (!opp) return false;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunityId: oppId,
      talentId: talentProfile.id,
      talentName: talentProfile.name,
      talentTitle: talentProfile.talentTitle,
      opportunityTitle: opp.title,
      providerName: opp.provider,
      status: 'Submitted',
      submittedAt: 'Just now',
      note: note || 'Application submitted with verified Talent Passport.',
    };

    setApplications(prev => [newApp, ...prev]);
    // increment applicant count on opportunity
    setOpportunities(prev =>
      prev.map(o => (o.id === oppId ? { ...o, applicantCount: o.applicantCount + 1 } : o))
    );
    return true;
  };

  const toggleSaveOpportunity = (oppId: string) => {
    setSavedOpportunityIds(prev =>
      prev.includes(oppId) ? prev.filter(id => id !== oppId) : [...prev, oppId]
    );
  };

  const createOpportunity = (
    newOpp: Omit<Opportunity, 'id' | 'isDemo' | 'applicantCount'>
  ): string => {
    const id = `opp-custom-${Date.now()}`;
    const opp: Opportunity = {
      ...newOpp,
      id,
      isDemo: true,
      applicantCount: 0,
    };
    setOpportunities(prev => [opp, ...prev]);
    return id;
  };

  const inviteTalent = (talentId: string, oppId: string, message: string) => {
    const opp = opportunities.find(o => o.id === oppId) || opportunities[0];
    const targetTalent = allTalents.find(t => t.id === talentId) || talentProfile;

    const invitation: Invitation = {
      id: `inv-${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      providerName: opp.provider,
      talentId,
      talentName: targetTalent.name,
      message,
      sentAt: 'Just now',
      status: 'Invited',
    };

    setInvitations(prev => [invitation, ...prev]);
  };

  const resetDemoData = () => {
    setTalentProfile(SAMPLE_TALENT_RAHUL);
    setOpportunities(SAMPLE_OPPORTUNITIES);
    setApplications(INITIAL_APPLICATIONS);
    setSavedOpportunityIds([]);
    setInvitations([]);
    setRole('talent');
    setCurrentView('landing');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentView,
        setCurrentView,
        currentUser,
        isAuthenticated,
        registeredUsers,
        registrationMetrics,
        authMessage,
        setAuthMessage,
        login,
        sendOtp,
        verifyOtpAndLogin,
        logout,
        registerUser,
        switchUser,
        simulateNewRegistration,
        talentProfile,
        setTalentProfile,
        allTalents,
        opportunities,
        savedOpportunityIds,
        applications,
        invitations,
        selectedOpportunityId,
        setSelectedOpportunityId,
        selectedTalentId,
        setSelectedTalentId,
        isAnalyzingAI,
        aiAnalysisCompleted,
        triggerAIAnalysis,
        addEvidence,
        updateProfile,
        applyToOpportunity,
        toggleSaveOpportunity,
        createOpportunity,
        inviteTalent,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
