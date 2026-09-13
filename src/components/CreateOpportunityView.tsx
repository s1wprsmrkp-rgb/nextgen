import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalentCategory, OpportunityType, ExperienceLevel } from '../types';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Building,
  RotateCw,
  X
} from 'lucide-react';

export const CreateOpportunityView: React.FC = () => {
  const { createOpportunity, setCurrentView } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TalentCategory>('Music');
  const [type, setType] = useState<OpportunityType>('Audition');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['Vocal Performance', 'Live Performance']);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | 'Any'>('Intermediate');
  const [location, setLocation] = useState('Hyderabad & Vijayawada');
  const [remoteOnsite, setRemoteOnsite] = useState<'Remote' | 'Onsite' | 'Hybrid'>('Hybrid');
  const [eligibility, setEligibility] = useState('Open to students and emerging vocal performers aged 16–28 with portfolio evidence.');
  const [deadline, setDeadline] = useState('May 30, 2026');
  const [stipendOrPrize, setStipendOrPrize] = useState('₹1,00,000 Production Grant');

  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const categories: TalentCategory[] = [
    'Music',
    'Sports',
    'Film',
    'Photography',
    'Art & Design',
    'Coding',
    'Teaching',
    'Public Speaking',
    'Dance',
    'Entrepreneurship & Innovation',
  ];

  const opportunityTypes: OpportunityType[] = [
    'Competition',
    'Internship',
    'Audition',
    'Scholarship',
    'Project',
    'Collaboration',
    'Workshop',
    'Mentorship',
  ];

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (s: string) => {
    setSkills(prev => prev.filter(item => item !== s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsPublishing(true);

    setTimeout(() => {
      createOpportunity({
        title: title.trim(),
        provider: 'Apex Horizons Foundation',
        providerLogo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=120&q=80',
        category,
        type,
        description: description.trim() || 'Exciting call for verified emerging talent to demonstrate their abilities on stage and in studio.',
        requirements: [
          'Verified Talent Passport submission with at least 2 evidence records',
          'Availability for cohort rehearsals and evaluation',
          'Adherence to artistic code of conduct'
        ],
        requiredSkills: skills.length > 0 ? skills : ['Vocal Performance'],
        experienceLevel,
        eligibility,
        location,
        remoteOnsite,
        deadline,
        stipendOrPrize,
      });

      setIsPublishing(false);
      setIsPublished(true);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Published Success & AI Finding Talent State */}
        {isPublished ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Opportunity Published
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3 mb-2">
              Opportunity published
            </h2>

            <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl max-w-md mx-auto my-6 flex items-center justify-center gap-3 text-sky-900">
              <Sparkles className="w-5 h-5 text-sky-600 shrink-0 animate-pulse" />
              <div className="font-semibold text-sm text-left">
                AI is finding suitable talent...
                <div className="text-xs text-sky-700 font-normal">
                  Scoring candidate passports against your {skills.join(', ')} requirements.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="view-matching-talent-btn"
                onClick={() => setCurrentView('provider-talents')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
              >
                <span>View Matching Talent Pool (47 candidates)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentView('provider-dashboard')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="pb-6 border-b border-slate-100 mb-6">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">
                Provider Call Creator
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Post New Opportunity
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Our AI matching engine pairs your criteria against verified candidate Talent Passports.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="create-opp-title" className="block text-xs font-semibold text-slate-700 mb-1">
                  Opportunity Title
                </label>
                <input
                  id="create-opp-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. South India Vocal Residency & Recording Fellowship 2026"
                  className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="create-opp-description" className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Context
                </label>
                <textarea
                  id="create-opp-description"
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the opportunity, masterclasses, mentors involved, and expected outcomes..."
                  className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              {/* Category and Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="create-opp-category" className="block text-xs font-semibold text-slate-700 mb-1">
                    Talent Category
                  </label>
                  <select
                    id="create-opp-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TalentCategory)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="create-opp-type" className="block text-xs font-semibold text-slate-700 mb-1">
                    Opportunity Type
                  </label>
                  <select
                    id="create-opp-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as OpportunityType)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {opportunityTypes.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Required Skills Chips */}
              <div>
                <label htmlFor="create-opp-skill-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Skills & Capabilities
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    id="create-opp-skill-input"
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type skill and press Add (e.g. Vocal Performance, Songwriting)"
                    className="flex-1 text-sm rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl"
                  >
                    Add Skill
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 text-xs font-medium"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="text-sky-600 hover:text-sky-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Level & Remote/Onsite */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="create-opp-level" className="block text-xs font-semibold text-slate-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    id="create-opp-level"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Any">Any Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="create-opp-remote" className="block text-xs font-semibold text-slate-700 mb-1">
                    Participation Format
                  </label>
                  <select
                    id="create-opp-remote"
                    value={remoteOnsite}
                    onChange={(e) => setRemoteOnsite(e.target.value as any)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="create-opp-deadline" className="block text-xs font-semibold text-slate-700 mb-1">
                    Application Deadline
                  </label>
                  <input
                    id="create-opp-deadline"
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="e.g. May 30, 2026"
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Location & Eligibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="create-opp-location" className="block text-xs font-semibold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    id="create-opp-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Vijayawada, India or Remote"
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label htmlFor="create-opp-prize" className="block text-xs font-semibold text-slate-700 mb-1">
                    Stipend / Prize / Honorarium (Optional)
                  </label>
                  <input
                    id="create-opp-prize"
                    type="text"
                    value={stipendOrPrize}
                    onChange={(e) => setStipendOrPrize(e.target.value)}
                    placeholder="e.g. ₹1,50,000 Fellowship Grant"
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="create-opp-eligibility" className="block text-xs font-semibold text-slate-700 mb-1">
                  Eligibility Criteria
                </label>
                <input
                  id="create-opp-eligibility"
                  type="text"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g. Open to all students & emerging creators with evidence"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentView('provider-dashboard')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="publish-opportunity-submit-btn"
                  disabled={isPublishing}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPublishing ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Publishing & Invoking AI Matcher...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Publish Opportunity</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
