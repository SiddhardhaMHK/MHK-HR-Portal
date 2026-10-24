export type ScreenId = 'sign-in' | 'employee-portal' | 'hr-command' | 'governance';

export type DemoRoleKey = 'alex' | 'priya' | 'rajesh';

export interface DemoAccount {
  key: DemoRoleKey;
  name: string;
  role: string;
  roleTitle: string;
  domain: string;
  email: string;
  empId: string;
  badge: string;
  badgeColor: string;
  targetScreen: ScreenId;
  defaultPassword: string;
  avatar: string;
}

export interface TaskItem {
  id: number;
  title: string;
  tag: string;
  tagClass: string;
  project: string;
  due: string;
  dueIcon: string;
  meta: string;
  completed: boolean;
  category: 'today' | 'week' | 'completed';
  actions: string[];
}

export interface LeaveRecord {
  id: number;
  employeeName: string;
  role: string;
  empId: string;
  leaveType: string;
  leaveTypeBadge: string;
  duration: string;
  dates: string;
  availableBalance: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  resolvedDate?: string;
  avatar?: string;
  initials?: string;
}

export interface CandidateItem {
  id: number;
  name: string;
  initials: string;
  role: string;
  compensation: string;
  stage: 'offer-pending' | 'awaiting-sign' | 'i9-verification' | 'day1-ready' | 'onboarded' | 'archived';
  stageLabel: string;
  details: string;
  statusHighlight: string;
  badgeClass?: string;
  actionLabel?: string;
  actionClass?: string;
  dept?: string;
  meta?: string;
  startDate?: string;
}

export interface PermissionRow {
  id: string;
  category: string;
  name: string;
  employeeAllowed: boolean;
  employeeLabel: string;
  employeeDisabled?: boolean;
  hrAllowed: boolean;
  hrLabel: string;
  hrDisabled?: boolean;
  adminAllowed: boolean;
  adminLabel: string;
  adminDisabled?: boolean;
  scope: string;
}

export interface SignerRecord {
  id: string;
  initials: string;
  name: string;
  slotTitle: string;
  title: string;
  email: string;
  scope: string;
  status: 'Active (Primary)' | 'Active' | 'Pending Re-verification';
  issuedDate: string;
}

export interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  timeAgo: string;
  location: string;
  icon: string;
  iconColor: string;
}

export interface CompanyPost {
  id: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: string;
  timestamp: string;
  likes: number;
  comments: number;
  pinned?: boolean;
}

export interface DirectoryEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  hub: 'Hyderabad' | 'Texas' | 'Client Travel';
  email: string;
  phone: string;
  avatar: string;
  status: 'In Office' | 'Remote' | 'On Leave';
}

export interface EmployeeDocument {
  id: string;
  name: string;
  category: string;
  date: string;
  size: string;
  type: string;
}

export interface UserRequestItem {
  id: string;
  type: 'Leave' | 'Expense' | 'Equipment' | 'Access';
  title: string;
  submittedDate: string;
  amountOrDuration: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewer: string;
}
