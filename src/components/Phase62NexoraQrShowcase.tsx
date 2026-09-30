import React, { useState, useEffect } from 'react';
import {
  QrCode,
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
  Clock,
  AlertTriangle,
  RefreshCw,
  Send,
  Database,
  Calendar
} from 'lucide-react';

import { PaymentArchitectureService } from '../services/paymentArchitectureService';
import { NexoraQrService } from '../services/nexoraQrService';
import { QrPaymentSession, NexoraQrConfig } from '../types/nexoraQr';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase62NexoraQrShowcase() {
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // Shared Service instances
  const [payService] = useState(() => new PaymentArchitectureService());
  const [qrService] = useState(() => new NexoraQrService(payService));

  // Active Session State
  const [activeSession, setActiveSession] = useState<QrPaymentSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown

  // Webhook Simulator State
  const [webhookEventId, setWebhookEventId] = useState('evt-web-101');
  const [webhookSignature, setWebhookSignature] = useState('sha256_valid_signature_xyz');
  const [webhookAmount, setWebhookAmount] = useState('3500'); // Matches default creation
  const [webhookProviderPayId, setWebhookProviderPayId] = useState('pay_rzp_77777');

  // Logs & Feedback State
  const [feedback, setFeedback] = useState<string | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<{ eventId: string; status: string; detail: string; timestamp: string }[]>([]);

  // Automated Test State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (!activeSession || activeSession.state !== 'Waiting') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          qrService.forceExpireSession(activeSession.sessionId);
          refreshActiveSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  const refreshActiveSession = () => {
    if (activeSession) {
      const refreshed = qrService.getSession(activeSession.sessionId);
      setActiveSession(refreshed ? { ...refreshed } : null);
    }
  };

  const handleInitSession = async () => {
    // 1. Create payment entry in underlying architecture
    const amt = parseInt(webhookAmount) || 3500;
    const payment = await payService.initPayment({
      businessId: currentBusinessId,
      bookingId: 'bk-qr-999',
      customerId: 'cust-qr-999',
      amount: amt,
      currency: 'INR',
      paymentType: 'FULL_PAYMENT',
      collectionChannel: 'NEXORA_QR',
      providerName: 'RAZORPAY'
    });

    // 2. Spawn QR payment session
    const sess = qrService.createSession(payment.paymentId, currentBusinessId, 'bk-qr-999', amt, 'INR');
    setActiveSession(sess);
    setTimeLeft(300);
    showFeedback(`Nexora QR collection session initialized.`);
  };

  const handleSendWebhook = async () => {
    if (!activeSession) {
      showFeedback(`No active QR payment session to target.`);
      return;
    }

    const res = await qrService.handleWebhookEvent({
      signature: webhookSignature,
      eventId: webhookEventId,
      sessionId: activeSession.sessionId,
      providerPaymentId: webhookProviderPayId,
      amountSentCents: parseInt(webhookAmount) || 0
    });

    const timestamp = new Date().toLocaleTimeString();
    if (res.success) {
      setWebhookLogs([
        {
          eventId: webhookEventId,
          status: 'SUCCESS',
          detail: `Amount ${webhookAmount} cents confirmed. Idempotent key logged.`,
          timestamp
        },
        ...webhookLogs
      ]);
      showFeedback(`Webhook processed successfully! Payout confirmed.`);
    } else {
      setWebhookLogs([
        {
          eventId: webhookEventId,
          status: 'REJECTED',
          detail: `Error: ${res.error}`,
          timestamp
        },
        ...webhookLogs
      ]);
      showFeedback(`Webhook event rejected: ${res.error}`);
    }

    // Refresh Session UX
    refreshActiveSession();
    // Rotate Event ID for next testing turn
    setWebhookEventId(`evt-web-${Date.now().toString(36).substr(-4)}`);
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

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
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
              <QrCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 6.2 — Nexora QR Collection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Nexora-Controlled QR Collections & Verified Webhook Receiver
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Enforce strict collection guardrails. Payment confirmation requires signature-verified webhooks matching the expected transaction amount with idempotent event filters.
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
              <span>Run Suite 29 Tests</span>
            </button>
          </div>
        </div>

        {/* Tenant Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Active Business QR:
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
                  setActiveSession(null);
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
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2 shadow-sm animate-pulse">
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
              <h3 className="font-bold text-base">Suite 29: Phase 6.2 Nexora QR Collection Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 29') || r.suite.includes('Phase 6.2'))
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Session Starter & Webhook Simulator */}
        <div className="lg:col-span-5 space-y-6">
          {/* Create Session Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Spawn QR Collection Session</h2>
            <p className="text-xs text-slate-500">
              Starts a 5-minute verified payment session for {businessNames[currentBusinessId]}.
            </p>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Payment Amount (INR Cents)</label>
                <input
                  type="number"
                  value={webhookAmount}
                  onChange={(e) => setWebhookAmount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <button
                onClick={handleInitSession}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
              >
                Spawn active Nexora QR
              </button>
            </div>
          </div>

          {/* Webhook Delivery Simulator */}
          {activeSession && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Send className="w-4.5 h-4.5 text-indigo-600" />
                <span>Verified Webhook Delivery Simulator</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Webhook Signature Header</label>
                  <input
                    type="text"
                    value={webhookSignature}
                    onChange={(e) => setWebhookSignature(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Must start with <code className="text-indigo-600">sha256_valid_</code> to authorize.</span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Webhook Event ID (Idempotency Key)</label>
                  <input
                    type="text"
                    value={webhookEventId}
                    onChange={(e) => setWebhookEventId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Provider Payment ID</label>
                  <input
                    type="text"
                    value={webhookProviderPayId}
                    onChange={(e) => setWebhookProviderPayId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <button
                  onClick={handleSendWebhook}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Deliver Webhook Payload
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Active QR UX Card & Webhook logs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active QR Code Session UI Card */}
          {activeSession ? (
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center gap-6">
              {/* QR Code Placeholder */}
              <div className="w-40 h-40 bg-white rounded-2xl p-2.5 shrink-0 flex flex-col items-center justify-between border-4 border-indigo-500 shadow-md">
                <div className="grid grid-cols-6 gap-0.5 w-full h-full opacity-90">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i % 5 === 0 || i % 7 === 0 || i < 6 || i % 6 === 0) ? 'bg-slate-900' : 'bg-slate-100'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[9px] text-slate-500 font-bold tracking-wider mt-1 uppercase text-center">
                  NEXORA SECURE QR
                </div>
              </div>

              {/* Metadata Details & Timer */}
              <div className="flex-1 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px] uppercase tracking-wider">
                    {activeSession.state}
                  </span>

                  {activeSession.state === 'Waiting' && (
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(timeLeft)}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-100">{businessNames[currentBusinessId]}</h3>
                  <p className="text-slate-400 font-mono mt-0.5">Session: {activeSession.sessionId}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-medium">Expected Amount:</span>
                    <div className="text-sm font-extrabold text-indigo-300 font-mono">
                      {(activeSession.amount / 100).toFixed(2)} INR
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Booking Link:</span>
                    <div className="font-mono text-slate-300">{activeSession.bookingId}</div>
                  </div>
                </div>

                {activeSession.state === 'Expired' && (
                  <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold flex items-center gap-1.5 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>This payment session has expired. Please request a new QR.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No active Nexora QR collection session. Spawn a session to display QR UX.
            </div>
          )}

          {/* Webhook Delivery Log Terminal */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 font-mono text-xs border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-indigo-400" />
              <span>Webhook Receiver Log Terminal</span>
            </h3>

            {webhookLogs.length === 0 ? (
              <div className="text-slate-500 italic">Logs empty. Fire webhooks to see evaluations.</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {webhookLogs.map((log, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                        }`}>
                          {log.status}
                        </span>
                        <span className="text-slate-400 text-[10px]">Event: {log.eventId}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">{log.detail}</div>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
