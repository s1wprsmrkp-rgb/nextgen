import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EvidenceType } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { AddEvidenceModal } from './AddEvidenceModal';
import {
  Plus,
  FileVideo,
  FileAudio,
  FileImage,
  FolderGit2,
  FileCheck2,
  Award,
  Globe,
  Calendar,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const { talentProfile, setCurrentView } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const evidenceList = talentProfile.evidence;

  const getIconForType = (type: EvidenceType) => {
    switch (type) {
      case 'Video':
        return FileVideo;
      case 'Audio':
        return FileAudio;
      case 'Image':
        return FileImage;
      case 'Project':
        return FolderGit2;
      case 'Certificate':
        return FileCheck2;
      case 'Achievement':
        return Award;
      case 'External portfolio':
      default:
        return Globe;
    }
  };

  const filteredEvidence = filterType === 'all'
    ? evidenceList
    : evidenceList.filter(e => e.type === filterType);

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Portfolio
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Show what you can actually do.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="portfolio-ai-analysis-cta-btn"
              onClick={() => setCurrentView('ai-analysis')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs sm:text-sm font-semibold border border-indigo-200 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Calibrate with AI Analysis</span>
            </button>

            <button
              id="portfolio-add-evidence-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Evidence</span>
            </button>
          </div>
        </div>

        {/* Evidence stats ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Total Evidence</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{evidenceList.length} Items</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Institution / Mentor Verified</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {evidenceList.filter(e => e.verificationStatus === 'Institution verified' || e.verificationStatus === 'Mentor verified').length} Items
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Profile Confidence</div>
            <div className="text-2xl font-bold text-sky-700 mt-1">{talentProfile.profileConfidence}%</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Verification State</div>
            <div className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Evidence-Backed</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {['all', 'Video', 'Audio', 'Image', 'Project', 'Certificate', 'Achievement'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>

        {/* Evidence Cards Grid */}
        {filteredEvidence.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4 border border-sky-100">
              <FolderGit2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              You haven&apos;t added any evidence yet.
            </h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Upload your first project, performance or achievement to strengthen your Talent Passport and unlock high-percentage opportunity matches.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Your First Evidence</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvidence.map((item) => {
              const Icon = getIconForType(item.type);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Type & Verification Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.type}</span>
                      </span>

                      <VerificationBadge status={item.verificationStatus} size="sm" />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </div>

                    {item.fileMeta && (
                      <span className="text-[11px] text-slate-400 truncate max-w-[140px]" title={item.fileMeta}>
                        {item.fileMeta}
                      </span>
                    )}

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 font-semibold"
                        title="View artifact link"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddEvidenceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
