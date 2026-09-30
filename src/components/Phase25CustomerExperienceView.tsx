import React, { useState } from 'react';
import {
  CUSTOMER_SCREENS_8,
  MOCK_CUSTOMER_BOOKINGS,
  UI_STATES_8,
  CustomerScreenSpec,
  CustomerBookingCard,
  UIStateSpec,
  BookingStatusType
} from '../data/phase25CustomerExperienceData';
import {
  User,
  Calendar,
  Clock,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  CreditCard,
  FileText,
  ChevronRight,
  ArrowRight,
  Smartphone,
  Tablet,
  Monitor,
  Search,
  Filter,
  ArrowLeft,
  Info,
  ExternalLink,
  MapPin,
  Phone,
  Scissors,
  Check,
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const Phase25CustomerExperienceView: React.FC = () => {
  // Navigation & Sub-view states
  const [activeTab, setActiveTab] = useState<'screens' | 'my-bookings' | 'states' | 'spec-matrix'>('screens');
  const [selectedScreenIndex, setSelectedScreenIndex] = useState<number>(0);
  const [bookingsFilter, setBookingsFilter] = useState<'Upcoming' | 'Completed' | 'Cancelled' | 'Pending'>('Upcoming');
  const [selectedStateId, setSelectedStateId] = useState<string>('confirmed');
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  // Interactive booking state simulation
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<CustomerBookingCard | null>(null);
  const [modalActionType, setModalActionType] = useState<'cancel' | 'reschedule' | 'details' | null>(null);

  const currentScreen = CUSTOMER_SCREENS_8[selectedScreenIndex];
  const currentState = UI_STATES_8.find((s) => s.stateId === selectedStateId) || UI_STATES_8[0];

  // Filter bookings according to active tab
  const filteredBookings = MOCK_CUSTOMER_BOOKINGS.filter((b) => {
    if (bookingsFilter === 'Upcoming') return b.status === 'Confirmed';
    if (bookingsFilter === 'Completed') return b.status === 'Completed';
    if (bookingsFilter === 'Cancelled') return b.status === 'Cancelled';
    if (bookingsFilter === 'Pending') return b.status === 'Payment Pending';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Phase 2.5 Active
              </span>
              <span className="text-xs text-slate-500 font-mono">Customer Account Area & Lifecycle UI Specification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Phase 2.5 — Customer Experience
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Specification for the authenticated customer account area across 8 core screens, unified 4-tab 
              <span className="font-semibold text-slate-900"> My Bookings </span> ledger, and 8 explicit UI states. Strictly front-end UI architecture.
            </p>
          </div>

          {/* Strict Scope Compliance Badge */}
          <div className="flex flex-wrap lg:flex-col items-end gap-2 text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Strict Scope: UI Specification Only (Zero Backend / APIs)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              WCAG 2.2 AA · 48px Min Touch Targets · Mobile-First
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('screens')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'screens'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>8 Customer Screens ({CUSTOMER_SCREENS_8.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'my-bookings'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>My Bookings Hub (4 Navigation Tabs)</span>
          </button>

          <button
            onClick={() => setActiveTab('states')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'states'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>8 UI States Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('spec-matrix')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'spec-matrix'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Specification Matrix</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: 8 CUSTOMER SCREENS SPECIFICATION */}
      {activeTab === 'screens' && (
        <div className="space-y-6">
          {/* Screen Selector Pills */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Customer Account Screen (1 through 8)
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setViewportMode('mobile')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-all ${
                    viewportMode === 'mobile' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile 360px</span>
                </button>
                <button
                  onClick={() => setViewportMode('tablet')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-all ${
                    viewportMode === 'tablet' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Tablet className="w-3 h-3" />
                  <span>Tablet 768px</span>
                </button>
                <button
                  onClick={() => setViewportMode('desktop')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-all ${
                    viewportMode === 'desktop' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop 1024px+</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {CUSTOMER_SCREENS_8.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScreenIndex(idx)}
                  className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                    selectedScreenIndex === idx
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="font-mono text-[10px] opacity-75 mb-0.5">0{s.screenNumber}</div>
                  <div className="truncate font-medium">{s.name.replace(/^\d+\.\s*/, '')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Screen Detail Grid: Spec Details on Left, Interactive Screen Simulator on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Full Architectural Specification */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono text-emerald-700 font-semibold uppercase tracking-wider">
                      Screen Specification #{currentScreen.screenNumber}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">{currentScreen.name}</h2>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                    {currentScreen.route}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Purpose</h3>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {currentScreen.purpose}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Layout Structure & Sections
                  </h3>
                  <div className="space-y-1">
                    {currentScreen.layoutStructure.map((sec, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>{sec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Reusable Components Utilized
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {currentScreen.componentsUsed.map((cmp, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[11px] font-mono"
                      >
                        {cmp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Desktop Layout (1024px+)
                    </span>
                    <p className="text-xs text-slate-700">{currentScreen.desktopLayout}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Mobile Layout (360px+)
                    </span>
                    <p className="text-xs text-slate-700">{currentScreen.mobileLayout}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    User Actions Handled
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {currentScreen.actions.map((act, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-xs font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    States Handled by this Screen
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {currentScreen.statesHandled.map((st, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-[10px] font-mono"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Interactive Screen Visualizer */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 rounded-xl p-4 text-white shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="ml-2 text-xs font-mono text-slate-400">
                      https://apex.nexora.app{currentScreen.route}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Mode: {viewportMode.toUpperCase()}
                  </span>
                </div>

                {/* Device Frame Simulation */}
                <div className="flex justify-center p-2">
                  <div
                    className={`transition-all duration-300 w-full ${
                      viewportMode === 'mobile'
                        ? 'max-w-[390px] border-4 border-slate-700 rounded-2xl p-4 bg-slate-50 text-slate-900'
                        : viewportMode === 'tablet'
                        ? 'max-w-[640px] border-4 border-slate-700 rounded-2xl p-6 bg-slate-50 text-slate-900'
                        : 'max-w-full border border-slate-700 rounded-xl p-6 bg-slate-50 text-slate-900'
                    }`}
                  >
                    {/* Screen 1: Customer Dashboard */}
                    {currentScreen.id === 'cust-dashboard' && (
                      <div className="space-y-4">
                        {/* Greeting bar */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                          <div>
                            <span className="text-[11px] font-mono text-slate-500 uppercase">Authenticated Client</span>
                            <h3 className="text-base font-bold text-slate-900">Welcome back, Rahul</h3>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            RK
                          </div>
                        </div>

                        {/* Loyalty Points Strip */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-amber-900">Apex Gold Member</span>
                            <p className="text-[11px] text-amber-700">320 Loyalty Points (₹160 Off Next Cut)</p>
                          </div>
                          <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-mono rounded text-[11px] font-bold">
                            Tier 2
                          </span>
                        </div>

                        {/* Active Immediate Appointment Card (Hero) */}
                        <div className="bg-white rounded-xl border-2 border-slate-900 p-4 shadow-sm space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                              Confirmed · In 3 Days
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-700">#NEX-88219</span>
                          </div>

                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">Signature Skin Fade & Beard Sculpt</h4>
                            <p className="text-xs text-slate-600">With Master Barber Marco Silva</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Date</span>
                              <span className="font-semibold text-slate-900">Oct 15, 2026</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Time</span>
                              <span className="font-semibold text-slate-900">11:15 AM (60 min)</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1">
                            <div>
                              <span className="text-slate-500 block text-[10px]">Advance Settled</span>
                              <span className="font-bold text-emerald-700">₹250 Paid</span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-500 block text-[10px]">Due at Venue</span>
                              <span className="font-bold text-slate-900">₹750 Cash/UPI</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => setSelectedScreenIndex(1)}
                              className="w-full py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 flex items-center justify-center gap-1.5"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>View Pass</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedScreenIndex(5);
                              }}
                              className="w-full py-2 bg-slate-100 text-slate-800 rounded text-xs font-semibold hover:bg-slate-200 flex items-center justify-center gap-1"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reschedule</span>
                            </button>
                          </div>
                        </div>

                        {/* Quick Action Shortcuts */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setSelectedScreenIndex(3)}
                            className="p-2.5 bg-white border border-slate-200 rounded-lg text-center hover:bg-slate-50 transition-colors"
                          >
                            <Calendar className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                            <span className="text-[11px] font-medium text-slate-800 block">All Bookings</span>
                          </button>
                          <button
                            onClick={() => setSelectedScreenIndex(6)}
                            className="p-2.5 bg-white border border-slate-200 rounded-lg text-center hover:bg-slate-50 transition-colors"
                          >
                            <CreditCard className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                            <span className="text-[11px] font-medium text-slate-800 block">Payments</span>
                          </button>
                          <button
                            onClick={() => setSelectedScreenIndex(7)}
                            className="p-2.5 bg-white border border-slate-200 rounded-lg text-center hover:bg-slate-50 transition-colors"
                          >
                            <User className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                            <span className="text-[11px] font-medium text-slate-800 block">Profile</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Screen 2: Upcoming Booking Pass */}
                    {currentScreen.id === 'cust-upcoming' && (
                      <div className="space-y-4">
                        <div className="text-center pb-2 border-b border-slate-200">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                            Confirmed Appointment Pass
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 mt-1">Apex Grooming Lounge</h3>
                          <p className="text-xs text-slate-500">Bandra West, Mumbai · Chair #03</p>
                        </div>

                        {/* Boarding Pass Ticket Body */}
                        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-4 text-center space-y-3">
                          <div className="w-36 h-36 mx-auto bg-slate-900 text-white rounded-lg flex flex-col items-center justify-center p-3">
                            <QrCode className="w-24 h-24 text-white" />
                            <span className="text-[9px] font-mono tracking-widest mt-1">SCAN AT DESK</span>
                          </div>
                          <div className="font-mono text-xs font-bold text-slate-900 bg-slate-100 py-1 px-3 rounded inline-block">
                            PASS-TOKEN: NEX-88219-MARCO
                          </div>

                          <div className="border-t border-slate-100 pt-3 text-left space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Service:</span>
                              <span className="font-semibold text-slate-900">Signature Skin Fade</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Specialist:</span>
                              <span className="font-semibold text-slate-900">Marco Silva (Master Barber)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Date & Slot:</span>
                              <span className="font-semibold text-slate-900">Thu, Oct 15 @ 11:15 AM</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Advance Paid:</span>
                              <span className="font-bold text-emerald-700">₹250 (UPI Ref #99482)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Remaining Due:</span>
                              <span className="font-bold text-slate-900">₹750 at salon</span>
                            </div>
                          </div>
                        </div>

                        {/* Location Directions */}
                        <div className="bg-slate-100 p-3 rounded-lg flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-600" />
                            <span>Plot 42, Linking Road, Bandra West</span>
                          </div>
                          <button className="text-xs font-semibold text-blue-600 hover:underline">Directions</button>
                        </div>

                        {/* Bottom Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedScreenIndex(5)}
                            className="py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                          >
                            Reschedule Slot
                          </button>
                          <button
                            onClick={() => setSelectedScreenIndex(4)}
                            className="py-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100"
                          >
                            Cancel Booking
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Screen 3: Booking Details Receipt */}
                    {currentScreen.id === 'cust-details' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500">TAX INVOICE & RECEIPT</span>
                            <h3 className="text-base font-bold text-slate-900">Booking #NEX-88219</h3>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                            Confirmed
                          </span>
                        </div>

                        {/* Lifecycle Timeline */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Booking Lifecycle Timeline
                          </span>
                          <div className="flex items-center justify-between text-[11px] font-medium text-slate-700">
                            <span className="text-emerald-700 font-bold">1. Reserved</span>
                            <span>→</span>
                            <span className="text-emerald-700 font-bold">2. Advance (₹250)</span>
                            <span>→</span>
                            <span className="text-slate-400">3. Chair Check-in</span>
                            <span>→</span>
                            <span className="text-slate-400">4. Complete</span>
                          </div>
                        </div>

                        {/* Tax & Financial Breakdown */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Itemized Charges Breakdown
                          </span>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span>Signature Skin Fade & Beard Sculpt</span>
                            <span className="font-mono">₹847.46</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                            <span>CGST (9%) + SGST (9%)</span>
                            <span className="font-mono">₹152.54</span>
                          </div>
                          <div className="flex justify-between py-1 font-bold text-slate-900">
                            <span>Total Booking Amount</span>
                            <span className="font-mono">₹1,000.00</span>
                          </div>
                          <div className="flex justify-between py-1 text-emerald-700 font-semibold bg-emerald-50 px-2 rounded">
                            <span>Advance Paid (25% via UPI)</span>
                            <span className="font-mono">- ₹250.00</span>
                          </div>
                          <div className="flex justify-between py-1 font-bold text-slate-900 bg-slate-100 px-2 rounded">
                            <span>Remaining Due at Salon</span>
                            <span className="font-mono">₹750.00</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <button className="w-full py-2 bg-slate-900 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Download PDF Tax Invoice</span>
                          </button>
                          <button
                            onClick={() => setSelectedScreenIndex(0)}
                            className="w-full py-2 bg-slate-100 text-slate-800 rounded text-xs font-semibold hover:bg-slate-200"
                          >
                            Return to Dashboard
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Screen 4: Booking History */}
                    {currentScreen.id === 'cust-history' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <h3 className="text-base font-bold text-slate-900">My Bookings</h3>
                          <span className="text-xs text-slate-500">6 Total Records</span>
                        </div>

                        {/* Tabs Bar */}
                        <div className="flex gap-1 bg-slate-200 p-1 rounded-lg text-xs font-medium">
                          {(['Upcoming', 'Completed', 'Cancelled', 'Pending'] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setBookingsFilter(tab)}
                              className={`flex-1 py-1 text-center rounded transition-all ${
                                bookingsFilter === tab
                                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>

                        {/* Mini Cards */}
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {filteredBookings.map((b) => (
                            <div
                              key={b.id}
                              className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1.5 shadow-sm"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-mono font-bold text-slate-900">{b.bookingCode}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    b.status === 'Confirmed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : b.status === 'Completed'
                                      ? 'bg-slate-100 text-slate-700'
                                      : b.status === 'Payment Pending'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </div>
                              <div className="font-semibold text-slate-800">{b.serviceName}</div>
                              <div className="text-slate-500 text-[11px]">
                                {b.staffName} · {b.date} at {b.time}
                              </div>
                              <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[11px]">
                                <span>
                                  Total: <strong className="text-slate-900">₹{b.totalAmount}</strong> (Adv: ₹{b.advancePaid})
                                </span>
                                <button
                                  onClick={() => setSelectedScreenIndex(2)}
                                  className="text-blue-600 font-semibold hover:underline"
                                >
                                  Details →
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Screen 5: Cancel Booking */}
                    {currentScreen.id === 'cust-cancel' && (
                      <div className="space-y-4">
                        <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-start gap-2.5">
                          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <span className="font-bold text-rose-900 block">Cancel Appointment Confirmation</span>
                            <p className="text-rose-700 mt-0.5">
                              Are you sure you want to cancel your session for Oct 15, 11:15 AM?
                            </p>
                          </div>
                        </div>

                        {/* Booking Summary Card */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                          <span className="text-[10px] font-mono text-slate-500">APPOINTMENT #NEX-88219</span>
                          <div className="font-bold text-slate-900">Signature Skin Fade & Beard Sculpt</div>
                          <div className="text-slate-600">Marco Silva · Thu, Oct 15 @ 11:15 AM</div>
                        </div>

                        {/* Refund Policy Ledger */}
                        <div className="bg-slate-100 p-3 rounded-lg text-xs space-y-2 border border-slate-200">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Advance Paid:</span>
                            <span className="font-bold text-slate-900">₹250.00</span>
                          </div>
                          <div className="flex justify-between text-emerald-700 font-semibold">
                            <span>Eligible Refund (&gt;4 hrs notice):</span>
                            <span>₹250.00 (100%)</span>
                          </div>
                          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                            Refund will credit your UPI handle within 24-48 hours.
                          </div>
                        </div>

                        {/* Reason Selector */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">Reason for Cancellation</label>
                          <select className="w-full text-xs p-2 rounded border border-slate-300 bg-white">
                            <option>Schedule conflict</option>
                            <option>Health / feeling unwell</option>
                            <option>Stylist change preference</option>
                            <option>Other personal reasons</option>
                          </select>
                        </div>

                        {/* Alternatives */}
                        <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-lg text-xs flex items-center justify-between">
                          <span className="text-blue-900 font-medium">Keep your ₹250 advance deposit:</span>
                          <button
                            onClick={() => setSelectedScreenIndex(5)}
                            className="font-bold text-blue-700 underline text-[11px]"
                          >
                            Reschedule Instead
                          </button>
                        </div>

                        {/* Destructive Confirm Button */}
                        <div className="space-y-2 pt-1">
                          <button
                            onClick={() => {
                              setSelectedStateId('cancelled');
                              setActiveTab('states');
                            }}
                            className="w-full py-2.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
                          >
                            Confirm Cancellation
                          </button>
                          <button
                            onClick={() => setSelectedScreenIndex(0)}
                            className="w-full py-2 bg-slate-100 text-slate-700 rounded text-xs font-semibold hover:bg-slate-200"
                          >
                            Nevermind, Keep Appointment
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Screen 6: Reschedule Booking */}
                    {currentScreen.id === 'cust-reschedule' && (
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-slate-200">
                          <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
                            Zero Penalty Reschedule
                          </span>
                          <h3 className="text-base font-bold text-slate-900">Select New Date & Time Slot</h3>
                          <p className="text-xs text-slate-500">
                            Current: Oct 15, 11:15 AM · ₹250 Advance Transfers Automatically
                          </p>
                        </div>

                        {/* Date selection strip */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-700 block">Available Dates (October)</span>
                          <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                            {[
                              { day: 'Fri', dt: 'Oct 16', avail: true },
                              { day: 'Sat', dt: 'Oct 17', avail: true, sel: true },
                              { day: 'Sun', dt: 'Oct 18', avail: false },
                              { day: 'Mon', dt: 'Oct 19', avail: true }
                            ].map((d, i) => (
                              <div
                                key={i}
                                className={`p-2 rounded border transition-all ${
                                  d.sel
                                    ? 'bg-slate-900 text-white font-bold border-slate-900'
                                    : d.avail
                                    ? 'bg-white border-slate-200 hover:border-slate-400'
                                    : 'bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed'
                                }`}
                              >
                                <span className="block text-[10px] opacity-75">{d.day}</span>
                                <span className="font-semibold">{d.dt}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Time slots */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-700 block">
                            Available Time Slots with Marco Silva
                          </span>
                          <div className="grid grid-cols-3 gap-1.5 text-xs">
                            {['10:00 AM', '11:45 AM', '02:15 PM', '04:00 PM', '05:30 PM', '06:45 PM'].map((slot, i) => (
                              <div
                                key={i}
                                className={`p-2 text-center rounded border font-mono ${
                                  i === 1
                                    ? 'bg-slate-900 text-white font-bold border-slate-900'
                                    : 'bg-white border-slate-200 hover:border-slate-400'
                                }`}
                              >
                                {slot}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Reassurance Banner */}
                        <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Advance deposit of ₹250 remains 100% applied to this new slot.</span>
                        </div>

                        {/* Confirm Reschedule Button */}
                        <div className="space-y-2 pt-1">
                          <button
                            onClick={() => {
                              setSelectedStateId('success');
                              setActiveTab('states');
                            }}
                            className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                          >
                            Confirm Reschedule to Oct 17, 11:45 AM
                          </button>
                          <button
                            onClick={() => setSelectedScreenIndex(0)}
                            className="w-full py-2 bg-slate-100 text-slate-700 rounded text-xs font-semibold hover:bg-slate-200"
                          >
                            Keep Original Time
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Screen 7: Payment Status */}
                    {currentScreen.id === 'cust-payment-status' && (
                      <div className="space-y-4">
                        <div className="text-center pb-2 border-b border-slate-200">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-1">
                            <Check className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
                            Transaction Verified
                          </span>
                          <h3 className="text-base font-bold text-slate-900">Advance Deposit Paid</h3>
                          <div className="text-xl font-mono font-bold text-slate-900 mt-1">₹250.00</div>
                        </div>

                        {/* Transaction Ledger */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Transaction ID:</span>
                            <span className="font-mono font-bold text-slate-800">TXN-UPI-99482910</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Payment Channel:</span>
                            <span className="font-medium text-slate-800">Google Pay (UPI)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Timestamp:</span>
                            <span className="font-mono text-slate-800">Oct 12, 2026 09:30 AM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Booking Reference:</span>
                            <span className="font-mono font-bold text-slate-900">#NEX-88219</span>
                          </div>
                        </div>

                        {/* Balance Venue Note */}
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs space-y-1">
                          <div className="font-bold text-amber-900">Remaining Balance: ₹750.00</div>
                          <p className="text-[11px] text-amber-800">
                            Payable at salon reception upon completion of service via Cash, Card, or UPI scanner.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <button className="w-full py-2 bg-slate-900 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Download Receipt</span>
                          </button>
                          <button
                            onClick={() => setSelectedScreenIndex(1)}
                            className="w-full py-2 bg-slate-100 text-slate-800 rounded text-xs font-semibold hover:bg-slate-200"
                          >
                            View Active Pass
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Screen 8: Profile */}
                    {currentScreen.id === 'cust-profile' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                          <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                            RK
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Rahul Kapoor</h3>
                            <span className="text-xs text-slate-500">+91 98200 12345 · rahul@example.com</span>
                          </div>
                        </div>

                        {/* Personal Contact Info */}
                        <div className="space-y-2 text-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Contact Details
                          </span>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Full Name</label>
                            <input
                              type="text"
                              defaultValue="Rahul Kapoor"
                              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 block">Mobile Number (SMS & WhatsApp)</label>
                            <input
                              type="text"
                              defaultValue="+91 98200 12345"
                              className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
                            />
                          </div>
                        </div>

                        {/* Styling Notes & Allergies */}
                        <div className="space-y-1 text-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Styling Preferences & Notes
                          </span>
                          <textarea
                            defaultValue="Low skin fade on sides, textured top. Mild sensitive scalp (use sulfate-free shampoo)."
                            rows={2}
                            className="w-full p-2 text-xs rounded border border-slate-300 bg-white"
                          />
                        </div>

                        {/* Notification Channels */}
                        <div className="bg-slate-100 p-3 rounded-lg text-xs space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Alert Preferences
                          </span>
                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-slate-700">WhatsApp QR Pass & Updates</span>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </label>
                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-slate-700">SMS Appointment Reminders</span>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </label>
                        </div>

                        <button className="w-full py-2.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800">
                          Save Profile Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MY BOOKINGS HUB (4 NAVIGATION TABS & BOOKING CARD FIELDS) */}
      {activeTab === 'my-bookings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono text-emerald-700 font-bold uppercase">
                  My Bookings Specification
                </span>
                <h2 className="text-xl font-bold text-slate-900">Unified 4-Tab Customer Ledger</h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Specification requiring each booking card to strictly display: Booking ID, Service, Staff, Date, Time, 
                  Amount, Advance Paid, Remaining, and Status.
                </p>
              </div>

              {/* 4 Navigation Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                {(['Upcoming', 'Completed', 'Cancelled', 'Pending'] as const).map((tab) => {
                  const count = MOCK_CUSTOMER_BOOKINGS.filter((b) => {
                    if (tab === 'Upcoming') return b.status === 'Confirmed';
                    if (tab === 'Completed') return b.status === 'Completed';
                    if (tab === 'Cancelled') return b.status === 'Cancelled';
                    if (tab === 'Pending') return b.status === 'Payment Pending';
                    return true;
                  }).length;

                  return (
                    <button
                      key={tab}
                      onClick={() => setBookingsFilter(tab)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        bookingsFilter === tab
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      <span>{tab}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          bookingsFilter === tab ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field Schema Verification Checklist */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Card Field Requirements Checklist (All 9 Displayed on Every Card)
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 text-[11px] font-mono">
                <span className="bg-white border border-slate-200 px-2 py-1 rounded text-emerald-800 font-semibold">
                  ✓ Booking ID
                </span>
                <span className="bg-white border border-slate-200 px-2 py-1 rounded text-emerald-800 font-semibold">
                  ✓ Service
                </span>
                <span className="bg-white border border-slate-200 px-2 py-1 rounded text-emerald-800 font-semibold">
                  ✓ Staff
                </span>
                <span className="bg-white border border-slate-200 px-2 py-1 rounded text-emerald-800 font-semibold">
                  ✓ Date
                </span>
                <span className="bg-white border border-slate-200 px-2 py-1 rounded text-emerald-800 font-semibold">
                  ✓ Time
                </span>
                <span className="bg-white border border-slate-200 px-2 py-1 rounded text-emerald-800 font-semibold">
                  ✓ Amount
                </span>
                <span className="bg-white border border-slate-200 px-2 py-1 rounded text-emerald-800 font-semibold">
                  ✓ Advance Paid
                </span>
                <span className="bg-white border border-slate-200 px-2 py-1 rounded text-emerald-800 font-semibold">
                  ✓ Remaining
                </span>
                <span className="bg-white border border-slate-200 px-2 py-1 rounded text-emerald-800 font-semibold">
                  ✓ Status
                </span>
              </div>
            </div>

            {/* Render Filtered Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm hover:shadow transition-all space-y-4"
                >
                  {/* Top Bar: Booking ID & Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">ID:</span>
                      <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {b.bookingCode}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : b.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : b.status === 'Payment Pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* Core Service & Staff Metadata */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Service</span>
                    <h3 className="text-base font-bold text-slate-900">{b.serviceName}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                      <span className="text-slate-400">Staff:</span>
                      <span className="font-medium text-slate-800">{b.staffName}</span>
                      <span className="text-slate-400">({b.staffRole})</span>
                    </div>
                  </div>

                  {/* Date & Time Slot Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Scheduled Date</span>
                      <span className="font-semibold text-slate-900">{b.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Scheduled Time</span>
                      <span className="font-semibold text-slate-900">{b.time}</span>
                    </div>
                  </div>

                  {/* Financial 3-Pillar Ledger: Amount, Advance Paid, Remaining */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-900 text-white p-3 rounded-lg text-xs font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Total Amount</span>
                      <span className="font-bold text-sm">₹{b.totalAmount}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-emerald-400 uppercase block">Advance Paid</span>
                      <span className="font-bold text-sm text-emerald-300">₹{b.advancePaid}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-amber-400 uppercase block">Remaining</span>
                      <span className="font-bold text-sm text-amber-300">₹{b.remainingAmount}</span>
                    </div>
                  </div>

                  {/* Card Contextual Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => {
                        setSelectedScreenIndex(2); // Jump to Details screen
                        setActiveTab('screens');
                      }}
                      className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Full Receipt</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {b.canReschedule && (
                        <button
                          onClick={() => {
                            setSelectedScreenIndex(5); // Jump to Reschedule screen
                            setActiveTab('screens');
                          }}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-semibold text-[11px]"
                        >
                          Reschedule
                        </button>
                      )}
                      {b.canCancel && (
                        <button
                          onClick={() => {
                            setSelectedScreenIndex(4); // Jump to Cancel screen
                            setActiveTab('screens');
                          }}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded font-semibold text-[11px]"
                        >
                          Cancel
                        </button>
                      )}
                      {b.status === 'Completed' && (
                        <button
                          onClick={() => {
                            setSelectedScreenIndex(0);
                            setActiveTab('screens');
                          }}
                          className="px-2.5 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded font-semibold text-[11px]"
                        >
                          Rebook Cut
                        </button>
                      )}
                      {b.status === 'Payment Pending' && (
                        <button
                          onClick={() => {
                            setSelectedScreenIndex(6); // Payment status screen
                            setActiveTab('screens');
                          }}
                          className="px-2.5 py-1 bg-amber-500 text-white hover:bg-amber-600 rounded font-semibold text-[11px]"
                        >
                          Pay Advance
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 8 UI STATES SIMULATOR */}
      {activeTab === 'states' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-mono text-emerald-700 font-bold uppercase">
                Customer Experience UI States (All 8 Required)
              </span>
              <h2 className="text-xl font-bold text-slate-900">State Matrix & Visual Simulator</h2>
              <p className="text-xs text-slate-600 mt-1">
                Test and inspect the visual design specifications for Loading, Empty, Success, Error, 
                Cancelled, Payment Pending, Confirmed, and Completed states.
              </p>
            </div>

            {/* State Picker Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
              {UI_STATES_8.map((st) => (
                <button
                  key={st.stateId}
                  onClick={() => setSelectedStateId(st.stateId)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    selectedStateId === st.stateId
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="font-mono text-[10px] block opacity-75">{st.stateId.toUpperCase()}</span>
                  <span className="truncate block font-medium mt-0.5">{st.stateName.replace(' State', '')}</span>
                </button>
              ))}
            </div>

            {/* Selected State Specifications */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-slate-100">
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${currentState.badgeColor}`}>
                    {currentState.stateName}
                  </span>
                  <span className="font-mono text-xs text-slate-400">ID: {currentState.stateId}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Trigger Condition & Description
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{currentState.description}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Visual Design Specification
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono text-[11px]">
                    {currentState.visualSpec}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Interactive Actions Available
                  </span>
                  <p className="text-xs text-slate-700 font-semibold">{currentState.actionAvailable}</p>
                </div>
              </div>

              {/* Right 7 Cols: State Live UI Preview */}
              <div className="lg:col-span-7 bg-slate-100 rounded-xl p-6 border border-slate-200 flex items-center justify-center min-h-[320px]">
                {/* 1. Loading State */}
                {selectedStateId === 'loading' && (
                  <div className="w-full max-w-md bg-white p-5 rounded-xl border border-slate-200 space-y-3 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-slate-200 rounded w-24" />
                      <div className="h-4 bg-slate-200 rounded w-16" />
                    </div>
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-16 bg-slate-200 rounded-lg w-full" />
                    <div className="flex justify-between pt-2">
                      <div className="h-8 bg-slate-200 rounded w-28" />
                      <div className="h-8 bg-slate-200 rounded w-28" />
                    </div>
                  </div>
                )}

                {/* 2. Empty State */}
                {selectedStateId === 'empty' && (
                  <div className="text-center p-6 bg-white rounded-xl border border-slate-200 max-w-md w-full space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">No Appointments Found</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      You do not have any active appointments under this filter. Treat yourself to a fresh cut or ritual today.
                    </p>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800">
                      Book an Appointment Now
                    </button>
                  </div>
                )}

                {/* 3. Success State */}
                {selectedStateId === 'success' && (
                  <div className="text-center p-6 bg-white rounded-xl border-2 border-emerald-500 max-w-md w-full space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Appointment Successfully Rescheduled!</h3>
                    <p className="text-xs text-slate-600">
                      Your session is locked for <strong>Sat, Oct 17 @ 11:45 AM</strong>. Your ₹250 advance deposit has been
                      transferred automatically.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedScreenIndex(1);
                        setActiveTab('screens');
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                    >
                      View Digital QR Pass
                    </button>
                  </div>
                )}

                {/* 4. Error State */}
                {selectedStateId === 'error' && (
                  <div className="text-center p-6 bg-white rounded-xl border-2 border-rose-500 max-w-md w-full space-y-3">
                    <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Cancellation Window Closed</h3>
                    <p className="text-xs text-slate-600">
                      Appointments cannot be cancelled online within 4 hours of the scheduled chair time. Please call the
                      salon desk directly at +91 22 2640 1122.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button className="px-3.5 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold">
                        Call Salon Desk
                      </button>
                      <button className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded text-xs font-semibold">
                        Return
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. Cancelled State */}
                {selectedStateId === 'cancelled' && (
                  <div className="w-full max-w-md bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-slate-400">#NEX-69311</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        Cancelled
                      </span>
                    </div>
                    <div className="line-through text-slate-400 font-bold text-sm">Scalp Massage & Refresh Wash</div>
                    <div className="text-xs text-slate-500">Scheduled: Wed, Jul 15, 2026 @ 12:00 PM</div>
                    <div className="bg-rose-50 p-2.5 rounded text-xs text-rose-900">
                      ₹87 advance deposit was refunded to UPI ID rahul@oksbi on Jul 14.
                    </div>
                    <button className="w-full py-2 bg-slate-100 text-slate-800 rounded text-xs font-semibold hover:bg-slate-200">
                      Rebook This Treatment
                    </button>
                  </div>
                )}

                {/* 6. Payment Pending State */}
                {selectedStateId === 'payment_pending' && (
                  <div className="w-full max-w-md bg-white p-5 rounded-xl border-2 border-amber-400 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-slate-800">#NEX-90114</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
                        Payment Pending (09:42 left)
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">The Executive Grooming Ritual (Cut + Shave)</div>
                    <div className="text-xs text-slate-600">Chair slot held temporarily for Mon, Oct 19 @ 02:30 PM</div>
                    <div className="bg-amber-50 p-2.5 rounded text-xs text-amber-900">
                      Please settle ₹287 advance deposit to convert this reservation into a confirmed QR pass.
                    </div>
                    <button className="w-full py-2.5 bg-amber-500 text-white rounded text-xs font-bold hover:bg-amber-600 flex items-center justify-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Complete Advance (₹287 via UPI)</span>
                    </button>
                  </div>
                )}

                {/* 7. Confirmed State */}
                {selectedStateId === 'confirmed' && (
                  <div className="w-full max-w-md bg-white p-5 rounded-xl border-2 border-emerald-500 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-slate-800">#NEX-88219</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        Confirmed Pass
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">Signature Skin Fade & Beard Sculpt</div>
                    <div className="text-xs text-slate-600">Marco Silva · Thu, Oct 15, 2026 @ 11:15 AM</div>
                    <div className="flex justify-between text-xs bg-slate-50 p-2 rounded border border-slate-200 font-mono">
                      <span>Advance: ₹250 Paid</span>
                      <span>Venue Due: ₹750</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedScreenIndex(1);
                          setActiveTab('screens');
                        }}
                        className="py-2 bg-slate-900 text-white rounded text-xs font-semibold"
                      >
                        Open QR Pass
                      </button>
                      <button
                        onClick={() => {
                          setSelectedScreenIndex(5);
                          setActiveTab('screens');
                        }}
                        className="py-2 bg-slate-100 text-slate-800 rounded text-xs font-semibold"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                )}

                {/* 8. Completed State */}
                {selectedStateId === 'completed' && (
                  <div className="w-full max-w-md bg-white p-5 rounded-xl border border-slate-300 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-slate-500">#NEX-77140</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                        Completed
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">Skin Fade & Scissor Texture Cut</div>
                    <div className="text-xs text-slate-600">Marco Silva · Sat, Sep 19, 2026</div>
                    <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                      Total ₹650 settled at salon desk. Rated ★★★★★.
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-2 bg-slate-100 text-slate-800 rounded text-xs font-semibold">
                        Tax Invoice PDF
                      </button>
                      <button className="py-2 bg-slate-900 text-white rounded text-xs font-semibold">
                        Rebook Service
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: SPECIFICATION MATRIX */}
      {activeTab === 'spec-matrix' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-mono text-emerald-700 font-bold uppercase">
              Phase 2.5 Architectural Summary
            </span>
            <h2 className="text-xl font-bold text-slate-900">8 Screens Master Specification Matrix</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Exhaustive index of routes, component dependencies, layout rules, and WCAG accessibility standards.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold font-mono">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Screen Name</th>
                  <th className="py-2.5 px-3">Route</th>
                  <th className="py-2.5 px-3">Desktop Layout</th>
                  <th className="py-2.5 px-3">Mobile Layout</th>
                  <th className="py-2.5 px-3">Components Used</th>
                  <th className="py-2.5 px-3">States Handled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {CUSTOMER_SCREENS_8.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/75">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">0{s.screenNumber}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{s.name.replace(/^\d+\.\s*/, '')}</td>
                    <td className="py-2.5 px-3 font-mono text-blue-700">{s.route}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate">{s.desktopLayout}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate">{s.mobileLayout}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {s.componentsUsed.join(', ')}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-emerald-800">
                      {s.statesHandled.join(', ')}
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
