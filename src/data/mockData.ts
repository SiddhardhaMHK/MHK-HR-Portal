import { DemoAccount, TaskItem, LeaveRecord, CandidateItem, PermissionRow, SignerRecord, AuditLogItem } from '../types';

export const DEMO_ACCOUNTS: Record<string, DemoAccount> = {
  alex: {
    key: 'alex',
    name: 'Alex Kumar',
    role: 'Employee',
    roleTitle: "Alex's Personal Workspace",
    domain: 'mhktech.nexus-cloud.net',
    email: 'alex.kumar@mhktechinc.com',
    empId: 'MHK-HYD-0412',
    badge: 'ROLE_DEV_L2',
    badgeColor: 'bg-indigo-500/20 text-indigo-300',
    targetScreen: 'employee-portal',
    defaultPassword: 'DemoAlexPassword2026!',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1WUT703aPZymf3CYI-D69cSXMF9yA-2R7YSqxmjDYngX1k0FZkjJaU3dvzj5Mwu4oVyUlB1XLTCRTkuJJEh9o3bOx8k1aMPBu5elZSY_k2ff_-P_wJcYuabDzVz1AL5W9bjhmpIMmIKrk8eP1QrHuhu8Jk7OXq5ovVG-vfuvyjE4BMb1GvjYGD92gSer3voZWGTvDcCwGF88HthKJaLoBxb2DioqQfFVFuEKXo9Si6VU2w2aCK3OHD_ll8SPPlQeI_ZiDbKFsoN220'
  },
  priya: {
    key: 'priya',
    name: 'Priya Sharma',
    role: 'HR Admin',
    roleTitle: 'HR Console & Compliance Suite',
    domain: 'mhktech-hr.nexus-cloud.net',
    email: 'priya.sharma@mhktechinc.com',
    empId: 'MHK-HYD-0089',
    badge: 'ROLE_HR_LEAD',
    badgeColor: 'bg-purple-500/20 text-purple-300',
    targetScreen: 'hr-command',
    defaultPassword: 'DemoPriyaHrSecure2026!',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1WUT703aPZymf3CYI-D69cSXMF9yA-2R7YSqxmjDYngX1k0FZkjJaU3dvzj5Mwu4oVyUlB1XLTCRTkuJJEh9o3bOx8k1aMPBu5elZSY_k2ff_-P_wJcYuabDzVz1AL5W9bjhmpIMmIKrk8eP1QrHuhu8Jk7OXq5ovVG-vfuvyjE4BMb1GvjYGD92gSer3voZWGTvDcCwGF88HthKJaLoBxb2DioqQfFVFuEKXo9Si6VU2w2aCK3OHD_ll8SPPlQeI_ZiDbKFsoN220'
  },
  rajesh: {
    key: 'rajesh',
    name: 'Rajesh Mehta',
    role: 'Super Admin',
    roleTitle: 'Super Admin & Global Operations',
    domain: 'mhktech-global.nexus-cloud.net',
    email: 'rajesh.mehta@mhktechinc.com',
    empId: 'MHK-US-0012',
    badge: 'ROLE_SUPER_ADMIN',
    badgeColor: 'bg-orange-500/20 text-orange-300',
    targetScreen: 'governance',
    defaultPassword: 'DemoRajeshAdmin2026!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
};

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 1,
    title: 'Review OAuth2 Migration PR #419',
    tag: 'High Priority',
    tagClass: 'bg-red-500/10 text-red-600',
    project: 'Project Falcon',
    due: 'Due 2:00 PM',
    dueIcon: 'schedule',
    meta: 'Assignee: Alex Kumar (Self)',
    completed: false,
    category: 'today',
    actions: ['Start', 'Submit']
  },
  {
    id: 2,
    title: 'Finalize Employee Profile GraphQL Schema',
    tag: 'Medium',
    tagClass: 'bg-purple-100 text-purple-700',
    project: 'HRMS Portal v2.0',
    due: 'End of Day',
    dueIcon: 'schedule',
    meta: 'Architecture Review',
    completed: false,
    category: 'today',
    actions: ['Resume']
  },
  {
    id: 3,
    title: 'Draft Q4 Technical Debt Reduction Proposal',
    tag: 'Low',
    tagClass: 'bg-slate-200 text-slate-700',
    project: 'Core Platform',
    due: 'Oct 27, 2026',
    dueIcon: 'event',
    meta: 'Doc in Google Workspace',
    completed: false,
    category: 'today',
    actions: ['Start']
  },
  {
    id: 4,
    title: 'Prepare Architecture Deck for Texas HQ Summit',
    tag: 'High Priority',
    tagClass: 'bg-red-500/10 text-red-600',
    project: 'Leadership Sync',
    due: 'Oct 26, 2026',
    dueIcon: 'event',
    meta: 'Slides deck',
    completed: false,
    category: 'week',
    actions: ['Start']
  },
  {
    id: 5,
    title: 'Conduct Performance Benchmark on User Search API',
    tag: 'Medium',
    tagClass: 'bg-purple-100 text-purple-700',
    project: 'Core Platform',
    due: 'Oct 25, 2026',
    dueIcon: 'schedule',
    meta: 'Grafana telemetry',
    completed: false,
    category: 'week',
    actions: ['Resume']
  },
  {
    id: 6,
    title: 'Review New Intern Pull Requests & Setup Mentor Session',
    tag: 'Low',
    tagClass: 'bg-slate-200 text-slate-700',
    project: 'Team Culture',
    due: 'Oct 28, 2026',
    dueIcon: 'event',
    meta: 'Google Meet',
    completed: false,
    category: 'week',
    actions: ['Start']
  },
  {
    id: 7,
    title: 'Refactor Auth Token Cache Service to Redis 7',
    tag: 'Completed',
    tagClass: 'bg-emerald-100 text-emerald-800',
    project: 'Core Platform',
    due: 'Oct 22, 2026',
    dueIcon: 'check_circle',
    meta: 'Merged to master',
    completed: true,
    category: 'completed',
    actions: []
  },
  {
    id: 8,
    title: 'Update Personal Emergency Details in Workday',
    tag: 'Completed',
    tagClass: 'bg-emerald-100 text-emerald-800',
    project: 'Compliance',
    due: 'Oct 21, 2026',
    dueIcon: 'check_circle',
    meta: 'HR Verified',
    completed: true,
    category: 'completed',
    actions: []
  }
];

