import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateMatchScore } from '../services/matching';
import { MatchBadge } from './MatchBadge';
import { VerificationBadge } from './VerificationBadge';
import {
  FileCheck2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Briefcase,
  FolderGit2,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Trophy
} from 'lucide-react';

export const TalentDashboard: React.FC = () => {
  const {
    talentProfile,
    opportunities,
    setCurrentView,
    setSelectedOpportunityId,
    applications
  } = useApp();

  // Calculate matches for all opportunities
  const opportunitiesWithMatch = opportunities.map(opp => {
    const match = calculateMatchScore(talentProfile, opp);
    return { opp, match };
  });

  // Sort by match percentage descending
  opportunitiesWithMatch.sort((a, b) => b.match.percentage - a.match.percentage);

  const topMatches = opportunitiesWithMatch.slice(0, 4);

  const handleOpenOpportunity = (oppId: string) => {
    setSelectedOpportunityId(oppId);
    setCurrentView('opportunity-detail');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Talent Portal
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Welcome back, {talentProfile.name}
            </h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Your verified skills are actively matching with opportunities across India & remote programs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="dash-add-evidence-btn"
              onClick={() => setCurrentView('portfolio')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              <FolderGit2 className="w-4 h-4 text-sky-600" />
              <span>Manage Portfolio ({talentProfile.evidence.length})</span>
            </button>
            <button
              id="dash-view-passport-btn"
              onClick={() => setCurrentView('talent-passport')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-sky-400" />
              <span>Talent Passport</span>
            </button>
          </div>
        </div>

        {/* Top Two Highlight Cards: Passport Summary & AI Talent Coach */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Talent Passport Summary Card (Span 2) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <img
                    src={talentProfile.avatarUrl}
                    alt={talentProfile.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {talentProfile.name}
                    </h2>
                    <div className="text-xs sm:text-sm font-semibold text-sky-700">
                      {talentProfile.talentTitle}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{talentProfile.location}</span>
                      <span>•</span>
                      <span>Level: {talentProfile.experienceLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-3 text-right">
                  <div className="text-[11px] font-bold text-sky-800 uppercase">Profile Confidence</div>
                  <div className="text-2xl font-black text-sky-950">{talentProfile.profileConfidence}%</div>
                  <div className="text-[10px] text-slate-500">Based on {talentProfile.evidence.length} verified artifacts</div>
                </div>
              </div>

              {/* Skills summary chips */}
              <div className="pt-4">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Verified Skills on Passport
                </div>
                <div className="flex flex-wrap gap-2">
                  {talentProfile.skills.map(s => (
                    <div
                      key={s.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
                    >
                      <span>{s.name}</span>
                      <span className="text-[10px] text-slate-500">({s.level})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Evidence verified by {talentProfile.evidence.filter(e => e.verificationStatus !== 'Self-declared').length} external references
              </span>
              <button
                onClick={() => setCurrentView('talent-passport')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-900"
              >
                <span>Open Full Passport</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Talent Coach Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-white/10 text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-300" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    AI Talent Coach
                  </span>
                  <div className="text-xs text-slate-300">Personalized Capability Insights</div>
                </div>
              </div>

              <div className="space-y-3 mt-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
                <p className="p-3 bg-white/5 rounded-xl border border-white/10 font-medium">
                  &ldquo;Your strongest areas are <strong className="text-white">Vocal Performance</strong> and <strong className="text-white">Songwriting</strong>.&rdquo;
                </p>

                <p className="p-3 bg-white/5 rounded-xl border border-white/10">
                  &ldquo;Your next recommended action is to <strong className="text-emerald-300">upload one original composition or studio session</strong> to reach 90%+ profile confidence.&rdquo;
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10">
              <button
                onClick={() => setCurrentView('portfolio')}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Upload Evidence Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Opportunities Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Recommended Opportunities
              </h2>
              <p className="text-xs text-slate-500">
                Matched based on 60% skills & category, plus experience, eligibility, and location.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('opportunities')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800"
            >
              <span>View All ({opportunities.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {topMatches.map(({ opp, match }) => {
              const hasApplied = applications.some(a => a.opportunityId === opp.id && a.talentId === talentProfile.id);
              return (
                <div
                  key={opp.id}
                  onClick={() => handleOpenOpportunity(opp.id)}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Provider & Match Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={opp.providerLogo}
                          alt={opp.provider}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-700">{opp.provider}</div>
                          <div className="text-[11px] text-slate-400">{opp.category} • {opp.type}</div>
                        </div>
                      </div>

                      <MatchBadge percentage={match.percentage} size="md" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors mb-2">
                      {opp.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {opp.description}
                    </p>

                    {/* Why this matches snippet */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Top Match Factors
                      </div>
                      <div className="space-y-1">
                        {match.reasons.slice(0, 2).map((reason, idx) => (
                          <div key={idx} className="text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{opp.location}</span>
                      </span>
                      <span>•</span>
                      <span>Deadline: {opp.deadline}</span>
                    </div>

                    {hasApplied ? (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                        Applied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-sky-700 group-hover:translate-x-0.5 transition-transform">
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Applied Opportunities Tracker */}
        {applications.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-sky-600" />
              <span>Active Submissions & Applications ({applications.length})</span>
            </h3>
            <div className="divide-y divide-slate-100">
              {applications.map(app => (
                <div key={app.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{app.opportunityTitle}</div>
                    <div className="text-xs text-slate-500">{app.providerName} • Submitted {app.submittedAt}</div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 self-start sm:self-auto">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
