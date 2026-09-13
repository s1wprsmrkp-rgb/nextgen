import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoGuideBar } from './components/DemoGuideBar';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginView } from './components/LoginView';
import { SignUpView } from './components/SignUpView';
import { RegistrationDashboardView } from './components/RegistrationDashboardView';
import { OnboardingFlow } from './components/OnboardingFlow';
import { TalentDashboard } from './components/TalentDashboard';
import { PortfolioView } from './components/PortfolioView';
import { AIAnalysisView } from './components/AIAnalysisView';
import { TalentPassportView } from './components/TalentPassportView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { OpportunityDetailView } from './components/OpportunityDetailView';
import { ProviderDashboard } from './components/ProviderDashboard';
import { CreateOpportunityView } from './components/CreateOpportunityView';
import { MatchingTalentView } from './components/MatchingTalentView';
import { CandidatePassportModal } from './components/CandidatePassportModal';
import { TalentProfile } from './types';

const MainAppContent: React.FC = () => {
  const { currentView, allTalents, selectedTalentId } = useApp();
  const [modalTalent, setModalTalent] = useState<TalentProfile | null>(null);

  const handleOpenPassportModal = (talent: TalentProfile) => {
    setModalTalent(talent);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginView />;
      case 'signup':
        return <SignUpView />;
      case 'registration-dashboard':
        return <RegistrationDashboardView />;
      case 'onboarding':
        return <OnboardingFlow />;
      case 'talent-dashboard':
        return <TalentDashboard />;
      case 'portfolio':
        return <PortfolioView />;
      case 'ai-analysis':
        return <AIAnalysisView />;
      case 'talent-passport':
        // If a specific talent candidate was selected, display their passport; otherwise display Rahul's
        const chosenTalent = allTalents.find(t => t.id === selectedTalentId);
        return <TalentPassportView customTalent={chosenTalent} />;
      case 'opportunities':
        return <OpportunitiesView />;
      case 'opportunity-detail':
        return <OpportunityDetailView />;
      case 'provider-dashboard':
        return <ProviderDashboard onOpenPassportModal={handleOpenPassportModal} />;
      case 'create-opportunity':
        return <CreateOpportunityView />;
      case 'provider-talents':
        return <MatchingTalentView onOpenPassportModal={handleOpenPassportModal} />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-sky-100 selection:text-sky-900">
      {/* Interactive Demo Flow Guide Bar */}
      <DemoGuideBar />

      {/* Global Application Navbar */}
      <Navbar />

      {/* Dynamic View Engine */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Global Candidate Passport Modal */}
      <CandidatePassportModal
        talent={modalTalent}
        isOpen={!!modalTalent}
        onClose={() => setModalTalent(null)}
      />

      {/* Standard Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-slate-900 text-white font-black text-[10px] flex items-center justify-center">
              TB
            </div>
            <span className="font-semibold text-slate-700">TalentBridge</span>
            <span>— Where Talent Meets Opportunity</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Evidence-backed matching engine • Profile Confidence indicates supporting data, not human potential
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
