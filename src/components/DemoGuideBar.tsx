import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Briefcase,
  BarChart3,
  LogIn,
  LogOut,
  Layers,
  Activity,
  UserPlus
} from 'lucide-react';

export const DemoGuideBar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    role,
    setRole,
    currentUser,
    isAuthenticated,
    registrationMetrics,
    logout,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);

  const navigationHub = [
    { label: 'Landing Discovery', view: 'landing' as AppView, targetRole: 'talent' },
    { label: 'Sign In Portal', view: 'login' as AppView, targetRole: 'talent' },
    { label: 'Register Account', view: 'signup' as AppView, targetRole: 'talent' },
    { label: 'Live Registrations Tracker', view: 'registration-dashboard' as AppView, targetRole: 'talent' },
    { label: 'Talent Dashboard', view: 'talent-dashboard' as AppView, targetRole: 'talent' },
    { label: 'Evidence Portfolio', view: 'portfolio' as AppView, targetRole: 'talent' },
    { label: 'AI Evidence Calibration', view: 'ai-analysis' as AppView, targetRole: 'talent' },
    { label: 'Talent Passport', view: 'talent-passport' as AppView, targetRole: 'talent' },
    { label: 'Opportunities Feed', view: 'opportunities' as AppView, targetRole: 'talent' },
    { label: 'Provider Match Hub', view: 'provider-dashboard' as AppView, targetRole: 'provider' },
    { label: 'Matching Candidates', view: 'provider-talents' as AppView, targetRole: 'provider' },
    { label: 'Post Opportunity', view: 'create-opportunity' as AppView, targetRole: 'provider' },
  ];

  const handleHubClick = (item: typeof navigationHub[0]) => {
    setRole(item.targetRole as any);
    setCurrentView(item.view);
  };

  return (
    <aside aria-label="Platform Live Bar" className="bg-slate-950 text-white border-b border-slate-800 text-xs px-3 sm:px-6 py-2 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Live status & active profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold text-[11px] border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>TalentBridge Live Network</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-300 text-[11px]">
            <span>Active session:</span>
            <span className="font-bold text-white flex items-center gap-1">
              {role === 'talent' ? (
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
              ) : (
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              )}
              {currentUser?.name || (role === 'talent' ? 'Rohan Verma (Athlete)' : 'Horizon Foundation')}
            </span>
          </div>
        </div>

        {/* Right: Real-Time Tracker button, Login / Switch, Role switcher & Shortcuts */}
        <div className="flex items-center gap-2">
          {/* Live Registration Telemetry Counter Button */}
          <button
            id="bar-registration-tracker-btn"
            onClick={() => setCurrentView('registration-dashboard')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950 hover:bg-sky-900 border border-sky-600/40 text-sky-300 font-semibold text-xs transition-colors shadow-2xs"
            title="Watch real-time user registrations"
          >
            <Activity className="w-3 h-3 text-sky-400" />
            <span>{registrationMetrics.totalRegistered} Registered</span>
          </button>

          {/* Quick Sign In or Log Out */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <button
                id="bar-switch-btn"
                onClick={() => setCurrentView('login')}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer"
                title="Switch to another user"
              >
                <span>Switch</span>
              </button>
              <button
                id="bar-logout-btn"
                onClick={() => logout()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/90 hover:bg-rose-900 border border-rose-700/60 text-rose-200 font-medium text-xs transition-colors cursor-pointer shadow-2xs"
                title="Sign out of current account"
              >
                <LogOut className="w-3 h-3 text-rose-400" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button
              id="bar-login-btn"
              onClick={() => setCurrentView('login')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-950 hover:bg-sky-900 border border-sky-700/70 text-sky-200 font-medium text-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-3 h-3 text-sky-400" />
              <span>Sign In (Mobile OTP)</span>
            </button>
          )}

          {/* Quick role toggle */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button
              id="bar-role-talent-btn"
              onClick={() => {
                setRole('talent');
                if (currentView.startsWith('provider')) setCurrentView('talent-dashboard');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                role === 'talent' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Talent View
            </button>
            <button
              id="bar-role-provider-btn"
              onClick={() => {
                setRole('provider');
                setCurrentView('provider-dashboard');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                role === 'provider' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Provider View
            </button>
          </div>

          <button
            id="bar-toggle-navhub-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs"
          >
            <Layers className="w-3 h-3 text-slate-400" />
            <span className="hidden md:inline">Platform Views</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto pt-2.5 pb-1 border-t border-slate-800 mt-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {navigationHub.map((item, idx) => {
              const isActive = currentView === item.view && role === item.targetRole;
              return (
                <button
                  key={idx}
                  onClick={() => handleHubClick(item)}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    isActive
                      ? 'bg-sky-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
