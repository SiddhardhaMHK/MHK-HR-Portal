import React, { useState } from 'react';
import { ScreenId, PermissionRow, SignerRecord } from '../types';
import { INITIAL_PERMISSIONS, INITIAL_SIGNERS, INITIAL_AUDIT_LOGS } from '../data/mockData';
import { useToast } from '../components/Toast';

interface GovernanceScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenAuditFeed?: () => void;
  onOpenDirectory?: () => void;
  onOpenDocuments?: () => void;
}

export const GovernanceScreen: React.FC<GovernanceScreenProps> = ({
  onNavigate,
  onOpenAuditFeed,
  onOpenDirectory,
  onOpenDocuments,
}) => {
  const { showToast } = useToast();

  // Matrix State
  const [permissions, setPermissions] = useState<PermissionRow[]>(INITIAL_PERMISSIONS);
  const [activeRoleFilter, setActiveRoleFilter] = useState<'all' | 'employee' | 'hr' | 'admin'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [pendingChanges, setPendingChanges] = useState(0);

  // Signers State
  const [signers, setSigners] = useState<SignerRecord[]>(INITIAL_SIGNERS);
  const [addSignerModalOpen, setAddSignerModalOpen] = useState(false);
  const [signerDetailModalOpen, setSignerDetailModalOpen] = useState(false);
  const [selectedSigner, setSelectedSigner] = useState<SignerRecord | null>(null);
  const [newSignerName, setNewSignerName] = useState('');
  const [newSignerTitle, setNewSignerTitle] = useState('');
  const [newSignerEmail, setNewSignerEmail] = useState('');
  const [newSignerScope, setNewSignerScope] = useState('');

  // Handbook State
  const [handbookVersion, setHandbookVersion] = useState<'draft' | 'published'>('draft');
  const [revisions, setRevisions] = useState([
    {
      id: 'rev-1',
      title: '3.2: Hybrid Work & Dual-Hub Overlap Protocol',
      meta: '2,840 chars • Hyd-Texas alignment',
    },
    {
      id: 'rev-2',
      title: '6.4: H-1B Prevailing Wage & Travel Reimbursement',
      meta: '4,120 chars • DOL compliance',
    },
    {
      id: 'rev-3',
      title: '8.1: Whistleblower Anonymous Reporting Procedure',
      meta: '1,950 chars • Zero-retaliation token',
    },
  ]);
  const [addSectionModalOpen, setAddSectionModalOpen] = useState(false);
  const [editSectionModalOpen, setEditSectionModalOpen] = useState(false);
  const [editingRev, setEditingRev] = useState<{ id: string; title: string; meta: string } | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');

  // Client Contracts State
  const [clientContractModalOpen, setClientContractModalOpen] = useState(false);
  const [clientContracts, setClientContracts] = useState([
    { id: 'msa-1', client: 'Apex Global Logistics', service: 'Cloud Infrastructure & SRE Retainer', value: '$1,450,000 / yr', term: 'Oct 2024 - Oct 2027', sla: '99.95%', status: 'Active (Tier 1)' },
    { id: 'msa-2', client: 'FinCorp Americas', service: 'Payment Rail Modernization SOW', value: '$880,000 / yr', term: 'Jan 2025 - Dec 2026', sla: '99.99%', status: 'Active (Tier 1)' },
    { id: 'msa-3', client: 'CloudScale Technologies', service: 'Enterprise DevOps & Security Support', value: '$620,000 / yr', term: 'May 2025 - Apr 2027', sla: '99.90%', status: 'Active (Standard)' },
  ]);
  const [newClientName, setNewClientName] = useState('');
  const [newClientService, setNewClientService] = useState('');
  const [newClientValue, setNewClientValue] = useState('');
  const [newClientTerm, setNewClientTerm] = useState('');

  // Whistleblower Cases State
  const [whistleblowerModalOpen, setWhistleblowerModalOpen] = useState(false);
  const [whistleblowerCases, setWhistleblowerCases] = useState([
    { id: 'WB-2026-081', topic: 'Vendor Cloud Compute Margin Review', date: 'Oct 20, 2026', status: 'Under Counsel Review', token: 'SHA-88a2...3f1c', priority: 'High', summary: 'Anonymous submission regarding third-party cloud compute invoice reconciliation.' },
    { id: 'WB-2026-074', topic: 'Hyd-Texas Dual-Hub Overlap Protocol Clarification', date: 'Oct 14, 2026', status: 'Resolved & Codified in Policy 3.2', token: 'SHA-41c9...8b90', priority: 'Standard', summary: 'Inquiry regarding shared cross-hub sprint handover expectations.' },
  ]);

  // API Billing & Rate Limits State
  const [apiBillingModalOpen, setApiBillingModalOpen] = useState(false);
  const [apiRateLimit, setApiRateLimit] = useState(15000);
  const [apiSecretKey, setApiSecretKey] = useState('mhk_live_sec_892348a8f10b27e4');
  const [isKeyRevealed, setIsKeyRevealed] = useState(false);

  // Security Policies State
  const [securityPolicyModalOpen, setSecurityPolicyModalOpen] = useState(false);
  const [mfaEnforcedSuperAdmin, setMfaEnforcedSuperAdmin] = useState(true);
  const [biometricPasskeyRequired, setBiometricPasskeyRequired] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30 min');
  const [ipWhitelists, setIpWhitelists] = useState([
    { id: 'ip-1', label: 'Texas HQ Corporate Gateway', cidr: '198.51.100.0/24', location: 'Texas, US', status: 'Enforced' },
    { id: 'ip-2', label: 'Hyderabad Dev Campus Gateway', cidr: '203.0.113.0/24', location: 'Hyderabad, IN', status: 'Enforced' },
    { id: 'ip-3', label: 'Authorized AWS/GCP CI/CD Runners', cidr: '35.180.0.0/16', location: 'Cloud Infra', status: 'Active' },
  ]);
  const [newIpLabel, setNewIpLabel] = useState('');
  const [newIpCidr, setNewIpCidr] = useState('');

  // Admin Broadcast Composer
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState('All Workspaces (Employee + HR)');
  const [broadcastCategory, setBroadcastCategory] = useState('System Alert');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [activeAdminBroadcasts, setActiveAdminBroadcasts] = useState([
    {
      id: 'bc-1',
      title: 'Dual-Hub Synchronized Maintenance Window',
      audience: 'All Workspaces (Employee + HR)',
      category: 'System Alert',
      message: 'Scheduled PostgreSQL replica maintenance this Sunday at 02:00 AM CST (12:30 PM IST). Zero downtime expected.',
      time: '2 hours ago',
    },
  ]);

  const handleTogglePerm = (id: string, role: 'employee' | 'hr' | 'admin') => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (role === 'employee' && !p.employeeDisabled) {
            return { ...p, employeeAllowed: !p.employeeAllowed };
          }
          if (role === 'hr' && !p.hrDisabled) {
            return { ...p, hrAllowed: !p.hrAllowed };
          }
          if (role === 'admin' && !p.adminDisabled) {
            return { ...p, adminAllowed: !p.adminAllowed };
          }
        }
        return p;
      })
    );
    setPendingChanges((prev) => prev + 1);
  };

  const handleResetPermissions = () => {
    setPermissions(INITIAL_PERMISSIONS);
    setPendingChanges(0);
    showToast('Role permissions matrix restored to corporate baseline defaults.', 'info', 'Matrix Reset');
  };

  const handleSavePolicy = () => {
    setPendingChanges(0);
    showToast(
      'Security governance policies and role matrix successfully propagated across 256 Okta tenant claims and LDAP endpoints.',
      'success',
      'Policy Propagated'
    );
  };

  const handleExportAudit = () => {
    const csvContent =
      'Timestamp,Actor,Role,Action,IP Address,Location,Status,SHA256 Checksum\n' +
      INITIAL_AUDIT_LOGS.map(
        (log) =>
          `"${new Date().toISOString()}",` +
          `"${log.actor}",` +
          `"Super Admin",` +
          `"${log.action}",` +
          `"104.28.19.4",` +
          `"${log.location}",` +
          `"VERIFIED_AUDIT_TRAIL",` +
          `"${log.id}-9f81a7b2"`
      ).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MHK_Security_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('SOC-2 / ISO security audit log report exported as CSV.', 'success', 'Audit Export Complete');
  };

  const handleReverifySigner = (signerId: string) => {
    setSigners((prev) =>
      prev.map((s) => (s.id === signerId ? { ...s, status: 'Active' as const } : s))
    );
    showToast(
      'Elena Ramos credentials re-verified with Treasury and IRS 8821 power-of-attorney.',
      'success',
      'Signer Verified'
    );
  };

  const handleRevokeSigner = (signerId: string, signerName?: string) => {
    const target = signers.find((s) => s.id === signerId);
    const name = signerName || target?.name || 'Corporate Signer';
    setSigners((prev) => prev.filter((s) => s.id !== signerId));
    setSignerDetailModalOpen(false);
    showToast(`Signer authorization for ${name} has been revoked and signature token suspended.`, 'error', 'Signer Revoked');
  };

  const handleAddSignerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSignerName || !newSignerEmail) return;

    const initials = newSignerName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const newSigner: SignerRecord = {
      id: `sig-${Date.now()}`,
      initials,
      name: newSignerName,
      slotTitle: 'Authorized Delegate',
      title: newSignerTitle || 'Corporate Officer',
      email: newSignerEmail,
      scope: newSignerScope || 'General Corporate Contracts',
      status: 'Active',
      issuedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    setSigners((prev) => [...prev, newSigner]);
    setAddSignerModalOpen(false);
    setNewSignerName('');
    setNewSignerEmail('');
    setNewSignerTitle('');
    setNewSignerScope('');
    showToast(`Added ${newSignerName} as Authorized Corporate Signer.`, 'success', 'Signer Credentialed');
  };

  const handleAddContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientService) return;
    const newContract = {
      id: `msa-${Date.now()}`,
      client: newClientName,
      service: newClientService,
      value: newClientValue || '$750,000 / yr',
      term: newClientTerm || 'Nov 2026 - Nov 2028',
      sla: '99.95%',
      status: 'Active (Tier 1)',
    };
    setClientContracts((prev) => [newContract, ...prev]);
    setNewClientName('');
    setNewClientService('');
    setNewClientValue('');
    setNewClientTerm('');
    showToast(`Client MSA registered for ${newContract.client}.`, 'success', 'Contract Added');
  };

  const handleAddSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      title: newSectionTitle,
      meta: `${newSectionContent.length} chars • Just added to Draft v2.4`,
    };
    setRevisions((prev) => [...prev, newRev]);
    setAddSectionModalOpen(false);
    setNewSectionTitle('');
    setNewSectionContent('');
    showToast(`Added section "${newSectionTitle}" to Handbook Draft v2.4`, 'success', 'Section Added');
  };

  const handleEditSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRev) return;
    setRevisions((prev) =>
      prev.map((r) =>
        r.id === editingRev.id
          ? { ...r, title: editingRev.title, meta: `${newSectionContent.length || 2400} chars • Revised just now` }
          : r
      )
    );
    setEditSectionModalOpen(false);
    setEditingRev(null);
    showToast('Handbook clause updated in Draft v2.4 queue.', 'success', 'Clause Updated');
  };

  const handleDeleteRevision = (revId: string) => {
    setRevisions((prev) => prev.filter((r) => r.id !== revId));
    showToast('Revision removed from Draft queue.', 'info');
  };

  const handlePublishHandbook = () => {
    setHandbookVersion('published');
    showToast(
      'Handbook v2.4 Published! Mandatory signing dispatched to 256 active personnel via interactive modal.',
      'success',
      'Handbook v2.4 Live'
    );
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) {
      showToast('Please enter both announcement title and message content.', 'warning');
      return;
    }
    const newBc = {
      id: `bc-${Date.now()}`,
      title: broadcastTitle,
      audience: broadcastAudience,
      category: broadcastCategory,
      message: broadcastMsg,
      time: 'Just now',
    };
    setActiveAdminBroadcasts((prev) => [newBc, ...prev]);
    setBroadcastTitle('');
    setBroadcastMsg('');
    showToast(
      `Live announcement broadcasted across Texas HQ & Hyderabad Hub workspaces for: ${broadcastAudience}`,
      'success',
      'Broadcast Live'
    );
  };

  const handleRetractBroadcast = (id: string) => {
    setActiveAdminBroadcasts((prev) => prev.filter((b) => b.id !== id));
    showToast('Broadcast banner retracted from user workspaces.', 'info');
  };

  const handleAddIpCidr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpLabel || !newIpCidr) return;
    const newIp = {
      id: `ip-${Date.now()}`,
      label: newIpLabel,
      cidr: newIpCidr,
      location: 'Custom Subnet',
      status: 'Enforced',
    };
    setIpWhitelists((prev) => [...prev, newIp]);
    setNewIpLabel('');
    setNewIpCidr('');
    showToast(`CIDR block ${newIp.cidr} added to network firewall whitelist.`, 'success', 'IP Whitelisted');
  };

  const handleDeleteIpCidr = (id: string) => {
    setIpWhitelists((prev) => prev.filter((ip) => ip.id !== id));
    showToast('CIDR block removed from firewall whitelist.', 'info');
  };

  const filteredPermissions = permissions.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.scope.toLowerCase().includes(searchFilter.toLowerCase());
    return matchSearch;
  });

  // Group by category
  const categories = Array.from(new Set(filteredPermissions.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-800 flex flex-col pt-16">
      {/* Add Signer Modal */}
      {addSignerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-700 text-[22px]">draw</span>
                <h3 className="font-bold text-slate-900 text-base">Add Authorized Signer</h3>
              </div>
              <button onClick={() => setAddSignerModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddSignerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newSignerName}
                  onChange={(e) => setNewSignerName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Corporate Title</label>
                <input
                  type="text"
                  required
                  value={newSignerTitle}
                  onChange={(e) => setNewSignerTitle(e.target.value)}
                  placeholder="e.g. Director of Finance"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={newSignerEmail}
                  onChange={(e) => setNewSignerEmail(e.target.value)}
                  placeholder="r.adams@mhktech.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Authorization Scope</label>
                <input
                  type="text"
                  required
                  value={newSignerScope}
                  onChange={(e) => setNewSignerScope(e.target.value)}
                  placeholder="Banking ACH, Payroll, IRS 8821"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddSignerModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Credential Signer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Handbook Section Modal */}
      {addSectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-700 text-[22px]">post_add</span>
                <h3 className="font-bold text-slate-900 text-base">Add Handbook Clause</h3>
              </div>
              <button onClick={() => setAddSectionModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddSectionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Clause Number & Title</label>
                <input
                  type="text"
                  required
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="e.g. 9.3: Remote Equipment Security Protocol"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Clause Text</label>
                <textarea
                  rows={4}
                  required
                  value={newSectionContent}
                  onChange={(e) => setNewSectionContent(e.target.value)}
                  placeholder="Enter detailed policy text compliant with DOL and state labor codes..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none text-xs"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddSectionModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Stage into Draft v2.4
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Handbook Clause Modal */}
      {editSectionModalOpen && editingRev && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-700 text-[22px]">edit_note</span>
                <h3 className="font-bold text-slate-900 text-base">Edit Handbook Revision Clause</h3>
              </div>
              <button onClick={() => { setEditSectionModalOpen(false); setEditingRev(null); }} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleEditSectionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Clause Title</label>
                <input
                  type="text"
                  required
                  value={editingRev.title}
                  onChange={(e) => setEditingRev({ ...editingRev, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Metadata / Target Scope</label>
                <input
                  type="text"
                  required
                  value={editingRev.meta}
                  onChange={(e) => setEditingRev({ ...editingRev, meta: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setEditSectionModalOpen(false); setEditingRev(null); }}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Save Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client & Contract Management Modal */}
      {clientContractModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">contract</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Client MSAs & Corporate Master Services Agreements</h3>
                  <p className="text-xs text-slate-400">Enterprise accounts, active bilateral contracts, and binding legal terms</p>
                </div>
              </div>
              <button onClick={() => setClientContractModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active MSAs ({clientContracts.length})</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Texas & Delaware Jurisdiction</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Client Organization</th>
                      <th className="py-2.5 px-3">MSA Reference</th>
                      <th className="py-2.5 px-3">Effective - Expiry</th>
                      <th className="py-2.5 px-3">Tier</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clientContracts.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{c.client}</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-purple-700">{c.id.toUpperCase()}</td>
                        <td className="py-3 px-3 text-slate-600">{c.term}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">{c.value}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const content = `MHK TECH INC. MASTER SERVICES AGREEMENT (MSA)\nClient: ${c.client}\nScope: ${c.service}\nTerm: ${c.term}\nAnnual Value: ${c.value}\nSLA Guarantee: ${c.sla}\nStatus: ${c.status}\nJurisdiction: State of Texas, USA\nAuthorized Signers: Rajesh Mehta, Priya Sharma`;
                              const blob = new Blob([content], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${c.client.replace(/\s+/g, '_')}_MSA.txt`;
                              a.click();
                              URL.revokeObjectURL(url);
                              showToast(`Downloaded executed MSA for ${c.client}`, 'success');
                            }}
                            className="p-1 text-purple-700 hover:bg-purple-50 rounded cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold"
                            title="Download Agreement"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            <span>Agreement</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add new contract mini form */}
            <form onSubmit={handleAddContractSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-purple-700">add_circle</span>
                <span>Register Executed Enterprise Contract</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Client Entity</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Service & Scope</label>
                  <input
                    type="text"
                    required
                    value={newClientService}
                    onChange={(e) => setNewClientService(e.target.value)}
                    placeholder="e.g. Cloud Arch SOW"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Contract Term</label>
                  <input
                    type="text"
                    required
                    value={newClientTerm}
                    onChange={(e) => setNewClientTerm(e.target.value)}
                    placeholder="e.g. Nov 2026 - Nov 2028"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Annual Value</label>
                  <input
                    type="text"
                    value={newClientValue}
                    onChange={(e) => setNewClientValue(e.target.value)}
                    placeholder="e.g. $850,000 / yr"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">file_upload</span>
                  <span>Register MSA</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Legal & Whistleblower Portal Modal */}
      {whistleblowerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">gavel</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Legal Ethics & Whistleblower Escalation Safe Harbor</h3>
                  <p className="text-xs text-slate-400">Zero-knowledge encrypted intake with external legal counsel oversight</p>
                </div>
              </div>
              <button onClick={() => setWhistleblowerModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between text-xs text-purple-900">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-purple-700">lock</span>
                <span className="font-semibold">PGP Encrypted • Zero-Trust Identity Anonymization Active</span>
              </div>
              <span className="font-mono text-[10px] bg-purple-200/60 px-2 py-0.5 rounded text-purple-900">2048-BIT RSA</span>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Escalation Queue & Case Files</span>
              {whistleblowerCases.map((wb) => (
                <div key={wb.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-xs">{wb.id}</span>
                      <span className="font-semibold text-slate-700">{wb.topic}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      wb.status.includes('Resolved') ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {wb.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{wb.summary}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Filed: <strong className="text-slate-700 font-mono">{wb.date}</strong></span>
                    <span>Priority: <strong className="text-purple-700">{wb.priority}</strong></span>
                    <span>Reporter Hash: <strong className="text-purple-700 font-mono">{wb.token}</strong></span>
                  </div>
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200/60">
                    {wb.status !== 'Resolved' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setWhistleblowerCases((prev) => prev.map((c) => (c.id === wb.id ? { ...c, status: 'Resolved' } : c)));
                          showToast(`Case ${wb.id} resolved and archived with external counsel sign-off.`, 'success');
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] cursor-pointer"
                      >
                        Sign Off & Resolve Case
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Archived to Legal Ledger
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* API Usage & Billing Modal */}
      {apiBillingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">API Gateways, Rate Limits & Cloud Billing</h3>
                  <p className="text-xs text-slate-400">Enterprise Cloud HRMS REST endpoints and infrastructure tiering</p>
                </div>
              </div>
              <button onClick={() => setApiBillingModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400">Total Calls MTD</div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">1,420,840</div>
                <div className="text-[10px] text-emerald-600 font-semibold">99.98% Success</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400">Current Cost</div>
                <div className="text-xl font-extrabold text-purple-700 mt-0.5">$184.20</div>
                <div className="text-[10px] text-slate-500">Cap: $500.00/mo</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400">p95 Latency</div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">12 ms</div>
                <div className="text-[10px] text-purple-600 font-semibold">Texas ↔ Hyd Sync</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">API Key Credentials</span>
                <button
                  type="button"
                  onClick={() => setIsKeyRevealed(!isKeyRevealed)}
                  className="text-purple-700 font-semibold text-[11px] hover:underline cursor-pointer"
                >
                  {isKeyRevealed ? 'Hide Secret' : 'Reveal Secret'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type={isKeyRevealed ? 'text' : 'password'}
                  readOnly
                  value={apiSecretKey}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-[11px] text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(apiSecretKey);
                    showToast('Copied API Secret Key to clipboard', 'success');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Gateway Rate Limit (Requests per Minute)</label>
                <span className="font-mono font-bold text-purple-700 text-xs">{apiRateLimit} req/min</span>
              </div>
              <input
                type="range"
                min="1000"
                max="20000"
                step="500"
                value={apiRateLimit}
                onChange={(e) => setApiRateLimit(Number(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1,000 / min</span>
                <span>Default: 5,000 / min</span>
                <span>20,000 / min</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast(`API Rate limit updated to ${apiRateLimit} req/min. Changes applied across edge nodes.`, 'success');
                  setApiBillingModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer"
              >
                Apply Rate Limits & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security & Zero-Trust Policies Modal */}
      {securityPolicyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">shield_lock</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Zero-Trust & Adaptive Security Policy</h3>
                  <p className="text-xs text-slate-400">Identity assertions, MFA posture, session longevity, and firewall CIDR blocks</p>
                </div>
              </div>
              <button onClick={() => setSecurityPolicyModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-800">Mandate Okta MFA for All Super Admins</div>
                  <div className="text-[11px] text-slate-500">Require step-up push notification or FIDO2 hardware key on every privileged login</div>
                </div>
                <input
                  type="checkbox"
                  checked={mfaEnforcedSuperAdmin}
                  onChange={(e) => setMfaEnforcedSuperAdmin(e.target.checked)}
                  className="w-5 h-5 rounded text-purple-700 accent-purple-700 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-800">Biometric Passkey (WebAuthn) Required</div>
                  <div className="text-[11px] text-slate-500">Disallows fallback to SMS or one-time code for wire disbursements and role edits</div>
                </div>
                <input
                  type="checkbox"
                  checked={biometricPasskeyRequired}
                  onChange={(e) => setBiometricPasskeyRequired(e.target.checked)}
                  className="w-5 h-5 rounded text-purple-700 accent-purple-700 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-800">Session Inactivity Timeout</div>
                  <div className="text-[11px] text-slate-500">Automatically locks console after idle duration</div>
                </div>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 text-xs"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="240">4 Hours</option>
                </select>
              </div>

              {/* IP Whitelist CIDR blocks */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Corporate Firewall Whitelisted CIDRs</span>
                  <span className="text-[10px] text-slate-400 font-mono">{ipWhitelists.length} active ranges</span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {ipWhitelists.map((ip) => (
                    <div key={ip.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                      <div>
                        <span className="font-semibold text-slate-800 text-[11px] mr-2">{ip.label}</span>
                        <span className="font-mono text-purple-700 text-[10px] bg-purple-50 px-1.5 py-0.5 rounded">{ip.cidr}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteIpCidr(ip.id)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Remove CIDR"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddIpCidr} className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    required
                    placeholder="Location Label (e.g. Texas Branch 2)"
                    value={newIpLabel}
                    onChange={(e) => setNewIpLabel(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="192.168.1.0/24"
                    value={newIpCidr}
                    onChange={(e) => setNewIpCidr(e.target.value)}
                    className="w-32 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs cursor-pointer shrink-0"
                  >
                    + Add
                  </button>
                </form>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  showToast('Security policies applied across Texas and Hyderabad cloud regions.', 'success');
                  setSecurityPolicyModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer"
              >
                Commit Security Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Signer Credentials & Form 8821 Dossier Modal */}
      {signerDetailModalOpen && selectedSigner && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-sm">
                  {selectedSigner.initials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedSigner.name}</h3>
                  <p className="text-xs text-purple-700 font-semibold">{selectedSigner.slotTitle} • {selectedSigner.title}</p>
                </div>
              </div>
              <button onClick={() => { setSignerDetailModalOpen(false); setSelectedSigner(null); }} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Official Email:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedSigner.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Credential Status:</span>
                  <span className="font-bold text-emerald-700">{selectedSigner.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issued Date:</span>
                  <span className="font-mono text-slate-700">{selectedSigner.issuedDate}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Authorization Scope</label>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-800">
                  {selectedSigner.scope}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 text-purple-900 space-y-1">
                <div className="font-bold text-[11px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>DocuSign PKI X.509 Certificate</span>
                </div>
                <div className="font-mono text-[10px] text-purple-700 break-all">
                  SHA256: 7f:2a:44:91:c8:03:d5:b1:e4:60:8f:93:ac:5e:10:48:99:c2:d0:bb
                </div>
                <div className="text-[10px] text-purple-800">Valid through: December 31, 2026 • IRS Form 8821 on file</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const content = `IRS FORM 8821 TAX INFORMATION AUTHORIZATION\nCorporate Entity: MHK Tech Inc.\nSigner: ${selectedSigner.name}\nTitle: ${selectedSigner.title}\nEmail: ${selectedSigner.email}\nScope: ${selectedSigner.scope}\nIssued: ${selectedSigner.issuedDate}\nStatus: Verified Active`;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `IRS_Form_8821_${selectedSigner.name.replace(/\s+/g, '_')}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                  showToast(`Downloaded Form 8821 Tax Dossier for ${selectedSigner.name}`, 'success');
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download Form 8821</span>
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleRevokeSigner(selectedSigner.id);
                    setSignerDetailModalOpen(false);
                    setSelectedSigner(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs cursor-pointer"
                >
                  Revoke Authorization
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Cryptographic credentials re-validated for ${selectedSigner.name}`, 'success');
                    setSignerDetailModalOpen(false);
                    setSelectedSigner(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between py-4 px-3 shrink-0">
          <div className="space-y-4">
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">ADMIN OVERSIGHT</span>
              <nav className="mt-2 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  <span>Overview & Governance</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-[#131b2e] text-white font-bold text-xs shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  <span>Roles & Permissions Matrix</span>
                </button>
                <button
                  onClick={() => onOpenAuditFeed ? onOpenAuditFeed() : showToast('Displaying real-time SOC2 audit logs (0 critical alerts)', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">history_edu</span>
                  <span>System Audit Log</span>
                </button>
              </nav>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                GOVERNANCE & COMPLIANCE
              </span>
              <nav className="mt-2 space-y-1">
                <button
                  onClick={() => setHandbookVersion('draft')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  <span>Handbook Administration</span>
                </button>
                <button
                  onClick={() => setAddSignerModalOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">draw</span>
                  <span>Authorized Signers</span>
                </button>
                <button
                  onClick={() => setClientContractModalOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">contract</span>
                  <span>Client & Contract Mgmt</span>
                </button>
                <button
                  onClick={() => setWhistleblowerModalOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                  <span>Legal & Whistleblower</span>
                </button>
              </nav>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                SYSTEM & INTEGRATIONS
              </span>
              <nav className="mt-2 space-y-1">
                <button
                  onClick={() => setApiBillingModalOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  <span>API Usage & Billing</span>
                </button>
                <button
                  onClick={() => setSecurityPolicyModalOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">shield_lock</span>
                  <span>Security & Auth Policies</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
              <span className="font-semibold text-slate-700 text-[11px]">99.98% Uptime</span>
            </div>
            <span className="text-purple-600 font-bold text-[10px]">Operational</span>
          </div>
        </aside>

        {/* Center Main Governance Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto w-full space-y-6">
          {/* Breadcrumb & Top Action Header */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <span>Admin Console</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-slate-900">Overview & Permissions Matrix</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                  <span>Texas Central Time (CST): 11:15 PM</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold text-[10px] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[13px]">shield</span>
                  <span>SUPER ADMIN</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-jakarta tracking-tight">
                  System Administration & Governance Command
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Enterprise security policy enforcement, multi-role granular permissions, authorized signers, and governance workflows.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleResetPermissions}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                  title="Restore baseline RBAC policy defaults"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">restart_alt</span>
                  <span>Reset Matrix</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportAudit}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-500">file_download</span>
                  <span>Export Security Audit Report</span>
                </button>
                <button
                  type="button"
                  onClick={handleSavePolicy}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-md shadow-purple-700/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Save Permissions Policy</span>
                </button>
              </div>
            </div>
          </section>

          {/* Top Admin Stat KPI Strip (5 cards) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* KPI 1: Active Users */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Users</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1 font-jakarta">
                    256 <span className="text-xs font-normal text-slate-400">Total</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-purple-700">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-purple-700 font-bold">+14 this month</span>
                <span>248 Emp • 6 HR • 2 Adm</span>
              </div>
            </div>

            {/* KPI 2: Active Employees */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Employees</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1 font-jakarta">248</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-purple-700">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>182 Hyd Hub</span>
                <span>48 Texas HQ</span>
                <span>18 Client</span>
              </div>
            </div>

            {/* KPI 3: HR & Admins */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">HR & Admins</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1 font-jakarta">8 Privileged</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-purple-700">
                  <span className="material-symbols-outlined text-[18px]">security</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-slate-800">100% MFA Active</span>
                <span className="text-slate-400">• 0 Violations</span>
              </div>
            </div>

            {/* KPI 4: Governance Queue */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Governance Queue</span>
                  <div className="text-2xl font-extrabold text-orange-600 mt-1 font-jakarta">4 Actions</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700">
                  <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>1 Handbook v2.4</span>
                <span>1 Signer</span>
                <span>2 Elevation</span>
              </div>
            </div>

            {/* KPI 5: API & Integration Calls */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    API & Integration Calls
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1 font-jakarta">
                    1.42M <span className="text-xs font-normal text-slate-400">reqs</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-purple-700">
                  <span className="material-symbols-outlined text-[18px]">query_stats</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-purple-700 font-bold">99.98% ok</span>
                <span>$184/mo est.</span>
                <span>12ms p95</span>
              </div>
            </div>
          </section>

          {/* Asymmetric Split Grid: 8 cols Left (Matrix & Signers) / 4 cols Right (Account Comp, Handbook, Broadcast) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Granular Access Control & Permissions Matrix Card */}
              <section className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-900 text-base font-jakarta">
                      Granular Access Control & Permissions Matrix
                    </h2>
                    <p className="text-xs text-slate-400">
                      Configure module visibility, record access, and administrative capabilities by role.
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
                    Role Matrix v3.2
                  </span>
                </div>

                {/* Filter and Role Navigation Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-1.5 rounded-xl text-xs">
                  <div className="flex flex-wrap items-center gap-1">
                    {[
                      { key: 'all', label: 'Overview Matrix' },
                      { key: 'employee', label: 'Employee Role (Alex K.)' },
                      { key: 'hr', label: 'HR Manager (Priya S.)' },
                      { key: 'admin', label: 'Super Admin (Rajesh M.)' },
                    ].map((tab) => {
                      const isActive = activeRoleFilter === tab.key;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setActiveRoleFilter(tab.key as any)}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-purple-700 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 w-full md:w-60">
                    <span className="material-symbols-outlined text-[16px] mr-1.5 text-slate-400">filter_list</span>
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Filter permissions..."
                      className="w-full text-xs bg-transparent focus:outline-none placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Permissions Matrix Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                        <th className="py-3 px-4 rounded-l-lg">Module / Page Capability</th>
                        {(activeRoleFilter === 'all' || activeRoleFilter === 'employee') && (
                          <th className="py-3 px-3">Employee</th>
                        )}
                        {(activeRoleFilter === 'all' || activeRoleFilter === 'hr') && (
                          <th className="py-3 px-3">HR Manager</th>
                        )}
                        {(activeRoleFilter === 'all' || activeRoleFilter === 'admin') && (
                          <th className="py-3 px-3">Super Admin</th>
                        )}
                        <th className="py-3 px-4 rounded-r-lg">Scope & Restrictions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {categories.map((cat) => {
                        const catRows = filteredPermissions.filter((p) => p.category === cat);
                        return (
                          <React.Fragment key={cat}>
                            {/* Category Header */}
                            <tr className="bg-slate-50/80">
                              <td
                                colSpan={activeRoleFilter === 'all' ? 5 : 3}
                                className="py-2.5 px-4 font-bold uppercase tracking-wider text-[10px] text-purple-700"
                              >
                                {cat}
                              </td>
                            </tr>

                            {catRows.map((row) => (
                              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 px-4 font-semibold text-slate-800">{row.name}</td>

                                {(activeRoleFilter === 'all' || activeRoleFilter === 'employee') && (
                                  <td className="py-3 px-3">
                                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={row.employeeAllowed}
                                        disabled={row.employeeDisabled}
                                        onChange={() => handleTogglePerm(row.id, 'employee')}
                                        className={`w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600 ${
                                          row.employeeDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                                        }`}
                                      />
                                      <span
                                        className={`text-[11px] ${
                                          row.employeeDisabled ? 'text-slate-400' : 'text-slate-600'
                                        }`}
                                      >
                                        {row.employeeLabel}
                                      </span>
                                    </label>
                                  </td>
                                )}

                                {(activeRoleFilter === 'all' || activeRoleFilter === 'hr') && (
                                  <td className="py-3 px-3">
                                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={row.hrAllowed}
                                        disabled={row.hrDisabled}
                                        onChange={() => handleTogglePerm(row.id, 'hr')}
                                        className={`w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600 ${
                                          row.hrDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                                        }`}
                                      />
                                      <span
                                        className={`text-[11px] ${
                                          row.hrDisabled ? 'text-slate-400' : 'text-slate-600'
                                        }`}
                                      >
                                        {row.hrLabel}
                                      </span>
                                    </label>
                                  </td>
                                )}

                                {(activeRoleFilter === 'all' || activeRoleFilter === 'admin') && (
                                  <td className="py-3 px-3">
                                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={row.adminAllowed}
                                        disabled={row.adminDisabled}
                                        onChange={() => handleTogglePerm(row.id, 'admin')}
                                        className={`w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600 ${
                                          row.adminDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                                        }`}
                                      />
                                      <span className="text-[11px] font-bold text-purple-700">
                                        {row.adminLabel}
                                      </span>
                                    </label>
                                  </td>
                                )}

                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-700">
                                    {row.scope}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer with Changes pending tracker */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-purple-600">info</span>
                    <span
                      className={`font-semibold ${
                        pendingChanges > 0 ? 'text-purple-700 font-bold' : 'text-slate-500'
                      }`}
                    >
                      Changes pending: {pendingChanges}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSavePolicy}
                    className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Save Permission Policy
                  </button>
                </div>
              </section>

              {/* Authorized Corporate Signers & Keyholders Module */}
              <section className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">draw</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-900 text-base font-jakarta">
                          Authorized Corporate Signers & Keyholders
                        </h2>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                          Active: {signers.filter((s) => s.status.includes('Active')).length} of 4 Slots
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Officers credentialed to bind MHK Tech Inc. for I-9 reverifications, MSAs, and payroll disbursements.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAddSignerModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Add Signer</span>
                  </button>
                </div>

                {/* Signers Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                        <th className="py-3 px-4 rounded-l-lg">Corporate Signer</th>
                        <th className="py-3 px-4">Title & Official Email</th>
                        <th className="py-3 px-4">Authorization Scope</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Issued Date</th>
                        <th className="py-3 px-4 text-right rounded-r-lg">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {signers.map((signer) => (
                        <tr
                          key={signer.id}
                          className={`hover:bg-slate-50/50 transition-colors ${
                            signer.status.includes('Pending') ? 'bg-orange-50/40' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                                {signer.initials}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{signer.name}</div>
                                <div className="text-[10px] text-purple-600 font-semibold">{signer.slotTitle}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800">{signer.title}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{signer.email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">{signer.scope}</td>
                          <td className="py-3.5 px-3">
                            {signer.status === 'Pending Re-verification' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                                Pending Re-verification
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                                {signer.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">{signer.issuedDate}</td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {signer.status === 'Pending Re-verification' ? (
                                <button
                                  type="button"
                                  onClick={() => handleReverifySigner(signer.id)}
                                  className="px-2.5 py-1 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-bold text-[10px] cursor-pointer"
                                >
                                  Re-verify
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedSigner(signer);
                                    setSignerDetailModalOpen(true);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-[11px] cursor-pointer inline-flex items-center gap-1"
                                  title="View PKI Certificate Dossier & IRS 8821"
                                >
                                  <span className="material-symbols-outlined text-[16px]">verified</span>
                                  <span>Dossier</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRevokeSigner(signer.id)}
                                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                title="Revoke Authorization"
                              >
                                <span className="material-symbols-outlined text-[16px]">person_remove</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* User Account Composition Card (Donut Chart) */}
              <section className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-700 text-[20px]">pie_chart</span>
                    <h2 className="font-bold text-slate-900 text-sm font-jakarta">User Account Composition</h2>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                    256 ACCOUNTS
                  </span>
                </div>

                {/* SVG Donut */}
                <div className="flex items-center justify-center p-3 bg-slate-50 rounded-xl">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-slate-200"
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="38"
                        stroke="currentColor"
                        strokeWidth="12"
                      />
                      {/* Software & Tech Staff 96.9% */}
                      <circle
                        className="text-purple-600"
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="38"
                        stroke="currentColor"
                        strokeDasharray="238.76"
                        strokeDashoffset="7.4"
                        strokeWidth="12"
                      />
                      {/* HR Managers 2.3% */}
                      <circle
                        className="text-orange-500"
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="38"
                        stroke="currentColor"
                        strokeDasharray="238.76"
                        strokeDashoffset="233.2"
                        strokeWidth="12"
                      />
                      {/* Admins 0.8% */}
                      <circle
                        className="text-indigo-400"
                        cx="50"
                        cy="50"
                        fill="transparent"
                        r="38"
                        stroke="currentColor"
                        strokeDasharray="238.76"
                        strokeDashoffset="236.8"
                        strokeWidth="12"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-extrabold text-slate-900 font-jakarta leading-none">256</span>
                      <span className="text-[10px] text-slate-400 uppercase mt-0.5 font-bold tracking-wider">
                        Enrolled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                      <span className="font-semibold text-slate-700">Software & Tech Staff</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      248 <span className="text-slate-400 font-normal">(96.9%)</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                      <span className="font-semibold text-slate-700">HR Operations Specialists</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      6 <span className="text-slate-400 font-normal">(2.3%)</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                      <span className="font-semibold text-slate-700">Super Admins / Governance</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      2 <span className="text-slate-400 font-normal">(0.8%)</span>
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-purple-700">verified_user</span>
                    <span className="font-semibold text-[11px]">Zero-Trust Okta MFA Policy</span>
                  </div>
                  <span className="text-purple-700 font-bold text-[10px]">100% Locked</span>
                </div>
              </section>

              {/* Handbook Administration & Publishing Hub */}
              <section className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-700 text-[20px]">menu_book</span>
                    <h2 className="font-bold text-slate-900 text-sm font-jakarta">Handbook Administration</h2>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold uppercase">
                    v2.4 Draft Staged
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setHandbookVersion('draft')}
                    className={`flex-1 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      handbookVersion === 'draft' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Draft (v2.4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHandbookVersion('published')}
                    className={`flex-1 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      handbookVersion === 'published' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Published (v2.3)
                  </button>
                </div>

                {handbookVersion === 'published' ? (
                  <div className="space-y-3 p-4 rounded-xl bg-purple-50/60 border border-purple-100 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-700 text-[20px]">verified</span>
                        <span className="font-bold text-slate-900 text-sm">Official Handbook v2.3</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">LIVE PRODUCTION</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Currently active and legally binding for all 256 team members across Texas Corporate Headquarters and Hyderabad R&D Center. 100% electronic acknowledgment rate logged in SOC2 audit trail.
                    </p>
                    <div className="p-3 bg-white rounded-lg border border-purple-200/60 space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>Signed Acknowledgment Rate:</span>
                        <strong className="text-emerald-700">256 / 256 (100%)</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Jurisdictional Scope:</span>
                        <strong className="text-slate-800">Texas, Delaware & Telangana State Labour Acts</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Last Promulgated:</span>
                        <strong className="text-slate-800 font-mono">January 15, 2026</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const content = `MHK TECH INC. EMPLOYEE HANDBOOK v2.3 (OFFICIAL)\nPublished: January 15, 2026\nJurisdiction: Texas HQ & Hyderabad Hub\nAcknowledged: 256/256 employees\nGoverning Policies: Equal Opportunity, FLSA Overtime, Texas At-Will Employment, Remote Security.`;
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `MHK_Employee_Handbook_v2.3_Official.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                          showToast('Downloaded official Handbook v2.3', 'success');
                        }}
                        className="flex-1 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>Download Official v2.3 PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHandbookVersion('draft')}
                        className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs cursor-pointer"
                      >
                        Edit Draft
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* PDF Dropzone simulator */}
                    <div
                      onClick={() => showToast('Simulating PDF replacement parser: Checking OCR structure...', 'info')}
                      className="p-4 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-purple-400 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group"
                    >
                      <span className="material-symbols-outlined text-[28px] text-purple-700 group-hover:scale-110 transition-transform">
                        cloud_upload
                      </span>
                      <span className="font-bold text-slate-800 text-xs mt-1">Replace US Draft Handbook</span>
                      <span className="text-[10px] text-slate-400">PDF document up to 50MB</span>

                      <div className="w-full mt-3 p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-left">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="material-symbols-outlined text-[18px] text-red-500 shrink-0">picture_as_pdf</span>
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold text-slate-900 truncate">
                              MHK_Handbook_2026_v2.4_Clean.pdf
                            </div>
                            <div className="text-[10px] text-slate-400">14.2 MB • 100% Parsed</div>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">check_circle</span>
                      </div>
                    </div>

                    {/* Draft Sections Checklist */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Key Revisions in Queue ({revisions.length})
                      </span>
                      {revisions.map((rev) => (
                        <div
                          key={rev.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-bold text-slate-900 text-[11px] truncate">{rev.title}</div>
                            <div className="text-[10px] text-slate-400">{rev.meta}</div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRev(rev);
                                setEditSectionModalOpen(true);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-200 cursor-pointer"
                              title="Edit Clause"
                            >
                              <span className="material-symbols-outlined text-[15px]">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRevision(rev.id)}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              title="Delete Revision"
                            >
                              <span className="material-symbols-outlined text-[15px]">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setAddSectionModalOpen(true)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>+ Add Section</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePublishHandbook}
                        className="w-full py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">publish</span>
                        <span>Publish Version 2.4 & Trigger Re-acknowledgement</span>
                      </button>
                    </div>
                  </>
                )}
              </section>

              {/* Admin Broadcast Composer */}
              <section className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-700 text-[20px]">campaign</span>
                    <h2 className="font-bold text-slate-900 text-sm font-jakarta">Admin Broadcast Composer</h2>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                </div>

                <form onSubmit={handleBroadcastSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Announcement Title
                    </label>
                    <input
                      type="text"
                      required
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      placeholder="e.g. Scheduled System Maintenance / New Policy Rollout"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Target Audience</label>
                      <select
                        value={broadcastAudience}
                        onChange={(e) => setBroadcastAudience(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
                      >
                        <option>All Workspaces (Employee + HR)</option>
                        <option>Employees Only</option>
                        <option>HR Business Partners Only</option>
                        <option>Texas HQ Personnel</option>
                        <option>Hyderabad Hub Personnel</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category</label>
                      <select
                        value={broadcastCategory}
                        onChange={(e) => setBroadcastCategory(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
                      >
                        <option>System Alert</option>
                        <option>Policy & Legal Update</option>
                        <option>Payroll Announcement</option>
                        <option>Holiday & Observance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Message Content</label>
                    <textarea
                      rows={3}
                      required
                      value={broadcastMsg}
                      onChange={(e) => setBroadcastMsg(e.target.value)}
                      placeholder="Enter concise broadcast message to appear as a pinned alert banner..."
                      className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600 resize-none text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                      />
                      <span>Pin to top for 72 hrs</span>
                    </label>
                    <span className="text-[10px]">Broadcast SLA: Immediate</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Broadcast to All Workspaces</span>
                  </button>
                </form>

                {/* Active Admin Broadcasts Feed */}
                {activeAdminBroadcasts.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Live Broadcast Dispatches ({activeAdminBroadcasts.length})
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {activeAdminBroadcasts.map((b) => (
                        <div key={b.id} className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-[11px] truncate">{b.title}</span>
                            <span className="text-[10px] bg-purple-100 text-purple-700 font-semibold px-1.5 py-0.5 rounded">{b.category}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2">{b.message}</p>
                          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                            <span>Audience: <strong className="text-slate-700">{b.audience}</strong></span>
                            <button
                              type="button"
                              onClick={() => handleRetractBroadcast(b.id)}
                              className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                            >
                              Retract
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Recent System Audit Feed */}
              <section className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-700 text-[20px]">history_edu</span>
                    <h2 className="font-bold text-slate-900 text-sm font-jakarta">Recent System Audit Feed</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenAuditFeed) onOpenAuditFeed();
                      else showToast('Displaying 120 historic audit records...', 'info');
                    }}
                    className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {INITIAL_AUDIT_LOGS.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5"
                    >
                      <span className={`material-symbols-outlined text-[18px] mt-0.5 shrink-0 ${log.iconColor}`}>
                        {log.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="text-slate-800 leading-snug">
                          <strong>{log.actor}</strong> {log.action}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          {log.timeAgo} • {log.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
