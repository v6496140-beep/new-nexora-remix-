import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Scissors,
  Sparkles,
  Sparkle,
  Award,
  Clock,
  Calendar,
  AlertTriangle,
  UserCheck,
  TrendingUp,
  Plus,
  Lock,
  User,
  DollarSign
} from 'lucide-react';

import { BusinessOperationalDashboardService } from '../services/businessOperationalDashboardService';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase59OperationalDashboardShowcase() {
  const [dashboardService] = useState(() => new BusinessOperationalDashboardService());
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');
  const [currentUserRole, setCurrentUserRole] = useState<'OWNER' | 'MANAGER' | 'STAFF' | 'CUSTOMER'>('OWNER');

  // Automated Test Suite State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Dashboard Data
  const summary = dashboardService.getSummary(currentBusinessId, '2026-10-20');
  const staffStatuses = dashboardService.getStaffOperationalStatuses(currentBusinessId, '2026-10-20');
  const performance = dashboardService.getServicePerformance(currentBusinessId);
  const snapshot = dashboardService.getCustomerSnapshot(currentBusinessId, '2026-10-20');
  const alerts = dashboardService.getOperationalAlerts(currentBusinessId);

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

  // Role visibility restriction check
  const isStaffOrCustomer = currentUserRole === 'STAFF' || currentUserRole === 'CUSTOMER';

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 5.9 — Business Operational Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Operational Command Center & Real-Time Salon Visibility
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Unified operational dashboard tracking daily appointments, staff status, service performance, customer snapshots, and operational alerts across role permission hierarchies.
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
              <span>Run Suite 26 Tests</span>
            </button>
          </div>
        </div>

        {/* Tenant & Role Selector Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Business:
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

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Active Role:</span>
            <select
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="OWNER">Owner</option>
              <option value="MANAGER">Manager</option>
              <option value="STAFF">Staff Member</option>
              <option value="CUSTOMER">Customer View</option>
            </select>
          </div>
        </div>
      </div>

      {/* Role-based restriction notice */}
      {isStaffOrCustomer && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Restricted Mode: Active role '{currentUserRole}' hides financial & compliance sensitive administrative configurations.</span>
        </div>
      )}

      {/* 2. Automated Test Results Runner */}
      {testResults && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-base">Suite 26: Phase 5.9 Operational Dashboard Automated Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 26') || r.suite.includes('Phase 5.9'))
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

      {/* 3. Top Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Today's Appts", val: summary.todaysAppointments, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { label: 'Upcoming', val: summary.upcoming, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Completed Today', val: summary.completedToday, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Pending', val: summary.pending, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Cancelled', val: summary.cancelled, color: 'text-slate-600 bg-slate-50 border-slate-200' },
          { label: 'No-Show', val: summary.noShow, color: 'text-rose-600 bg-rose-50 border-rose-100' }
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${item.color} space-y-1 shadow-xs`}>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{item.label}</span>
            <div className="text-2xl font-extrabold">{item.val}</div>
          </div>
        ))}
      </div>

      {/* 4. Operational Alerts */}
      {alerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Operational Alerts ({alerts.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-white rounded-xl border border-rose-200 text-rose-800 font-medium shadow-xs">
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Quick Actions & Staff Status */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-2 text-xs font-semibold">
              {[
                { label: 'Create Booking', icon: Plus },
                { label: 'Add Customer', icon: Users },
                { label: 'Add Service', icon: Scissors },
                { label: 'Add Staff', icon: UserCheck },
                { label: 'View Calendar', icon: Calendar }
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <button
                    key={i}
                    onClick={() => alert(`Action triggered: ${act.label}`)}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition-all text-left"
                  >
                    <Icon className="w-4 h-4 text-indigo-600" />
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Staff Status */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Staff Operational Status</h2>
            <div className="space-y-3 text-xs">
              {staffStatuses.map((stf) => (
                <div key={stf.staffId} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{stf.staffName}</div>
                    <div className="text-[11px] text-slate-500">
                      {stf.nextAppointmentTime ? `Next: ${stf.nextAppointmentTime}` : 'No upcoming appt'}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      stf.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : stf.status === 'BUSY'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {stf.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Service Performance & Customer Snapshot */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Customer Snapshot</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">New Customers</span>
                <div className="text-xl font-extrabold text-indigo-600">{snapshot.newCustomers}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Returning</span>
                <div className="text-xl font-extrabold text-emerald-600">{snapshot.returningCustomers}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Upcoming Visits</span>
                <div className="text-xl font-extrabold text-blue-600">{snapshot.upcomingVisits}</div>
              </div>
            </div>
          </div>

          {/* Service Performance */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Service Performance (Bookings by Service)</h2>
            <div className="space-y-3 text-xs">
              {Object.keys(performance.byService).length === 0 ? (
                <div className="p-6 text-center text-slate-500">No service booking records found.</div>
              ) : (
                Object.entries(performance.byService).map(([serviceName, count], idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-800">{serviceName}</span>
                    <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-mono font-bold">
                      {count} bookings
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
