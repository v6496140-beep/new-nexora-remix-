import React, { useState, useMemo } from 'react';
import {
  SlotEngineQuery,
  SlotEngineResult,
  TimeSlot,
  SlotIntervalMinutes
} from '../types/slotEngine';
import { SlotEngineService, SlotLockManager } from '../services/slotEngineService';
import { StaffScheduleService } from '../services/staffScheduleService';
import { ServicePackageConfigService } from '../services/servicePackageService';
import { SEEDED_BOOKINGS } from '../data/seededBookings';
import { Button, Card, Badge, Typography, Table, Alert } from '../design-system';
import {
  Clock,
  Calendar,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Building2,
  Coffee,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  Scissors
} from 'lucide-react';

export const Phase44AvailabilitySlotEngineShowcase: React.FC = () => {
  const [scheduleService] = useState(() => new StaffScheduleService());
  const [serviceManager] = useState(() => new ServicePackageConfigService());
  const [lockManager] = useState(() => new SlotLockManager());
  const [slotEngine] = useState(
    () => new SlotEngineService(scheduleService, serviceManager, SEEDED_BOOKINGS, lockManager)
  );

  // State
  const [activeTenantId, setActiveTenantId] = useState<string>('biz-barber-001');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-barber-1');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('ANY_AVAILABLE');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-06'); // A Tuesday
  const [intervalMinutes, setIntervalMinutes] = useState<SlotIntervalMinutes>(30);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [lockActionLog, setLockActionLog] = useState<{ msg: string; type: 'success' | 'warning' | 'info' } | null>({
    msg: 'Availability Slot Engine active. Ready to calculate valid booking slots across all constraints.',
    type: 'info'
  });

  // Queries
  const tenantStaff = serviceManager.listStaffByTenant(activeTenantId);
  const tenantServices = serviceManager.listServicesByTenant(activeTenantId);
  const selectedService = tenantServices.find((s) => s.id === selectedServiceId) || tenantServices[0];

  // Calculate Slots
  const slotResult: SlotEngineResult = useMemo(() => {
    return slotEngine.generateSlots({
      businessId: activeTenantId,
      serviceId: selectedService?.id,
      staffId: selectedStaffId,
      date: selectedDate,
      slotIntervalMinutes: intervalMinutes
    });
  }, [slotEngine, activeTenantId, selectedService?.id, selectedStaffId, selectedDate, intervalMinutes, lockActionLog]);

  // Lock Management Simulation
  const handleLockSlot = (slot: TimeSlot) => {
    const staffIdToLock = slot.primaryStaffId || (slot.availableStaffIds[0] || 'stf-rc-01');
    const res = lockManager.acquireLock(
      activeTenantId,
      staffIdToLock,
      slot.date,
      slot.startTime,
      slot.totalOccupancyMinutes,
      'cust-simulated-lock',
      600 // 10 minutes TTL
    );

    if (res.success) {
      setLockActionLog({
        msg: `ACQUIRED SHORT-LIVED LOCK: Held slot ${slot.startTime} - ${slot.occupancyEndTime} for staff ${staffIdToLock} (TTL 10m). Notice the slot is now blocked for other checkouts.`,
        type: 'warning'
      });
    } else {
      setLockActionLog({
        msg: `LOCK FAILED: ${res.error}`,
        type: 'warning'
      });
    }
  };

  const handleClearAllLocks = () => {
    lockManager.purgeExpiredLocks('2099-01-01T00:00:00Z'); // clears all
    setLockActionLog({
      msg: 'Released all active concurrency locks. Slots recalculated.',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 p-6 rounded-2xl border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="warning">PHASE 4.4 SLOT ENGINE</Badge>
              <Badge variant="neutral">Anti-Race Concurrency Locks</Badge>
              <Badge variant="success">Multi-Staff Aggregation</Badge>
            </div>
            <Typography variant="h1" className="text-white text-2xl font-bold tracking-tight">
              Availability & Time-Slot Calculation Engine
            </Typography>
            <Typography variant="body" className="text-slate-400 mt-1">
              Calculates real-time booking slots by evaluating business hours, staff shifts, breaks, leaves, active booking overlaps, service buffers, and concurrency locks.
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Unlock size={14} />}
              onClick={handleClearAllLocks}
            >
              Clear Concurrency Locks
            </Button>
          </div>
        </div>
      </div>

      {/* Tenant Switcher */}
      <Card className="p-4 bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="text-blue-400" size={18} />
            <span className="text-sm font-semibold text-slate-200">Active Tenant Salon:</span>
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
                  const firstSrv = serviceManager.listServicesByTenant(tenant.id)[0];
                  if (firstSrv) setSelectedServiceId(firstSrv.id);
                  setSelectedStaffId('ANY_AVAILABLE');
                  setSelectedSlot(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTenantId === tenant.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tenant.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Action Log Alert */}
      {lockActionLog && (
        <Alert
          variant={lockActionLog.type === 'warning' ? 'warning' : lockActionLog.type === 'success' ? 'success' : 'info'}
          title="Slot Engine Status"
        >
          {lockActionLog.msg}
        </Alert>
      )}

      {/* Controls Bar: Service, Staff Mode, Date, Interval */}
      <Card className="p-5 bg-slate-900 border border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Service Picker */}
          <div>
            <label className="text-slate-400 font-medium block mb-1.5 flex items-center gap-1">
              <Scissors size={14} className="text-blue-400" />
              Service Selection
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs focus:ring-1 focus:ring-blue-500"
            >
              {tenantServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration}m + {s.bufferTime}m buffer)
                </option>
              ))}
            </select>
          </div>

          {/* Staff Selection Mode */}
          <div>
            <label className="text-slate-400 font-medium block mb-1.5 flex items-center gap-1">
              <Users size={14} className="text-blue-400" />
              Staff Selection Mode
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs focus:ring-1 focus:ring-blue-500"
            >
              <option value="ANY_AVAILABLE">★ ANY AVAILABLE STAFF (Auto-Find)</option>
              {tenantStaff
                .filter((st) => st.active)
                .map((st) => (
                  <option key={st.id} value={st.id}>
                    Specific Staff: {st.name} ({st.role})
                  </option>
                ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-slate-400 font-medium block mb-1.5 flex items-center gap-1">
              <Calendar size={14} className="text-blue-400" />
              Booking Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Slot Interval Step */}
          <div>
            <label className="text-slate-400 font-medium block mb-1.5 flex items-center gap-1">
              <Clock size={14} className="text-blue-400" />
              Slot Interval Step
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[15, 30, 60].map((step) => (
                <button
                  key={step}
                  onClick={() => setIntervalMinutes(step as SlotIntervalMinutes)}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                    intervalMinutes === step
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {step}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Grid: Calculated Slot Grid + Slot Deep Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Calculated Slots Grid */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5 bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <Typography variant="h3" className="text-white text-base font-semibold">
                  Generated Slots ({slotResult.availableSlotsCount} of {slotResult.totalSlotsCount} Available)
                </Typography>
                <span className="text-xs text-slate-400 block mt-0.5">
                  {selectedDate} ({slotResult.dayOfWeek}) · {selectedService?.name} ({selectedService?.duration}m + {selectedService?.bufferTime}m buffer)
                </span>
              </div>
              <Badge variant="neutral" size="sm">
                Step: {intervalMinutes}m
              </Badge>
            </div>

            {/* Slots Tile Grid */}
            {slotResult.slots.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No slots available on this date.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {slotResult.slots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'ring-2 ring-blue-400 border-blue-500 bg-blue-950/40 text-white'
                          : slot.available
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200 hover:bg-emerald-950/40'
                          : 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm">
                          {slot.startTime}
                        </span>
                        {slot.available ? (
                          <CheckCircle2 size={14} className="text-emerald-400" />
                        ) : (
                          <XCircle size={14} className="text-slate-500" />
                        )}
                      </div>

                      <div className="mt-1 text-[11px] flex items-center justify-between">
                        <span className="text-slate-400 font-mono">{slot.endTime}</span>
                        {slot.available ? (
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {slot.availableStaffIds.length} staff
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-400 line-clamp-1 truncate max-w-[60px]">
                            {slot.conflictCode}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (5 Cols): Selected Slot Deep Breakdown & Concurrency Locking */}
        <div className="lg:col-span-5 space-y-6">
          {selectedSlot ? (
            <Card className="p-5 bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <Typography variant="h3" className="text-white text-base font-bold">
                    Slot: {selectedSlot.startTime} – {selectedSlot.endTime}
                  </Typography>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Total Occupancy: {selectedSlot.totalOccupancyMinutes} mins (Finish + Buffer: {selectedSlot.occupancyEndTime})
                  </span>
                </div>
                <Badge variant={selectedSlot.available ? 'success' : 'danger'}>
                  {selectedSlot.conflictCode || (selectedSlot.available ? 'AVAILABLE' : 'UNAVAILABLE')}
                </Badge>
              </div>

              {/* Status Reason Alert if unavailable */}
              {!selectedSlot.available && selectedSlot.reason && (
                <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl text-rose-300 text-xs">
                  <strong>Rejection Cause:</strong> {selectedSlot.reason}
                </div>
              )}

              {/* Staff Evaluation Breakdown for this slot */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  Eligible Staff Evaluation ({selectedSlot.eligibleStaffDetails.length})
                </span>
                <div className="space-y-2">
                  {selectedSlot.eligibleStaffDetails.map((staffInfo) => (
                    <div
                      key={staffInfo.staffId}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                        staffInfo.isAvailable
                          ? 'bg-emerald-950/20 border-emerald-800/30 text-emerald-200'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-200">{staffInfo.staffName}</span>
                          <span className="text-[10px] text-slate-400">({staffInfo.role})</span>
                        </div>
                        {!staffInfo.isAvailable && staffInfo.unavailableReason && (
                          <span className="text-[11px] text-rose-400 block mt-0.5">
                            {staffInfo.unavailableReason}
                          </span>
                        )}
                      </div>
                      {staffInfo.isAvailable ? (
                        <Badge variant="success" size="sm">Available</Badge>
                      ) : (
                        <Badge variant="danger" size="sm">Busy</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Concurrency Lock Simulator */}
              {selectedSlot.available && (
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-indigo-300 block flex items-center gap-1.5">
                    <Lock size={14} /> Concurrency Anti-Race Test
                  </span>
                  <Typography variant="caption" className="text-slate-400 text-xs block">
                    Acquiring a temporary 10-minute hold simulates another customer beginning checkout on this exact slot.
                  </Typography>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    leftIcon={<Lock size={14} />}
                    onClick={() => handleLockSlot(selectedSlot)}
                  >
                    Acquire 10-Min Temporary Slot Lock
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-8 text-center text-slate-500 text-xs">
              Click any time slot on the left to inspect detailed staff availability and concurrency lock behavior.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
