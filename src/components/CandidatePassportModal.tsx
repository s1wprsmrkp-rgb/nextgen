import React from 'react';
import { TalentProfile } from '../types';
import { VerificationBadge } from './VerificationBadge';
import {
  X,
  MapPin,
  Calendar,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Send
} from 'lucide-react';

interface CandidatePassportModalProps {
  talent: TalentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (talent: TalentProfile) => void;
}

export const CandidatePassportModal: React.FC<CandidatePassportModalProps> = ({
  talent,
  isOpen,
  onClose,
  onInvite,
}) => {
  if (!isOpen || !talent) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Top bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest font-mono text-slate-300">
              TalentBridge Verifiable Passport • {talent.id.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Identity Section */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={talent.avatarUrl}
                alt={talent.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-slate-200"
              />
              <div>
                <h2 className="text-2xl font-black text-slate-900">{talent.name}</h2>
                <div className="text-sm font-semibold text-sky-700">{talent.talentTitle}</div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{talent.location}</span>
                  </span>
                  <span>•</span>
                  <span>Experience: {talent.experienceLevel}</span>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl text-right shrink-0">
              <div className="text-[10px] font-bold text-sky-800 uppercase">Profile Confidence</div>
              <div className="text-2xl font-black text-sky-950">{talent.profileConfidence}%</div>
              <div className="text-[10px] text-slate-500 max-w-[150px]">
                Indicates supporting evidence volume.
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Skills */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Verified Skills & Proficiencies
            </h4>
            <div className="space-y-2">
              {talent.skills.map(s => (
                <div key={s.name} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500">Level: {s.level}</div>
                  </div>
                  <VerificationBadge status={s.verification} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Portfolio Items */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Evidence Portfolio ({talent.evidence.length} Records)
            </h4>
            <div className="space-y-2.5">
              {talent.evidence.map(e => (
                <div key={e.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{e.title}</span>
                      <span className="text-[10px] font-medium bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        {e.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{e.description}</p>
                    <div className="text-[11px] text-slate-400 mt-1">Date: {e.date}</div>
                  </div>
                  <VerificationBadge status={e.verificationStatus} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Talent Synthesis */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Talent Coach Summary</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-3">
              {talent.aiSummary.evidenceSummary}
            </p>
            <div className="space-y-1">
              {talent.aiSummary.strengths.map((str, i) => (
                <div key={i} className="text-xs text-indigo-950 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified with institution cryptographic stamps.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Close
            </button>
            {onInvite && (
              <button
                onClick={() => {
                  onClose();
                  onInvite(talent);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Invite to Call</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
