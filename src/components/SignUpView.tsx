import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, TalentCategory } from '../types';
import { UserCheck, Briefcase, Lock, Mail, Phone, User, Eye, EyeOff, AlertCircle, CheckCircle2, Trophy, BarChart3 } from 'lucide-react';

export const SignUpView: React.FC = () => {
  const { setCurrentView, setRole, updateProfile, registerUser, registrationMetrics } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<UserRole>('talent');
  const [discipline, setDiscipline] = useState<TalentCategory>('Sports');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please enter your full name.';
    else if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid email format (e.g. name@example.com).';
    }

    if (!password) {
      errs.password = 'Please create a secure password.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      // Register new user into persistent live registry
      registerUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+91 98765 00000',
        role: accountType,
        titleOrOrg: accountType === 'talent' ? `${discipline} Candidate` : 'Opportunity Partner',
        category: accountType === 'talent' ? discipline : 'Organization / Scout',
        location: 'Mumbai, India',
      });

      setRole(accountType);
      if (accountType === 'talent') {
        updateProfile({
          name: name.trim(),
          email: email.trim(),
          categories: [discipline],
        });
        setCurrentView('onboarding');
      } else {
        setCurrentView('provider-dashboard');
      }
    }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-3">
            TB
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create your TalentBridge account
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Join the evidence-based network connecting verified talent with top opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Account Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="signup-role-talent"
                onClick={() => setAccountType('talent')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  accountType === 'talent'
                    ? 'border-sky-500 bg-sky-50/70 text-sky-950 ring-1 ring-sky-500'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <UserCheck className={`w-5 h-5 ${accountType === 'talent' ? 'text-sky-600' : 'text-slate-400'}`} />
                  {accountType === 'talent' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                </div>
                <div>
                  <div className="font-bold text-sm">Talent</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Student, artist or creator</div>
                </div>
              </button>

              <button
                type="button"
                id="signup-role-provider"
                onClick={() => setAccountType('provider')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  accountType === 'provider'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-1 ring-amber-500'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Briefcase className={`w-5 h-5 ${accountType === 'provider' ? 'text-amber-600' : 'text-slate-400'}`} />
                  {accountType === 'provider' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <div>
                  <div className="font-bold text-sm">Provider</div>
                  <div className="text-[11px] text-slate-500 leading-tight">Organization, scout or mentor</div>
                </div>
              </button>
            </div>
          </div>

          {/* Discipline Selector if Talent */}
          {accountType === 'talent' && (
            <div>
              <label htmlFor="signup-discipline" className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Discipline
              </label>
              <select
                id="signup-discipline"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as TalentCategory)}
                className="w-full py-2 px-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Sports">Sports / Athletics</option>
                <option value="Music">Music & Performing Arts</option>
                <option value="Coding">Technology & Coding</option>
                <option value="Film">Film & Media</option>
                <option value="Dance">Dance</option>
                <option value="Art & Design">Art & Design</option>
                <option value="Writing & Literature">Writing & Literature</option>
                <option value="Entrepreneurship & Innovation">Entrepreneurship</option>
              </select>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="e.g. Rahul Kumar"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-sky-500 focus:border-sky-500 bg-white'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder="e.g. rahul.kumar@example.com"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-sky-500 focus:border-sky-500 bg-white'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Mobile Phone */}
          <div>
            <label htmlFor="signup-phone" className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Phone Number <span className="text-slate-400 font-normal">(for SMS OTP Sign In)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="signup-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-sky-500 focus:border-sky-500 bg-white"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              You can use this phone number to sign in instantly with an OTP.
            </p>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                placeholder="At least 6 characters"
                className={`w-full pl-9 pr-10 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-sky-500 focus:border-sky-500 bg-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            id="signup-submit-btn"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Creating your profile...</span>
            ) : (
              <span>Continue to {accountType === 'talent' ? 'Talent Onboarding' : 'Provider Dashboard'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Already have an account?{' '}
            <button
              id="signup-goto-login-btn"
              onClick={() => setCurrentView('login')}
              className="text-sky-700 hover:text-sky-900 font-bold hover:underline"
            >
              Sign In →
            </button>
          </div>

          <button
            onClick={() => setCurrentView('registration-dashboard')}
            className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Platform Registry ({registrationMetrics.totalRegistered})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