export const INITIAL_LEAVES: LeaveRecord[] = [
  {
    id: 101,
    employeeName: 'Vikram Malhotra',
    role: 'DevOps Lead',
    empId: '#MHK-2180',
    leaveType: 'Casual Leave',
    leaveTypeBadge: 'bg-purple-100 text-purple-700',
    duration: '2 Days',
    dates: 'Oct 28 – Oct 29, 2026',
    availableBalance: '7.5 / 14 Days',
    reason: "Attending sister's wedding in Jaipur. Handover shared with Anita.",
    status: 'pending',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNP5FR6SrcoDueucYc_OoOO12x_rWCh1ircW_h8HeNQRL1VPwLd6U4Lt-F4Nprpqo3NO9D-t2oTTom6iuNCCTauLXhyBxCajT2UBrVSYnZQCnvG8cT4C8wuOToZmSDRtcymRZpaaUfFCju9E3IiJcVk8z6-xX5u0B9qtJaGv_io9jkxFBQi60R7UXGu-vKXKRwPTNe3lLJNg9xdDhMjbc7Al9VUhGRiRpxPUG_26GuCw4rnvt3z5UYkg'
  },
  {
    id: 102,
    employeeName: 'Kavita Lal',
    role: 'QA Automation',
    empId: '#MHK-4412',
    leaveType: 'Sick Leave',
    leaveTypeBadge: 'bg-red-100 text-red-700',
    duration: '1 Day',
    dates: 'Oct 26, 2026',
    availableBalance: '5.0 / 8 Days',
    reason: 'Medical prescription attached for viral fever follow-up.',
    status: 'pending',
    initials: 'KL'
  },
  {
    id: 103,
    employeeName: 'Rohan Deshmukh',
    role: 'Backend Eng',
    empId: '#MHK-5011',
    leaveType: 'Privilege Leave',
    leaveTypeBadge: 'bg-blue-100 text-blue-700',
    duration: '4 Days',
    dates: 'Nov 03 – Nov 06, 2026',
    availableBalance: '12.0 / 18 Days',
    reason: 'Diwali travel to hometown. Coverage plan signed off.',
    status: 'pending',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVikSj6IHb3EDxM-oMSMNS-aVx31EH2KpBMMUUf5f1GXhWBC507stVdxrnPpAyr2aKiBYGMTaKkSrc_KXNDVQ5RscDb7y9CWX3tr2j9s_5gW3Hz8lmYWNDA11_CwiHLllDnT-NHf7Ymxm9BOJnQNmm-8XF5ofiwp6fPnwYyaxS6zNSuYydhPNfmX_fb_5JoIbsaRrhtQF0cRdNVwqp_UWBWtQGUuC63335ga2JKJT3FVv6eDWadKItpA'
  },
  {
    id: 104,
    employeeName: 'Elena Torres',
    role: 'Recruiter',
    empId: '#MHK-3199',
    leaveType: 'Casual Leave',
    leaveTypeBadge: 'bg-purple-100 text-purple-700',
    duration: '1 Day',
    dates: 'Oct 30, 2026',
    availableBalance: '4.0 / 12 Days',
    reason: 'Personal apartment moving errands.',
    status: 'pending',
    initials: 'ET'
  }
];

