import React, { useState } from 'react';
import { useToast } from './Toast';

interface ExpenseTimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'expense' | 'timesheet';
}

interface ExpenseClaim {
  id: string;
  title: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  status: 'Approved' | 'Pending Approval' | 'Processing';
}

export const ExpenseTimesheetModal: React.FC<ExpenseTimesheetModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'expense',
}) => {
  const { showToast } = useToast();
  const [tab, setTab] = useState<'expense' | 'timesheet'>(defaultTab);

  // Expense form
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Travel & Transit');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCurrency, setExpenseCurrency] = useState('USD');
  const [receiptAttached, setReceiptAttached] = useState(false);
  const [receiptFileName, setReceiptFileName] = useState('');

  // Claims History
  const [claims, setClaims] = useState<ExpenseClaim[]>([
    {
      id: 'exp-1',
      title: 'Client Lunch with Texas Enterprise Team',
      category: 'Client Meals & Entertainment',
      amount: 84.5,
      currency: 'USD',
      date: 'Oct 21, 2026',
      status: 'Approved',
    },
    {
      id: 'exp-2',
      title: 'AWS Certified Solutions Architect Exam Fee',
      category: 'Software Licensure & Cloud Certs',
      amount: 150.0,
      currency: 'USD',
      date: 'Oct 14, 2026',
      status: 'Approved',
    },
  ]);

  // Timesheet form
  const [clientProject, setClientProject] = useState('Project Falcon (Apex Logistics)');
  const [hoursMon, setHoursMon] = useState('8.0');
  const [hoursTue, setHoursTue] = useState('8.5');
  const [hoursWed, setHoursWed] = useState('9.5');
  const [hoursThu, setHoursThu] = useState('8.0');
  const [hoursFri, setHoursFri] = useState('8.0');
  const [timesheetNotes, setTimesheetNotes] = useState('Completed Sprint 43 code reviews, OAuth2 token rotation, and Texas HQ latency audits.');

  if (!isOpen) return null;

  const totalHours =
    (parseFloat(hoursMon) || 0) +
    (parseFloat(hoursTue) || 0) +
    (parseFloat(hoursWed) || 0) +
    (parseFloat(hoursThu) || 0) +
    (parseFloat(hoursFri) || 0);

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) return;

    const newClaim: ExpenseClaim = {
      id: `exp-${Date.now()}`,
      title: expenseTitle.trim(),
      category: expenseCategory,
      amount: parseFloat(expenseAmount) || 0,
      currency: expenseCurrency,
      date: 'Today',
      status: 'Pending Approval',
    };

    setClaims([newClaim, ...claims]);
    showToast(
      `Expense claim "${expenseTitle}" for ${expenseCurrency} ${expenseAmount} submitted to Priya Sharma (People Ops) for review.`,
      'success',
      'Expense Logged'
    );
    setExpenseTitle('');
    setExpenseAmount('');
    setReceiptAttached(false);
    setReceiptFileName('');
  };

  const handleTimesheetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      `Weekly timesheet for ${clientProject} (${totalHours.toFixed(1)} hrs total) signed and dispatched for client sign-off.`,
      'success',
      'Timesheet Submitted'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">
                {tab === 'expense' ? 'receipt_long' : 'more_time'}
              </span>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Expenses &amp; Timesheets</h2>
              <p className="text-xs text-slate-400">File client disbursements and log billable project hours</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 text-xs font-semibold bg-white">
          <button
            type="button"
            onClick={() => setTab('expense')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer ${
              tab === 'expense' ? 'border-purple-700 text-purple-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Expense Claims ({claims.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('timesheet')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer ${
              tab === 'timesheet' ? 'border-purple-700 text-purple-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Weekly Timesheet Log ({totalHours.toFixed(1)} hrs)
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto flex-1">
          {tab === 'expense' ? (
            <div className="p-5 space-y-4 text-xs">
              <form onSubmit={handleExpenseSubmit} className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                  + New Expense Claim
                </span>

                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Expense Title</label>
                  <input
                    type="text"
                    required
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    placeholder="e.g. Client Dinner with Texas Logistics Team or AWS Certification"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Category</label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
                    >
                      <option>Travel &amp; Transit</option>
                      <option>Client Meals &amp; Entertainment</option>
                      <option>Software Licensure &amp; Cloud Certs</option>
                      <option>Hardware &amp; Peripherals</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Amount</label>
                    <div className="flex">
                      <select
                        value={expenseCurrency}
                        onChange={(e) => setExpenseCurrency(e.target.value)}
                        className="w-16 h-9 px-1 rounded-l-lg border border-r-0 border-slate-200 bg-slate-100 font-mono text-slate-700 focus:outline-none font-bold"
                      >
                        <option value="USD">USD</option>
                        <option value="INR">INR</option>
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-9 px-3 rounded-r-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Receipt Upload Simulator */}
                <div>
                  <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Tax Receipt / Invoice</label>
                  <div
                    onClick={() => {
                      setReceiptAttached(true);
                      setReceiptFileName('Receipt_Config2026_Tax_Invoice.pdf');
                      showToast('Receipt attached and parsed via OCR: Tax ID verified.', 'success');
                    }}
                    className={`p-3 rounded-xl border-2 border-dashed transition-colors flex items-center justify-between cursor-pointer ${
                      receiptAttached
                        ? 'border-emerald-400 bg-emerald-50/60 text-emerald-900'
                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-purple-700">
                        {receiptAttached ? 'task' : 'cloud_upload'}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800 text-xs">
                          {receiptAttached ? receiptFileName : 'Attach PDF receipt or receipt image'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {receiptAttached ? '1.4 MB • SHA256 Verified' : 'Max 25MB • Automated OCR extraction'}
                        </div>
                      </div>
                    </div>
                    {receiptAttached && (
                      <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span> Attached
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-xs cursor-pointer"
                  >
                    + Submit Claim
                  </button>
                </div>
              </form>

              {/* Claims History */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                  Recent Expense Claims
                </span>
                <div className="space-y-2">
                  {claims.map((claim) => (
                    <div
                      key={claim.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{claim.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {claim.category} • {claim.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 text-xs block">
                          {claim.currency} {claim.amount.toFixed(2)}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            claim.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {claim.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleTimesheetSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Client &amp; Project</label>
                <select
                  value={clientProject}
                  onChange={(e) => setClientProject(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
                >
                  <option>Project Falcon (Apex Logistics)</option>
                  <option>Core Platform Modernization</option>
                  <option>HRMS Portal v2.0</option>
                  <option>Texas Cloud Migration Lead</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-600 uppercase text-[10px]">
                    Daily Billable Hours (Week 43)
                  </label>
                  <span className="text-[10px] text-slate-400">Regular: 40h max</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {[
                    { label: 'Mon 20', val: hoursMon, set: setHoursMon },
                    { label: 'Tue 21', val: hoursTue, set: setHoursTue },
                    { label: 'Wed 22', val: hoursWed, set: setHoursWed },
                    { label: 'Thu 23', val: hoursThu, set: setHoursThu },
                    { label: 'Fri 24', val: hoursFri, set: setHoursFri },
                  ].map((d) => (
                    <div key={d.label} className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">{d.label}</span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="16"
                        value={d.val}
                        onChange={(e) => d.set(e.target.value)}
                        className="w-full h-8 text-center rounded-lg border border-slate-200 bg-white font-mono font-bold text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase text-[10px] mb-1">Deliverables &amp; Activity Log</label>
                <textarea
                  rows={2}
                  value={timesheetNotes}
                  onChange={(e) => setTimesheetNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 resize-none"
                  placeholder="Summary of work completed..."
                />
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  totalHours > 40
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-purple-50 border border-purple-100 text-purple-900'
                }`}
              >
                <div>
                  <span className="font-semibold block">Total Week 43 Hours:</span>
                  <span className="text-[10px] opacity-80">
                    {totalHours > 40 ? `${(totalHours - 40).toFixed(1)} hrs overtime logged` : 'Standard billable week'}
                  </span>
                </div>
                <span className="font-mono text-lg font-extrabold text-purple-700">{totalHours.toFixed(1)} hrs</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Sign Off &amp; Submit Timesheet
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
