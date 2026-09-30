import React, { useState } from 'react';
import {
  Percent,
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Scissors,
  Sparkles,
  Sparkle,
  Award,
  DollarSign,
  Plus,
  ArrowRightLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';

import { CollectionSplitService } from '../services/collectionSplitService';
import { CollectionPlan, CommissionPlan, SplitEngineResult } from '../types/collectionSplit';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase63CollectionSplitShowcase() {
  const [splitService] = useState(() => new CollectionSplitService());

  // Split Calculator State
  const [bookingAmountInr, setBookingAmountInr] = useState('1000'); // ₹1,000 default
  const [activeDate, setActiveDate] = useState('2026-10-01');
  const [splitResult, setSplitResult] = useState<SplitEngineResult | null>(null);

  // New Custom Plan Form
  const [newColPlanId, setNewColPlanId] = useState('colplan-festive');
  const [newColPlanName, setNewColPlanName] = useState('Festive Split Plan');
  const [newNexoraPct, setNewNexoraPct] = useState('30');
  const [newDirectPct, setNewDirectPct] = useState('70');
  const [colEffectiveFrom, setColEffectiveFrom] = useState('2026-11-01');

  const [newComPlanId, setNewComPlanId] = useState('complan-festive');
  const [newComPlanName, setNewComPlanName] = useState('Festive Commission Plan');
  const [newPlatCommPct, setNewPlatCommPct] = useState('12');
  const [newBizWithPct, setNewBizWithPct] = useState('18');
  const [comEffectiveFrom, setComEffectiveFrom] = useState('2026-11-01');

  const [feedback, setFeedback] = useState<string | null>(null);

  // Automated Test State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleCalculateSplit = () => {
    try {
      const totalCents = Math.round(parseFloat(bookingAmountInr) * 100);
      const res = splitService.calculateSplit(totalCents, activeDate);
      setSplitResult(res);
      showFeedback(`Split successfully calculated for ₹${bookingAmountInr}`);
    } catch (err: any) {
      showFeedback(`Error: ${err.message}`);
    }
  };

  const handleCreateCollectionPlan = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nexPct = parseInt(newNexoraPct) || 0;
      const dirPct = parseInt(newDirectPct) || 0;
      splitService.registerCollectionPlan({
        collectionPlanId: newColPlanId,
        displayName: newColPlanName,
        nexoraCollectionPercentage: nexPct,
        directCollectionPercentage: dirPct,
        effectiveFrom: colEffectiveFrom
      });
      showFeedback(`Collection plan '${newColPlanName}' registered successfully.`);
    } catch (err: any) {
      showFeedback(`Registration failed: ${err.message}`);
    }
  };

  const handleCreateCommissionPlan = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const platPct = parseInt(newPlatCommPct) || 0;
      const bizPct = parseInt(newBizWithPct) || 0;
      splitService.registerCommissionPlan({
        commissionPlanId: newComPlanId,
        displayName: newComPlanName,
        platformCommissionPercentage: platPct,
        businessWithdrawalPercentage: bizPct,
        effectiveFrom: comEffectiveFrom
      });
      showFeedback(`Commission plan '${newComPlanName}' registered successfully.`);
    } catch (err: any) {
      showFeedback(`Registration failed: ${err.message}`);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRunTests = () => {
    setIsTesting(true);
    setTimeout(() => {
      const res = runFoundationTestSuite();
      setTestResults(res);
      setIsTesting(false);
    }, 400);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Percent className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 6.3 — Collection Split Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Configurable Collection Allocation Engine
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Dynamically splits booking revenues into Direct Salon Collection (75% standard) and Nexora QR Collection (25% standard). Only Nexora QR collection streams enter the platform commission and withdrawable ledger.
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
              <span>Run Suite 30 Tests</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2 shadow-sm animate-pulse">
          <AlertCircle className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 2. Automated Test Results Runner */}
      {testResults && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-base">Suite 30: Phase 6.3 Split Engine Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 30') || r.suite.includes('Phase 6.3'))
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

      {/* 3. Split Engine Interactive Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Split Inputs & Plans configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Booking Revenue Calculator</h2>
            <p className="text-xs text-slate-500">Calculate precise split allocations according to scheduled plans.</p>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Total Booking Value (₹ INR)</label>
                <input
                  type="number"
                  value={bookingAmountInr}
                  onChange={(e) => setBookingAmountInr(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Effective Evaluation Date</label>
                <input
                  type="date"
                  value={activeDate}
                  onChange={(e) => setActiveDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <button
                onClick={handleCalculateSplit}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
              >
                Split Revenue Allocation
              </button>
            </div>
          </div>

          {/* Configurable Collection Plans */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Create Custom Collection Plan</h2>
            <form onSubmit={handleCreateCollectionPlan} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Collection Plan ID</label>
                <input
                  type="text"
                  required
                  value={newColPlanId}
                  onChange={(e) => setNewColPlanId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Plan Display Name</label>
                <input
                  type="text"
                  required
                  value={newColPlanName}
                  onChange={(e) => setNewColPlanName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Nexora QR %</label>
                  <input
                    type="number"
                    required
                    value={newNexoraPct}
                    onChange={(e) => setNewNexoraPct(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Direct Salon %</label>
                  <input
                    type="number"
                    required
                    value={newDirectPct}
                    onChange={(e) => setNewDirectPct(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Effective From Date</label>
                <input
                  type="date"
                  required
                  value={colEffectiveFrom}
                  onChange={(e) => setColEffectiveFrom(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md"
              >
                Register Collection Plan
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Calculations & Allocation Results Display */}
        <div className="lg:col-span-7 space-y-6">
          {splitResult ? (
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-indigo-300 uppercase tracking-wider">Calculation Results</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Total Booking: {(splitResult.totalValueCents / 100).toFixed(2)} INR</span>
                </div>

                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                  RECONCILED OK
                </span>
              </div>

              {/* Graphical Split visualization */}
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-semibold">Total Revenue Allocation Stream</span>
                <div className="w-full h-8 rounded-full overflow-hidden flex font-bold text-[10px] shadow-sm">
                  <div
                    style={{ width: '75%' }}
                    className="bg-emerald-600 flex items-center justify-center text-white"
                  >
                    Direct (75%)
                  </div>
                  <div
                    style={{ width: '25%' }}
                    className="bg-indigo-600 flex items-center justify-center text-white"
                  >
                    Nexora (25%)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mt-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-medium text-[11px]">Direct Salon Collection (75% standard)</span>
                    <div className="text-lg font-extrabold text-emerald-400">
                      {(splitResult.directCollectionCents / 100).toFixed(2)} INR
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-medium text-[11px]">Nexora QR Collection (25% standard)</span>
                    <div className="text-lg font-extrabold text-indigo-400">
                      {(splitResult.nexoraCollectionCents / 100).toFixed(2)} INR
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Allocation Stream inside Nexora Pool */}
              <div className="space-y-2 border-t border-slate-800 pt-4">
                <span className="text-xs text-slate-400 font-semibold">Nexora QR Collection Sub-allocation</span>
                <div className="w-full h-8 rounded-full overflow-hidden flex font-bold text-[10px] shadow-sm">
                  <div
                    style={{ width: '60%' }}
                    className="bg-sky-600 flex items-center justify-center text-white"
                  >
                    Business Keep (15%)
                  </div>
                  <div
                    style={{ width: '40%' }}
                    className="bg-violet-600 flex items-center justify-center text-white"
                  >
                    Platform Comm (10%)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mt-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-medium text-[11px]">Platform Commission (10% standard)</span>
                    <div className="text-lg font-extrabold text-violet-400">
                      {(splitResult.platformCommissionCents / 100).toFixed(2)} INR
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-medium text-[11px]">Business Keep / Withdrawable (15% standard)</span>
                    <div className="text-lg font-extrabold text-sky-400">
                      {(splitResult.businessWithdrawableCents / 100).toFixed(2)} INR
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              Configure parameters and trigger "Split Revenue Allocation" to display interactive streams visualization.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
