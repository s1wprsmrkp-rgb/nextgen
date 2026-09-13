import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, TalentCategory } from '../types';
import {
  Users,
  UserCheck,
  Briefcase,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  PlusCircle,
  LogIn,
  Eye,
  CheckCircle2,
  Trophy,
  Activity,
  Calendar,
  MapPin,
  ArrowUpRight
} from 'lucide-react';

export const RegistrationDashboardView: React.FC = () => {
  const {
    registeredUsers,
    registrationMetrics,
    switchUser,
    setCurrentView,
    simulateNewRegistration,
    setSelectedTalentId,
    allTalents
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'talent' | 'provider'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [justSimulated, setJustSimulated] = useState<string | null>(null);

  // Filter registered users
  const filteredUsers = registeredUsers.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    if (categoryFilter !== 'all' && user.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = user.name.toLowerCase().includes(q);
      const inEmail = user.email.toLowerCase().includes(q);
      const inTitle = user.titleOrOrg.toLowerCase().includes(q);
      const inCategory = user.category?.toLowerCase().includes(q) || false;
      const inLocation = user.location?.toLowerCase().includes(q) || false;
      if (!inName && !inEmail && !inTitle && !inCategory && !inLocation) return false;
    }
    return true;
  });

  const handleSimulate = (role: UserRole, category?: string) => {
    const newUser = simulateNewRegistration(role, category);
    setJustSimulated(`New ${newUser.role === 'talent' ? 'talent candidate' : 'organization'} "${newUser.name}" registered successfully!`);
    setTimeout(() => {
      setJustSimulated(null);
    }, 4500);
  };

  const handleViewUserPassport = (userId: string) => {
    // Check if talent profile exists
    const matchingTalent = allTalents.find(t => t.id === userId || t.email === registeredUsers.find(u => u.id === userId)?.email);
    if (matchingTalent) {
      setSelectedTalentId(matchingTalent.id);
      setCurrentView('talent-passport');
    } else {
      switchUser(userId);
      setCurrentView('talent-dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Real-Time Telemetry
              </span>
              <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Live App Registrations
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Registration Analytics
            </h1>
            <p className="text-slate-600 text-sm mt-0.5 max-w-2xl">
              Monitor live talent and provider registrations, inspect community growth by discipline, and test real-time member onboarding.
            </p>
          </div>

          {/* Quick Simulation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="simulate-athlete-reg-btn"
              onClick={() => handleSimulate('talent', 'Sports')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all shadow-2xs"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>+ Register Athlete</span>
            </button>

            <button
              id="simulate-provider-reg-btn"
              onClick={() => handleSimulate('provider', 'Sports')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all shadow-2xs"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Register Provider</span>
            </button>

            <button
              id="simulate-talent-reg-btn"
              onClick={() => handleSimulate('talent', 'Coding')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-800 hover:bg-sky-900 text-white text-xs font-bold transition-all shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ New Member</span>
            </button>
          </div>
        </div>

        {/* Live Flash Message */}
        {justSimulated && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900 font-semibold shadow-2xs animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{justSimulated}</span>
            </div>
            <span className="text-[11px] text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
              Live update saved
            </span>
          </div>
        )}

        {/* Top 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Registrations
              </span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {registrationMetrics.totalRegistered}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Growing in real-time</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Verified Talents
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {registrationMetrics.talentCount}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Athletes, artists, engineers
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Opportunity Providers
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {registrationMetrics.providerCount}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Scouts, academies & orgs
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sports & Athletes
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {registrationMetrics?.byCategory?.['Sports'] ?? 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Sprinters, badminton, runners
            </div>
          </div>
        </div>

        {/* Discipline Breakdown Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>Registrations by Talent Discipline</span>
            </h3>
            <span className="text-xs text-slate-500">Live community distribution</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(registrationMetrics?.byCategory || {}).map(([category, count]) => (
              <div
                key={category}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center"
              >
                <div className="text-xl font-extrabold text-slate-900">{count}</div>
                <div className="text-xs font-medium text-slate-600 truncate mt-0.5">{category}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter and Search Bar */}
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
                placeholder="Search registered user, role, city..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  roleFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({registeredUsers.length})
              </button>
              <button
                onClick={() => setRoleFilter('talent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  roleFilter === 'talent'
                    ? 'bg-sky-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Talents ({registrationMetrics.talentCount})
              </button>
              <button
                onClick={() => setRoleFilter('provider')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  roleFilter === 'provider'
                    ? 'bg-amber-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Providers ({registrationMetrics.providerCount})
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredUsers.length}</strong> active members
          </div>
        </div>

        {/* Registered Users Table / List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Live Member Registry Directory
            </h3>
            <span className="text-xs text-slate-500">Instant Switch or View Passport</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredUsers.map(user => {
              const isSports = user.category === 'Sports';
              return (
                <div
                  key={user.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {user.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            user.role === 'talent'
                              ? 'bg-sky-50 text-sky-800 border border-sky-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {user.role}
                        </span>
                        {isSports && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Trophy className="w-2.5 h-2.5" />
                            Athlete
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 mt-0.5">
                        <span className="font-medium text-slate-800">{user.titleOrOrg}</span>
                        {user.category && (
                          <span className="text-slate-400"> • {user.category}</span>
                        )}
                        {user.location && (
                          <span className="text-slate-400"> • {user.location}</span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                        {user.phone && (
                          <span className="font-mono text-sky-800 bg-sky-50 px-1.5 py-0.2 rounded font-medium border border-sky-100">
                            📱 {user.phone}
                          </span>
                        )}
                        <span>Email: {user.email}</span>
                        <span>•</span>
                        <span>Joined: {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleViewUserPassport(user.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>{user.role === 'talent' ? 'Evidence Passport' : 'View Portal'}</span>
                    </button>

                    <button
                      id={`switch-user-btn-${user.id}`}
                      onClick={() => {
                        switchUser(user.id);
                        if (user.role === 'talent') {
                          setCurrentView('talent-dashboard');
                        } else {
                          setCurrentView('provider-dashboard');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log In As User</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
