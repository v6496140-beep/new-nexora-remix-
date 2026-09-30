import React, { useState } from 'react';
import {
  FileText,
  Layers,
  ShieldCheck,
  GitBranch,
  Compass,
  LayoutGrid,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  DollarSign,
  Monitor,
  Search,
} from 'lucide-react';

export const Phase1DeliverablesReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'sitemap' | 'roles' | 'flows' | 'navigation' | 'inventory' | 'wireframes' | 'decisions' | 'questions'
  >('sitemap');

  const deliverables = [
    { id: 'sitemap', label: '1. Product Sitemap' },
    { id: 'roles', label: '2. Role Matrix' },
    { id: 'flows', label: '3. User Flow Diagrams' },
    { id: 'navigation', label: '4. Navigation Architecture' },
    { id: 'inventory', label: '5. Screen Inventory (66)' },
    { id: 'wireframes', label: '6. Low-Fi Wireframe Specs' },
    { id: 'decisions', label: '7. Key UX Decisions' },
    { id: 'questions', label: '8. Missing Questions' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-300 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
              <span>PHASE 1 COMPLETE DELIVERABLES PACKAGE</span>
              <span>·</span>
              <span>STRICT PHASE MODE</span>
              <span>·</span>
              <span>STRUCTURE & IA ONLY</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Nexora SalonOS: Phase 1 Final Deliverables
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Exhaustive formal documentation covering the 8 required Phase 1 deliverables: Product Sitemap, Role Matrix, User Flows, Navigation, Screen Inventory, Full-Schema Low-Fi Wireframes, UX Decisions, and Open Questions.
            </p>
          </div>

          <div className="bg-slate-900 text-white font-mono text-xs px-3 py-2 rounded text-center shrink-0">
            PHASE 1 COMPLETE — WAITING FOR APPROVAL
          </div>
        </div>

        {/* Deliverable Tabs */}
        <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-200">
          {deliverables.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveTab(d.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === d.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deliverable Content Pane */}
      <div className="bg-white border border-slate-300 rounded-lg p-6 sm:p-8 space-y-6 text-xs text-slate-800">
        {/* 1. PRODUCT SITEMAP */}
        {activeTab === 'sitemap' && (
          <div className="space-y-4 font-mono">
            <h3 className="text-base font-bold text-slate-900 font-sans border-b pb-2">
              1. Master Product Sitemap
            </h3>
            <pre className="bg-slate-50 p-4 rounded border border-slate-200 text-[11px] leading-relaxed overflow-x-auto text-slate-700">
{`NEXORA SALONOS PLATFORM SITEMAP
│
├── PLATFORM MARKETING (/marketing)
│   ├── Landing Page (/)
│   ├── Category Engine Explorer (/categories)
│   ├── Template & Theme Gallery (/templates)
│   ├── Pricing & ROI Calculator (/pricing)
│   ├── Sign In (/login)
│   └── Sign Up (/register)
│
├── BUSINESS ONBOARDING (/onboarding)
│   ├── 01. Category Selection (/onboarding/category)
│   ├── 02. Template & Theme Selection (/onboarding/template)
│   ├── 03. Business Profile & Identity (/onboarding/business-details)
│   ├── 04. Catalogue & Services Seeding (/onboarding/services)
│   ├── 05. Staff & Chair Assignment (/onboarding/staff)
│   ├── 06. Gallery Setup (/onboarding/gallery)
│   ├── 07. Weekly Operating Hours (/onboarding/hours)
│   ├── 08. Website Preview (/onboarding/preview)
│   └── 09. Launch & Publish Gateway (/onboarding/publish)
│
├── PUBLIC BUSINESS WEBSITE (tenant.nexorasalon.com)
│   ├── Home (/) [12 Sequential Sections]
│   ├── Services (/services)
│   ├── Packages (/packages)
│   ├── Gallery (/gallery)
│   ├── About (/about)
│   ├── Contact (/contact)
│   ├── My Bookings (/my-bookings)
│   ├── Sign In (/sign-in)
│   ├── Sign Up (/sign-up)
│   ├── Booking Flow (/book) [5-Step Funnel with 10m Hold]
│   └── Booking Confirmation (/book/confirmed)
│
├── CUSTOMER ACCOUNT PORTAL (/account)
│   ├── Customer Dashboard (/account/dashboard)
│   ├── Booking Details (/account/bookings/:id)
│   ├── Service History (/account/history)
│   └── Profile & Preferences (/account/profile)
│
├── BUSINESS ADMIN DASHBOARD (/admin)
│   ├── 01. Overview (/admin/overview)
│   ├── 02. Bookings (/admin/bookings)
│   ├── 03. Master Calendar (/admin/calendar)
│   ├── 04. Customers CRM (/admin/customers)
│   ├── 05. Services Menu (/admin/services)
│   ├── 06. Packages (/admin/packages)
│   ├── 07. Staff Management (/admin/staff)
│   ├── 08. Staff Availability (/admin/availability)
│   ├── 09. Gallery CMS (/admin/gallery)
│   ├── 10. Reviews Moderation (/admin/reviews)
│   ├── 11. Website Builder (/admin/builder)
│   │   ├── Pages (/admin/builder/pages)
│   │   ├── Sections (/admin/builder/sections)
│   │   ├── Theme Tokens (/admin/builder/theme)
│   │   ├── Content Copy (/admin/builder/content)
│   │   ├── Images (/admin/builder/images)
│   │   ├── Navigation Menu (/admin/builder/nav)
│   │   ├── SEO & Meta Tags (/admin/builder/seo)
│   │   ├── Preview Canvas (/admin/builder/preview)
│   │   └── Publish Release (/admin/builder/publish)
│   ├── 12. Payments & POS (/admin/payments)
│   ├── 13. Transaction Ledger (/admin/transactions)
│   ├── 14. Commission Rules (/admin/commission)
│   ├── 15. Qualification Board (/admin/qualifications)
│   ├── 16. Bank Settlements (/admin/settlements)
│   ├── 17. Tax / TDS Compliance (/admin/tax)
│   ├── 18. Financial Reports (/admin/reports)
│   └── 19. Business Settings (/admin/settings)
│
├── STAFF MOBILE / TABLET PORTAL (/staff)
│   ├── Staff Dashboard (/staff/dashboard)
│   ├── Shift Calendar (/staff/calendar)
│   ├── Appointment Consultation Drawer (/staff/appointments/:id)
│   ├── Availability Preferences (/staff/availability)
│   └── Professional Profile & Licenses (/staff/profile)
│
└── PLATFORM SUPER ADMIN (/superadmin)
    ├── Platform Health Dashboard (/superadmin/dashboard)
    ├── Tenant Businesses Registry (/superadmin/businesses)
    ├── Template Library (/superadmin/templates)
    ├── Category Engine (/superadmin/categories)
    ├── Global Transactions (/superadmin/transactions)
    ├── Platform Commission & GMV (/superadmin/commission)
    ├── Global Settlements & Escrow (/superadmin/settlements)
    ├── Jurisdiction Tax Rules (/superadmin/tax-rules)
    ├── Immutable Audit Logs (/superadmin/audit)
    └── Platform Settings (/superadmin/settings)`}
            </pre>
          </div>
        )}

        {/* 2. ROLE MATRIX */}
        {activeTab === 'roles' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              2. Primary User Roles & Governance Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-300 font-mono text-slate-700">
                    <th className="p-2">Role</th>
                    <th className="p-2">Hierarchy</th>
                    <th className="p-2">What They Can See</th>
                    <th className="p-2">What They Can Do</th>
                    <th className="p-2">Main Screens</th>
                    <th className="p-2">Data Scope & Privacy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Visitor</td>
                    <td className="p-2 font-mono">Level 1</td>
                    <td className="p-2">Public website, pricing, staff bios, open slots, reviews</td>
                    <td className="p-2">Browse site, initiate booking, choose slot, guest checkout</td>
                    <td className="p-2 font-mono text-[11px]">Screens 13–26</td>
                    <td className="p-2">Unauthenticated session only; temporary 10-min slot hold</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Customer</td>
                    <td className="p-2 font-mono">Level 2</td>
                    <td className="p-2">My Bookings, past receipts, invoices, stored preferences</td>
                    <td className="p-2">Self-service reschedule, cancel in window, download receipts</td>
                    <td className="p-2 font-mono text-[11px]">Screens 27–30</td>
                    <td className="p-2">Isolated to personal customer record and booking history</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Staff</td>
                    <td className="p-2 font-mono">Level 3</td>
                    <td className="p-2">Personal shift queue, assigned client notes, earned tips</td>
                    <td className="p-2">Mark In Service / Completed / No-Show, upload licenses</td>
                    <td className="p-2 font-mono text-[11px]">Screens 52–56</td>
                    <td className="p-2">Assigned bookings only; restricted from salon financial ledgers</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Manager</td>
                    <td className="p-2 font-mono">Level 4</td>
                    <td className="p-2">Multi-chair master calendar, cash drawer register, shift sales</td>
                    <td className="p-2">Book walk-ins, reassign chairs, close register, verify staff</td>
                    <td className="p-2 font-mono text-[11px]">Screens 31–40, 44</td>
                    <td className="p-2">Single tenant operational data; cannot change bank account</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Business Owner</td>
                    <td className="p-2 font-mono">Level 5</td>
                    <td className="p-2">Complete P&L, bank payouts, commission rules, tax liabilities</td>
                    <td className="p-2">Publish site, configure pricing, set commissions, link bank</td>
                    <td className="p-2 font-mono text-[11px]">Screens 31–51</td>
                    <td className="p-2">Full tenant ownership & fiduciary tax/compliance responsibility</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Platform Super Admin</td>
                    <td className="p-2 font-mono">Level 6</td>
                    <td className="p-2">All salons registry, platform GMV, template catalog, error logs</td>
                    <td className="p-2">Deploy category templates, manage SaaS billing, audit fraud</td>
                    <td className="p-2 font-mono text-[11px]">Screens 57–66</td>
                    <td className="p-2">Cross-tenant platform metadata; audit-logged access controls</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. USER FLOWS (WITH MOBILE-FIRST CALCULATION) */}
        {activeTab === 'flows' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              3. User Flows & Mobile-First Calculation Display
            </h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-slate-900 text-xs uppercase font-mono">
                Booking Calculation Display Specification (Mobile-First):
              </span>
              <p className="text-slate-600 text-xs leading-relaxed">
                As required, no calculation logic is implemented in Phase 1. The wireframes structurally position where these financial values appear on mobile checkout cards:
              </p>
              <div className="p-3 bg-white border border-slate-300 rounded font-mono text-xs text-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span>Total Service Price:</span>
                  <span className="font-bold">₹1,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Advance Required (%):</span>
                  <span>25%</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
                  <span>Advance Payable Now (Area I):</span>
                  <span>₹250</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Remaining Payable at Salon:</span>
                  <span>₹750</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-900 font-mono">
                Flow 1: Landing Page → Create My Website → Sign Up → Select Category → Select Template → Business Info → Services → Staff → Gallery → Opening Hours → Preview → Publish → Dashboard
              </div>
              <div className="font-bold text-slate-900 font-mono">
                Flow 2: Business Website → Services → Select Service → Select Staff → Select Date → Select Time → Customer Details → Booking Summary (₹1,000 / ₹250 / ₹750) → Advance Payment → Confirmation → My Booking
              </div>
              <div className="font-bold text-slate-900 font-mono">
                Flow 3: Staff Login → Staff Dashboard → Today Appointments → Calendar → Customer Details → Appointment Status → Profile → Availability
              </div>
            </div>
          </div>
        )}

        {/* 4. NAVIGATION ARCHITECTURE & WEBSITE BUILDER IA */}
        {activeTab === 'navigation' && (
          <div className="space-y-4 font-mono">
            <h3 className="text-base font-bold text-slate-900 font-sans border-b pb-2">
              4. Navigation Architecture & Website Builder Specification
            </h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
              <span className="font-bold text-slate-900 text-xs font-sans uppercase">
                Website Builder Information Architecture (Area H Wireframe Spec)
              </span>
              <p className="text-xs font-sans text-slate-600">
                The editor is architected around 9 structural domains. In future phases, it will support: Add section, Edit section, Hide section, Reorder section, Edit content, Change image, Change CTA.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 bg-white border rounded"><strong>1. Pages:</strong> Manage Home, Services, Packages, Gallery, About, Contact</div>
                <div className="p-2 bg-white border rounded"><strong>2. Sections:</strong> Add, edit, hide, or reorder page blocks</div>
                <div className="p-2 bg-white border rounded"><strong>3. Theme:</strong> Design tokens (palette presets, typography, radii)</div>
                <div className="p-2 bg-white border rounded"><strong>4. Content:</strong> Text blocks, taglines, philosophy, policy wording</div>
                <div className="p-2 bg-white border rounded"><strong>5. Images:</strong> Hero photos, lookbook gallery, staff portraits</div>
                <div className="p-2 bg-white border rounded"><strong>6. Navigation:</strong> Top bar nav link order & CTA label</div>
                <div className="p-2 bg-white border rounded"><strong>7. SEO:</strong> Meta title, meta description, OpenGraph preview</div>
                <div className="p-2 bg-white border rounded"><strong>8. Preview:</strong> Responsive viewport switcher (1440px / 768px / 375px)</div>
                <div className="p-2 bg-white border rounded"><strong>9. Publish:</strong> 1-click deploy to custom subdomain with SSL</div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SCREEN INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              5. Master Screen Inventory (All 66 Screens)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-2 bg-slate-50 border rounded">
                <strong>Marketing (1–5):</strong><br />
                01. Landing Page<br />02. Category Pick<br />03. Template Pick<br />04. Sign Up<br />05. Sign In
              </div>
              <div className="p-2 bg-slate-50 border rounded">
                <strong>Onboarding (6–12):</strong><br />
                06. Details<br />07. Services<br />08. Staff<br />09. Gallery<br />10. Hours<br />11. Preview<br />12. Publish
              </div>
              <div className="p-2 bg-slate-50 border rounded">
                <strong>Public Site (13–19):</strong><br />
                13. Home (12 Sec)<br />14. Services<br />15. Packages<br />16. Gallery<br />17. About<br />18. Contact<br />19. My Bookings
              </div>
              <div className="p-2 bg-slate-50 border rounded">
                <strong>Booking (20–26):</strong><br />
                20. Service Pick<br />21. Staff Pick<br />22. Date/Time<br />23. Client Info<br />24. Summary<br />25. Payment<br />26. Confirmed
              </div>
              <div className="p-2 bg-slate-50 border rounded">
                <strong>Customer (27–30):</strong><br />
                27. Dashboard<br />28. Booking Details<br />29. History<br />30. Profile
              </div>
              <div className="p-2 bg-slate-50 border rounded">
                <strong>Business Admin (31–51):</strong><br />
                31. Dashboard · 32. Bookings<br />33. Calendar · 34. Customers<br />35. Services · 36. Packages<br />37. Staff · 38. Availability<br />39. Gallery · 40. Reviews<br />41. Builder · 42. Theme<br />43. Content · 44. Payments<br />45. Transactions · 46. Commission<br />47. Quals · 48. Settlements<br />49. Tax/TDS · 50. Reports<br />51. Settings
              </div>
              <div className="p-2 bg-slate-50 border rounded">
                <strong>Staff (52–56):</strong><br />
                52. Dashboard<br />53. Calendar<br />54. Booking Drawer<br />55. Availability<br />56. Profile
              </div>
              <div className="p-2 bg-slate-50 border rounded">
                <strong>Super Admin (57–66):</strong><br />
                57. Dashboard · 58. Businesses<br />59. Templates · 60. Categories<br />61. Transactions · 62. Commission<br />63. Settlements · 64. Tax Rules<br />65. Audit Logs · 66. Settings
              </div>
            </div>
          </div>
        )}

        {/* 6. LOW-FI WIREFRAME SPECIFICATIONS & FINANCIAL STRUCTURE */}
        {activeTab === 'wireframes' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              6. Financial Structure & Wireframe Schema Alignment
            </h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-slate-900 text-xs uppercase font-mono">
                Financial Architecture Data Points Mapped in Wireframes:
              </span>
              <p className="text-slate-600 text-xs leading-relaxed">
                As required by the Phase 1 specification, no financial calculations are performed. The structural wireframes explicitly define where each required financial metric appears and how merchants navigate to it:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-white border rounded">
                  <strong>Platform Commission (10%):</strong> Mapped on Screen 46 (Commission) & Screen 62 (Super Admin Revenue).
                </div>
                <div className="p-2 bg-white border rounded">
                  <strong>Business Share (90%):</strong> Mapped on Screen 45 (Transactions) & Screen 48 (Settlements).
                </div>
                <div className="p-2 bg-white border rounded">
                  <strong>Daily QR Threshold (₹1,000):</strong> Displayed on Screen 31 (Admin Dashboard) & Screen 44 (Payments).
                </div>
                <div className="p-2 bg-white border rounded">
                  <strong>Rolling Qualification (15 Days):</strong> Mapped on Screen 47 (Qualification Matrix) & Screen 48 (Settlements).
                </div>
                <div className="p-2 bg-white border rounded">
                  <strong>TDS / Tax Tracking:</strong> Screen 49 (Tax / TDS) showing statutory withholding ledger.
                </div>
                <div className="p-2 bg-white border rounded">
                  <strong>UTR / Bank Payouts:</strong> Screen 48 (Settlements) with bank clearing reference codes.
                </div>
                <div className="p-2 bg-white border rounded">
                  <strong>Chargebacks & Reversals:</strong> Screen 45 (Transactions Ledger) with dispute reserve flags.
                </div>
                <div className="p-2 bg-white border rounded">
                  <strong>Audit Ledger:</strong> Screen 65 (Super Admin Audit) with immutable verification hashes.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. KEY UX DECISIONS */}
        {activeTab === 'decisions' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              7. Key UX Architectural Decisions
            </h3>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-3 bg-slate-50 border rounded">
                <strong>1. Unified Category Engine over 10 Codebases:</strong> All 10 salon verticals share identical structural components (`ServicesGrid`, `PackagesShowcase`, `BookingDrawer`). Differentiation is strictly declarative via tokens and terminology maps.
              </div>
              <div className="p-3 bg-slate-50 border rounded">
                <strong>2. Mobile-First Bottom Drawer Booking:</strong> On mobile devices, clicking "Book Now" opens a lightweight slideover drawer without navigating away from the page, preserving context and increasing booking conversion.
              </div>
              <div className="p-3 bg-slate-50 border rounded">
                <strong>3. 10-Minute Temporary Slot Hold Lock:</strong> Prevents double-booking during checkout. When a time slot is selected, it is temporarily locked with a visible countdown timer before deposit settlement.
              </div>
              <div className="p-3 bg-slate-50 border rounded">
                <strong>4. Strict Zero-Pill & Anti-Slop Discipline:</strong> Metadata (dates, durations, categories) uses unboxed text with typographic separators (`·`). Buttons and tabs maintain clean single-line labels without garish badges.
              </div>
            </div>
          </div>
        )}

        {/* 8. MISSING REQUIREMENTS & OPEN QUESTIONS */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              8. Missing Requirements & Open Architecture Questions for Phase 2
            </h3>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900">
                <strong>Q1. Multi-Chair Simultaneous Bookings:</strong> Should a customer be permitted to book two different services for two different people (e.g. parent + child) in a single booking session?
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900">
                <strong>Q2. Offline In-Salon Walk-In Queue:</strong> In case of salon internet disconnection, should the POS register support offline local storage synchronization for cash walk-ins?
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900">
                <strong>Q3. Commission Deductions on Chemical Consumables:</strong> For hair bleaching and tattoo ink consumables, should flat supply costs be deducted before calculating staff percentage splits?
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900">
                <strong>Q4. Rolling 15-Day Cycle Settlement Threshold:</strong> If a merchant fails to meet the ₹1,000 daily QR threshold on day 14 of 15, does the rolling cycle reset completely or carry over pro-rata?
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
