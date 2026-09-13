import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalentProfile } from '../types';
import { calculateMatchScore } from '../services/matching';
import { MatchBadge } from './MatchBadge';
import { VerificationBadge } from './VerificationBadge';
import {
  Users,
  ChevronDown,
  ChevronUp,
  Send,
  Eye,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Check,
  Search,
  Filter,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface MatchingTalentViewProps {
  onOpenPassportModal?: (talent: TalentProfile) => void;
}

export const MatchingTalentView: React.FC<MatchingTalentViewProps> = ({ onOpenPassportModal }) => {
  const {
    allTalents,
    talentProfile,
    opportunities,
    invitations,
    inviteTalent,
    setSelectedTalentId,
    setCurrentView
  } = useApp();

  const [expandedMatchId, setExpandedMatchId] = useState<string | null>('talent-rohan-06');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOppId, setSelectedOppId] = useState<string>(opportunities[0]?.id || '');
  const [inviteModalTalent, setInviteModalTalent] = useState<TalentProfile | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'confidence' | 'evidence'>('match');

  const activeOpp = opportunities.find(o => o.id === selectedOppId) || opportunities[0];

  // Candidates pool
  const candidatePool = allTalents;

  const candidateMatches = candidatePool.map(talent => {
    const match = calculateMatchScore(talent, activeOpp);
    return { talent, match };
  });

  // Filter candidates with comprehensive search and athlete support
  const query = searchQuery.trim().toLowerCase();

  const filtered = candidateMatches.filter(({ talent }) => {
    // 1. Category dropdown filter
    if (selectedCategory !== 'all') {
      const matchCat = talent.categories.some(c => c.toLowerCase() === selectedCategory.toLowerCase());
      if (!matchCat) return false;
    }

    // If no search query, keep
    if (!query) return true;

    // 2. Athlete / Sports keyword intelligent matching
    const isAthleteQuery = ['athlete', 'athletic', 'athletics', 'sport', 'sports', 'runner', 'sprinter', 'track', 'badminton', 'swimmer', 'swimming'].some(
      term => query.includes(term) || term.includes(query)
    );
    const isSportsTalent = talent.categories.some(c => c.toLowerCase() === 'sports');
    if (isAthleteQuery && isSportsTalent) {
      return true;
    }

    // 3. Multi-field text match
    const inName = talent.name.toLowerCase().includes(query);
    const inTitle = talent.talentTitle.toLowerCase().includes(query);
    const inSkills = talent.skills.some(s => s.name.toLowerCase().includes(query));
    const inCategories = talent.categories.some(c => c.toLowerCase().includes(query));
    const inInterests = talent.interests.some(i => i.toLowerCase().includes(query));
    const inLocation = talent.location.toLowerCase().includes(query);
    const inSummary = talent.aiSummary?.primaryTalentTitle.toLowerCase().includes(query) || false;

    return inName || inTitle || inSkills || inCategories || inInterests || inLocation || inSummary;
  });

  // Sort
  if (sortBy === 'match') {
    filtered.sort((a, b) => b.match.percentage - a.match.percentage);
  } else if (sortBy === 'confidence') {
    filtered.sort((a, b) => b.talent.profileConfidence - a.talent.profileConfidence);
  } else if (sortBy === 'evidence') {
    filtered.sort((a, b) => b.talent.evidence.length - a.talent.evidence.length);
  }

  const toggleExpand = (id: string) => {
    setExpandedMatchId(prev => (prev === id ? null : id));
  };

  const handleOpenInvite = (talent: TalentProfile) => {
    setInviteModalTalent(talent);
    setInviteMessage(
      `Hi ${talent.name}, your verified talent profile and ${activeOpp.category} evidence caught our eye for ${activeOpp.title}. We would love to formally invite you to audition/apply.`
    );
    setInviteSuccess(false);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteModalTalent) return;

    inviteTalent(inviteModalTalent.id, activeOpp.id, inviteMessage);
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteModalTalent(null);
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">
                AI Talent Matching
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {filtered.length} candidate{filtered.length === 1 ? '' : 's'} found
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Matching Talent
            </h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Review candidates scored against &ldquo;{activeOpp.title}&rdquo; with evidence verification breakdown.
            </p>
          </div>

          {/* Opportunity selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Active Call:</span>
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="text-xs sm:text-sm rounded-xl border border-slate-300 py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs max-w-xs"
            >
              {opportunities.map(o => (
                <option key={o.id} value={o.id}>
                  [{o.category}] {o.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter and Sort bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto flex-1">
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate, athlete, skill..."
                className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category dropdown */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 py-1.5 px-2.5 bg-slate-50 focus:outline-none font-medium text-slate-700 w-full sm:w-auto"
              >
                <option value="all">All Disciplines</option>
                <option value="Sports">Sports / Athletes</option>
                <option value="Music">Music</option>
                <option value="Coding">Coding</option>
                <option value="Film">Film</option>
                <option value="Dance">Dance</option>
                <option value="Art & Design">Art & Design</option>
                <option value="Entrepreneurship & Innovation">Entrepreneurship</option>
              </select>
            </div>

            {/* Quick Athletes Pill */}
            <button
              onClick={() => {
                setSearchQuery('athlete');
                setSelectedCategory('all');
              }}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                searchQuery.toLowerCase() === 'athlete'
                  ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200 font-medium'
              }`}
            >
              ⚡ Search Athletes
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs rounded-lg border border-slate-200 py-1.5 px-2.5 bg-white focus:outline-none font-semibold text-slate-700"
            >
              <option value="match">Match Score (Highest First)</option>
              <option value="confidence">Profile Confidence</option>
              <option value="evidence">Evidence Count</option>
            </select>
          </div>
        </div>

        {/* Candidates List or No Match Found */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-2xs">
              <Search className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No Match Found
            </h3>
            <p className="text-slate-600 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
              {searchQuery ? (
                <>
                  We could not find any talent matching <strong className="text-slate-900 font-bold">&ldquo;{searchQuery}&rdquo;</strong> in the registry for <span className="text-slate-800 font-medium">&ldquo;{activeOpp.title}&rdquo;</span>.
                </>
              ) : (
                <>
                  No talent profiles currently match the selected discipline filter (<strong className="text-slate-900 font-bold">{selectedCategory}</strong>) for this opportunity.
                </>
              )}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-5 py-2.5 bg-sky-800 hover:bg-sky-900 text-white text-sm font-semibold rounded-xl transition-all shadow-xs"
              >
                Clear Search & Show All Candidates
              </button>
              
              <button
                onClick={() => {
                  const sportsOpp = opportunities.find(o => o.category === 'Sports');
                  if (sportsOpp) setSelectedOppId(sportsOpp.id);
                  setSearchQuery('athlete');
                  setSelectedCategory('Sports');
                }}
                className="px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-sm font-semibold rounded-xl transition-all"
              >
                ⚡ View Athlete Profiles (Rohan, Priya, Vikram)
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(({ talent, match }) => {
            const isExpanded = expandedMatchId === talent.id;
            const hasInvited = invitations.some(i => i.talentId === talent.id && i.opportunityId === activeOpp.id);
            const highestVerification = talent.evidence.find(
              e => e.verificationStatus === 'Institution verified' || e.verificationStatus === 'Mentor verified'
            )?.verificationStatus || 'Evidence-backed';

            return (
              <div
                key={talent.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Main Summary Row */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Avatar & Identity */}
                  <div className="flex items-start gap-4">
                    <img
                      src={talent.avatarUrl}
                      alt={talent.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-base text-slate-900">
                          {talent.name}
                        </h3>
                        <VerificationBadge status={highestVerification} size="sm" />
                      </div>

                      <div className="text-xs sm:text-sm font-semibold text-sky-700">
                        {talent.talentTitle}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{talent.location}</span>
                        </span>
                        <span>•</span>
                        <span>Level: {talent.experienceLevel}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">
                          {talent.evidence.length} Evidence Records
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-sky-800">
                          {talent.profileConfidence}% Confidence
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Match Score & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
                    <MatchBadge percentage={match.percentage} size="lg" />

                    <button
                      id={`view-candidate-passport-${talent.id}`}
                      onClick={() => handleViewPassport(talent)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Passport</span>
                    </button>

                    <button
                      id={`invite-candidate-btn-${talent.id}`}
                      onClick={() => handleOpenInvite(talent)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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

                    <button
                      onClick={() => toggleExpand(talent.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                      title="Toggle match breakdown"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expandable "Why this match?" section */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 bg-slate-50/70 border-t border-slate-100">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                          <span>Why this match? (6-Factor Breakdown)</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          Match Score: <strong>{match.percentage}%</strong>
                        </span>
                      </div>

                      {/* Positive match reasons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {match.reasons.map((r, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-emerald-900 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>

                      {/* Weight scores bar */}
                      <div className="pt-2 border-t border-slate-100 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px] text-slate-500 font-medium">
                        <div className="bg-slate-50 p-1.5 rounded">
                          <div>Skills (30%)</div>
                          <div className="font-bold text-slate-800">{match.skillScore}/30</div>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded">
                          <div>Category (20%)</div>
                          <div className="font-bold text-slate-800">{match.categoryScore}/20</div>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded">
                          <div>Experience (15%)</div>
                          <div className="font-bold text-slate-800">{match.experienceScore}/15</div>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded">
                          <div>Eligibility (15%)</div>
                          <div className="font-bold text-slate-800">{match.eligibilityScore}/15</div>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded">
                          <div>Location (10%)</div>
                          <div className="font-bold text-slate-800">{match.locationScore}/10</div>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded">
                          <div>Interest (10%)</div>
                          <div className="font-bold text-slate-800">{match.interestScore}/10</div>
                        </div>
                      </div>

                      {/* Skills listed */}
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          Demonstrated Skills on File:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {talent.skills.map(s => (
                            <span
                              key={s.name}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium"
                            >
                              {s.name} ({s.level} • {s.verification})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {inviteModalTalent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Invite {inviteModalTalent.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Send an invitation to apply/audition for &ldquo;{activeOpp.title}&rdquo;.
            </p>

            {inviteSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-900">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <div className="font-bold text-base">Direct Invite Dispatched!</div>
                <div className="text-xs text-emerald-800 mt-1">
                  {inviteModalTalent.name} has been notified with direct access to your submission portal.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label htmlFor="talent-invite-message" className="block text-xs font-semibold text-slate-700 mb-1">
                    Invitation Note
                  </label>
                  <textarea
                    id="talent-invite-message"
                    rows={4}
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setInviteModalTalent(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="matching-talent-send-invite-btn"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Formal Invite</span>
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