export const INITIAL_HALF_DAY_REQUESTS = [
  {
    id: 201,
    name: 'Sneha Nambiar',
    role: 'Front-End Engineer',
    initials: 'SN',
    type: 'Half-Day Afternoon (2:00 PM – 6:30 PM)',
    reason: 'Dental extraction procedure at Hyderabad Clinic',
    status: 'pending'
  },
  {
    id: 202,
    name: 'Arjun Reddy',
    role: 'Systems Admin',
    initials: 'AR',
    type: 'Remote WFH (Full Day)',
    reason: 'High-speed fiber maintenance in home sector',
    status: 'pending'
  }
];

export const INITIAL_RESOLVED_LEAVES: LeaveRecord[] = [
  {
    id: 301,
    employeeName: 'Maya Krishnan',
    role: 'Cloud Eng',
    empId: '#MHK-1092',
    leaveType: 'Annual PTO',
    leaveTypeBadge: 'bg-emerald-100 text-emerald-800',
    duration: '3 Days',
    dates: 'Oct 12 – Oct 15',
    availableBalance: '9.0 / 14 Days',
    reason: 'Personal vacation',
    status: 'approved',
    resolvedDate: 'Oct 10, 2026'
  },
  {
    id: 302,
    employeeName: 'George Miller',
    role: 'Sales Ops',
    empId: '#MHK-2210',
    leaveType: 'Comp Off',
    leaveTypeBadge: 'bg-emerald-100 text-emerald-800',
    duration: '1 Day',
    dates: 'Oct 08',
    availableBalance: '2.0 Days',
    reason: 'Weekend release coverage comp off',
    status: 'approved',
    resolvedDate: 'Oct 07, 2026'
  },
  {
    id: 303,
    employeeName: 'Tanvi Shah',
    role: 'UI/UX Designer',
    empId: '#MHK-3091',
    leaveType: 'Sick Leave',
    leaveTypeBadge: 'bg-emerald-100 text-emerald-800',
    duration: '1 Day',
    dates: 'Oct 03',
    availableBalance: '6.0 / 8 Days',
    reason: 'Migraine recovery',
    status: 'approved',
    resolvedDate: 'Oct 03, 2026'
  }
];

