import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalentCategory, ExperienceLevel } from '../types';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
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
  Compass,
  Trophy,
  Briefcase,
  Layers,
  Users,
  TrendingUp,
  Search
} from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const { talentProfile, updateProfile, setCurrentView } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCategories, setSelectedCategories] = useState<TalentCategory[]>(
    talentProfile.categories.length > 0 ? talentProfile.categories : ['Music']
  );
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>(
    talentProfile.experienceLevel || 'Intermediate'
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    talentProfile.careerGoals.length > 0
      ? talentProfile.careerGoals
      : ['Find competitions', 'Get discovered']
  );

  const categories: { name: TalentCategory; icon: any }[] = [
    { name: 'Music', icon: Music },
    { name: 'Sports', icon: Dumbbell },
    { name: 'Film', icon: Film },
    { name: 'Photography', icon: Camera },
    { name: 'Art & Design', icon: Palette },
    { name: 'Coding', icon: Code },
    { name: 'Teaching', icon: GraduationCap },
    { name: 'Public Speaking', icon: Mic2 },
    { name: 'Dance', icon: Flame },
    { name: 'Entrepreneurship & Innovation', icon: Rocket },
  ];

  const levels: { level: ExperienceLevel; title: string; desc: string }[] = [
    {
      level: 'Beginner',
      title: 'Emerging & Foundational',
      desc: 'Exploring passions, taking introductory training, creating initial practice pieces.',
    },
    {
      level: 'Intermediate',
      title: 'Practicing & Experienced',
      desc: 'Consistent creator with several documented projects, performances or local competitions.',
    },
    {
      level: 'Advanced',
      title: 'Mastery & Competitive',
      desc: 'Proven track record with regional/national honors, published work or advanced technical discipline.',
    },
  ];

  const goalOptions = [
    { id: 'Find competitions', label: 'Find competitions', icon: Trophy, desc: 'Enter state & national talent contests' },
    { id: 'Find internships', label: 'Find internships', icon: Briefcase, desc: 'Gain real studio or company experience' },
    { id: 'Find projects', label: 'Find projects', icon: Layers, desc: 'Join collaborative productions and builds' },
    { id: 'Find mentors', label: 'Find mentors', icon: Users, desc: 'Get 1-on-1 feedback from certified industry coaches' },
    { id: 'Build a career', label: 'Build a career', icon: TrendingUp, desc: 'Transition capability into paid opportunities' },
    { id: 'Get discovered', label: 'Get discovered', icon: Search, desc: 'Receive direct casting and scout invites' },
  ];

  const toggleCategory = (cat: TalentCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleFinish = () => {
    updateProfile({
      categories: selectedCategories.length > 0 ? selectedCategories : ['Music'],
      experienceLevel: selectedLevel,
      careerGoals: selectedGoals,
    });
    // Proceed to portfolio to add evidence or talent dashboard
    setCurrentView('portfolio');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>STEP {step} OF 3</span>
            <span className="text-slate-800">
              {step === 1 && 'Talent Categories'}
              {step === 2 && 'Experience Level'}
              {step === 3 && 'Career Goals'}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 transition-all duration-300 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Card container */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {step === 1 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                  What are you good at?
                </h2>
                <p className="text-slate-600 text-sm">
                  Select one or more categories that reflect your primary talents and disciplines.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-8">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategories.includes(cat.name);
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      id={`onboarding-cat-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => toggleCategory(cat.name)}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/70 text-sky-950 ring-1 ring-sky-500'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-500 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm">{cat.name}</span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  id="onboarding-step1-next-btn"
                  disabled={selectedCategories.length === 0}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all disabled:opacity-40 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                  What is your experience level?
                </h2>
                <p className="text-slate-600 text-sm">
                  This helps our matching algorithm pair you with competitions, mentors, and auditions calibrated to your current stage.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {levels.map(item => {
                  const isSelected = selectedLevel === item.level;
                  return (
                    <div
                      key={item.level}
                      id={`onboarding-level-${item.level.toLowerCase()}`}
                      onClick={() => setSelectedLevel(item.level)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-base ${isSelected ? 'text-sky-950' : 'text-slate-800'}`}>
                          {item.level}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 mb-1">{item.title}</div>
                      <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  id="onboarding-step2-back-btn"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  id="onboarding-step2-next-btn"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                  What are you hoping to achieve?
                </h2>
                <p className="text-slate-600 text-sm">
                  Select all opportunity types you would like to be matched with.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {goalOptions.map(goal => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      id={`onboarding-goal-${goal.id.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/70 text-sky-950 ring-1 ring-sky-500'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-sky-500 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs sm:text-sm">{goal.label}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{goal.desc}</div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  id="onboarding-step3-back-btn"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  id="onboarding-finish-btn"
                  disabled={selectedGoals.length === 0}
                  onClick={handleFinish}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Save & Add Portfolio Evidence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
