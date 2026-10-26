/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ScreenId, DemoRoleKey } from './types';
import { ToastProvider, useToast } from './components/Toast';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { SignInScreen } from './screens/SignInScreen';
import { EmployeePortalScreen } from './screens/EmployeePortalScreen';
import { HROperationsScreen } from './screens/HROperationsScreen';
import { GovernanceScreen } from './screens/GovernanceScreen';
import { CompanyFeedModal } from './components/CompanyFeedModal';
import { DirectoryModal } from './components/DirectoryModal';
import { DocumentsModal } from './components/DocumentsModal';
import { MyRequestsModal } from './components/MyRequestsModal';
import { ExpenseTimesheetModal } from './components/ExpenseTimesheetModal';
import { AuditFeedModal } from './components/AuditFeedModal';
import { HolidayCalendarModal } from './components/HolidayCalendarModal';
import {
  INITIAL_COMPANY_POSTS,
  INITIAL_DIRECTORY,
  INITIAL_DOCUMENTS,
  INITIAL_USER_REQUESTS,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('sign-in');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const copilotFocusRef = useRef<(() => void) | null>(null);
  const { showToast } = useToast();

  // Central Modal State
  const [isCompanyFeedOpen, setIsCompanyFeedOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isMyRequestsOpen, setIsMyRequestsOpen] = useState(false);
  const [isExpenseTimesheetOpen, setIsExpenseTimesheetOpen] = useState(false);
  const [isAuditFeedOpen, setIsAuditFeedOpen] = useState(false);
  const [isHolidayCalendarOpen, setIsHolidayCalendarOpen] = useState(false);
  const [autoOpenLeaveModal, setAutoOpenLeaveModal] = useState(false);

  // Dynamic shared datasets
  const [companyPosts] = useState(INITIAL_COMPANY_POSTS);
  const [userRequests] = useState(INITIAL_USER_REQUESTS);

  const handleSignIn = (targetScreen: ScreenId, _roleKey: DemoRoleKey) => {
    setCurrentScreen(targetScreen);
  };

  const handleCommandAction = (actionName: string) => {
    if (actionName === 'apply-leave') {
      setCurrentScreen('employee-portal');
      setAutoOpenLeaveModal(true);
      showToast('Switched to Employee Portal: Apply Leave modal opened', 'info');
    } else if (actionName === 'toggle-clock') {
      setCurrentScreen('employee-portal');
      showToast('Session status toggled on Employee Portal', 'success');
    } else if (actionName === 'i9-verify') {
      setCurrentScreen('hr-command');
      showToast('Navigated to HR Operations: I-9 review active in queue', 'info');
    } else if (actionName === 'export-audit') {
      setIsAuditFeedOpen(true);
    } else if (actionName === 'publish-handbook') {
      setCurrentScreen('governance');
      showToast('Navigated to Governance Command: Handbook v2.4 staged', 'info');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-100/90 text-slate-900">
      {/* Global Command Palette / Search Modal (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          setIsCommandPaletteOpen(false);
        }}
        onAction={handleCommandAction}
      />

      {/* Enterprise Interactive Modals */}
      <CompanyFeedModal
        isOpen={isCompanyFeedOpen}
        onClose={() => setIsCompanyFeedOpen(false)}
        posts={companyPosts}
      />

      <DirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        employees={INITIAL_DIRECTORY}
      />

      <DocumentsModal
        isOpen={isDocumentsOpen}
        onClose={() => setIsDocumentsOpen(false)}
        documents={INITIAL_DOCUMENTS}
      />

      <MyRequestsModal
        isOpen={isMyRequestsOpen}
        onClose={() => setIsMyRequestsOpen(false)}
        requests={userRequests}
        onOpenNewLeave={() => {
          setIsMyRequestsOpen(false);
          setCurrentScreen('employee-portal');
          setAutoOpenLeaveModal(true);
          showToast('Redirected to Apply Leave modal on Employee Portal', 'info');
        }}
        onOpenNewExpense={() => {
          setIsMyRequestsOpen(false);
          setIsExpenseTimesheetOpen(true);
        }}
      />

      <ExpenseTimesheetModal
        isOpen={isExpenseTimesheetOpen}
        onClose={() => setIsExpenseTimesheetOpen(false)}
      />

      <AuditFeedModal
        isOpen={isAuditFeedOpen}
        onClose={() => setIsAuditFeedOpen(false)}
        logs={INITIAL_AUDIT_LOGS}
      />

      <HolidayCalendarModal
        isOpen={isHolidayCalendarOpen}
        onClose={() => setIsHolidayCalendarOpen(false)}
      />

      {/* Persistent Enterprise Header for all Authenticated Dashboards */}
      {currentScreen !== 'sign-in' && (
        <Header
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onFocusCopilot={() => {
            if (currentScreen !== 'employee-portal') {
              setCurrentScreen('employee-portal');
              setTimeout(() => {
                if (copilotFocusRef.current) copilotFocusRef.current();
              }, 150);
            } else if (copilotFocusRef.current) {
              copilotFocusRef.current();
            }
          }}
        />
      )}

      {/* Screen Routing */}
      {currentScreen === 'sign-in' && <SignInScreen onSignIn={handleSignIn} />}

      {currentScreen === 'employee-portal' && (
        <EmployeePortalScreen
          onNavigate={(screen) => setCurrentScreen(screen)}
          copilotTriggerRef={copilotFocusRef}
          onOpenCompanyFeed={() => setIsCompanyFeedOpen(true)}
          onOpenDirectory={() => setIsDirectoryOpen(true)}
          onOpenDocuments={() => setIsDocumentsOpen(true)}
          onOpenMyRequests={() => setIsMyRequestsOpen(true)}
          onOpenExpensesTimesheets={() => setIsExpenseTimesheetOpen(true)}
          onOpenHolidayCalendar={() => setIsHolidayCalendarOpen(true)}
          autoOpenLeaveModal={autoOpenLeaveModal}
          onLeaveModalOpened={() => setAutoOpenLeaveModal(false)}
        />
      )}

      {currentScreen === 'hr-command' && (
        <HROperationsScreen
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenCompanyFeed={() => setIsCompanyFeedOpen(true)}
          onOpenDirectory={() => setIsDirectoryOpen(true)}
          onOpenDocuments={() => setIsDocumentsOpen(true)}
          onOpenExpensesTimesheets={() => setIsExpenseTimesheetOpen(true)}
          onOpenAuditFeed={() => setIsAuditFeedOpen(true)}
          onOpenHolidayCalendar={() => setIsHolidayCalendarOpen(true)}
        />
      )}

      {currentScreen === 'governance' && (
        <GovernanceScreen
          onNavigate={(screen) => setCurrentScreen(screen)}
          onOpenAuditFeed={() => setIsAuditFeedOpen(true)}
          onOpenDirectory={() => setIsDirectoryOpen(true)}
          onOpenDocuments={() => setIsDocumentsOpen(true)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
