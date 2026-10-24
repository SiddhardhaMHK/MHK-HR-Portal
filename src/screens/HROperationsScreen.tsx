import React, { useState } from 'react';
import { ScreenId, LeaveRecord, CandidateItem } from '../types';
import { INITIAL_LEAVES, INITIAL_HALF_DAY_REQUESTS, INITIAL_RESOLVED_LEAVES, INITIAL_CANDIDATES } from '../data/mockData';
import { useToast } from '../components/Toast';

interface HROperationsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenCompanyFeed?: () => void;
  onOpenDirectory?: () => void;
  onOpenDocuments?: () => void;
  onOpenExpensesTimesheets?: () => void;
  onOpenAuditFeed?: () => void;
  onOpenHolidayCalendar?: () => void;
}

export const HROperationsScreen: React.FC<HROperationsScreenProps> = ({
  onNavigate,
  onOpenCompanyFeed,
  onOpenDirectory,
  onOpenDocuments,
  onOpenExpensesTimesheets,
  onOpenAuditFeed,
  onOpenHolidayCalendar,
}) => {
  const { showToast } = useToast();

  // Dynamic triage state (approved/rejected status)
  const [triageStatus, setTriageStatus] = useState<Record<string, 'approved' | 'rejected' | null>>({});
  const [triageFilter, setTriageFilter] = useState<'all' | 'leaves' | 'timesheets' | 'expenses' | 'compliance'>('all');

  // Dynamic queue counts
  const pendingRahul = !triageStatus['rahul'];
  const pendingAnanya = !triageStatus['ananya'];
  const pendingMarcus = !triageStatus['marcus'];
  const pendingDavid = !triageStatus['david'];

  const dynamicLeavesCount = (pendingRahul ? 1 : 0) + 5;
  const dynamicExpensesCount = (pendingAnanya ? 1 : 0) + 2;
  const dynamicTimesheetsCount = (pendingMarcus ? 1 : 0) + 3;
  const dynamicComplianceCount = (pendingDavid ? 1 : 0) + 1;
  const actionQueueCount = dynamicLeavesCount + dynamicExpensesCount + dynamicTimesheetsCount + dynamicComplianceCount;

  // Leave hub tabs
  const [leaveTab, setLeaveTab] = useState<'full' | 'half' | 'resolved'>('full');
  const [leaveSearch, setLeaveSearch] = useState('');
  const [fullLeaves, setFullLeaves] = useState<LeaveRecord[]>(INITIAL_LEAVES);
  const [halfLeaves, setHalfLeaves] = useState(INITIAL_HALF_DAY_REQUESTS);

  // Candidates state
  const [candidates, setCandidates] = useState<CandidateItem[]>(INITIAL_CANDIDATES);
  const [candPipelineModalOpen, setCandPipelineModalOpen] = useState(false);
  const [candidateFilterStage, setCandidateFilterStage] = useState<string>('all');
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');

  // Modals state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [pendingRejectEmp, setPendingRejectEmp] = useState<string>('');
  const [rejectReason, setRejectReason] = useState('');

  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docModalData, setDocModalData] = useState<{ title: string; type: string; content: React.ReactNode } | null>(null);

  const [candModalOpen, setCandModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem | null>(null);

  // Emergency Contacts state
  const [unverifiedContacts, setUnverifiedContacts] = useState([
    { id: 'emp-1', name: 'Sarah Jenkins', role: 'Frontend Dev', email: 's.jenkins@mhktech.com', phone: '+1 (214) 555-0192', contactName: '', contactPhone: '', relation: '' },
    { id: 'emp-2', name: 'Vikram Patel', role: 'Backend Eng', email: 'v.patel@mhktech.com', phone: '+91 98490 23411', contactName: '', contactPhone: '', relation: '' },
    { id: 'emp-3', name: 'Marcus Vance', role: 'Cloud Architect', email: 'm.vance@mhktech.com', phone: '+1 (469) 555-0143', contactName: '', contactPhone: '', relation: '' },
    { id: 'emp-4', name: 'Kavita Roy', role: 'DevOps Lead', email: 'k.roy@mhktech.com', phone: '+91 99882 11029', contactName: '', contactPhone: '', relation: '' },
  ]);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<{ id: string; name: string; role: string; contactName: string; contactPhone: string; relation: string } | null>(null);

  // Quick Action Modals
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [initiateOnboardModalOpen, setInitiateOnboardModalOpen] = useState(false);
  const [newCandName, setNewCandName] = useState('');
  const [newCandRole, setNewCandRole] = useState('');
  const [newCandDept, setNewCandDept] = useState('Core Platform Engineering');
  const [newCandLocation, setNewCandLocation] = useState('Hyderabad Hub');
  const [newCandComp, setNewCandComp] = useState('₹28,50,000 / $145,000');
  const [newCandStart, setNewCandStart] = useState('Nov 15, 2026');

  const [proxyLeaveModalOpen, setProxyLeaveModalOpen] = useState(false);
  const [proxyEmpName, setProxyEmpName] = useState('Alex Kumar');
  const [proxyEmpId, setProxyEmpId] = useState('MHK-HYD-0412');
  const [proxyLeaveType, setProxyLeaveType] = useState('Casual Leave (CL)');
  const [proxyStartDate, setProxyStartDate] = useState('2026-11-04');
  const [proxyEndDate, setProxyEndDate] = useState('2026-11-05');
  const [proxyReason, setProxyReason] = useState('');

  const [complianceAuditModalOpen, setComplianceAuditModalOpen] = useState(false);
  const [isScanningCompliance, setIsScanningCompliance] = useState(false);
  const [lastAuditScan, setLastAuditScan] = useState('Today at 08:30 AM');

  // Broadcast Announcement
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState('Company Bulletin');
  const [broadcastTarget, setBroadcastTarget] = useState('All Global Hubs');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [publishedAnnouncements, setPublishedAnnouncements] = useState([
    {
      id: 'ann-1',
      title: 'Q4 Global Dual-Hub Strategy Town Hall',
      category: 'Company Bulletin',
      target: 'All Global Hubs',
      body: 'Join executive leadership this Thursday for our quarterly workforce roadmap covering Texas HQ expansion and Hyderabad tech center deliverables.',
      publishedAt: 'Today at 09:30 AM',
      pinned: true,
    },
    {
      id: 'ann-2',
      title: 'Statutory Leave Rollover & Carry-Forward Guidelines',
      category: 'HR Policy Update',
      target: 'All Global Hubs',
      body: 'Privilege Leave balances up to 15 days will automatically roll over into FY2027. Review your leave ledger before Dec 15.',
      publishedAt: 'Yesterday',
      pinned: false,
    },
  ]);

  // Compliance Remind
  const [isReminding, setIsReminding] = useState(false);

  const handleTriageApprove = (itemKey: string, empName: string) => {
    setTriageStatus((prev) => ({ ...prev, [itemKey]: 'approved' }));
    showToast(`${empName}'s request has been authorized and logged into HRMS ledger.`, 'success', 'Request Approved');
  };

  const handleOpenReject = (empName: string) => {
    setPendingRejectEmp(empName);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    setTriageStatus((prev) => ({ ...prev, [pendingRejectEmp]: 'rejected' }));
    setRejectModalOpen(false);
    showToast(
      `Request for ${pendingRejectEmp} was declined (${rejectReason || 'Declined by HR Lead'}).`,
      'error',
      'Request Declined'
    );
  };

  const handleAdvanceCandidateStage = (candId: number, targetStage?: CandidateItem['stage']) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candId) {
          let newStage: CandidateItem['stage'] = targetStage || c.stage;
          let newLabel = c.stageLabel;
          let newHighlight = c.statusHighlight;
          let newBadge = c.badgeClass;

          if (!targetStage) {
            if (c.stage === 'offer-pending') newStage = 'awaiting-sign';
            else if (c.stage === 'awaiting-sign') newStage = 'i9-verification';
            else if (c.stage === 'i9-verification') newStage = 'day1-ready';
            else if (c.stage === 'day1-ready') newStage = 'onboarded';
          }

          if (newStage === 'offer-pending') {
            newLabel = '1. Offer Pending';
            newHighlight = 'Offer letter generated • Pending HR approval';
            newBadge = 'text-purple-600';
          } else if (newStage === 'awaiting-sign') {
            newLabel = '2. Awaiting Sign';
            newHighlight = 'Dispatched via DocuSign • Waiting signature';
            newBadge = 'text-blue-600';
          } else if (newStage === 'i9-verification') {
            newLabel = '3. I-9 & Verification';
            newHighlight = 'Signed • E-Verify & statutory I-9 inspection staged';
            newBadge = 'text-orange-600';
          } else if (newStage === 'day1-ready') {
            newLabel = '4. Ready for Day 1';
            newHighlight = 'Hardware provisioned • Welcome induction booked';
            newBadge = 'text-emerald-600';
          } else if (newStage === 'onboarded') {
            newLabel = '5. Onboarded';
            newHighlight = 'Active Employee • Provisioned in Okta directory';
            newBadge = 'text-purple-700';
          } else if (newStage === 'archived') {
            newLabel = 'Archived / Declined';
            newHighlight = 'Candidate profile archived';
            newBadge = 'text-slate-400';
          }

          const updated: CandidateItem = {
            ...c,
            stage: newStage,
            stageLabel: newLabel,
            statusHighlight: newHighlight,
            badgeClass: newBadge,
          };
          if (selectedCandidate && selectedCandidate.id === candId) {
            setSelectedCandidate(updated);
          }
          return updated;
        }
        return c;
      })
    );
    showToast('Candidate pipeline stage updated successfully.', 'success', 'Pipeline Advanced');
  };

  const handleArchiveCandidate = (candId: number, name: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== candId));
    if (selectedCandidate && selectedCandidate.id === candId) {
      setCandModalOpen(false);
      setSelectedCandidate(null);
    }
    showToast(`Candidate ${name} archived from recruitment pipeline.`, 'info', 'Candidate Archived');
  };

  const handleSaveContactUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;
    setUnverifiedContacts((prev) => prev.filter((item) => item.id !== editingContact.id));
    setContactModalOpen(false);
    setEditingContact(null);
    showToast(
      `Emergency contact records verified and filed for ${editingContact.name}.`,
      'success',
      'Compliance Contact Verified'
    );
  };

  const handleExportHRSummary = () => {
    const csvContent =
      'Category,Metric,Value,Status,Location\n' +
      'Workforce,Total Headcount,248,Active,Global Dual Hubs\n' +
      'Workforce,Hyderabad Hub,182,In-Office,Hyderabad\n' +
      'Workforce,Texas HQ,48,In-Office,Texas HQ\n' +
      'Workforce,Client Travel,18,On-Site,US & International\n' +
      `Leaves,Full-Day Pending,${fullLeaves.filter((l) => l.status === 'pending').length},Requires Triage,All Hubs\n` +
      `Leaves,Half-Day Pending,${halfLeaves.filter((h) => h.status === 'pending').length},Requires Triage,All Hubs\n` +
      `Pipeline,Active Candidates,${candidates.length},In Progress,Engineering & Design\n` +
      'Compliance,SOC-2 Type II Audit,100% Passed,Verified,Global\n' +
      `Compliance,I-9 Verification,${triageStatus['david'] === 'approved' ? '100% Cleared' : '99.6% Cleared (1 Pending Day-2)'},Active,Texas HQ\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MHK_HR_Executive_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('HR Executive Summary CSV generated and downloaded.', 'success', 'Export Complete');
  };

  const handleRunComplianceReScan = () => {
    setIsScanningCompliance(true);
    setTimeout(() => {
      setIsScanningCompliance(false);
      setLastAuditScan('Just now');
      showToast('Automated compliance scan complete: 248 records checked with zero critical violations.', 'success', 'Audit Verified');
    }, 1200);
  };

  const handleApproveLeaveRow = (id: number, empName: string) => {
    setFullLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'approved' } : l))
    );
    showToast(`Leave for ${empName} approved and calendar notified.`, 'success', 'Leave Approved');
  };

  const handleApproveHalfRow = (id: number, empName: string) => {
    setHalfLeaves((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status: 'approved' } : h))
    );
    showToast(`Remote/Half-day request for ${empName} authorized.`, 'success', 'Authorized');
  };

  const handleSendComplianceReminders = () => {
    setIsReminding(true);
    setTimeout(() => {
      setIsReminding(false);
      showToast(`Emergency contact reminder broadcasted to ${unverifiedContacts.length} flagged personnel via SMS & Email.`, 'success', 'Reminders Dispatched');
    }, 700);
  };

  const handleInitiateOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandName.trim() || !newCandRole.trim()) return;
    const initials = newCandName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    const newCand: CandidateItem = {
      id: Date.now(),
      initials,
      name: newCandName.trim(),
      role: newCandRole.trim(),
      compensation: newCandComp,
      details: `Target Start: ${newCandStart} • Department: ${newCandDept} • Location: ${newCandLocation}`,
      dept: newCandDept,
      stage: 'offer-pending',
      stageLabel: '1. Offer Pending',
      statusHighlight: 'Offer generated • Awaiting signature',
      badgeClass: 'text-purple-600',
      actionLabel: 'Preview & Send',
      actionClass: 'bg-purple-700 hover:bg-purple-800 text-white',
      meta: `Offered: ${newCandComp} • Hub: ${newCandLocation}`,
      startDate: newCandStart,
    };
    setCandidates((prev) => [newCand, ...prev]);
    setInitiateOnboardModalOpen(false);
    setNewCandName('');
    setNewCandRole('');
    showToast(`Onboarding dossier created for ${newCand.name}!`, 'success', 'Candidate Added');
  };

  const handleProxyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLeave: LeaveRecord = {
      id: Date.now(),
      employeeName: proxyEmpName,
      empId: proxyEmpId,
      role: 'Staff Member',
      leaveType: proxyLeaveType,
      leaveTypeBadge: 'bg-purple-100 text-purple-700',
      duration: '2 Days',
      dates: `${proxyStartDate} - ${proxyEndDate}`,
      availableBalance: '8.5 Days Remaining',
      reason: proxyReason || 'Proxy logged by People Ops Lead',
      status: 'pending',
      avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1WUT703aPZymf3CYI-D69cSXMF9yA-2R7YSqxmjDYngX1k0FZkjJaU3dvzj5Mwu4oVyUlB1XLTCRTkuJJEh9o3bOx8k1aMPBu5elZSY_k2ff_-P_wJcYuabDzVz1AL5W9bjhmpIMmIKrk8eP1QrHuhu8Jk7OXq5ovVG-vfuvyjE4BMb1GvjYGD92gSer3voZWGTvDcCwGF88HthKJaLoBxb2DioqQfFVFuEKXo9Si6VU2w2aCK3OHD_ll8SPPlQeI_ZiDbKFsoN220',
    };
    setFullLeaves((prev) => [newLeave, ...prev]);
    setProxyLeaveModalOpen(false);
    setProxyReason('');
    showToast(`Proxy leave logged for ${proxyEmpName} (${proxyLeaveType})`, 'success', 'Proxy Leave Logged');
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) {
      showToast('Please enter both title and message body.', 'warning');
      return;
    }
    setBroadcastTitle('');
    setBroadcastBody('');
    showToast(
      `Announcement "${broadcastTitle}" broadcasted to ${broadcastTarget}.`,
      'success',
      'Bulletin Published'
    );
  };

  const filteredFullLeaves = fullLeaves.filter(
    (l) =>
      l.employeeName.toLowerCase().includes(leaveSearch.toLowerCase()) ||
      l.empId.toLowerCase().includes(leaveSearch.toLowerCase()) ||
      l.leaveType.toLowerCase().includes(leaveSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-800 flex flex-col pt-16">
      {/* Rejection Confirmation Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">block</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Confirm Rejection</h3>
              </div>
              <button onClick={() => setRejectModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <p className="text-slate-600">
                Rejecting request for <strong className="text-slate-900">{pendingRejectEmp}</strong>. Please specify an optional reason:
              </p>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Schedule clash with production rollout or insufficient project documentation..."
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {docModalOpen && docModalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-purple-700 text-[22px]">description</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{docModalData.title}</h3>
                  <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">
                    {docModalData.type}
                  </span>
                </div>
              </div>
              <button onClick={() => setDocModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 max-h-[70vh] overflow-y-auto text-xs">{docModalData.content}</div>
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setDocModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#131b2e] hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Profile Summary Modal */}
      {candModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-bold text-base flex items-center justify-center">
                  {selectedCandidate.initials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedCandidate.name}</h3>
                  <p className="text-xs text-slate-500">{selectedCandidate.role}</p>
                </div>
              </div>
              <button onClick={() => setCandModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase text-[10px] text-slate-400">Current Pipeline Stage</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                  {selectedCandidate.stageLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase text-[10px] text-slate-400">Compensation Package</span>
                <span className="font-mono font-bold text-slate-900">{selectedCandidate.compensation}</span>
              </div>
              {selectedCandidate.startDate && (
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase text-[10px] text-slate-400">Target Start Date</span>
                  <span className="font-semibold text-slate-800">{selectedCandidate.startDate}</span>
                </div>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Onboarding Overview & Next Steps
              </span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">{selectedCandidate.details}</p>
            </div>

            {/* Stage Transition Selector */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Update Pipeline Stage
              </label>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {(
                  [
                    { key: 'offer-pending', label: '1. Offer Pending' },
                    { key: 'awaiting-sign', label: '2. Awaiting Sign' },
                    { key: 'i9-verification', label: '3. I-9 Review' },
                    { key: 'day1-ready', label: '4. Ready for Day 1' },
                    { key: 'onboarded', label: '5. Mark Hired' },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => handleAdvanceCandidateStage(selectedCandidate.id, st.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      selectedCandidate.stage === st.key
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleArchiveCandidate(selectedCandidate.id, selectedCandidate.name)}
                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                Archive Candidate
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAdvanceCandidateStage(selectedCandidate.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Advance Stage</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCandModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Pipeline Full Directory Modal */}
      {candPipelineModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">hub</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Candidate Hiring & Onboarding ATS</h3>
                  <p className="text-xs text-slate-400">
                    Comprehensive pipeline overview across Hyderabad & Texas recruiting funnels.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCandPipelineModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                {[
                  { key: 'all', label: `All Candidates (${candidates.length})` },
                  { key: 'offer-pending', label: '1. Offer Pending' },
                  { key: 'awaiting-sign', label: '2. Awaiting Sign' },
                  { key: 'i9-verification', label: '3. I-9 Review' },
                  { key: 'day1-ready', label: '4. Ready for Day 1' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setCandidateFilterStage(tab.key)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      candidateFilterStage === tab.key
                        ? 'bg-[#131b2e] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[16px]">
                  search
                </span>
                <input
                  type="text"
                  value={candidateSearchQuery}
                  onChange={(e) => setCandidateSearchQuery(e.target.value)}
                  placeholder="Search candidate or role..."
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>
            </div>

            {/* Candidate List Table */}
            <div className="overflow-y-auto flex-1 border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold sticky top-0">
                    <th className="py-2.5 px-3">Candidate</th>
                    <th className="py-2.5 px-3">Role & Dept</th>
                    <th className="py-2.5 px-3">Stage</th>
                    <th className="py-2.5 px-3">Compensation</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates
                    .filter((c) => {
                      const matchStage = candidateFilterStage === 'all' || c.stage === candidateFilterStage;
                      const matchQuery =
                        c.name.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
                        c.role.toLowerCase().includes(candidateSearchQuery.toLowerCase());
                      return matchStage && matchQuery;
                    })
                    .map((cand) => (
                      <tr key={cand.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                              {cand.initials}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{cand.name}</div>
                              <div className="text-[10px] text-slate-400">{cand.meta || 'Dual Hub Candidate'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800">{cand.role}</div>
                          <div className="text-[10px] text-slate-400">{cand.dept || 'Engineering'}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cand.badgeClass || 'text-purple-600'} bg-slate-100`}>
                            {cand.stageLabel}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">{cand.compensation}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCandidate(cand);
                                setCandModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-[11px] cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAdvanceCandidateStage(cand.id)}
                              className="px-2.5 py-1 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-semibold text-[11px] cursor-pointer"
                            >
                              Advance
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-500">
                Showing {candidates.length} active candidates in pipeline
              </span>
              <button
                type="button"
                onClick={() => {
                  setCandPipelineModalOpen(false);
                  setInitiateOnboardModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span>+ Add New Candidate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contact Edit & Verification Modal */}
      {contactModalOpen && editingContact && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-[22px]">contact_emergency</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Emergency Contact Dossier</h3>
                  <p className="text-xs text-slate-400">{editingContact.name} ({editingContact.role})</p>
                </div>
              </div>
              <button onClick={() => setContactModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveContactUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">
                  Primary Emergency Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={editingContact.contactName}
                  onChange={(e) => setEditingContact({ ...editingContact, contactName: e.target.value })}
                  placeholder="e.g. Eleanor Vance / Rajesh Patel"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Relationship</label>
                  <select
                    value={editingContact.relation}
                    onChange={(e) => setEditingContact({ ...editingContact, relation: e.target.value })}
                    className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none text-xs"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Next of Kin">Next of Kin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={editingContact.contactPhone}
                    onChange={(e) => setEditingContact({ ...editingContact, contactPhone: e.target.value })}
                    placeholder="+1 (555) 019-2831"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] border border-emerald-200 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Filing this update clears the statutory compliance flag for this personnel.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Verify & Save Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Initiate Onboarding Modal */}
      {initiateOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Initiate Candidate Onboarding</h3>
              </div>
              <button
                onClick={() => setInitiateOnboardModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleInitiateOnboardSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={newCandName}
                  onChange={(e) => setNewCandName(e.target.value)}
                  placeholder="e.g. Maya Deshmukh"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={newCandRole}
                    onChange={(e) => setNewCandRole(e.target.value)}
                    placeholder="e.g. Senior DevOps Engineer"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Department</label>
                  <select
                    value={newCandDept}
                    onChange={(e) => setNewCandDept(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Core Platform Engineering">Core Platform Engineering</option>
                    <option value="Enterprise Architecture">Enterprise Architecture</option>
                    <option value="Design & User Experience">Design & User Experience</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Hub Location</label>
                  <select
                    value={newCandLocation}
                    onChange={(e) => setNewCandLocation(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Hyderabad Hub">Hyderabad Hub (India)</option>
                    <option value="Texas HQ">Texas HQ (US)</option>
                    <option value="Remote / Client Travel">Remote / Client Travel</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Target Start Date</label>
                  <input
                    type="text"
                    required
                    value={newCandStart}
                    onChange={(e) => setNewCandStart(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Compensation Package</label>
                <input
                  type="text"
                  required
                  value={newCandComp}
                  onChange={(e) => setNewCandComp(e.target.value)}
                  placeholder="e.g. ₹28,50,000 / $145,000"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInitiateOnboardModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-md shadow-purple-700/20 cursor-pointer"
                >
                  Generate Offer & Add to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Proxy Leave Modal */}
      {proxyLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">event_note</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Log Proxy Leave on Behalf</h3>
              </div>
              <button
                onClick={() => setProxyLeaveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleProxyLeaveSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Target Personnel</label>
                <select
                  value={proxyEmpName}
                  onChange={(e) => {
                    setProxyEmpName(e.target.value);
                    if (e.target.value === 'Alex Kumar') setProxyEmpId('MHK-HYD-0412');
                    else if (e.target.value === 'Sarah Jenkins') setProxyEmpId('MHK-US-0145');
                    else if (e.target.value === 'Marcus Vance') setProxyEmpId('MHK-US-0189');
                    else setProxyEmpId('MHK-HYD-0415');
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Alex Kumar">Alex Kumar (MHK-HYD-0412)</option>
                  <option value="Sarah Jenkins">Sarah Jenkins (MHK-US-0145)</option>
                  <option value="Marcus Vance">Marcus Vance (MHK-US-0189)</option>
                  <option value="Rahul Verma">Rahul Verma (MHK-HYD-0415)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Leave Classification</label>
                <select
                  value={proxyLeaveType}
                  onChange={(e) => setProxyLeaveType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                  <option value="Sick Leave (SL)">Sick Leave (SL)</option>
                  <option value="Privilege Leave (PL)">Privilege Leave (PL)</option>
                  <option value="Client Travel Exemption">Client Travel Exemption</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={proxyStartDate}
                    onChange={(e) => setProxyStartDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={proxyEndDate}
                    onChange={(e) => setProxyEndDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Internal Note / Justification</label>
                <textarea
                  rows={2}
                  value={proxyReason}
                  onChange={(e) => setProxyReason(e.target.value)}
                  placeholder="e.g. Verbal request during sprint review; approved by department VP."
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProxyLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-md shadow-purple-700/20 cursor-pointer"
                >
                  Record Proxy Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compliance Audit Modal */}
      {complianceAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Automated Compliance Health Check</h3>
                  <span className="text-[11px] text-slate-500 font-mono">SOC-2 Type II & DOL I-9 Audit Engine</span>
                </div>
              </div>
              <button
                onClick={() => setComplianceAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
                  <span>0 Critical Regulatory Violations Found</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px]">PASS</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <strong className="block text-slate-900">Form I-9 & E-Verify Verification</strong>
                    <span className="text-[11px] text-slate-500">100% of US active staff verified within 3 days of hire</span>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono">248/248</span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <strong className="block text-slate-900">Immigration & H-1B LCA Prevailing Wage</strong>
                    <span className="text-[11px] text-slate-500">All DOL public access files in compliance</span>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono">100%</span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <strong className="block text-slate-900">PF & ESI Statutory Filings (India Hub)</strong>
                    <span className="text-[11px] text-slate-500">EPFO Electronic Challan Return reconciled</span>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono">Compliant</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isScanningCompliance}
                  onClick={handleRunComplianceReScan}
                  className="px-3.5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-[16px] ${isScanningCompliance ? 'animate-spin' : ''}`}>
                    autorenew
                  </span>
                  <span>{isScanningCompliance ? 'Scanning All 248 Records...' : 'Run Live Re-Scan'}</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setComplianceAuditModalOpen(false)}
                    className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer text-xs"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setComplianceAuditModalOpen(false);
                      handleExportHRSummary();
                    }}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs cursor-pointer text-xs"
                  >
                    Export Audit Certificate
                  </button>
                </div>
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
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Navigation</span>
              <nav className="mt-2 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-[#131b2e] text-white font-bold text-xs shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  <span>HR Overview & Approvals</span>
                </button>
                <button
                  onClick={() => showToast('Opening recruitment ATS pipeline (9 active candidates)', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">person_search</span>
                  <span>Candidates & Hiring</span>
                </button>
                <button
                  onClick={() => onOpenDocuments ? onOpenDocuments() : showToast('Opening Offer Letters Vault...', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  <span>Offer Letters</span>
                </button>
                <button
                  onClick={() => onOpenDirectory ? onOpenDirectory() : showToast('Opening Employee Directory...', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  <span>Employee Directory & Org</span>
                </button>
                <button
                  onClick={() => setLeaveTab('full')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">date_range</span>
                  <span>Leave & Time Off</span>
                </button>
                <button
                  onClick={() => showToast('Attendance records synced with Hyderabad & Texas biometric logs', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>Attendance Records</span>
                </button>
                <button
                  onClick={() => showToast('Engineering standup aggregation reviewed for Week 43', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                  <span>Activity Reports Review</span>
                </button>
              </nav>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">HR Operations</span>
              <nav className="mt-2 space-y-1">
                <button
                  onClick={() => onOpenDocuments ? onOpenDocuments() : showToast('Opening Document Verification Suite...', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">folder_shared</span>
                  <span>Document Verification</span>
                </button>
                <button
                  onClick={() => setTriageFilter('all')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">move_to_inbox</span>
                  <span>Employee Requests Inbox</span>
                </button>
                <button
                  onClick={() => onOpenExpensesTimesheets ? onOpenExpensesTimesheets() : setTriageFilter('expenses')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  <span>Expense Approvals</span>
                </button>
                <button
                  onClick={() => onOpenExpensesTimesheets ? onOpenExpensesTimesheets() : setTriageFilter('timesheets')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">more_time</span>
                  <span>Timesheet Approvals</span>
                </button>
                <button
                  onClick={() => onOpenHolidayCalendar ? onOpenHolidayCalendar() : showToast('Opening Holiday Calendar...', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">event</span>
                  <span>Holiday Calendar</span>
                </button>
              </nav>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Governance & Compliance
              </span>
              <nav className="mt-2 space-y-1">
                <button
                  onClick={() => onNavigate('governance')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  <span>Roles & Permissions</span>
                </button>
                <button
                  onClick={() => onNavigate('governance')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  <span>Handbook Admin</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-700 text-[11px]">Service Status</span>
            </div>
            <span className="font-mono text-slate-500 text-[10px]">99.98%</span>
          </div>
        </aside>

        {/* Center Main Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1680px] mx-auto w-full space-y-6">
          {/* Top Header & Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <span>HR Console</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-slate-800 font-semibold">Overview & Approvals</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-jakarta">
                  HR Operations & Approvals Command Center
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] uppercase font-bold tracking-wider">
                  Live Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Real-time employee lifecycle management, multi-tier approvals queue, and global workforce compliance.
              </p>
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center gap-2 self-start md:self-auto relative">
              <button
                type="button"
                onClick={handleExportHRSummary}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-slate-500">download</span>
                <span>Export Summary</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setQuickActionOpen(!quickActionOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-purple-600/25 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>+ Quick Action</span>
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>

                {quickActionOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        setInitiateOnboardModalOpen(true);
                        setQuickActionOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-purple-600">person_add</span>
                      <span>Initiate Onboarding</span>
                    </button>
                    <button
                      onClick={() => {
                        setProxyLeaveModalOpen(true);
                        setQuickActionOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-purple-600">event_note</span>
                      <span>Log Proxy Leave</span>
                    </button>
                    <button
                      onClick={() => {
                        setBroadcastCategory('System Alert');
                        setQuickActionOpen(false);
                        showToast('Urgent Notice mode active in Broadcast Composer below.', 'info');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-purple-600">campaign</span>
                      <span>Urgent Notice</span>
                    </button>
                    <div className="my-1 border-t border-slate-100"></div>
                    <button
                      onClick={() => {
                        setComplianceAuditModalOpen(true);
                        setQuickActionOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-red-500">verified_user</span>
                      <span>Run Audit Check</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 5 KPI Stat Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Headcount */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Headcount</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1 leading-none font-jakarta">248</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">groups</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold font-mono">+12</span>
                <span>98.2% annual retention</span>
              </div>
            </div>

            {/* Action Queue */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Action Queue</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  </div>
                  <div className="text-3xl font-extrabold text-purple-700 mt-1 leading-none font-jakarta">
                    {actionQueueCount}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-red-600 font-semibold">{dynamicLeavesCount} Leaves</span>
                <span>•</span>
                <span>{dynamicExpensesCount} Expenses</span>
                <span>•</span>
                <span>{dynamicTimesheetsCount} Timesheets</span>
              </div>
            </div>

            {/* Out Today */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Out Today</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1 leading-none font-jakarta">8</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">event_busy</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] text-slate-500">
                <strong className="text-slate-800">5</strong> on Leave <span className="mx-1">•</span>{' '}
                <strong className="text-slate-800">3</strong> Client Site
              </div>
            </div>

            {/* Compliance Flags */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Compliance Flags</span>
                  <div className="text-3xl font-extrabold text-orange-600 mt-1 leading-none font-jakarta">
                    {dynamicComplianceCount + (unverifiedContacts.length > 0 ? 1 : 0)}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">gavel</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] text-orange-700 font-semibold truncate">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                <span>{dynamicComplianceCount > 0 ? '1 I-9 Statutory' : 'All I-9 Cleared'} • {unverifiedContacts.length} Contacts</span>
              </div>
            </div>

            {/* Active Pipeline */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Pipeline</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1 leading-none font-jakarta">
                    {candidates.filter((c) => c.stage !== 'onboarded' && c.stage !== 'archived').length}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">person_search</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                <span>{candidates.filter((c) => c.stage === 'awaiting-sign').length} Dispatched</span>
                <span className="text-purple-700 font-bold">
                  {candidates.filter((c) => c.stage === 'day1-ready').length} Day-1 Ready
                </span>
              </div>
            </div>
          </div>

          {/* Main 2-Column Split: 8 cols left stream + 4 cols right rail */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* LEFT STREAM (8 COLS) */}
            <div className="xl:col-span-8 space-y-6 min-w-0">
              {/* Needs Your Action Priority Triage Queue */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-base font-jakarta">Needs Your Action</h2>
                      <p className="text-xs text-slate-400">Immediate approvals sorted by SLA urgency.</p>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center flex-wrap gap-1.5 text-xs">
                    {(['all', 'leaves', 'timesheets', 'expenses', 'compliance'] as const).map((tab) => {
                      const counts: Record<string, number> = {
                        all: actionQueueCount,
                        leaves: dynamicLeavesCount,
                        timesheets: dynamicTimesheetsCount,
                        expenses: dynamicExpensesCount,
                        compliance: dynamicComplianceCount,
                      };
                      const isActive = triageFilter === tab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setTriageFilter(tab)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#131b2e] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {tab} ({counts[tab]})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Triage List Cards */}
                <div className="space-y-3 pt-1">
                  {/* Item 1: Rahul Verma (Casual Leave) */}
                  {(triageFilter === 'all' || triageFilter === 'leaves') && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          alt="Rahul Verma"
                          className="w-11 h-11 rounded-full object-cover shrink-0 mt-0.5"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtkNsy_xrZzYanE4zqETGdaWhUJOrKwPqBMsxn6YQsRzGH0JlUIwEC_EnCbWebkqAlVxUESl6I0ptscB0xjy9hp7pTfETrgAkF5XeKAipzMF4XfrvfT55MV9ukuNOgBChaBn54z3efP4Luki2eKcHX6dIoUIzd0epX6Al0yxVbvEmLTaqMBP-7bZUKD0SXgvEnXLbCVr2oFM3lwgvJy3hcNNHjVU1XSYFml8veCnyQXPtmSSSg__kq6w"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs">Rahul Verma</span>
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-semibold">
                              Full-Stack Eng
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">#MHK-4091</span>
                          </div>
                          <div className="text-xs text-slate-800 mt-1">
                            <span className="font-bold text-purple-700">3 Days Casual Leave</span> (Family Emergency: Oct 25 – Oct 27)
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                              <span className="material-symbols-outlined text-[14px] text-purple-600">account_balance_wallet</span>
                              <span>Bal: 9.5 CL left</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-red-600 font-semibold">
                              <span className="material-symbols-outlined text-[14px]">timer</span>
                              <span>SLA: Expires in 4 hrs</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {triageStatus['rahul'] === 'approved' ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                            Approved ✓
                          </span>
                        ) : triageStatus['rahul'] === 'rejected' ? (
                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs">
                            Declined
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleTriageApprove('rahul', 'Rahul Verma')}
                              className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">check</span> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenReject('Rahul Verma')}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Item 2: Ananya Sen (Expense Claim) */}
                  {(triageFilter === 'all' || triageFilter === 'expenses') && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          alt="Ananya Sen"
                          className="w-11 h-11 rounded-full object-cover shrink-0 mt-0.5"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaEvysLzQVMTtmFnzrg8mHP70RcP6V933HR-7pWjape-OwsR9NCvinnUn0UlVxA_P89DdDjJmVy23Fw7VgwFPAIWpcs58rM4fP7qdtvUzQxotwsHnzDEcIEX6IGeu9Mh-nMYnod4UAAd8PyflcBn24RjccYaNVaJcndpfC9I-MhJsa9XuZyz7C4Zu4dtNE6ETbB-XpRyjVeBw-wzMPjP-QUlv70_yHrtrlwTaPO8hBELEtYY1ExU8tBA"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs">Ananya Sen</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold">
                              Product Design
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">#MHK-3810</span>
                          </div>
                          <div className="text-xs text-slate-800 mt-1">
                            <span className="font-bold text-orange-600">Expense Claim: $420.00</span> (Figma Config 2026 Pass & Inter-city Transit)
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                              <span className="material-symbols-outlined text-[14px]">verified</span>
                              <span>Tax Receipt Verified</span>
                            </span>
                            <span>•</span>
                            <span>Cost Center: Product / R&D</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {triageStatus['ananya'] === 'approved' ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                            Authorized ✓
                          </span>
                        ) : triageStatus['ananya'] === 'rejected' ? (
                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs">
                            Declined
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleTriageApprove('ananya', 'Ananya Sen')}
                              className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">check</span> Authorize
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenReject('Ananya Sen')}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span> Decline
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDocModalData({
                                  title: 'Expense Receipt: Figma Config 2026',
                                  type: 'Verified Vendor Receipt',
                                  content: (
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2 leading-relaxed">
                                      <div className="font-bold text-slate-900">CONFIG 2026 OFFICIAL PASS</div>
                                      <div>Employee: Ananya Sen (#MHK-3810)</div>
                                      <div>Amount: $350.00 Pass + $70.00 Express Rail Transit</div>
                                      <div className="text-emerald-700 font-bold">Tax ID: US-FIG-88219 • Card Ending 4410</div>
                                      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                                        Attachment hash: 9a7b...c3f4 (SHA256 verified)
                                      </div>
                                      <div className="pt-3 flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setDocModalOpen(false);
                                            handleTriageApprove('ananya', 'Ananya Sen');
                                          }}
                                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer"
                                        >
                                          Approve & Authorize Reimbursement
                                        </button>
                                      </div>
                                    </div>
                                  ),
                                });
                                setDocModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">receipt_long</span> Review Receipt
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Item 3: Marcus Vance (Timesheet Sign-off) */}
                  {(triageFilter === 'all' || triageFilter === 'timesheets') && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          alt="Marcus Vance"
                          className="w-11 h-11 rounded-full object-cover shrink-0 mt-0.5"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDlcG4y15Mpkb-r2T9FTTaFhdqc7FM5-UKdfapLN85pkFkwHl9jo3V60AeQoyJ0xBKAhetbvRao9G_6DCnTH7wYmjolDt-MeOXk6eUlEV0hpi9PmQEFEayDyGhl_E_uVrZuiCm_NW9NHSHbjEauO45vXTeWimPnlDscYKdjDcVeiCTJFlckQuqGZm-efrPsPePrMv5vY7JswlTItmzwXd19S7u3TJPUC15Ixgymu_B-c0jw4AREhV4jA"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs">Marcus Vance</span>
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-semibold">
                              Cloud Architect
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">#MHK-1904</span>
                          </div>
                          <div className="text-xs text-slate-800 mt-1">
                            <span className="font-bold text-purple-700">Weekly Timesheet (W-42): 45.0 hrs</span> (Includes 5.0 hrs Approved Client Overtime)
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 flex-wrap">
                            <span>Client: Apex Global Logistics</span>
                            <span>•</span>
                            <span className="text-orange-600 font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span>
                              <span>2h overdue for payroll batch</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {triageStatus['marcus'] === 'approved' ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                            Signed Off ✓
                          </span>
                        ) : triageStatus['marcus'] === 'rejected' ? (
                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs">
                            Timesheet Returned
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleTriageApprove('marcus', 'Marcus Vance')}
                              className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">draw</span> Sign Off
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenReject('Marcus Vance')}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span> Decline
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDocModalData({
                                  title: 'Marcus Vance Timesheet Log W-42',
                                  type: 'Timesheet Verification',
                                  content: (
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                                      <div className="font-bold text-slate-900">Client: Apex Global Logistics (Cloud Migration Lead)</div>
                                      <div className="font-mono">
                                        Mon: 8.0h • Tue: 8.5h • Wed: 9.5h (Deployment) • Thu: 10.0h (Prod Fix) • Fri: 9.0h
                                      </div>
                                      <div className="text-emerald-700 font-bold">
                                        Total: 45.0 Hours (5.0 OT approved by Apex Client Dir. S. Davis)
                                      </div>
                                      <div className="pt-3 flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setDocModalOpen(false);
                                            handleTriageApprove('marcus', 'Marcus Vance');
                                          }}
                                          className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs cursor-pointer"
                                        >
                                          Sign Off & Log to Payroll
                                        </button>
                                      </div>
                                    </div>
                                  ),
                                });
                                setDocModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
                            >
                              View Logs
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Item 4: Compliance Alert - I-9 Verification */}
                  {(triageFilter === 'all' || triageFilter === 'compliance') && (
                    <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200/80 hover:border-orange-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-orange-200 text-orange-900 flex items-center justify-center font-bold text-base shrink-0">
                          <span className="material-symbols-outlined text-[22px]">verified_user</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs">David Miller</span>
                            <span className="px-2 py-0.5 rounded-full bg-orange-200 text-orange-900 text-[10px] font-bold uppercase">
                              New Hire (Texas HQ)
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">#MHK-5102</span>
                          </div>
                          <div className="text-xs font-bold text-orange-900 mt-1">
                            Form I-9 Section 2 In-Person / Physical Review Pending
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600 flex-wrap">
                            <span className="text-orange-700 font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">warning</span>
                              <span>Day 2 of 3 Federal Statutory SLA Deadline</span>
                            </span>
                            <span>•</span>
                            <span>SSN & Passport Scan Uploaded</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {triageStatus['david'] === 'approved' ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                            I-9 Verified ✓
                          </span>
                        ) : triageStatus['david'] === 'rejected' ? (
                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs">
                            Flagged Incomplete
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleTriageApprove('david', 'David Miller')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">check_circle</span> Verify & Clear
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenReject('David Miller')}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span> Flag
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDocModalData({
                                  title: 'David Miller - Form I-9 Verification Documents',
                                  type: 'Federal Statutory Compliance Review',
                                  content: (
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                                      <div className="font-bold text-slate-900 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-purple-700">badge</span>
                                        <span>List A Document: US Passport Scan Attached</span>
                                      </div>
                                      <div className="font-mono text-slate-600">
                                        Passport No: A92019481 • Expiry: Dec 2031 • Issuing Authority: US Dept of State
                                      </div>
                                      <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
                                        ✓ E-Verify pre-screening clear. Physical in-person inspection required by Priya Sharma today.
                                      </div>
                                      <div className="pt-3 flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setDocModalOpen(false);
                                            handleTriageApprove('david', 'David Miller');
                                          }}
                                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer"
                                        >
                                          Confirm Inspection & Mark I-9 Verified
                                        </button>
                                      </div>
                                    </div>
                                  ),
                                });
                                setDocModalOpen(true);
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-[#131b2e] hover:bg-slate-900 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">folder_open</span> Review Docs
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Leave & Remote Authorization Hub */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-900 text-base font-jakarta">
                      Leave & Remote Authorization Hub
                    </h2>
                    <p className="text-xs text-slate-400">
                      Manage scheduled PTO, sick leaves, and work-from-client approvals.
                    </p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={leaveSearch}
                      onChange={(e) => setLeaveSearch(e.target.value)}
                      placeholder="Filter employee or ID..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-slate-200 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setLeaveTab('full')}
                    className={`pb-2.5 font-bold transition-colors cursor-pointer border-b-2 ${
                      leaveTab === 'full'
                        ? 'border-purple-700 text-purple-700'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Full-Day Leaves ({fullLeaves.filter((l) => l.status === 'pending').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaveTab('half')}
                    className={`pb-2.5 font-bold transition-colors cursor-pointer border-b-2 ${
                      leaveTab === 'half'
                        ? 'border-purple-700 text-purple-700'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Half-Day / Remote Requests ({halfLeaves.filter((h) => h.status === 'pending').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaveTab('resolved')}
                    className={`pb-2.5 font-bold transition-colors cursor-pointer border-b-2 ${
                      leaveTab === 'resolved'
                        ? 'border-purple-700 text-purple-700'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Past Resolved (38)
                  </button>
                </div>

                {/* Tab 1: Full-Day Leaves Table */}
                {leaveTab === 'full' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-3 rounded-l-lg">Employee</th>
                          <th className="py-2.5 px-3">Leave Type</th>
                          <th className="py-2.5 px-3">Duration & Dates</th>
                          <th className="py-2.5 px-3">Available Balance</th>
                          <th className="py-2.5 px-3">Reason</th>
                          <th className="py-2.5 px-3 rounded-r-lg text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredFullLeaves.map((record) => (
                          <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                {record.avatar ? (
                                  <img
                                    alt={record.employeeName}
                                    className="w-8 h-8 rounded-full object-cover shrink-0"
                                    src={record.avatar}
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                                    {record.initials || 'EM'}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-slate-900">{record.employeeName}</div>
                                  <div className="text-[10px] text-slate-400">
                                    {record.role} ({record.empId})
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${record.leaveTypeBadge}`}>
                                {record.leaveType}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-800">{record.duration}</div>
                              <div className="text-[10px] text-slate-400">{record.dates}</div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-mono font-semibold text-slate-900">{record.availableBalance}</span>
                            </td>
                            <td className="py-3 px-3 max-w-xs">
                              <div className="truncate text-slate-700" title={record.reason}>
                                {record.reason}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {record.status === 'approved' ? (
                                <span className="text-emerald-700 font-bold text-xs">Approved ✓</span>
                              ) : (
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleApproveLeaveRow(record.id, record.employeeName)}
                                    className="px-2.5 py-1 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-semibold text-[11px] cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenReject(record.employeeName)}
                                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-semibold text-[11px] cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tab 2: Half-Day Requests */}
                {leaveTab === 'half' && (
                  <div className="space-y-3">
                    {halfLeaves.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                            {item.initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {item.name} • <span className="text-slate-500 font-normal">{item.role}</span>
                            </div>
                            <div className="text-[11px] text-slate-600">
                              <strong>{item.type}</strong> • Reason: {item.reason}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.status === 'approved' ? (
                            <span className="text-emerald-700 font-bold text-xs">Authorized ✓</span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveHalfRow(item.id, item.name)}
                                className="px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-semibold cursor-pointer"
                              >
                                Authorize
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setHalfLeaves((prev) =>
                                    prev.map((h) => (h.id === item.id ? { ...h, status: 'rejected' } : h))
                                  );
                                  showToast(`Request for ${item.name} declined.`, 'error');
                                }}
                                className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 text-[11px] font-semibold cursor-pointer"
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 3: Past Resolved */}
                {leaveTab === 'resolved' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-3 rounded-l-lg">Employee</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Dates</th>
                          <th className="py-2.5 px-3">Resolution</th>
                          <th className="py-2.5 px-3 rounded-r-lg text-right">Resolved On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {INITIAL_RESOLVED_LEAVES.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">
                              {r.employeeName} ({r.role})
                            </td>
                            <td className="py-2.5 px-3">{r.leaveType}</td>
                            <td className="py-2.5 px-3 font-mono">{r.dates}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Approved
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-500 font-mono">{r.resolvedDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recruitment & Onboarding Pipeline 4-Stage Kanban */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-purple-700 text-[22px]">hub</span>
                    <div>
                      <h2 className="font-bold text-slate-900 text-base font-jakarta">
                        Recruitment & Onboarding Pipeline
                      </h2>
                      <p className="text-xs text-slate-400">Active hiring stages from accepted offer to Day 1 welcome.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCandPipelineModalOpen(true)}
                    className="text-xs text-purple-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Candidates Pipeline</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>

                {/* 4 Stages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  {[
                    { key: 'offer-pending', label: '1. Offer Pending', bg: 'bg-slate-50' },
                    { key: 'awaiting-sign', label: '2. Awaiting Sign', bg: 'bg-slate-50' },
                    { key: 'i9-verification', label: '3. I-9 & Verification', bg: 'bg-orange-50/60' },
                    { key: 'day1-ready', label: '4. Ready for Day 1', bg: 'bg-slate-50' },
                  ].map((stage) => {
                    const stageCandidates = candidates.filter((c) => c.stage === stage.key);
                    return (
                      <div key={stage.key} className={`p-3.5 rounded-xl ${stage.bg} border border-slate-100 space-y-3`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {stage.label}
                          </span>
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center">
                            {stageCandidates.length}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {stageCandidates.map((cand) => (
                            <div
                              key={cand.id}
                              className="p-2.5 rounded-lg bg-white shadow-xs border border-slate-200 hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between gap-2"
                            >
                              <div
                                onClick={() => {
                                  setSelectedCandidate(cand);
                                  setCandModalOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                                  <span>{cand.name}</span>
                                  <span className="text-[10px] text-slate-400 font-normal">{cand.role}</span>
                                </div>
                                <div className={`text-[11px] mt-0.5 ${cand.badgeClass || 'text-slate-500'}`}>
                                  {cand.statusHighlight}
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCandidate(cand);
                                    setCandModalOpen(true);
                                  }}
                                  className="text-purple-700 hover:underline font-semibold cursor-pointer"
                                >
                                  Dossier
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAdvanceCandidateStage(cand.id)}
                                  className="text-slate-600 hover:text-purple-700 font-bold flex items-center gap-0.5 cursor-pointer"
                                >
                                  <span>Advance</span>
                                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                                </button>
                              </div>
                            </div>
                          ))}
                          {stageCandidates.length === 0 && (
                            <div className="p-3 text-center text-[10px] text-slate-400 border border-dashed border-slate-200 rounded-lg">
                              No candidates in this stage
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT RAIL (4 COLS) */}
            <div className="xl:col-span-4 space-y-6 min-w-0">
              {/* Compliance Audit Alert */}
              <div className="p-5 rounded-2xl bg-red-50/80 border border-red-200/80 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600 text-[20px]">contact_emergency</span>
                    <span className="font-bold text-red-950 text-xs">Compliance Audit Alert</span>
                  </div>
                  {unverifiedContacts.length > 0 && (
                    <button
                      type="button"
                      disabled={isReminding}
                      onClick={handleSendComplianceReminders}
                      className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-[10px] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isReminding ? 'Broadcasting...' : 'Remind All'}
                    </button>
                  )}
                </div>
                {unverifiedContacts.length > 0 ? (
                  <>
                    <p className="text-xs text-slate-700 leading-snug">
                      <strong>{unverifiedContacts.length} Personnel</strong> have missing or unverified emergency contact records in their personnel files:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {unverifiedContacts.map((contact) => (
                        <button
                          key={contact.id}
                          type="button"
                          onClick={() => {
                            setEditingContact({
                              id: contact.id,
                              name: contact.name,
                              role: contact.role,
                              contactName: contact.contactName || '',
                              contactPhone: contact.contactPhone || contact.phone,
                              relation: contact.relation || 'Spouse',
                            });
                            setContactModalOpen(true);
                          }}
                          className="px-2 py-0.5 rounded-md bg-white border border-red-200 text-slate-800 text-[10px] font-semibold hover:bg-red-50 hover:border-red-400 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Click to resolve contact"
                        >
                          <span>{contact.name}</span>
                          <span className="material-symbols-outlined text-[11px] text-red-500">edit</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 text-xs font-semibold">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                    <span>All emergency contacts verified & compliant across hubs!</span>
                  </div>
                )}
              </div>

              {/* Broadcast Announcement Composer */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-700 text-[20px]">campaign</span>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm font-jakarta">Broadcast Announcement</h2>
                    <p className="text-[11px] text-slate-400">Publish instant company bulletin.</p>
                  </div>
                </div>

                <form onSubmit={handlePublishAnnouncement} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Announcement Title
                    </label>
                    <input
                      type="text"
                      required
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      placeholder="e.g. Q4 Town Hall & Holiday Schedule"
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category</label>
                      <select
                        value={broadcastCategory}
                        onChange={(e) => setBroadcastCategory(e.target.value)}
                        className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
                      >
                        <option>Company Bulletin</option>
                        <option>HR Policy Update</option>
                        <option>Office Facility & IT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Target Audience</label>
                      <select
                        value={broadcastTarget}
                        onChange={(e) => setBroadcastTarget(e.target.value)}
                        className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
                      >
                        <option>All Global Hubs</option>
                        <option>Hyderabad Hub Only</option>
                        <option>Texas HQ Only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Message Body</label>
                    <textarea
                      required
                      rows={3}
                      value={broadcastBody}
                      onChange={(e) => setBroadcastBody(e.target.value)}
                      placeholder="Draft notice content here..."
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600 resize-none text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 text-xs">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                      />
                      <span>Pin to top for 48h</span>
                    </label>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-semibold text-xs shadow-xs hover:shadow-md cursor-pointer"
                    >
                      Publish Notice
                    </button>
                  </div>
                </form>

                {/* Published Announcements History */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Active Bulletins ({publishedAnnouncements.length})
                  </span>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {publishedAnnouncements.map((ann) => (
                      <div
                        key={ann.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-[11px] truncate">{ann.title}</div>
                          <div className="text-[10px] text-slate-400">
                            {ann.target} • {ann.publishedAt}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPublishedAnnouncements((prev) => prev.filter((a) => a.id !== ann.id))}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer shrink-0"
                          title="Retract Notice"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Workforce Operations & Presence Distribution */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-900 text-sm font-jakarta">Workforce Operations</h2>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    Today
                  </span>
                </div>

                {/* Distribution Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Presence Distribution</span>
                    <strong className="text-slate-800">248 Total</strong>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
                    <div className="bg-purple-600 h-full" style={{ width: '73%' }} title="182 In-Office (Hyderabad)"></div>
                    <div className="bg-purple-400 h-full" style={{ width: '19%' }} title="48 Texas HQ"></div>
                    <div className="bg-orange-500 h-full" style={{ width: '8%' }} title="18 Client Travel"></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-purple-600"></span> 182 Hyd
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span> 48 Texas
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span> 18 Client Travel
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  <div
                    onClick={() => showToast('Birthday reminder acknowledged for Sarah Jenkins', 'success')}
                    className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">cake</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Birthday Tomorrow! 🎂</div>
                      <div className="text-[10px] text-slate-400">Sarah Jenkins (Frontend Dev) turns 28.</div>
                    </div>
                  </div>

                  <div
                    onClick={() => showToast('Diwali holiday scheduled across all biometric hubs', 'info')}
                    className="flex items-start gap-2.5 p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">event</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Upcoming Public Holiday</div>
                      <div className="text-[10px] text-slate-500">Diwali Festival Break • Nov 01 (All Hubs Closed).</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
