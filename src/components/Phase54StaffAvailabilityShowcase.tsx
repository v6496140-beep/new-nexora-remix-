import React, { useState, useEffect } from 'react';
import {
  CalendarRange,
  Clock,
  Calendar,
  Coffee,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Building2,
  Users,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Scissors,
  Award,
  Sparkle,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Briefcase,
  AlertCircle,
  CheckSquare,
  Globe,
  Info
} from 'lucide-react';

import { StaffScheduleService } from '../services/staffScheduleService';
import { StaffManagementService } from '../services/staffManagementService';
import {
  DayOfWeek,
  StaffDailySchedule,
  StaffLeaveRecord,
  BusinessHoliday,
  TimeRange,
  AvailabilityCheckResult
} from '../types/staffSchedule';
import { StaffProfileEntity } from '../types/staffManagement';
import { BookingEntity } from '../types/bookingEngine';
import { SEEDED_BOOKINGS } from '../data/seededBookings';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

const DAYS_OF_WEEK: { id: DayOfWeek; label: string }[] = [
  { id: 'MONDAY', label: 'Monday' },
  { id: 'TUESDAY', label: 'Tuesday' },
  { id: 'WEDNESDAY', label: 'Wednesday' },
  { id: 'THURSDAY', label: 'Thursday' },
  { id: 'FRIDAY', label: 'Friday' },
  { id: 'SATURDAY', label: 'Saturday' },
  { id: 'SUNDAY', label: 'Sunday' }
];

