import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Search,
  Filter,
  SlidersHorizontal,
  Edit,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  Sparkles,
  Scissors,
  Sparkle,
  Eye,
  Check,
  ChevronRight,
  Phone,
  Mail,
  Award,
  BookOpen,
  DollarSign,
  Star,
  Layers,
  Building2,
  Lock,
  Plus,
  Image as ImageIcon,
  Instagram,
  Linkedin,
  AlertCircle,
  TrendingUp,
  X
} from 'lucide-react';

import { StaffManagementService } from '../services/staffManagementService';
import { StaffProfileEntity, StaffPerformanceStats } from '../types/staffManagement';
import { ServiceBookingConfig } from '../types/servicePackageConfig';
import { BookingEntity } from '../types/bookingEngine';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase53StaffManagementShowcase() {
  const [staffService] = useState(() => new StaffManagementService());

  // Multi-Tenant Context
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Selected Staff for Profile Detail View
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>('stf-rc-01');
  const [activeProfileTab, setActiveProfileTab] = useState<
    'overview' | 'services' | 'availability' | 'leave' | 'upcoming' | 'completed' | 'performance'
  >('overview');

  // Modals & Drawers
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [isCustomRoleOpen, setIsCustomRoleOpen] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');

  // Form State for Create / Edit
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formPhoto, setFormPhoto] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formJoinedAt, setFormJoinedAt] = useState('');
  const [formSpecializationsStr, setFormSpecializationsStr] = useState('');
  const [formInstagram, setFormInstagram] = useState('');
  const [formLinkedin, setFormLinkedin] = useState('');
  const [formServiceIds, setFormServiceIds] = useState<string[]>([]);

  // Assigned Services Matrix State inside Profile View
  const [assignedServiceIds, setAssignedServiceIds] = useState<string[]>([]);
  const [assignmentSuccessMsg, setAssignmentSuccessMsg] = useState<string | null>(null);

  // Test Suite Execution State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Load staff list & assigned services whenever tenant or filter changes
  const staffList = staffService.listStaffForBusiness(currentBusinessId, {
    searchQuery,
    status: statusFilter,
    role: roleFilter
  });

  const availableRoles = staffService.getAvailableRolesForBusiness(currentBusinessId);

  // Ensure selectedStaffId belongs to current tenant
  useEffect(() => {
    const currentStaff = staffService.listStaffForBusiness(currentBusinessId);
    if (currentStaff.length > 0) {
      if (!selectedStaffId || !currentStaff.some((s) => s.id === selectedStaffId)) {
        setSelectedStaffId(currentStaff[0].id);
      }
    } else {
      setSelectedStaffId(null);
    }
  }, [currentBusinessId]);

  const activeStaffEntity: StaffProfileEntity | null = selectedStaffId
    ? staffService.getStaffById(selectedStaffId, currentBusinessId)
    : null;

  // Sync assigned service IDs for active profile
  useEffect(() => {
    if (selectedStaffId) {
      const assigned = staffService.getAssignedServicesForStaff(
        selectedStaffId,
        currentBusinessId
      );
      setAssignedServiceIds(assigned.map((s: ServiceBookingConfig) => s.id));
    } else {
      setAssignedServiceIds([]);
    }
  }, [selectedStaffId, currentBusinessId]);

  // Derived Performance Stats for Active Staff
  const performanceStats: StaffPerformanceStats | null = activeStaffEntity
    ? staffService.getStaffPerformanceStats(activeStaffEntity.id, currentBusinessId)
    : null;

  // Derived Bookings for Active Staff
  const upcomingBookings: BookingEntity[] = activeStaffEntity
    ? staffService.getStaffUpcomingBookings(activeStaffEntity.id, currentBusinessId)
    : [];

  const completedBookings: BookingEntity[] = activeStaffEntity
    ? staffService.getStaffCompletedBookings(activeStaffEntity.id, currentBusinessId)
    : [];

  // Derived Services List
  const allCatalogServices: ServiceBookingConfig[] = activeStaffEntity
    ? staffService['servicePackageService'].listServicesForBusiness(currentBusinessId, {
        includeInactive: true
      })
    : [];

  // Handlers
  const handleTenantChange = (bizId: string) => {
    setCurrentBusinessId(bizId);
    setSearchQuery('');
    setStatusFilter('ALL');
    setRoleFilter('ALL');
  };

  const handleToggleStatus = (staffId: string) => {
    const target = staffService.getStaffById(staffId, currentBusinessId);
    if (!target) return;
    if (target.active) {
      staffService.deactivateStaff(staffId, currentBusinessId);
    } else {
      staffService.activateStaff(staffId, currentBusinessId);
    }
    // Force re-render
    setSelectedStaffId(staffId);
  };

  const handleSaveServiceAssignments = () => {
    if (!activeStaffEntity) return;
    staffService.assignServicesToStaff(
      activeStaffEntity.id,
      assignedServiceIds,
      currentBusinessId
    );
    setAssignmentSuccessMsg('Staff service eligibility updated successfully!');
    setTimeout(() => setAssignmentSuccessMsg(null), 3000);
  };

  const handleAddCustomRole = () => {
    if (!customRoleInput.trim()) return;
    staffService.addCustomRoleForBusiness(currentBusinessId, customRoleInput.trim());
    setFormRole(customRoleInput.trim());
    setCustomRoleInput('');
    setIsCustomRoleOpen(false);
  };

  const openCreateModal = () => {
    setFormName('');
    setFormRole(availableRoles[0] || 'Barber');
    setFormPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
    setFormPhone('+91 9800011122');
    setFormEmail('');
    setFormBio('');
    setFormJoinedAt(new Date().toISOString().split('T')[0]);
    setFormSpecializationsStr('Styling, Haircut');
    setFormInstagram('');
    setFormLinkedin('');
    setFormServiceIds([]);
    setIsAddStaffOpen(true);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const created = staffService.createStaff(
      {
        businessId: currentBusinessId,
        name: formName,
        role: formRole,
        photo: formPhoto,
        phone: formPhone,
        email: formEmail,
        bio: formBio,
        joinedAt: formJoinedAt,
        specializations: formSpecializationsStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        socialLinks: {
          instagram: formInstagram || undefined,
          linkedin: formLinkedin || undefined
        },
        serviceIds: formServiceIds
      },
      currentBusinessId
    );

    setSelectedStaffId(created.id);
    setIsAddStaffOpen(false);
  };

  const openEditModal = (staff: StaffProfileEntity) => {
    setFormName(staff.name);
    setFormRole(staff.role);
    setFormPhoto(staff.photo || '');
    setFormPhone(staff.phone || '');
    setFormEmail(staff.email || '');
    setFormBio(staff.bio || '');
    setFormSpecializationsStr(staff.specializations.join(', '));
    setFormInstagram(staff.socialLinks?.instagram || '');
    setFormLinkedin(staff.socialLinks?.linkedin || '');
    setIsEditStaffOpen(true);
  };

  const handleEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStaffEntity) return;

    staffService.updateStaff(
      activeStaffEntity.id,
      {
        name: formName,
        role: formRole,
        photo: formPhoto,
        phone: formPhone,
        email: formEmail,
        bio: formBio,
        specializations: formSpecializationsStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        socialLinks: {
          instagram: formInstagram || undefined,
          linkedin: formLinkedin || undefined
        }
      },
      currentBusinessId
    );

    setIsEditStaffOpen(false);
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
    'biz-spa-002': 'Zenith Stone Spa',
    'biz-nail-003': 'Gloss & Chic Nail Bar',
    'biz-tattoo-004': 'Mono Tattoo Studio'
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 5.3 — Business Staff Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Staff Directory, Role Assignment & Real Booking Analytics
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Multi-tenant staff management engine with custom role definitions, bidirectional service assignments, shift schedules, inactive booking protection, and authoritative booking-derived performance metrics.
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
              <span>Run Suite 20 Tests</span>
            </button>
          </div>
        </div>

        {/* Business Context Switcher */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Select Business Context:
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
                onClick={() => handleTenantChange(biz.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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

      {/* 2. Automated Test Results Runner */}
      {testResults && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-base">Suite 20: Phase 5.3 Staff Management Automated Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 20') || r.suite.includes('Phase 5.3'))
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

      {/* 3. Main Staff Management Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Staff Directory List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-slate-900 text-lg">Staff Directory</h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-xs font-semibold">
                  {staffList.length}
                </span>
              </div>

              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Staff</span>
              </button>
            </div>

            {/* Search & Filter Inputs */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search staff by name, role, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">Active Only</option>
                    <option value="INACTIVE">Inactive Only</option>
                  </select>
                </div>

                <div className="flex-1">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">All Roles</option>
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Staff Member List */}
            {staffList.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                <UserX className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">No staff members found matching criteria.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                {staffList.map((staff) => {
                  const isSelected = selectedStaffId === staff.id;
                  const assignedServices = staffService.getAssignedServicesForStaff(
                    staff.id,
                    currentBusinessId
                  );

                  return (
                    <div
                      key={staff.id}
                      onClick={() => setSelectedStaffId(staff.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={staff.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'}
                              alt={staff.name}
                              className="w-11 h-11 rounded-full object-cover border border-slate-200"
                            />
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                staff.active ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-slate-900 text-sm">{staff.name}</h3>
                            </div>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                              {staff.role}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(staff.id);
                          }}
                          className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                            staff.active
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title={staff.active ? 'Click to Deactivate' : 'Click to Activate'}
                        >
                          {staff.active ? (
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <UserX className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                      </div>

                      {/* Specializations Pills */}
                      <div className="flex flex-wrap gap-1">
                        {staff.specializations.slice(0, 3).map((spec, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]"
                          >
                            {spec}
                          </span>
                        ))}
                        {staff.specializations.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">
                            +{staff.specializations.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-indigo-500" />
                          {assignedServices.length} Services Assigned
                        </span>
                        <span className="text-slate-400">Joined {staff.joinedAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Staff Profile Experience (7 cols) */}
        <div className="lg:col-span-7">
          {!activeStaffEntity ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Staff Selected</h3>
              <p className="text-xs text-slate-500">Select a staff member from the directory or create a new profile.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
              {/* Profile Header */}
              <div className="bg-slate-900 text-white p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={activeStaffEntity.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'}
                      alt={activeStaffEntity.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">{activeStaffEntity.name}</h2>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            activeStaffEntity.active
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {activeStaffEntity.active ? 'ACTIVE STAFF' : 'INACTIVE'}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-300 font-medium">{activeStaffEntity.role}</p>
                      <p className="text-[11px] text-slate-400">
                        {businessNames[activeStaffEntity.businessId] || activeStaffEntity.businessId} · Joined {activeStaffEntity.joinedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(activeStaffEntity)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      onClick={() => handleToggleStatus(activeStaffEntity.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all ${
                        activeStaffEntity.active
                          ? 'bg-rose-600 hover:bg-rose-500'
                          : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}
                    >
                      {activeStaffEntity.active ? (
                        <>
                          <UserX className="w-3.5 h-3.5" />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub-Section Navigation Tabs */}
                <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800 text-xs font-medium">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'services', label: `Services (${assignedServiceIds.length})` },
                    { id: 'availability', label: 'Shift Hours' },
                    { id: 'upcoming', label: `Upcoming (${upcomingBookings.length})` },
                    { id: 'completed', label: `History (${completedBookings.length})` },
                    { id: 'performance', label: 'Performance' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveProfileTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        activeProfileTab === tab.id
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content Area */}
              <div className="p-6 space-y-6">
                {/* 1. OVERVIEW TAB */}
                {activeProfileTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Bio</h4>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                        {activeStaffEntity.bio || 'No bio provided for this staff member.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Information</h4>
                        <div className="space-y-1.5 text-xs text-slate-700">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{activeStaffEntity.phone || 'Phone not available'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{activeStaffEntity.email || 'Email not available'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Social Accounts</h4>
                        <div className="space-y-1.5 text-xs text-slate-700">
                          <div className="flex items-center gap-2">
                            <Instagram className="w-3.5 h-3.5 text-rose-500" />
                            <span>{activeStaffEntity.socialLinks?.instagram || 'Not linked'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                            <span>{activeStaffEntity.socialLinks?.linkedin || 'Not linked'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specialization Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeStaffEntity.specializations.map((spec, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SERVICES ASSIGNMENT TAB */}
                {activeProfileTab === 'services' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Assigned Services Eligibility Matrix</h3>
                        <p className="text-xs text-slate-500">Only checked services can be booked with this staff member.</p>
                      </div>

                      <button
                        onClick={handleSaveServiceAssignments}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Assignments</span>
                      </button>
                    </div>

                    {assignmentSuccessMsg && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{assignmentSuccessMsg}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      {allCatalogServices.map((service: ServiceBookingConfig) => {
                        const isAssigned = assignedServiceIds.includes(service.id);
                        return (
                          <label
                            key={service.id}
                            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                              isAssigned
                                ? 'bg-indigo-50/50 border-indigo-200'
                                : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isAssigned}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setAssignedServiceIds([...assignedServiceIds, service.id]);
                                  } else {
                                    setAssignedServiceIds(
                                      assignedServiceIds.filter((id) => id !== service.id)
                                    );
                                  }
                                }}
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                              />
                              <div>
                                <div className="font-bold text-slate-900 text-xs">{service.name}</div>
                                <div className="text-[11px] text-slate-500">
                                  {service.duration} mins · ₹{service.price}
                                </div>
                              </div>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                service.bookable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {service.bookable ? 'ONLINE BOOKABLE' : 'IN-SALON ONLY'}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. AVAILABILITY SHIFT HOURS TAB */}
                {activeProfileTab === 'availability' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm">Weekly Shift Schedule</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { day: 'Monday', isWorking: false, time: 'Off' },
                        { day: 'Tuesday', isWorking: true, time: '09:00 - 20:00 (Break: 14:00 - 14:30)' },
                        { day: 'Wednesday', isWorking: true, time: '09:00 - 20:00' },
                        { day: 'Thursday', isWorking: true, time: '09:00 - 20:00' },
                        { day: 'Friday', isWorking: true, time: '09:00 - 20:00' },
                        { day: 'Saturday', isWorking: true, time: '09:00 - 21:00' },
                        { day: 'Sunday', isWorking: true, time: '09:00 - 21:00' }
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                        >
                          <span className="font-bold text-slate-800">{item.day}</span>
                          <span
                            className={`font-mono font-medium ${
                              item.isWorking ? 'text-indigo-600' : 'text-slate-400'
                            }`}
                          >
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. UPCOMING BOOKINGS TAB */}
                {activeProfileTab === 'upcoming' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm">Upcoming Bookings for {activeStaffEntity.name}</h3>

                    {upcomingBookings.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                        No upcoming bookings scheduled for this staff member.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {upcomingBookings.map((b: BookingEntity) => (
                          <div
                            key={b.id}
                            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-bold text-slate-900">{b.customerName}</div>
                              <div className="text-[11px] text-slate-500">
                                {b.items[0]?.nameSnapshot || 'Service'} · {b.bookingDate} at {b.startTime}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                                {b.status}
                              </span>
                              <div className="font-mono font-bold text-slate-900 mt-1">
                                ₹{b.totalAmount}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. COMPLETED HISTORY TAB */}
                {activeProfileTab === 'completed' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm">Completed Booking History</h3>

                    {completedBookings.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                        No completed historical bookings recorded.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {completedBookings.map((b: BookingEntity) => (
                          <div
                            key={b.id}
                            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-bold text-slate-900">{b.customerName}</div>
                              <div className="text-[11px] text-slate-500">
                                {b.items[0]?.nameSnapshot || 'Service'} · {b.bookingDate}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                COMPLETED
                              </span>
                              <div className="font-mono font-bold text-slate-900 mt-1">
                                ₹{b.totalAmount}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. PERFORMANCE TAB */}
                {activeProfileTab === 'performance' && performanceStats && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-slate-900 text-sm">Authoritative Performance Analytics</h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[11px] font-medium text-slate-500">Total Revenue</span>
                        <div className="text-xl font-extrabold text-slate-900 font-mono">
                          {performanceStats.formattedRevenue}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[11px] font-medium text-slate-500">Total Bookings</span>
                        <div className="text-xl font-extrabold text-slate-900 font-mono">
                          {performanceStats.totalBookings}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[11px] font-medium text-slate-500">Completion Rate</span>
                        <div className="text-xl font-extrabold text-emerald-600 font-mono">
                          {performanceStats.completionRatePercent}%
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[11px] font-medium text-slate-500">Completed Visits</span>
                        <div className="text-xl font-extrabold text-slate-900 font-mono">
                          {performanceStats.completedBookings}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[11px] font-medium text-slate-500">Cancelled / No Show</span>
                        <div className="text-xl font-extrabold text-rose-600 font-mono">
                          {performanceStats.cancelledBookings + performanceStats.noShowBookings}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[11px] font-medium text-slate-500">Average Rating</span>
                        <div className="text-xl font-extrabold text-amber-500 font-mono flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{performanceStats.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-lg">Add New Staff Profile</h3>
              </div>
              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Staff Role *</label>
                  <div className="flex items-center gap-1">
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      {availableRoles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setIsCustomRoleOpen(true)}
                      className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200 hover:bg-indigo-100"
                      title="Add Custom Role"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 9800011122"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="rahul@business.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Photo URL</label>
                <input
                  type="text"
                  value={formPhoto}
                  onChange={(e) => setFormPhoto(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Specializations (comma separated)</label>
                <input
                  type="text"
                  value={formSpecializationsStr}
                  onChange={(e) => setFormSpecializationsStr(e.target.value)}
                  placeholder="Skin Fades, Beard Sculpting, Hair Spa"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Bio</label>
                <textarea
                  rows={2}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  placeholder="Brief staff overview..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
                >
                  Create Staff Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Custom Role Creator Modal */}
      {isCustomRoleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Define Custom Staff Role</h3>
            <input
              type="text"
              placeholder="e.g. Master Colorist, Lead Tattooist..."
              value={customRoleInput}
              onChange={(e) => setCustomRoleInput(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setIsCustomRoleOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomRole}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold"
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Edit Staff Modal */}
      {isEditStaffOpen && activeStaffEntity && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-lg">Edit Staff Profile</h3>
              </div>
              <button
                onClick={() => setIsEditStaffOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Bio</label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditStaffOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
