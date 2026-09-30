import React, { useState } from 'react';
import {
  Wallet,
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
  AlertCircle,
  TrendingUp,
  Percent,
  RefreshCw
} from 'lucide-react';

import { nexoraLedgerService } from '../services/nexoraLedgerService';
import { LedgerEntry } from '../types/nexoraLedger';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase64CommissionLedgerShowcase() {
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // Input states
  const [bookingAmount, setBookingAmount] = useState('1000'); // ₹1,000 default
  const [customBookingId, setCustomBookingId] = useState('bk-ledger-101');
  const [selectedBookingForRefund, setSelectedBookingForRefund] = useState('');
  const [refundAmount, setRefundAmount] = useState('250'); // ₹250 default

  const [feedback, setFeedback] = useState<string | null>(null);

  // Automated Test State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Calculate stats
  const summary = nexoraLedgerService.getSummary(currentBusinessId);
  const netWithdrawable = nexoraLedgerService.calculateNetNexoraBalance(currentBusinessId);
  const entries = nexoraLedgerService.listEntries(currentBusinessId);

  const handleLogPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amtCents = Math.round(parseFloat(bookingAmount) * 100);
    if (isNaN(amtCents) || amtCents <= 0) {
      showFeedback('Please enter a valid booking amount.');
      return;
    }

    const res = nexoraLedgerService.logBookingPayment(currentBusinessId, customBookingId, amtCents);
    if (res.success) {
      showFeedback(`Booking logged! Multi-entry waterfall reconciled perfectly.`);
      setSelectedBookingForRefund(customBookingId);
      // Generate new booking ID for next turn
      setCustomBookingId(`bk-ledger-${Date.now().toString(36).substr(-4)}`);
    } else {
      showFeedback(`Ledger failed zero-sum check: sum was ${res.reconciliationSum} cents.`);
    }
  };

  const handleRefund = (e: React.FormEvent) => {
    e.preventDefault();
    const refundCents = Math.round(parseFloat(refundAmount) * 100);
    if (isNaN(refundCents) || refundCents <= 0) {
      showFeedback('Please enter a valid refund amount.');
      return;
    }

    if (!selectedBookingForRefund) {
      showFeedback('Please log a payment first or specify booking ID.');
      return;
    }

    const res = nexoraLedgerService.logRefund(currentBusinessId, selectedBookingForRefund, refundCents);
    if (res.success) {
      showFeedback(`Refund recorded on ledger! Commission and withdrawal reduced.`);
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
              <Wallet className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 6.4 — Commission & Withdrawal Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Centralized Commission Waterfall & Safe Minor-Unit Ledger
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Enforce strict financial waterfall rules. All incoming Nexora QR collections generate exactly paired, zero-sum entries spanning Collection pool, Platform Commission (10%), and Business Keep (15%).
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
              <span>Run Suite 31 Tests</span>
            </button>
          </div>
        </div>

        {/* Tenant Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Active Business Ledger:
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
              <h3 className="font-bold text-base">Suite 31: Phase 6.4 Commission Ledger Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 31') || r.suite.includes('Phase 6.4'))
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

      {/* 3. Live Business Admin Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Gross Booking value', val: summary.grossBookingCents, color: 'text-slate-900', bg: 'bg-white border border-slate-200' },
          { label: 'Direct Collections (75%)', val: summary.directCollectionCents, color: 'text-emerald-600', bg: 'bg-white border border-slate-200' },
          { label: 'Nexora Collections (25%)', val: summary.nexoraCollectionCents, color: 'text-indigo-600', bg: 'bg-indigo-50/50 border border-indigo-100' },
          { label: 'Platform Commission (10%)', val: summary.platformCommissionCents, color: 'text-violet-600', bg: 'bg-violet-50/50 border border-violet-100' },
          { label: 'Business Keep / Withdrawable', val: netWithdrawable, color: 'text-sky-600', bg: 'bg-sky-50 border border-sky-100' }
        ].map((card, idx) => (
          <div key={idx} className={`p-4 rounded-xl shadow-xs space-y-1 ${card.bg}`}>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{card.label}</span>
            <div className={`text-lg font-extrabold font-mono ${card.color}`}>
              ₹{(card.val / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Operations Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Forms */}
        <div className="lg:col-span-5 space-y-6">
          {/* Record Booking Payment */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-600" />
              <span>Record Booking Revenue</span>
            </h2>

            <form onSubmit={handleLogPayment} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Booking ID</label>
                <input
                  type="text"
                  required
                  value={customBookingId}
                  onChange={(e) => setCustomBookingId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Total Booking Value (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={bookingAmount}
                  onChange={(e) => setBookingAmount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
              >
                Log Revenue & Waterfall Split
              </button>
            </form>
          </div>

          {/* Refund Ledger Card */}
          {entries.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-slate-900 text-base">Record Refund Reductions</h2>

              <form onSubmit={handleRefund} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Select Booking ID</label>
                  <input
                    type="text"
                    required
                    value={selectedBookingForRefund}
                    onChange={(e) => setSelectedBookingForRefund(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Refund Nexora Portion (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Standard refund value deducted from ledger balances.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
                >
                  Record Refund Entry
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Side: Ledger Table with Zero-Sum verification */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Reconciled Minor-Unit Account Ledger</h2>
                <p className="text-xs text-slate-500">Dual entry matching system following exact audit procedures.</p>
              </div>

              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                Total Logs: {entries.length}
              </span>
            </div>

            {entries.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                Ledger is empty. Log booking revenue payments to record entries.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold">
                      <th className="py-2.5 px-2">Entry ID</th>
                      <th className="py-2.5 px-2">Booking ID</th>
                      <th className="py-2.5 px-2">Type</th>
                      <th className="py-2.5 px-2 text-right">Debit</th>
                      <th className="py-2.5 px-2 text-right">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-800">
                    {entries.map((entry) => {
                      const isDebit = entry.amountCents < 0;
                      return (
                        <tr key={entry.entryId} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-2 font-mono font-bold text-slate-500">{entry.entryId}</td>
                          <td className="py-2.5 px-2 font-mono font-bold text-slate-700">{entry.bookingId}</td>
                          <td className="py-2.5 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              entry.type === 'NEXORA_COLLECTION'
                                ? 'bg-indigo-100 text-indigo-800'
                                : entry.type === 'PLATFORM_COMMISSION'
                                ? 'bg-violet-100 text-violet-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}>
                              {entry.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-rose-600">
                            {isDebit ? `₹${(Math.abs(entry.amountCents) / 100).toFixed(2)}` : '-'}
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-emerald-600 font-bold">
                            {!isDebit ? `₹${(entry.amountCents / 100).toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
