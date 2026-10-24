import React, { useState } from 'react';
import { UserRequestItem } from '../types';
import { useToast } from './Toast';

interface MyRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: UserRequestItem[];
  onOpenNewLeave: () => void;
  onOpenNewExpense: () => void;
}

export const MyRequestsModal: React.FC<MyRequestsModalProps> = ({
  isOpen,
  onClose,
  requests,
  onOpenNewLeave,
  onOpenNewExpense,
}) => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState('All');
  const [items, setItems] = useState<UserRequestItem[]>(requests);

  if (!isOpen) return null;

  const filtered = items.filter((r) => filter === 'All' || r.type === filter);

  const handleCancelRequest = (id: string, title: string) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
    showToast(`Request "${title}" cancelled successfully.`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">send_and_archive</span>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">My Self-Service Requests</h2>
              <p className="text-xs text-slate-400">Track and manage all submitted requests, claims, and approvals</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter and New Actions */}
        <div className="p-3.5 bg-white border-b border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            {['All', 'Leave', 'Expense', 'Equipment', 'Access'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenNewLeave();
              }}
              className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-semibold cursor-pointer"
            >
              + Apply Leave
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenNewExpense();
              }}
              className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold cursor-pointer"
            >
              + Submit Expense
            </button>
          </div>
        </div>

        {/* Request Items */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No requests found in this category.</div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      item.type === 'Leave'
                        ? 'bg-purple-100 text-purple-700'
                        : item.type === 'Expense'
                        ? 'bg-amber-100 text-amber-700'
                        : item.type === 'Equipment'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {item.type === 'Leave'
                        ? 'date_range'
                        : item.type === 'Expense'
                        ? 'payments'
                        : item.type === 'Equipment'
                        ? 'laptop_mac'
                        : 'lock_open'}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Submitted: {item.submittedDate} • Detail: <strong>{item.amountOrDuration}</strong> • Reviewer:{' '}
                      {item.reviewer}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.status}
                  </span>

                  {item.status === 'Pending' && (
                    <button
                      type="button"
                      onClick={() => handleCancelRequest(item.id, item.title)}
                      className="px-2 py-0.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 font-semibold text-[11px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tracking {items.length} requests in active cycle</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#131b2e] hover:bg-slate-900 text-white font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
