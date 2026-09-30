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
  Mail,
  Phone,
  MessageSquare,
  Bookmark,
  ChevronRight,
  Download,
  Send,
  Eye,
  Check
} from 'lucide-react';

import { crmCampaignsService } from '../services/crmCampaignsService';
import { customerCrmService } from '../services/customerCrmService';
import { OfferCampaign, OfferRecipientTrack, ExportAuditLog, CampaignTargetSegment, DeliveryChannel } from '../types/crmCampaigns';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase69OffersShowcase() {
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // One-click offer campaign creator
  const [targetSegment, setTargetSegment] = useState<CampaignTargetSegment>('VIP');
  const [channel, setChannel] = useState<DeliveryChannel>('WhatsApp');
  const [campaignName, setCampaignName] = useState('Festive VIP Shave flat ₹150 Off');
  const [offerTitle, setOfferTitle] = useState('Festive Royal Beard Trim Special');
  const [offerMessage, setOfferMessage] = useState('Exclusive treat for our Royal VIP clients — claim ₹150 off on our classic shave and royal hot towel!');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED');
  const [discountValue, setDiscountValue] = useState('150');
  const [ctaText, setCtaText] = useState('Claim Flat ₹150 Discount');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-15');
  const [service, setService] = useState('Classic Royal Trim');

  // Active user authorization simulated for data export
  const [authorizedUserId, setAuthorizedUserId] = useState('usr-owner-royal');

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<string | null>(null);

  // Automated Test State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Dynamic service values
  const campaigns = crmCampaignsService.getCampaigns(currentBusinessId);
  const tracks = selectedCampaignId ? crmCampaignsService.getRecipientTracks(selectedCampaignId) : [];
  const exportLogs = crmCampaignsService.getExportAuditLogs(currentBusinessId);

  // Preview count targeting helper
  const getSimulatedCount = () => {
    if (targetSegment === 'ALL') {
      return customerCrmService.getCustomers(currentBusinessId).length;
    }
    const segMap: Record<CampaignTargetSegment, any> = {
      ALL: 'NEW',
      BIRTHDAY_MONTH: 'BIRTHDAY_MONTH',
      INACTIVE: 'INACTIVE',
      RETURNING: 'RETURNING',
      VIP: 'VIP',
      DUE_FOR_VISIT: 'DUE_FOR_VISIT'
    };
    return customerCrmService.getSegmentCustomers(currentBusinessId, segMap[targetSegment], '2026-09-29').length;
  };

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { campaign, recipientsReached } = crmCampaignsService.launchOneClickCampaign(currentBusinessId, {
        campaignName,
        offerTitle,
        offerMessage,
        discountType,
        discountValue: parseFloat(discountValue) || 0,
        startDate,
        endDate,
        applicableServices: [service],
        ctaText,
        channel,
        targetSegment
      });

      showFeedback(`One-Click Campaign launched successfully! Reached ${recipientsReached} consented customers.`);
      setSelectedCampaignId(campaign.campaignId);
    } catch (err: any) {
      showFeedback(`Campaign launch failed: ${err.message}`);
    }
  };

  const handleExportCsv = () => {
    try {
      const { csvContent, log } = crmCampaignsService.exportCustomersToCsv(currentBusinessId, authorizedUserId);
      
      // Simulate file download trigger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customer_export_${currentBusinessId}_${new Date().toISOString().substring(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showFeedback(`Customers CSV successfully generated and downloaded! Scoped count: ${log.exportedCount}. Audit logged.`);
    } catch (err: any) {
      showFeedback(`Export denied: ${err.message}`);
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
    'biz-spa-002': 'Zenith Stone Spa'
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 6.9 — One-Click Offers & Audited CSV Export</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Instant Multi-Channel Campaigning & Secure Customer Data Export
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Launch targeting campaigns over WhatsApp, SMS, and Email with strict consent filter blocks. Export CSV records strictly isolated under tenant permission boundaries, and monitored under immutable security audit streams.
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
              <span>Run Suite 36 Tests</span>
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
            { id: 'biz-barber-001', label: 'Royal Crown Barber', icon: Scissors },
            { id: 'biz-spa-002', label: 'Zenith Stone Spa', icon: Sparkles }
          ].map((biz) => {
            const Icon = biz.icon;
            const isSelected = currentBusinessId === biz.id;
            return (
              <button
                key={biz.id}
                onClick={() => {
                  setCurrentBusinessId(biz.id);
                  setSelectedCampaignId(null);
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
              <h3 className="font-bold text-base">Suite 36: Phase 6.9 Campaigns & Data Export Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 36') || r.suite.includes('Phase 6.9'))
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

      {/* 3. CRM Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Campaign Creator panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Send className="w-4.5 h-4.5 text-indigo-600" />
              <span>One-Click Campaign Builder</span>
            </h3>

            <form onSubmit={handleLaunchCampaign} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Target Segment</label>
                  <select
                    value={targetSegment}
                    onChange={(e) => setTargetSegment(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="ALL">All Customers</option>
                    <option value="VIP">VIP Clients Only</option>
                    <option value="BIRTHDAY_MONTH">Birthday This Month</option>
                    <option value="INACTIVE">Inactive Customers</option>
                    <option value="RETURNING">Returning Customers</option>
                    <option value="DUE_FOR_VISIT">Due for Revisit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Delivery Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="WhatsApp">WhatsApp Message</option>
                    <option value="Email">Email Template</option>
                    <option value="SMS">SMS Text Alert</option>
                    <option value="In-app">In-App Banner</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Target Count helper */}
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between text-indigo-900 font-semibold">
                <span>Estimated Target Pool Size:</span>
                <span className="font-mono text-sm font-extrabold">{getSimulatedCount()} Customers</span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Campaign Internal Name</label>
                <input
                  type="text"
                  required
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Offer Header Title</label>
                  <input
                    type="text"
                    required
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">CTA Text Action</label>
                  <input
                    type="text"
                    required
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Personalized Message Body</label>
                <textarea
                  required
                  rows={3}
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1 col-span-1">
                  <label className="font-semibold text-slate-700">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="FIXED">Flat (INR)</option>
                    <option value="PERCENTAGE">Flat %</option>
                  </select>
                </div>
                <div className="space-y-1 col-span-1">
                  <label className="font-semibold text-slate-700">Discount</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div className="space-y-1 col-span-1">
                  <label className="font-semibold text-slate-700">Service</label>
                  <input
                    type="text"
                    required
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 fill-current" />
                <span>SEND ONE-CLICK OFFER CAMPAIGN</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Campaigns list + recipient tracking logs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Data Export section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Authorized Customer Data Export</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-600">Simulated Authorized Staff Credentials</label>
                <input
                  type="text"
                  value={authorizedUserId}
                  onChange={(e) => setAuthorizedUserId(e.target.value)}
                  className="p-2 w-full bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleExportCsv}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Customer Records (CSV)</span>
                </button>
              </div>
            </div>

            {/* Export Audit trail */}
            {exportLogs.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Secure Immutable Audit Log Logs</span>
                
                <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
                  {exportLogs.map((log) => (
                    <div key={log.logId} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between font-mono">
                      <span>IP: <strong className="text-slate-900">{log.ipAddress}</strong> · User: <strong className="text-indigo-600">{log.userId}</strong></span>
                      <span className="text-slate-500">{log.timestamp.substring(11, 19)} · {log.exportedCount} records exported</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Campaigns Dispatch Monitor list */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Dispatched Campaigns</h3>
              <p className="text-xs text-slate-500">One-click campaigns and delivered tracking metrics logs.</p>
            </div>

            <div className="space-y-3">
              {campaigns.map((cam) => {
                const isSelected = selectedCampaignId === cam.campaignId;
                return (
                  <div
                    key={cam.campaignId}
                    onClick={() => setSelectedCampaignId(cam.campaignId)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between text-xs">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-extrabold text-[9px]">
                          {cam.channel}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm">{cam.campaignName}</h4>
                        <p className="text-slate-500 leading-tight">{cam.offerTitle}</p>
                      </div>

                      <div className="text-right text-[11px] font-mono font-bold text-slate-900">
                        <div>Targeted: {cam.targetedCount}</div>
                        <div className="text-emerald-600">Consented: {cam.sentCount}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Campaign recipient delivery tracks list */}
            {selectedCampaignId && (
              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Live Deliverability Tracking Logs</span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-bold">
                        <th className="py-2">Recipient Client</th>
                        <th className="py-2">Channel</th>
                        <th className="py-2">Progressive Status</th>
                        <th className="py-2">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-800">
                      {tracks.map((track) => (
                        <tr key={track.trackId}>
                          <td className="py-2 font-bold text-slate-900">{track.customerName}</td>
                          <td className="py-2 font-mono text-slate-500">{track.channel}</td>
                          <td className="py-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              track.status === 'REDEEMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : track.status === 'CLICKED' || track.status === 'OPENED'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {track.status}
                            </span>
                          </td>
                          <td className="py-2 text-slate-400 font-mono">{track.timestamp.substring(11, 19)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
