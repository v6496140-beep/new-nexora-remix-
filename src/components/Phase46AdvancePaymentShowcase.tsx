import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Building2,
  Cpu,
  Sparkles,
  CreditCard,
  DollarSign,
  Lock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Webhook,
  Calculator,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Clock,
  FileCode,
  SlidersHorizontal
} from 'lucide-react';
import { Button, Badge } from '../design-system';
import {
  advanceCalculationEngine,
  AdvanceCalculationEngine
} from '../services/advanceCalculationEngine';
import {
  paymentProviderRegistry,
  RazorpayPaymentGatewayAdapter,
  SandboxPaymentGatewayAdapter
} from '../services/paymentAdapters';
import { webhookRegistryEngine } from '../services/webhookRegistry';
import {
  PaymentRecord,
  PaymentProvider,
  WebhookPayload,
  WebhookAuditLogEntry
} from '../types/paymentEngine';

export const Phase46AdvancePaymentShowcase: React.FC = () => {
  // Active Provider Selection
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('RAZORPAY');

  // Interactive Advance Calculator State
  const [calcInputRupees, setCalcInputRupees] = useState<number>(1000);
  const [calcInputPercentage, setCalcInputPercentage] = useState<number>(25);

  // Active Order & Verification State
  const [activeOrder, setActiveOrder] = useState<PaymentRecord | null>(null);
  const [initiateData, setInitiateData] = useState<any | null>(null);
  const [verifyResult, setVerifyResult] = useState<any | null>(null);
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);

  // Webhook Simulator State
  const [webhookEventId, setWebhookEventId] = useState<string>('evt_wh_demo_101');
  const [webhookSignature, setWebhookSignature] = useState<string>('rzp_sig_valid_webhook_demo');
  const [webhookLogs, setWebhookLogs] = useState<WebhookAuditLogEntry[]>([]);
  const [latestWebhookResult, setLatestWebhookResult] = useState<any | null>(null);

  // Perform Calculation on the fly using AdvanceCalculationEngine
  const advanceCalcResult = useMemo(() => {
    return advanceCalculationEngine.calculateAdvanceFromRupees(
      calcInputRupees,
      calcInputPercentage,
      'INR'
    );
  }, [calcInputRupees, calcInputPercentage]);

  // Provider Instance
  const currentAdapter = useMemo(() => {
    return paymentProviderRegistry.getProvider(selectedProvider);
  }, [selectedProvider]);

  // Handle Order Creation Simulation
  const handleCreateOrder = async () => {
    setVerifyResult(null);
    setInitiateData(null);

    const order = await currentAdapter.createOrder({
      businessId: 'biz-barber-001',
      bookingId: `NX-BKG-${Date.now().toString(36).toUpperCase()}`,
      customerId: 'cust-rahul-01',
      amountPaise: advanceCalcResult.advanceAmountPaise,
      currency: 'INR',
      paymentType: 'ADVANCE',
      metadata: {
        totalServiceAmountPaise: advanceCalcResult.totalAmountPaise,
        advancePercentage: advanceCalcResult.advancePercentage
      }
    });

    setActiveOrder(order);

    // Auto Initiate Payment Session
    const init = await currentAdapter.initiatePayment({
      orderId: order.orderId,
      paymentMethod: 'UPI'
    });
    setInitiateData(init);
  };

  // Handle Server-Side Payment Verification
  const handleVerifyPayment = async () => {
    if (!activeOrder) return;

    const signatureToUse = simulateFailure
      ? 'invalid_signature_forged'
      : selectedProvider === 'RAZORPAY'
      ? 'rzp_sig_valid_hmac_256'
      : 'sbx_sig_valid';

    const result = await currentAdapter.verifyPayment({
      orderId: activeOrder.orderId,
      transactionId: `txn_${selectedProvider.toLowerCase()}_${Date.now().toString(36)}`,
      signature: signatureToUse,
      simulateFailure
    });

    setVerifyResult(result);
    if (result.paymentRecord) {
      setActiveOrder({ ...result.paymentRecord });
    }
  };

  // Handle Webhook Dispatch Simulation
  const handleTriggerWebhook = async (isDuplicate: boolean = false) => {
    const targetOrder = activeOrder || { orderId: `order_rzp_demo_${Date.now()}`, amountPaise: 25000 };
    const eventIdToUse = isDuplicate ? webhookEventId : `evt_wh_${Date.now().toString(36)}`;

    if (!isDuplicate) {
      setWebhookEventId(eventIdToUse);
    }

    const payload: WebhookPayload = {
      eventId: eventIdToUse,
      eventType: 'payment.captured',
      createdAt: Date.now(),
      payload: {
        orderId: targetOrder.orderId,
        transactionId: `txn_wh_${Date.now().toString(36)}`,
        amountPaise: targetOrder.amountPaise,
        status: 'captured'
      }
    };

    const res = await currentAdapter.handleWebhook(payload, webhookSignature);
    setLatestWebhookResult(res);
    setWebhookLogs(webhookRegistryEngine.getAuditLogs());
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto bg-slate-800/90 backdrop-blur border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400/10 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-400/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> PHASE 4.6
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                Advance Payment Architecture & PSP Decoupling
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Provider-Independent Advance Payment Engine
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Integer minor-unit money safety (paise), provider-decoupled adapter architecture (Razorpay & Sandbox), server-authoritative payment verification, and idempotent webhook audit engine.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-700 px-4 py-3 rounded-2xl text-center">
              <span className="block text-[11px] text-slate-400 font-medium">Money Safety</span>
              <span className="text-base font-bold text-emerald-400">Integer Paise</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-700 px-4 py-3 rounded-2xl text-center">
              <span className="block text-[11px] text-slate-400 font-medium">Default Advance</span>
              <span className="text-base font-bold text-amber-400">25% Configured</span>
            </div>
          </div>
        </div>

        {/* Provider Switcher */}
        <div className="mt-6 flex flex-wrap items-center gap-3 pt-6 border-t border-slate-700/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" /> Active PSP Adapter:
          </span>
          {(['RAZORPAY', 'SANDBOX'] as PaymentProvider[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setSelectedProvider(p);
                paymentProviderRegistry.setDefaultProvider(p);
                setActiveOrder(null);
                setVerifyResult(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedProvider === p
                  ? 'bg-amber-400 text-slate-950 shadow-lg ring-2 ring-amber-400/40'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-750 border border-slate-700'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{p === 'RAZORPAY' ? 'Razorpay Adapter (Standard)' : 'Sandbox Test Adapter'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workbench Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Advance Calculator & Order Workbench (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Money-Safe Advance Calculation Workbench */}
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Money-Safe Advance Calculation
                </h2>
              </div>
              <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
                Formula Engine
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Total Appointment Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="100"
                    value={calcInputRupees}
                    onChange={(e) => setCalcInputRupees(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                  Integer Paise = {advanceCalcResult.totalAmountPaise.toLocaleString()} paise
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Configured Advance Deposit (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={calcInputPercentage}
                    onChange={(e) => setCalcInputPercentage(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-sm">%</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Read from Business Settings (Default 25%)
                </span>
              </div>
            </div>

            {/* Live Formula & Calculation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700">
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                  Total (Minor Unit)
                </span>
                <span className="text-lg font-black text-white font-mono">
                  ₹{calcInputRupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                  ({advanceCalcResult.totalAmountPaise} paise)
                </span>
              </div>

              <div className="bg-amber-950/30 p-4 rounded-2xl border border-amber-500/30">
                <span className="block text-[10px] text-amber-400 uppercase font-bold tracking-wider mb-1">
                  {advanceCalcResult.advancePercentage}% Advance Deposit
                </span>
                <span className="text-lg font-black text-amber-300 font-mono">
                  ₹{(advanceCalcResult.advanceAmountPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="block text-[10px] text-amber-400/80 font-mono mt-0.5">
                  ({advanceCalcResult.advanceAmountPaise} paise)
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700">
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                  Remaining Balance
                </span>
                <span className="text-lg font-black text-slate-200 font-mono">
                  ₹{(advanceCalcResult.remainingAmountPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                  ({advanceCalcResult.remainingAmountPaise} paise)
                </span>
              </div>
            </div>

            {/* Quick Test Bench Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Preset Specs:</span>
              <button
                type="button"
                onClick={() => {
                  setCalcInputRupees(1000);
                  setCalcInputPercentage(25);
                }}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-650 rounded-lg text-xs font-mono font-bold text-white transition-colors"
              >
                ₹1,000 @ 25% → ₹250
              </button>
              <button
                type="button"
                onClick={() => {
                  setCalcInputRupees(2000);
                  setCalcInputPercentage(25);
                }}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-650 rounded-lg text-xs font-mono font-bold text-white transition-colors"
              >
                ₹2,000 @ 25% → ₹500
              </button>
              <button
                type="button"
                onClick={() => {
                  setCalcInputRupees(1500);
                  setCalcInputPercentage(30);
                }}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-650 rounded-lg text-xs font-mono font-bold text-white transition-colors"
              >
                ₹1,500 @ 30% → ₹450
              </button>
            </div>
          </div>

          {/* Section 2: Order Creation & Server Verification Lifecycle */}
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Order Lifecycle & Server Verification
                </h2>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
                {selectedProvider}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">1. Create PSP Order</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generates provider order for ₹{(advanceCalcResult.advanceAmountPaise / 100).toFixed(2)} advance
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={handleCreateOrder}
                className="whitespace-nowrap"
              >
                Create PSP Order
              </Button>
            </div>

            {activeOrder && (
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Order ID ({selectedProvider}):</span>
                  <span className="text-amber-400 font-bold">{activeOrder.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Amount (Paise):</span>
                  <span className="text-white font-bold">
                    {activeOrder.amountPaise} paise (₹{(activeOrder.amountPaise / 100).toFixed(2)})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Payment Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      activeOrder.status === 'VERIFIED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : activeOrder.status === 'FAILED'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {activeOrder.status}
                  </span>
                </div>
              </div>
            )}

            {/* Step 2: Server-Side Verification Execution */}
            {activeOrder && (
              <div className="pt-4 border-t border-slate-700/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      2. Authoritative Server Verification
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Frontend client success is untrusted. Verification validates HMAC/signature on server.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={simulateFailure}
                        onChange={(e) => setSimulateFailure(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-amber-400 focus:ring-0"
                      />
                      <span>Simulate Forged/Failed</span>
                    </label>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleVerifyPayment}
                      className="whitespace-nowrap"
                    >
                      Verify Payment
                    </Button>
                  </div>
                </div>

                {verifyResult && (
                  <div
                    className={`p-4 rounded-2xl border ${
                      verifyResult.verified
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                    } text-xs space-y-2`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        {verifyResult.verified ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> SERVER VERIFICATION PASSED
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-400" /> SERVER VERIFICATION REJECTED
                          </>
                        )}
                      </span>
                      <span className="text-[10px] font-mono">
                        {verifyResult.verified ? 'bookingStatus = CONFIRMED' : 'bookingStatus = UNCONFIRMED'}
                      </span>
                    </div>

                    <p className="text-xs opacity-90 font-mono">
                      {verifyResult.verified
                        ? `Transaction verified successfully. Payment record set to VERIFIED and booking marked ADVANCE_PAID.`
                        : `Rejected: ${verifyResult.error}. Booking remains unconfirmed; failed payment cannot auto-confirm.`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Webhook Simulator & Idempotency Audit Trail (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Webhook & Idempotency Engine Card */}
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Webhook className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Webhook & Idempotency Engine
                </h3>
              </div>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-mono">
                Audit Engine
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Webhooks ensure asynchronous payment confirmation. Duplicate webhook events are rejected idempotently without duplicating financial records.
            </p>

            <div className="space-y-3 bg-slate-900 p-4 rounded-2xl border border-slate-700 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Webhook Signature Header Token
                </label>
                <input
                  type="text"
                  value={webhookSignature}
                  onChange={(e) => setWebhookSignature(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono text-xs"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleTriggerWebhook(false)}
                  className="w-full text-xs"
                >
                  Trigger Webhook Event
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTriggerWebhook(true)}
                  className="w-full text-xs text-amber-400 border-amber-400/40 hover:bg-amber-400/10"
                >
                  Send Duplicate Webhook
                </Button>
              </div>
            </div>

            {latestWebhookResult && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-mono space-y-1 ${
                  latestWebhookResult.success
                    ? latestWebhookResult.idempotent
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                      : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex justify-between font-bold">
                  <span>Result:</span>
                  <span>{latestWebhookResult.idempotent ? 'DUPLICATE IGNORED' : latestWebhookResult.success ? 'PROCESSED' : 'REJECTED'}</span>
                </div>
                <p className="text-[11px] opacity-90">{latestWebhookResult.message}</p>
              </div>
            )}

            {/* Audit Log Stream */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Webhook Audit Log Stream</span>
                <span className="text-[10px] text-slate-500 font-mono">{webhookLogs.length} events logged</span>
              </h4>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {webhookLogs.length === 0 ? (
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center text-xs text-slate-500 italic">
                    No webhooks processed yet. Click "Trigger Webhook Event" above.
                  </div>
                ) : (
                  webhookLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-900 rounded-xl border border-slate-700/80 text-[11px] font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-purple-300 font-bold">{log.eventId}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            log.status === 'PROCESSED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : log.status === 'DUPLICATE_IGNORED'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[10px]">{log.details}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