export const INITIAL_CANDIDATES: CandidateItem[] = [
  {
    id: 1,
    name: 'Srinivas Rao',
    initials: 'SR',
    role: 'Senior React Lead',
    compensation: '$135,000 / yr + 15% Bonus',
    stage: 'offer-pending',
    stageLabel: '1. Offer Pending',
    details: 'Technical panel cleared 5/5. Compensation package in final equity sign-off before DocuSign generation.',
    statusHighlight: 'Sr. React Lead • $135k'
  },
  {
    id: 2,
    name: 'Jin Chen',
    initials: 'JC',
    role: 'Data Engineer',
    compensation: '$110,000 / yr',
    stage: 'offer-pending',
    stageLabel: '1. Offer Pending',
    details: 'Background verification cleared. Waiting on candidate acceptance expected by Friday 5 PM.',
    statusHighlight: 'Data Engineer • $110k'
  },
  {
    id: 3,
    name: 'Tara Miller',
    initials: 'TM',
    role: 'QA Automation Engineer',
    compensation: '$95,000 / yr',
    stage: 'offer-pending',
    stageLabel: '1. Offer Pending',
    details: 'Final interview completed with Hyderabad testing leadership. Drafting compensation breakdown.',
    statusHighlight: 'QA Automation • $95k'
  },
  {
    id: 4,
    name: 'Edward Watson',
    initials: 'EW',
    role: 'VP of Engineering',
    compensation: '$190,000 / yr + Exec Equity',
    stage: 'awaiting-sign',
    stageLabel: '2. Awaiting Sign',
    details: 'Candidate reviewed benefits terms with People Ops lead. Confirmation expected within 24 hours.',
    statusHighlight: 'VP Engineering • Sent 2d ago'
  },
  {
    id: 5,
    name: 'Kunal Patel',
    initials: 'KP',
    role: 'DevOps Specialist',
    compensation: '$125,000 / yr',
    stage: 'awaiting-sign',
    stageLabel: '2. Awaiting Sign',
    details: 'Candidate opened document link from Texas office. Telephonic check-in completed.',
    statusHighlight: 'DevOps Eng • DocuSign Open'
  },
  {
    id: 6,
    name: 'David Miller',
    initials: 'DM',
    role: 'Cloud Operations Engineer',
    compensation: '$105,000 / yr',
    stage: 'i9-verification',
    stageLabel: '3. I-9 & Verification',
    details: 'Physical identification verification at Texas HQ required to satisfy federal statutory 3-day window.',
    statusHighlight: 'Pending Form I-9 Sec 2',
    badgeClass: 'text-orange-600 font-semibold'
  },
  {
    id: 7,
    name: 'Lucia Gomez',
    initials: 'LG',
    role: 'Security Analyst',
    compensation: '$115,000 / yr',
    stage: 'i9-verification',
    stageLabel: '3. I-9 & Verification',
    details: 'Background check completed with Checkr (100% clean). Final contract uploaded to secure cloud storage.',
    statusHighlight: 'BGC Clear • Finalizing'
  },
  {
    id: 8,
    name: 'Pooja Nair',
    initials: 'PN',
    role: 'Senior QA Automation',
    compensation: '$108,000 / yr',
    stage: 'day1-ready',
    stageLabel: '4. Ready for Day 1',
    details: 'Laptop configured and shipped. Orientation scheduled for Monday 10:00 AM IST at Hyderabad Hub.',
    statusHighlight: 'Starts Mon, Nov 3 • Hyd Hub',
    badgeClass: 'text-purple-600 font-semibold'
  },
  {
    id: 9,
    name: 'Brian Taylor',
    initials: 'BT',
    role: 'Solutions Architect',
    compensation: '$142,000 / yr',
    stage: 'day1-ready',
    stageLabel: '4. Ready for Day 1',
    details: 'Manager buddy assigned: Marcus Vance. Ready for Texas HQ morning walkthrough.',
    statusHighlight: 'Starts Mon, Nov 3 • Texas HQ',
    badgeClass: 'text-purple-600 font-semibold'
  }
];

