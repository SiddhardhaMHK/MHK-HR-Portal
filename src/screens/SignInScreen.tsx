import React, { useState, useEffect } from 'react';
import { ScreenId, DemoRoleKey } from '../types';
import { DEMO_ACCOUNTS } from '../data/mockData';
import { useToast } from '../components/Toast';

interface SignInScreenProps {
  onSignIn: (targetScreen: ScreenId, roleKey: DemoRoleKey) => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn }) => {
  const { showToast } = useToast();
  const [selectedRole, setSelectedRole] = useState<DemoRoleKey>('alex');
  const [activeTab, setActiveTab] = useState<'login' | 'recovery'>('login');
  const [domain, setDomain] = useState('mhktech.nexus-cloud.net');
  const [email, setEmail] = useState('alex.kumar@mhktechinc.com');
  const [password, setPassword] = useState('DemoAlexPassword2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [trustWorkstation, setTrustWorkstation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState<{ type: 'success' | 'info'; text: string; subtext: string } | null>(null);

  // Recovery state
  const [recoveryEmail, setRecoveryEmail] = useState('alex.kumar@mhktechinc.com');
  const [recoveryReason, setRecoveryReason] = useState('Lost Password / Expired Credentials');
  const [isRecovering, setIsRecovering] = useState(false);
  const [otpDispatched, setOtpDispatched] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');

  // Modals state
  const [modalType, setModalType] = useState<'support' | 'subsidiary' | 'privacy' | 'zerotrust' | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketPriority, setTicketPriority] = useState('High');
  const [ticketDescription, setTicketDescription] = useState('');
  const [subsidiaryName, setSubsidiaryName] = useState('');
  const [subsidiaryCountry, setSubsidiaryCountry] = useState('United States');

  // Dual Clocks (Hyderabad and Texas times)
  const [hydClock, setHydClock] = useState('');
  const [texasClock, setTexasClock] = useState('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setHydClock(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setTexasClock(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/Chicago',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectRole = (key: DemoRoleKey) => {
    setSelectedRole(key);
    const account = DEMO_ACCOUNTS[key];
    setDomain(account.domain);
    setEmail(account.email);
    setPassword(account.defaultPassword);
    setRecoveryEmail(account.email);
    setLoginFeedback(null);
    showToast(`${account.name} (${account.role}) credentials populated`, 'info', 'Role Profile Loaded');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginFeedback(null);

    const account = DEMO_ACCOUNTS[selectedRole];

    setTimeout(() => {
      setIsSubmitting(false);
      setLoginFeedback({
        type: 'success',
        text: 'Access Granted. Redirecting to workspace...',
        subtext: `Identity verified for ${email} via Okta Adaptive MFA.`,
      });
      showToast(`Welcome back! Redirecting to workspace for ${email}...`, 'success', 'Access Granted');

      setTimeout(() => {
        onSignIn(account.targetScreen, selectedRole);
      }, 900);
    }, 1000);
  };

  const handleRecoverySubmit = () => {
    setIsRecovering(true);
    setTimeout(() => {
      setIsRecovering(false);
      setOtpDispatched(true);
      setEnteredOtp('894210');
      setLoginFeedback({
        type: 'info',
        text: 'Magic Link & Verification OTP Dispatched',
        subtext: `A 6-digit recovery OTP (use 894210 for instant demo verification) has been sent to ${recoveryEmail}.`,
      });
      showToast(`Verification code sent to ${recoveryEmail}. Demo code: 894210`, 'info', 'Recovery Code Dispatched');
    }, 900);
  };

  const handleVerifyOtpAndLogin = () => {
    if (!enteredOtp) return;
    const account = DEMO_ACCOUNTS[selectedRole];
    showToast('OTP verified successfully! Redirecting...', 'success', 'Identity Confirmed');
    setTimeout(() => {
      onSignIn(account.targetScreen, selectedRole);
    }, 800);
  };

  const handleTrustChange = (checked: boolean) => {
    setTrustWorkstation(checked);
    if (checked) {
      showToast('Zero-Trust device token stored for 30 consecutive days.', 'success', 'Workstation Trusted');
    } else {
      showToast('Workstation will require Okta re-verification on browser close.', 'info', 'Ephemeral Session');
    }
  };

  const handleCreateSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setModalType(null);
    showToast(
      `Support ticket #INC-89421 created for "${ticketSubject || 'Account Assistance'}". An IT technician has been assigned.`,
      'success',
      'Ticket Created'
    );
    setTicketSubject('');
    setTicketDescription('');
  };

  const handleRegisterSubsidiary = (e: React.FormEvent) => {
    e.preventDefault();
    setModalType(null);
    showToast(
      `Subsidiary intake dossier filed for "${subsidiaryName || 'Offshore Unit'}" in ${subsidiaryCountry}. Compliance review pending.`,
      'info',
      'Entity Registered'
    );
    setSubsidiaryName('');
  };

  const currentAccount = DEMO_ACCOUNTS[selectedRole];

  return (
    <div className="min-h-screen text-slate-800 font-sans antialiased bg-gradient-to-br from-slate-50 via-white to-purple-50/40 flex flex-col justify-between relative selection:bg-purple-600 selection:text-white">
      {/* Support / Register / Compliance Modals in Clean White Executive Styling */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                  <span className="material-symbols-outlined text-[22px]">
                    {modalType === 'support'
                      ? 'support_agent'
                      : modalType === 'subsidiary'
                      ? 'domain_add'
                      : modalType === 'privacy'
                      ? 'privacy_tip'
                      : 'verified_user'}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {modalType === 'support'
                      ? 'IT Helpdesk Incident Desk'
                      : modalType === 'subsidiary'
                      ? 'Register Corporate Subsidiary'
                      : modalType === 'privacy'
                      ? 'MHK Privacy & Data Charter'
                      : 'Continuous Zero-Trust Security'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {modalType === 'support'
                      ? 'Enterprise Service Management Tier-1'
                      : modalType === 'subsidiary'
                      ? 'Multi-Tenant Entity Intake'
                      : 'SOC-2 Type II & ISO 27001'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {modalType === 'support' && (
              <form onSubmit={handleCreateSupportTicket} className="py-4 text-xs text-slate-700 space-y-3">
                <div className="bg-purple-50/60 border border-purple-100 p-3 rounded-xl space-y-1 font-mono text-[11px]">
                  <div>
                    <strong className="text-slate-600">Direct Desk:</strong>{' '}
                    <span className="text-purple-700 font-semibold">+1 (469) 555-0192 (Texas HQ)</span>
                  </div>
                  <div>
                    <strong className="text-slate-600">India Desk:</strong>{' '}
                    <span className="text-purple-700 font-semibold">+91 (40) 6712-4000 (HYD)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Issue Subject</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Okta Verify device unpair request or hardware provisioning"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Urgency</label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option>P1 - Critical (Blocked)</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">User Account</label>
                    <input
                      type="text"
                      readOnly
                      value={email}
                      className="w-full px-2.5 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Details</label>
                  <textarea
                    rows={2}
                    required
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Describe error message or workstation hostname..."
                    className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs resize-none"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-purple-700 hover:bg-purple-800 text-white shadow-md shadow-purple-700/20 transition-colors cursor-pointer"
                  >
                    Submit Support Incident
                  </button>
                </div>
              </form>
            )}

            {modalType === 'subsidiary' && (
              <form onSubmit={handleRegisterSubsidiary} className="py-4 text-xs text-slate-700 space-y-3">
                <p className="text-slate-600">
                  To integrate an affiliated entity, joint venture, or regional offshore subsidiary under the MHK Tech Inc. unified HRMS cluster:
                </p>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Subsidiary Legal Name</label>
                  <input
                    type="text"
                    required
                    value={subsidiaryName}
                    onChange={(e) => setSubsidiaryName(e.target.value)}
                    placeholder="e.g. MHK Cloud Solutions UK Ltd"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Jurisdiction / Country</label>
                  <select
                    value={subsidiaryCountry}
                    onChange={(e) => setSubsidiaryCountry(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option>United States (Texas / Delaware)</option>
                    <option>India (Hyderabad Special Economic Zone)</option>
                    <option>United Kingdom (London)</option>
                    <option>Singapore (APAC Regional)</option>
                    <option>Canada (Ontario)</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-100 text-[11px] text-purple-900 space-y-1">
                  <div><strong>Requires:</strong> Corporate EIN/CIN &amp; Form I-9 Designated Agent.</div>
                  <div className="text-slate-600">Intake documentation packet will be routed to legal and people operations.</div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-purple-700 hover:bg-purple-800 text-white shadow-md shadow-purple-700/20 transition-colors cursor-pointer"
                  >
                    Dispatch Intake Dossier
                  </button>
                </div>
              </form>
            )}

            {modalType === 'privacy' && (
              <div className="py-4 text-xs text-slate-700 space-y-3 leading-relaxed">
                <p>
                  <strong>MHK Privacy Charter (v2026.1):</strong> We enforce strict data localization and role-based masking for all employee personally identifiable information (PII), SSNs, bank ACH records, and biometric logs.
                </p>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1 font-mono text-[11px] text-slate-700">
                  <div>✓ HIPAA &amp; GDPR Article 28 Compliant</div>
                  <div>✓ Automated 90-day encryption key rotation</div>
                  <div>✓ Strict US DOL and Form I-9 retention governance</div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-purple-700 hover:bg-purple-800 text-white cursor-pointer"
                  >
                    Acknowledged
                  </button>
                </div>
              </div>
            )}

            {modalType === 'zerotrust' && (
              <div className="py-4 text-xs text-slate-700 space-y-3 leading-relaxed">
                <p>
                  <strong>Zero-Trust Architecture:</strong> Each session is continuously evaluated against device posture tokens, IP geolocation risk scores, and FIPS-140-3 cryptographic modules.
                </p>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1 font-mono text-[11px] text-slate-700">
                  <div>✓ Okta Adaptive Multi-Factor Authentication</div>
                  <div>✓ Mutual TLS 1.3 across all cluster microservices</div>
                  <div>✓ Session revocation on unknown network shift</div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-purple-700 hover:bg-purple-800 text-white cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TopBar in Clean White Styling */}
      <header className="w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-6 py-3.5 z-30 sticky top-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="h-11 px-3 py-1 bg-white rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-center">
              <img
                alt="MHK Tech Inc."
                className="h-8 sm:h-9 w-auto max-w-[180px] sm:max-w-[220px] object-contain"
                src="/assets/aistudio/image_1c54bfb8.png"
              />
            </div>
            <div className="hidden sm:block border-l border-slate-200 pl-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Enterprise HRMS</span>
              <p className="text-[11px] text-slate-500 font-medium">Nexus Core 4.8.2-GA</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 text-xs">
            {/* Live Dual Clocks: Hyderabad and Texas */}
            <div className="hidden md:flex items-center space-x-3">
              <div
                className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/90 text-slate-600 shadow-xs"
                title="Hyderabad Regional Delivery Center"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-slate-700">Hyderabad (IST):</span>
                <span className="font-mono text-emerald-700 font-bold tracking-wide">
                  {hydClock || '01:23:38 AM'}
                </span>
              </div>
              <div
                className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/90 text-slate-600 shadow-xs"
                title="Texas Global HQ (CST)"
              >
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                </span>
                <span className="font-semibold text-slate-700">Texas (CST):</span>
                <span className="font-mono text-purple-700 font-bold tracking-wide">
                  {texasClock || '02:53:38 PM'}
                </span>
              </div>
            </div>

            {/* Security Badge */}
            <div
              onClick={() =>
                showToast(
                  'Continuous zero-trust session evaluation active with FIPS-140-3 cryptography.',
                  'info',
                  'Security Status'
                )
              }
              className="flex items-center space-x-2 text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full shadow-xs cursor-pointer hover:bg-emerald-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="font-semibold tracking-tight text-[11px] sm:text-xs">256-Bit SSL • Zero-Trust SSO</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
        {/* Soft background ambient gradient accents */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-orange-200/25 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-blue-100/30 rounded-full blur-[130px] pointer-events-none"></div>

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Hero Column with Effective User Logo showcase */}
          <section className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-4 max-w-lg">
              {/* Highlight Logo Card */}
              <div className="inline-flex items-center gap-3 p-3 sm:p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-md shadow-slate-200/60">
                <img
                  src="/assets/aistudio/image_1c54bfb8.png"
                  alt="MHK Tech Inc."
                  className="h-11 sm:h-12 w-auto object-contain"
                />
                <div className="border-l border-slate-200 pl-3 pr-1 text-left">
                  <div className="text-[12px] sm:text-xs font-bold text-slate-900 leading-tight">
                    MHK Tech Inc.
                  </div>
                  <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                    Unified Global HRMS Portal
                  </div>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Welcome to <br />
                <span className="bg-gradient-to-r from-orange-600 via-purple-700 to-indigo-600 bg-clip-text text-transparent">
                  MHK Tech INC
                </span>
              </h1>

            </div>
          </section>

          {/* Right Login Card & Demo Role Switcher in Modern Crisp White */}
          <section className="lg:col-span-6 flex flex-col items-center justify-center w-full">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/70 relative overflow-hidden border border-slate-200">
              {/* Top Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-purple-600 to-indigo-600"></div>

              {/* DEMO ROLE SWITCHER (Mandatory Product Requirement) */}
              <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                    </svg>
                    DEMO ROLE SWITCHER (INSTANT PREVIEW)
                  </span>
                  <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-mono font-semibold">
                    Auto-populates
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Role 1: Alex Kumar */}
                  <button
                    type="button"
                    onClick={() => handleSelectRole('alex')}
                    className={`text-left p-2.5 rounded-xl border transition-all duration-200 text-xs active:scale-[0.98] cursor-pointer ${
                      selectedRole === 'alex'
                        ? 'bg-purple-50/90 border-purple-500 text-purple-900 shadow-xs ring-2 ring-purple-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold truncate text-[12px] text-slate-900">Alex Kumar</div>
                    <div className="text-[10px] text-slate-500 truncate">Sr. Software Eng.</div>
                    <div className="mt-1 flex items-center text-[9px] text-purple-700 font-bold uppercase">
                      Employee
                    </div>
                  </button>

                  {/* Role 2: Priya Sharma */}
                  <button
                    type="button"
                    onClick={() => handleSelectRole('priya')}
                    className={`text-left p-2.5 rounded-xl border transition-all duration-200 text-xs active:scale-[0.98] cursor-pointer ${
                      selectedRole === 'priya'
                        ? 'bg-purple-50/90 border-purple-500 text-purple-900 shadow-xs ring-2 ring-purple-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold truncate text-[12px] text-slate-900">Priya Sharma</div>
                    <div className="text-[10px] text-slate-500 truncate">People Ops Lead</div>
                    <div className="mt-1 flex items-center text-[9px] text-amber-700 font-bold uppercase">
                      HR Admin
                    </div>
                  </button>

                  {/* Role 3: Rajesh Mehta */}
                  <button
                    type="button"
                    onClick={() => handleSelectRole('rajesh')}
                    className={`text-left p-2.5 rounded-xl border transition-all duration-200 text-xs active:scale-[0.98] cursor-pointer ${
                      selectedRole === 'rajesh'
                        ? 'bg-purple-50/90 border-purple-500 text-purple-900 shadow-xs ring-2 ring-purple-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold truncate text-[12px] text-slate-900">Rajesh Mehta</div>
                    <div className="text-[10px] text-slate-500 truncate">VP Tech &amp; Ops</div>
                    <div className="mt-1 flex items-center text-[9px] text-orange-700 font-bold uppercase">
                      Super Admin
                    </div>
                  </button>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                  <div>
                    Signing in to: <strong className="text-purple-800 font-semibold">{currentAccount.roleTitle}</strong>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${currentAccount.badgeColor}`}>
                    {currentAccount.badge}
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 mb-5 relative">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setLoginFeedback(null);
                  }}
                  className={`pb-2.5 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
                    activeTab === 'login'
                      ? 'border-purple-700 text-purple-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Employee Portal Sign-In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('recovery');
                    setLoginFeedback(null);
                  }}
                  className={`pb-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ml-6 cursor-pointer ${
                    activeTab === 'recovery'
                      ? 'border-purple-700 text-purple-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Forgot Access / Recovery
                </button>
              </div>

              {/* TAB 1: LOGIN FORM */}
              {activeTab === 'login' ? (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Organization Domain */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">Organization Domain</label>
                      <span className="inline-flex items-center text-[10px] text-emerald-700 font-bold">
                        <svg className="w-3 h-3 mr-1 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Tenant Verified
                      </span>
                    </div>
                    <div className="relative rounded-lg shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined text-[18px]">domain</span>
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={domain}
                        className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Work Email / Employee ID */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-slate-700">Work Email or Employee ID</label>
                      <span className="text-[11px] text-purple-700 font-medium">Texas HQ or Hyderabad Hub ID</span>
                    </div>
                    <div className="relative rounded-lg shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@mhktechinc.com or MHK-1042"
                        className="block w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password with Show/Hide Toggle */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-slate-700">Portal Password</label>
                      <button
                        type="button"
                        onClick={() => setActiveTab('recovery')}
                        className="text-[11px] text-purple-700 hover:text-purple-800 font-semibold transition-colors cursor-pointer"
                      >
                        Forgot key?
                      </button>
                    </div>
                    <div className="relative rounded-lg shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your confidential password"
                        className="block w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Trust Workstation */}
                  <div className="flex items-center justify-between py-0.5">
                    <label className="flex items-center space-x-2.5 text-xs text-slate-700 select-none cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={trustWorkstation}
                        onChange={(e) => handleTrustChange(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 rounded bg-white border border-slate-300 peer-checked:bg-purple-700 peer-checked:border-purple-700 transition-all flex items-center justify-center group-hover:border-purple-500 shadow-xs">
                        {trustWorkstation && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="group-hover:text-slate-900 font-medium transition-colors">Trust this workstation (30 Days)</span>
                    </label>
                    <span className="text-[11px] text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded font-mono font-semibold">
                      Okta Verify Ready
                    </span>
                  </div>

                  {/* Submit CTA Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-purple-700/20 transition-all duration-200 transform active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-80"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        <span>Authenticating via Okta SSO...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">login</span>
                        <span>Sign In to Portal</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* TAB 2: RECOVERY FORM */
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start space-x-2.5">
                    <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0 mt-0.5">warning</span>
                    <div>
                      Password recovery requires access to your official <strong>@mhktechinc.com</strong> inbox or registered corporate mobile number.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter your Employee ID or Corporate Email
                    </label>
                    <input
                      type="text"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="e.g. alex.kumar@mhktechinc.com or MHK-1042"
                      className="block w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Recovery Reason</label>
                    <select
                      value={recoveryReason}
                      onChange={(e) => setRecoveryReason(e.target.value)}
                      className="block w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option>Lost Password / Expired Credentials</option>
                      <option>MFA Device Reset (New Mobile / Authenticator)</option>
                      <option>Account Locked (Too many unsuccessful tries)</option>
                    </select>
                  </div>

                  {!otpDispatched ? (
                    <button
                      type="button"
                      disabled={isRecovering}
                      onClick={handleRecoverySubmit}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                    >
                      {isRecovering ? (
                        <>
                          <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                          <span>Dispatching Security Tokens...</span>
                        </>
                      ) : (
                        <span>Dispatch Verification Magic Link &amp; OTP</span>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-semibold text-slate-700">Enter 6-Digit OTP</label>
                          <span className="text-[10px] text-emerald-700 font-mono font-bold">Auto-filled: 894210</span>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          placeholder="894210"
                          className="block w-full text-center tracking-widest text-lg font-mono py-2 rounded-lg bg-slate-50 border border-slate-200 text-emerald-700 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyOtpAndLogin}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Verify OTP &amp; Sign In to Workspace</span>
                      </button>
                    </div>
                  )}

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        setOtpDispatched(false);
                      }}
                      className="text-xs text-purple-700 hover:text-purple-800 transition-colors font-semibold cursor-pointer"
                    >
                      ← Return to Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Notification / Success Feedback Banner */}
              {loginFeedback && (
                <div
                  className={`mt-4 p-3.5 rounded-xl border text-xs font-medium shadow-xs transition-all animate-in fade-in duration-200 ${
                    loginFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-blue-50 border-blue-300 text-blue-900'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600 mt-0.5 shrink-0">
                      check_circle
                    </span>
                    <div>
                      <strong className="text-slate-900 block">{loginFeedback.text}</strong>
                      <p className="mt-0.5 text-slate-600">{loginFeedback.subtext}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Footer Helpers inside Card */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
                <div>
                  Need IT support?{' '}
                  <button
                    type="button"
                    onClick={() => setModalType('support')}
                    className="text-purple-700 hover:text-purple-900 underline font-semibold transition-colors cursor-pointer"
                  >
                    IT Helpdesk Hub
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setModalType('subsidiary')}
                    className="text-slate-600 hover:text-slate-900 underline transition-colors cursor-pointer font-medium"
                  >
                    Register Subsidiary
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Compliance Footer in Clean Executive White Theme */}
      <footer className="w-full border-t border-slate-200 bg-white/95 py-4 px-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-2.5 justify-center md:justify-start">
            <img
              src="/assets/aistudio/image_1c54bfb8.png"
              alt="MHK Tech Inc."
              className="h-6 w-auto object-contain"
            />
            <span>
              © 2026 <strong>MHK Tech Inc.</strong> All rights reserved.
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-500 flex-wrap justify-center">
            <span>ISO 27001 Certified</span>
            <span>•</span>
            <span>SOC-2 Type II Attested</span>
            <span>•</span>
            <span>US DOL &amp; H-1B Form I-9 Compliant</span>
            <span>•</span>
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-purple-700 underline transition-colors cursor-pointer font-medium"
            >
              Privacy Charter
            </button>
            <span>•</span>
            <button
              onClick={() => setModalType('zerotrust')}
              className="hover:text-purple-700 underline transition-colors cursor-pointer font-medium"
            >
              Zero-Trust Architecture
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
