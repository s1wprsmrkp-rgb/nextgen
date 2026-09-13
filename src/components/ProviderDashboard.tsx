import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalentProfile, Opportunity } from '../types';
import { calculateMatchScore } from '../services/matching';
import { MatchBadge } from './MatchBadge';
import { VerificationBadge } from './VerificationBadge';
import {
  PlusCircle,
  Briefcase,
  Users,
  FileCheck2,
  Send,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Calendar,
  Building,
  Check
} from 'lucide-react';

interface ProviderDashboardProps {
  onOpenPassportModal?: (talent: TalentProfile) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ onOpenPassportModal }) => {
  const {
    opportunities,
    allTalents,
    talentProfile,
    applications,
    invitations,
    inviteTalent,
    setCurrentView,
    setSelectedTalentId
  } = useApp();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<TalentProfile | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [selectedOppId, setSelectedOppId] = useState<string>(opportunities[0]?.id || '');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Combine sample candidates pool
  const candidatePool = allTalents;

  // Compute matches relative to provider's primary active opportunity (e.g. music fellowship or custom posted)
  const activeOpp = opportunities.find(o => o.category === 'Music') || opportunities[0];

  const scoredCandidates = candidatePool.map(talent => {
    const match = calculateMatchScore(talent, activeOpp);
    return { talent, match };
  });

  scoredCandidates.sort((a, b) => b.match.percentage - a.match.percentage);

  const handleOpenInvite = (talent: TalentProfile) => {
    setSelectedCandidate(talent);
    setInviteMessage(
      `Hello ${talent.name}, we reviewed your verified Talent Passport and would like to formally invite you to audition/apply for our active opportunity.`
    );
    setSelectedOppId(activeOpp.id);
    setInviteSuccess(false);
    setInviteModalOpen(true);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    inviteTalent(selectedCandidate.id, selectedOppId, inviteMessage);
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteModalOpen(false);
      setInviteSuccess(false);
    }, 1200);
  };

  const handleViewPassport = (talent: TalentProfile) => {
    setSelectedTalentId(talent.id);
    if (onOpenPassportModal) {
      onOpenPassportModal(talent);
    } else {
      setCurrentView('talent-passport');
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Strip & Hero Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">
                Provider Hub
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Apex Horizons Foundation
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Provider Dashboard
            </h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Discover verified emerging talent, track applicant submissions, and extend direct audition invites.
            </p>
          </div>

          <button
            id="provider-hero-post-opp-btn"
            onClick={() => setCurrentView('create-opportunity')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ Post Opportunity</span>
          </button>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>Active Opportunities</span>
              <Briefcase className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {opportunities.length}
            </div>
            <div className="text-[11px] text-emerald-600 mt-1 font-medium">
              Across 10 categories
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>Applications Received</span>
              <FileCheck2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {applications.length + 38}
            </div>
            <div className="text-[11px] text-sky-600 mt-1 font-medium">
              {applications.length} verified submissions today
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>Recommended Talent</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {scoredCandidates.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              High confidence passports
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
              <span>Potential Matches</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-700">
              47
            </div>
            <div className="text-[11px] text-amber-600 mt-1 font-medium">
              Score &gt;= 75% in active category
            </div>
          </div>
        </div>

        {/* Recommended Talent Cards Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Recommended Verified Talent for &ldquo;{activeOpp.title}&rdquo;
              </h2>
              <p className="text-xs text-slate-500">
                Sorted by 6-point match algorithm against your active opportunity requirements.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('provider-talents')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800 cursor-pointer"
            >
              <span>View All 47 Matched Talents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {scoredCandidates.map(({ talent, match }) => {
              const hasInvited = invitations.some(i => i.talentId === talent.id);
              const highestVerification = talent.evidence.find(
                e => e.verificationStatus === 'Institution verified' || e.verificationStatus === 'Mentor verified'
              )?.verificationStatus || 'Evidence-backed';

              return (
                <div
                  key={talent.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Avatar, Name, Title, Match Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={talent.avatarUrl}
                          alt={talent.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-base text-slate-900">
                            {talent.name}
                          </div>
                          <div className="text-xs font-medium text-sky-700">
                            {talent.talentTitle}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {talent.location} • Level: {talent.experienceLevel}
                          </div>
                        </div>
                      </div>

                      <MatchBadge percentage={match.percentage} size="md" />
                    </div>

                    {/* Verification & Evidence Count */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <VerificationBadge status={highestVerification} size="sm" />
                      <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                        {talent.evidence.length} Evidence Records
                      </span>
                      <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                        {talent.profileConfidence}% Confidence
                      </span>
                    </div>

                    {/* Matching Skills */}
                    <div className="mb-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Matching Skills & Disciplines:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {talent.skills.map(s => (
                          <span
                            key={s.name}
                            className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200"
                          >
                            {s.name} ({s.level})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      id={`view-passport-${talent.id}`}
                      onClick={() => handleViewPassport(talent)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Passport</span>
                    </button>

                    <button
                      id={`invite-talent-${talent.id}`}
                      onClick={() => handleOpenInvite(talent)}
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        hasInvited
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                      }`}
                    >
                      {hasInvited ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Invited</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Invite</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Provider Opportunities List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Active Call Listings Posted by Your Organization
            </h3>
            <button
              onClick={() => setCurrentView('create-opportunity')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900"
            >
              + Create New Listing
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {opportunities.slice(0, 3).map(opp => (
              <div key={opp.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-sm text-slate-900">{opp.title}</div>
                  <div className="text-xs text-slate-500">
                    {opp.category} • {opp.type} • {opp.location} • Deadline: {opp.deadline}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 font-medium">
                    {opp.applicantCount} Applicants
                  </span>
                  <button
                    onClick={() => setCurrentView('provider-talents')}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    View Matches
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Invite {selectedCandidate.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Extend a direct invitation to audition or interview for your opportunity.
            </p>

            {inviteSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-900">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <div className="font-bold text-base">Invitation Dispatched!</div>
                <div className="text-xs text-emerald-800 mt-1">
                  Notification and application token sent to {selectedCandidate.name}&apos;s verified inbox.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label htmlFor="invite-opportunity-select" className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Opportunity
                  </label>
                  <select
                    id="invite-opportunity-select"
                    value={selectedOppId}
                    onChange={(e) => setSelectedOppId(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {opportunities.map(o => (
                      <option key={o.id} value={o.id}>
                        {o.title} ({o.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="invite-message-textarea" className="block text-xs font-semibold text-slate-700 mb-1">
                    Personalized Invitation Message
                  </label>
                  <textarea
                    id="invite-message-textarea"
                    rows={4}
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="send-invitation-submit-btn"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Invitation</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
