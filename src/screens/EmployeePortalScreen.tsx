import React, { useState, useEffect, useRef } from 'react';
import { ScreenId, TaskItem } from '../types';
import { INITIAL_TASKS } from '../data/mockData';
import { useToast } from '../components/Toast';

interface EmployeePortalScreenProps {
  onNavigate: (screen: ScreenId) => void;
  copilotTriggerRef?: React.MutableRefObject<(() => void) | null>;
  onOpenCompanyFeed?: () => void;
  onOpenDirectory?: () => void;
  onOpenDocuments?: () => void;
  onOpenMyRequests?: () => void;
  onOpenExpensesTimesheets?: () => void;
  onOpenHolidayCalendar?: () => void;
  autoOpenLeaveModal?: boolean;
  onLeaveModalOpened?: () => void;
}

export const EmployeePortalScreen: React.FC<EmployeePortalScreenProps> = ({
  onNavigate,
  copilotTriggerRef,
  onOpenCompanyFeed,
  onOpenDirectory,
  onOpenDocuments,
  onOpenMyRequests,
  onOpenExpensesTimesheets,
  onOpenHolidayCalendar,
  autoOpenLeaveModal,
  onLeaveModalOpened,
}) => {
  const { showToast } = useToast();

  // Urgent Alert Banner
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98490 12345');
  const [emergencyContactName, setEmergencyContactName] = useState('Anita Kumar (Spouse)');

  // Punch Timer & Break State
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(22);
  const [timerMinutes, setTimerMinutes] = useState(32);
  const [timerHours, setTimerHours] = useState(4);

  // Leave Balances
  const [casualLeave, setCasualLeave] = useState(10.5);
  const [sickLeave, setSickLeave] = useState(6.0);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState('Casual Leave');
  const [leaveStartDate, setLeaveStartDate] = useState('2026-10-27');
  const [leaveEndDate, setLeaveEndDate] = useState('2026-10-28');
  const [leaveReason, setLeaveReason] = useState('');

  // Tasks & Sprint Goal
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [taskFilter, setTaskFilter] = useState<'today' | 'week' | 'completed'>('today');
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('Project Falcon');
  const [newTaskPriority, setNewTaskPriority] = useState<'High Priority' | 'Medium' | 'Low'>('Medium');
  const [newTaskDue, setNewTaskDue] = useState('Today 5:00 PM');

  // Work Location State (can be modified by WFH notice)
  const [workLocation, setWorkLocation] = useState<'Work From Hub' | 'Work From Home (Remote)'>('Work From Hub');

  // Interactive Payslip State
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [payslipMonth, setPayslipMonth] = useState('October 2026');

  // Interactive WFH Notice State
  const [wfhModalOpen, setWfhModalOpen] = useState(false);
  const [wfhStartDate, setWfhStartDate] = useState('2026-10-27');
  const [wfhEndDate, setWfhEndDate] = useState('2026-10-27');
  const [wfhReason, setWfhReason] = useState('Sprint 43 critical OAuth2 microservice development & code reviews');

  // Interactive Room / Desk Booking State
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('Charminar Conf Room (12 Pax) - Hyderabad');
  const [bookingSlot, setBookingSlot] = useState('Today 2:30 PM - 3:30 PM IST');
  const [meetingPurpose, setMeetingPurpose] = useState('Project Falcon Architecture Review');

  // Global Sync Clocks (Hyderabad and Texas times)
  const [hydTime, setHydTime] = useState('');
  const [texasTime, setTexasTime] = useState('');

  useEffect(() => {
    const updateSyncClocks = () => {
      const now = new Date();
      setHydTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setTexasTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/Chicago',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateSyncClocks();
    const interval = setInterval(updateSyncClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Wellness
  const [selectedMood, setSelectedMood] = useState('Great');

  // Anonymous Pulse Feedback
  const [feedbackCategory, setFeedbackCategory] = useState('Workplace & Culture');
  const [sentimentRating, setSentimentRating] = useState(4);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);

  // AI Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState<'standup' | 'weekly'>('standup');
  const [reportGenerating, setReportGenerating] = useState(false);

  // Docked Copilot Chat
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const copilotInputRef = useRef<HTMLInputElement>(null);

  // Auto open leave modal when triggered from external navigation (e.g. MyRequestsModal redirect)
  useEffect(() => {
    if (autoOpenLeaveModal) {
      setLeaveModalOpen(true);
      if (onLeaveModalOpened) {
        onLeaveModalOpened();
      }
    }
  }, [autoOpenLeaveModal, onLeaveModalOpened]);

  // Hook copilot trigger ref from parent header
  useEffect(() => {
    if (copilotTriggerRef) {
      copilotTriggerRef.current = () => {
        if (copilotInputRef.current) {
          copilotInputRef.current.focus();
          copilotInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };
    }
  }, [copilotTriggerRef]);

  // Live Timer increment
  useEffect(() => {
    let interval: any = null;
    if (isClockedIn && !isOnBreak) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev >= 59) {
            setTimerMinutes((m) => {
              if (m >= 59) {
                setTimerHours((h) => h + 1);
                return 0;
              }
              return m + 1;
            });
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, isOnBreak]);

  const pad = (n: number) => String(n).padStart(2, '0');

  const handleToggleClock = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isClockedIn) {
      setIsClockedIn(false);
      setIsOnBreak(false);
      showToast(`Clock-out logged at ${nowStr}. Have a great evening!`, 'info', 'Session Closed');
    } else {
      setIsClockedIn(true);
      showToast(`Clock-in recorded at ${nowStr}. Welcome back!`, 'success', 'Active Session');
    }
  };

  const handleToggleBreak = () => {
    if (!isClockedIn) return;
    if (!isOnBreak) {
      setIsOnBreak(true);
      showToast('Break started. Live session timer paused.', 'warning', 'Break Started');
    } else {
      setIsOnBreak(false);
      showToast('Welcome back! Session timer resumed.', 'success', 'Break Ended');
    }
  };

  // Sprint Goal calculation based on completed tasks
  const todayTasks = tasks.filter((t) => t.category === 'today');
  const completedTodayTasks = todayTasks.filter((t) => t.completed).length;
  const sprintDoneCount = completedTodayTasks;
  const sprintPercentage = todayTasks.length > 0 ? Math.round((completedTodayTasks / todayTasks.length) * 100) : 100;

  const handleToggleTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const next = !t.completed;
          showToast(
            next ? `Task "${t.title}" marked as completed!` : `Task "${t.title}" reopened.`,
            next ? 'success' : 'info'
          );
          return {
            ...t,
            completed: next,
            tag: next ? 'Completed' : t.tag === 'Completed' ? 'Medium' : t.tag,
            tagClass: next ? 'bg-emerald-100 text-emerald-800 font-bold' : t.tagClass,
            actions: next ? ['Reopen'] : ['Start', 'Submit'],
          };
        }
        return t;
      })
    );
  };

  const handleTaskAction = (taskId: number, actionName: string) => {
    if (actionName === 'Start') {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                tag: 'In Progress',
                tagClass: 'bg-amber-100 text-amber-800 font-bold',
                actions: ['Submit', 'Done'],
              }
            : t
        )
      );
      showToast('Task started! Live progress initiated.', 'info', 'Task In Progress');
    } else if (actionName === 'Reopen') {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                completed: false,
                tag: 'Medium',
                tagClass: 'bg-purple-100 text-purple-700',
                actions: ['Start', 'Submit'],
              }
            : t
        )
      );
      showToast('Task reopened and placed in Sprint queue.', 'info');
    } else {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                completed: true,
                tag: 'Completed',
                tagClass: 'bg-emerald-100 text-emerald-800 font-bold',
                actions: ['Reopen'],
              }
            : t
        )
      );
      showToast(`Task marked as ${actionName}! Sprint goal updated.`, 'success', 'Task Done');
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      project: newTaskProject,
      tag: newTaskPriority,
      tagClass:
        newTaskPriority === 'High Priority'
          ? 'bg-red-500/10 text-red-600'
          : newTaskPriority === 'Medium'
          ? 'bg-purple-100 text-purple-700'
          : 'bg-slate-200 text-slate-700',
      due: newTaskDue,
      dueIcon: 'schedule',
      meta: 'Assignee: Alex Kumar (Self)',
      completed: false,
      category: 'today',
      actions: ['Start', 'Submit'],
    };
    setTasks((prev) => [newTask, ...prev]);
    setAddTaskModalOpen(false);
    setNewTaskTitle('');
    showToast(`Task "${newTask.title}" added to Sprint backlog.`, 'success', 'Task Created');
  };

  const handleOpenLeaveModal = (type = 'Casual Leave') => {
    setSelectedLeaveType(type);
    setLeaveModalOpen(true);
  };

  const calculateLeaveDuration = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) {
      return { days: 0, isValid: false, text: 'Select start & end dates', isError: true };
    }
    const start = new Date(startStr + 'T00:00:00');
    const end = new Date(endStr + 'T00:00:00');
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { days: 0, isValid: false, text: 'Invalid date format', isError: true };
    }
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) {
      return { days: 0, isValid: false, text: 'End date cannot be earlier than start date', isError: true };
    }
    const days = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return {
      days,
      isValid: true,
      text: `${days} ${days === 1 ? 'Day' : 'Days'} (Inclusive)`,
      isError: false,
    };
  };

  const leaveDurationInfo = calculateLeaveDuration(leaveStartDate, leaveEndDate);

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDurationInfo.isValid) {
      showToast(leaveDurationInfo.text, 'error', 'Invalid Date Range');
      return;
    }

    const daysToDeduct = leaveDurationInfo.days;

    if (selectedLeaveType === 'Casual Leave') {
      if (casualLeave < daysToDeduct) {
        showToast(
          `Requested ${daysToDeduct} day(s), but only ${casualLeave} day(s) available in Casual Leave.`,
          'error',
          'Insufficient Balance'
        );
        return;
      }
      setCasualLeave((prev) => Math.max(0, +(prev - daysToDeduct).toFixed(1)));
    } else if (selectedLeaveType === 'Sick Leave') {
      if (sickLeave < daysToDeduct) {
        showToast(
          `Requested ${daysToDeduct} day(s), but only ${sickLeave} day(s) available in Sick Leave.`,
          'error',
          'Insufficient Balance'
        );
        return;
      }
      setSickLeave((prev) => Math.max(0, +(prev - daysToDeduct).toFixed(1)));
    }
    setLeaveModalOpen(false);
    showToast(
      `Leave application (${selectedLeaveType}: ${daysToDeduct} Day${daysToDeduct > 1 ? 's' : ''} from ${leaveStartDate} to ${leaveEndDate}) submitted for Manager approval!`,
      'success',
      'Leave Submitted'
    );
  };

  const handleOpenReportModal = (type: 'standup' | 'weekly') => {
    setReportModalType(type);
    setReportGenerating(true);
    setReportModalOpen(true);

    setTimeout(() => {
      setReportGenerating(false);
    }, 1200);
  };

  const handlePublishReport = () => {
    setReportModalOpen(false);
    showToast('Report published successfully and shared with #engineering channel!', 'success', 'Published to Slack');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsFeedbackSubmitting(true);
    setTimeout(() => {
      setIsFeedbackSubmitting(false);
      setFeedbackText('');
      showToast('Your confidential feedback has been sent directly to People Ops!', 'success', 'Feedback Received');
    }, 800);
  };

  const handleSendCopilot = () => {
    const query = copilotInput.trim();
    if (!query) return;

    const userMsg = { role: 'user' as const, text: query };
    setCopilotMessages((prev) => [...prev, userMsg]);
    setCopilotInput('');

    setTimeout(() => {
      let answer = '';
      const lower = query.toLowerCase();

      if (lower.includes('cl') || lower.includes('casual') || lower.includes('sick') || lower.includes('leave') || lower.includes('balance')) {
        answer = `Your active leave ledger: Casual Leave (CL) = ${casualLeave} days available, Sick Leave (SL) = ${sickLeave} days available. Privilege Leave (PL) = 12.0 days. You can apply directly using the "Apply CL" button or the quick action bar above.`;
      } else if (lower.includes('wfh') || lower.includes('remote') || lower.includes('hybrid')) {
        answer = `MHK Hybrid Workplace Policy: All engineering staff are eligible for up to 2 remote workdays per week. Currently your status is "${workLocation}". You can log a remote day using the "WFH Notice" quick action.`;
      } else if (lower.includes('time') || lower.includes('clock') || lower.includes('texas') || lower.includes('hyd') || lower.includes('sync')) {
        answer = `Global Dual Sync is live! Hyderabad Hub is at IST (${hydTime || 'IST'}) and Texas HQ is at CST (${texasTime || 'CST'}). Core bilateral team collaboration window is 1:30 PM – 5:30 PM IST.`;
      } else if (lower.includes('salary') || lower.includes('payslip') || lower.includes('pay') || lower.includes('tax')) {
        answer = `Your October 2026 payslip has been generated with Net Pay ₹1,76,400 ($2,100 USD equivalent). Direct deposit confirmed to HDFC Bank (****8419). You can click "View Payslip" in Quick Actions to view the breakdown.`;
      } else if (lower.includes('holiday') || lower.includes('diwali') || lower.includes('thanksgiving')) {
        answer = `Upcoming holidays: Diwali Festival Break (Nov 1-3, 2026) for Hyderabad Hub, and Thanksgiving (Nov 26-27, 2026) for Texas HQ. Both are recognized paid corporate closures.`;
      } else if (lower.includes('insurance') || lower.includes('medical') || lower.includes('health') || lower.includes('cigna')) {
        answer = `MHK Comprehensive Health Coverage: Policy #MHK-MED-9942 under Cigna Global. Covers inpatient hospitalization up to ₹10,00,000 / $50,000 with 100% cashless network access.`;
      } else if (lower.includes('report') || lower.includes('standup')) {
        answer = `Drafted Engineering Standup: '1) Implemented OAuth2 vault rotation across microservices. 2) Reviewed PR #419 with Texas QA lead. 3) Verified profile query latency. Blockers: None.' Click 'Publish to Team' to share!`;
      } else if (lower.includes('emergency') || lower.includes('contact')) {
        answer = `Emergency contact registered: ${emergencyContactName} (${emergencyPhone}). Verified with People Ops.`;
      } else {
        answer = `I have queried the MHK Enterprise Cloud HR database for "${query}": Your schedule is synced, time tracking is running, and your workstation token is verified under continuous Zero-Trust compliance.`;
      }

      setCopilotMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
    }, 450);
  };

  const activeMoodMessages: Record<string, string> = {
    Tough: "Logged: We're here for you. Reach out to People Ops or take a mental breather.",
    Tired: 'Logged: Take regular breaks, hydrate, and pace your sprint tasks.',
    Okay: 'Logged: Steady day ahead! Let us know if you need any team support.',
    Good: 'Logged: Great vibes today! Keep up the awesome momentum.',
    Great: 'Logged: Great! Have a productive sprint.',
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'today') return t.category === 'today';
    if (taskFilter === 'week') return t.category === 'week';
    return t.completed;
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-800 flex flex-col pt-16">
      {/* Emergency Contact Modal */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">contact_emergency</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Update Emergency Contact</h3>
              </div>
              <button onClick={() => setEmergencyModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmergencyModalOpen(false);
                setAlertDismissed(true);
                showToast('Emergency contact details updated and verified with People Ops.', 'success', 'Compliance Verified');
              }}
              className="py-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Primary Contact Name & Relationship</label>
                <input
                  type="text"
                  required
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Emergency Phone Number</label>
                <input
                  type="text"
                  required
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
                />
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg text-slate-500 text-[11px]">
                Under US DOL & Indian Factories Act, contact information is strictly confidential and used solely for urgent health incidents.
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEmergencyModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-md shadow-purple-700/20 cursor-pointer"
                >
                  Save & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">date_range</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Apply for Leave</h3>
              </div>
              <button onClick={() => setLeaveModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Leave Type</label>
                <select
                  value={selectedLeaveType}
                  onChange={(e) => setSelectedLeaveType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Casual Leave">Casual Leave (CL) - {casualLeave} Days Available</option>
                  <option value="Sick Leave">Sick Leave (SL) - {sickLeave} Days Available</option>
                  <option value="Privilege Leave">Privilege Leave (PL) - 12.0 Days Available</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Reason for Leave</label>
                <textarea
                  required
                  rows={3}
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Brief reason for your manager..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                />
              </div>

              <div
                className={`p-3 rounded-lg flex items-center justify-between text-xs transition-colors ${
                  leaveDurationInfo.isError
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-purple-50/60 border border-purple-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-purple-700">
                    {leaveDurationInfo.isError ? 'error' : 'timelapse'}
                  </span>
                  <span className="font-medium text-slate-600">Estimated Duration:</span>
                </div>
                <span
                  className={`font-bold ${
                    leaveDurationInfo.isError ? 'text-red-600 font-semibold' : 'text-purple-700'
                  }`}
                >
                  {leaveDurationInfo.text}{' '}
                  {!leaveDurationInfo.isError && (
                    <span className="text-[10px] text-slate-500 font-normal ml-1">
                      (Deducted from balance)
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={leaveDurationInfo.isError}
                  className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-md shadow-purple-700/20 cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {reportModalType === 'weekly' ? 'AI Weekly Summary Generator' : 'AI Daily Standup Composer'}
                </h3>
              </div>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              {reportGenerating ? (
                <div className="p-6 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center gap-3 font-semibold">
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span>Aggregating Git commits, PR merges, and Jira cards...</span>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                    Generated Summary
                  </span>
                  <p className="text-slate-800 leading-relaxed font-mono text-xs">
                    {reportModalType === 'weekly'
                      ? 'Week 43 Highlights: OAuth2 token caching implemented across 4 microservices. Reviewed PR #419 with zero regressions. Addressed 6 Jira backlog bugs and collaborated with Texas engineering on latency drops.'
                      : 'Yesterday: Finalized GraphQL Schema for Employee Profiles. Today: Reviewing OAuth2 PR #419 and attending Sprint Demo prep at 2:00 PM. Blockers: None.'}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Verified
                    </span>
                    <span className="text-slate-500 text-[11px]">Syncing to Slack #engineering</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={reportGenerating}
                  onClick={handlePublishReport}
                  className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-md shadow-purple-700/20 cursor-pointer disabled:opacity-50"
                >
                  Publish to Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {addTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">add_task</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Add Sprint Task</h3>
              </div>
              <button
                onClick={() => setAddTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">
                  Task Title & Objective
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement OAuth2 Refresh Token Vault"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">
                    Sprint Project
                  </label>
                  <select
                    value={newTaskProject}
                    onChange={(e) => setNewTaskProject(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Project Falcon">Project Falcon</option>
                    <option value="HRMS Portal v2.0">HRMS Portal v2.0</option>
                    <option value="Core Platform">Core Platform</option>
                    <option value="Leadership Sync">Leadership Sync</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="High Priority">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">
                  Due Schedule
                </label>
                <input
                  type="text"
                  required
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  placeholder="e.g. Today 5:00 PM or Oct 28, 2026"
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddTaskModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-md shadow-purple-700/20 cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Payslip Modal */}
      {payslipModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm">Monthly Payslip &amp; Tax Statement</h3>
                  <span className="text-[10px] text-slate-400">MHK Software Private Limited • Confidential</span>
                </div>
              </div>
              <button
                onClick={() => setPayslipModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Pay Period</span>
                  <select
                    value={payslipMonth}
                    onChange={(e) => setPayslipMonth(e.target.value)}
                    className="mt-0.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="October 2026">October 2026 (Current Cycle)</option>
                    <option value="September 2026">September 2026 (Paid)</option>
                    <option value="August 2026">August 2026 (Paid)</option>
                  </select>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase block">Disbursement Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span> Processed &amp; Deposited
                  </span>
                </div>
              </div>

              {/* Employee Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Employee ID</span>
                  <strong className="text-slate-800 font-mono">MHK-HYD-0412</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Designation</span>
                  <strong className="text-slate-800">Sr. Software Engineer</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Bank &amp; Account</span>
                  <strong className="text-slate-800">HDFC (****8419)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tax Assessment</span>
                  <strong className="text-slate-800 font-mono">AY 2026-27</strong>
                </div>
              </div>

              {/* Earnings vs Deductions Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Earnings */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-purple-700 uppercase tracking-wider text-[10px] block border-b border-slate-100 pb-1">
                    Earnings
                  </span>
                  <div className="flex justify-between text-slate-600">
                    <span>Basic Pay:</span>
                    <span className="font-mono font-semibold text-slate-900">₹1,20,000.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>House Rent Allowance (HRA):</span>
                    <span className="font-mono font-semibold text-slate-900">₹48,000.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Special Allowance:</span>
                    <span className="font-mono font-semibold text-slate-900">₹32,000.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Performance Incentive:</span>
                    <span className="font-mono font-semibold text-slate-900">₹15,000.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
                    <span>Gross Earnings:</span>
                    <span className="font-mono text-purple-700">₹2,15,000.00</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-orange-700 uppercase tracking-wider text-[10px] block border-b border-slate-100 pb-1">
                    Deductions &amp; Taxes
                  </span>
                  <div className="flex justify-between text-slate-600">
                    <span>Employee PF (EPF):</span>
                    <span className="font-mono font-semibold text-slate-900">₹14,400.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Professional Tax (PT):</span>
                    <span className="font-mono font-semibold text-slate-900">₹200.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Income Tax / TDS:</span>
                    <span className="font-mono font-semibold text-slate-900">₹24,000.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Medical Insurance:</span>
                    <span className="font-mono font-semibold text-emerald-600">₹0 (Company Covered)</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
                    <span>Total Deductions:</span>
                    <span className="font-mono text-red-600">₹38,600.00</span>
                  </div>
                </div>
              </div>

              {/* Net Pay Highlight */}
              <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Net Take-Home Pay</span>
                  <span className="text-xl font-extrabold text-slate-900 font-mono">₹1,76,400.00</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">USD Equivalent:</span>
                  <span className="font-mono font-bold text-purple-700 text-sm">$2,100.00 USD</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  const slipText = `MHK SOFTWARE PRIVATE LIMITED - PAYSLIP\nEmployee: Alex Kumar (MHK-HYD-0412)\nPeriod: ${payslipMonth}\nGross: INR 2,15,000.00\nDeductions: INR 38,600.00\nNet Disbursed: INR 1,76,400.00 ($2,100 USD)\nBank: HDFC Bank (****8419)\nTimestamp: 2026-10-24T09:30:00Z\nStatus: Verified`;
                  const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
                  const link = document.createElement('a');
                  link.href = window.URL.createObjectURL(blob);
                  link.setAttribute('download', `MHK_Payslip_${payslipMonth.replace(/\s+/g, '_')}.txt`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  showToast(`Downloaded verified payslip statement for ${payslipMonth}!`, 'success', 'Payslip Downloaded');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download Statement</span>
              </button>
              <button
                type="button"
                onClick={() => setPayslipModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Work From Home (WFH) Notice Modal */}
      {wfhModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">home_work</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Work From Home (WFH) Notice</h3>
                  <span className="text-[10px] text-slate-400">Policy: Up to 2 remote days / week</span>
                </div>
              </div>
              <button onClick={() => setWfhModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setWorkLocation('Work From Home (Remote)');
                setWfhModalOpen(false);
                showToast(`WFH Notice logged for ${wfhStartDate} to ${wfhEndDate}. Status updated to Remote!`, 'success', 'WFH Activated');
              }}
              className="py-4 space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={wfhStartDate}
                    onChange={(e) => setWfhStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={wfhEndDate}
                    onChange={(e) => setWfhEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Reason / Focus Objective</label>
                <textarea
                  rows={2}
                  required
                  value={wfhReason}
                  onChange={(e) => setWfhReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 resize-none"
                  placeholder="e.g. Sprint 43 core backend coding without office interruptions..."
                />
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-900 text-[11px] flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[16px]">info</span>
                <span>Direct notification will automatically broadcast to #engineering Slack channel.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setWfhModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Log WFH Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Room / Desk Reservation Modal */}
      {roomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">meeting_room</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Reserve Meeting Room or Pod</h3>
                  <span className="text-[10px] text-slate-400">Audio/Video Conference Equipped</span>
                </div>
              </div>
              <button onClick={() => setRoomModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRoomModalOpen(false);
                showToast(`Room "${selectedRoom}" reserved for ${bookingSlot}. Calendar invite created!`, 'success', 'Room Reserved');
              }}
              className="py-4 space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Conference Space</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                >
                  <option value="Charminar Conf Room (12 Pax) - Hyderabad">Charminar Conf Room (12 Pax) - Hyderabad Hub</option>
                  <option value="Golconda Brainstorming Pod (4 Pax) - Hyderabad">Golconda Brainstorming Pod (4 Pax) - Hyderabad Hub</option>
                  <option value="Texas Lone Star Boardroom (16 Pax) - Texas HQ">Texas Lone Star Boardroom (16 Pax) - Texas HQ</option>
                  <option value="Alamo Video Collaboration Suite (8 Pax) - Texas HQ">Alamo Video Collaboration Suite (8 Pax) - Texas HQ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Time Slot</label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                >
                  <option value="Today 2:30 PM - 3:30 PM IST">Today 2:30 PM - 3:30 PM IST</option>
                  <option value="Today 4:00 PM - 5:00 PM IST (Texas HQ Sync)">Today 4:00 PM - 5:00 PM IST (Texas HQ Sync)</option>
                  <option value="Tomorrow 10:00 AM - 11:00 AM IST">Tomorrow 10:00 AM - 11:00 AM IST</option>
                  <option value="Tomorrow 3:00 PM - 4:00 PM IST">Tomorrow 3:00 PM - 4:00 PM IST</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Meeting Objective</label>
                <input
                  type="text"
                  required
                  value={meetingPurpose}
                  onChange={(e) => setMeetingPurpose(e.target.value)}
                  placeholder="e.g. Project Falcon Architecture Review"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRoomModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between py-4 px-3 shrink-0">
          <div className="space-y-4">
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Navigation</span>
              <nav className="mt-2 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-[#131b2e] text-white font-bold text-xs shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                  <span>Home Dashboard</span>
                </button>
                <button
                  onClick={() => onOpenCompanyFeed ? onOpenCompanyFeed() : showToast('Opening Company Feed...', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                  <span>Company Feed</span>
                </button>
                <button
                  onClick={() => onOpenDirectory ? onOpenDirectory() : showToast('Opening Employee Directory...', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  <span>Directory</span>
                </button>
                <button
                  onClick={() => handleOpenLeaveModal()}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">date_range</span>
                  <span>Leave & Attendance</span>
                </button>
                <button
                  onClick={() => handleOpenReportModal('standup')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                  <span>Activity & Reports</span>
                </button>
                <button
                  onClick={() => onOpenDocuments ? onOpenDocuments() : showToast('Opening Documents Vault...', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">folder_shared</span>
                  <span>Documents</span>
                </button>
                <button
                  onClick={() => onNavigate('governance')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  <span>Handbook</span>
                </button>
              </nav>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Self Service</span>
              <nav className="mt-2 space-y-1">
                <button
                  onClick={() => onOpenMyRequests ? onOpenMyRequests() : handleOpenLeaveModal()}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">send_and_archive</span>
                  <span>My Requests</span>
                </button>
                <button
                  onClick={() => onOpenExpensesTimesheets ? onOpenExpensesTimesheets() : showToast('Opening Expense Claims & Timesheets...', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  <span>Expenses & Timesheets</span>
                </button>
                <button
                  onClick={() => setAddTaskModalOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-purple-700 hover:bg-purple-50 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_task</span>
                  <span>+ Add New Task</span>
                </button>
                <button
                  onClick={() => onOpenHolidayCalendar ? onOpenHolidayCalendar() : showToast('Viewing Holiday Calendar...', 'info')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">event</span>
                  <span>Holiday Calendar</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Service Status Badge */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-700 text-[11px]">Service Status</span>
            </div>
            <span className="font-mono text-slate-500 text-[10px]">99.98%</span>
          </div>
        </aside>

        {/* Center Main Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
          {/* Dismissible Urgent Alert Banner */}
          {!alertDismissed && (
            <div className="relative overflow-hidden rounded-xl bg-red-100 border border-red-200 text-red-900 p-4 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-red-950 block">Action Required</span>
                    <p className="text-xs text-red-800 truncate">
                      Your Emergency Contact information is incomplete. Please update before month-end to ensure compliance.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setEmergencyModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-red-900 hover:bg-red-950 text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Update Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAlertDismissed(true);
                      showToast('Emergency contact banner dismissed. Please update before Oct 31.', 'info');
                    }}
                    className="p-1 text-red-700 hover:text-red-900 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Greeting Hero & Daily Sprint Goal */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-jakarta">
                  Good morning, Alex 👋
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
                  Sprint Day 8
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Here is your team overview and daily schedule for{' '}
                <strong className="text-slate-800">Wednesday, Oct 24, 2026</strong>.
              </p>
            </div>

            {/* Focus Sprint Goal Card */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/60 min-w-[300px] max-w-md shadow-xs">
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-purple-600 transition-all duration-500 ease-out"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${sprintPercentage}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute font-bold text-xs text-purple-700 font-jakarta">
                  {sprintPercentage}%
                </span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-slate-800">Daily Sprint Goal</span>
                  <span className="text-[11px] text-slate-500 font-semibold">{sprintDoneCount} of 4 Done</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${sprintPercentage}%` }}
                  ></div>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 truncate">
                  Next: Project Falcon Code Review at 2:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Self-Service Bar */}
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-700 text-[18px]">bolt</span>
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">Quick Actions &amp; Self-Service</span>
              </div>
              <span className="text-[11px] text-slate-400">One-click operational shortcuts</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleOpenLeaveModal()}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/80 transition-all font-semibold flex items-center gap-2 cursor-pointer text-slate-700 group"
              >
                <span className="material-symbols-outlined text-[18px] text-purple-600 group-hover:scale-110 transition-transform">event_available</span>
                <span className="truncate">Apply Leave</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenExpensesTimesheets ? onOpenExpensesTimesheets() : null}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/80 transition-all font-semibold flex items-center gap-2 cursor-pointer text-slate-700 group"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-600 group-hover:scale-110 transition-transform">receipt_long</span>
                <span className="truncate">File Expense</span>
              </button>
              <button
                type="button"
                onClick={() => setWfhModalOpen(true)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/80 transition-all font-semibold flex items-center gap-2 cursor-pointer text-slate-700 group"
              >
                <span className="material-symbols-outlined text-[18px] text-blue-600 group-hover:scale-110 transition-transform">home_work</span>
                <span className="truncate">WFH Notice</span>
              </button>
              <button
                type="button"
                onClick={() => setPayslipModalOpen(true)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/80 transition-all font-semibold flex items-center gap-2 cursor-pointer text-slate-700 group"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600 group-hover:scale-110 transition-transform">payments</span>
                <span className="truncate">View Payslip</span>
              </button>
              <button
                type="button"
                onClick={() => setRoomModalOpen(true)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/80 transition-all font-semibold flex items-center gap-2 cursor-pointer text-slate-700 group"
              >
                <span className="material-symbols-outlined text-[18px] text-indigo-600 group-hover:scale-110 transition-transform">meeting_room</span>
                <span className="truncate">Book Room</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenHolidayCalendar ? onOpenHolidayCalendar() : null}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200/80 transition-all font-semibold flex items-center gap-2 cursor-pointer text-slate-700 group"
              >
                <span className="material-symbols-outlined text-[18px] text-purple-600 group-hover:scale-110 transition-transform">calendar_month</span>
                <span className="truncate">Holidays</span>
              </button>
            </div>
          </div>

          {/* Main 2-Column Split: 8 cols left + 4 cols right */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* LEFT 8 COLUMNS */}
            <div className="xl:col-span-8 space-y-6 min-w-0">
              {/* Active Session Punch Card + Global Sync Clocks */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Punch Card (7 cols) */}
                <div className="md:col-span-7 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isOnBreak
                              ? 'bg-amber-500 animate-ping'
                              : isClockedIn
                              ? 'bg-emerald-500 animate-pulse'
                              : 'bg-slate-400'
                          }`}
                        ></span>
                        <span className="font-bold text-slate-800 text-xs">
                          {isOnBreak ? 'On Break' : isClockedIn ? 'Active Session' : 'Session Closed'}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          workLocation === 'Work From Home (Remote)'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {workLocation}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 mb-6">
                      <div>
                        <span className="text-[11px] text-slate-400">Clocked In at</span>
                        <p className="text-base font-bold text-slate-900 mt-0.5">
                          09:15 AM <span className="text-[10px] text-slate-400 font-normal">IST</span>
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-[11px] text-slate-400">Time Logged Today</span>
                        <p
                          className={`text-3xl font-extrabold tracking-tight mt-0.5 font-mono ${
                            isClockedIn ? 'text-purple-700' : 'text-slate-400'
                          }`}
                        >
                          {pad(timerHours)}:{pad(timerMinutes)}:{pad(timerSeconds)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleToggleClock}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
                        isClockedIn
                          ? 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-purple-600/20'
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isClockedIn ? 'logout' : 'login'}
                      </span>
                      <span>{isClockedIn ? 'Clock Out' : 'Clock In'}</span>
                    </button>
                    <button
                      type="button"
                      disabled={!isClockedIn}
                      onClick={handleToggleBreak}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        isOnBreak
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isOnBreak ? 'play_arrow' : 'coffee'}
                      </span>
                      <span>{isOnBreak ? 'Resume Work' : 'Take Break'}</span>
                    </button>
                  </div>
                </div>

                {/* Global Sync Clocks (5 cols) */}
                <div className="md:col-span-5 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-slate-800 text-xs">Global Sync</span>
                      <p className="text-[10px] text-slate-400">Hyderabad and Texas times</p>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-purple-600">public</span>
                  </div>

                  <div className="space-y-2">
                    {/* Hyderabad Hub */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-[11px] shrink-0">
                          HYD
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-xs">Hyderabad Hub</div>
                          <div className="text-[10px] text-slate-400">IST (Local Time)</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 text-sm font-mono block">
                          {hydTime || '10:45:00 AM'}
                        </span>
                        <p className="text-[10px] text-emerald-600 font-bold">Active Hours</p>
                      </div>
                    </div>

                    {/* Texas HQ */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[11px] shrink-0">
                          TX
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-xs">Texas HQ</div>
                          <div className="text-[10px] text-slate-400">Texas Time (CST/CDT)</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 text-sm font-mono block">
                          {texasTime || '11:15:00 PM'}
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium">Off-hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>Hyderabad & Texas overlap: 1:30 PM – 5:30 PM IST</span>
                    <span className="text-purple-700 font-semibold font-mono">10.5 hrs diff</span>
                  </div>
                </div>
              </div>

              {/* 7-Day Weekly Attendance & Activity Timeline */}
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm font-jakarta">
                      Weekly Attendance & Activity Timeline
                    </h2>
                    <p className="text-[11px] text-slate-400">Oct 20 — Oct 26, 2026 (Week 43)</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    Total: 26.2 / 40.0 hrs
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 overflow-x-auto pb-1 text-center text-xs">
                  {/* Mon 20 */}
                  <div
                    onClick={() => showToast('Mon Oct 20: 8.8h logged (9:02 AM - 6:20 PM)', 'info')}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100 flex flex-col items-center"
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400">Mon</span>
                    <span className="font-bold text-slate-800 my-1 text-sm">20</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      8.8h
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">9:02 - 18:20</span>
                  </div>

                  {/* Tue 21 */}
                  <div
                    onClick={() => showToast('Tue Oct 21: 8.4h logged (9:10 AM - 6:05 PM)', 'info')}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100 flex flex-col items-center"
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400">Tue</span>
                    <span className="font-bold text-slate-800 my-1 text-sm">21</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      8.4h
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">9:10 - 18:05</span>
                  </div>

                  {/* Wed 22 (TODAY) */}
                  <div
                    onClick={() => showToast('Today: Session in progress. Timer active.', 'success')}
                    className="p-3 rounded-xl bg-[#131b2e] text-white shadow-md transform scale-102 cursor-pointer flex flex-col items-center"
                  >
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span className="text-[10px] uppercase font-bold text-purple-300">Today</span>
                    </div>
                    <span className="font-bold text-white my-1 text-sm">22</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px]">
                      4.5h+
                    </span>
                    <span className="text-[10px] text-slate-300 mt-1">
                      {isClockedIn ? 'In Session' : 'Shift Ended'}
                    </span>
                  </div>

                  {/* Thu 23 */}
                  <div
                    onClick={() => showToast('Thu Oct 23: Planned Sprint Demo at 3:00 PM', 'info')}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100 flex flex-col items-center"
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400">Thu</span>
                    <span className="font-bold text-slate-800 my-1 text-sm">23</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold">
                      Planned
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">Sprint Demo</span>
                  </div>

                  {/* Fri 24 */}
                  <div
                    onClick={() => showToast('Fri Oct 24: Release v2.4 staging deployment', 'info')}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100 flex flex-col items-center"
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400">Fri</span>
                    <span className="font-bold text-slate-800 my-1 text-sm">24</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold">
                      Planned
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">Release v2.4</span>
                  </div>

                  {/* Sat 25 */}
                  <div className="p-3 rounded-xl bg-slate-50/50 opacity-60 border border-slate-100 flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Sat</span>
                    <span className="font-bold text-slate-500 my-1 text-sm">25</span>
                    <span className="text-[10px] text-slate-400 mt-2 font-medium">Off</span>
                  </div>

                  {/* Sun 26 */}
                  <div className="p-3 rounded-xl bg-slate-50/50 opacity-60 border border-slate-100 flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Sun</span>
                    <span className="font-bold text-slate-500 my-1 text-sm">26</span>
                    <span className="text-[10px] text-slate-400 mt-2 font-medium">Off</span>
                  </div>
                </div>
              </div>

              {/* Leave Balances with visual meters */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-slate-900 text-sm font-jakarta">Leave Balances</h2>
                  <button
                    onClick={() => handleOpenLeaveModal()}
                    className="text-xs text-purple-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Leave Calendar</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Casual Leave */}
                  <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">Casual Leave (CL)</span>
                      <span className="material-symbols-outlined text-[18px] text-purple-600">beach_access</span>
                    </div>
                    <div className="my-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-slate-900">{casualLeave.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">/ 14 Days</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(casualLeave / 14) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-emerald-600 font-bold">Available</span>
                      <button
                        type="button"
                        onClick={() => handleOpenLeaveModal('Casual Leave')}
                        className="text-xs text-purple-700 hover:underline font-bold cursor-pointer"
                      >
                        Apply CL
                      </button>
                    </div>
                  </div>

                  {/* Sick Leave */}
                  <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">Sick Leave (SL)</span>
                      <span className="material-symbols-outlined text-[18px] text-orange-600">medical_services</span>
                    </div>
                    <div className="my-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-slate-900">{sickLeave.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">/ 8 Days</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(sickLeave / 8) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-emerald-600 font-bold">Healthy Balance</span>
                      <button
                        type="button"
                        onClick={() => handleOpenLeaveModal('Sick Leave')}
                        className="text-xs text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                      >
                        Apply SL
                      </button>
                    </div>
                  </div>

                  {/* Loss of Pay */}
                  <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">Loss of Pay (LOP)</span>
                      <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
                    </div>
                    <div className="my-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-slate-900">0</span>
                        <span className="text-xs text-slate-400">Days this Quarter</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        100% Attendance Rate
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks & Deliverables Widget */}
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm font-jakarta">Tasks & Deliverables</h2>
                    <p className="text-[11px] text-slate-400">Track your high-priority sprint issues</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Filter Tabs */}
                    <div className="flex items-center p-1 rounded-lg bg-slate-100">
                      <button
                        type="button"
                        onClick={() => setTaskFilter('today')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          taskFilter === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Today ({todayTasks.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskFilter('week')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          taskFilter === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        This Week (7)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskFilter('completed')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          taskFilter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Completed ({tasks.filter((t) => t.completed).length})
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAddTaskModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Add Task</span>
                    </button>
                  </div>
                </div>

                {/* Task Items */}
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                          className="mt-1 h-4 w-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs font-bold transition-all ${
                                task.completed ? 'line-through text-slate-400 opacity-60' : 'text-slate-900'
                              }`}
                            >
                              {task.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${task.tagClass}`}>
                              {task.tag}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                              {task.project}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 flex-wrap">
                            <span
                              className={`flex items-center gap-1 ${
                                task.tag.includes('High') ? 'text-red-600 font-semibold' : ''
                              }`}
                            >
                              <span className="material-symbols-outlined text-[15px]">{task.dueIcon}</span>
                              <span>{task.due}</span>
                            </span>
                            <span>•</span>
                            <span className="truncate">{task.meta}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        {task.actions.map((act) => (
                          <button
                            key={act}
                            type="button"
                            onClick={() => handleTaskAction(task.id, act)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              act === 'Submit'
                                ? 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs'
                                : 'bg-white text-slate-700 hover:bg-slate-200 shadow-xs border border-slate-200'
                            }`}
                          >
                            {act}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => showToast('Loading full task repository (22 items)...', 'info')}
                    className="text-xs text-purple-700 hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Tasks (22 active)</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Wellness Check-In & Pulse Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Wellness Check-in (5 cols) */}
                <div className="md:col-span-5 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-xs">Daily Wellness</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px]">Confidential</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">How are you feeling today, Alex?</p>

                    {/* Mood Chips */}
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { name: 'Tough', emoji: '🌧️' },
                        { name: 'Tired', emoji: '🥱' },
                        { name: 'Okay', emoji: '⛅' },
                        { name: 'Good', emoji: '😊' },
                        { name: 'Great', emoji: '🚀' },
                      ].map((item) => {
                        const isActive = selectedMood === item.name;
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => {
                              setSelectedMood(item.name);
                              showToast(`Wellness logged: ${item.name}`, 'info');
                            }}
                            className={`flex flex-col items-center p-2 rounded-xl text-center cursor-pointer transition-all ${
                              isActive
                                ? 'bg-purple-700 text-white font-bold shadow-md shadow-purple-600/30 ring-2 ring-purple-600/40'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="text-xl">{item.emoji}</span>
                            <span className={`text-[10px] mt-1 ${isActive ? 'text-white font-bold' : 'text-slate-500'}`}>
                              {item.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-semibold text-center">
                      {activeMoodMessages[selectedMood]}
                    </div>
                  </div>

                  <div className="mt-4 p-2.5 rounded-xl bg-slate-50 text-slate-500 text-[11px] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-purple-600">spa</span>
                    <span>Need support? Employee Assistance Program is 24/7.</span>
                  </div>
                </div>

                {/* Anonymous Pulse Feedback (7 cols) */}
                <div className="md:col-span-7 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-purple-600">record_voice_over</span>
                      <span className="font-bold text-slate-900 text-xs">Anonymous Pulse Feedback</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Direct to People Ops</span>
                  </div>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category</label>
                        <select
                          value={feedbackCategory}
                          onChange={(e) => setFeedbackCategory(e.target.value)}
                          className="w-full h-8 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none"
                        >
                          <option>Workplace & Culture</option>
                          <option>Management & Leadership</option>
                          <option>Tools & Technology</option>
                          <option>Facilities & Remote Setup</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Team Sentiment
                        </label>
                        <div
                          className="flex items-center gap-1 h-8 px-2 rounded-lg bg-slate-50 border border-slate-200 text-amber-500"
                          onMouseLeave={() => setHoverRating(null)}
                        >
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = (hoverRating !== null ? hoverRating : sentimentRating) >= star;
                            return (
                              <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onClick={() => {
                                  setSentimentRating(star);
                                  showToast(`Sentiment rating selected: ${star} out of 5 stars`, 'info');
                                }}
                                className="cursor-pointer transition-transform hover:scale-110"
                              >
                                <span
                                  className={`material-symbols-outlined text-[18px] ${
                                    isFilled ? 'text-amber-500' : 'text-slate-300'
                                  }`}
                                  style={{ fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0" }}
                                >
                                  star
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <textarea
                      required
                      rows={2}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Share anonymous thoughts or feedback with leadership..."
                      className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-600 resize-none"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-500">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                        />
                        <span>Keep strictly anonymous</span>
                      </label>
                      <button
                        type="submit"
                        disabled={isFeedbackSubmitting}
                        className="px-4 py-1.5 rounded-lg bg-[#131b2e] text-white text-xs font-semibold hover:bg-slate-900 transition-colors cursor-pointer shadow-xs"
                      >
                        {isFeedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* RIGHT 4 COLUMNS: Standups, Community Calendar, and Docked MHK AI Copilot */}
            <div className="xl:col-span-4 space-y-6 min-w-0">
              {/* Reports & Standups */}
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm font-jakarta">Reports & Standups</span>
                  <span className="material-symbols-outlined text-[18px] text-purple-600">assignment</span>
                </div>

                {/* Daily Standup Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Daily Standup Update</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                      Pending for today
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Engineering Sync scheduled for 11:30 AM IST. Please record tasks.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenReportModal('standup')}
                    className="w-full py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold shadow-xs border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-purple-600">mic</span>
                    <span>Compose Update with AI</span>
                  </button>
                </div>

                {/* Weekly Summary Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Week 43 Summary</span>
                    <span className="text-[10px] text-slate-400">Due in 2 days</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-xs">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    <span>18 commits, 4 PR reviews aggregated</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenReportModal('weekly')}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span>Generate AI Report</span>
                  </button>
                </div>
              </div>

              {/* Community & Calendar */}
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm font-jakarta">Community & Calendar</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    October / November
                  </span>
                </div>

                {/* Upcoming Birthdays */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Upcoming Birthdays
                  </span>
                  <div
                    onClick={() => showToast('Wished Sarah Jenkins an early Happy Birthday! 🎂', 'success')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        className="w-8 h-8 rounded-full object-cover"
                        alt="Sarah Jenkins"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAQRyB1h2sXkk3Lxj0EAhvP2u7ZqYGtf5POslyw4kearfPBjf9TmWTgMqSyqaMoV6JtFMpRQB-AGZ_mji1i5XspdSdHQ0cbEb5z6a0UAfPyGm-m0bD_DRIy-MWfrtcJsFptoM5gdYAah9Rwq5CGVbEmlepQoCT8OcYkovdpZVuSoCuLnGYtlrOrWOdSF9h7VEJfRH2YnrHEL0JkcbbZCb0b3vztW4JOxrfG4fguhHFhn5KWuvUOXT7Sw"
                      />
                      <div>
                        <div className="font-bold text-slate-800 text-xs">Sarah Jenkins</div>
                        <div className="text-[10px] text-slate-400">Product Designer</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-semibold">
                      Tomorrow 🎂
                    </span>
                  </div>

                  <div
                    onClick={() => showToast("Vikram Patel's birthday is on Oct 28", 'info')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        className="w-8 h-8 rounded-full object-cover"
                        alt="Vikram Patel"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLW5A5gcG3WTbzPffBmPwMPs0fSbwIQ4aH8KYbiwAVjVzzxmX0jpjCSI41ExP1H6xChAQ6djiELQ4rWF-e0YgECQ1cloeg--Vf9DADljcXFMkVDb13O9EWK-e3UJJaD5VCQx2FALoWuYrwez3vv5uzYMHTA0xZfHh9MyUSfFBaIhphvpDiid6erA5u5rAoc43dNFafL6kOmIQGcTzgJRPHjxX4gy_Q3C4ymdl4B0Zz0ilO0_lhSpt5Dg"
                      />
                      <div>
                        <div className="font-bold text-slate-800 text-xs">Vikram Patel</div>
                        <div className="text-[10px] text-slate-400">Engineering Lead</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px]">Oct 28</span>
                  </div>
                </div>

                {/* Company Holidays */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Company Holidays
                  </span>
                  <div
                    onClick={() => showToast('Diwali Festival Break: 3-day company holiday scheduled', 'info')}
                    className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-base">
                        🪔
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xs">Diwali Festival Break</div>
                        <div className="text-[10px] text-slate-500">All India Hubs</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-orange-700 font-bold block">Nov 1</span>
                      <span className="text-[9px] text-slate-400">Mandatory</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DOCKED ASK MHK COPILOT */}
              <div
                id="copilot-widget"
                className="rounded-2xl bg-gradient-to-br from-[#131b2e] via-slate-900 to-indigo-950 p-5 text-white shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[16px]">spark</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs font-jakarta leading-tight">Ask MHK Copilot</h3>
                    <span className="text-[10px] text-purple-300 leading-tight">HR & Workflow AI Assistant</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 mb-3">
                  Instant answers to leave balances, policy clauses, and workflow drafts.
                </p>

                {/* Chat message stream */}
                {copilotMessages.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto mb-3 pr-1 text-xs">
                    {copilotMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl max-w-[90%] leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-purple-900/60 border border-purple-700/50 text-purple-100 self-end ml-auto'
                            : 'bg-slate-800/80 border border-slate-700 text-slate-200 self-start mr-auto'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-purple-300 mb-1">
                            <span className="material-symbols-outlined text-[13px]">spark</span>
                            <span>MHK Copilot</span>
                          </div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                <div className="space-y-1.5 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCopilotInput('What is my remaining CL balance?');
                      if (copilotInputRef.current) copilotInputRef.current.focus();
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-[11px] transition-colors flex items-center justify-between cursor-pointer border border-slate-700/50"
                  >
                    <span className="truncate">"What is my remaining CL balance?"</span>
                    <span className="material-symbols-outlined text-[14px] text-purple-400">arrow_forward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCopilotInput('Draft my daily engineering report');
                      if (copilotInputRef.current) copilotInputRef.current.focus();
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-[11px] transition-colors flex items-center justify-between cursor-pointer border border-slate-700/50"
                  >
                    <span className="truncate">"Draft my daily engineering report"</span>
                    <span className="material-symbols-outlined text-[14px] text-purple-400">arrow_forward</span>
                  </button>
                </div>

                {/* Input Field */}
                <div className="relative flex items-center">
                  <input
                    ref={copilotInputRef}
                    type="text"
                    value={copilotInput}
                    onChange={(e) => setCopilotInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendCopilot();
                    }}
                    placeholder="Type prompt or question..."
                    className="w-full h-9 pl-3 pr-9 rounded-lg bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendCopilot}
                    className="absolute right-1 w-7 h-7 rounded-md bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[15px]">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
