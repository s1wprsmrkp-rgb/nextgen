import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateMatchScore } from '../services/matching';
import { MatchBadge } from './MatchBadge';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Send,
  ShieldCheck,
  Building,
  Check,
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';

export const OpportunityDetailView: React.FC = () => {
  const {
    talentProfile,
    opportunities,
    selectedOpportunityId,
    savedOpportunityIds,
    toggleSaveOpportunity,
    applyToOpportunity,
    applications,
    setCurrentView
  } = useApp();

  const [applicationNote, setApplicationNote] = useState('');
  const [showApplySuccess, setShowApplySuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const opp = opportunities.find(o => o.id === selectedOpportunityId) || opportunities[0];
  const match = calculateMatchScore(talentProfile, opp);
  const isSaved = savedOpportunityIds.includes(opp.id);
  const hasApplied = applications.some(
    a => a.opportunityId === opp.id && a.talentId === talentProfile.id
  );

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      applyToOpportunity(opp.id, applicationNote);
      setIsApplying(false);
      setShowApplySuccess(true);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back navigation */}
        <div>
          <button
            onClick={() => setCurrentView('opportunities')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Opportunities</span>
          </button>
        </div>

        {/* Opportunity Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <img
                src={opp.providerLogo}
                alt={opp.provider}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-600">
                    {opp.provider}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-medium text-slate-500">
                    {opp.category}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-medium text-slate-500">
                    {opp.type}
                  </span>
                  {opp.isDemo && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Demo Opportunity
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {opp.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.location} ({opp.remoteOnsite})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Deadline: {opp.deadline}</span>
                  </span>
                  {opp.stipendOrPrize && (
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {opp.stipendOrPrize}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
              <MatchBadge percentage={match.percentage} size="lg" />
              <button
                onClick={() => toggleSaveOpportunity(opp.id)}
                className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                  isSaved
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* HERO SECTION: "Why you're a match" */}
          <div className="my-6 p-5 sm:p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Why you&apos;re a match ({match.percentage}%)
                </h2>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                6-Point Alignment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {match.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-medium text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            {match.gaps && match.gaps.length > 0 && (
              <div className="mt-4 pt-3 border-t border-emerald-200/60 text-xs text-slate-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Growth note: {match.gaps.join(' • ')}</span>
              </div>
            )}
          </div>

          {/* Description & Overview */}
          <div className="space-y-6 text-sm text-slate-700">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                About this Opportunity
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {opp.description}
              </p>
            </div>

            {/* Requirements Checklist */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Application Requirements
              </h3>
              <ul className="space-y-2">
                {opp.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></div>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills & Experience details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Required Skills & Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {opp.requiredSkills.map(skill => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Experience & Eligibility
                </h3>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Required Level:</strong> {opp.experienceLevel}</div>
                  <div><strong>Eligibility:</strong> {opp.eligibility}</div>
                  <div><strong>Format:</strong> {opp.remoteOnsite}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Action Section */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            {hasApplied || showApplySuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Application Submitted!</div>
                    <div className="text-xs text-emerald-800">
                      Your verified Talent Passport has been attached and sent to {opp.provider}.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView('talent-dashboard')}
                  className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-emerald-900 border border-emerald-300 hover:bg-emerald-100/50 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Submit Your Evidence-Backed Application
                    </h3>
                    <p className="text-xs text-slate-500">
                      Includes {talentProfile.name}&apos;s verified Passport ({talentProfile.profileConfidence}% confidence score, {talentProfile.evidence.length} evidence records).
                    </p>
                  </div>
                  <div className="text-xs text-slate-400 font-medium hidden sm:block">
                    Free & Direct Submission
                  </div>
                </div>

                <div>
                  <label htmlFor="application-note-textarea" className="block text-xs font-semibold text-slate-700 mb-1">
                    Applicant Note or Specific Portfolio Focus (Optional)
                  </label>
                  <textarea
                    id="application-note-textarea"
                    rows={2}
                    value={applicationNote}
                    onChange={(e) => setApplicationNote(e.target.value)}
                    placeholder="Highlight specific videos, recordings, or credentials relevant to this call..."
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => toggleSaveOpportunity(opp.id)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    {isSaved ? 'Saved to Favorites' : 'Save for Later'}
                  </button>

                  <button
                    id="apply-now-btn"
                    disabled={isApplying}
                    onClick={handleApply}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isApplying ? 'Submitting Application...' : 'Apply Now with Talent Passport'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
