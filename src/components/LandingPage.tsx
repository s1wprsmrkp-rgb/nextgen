import React from 'react';
import { useApp } from '../context/AppContext';
import { TalentCategory } from '../types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileCheck2,
  Briefcase,
  Search,
  Music,
  Dumbbell,
  Film,
  Camera,
  Palette,
  Code,
  GraduationCap,
  Mic2,
  Flame,
  Rocket,
  LogOut,
  UserCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setCurrentView,
    setRole,
    isAuthenticated,
    currentUser,
    logout
  } = useApp();

  const categories: { name: TalentCategory; icon: any; count: number; desc: string }[] = [
    { name: 'Music', icon: Music, count: 28, desc: 'Vocalists, instrumentalists, songwriters & composers' },
    { name: 'Sports', icon: Dumbbell, count: 19, desc: 'Track & field, team sports, martial arts & endurance' },
    { name: 'Film', icon: Film, count: 14, desc: 'Cinematographers, documentary directors & screenwriters' },
    { name: 'Photography', icon: Camera, count: 22, desc: 'Photojournalism, portraiture, editorial & nature' },
    { name: 'Art & Design', icon: Palette, count: 31, desc: 'Visual arts, digital illustration, UI/UX & sculptors' },
    { name: 'Coding', icon: Code, count: 45, desc: 'Open source contributors, hackers & systems engineers' },
    { name: 'Teaching', icon: GraduationCap, count: 12, desc: 'Curriculum creators, peer tutors & educators' },
    { name: 'Public Speaking', icon: Mic2, count: 16, desc: 'Debaters, keynote speakers & policy orators' },
    { name: 'Dance', icon: Flame, count: 20, desc: 'Classical, contemporary, hip-hop & choreography' },
    { name: 'Entrepreneurship & Innovation', icon: Rocket, count: 24, desc: 'Student founders, social ventures & builders' },
  ];

  const steps = [
    {
      number: '1',
      title: 'Showcase',
      description: 'Upload verifiable evidence of your abilities—recordings, code repositories, certified certificates, and project outcomes.',
      badge: 'Evidence-Based'
    },
    {
      number: '2',
      title: 'Build your Talent Passport',
      description: 'AI structures your competencies, verifies proof points, and issues an authenticated portable credential with verified confidence score.',
      badge: 'Verified Credential'
    },
    {
      number: '3',
      title: 'Discover opportunities',
      description: 'Get matched with relevant competitions, internships, auditions, scholarships, and collaborative research programs using 6-point matching.',
      badge: 'Smart Discovery'
    },
    {
      number: '4',
      title: 'Get discovered',
      description: 'Verified organizations, directors, and recruiters search evidence-backed passports and send direct audition or interview invitations.',
      badge: 'Direct Connect'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Value Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Evidence-Based Talent Matching • Not a Social Feed</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Your talent deserves to be discovered.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              Showcase what you can do. Let the right opportunity find you.
            </p>

            {/* CTAs */}
            {isAuthenticated && currentUser ? (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Logged in as <strong>{currentUser.name}</strong> ({currentUser.phone || currentUser.role})</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    id="landing-dashboard-btn"
                    onClick={() => {
                      setCurrentView(currentUser.role === 'talent' ? 'talent-dashboard' : 'provider-dashboard');
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <span>Open My {currentUser.role === 'talent' ? 'Talent' : 'Provider'} Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    id="landing-logout-btn"
                    onClick={() => logout()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-base border border-rose-200 shadow-2xs transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Log Out</span>
                  </button>

                  <button
                    id="landing-explore-opps-btn"
                    onClick={() => setCurrentView('opportunities')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-base transition-all cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-slate-500" />
                    <span>Explore Opportunities</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  id="landing-create-profile-btn"
                  onClick={() => {
                    setRole('talent');
                    setCurrentView('signup');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <span>Create My Talent Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="landing-signin-btn"
                  onClick={() => setCurrentView('login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-300 shadow-2xs transition-all cursor-pointer"
                >
                  <span>Sign In with Mobile OTP</span>
                </button>

                <button
                  id="landing-explore-opps-btn"
                  onClick={() => setCurrentView('opportunities')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-base transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-500" />
                  <span>Explore Opportunities</span>
                </button>
              </div>
            )}

            {/* Journey Flow Ribbon */}
            <div className="mt-14 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium text-slate-500">
              <span className="text-slate-400">Core Journey:</span>
              <span className="text-slate-800 font-semibold">Discover</span>
              <span>→</span>
              <span className="text-slate-800 font-semibold">Showcase</span>
              <span>→</span>
              <span className="text-slate-800 font-semibold">Analyze</span>
              <span>→</span>
              <span className="text-slate-800 font-semibold">Match</span>
              <span>→</span>
              <span className="text-slate-800 font-semibold">Connect</span>
              <span>→</span>
              <span className="text-slate-800 font-semibold">Grow</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Explanation */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
            How TalentBridge Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            A transparent 4-step pipeline that replaces superficial social followers with verified artifacts and smart opportunity matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-base flex items-center justify-center">
                    {step.number}
                  </span>
                  <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Talent Categories Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Explore Talent Categories
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-1">
                Evidence-based discovery across diverse creative, athletic, and intellectual disciplines.
              </p>
            </div>
            <button
              id="landing-view-all-opps-btn"
              onClick={() => setCurrentView('opportunities')}
              className="inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-800 font-semibold text-sm"
            >
              <span>View Active Calls</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() => {
                    setCurrentView('opportunities');
                  }}
                  className="group bg-slate-50 hover:bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-white group-hover:bg-sky-50 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-sky-600 transition-colors mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-sky-700 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium text-slate-500">
                    <span>{cat.count} Active Calls</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Evidence Distinction Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-sky-400 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authentic Verification Framework</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              Evidence Over Algorithms. Trust Over Vanity.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              TalentBridge validates your portfolio across five transparent tiers: Self-declared, Evidence-backed, Institution verified, Mentor verified, and Community recognition. Providers evaluate verified capability—not follower counts.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                id="landing-banner-passport-btn"
                onClick={() => {
                  setRole('talent');
                  setCurrentView('talent-passport');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all"
              >
                <FileCheck2 className="w-4 h-4 text-sky-600" />
                <span>Explore Verified Talent Passport</span>
              </button>
              <button
                id="landing-banner-provider-btn"
                onClick={() => {
                  setRole('provider');
                  setCurrentView('provider-dashboard');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
              >
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Organizations: Post Opportunity</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
