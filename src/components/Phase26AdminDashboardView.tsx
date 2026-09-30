import React, { useState } from 'react';
import {
  ADMIN_NAV_STRUCTURE,
  DASHBOARD_METRIC_CARDS,
  MOCK_ADMIN_BOOKINGS,
  MOCK_ADMIN_STAFF,
  FINANCE_SUB_SCREENS,
  AdminBookingRecord,
  StaffRecord
} from '../data/phase26AdminDashboardData';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Scissors,
  UserCheck,
  Star,
  Globe,
  CreditCard,
  BarChart3,
  Settings,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Wallet,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  ArrowUpRight,
  Phone,
  Info,
  SlidersHorizontal,
  ChevronLeft,
  Eye,
  FileSpreadsheet,
  Download,
  AlertCircle
} from 'lucide-react';

export const Phase26AdminDashboardView: React.FC = () => {
  // Navigation State
  const [activeNavId, setActiveNavId] = useState<string>('dashboard');
  const [activeFinanceTab, setActiveFinanceTab] = useState<string>('payments');
  const [calendarViewMode, setCalendarViewMode] = useState<'day' | 'week' | 'month'>('day');

  // Bookings Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingRecord | null>(null);

  // Quick Filtered Bookings
  const filteredBookings = MOCK_ADMIN_BOOKINGS.filter((bk) => {
    const matchesSearch =
      bk.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bk.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bk.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bk.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesStaff = staffFilter === 'all' || bk.staffName.toLowerCase() === staffFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesStaff;
  });

  return (
    <div className="space-y-6">
      {/* Header Context Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Phase 2.6 Specification UI
              </span>
              <span className="text-xs text-slate-500 font-medium">Business Admin Suite</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Business Admin Dashboard & Operations Hub
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Strict presentation layer for salon owners and desk managers. Complete information hierarchy covering
              6 metric cards, responsive booking tables with drawer views, Day/Week/Month calendar views, staff availability, and 6 finance modules.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Salon ID: <strong>NEX-BOM-004</strong> (Mumbai Flagship)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Console Frame (Sidebar + Topbar + Content) */}
      <div className="bg-slate-900/5 rounded-2xl border border-slate-300/80 p-3 sm:p-4">
        {/* Mock Browser/App Chrome */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden flex flex-col min-h-[820px]">
          
          {/* TOPBAR */}
          <div className="h-14 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between">
            {/* Left Topbar */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">N</span>
                <span>Nexora <span className="font-normal text-slate-500">Admin</span></span>
              </div>
              <span className="h-4 w-px bg-slate-200"></span>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                <span className="font-medium text-slate-700">The Royal Crown Barber & Lounge</span>
                <span>/</span>
                <span className="capitalize">{activeNavId.replace('-group', '')}</span>
              </div>
            </div>

            {/* Right Topbar */}
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Global search (Cmd + K)..."
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md w-56 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  readOnly
                />
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs">
                  VS
                </div>
                <div className="hidden sm:block text-left">
                  <p className="font-semibold text-slate-800 leading-tight">Vikram Singhania</p>
                  <p className="text-[10px] text-slate-500">Salon Director (Owner)</p>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN WRAPPER (SIDEBAR + MAIN CONTENT AREA) */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-full md:w-64 bg-slate-50/70 border-r border-slate-200 p-3 flex flex-col justify-between shrink-0">
              <div className="space-y-1">
                <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Salon Operations
                </p>

                {ADMIN_NAV_STRUCTURE.map((item) => {
                  const isDirectActive = activeNavId === item.id;
                  const isParentOfActive = item.subItems?.some((sub) => sub.id === activeNavId);
                  const isHighlighted = isDirectActive || isParentOfActive;

                  return (
                    <div key={item.id} className="space-y-0.5">
                      <button
                        onClick={() => {
                          if (item.subItems && item.subItems.length > 0) {
                            setActiveNavId(item.subItems[0].id);
                          } else {
                            setActiveNavId(item.id);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isHighlighted
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {item.id === 'dashboard' && <LayoutDashboard className="w-4 h-4" />}
                          {item.id === 'bookings-group' && <CalendarCheck className="w-4 h-4" />}
                          {item.id === 'customers' && <Users className="w-4 h-4" />}
                          {item.id === 'catalog-group' && <Scissors className="w-4 h-4" />}
                          {item.id === 'staff-group' && <UserCheck className="w-4 h-4" />}
                          {item.id === 'marketing-group' && <Star className="w-4 h-4" />}
                          {item.id === 'website-group' && <Globe className="w-4 h-4" />}
                          {item.id === 'finance-group' && <CreditCard className="w-4 h-4" />}
                          {item.id === 'reports' && <BarChart3 className="w-4 h-4" />}
                          {item.id === 'settings' && <Settings className="w-4 h-4" />}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isHighlighted ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>

                      {/* Sub-items for active category */}
                      {item.subItems && isHighlighted && (
                        <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-indigo-500/40 ml-4 my-1">
                          {item.subItems.map((sub) => {
                            const isSubActive = activeNavId === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => setActiveNavId(sub.id)}
                                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                                  isSubActive
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                              >
                                <span>{sub.label}</span>
                                {sub.badge && (
                                  <span className="text-[10px] px-1.5 rounded bg-slate-200 text-slate-700 font-semibold">
                                    {sub.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sidebar bottom store card */}
              <div className="mt-6 pt-3 border-t border-slate-200">
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Venue Mode</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <p className="font-semibold text-slate-800">Public Bookings Live</p>
                  <p className="text-[11px] text-slate-500">Advance Deposit: 25% Configured</p>
                </div>
              </div>
            </aside>

            {/* DYNAMIC CONTENT AREA */}
            <main className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto max-h-[820px]">
              
              {/* SECTION 1: DASHBOARD VIEW */}
              {activeNavId === 'dashboard' && (
                <div className="space-y-6">
                  {/* Title & Date Filter */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h2>
                      <p className="text-xs text-slate-500">Real-time overview of appointments, advance deposits, and venue capacity.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Date:</span>
                      <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Today, 15 Oct 2026</span>
                      </div>
                    </div>
                  </div>

                  {/* 6 STRICT DASHBOARD CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {DASHBOARD_METRIC_CARDS.map((card) => {
                      return (
                        <div
                          key={card.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all hover:shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-500">{card.title}</span>
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                              {card.iconName === 'Calendar' && <Calendar className="w-4 h-4 text-blue-600" />}
                              {card.iconName === 'IndianRupee' && <IndianRupee className="w-4 h-4 text-emerald-600" />}
                              {card.iconName === 'Clock' && <Clock className="w-4 h-4 text-amber-600" />}
                              {card.iconName === 'CheckCircle2' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                              {card.iconName === 'ShieldCheck' && <ShieldCheck className="w-4 h-4 text-cyan-600" />}
                              {card.iconName === 'Wallet' && <Wallet className="w-4 h-4 text-violet-600" />}
                            </div>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</h3>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {card.change}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* 4 CHARTS GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 1: Revenue Trends */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Revenue Velocity</h4>
                          <p className="text-xs text-slate-500">Gross revenue split between 25% Advance vs 75% Venue settlement</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded text-slate-700">Weekly</span>
                      </div>
                      
                      {/* Bar Visualization Mock */}
                      <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                        {[
                          { day: 'Mon', advance: 40, venue: 75, total: '₹22k' },
                          { day: 'Tue', advance: 35, venue: 65, total: '₹19k' },
                          { day: 'Wed', advance: 50, venue: 90, total: '₹28k' },
                          { day: 'Thu', advance: 45, venue: 85, total: '₹26k' },
                          { day: 'Fri', advance: 70, venue: 120, total: '₹38k' },
                          { day: 'Sat', advance: 90, venue: 160, total: '₹49k' },
                          { day: 'Sun', advance: 85, venue: 150, total: '₹46k' }
                        ].map((b, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <div className="w-full flex flex-col items-center gap-0.5">
                              <div style={{ height: `${b.advance * 0.7}px` }} className="w-full max-w-[28px] bg-indigo-500 rounded-t-sm"></div>
                              <div style={{ height: `${b.venue * 0.7}px` }} className="w-full max-w-[28px] bg-indigo-900 rounded-b-sm"></div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">{b.day}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-200 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-indigo-500 rounded-sm"></span>
                          <span className="text-slate-600">25% Advance Paid Online</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-indigo-900 rounded-sm"></span>
                          <span className="text-slate-600">75% Venue POS Balance</span>
                        </div>
                      </div>
                    </div>

                    {/* Chart 2: Bookings Volume */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Bookings by Status</h4>
                          <p className="text-xs text-slate-500">Distribution of today's appointment funnel</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded text-slate-700">28 Total</span>
                      </div>

                      <div className="space-y-3 pt-2">
                        {[
                          { label: 'Completed Appointments', count: 18, pct: 64, color: 'bg-emerald-500' },
                          { label: 'Confirmed (Scheduled Later Today)', count: 6, pct: 21, color: 'bg-blue-500' },
                          { label: 'Pending Payment Auto-Hold', count: 3, pct: 11, color: 'bg-amber-500' },
                          { label: 'Client Cancelled (Refunded)', count: 1, pct: 4, color: 'bg-rose-500' }
                        ].map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-slate-700">{item.label}</span>
                              <span className="font-bold text-slate-900">{item.count} ({item.pct}%)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-3 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                        <span className="text-slate-500">Average slot turnaround time:</span>
                        <span className="font-bold text-slate-800">42 minutes</span>
                      </div>
                    </div>

                    {/* Chart 3: Top Services Performance */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Top Performing Services</h4>
                          <p className="text-xs text-slate-500">Ranked by revenue contribution</p>
                        </div>
                        <Scissors className="w-4 h-4 text-slate-400" />
                      </div>

                      <div className="divide-y divide-slate-200">
                        {[
                          { name: 'Signature Skin Fade & Beard Sculpt', bookings: 12, revenue: '₹12,000', share: '35%' },
                          { name: 'Balayage Color & Gloss Treatment', bookings: 3, revenue: '₹11,400', share: '33%' },
                          { name: 'Traditional Hot Lather Shave', bookings: 8, revenue: '₹3,600', share: '10%' },
                          { name: 'Executive Grooming Ritual', bookings: 3, revenue: '₹3,450', share: '10%' }
                        ].map((srv, i) => (
                          <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-semibold text-slate-800">{srv.name}</p>
                              <p className="text-slate-500">{srv.bookings} bookings today</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">{srv.revenue}</p>
                              <p className="text-[11px] text-slate-500">{srv.share} total</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chart 4: Staff Performance */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Stylist & Barber Performance</h4>
                          <p className="text-xs text-slate-500">Utilization and client satisfaction scores</p>
                        </div>
                        <Award className="w-4 h-4 text-slate-400" />
                      </div>

                      <div className="divide-y divide-slate-200">
                        {MOCK_ADMIN_STAFF.map((st) => (
                          <div key={st.id} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                                {st.avatarInitials}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{st.name}</p>
                                <p className="text-[11px] text-slate-500">{st.role}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">{st.todayBookingsCount} Appointments</p>
                              <p className="text-[11px] text-amber-600 font-semibold">★ {st.rating.toFixed(2)} rating</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: BOOKINGS TABLE & DRAWER VIEW */}
              {activeNavId === 'bookings' && (
                <div className="space-y-4">
                  {/* Controls & Filter Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <div className="relative w-full">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search customer, booking code, or service..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status Filter */}
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {/* Staff Filter */}
                      <select
                        value={staffFilter}
                        onChange={(e) => setStaffFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
                      >
                        <option value="all">All Staff</option>
                        <option value="marco silva">Marco Silva</option>
                        <option value="priya sharma">Priya Sharma</option>
                        <option value="david chen">David Chen</option>
                      </select>

                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                          setStaffFilter('all');
                        }}
                        className="px-2.5 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Bookings Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Booking Code</th>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Service & Staff</th>
                          <th className="py-3 px-4">Date & Time</th>
                          <th className="py-3 px-4 text-right">Total / Advance</th>
                          <th className="py-3 px-4 text-right">Balance Due</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredBookings.map((bk) => (
                          <tr key={bk.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              {bk.bookingCode}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-slate-800">{bk.customerName}</p>
                              <p className="text-[11px] text-slate-500">{bk.customerPhone}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-medium text-slate-800 truncate max-w-[180px]">{bk.serviceName}</p>
                              <p className="text-[11px] text-indigo-600 font-medium">with {bk.staffName}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-medium text-slate-700">{bk.time}</p>
                              <p className="text-[11px] text-slate-500">{bk.date} ({bk.duration})</p>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <p className="font-bold text-slate-900">₹{bk.totalAmount}</p>
                              <p className="text-[11px] text-emerald-600 font-semibold">Adv: ₹{bk.advancePaid}</p>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <p className={`font-bold ${bk.outstandingBalance > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
                                ₹{bk.outstandingBalance}
                              </p>
                              <p className="text-[10px] text-slate-400">{bk.paymentMethod}</p>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  bk.status === 'Confirmed'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : bk.status === 'Completed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : bk.status === 'Pending'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {bk.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => setSelectedBooking(bk)}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium inline-flex items-center gap-1 shadow-sm transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Drawer</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredBookings.length === 0 && (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                      No bookings found matching current filters.
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 3: CALENDAR VIEW (DAY / WEEK / MONTH) */}
              {activeNavId === 'calendar' && (
                <div className="space-y-4">
                  {/* Calendar View Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900 text-sm">Stylist Daily Dispatch</h3>
                      <span className="text-xs text-slate-500">Thursday, 15 Oct 2026</span>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
                      {(['day', 'week', 'month'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setCalendarViewMode(mode)}
                          className={`px-3 py-1 rounded font-medium capitalize transition-colors ${
                            calendarViewMode === mode
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {mode} View
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Day View Grid */}
                  {calendarViewMode === 'day' && (
                    <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
                      <div className="min-w-[700px]">
                        {/* Time Grid Header */}
                        <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 py-2.5 px-3">
                          <div className="col-span-1">Time Slot</div>
                          <div className="col-span-1">Marco Silva (Master Barber)</div>
                          <div className="col-span-1">Priya Sharma (Colorist)</div>
                          <div className="col-span-1">David Chen (Shave Artisan)</div>
                          <div className="col-span-1">Aisha Khan (Aesthetician)</div>
                        </div>

                        {/* Slots Rows */}
                        {[
                          {
                            time: '09:00 - 10:00 AM',
                            marco: { name: 'Karan Mehra', srv: 'Hot Lather Shave', status: 'Completed', col: 'bg-emerald-50 border-emerald-300' },
                            priya: null,
                            david: null,
                            aisha: { status: 'Off Duty', col: 'bg-slate-100 text-slate-400' }
                          },
                          {
                            time: '10:00 - 11:00 AM',
                            marco: null,
                            priya: null,
                            david: { name: 'Rohan Gupta', srv: 'Classic Taper', status: 'Completed', col: 'bg-emerald-50 border-emerald-300' },
                            aisha: { status: 'Off Duty', col: 'bg-slate-100 text-slate-400' }
                          },
                          {
                            time: '11:00 - 12:00 PM',
                            marco: { name: 'Rahul Kapoor', srv: 'Skin Fade + Beard', status: 'Confirmed', col: 'bg-blue-50 border-blue-300' },
                            priya: null,
                            david: null,
                            aisha: { status: 'Off Duty', col: 'bg-slate-100 text-slate-400' }
                          },
                          {
                            time: '12:00 - 01:30 PM',
                            marco: null,
                            priya: { name: 'Ananya Deshmukh', srv: 'Balayage Treatment', status: 'Confirmed', col: 'bg-blue-50 border-blue-300' },
                            david: null,
                            aisha: { status: 'Off Duty', col: 'bg-slate-100 text-slate-400' }
                          },
                          {
                            time: '01:30 - 02:45 PM',
                            marco: null,
                            priya: null,
                            david: { name: 'Vikram Sethi', srv: 'Executive Grooming', status: 'Pending', col: 'bg-amber-50 border-amber-300' },
                            aisha: { status: 'Off Duty', col: 'bg-slate-100 text-slate-400' }
                          }
                        ].map((row, idx) => (
                          <div key={idx} className="grid grid-cols-5 border-b border-slate-100 text-xs py-2 px-3 items-center min-h-[56px]">
                            <div className="font-mono text-slate-500 font-medium">{row.time}</div>
                            
                            {/* Marco Column */}
                            <div className="p-1">
                              {row.marco ? (
                                <div className={`p-2 rounded border text-[11px] ${row.marco.col}`}>
                                  <p className="font-bold text-slate-900">{row.marco.name}</p>
                                  <p className="text-slate-600 text-[10px]">{row.marco.srv}</p>
                                </div>
                              ) : (
                                <div className="text-[11px] text-slate-300 italic pl-1">Available</div>
                              )}
                            </div>

                            {/* Priya Column */}
                            <div className="p-1">
                              {row.priya ? (
                                <div className={`p-2 rounded border text-[11px] ${row.priya.col}`}>
                                  <p className="font-bold text-slate-900">{row.priya.name}</p>
                                  <p className="text-slate-600 text-[10px]">{row.priya.srv}</p>
                                </div>
                              ) : (
                                <div className="text-[11px] text-slate-300 italic pl-1">Available</div>
                              )}
                            </div>

                            {/* David Column */}
                            <div className="p-1">
                              {row.david ? (
                                <div className={`p-2 rounded border text-[11px] ${row.david.col}`}>
                                  <p className="font-bold text-slate-900">{row.david.name}</p>
                                  <p className="text-slate-600 text-[10px]">{row.david.srv}</p>
                                </div>
                              ) : (
                                <div className="text-[11px] text-slate-300 italic pl-1">Available</div>
                              )}
                            </div>

                            {/* Aisha Column */}
                            <div className="p-1">
                              <div className="p-2 rounded bg-slate-100 border border-slate-200 text-slate-400 text-center text-[10px] font-medium">
                                On Leave (Off Duty)
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Week / Month View Placeholder */}
                  {calendarViewMode !== 'day' && (
                    <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <Calendar className="w-8 h-8 text-indigo-500 mx-auto" />
                      <h4 className="font-bold text-slate-800 text-sm">
                        {calendarViewMode === 'week' ? 'Weekly Multi-Chair Heatmap' : 'Monthly Staff Schedule'}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Displays aggregated slot capacity and advance payment status for each day of the {calendarViewMode}.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 4: STAFF ROSTER & AVAILABILITY */}
              {(activeNavId === 'staff' || activeNavId === 'availability' || activeNavId === 'leave') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Staff Directory & Live Availability</h3>
                      <p className="text-xs text-slate-500">Manage specialist profiles, shift schedules, and daily capacity.</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                      4 Specialists Registered
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_ADMIN_STAFF.map((st) => (
                      <div key={st.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                                {st.avatarInitials}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm">{st.name}</h4>
                                <p className="text-xs text-slate-500 font-medium">{st.role}</p>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                st.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}
                            >
                              {st.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <strong>Specialization:</strong> {st.specialization}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium text-slate-700">{st.availability}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">{st.todayBookingsCount} today</span>
                            <span className="font-bold text-amber-600">★ {st.rating.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 5: FINANCE MODULE (6 SPECIFIED SCREENS) */}
              {(activeNavId === 'finance-group' ||
                activeNavId.startsWith('fin-')) && (
                <div className="space-y-5">
                  {/* Finance Sub-Navigation Tabs */}
                  <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { id: 'payments', label: '1. Payments' },
                      { id: 'transactions', label: '2. Transactions' },
                      { id: 'commission', label: '3. Commission' },
                      { id: 'qualification', label: '4. Qualification' },
                      { id: 'settlements', label: '5. Settlements' },
                      { id: 'tax', label: '6. Tax / TDS' }
                    ].map((tab) => {
                      const isActive = activeFinanceTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveFinanceTab(tab.id)}
                          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
                            isActive
                              ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/50'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Finance Screen Header */}
                  {FINANCE_SUB_SCREENS[activeFinanceTab] && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {FINANCE_SUB_SCREENS[activeFinanceTab].title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {FINANCE_SUB_SCREENS[activeFinanceTab].description}
                        </p>
                      </div>

                      {/* 4 Finance Metric Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {FINANCE_SUB_SCREENS[activeFinanceTab].metrics.map((m, idx) => (
                          <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-[11px] font-medium text-slate-500">{m.label}</p>
                            <p className="text-lg font-bold text-slate-900 mt-1">{m.value}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{m.hint}</p>
                          </div>
                        ))}
                      </div>

                      {/* Financial Ledger Table */}
                      <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                            <tr>
                              {FINANCE_SUB_SCREENS[activeFinanceTab].columns.map((col, idx) => (
                                <th key={idx} className="py-2.5 px-4">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {FINANCE_SUB_SCREENS[activeFinanceTab].mockRows.map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-slate-50/60">
                                {Object.values(row).map((val, cellIdx) => (
                                  <td key={cellIdx} className="py-3 px-4 font-medium text-slate-700">
                                    {String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-center gap-2">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          <strong>UI Phase Strict Notice:</strong> Data represents operational UI presentation layer. Calculation models, TDS auto-deduction engines, and bank API webhooks remain unmounted as specified.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PLACEHOLDER FOR OTHER CMS SECTIONS */}
              {!['dashboard', 'bookings', 'calendar', 'staff', 'availability', 'leave', 'finance-group'].includes(activeNavId) &&
                !activeNavId.startsWith('fin-') && (
                  <div className="p-12 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <Layers className="w-8 h-8 text-indigo-500 mx-auto" />
                    <h3 className="font-bold text-slate-900 text-base capitalize">
                      {activeNavId.replace('web-', 'Website CMS: ')} Module
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Admin configuration view for {activeNavId}. Fully mapped in the navigation architecture with dedicated state hooks ready for Phase 3 integration.
                    </p>
                    <button
                      onClick={() => setActiveNavId('dashboard')}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                )}
            </main>
          </div>
        </div>
      </div>

      {/* BOOKING DETAIL DRAWER (SLIDE-OVER VIEW) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div>
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Booking Drawer</span>
                  <h3 className="text-base font-bold text-slate-900 font-mono">{selectedBooking.bookingCode}</h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Content */}
              <div className="p-5 space-y-5 text-xs">
                {/* Status Alert */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900">
                  <span className="font-semibold">Current Booking Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px]">
                    {selectedBooking.status}
                  </span>
                </div>

                {/* Customer Details Section */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Client Profile</h4>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <p className="text-sm font-bold text-slate-800">{selectedBooking.customerName}</p>
                    <p className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedBooking.customerPhone}</span>
                    </p>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Service & Staff</h4>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400">Treatment</span>
                      <p className="font-bold text-slate-800">{selectedBooking.serviceName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400">Assigned Stylist</span>
                        <p className="font-medium text-slate-800">{selectedBooking.staffName}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Date & Slot</span>
                        <p className="font-medium text-slate-800">{selectedBooking.time}, {selectedBooking.date}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Breakdown (25% Advance Config) */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Financial Settlement</h4>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Service Subtotal:</span>
                      <span className="font-bold text-slate-800">₹{selectedBooking.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>Online Advance (25% Paid):</span>
                      <span className="font-bold">-₹{selectedBooking.advancePaid}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-sm">
                      <span className="font-bold text-slate-900">Remaining Due at Venue:</span>
                      <span className="font-bold text-amber-700">₹{selectedBooking.outstandingBalance}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1">
                      Gateway Reference: {selectedBooking.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedBooking.notes && (
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Customer Note</h4>
                    <p className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg text-slate-700 text-xs">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Drawer
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
