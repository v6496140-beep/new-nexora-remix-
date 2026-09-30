import React, { useState, useMemo } from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Building2,
  CalendarCheck2,
  User,
  Clock,
  Sparkles,
  Send,
  ShieldCheck,
  ShieldAlert,
  Layers,
  FileText,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Info
} from 'lucide-react';
import { Button, Badge } from '../design-system';
import {
  notificationDispatcherService,
  extractConfirmationSummary
} from '../services/notificationService';
import {
  NotificationEventType,
  NotificationChannel,
  NotificationRecord,
  BookingConfirmationSummary
} from '../types/notificationEngine';
import { BookingEntity } from '../types/bookingEngine';

export const Phase47BookingNotificationShowcase: React.FC = () => {
  // Sample Verified Booking Entity
  const sampleBooking: BookingEntity = useMemo(() => {
    return {
      id: 'NX-BKG-2026-9912',
      businessId: 'biz-barber-001',
      customerId: 'cust-mehra-99',
      customerName: 'Karan Mehra',
      customerPhone: '+91 9876543210',
      customerEmail: 'karan.mehra@example.com',
      staffNameSnapshot: 'Master Stylist Rohan',
      items: [
        {
          id: 'itm-01',
          bookingId: 'NX-BKG-2026-9912',
          itemType: 'SERVICE',
          referenceId: 'srv-barber-1',
          nameSnapshot: 'Royal Crown Signature Hair & Beard Sculpting',
          categorySnapshot: 'Men’s Grooming',
          unitPriceCents: 100000,
          durationMinutesSnapshot: 60
        }
      ],
      financials: {
        subtotalCents: 100000,
        discountCents: 0,
        gstCents: 0,
        taxGstCents: 0,
        totalCents: 100000,
        advancePercentage: 25,
        advanceAmountCents: 25000,
        remainingAmountCents: 75000,
        currency: 'INR'
      },
      bookingDate: '2026-10-15',
      startTime: '11:00',
      endTime: '12:00',
      duration: 60,
      subtotal: 1000,
      discount: 0,
      totalAmount: 1000,
      advancePercentage: 25,
      advanceAmount: 250,
      remainingAmount: 750,
      currency: 'INR',
      status: 'ADVANCE_PAID',
      paymentStatus: 'ADVANCE_PAID',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }, []);

  // Confirmation Summary
  const confirmationSummary: BookingConfirmationSummary = useMemo(() => {
    return extractConfirmationSummary(sampleBooking, 'Royal Crown Barber Lounge');
  }, [sampleBooking]);

  // Selected Event & Channel Controls
  const [selectedEvent, setSelectedEvent] = useState<NotificationEventType>('BOOKING_CONFIRMED');
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>([
    'EMAIL',
    'WHATSAPP',
    'SMS',
    'IN_APP'
  ]);
  const [failedChannels, setFailedChannels] = useState<NotificationChannel[]>([]);

  // Logs & Active Dispatch State
  const [auditLogs, setAuditLogs] = useState<NotificationRecord[]>([]);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [lastDispatchSummary, setLastDispatchSummary] = useState<any | null>(null);

  // Toggle Channel Selection
  const toggleChannel = (ch: NotificationChannel) => {
    if (selectedChannels.includes(ch)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  // Toggle Channel Failure Simulation
  const toggleFailureChannel = (ch: NotificationChannel) => {
    if (failedChannels.includes(ch)) {
      setFailedChannels(failedChannels.filter((c) => c !== ch));
    } else {
      setFailedChannels([...failedChannels, ch]);
    }
  };

  // Trigger Event Dispatch
  const handleDispatchEvent = async () => {
    setIsDispatching(true);

    const res = await notificationDispatcherService.dispatchBookingEvent({
      event: selectedEvent,
      booking: sampleBooking,
      businessName: 'Royal Crown Barber Lounge',
      channels: selectedChannels,
      simulateFailureChannels: failedChannels
    });

    setLastDispatchSummary(res);
    setAuditLogs(notificationDispatcherService.getAllRecords());
    setIsDispatching(false);
  };

  // All event options for selector
  const eventOptions: { type: NotificationEventType; label: string; badgeColor: string }[] = [
    { type: 'BOOKING_CONFIRMED', label: 'BOOKING_CONFIRMED', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { type: 'ADVANCE_PAYMENT_RECEIVED', label: 'ADVANCE_PAYMENT_RECEIVED', badgeColor: 'bg-amber-500/20 text-amber-300' },
    { type: 'BOOKING_CREATED', label: 'BOOKING_CREATED', badgeColor: 'bg-blue-500/20 text-blue-300' },
    { type: 'BOOKING_REMINDER', label: 'BOOKING_REMINDER', badgeColor: 'bg-purple-500/20 text-purple-300' },
    { type: 'BOOKING_RESCHEDULED', label: 'BOOKING_RESCHEDULED', badgeColor: 'bg-sky-500/20 text-sky-300' },
    { type: 'BOOKING_CANCELLED', label: 'BOOKING_CANCELLED', badgeColor: 'bg-rose-500/20 text-rose-300' },
    { type: 'PAYMENT_FAILED', label: 'PAYMENT_FAILED', badgeColor: 'bg-rose-600/20 text-rose-400' },
    { type: 'REFUND_COMPLETED', label: 'REFUND_COMPLETED', badgeColor: 'bg-teal-500/20 text-teal-300' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto bg-slate-800/90 backdrop-blur border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400/10 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-400/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> PHASE 4.7
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                Booking Confirmation & Notification Architecture
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Booking Confirmation & Multi-Channel Event Dispatcher
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Verified booking confirmation card display, decoupled notification event bus (Email, WhatsApp, SMS, In-App), and strict fault isolation (notification failures do NOT invalidate paid bookings).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-700 px-4 py-3 rounded-2xl text-center">
              <span className="block text-[11px] text-slate-400 font-medium">Fault Isolation</span>
              <span className="text-base font-bold text-emerald-400">Guaranteed</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-700 px-4 py-3 rounded-2xl text-center">
              <span className="block text-[11px] text-slate-400 font-medium">Channels</span>
              <span className="text-base font-bold text-amber-400">4 Providers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Verified Booking Confirmation UI Display */}
      <div className="max-w-7xl mx-auto bg-slate-800 rounded-3xl border border-slate-700 p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Verified Booking Confirmation Display</h2>
              <p className="text-xs text-slate-400">Rendered after server-side advance payment verification</p>
            </div>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-mono font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> STATUS: CONFIRMED
          </span>
        </div>

        {/* Confirmation Summary Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider block">
                  Official Booking Reference
                </span>
                <span className="text-2xl font-black text-white font-mono">{confirmationSummary.bookingId}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-medium block">Salon Venue</span>
                <span className="text-sm font-bold text-slate-200">{confirmationSummary.businessName}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Treatment / Service</span>
                <span className="text-amber-300 font-bold block text-sm">{confirmationSummary.serviceName}</span>
                <span className="text-slate-400 block text-[11px]">Duration: {confirmationSummary.durationMinutes} mins</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Assigned Specialist</span>
                <span className="text-purple-300 font-bold block text-sm">{confirmationSummary.staffName}</span>
                <span className="text-slate-400 block text-[11px]">Specialist Stylist</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Appointment Schedule</span>
                <span className="text-white font-bold block text-sm">
                  {confirmationSummary.bookingDate} @ {confirmationSummary.bookingTime}
                </span>
                <span className="text-emerald-400 block text-[11px]">Reserved Calendar Slot</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Customer Contact</span>
                <span className="text-white font-bold block text-sm">{confirmationSummary.customerName}</span>
                <span className="text-slate-400 block text-[11px]">
                  {confirmationSummary.customerPhone} · {confirmationSummary.customerEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Column */}
          <div className="md:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3 border-b border-slate-800 pb-2">
                Financial Summary
              </span>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Treatment Price:</span>
                  <span className="text-white font-bold">₹{confirmationSummary.totalAmountRupees.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-amber-400">
                  <span>Advance Paid (25%):</span>
                  <span className="font-bold">₹{confirmationSummary.advancePaidRupees.toLocaleString()} ✓</span>
                </div>

                <div className="flex justify-between text-emerald-400 pt-2 border-t border-slate-800">
                  <span className="font-bold">Remaining at Salon:</span>
                  <span className="font-bold text-base">₹{confirmationSummary.remainingAmountRupees.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-lg text-[11px] text-emerald-300 font-mono space-y-1">
              <span className="font-bold block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Immutable Snapshot
              </span>
              <span>Catalog price & advance deposit locked in repository record.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Multi-Channel Event Dispatcher Workbench */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Event Control & Dispatch Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Event Dispatcher Workbench
                </h3>
              </div>
              <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
                Event Bus
              </span>
            </div>

            {/* Event Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Notification Event Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {eventOptions.map((opt) => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSelectedEvent(opt.type)}
                    className={`p-2.5 rounded-xl text-[11px] font-mono font-bold text-left transition-all border ${
                      selectedEvent === opt.type
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <span className="block truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Channel Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-700/60">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Target Communication Channels
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['EMAIL', 'WHATSAPP', 'SMS', 'IN_APP'] as NotificationChannel[]).map((ch) => {
                  const isChecked = selectedChannels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => toggleChannel(ch)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-slate-700 border-amber-400 text-white shadow'
                          : 'bg-slate-900 border-slate-700 text-slate-500 opacity-60'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {ch === 'EMAIL' && <Mail className="w-3.5 h-3.5 text-blue-400" />}
                        {ch === 'WHATSAPP' && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                        {ch === 'SMS' && <Smartphone className="w-3.5 h-3.5 text-purple-400" />}
                        {ch === 'IN_APP' && <Bell className="w-3.5 h-3.5 text-amber-400" />}
                        {ch}
                      </span>
                      <span>{isChecked ? '✓' : ''}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Failure Simulation Toggles (Fault Isolation Test) */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Fault Isolation Test (Simulate Provider Failure)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Verify booking remains intact</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['EMAIL', 'WHATSAPP', 'SMS', 'IN_APP'] as NotificationChannel[]).map((ch) => {
                  const isFailed = failedChannels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => toggleFailureChannel(ch)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all border ${
                        isFailed
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {isFailed ? `Fail ${ch} (Simulated)` : `Simulate ${ch} Error`}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleDispatchEvent}
              disabled={isDispatching || selectedChannels.length === 0}
              className="w-full text-xs font-bold"
            >
              {isDispatching ? 'Dispatching Event Notifications...' : `Dispatch ${selectedEvent} Event`}
            </Button>

            {lastDispatchSummary && (
              <div
                className={`p-4 rounded-2xl border text-xs font-mono space-y-1.5 ${
                  lastDispatchSummary.allSucceeded
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                }`}
              >
                <div className="flex justify-between font-bold">
                  <span>Dispatch Result:</span>
                  <span>{lastDispatchSummary.allSucceeded ? 'ALL CHANNELS SENT' : 'PARTIAL / CHANNEL ERRORS'}</span>
                </div>
                <p className="text-[11px] opacity-90">
                  {lastDispatchSummary.allSucceeded
                    ? 'All notification providers delivered successfully.'
                    : 'Channel errors occurred, but booking status remains 100% valid and confirmed!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Audit Log & Notification Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Notification Audit Trail
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{auditLogs.length} Records</span>
            </div>

            <p className="text-xs text-slate-400">
              Stores `notificationId`, `businessId`, `bookingId`, `channel`, `status`, `providerMessageId`, and failure logs.
            </p>

            <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
              {auditLogs.length === 0 ? (
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700/80 text-center text-xs text-slate-500 italic">
                  No notification records generated yet. Click "Dispatch Event" to trigger.
                </div>
              ) : (
                auditLogs.map((record) => (
                  <div
                    key={record.notificationId}
                    className="p-3.5 bg-slate-900 rounded-2xl border border-slate-700/80 font-mono text-[11px] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold">{record.channel}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          record.status === 'SENT'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>

                    <div className="text-slate-300 text-[10px] truncate">Recipient: {record.recipient}</div>
                    <p className="text-slate-400 text-[10px] line-clamp-2 italic bg-slate-950 p-2 rounded border border-slate-800">
                      "{record.body}"
                    </p>

                    {record.providerMessageId && (
                      <div className="text-[9px] text-slate-500 font-mono">
                        Provider ID: {record.providerMessageId}
                      </div>
                    )}

                    {record.failureReason && (
                      <div className="text-[9px] text-rose-400 font-mono font-bold">
                        Error: {record.failureReason}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
