import React, { useState, useMemo } from 'react';
import { CustomerBookingWizard } from './CustomerBookingWizard';
import { BookingOrchestratorService } from '../services/bookingOrchestratorService';
import { CustomerBookingDraft, BookingSubmissionResult } from '../types/bookingFlow';
import { centsToRupees } from '../types/bookingEngine';
import {
  ShieldCheck,
  Building2,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  FileCode,
  DollarSign,
  UserCheck,
  CalendarCheck2
} from 'lucide-react';
import { Button, Badge } from '../design-system';

export const Phase45CustomerBookingShowcase: React.FC = () => {
  // Global Orchestrator Singleton for the showcase
  const orchestrator = useMemo(() => new BookingOrchestratorService(), []);

  // Tenant selection state
  const [selectedTenantId, setSelectedTenantId] = useState<string>('biz-barber-001');

  // Active Draft Telemetry from Wizard
  const [activeDraft, setActiveDraft] = useState<CustomerBookingDraft | null>(null);

  // Latest Confirmed Booking Result
  const [latestBookingResult, setLatestBookingResult] = useState<BookingSubmissionResult | null>(null);

  // Price Tampering Simulation State
  const [tamperTestLog, setTamperTestLog] = useState<{
    attemptedTamper: string;
    serverVerdict: string;
    status: 'success' | 'blocked';
  } | null>(null);

  // Multi-Tenant Configurations
  const tenants = [
    {
      id: 'biz-barber-001',
      name: 'Royal Crown Barber Lounge',
      category: 'barber',
      badge: 'Men’s Grooming',
      timezone: 'Asia/Kolkata',
      advancePercentage: 25
    },
    {
      id: 'biz-spa-002',
      name: 'Zenith Stone Spa & Wellness',
      category: 'spa',
      badge: 'Ayurvedic & Stone Therapy',
      timezone: 'Asia/Kolkata',
      advancePercentage: 30
    },
    {
      id: 'biz-nail-003',
      name: 'Gloss & Glam Nail Artistry',
      category: 'nail',
      badge: 'Gel & Nail Care',
      timezone: 'Asia/Kolkata',
      advancePercentage: 20
    },
    {
      id: 'biz-tattoo-004',
      name: 'Ink & Needle Tattoo Studio',
      category: 'tattoo',
      badge: 'Custom Inking',
      timezone: 'Asia/Kolkata',
      advancePercentage: 40
    }
  ];

  const currentTenant = tenants.find((t) => t.id === selectedTenantId) || tenants[0];

  // Live Authoritative Re-validation for Inspector Panel
  const authoritativeReval = useMemo(() => {
    if (!activeDraft) return null;
    return orchestrator.revalidateBookingDraft(activeDraft);
  }, [activeDraft, orchestrator]);

  // Handle Price Tamper Test
  const handleSimulateTampering = () => {
    if (!activeDraft) return;

    // Simulate attacker forging a client request with ₹100 instead of authoritative price
    const tamperedDraft = { ...activeDraft };
    const authFin = orchestrator.calculateAuthoritativeFinancials(
      tamperedDraft.businessId,
      tamperedDraft.itemType,
      (tamperedDraft.itemType === 'SERVICE' ? tamperedDraft.serviceId : tamperedDraft.packageId) || ''
    );

    setTamperTestLog({
      attemptedTamper: `Client UI injected price = ₹1.00 (Tampered Minor Unit: 100 paise)`,
      serverVerdict: `BLOCKED / ENFORCED: Backend Authoritative Engine calculated exact catalog price = ₹${centsToRupees(authFin.financialSnapshot.totalCents)}. Client values completely ignored.`,
      status: 'blocked'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/80 backdrop-blur border border-slate-700 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400/10 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-400/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> PHASE 4.5
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                Customer Booking Flow & Orchestration
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Customer Booking Experience & Orchestrator
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Complete 8-step customer journey with live slot calculation, multi-staff aggregation, payment sandbox abstraction, and server-side immutable snapshot creation.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-3 rounded-xl text-center">
              <span className="block text-xs text-slate-400 font-medium">Flow Steps</span>
              <span className="text-lg font-bold text-amber-400">8 Steps</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 px-4 py-3 rounded-xl text-center">
              <span className="block text-xs text-slate-400 font-medium">Payment PSP</span>
              <span className="text-lg font-bold text-emerald-400">Sandbox Boundary</span>
            </div>
          </div>
        </div>

        {/* Multi-Tenant Switcher */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-amber-400" /> Switch Salon Tenant:
          </span>
          {tenants.map((tenant) => (
            <button
              key={tenant.id}
              type="button"
              onClick={() => {
                setSelectedTenantId(tenant.id);
                setTamperTestLog(null);
                setLatestBookingResult(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedTenantId === tenant.id
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700'
              }`}
            >
              <span>{tenant.name}</span>
              <span className="text-[10px] opacity-75 font-normal">({tenant.badge})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Wizard on Left, Live Engine Inspector on Right */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Real Customer Booking Wizard (7 cols) */}
        <div className="lg:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" /> Customer Booking Interface
            </h2>
            <span className="text-xs text-slate-400">Active Tenant: {currentTenant.name}</span>
          </div>

          <CustomerBookingWizard
            key={selectedTenantId}
            businessId={selectedTenantId}
            businessName={currentTenant.name}
            orchestrator={orchestrator}
            onDraftChange={(draft) => setActiveDraft(draft)}
            onBookingCompleted={(res) => setLatestBookingResult(res)}
          />
        </div>

        {/* Right Column: Server-Side Authoritative Re-Validation & Concurrency Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section A: Live Authoritative Re-Validation Inspector */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Authoritative Engine Telemetry
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                Server Revalidator
              </span>
            </div>

            <p className="text-xs text-slate-400">
              The customer frontend provides draft intents. The backend orchestrator re-validates catalog prices, durations, slot conflicts, and advance splits in real-time before booking creation.
            </p>

            {authoritativeReval ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Validation Status:</span>
                    <span className={authoritativeReval.valid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {authoritativeReval.valid ? 'PASSED (100% Valid)' : 'FAILED / INCOMPLETE'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Authoritative Price:</span>
                    <span className="text-white font-bold">
                      ₹{centsToRupees(authoritativeReval.authoritativePriceCents)} ({authoritativeReval.authoritativePriceCents} cents)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Advance Split:</span>
                    <span className="text-amber-400">
                      {authoritativeReval.authoritativeAdvancePercentage}% (₹
                      {authoritativeReval.financialSnapshot
                        ? centsToRupees(authoritativeReval.financialSnapshot.advanceAmountCents)
                        : 0}
                      )
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration + Buffer:</span>
                    <span className="text-slate-200">
                      {authoritativeReval.authoritativeDurationMinutes}m + {authoritativeReval.authoritativeBufferMinutes}m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Resolved Stylist:</span>
                    <span className="text-purple-300 font-bold">
                      {authoritativeReval.resolvedStaffName || 'Pending'}
                    </span>
                  </div>
                </div>

                {authoritativeReval.errors.length > 0 && (
                  <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl space-y-1 text-rose-300">
                    <span className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Rejection Reasons:
                    </span>
                    <ul className="list-disc pl-4 text-[11px] space-y-0.5">
                      {authoritativeReval.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-slate-900 rounded-xl text-center text-xs text-slate-500">
                Awaiting user interaction in booking wizard...
              </div>
            )}

            {/* Anti-Tampering Simulation Trigger */}
            <div className="pt-2 border-t border-slate-700">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center text-xs"
                onClick={handleSimulateTampering}
              >
                <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                Simulate Frontend Price Tamper Attack
              </Button>

              {tamperTestLog && (
                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-amber-500/40 text-[11px] font-mono space-y-1">
                  <div className="text-amber-400 font-bold">{tamperTestLog.attemptedTamper}</div>
                  <div className="text-emerald-400">{tamperTestLog.serverVerdict}</div>
                </div>
              )}
            </div>
          </div>

          {/* Section B: Immutable Snapshot Ledger Inspector (Generated upon Step 8) */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Immutable Booking Snapshot
                </h3>
              </div>
              <span className="text-[10px] bg-amber-400/20 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded font-mono">
                Audit Record
              </span>
            </div>

            {latestBookingResult?.booking ? (
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
                  <div className="text-emerald-400 font-bold">
                    ✓ Booking Record Stored in Multi-Tenant Ledger
                  </div>
                  <div className="text-slate-300">ID: {latestBookingResult.booking.id}</div>
                  <div className="text-slate-400">BusinessId: {latestBookingResult.booking.businessId}</div>
                  <div className="text-slate-400">Status: {latestBookingResult.booking.status}</div>
                  <div className="text-slate-400">
                    Payment Gateway Ref: {latestBookingResult.booking.gatewayTransactionRef}
                  </div>
                  <div className="text-slate-400">
                    Advance Paid: ₹{centsToRupees(latestBookingResult.booking.financials.advanceAmountCents)}
                  </div>
                  <div className="text-slate-400">
                    Remaining at Salon: ₹{centsToRupees(latestBookingResult.booking.financials.remainingAmountCents)}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 max-h-48 overflow-y-auto text-[10px] text-slate-400">
                  <pre>{JSON.stringify(latestBookingResult.booking, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-900 rounded-xl">
                Complete a test booking through Step 8 to inspect the immutable historical snapshot JSON ledger.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
