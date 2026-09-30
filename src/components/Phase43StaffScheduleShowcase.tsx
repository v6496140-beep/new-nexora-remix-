import React, { useState } from 'react';
import {
  DayOfWeek,
  StaffAvailabilityStatus,
  StaffLeaveRecord,
  AvailabilityCheckResult,
  parseTimeToMinutes,
  formatMinutesToTime
} from '../types/staffSchedule';
import {
  StaffScheduleService,
  SEEDED_BUSINESS_SCHEDULES,
  SEEDED_STAFF_SCHEDULES,
  SEEDED_STAFF_LEAVES
} from '../services/staffScheduleService';
import {
  ServicePackageConfigService,
  SEEDED_SERVICES,
  SEEDED_STAFF_MEMBERS
} from '../services/servicePackageService';
import { Button, Card, Badge, Typography, Table, Alert, Input } from '../design-system';
import {
  Calendar,
  Clock,
  User,
  Coffee,
  Sun,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  CalendarRange,
  Palmtree,
  Activity,
  Globe,
  Sliders
} from 'lucide-react';

export const Phase43StaffScheduleShowcase: React.FC = () => {
  const [scheduleService] = useState(() => new StaffScheduleService());
  const [serviceManager] = useState(() => new ServicePackageConfigService());

  // Active Tenant
  const [activeTenantId, setActiveTenantId] = useState<string>('biz-barber-001');

  // Simulator State
  const [simStaffId, setSimStaffId] = useState<string>('stf-rc-01');
  const [simServiceId, setSimServiceId] = useState<string>('srv-barber-1');
  const [simDate, setSimDate] = useState<string>('2026-10-06'); // A Tuesday
  const [simTime, setSimTime] = useState<string>('11:00');

  // Live Evaluation Result
  const [evalResult, setEvalResult] = useState<AvailabilityCheckResult | null>(null);

  // Queries
  const bizSchedule = scheduleService.getBusinessSchedule(activeTenantId);
  const tenantStaff = serviceManager.listStaffByTenant(activeTenantId);
  const tenantServices = serviceManager.listServicesByTenant(activeTenantId);
  const staffConfig = scheduleService.getStaffSchedule(simStaffId);
  const staffLeaves = scheduleService.listBusinessLeaves(activeTenantId);

  const selectedService = tenantServices.find((s) => s.id === simServiceId) || tenantServices[0];
  const selectedStaffMember = tenantStaff.find((s) => s.id === simStaffId) || tenantStaff[0];

  // Evaluate Availability
  const runEvaluation = (
    overrideDate?: string,
    overrideTime?: string,
    overrideStaffId?: string,
    overrideServiceId?: string
  ) => {
    const dateToCheck = overrideDate || simDate;
    const timeToCheck = overrideTime || simTime;
    const staffToCheck = overrideStaffId || simStaffId;
    const serviceToCheck = overrideServiceId
      ? tenantServices.find((s) => s.id === overrideServiceId)
      : selectedService;

    const srvMember = tenantStaff.find((s) => s.id === staffToCheck);

    const res = scheduleService.evaluateAvailability(
      {
        businessId: activeTenantId,
        staffId: staffToCheck,
        serviceId: serviceToCheck?.id,
        serviceDurationMinutes: serviceToCheck?.duration || 45,
        bufferTimeMinutes: serviceToCheck?.bufferTime || 10,
        bookingDate: dateToCheck,
        startTime: timeToCheck
      },
      {
        service: serviceToCheck,
        staffMember: srvMember
      }
    );

    setEvalResult(res);
  };

  // Run initial evaluation on mount / state switch
  React.useEffect(() => {
    runEvaluation();
  }, [activeTenantId, simStaffId, simServiceId, simDate, simTime]);

  const daysOrder: DayOfWeek[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 p-6 rounded-2xl border border-amber-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="warning">PHASE 4.3 AVAILABILITY & SCHEDULING</Badge>
              <Badge variant="neutral">Timezone Aware</Badge>
              <Badge variant="success">Staff & Business Intersection</Badge>
            </div>
            <Typography variant="h1" className="text-white text-2xl font-bold tracking-tight">
              Staff Working Schedule & Availability Engine
            </Typography>
            <Typography variant="body" className="text-slate-400 mt-1">
              Evaluates the intersection of business operating hours, staff shifts, lunch breaks, approved leaves, holidays, service buffer occupancy, and eligibility.
            </Typography>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
            <Globe className="text-amber-400" size={16} />
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px]">Business Timezone</span>
              <span className="font-mono text-slate-200 font-semibold">{bizSchedule?.timezone || 'Asia/Kolkata'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Context Selector */}
      <Card className="p-4 bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="text-amber-400" size={18} />
            <span className="text-sm font-semibold text-slate-200">Active Business Tenant:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'biz-barber-001', name: 'Royal Crown Barber' },
              { id: 'biz-spa-002', name: 'Zenith Stone Spa' },
              { id: 'biz-nail-003', name: 'Gloss & Chic Nail Bar' },
              { id: 'biz-tattoo-004', name: 'Mono Tattoo Studio' }
            ].map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => {
                  setActiveTenantId(tenant.id);
                  const firstStaff = serviceManager.listStaffByTenant(tenant.id)[0];
                  if (firstStaff) setSimStaffId(firstStaff.id);
                  const firstService = serviceManager.listServicesByTenant(tenant.id)[0];
                  if (firstService) setSimServiceId(firstService.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTenantId === tenant.id
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tenant.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Interactive Availability Evaluator & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Availability Simulator Controls & Scenario Presets */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-5 bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-amber-400" />
              <Typography variant="h3" className="text-white text-base font-semibold">
                Availability Slot Simulator
              </Typography>
            </div>

            <div className="space-y-3 text-xs">
              {/* Service Picker */}
              <div>
                <label className="text-slate-400 block mb-1">Select Service (Duration + Buffer)</label>
                <select
                  value={simServiceId}
                  onChange={(e) => setSimServiceId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                >
                  {tenantServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.duration}m + {s.bufferTime}m buffer = {s.duration + s.bufferTime}m total)
                    </option>
                  ))}
                </select>
              </div>

              {/* Staff Member Picker */}
              <div>
                <label className="text-slate-400 block mb-1">Select Staff Member</label>
                <select
                  value={simStaffId}
                  onChange={(e) => setSimStaffId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                >
                  {tenantStaff.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role}) {!st.active ? '[INACTIVE]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Start Time Pickers */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Booking Date</label>
                  <input
                    type="date"
                    value={simDate}
                    onChange={(e) => setSimDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Start Time (HH:mm)</label>
                  <input
                    type="time"
                    value={simTime}
                    onChange={(e) => setSimTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Test Scenario Presets */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Quick Validation Presets
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    setSimDate('2026-10-06');
                    setSimTime('11:00');
                    setSimStaffId('stf-rc-01');
                    setSimServiceId('srv-barber-1');
                  }}
                  className="p-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 rounded text-[11px] text-emerald-300 text-left font-medium transition-colors"
                >
                  ✓ Valid Slot (Tue 11:00)
                </button>
                <button
                  onClick={() => {
                    setSimDate('2026-10-06');
                    setSimTime('07:00'); // Business opens at 09:00
                  }}
                  className="p-1.5 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 rounded text-[11px] text-rose-300 text-left font-medium transition-colors"
                >
                  ✗ Outside Biz Hours (07:00)
                </button>
                <button
                  onClick={() => {
                    setSimDate('2026-10-06');
                    setSimTime('18:30'); // Vikram shift ends at 18:00
                    setSimStaffId('stf-rc-01');
                  }}
                  className="p-1.5 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 rounded text-[11px] text-rose-300 text-left font-medium transition-colors"
                >
                  ✗ Outside Staff Shift (18:30)
                </button>
                <button
                  onClick={() => {
                    setSimDate('2026-10-06');
                    setSimTime('13:30'); // Vikram lunch break 13:00 - 14:00
                    setSimStaffId('stf-rc-01');
                  }}
                  className="p-1.5 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 rounded text-[11px] text-rose-300 text-left font-medium transition-colors"
                >
                  ✗ Staff Lunch Break (13:30)
                </button>
                <button
                  onClick={() => {
                    setSimDate('2026-10-16'); // Vikram approved leave Oct 15-18
                    setSimStaffId('stf-rc-01');
                  }}
                  className="p-1.5 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 rounded text-[11px] text-rose-300 text-left font-medium transition-colors"
                >
                  ✗ Staff Leave (Oct 16)
                </button>
                <button
                  onClick={() => {
                    setSimDate('2026-10-02'); // Gandhi Jayanti holiday
                  }}
                  className="p-1.5 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 rounded text-[11px] text-rose-300 text-left font-medium transition-colors"
                >
                  ✗ Biz Holiday (Oct 02)
                </button>
                <button
                  onClick={() => {
                    setSimStaffId('stf-rc-03'); // Inactive apprentice
                  }}
                  className="p-1.5 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 rounded text-[11px] text-rose-300 text-left font-medium transition-colors"
                >
                  ✗ Inactive Staff (Rohan)
                </button>
                <button
                  onClick={() => {
                    setSimServiceId('srv-barber-2'); // Straight Razor Shave
                    setSimStaffId('stf-rc-02'); // Sameer Khan is not eligible for razor
                  }}
                  className="p-1.5 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 rounded text-[11px] text-rose-300 text-left font-medium transition-colors"
                >
                  ✗ Ineligible Staff for Shave
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (7 Cols): Live Evaluation Card & Schedule Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Availability Outcome Card */}
          {evalResult && (
            <Card className="p-5 bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Typography variant="h3" className="text-white text-lg font-bold">
                      Availability Engine Evaluation
                    </Typography>
                    <Badge variant={evalResult.available ? 'success' : 'danger'}>
                      {evalResult.code}
                    </Badge>
                  </div>
                  <Typography variant="body" className="text-slate-300 text-xs mt-1">
                    {evalResult.reason}
                  </Typography>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Required Slot Occupancy</span>
                  <span className="font-mono font-bold text-amber-400 text-base">
                    {evalResult.slotDetails?.totalOccupancyMinutes} mins
                  </span>
                </div>
              </div>

              {/* Occupancy Timeline Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Start Time</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {evalResult.slotDetails?.startTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">End (+ Buffer)</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {evalResult.slotDetails?.endTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Service / Buffer</span>
                  <span className="font-semibold text-slate-200">
                    {evalResult.slotDetails?.serviceDurationMinutes}m + {evalResult.slotDetails?.bufferTimeMinutes}m
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Timezone</span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {evalResult.slotDetails?.businessTimezone}
                  </span>
                </div>
              </div>

              {/* Checklist Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-800/40 rounded border border-slate-800">
                  <span className="text-slate-300">1. Business Operating Hours & Holidays</span>
                  {evalResult.code === 'OUTSIDE_BUSINESS_HOURS' || evalResult.code === 'BUSINESS_HOLIDAY' || evalResult.code === 'BUSINESS_ON_BREAK' ? (
                    <span className="flex items-center gap-1 text-rose-400 text-[11px]">
                      <XCircle size={14} /> Closed / Blocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 size={14} /> Business Open
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-800/40 rounded border border-slate-800">
                  <span className="text-slate-300">2. Staff Shift, Breaks & Active Status</span>
                  {evalResult.code === 'OUTSIDE_STAFF_HOURS' || evalResult.code === 'STAFF_ON_BREAK' || evalResult.code === 'STAFF_INACTIVE' ? (
                    <span className="flex items-center gap-1 text-rose-400 text-[11px]">
                      <XCircle size={14} /> Unavailable / On Break
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 size={14} /> Shift Active
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-800/40 rounded border border-slate-800">
                  <span className="text-slate-300">3. Approved Staff Leaves</span>
                  {evalResult.code === 'STAFF_ON_LEAVE' ? (
                    <span className="flex items-center gap-1 text-rose-400 text-[11px]">
                      <XCircle size={14} /> On Approved Leave
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 size={14} /> No Leave Clash
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-800/40 rounded border border-slate-800">
                  <span className="text-slate-300">4. Staff Service Eligibility</span>
                  {evalResult.code === 'STAFF_NOT_ELIGIBLE' ? (
                    <span className="flex items-center gap-1 text-rose-400 text-[11px]">
                      <XCircle size={14} /> Not Qualified / Assigned
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 size={14} /> Qualified & Assigned
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Staff Weekly Shift Roster & Breaks */}
          {staffConfig && (
            <Card className="p-5 bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-amber-400" />
                  <Typography variant="h4" className="text-white text-sm font-semibold">
                    Staff Shift Roster: {selectedStaffMember?.name}
                  </Typography>
                </div>
                <Badge variant={selectedStaffMember?.active ? 'success' : 'danger'} size="sm">
                  {selectedStaffMember?.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                {daysOrder.map((day) => {
                  const daySched = staffConfig.weeklySchedule[day];
                  const isTodaySim = simDate && new Date(simDate).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase() === day;
                  return (
                    <div
                      key={day}
                      className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
                        isTodaySim
                          ? 'bg-amber-950/30 border-amber-600/50 text-white'
                          : 'bg-slate-800/30 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold w-24 text-[11px]">{day}</span>
                        {isTodaySim && (
                          <Badge variant="warning" size="sm">Selected Date</Badge>
                        )}
                      </div>

                      {daySched?.isWorking ? (
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-200">
                            {daySched.startTime} - {daySched.endTime}
                          </span>
                          {daySched.breaks.length > 0 && (
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
                              <Coffee size={10} /> Break: {daySched.breaks[0].startTime} - {daySched.breaks[0].endTime}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Day Off</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Business Hours & Holidays Overview */}
          {bizSchedule && (
            <Card className="p-5 bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-amber-400" />
                  <Typography variant="h4" className="text-white text-sm font-semibold">
                    Business Hours & Calendar Holidays
                  </Typography>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Holidays List */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Upcoming Business Holidays
                  </span>
                  <div className="space-y-1">
                    {bizSchedule.holidays.map((h) => (
                      <div key={h.date} className="flex items-center justify-between text-slate-300">
                        <span>{h.name}</span>
                        <span className="font-mono text-amber-400 text-[11px]">{h.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Approved Staff Leaves */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Approved Staff Leaves
                  </span>
                  <div className="space-y-1">
                    {staffLeaves.map((l) => {
                      const stf = tenantStaff.find((s) => s.id === l.staffId);
                      return (
                        <div key={l.id} className="flex items-center justify-between text-slate-300">
                          <span>{stf?.name || l.staffId} ({l.leaveType})</span>
                          <span className="font-mono text-rose-400 text-[11px]">
                            {l.startDate}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
