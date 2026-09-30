import React, { useState } from 'react';
import {
  BookingEntity,
  BookingStatus,
  VALID_BOOKING_TRANSITIONS,
  validateBookingStatusTransition
} from '../types/bookingEngine';
import {
  BookingStateMachineService,
  MultiTenantBookingRepository
} from '../services/bookingStateMachine';
import { SEEDED_BOOKINGS } from '../data/seededBookings';
import { Button, Card, Badge, Typography, Table, Alert } from '../design-system';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  History,
  ShieldCheck,
  Building2,
  DollarSign,
  ArrowRight,
  User,
  PlusCircle,
  PlayCircle
} from 'lucide-react';

export const Phase41BookingStateMachineShowcase: React.FC = () => {
  const [repository] = useState(() => new MultiTenantBookingRepository(SEEDED_BOOKINGS));
  const [activeTenantId, setActiveTenantId] = useState<string>('biz-barber-001');
  const [selectedBookingId, setSelectedBookingId] = useState<string>(SEEDED_BOOKINGS[0].id);
  const [stateEngineLog, setStateEngineLog] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>({
    msg: 'State machine initialized. Ready for strict transition evaluation.',
    type: 'info'
  });

  // Current list for selected tenant
  const tenantBookings = repository.listBookingsByTenant(activeTenantId);
  const currentBooking = repository.getBookingById(selectedBookingId, activeTenantId) || tenantBookings[0] || null;

  // Handler for state transition
  const handleTransition = (targetStatus: BookingStatus) => {
    if (!currentBooking) return;

    const validation = validateBookingStatusTransition(currentBooking.status, targetStatus);
    if (!validation.valid) {
      setStateEngineLog({
        msg: `BLOCKED BY STATE MACHINE: ${validation.error}`,
        type: 'error'
      });
      return;
    }

    const result = BookingStateMachineService.transitionStatus(currentBooking, targetStatus, {
      changedByUserId: 'usr-simulated-admin',
      changedByRole: 'BUSINESS_OWNER',
      reason: `Manual showcase transition into ${targetStatus}`
    });

    if (result.success && result.updatedBooking) {
      repository.saveBooking(result.updatedBooking, activeTenantId);
      setSelectedBookingId(result.updatedBooking.id);
      setStateEngineLog({
        msg: `SUCCESSFUL TRANSITION: [${currentBooking.status}] ➔ [${targetStatus}]. Audit log appended.`,
        type: 'success'
      });
    } else {
      setStateEngineLog({
        msg: result.error || 'Transition failed',
        type: 'error'
      });
    }
  };

  // Handler to simulate creating a new booking
  const handleCreateNewBooking = () => {
    const newBooking = BookingStateMachineService.createBooking({
      businessId: activeTenantId,
      customerId: `usr-${Date.now().toString(36)}`,
      customerName: 'Kavya Singhania',
      customerPhone: '+91 99887 76655',
      customerEmail: 'kavya.s@example.com',
      bookingDate: '2026-10-12',
      startTime: '15:00',
      primaryStaffId: 'stf-auto-01',
      primaryStaffNameSnapshot: 'Senior Stylist',
      items: [
        {
          itemType: 'SERVICE',
          referenceId: 'srv-demo-1',
          nameSnapshot: 'Full Glow Hair & Scalp Treatment',
          categorySnapshot: 'hair',
          unitPrice: 2400,
          durationMinutesSnapshot: 60,
          staffId: 'stf-auto-01',
          staffNameSnapshot: 'Senior Stylist'
        }
      ],
      advancePercentage: 25,
      taxGstRate: 18,
      notes: 'New booking created via Phase 4.1 engine'
    });

    repository.saveBooking(newBooking, activeTenantId);
    setSelectedBookingId(newBooking.id);
    setStateEngineLog({
      msg: `Created new DRAFT booking ${newBooking.id} under tenant ${activeTenantId}`,
      type: 'success'
    });
  };

  const allPossibleStates: BookingStatus[] = [
    'DRAFT',
    'PAYMENT_PENDING',
    'ADVANCE_PAID',
    'CONFIRMED',
    'CHECKED_IN',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
    'REFUND_PENDING',
    'REFUNDED'
  ];

  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
      case 'CHECKED_IN':
      case 'ADVANCE_PAID':
        return 'warning';
      case 'CANCELLED':
      case 'NO_SHOW':
      case 'REFUNDED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 p-6 rounded-2xl border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="warning">PHASE 4.1 DOMAIN CORE</Badge>
              <Badge variant="neutral">Strict Multi-Tenant Model</Badge>
              <Badge variant="success">Deterministic State Machine</Badge>
            </div>
            <Typography variant="h1" className="text-white text-2xl font-bold tracking-tight">
              Booking Data Model & State Machine Engine
            </Typography>
            <Typography variant="body" className="text-slate-400 mt-1">
              Immutable snapshots, integer cents monetary calculation, multi-tenant isolation boundary, and non-destructive auditable history.
            </Typography>
          </div>
          <Button
            variant="primary"
            leftIcon={<PlusCircle size={16} />}
            onClick={handleCreateNewBooking}
          >
            Create New Booking (Draft)
          </Button>
        </div>
      </div>

      {/* Tenant Selector Switcher */}
      <Card className="p-4 bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="text-indigo-400" size={18} />
            <span className="text-sm font-semibold text-slate-200">Active Tenant Context:</span>
            <span className="text-xs text-slate-400">(Multi-tenant boundary verification)</span>
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
                  const first = repository.listBookingsByTenant(tenant.id)[0];
                  if (first) setSelectedBookingId(first.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTenantId === tenant.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tenant.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Engine Status Feedback Alert */}
      {stateEngineLog && (
        <Alert
          variant={stateEngineLog.type === 'error' ? 'danger' : stateEngineLog.type === 'success' ? 'success' : 'info'}
          title="State Machine Engine Output"
        >
          {stateEngineLog.msg}
        </Alert>
      )}

      {/* Main Grid: Left side Booking Inspector & State Machine Controller, Right side Snapshot & Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Bookings in Tenant + Transition Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tenant Bookings List */}
          <Card className="p-4 bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <Typography variant="h3" className="text-white text-base font-semibold">
                Tenant Bookings ({tenantBookings.length})
              </Typography>
              <Badge variant="neutral" size="sm">{activeTenantId}</Badge>
            </div>

            {tenantBookings.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No bookings found for this tenant. Click "Create New Booking" above.
              </div>
            ) : (
              <div className="space-y-2">
                {tenantBookings.map((bk) => (
                  <button
                    key={bk.id}
                    onClick={() => setSelectedBookingId(bk.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedBookingId === bk.id
                        ? 'bg-indigo-950/40 border-indigo-500 text-white'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{bk.customerName}</span>
                      <Badge variant={getStatusBadgeVariant(bk.status)} size="sm">
                        {bk.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-1.5">
                      <span>{bk.items[0]?.nameSnapshot || 'Service'}</span>
                      <span className="font-mono text-emerald-400">₹{bk.totalAmount}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span>{bk.bookingDate}</span>
                      <span>•</span>
                      <span>{bk.startTime} - {bk.endTime}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Interactive State Machine Transition Controls */}
          {currentBooking && (
            <Card className="p-5 bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <PlayCircle className="text-indigo-400" size={18} />
                  <Typography variant="h3" className="text-white text-base font-semibold">
                    State Machine Transition Trigger
                  </Typography>
                </div>
                <Typography variant="caption" className="text-slate-400">
                  Current Status: <strong className="text-white">{currentBooking.status}</strong>
                </Typography>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">
                  Valid Next Transitions
                </span>
                <div className="flex flex-wrap gap-2">
                  {VALID_BOOKING_TRANSITIONS[currentBooking.status]?.length > 0 ? (
                    VALID_BOOKING_TRANSITIONS[currentBooking.status].map((targetStatus) => (
                      <Button
                        key={targetStatus}
                        variant="primary"
                        size="sm"
                        onClick={() => handleTransition(targetStatus)}
                        rightIcon={<ArrowRight size={14} />}
                      >
                        {targetStatus}
                      </Button>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      Terminal state ({currentBooking.status}). No further transitions allowed.
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-medium text-rose-400 uppercase tracking-wider block mb-2">
                  Test Invalid Transition Rejection
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {allPossibleStates
                    .filter(
                      (st) =>
                        st !== currentBooking.status &&
                        !VALID_BOOKING_TRANSITIONS[currentBooking.status]?.includes(st)
                    )
                    .map((invalidTarget) => (
                      <button
                        key={invalidTarget}
                        onClick={() => handleTransition(invalidTarget)}
                        className="px-2 py-1 bg-rose-950/30 border border-rose-800/40 text-rose-300 rounded text-[11px] hover:bg-rose-900/40 transition-colors"
                        title="Click to verify validator rejects this transition"
                      >
                        Try {invalidTarget} 🚫
                      </button>
                    ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column (7 Cols): Data Model & Financials & Audit History */}
        <div className="lg:col-span-7 space-y-6">
          {currentBooking ? (
            <>
              {/* Entity Deep Inspector */}
              <Card className="p-5 bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Typography variant="h3" className="text-white text-lg font-bold">
                      Booking Entity: {currentBooking.id}
                    </Typography>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="neutral" size="sm">Tenant: {currentBooking.businessId}</Badge>
                      <Badge variant={getStatusBadgeVariant(currentBooking.status)} size="sm">
                        Booking: {currentBooking.status}
                      </Badge>
                      <Badge variant="warning" size="sm">
                        Payment: {currentBooking.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Value</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      ₹{currentBooking.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Customer & Staff Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block">Customer</span>
                    <span className="font-semibold text-slate-200">{currentBooking.customerName}</span>
                    <span className="text-slate-500 block text-[11px]">{currentBooking.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Assigned Staff</span>
                    <span className="font-semibold text-slate-200">
                      {currentBooking.staffNameSnapshot || 'Unassigned'}
                    </span>
                    <span className="text-slate-500 block text-[11px]">{currentBooking.staffId || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Schedule Slot</span>
                    <span className="font-semibold text-slate-200">{currentBooking.bookingDate}</span>
                    <span className="text-slate-400 block text-[11px]">
                      {currentBooking.startTime} - {currentBooking.endTime} ({currentBooking.duration} mins)
                    </span>
                  </div>
                </div>

                {/* Line Items with Immutable Snapshots */}
                <div>
                  <Typography variant="h4" className="text-slate-200 text-sm font-semibold mb-2">
                    Line Items (Historical Immutable Snapshots)
                  </Typography>
                  <div className="space-y-2">
                    {currentBooking.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-slate-800/70 rounded-lg border border-slate-700/50 text-xs"
                      >
                        <div>
                          <span className="font-medium text-white block">{item.nameSnapshot}</span>
                          <span className="text-slate-400 text-[11px]">
                            Ref: {item.referenceId} • Category: {item.categorySnapshot} • Duration: {item.durationMinutesSnapshot}m
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-semibold text-slate-200 block">
                            ₹{(item.unitPriceCents / 100).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {item.unitPriceCents} cents
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safe Monetary Financial Snapshot Breakdown */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300 font-semibold mb-2">
                    <span className="flex items-center gap-1.5">
                      <DollarSign size={14} className="text-emerald-400" />
                      Financial Snapshot (Integer Cents Engine)
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Currency: {currentBooking.financials.currency}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800">
                    <div>
                      <span className="text-slate-400 block">Subtotal</span>
                      <span className="font-mono text-slate-200">
                        ₹{(currentBooking.financials.subtotalCents / 100).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Discount</span>
                      <span className="font-mono text-slate-200">
                        ₹{(currentBooking.financials.discountCents / 100).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">GST (18%)</span>
                      <span className="font-mono text-slate-200">
                        ₹{(currentBooking.financials.taxGstCents / 100).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Total</span>
                      <span className="font-mono font-bold text-emerald-400">
                        ₹{(currentBooking.financials.totalCents / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/50">
                    <div className="p-2 bg-indigo-950/30 rounded border border-indigo-800/30">
                      <span className="text-indigo-300 block text-[11px]">Advance ({currentBooking.financials.advancePercentage}%)</span>
                      <span className="font-mono font-semibold text-indigo-200 text-sm">
                        ₹{(currentBooking.financials.advanceAmountCents / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-800/50 rounded border border-slate-700/30">
                      <span className="text-slate-400 block text-[11px]">Remaining Due</span>
                      <span className="font-mono font-semibold text-slate-200 text-sm">
                        ₹{(currentBooking.financials.remainingAmountCents / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Auditable Status Transition History */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <History size={15} className="text-indigo-400" />
                    <Typography variant="h4" className="text-slate-200 text-sm font-semibold">
                      Auditable Status History Log (Non-destructive)
                    </Typography>
                  </div>
                  <div className="space-y-2">
                    {currentBooking.statusHistory.map((log, idx) => (
                      <div
                        key={log.id || idx}
                        className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-400">
                              {log.oldStatus} ➔ <strong className="text-indigo-300">{log.newStatus}</strong>
                            </span>
                            <Badge variant="neutral" size="sm">{log.changedByRole}</Badge>
                          </div>
                          {log.reason && (
                            <span className="text-slate-400 text-[11px] block mt-0.5">{log.reason}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center text-slate-500">
              Select a booking from the left list to view state machine details.
            </Card>
          )}
        </div>
      </div>

      {/* State Machine Transition Matrix Reference Table */}
      <Card className="p-5 bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={18} className="text-emerald-400" />
          <Typography variant="h3" className="text-white text-base font-semibold">
            Centralized State Transition Matrix (11 States)
          </Typography>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/70 text-slate-400 font-semibold border-b border-slate-700">
              <tr>
                <th className="p-2.5">Source State</th>
                <th className="p-2.5">Allowed Target States</th>
                <th className="p-2.5">Terminal?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {Object.entries(VALID_BOOKING_TRANSITIONS).map(([source, targets]) => (
                <tr key={source} className="hover:bg-slate-800/30">
                  <td className="p-2.5 font-semibold text-white font-mono">{source}</td>
                  <td className="p-2.5">
                    {targets.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {targets.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 font-mono text-[11px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">None (Terminal State)</span>
                    )}
                  </td>
                  <td className="p-2.5">
                    {targets.length === 0 ? (
                      <Badge variant="danger" size="sm">Yes</Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">No</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
