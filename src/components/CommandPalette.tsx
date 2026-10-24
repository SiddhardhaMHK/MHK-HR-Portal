import React, { useState, useEffect } from 'react';
import { ScreenId } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
  onAction: (actionName: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onAction,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickCommands = [
    { title: 'Go to Sign-In Portal (Role Switcher)', screen: 'sign-in' as ScreenId, icon: 'lock', category: 'Navigation' },
    { title: "Go to Alex Kumar's Employee Workspace", screen: 'employee-portal' as ScreenId, icon: 'dashboard', category: 'Navigation' },
    { title: "Go to Priya Sharma's HR Operations Command", screen: 'hr-command' as ScreenId, icon: 'approval', category: 'Navigation' },
    { title: "Go to Rajesh Mehta's Governance & Permissions", screen: 'governance' as ScreenId, icon: 'shield', category: 'Navigation' },
    { title: 'Apply for Leave (Casual / Sick / Privilege)', action: 'apply-leave', icon: 'date_range', category: 'Quick Actions' },
    { title: 'Clock In / Clock Out Session Toggle', action: 'toggle-clock', icon: 'schedule', category: 'Quick Actions' },
    { title: 'Review Form I-9 Pending Verification', action: 'i9-verify', icon: 'verified_user', category: 'Compliance' },
    { title: 'Export Security Audit Report (SOC2 / ISO)', action: 'export-audit', icon: 'download', category: 'Compliance' },
    { title: 'Publish Handbook Version 2.4', action: 'publish-handbook', icon: 'menu_book', category: 'Governance' },
  ];

  const filtered = quickCommands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <span className="material-symbols-outlined text-[20px] text-slate-400 mr-2.5">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, employee name, or workspace..."
            className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] uppercase font-mono font-bold">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto py-2 divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching commands or navigation routes found.
            </div>
          ) : (
            filtered.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.screen) {
                    onNavigate(item.screen);
                  } else if (item.action) {
                    onAction(item.action);
                  }
                  onClose();
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{item.category}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-300 group-hover:text-purple-600 transition-colors">
                  arrow_forward
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press <strong>⌘K</strong> anywhere to summon command center</span>
          <span>MHK Nexus Core 4.8.2</span>
        </div>
      </div>
    </div>
  );
};
