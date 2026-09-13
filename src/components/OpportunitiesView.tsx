import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OpportunityType, TalentCategory, ExperienceLevel } from '../types';
import { calculateMatchScore } from '../services/matching';
import { MatchBadge } from './MatchBadge';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

export const OpportunitiesView: React.FC = () => {
  const {
    talentProfile,
    opportunities,
    savedOpportunityIds,
    toggleSaveOpportunity,
    setSelectedOpportunityId,
    setCurrentView,
    applications
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

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

  // Calculate match for every opportunity
  const opportunitiesWithMatch = opportunities.map(opp => {
    const match = calculateMatchScore(talentProfile, opp);
    return { opp, match };
  });

  // Filter
  const filtered = opportunitiesWithMatch.filter(({ opp }) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
    const matchesType = selectedType === 'all' || opp.type === selectedType;
    const matchesLevel =
      selectedLevel === 'all' || opp.experienceLevel === 'Any' || opp.experienceLevel === selectedLevel;
    const matchesLocation =
      selectedLocation === 'all' ||
      (selectedLocation === 'Remote' && opp.remoteOnsite === 'Remote') ||
      (selectedLocation === 'Onsite' && opp.remoteOnsite !== 'Remote');

    return matchesSearch && matchesCategory && matchesType && matchesLevel && matchesLocation;
  });

  // Sort by match percentage descending by default
  filtered.sort((a, b) => b.match.percentage - a.match.percentage);

  const handleOpenDetail = (oppId: string) => {
    setSelectedOpportunityId(oppId);
    setCurrentView('opportunity-detail');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedType !== 'all' || selectedLevel !== 'all' || selectedLocation !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedLevel('all');
    setSelectedLocation('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 uppercase">
                Discovery Engine
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {filtered.length} Opportunities Available
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Explore Opportunities
            </h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Competitions, fellowships, auditions, internships & grants matched to your verified evidence.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-white border border-slate-200 p-2.5 rounded-xl shadow-2xs">
            <span className="font-semibold text-slate-700">6-Point Matching:</span> Skills 30% • Category 20% • Experience 15% • Eligibility 15% • Location 10% • Interests 10%
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="opportunity-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role title, skill (e.g. Vocal Performance, React), or provider..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                id="opp-filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 py-1.5 px-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Opportunity Type
              </label>
              <select
                id="opp-filter-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 py-1.5 px-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Types</option>
                {opportunityTypes.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Experience Level
              </label>
              <select
                id="opp-filter-level"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 py-1.5 px-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Location / Format */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Location Format
              </label>
              <select
                id="opp-filter-location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 py-1.5 px-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Any Format</option>
                <option value="Remote">Remote Only</option>
                <option value="Onsite">Onsite / Hybrid</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>Showing filtered matches</span>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No matching opportunities found
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Try adjusting your category or filter selections to discover other active calls.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(({ opp, match }) => {
              const isSaved = savedOpportunityIds.includes(opp.id);
              const hasApplied = applications.some(a => a.opportunityId === opp.id && a.talentId === talentProfile.id);

              return (
                <div
                  key={opp.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Provider Logo, Demo Badge & Match Badge */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={opp.providerLogo}
                          alt={opp.provider}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-800 leading-tight">
                            {opp.provider}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {opp.category} • {opp.type}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <MatchBadge percentage={match.percentage} size="md" />
                        {opp.isDemo && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Demo Opportunity
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => handleOpenDetail(opp.id)}
                      className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors mb-2 cursor-pointer"
                    >
                      {opp.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {opp.description}
                    </p>

                    {/* Quick Match Reasons Box */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Why You Match:
                      </div>
                      <div className="space-y-1">
                        {match.reasons.slice(0, 3).map((r, i) => (
                          <div key={i} className="text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Meta info */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{opp.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: {opp.deadline}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveOpportunity(opp.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isSaved
                            ? 'bg-amber-50 border-amber-300 text-amber-600'
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title={isSaved ? 'Saved opportunity' : 'Save opportunity'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      <button
                        id={`opp-view-detail-${opp.id}`}
                        onClick={() => handleOpenDetail(opp.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>{hasApplied ? 'View Applied Call' : 'View Full Call'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
