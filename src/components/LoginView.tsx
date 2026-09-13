import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Phone,
  KeyRound,
  UserCheck,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Trophy,
  LogOut,
  RotateCcw,
  Smartphone,
  Copy,
  Check,
  MessageSquareQuote
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const {
    login,
    sendOtp,
    verifyOtpAndLogin,
    logout,
    isAuthenticated,
    currentUser,
    setRole,
    setCurrentView,
    registeredUsers,
    registrationMetrics,
    switchUser,
  } = useApp();

  // Authentication form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [accountType, setAccountType] = useState<UserRole>('talent');
  const [fullName, setFullName] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'verify'>('phone');

  // Simulated SMS dispatch feedback
  const [dispatchedOtp, setDispatchedOtp] = useState<string | null>(null);
  const [dispatchMessage, setDispatchMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Status & timing
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);

  // Timer effect for resend cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Quick login accounts filter
  const talentAccounts = registeredUsers.filter(u => u.role === 'talent');
  const providerAccounts = registeredUsers.filter(u => u.role === 'provider');

  // Helper to get formatted full phone
  const getFullPhone = () => {
    const raw = phoneNumber.trim();
    if (raw.startsWith('+')) return raw;
    return `${countryCode} ${raw}`;
  };

  // Step 1: Send OTP to Phone Number
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const raw = phoneNumber.replace(/\D/g, '');
    if (raw.length < 7) {
      setErrorMessage('Please enter a valid mobile number (e.g. 98765 43210).');
      return;
    }

    setIsSendingOtp(true);
    try {
      const fullPhone = getFullPhone();
      const res = await sendOtp(fullPhone);

      setDispatchedOtp(res.otp);
      setDispatchMessage(`TalentBridge SMS delivered to ${fullPhone}`);
      setOtpStep('verify');
      setCountdown(30); // 30s resend timer
      setSuccessMessage(`OTP sent successfully to ${fullPhone}! Enter code below.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to send OTP. Please check the phone number.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Verify OTP and log in
  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otpValue.trim()) {
      setErrorMessage('Please enter the 6-digit OTP received on your mobile phone.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const fullPhone = getFullPhone();
      const result = verifyOtpAndLogin(fullPhone, otpValue.trim(), accountType, fullName);

      if (result.success) {
        setSuccessMessage('Verification successful! Taking you to your dashboard...');
      } else {
        setErrorMessage(result.error || 'Invalid OTP. Please check the SMS or use the auto-fill button.');
      }
    }, 450);
  };

  // Quick auto-fill generated OTP for instant testing
  const handleAutoFillOtp = (otp: string) => {
    setOtpValue(otp);
    setErrorMessage('');
  };

  // 1-Click quick test using a registered user's phone number
  const handleQuickPhoneLogin = (user: (typeof registeredUsers)[0]) => {
    setErrorMessage('');
    setSuccessMessage('');
    setAccountType(user.role);

    if (user.phone) {
      // Split country code if present
      const clean = user.phone.replace(/\D/g, '');
      const last10 = clean.slice(-10);
      setPhoneNumber(last10);
      setFullName(user.name);

      // Generate and immediately dispatch OTP for this user
      setIsSendingOtp(true);
      sendOtp(user.phone)
        .then(res => {
          setDispatchedOtp(res.otp);
          setDispatchMessage(`TalentBridge SMS sent to ${user.name}'s mobile (${user.phone})`);
          setOtpValue(res.otp); // Pre-fill for ultra-smooth testing!
          setOtpStep('verify');
          setCountdown(30);
          setSuccessMessage(`OTP generated for ${user.name} (${res.otp}). Click 'Verify & Sign In' below.`);
        })
        .finally(() => setIsSendingOtp(false));
    } else {
      // Fallback switchUser directly
      switchUser(user.id);
    }
  };

  // Copy OTP to clipboard helper
  const handleCopyOtp = (text: string) => {
    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Status Banner with Live Network & Session Status */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-sky-300">
                  TalentBridge Auth Network
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-sm font-semibold text-slate-100">
                Mobile Number & OTP Authentication Gateway
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="text-center bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <div className="font-extrabold text-white text-base leading-none">
                {registrationMetrics.totalRegistered}
              </div>
              <div className="text-[10px] text-sky-200 mt-0.5">Active Members</div>
            </div>

            <button
              id="login-view-live-dashboard-btn"
              onClick={() => setCurrentView('registration-dashboard')}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Watch Live Registry</span>
            </button>
          </div>
        </div>

        {/* Active Session Notification (If already logged in) */}
        {isAuthenticated && currentUser && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-11 h-11 rounded-xl object-cover border border-emerald-300 shadow-2xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-emerald-950">
                    Currently Logged In as {currentUser.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-xs text-emerald-800 mt-0.5 flex items-center gap-2">
                  <span>Mobile: {currentUser.phone || 'Verified Session'}</span>
                  <span>•</span>
                  <span>{currentUser.titleOrOrg}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id="active-session-dashboard-btn"
                onClick={() =>
                  setCurrentView(currentUser.role === 'talent' ? 'talent-dashboard' : 'provider-dashboard')
                }
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Go to Dashboard →
              </button>

              <button
                id="active-session-logout-btn"
                onClick={() => logout()}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Log out of this account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Mobile + OTP Login Form Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                TB
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Mobile & OTP Login
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Enter your mobile number to receive a secure one-time verification code (OTP).
              </p>
            </div>

            {/* Account Role Selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Sign in as:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="login-role-talent-btn"
                  onClick={() => {
                    setAccountType('talent');
                    setErrorMessage('');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    accountType === 'talent'
                      ? 'border-sky-500 bg-sky-50/70 text-sky-950 ring-1 ring-sky-500'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className={`w-5 h-5 ${accountType === 'talent' ? 'text-sky-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-bold text-xs sm:text-sm">Talent & Athlete</div>
                    <div className="text-[10px] text-slate-500">Sports, Arts, Tech</div>
                  </div>
                </button>

                <button
                  type="button"
                  id="login-role-provider-btn"
                  onClick={() => {
                    setAccountType('provider');
                    setErrorMessage('');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    accountType === 'provider'
                      ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-1 ring-amber-500'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className={`w-5 h-5 ${accountType === 'provider' ? 'text-amber-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-bold text-xs sm:text-sm">Provider & Scout</div>
                    <div className="text-[10px] text-slate-500">Org, Academy, Club</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            {/* Realistic SMS Dispatched Notification Box (appears when OTP is sent) */}
            {dispatchedOtp && (
              <div className="mb-5 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-300/80 rounded-2xl p-4 text-xs text-sky-950 shadow-xs relative">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span>Simulated SMS Dispatch</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {dispatchMessage || `Sent to ${getFullPhone()}`}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono bg-sky-200/80 text-sky-900 px-2 py-0.5 rounded-md font-semibold">
                    Live SMS
                  </span>
                </div>

                <div className="mt-3 bg-white border border-sky-200 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div className="font-mono text-slate-800 text-xs">
                    <span className="text-slate-500 text-[11px] block">Your One-Time Password:</span>
                    <strong className="text-lg text-sky-700 tracking-widest font-black">
                      {dispatchedOtp}
                    </strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      id="autofill-otp-btn"
                      onClick={() => handleAutoFillOtp(dispatchedOtp)}
                      className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                    >
                      Auto-fill Code
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyOtp(dispatchedOtp)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Copy OTP"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                  <span>Testing hint: Universal code <strong>123456</strong> is also accepted</span>
                  {countdown > 0 && (
                    <span className="text-sky-700 font-semibold">Resend in {countdown}s</span>
                  )}
                </div>
              </div>
            )}

            {/* Step 1 Form: Phone Number Input */}
            {otpStep === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="login-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="login-country-code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="+91">🇮🇳 +91 (IN)</option>
                      <option value="+1">🇺🇸 +1 (US)</option>
                      <option value="+44">🇬🇧 +44 (UK)</option>
                      <option value="+971">🇦🇪 +971 (UAE)</option>
                      <option value="+65">🇸🇬 +65 (SG)</option>
                      <option value="+61">🇦🇺 +61 (AU)</option>
                    </select>

                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="login-phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 98765 43210"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                        autoFocus
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    We will send a 6-digit verification code to this mobile number.
                  </p>
                </div>

                <div>
                  <label htmlFor="login-optional-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-slate-400 font-normal">(Optional for new users)</span>
                  </label>
                  <input
                    id="login-optional-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={accountType === 'talent' ? 'e.g. Rohan Verma' : 'e.g. Horizon Foundation Scout'}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  id="send-otp-submit-btn"
                  disabled={isSendingOtp}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSendingOtp ? (
                    <span>Sending Verification Code...</span>
                  ) : (
                    <>
                      <span>Send Verification OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2 Form: Enter & Verify OTP */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Verifying Mobile Number:</span>
                    <strong className="text-slate-800 text-sm font-bold">{getFullPhone()}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep('phone');
                      setErrorMessage('');
                    }}
                    className="text-xs text-sky-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>

                <div>
                  <label htmlFor="login-otp" className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter 6-Digit Verification Code (OTP) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="login-otp"
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 482910"
                      className="w-full pl-9 pr-3 py-2.5 text-base tracking-widest font-mono font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Didn't receive the SMS?</span>
                  <button
                    type="button"
                    disabled={countdown > 0 || isSendingOtp}
                    onClick={() => handleSendOtp()}
                    className="font-semibold text-sky-700 hover:text-sky-900 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>

                <button
                  type="submit"
                  id="verify-otp-submit-btn"
                  disabled={isVerifying || otpValue.trim().length === 0}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <span>Verifying Code & Signing In...</span>
                  ) : (
                    <>
                      <span>Verify & Sign In to {accountType === 'talent' ? 'Talent Hub' : 'Provider Portal'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpStep('phone');
                    setErrorMessage('');
                  }}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-700 py-1 font-medium cursor-pointer"
                >
                  ← Back to phone entry
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Looking for account registration?</span>
              <button
                id="login-goto-signup-btn"
                onClick={() => setCurrentView('signup')}
                className="text-sky-700 hover:text-sky-900 font-bold hover:underline cursor-pointer"
              >
                Register New Member →
              </button>
            </div>
          </div>

          {/* Quick 1-Click Access for Live Registered Profiles with Real Phone Numbers */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Quick Test Profiles (Pre-loaded Numbers)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click any verified member to instantly populate their phone number & test OTP verification.
                  </p>
                </div>
                <span className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                  {registeredUsers.length} in Registry
                </span>
              </div>

              {/* Athletes Spotlight */}
              <div className="mb-4">
                <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>Verified Athletes & Sports Candidates:</span>
                </div>
                <div className="space-y-2">
                  {talentAccounts
                    .filter(u => u.category === 'Sports')
                    .map(user => (
                      <button
                        key={user.id}
                        id={`quick-phone-login-${user.id}`}
                        onClick={() => handleQuickPhoneLogin(user)}
                        className="w-full p-2.5 rounded-xl border border-amber-200/80 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-300 transition-all flex items-center justify-between text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-9 h-9 rounded-xl object-cover border border-amber-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900 group-hover:text-amber-950 flex items-center gap-1.5">
                              <span>{user.name}</span>
                              <span className="text-[10px] text-amber-800 font-mono bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                                {user.phone || '+91 98765 43210'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {user.titleOrOrg} • {user.location}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-amber-900 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          <span>Use Number</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Other Talents Spotlight */}
              <div className="mb-4">
                <div className="text-[11px] font-bold text-sky-900 uppercase tracking-wider mb-2">
                  Creative & Technical Talents:
                </div>
                <div className="space-y-2">
                  {talentAccounts
                    .filter(u => u.category !== 'Sports')
                    .slice(0, 3)
                    .map(user => (
                      <button
                        key={user.id}
                        id={`quick-phone-login-${user.id}`}
                        onClick={() => handleQuickPhoneLogin(user)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-sky-50/50 hover:border-sky-300 transition-all flex items-center justify-between text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900 group-hover:text-sky-900 flex items-center gap-1.5">
                              <span>{user.name}</span>
                              <span className="text-[10px] text-slate-600 font-mono bg-slate-100 px-1.5 py-0.2 rounded">
                                {user.phone || '+91 98222 33445'}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {user.titleOrOrg} • {user.category}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-sky-700 group-hover:translate-x-0.5 transition-transform">
                          Use Number →
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Opportunity Providers Spotlight */}
              <div>
                <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-2">
                  Scouts & Opportunity Providers:
                </div>
                <div className="space-y-2">
                  {providerAccounts.slice(0, 2).map(user => (
                    <button
                      key={user.id}
                      id={`quick-phone-login-${user.id}`}
                      onClick={() => handleQuickPhoneLogin(user)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-950 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            <span className="text-[10px] text-emerald-800 font-mono bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                              {user.phone || '+91 98999 11223'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {user.titleOrOrg} • Scout / Org
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                        Use Provider →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Registration Telemetry Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Real-Time Member Directory</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Inspect active members, phone numbers, and evidence credentials in the live registry.
                </div>
              </div>
              <button
                onClick={() => setCurrentView('registration-dashboard')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                Inspect Directory
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
