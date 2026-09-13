import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
  RotateCw
} from 'lucide-react';

export const AIAnalysisView: React.FC = () => {
  const {
    talentProfile,
    isAnalyzingAI,
    aiAnalysisCompleted,
    triggerAIAnalysis,
    setCurrentView
  } = useApp();

  const [simulatedStep, setSimulatedStep] = useState(0);

  const analysisSteps = [
    'Parsing multi-format portfolio evidence artifacts...',
    'Validating credential hashes and institutional endorsements...',
    'Extracting structured competencies & proficiency matrices...',
    'Calibrating evidence-backed Profile Confidence score...',
    'Synthesizing personalized AI Talent Coach insights...',
  ];

  // Auto trigger analysis if not yet run or on button click
  const handleStartAnalysis = () => {
    setSimulatedStep(0);
    triggerAIAnalysis();
  };

  useEffect(() => {
    let interval: any;
    if (isAnalyzingAI) {
      interval = setInterval(() => {
        setSimulatedStep(prev => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isAnalyzingAI]);

  const summary = talentProfile.aiSummary;

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Processing State */}
        {isAnalyzingAI && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Analyzing your talent profile...
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
              Synthesizing your verified artifacts, performance recordings, and credentials into a verifiable Talent Passport.
            </p>

            {/* Stepper animation */}
            <div className="max-w-md mx-auto space-y-3 text-left">
              {analysisSteps.map((s, idx) => {
                const isPast = idx < simulatedStep;
                const isCurrent = idx === simulatedStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isPast
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : isCurrent
                        ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <RotateCw className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed / Ready State */}
        {!isAnalyzingAI && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
                      AI Analysis Complete
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Your Talent Passport is ready.
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="reanalyze-profile-btn"
                    onClick={handleStartAnalysis}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Re-Analyze
                  </button>
                  <button
                    id="view-talent-passport-btn"
                    onClick={() => setCurrentView('talent-passport')}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4 text-sky-400" />
                    <span>View Talent Passport</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Profile Confidence Callout - MANDATORY DISCLAIMER */}
              <div className="mt-6 p-5 bg-sky-50/60 rounded-2xl border border-sky-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-sky-100 text-sky-700 shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          Profile Confidence: {talentProfile.profileConfidence}%
                        </span>
                        <span className="text-[11px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                          High Evidence Tier
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        <strong>Indicates how much supporting information and evidence is available. It is not a measure of human potential.</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black text-sky-900">
                      {talentProfile.profileConfidence}%
                    </span>
                    <div className="w-24 sm:w-32 h-2 bg-sky-200 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-sky-600 rounded-full"
                        style={{ width: `${talentProfile.profileConfidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Title & Structured Skills */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Primary Talent Title
                </h3>
                <div className="text-xl font-extrabold text-slate-900 mb-5">
                  {summary.primaryTalentTitle}
                </div>

                <h4 className="text-xs font-bold text-slate-700 mb-2.5">
                  Structured Competencies & Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {summary.structuredSkills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-500 mb-1">
                    Evidence Portfolio Summary
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {summary.evidenceSummary}
                  </p>
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Identified Strengths</span>
                </h3>
                <ul className="space-y-3">
                  {summary.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Next Steps */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-600" />
                  <span>Recommended Next Steps</span>
                </h3>
                <div className="space-y-2.5">
                  {summary.recommendedNextSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Opportunity Types */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Recommended Opportunity Types</span>
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {summary.recommendedOpportunityTypes.map(oppType => (
                      <span
                        key={oppType}
                        className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold"
                      >
                        {oppType}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Based on your demonstrated evidence and experience level, you are most competitive for auditions and grant-backed fellowships.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentView('opportunities')}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    <span>Browse Matched Opportunities</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
