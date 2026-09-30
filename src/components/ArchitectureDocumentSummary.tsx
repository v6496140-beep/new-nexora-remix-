import React from 'react';
import { FileText, CheckCircle2, ShieldCheck, Database, Layers, ArrowRight } from 'lucide-react';

export const ArchitectureDocumentSummary: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-8 text-xs text-slate-700">
      {/* Document Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Official Architecture Specification</span>
          <span aria-hidden="true">·</span>
          <span>Phase 1 Deliverable</span>
          <span aria-hidden="true">·</span>
          <span>Nexora SalonOS Platform</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          System Architecture, Information Hierarchy & Domain Boundaries
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
          This document defines the structural blueprint of the Nexora SalonOS SaaS platform. Under strict Phase Mode enforcement, this document establishes the taxonomy, relationships, authorization boundaries, and low-fidelity screen geometry prior to any backend, database, or functional production code implementation.
        </p>
      </div>

      {/* Section 1: Executive Concept & Ten Categories */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-700" />
          <span>1. Concept & Unified Category Engine</span>
        </h3>
        <p className="leading-relaxed">
          Nexora SalonOS is built upon a <strong>Single Shared Template Engine</strong>. Rather than engineering ten separate vertical products, the platform uses a 5-tier declarative transformation pipeline:
        </p>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-slate-800 text-[11px]">
          CATEGORY (Taxonomy & Rules) → TEMPLATE (Layout Scaffolding) → THEME (Design Tokens) → CONTENT (Tenant Data) → PUBLIC WEBSITE (Rendered Application)
        </div>
        <p className="leading-relaxed">
          The 10 supported industry verticals share the exact same component schemas:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
          <div className="p-2 border border-slate-200 rounded bg-white">1. Barber</div>
          <div className="p-2 border border-slate-200 rounded bg-white">2. Hair Salon</div>
          <div className="p-2 border border-slate-200 rounded bg-white">3. Beauty Parlour</div>
          <div className="p-2 border border-slate-200 rounded bg-white">4. Nail Studio</div>
          <div className="p-2 border border-slate-200 rounded bg-white">5. Spa</div>
          <div className="p-2 border border-slate-200 rounded bg-white">6. Massage Studio</div>
          <div className="p-2 border border-slate-200 rounded bg-white">7. Tattoo Studio</div>
          <div className="p-2 border border-slate-200 rounded bg-white">8. Unisex Salon</div>
          <div className="p-2 border border-slate-200 rounded bg-white">9. Makeup Studio</div>
          <div className="p-2 border border-slate-200 rounded bg-white">10. Wellness Studio</div>
        </div>
      </section>

      {/* Section 2: Global Navigation Specification */}
      <section className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-slate-700" />
          <span>2. Global Public Navigation Specification</span>
        </h3>
        <p className="leading-relaxed">
          Every generated tenant website strictly adheres to a uniform 1-row, 3-zone Top Bar Contract:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 border border-slate-200 rounded bg-slate-50 space-y-1">
            <span className="font-semibold text-slate-900">Zone 1: Brand Wordmark</span>
            <p className="text-slate-600 text-[11px]">
              Single clean brand title element rendered in the chosen theme typography. No clutter, location badges, or decorative tags.
            </p>
          </div>
          <div className="p-3 border border-slate-200 rounded bg-slate-50 space-y-1">
            <span className="font-semibold text-slate-900">Zone 2: Navigation Links</span>
            <p className="text-slate-600 text-[11px] font-mono">
              Home · Services · Packages · Gallery · About · Contact · My Bookings
            </p>
          </div>
          <div className="p-3 border border-slate-200 rounded bg-slate-50 space-y-1">
            <span className="font-semibold text-slate-900">Zone 3: Actions & Auth</span>
            <p className="text-slate-600 text-[11px]">
              Sign In / Sign Up customer portal triggers + Primary high-contrast CTA: <strong>"Book Now"</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: The 16 Product Areas Matrix */}
      <section className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-700" />
          <span>3. The 16 Major Product Areas (A through P)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>A. Marketing Website:</strong> Public SaaS landing & sign-up
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>B. Business Onboarding:</strong> Category & wizard setup
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>C. Public Website:</strong> Branded client-facing tenant site
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>D. Customer Account:</strong> Bookings history & receipts
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>E. Booking Experience:</strong> 5-step slot reservation funnel
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>F. Business Admin:</strong> Master calendar & salon ops
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>G. Staff Management:</strong> Rosters, shifts & chairs
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>H. Website Builder:</strong> No-code section & theme editor
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>I. Payments:</strong> POS, online deposits & card processing
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>J. Financial Management:</strong> Register close & P&L ledger
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>K. Commission:</strong> Staff tiered splits & tip pools
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>L. Qualification Tracking:</strong> Licenses & credential gates
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>M. Settlements:</strong> Bank payouts & escrow pipeline
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>N. Tax / TDS Tracking:</strong> GST/VAT & statutory withholding
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>O. Audit / Compliance:</strong> Immutable audit logs & waivers
          </div>
          <div className="p-2.5 border border-slate-200 rounded bg-slate-50">
            <strong>P. Platform Super Admin:</strong> Multi-tenant governance
          </div>
        </div>
      </section>

      {/* Section 4: Role-Based Authorization Matrix */}
      <section className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-700" />
          <span>4. Primary User Roles & Governance Hierarchy</span>
        </h3>
        <p className="leading-relaxed">
          The system strictly enforces role boundaries across six user classes:
        </p>
        <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
          <li><strong>Visitor:</strong> Unauthenticated public. Browses public tenant site, triggers booking engine, guest intake.</li>
          <li><strong>Customer:</strong> Authenticated client. Accesses My Bookings, self-service cancellation, past receipts, saved medical/allergy preferences.</li>
          <li><strong>Staff:</strong> Stylist / Artist / Therapist. Personal roster, execution status transitions, personal commission ledger, license document upload.</li>
          <li><strong>Manager:</strong> Front desk / Shift supervisor. Master salon calendar, walk-in bookings, staff shift overrides, POS checkout, daily cash close.</li>
          <li><strong>Business Owner:</strong> Tenant administrator. Website Builder, pricing menu, staff commission rules, bank payout connection, tax liabilities.</li>
          <li><strong>Platform Super Admin:</strong> Nexora operator. Multi-tenant provisioning, category template catalog distribution, SaaS billing, platform GMV reconciliation.</li>
        </ul>
      </section>

      {/* Phase 1 Completion Confirmation */}
      <div className="p-4 bg-slate-900 text-white rounded-lg flex items-center justify-between">
        <div>
          <span className="font-bold text-xs uppercase tracking-wider text-slate-300">Phase 1 Boundary Enforcement</span>
          <p className="text-xs text-slate-300 mt-0.5">
            Architecture, Information Hierarchy, User Flows, and Low-Fidelity Wireframes fully defined. Awaiting Phase 2 instruction.
          </p>
        </div>
        <span className="text-xs font-mono bg-slate-800 border border-slate-700 px-3 py-1.5 rounded text-white shrink-0">
          PHASE 1 COMPLETE
        </span>
      </div>
    </div>
  );
};