export const INITIAL_PERMISSIONS: PermissionRow[] = [
  // Workforce & Directory
  {
    id: 'perm-1',
    category: 'Workforce & Directory',
    name: 'View Org Chart & Directory',
    employeeAllowed: true,
    employeeLabel: 'View Only',
    hrAllowed: true,
    hrLabel: 'Full Edit',
    adminAllowed: true,
    adminLabel: 'Full Manage',
    scope: 'Global All Hubs'
  },
  {
    id: 'perm-2',
    category: 'Workforce & Directory',
    name: 'Edit Personal Profile & Documents',
    employeeAllowed: true,
    employeeLabel: 'Self Only',
    hrAllowed: true,
    hrLabel: 'Assigned Depts',
    adminAllowed: true,
    adminLabel: 'All Records',
    scope: 'Sensitive Tax/SSN Masked'
  },
  {
    id: 'perm-3',
    category: 'Workforce & Directory',
    name: 'Execute Emergency Contact Remind',
    employeeAllowed: false,
    employeeLabel: 'No Access',
    employeeDisabled: true,
    hrAllowed: true,
    hrLabel: 'Batch Remind',
    adminAllowed: true,
    adminLabel: 'System Broadcast',
    scope: 'Automated SMS/Email'
  },
  // Leave & Attendance
  {
    id: 'perm-4',
    category: 'Leave & Attendance',
    name: 'Approve / Reject PTO & Leaves',
    employeeAllowed: false,
    employeeLabel: 'Apply Only',
    employeeDisabled: true,
    hrAllowed: true,
    hrLabel: 'Tier 1 Sign-off',
    adminAllowed: true,
    adminLabel: 'Override & Final Audit',
    scope: 'Departmental SLA 24h'
  },
  {
    id: 'perm-5',
    category: 'Leave & Attendance',
    name: 'Manual Punch Correction',
    employeeAllowed: false,
    employeeLabel: 'Request Mode',
    employeeDisabled: true,
    hrAllowed: true,
    hrLabel: 'Direct Override',
    adminAllowed: true,
    adminLabel: 'Audit Logged',
    scope: 'Requires HR reason note'
  },
  // Compensation, Payroll & Expenses
  {
    id: 'perm-6',
    category: 'Compensation, Payroll & Expenses',
    name: 'Approve Expense Claims & Receipts',
    employeeAllowed: false,
    employeeLabel: 'Submit Only',
    employeeDisabled: true,
    hrAllowed: true,
    hrLabel: 'Up to $2,500',
    adminAllowed: true,
    adminLabel: 'Unlimited / Override',
    scope: 'Receipt OCR verified'
  },
  {
    id: 'perm-7',
    category: 'Compensation, Payroll & Expenses',
    name: 'Finalize Monthly Payroll Run',
    employeeAllowed: false,
    employeeLabel: 'No Access',
    employeeDisabled: true,
    hrAllowed: true,
    hrLabel: 'Review & Draft',
    adminAllowed: true,
    adminLabel: 'Final Disburse & Sign',
    scope: 'Dual-key auth required'
  },
  // Governance, Legal & Compliance
  {
    id: 'perm-8',
    category: 'Governance, Legal & Compliance',
    name: 'Whistleblower Case Investigation',
    employeeAllowed: false,
    employeeLabel: 'Submit Anon',
    employeeDisabled: true,
    hrAllowed: false,
    hrLabel: 'Blinded',
    hrDisabled: true,
    adminAllowed: true,
    adminLabel: 'Encrypted View',
    scope: 'Tracking Token Restricted'
  },
  {
    id: 'perm-9',
    category: 'Governance, Legal & Compliance',
    name: 'Handbook Administration & Publishing',
    employeeAllowed: false,
    employeeLabel: 'Read & Ack',
    employeeDisabled: true,
    hrAllowed: true,
    hrLabel: 'Draft Sections',
    adminAllowed: true,
    adminLabel: 'Publish & Trigger Sign',
    scope: 'Mandatory Pop-up'
  },
  {
    id: 'perm-10',
    category: 'Governance, Legal & Compliance',
    name: 'Authorized Signer Management',
    employeeAllowed: false,
    employeeLabel: 'No Access',
    employeeDisabled: true,
    hrAllowed: false,
    hrLabel: 'View Signatures',
    hrDisabled: true,
    adminAllowed: true,
    adminLabel: 'Add / Revoke Key',
    scope: 'DocuSign & IRS 8821'
  }
];

