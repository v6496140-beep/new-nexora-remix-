import React, { useState } from 'react';
import { USER_FLOWS, UserFlow } from '../data/productArchitectureData';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  User,
  Monitor,
  ChevronRight,
  GitFork,
  Layers,
  FolderTree,
  Shield,
  Clock,
  Sparkles,
  KeyRound,
  FileCheck,
  CreditCard,
  Building,
  Users,
  Settings,
  DollarSign,
  Palette,
  Image,
  Star,
  FileText,
  Lock,
} from 'lucide-react';

export const UserFlowsView: React.FC = () => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>('flow-1-owner');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'diagram' | 'tree' | 'trace'>('diagram');

  const selectedFlow: UserFlow =
    USER_FLOWS.find((f) => f.id === selectedFlowId) || USER_FLOWS[0];

  const handleSelectFlow = (id: string) => {
    setSelectedFlowId(id);
    setActiveStepIndex(0);
  };

  const activeStep = selectedFlow.steps[activeStepIndex] || selectedFlow.steps[0];

  // Specific Information Architecture nodes for Flow 4 (Business Admin - 19 areas)
  const businessAdminAreas = [
    { code: '01', name: 'Overview', desc: 'Real-time KPIs, occupancy rate, daily gross volume & fast action shortcuts', category: 'Operations' },
    { code: '02', name: 'Bookings', desc: 'Master appointment register, search, filters & status lifecycle transitions', category: 'Operations' },
    { code: '03', name: 'Calendar', desc: 'Multi-chair, multi-staff visual appointment grid (Day / Week / Room views)', category: 'Operations' },
    { code: '04', name: 'Customers', desc: 'Client CRM profiles, appointment histories, patch test records & intake waivers', category: 'CRM' },
    { code: '05', name: 'Services', desc: 'Catalogue management, duration increments, category taxonomy & pricing tiers', category: 'Catalogue' },
    { code: '06', name: 'Packages', desc: 'Multi-service bundled offerings, seasonal packages & gift voucher links', category: 'Catalogue' },
    { code: '07', name: 'Staff', desc: 'Stylist roster, shift times, station mapping, service capabilities & leave', category: 'Operations' },
    { code: '08', name: 'Gallery', desc: 'Visual portfolio management, lookbook categories & image asset upload', category: 'Content' },
    { code: '09', name: 'Reviews', desc: 'Verified client ratings, testimonial moderation & public display toggles', category: 'CRM' },
    { code: '10', name: 'Website', desc: 'Subdomain management, custom CNAME routing, SEO metadata & live status', category: 'Website' },
    { code: '11', name: 'Theme', desc: 'Visual token customizer (palette presets, typography pairings & density)', category: 'Website' },
    { code: '12', name: 'Content', desc: 'Copywriting blocks, hero taglines, about section, policies & FAQs', category: 'Content' },
    { code: '13', name: 'Payments', desc: 'POS checkout terminal, deposit requirements & accepted payment methods', category: 'Finance' },
    { code: '14', name: 'Transactions', desc: 'Itemized ledger of online deposits, in-salon payments, refunds & tips', category: 'Finance' },
    { code: '15', name: 'Commission', desc: 'Staff compensation rules, tiered percentage splits, bonuses & deductions', category: 'Finance' },
    { code: '16', name: 'Settlements', desc: 'Automated bank payout batches, disbursement logs & escrow reconciliation', category: 'Finance' },
    { code: '17', name: 'Tax / TDS', desc: 'GST/VAT computation, contractor TDS withholding & statutory reporting', category: 'Finance' },
    { code: '18', name: 'Reports', desc: 'P&L exports, staff productivity, customer retention & inventory turnover', category: 'Analytics' },
    { code: '19', name: 'Settings', desc: 'Salon operating hours, notifications, user permissions & audit logs', category: 'Governance' },
  ];

  // Specific Information Architecture nodes for Flow 5 (Super Admin - 11 areas)
  const superAdminAreas = [
    { code: '01', name: 'Businesses', desc: 'Global multi-tenant registry (Active, Pending, Suspended salon accounts)' },
    { code: '02', name: 'Templates', desc: 'Reusable master layout library & template code scaffolding distributions' },
    { code: '03', name: 'Categories', desc: '10 category engine definitions, default taxonomies & pre-seeded service menus' },
    { code: '04', name: 'Bookings', desc: 'Cross-tenant platform booking volume telemetry & capacity health' },
    { code: '05', name: 'Transactions', desc: 'Platform GMV stream, payment gateway routing & transaction failover' },
    { code: '06', name: 'Commission', desc: 'Platform SaaS take-rate, marketplace splits & global referral incentives' },
    { code: '07', name: 'Settlements', desc: 'Global payout escrow ledger, automated merchant clearing & reserve holdbacks' },
    { code: '08', name: 'Tax Rules', desc: 'Cross-jurisdiction tax engine rules (GST/VAT/TDS compliance policies)' },
    { code: '09', name: 'Reports', desc: 'Platform-wide ARR, churn analysis, category growth trends & cohort metrics' },
    { code: '10', name: 'Audit Logs', desc: 'Immutable multi-tenant security logs, admin privilege actions & dispute forensics' },
    { code: '11', name: 'Platform Settings', desc: 'Global feature flags, API gateway configs, system rate limits & infrastructure' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Future-State Interaction Architecture</span>
              <span aria-hidden="true">·</span>
              <span>5 Core Domain Flows</span>
              <span aria-hidden="true">·</span>
              <span>Information Architecture (IA)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              User Flows & Information Architecture Diagrams
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Formal visual mapping of user journeys across the Business Owner, Customer, Staff, Business Admin, and Platform Super Admin domains.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setViewMode('diagram')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === 'diagram'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Flow Diagram
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === 'tree'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IA Tree Map
            </button>
            <button
              onClick={() => setViewMode('trace')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === 'trace'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Step Spec Trace
            </button>
          </div>
        </div>

        {/* 5 User Flow Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
          {USER_FLOWS.map((flow, idx) => (
            <button
              key={flow.id}
              onClick={() => handleSelectFlow(flow.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors text-left flex items-center gap-2 ${
                selectedFlow.id === flow.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="font-mono text-[10px] opacity-60">0{idx + 1}</span>
              <span className="font-semibold">{flow.title.split('—')[1] || flow.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Flow Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
              Selected Domain Architecture
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {selectedFlow.title}
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {selectedFlow.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs px-3 py-1.5 bg-slate-100 border border-slate-200 rounded text-slate-800 font-medium">
              Primary Actor: <strong>{selectedFlow.primaryActor}</strong>
            </span>
          </div>
        </div>

        {/* Prerequisites & Success Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <span className="font-semibold text-slate-700 uppercase text-[10px] block mb-1">
              Prerequisites & Context
            </span>
            <div className="text-slate-600">{selectedFlow.prerequisites}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <span className="font-semibold text-slate-700 uppercase text-[10px] block mb-1">
              Target State & Success Outcome
            </span>
            <div className="text-slate-600">{selectedFlow.successOutcome}</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: VISUAL FLOW DIAGRAM */}
      {/* ========================================================================= */}
      {viewMode === 'diagram' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Visual Flow Sequence & Transition Chain
              </h4>
              <p className="text-xs text-slate-500">
                Click any node in the sequential flow diagram to inspect screen interactions and system responses.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {selectedFlow.steps.length} sequential nodes
            </span>
          </div>

          {/* Connected Flow Diagram Nodes */}
          <div className="overflow-x-auto py-4">
            <div className="flex items-center gap-2 min-w-max pb-2">
              {selectedFlow.steps.map((st, i) => {
                const isActive = i === activeStepIndex;
                const isLast = i === selectedFlow.steps.length - 1;
                return (
                  <React.Fragment key={st.stepNumber}>
                    <button
                      onClick={() => setActiveStepIndex(i)}
                      className={`p-3.5 rounded-lg border text-left text-xs transition-all w-48 shrink-0 flex flex-col justify-between h-28 relative ${
                        isActive
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-[10px] font-bold opacity-60">
                          NODE 0{st.stepNumber}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <div className="font-bold text-xs truncate w-full my-auto">
                        {st.title}
                      </div>
                      <div
                        className={`text-[10px] font-mono truncate w-full ${
                          isActive ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {st.screen.split('(')[0]}
                      </div>
                    </button>
                    {!isLast && (
                      <div className="text-slate-400 font-bold px-1 shrink-0">
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Deep Node Inspector Card */}
          <div className="border border-slate-200 rounded-lg p-5 bg-slate-50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                  {activeStep.stepNumber}
                </span>
                <div>
                  <h5 className="font-bold text-sm text-slate-900">
                    Node {activeStep.stepNumber}: {activeStep.title}
                  </h5>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      Actor: <strong>{activeStep.actor}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Monitor className="w-3 h-3 text-slate-400" />
                      Screen: {activeStep.screen}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous Node
                </button>
                <button
                  disabled={activeStepIndex === selectedFlow.steps.length - 1}
                  onClick={() =>
                    setActiveStepIndex((prev) =>
                      Math.min(selectedFlow.steps.length - 1, prev + 1)
                    )
                  }
                  className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-40"
                >
                  Next Node →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3.5 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-semibold text-slate-900 uppercase text-[10px] block text-slate-500">
                  User Interaction / Action
                </span>
                <p className="text-slate-700 leading-relaxed">{activeStep.action}</p>
              </div>
              <div className="bg-white p-3.5 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-semibold text-slate-900 uppercase text-[10px] block text-slate-500">
                  System Response & Data Mutation
                </span>
                <p className="text-slate-700 leading-relaxed">{activeStep.systemResponse}</p>
              </div>
              <div className="bg-white p-3.5 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-semibold text-slate-900 uppercase text-[10px] block text-slate-500">
                  Edge Cases & Boundaries
                </span>
                <p className="text-slate-700 leading-relaxed">{activeStep.edgeCases}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: INFORMATION ARCHITECTURE TREE (SPECIAL FOCUS FOR FLOW 4 & 5) */}
      {/* ========================================================================= */}
      {viewMode === 'tree' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          {/* FLOW 4 SPECIAL: BUSINESS ADMIN IA (19 DOMAINS) */}
          {selectedFlow.id === 'flow-4-admin' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  Information Architecture Diagram
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Business Admin Information Architecture (19 Core Areas)
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Hierarchical taxonomy branching from the root authentication into 19 dedicated operational, marketing, and financial management sub-domains.
                </p>
              </div>

              {/* Root Node */}
              <div className="flex flex-col items-center">
                <div className="bg-slate-900 text-white px-6 py-3 rounded-lg text-center font-bold text-xs tracking-wider shadow-sm flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>LOGIN → DASHBOARD (ROOT)</span>
                </div>
                <div className="w-0.5 h-6 bg-slate-300" />
              </div>

              {/* 19 Areas Sub-grid organized cleanly */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {businessAdminAreas.map((area) => (
                  <div
                    key={area.code}
                    className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-white hover:border-slate-300 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">
                        DOMAIN {area.code}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        {area.category}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{area.name}</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{area.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FLOW 5 SPECIAL: SUPER ADMIN IA (11 AREAS) */}
          {selectedFlow.id === 'flow-5-superadmin' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  Multi-Tenant Governance IA Diagram
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Platform Super Admin Information Architecture (11 Governance Areas)
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Structural architecture for supervising cross-tenant operations, global template distributions, platform GMV transactions, and security audits.
                </p>
              </div>

              {/* Root Node */}
              <div className="flex flex-col items-center">
                <div className="bg-slate-900 text-white px-6 py-3 rounded-lg text-center font-bold text-xs tracking-wider shadow-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>SUPER ADMIN LOGIN → PLATFORM DASHBOARD (ROOT)</span>
                </div>
                <div className="w-0.5 h-6 bg-slate-300" />
              </div>

              {/* 11 Areas Sub-grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {superAdminAreas.map((area) => (
                  <div
                    key={area.code}
                    className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-white hover:border-slate-300 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">
                        AREA {area.code}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        Governance
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{area.name}</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{area.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FLOW 3 SPECIAL: STAFF IA */}
          {selectedFlow.id === 'flow-3-staff' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  Staff Workspace IA Diagram
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Staff Information Architecture & Navigation Tree
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Structural hierarchy for stylists, barbers, and therapists accessing personal appointments, availability, and client treatment records.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-slate-900 text-white px-6 py-3 rounded-lg text-center font-bold text-xs tracking-wider shadow-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>STAFF LOGIN → STAFF DASHBOARD (ROOT)</span>
                </div>
                <div className="w-0.5 h-6 bg-slate-300" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                {[
                  { name: "Today's Appointments", desc: 'Queue view of today clients & start times' },
                  { name: 'Calendar', desc: 'Weekly & monthly personal shift schedule' },
                  { name: 'Customer Details', desc: 'Allergies, previous treatment notes & formulas' },
                  { name: 'Appointment Status', desc: 'In Service / Completed / No-Show lifecycle' },
                  { name: 'Profile', desc: 'Bio, specialty tags & license upload repository' },
                  { name: 'Availability', desc: 'Working hours preferences & time-off requests' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 space-y-1">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">0{idx + 1}</span>
                    <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Default Tree View for Flows 1 and 2 */}
          {(selectedFlow.id === 'flow-1-owner' || selectedFlow.id === 'flow-2-customer') && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-sm font-bold text-slate-900">
                  Sequential Linear Hierarchy ({selectedFlow.steps.length} Nodes)
                </h4>
                <p className="text-xs text-slate-500">
                  Step-by-step tree visualization from first touchpoint to terminal success state.
                </p>
              </div>
              <div className="space-y-2">
                {selectedFlow.steps.map((st, i) => (
                  <div
                    key={st.stepNumber}
                    className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400 text-xs w-6">0{st.stepNumber}</span>
                      <span className="font-bold text-slate-900">{st.title}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 font-mono text-[11px]">{st.screen}</span>
                    </div>
                    <span className="text-slate-500 text-[11px] italic">{st.actor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 3: STEP SPEC TRACE (FULL TABLE) */}
      {/* ========================================================================= */}
      {viewMode === 'trace' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h4 className="text-sm font-bold text-slate-900">
              Complete Sequential Step Trace: {selectedFlow.title}
            </h4>
            <p className="text-xs text-slate-500">
              Exhaustive matrix of actors, interface screens, interaction triggers, and edge cases.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-600">
                  <th className="py-2.5 px-3 font-semibold w-12">#</th>
                  <th className="py-2.5 px-3 font-semibold w-44">Stage Node</th>
                  <th className="py-2.5 px-3 font-semibold w-32">Actor</th>
                  <th className="py-2.5 px-3 font-semibold w-48">Screen Surface</th>
                  <th className="py-2.5 px-3 font-semibold">Interaction & System Mutation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {selectedFlow.steps.map((st) => (
                  <tr key={st.stepNumber}>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{st.stepNumber}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{st.title}</td>
                    <td className="py-2.5 px-3">{st.actor}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{st.screen}</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <span className="text-slate-900 font-medium">{st.action}</span>
                      <span className="text-slate-400 mx-1.5">→</span>
                      <span className="text-slate-500 italic">{st.systemResponse}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
