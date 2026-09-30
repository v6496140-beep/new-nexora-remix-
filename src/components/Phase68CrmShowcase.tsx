import React, { useState } from 'react';
import {
  Users,
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
  UserCheck,
  Check,
  Mail,
  Phone,
  MessageSquare,
  Cake,
  Bookmark,
  ChevronRight
} from 'lucide-react';

import { customerCrmService } from '../services/customerCrmService';
import { CrmCustomer, TimelineEvent, CrmSegmentType } from '../types/customerCrm';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase68CrmShowcase() {
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');
  const [selectedSegment, setSelectedSegment] = useState<CrmSegmentType | 'ALL'>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<CrmCustomer | null>(null);

  // Revisit Config input
  const [revisitDays, setRevisitDays] = useState(customerCrmService.getRevisitDays(currentBusinessId).toString());

  // Form Inputs
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDob, setNewDob] = useState('1994-09-10');
  const [newGender, setNewGender] = useState('Male');
  const [newVisits, setNewVisits] = useState('1');
  const [newSpendInr, setNewSpendInr] = useState('150');
  const [newNotes, setNewNotes] = useState('');
  const [newTags, setNewTags] = useState('First timer');
  
  // Consent
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [whatsappConsent, setWhatsappConsent] = useState(true);
  const [emailConsent, setEmailConsent] = useState(true);
  const [smsConsent, setSmsConsent] = useState(false);

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
  const activeRevisitThreshold = customerCrmService.getRevisitDays(currentBusinessId);
  const allCustomers = customerCrmService.getCustomers(currentBusinessId);

  // Compute segment counts
  const segmentStats: Record<CrmSegmentType, number> = {
    NEW: customerCrmService.getSegmentCustomers(currentBusinessId, 'NEW').length,
    RETURNING: customerCrmService.getSegmentCustomers(currentBusinessId, 'RETURNING').length,
    VIP: customerCrmService.getSegmentCustomers(currentBusinessId, 'VIP').length,
    INACTIVE: customerCrmService.getSegmentCustomers(currentBusinessId, 'INACTIVE').length,
    BIRTHDAY_MONTH: customerCrmService.getSegmentCustomers(currentBusinessId, 'BIRTHDAY_MONTH', '2026-09-29').length,
    DUE_FOR_VISIT: customerCrmService.getSegmentCustomers(currentBusinessId, 'DUE_FOR_VISIT', '2026-09-29').length,
    HIGH_SPENDING: customerCrmService.getSegmentCustomers(currentBusinessId, 'HIGH_SPENDING').length,
    FREQUENT: customerCrmService.getSegmentCustomers(currentBusinessId, 'FREQUENT').length
  };

  const filteredCustomers = selectedSegment === 'ALL'
    ? allCustomers
    : customerCrmService.getSegmentCustomers(currentBusinessId, selectedSegment, '2026-09-29');

  const handleUpdateRevisitDays = (e: React.FormEvent) => {
    e.preventDefault();
    const days = parseInt(revisitDays) || 30;
    customerCrmService.updateRevisitDays(currentBusinessId, days);
    showFeedback(`Revisit reminder timeline threshold updated to ${days} days.`);
  };

  const handleRegisterOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newEmail) {
      showFeedback('Please fill out Name, Phone, and Email fields.');
      return;
    }

    const created = customerCrmService.registerCustomer({
      businessId: currentBusinessId,
      tenantId: currentBusinessId,
      name: newName,
      phone: newPhone,
      email: newEmail,
      dob: newDob || undefined,
      dateOfBirth: newDob || undefined,
      gender: newGender,
      lastVisit: new Date().toISOString().substring(0, 10),
      totalVisits: parseInt(newVisits) || 1,
      totalBookings: parseInt(newVisits) || 1,
      completedBookings: parseInt(newVisits) || 1,
      cancelledBookings: 0,
      noShowBookings: 0,
      totalSpendCents: Math.round(parseFloat(newSpendInr) * 100) || 0,
      totalSpend: parseFloat(newSpendInr) || 0,
      favoriteServices: ['Signature Haircut'],
      tags: newTags.split(',').map(t => t.trim()),
      notes: newNotes,
      marketingConsent,
      whatsappOptIn: whatsappConsent,
      emailConsent,
      smsConsent,
      id: `cust-${Date.now().toString(36)}`,
      status: 'NEW',
      createdAt: new Date().toISOString()
    });

    showFeedback(`Customer '${newName}' onboarded successfully! Marketing profiles updated.`);
    
    // Reset Form
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
  };

  const handleTimelineAction = (type: TimelineEvent['type'], title: string, desc: string) => {
    if (!selectedCustomer) return;
    customerCrmService.addTimelineEvent(selectedCustomer.customerId, {
      type,
      title,
      description: desc
    });
    showFeedback(`Timeline entry logged for ${selectedCustomer.name}.`);
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
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 6.8 — Customer Growth CRM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Isolated Customer Onboarding, DOB Birthdays & Revisit Timelines
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Maintain strict multi-tenant boundary compliance. Classify customer growth tracks (VIP, Birthday Month, Inactive) with custom revisit reminder rules and interactive event logs.
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
              <span>Run Suite 35 Tests</span>
            </button>
          </div>
        </div>

        {/* Tenant Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Active Business Tenant CRM:
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
                  setSelectedSegment('ALL');
                  setSelectedCustomer(null);
                  setRevisitDays(customerCrmService.getRevisitDays(biz.id).toString());
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
              <h3 className="font-bold text-base">Suite 35: Phase 6.8 Customer Growth CRM Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 35') || r.suite.includes('Phase 6.8'))
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
        
        {/* Left Column: Segment filters sidebar & config options */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Dynamic CRM Segments</h3>
            <div className="space-y-1">
              {[
                { id: 'ALL', label: 'All Customers', count: allCustomers.length },
                { id: 'NEW', label: 'New Customers', count: segmentStats.NEW },
                { id: 'RETURNING', label: 'Returning', count: segmentStats.RETURNING },
                { id: 'VIP', label: 'VIP Clients', count: segmentStats.VIP },
                { id: 'INACTIVE', label: 'Inactive (60+ d)', count: segmentStats.INACTIVE },
                { id: 'BIRTHDAY_MONTH', label: 'Birthday This Month', count: segmentStats.BIRTHDAY_MONTH },
                { id: 'DUE_FOR_VISIT', label: 'Due for Revisit', count: segmentStats.DUE_FOR_VISIT },
                { id: 'HIGH_SPENDING', label: 'High Spenders', count: segmentStats.HIGH_SPENDING },
                { id: 'FREQUENT', label: 'Frequent (4+ v)', count: segmentStats.FREQUENT }
              ].map((seg) => {
                const isSelected = selectedSegment === seg.id;
                return (
                  <button
                    key={seg.id}
                    onClick={() => { setSelectedSegment(seg.id as any); setSelectedCustomer(null); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{seg.label}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {seg.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Config timeline revisit rule */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">Revisit Cycle Rules</h4>
            <form onSubmit={handleUpdateRevisitDays} className="space-y-2 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Days Threshold (e.g. 30)</label>
                <input
                  type="number"
                  value={revisitDays}
                  onChange={(e) => setRevisitDays(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px]"
              >
                Apply Revisit Rule
              </button>
            </form>
          </div>
        </div>

        {/* Center Column: Customers List View */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-slate-900 text-base">Onboarded Profiles</h2>
                <p className="text-xs text-slate-500">Segment filter: <span className="font-bold text-indigo-600">{selectedSegment}</span></p>
              </div>

              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                Matches: {filteredCustomers.length}
              </span>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">No clients matched in active segment.</div>
            ) : (
              <div className="space-y-3">
                {filteredCustomers.map((c) => {
                  const isSelected = selectedCustomer?.customerId === c.customerId;
                  return (
                    <div
                      key={c.customerId}
                      onClick={() => setSelectedCustomer(c)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50'
                      }`}
                    >
                      <div className="space-y-1.5 text-xs max-w-[80%]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 text-sm leading-tight">{c.name}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-semibold">
                            {c.gender}
                          </span>
                        </div>

                        <div className="text-slate-500 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.phone}</span>
                        </div>

                        {c.dob && (
                          <div className="text-slate-500 flex items-center gap-1">
                            <Cake className="w-3.5 h-3.5 text-indigo-500" />
                            <span>DOB: {c.dob}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 pt-1">
                          {c.tags.map((tag, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[9px] font-extrabold">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="text-xs font-mono font-extrabold text-slate-900">
                          ₹{(c.totalSpendCents / 100).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold">{c.totalVisits} visits</div>
                        
                        <div className="flex gap-1 justify-end pt-2">
                          <span title="WhatsApp consent opt-in" className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            c.whatsappOptIn ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-400'
                          }`}>
                            W
                          </span>
                          <span title="Marketing consent" className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            c.marketingConsent ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-400'
                          }`}>
                            M
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer Details, Timeline logs & Create Onboard customer */}
        <div className="lg:col-span-4 space-y-6">
          
          {selectedCustomer ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-950 text-sm">Customer Timeline Audit</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedCustomer.name}</span>
                </div>

                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-xs text-slate-400 font-bold hover:text-slate-600"
                >
                  Close
                </button>
              </div>

              {/* Action trigger logs */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <button
                  onClick={() => handleTimelineAction('BOOKING', 'Booking Completed', 'Classic royal haircut trim finished.')}
                  className="p-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded"
                >
                  Log Booking Completed
                </button>
                <button
                  onClick={() => handleTimelineAction('OFFER_SENT', 'Offer Sent', 'Birthday promo discount voucher shared.')}
                  className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded"
                >
                  Log Offer Sent
                </button>
              </div>

              {/* Timeline records list */}
              <div className="space-y-4">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Live CRM Activity Logs</span>
                
                <div className="relative border-l-2 border-indigo-100 pl-4 space-y-4 text-xs">
                  {customerCrmService.getCustomerTimeline(selectedCustomer.customerId).map((ev) => (
                    <div key={ev.eventId} className="relative">
                      {/* Node point */}
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                      
                      <div className="space-y-0.5">
                        <div className="font-extrabold text-slate-900 flex items-center justify-between">
                          <span>{ev.title}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{ev.timestamp.substring(11, 16)}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] leading-relaxed">{ev.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserCheck className="w-4.5 h-4.5 text-indigo-600" />
                <span>Onboard Client Profile Creation</span>
              </h2>

              <form onSubmit={handleRegisterOnboard} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Phone</label>
                    <input
                      type="text"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Date of Birth (DOB)</label>
                    <input
                      type="date"
                      value={newDob}
                      onChange={(e) => setNewDob(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Gender</label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Initial Visits</label>
                    <input
                      type="number"
                      value={newVisits}
                      onChange={(e) => setNewVisits(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Total Spend (INR)</label>
                    <input
                      type="number"
                      value={newSpendInr}
                      onChange={(e) => setNewSpendInr(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Consents checkboxes */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Marketing opt-in Consent list</span>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                    <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingConsent}
                        onChange={(e) => setMarketingConsent(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>General Marketing</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={whatsappConsent}
                        onChange={(e) => setWhatsappConsent(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>WhatsApp Opt-in</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailConsent}
                        onChange={(e) => setEmailConsent(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Email Consent</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smsConsent}
                        onChange={(e) => setSmsConsent(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>SMS Consent</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md"
                >
                  Onboard Customer Profile
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
