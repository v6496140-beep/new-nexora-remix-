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
  RefreshCw,
  Clock,
  Settings,
  AlertCircle,
  Lock,
  ArrowRightLeft,
  Calendar,
  FileText,
  TrendingDown,
  Percent,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

import { nexoraWalletService } from '../services/nexoraWalletService';
import { WalletLedgerEntry } from '../types/nexoraWallet';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase66WalletShowcase() {
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // Input states
  const [bookingId, setBookingId] = useState('bk-wal-101');
  const [bookingAmountInr, setBookingAmountInr] = useState('1000');

  const [refundBookingId, setRefundBookingId] = useState('bk-seed-01');
  const [refundAmountInr, setRefundAmountInr] = useState('250');

  const [chargebackBookingId, setChargebackBookingId] = useState('bk-seed-01');
  const [chargebackAmountInr, setChargebackAmountInr] = useState('250');

  const [withdrawalAmountInr, setWithdrawalAmountInr] = useState('150');

  // Statements Filters
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-10-31');

  const [feedback, setFeedback] = useState<string | null>(null);

  // Automated Test State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Dynamic values
  const wallet = nexoraWalletService.getBusinessWallet(currentBusinessId);
  const statement = nexoraWalletService.generateStatement(currentBusinessId, startDate, endDate);
  const entries = nexoraWalletService.listEntries(currentBusinessId);

  const handleRecordBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const amtCents = Math.round(parseFloat(bookingAmountInr) * 100);
    if (isNaN(amtCents) || amtCents <= 0) {
      showFeedback('Please enter a valid amount.');
      return;
    }

    nexoraWalletService.recordImmutableBooking(currentBusinessId, bookingId, amtCents);
    showFeedback(`Immutable booking logged! Proportional splits credited to wallet.`);
    setBookingId(`bk-wal-${Math.random().toString(36).substr(2, 4)}`);
  };

  const handleRefund = (e: React.FormEvent) => {
    e.preventDefault();
    const refundCents = Math.round(parseFloat(refundAmountInr) * 100);
    if (isNaN(refundCents) || refundCents <= 0) {
      showFeedback('Please enter a valid refund amount.');
      return;
    }

    const ok = nexoraWalletService.processRefund(currentBusinessId, refundBookingId, refundCents);
    if (ok) {
      showFeedback(`Refund corrective entries appended to ledger. Wallet balance adjusted.`);
    }
  };

  const handleChargeback = (e: React.FormEvent) => {
    e.preventDefault();
    const chgCents = Math.round(parseFloat(chargebackAmountInr) * 100);
    if (isNaN(chgCents) || chgCents <= 0) {
      showFeedback('Please enter a valid amount.');
      return;
    }

    nexoraWalletService.receiveChargeback(currentBusinessId, chargebackBookingId, chgCents);
    showFeedback(`Chargeback logged. Wallet adjusted and security lock penalty applied.`);
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const withCents = Math.round(parseFloat(withdrawalAmountInr) * 100);
    if (isNaN(withCents) || withCents <= 0) {
      showFeedback('Please enter a valid amount.');
      return;
    }

    if (withCents > wallet.availableCents) {
      showFeedback(`Insufficient available balance! Maximum withdrawal: ₹${(wallet.availableCents / 100).toFixed(2)}`);
      return;
    }

    nexoraWalletService.recordWithdrawal(currentBusinessId, withCents);
    showFeedback(`Withdrawal successful! Payout dispatched.`);
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
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 6.6 — Immutable Financial Ledger & Wallet</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Immutable corrective transaction entries & Business Wallet view
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Auditable double-entry accounting. Corrective transaction records safeguard historical immutability. Tracks commissions, reversals, refunds, and chargebacks with zero-sum reconciliation structures.
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
              <span>Run Suite 33 Tests</span>
            </button>
          </div>
        </div>

        {/* Tenant Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Active Business:
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
              <h3 className="font-bold text-base">Suite 33: Phase 6.6 Wallet & Ledger Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 33') || r.suite.includes('Phase 6.6'))
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

      {/* 3. Wallet Breakdowns row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {[
          { label: 'Available', val: wallet.availableCents, color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-100' },
          { label: 'Pending (Escrow)', val: wallet.pendingCents, color: 'text-amber-600', bg: 'bg-amber-50 border border-amber-100' },
          { label: 'Withdrawn Total', val: wallet.withdrawnCents, color: 'text-slate-700', bg: 'bg-slate-50 border border-slate-100' },
          { label: 'Platform Commission', val: wallet.commissionPaidCents, color: 'text-violet-600', bg: 'bg-violet-50/50 border border-violet-100' },
          { label: 'Refund Adjustments', val: wallet.refundAdjustmentsCents, color: 'text-indigo-600', bg: 'bg-indigo-50/50 border border-indigo-100' },
          { label: 'Chargebacks Penalty', val: wallet.chargebacksCents, color: 'text-rose-600', bg: 'bg-rose-50 border border-rose-100' },
          { label: 'Reversals Back', val: wallet.reversalsCents, color: 'text-sky-600', bg: 'bg-sky-50 border border-sky-100' }
        ].map((card, i) => (
          <div key={i} className={`p-4 rounded-xl shadow-xs space-y-1 ${card.bg}`}>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block leading-tight">{card.label}</span>
            <div className={`text-base font-extrabold font-mono ${card.color}`}>
              ₹{(card.val / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Financial Statements & Date Filter View */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Business Account Statements Ledger</span>
            </h3>
            <p className="text-xs text-slate-400">Generate auditable, dates-filtered statements matching closing balances.</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
            <span>Filter Period:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-white"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
          <div className="p-3 bg-slate-950 rounded-xl space-y-1 border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase">Opening Balance</span>
            <div className="text-base font-bold text-slate-200">
              ₹{(statement.openingBalanceCents / 100).toFixed(2)}
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl space-y-1 border border-slate-800">
            <span className="text-emerald-400 text-[10px] uppercase">Credits (+)</span>
            <div className="text-base font-bold text-emerald-400">
              ₹{(statement.creditsCents / 100).toFixed(2)}
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl space-y-1 border border-slate-800">
            <span className="text-rose-400 text-[10px] uppercase">Debits (-)</span>
            <div className="text-base font-bold text-rose-400">
              ₹{(statement.debitsCents / 100).toFixed(2)}
            </div>
          </div>
          <div className="p-3 bg-indigo-950/40 rounded-xl space-y-1 border border-indigo-900/50">
            <span className="text-indigo-300 text-[10px] uppercase">Closing Balance</span>
            <div className="text-lg font-extrabold text-indigo-300">
              ₹{(statement.closingBalanceCents / 100).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Workspace Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side forms panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Record Booking */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingDown className="w-4.5 h-4.5 text-indigo-600" />
              <span>Record Booking Payment</span>
            </h3>

            <form onSubmit={handleRecordBooking} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Booking ID</label>
                  <input
                    type="text"
                    required
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Total Value (INR)</label>
                  <input
                    type="number"
                    required
                    value={bookingAmountInr}
                    onChange={(e) => setBookingAmountInr(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
              >
                Log Immutable Payment
              </button>
            </form>
          </div>

          {/* Corrective Refunds Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Initiate Proportional Refund</h3>

            <form onSubmit={handleRefund} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Booking ID</label>
                  <input
                    type="text"
                    required
                    value={refundBookingId}
                    onChange={(e) => setRefundBookingId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Refund Portion (INR)</label>
                  <input
                    type="number"
                    required
                    value={refundAmountInr}
                    onChange={(e) => setRefundAmountInr(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
              >
                Inject Corrective Refund Entries
              </button>
            </form>
          </div>

          {/* Chargebacks Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Log Received Chargeback Penalty</h3>

            <form onSubmit={handleChargeback} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Booking ID Reference</label>
                  <input
                    type="text"
                    required
                    value={chargebackBookingId}
                    onChange={(e) => setChargebackBookingId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Disputed Amount (INR)</label>
                  <input
                    type="number"
                    required
                    value={chargebackAmountInr}
                    onChange={(e) => setChargebackAmountInr(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs"
              >
                Log Chargeback Penalty
              </button>
            </form>
          </div>

          {/* Manual Wallet Withdrawal Cashout */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Perform Wallet Withdrawal</h3>

            <form onSubmit={handleWithdrawal} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Withdraw Amount (INR)</label>
                <input
                  type="number"
                  required
                  value={withdrawalAmountInr}
                  onChange={(e) => setWithdrawalAmountInr(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs"
              >
                Withdraw Funds
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Immutable Audit Trail Table */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Immutable Audit Trail</h3>
                <p className="text-xs text-slate-500">Every financial movement generates paired corrective entries.</p>
              </div>

              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-indigo-600" />
                IMMUTABLE HISTORIC LOG
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-bold">
                    <th className="py-2.5 px-2">Booking ID</th>
                    <th className="py-2.5 px-2">Flow Type</th>
                    <th className="py-2.5 px-2 text-right">Debit</th>
                    <th className="py-2.5 px-2 text-right">Credit</th>
                    <th className="py-2.5 px-2">Audit Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-800">
                  {entries.slice().reverse().map((entry) => {
                    const isDebit = entry.amountCents < 0;
                    return (
                      <tr key={entry.entryId} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-2 font-mono text-slate-700 font-bold">{entry.bookingId}</td>
                        <td className="py-2.5 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            entry.type === 'NEXORA_COLLECTION'
                              ? 'bg-indigo-100 text-indigo-800'
                              : entry.type === 'PLATFORM_COMMISSION'
                              ? 'bg-violet-100 text-violet-800'
                              : entry.type === 'BUSINESS_WITHDRAWABLE'
                              ? 'bg-sky-100 text-sky-800'
                              : entry.type === 'REFUND'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-orange-100 text-orange-800'
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
                        <td className="py-2.5 px-2 text-slate-500 text-[10px] max-w-xs truncate">{entry.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