export function Phase54StaffAvailabilityShowcase() {
  const [scheduleService] = useState(() => new StaffScheduleService());
  const [staffService] = useState(() => new StaffManagementService());

  // Business Tenant Context
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // Selected Staff Member Context
  const [selectedStaffId, setSelectedStaffId] = useState<string>('stf-rc-01');

  // Preview Date for Availability Evaluator
  const [previewDate, setPreviewDate] = useState<string>('2026-10-20');

  // Active Tab View in Showcase
  const [activeTab, setActiveTab] = useState<'schedule' | 'leaves' | 'holidays' | 'preview'>('schedule');

  // Conflict Warning State
  const [conflictWarning, setConflictWarning] = useState<{
    day: DayOfWeek;
    affectedBookings: BookingEntity[];
  } | null>(null);

  // Success Feedback Message
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Leave Form Modal State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveIsPartialDay, setLeaveIsPartialDay] = useState(false);
  const [leaveStartDate, setLeaveStartDate] = useState('2026-10-25');
  const [leaveEndDate, setLeaveEndDate] = useState('2026-10-25');
  const [leaveStartTime, setLeaveStartTime] = useState('14:00');
  const [leaveEndTime, setLeaveEndTime] = useState('17:00');
  const [leaveType, setLeaveType] = useState<StaffLeaveRecord['leaveType']>('VACATION');
  const [leaveReason, setLeaveReason] = useState('');

  // Business Holiday Form State
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [holidayDate, setHolidayDate] = useState('2026-11-01');
  const [holidayName, setHolidayName] = useState('Diwali Celebration');

  // Break Addition Modal State
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [breakTargetDay, setBreakTargetDay] = useState<DayOfWeek>('TUESDAY');
  const [breakStartTime, setBreakStartTime] = useState('13:00');
  const [breakEndTime, setBreakEndTime] = useState('14:00');
  const [breakLabel, setBreakLabel] = useState('Lunch Break');

  // Mobile Accordion open days
  const [openDays, setOpenDays] = useState<Record<DayOfWeek, boolean>>({
    MONDAY: false,
    TUESDAY: true,
    WEDNESDAY: false,
    THURSDAY: false,
    FRIDAY: false,
    SATURDAY: false,
    SUNDAY: false
  });

  // Automated Test Suite Execution State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Current Staff Profile & Schedule Config
  const businessStaff = staffService.listStaffForBusiness(currentBusinessId);

  // Sync staff selection when switching business context
  useEffect(() => {
    if (businessStaff.length > 0) {
      if (!selectedStaffId || !businessStaff.some((s) => s.id === selectedStaffId)) {
        setSelectedStaffId(businessStaff[0].id);
      }
    }
  }, [currentBusinessId]);

  const activeStaff: StaffProfileEntity | null = selectedStaffId
    ? staffService.getStaffById(selectedStaffId, currentBusinessId)
    : null;

  const staffScheduleConfig = selectedStaffId
    ? scheduleService.getStaffSchedule(selectedStaffId)
    : null;

  const businessScheduleConfig = scheduleService.getBusinessSchedule(currentBusinessId);

  const staffLeaves = selectedStaffId
    ? scheduleService.listStaffLeaves(selectedStaffId)
    : [];

  const businessHolidays = businessScheduleConfig?.holidays || [];

  // Handlers
  const handleTenantChange = (bizId: string) => {
    setCurrentBusinessId(bizId);
    setConflictWarning(null);
  };

  const toggleDayAccordion = (day: DayOfWeek) => {
    setOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleUpdateDayWorking = (day: DayOfWeek, isWorking: boolean) => {
    if (!selectedStaffId || !staffScheduleConfig) return;

    const currentDayConfig = staffScheduleConfig.weeklySchedule[day];
    const updatedConfig: StaffDailySchedule = {
      ...currentDayConfig,
      dayOfWeek: day,
      isWorking
    };

    // Check conflict with existing active bookings
    const conflicts = checkForBookingConflicts(selectedStaffId, day, updatedConfig);
    if (conflicts.length > 0) {
      setConflictWarning({ day, affectedBookings: conflicts });
    } else {
      setConflictWarning(null);
    }

    scheduleService.updateStaffDailySchedule(selectedStaffId, day, updatedConfig);
    showTempSuccess(`Updated ${day} working status`);
  };

  const handleUpdateDayTimes = (day: DayOfWeek, startTime: string, endTime: string) => {
    if (!selectedStaffId || !staffScheduleConfig) return;

    const currentDayConfig = staffScheduleConfig.weeklySchedule[day];
    const updatedConfig: StaffDailySchedule = {
      ...currentDayConfig,
      dayOfWeek: day,
      startTime,
      endTime
    };

    const conflicts = checkForBookingConflicts(selectedStaffId, day, updatedConfig);
    if (conflicts.length > 0) {
      setConflictWarning({ day, affectedBookings: conflicts });
    } else {
      setConflictWarning(null);
    }

    scheduleService.updateStaffDailySchedule(selectedStaffId, day, updatedConfig);
    showTempSuccess(`Updated ${day} hours (${startTime} - ${endTime})`);
  };

  const handleAddBreak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId || !staffScheduleConfig) return;

    const currentDayConfig = staffScheduleConfig.weeklySchedule[breakTargetDay];
    const newBreaks: TimeRange[] = [
      ...(currentDayConfig.breaks || []),
      { startTime: breakStartTime, endTime: breakEndTime, label: breakLabel }
    ];

    const updatedConfig: StaffDailySchedule = {
      ...currentDayConfig,
      breaks: newBreaks
    };

    scheduleService.updateStaffDailySchedule(selectedStaffId, breakTargetDay, updatedConfig);
    setIsBreakModalOpen(false);
    showTempSuccess(`Added break to ${breakTargetDay}`);
  };

  const handleRemoveBreak = (day: DayOfWeek, index: number) => {
    if (!selectedStaffId || !staffScheduleConfig) return;

    const currentDayConfig = staffScheduleConfig.weeklySchedule[day];
    const newBreaks = (currentDayConfig.breaks || []).filter((_, i) => i !== index);

    const updatedConfig: StaffDailySchedule = {
      ...currentDayConfig,
      breaks: newBreaks
    };

    scheduleService.updateStaffDailySchedule(selectedStaffId, day, updatedConfig);
    showTempSuccess(`Removed break from ${day}`);
  };

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;

    scheduleService.createStaffLeave({
      staffId: selectedStaffId,
      businessId: currentBusinessId,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      startTime: leaveIsPartialDay ? leaveStartTime : undefined,
      endTime: leaveIsPartialDay ? leaveEndTime : undefined,
      leaveType,
      reason: leaveReason || 'Scheduled leave',
      status: 'APPROVED'
    });

    setIsLeaveModalOpen(false);
    showTempSuccess('Leave created and approved successfully');
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleService.addBusinessHoliday(currentBusinessId, {
      date: holidayDate,
      name: holidayName
    });
    setIsHolidayModalOpen(false);
    showTempSuccess(`Holiday '${holidayName}' added`);
  };

  const handleRemoveHoliday = (date: string) => {
    scheduleService.removeBusinessHoliday(currentBusinessId, date);
    showTempSuccess('Holiday removed');
  };

  const showTempSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Conflict Detection Engine against SEEDED_BOOKINGS
  const checkForBookingConflicts = (
    staffId: string,
    day: DayOfWeek,
    newSchedule: StaffDailySchedule
  ): BookingEntity[] => {
    const staffBookings = SEEDED_BOOKINGS.filter(
      (b) => b.businessId === currentBusinessId && b.staffId === staffId && b.status !== 'CANCELLED'
    );

    const affected: BookingEntity[] = [];

    for (const booking of staffBookings) {
      // Parse day of week from bookingDate YYYY-MM-DD
      const [y, m, d] = booking.bookingDate.split('-').map(Number);
      const dateObj = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
      const dayIndex = dateObj.getUTCDay();
      const days: DayOfWeek[] = [
        'SUNDAY',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY'
      ];
      const bookingDay = days[dayIndex];

      if (bookingDay !== day) continue;

      if (!newSchedule.isWorking) {
        affected.push(booking);
        continue;
      }

      // Check if booking falls outside new shift hours
      const bStartMin = parseMinutes(booking.startTime);
      const bEndMin = parseMinutes(booking.endTime);
      const shiftStartMin = parseMinutes(newSchedule.startTime);
      const shiftEndMin = parseMinutes(newSchedule.endTime);

      if (bStartMin < shiftStartMin || bEndMin > shiftEndMin) {
        affected.push(booking);
        continue;
      }

      // Check break overlap
      for (const brk of newSchedule.breaks || []) {
        const brkStartMin = parseMinutes(brk.startTime);
        const brkEndMin = parseMinutes(brk.endTime);
        if (Math.max(bStartMin, brkStartMin) < Math.min(bEndMin, brkEndMin)) {
          affected.push(booking);
          break;
        }
      }
    }

    return affected;
  };

  function parseMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  const handleRunTests = () => {
    setIsTesting(true);
    setTimeout(() => {
      const res = runFoundationTestSuite();
      setTestResults(res);
      setIsTesting(false);
    }, 400);
  };

  const businessNames: Record<string, string> = {
    'biz-barber-001': 'Royal Crown Barber',
    'biz-spa-002': 'Zenith Stone Spa',
    'biz-nail-003': 'Gloss & Chic Nail Bar',
    'biz-tattoo-004': 'Mono Tattoo Studio'
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <CalendarRange className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 5.4 — Staff Availability & Leave Management UI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Staff Schedules, Shift Breaks, Leave Requests & Holiday Calendar
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Business-facing schedule manager integrated with Phase 4's authoritative intersection availability engine. Supports weekly shift hours, multi-break configurations, partial/full day leaves, business holidays, conflict detection, and live availability timeline previews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunTests}
              disabled={isTesting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg transition-all disabled:opacity-50"
            >
              {isTesting ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              <span>Run Suite 21 Tests</span>
            </button>
          </div>
        </div>

        {/* Business Context Switcher */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Select Business Context:
          </span>

          {[
            { id: 'biz-barber-001', label: 'Royal Crown Barber', icon: Scissors },
            { id: 'biz-spa-002', label: 'Zenith Stone Spa', icon: Sparkles },
            { id: 'biz-nail-003', label: 'Gloss & Chic Nail Bar', icon: Sparkle },
            { id: 'biz-tattoo-004', label: 'Mono Tattoo Studio', icon: Award }
          ].map((biz) => {
            const Icon = biz.icon;
            const isSelected = currentBusinessId === biz.id;
            return (
              <button
                key={biz.id}
                onClick={() => handleTenantChange(biz.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{biz.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Automated Test Results Runner */}
      {testResults && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-base">Suite 21: Phase 5.4 Staff Availability & Schedule Automated Tests</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                {testResults.passed} / {testResults.total} PASSED
              </span>
              {testResults.failed > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 font-mono text-xs font-bold border border-rose-500/30">
                  {testResults.failed} FAILED
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {testResults.results
              .filter((r) => r.suite.includes('Suite 21') || r.suite.includes('Phase 5.4'))
              .map((res, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    res.passed
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                      : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                  }`}
                >
                  {res.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-100">{res.name}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">{res.message}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Feedback Toast */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Conflict Warning Banner */}
      {conflictWarning && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Booking Conflict Warning for {conflictWarning.day}</span>
          </div>
          <p className="text-xs text-amber-700 leading-relaxed">
            Changing working hours for {conflictWarning.day} affects {conflictWarning.affectedBookings.length} existing booking(s). Bookings remain intact and will not be deleted silently.
          </p>
          <div className="space-y-1">
            {conflictWarning.affectedBookings.map((b) => (
              <div key={b.id} className="text-[11px] bg-white/80 p-2 rounded-lg border border-amber-200 flex items-center justify-between">
                <span>
                  <strong>{b.customerName}</strong> ({b.items[0]?.nameSnapshot || 'Service'})
                </span>
                <span className="font-mono text-amber-900">
                  {b.bookingDate} @ {b.startTime} - {b.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Staff Selector & View Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Staff Member Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Staff Member:</span>
          <div className="flex flex-wrap gap-2">
            {businessStaff.map((staff) => {
              const isSelected = selectedStaffId === staff.id;
              return (
                <button
                  key={staff.id}
                  onClick={() => {
                    setSelectedStaffId(staff.id);
                    setConflictWarning(null);
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <img
                    src={staff.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={staff.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>{staff.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode Navigation */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'schedule', label: 'Shift Schedule', icon: Clock },
            { id: 'leaves', label: 'Leaves', icon: Briefcase },
            { id: 'holidays', label: 'Business Holidays', icon: Calendar },
            { id: 'preview', label: 'Availability Preview', icon: Globe }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Tab Content */}

      {/* SECTION 1: SHIFT SCHEDULE EDITOR */}
      {activeTab === 'schedule' && staffScheduleConfig && activeStaff && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">
                Weekly Shift Schedule for {activeStaff.name}
              </h2>
              <p className="text-xs text-slate-500">
                Configure working days, start/end shift hours, and multiple rest/sanitization breaks.
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-medium">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                Timezone: {staffScheduleConfig.timezone || 'Asia/Kolkata'}
              </span>
            </div>
          </div>

          {/* Days Accordion / List */}
          <div className="space-y-3">
            {DAYS_OF_WEEK.map((dayObj) => {
              const day = dayObj.id;
              const daySchedule: StaffDailySchedule = staffScheduleConfig.weeklySchedule[day] || {
                dayOfWeek: day,
                isWorking: false,
                startTime: '09:00',
                endTime: '18:00',
                breaks: []
              };
              const isOpen = openDays[day];

              return (
                <div
                  key={day}
                  className={`rounded-2xl border transition-all ${
                    daySchedule.isWorking
                      ? 'bg-slate-50/50 border-slate-200'
                      : 'bg-slate-100/40 border-slate-200 opacity-80'
                  }`}
                >
                  {/* Day Header Bar */}
                  <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={daySchedule.isWorking}
                          onChange={(e) => handleUpdateDayWorking(day, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>

                      <span className="font-bold text-slate-900 text-sm">{dayObj.label}</span>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          daySchedule.isWorking
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {daySchedule.isWorking ? 'WORKING DAY' : 'DAY OFF'}
                      </span>
                    </div>

                    {daySchedule.isWorking && (
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <input
                            type="time"
                            value={daySchedule.startTime}
                            onChange={(e) =>
                              handleUpdateDayTimes(day, e.target.value, daySchedule.endTime)
                            }
                            className="text-xs bg-transparent focus:outline-none font-mono font-bold"
                          />
                          <span className="text-slate-400">to</span>
                          <input
                            type="time"
                            value={daySchedule.endTime}
                            onChange={(e) =>
                              handleUpdateDayTimes(day, daySchedule.startTime, e.target.value)
                            }
                            className="text-xs bg-transparent focus:outline-none font-mono font-bold"
                          />
                        </div>

                        <button
                          onClick={() => {
                            setBreakTargetDay(day);
                            setIsBreakModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100"
                        >
                          <Coffee className="w-3.5 h-3.5 text-amber-600" />
                          <span>+ Add Break</span>
                        </button>

                        <button
                          onClick={() => toggleDayAccordion(day)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                        >
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Accordion / Breaks Sub-panel */}
                  {isOpen && daySchedule.isWorking && (
                    <div className="px-4 pb-4 border-t border-slate-200/80 pt-3 space-y-2">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Coffee className="w-3.5 h-3.5 text-amber-500" />
                        Configured Breaks for {dayObj.label} ({daySchedule.breaks?.length || 0})
                      </div>

                      {(!daySchedule.breaks || daySchedule.breaks.length === 0) ? (
                        <p className="text-xs text-slate-400 italic">No rest or sanitization breaks configured for this day.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {daySchedule.breaks.map((brk, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                            >
                              <div>
                                <div className="font-bold text-slate-900">{brk.label || 'Rest Break'}</div>
                                <div className="text-[11px] font-mono text-indigo-600">
                                  {brk.startTime} - {brk.endTime}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveBreak(day, idx)}
                                className="p-1 rounded text-rose-500 hover:bg-rose-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: LEAVE MANAGEMENT PANEL */}
      {activeTab === 'leaves' && activeStaff && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Leave Records for {activeStaff.name}</h2>
              <p className="text-xs text-slate-500">Apply for full day or partial day leave. System automatically excludes leave periods from bookable slots.</p>
            </div>

            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Apply New Leave</span>
            </button>
          </div>

          {staffLeaves.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 space-y-2">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-medium">No leave records registered for this staff member.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staffLeaves.map((leave) => (
                <div key={leave.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                      {leave.leaveType}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 text-sm">
                    {leave.startDate} {leave.startDate !== leave.endDate ? `to ${leave.endDate}` : ''}
                  </div>

                  {leave.startTime && leave.endTime && (
                    <div className="text-indigo-600 font-mono font-medium">
                      Partial Day: {leave.startTime} - {leave.endTime}
                    </div>
                  )}

                  <p className="text-slate-600 italic text-[11px]">{leave.reason || 'No reason specified'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: BUSINESS HOLIDAYS PANEL */}
      {activeTab === 'holidays' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">
                Business-Level Holidays for {businessNames[currentBusinessId]}
              </h2>
              <p className="text-xs text-slate-500">Configure annual closures, festivals, and special holiday closures.</p>
            </div>

            <button
              onClick={() => setIsHolidayModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Holiday</span>
            </button>
          </div>

          {businessHolidays.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
              No business holidays configured.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {businessHolidays.map((h, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{h.name}</div>
                    <div className="text-slate-500 font-mono text-[11px]">{h.date}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveHoliday(h.date)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: AUTHORITATIVE AVAILABILITY PREVIEW */}
      {activeTab === 'preview' && activeStaff && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Authoritative Real-Time Availability Preview</h2>
              <p className="text-xs text-slate-500">
                Live timeline generated using <code className="text-indigo-600">StaffScheduleService.evaluateAvailability(...)</code>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Date:</span>
              <input
                type="date"
                value={previewDate}
                onChange={(e) => setPreviewDate(e.target.value)}
                className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          {/* Timeline Slot Grid */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Slot Evaluation Matrix for {activeStaff.name} on {previewDate}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((timeStr) => {
                const evalResult: AvailabilityCheckResult = scheduleService.evaluateAvailability({
                  businessId: currentBusinessId,
                  staffId: selectedStaffId,
                  serviceDurationMinutes: 60,
                  bookingDate: previewDate,
                  startTime: timeStr
                });

                let statusBg = 'bg-emerald-50 border-emerald-300 text-emerald-900';
                let statusLabel = 'AVAILABLE';

                if (!evalResult.available) {
                  if (evalResult.code === 'OUTSIDE_BUSINESS_HOURS' || evalResult.code === 'OUTSIDE_STAFF_HOURS') {
                    statusBg = 'bg-slate-100 border-slate-200 text-slate-500';
                    statusLabel = 'CLOSED / SHIFT OFF';
                  } else if (evalResult.code === 'STAFF_ON_BREAK' || evalResult.code === 'BUSINESS_ON_BREAK') {
                    statusBg = 'bg-amber-50 border-amber-300 text-amber-900';
                    statusLabel = 'BREAK';
                  } else if (evalResult.code === 'STAFF_ON_LEAVE') {
                    statusBg = 'bg-purple-50 border-purple-300 text-purple-900';
                    statusLabel = 'ON LEAVE';
                  } else if (evalResult.code === 'BUSINESS_HOLIDAY') {
                    statusBg = 'bg-rose-50 border-rose-300 text-rose-900';
                    statusLabel = 'HOLIDAY';
                  }
                }

                return (
                  <div
                    key={timeStr}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${statusBg}`}
                  >
                    <div className="font-mono font-bold text-sm">{timeStr}</div>
                    <div className="font-extrabold text-[10px] tracking-wider">{statusLabel}</div>
                    <div className="text-[10px] opacity-80 truncate" title={evalResult.reason}>
                      {evalResult.reason || 'Open slot'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Break Addition Modal */}
      {isBreakModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Add Break to {breakTargetDay}</h3>

            <form onSubmit={handleAddBreak} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Break Label</label>
                <input
                  type="text"
                  required
                  value={breakLabel}
                  onChange={(e) => setBreakLabel(e.target.value)}
                  placeholder="e.g. Lunch Break, Sanitization"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Start Time</label>
                  <input
                    type="time"
                    required
                    value={breakStartTime}
                    onChange={(e) => setBreakStartTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">End Time</label>
                  <input
                    type="time"
                    required
                    value={breakEndTime}
                    onChange={(e) => setBreakEndTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBreakModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold"
                >
                  Add Break
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Apply Staff Leave</h3>

            <form onSubmit={handleCreateLeave} className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="partialLeave"
                  checked={leaveIsPartialDay}
                  onChange={(e) => setLeaveIsPartialDay(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                />
                <label htmlFor="partialLeave" className="font-semibold text-slate-700">Partial Day Leave</label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {leaveIsPartialDay && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Start Time</label>
                    <input
                      type="time"
                      value={leaveStartTime}
                      onChange={(e) => setLeaveStartTime(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">End Time</label>
                    <input
                      type="time"
                      value={leaveEndTime}
                      onChange={(e) => setLeaveEndTime(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="VACATION">Vacation</option>
                  <option value="SICK_LEAVE">Sick Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="PERSONAL">Personal</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Reason</label>
                <input
                  type="text"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="e.g. Medical appointment"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold"
                >
                  Apply Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Holiday Modal */}
      {isHolidayModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Add Business Holiday</h3>

            <form onSubmit={handleAddHoliday} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Holiday Name</label>
                <input
                  type="text"
                  required
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  placeholder="e.g. Diwali Festival"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Date</label>
                <input
                  type="date"
                  required
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsHolidayModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold"
                >
                  Add Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
