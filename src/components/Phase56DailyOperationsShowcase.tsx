import React, { useState } from 'react';
import {
  CalendarRange,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Building2,
  Users,
  Scissors,
  Sparkles,
  Sparkle,
  Award,
  Check,
  X,
  AlertCircle,
  UserCheck,
  Eye
} from 'lucide-react';

import { DailyOperationsService } from '../services/dailyOperationsService';
import { TimelineSlot } from '../types/dailyOperations';
import { BookingEntity, BookingStatus } from '../types/bookingEngine';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase56DailyOperationsShowcase() {
  const [opsService] = useState(() => new DailyOperationsService());

  // Multi-Tenant Business Context
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // Operational Date Selector
  const [operationalDate, setOperationalDate] = useState<string>('2026-10-20');

  // No-Show Modal State
  const [noShowModalBookingId, setNoShowModalBookingId] = useState<string | null>(null);
  const [noShowReason, setNoShowReason] = useState<string>('Customer did not arrive within 15 minutes');

  // Success Feedback Message
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Automated Test Suite State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Timeline Slots
  const timelineSlots: TimelineSlot[] = opsService.getDailyTimeline(currentBusinessId, operationalDate);

  const handleAction = (bookingId: string, action: 'CHECK_IN' | 'START' | 'COMPLETE' | 'CANCEL', reason?: string) => {
    const res = opsService.executeOperationalAction({
      bookingId,
      businessId: currentBusinessId,
      action,
      reason
    });

    if (res.success) {
      showTempSuccess(`Successfully executed operational action: ${action}`);
      setNoShowModalBookingId(null);
    } else {
      alert(res.error || 'Operational action rejected by state machine');
    }
  };

  const handleNoShowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noShowModalBookingId) return;
    handleAction(noShowModalBookingId, 'NO_SHOW' as any, noShowReason);
  };

  const showTempSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

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
              <span>Phase 5.6 — Daily Appointment Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Operational Today View & Workflow State Machine
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Manage daily salon appointments across a 30-minute operational timeline. Enforces centralized state machine transitions (<code className="text-indigo-300">CONFIRMED → CHECKED_IN → IN_PROGRESS → COMPLETED</code> or <code className="text-indigo-300">NO_SHOW</code> / <code className="text-indigo-300">CANCELLED</code>) with immutable audit history preservation.
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
              <span>Run Suite 23 Tests</span>
            </button>
          </div>
        </div>

        {/* Tenant & Date Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Business:
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
                  onClick={() => setCurrentBusinessId(biz.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Today's Date:
            </span>
            <input
              type="date"
              value={operationalDate}
              onChange={(e) => setOperationalDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Automated Test Results Runner */}
      {testResults && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-base">Suite 23: Phase 5.6 Daily Operations Automated Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 23') || r.suite.includes('Phase 5.6'))
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

      {/* Success Feedback Toast */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3. Operational Timeline View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Operational Timeline View ({operationalDate})</h2>
            <p className="text-xs text-slate-500">Live appointment queue ordered by time slot for {businessNames[currentBusinessId]}.</p>
          </div>

          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono text-xs font-bold">
            {timelineSlots.reduce((acc, s) => acc + s.bookings.length, 0)} Active Bookings
          </span>
        </div>

        <div className="space-y-4">
          {timelineSlots.map((slot) => {
            const hasBookings = slot.bookings.length > 0;

            return (
              <div
                key={slot.timeStr}
                className={`p-4 rounded-2xl border transition-all ${
                  hasBookings ? 'bg-indigo-50/30 border-indigo-200 shadow-sm' : 'bg-slate-50/50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-sm text-indigo-700 bg-white px-3 py-1 rounded-xl border border-indigo-100 shadow-xs">
                      {slot.timeStr}
                    </span>

                    {!hasBookings ? (
                      <span className="text-xs text-slate-400 italic">No appointments at this time slot</span>
                    ) : (
                      <span className="text-xs font-bold text-slate-700">
                        {slot.bookings.length} appointment(s)
                      </span>
                    )}
                  </div>

                  {hasBookings && (
                    <div className="space-y-3 flex-1 md:max-w-3xl">
                      {slot.bookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{b.customerName}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  b.status === 'CONFIRMED'
                                    ? 'bg-amber-100 text-amber-800'
                                    : b.status === 'CHECKED_IN'
                                    ? 'bg-blue-100 text-blue-800'
                                    : b.status === 'IN_PROGRESS'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : b.status === 'COMPLETED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {b.status}
                              </span>
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              {b.items[0]?.nameSnapshot || 'Service'} · {b.duration} mins · Phone: {b.customerPhone}
                            </div>
                          </div>

                          {/* Operational Actions */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {b.status === 'CONFIRMED' && (
                              <>
                                <button
                                  onClick={() => handleAction(b.id, 'CHECK_IN')}
                                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs"
                                >
                                  Check In
                                </button>
                                <button
                                  onClick={() => setNoShowModalBookingId(b.id)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                                >
                                  No Show
                                </button>
                                <button
                                  onClick={() => handleAction(b.id, 'CANCEL')}
                                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold"
                                >
                                  Cancel
                                </button>
                              </>
                            )}

                            {b.status === 'CHECKED_IN' && (
                              <button
                                onClick={() => handleAction(b.id, 'START')}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs"
                              >
                                Start Service
                              </button>
                            )}

                            {b.status === 'IN_PROGRESS' && (
                              <button
                                onClick={() => handleAction(b.id, 'COMPLETE')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs"
                              >
                                Complete
                              </button>
                            )}

                            {['COMPLETED', 'NO_SHOW', 'CANCELLED'].includes(b.status) && (
                              <span className="text-[11px] text-slate-400 italic">Workflow completed</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* No Show Reason Modal */}
      {noShowModalBookingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Mark Appointment as No-Show</h3>
            <p className="text-slate-500 text-xs">Provide an optional reason for marking this customer as a no-show.</p>

            <form onSubmit={handleNoShowSubmit} className="space-y-3">
              <textarea
                rows={3}
                required
                value={noShowReason}
                onChange={(e) => setNoShowReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNoShowModalBookingId(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                >
                  Confirm No-Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
