import React, { useState } from 'react';
import { ScreenId } from '../types';

interface PrototypeNavHeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const PrototypeNavHeader: React.FC<PrototypeNavHeaderProps> = ({ currentScreen, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);

  const screens: { id: ScreenId; label: string; role: string; color: string; icon: string }[] = [
    { id: 'sign-in', label: '1. Sign-In Portal', role: 'Multi-Role Entry', color: 'from-orange-500 to-indigo-600', icon: 'lock' },
    { id: 'employee-portal', label: '2. Employee Portal', role: 'Alex Kumar', color: 'from-indigo-600 to-purple-600', icon: 'dashboard' },
    { id: 'hr-command', label: '3. HR Operations', role: 'Priya Sharma', color: 'from-purple-600 to-pink-600', icon: 'approval' },
    { id: 'governance', label: '4. Governance Command', role: 'Rajesh Mehta', color: 'from-amber-600 to-orange-600', icon: 'shield' },
  ];

  if (collapsed) {
    return (
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 text-slate-200 border border-slate-700/80 rounded-full shadow-lg backdrop-blur-md text-[11px] font-semibold hover:border-indigo-500 transition-all cursor-pointer"
          title="Open Prototype Navigation Flow Bar"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Prototype Screens ({screens.findIndex(s => s.id === currentScreen) + 1}/4)</span>
          <span className="material-symbols-outlined text-[14px]">expand_more</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 max-w-4xl w-[96%] sm:w-auto">
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-950/92 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl text-xs">
        <div className="hidden sm:flex items-center gap-2 pl-1 pr-2.5 border-r border-slate-800 text-slate-300 text-[11px] font-bold">
          <img
            src="/assets/aistudio/Screenshot_2026-10-22_at_11.47.26_PM_14fb2241.png"
            alt="MHK Logo"
            className="h-5 w-auto object-contain rounded bg-white px-1 py-0.5"
          />
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Flow</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {screens.map((s) => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onNavigate(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r text-white shadow-md ring-1 ring-white/20 ' + s.color
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{s.icon}</span>
                <span className="font-semibold text-[11px] sm:text-xs">{s.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full hidden md:inline font-mono ${isActive ? 'bg-black/25 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {s.role}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setCollapsed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
          title="Minimize Prototype Nav Bar"
        >
          <span className="material-symbols-outlined text-[16px]">expand_less</span>
        </button>
      </div>
    </div>
  );
};
