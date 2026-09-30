import React, { useState } from 'react';
import {
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
  Lock,
  FileText,
  Check,
  X,
  AlertCircle,
  Globe,
  Sliders,
  Bell,
  Star,
  Clock3
} from 'lucide-react';

import { securityHardeningService, UserRole } from '../services/securityHardeningService';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase510SecurityDeliverablesShowcase() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('STAFF');
  const [actorTenantId, setActorTenantId] = useState<string>('biz-barber-001');
  const [targetTenantId, setTargetTenantId] = useState<string>('biz-barber-001');
  const [selectedAction, setSelectedAction] = useState<string>('VIEW_OWN_APPOINTMENTS');

  // Test Suite State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const authResult = securityHardeningService.authorize(selectedRole, actorTenantId, targetTenantId, selectedAction);

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
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phase 5.10 — Operations Security & Hardening</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Role Matrix Enforcement, Tenant Isolation & Phase 5 Deliverables Report
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Comprehensive security hardening of Customer CRM, Staff Management, Staff Dashboard, Daily Operations, Reviews, and Communication modules. Enforces strict RBAC and tenant data boundaries.
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
              <span>Run Suites 1–27 Tests</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Automated Test Results Runner */}
      {testResults && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-base">Comprehensive Test Suite Results (Suites 1–27)</h3>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
            {testResults.results.map((res, i) => (
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
                  <div className="font-semibold text-slate-100">{res.suite}: {res.name}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{res.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Security & RBAC Interactive Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Role Authorization & Tenant Isolation Simulator</h2>
            <p className="text-xs text-slate-500">Test backend security guards for roles, actions, and cross-tenant boundaries.</p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              authResult.allowed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {authResult.allowed ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">User Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="BUSINESS_OWNER">BUSINESS_OWNER</option>
              <option value="MANAGER">MANAGER</option>
              <option value="STAFF">STAFF</option>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Actor Tenant ID</label>
            <input
              type="text"
              value={actorTenantId}
              onChange={(e) => setActorTenantId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Target Tenant ID (Isolation Check)</label>
            <input
              type="text"
              value={targetTenantId}
              onChange={(e) => setTargetTenantId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Requested Action</label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="VIEW_OWN_APPOINTMENTS">VIEW_OWN_APPOINTMENTS</option>
              <option value="UPDATE_OWN_SCHEDULE">UPDATE_OWN_SCHEDULE</option>
              <option value="MANAGE_TAX_CONFIGURATION">MANAGE_TAX_CONFIGURATION</option>
              <option value="CREATE_REVIEW">CREATE_REVIEW</option>
              <option value="MANAGE_BUSINESS">MANAGE_BUSINESS</option>
            </select>
          </div>
        </div>

        <div className={`p-4 rounded-xl border text-xs ${
          authResult.allowed ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <span className="font-bold">Evaluation Result: </span>
          {authResult.allowed ? 'Request authorized successfully.' : authResult.reason}
        </div>
      </div>

      {/* 4. Phase 5 Final Deliverables Report */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-slate-900 text-lg">Phase 5 Final Deliverables Report</h2>
          <p className="text-xs text-slate-500">Summary of all implemented modules and known production constraints.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>1. Customer CRM (Phase 5.1 & 5.2)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Full CRM records with profile metrics, complete booking history, lifetime spend arithmetic, and tenant-isolated customer search.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Scissors className="w-4 h-4 text-indigo-600" />
                <span>2. Staff Management & Leave (Phase 5.3 & 5.4)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Staff CRUD, service linking, working hours, and time-off leave request workflows with manager approval cycles.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-indigo-600" />
                <span>3. Staff Dashboard & Daily Operations (Phase 5.5 & 5.6)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Staff home view, today's schedule, timeline slot queues, and operational action transitions (<code className="text-indigo-700">CHECK_IN → START → COMPLETED</code> or <code className="text-indigo-700">NO_SHOW</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-indigo-600" />
                <span>4. Reviews & Ratings (Phase 5.7)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Strict completed booking eligibility, 1–5 star ratings, anti-abuse duplicate review prevention, moderation queue, and public widgets.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600" />
                <span>5. Customer Communication (Phase 5.8)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Provider-agnostic adapters (Email, WhatsApp, SMS, In-App), event dispatchers, template variable interpolation, and consent preference checks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>6. Operational Dashboard & Security (Phase 5.9 & 5.10)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Command center metrics, staff operational status, service performance, role matrix authorization, and tenant isolation tests.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Known Limitations</span>
              </h3>
              <ul className="list-disc list-inside text-amber-800 space-y-1">
                <li>Email and SMS adapters run in simulated preview mode (production webhooks require live gateway keys).</li>
                <li>In-memory multi-tenant state repository resets upon page refresh unless persisted to backend DB.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