export const INITIAL_SIGNERS: SignerRecord[] = [
  {
    id: 'sig-1',
    initials: 'RM',
    name: 'Rajesh Mehta',
    slotTitle: 'Primary Keyholder',
    title: 'VP of Technology & Operations',
    email: 'r.mehta@mhktech.com',
    scope: 'Contracts, I-9 Reverification, Master Vendor MSAs',
    status: 'Active (Primary)',
    issuedDate: 'Jan 15, 2024'
  },
  {
    id: 'sig-2',
    initials: 'PS',
    name: 'Priya Sharma',
    slotTitle: 'Signer Slot 2',
    title: 'Head of People Operations',
    email: 'p.sharma@mhktech.com',
    scope: 'Employment Offers, Leave Letters, Health Benefit Enrollment',
    status: 'Active',
    issuedDate: 'Mar 10, 2024'
  },
  {
    id: 'sig-3',
    initials: 'DV',
    name: 'David Vance',
    slotTitle: 'Legal Officer',
    title: 'Chief Legal Officer (Texas HQ)',
    email: 'd.vance@mhktech.com',
    scope: 'Immigration H-1B LCA, NDAs, Whistleblower Arbitration',
    status: 'Active',
    issuedDate: 'Jul 01, 2024'
  },
  {
    id: 'sig-4',
    initials: 'ER',
    name: 'Elena Ramos',
    slotTitle: 'Audit Renewal Due',
    title: 'Interim Finance Director',
    email: 'e.ramos@mhktech.com',
    scope: 'Banking ACH & Payroll Release',
    status: 'Pending Re-verification',
    issuedDate: 'Oct 02, 2026'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit-1',
    actor: 'Rajesh Mehta',
    action: 'updated role permissions for HR Manager (Expense limit adjusted)',
    timeAgo: '12m ago',
    location: 'IP 104.28.19.4 (Texas HQ)',
    icon: 'edit_note',
    iconColor: 'text-purple-600'
  },
  {
    id: 'audit-2',
    actor: 'Priya Sharma',
    action: 'executed Form I-9 verification for Texas hire',
    timeAgo: '1h ago',
    location: 'IP 49.205.112.9 (Hyd Hub)',
    icon: 'badge',
    iconColor: 'text-orange-600'
  },
  {
    id: 'audit-3',
    actor: 'Automated Security Scanner',
    action: '0 critical vulnerabilities found across SSO endpoints',
    timeAgo: '4h ago',
    location: 'AWS US-East GuardDuty',
    icon: 'shield',
    iconColor: 'text-emerald-600'
  }
];

export const INITIAL_COMPANY_POSTS: import('../types').CompanyPost[] = [
  {
    id: 'post-1',
    author: 'Rajesh Mehta',
    authorRole: 'VP of Technology & Operations',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Q4 Global Town Hall & FY27 Strategic Roadmap Announcement',
    content: 'Team, please join us this Thursday at 9:00 AM CST / 7:30 PM IST for our quarterly all-hands. We will celebrate Project Falcon milestones, review our SOC-2 Type II audit completion, and outline the upcoming H-1B compliance schedule.',
    category: 'Executive Announcement',
    timestamp: '2 hours ago',
    likes: 42,
    comments: 11,
    pinned: true,
  },
  {
    id: 'post-2',
    author: 'Priya Sharma',
    authorRole: 'Head of People Operations',
    authorAvatar: 'https://lh3.googleusercontent.com/aida/AEtjO1WUT703aPZymf3CYI-D69cSXMF9yA-2R7YSqxmjDYngX1k0FZkjJaU3dvzj5Mwu4oVyUlB1XLTCRTkuJJEh9o3bOx8k1aMPBu5elZSY_k2ff_-P_wJcYuabDzVz1AL5W9bjhmpIMmIKrk8eP1QrHuhu8Jk7OXq5ovVG-vfuvyjE4BMb1GvjYGD92gSer3voZWGTvDcCwGF88HthKJaLoBxb2DioqQfFVFuEKXo9Si6VU2w2aCK3OHD_ll8SPPlQeI_ZiDbKFsoN220',
    title: 'Diwali Festival Break 2026 Schedule & Holiday Coverage',
    content: 'Warm festival greetings! All India delivery hubs will observe a mandatory 3-day company holiday from Nov 1 to Nov 3. On-call rotations for critical production banking clients are fully staffed. Sweets distribution takes place Wednesday at Hyderabad Hub!',
    category: 'Culture & Holidays',
    timestamp: 'Yesterday',
    likes: 88,
    comments: 24,
    pinned: true,
  },
  {
    id: 'post-3',
    author: 'Vikram Patel',
    authorRole: 'Engineering Lead',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLW5A5gcG3WTbzPffBmPwMPs0fSbwIQ4aH8KYbiwAVjVzzxmX0jpjCSI41ExP1H6xChAQ6djiELQ4rWF-e0YgECQ1cloeg--Vf9DADljcXFMkVDb13O9EWK-e3UJJaD5VCQx2FALoWuYrwez3vv5uzYMHTA0xZfHh9MyUSfFBaIhphvpDiid6erA5u5rAoc43dNFafL6kOmIQGcTzgJRPHjxX4gy_Q3C4ymdl4B0Zz0ilO0_lhSpt5Dg',
    title: 'Kudos to Alex Kumar for PR #419 OAuth2 Migration Completion! 🚀',
    content: 'Massive shout-out to Alex and the Core Platform team for refactoring token caching and delivering 40% latency reduction across our auth cluster with zero production downtime.',
    category: 'Kudos & Spotlights',
    timestamp: '3 days ago',
    likes: 64,
    comments: 18,
  }
];

