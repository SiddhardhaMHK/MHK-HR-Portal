import React, { useState } from 'react';
import { AuditLogItem } from '../types';
import { useToast } from './Toast';

interface AuditFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogItem[];
}

export const AuditFeedModal: React.FC<AuditFeedModalProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  const { showToast } = useToast();
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const extraLogs: AuditLogItem[] = [
    ...logs,
    {
      id: 'audit-4',
      actor: 'David Vance (Legal Officer)',
      action: 'executed Form I-9 physical reverification for Texas Cloud Architect',
      timeAgo: '6h ago',
      location: 'IP 104.28.19.4 (Texas HQ)',
      icon: 'verified',
      iconColor: 'text-purple-600',
    },
    {
      id: 'audit-5',
      actor: 'Okta Adaptive Engine',
      action: 'evaluated 256 zero-trust device posture tokens (0 risky logins detected)',
      timeAgo: '12h ago',
      location: 'Okta Enterprise US-West',
      icon: 'shield_lock',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'audit-6',
      actor: 'Priya Sharma (HR Admin)',
      action: 'approved Casual Leave request for Vikram Malhotra (DevOps Lead)',
      timeAgo: '1d ago',
      location: 'IP 49.205.112.9 (Hyd Hub)',
      icon: 'date_range',
      iconColor: 'text-purple-600',
    },
    {
      id: 'audit-7',
      actor: 'System Automation',
      action: 'scheduled automated daily database backup to multi-region cloud bucket',
      timeAgo: '1d ago',
      location: 'GCP asia-south1',
      icon: 'cloud_sync',
      iconColor: 'text-blue-600',
    },
  ];

  const filtered = extraLogs.filter(
    (l) =>
      l.actor.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleExport = () => {
    showToast('Exported SOC-2 Type II audit log CSV with SHA256 integrity hash.', 'success', 'Export Complete');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">history_edu</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base">Full System Audit & Governance Trail</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  SOC-2 TYPE II
                </span>
              </div>
              <p className="text-xs text-slate-400">Immutable ledger of administrative permissions, I-9 reviews, and auth events</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter Input & Actions */}
        <div className="p-3.5 bg-white border-b border-slate-100 flex items-center justify-between gap-3 text-xs">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search audit trail by actor, IP, or action..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>

        {/* Log Entries */}
        <div className="p-4 overflow-y-auto space-y-2.5 text-xs">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${log.iconColor}`}>
                  {log.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-slate-800 leading-snug">
                    <strong className="text-slate-900">{log.actor}</strong> {log.action}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    {log.timeAgo} • {log.location}
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-500 text-[10px] font-mono shrink-0">
                {log.id.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Displaying {filtered.length} audit trail records</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#131b2e] hover:bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
