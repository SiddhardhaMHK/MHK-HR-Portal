import React, { useState, useEffect, useRef } from 'react';
import { ScreenId, DemoRoleKey } from '../types';
import { DEMO_ACCOUNTS } from '../data/mockData';
import { useToast } from './Toast';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenCommandPalette: () => void;
  onFocusCopilot?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenCommandPalette,
  onFocusCopilot,
}) => {
  const { showToast } = useToast();
  const [istTime, setIstTime] = useState<string>('');
  const [cstTime, setCstTime] = useState<string>('');
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Determine current active user based on screen
  let activeRoleKey: DemoRoleKey = 'alex';
  let workspaceTitle = 'My Workspace (Employee)';
  let workspaceDotColor = '#712ae2';

  if (currentScreen === 'hr-command') {
    activeRoleKey = 'priya';
    workspaceTitle = 'HR Console & Approvals';
    workspaceDotColor = '#f59e0b';
  } else if (currentScreen === 'governance') {
    activeRoleKey = 'rajesh';
    workspaceTitle = 'Super Admin / Governance';
    workspaceDotColor = '#ea580c';
  }

  const user = DEMO_ACCOUNTS[activeRoleKey];

  // Update live dual clocks
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const ist = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const cst = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Chicago',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setIstTime(ist);
      setCstTime(cst);
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) {
        setWorkspaceMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    setNotificationsOpen(false);
    showToast('All notifications marked as read', 'info');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 z-40 flex items-center justify-between px-4 sm:px-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Brand & Workspace Switcher */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => onNavigate('sign-in')}
          title="Return to Sign-In Portal"
        >
          <div className="h-9 px-2.5 py-0.5 bg-white rounded-lg border border-slate-200/90 shadow-xs flex items-center justify-center hover:border-purple-300 transition-colors">
            <img
              src="/assets/aistudio/image_1c54bfb8.png"
              alt="MHK Tech Inc."
              className="h-7 w-auto max-w-[150px] sm:max-w-[180px] object-contain"
            />
          </div>
          <div className="hidden lg:flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] uppercase font-bold tracking-wider">
                HR Portal
              </span>
            </div>
            <span className="text-[10px] text-slate-400 leading-none mt-0.5">Enterprise Cloud</span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden md:block mx-1"></div>

        {/* Workspace Switcher Dropdown */}
        <div className="relative" ref={workspaceRef}>
          <button
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-xs font-semibold cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: workspaceDotColor }}></span>
            <span className="hidden sm:inline">{workspaceTitle}</span>
            <span className="material-symbols-outlined text-[16px] text-slate-500">expand_more</span>
          </button>

          {workspaceMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Switch Workspace Context
              </div>
              <button
                onClick={() => {
                  onNavigate('employee-portal');
                  setWorkspaceMenuOpen(false);
                  showToast('Switched to Alex Kumar Employee Workspace', 'info');
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                  currentScreen === 'employee-portal' ? 'text-purple-700 font-bold bg-purple-50/50' : 'text-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <div>
                  <div className="font-semibold">My Workspace (Employee)</div>
                  <div className="text-[10px] text-slate-400">Alex Kumar • Sr. Software Eng</div>
                </div>
              </button>
              <button
                onClick={() => {
                  onNavigate('hr-command');
                  setWorkspaceMenuOpen(false);
                  showToast('Switched to HR Operations & Approvals Command', 'info');
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                  currentScreen === 'hr-command' ? 'text-purple-700 font-bold bg-purple-50/50' : 'text-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <div>
                  <div className="font-semibold">HR Console & Approvals</div>
                  <div className="text-[10px] text-slate-400">Priya Sharma • People Ops Lead</div>
                </div>
              </button>
              <button
                onClick={() => {
                  onNavigate('governance');
                  setWorkspaceMenuOpen(false);
                  showToast('Switched to System Administration & Governance', 'info');
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                  currentScreen === 'governance' ? 'text-purple-700 font-bold bg-purple-50/50' : 'text-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                <div>
                  <div className="font-semibold">Super Admin / Governance</div>
                  <div className="text-[10px] text-slate-400">Rajesh Mehta • VP Tech & Ops</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div
          onClick={onOpenCommandPalette}
          className="relative flex items-center px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-500 text-xs cursor-pointer border border-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px] mr-2 text-slate-400">search</span>
          <span className="flex-1 text-slate-500">Search employees, policies, tasks, or press ⌘K</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white text-slate-600 text-[10px] font-mono border border-slate-300 shadow-xs font-semibold">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Action Cluster */}
      <div className="flex items-center gap-3">
        {/* Live Dual Clocks */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5" title="Hyderabad Hub (IST Time)">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-600 text-[11px]">Hyderabad:</span>
            <span className="font-mono font-bold text-slate-900 text-[11px]">{istTime || '10:45 AM'}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5" title="Texas Global HQ (Texas Time / CST)">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="font-semibold text-slate-600 text-[11px]">Texas:</span>
            <span className="font-mono font-bold text-slate-900 text-[11px]">{cstTime || '11:15 PM'}</span>
          </div>
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white font-bold text-[9px]">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <span className="font-bold text-xs text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-purple-600 hover:underline font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                <div
                  className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => showToast('Opening emergency contact update dialog...', 'info')}
                >
                  <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Emergency Contact Incomplete
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Please update before month-end to ensure compliance.</p>
                </div>
                <div
                  className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => showToast('Engineering Sprint Demo scheduled for Thursday 3 PM', 'info')}
                >
                  <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Sprint Demo Scheduled
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Project Falcon Code Review at 2:00 PM today.</p>
                </div>
                <div
                  className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => showToast('Casual Leave approved by Manager for Nov 04', 'success')}
                >
                  <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Leave Approved
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Casual Leave for Nov 04 approved by Priya Sharma.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ask MHK AI Button */}
        <button
          onClick={() => {
            if (onFocusCopilot) onFocusCopilot();
            else showToast('MHK AI Copilot ready: Ask about leave policies or workflow drafts.', 'info');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-purple-600/20 hover:shadow-purple-600/40 transition-all active:scale-[0.98] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">spark</span>
          <span className="hidden sm:inline">Ask MHK AI</span>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-0.5"></div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
          >
            <img
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-600/20 group-hover:ring-purple-600 transition-all"
              src={user.avatar}
            />
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-xs font-bold text-slate-900">{user.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] uppercase font-bold font-mono ${user.badgeColor}`}>
                  {user.role}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 leading-tight">{user.roleTitle}</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-slate-600">
              expand_more
            </span>
          </div>

          {profileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="font-bold text-xs text-slate-900">{user.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                <div className="text-[10px] text-purple-600 font-semibold mt-0.5">Emp ID: {user.empId}</div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('employee-portal');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-400">person</span>
                  <span>Employee Workspace (Alex)</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('hr-command');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-400">approval</span>
                  <span>HR Operations (Priya)</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('governance');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-400">admin_panel_settings</span>
                  <span>Governance & Matrix (Rajesh)</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    onNavigate('sign-in');
                    setProfileMenuOpen(false);
                    showToast('Logged out of session. Return to Sign-In Portal.', 'info');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-red-500">logout</span>
                  <span>Sign Out to Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
