import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Scissors,
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
  Mail,
  Phone,
  MessageSquare,
  Bookmark,
  ChevronRight,
  Cpu,
  Power,
  ToggleLeft,
  ToggleRight,
  Database,
  Layers,
  Sparkle
} from 'lucide-react';

import { crmAutomationsService, MetaCloudApiProvider, TwilioWhatsAppProvider } from '../services/crmAutomationsService';
import { customerCrmService } from '../services/customerCrmService';
import { AutomationTriggerType, AutomationStatus, AutomationLogEntry } from '../types/crmAutomations';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase610AutomationsShowcase() {
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // Config settings state
  const config = crmAutomationsService.getConfig(currentBusinessId);
  const [birthdayWish, setBirthdayWish] = useState(config.birthdayWishEnabled);
  const [birthdayOffer, setBirthdayOffer] = useState(config.birthdayOfferEnabled);
  const [visitReminder, setVisitReminder] = useState(config.visitReminderEnabled);
  const [bookingReminder, setBookingReminder] = useState(config.bookingReminderEnabled);
  const [reviewRequest, setReviewRequest] = useState(config.reviewRequestEnabled);
  const [isSuspended, setIsSuspended] = useState(config.isBusinessSuspended);
  const [reminderDays, setReminderDays] = useState(config.visitReminderDays.toString());

  // Provider selection
  const [activeProviderName, setActiveProviderName] = useState<string>('META');

  // Simulator values
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-barber-001');
  const [simulatorTrigger, setSimulatorTrigger] = useState<AutomationTriggerType>('VISIT_REMINDER_30_DAY');
  const [evalDate, setEvalDate] = useState('2026-09-29');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  const [feedback, setFeedback] = useState<string | null>(null);

  // Automated Test State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Dynamic lists
  const customers = customerCrmService.getCustomers(currentBusinessId);
  const logs = crmAutomationsService.getLogs(currentBusinessId);

  const handleUpdateConfig = () => {
    crmAutomationsService.updateConfig(currentBusinessId, {
      birthdayWishEnabled: birthdayWish,
      birthdayOfferEnabled: birthdayOffer,
      visitReminderEnabled: visitReminder,
      bookingReminderEnabled: bookingReminder,
      reviewRequestEnabled: reviewRequest,
      isBusinessSuspended: isSuspended,
      visitReminderDays: parseInt(reminderDays) || 30
    });
    showFeedback('Automation re-engagement policies successfully synced to global scheduler context.');
  };

  const handleSwitchProvider = (prov: 'META' | 'TWILIO') => {
    setActiveProviderName(prov);
    if (prov === 'META') {
      crmAutomationsService.setActiveProvider(new MetaCloudApiProvider());
    } else {
      crmAutomationsService.setActiveProvider(new TwilioWhatsAppProvider());
    }
    showFeedback(`WhatsApp outbound provider switched to ${crmAutomationsService.getActiveProviderName()}`);
  };

  const handleRunSimulation = async () => {
    try {
      const log = await crmAutomationsService.evaluateScheduledAutomationsForCustomer(
        currentBusinessId,
        selectedCustomerId,
        simulatorTrigger,
        evalDate,
        timezone
      );

      if (log.status === 'SENT') {
        showFeedback(`Automation delivered! [Idempotency Key: ${log.idempotencyKey.substring(0, 15)}...]`);
      } else if (log.status.startsWith('SKIPPED')) {
        showFeedback(`Job Evaluated: Excluded and skipped due to status [${log.status}]`);
      } else {
        showFeedback(`Job Failed: ${log.failureReason || 'Unknown API timeout'}`);
      }
    } catch (err: any) {
      showFeedback(`Simulation error: ${err.message}`);
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
              <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span>Phase 6.10 — Automated Customer Re-Engagement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Consent-Aware Schedulers & Multi-Provider WhatsApp Workflows
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Design abstract WhatsApp providers, run automatic revisit timers, filter rebooked exclusions, enforce strict opt-out consent guardrails, and defend against duplicate jobs using cryptographically sound idempotency keys.
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
              <span>Run Suite 37 Tests</span>
            </button>
          </div>
        </div>

        {/* Tenant Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Active Business Workspace:
          </span>

          {[
            { id: 'biz-barber-001', label: 'Royal Crown Barber' },
            { id: 'biz-spa-002', label: 'Zenith Stone Spa' }
          ].map((biz) => {
            const isSelected = currentBusinessId === biz.id;
            return (
              <button
                key={biz.id}
                onClick={() => {
                  setCurrentBusinessId(biz.id);
                  const newCfg = crmAutomationsService.getConfig(biz.id);
                  setBirthdayWish(newCfg.birthdayWishEnabled);
                  setBirthdayOffer(newCfg.birthdayOfferEnabled);
                  setVisitReminder(newCfg.visitReminderEnabled);
                  setBookingReminder(newCfg.bookingReminderEnabled);
                  setReviewRequest(newCfg.reviewRequestEnabled);
                  setIsSuspended(newCfg.isBusinessSuspended);
                  setReminderDays(newCfg.visitReminderDays.toString());
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
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
              <h3 className="font-bold text-base">Suite 37: Phase 6.10 Automation Engine Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 37') || r.suite.includes('Phase 6.10'))
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

      {/* 3. Automation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Control Policies Config Center */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Settings className="w-4.5 h-4.5 text-indigo-600" />
              <span>Engagement Policies Control</span>
            </h3>

            {/* Provider Abstraction */}
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active WhatsApp Vendor Gateway</span>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleSwitchProvider('META')}
                  className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                    activeProviderName === 'META'
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Meta Cloud API
                </button>
                <button
                  onClick={() => handleSwitchProvider('TWILIO')}
                  className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                    activeProviderName === 'TWILIO'
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Twilio WhatsApp
                </button>
              </div>
            </div>

            {/* Config rules toggles */}
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">1. Birthday Wishes</span>
                  <span className="text-[10px] text-slate-500 block">Send template congratulatory greet</span>
                </div>
                <input
                  type="checkbox"
                  checked={birthdayWish}
                  onChange={(e) => setBirthdayWish(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">2. Birthday Special Offers</span>
                  <span className="text-[10px] text-slate-500 block">Attach gift markdown block link</span>
                </div>
                <input
                  type="checkbox"
                  checked={birthdayOffer}
                  onChange={(e) => setBirthdayOffer(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">3. 30-Day Visit Reminders</span>
                  <span className="text-[10px] text-slate-500 block">Fires after completed checkout visit</span>
                </div>
                <input
                  type="checkbox"
                  checked={visitReminder}
                  onChange={(e) => setVisitReminder(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">4. Upfront Booking Reminders</span>
                  <span className="text-[10px] text-slate-500 block">Pre-booking alert for customers</span>
                </div>
                <input
                  type="checkbox"
                  checked={bookingReminder}
                  onChange={(e) => setBookingReminder(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">5. Post-Visit Review Requests</span>
                  <span className="text-[10px] text-slate-500 block">Trigger rating survey review link</span>
                </div>
                <input
                  type="checkbox"
                  checked={reviewRequest}
                  onChange={(e) => setReviewRequest(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                />
              </div>

              {/* Suspended switch */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-rose-700 block">Emergency Tenant Suspension</span>
                  <span className="text-[10px] text-slate-500 block">Instantly pauses all scheduled jobs</span>
                </div>
                <input
                  type="checkbox"
                  checked={isSuspended}
                  onChange={(e) => setIsSuspended(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 h-4.5 w-4.5 cursor-pointer"
                />
              </div>

              {/* Days interval parameter */}
              <div className="space-y-1.5 pt-3">
                <label className="font-bold text-slate-700 block">Visit reminder cycle days threshold</label>
                <input
                  type="number"
                  value={reminderDays}
                  onChange={(e) => setReminderDays(e.target.value)}
                  className="p-2 w-full bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <button
                onClick={handleUpdateConfig}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-sm transition-all text-center block"
              >
                Sync Scheduler Policies
              </button>
            </div>
          </div>
        </div>

        {/* Center/Right Side: Interactive Simulation Sandbox & Automation Logs Feed */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Interactive simulator dashboard */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Scheduler Job Trigger Simulation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-600">Simulate Target Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="p-2.5 w-full bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {customers.map((c) => (
                    <option key={c.customerId} value={c.customerId}>
                      {c.name} ({c.marketingConsent ? 'Consented' : 'Opt-Out'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600">Scheduler Automations</label>
                <select
                  value={simulatorTrigger}
                  onChange={(e) => setSimulatorTrigger(e.target.value as any)}
                  className="p-2.5 w-full bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="BIRTHDAY_WISH">1. Birthday Wish</option>
                  <option value="BIRTHDAY_OFFER">2. Birthday Offer</option>
                  <option value="VISIT_REMINDER_30_DAY">3. 30-Day Visit Reminder</option>
                  <option value="BOOKING_REMINDER">4. Booking Reminder</option>
                  <option value="REVIEW_REQUEST">5. Review Request</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600">Simulated Date Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="p-2.5 w-full bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleRunSimulation}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Scheduled Job Evaluation</span>
              </button>
            </div>
          </div>

          {/* Immutable logs stream */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Re-engagement Automation Audit Logs</h3>
              <p className="text-xs text-slate-500">Live evaluation logs including skip reasons and idempotency duplicate protection keys.</p>
            </div>

            <div className="overflow-x-auto">
              {logs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic text-xs">No automation jobs evaluated yet. Run simulator to trigger.</div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold bg-slate-50">
                      <th className="py-2.5 px-3">Trigger Type</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Idempotency Key</th>
                      <th className="py-2.5 px-3">Delivered Message Payload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {logs.map((log) => (
                      <tr key={log.automationId} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900">{log.trigger}</span>
                          <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{log.automationId}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'SENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.status === 'FAILED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400" title={log.idempotencyKey}>
                          {log.idempotencyKey.substring(0, 18)}...
                        </td>
                        <td className="py-2.5 px-3 max-w-xs text-[11px] leading-relaxed text-slate-600">
                          {log.message || <span className="italic opacity-55">Skipped (No message delivered)</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
