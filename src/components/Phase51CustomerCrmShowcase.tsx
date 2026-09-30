import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Tag as TagIcon,
  FileText,
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  Plus,
  Trash2,
  Edit2,
  X,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Send,
  History,
  Info,
  RefreshCw,
  BadgeCheck,
  MessageSquare
} from 'lucide-react';
import {
  CustomerProfile,
  CustomerStatus,
  CustomerFilterParams,
  DuplicateDetectionResult
} from '../types/customerCrm';
import { customerCrmService } from '../services/customerCrmService';
import { BookingOrchestratorService } from '../services/bookingOrchestratorService';
import { SEEDED_PUBLIC_BUSINESSES } from '../data/seededPublicBusinesses';
import { SEEDED_BOOKINGS } from '../data/seededBookings';

export const Phase51CustomerCrmShowcase: React.FC = () => {
  // Tenant Selection
  const [selectedTenantId, setSelectedTenantId] = useState<string>('biz-barber-001');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CustomerStatus>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'NEW' | 'RETURNING'>('ALL');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // Selected Customer for Detail Drawer
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'notes' | 'history' | 'tags'>('notes');

  // Note creation input
  const [newNoteText, setNewNoteText] = useState<string>('');

  // Add Tag input
  const [newTagInput, setNewTagInput] = useState<string>('');

  // Modal State: Create Customer
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addForm, setAddForm] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: 'Male',
    initialNote: '',
    marketingConsent: true,
    tags: ['New']
  });
  const [duplicateWarning, setDuplicateWarning] = useState<DuplicateDetectionResult | null>(null);

  // Shared Services
  const orchestrator = useMemo(() => new BookingOrchestratorService(), []);
  const allBookings = useMemo(() => SEEDED_BOOKINGS, []);

  // Fetch Tenant Businesses
  const activeBusiness = useMemo(() => {
    return Object.values(SEEDED_PUBLIC_BUSINESSES).find((b) => b.id === selectedTenantId) || Object.values(SEEDED_PUBLIC_BUSINESSES)[0];
  }, [selectedTenantId]);

  // Query filtered customer list
  const customers = useMemo(() => {
    const params: CustomerFilterParams = {
      searchQuery,
      status: statusFilter,
      customerType: typeFilter,
      tag: selectedTag
    };
    return customerCrmService.getCustomersByTenant(selectedTenantId, params, allBookings);
  }, [selectedTenantId, searchQuery, statusFilter, typeFilter, selectedTag, allBookings]);

  // Currently Selected Customer Profile
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return customerCrmService.getCustomerById(selectedCustomerId, selectedTenantId);
  }, [selectedCustomerId, selectedTenantId]);

  // Linked Bookings for selected customer
  const customerBookings = useMemo(() => {
    if (!selectedCustomer) return [];
    return allBookings.filter(
      (b) => b.businessId === selectedTenantId && (b.customerId === selectedCustomer.id || b.customerPhone === selectedCustomer.phone)
    );
  }, [selectedCustomer, selectedTenantId, allBookings]);

  // Available Tags for current tenant
  const availableTenantTags = useMemo(() => {
    const allTenantCustomers = customerCrmService.getCustomersByTenant(selectedTenantId);
    const tagSet = new Set<string>();
    allTenantCustomers.forEach((c) => c.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [selectedTenantId]);

  // KPI Metrics
  const stats = useMemo(() => {
    const allTenantCust = customerCrmService.getCustomersByTenant(selectedTenantId);
    const total = allTenantCust.length;
    const active = allTenantCust.filter((c) => c.status === 'ACTIVE').length;
    const newCust = allTenantCust.filter((c) => c.status === 'NEW').length;
    const totalRevenue = allTenantCust.reduce((sum, c) => sum + (c.totalSpend || 0), 0);
    return { total, active, newCust, totalRevenue };
  }, [selectedTenantId]);

  // Handle Add Form Change with Live Duplicate Detection
  const handleAddFormChange = (field: string, value: any) => {
    const updatedForm = { ...addForm, [field]: value };
    setAddForm(updatedForm);

    if (field === 'phone' || field === 'email') {
      const dup = customerCrmService.detectDuplicate(updatedForm.phone, updatedForm.email, selectedTenantId);
      if (dup.isPotentialDuplicate) {
        setDuplicateWarning(dup);
      } else {
        setDuplicateWarning(null);
      }
    }
  };

  // Submit New Customer Creation
  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.phone || !addForm.email) return;

    try {
      const created = customerCrmService.createCustomer(
        {
          businessId: selectedTenantId,
          name: addForm.name,
          phone: addForm.phone,
          email: addForm.email,
          dateOfBirth: addForm.dateOfBirth,
          gender: addForm.gender,
          initialNote: addForm.initialNote,
          marketingConsent: addForm.marketingConsent,
          tags: addForm.tags
        },
        selectedTenantId
      );

      setIsAddModalOpen(false);
      setAddForm({
        name: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        gender: 'Male',
        initialNote: '',
        marketingConsent: true,
        tags: ['New']
      });
      setDuplicateWarning(null);
      setSelectedCustomerId(created.id);
    } catch (err: any) {
      alert(`Customer Creation Error: ${err.message}`);
    }
  };

  // Submit New Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !newNoteText.trim()) return;

    customerCrmService.addCustomerNote(
      selectedCustomerId,
      newNoteText,
      'Admin Manager',
      'ADMIN',
      selectedTenantId
    );

    setNewNoteText('');
  };

  // Add Tag
  const handleAddTag = () => {
    if (!selectedCustomerId || !newTagInput.trim()) return;
    customerCrmService.addTag(selectedCustomerId, newTagInput, selectedTenantId);
    setNewTagInput('');
  };

  // Remove Tag
  const handleRemoveTag = (tag: string) => {
    if (!selectedCustomerId) return;
    customerCrmService.removeTag(selectedCustomerId, tag, selectedTenantId);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Phase 5.1 CRM
              </span>
              <span className="text-xs text-slate-400 font-mono">Centralized Business Customer Management</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <UserCheck className="w-6 h-6 text-emerald-400" />
              <span>Customer Relationship Management (CRM)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Multi-tenant isolated customer database, lifetime spend tracking, audited staff notes, duplicate detection, and booking history analytics.
            </p>
          </div>

          {/* Tenant Business Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/80">
            <Building2 className="w-4 h-4 text-emerald-400 ml-1.5" />
            <span className="text-xs font-medium text-slate-300">Tenant Context:</span>
            <select
              value={selectedTenantId}
              onChange={(e) => {
                setSelectedTenantId(e.target.value);
                setSelectedCustomerId(null);
              }}
              className="bg-slate-900 text-xs font-semibold text-white px-2.5 py-1 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="biz-barber-001">Royal Crown Barber Studio</option>
              <option value="biz-spa-002">Zenith Stone Spa & Wellness</option>
              <option value="biz-nail-003">Gloss & Chic Nail Bar</option>
            </select>
          </div>
        </div>

        {/* KPI Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block font-medium">Total Customer Profiles</span>
            <span className="text-xl font-bold text-white font-mono">{stats.total}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-emerald-400 block font-medium">Active Clients (&le; 90 Days)</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{stats.active}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-blue-400 block font-medium">New Clients (&le; 30 Days)</span>
            <span className="text-xl font-bold text-blue-400 font-mono">{stats.newCust}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block font-medium">Total Client Lifetime Spend</span>
            <span className="text-xl font-bold text-emerald-300 font-mono">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Control Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone, email, or booking ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          {/* Add Customer Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow transition flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Add New Customer</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </span>

          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('NEW')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                statusFilter === 'NEW' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                statusFilter === 'ACTIVE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('INACTIVE')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                statusFilter === 'INACTIVE' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inactive
            </button>
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="NEW">New (&le; 1 Booking)</option>
            <option value="RETURNING">Returning (&gt; 1 Booking)</option>
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg focus:outline-none"
          >
            <option value="ALL">All Tags</option>
            {availableTenantTags.map((t) => (
              <option key={t} value={t}>
                Tag: {t}
              </option>
            ))}
          </select>

          {(searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL' || selectedTag !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setTypeFilter('ALL');
                setSelectedTag('ALL');
              }}
              className="text-xs text-rose-600 font-semibold hover:underline ml-auto flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area: Customer List + Customer Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List Table */}
        <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${selectedCustomer ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {activeBusiness.name} — Customer Database ({customers.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Tenant: {selectedTenantId}</span>
          </div>

          {customers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Customers Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No customer records match your current filter or search criteria for {activeBusiness.name}.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setTypeFilter('ALL');
                  setSelectedTag('ALL');
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Total Spend</th>
                    <th className="py-3 px-3 text-center">Bookings</th>
                    <th className="py-3 px-3">Tags</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {customers.map((c) => {
                    const isSelected = c.id === selectedCustomerId;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCustomerId(c.id)}
                        className={`cursor-pointer transition ${
                          isSelected ? 'bg-emerald-50/80 border-l-4 border-l-emerald-600' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                              alt={c.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{c.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">ID: {c.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="text-slate-800 font-mono font-medium">{c.phone}</div>
                          <div className="text-[11px] text-slate-400">{c.email}</div>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                              c.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : c.status === 'NEW'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          ₹{c.totalSpend.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700">
                          {c.totalBookings}
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {c.tags.map((t) => (
                              <span
                                key={t}
                                className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded border border-slate-200"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomerId(c.id);
                            }}
                            className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition"
                            title="View Customer CRM Profile"
                          >
                            <ChevronRight className="w-4 h-4 text-slate-700" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Customer Detail Drawer / Profile View */}
        {selectedCustomer && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-md p-5 space-y-5 lg:col-span-1">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={selectedCustomer.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedCustomer.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedCustomer.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedCustomer.status === 'NEW'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {selectedCustomer.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">ID: {selectedCustomer.id}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomerId(null)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Marketing Preferences */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedCustomer.email}</span>
              </div>
              {selectedCustomer.dateOfBirth && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>DOB: {selectedCustomer.dateOfBirth} ({selectedCustomer.gender || 'N/A'})</span>
                </div>
              )}
              <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200">
                <span>Marketing Consent:</span>
                <span className={`font-bold ${selectedCustomer.marketingConsent ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {selectedCustomer.marketingConsent ? 'GRANTED' : 'OPTED OUT'}
                </span>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Total Spend</span>
                <span className="text-base font-bold text-emerald-900 font-mono">
                  ₹{selectedCustomer.totalSpend.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Total Bookings</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {selectedCustomer.totalBookings}
                </span>
              </div>
            </div>

            {/* Detail Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveDetailTab('notes')}
                className={`pb-2 transition border-b-2 flex items-center gap-1 ${
                  activeDetailTab === 'notes'
                    ? 'border-slate-900 text-slate-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Notes ({selectedCustomer.notes.length})
              </button>

              <button
                onClick={() => setActiveDetailTab('history')}
                className={`pb-2 transition border-b-2 flex items-center gap-1 ${
                  activeDetailTab === 'history'
                    ? 'border-slate-900 text-slate-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Bookings ({customerBookings.length})
              </button>

              <button
                onClick={() => setActiveDetailTab('tags')}
                className={`pb-2 transition border-b-2 flex items-center gap-1 ${
                  activeDetailTab === 'tags'
                    ? 'border-slate-900 text-slate-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <TagIcon className="w-3.5 h-3.5" />
                Tags ({selectedCustomer.tags.length})
              </button>
            </div>

            {/* TAB 1: NOTES TIMELINE */}
            {activeDetailTab === 'notes' && (
              <div className="space-y-4 text-xs">
                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add a private staff/manager note (e.g. 'Prefers senior stylist', 'Allergic to specific products')..."
                    rows={2}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={!newNoteText.trim()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded shadow transition flex items-center gap-1.5 ml-auto"
                  >
                    <Send className="w-3 h-3 text-emerald-400" />
                    <span>Save Note</span>
                  </button>
                </form>

                {/* Notes List */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedCustomer.notes.length === 0 ? (
                    <div className="text-slate-400 italic text-center py-4">No staff notes added yet.</div>
                  ) : (
                    selectedCustomer.notes.map((n: any) => (
                      <div key={n.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{n.authorName} ({n.authorRole})</span>
                          <span className="text-slate-400 font-mono">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{n.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: BOOKING HISTORY */}
            {activeDetailTab === 'history' && (
              <div className="space-y-3 text-xs max-h-60 overflow-y-auto pr-1">
                {customerBookings.length === 0 ? (
                  <div className="text-slate-400 italic text-center py-4">No bookings on record for this tenant.</div>
                ) : (
                  customerBookings.map((b) => (
                    <div key={b.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">{b.id}</span>
                        <span className="font-mono text-emerald-700 font-bold">₹{b.totalAmount}</span>
                      </div>
                      <div className="text-slate-600 flex items-center justify-between text-[11px]">
                        <span>{b.bookingDate} at {b.startTime}</span>
                        <span className="font-bold text-slate-800">{b.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: TAGS & ATTRIBUTES */}
            {activeDetailTab === 'tags' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="New tag name (e.g. Bridal, VIP)..."
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-slate-900 text-white rounded font-semibold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedCustomer.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded border border-slate-200 flex items-center gap-1.5"
                    >
                      {t}
                      <button
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-600 font-bold ml-1 text-slate-400"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE CUSTOMER MODAL WITH LIVE DUPLICATE DETECTION */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                Add New Customer to {activeBusiness.name}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Duplicate Alert Warning */}
            {duplicateWarning?.isPotentialDuplicate && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Potential Duplicate Customer Detected!
                </div>
                <p>{duplicateWarning.matchReason}</p>
                <p className="text-[11px] text-amber-700">
                  Please verify before creating to avoid fragmenting customer history.
                </p>
              </div>
            )}

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => handleAddFormChange('name', e.target.value)}
                  placeholder="e.g. Karan Mehra"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={addForm.phone}
                    onChange={(e) => handleAddFormChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => handleAddFormChange('email', e.target.value)}
                    placeholder="karan@example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={addForm.dateOfBirth}
                    onChange={(e) => handleAddFormChange('dateOfBirth', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={addForm.gender}
                    onChange={(e) => handleAddFormChange('gender', e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Unspecified</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Staff Note</label>
                <textarea
                  value={addForm.initialNote}
                  onChange={(e) => handleAddFormChange('initialNote', e.target.value)}
                  placeholder="e.g. Prefers quiet evening appointments..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mktConsent"
                  checked={addForm.marketingConsent}
                  onChange={(e) => handleAddFormChange('marketingConsent', e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="mktConsent" className="text-slate-700 font-medium">
                  Client granted marketing & promotional communications consent
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs shadow"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
