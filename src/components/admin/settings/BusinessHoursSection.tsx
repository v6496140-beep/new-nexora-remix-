import React, { useState } from 'react';
import { BusinessScheduleConfig, DayOfWeek, BusinessDailyHours, TimeRange } from '../../../types/staffSchedule';
import { Clock, Plus, Trash2, Globe, Copy, Check, AlertCircle } from 'lucide-react';

const DAYS_OF_WEEK: { key: DayOfWeek; label: string }[] = [
  { key: 'MONDAY', label: 'Monday' },
  { key: 'TUESDAY', label: 'Tuesday' },
  { key: 'WEDNESDAY', label: 'Wednesday' },
  { key: 'THURSDAY', label: 'Thursday' },
  { key: 'FRIDAY', label: 'Friday' },
  { key: 'SATURDAY', label: 'Saturday' },
  { key: 'SUNDAY', label: 'Sunday' }
];

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST) — Asia/Kolkata (+05:30)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST) — Asia/Dubai (+04:00)' },
  { value: 'Asia/Singapore', label: 'Singapore Standard Time (SGT) — Asia/Singapore (+08:00)' },
  { value: 'Europe/London', label: 'British Time (GMT/BST) — Europe/London (+00:00/+01:00)' },
  { value: 'America/New_York', label: 'Eastern Time (ET) — America/New_York (-05:00/-04:00)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' }
];

export const BusinessHoursSection: React.FC<{
  hours: BusinessScheduleConfig;
  onChange: (updated: BusinessScheduleConfig) => void;
}> = ({ hours, onChange }) => {
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const updateTimezone = (timezone: string) => {
    onChange({
      ...hours,
      timezone
    });
  };

  const updateDay = (day: DayOfWeek, updates: Partial<BusinessDailyHours>) => {
    const current = hours.weeklyHours[day] || {
      isOpen: true,
      openingTime: '09:00',
      closingTime: '20:00',
      breaks: []
    };

    onChange({
      ...hours,
      weeklyHours: {
        ...hours.weeklyHours,
        [day]: {
          ...current,
          ...updates
        }
      }
    });
  };

  const addBreak = (day: DayOfWeek) => {
    const current = hours.weeklyHours[day];
    const newBreaks: TimeRange[] = [
      ...(current?.breaks || []),
      { startTime: '14:00', endTime: '14:30', label: 'Sanitization Break' }
    ];
    updateDay(day, { breaks: newBreaks });
  };

  const removeBreak = (day: DayOfWeek, index: number) => {
    const current = hours.weeklyHours[day];
    if (!current?.breaks) return;
    const newBreaks = current.breaks.filter((_, i) => i !== index);
    updateDay(day, { breaks: newBreaks });
  };

  const updateBreakField = (day: DayOfWeek, index: number, field: keyof TimeRange, value: string) => {
    const current = hours.weeklyHours[day];
    if (!current?.breaks) return;
    const newBreaks = [...current.breaks];
    newBreaks[index] = {
      ...newBreaks[index],
      [field]: value
    };
    updateDay(day, { breaks: newBreaks });
  };

  const copyWeekdayHoursToAll = (sourceDay: DayOfWeek = 'TUESDAY') => {
    const template = hours.weeklyHours[sourceDay] || {
      isOpen: true,
      openingTime: '09:00',
      closingTime: '20:00',
      breaks: []
    };

    const newWeeklyHours = { ...hours.weeklyHours };
    DAYS_OF_WEEK.forEach(({ key }) => {
      if (newWeeklyHours[key]?.isOpen) {
        newWeeklyHours[key] = {
          ...newWeeklyHours[key],
          openingTime: template.openingTime,
          closingTime: template.closingTime,
          breaks: JSON.parse(JSON.stringify(template.breaks || []))
        };
      }
    });

    onChange({
      ...hours,
      weeklyHours: newWeeklyHours
    });

    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Operating Hours & Weekly Schedule</h3>
              <p className="text-xs text-slate-500 font-medium">Controls online booking availability slots and appointment calendar boundaries</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => copyWeekdayHoursToAll('TUESDAY')}
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all self-start sm:self-auto"
            title="Copy Tuesday operating hours and breaks to all active days"
          >
            {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSuccess ? 'Hours Synchronized!' : 'Copy to All Days'}</span>
          </button>
        </div>

        {/* Timezone Selector */}
        <div className="space-y-1.5 max-w-md">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" /> Salon Timezone
          </label>
          <select
            value={hours.timezone || 'Asia/Kolkata'}
            onChange={(e) => updateTimezone(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
          >
            {TIMEZONE_OPTIONS.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Day-by-Day Schedule List */}
        <div className="space-y-3 pt-2">
          {DAYS_OF_WEEK.map(({ key, label }) => {
            const dayConfig = hours.weeklyHours[key] || {
              isOpen: false,
              openingTime: '09:00',
              closingTime: '20:00',
              breaks: []
            };

            return (
              <div
                key={key}
                className={`p-4 rounded-2xl border transition-all ${
                  dayConfig.isOpen
                    ? 'bg-white border-slate-200 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200/80 opacity-75'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Day Name & Toggle */}
                  <div className="flex items-center gap-3 w-40">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dayConfig.isOpen}
                        onChange={(e) => updateDay(key, { isOpen: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                    <span className="text-sm font-black text-slate-900">{label}</span>
                  </div>

                  {/* Hours or Closed Badge */}
                  {dayConfig.isOpen ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Opens</span>
                        <input
                          type="time"
                          value={dayConfig.openingTime}
                          onChange={(e) => updateDay(key, { openingTime: e.target.value })}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <span className="text-slate-400 font-bold">—</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Closes</span>
                        <input
                          type="time"
                          value={dayConfig.closingTime}
                          onChange={(e) => updateDay(key, { closingTime: e.target.value })}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                      Closed / Holiday
                    </span>
                  )}

                  {/* Add Break Action */}
                  {dayConfig.isOpen && (
                    <button
                      type="button"
                      onClick={() => addBreak(key)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Break
                    </button>
                  )}
                </div>

                {/* Breaks Sub-Section */}
                {dayConfig.isOpen && dayConfig.breaks && dayConfig.breaks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Scheduled Daily Breaks & Cleaning Windows
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {dayConfig.breaks.map((brk, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs"
                        >
                          <input
                            type="text"
                            value={brk.label || 'Break'}
                            onChange={(e) => updateBreakField(key, idx, 'label', e.target.value)}
                            placeholder="Break Label"
                            className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800 outline-none"
                          />
                          <input
                            type="time"
                            value={brk.startTime}
                            onChange={(e) => updateBreakField(key, idx, 'startTime', e.target.value)}
                            className="px-1.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono font-bold outline-none"
                          />
                          <span className="text-slate-400">-</span>
                          <input
                            type="time"
                            value={brk.endTime}
                            onChange={(e) => updateBreakField(key, idx, 'endTime', e.target.value)}
                            className="px-1.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono font-bold outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeBreak(key, idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-all"
                            title="Remove break"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
