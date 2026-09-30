import React, { useState } from 'react';
import {
  SUPER_ADMIN_METRICS,
  MOCK_PLATFORM_BUSINESSES,
  MOCK_CATEGORY_TEMPLATES,
  MOCK_PLATFORM_TRANSACTIONS,
  MOCK_PLATFORM_AUDIT_LOGS,
  PlatformBusinessRecord,
  PlatformTransactionRecord
} from '../data/phase28SuperAdminData';
import {
  ShieldAlert,
  Building2,
  Layers,
  CalendarCheck,
  CreditCard,
  Percent,
  FileCheck2,
  FileSpreadsheet,
  History,
  Settings,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  TrendingUp,
  Download,
  Filter,
  BarChart3,
  Globe2,
  ArrowUpRight,
  Shield,
  Palette,
  Sparkles,
  Info,
  Lock
} from 'lucide-react';

export const Phase28SuperAdminView: React.FC = () => {
  // Navigation State across 10 Super Admin Sections
  const [activeSuperNav, setActiveSuperNav] = useState<string>('overview');

  // Businesses State
  const [businessSearch, setBusinessSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [businesses, setBusinesses] = useState<PlatformBusinessRecord[]>(MOCK_PLATFORM_BUSINESSES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleBusinessStatus = (id: string, newStatus: 'Active' | 'Suspended') => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    showToast(`Business status updated to ${newStatus}`);
  };

  // Filtered Businesses
  const filteredBusinesses = businesses.filter((b) => {
    const matchesQuery =
      b.name.toLowerCase().includes(businessSearch.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(businessSearch.toLowerCase()) ||
      b.code.toLowerCase().includes(businessSearch.toLowerCase());
    const matchesCat = categoryFilter === 'all' || b.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Super Admin Scope Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Phase 2.8 Specification UI
              </span>
              <span className="text-xs text-slate-400 font-mono">Platform Governance & Global Control</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Shield className="w-6 h-6 text-indigo-400" />
              <span>Nexora SalonOS Super Administration Console</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Strict multi-tenant platform architecture. Centralized governance across 1,428 tenant salons, categories, templates, 5% net commission settlements, and immutable system audit logs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono">
              Root Auth: <strong>rajnish@nexora.io</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Action Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Console Frame */}
      <div className="bg-slate-200/70 rounded-2xl border border-slate-300 p-2 sm:p-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden flex flex-col min-h-[820px]">
          
          {/* SUPER ADMIN CONSOLE BAR */}
          <div className="h-14 border-b border-slate-200 bg-slate-950 text-white px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                Ω
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white">Nexora Global Cloud</span>
                <span className="ml-2 text-[10px] text-amber-400 font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  SUPER ADMIN
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400 hidden sm:inline">Active Multi-Region Cluster:</span>
              <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>asia-south1 (Mumbai)</span>
              </span>
            </div>
          </div>

          {/* MAIN WRAPPER (SIDEBAR + CONTENT CANVAS) */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* SUPER ADMIN SIDEBAR */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-3 flex flex-col justify-between shrink-0">
              <div className="space-y-1">
                <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Platform Operations
                </p>

                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'businesses', label: 'Businesses', icon: Building2, badge: '1,428' },
                  { id: 'templates', label: 'Templates & Categories', icon: Layers },
                  { id: 'bookings', label: 'Global Bookings', icon: CalendarCheck },
                  { id: 'transactions', label: 'Transactions', icon: CreditCard },
                  { id: 'commission', label: 'Commission & Take-Rate', icon: Percent },
                  { id: 'settlements', label: 'Settlements & Payouts', icon: FileCheck2 },
                  { id: 'tax-rules', label: 'Tax Rules & GST', icon: FileSpreadsheet },
                  { id: 'reports', label: 'Platform Reports', icon: TrendingUp },
                  { id: 'audit-logs', label: 'Audit Logs', icon: History, badge: 'Live' },
                  { id: 'settings', label: 'Platform Settings', icon: Settings }
                ].map((nav) => {
                  const Icon = nav.icon;
                  const isActive = activeSuperNav === nav.id;

                  return (
                    <button
                      key={nav.id}
                      onClick={() => setActiveSuperNav(nav.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{nav.label}</span>
                      </div>
                      {nav.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {nav.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Footer */}
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                <p className="font-semibold text-slate-400">Security Clearance: Tier 0</p>
                <p className="text-[10px]">Strict read-only UI sandbox</p>
              </div>
            </aside>

            {/* SUPER ADMIN MAIN CONTENT */}
            <main className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto max-h-[820px]">
              
              {/* SECTION 1: OVERVIEW */}
              {activeSuperNav === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Platform Global Overview</h2>
                    <p className="text-xs text-slate-500">Aggregated performance across all onboarded salons, categories, and payment gateways.</p>
                  </div>

                  {/* STRICT 7 OVERVIEW CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {SUPER_ADMIN_METRICS.map((m) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                      >
                        <p className="text-xs font-medium text-slate-500">{m.title}</p>
                        <div className="flex items-baseline justify-between mt-1">
                          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{m.value}</h3>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            {m.trend}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{m.subtitle}</p>
                      </div>
                    ))}
                  </div>

                  {/* 5 PLATFORM CHARTS & VISUALIZATIONS */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 1: Revenue & GMV Growth */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Platform GMV & Revenue</h4>
                          <p className="text-xs text-slate-500">Monthly GMV expansion across all cities</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded">FY 2025-26</span>
                      </div>
                      
                      {/* Bar Visualizer */}
                      <div className="h-40 flex items-end justify-between gap-3 pt-6 px-2">
                        {[
                          { m: 'May', gmv: 35, rev: '₹2.8 Cr' },
                          { m: 'Jun', gmv: 45, rev: '₹3.4 Cr' },
                          { m: 'Jul', gmv: 60, rev: '₹4.6 Cr' },
                          { m: 'Aug', gmv: 75, rev: '₹5.8 Cr' },
                          { m: 'Sep', gmv: 95, rev: '₹7.2 Cr' },
                          { m: 'Oct', gmv: 120, rev: '₹9.4 Cr' }
                        ].map((b, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <div style={{ height: `${b.gmv * 0.9}px` }} className="w-full max-w-[32px] bg-indigo-600 rounded-t-sm"></div>
                            <span className="text-[10px] text-slate-500 font-medium">{b.m}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 text-xs">
                        <span className="text-slate-500">Total YTD Processed:</span>
                        <span className="font-bold text-slate-900">₹42.8 Crore Gross Value</span>
                      </div>
                    </div>

                    {/* Chart 2: Commission Take-Rate Velocity */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Platform Commission Yield</h4>
                          <p className="text-xs text-slate-500">Net 5% platform take-rate monetization</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded">5.0% Net</span>
                      </div>

                      <div className="space-y-3 pt-1">
                        {[
                          { category: 'Hair Salons & Color Ateliers', gmv: '₹18.4 Cr', comm: '₹92.0 L', share: 43 },
                          { category: 'Barbershops & Men Grooming', gmv: '₹12.2 Cr', comm: '₹61.0 L', share: 28 },
                          { category: 'Spas & Wellness Retreats', gmv: '₹7.8 Cr', comm: '₹39.0 L', share: 18 },
                          { category: 'Nail, Lash & Tattoo Studios', gmv: '₹4.4 Cr', comm: '₹22.0 L', share: 11 }
                        ].map((row, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-slate-700">{row.category}</span>
                              <span className="font-bold text-slate-900">{row.comm}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500" style={{ width: `${row.share}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chart 3: Category Distribution */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Category Tenant Distribution</h4>
                          <p className="text-xs text-slate-500">Breakdown of 1,428 active tenant storefronts</p>
                        </div>
                        <Layers className="w-4 h-4 text-slate-400" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                        {[
                          { label: 'Hair Salon', count: 412, pct: '28.8%' },
                          { label: 'Barber', count: 384, pct: '26.9%' },
                          { label: 'Spa & Wellness', count: 198, pct: '13.9%' },
                          { label: 'Nail Boutique', count: 165, pct: '11.5%' },
                          { label: 'Massage Therapy', count: 112, pct: '7.8%' },
                          { label: 'Tattoo Sanctuary', count: 86, pct: '6.0%' }
                        ].map((c, i) => (
                          <div key={i} className="p-3 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-800">{c.label}</p>
                              <p className="text-[11px] text-slate-400">{c.count} salons</p>
                            </div>
                            <span className="font-bold text-indigo-700">{c.pct}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chart 4: Business Growth & Cohort Retention */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Tenant Onboarding Velocity</h4>
                          <p className="text-xs text-slate-500">New salons registered vs churn rate</p>
                        </div>
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 text-xs">
                          <div>
                            <p className="font-bold text-slate-900">Avg Monthly Salons Added</p>
                            <p className="text-[11px] text-slate-500">Automated template onboarding</p>
                          </div>
                          <span className="text-base font-extrabold text-emerald-600">+142 Salons</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 text-xs">
                          <div>
                            <p className="font-bold text-slate-900">Platform Monthly Churn</p>
                            <p className="text-[11px] text-slate-500">Zero subscription, commission only</p>
                          </div>
                          <span className="text-base font-extrabold text-slate-800">0.82%</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 text-xs">
                          <div>
                            <p className="font-bold text-slate-900">Advance Deposit Conversion</p>
                            <p className="text-[11px] text-slate-500">Configured 25% upfront online payments</p>
                          </div>
                          <span className="text-base font-extrabold text-indigo-600">88.4%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: BUSINESSES */}
              {activeSuperNav === 'businesses' && (
                <div className="space-y-4">
                  {/* Filter Toolbar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <div className="relative w-full">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={businessSearch}
                          onChange={(e) => setBusinessSearch(e.target.value)}
                          placeholder="Search salon name, code, or owner..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium"
                      >
                        <option value="all">All Categories</option>
                        <option value="barber">Barber</option>
                        <option value="hair salon">Hair Salon</option>
                        <option value="spa">Spa</option>
                        <option value="nail">Nail</option>
                        <option value="tattoo">Tattoo</option>
                        <option value="massage">Massage</option>
                      </select>

                      <button
                        onClick={() => {
                          setBusinessSearch('');
                          setCategoryFilter('all');
                        }}
                        className="px-2.5 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Businesses Table */}
                  <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Business</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Owner Profile</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Bookings</th>
                          <th className="py-3 px-4 text-right">Gross GMV</th>
                          <th className="py-3 px-4">Created Date</th>
                          <th className="py-3 px-4 text-center">Super Admin Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredBusinesses.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-900">{b.name}</p>
                              <p className="text-[11px] font-mono text-slate-400">{b.code} · {b.city}</p>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                {b.category}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-slate-800">{b.ownerName}</p>
                              <p className="text-[11px] text-slate-500">{b.ownerEmail}</p>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  b.status === 'Active'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-slate-800">
                              {b.totalBookings.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-indigo-700">
                              {b.totalRevenue}
                            </td>
                            <td className="py-3 px-4 text-slate-500">{b.createdDate}</td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => showToast(`Opened detail view for ${b.name}`)}
                                  className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {b.status === 'Active' ? (
                                  <button
                                    onClick={() => handleToggleBusinessStatus(b.id, 'Suspended')}
                                    className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[10px] border border-rose-200"
                                  >
                                    Suspend
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleToggleBusinessStatus(b.id, 'Active')}
                                    className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[10px] border border-emerald-200"
                                  >
                                    Activate
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SECTION 3: TEMPLATES */}
              {activeSuperNav === 'templates' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Category Templates & Onboarding Blueprint</h3>
                    <p className="text-xs text-slate-500">
                      Standardized industry templates automatically provisioned when a new business selects a category.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_CATEGORY_TEMPLATES.map((tmpl) => (
                      <div key={tmpl.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                              {tmpl.category}
                            </span>
                            <h4 className="font-bold text-sm text-slate-900 mt-1">{tmpl.templateName}</h4>
                          </div>
                          <span className="text-xs font-bold text-slate-700">{tmpl.activeStoresCount} active</span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-100">
                          <p className="flex justify-between">
                            <span className="text-slate-500">Theme Preset:</span>
                            <span className="font-semibold text-slate-800">{tmpl.themePreset}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-slate-500">Default Services:</span>
                            <span className="font-semibold text-slate-800">{tmpl.defaultServicesCount} Curated</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-slate-500">Default Packages:</span>
                            <span className="font-semibold text-slate-800">{tmpl.defaultPackagesCount} Bundles</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-slate-500">Website Sections:</span>
                            <span className="font-semibold text-slate-800">{tmpl.defaultSectionsCount} Sections</span>
                          </p>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => showToast(`Editing template schema: ${tmpl.templateName}`)}
                            className="flex-1 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                          >
                            Edit Template
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 4: TRANSACTIONS & COMMISSION */}
              {(activeSuperNav === 'transactions' || activeSuperNav === 'commission' || activeSuperNav === 'settlements') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Global Transaction Audit & Commission Ledger</h3>
                      <p className="text-xs text-slate-500">Live platform fee deductions (5%) and bank settlement UTR dispatch status.</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                      T+1 Automated Settlements Active
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Transaction ID</th>
                          <th className="py-2.5 px-4">Business</th>
                          <th className="py-2.5 px-4">Booking Ref</th>
                          <th className="py-2.5 px-4 text-right">Gross Amount</th>
                          <th className="py-2.5 px-4 text-right">Commission (5%)</th>
                          <th className="py-2.5 px-4 text-right">Tax (GST)</th>
                          <th className="py-2.5 px-4 text-right">Net Business Payout</th>
                          <th className="py-2.5 px-4 text-center">Status</th>
                          <th className="py-2.5 px-4">Bank UTR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {MOCK_PLATFORM_TRANSACTIONS.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50/70">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">{tx.txnId}</td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-slate-800">{tx.businessName}</p>
                              <p className="text-[10px] font-mono text-slate-400">{tx.businessCode}</p>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600">{tx.bookingCode}</td>
                            <td className="py-3 px-4 text-right font-bold text-slate-900">₹{tx.grossAmount}</td>
                            <td className="py-3 px-4 text-right font-semibold text-amber-700">₹{tx.commissionAmount}</td>
                            <td className="py-3 px-4 text-right text-slate-500">₹{tx.taxAmount}</td>
                            <td className="py-3 px-4 text-right font-bold text-emerald-700">₹{tx.netAmount}</td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  tx.status === 'Settled'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {tx.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{tx.utrNumber}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SECTION 5: AUDIT LOG */}
              {activeSuperNav === 'audit-logs' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Immutable Platform Audit Ledger</h3>
                    <p className="text-xs text-slate-500">Every root administrative action, state override, and settlement event is recorded.</p>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Admin User</th>
                          <th className="py-2.5 px-4">Action</th>
                          <th className="py-2.5 px-4">Target Entity</th>
                          <th className="py-2.5 px-4">Entity ID</th>
                          <th className="py-2.5 px-4">Timestamp</th>
                          <th className="py-2.5 px-4">Changes & Payload</th>
                          <th className="py-2.5 px-4">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {MOCK_PLATFORM_AUDIT_LOGS.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/70">
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-900">{log.userName}</p>
                              <p className="text-[10px] text-slate-400">{log.userRole}</p>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                                {log.action}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-700">{log.entity}</td>
                            <td className="py-3 px-4 font-mono text-slate-600">{log.entityId}</td>
                            <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                            <td className="py-3 px-4 max-w-xs text-slate-700">{log.changesSummary}</td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{log.ipAddress}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SECTION 6: OTHER GOVERNANCE MODULES */}
              {!['overview', 'businesses', 'templates', 'transactions', 'commission', 'settlements', 'audit-logs'].includes(activeSuperNav) && (
                <div className="p-12 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
                  <h3 className="font-bold text-slate-900 text-base capitalize">
                    {activeSuperNav.replace('-', ' ')} Control Module
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Full architectural mapping established in Super Admin routing hierarchy. Ready for root cluster activation.
                  </p>
                  <button
                    onClick={() => setActiveSuperNav('overview')}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Return to Overview
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
