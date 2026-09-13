import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalentProfile } from '../types';
import { VerificationBadge } from './VerificationBadge';
import {
  FileCheck2,
  Share2,
  Download,
  MapPin,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface TalentPassportViewProps {
  customTalent?: TalentProfile;
}

export const TalentPassportView: React.FC<TalentPassportViewProps> = ({ customTalent }) => {
  const { talentProfile, setCurrentView } = useApp();
  const talent = customTalent || talentProfile;

  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://talentbridge.app/passport/${talent.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verificationTiers = [
    { label: 'Institution verified', count: talent.evidence.filter(e => e.verificationStatus === 'Institution verified').length },
    { label: 'Mentor verified', count: talent.evidence.filter(e => e.verificationStatus === 'Mentor verified').length },
    { label: 'Evidence-backed', count: talent.evidence.filter(e => e.verificationStatus === 'Evidence-backed').length },
    { label: 'Community recognition', count: talent.evidence.filter(e => e.verificationStatus === 'Community recognition').length },
    { label: 'Self-declared', count: talent.skills.filter(s => s.verification === 'Self-declared').length },
  ];

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Verifiable Credential
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Talent Passport
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="share-passport-btn"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-sky-600" />
              <span>Share Talent Passport</span>
            </button>

            <button
              id="passport-explore-opps-btn"
              onClick={() => setCurrentView('opportunities')}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>Explore Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Hero Digital Passport Container */}
        <div className="bg-white rounded-3xl border border-slate-300 shadow-lg overflow-hidden">
          {/* Passport Header Strip */}
          <div className="bg-slate-900 text-white px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-black text-white text-base">
                TB
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  TalentBridge Universal Passport
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  ID: TB-IN-{(talent.id).toUpperCase()} • HASH: #4F89A2E
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Status Active</span>
              </span>
            </div>
          </div>

          {/* Profile Identity Hero */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50/50 to-white border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <img
                  src={talent.avatarUrl}
                  alt={talent.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-slate-200"
                />
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {talent.name}
                  </h2>
                  <div className="text-base sm:text-lg font-semibold text-sky-700 mt-0.5">
                    {talent.talentTitle}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{talent.location}</span>
                    </span>
                    {talent.phone && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                          📱 {talent.phone}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span className="font-semibold text-slate-700">
                      Experience: {talent.experienceLevel}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">
                      {talent.evidence.length} Evidence Records
                    </span>
                  </div>
                </div>
              </div>

              {/* Confidence Gauge Block */}
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl text-center sm:text-right min-w-[200px]">
                <div className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
                  Profile Confidence
                </div>
                <div className="text-3xl sm:text-4xl font-black text-sky-950">
                  {talent.profileConfidence}%
                </div>
                <div className="w-full bg-sky-200 h-2 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-sky-600 h-full rounded-full"
                    style={{ width: `${talent.profileConfidence}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Indicates supporting evidence volume. Not human potential.
                </p>
              </div>
            </div>
          </div>

          {/* Verification Hierarchy Indicator */}
          <div className="px-6 sm:px-8 py-4 bg-slate-50 border-b border-slate-200">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Verification Breakdown & Credential Standing
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                <div className="text-[10px] font-bold text-emerald-800 uppercase">Institution Verified</div>
                <div className="text-lg font-black text-emerald-900 mt-0.5">
                  {talent.evidence.filter(e => e.verificationStatus === 'Institution verified').length}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-blue-200 shadow-2xs">
                <div className="text-[10px] font-bold text-blue-800 uppercase">Mentor Verified</div>
                <div className="text-lg font-black text-blue-900 mt-0.5">
                  {talent.evidence.filter(e => e.verificationStatus === 'Mentor verified').length}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 shadow-2xs">
                <div className="text-[10px] font-bold text-amber-800 uppercase">Evidence-Backed</div>
                <div className="text-lg font-black text-amber-900 mt-0.5">
                  {talent.evidence.filter(e => e.verificationStatus === 'Evidence-backed').length}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
                <div className="text-[10px] font-bold text-purple-800 uppercase">Community Recognition</div>
                <div className="text-lg font-black text-purple-900 mt-0.5">
                  {talent.evidence.filter(e => e.verificationStatus === 'Community recognition').length}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-700 uppercase">Self-Declared</div>
                <div className="text-lg font-black text-slate-800 mt-0.5">
                  {talent.skills.filter(s => s.verification === 'Self-declared').length}
                </div>
              </div>
            </div>
          </div>

          {/* Core Content Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Skills & Evidence */}
            <div className="space-y-6">
              {/* Skills with Tier Badges */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Verified Skills & Disciplines
                </h3>
                <div className="space-y-2.5">
                  {talent.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900">{skill.name}</div>
                        <div className="text-xs text-slate-500">Level: {skill.level}</div>
                      </div>
                      <VerificationBadge status={skill.verification} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              {talent.achievements.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Verified Honors & Achievements</span>
                  </h3>
                  <div className="space-y-2">
                    {talent.achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="font-semibold text-xs sm:text-sm text-slate-900">
                            {ach.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {ach.issuer} • {ach.date}
                          </div>
                        </div>
                        <VerificationBadge status={ach.verificationStatus} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: AI Analysis & Evidence Summary */}
            <div className="space-y-6">
              {/* AI Summary */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Talent Synthesis</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {talent.aiSummary.evidenceSummary}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/80">
                  <div className="text-xs font-bold text-slate-800 mb-1.5">
                    Demonstrated Strengths
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {talent.aiSummary.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Next Steps */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Recommended Next Steps
                </h3>
                <div className="space-y-2">
                  {talent.aiSummary.recommendedNextSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2"
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Passport Footer */}
          <div className="bg-slate-50 px-6 sm:px-8 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tamper-proof verifiable passport issued via TalentBridge Platform.</span>
            </div>
            <div>
              Last updated: March 2026
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Share Talent Passport
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Send this verified link to audition directors, recruiters, festival judges, and scholarship committees.
            </p>

            <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-xl border border-slate-200 mb-4">
              <input
                type="text"
                readOnly
                value={`https://talentbridge.app/passport/${talent.id}`}
                className="bg-transparent text-xs text-slate-700 w-full font-mono focus:outline-none px-2"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center mb-6">
              <div className="text-xs font-semibold text-slate-700 mb-1">
                Embedded Verification QR
              </div>
              <div className="w-28 h-28 bg-white border border-slate-300 rounded-lg mx-auto flex items-center justify-center font-mono text-[10px] text-slate-400">
                [ QR CODE ]
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Scans directly to verified credential ledger
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-semibold text-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
