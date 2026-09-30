import React, { useState, useMemo } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Tag as TagIcon,
  MessageSquare,
  History,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Send,
  Building2,
  ChevronRight,
  X,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Activity,
  UserCheck,
  CalendarCheck,
  CalendarRange,
  Search,
  PhoneCall,
  MailQuestion
} from 'lucide-react';
import { customerCrmService } from '../services/customerCrmService';
import { BookingOrchestratorService } from '../services/bookingOrchestratorService';
import { BookingEntity } from '../types/bookingEngine';
import { SEEDED_PUBLIC_BUSINESSES } from '../data/seededPublicBusinesses';
import { SEEDED_BOOKINGS } from '../data/seededBookings';

export const Phase52CustomerProfileHistoryShowcase: React.FC = () => {
  // Tenant Selection
  const [selectedTenantId, setSelectedTenantId] = useState<string>('biz-barber-001');

  // Selected Customer ID
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-barber-001');

  // Booking History Filter Tab
  const [historyTab, setHistoryTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'ALL'>('ALL');

  // Selected Booking for Detail Modal
  const [activeBookingDetail, setActiveBookingDetail] = useState<BookingEntity | null>(null);

  // New Note Input
  const [noteContent, setNoteText] = useState<string>('');

  // Edit Profile Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    marketingConsent: true
  });

  // Services & Data
  const orchestrator = useMemo(() => new BookingOrchestratorService(), []);
  const allBookings = useMemo(() => SEEDED_BOOKINGS, []);

  // Fetch Business Definition
  const activeBusiness = useMemo(() => {
    return Object.values(SEEDED_PUBLIC_BUSINESSES).find((b) => b.id === selectedTenantId) || Object.values(SEEDED_PUBLIC_BUSINESSES)[0];
  }, [selectedTenantId]);

  // List all customers for selected tenant
  const tenantCustomers = useMemo(() => {
    return customerCrmService.getCustomersByTenant(selectedTenantId, {}, allBookings);
  }, [selectedTenantId, allBookings]);

  // Current Selected Customer Profile
  const customer = useMemo(() => {
    const found = customerCrmService.getCustomerById(selectedCustomerId, selectedTenantId);
    if (!found && tenantCustomers.length > 0) {
      return tenantCustomers[0];
    }
    return found;
  }, [selectedCustomerId, selectedTenantId, tenantCustomers]);

  // Sync selected customer ID if switching tenants
  React.useEffect(() => {
    if (tenantCustomers.length > 0 && (!customer || customer.businessId !== selectedTenantId)) {
      setSelectedCustomerId(tenantCustomers[0].id);
    }
  }, [selectedTenantId]);

  // Authoritative Metrics
  const summaryMetrics = useMemo(() => {
    if (!customer) return null;
    return customerCrmService.getCustomerSummaryMetrics(customer.id, selectedTenantId, allBookings);
  }, [customer, selectedTenantId, allBookings]);

  // Customer Timeline
  const customerTimeline = useMemo(() => {
    if (!customer) return [];
    return customerCrmService.getCustomerTimeline(customer.id, selectedTenantId, allBookings);
  }, [customer, selectedTenantId, allBookings]);

  // All Customer Bookings
  const customerBookings = useMemo(() => {
    if (!customer) return [];
    return allBookings.filter(
      (b) => b.businessId === selectedTenantId && (b.customerId === customer.id || b.customerPhone === customer.phone)
    );
  }, [customer, selectedTenantId, allBookings]);

  // Categorized Booking History
  const filteredBookings = useMemo(() => {
    if (historyTab === 'ALL') return customerBookings;
    if (historyTab === 'UPCOMING') {
      return customerBookings.filter((b) =>
        ['CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'ADVANCE_PAID', 'PAYMENT_PENDING'].includes(b.status)
      );
    }
    if (historyTab === 'COMPLETED') {
      return customerBookings.filter((b) => b.status === 'COMPLETED');
    }
    if (historyTab === 'CANCELLED') {
      return customerBookings.filter((b) => b.status === 'CANCELLED');
    }
    if (historyTab === 'NO_SHOW') {
      return customerBookings.filter((b) => b.status === 'NO_SHOW');
    }
    return customerBookings;
  }, [customerBookings, historyTab]);

  // Open Edit Profile Modal prefilled
  const handleOpenEditProfile = () => {
    if (!customer) return;
    setEditForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      dateOfBirth: customer.dateOfBirth || '',
      marketingConsent: customer.marketingConsent
    });
    setIsEditProfileOpen(true);
  };

  // Submit Profile Edit
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    customerCrmService.updateCustomer(customer.id, editForm, selectedTenantId);
    setIsEditProfileOpen(false);
  };

  // Submit Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !noteContent.trim()) return;

    customerCrmService.addCustomerNote(
      customer.id,
      noteContent,
      'Front Desk Manager',
      'ADMIN',
      selectedTenantId
    );

    setNoteText('');
  };

  if (!customer) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h3 className="font-bold text-slate-800 text-sm">No Customer Selected</h3>
        <p className="text-xs text-slate-500 mt-1">Please select a tenant business with existing customer records.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Tenant Switcher */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                Phase 5.2 Complete
              </span>
              <span className="text-xs text-slate-400 font-mono">Detailed Profile & Booking History Experience</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Customer Profile & History Workspace</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tenant Switcher */}
            <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/80">
              <Building2 className="w-4 h-4 text-emerald-400 ml-1.5" />
              <span className="text-xs font-medium text-slate-300">Tenant:</span>
              <select
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                className="bg-slate-900 text-xs font-semibold text-white px-2.5 py-1 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="biz-barber-001">Royal Crown Barber Studio</option>
                <option value="biz-spa-002">Zenith Stone Spa</option>
              </select>
            </div>

            {/* Customer Switcher */}
            <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/80">
              <User className="w-4 h-4 text-emerald-400 ml-1.5" />
              <span className="text-xs font-medium text-slate-300">Client:</span>
              <select
                value={customer.id}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="bg-slate-900 text-xs font-semibold text-white px-2.5 py-1 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {tenantCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <img
              src={customer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={customer.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{customer.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    customer.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : customer.status === 'NEW'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {customer.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600 font-mono flex-wrap">
                <a href={`tel:${customer.phone}`} className="flex items-center gap-1 hover:text-emerald-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.phone}</span>
                </a>
                <a href={`mailto:${customer.email}`} className="flex items-center gap-1 hover:text-emerald-600 font-sans">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.email}</span>
                </a>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {customer.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleOpenEditProfile}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            <a
              href={`tel:${customer.phone}`}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Contact</span>
            </a>

            <button
              onClick={() => alert(`Quick Booking initialized for ${customer.name}`)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Create Booking</span>
            </button>
          </div>
        </div>

        {/* Authoritative Summary KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Bookings</span>
            <span className="text-lg font-bold text-slate-900 font-mono">{summaryMetrics?.totalBookings || 0}</span>
          </div>

          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            <span className="text-[10px] text-emerald-800 font-bold uppercase block">Completed</span>
            <span className="text-lg font-bold text-emerald-900 font-mono">{summaryMetrics?.completedBookings || 0}</span>
          </div>

          <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
            <span className="text-[10px] text-rose-800 font-bold uppercase block">Cancelled</span>
            <span className="text-lg font-bold text-rose-900 font-mono">{summaryMetrics?.cancelledBookings || 0}</span>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <span className="text-[10px] text-amber-800 font-bold uppercase block">No-Show</span>
            <span className="text-lg font-bold text-amber-900 font-mono">{summaryMetrics?.noShowBookings || 0}</span>
          </div>

          <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Spend</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">
              ₹{(summaryMetrics?.totalSpend || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Last Visit</span>
            <span className="text-xs font-bold text-slate-900 block mt-1 font-mono">
              {summaryMetrics?.lastVisitAt || 'None'}
            </span>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 col-span-2 md:col-span-1">
            <span className="text-[10px] text-blue-800 font-bold uppercase block">Next Upcoming</span>
            {summaryMetrics?.upcomingBooking ? (
              <div className="text-[11px] font-bold text-blue-900 mt-0.5">
                {(summaryMetrics.upcomingBooking as any).date} @ {(summaryMetrics.upcomingBooking as any).time}
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic block mt-1">No upcoming booking</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Multi-Column Layout (Desktop: Side-by-Side; Mobile: Vertical Stack) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column / Top Stack (2 Columns width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: BOOKING HISTORY CATEGORIZED */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <span>Appointment & Booking History</span>
              </h3>

              {/* Categorized History Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                {(['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setHistoryTab(tab)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                      historyTab === tab ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking History Table */}
            {filteredBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic text-xs">
                No bookings found in category "{historyTab}".
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Booking ID</th>
                      <th className="py-2.5 px-3">Service</th>
                      <th className="py-2.5 px-3">Staff</th>
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{b.id}</td>
                        <td className="py-3 px-3 font-medium text-slate-800">
                          {b.items[0]?.nameSnapshot || 'Salon Service'}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{b.staffNameSnapshot || 'Team Stylist'}</td>
                        <td className="py-3 px-3 text-slate-700 font-mono">
                          {b.bookingDate} <span className="text-slate-400">@</span> {b.startTime}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          ₹{b.totalAmount}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                              b.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.status === 'CANCELLED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setActiveBookingDetail(b)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold rounded transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SECTION 2: AUDITED CUSTOMER NOTES */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Audited Staff Notes Timeline</span>
            </h3>

            {/* Note Submission Form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write a private staff note regarding client preferences, allergies, or past visits..."
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="submit"
                disabled={!noteContent.trim()}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded shadow transition flex items-center gap-1.5 ml-auto"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Note to History</span>
              </button>
            </form>

            {/* Historical Notes List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {customer.notes.length === 0 ? (
                <div className="text-slate-400 italic text-center py-4 text-xs">No notes recorded yet.</div>
              ) : (
                customer.notes.map((n: any) => (
                  <div key={n.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">{n.authorName} ({n.authorRole})</span>
                      <span className="text-slate-400 font-mono">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{n.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column / Bottom Stack (1 Column width on desktop): CHRONOLOGICAL ACTIVITY TIMELINE */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Real Chronological Event Stream</span>
            </h3>

            <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 ml-2">
              {customerTimeline.length === 0 ? (
                <div className="text-xs text-slate-400 italic">No events logged yet.</div>
              ) : (
                customerTimeline.map((evt) => (
                  <div key={evt.id} className="relative group">
                    {/* Event Node Bullet */}
                    <div
                      className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                        evt.type === 'CUSTOMER_CREATED'
                          ? 'bg-blue-500'
                          : evt.type === 'VISIT_COMPLETED'
                          ? 'bg-emerald-500'
                          : evt.type === 'BOOKING_CANCELLED'
                          ? 'bg-rose-500'
                          : 'bg-slate-700'
                      }`}
                    />

                    <div className="space-y-0.5 text-xs">
                      <div className="font-bold text-slate-900">{evt.title}</div>
                      <p className="text-slate-600 text-[11px] leading-snug">{evt.description}</p>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(evt.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOOKING DETAIL MODAL */}
      {activeBookingDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-mono">{activeBookingDetail.id}</h3>
                <span className="text-[11px] text-slate-500">Business: {activeBusiness.name}</span>
              </div>
              <button
                onClick={() => setActiveBookingDetail(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Customer:</span>
                <span className="font-bold text-slate-900">{activeBookingDetail.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Service:</span>
                <span className="font-bold text-slate-900">{activeBookingDetail.items[0]?.nameSnapshot || 'Service'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Assigned Staff:</span>
                <span className="font-bold text-slate-900">{activeBookingDetail.staffNameSnapshot || 'Team Stylist'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Date & Time:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {activeBookingDetail.bookingDate} at {activeBookingDetail.startTime} ({activeBookingDetail.duration} mins)
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500 font-medium">Total Amount:</span>
                <span className="font-bold text-slate-900 font-mono">₹{activeBookingDetail.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Advance Paid:</span>
                <span className="font-bold text-emerald-700 font-mono">₹{activeBookingDetail.advanceAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Remaining Due:</span>
                <span className="font-bold text-slate-900 font-mono">₹{activeBookingDetail.remainingAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Booking Status:</span>
                <span className="font-bold text-slate-900">{activeBookingDetail.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Payment Status:</span>
                <span className="font-bold text-slate-900">{activeBookingDetail.paymentStatus}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveBookingDetail(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Customer Profile</h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editMktConsent"
                  checked={editForm.marketingConsent}
                  onChange={(e) => setEditForm({ ...editForm, marketingConsent: e.target.checked })}
                  className="rounded text-slate-900"
                />
                <label htmlFor="editMktConsent" className="text-slate-700 font-medium">
                  Marketing Communications Consent Granted
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg text-xs shadow"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
