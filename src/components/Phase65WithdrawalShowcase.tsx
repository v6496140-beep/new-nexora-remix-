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
  HelpCircle,
  FileSpreadsheet,
  Check,
  ArrowRight
} from 'lucide-react';

import { withdrawalEngineService } from '../services/withdrawalEngineService';
import { WithdrawalBatch, PayoutSettings } from '../types/withdrawalEngine';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase65WithdrawalShowcase() {
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // Interactive Generator Inputs
  const [paymentId, setPaymentId] = useState('pay-gen-101');
  const [paymentAmountInr, setPaymentAmountInr] = useState('1000');
  const [paymentState, setPaymentState] = useState<'PENDING' | 'AVAILABLE'>('AVAILABLE');

  // Batch Cutoff simulate State
  const [cutoffDate, setCutoffDate] = useState('2026-10-01');

  // Manual trigger states
  const [feedback, setFeedback] = useState<string | null>(null);

  // Automated Test State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Load service state data
  const settings = withdrawalEngineService.getSettings(currentBusinessId);
  const balance = withdrawalEngineService.getBalanceSummary(currentBusinessId);
  const batches = withdrawalEngineService.listBatches(currentBusinessId);

  // Manual state toggler helper
  const [manualWithdrawal, setManualWithdrawal] = useState(settings.manualWithdrawalEnabled);

  const handleToggleManualMode = (val: boolean) => {
    withdrawalEngineService.updateManualWithdrawalMode(currentBusinessId, val);
    setManualWithdrawal(val);
    showFeedback(`Manual Withdrawal mode ${val ? 'ENABLED' : 'DISABLED'} for business.`);
  };

  const handleGeneratePaymentTrack = () => {
    const amtCents = Math.round(parseFloat(paymentAmountInr) * 100);
    if (isNaN(amtCents) || amtCents <= 0) {
      showFeedback('Please enter a valid amount.');
      return;
    }

    withdrawalEngineService.registerPaymentTrack({
      paymentId,
      businessId: currentBusinessId,
      amountCents: amtCents,
      state: paymentState
    });

    showFeedback(`Payment tracked successfully with ${paymentState} eligibility state.`);
    // Rotate payment ID
    setPaymentId(`pay-gen-${Math.random().toString(36).substr(2, 4)}`);
  };

  const handleTrigger10PMCutoff = () => {
    try {
      const batch = withdrawalEngineService.createDailyCutoffBatch(currentBusinessId, cutoffDate);
      if (batch) {
        showFeedback(`10:00 PM cutoff triggered successfully. Daily batch created.`);
      } else {
        showFeedback(`No eligible AVAILABLE balance to extract into a batch at this cutoff.`);
      }
    } catch (err: any) {
      showFeedback(`Cutoff Blocked: ${err.message}`);
    }
  };

  const handleTriggerManualPayout = () => {
    if (!settings.manualWithdrawalEnabled) {
      showFeedback(`Manual withdrawal is disabled. Switch setting configuration first.`);
      return;
    }
    try {
      const batch = withdrawalEngineService.createDailyCutoffBatch(currentBusinessId, `man-${Date.now().toString(36).substr(-4)}`);
      if (batch) {
        showFeedback(`Manual payout request initiated for available balance.`);
      } else {
        showFeedback(`No eligible AVAILABLE balance to withdraw.`);
      }
    } catch (err: any) {
      showFeedback(`Payout Blocked: ${err.message}`);
    }
  };

  const handlePayoutSuccess = (batchId: string) => {
    const mockUtr = `UTR-${Date.now().toString().substr(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    withdrawalEngineService.confirmPayoutSuccess(batchId, mockUtr);
    showFeedback(`Payout confirmed with reference UTR: ${mockUtr}`);
  };

  const handlePayoutFailed = (batchId: string, policy: 'RETURN_AVAILABLE' | 'HOLD') => {
    withdrawalEngineService.markPayoutFailed(batchId, policy);
    showFeedback(`Payout failure handled. Policy: ${policy === 'RETURN_AVAILABLE' ? 'Returned to AVAILABLE pool' : 'Flagged as ON_HOLD'}`);
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
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 6.5 — Daily Business Withdrawal Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Eligible Withdrawal Tracks & Rollback Recovery Gateway
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Differentiate balance eligibility tracks (Pending, Available, Processing, Paid) to secure payouts. Daily 10:00 PM cutoff triggers automatic batches with full safety state recovery policies.
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
              <span>Run Suite 32 Tests</span>
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
                onClick={() => {
                  setCurrentBusinessId(biz.id);
                  setManualWithdrawal(withdrawalEngineService.getSettings(biz.id).manualWithdrawalEnabled);
                }}
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
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2 shadow-sm">
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
              <h3 className="font-bold text-base">Suite 32: Phase 6.5 Withdrawal Engine Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 32') || r.suite.includes('Phase 6.5'))
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

      {/* 3. Balances & Withdrawal Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Balance Status Cards & manual switches */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Wallet className="w-4.5 h-4.5 text-indigo-600" />
              <span>Withdrawal Balance Tracks</span>
            </h2>

            {/* Breakdowns */}
            <div className="space-y-4 text-xs font-medium">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Current balance</span>
                  <div className="text-base font-extrabold text-slate-900 font-mono">
                    ₹{(balance.currentBalance / 100).toFixed(2)}
                  </div>
                </div>
                <div className="px-2 py-1 rounded bg-slate-200/60 text-slate-700 text-[10px] font-bold">
                  Tracked Earnings
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-amber-700 text-[10px] font-bold uppercase tracking-wider">Pending Balance</span>
                  <div className="text-base font-extrabold text-amber-800 font-mono">
                    ₹{(balance.pendingBalance / 100).toFixed(2)}
                  </div>
                </div>
                <div className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                  In Escrow
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Available balance</span>
                  <div className="text-base font-extrabold text-emerald-800 font-mono">
                    ₹{(balance.availableBalance / 100).toFixed(2)}
                  </div>
                </div>
                <div className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Cleared Payout
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  Scheduled Payout:
                </span>
                <span className="font-bold text-slate-800">{settings.nextWithdrawalTime} Daily</span>
              </div>
            </div>
          </div>

          {/* Secure Settings Configuration */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-600" />
              <span>Withdrawal Gate Configuration</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Manual Withdrawal Access</div>
                  <div className="text-[10px] text-slate-400">Override 10 PM daily batch rule</div>
                </div>

                <button
                  onClick={() => handleToggleManualMode(!manualWithdrawal)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                    manualWithdrawal ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform duration-200 ease-in-out ${
                      manualWithdrawal ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium text-[10px] uppercase">Tokenized Payout Identifier</span>
                <div className="font-mono font-bold text-indigo-600 truncate">{settings.secureBankReferenceToken}</div>
                <span className="text-[9px] text-slate-400">Sensitive raw banking credentials are never exposed.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Col: Payout simulators and history lists */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Tracks Generator */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-slate-900 text-base">Mock Payment Track Simulator</h2>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Payment ID Reference</label>
                  <input
                    type="text"
                    value={paymentId}
                    onChange={(e) => setPaymentId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Amount (₹ INR)</label>
                    <input
                      type="number"
                      value={paymentAmountInr}
                      onChange={(e) => setPaymentAmountInr(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Initial Track State</label>
                    <select
                      value={paymentState}
                      onChange={(e) => setPaymentState(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      <option value="AVAILABLE">AVAILABLE (Cleared)</option>
                      <option value="PENDING">PENDING (In Escrow)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGeneratePaymentTrack}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md"
                >
                  Register track payment
                </button>
              </div>
            </div>

            {/* Triggers Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-slate-900 text-base">Trigger Cutoff / Payout</h2>
              <div className="space-y-4 text-xs">
                {/* 10 PM Batch Cutoff */}
                <div className="space-y-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">10:00 PM Daily Cutoff</span>
                      <p className="text-[10px] text-slate-400">Extracts eligible AVAILABLE track items</p>
                    </div>

                    <input
                      type="date"
                      value={cutoffDate}
                      onChange={(e) => setCutoffDate(e.target.value)}
                      className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                    />
                  </div>

                  <button
                    onClick={handleTrigger10PMCutoff}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Process Cutoff Batch</span>
                  </button>
                </div>

                {/* Manual payout request */}
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-800">Manual Payout Request</span>
                  <button
                    onClick={handleTriggerManualPayout}
                    disabled={!settings.manualWithdrawalEnabled}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Initiate Manual Payout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Batch History & Rollback Control Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Withdrawal Payout History & Operations Gate</h2>

            {batches.length === 0 ? (
              <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                No withdrawal batches generated. Trigger a daily cutoff or manual payout to log entries.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold">
                      <th className="py-3 px-2">Batch ID</th>
                      <th className="py-3 px-2">Cutoff Date</th>
                      <th className="py-3 px-2">Eligible Amt</th>
                      <th className="py-3 px-2">Final payout</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">UTR/Ref</th>
                      <th className="py-3 px-2 text-right">Gate Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-800">
                    {batches.map((b) => (
                      <tr key={b.batchId} className="hover:bg-slate-50/50">
                        <td className="py-3 px-2 font-mono font-bold text-indigo-600">{b.batchId}</td>
                        <td className="py-3 px-2 font-mono text-slate-500">{b.date}</td>
                        <td className="py-3 px-2 font-mono">₹{(b.eligibleAmount / 100).toFixed(2)}</td>
                        <td className="py-3 px-2 font-mono font-bold text-slate-900">₹{(b.finalWithdrawalAmount / 100).toFixed(2)}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                            b.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'FAILED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono text-slate-500">{b.utr || 'N/A'}</td>
                        <td className="py-3 px-2 text-right">
                          {b.status === 'PROCESSING' && (
                            <div className="inline-flex gap-1.5">
                              <button
                                onClick={() => handlePayoutSuccess(b.batchId)}
                                className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-[10px] font-bold rounded"
                              >
                                Success
                              </button>
                              <button
                                onClick={() => handlePayoutFailed(b.batchId, 'RETURN_AVAILABLE')}
                                className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-[10px] font-bold rounded"
                              >
                                Fail & Restore
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
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
