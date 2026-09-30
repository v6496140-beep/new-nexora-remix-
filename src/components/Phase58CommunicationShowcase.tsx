import React, { useState } from 'react';
import {
  Bell,
  Send,
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
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  AlertTriangle,
  RefreshCw,
  Check,
  X
} from 'lucide-react';

import { communicationService } from '../services/communicationService';
import { CommunicationEvent, CommunicationChannel, MessageLogEntity } from '../types/communication';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase58CommunicationShowcase() {
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // Dispatch Form State
  const [selectedEvent, setSelectedEvent] = useState<CommunicationEvent>('BOOKING_CONFIRMED');
  const [recipient, setRecipient] = useState<string>('customer@example.com');
  const [customerId, setCustomerId] = useState<string>('cust-demo-01');
  const [selectedChannels, setSelectedChannels] = useState<CommunicationChannel[]>(['EMAIL', 'WHATSAPP', 'IN_APP']);
  const [forceFailure, setForceFailure] = useState<boolean>(false);
  const [failureChannel, setFailureChannel] = useState<CommunicationChannel>('EMAIL');

  // Template Variables State
  const [varCustomerName, setVarCustomerName] = useState('Rahul Dravid');
  const [varServiceName, setVarServiceName] = useState('Executive Haircut');
  const [varStaffName, setVarStaffName] = useState('Vikram Rajput');
  const [varBookingDate, setVarBookingDate] = useState('2026-10-25');
  const [varBookingTime, setVarBookingTime] = useState('10:00');
  const [varBookingId, setVarBookingId] = useState('bk-demo-01');
  const [varRemainingAmount, setVarRemainingAmount] = useState('INR 1,125');

  // Customer Preferences State
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefSms, setPrefSms] = useState(true);
  const [prefWa, setPrefWa] = useState(true);
  const [prefInApp, setPrefInApp] = useState(true);

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

  // Message Logs
  const messageLogs = communicationService.listMessageLogs(currentBusinessId);

  const handleToggleChannel = (channel: CommunicationChannel) => {
    if (selectedChannels.includes(channel)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== channel));
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const handleUpdatePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    communicationService.setPreferences({
      customerId,
      emailConsent: prefEmail,
      smsConsent: prefSms,
      whatsappConsent: prefWa,
      inAppConsent: prefInApp
    });
    showTempSuccess('Customer communication preferences updated successfully');
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const logs = await communicationService.dispatchEvent(
      currentBusinessId,
      customerId,
      recipient,
      selectedEvent,
      selectedChannels,
      {
        customerName: varCustomerName,
        businessName: businessNames[currentBusinessId],
        serviceName: varServiceName,
        staffName: varStaffName,
        bookingDate: varBookingDate,
        bookingTime: varBookingTime,
        bookingId: varBookingId,
        remainingAmount: varRemainingAmount
      },
      forceFailure ? failureChannel : undefined
    );

    const failedCount = logs.filter((l) => l.status === 'FAILED').length;
    if (failedCount > 0) {
      showTempSuccess(`Dispatched with ${failedCount} failure(s) (Handled gracefully without booking invalidation)`);
    } else {
      showTempSuccess('All messages dispatched successfully across selected channels!');
    }
  };

  const showTempSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
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
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 5.8 — Customer Communication Foundation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Multi-Channel Notifications, Provider Adapters & Consent Preferences
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Provider-agnostic notification engine supporting Email, WhatsApp, SMS, and In-App channels. Integrates with booking lifecycle events, template variable interpolation, customer consent preferences, and fault-tolerant failure logging.
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
              <span>Run Suite 25 Tests</span>
            </button>
          </div>
        </div>

        {/* Tenant Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Business Context:
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

      {/* 2. Automated Test Results Runner */}
      {testResults && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-base">Suite 25: Phase 5.8 Customer Communication Automated Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 25') || r.suite.includes('Phase 5.8'))
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

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Dispatch Simulator & Consent */}
        <div className="lg:col-span-1 space-y-6">
          {/* Dispatch Simulator Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600" />
              <span>Event Dispatch Simulator</span>
            </h2>

            <form onSubmit={handleDispatch} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Communication Event</label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value as CommunicationEvent)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="BOOKING_CREATED">Booking Created</option>
                  <option value="ADVANCE_PAYMENT_RECEIVED">Advance Payment Received</option>
                  <option value="BOOKING_CONFIRMED">Booking Confirmed</option>
                  <option value="BOOKING_REMINDER">Booking Reminder</option>
                  <option value="BOOKING_RESCHEDULED">Booking Rescheduled</option>
                  <option value="BOOKING_CANCELLED">Booking Cancelled</option>
                  <option value="BOOKING_COMPLETED">Booking Completed</option>
                  <option value="REVIEW_REQUEST">Review Request</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
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

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Recipient</label>
                  <input
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Channels</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['EMAIL', 'WHATSAPP', 'SMS', 'IN_APP'] as CommunicationChannel[]).map((ch) => (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => handleToggleChannel(ch)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                        selectedChannels.includes(ch)
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation failure toggle */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="failToggle"
                    checked={forceFailure}
                    onChange={(e) => setForceFailure(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded border-slate-300"
                  />
                  <label htmlFor="failToggle" className="font-semibold text-rose-700">Simulate Provider Failure</label>
                </div>

                {forceFailure && (
                  <select
                    value={failureChannel}
                    onChange={(e) => setFailureChannel(e.target.value as CommunicationChannel)}
                    className="w-full p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 font-semibold"
                  >
                    <option value="EMAIL">Fail Email Channel</option>
                    <option value="WHATSAPP">Fail WhatsApp Channel</option>
                    <option value="SMS">Fail SMS Channel</option>
                  </select>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
                >
                  Dispatch Notification Event
                </button>
              </div>
            </form>
          </div>

          {/* Customer Consent Preferences Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Customer Consent Preferences</h2>

            <form onSubmit={handleUpdatePreferences} className="space-y-3 text-xs">
              <div className="space-y-2">
                {[
                  { label: 'Email Consent', val: prefEmail, set: setPrefEmail },
                  { label: 'SMS Consent', val: prefSms, set: setPrefSms },
                  { label: 'WhatsApp Consent', val: prefWa, set: setPrefWa },
                  { label: 'In-App Consent', val: prefInApp, set: setPrefInApp }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={item.val}
                      onChange={(e) => item.set(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-slate-900 text-white font-semibold shadow-sm"
              >
                Save Preferences
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Message Audit Log */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Message Audit Trail & Status Log</h2>
                <p className="text-xs text-slate-500">
                  Showing notification delivery records for {businessNames[currentBusinessId]}.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                {messageLogs.length} Total Messages
              </span>
            </div>

            {messageLogs.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                No communication logs recorded yet. Dispatch an event to test notification delivery.
              </div>
            ) : (
              <div className="space-y-3">
                {messageLogs.map((log) => (
                  <div
                    key={log.notificationId}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      log.status === 'SENT'
                        ? 'bg-emerald-950/10 border-emerald-200 text-slate-800'
                        : 'bg-rose-950/10 border-rose-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold font-mono text-[10px]">
                          {log.channel}
                        </span>
                        <span className="font-bold text-slate-900">{log.event}</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          log.status === 'SENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>

                    <p className="text-slate-700 italic bg-white/80 p-2.5 rounded-lg border border-slate-200">
                      "{log.content}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                      <span>Recipient: {log.recipient}</span>
                      {log.providerMessageId && <span>MsgID: {log.providerMessageId}</span>}
                      {log.errorMessage && <span className="text-rose-600 font-bold">Error: {log.errorMessage}</span>}
                      <span>{log.sentAt || log.failedAt || ''}</span>
                    </div>
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
