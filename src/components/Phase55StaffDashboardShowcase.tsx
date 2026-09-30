import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Building2,
  Users,
  Plus,
  Sparkles,
  Scissors,
  Award,
  Sparkle,
  Check,
  X,
  Eye,
  Lock,
  Phone,
  Mail,
  FileText,
  DollarSign,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  User
} from 'lucide-react';

import { StaffDashboardService } from '../services/staffDashboardService';
import { StaffManagementService } from '../services/staffManagementService';
import { BookingEntity } from '../types/bookingEngine';
import { StaffProfileEntity } from '../types/staffManagement';
import { runFoundationTestSuite, TestResultItem } from '../test/foundationTests';

export function Phase55StaffDashboardShowcase() {
  const [dashboardService] = useState(() => new StaffDashboardService());
  const [staffManagement] = useState(() => new StaffManagementService());

  // Multi-Tenant Business Context
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('biz-barber-001');

  // Staff Member Context
  const [currentStaffId, setCurrentStaffId] = useState<string>('stf-rc-01');

  // Dashboard Tab View
  const [activeTab, setActiveTab] = useState<
    'home' | 'todays-appts' | 'calendar' | 'profile' | 'availability' | 'security'
  >('home');

  // Calendar View Mode
  const [calendarView, setCalendarView] = useState<'day' | 'week'>('day');

  // Selected Appointment for Detail Modal
  const [selectedBooking, setSelectedBooking] = useState<BookingEntity | null>(null);

  // Success Feedback Message
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Self Profile Form State
  const [profileBio, setProfileBio] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [profileSpecs, setProfileSpecs] = useState('');

  // Leave Request Form State
  const [leaveStartDate, setLeaveStartDate] = useState('2026-11-01');
  const [leaveEndDate, setLeaveEndDate] = useState('2026-11-03');
  const [leaveType, setLeaveType] = useState<'VACATION' | 'SICK_LEAVE' | 'CASUAL' | 'PERSONAL'>('VACATION');
  const [leaveReason, setLeaveReason] = useState('');

  // Automated Test Suite State
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestResultItem[];
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Staff list for active tenant
  const tenantStaff = staffManagement.listStaffForBusiness(currentBusinessId);

  // Active Staff Member Entity
  const staffProfile: StaffProfileEntity | null = staffManagement.getStaffById(currentStaffId, currentBusinessId);

  // Dashboard Summary & Appointments
  const summary = dashboardService.getStaffSummary(currentStaffId, currentBusinessId, '2026-10-20');
  const todaysAppts = dashboardService.getTodaysAppointments(currentStaffId, currentBusinessId, '2026-10-20');
  const upcomingAppts = dashboardService.getUpcomingAppointments(currentStaffId, currentBusinessId, '2026-10-20');

  // Handlers
  const handleTenantChange = (bizId: string) => {
    setCurrentBusinessId(bizId);
    const newStaffList = staffManagement.listStaffForBusiness(bizId);
    if (newStaffList.length > 0) {
      setCurrentStaffId(newStaffList[0].id);
    }
  };

  const handleAction = (bookingId: string, action: 'CHECK_IN' | 'START' | 'COMPLETE') => {
    const res = dashboardService.executeAppointmentAction(
      {
        bookingId,
        staffId: currentStaffId,
        action
      },
      currentBusinessId
    );

    if (res.success) {
      showTempSuccess(`Appointment successfully marked as ${action.replace('_', ' ')}`);
    } else {
      alert(res.error || 'Action failed');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dashboardService.updateStaffSelfProfile(currentStaffId, currentBusinessId, {
      bio: profileBio,
      phone: profilePhone,
      email: profileEmail,
      photo: profilePhoto,
      specializations: profileSpecs.split(',').map((s) => s.trim()).filter(Boolean)
    });
    showTempSuccess('Profile updated successfully');
  };

  const handleRequestLeave = (e: React.FormEvent) => {
    e.preventDefault();
    dashboardService.requestStaffLeave(
      currentStaffId,
      currentBusinessId,
      leaveStartDate,
      leaveEndDate,
      leaveType,
      leaveReason || 'Personal leave request'
    );
    showTempSuccess('Leave request submitted (Pending manager approval)');
  };

  const showTempSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
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
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 5.5 — Staff-Facing Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Staff Portal: Today's Queue, Appointment Actions, Calendar & Self Profile
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Secure staff workspace enforcing strict data isolation and permission boundaries. Staff can manage their daily appointment lifecycle, view calendar schedules, submit leave requests, and edit permitted profile attributes while business-critical financial and tax settings remain locked.
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
              <span>Run Suite 22 Tests</span>
            </button>
          </div>
        </div>

        {/* Business & Staff Selector Bar */}
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
                  onClick={() => handleTenantChange(biz.id)}
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
            <span className="text-xs text-slate-400 font-medium">Staff User:</span>
            <select
              value={currentStaffId}
              onChange={(e) => setCurrentStaffId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {tenantStaff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Automated Test Results Runner */}
      {testResults && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-base">Suite 22: Phase 5.5 Staff Dashboard Automated Tests</h3>
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
              .filter((r) => r.suite.includes('Suite 22') || r.suite.includes('Phase 5.5'))
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

      {/* Success Feedback Toast */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex flex-wrap items-center gap-2">
        {[
          { id: 'home', label: 'Staff Home', icon: Users },
          { id: 'todays-appts', label: `Today's Appointments (${todaysAppts.length})`, icon: Clock },
          { id: 'calendar', label: 'Calendar Schedule', icon: Calendar },
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'availability', label: 'Availability & Leave', icon: Briefcase },
          { id: 'security', label: 'Security & Permissions', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content Views */}

      {/* HOME TAB */}
      {activeTab === 'home' && staffProfile && (
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={staffProfile.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                alt={staffProfile.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-md"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Welcome back, {staffProfile.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {summary.availabilityStatus}
                  </span>
                </div>
                <p className="text-xs text-indigo-600 font-semibold">{staffProfile.role} · {businessNames[currentBusinessId]}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Today's Appts</span>
                <div className="text-lg font-extrabold text-slate-900">{summary.todaysAppointmentsCount}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Completed</span>
                <div className="text-lg font-extrabold text-emerald-600">{summary.completedTodayCount}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Upcoming</span>
                <div className="text-lg font-extrabold text-indigo-600">{summary.upcomingCount}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Rating</span>
                <div className="text-lg font-extrabold text-amber-500">4.9 ★</div>
              </div>
            </div>
          </div>

          {/* Next Appointment Card */}
          {summary.nextAppointment && (
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs text-indigo-300 font-semibold tracking-wider uppercase">Next Appointment</span>
                <h3 className="text-lg font-bold">{summary.nextAppointment.customerName}</h3>
                <p className="text-xs text-slate-300">
                  {summary.nextAppointment.items[0]?.nameSnapshot} · {summary.nextAppointment.bookingDate} at {summary.nextAppointment.startTime} ({summary.nextAppointment.duration} mins)
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(summary.nextAppointment)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-indigo-50 shadow-md"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TODAY'S APPOINTMENTS TAB */}
      {activeTab === 'todays-appts' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Today's Appointment Queue</h2>
              <p className="text-xs text-slate-500">Manage client arrival, start service sessions, and mark visits as completed.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono text-xs font-bold">
              {todaysAppts.length} Bookings Today
            </span>
          </div>

          {todaysAppts.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
              No appointments scheduled for today.
            </div>
          ) : (
            <div className="space-y-3">
              {todaysAppts.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-600 text-sm">
                        {b.startTime} - {b.endTime}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                        {b.status}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">{b.customerName}</div>
                    <div className="text-slate-500 text-[11px]">
                      {b.items[0]?.nameSnapshot} · {b.duration} mins · Phone: {b.customerPhone}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100"
                    >
                      View
                    </button>

                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleAction(b.id, 'CHECK_IN')}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 shadow-sm"
                      >
                        Check In
                      </button>
                    )}

                    {['CONFIRMED', 'CHECKED_IN'].includes(b.status) && (
                      <button
                        onClick={() => handleAction(b.id, 'START')}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shadow-sm"
                      >
                        Start
                      </button>
                    )}

                    {b.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleAction(b.id, 'COMPLETE')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 shadow-sm"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CALENDAR TAB */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-bold text-slate-900 text-lg">My Schedule Calendar</h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setCalendarView('day')}
                className={`px-3 py-1.5 rounded-lg transition-all ${calendarView === 'day' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'text-slate-600'}`}
              >
                Day View
              </button>
              <button
                onClick={() => setCalendarView('week')}
                className={`px-3 py-1.5 rounded-lg transition-all ${calendarView === 'week' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'text-slate-600'}`}
              >
                Week View
              </button>
            </div>
          </div>

          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <Calendar className="w-10 h-10 text-indigo-600 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Schedule View Mode: {calendarView.toUpperCase()}</h3>
            <p className="text-xs text-slate-500">
              Showing assigned bookings and active shift hours for staff ID: <code className="font-mono text-indigo-600">{currentStaffId}</code>
            </p>
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && staffProfile && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-2xl">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-bold text-slate-900 text-lg">Manage My Profile</h2>
            <p className="text-xs text-slate-500">Update permitted contact information, bio, photo, and specializations.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Display Bio</label>
              <textarea
                rows={3}
                value={profileBio}
                placeholder={staffProfile.bio || 'Enter professional bio...'}
                onChange={(e) => setProfileBio(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={profilePhone}
                  placeholder={staffProfile.phone || ''}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={profileEmail}
                  placeholder={staffProfile.email || ''}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Photo URL</label>
              <input
                type="text"
                value={profilePhoto}
                placeholder={staffProfile.photo || ''}
                onChange={(e) => setProfilePhoto(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Specializations (comma separated)</label>
              <input
                type="text"
                value={profileSpecs}
                placeholder={staffProfile.specializations.join(', ')}
                onChange={(e) => setProfileSpecs(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AVAILABILITY & LEAVE TAB */}
      {activeTab === 'availability' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-2xl">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-bold text-slate-900 text-lg">Request Leave</h2>
            <p className="text-xs text-slate-500">Submit leave requests to business manager for approval.</p>
          </div>

          <form onSubmit={handleRequestLeave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Start Date</label>
                <input
                  type="date"
                  required
                  value={leaveStartDate}
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">End Date</label>
                <input
                  type="date"
                  required
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="VACATION">Vacation</option>
                <option value="SICK_LEAVE">Sick Leave</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="PERSONAL">Personal</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Reason</label>
              <input
                type="text"
                value={leaveReason}
                placeholder="Reason for leave request..."
                onChange={(e) => setLeaveReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
              >
                Submit Leave Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-bold text-slate-900 text-lg">Security & Permission Guard</h2>
            <p className="text-xs text-slate-500">Verifying that staff permissions are strictly enforced.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="font-bold text-rose-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-rose-600" />
                <span>Restricted Business Settings</span>
              </div>
              <p className="text-rose-700">Staff members are strictly prohibited from changing:</p>
              <ul className="list-disc list-inside text-rose-800 space-y-1 font-medium">
                <li>Financial settings & pricing structures</li>
                <li>Commission configurations</li>
                <li>Tax / TDS rules</li>
                <li>Super admin controls</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Staff Data Isolation</span>
              </div>
              <p className="text-emerald-700">Tenant & Staff Data isolation ensures:</p>
              <ul className="list-disc list-inside text-emerald-800 space-y-1 font-medium">
                <li>Staff A cannot access Staff B's private appointments</li>
                <li>Business A cannot view Business B staff records</li>
                <li>All appointment lifecycle actions verify staff assignment</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Appointment Details</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 uppercase font-bold text-[10px]">Customer</span>
                  <div className="font-bold text-slate-900 text-sm">{selectedBooking.customerName}</div>
                  <div className="text-slate-600">{selectedBooking.customerPhone}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 uppercase font-bold text-[10px]">Status</span>
                  <div className="font-bold text-indigo-600 text-sm">{selectedBooking.status}</div>
                  <div className="text-slate-600 font-mono">{selectedBooking.bookingDate}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 uppercase font-bold text-[10px]">Service / Item</span>
                <div className="font-bold text-slate-900 text-sm">{selectedBooking.items[0]?.nameSnapshot || 'Service'}</div>
                <div className="text-slate-600">Duration: {selectedBooking.duration} mins · Time: {selectedBooking.startTime} - {selectedBooking.endTime}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 uppercase font-bold text-[10px]">Relevant Notes</span>
                <p className="text-slate-700 italic">No special instructions or customer notes recorded for this appointment.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
