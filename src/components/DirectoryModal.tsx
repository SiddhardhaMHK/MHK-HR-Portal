import React, { useState } from 'react';
import { DirectoryEmployee } from '../types';
import { useToast } from './Toast';

interface DirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: DirectoryEmployee[];
}

export const DirectoryModal: React.FC<DirectoryModalProps> = ({
  isOpen,
  onClose,
  employees,
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [hubFilter, setHubFilter] = useState('All');

  if (!isOpen) return null;

  const departments = ['All', 'Core Platform Engineering', 'Human Resources & Talent', 'Global Leadership & IT', 'Design & User Experience', 'Enterprise Architecture'];
  const hubs = ['All', 'Hyderabad', 'Texas', 'Client Travel'];

  const filtered = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = departmentFilter === 'All' || emp.department === departmentFilter;
    const matchHub = hubFilter === 'All' || emp.hub === hubFilter;
    return matchSearch && matchDept && matchHub;
  });

  const handleMessage = (name: string, email: string) => {
    showToast(`Starting Google Chat conversation with ${name} (${email})`, 'info');
  };

  const handleCall = (name: string, phone: string) => {
    showToast(`Dialing extension for ${name}: ${phone}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base">Employee Directory & Org</h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold font-mono">
                  248 PERSONNEL
                </span>
              </div>
              <p className="text-xs text-slate-400">Search colleagues across Hyderabad Hub, Texas HQ, and remote sites</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[220px]">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role, email, or department..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : d}
                </option>
              ))}
            </select>

            <select
              value={hubFilter}
              onChange={(e) => setHubFilter(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
            >
              {hubs.map((h) => (
                <option key={h} value={h}>
                  {h === 'All' ? 'All Hubs' : h}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Cards Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {filtered.map((emp) => (
            <div
              key={emp.id}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all flex items-start justify-between gap-3 shadow-xs"
            >
              <div className="flex items-start gap-3 min-w-0">
                <img
                  alt={emp.name}
                  className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-purple-100 mt-0.5"
                  src={emp.avatar}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs">{emp.name}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                        emp.status === 'In Office'
                          ? 'bg-emerald-100 text-emerald-800'
                          : emp.status === 'Remote'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-purple-700">{emp.role}</div>
                  <div className="text-[10px] text-slate-400 truncate">{emp.department}</div>

                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-slate-400">location_on</span>
                      <span>{emp.hub}</span>
                    </span>
                    <span>•</span>
                    <span className="truncate">{emp.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMessage(emp.name, emp.email)}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-colors cursor-pointer"
                  title="Message in Chat"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCall(emp.name, emp.phone)}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors cursor-pointer"
                  title="Call Extension"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} active employee profiles</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