export const INITIAL_DIRECTORY: import('../types').DirectoryEmployee[] = [
  {
    id: 'emp-1',
    name: 'Alex Kumar',
    role: 'Sr. Software Engineer',
    department: 'Core Platform Engineering',
    hub: 'Hyderabad',
    email: 'alex.kumar@mhktechinc.com',
    phone: '+91 (40) 6712-4102',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1WUT703aPZymf3CYI-D69cSXMF9yA-2R7YSqxmjDYngX1k0FZkjJaU3dvzj5Mwu4oVyUlB1XLTCRTkuJJEh9o3bOx8k1aMPBu5elZSY_k2ff_-P_wJcYuabDzVz1AL5W9bjhmpIMmIKrk8eP1QrHuhu8Jk7OXq5ovVG-vfuvyjE4BMb1GvjYGD92gSer3voZWGTvDcCwGF88HthKJaLoBxb2DioqQfFVFuEKXo9Si6VU2w2aCK3OHD_ll8SPPlQeI_ZiDbKFsoN220',
    status: 'In Office',
  },
  {
    id: 'emp-2',
    name: 'Priya Sharma',
    role: 'People Operations Lead',
    department: 'Human Resources & Talent',
    hub: 'Hyderabad',
    email: 'priya.sharma@mhktechinc.com',
    phone: '+91 (40) 6712-4010',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1WUT703aPZymf3CYI-D69cSXMF9yA-2R7YSqxmjDYngX1k0FZkjJaU3dvzj5Mwu4oVyUlB1XLTCRTkuJJEh9o3bOx8k1aMPBu5elZSY_k2ff_-P_wJcYuabDzVz1AL5W9bjhmpIMmIKrk8eP1QrHuhu8Jk7OXq5ovVG-vfuvyjE4BMb1GvjYGD92gSer3voZWGTvDcCwGF88HthKJaLoBxb2DioqQfFVFuEKXo9Si6VU2w2aCK3OHD_ll8SPPlQeI_ZiDbKFsoN220',
    status: 'In Office',
  },
  {
    id: 'emp-3',
    name: 'Rajesh Mehta',
    role: 'VP of Technology & Operations',
    department: 'Global Leadership & IT',
    hub: 'Texas',
    email: 'rajesh.mehta@mhktechinc.com',
    phone: '+1 (469) 555-0112',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'In Office',
  },
  {
    id: 'emp-4',
    name: 'Sarah Jenkins',
    role: 'Product Designer',
    department: 'Design & User Experience',
    hub: 'Texas',
    email: 'sarah.jenkins@mhktechinc.com',
    phone: '+1 (469) 555-0145',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAQRyB1h2sXkk3Lxj0EAhvP2u7ZqYGtf5POslyw4kearfPBjf9TmWTgMqSyqaMoV6JtFMpRQB-AGZ_mji1i5XspdSdHQ0cbEb5z6a0UAfPyGm-m0bD_DRIy-MWfrtcJsFptoM5gdYAah9Rwq5CGVbEmlepQoCT8OcYkovdpZVuSoCuLnGYtlrOrWOdSF9h7VEJfRH2YnrHEL0JkcbbZCb0b3vztW4JOxrfG4fguhHFhn5KWuvUOXT7Sw',
    status: 'In Office',
  },
  {
    id: 'emp-5',
    name: 'Marcus Vance',
    role: 'Senior Cloud Architect',
    department: 'Enterprise Architecture',
    hub: 'Client Travel',
    email: 'marcus.vance@mhktechinc.com',
    phone: '+1 (469) 555-0189',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDlcG4y15Mpkb-r2T9FTTaFhdqc7FM5-UKdfapLN85pkFkwHl9jo3V60AeQoyJ0xBKAhetbvRao9G_6DCnTH7wYmjolDt-MeOXk6eUlEV0hpi9PmQEFEayDyGhl_E_uVrZuiCm_NW9NHSHbjEauO45vXTeWimPnlDscYKdjDcVeiCTJFlckQuqGZm-efrPsPePrMv5vY7JswlTItmzwXd19S7u3TJPUC15Ixgymu_B-c0jw4AREhV4jA',
    status: 'Remote',
  },
  {
    id: 'emp-6',
    name: 'Ananya Sen',
    role: 'Senior Product Designer',
    department: 'Design & User Experience',
    hub: 'Hyderabad',
    email: 'ananya.sen@mhktechinc.com',
    phone: '+91 (40) 6712-4119',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaEvysLzQVMTtmFnzrg8mHP70RcP6V933HR-7pWjape-OwsR9NCvinnUn0UlVxA_P89DdDjJmVy23Fw7VgwFPAIWpcs58rM4fP7qdtvUzQxotwsHnzDEcIEX6IGeu9Mh-nMYnod4UAAd8PyflcBn24RjccYaNVaJcndpfC9I-MhJsa9XuZyz7C4Zu4dtNE6ETbB-XpRyjVeBw-wzMPjP-QUlv70_yHrtrlwTaPO8hBELEtYY1ExU8tBA',
    status: 'In Office',
  },
  {
    id: 'emp-7',
    name: 'Rahul Verma',
    role: 'Full-Stack Engineer',
    department: 'Core Platform Engineering',
    hub: 'Hyderabad',
    email: 'rahul.verma@mhktechinc.com',
    phone: '+91 (40) 6712-4155',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtkNsy_xrZzYanE4zqETGdaWhUJOrKwPqBMsxn6YQsRzGH0JlUIwEC_EnCbWebkqAlVxUESl6I0ptscB0xjy9hp7pTfETrgAkF5XeKAipzMF4XfrvfT55MV9ukuNOgBChaBn54z3efP4Luki2eKcHX6dIoUIzd0epX6Al0yxVbvEmLTaqMBP-7bZUKD0SXgvEnXLbCVr2oFM3lwgvJy3hcNNHjVU1XSYFml8veCnyQXPtmSSSg__kq6w',
    status: 'On Leave',
  }
];

