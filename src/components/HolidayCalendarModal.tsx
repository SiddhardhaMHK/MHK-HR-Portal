import React, { useState } from 'react';
import { useToast } from './Toast';

interface HolidayCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Holiday {
  id: string;
  date: string;
  day: string;
  title: string;
  location: 'Global (All Hubs)' | 'Hyderabad Hub (India)' | 'Texas HQ (US)';
  badgeClass: string;
  category: 'National' | 'Festival' | 'Company Rest Day';
  isoDate: string;
}

const HOLIDAYS: Holiday[] = [
  {
    id: 'h-1',
    date: 'Nov 01, 2026',
    day: 'Sunday',
    title: 'Diwali (Deepavali) - Festival of Lights',
    location: 'Hyderabad Hub (India)',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    category: 'Festival',
    isoDate: '20261101',
  },
  {
    id: 'h-2',
    date: 'Nov 02, 2026',
    day: 'Monday',
    title: 'Diwali Govardhan Puja Observance',
    location: 'Hyderabad Hub (India)',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    category: 'Festival',
    isoDate: '20261102',
  },
  {
    id: 'h-3',
    date: 'Nov 03, 2026',
    day: 'Tuesday',
    title: 'Bhai Dooj Holiday',
    location: 'Hyderabad Hub (India)',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    category: 'Festival',
    isoDate: '20261103',
  },
  {
    id: 'h-4',
    date: 'Nov 26, 2026',
    day: 'Thursday',
    title: 'Thanksgiving Day',
    location: 'Texas HQ (US)',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    category: 'National',
    isoDate: '20261126',
  },
  {
    id: 'h-5',
    date: 'Nov 27, 2026',
    day: 'Friday',
    title: 'Day After Thanksgiving / Black Friday',
    location: 'Texas HQ (US)',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    category: 'Company Rest Day',
    isoDate: '20261127',
  },
  {
    id: 'h-6',
    date: 'Dec 25, 2026',
    day: 'Friday',
    title: 'Christmas Day',
    location: 'Global (All Hubs)',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    category: 'Festival',
    isoDate: '20261225',
  },
  {
    id: 'h-7',
    date: 'Jan 01, 2027',
    day: 'Friday',
    title: "New Year's Day",
    location: 'Global (All Hubs)',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    category: 'Company Rest Day',
    isoDate: '20270101',
  },
  {
    id: 'h-8',
    date: 'Jan 26, 2027',
    day: 'Tuesday',
    title: 'Republic Day of India',
    location: 'Hyderabad Hub (India)',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
    category: 'National',
    isoDate: '20270126',
  },
];

export const HolidayCalendarModal: React.FC<HolidayCalendarModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [hubFilter, setHubFilter] = useState<'All' | 'India' | 'US'>('All');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredHolidays = HOLIDAYS.filter((h) => {
    const matchSearch =
      h.title.toLowerCase().includes(search.toLowerCase()) ||
      h.date.toLowerCase().includes(search.toLowerCase()) ||
      h.category.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (hubFilter === 'All') return true;
    if (hubFilter === 'India') return h.location.includes('Hyderabad') || h.location.includes('Global');
    if (hubFilter === 'US') return h.location.includes('Texas') || h.location.includes('Global');
    return true;
  });

  const handleDownloadIcs = () => {
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MHK Software Private Limited//Enterprise Calendar//EN\nCALSCALE:GREGORIAN\n`;
    filteredHolidays.forEach((h) => {
      icsContent += `BEGIN:VEVENT\nSUMMARY:${h.title}\nDTSTART;VALUE=DATE:${h.isoDate}\nLOCATION:${h.location}\nDESCRIPTION:Official MHK Corporate Holiday (${h.category})\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });
    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `mhk-holidays-${hubFilter.toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded mhk-holidays-${hubFilter.toLowerCase()}.ics calendar file!`, 'success', 'Calendar Exported');
  };

  const handleAddSingleToCalendar = (holiday: Holiday) => {
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      holiday.title
    )}&dates=${holiday.isoDate}/${holiday.isoDate}&details=${encodeURIComponent(
      `Official Holiday for ${holiday.location} - MHK Software Private Limited`
    )}&location=${encodeURIComponent(holiday.location)}`;
    window.open(googleCalendarUrl, '_blank');
    showToast(`Opening Google Calendar for "${holiday.title}"`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-jakarta">Global Holiday Calendar 2026-2027</h2>
              <p className="text-xs text-slate-500">Official recognized paid closures for Hyderabad Hub and Texas HQ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {(['All', 'India', 'US'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setHubFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  hubFilter === filter
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter === 'All' ? 'All Hubs' : filter === 'India' ? '🇮🇳 Hyderabad Hub' : '🇺🇸 Texas HQ'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[16px]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search holidays..."
                className="h-8 pl-8 pr-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600 w-36 sm:w-44"
              />
            </div>
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              title="Download standard iCal calendar file"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span className="hidden sm:inline">Export .ics</span>
            </button>
          </div>
        </div>

        {/* Holiday list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredHolidays.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">No holidays match your search filter.</div>
          ) : (
            filteredHolidays.map((holiday) => (
              <div
                key={holiday.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 text-center shrink-0 py-1 px-1.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <span className="block text-[10px] uppercase font-bold text-purple-700">
                      {holiday.date.split(' ')[0]}
                    </span>
                    <span className="block text-base font-extrabold text-slate-900 leading-none">
                      {holiday.date.split(' ')[1].replace(',', '')}
                    </span>
                    <span className="block text-[9px] text-slate-400 font-mono mt-0.5">{holiday.day.substring(0, 3)}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{holiday.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-purple-600">location_on</span>
                        <span>{holiday.location}</span>
                      </span>
                      <span>•</span>
                      <span className="font-medium text-slate-600">{holiday.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleAddSingleToCalendar(holiday)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-colors text-slate-500 cursor-pointer"
                    title="Add to Google Calendar"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                  </button>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${holiday.badgeClass}`}>
                    Confirmed
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Dual-hub floating optional holidays available under HR Policy Sec 4.2</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#131b2e] hover:bg-slate-900 text-white font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
