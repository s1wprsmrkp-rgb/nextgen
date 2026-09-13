import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  Compass,
  Briefcase,
  FolderGit2,
  FileCheck2,
  User,
  Menu,
  X,
  Sparkles,
  PlusCircle,
  Users,
  Bell,
  ArrowRight,
  Activity,
  LogIn,
  LogOut,
  BarChart3
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentView,
    setCurrentView,
    talentProfile,
    applications,
    opportunities,
    currentUser,
    isAuthenticated,
    registrationMetrics,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const talentNavItems = [
    { id: 'talent-dashboard' as AppView, label: 'Dashboard', icon: Compass },
    { id: 'opportunities' as AppView, label: 'Opportunities', icon: Briefcase },
    { id: 'portfolio' as AppView, label: 'Portfolio', icon: FolderGit2 },
    { id: 'talent-passport' as AppView, label: 'Talent Passport', icon: FileCheck2, highlight: true },
    { id: 'registration-dashboard' as AppView, label: 'Registrations', icon: BarChart3 },
    { id: 'talent-profile' as AppView, label: 'Profile', icon: User },
  ];

  const providerNavItems = [
    { id: 'provider-dashboard' as AppView, label: 'Dashboard', icon: Compass },
    { id: 'provider-opportunities' as AppView, label: 'Opportunities', icon: Briefcase },
    { id: 'provider-talents' as AppView, label: 'Find Talent', icon: Users, highlight: true },
    { id: 'registration-dashboard' as AppView, label: 'Registrations', icon: BarChart3 },
    { id: 'talent-profile' as AppView, label: 'Org Profile', icon: User },
  ];

  const navItems = role === 'talent' ? talentNavItems : providerNavItems;

  const currentDisplayName = currentUser?.name || (role === 'talent' ? talentProfile.name : 'Horizon Foundation');
  const currentDisplayAvatar = currentUser?.avatarUrl || talentProfile.avatarUrl;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-[37px] z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-5">
            <button
              id="navbar-brand-btn"
              onClick={() => navigate('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:scale-105 transition-transform">
                TB
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-lg tracking-tight leading-none group-hover:text-sky-700 transition-colors">
                  TalentBridge
                </div>
                <div className="text-[11px] text-slate-500 font-medium tracking-wide">
                  Where Talent Meets Opportunity
                </div>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => navigate(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    } ${item.highlight ? 'text-sky-700' : ''}`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.highlight && !isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Live Registration Telemetry Indicator */}
            <button
              id="navbar-live-registrations-btn"
              onClick={() => navigate('registration-dashboard')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                currentView === 'registration-dashboard'
                  ? 'bg-sky-50 text-sky-800 border-sky-300 ring-1 ring-sky-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Watch live app registrations"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden lg:inline">Live Registrations:</span>
              <span className="font-bold text-slate-900">{registrationMetrics.totalRegistered}</span>
            </button>

            {role === 'provider' ? (
              <button
                id="navbar-post-opportunity-btn"
                onClick={() => navigate('create-opportunity')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Opportunity</span>
              </button>
            ) : (
              <button
                id="navbar-ai-analyze-btn"
                onClick={() => navigate('ai-analysis')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-all"
                title="Run AI Talent Verification & Skill Calibration"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Calibration</span>
              </button>
            )}

            {/* Auth Actions: Sign in or User profile + Logout button */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  id="navbar-user-profile-btn"
                  onClick={() => navigate('talent-profile')}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer"
                  title="View your verified profile"
                >
                  <img
                    src={currentDisplayAvatar}
                    alt={currentDisplayName}
                    className="w-8 h-8 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div className="hidden xl:block text-xs">
                    <div className="font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                      {currentDisplayName}
                    </div>
                    <div className="text-slate-500 text-[10px] capitalize flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{currentUser.phone || (role === 'talent' ? 'Verified Talent' : 'Provider')}</span>
                    </div>
                  </div>
                </button>

                {/* Prominent Logout Option */}
                <button
                  id="navbar-logout-btn"
                  onClick={() => logout()}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 shadow-2xs transition-all cursor-pointer"
                  title="Sign out of your session"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                id="navbar-login-btn"
                onClick={() => navigate('login')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                  currentView === 'login'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-sky-600" />
                <span>Mobile OTP Login</span>
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="navbar-mobile-reg-btn"
              onClick={() => navigate('registration-dashboard')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{registrationMetrics.totalRegistered}</span>
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="p-2.5 mb-2 bg-slate-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={currentDisplayAvatar}
                alt={currentDisplayName}
                className="w-8 h-8 rounded-xl object-cover"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">{currentDisplayName}</span>
                <span className="text-[10px] text-slate-500 capitalize">
                  {isAuthenticated ? (currentUser?.phone || 'Authenticated Session') : 'Guest Session'}
                </span>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                id="mobile-nav-logout-btn"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('login')}
                className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 mt-2 space-y-2">
            <button
              onClick={() => navigate('registration-dashboard')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
            >
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Watch Live Registrations ({registrationMetrics.totalRegistered})</span>
            </button>

            {isAuthenticated ? (
              <button
                id="mobile-nav-logout-bottom-btn"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Log Out of Session</span>
              </button>
            ) : (
              <button
                id="mobile-nav-login-bottom-btn"
                onClick={() => navigate('login')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-sky-400" />
                <span>Sign In with Mobile & OTP</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