export const INITIAL_DOCUMENTS: import('../types').EmployeeDocument[] = [
  { id: 'doc-1', name: 'Official Employment Agreement & Offer Letter.pdf', category: 'Employment Contracts', date: 'Jan 10, 2024', size: '1.8 MB', type: 'PDF' },
  { id: 'doc-2', name: 'Form I-9 & E-Verify Compliance Dossier.pdf', category: 'Compliance & Immigration', date: 'Jan 15, 2024', size: '2.4 MB', type: 'PDF' },
  { id: 'doc-3', name: 'MHK Tech Global Employee Handbook (v2.3).pdf', category: 'Corporate Policies', date: 'Nov 12, 2025', size: '14.2 MB', type: 'PDF' },
  { id: 'doc-4', name: 'Group Medical & Accidental Health Insurance Policy.pdf', category: 'Benefits & Coverage', date: 'Apr 01, 2026', size: '890 KB', type: 'PDF' },
  { id: 'doc-5', name: 'Annual Form 16 / W-2 Consolidated Tax Statement.pdf', category: 'Tax & Compensation', date: 'May 30, 2026', size: '640 KB', type: 'PDF' }
];

export const INITIAL_USER_REQUESTS: import('../types').UserRequestItem[] = [
  { id: 'req-1', type: 'Leave', title: 'Casual Leave (CL) - Diwali Extension', submittedDate: 'Oct 22, 2026', amountOrDuration: '2 Days', status: 'Pending', reviewer: 'Priya Sharma' },
  { id: 'req-2', type: 'Expense', title: 'Cloud Conferences & AWS Certification Voucher', submittedDate: 'Oct 18, 2026', amountOrDuration: '$299.00', status: 'Approved', reviewer: 'Priya Sharma' },
  { id: 'req-3', type: 'Equipment', title: 'Ergonomic Mechanical Keyboard & 4K Monitor', submittedDate: 'Sep 29, 2026', amountOrDuration: 'Hardware', status: 'Approved', reviewer: 'IT Desk' },
  { id: 'req-4', type: 'Access', title: 'Staging Kubernetes Cluster Read-Only Access', submittedDate: 'Sep 15, 2026', amountOrDuration: 'Dev Role', status: 'Approved', reviewer: 'Rajesh Mehta' }
];
