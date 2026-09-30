import React, { useState } from 'react';
import {
  CreditCard,
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
  Filter,
  DollarSign,
  Plus,
  RefreshCw,
  Clock,
  ArrowRightLeft,
  AlertTriangle
} from 'lucide-react';

import { paymentArchitectureService } from '../services/paymentArchitectureService';
import { PaymentEntity, TransactionEntity, PaymentType, CollectionChannel } from '../types/paymentArchitecture';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase61PaymentShowcase() {
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // New Payment Form State
  const [bookingId, setBookingId] = useState('bk-61-001');
  const [customerId, setCustomerId] = useState('cust-61-101');
  const [amountVal, setAmountVal] = useState('3500'); // in cents, e.g. 35.00
  const [currency, setCurrency] = useState('INR');
  const [paymentType, setPaymentType] = useState<PaymentType>('ADVANCE');
  const [collectionChannel, setCollectionChannel] = useState<CollectionChannel>('NEXORA_QR');
  const [provider, setProvider] = useState('RAZORPAY');

  // Capture State
  const [createdPayments, setCreatedPayments] = useState<PaymentEntity[]>([]);
  const [selectedPayIdForCapture, setSelectedPayIdForCapture] = useState('');
  const [mockProviderPayId, setMockProviderPayId] = useState('rzp_pay_999');
  const [mockSignature, setMockSignature] = useState('sig_valid_999');

  // Ledger State
  const [filterNexoraOnly, setFilterNexoraOnly] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Automated Tests State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // List Transactions
  const transactions = paymentArchitectureService.listTransactions(currentBusinessId, filterNexoraOnly);

  const handleInitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const pay = await paymentArchitectureService.initPayment({
      businessId: currentBusinessId,
      bookingId,
      customerId,
      amount: parseInt(amountVal) || 0,
      currency,
      paymentType,
      collectionChannel,
      providerName: provider
    });

    setCreatedPayments([pay, ...createdPayments]);
    setSelectedPayIdForCapture(pay.paymentId);
    showFeedback(`Payment record initialized with ID: ${pay.paymentId}`);
  };

  const handleCapturePayment = async () => {
    if (!selectedPayIdForCapture) return;
    const res = await paymentArchitectureService.confirmPayment(
      selectedPayIdForCapture,
      mockProviderPayId,
      mockSignature
    );

    if (res.success) {
      showFeedback(`Payment captured successfully! Immutable Transaction log created.`);
      // Refresh created list
      setCreatedPayments(createdPayments.map(p => p.paymentId === selectedPayIdForCapture ? res.payment : p));
    } else {
      showFeedback(`Payment capturing failed due to signature verification error.`);
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
              <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 6.1 — Payment & Transaction Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Provider-Independent Ledger & Channels Controller
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Decoupled payments engine separating bookings from transaction accounting. Supports pluggable provider adapters (e.g. Razorpay), distinct cash vs Nexora QR collection streams, and produces immutable transaction logs.
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
              <span>Run Suite 28 Tests</span>
            </button>
          </div>
        </div>

        {/* Tenant Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Select Salon:
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
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 2. Automated Test Results Runner */}
      {testResults && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-base">Suite 28: Phase 6.1 Payment Architecture Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 28') || r.suite.includes('Phase 6.1'))
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

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create & Capture Simulators */}
        <div className="lg:col-span-1 space-y-6">
          {/* Create Payment Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Plus className="w-4.5 h-4.5 text-indigo-600" />
              <span>Initialize Payment</span>
            </h2>

            <form onSubmit={handleInitPayment} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Booking ID</label>
                  <input
                    type="text"
                    required
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Customer ID</label>
                  <input
                    type="text"
                    required
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Amount (Cents)</label>
                  <input
                    type="number"
                    required
                    value={amountVal}
                    onChange={(e) => setAmountVal(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Currency</label>
                  <input
                    type="text"
                    required
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Payment Type</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="ADVANCE">Advance Payment</option>
                  <option value="REMAINING">Remaining Balance</option>
                  <option value="FULL_PAYMENT">Full Payment</option>
                  <option value="REFUND">Refund</option>
                  <option value="ADJUSTMENT">Adjustment Adjustment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Collection Channel</label>
                  <select
                    value={collectionChannel}
                    onChange={(e) => {
                      setCollectionChannel(e.target.value as CollectionChannel);
                      setProvider(e.target.value === 'CASH' ? 'CASH' : 'RAZORPAY');
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[11px]"
                  >
                    <option value="NEXORA_QR">Nexora QR (Controlled)</option>
                    <option value="SALON_OWN_QR">Salon Own QR (Bypass)</option>
                    <option value="CASH">Cash (Bypass)</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Provider</label>
                  <input
                    type="text"
                    required
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md pt-2"
              >
                Initialize Payment
              </button>
            </form>
          </div>

          {/* Capture Payment Card */}
          {createdPayments.length > 0 && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-800">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
                <span>Verify & Capture payment</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Select Active Payment</label>
                  <select
                    value={selectedPayIdForCapture}
                    onChange={(e) => setSelectedPayIdForCapture(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                  >
                    {createdPayments.map((p) => (
                      <option key={p.paymentId} value={p.paymentId}>
                        {p.paymentId} - {p.amount} {p.currency} ({p.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Provider Pay ID</label>
                    <input
                      type="text"
                      value={mockProviderPayId}
                      onChange={(e) => setMockProviderPayId(e.target.value)}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Signature</label>
                    <input
                      type="text"
                      value={mockSignature}
                      onChange={(e) => setMockSignature(e.target.value)}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCapturePayment}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md"
                >
                  Verify & Capture Payment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Immutable Transactions Audit Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  <span>Immutable Transactions Ledger</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Authoritative double-entry audit logs for {businessNames[currentBusinessId]}.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-600 font-semibold">Filter Channel:</span>
                <button
                  onClick={() => setFilterNexoraOnly(!filterNexoraOnly)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                    filterNexoraOnly
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {filterNexoraOnly ? 'Nexora QR Only (Ledger)' : 'All Channels (Cash/Bypass)'}
                </button>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                No captured transaction logs available. Initialize and capture a payment record to log entries.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold">
                      <th className="py-3 px-2">TX ID</th>
                      <th className="py-3 px-2">Type</th>
                      <th className="py-3 px-2">Gross Amount</th>
                      <th className="py-3 px-2">Channel</th>
                      <th className="py-3 px-2">Ref ID</th>
                      <th className="py-3 px-2 text-right">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-800">
                    {transactions.map((tx) => (
                      <tr key={tx.transactionId} className="hover:bg-slate-50/50">
                        <td className="py-3 px-2 font-mono font-bold text-indigo-600">{tx.transactionId}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                            tx.type === 'REFUND_DEBIT' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono font-bold">
                          {(tx.grossAmount / 100).toFixed(2)} INR
                        </td>
                        <td className="py-3 px-2">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                            {tx.channel}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono text-slate-500">{tx.referenceId || 'N/A'}</td>
                        <td className="py-3 px-2 text-right text-slate-500">{tx.createdAt.split('T')[1].substr(0, 5)}</td>
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
