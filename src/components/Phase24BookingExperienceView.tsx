import React, { useState } from 'react';
import {
  BOOKING_STEPS_9,
  MOCK_TIME_SLOTS,
  MOCK_BOOKING_STAFF,
  DEFAULT_BOOKING_FINANCIAL_MODEL,
  BookingStepSpec,
  TimeSlotItem,
  MockBookingStaff
} from '../data/phase24BookingExperienceData';
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Zap,
  Star,
  Info,
  CreditCard,
  QrCode,
  Tag,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const Phase24BookingExperienceView: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('staff-any');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-15');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('t-1115');
  const [configurableAdvancePercent, setConfigurableAdvancePercent] = useState<number>(25);

  const activeStep = BOOKING_STEPS_9[activeStepIndex];

  // Configurable Financial Calculations
  const serviceSubtotal = 1000;
  const advanceAmount = Math.round((serviceSubtotal * configurableAdvancePercent) / 100);
  const remainingAmount = serviceSubtotal - advanceAmount;

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Phase 2.4 Active
              </span>
              <span className="text-xs text-slate-500 font-mono">Mobile-First Booking Engine Interface Design</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Nexora SalonOS: Booking Experience UI Architecture
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Strictly architectural specification for the 9-step mobile-first customer booking journey: 
              Service Selection &rarr; Package Option &rarr; Staff Selection &rarr; Date &rarr; Time Slot &rarr; Customer Details &rarr; Summary &rarr; Advance Payment &rarr; Confirmation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PHASE 2.4 COMPLETE — WAITING FOR NEXT SECTION</span>
            </div>
          </div>
        </div>

        {/* Viewport & Advance Percentage Quick Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 mt-6 pt-4 text-xs">
          {/* Step Stepper Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
            {BOOKING_STEPS_9.map((s, idx) => {
              const isActive = activeStepIndex === idx;
              const isCompleted = activeStepIndex > idx;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : isCompleted
                      ? 'bg-slate-100 text-emerald-800 hover:bg-slate-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] opacity-75 font-mono">{s.stepNumber}</span>
                  <span>{s.name.split('. ')[1]}</span>
                </button>
              );
            })}
          </div>

          {/* Viewport & Configurable Advance Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                { id: 'tablet', icon: Tablet, label: 'Tablet' },
                { id: 'desktop', icon: Monitor, label: 'Desktop' }
              ].map((vp) => {
                const Icon = vp.icon;
                const isSelected = viewportMode === vp.id;
                return (
                  <button
                    key={vp.id}
                    onClick={() => setViewportMode(vp.id as any)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                      isSelected ? 'bg-white shadow-xs font-semibold text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{vp.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Advance Deposit % Selector (Showing it is configurable!) */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
              <span className="text-[11px] text-slate-500 font-medium">Tenant Advance:</span>
              <select
                value={configurableAdvancePercent}
                onChange={(e) => setConfigurableAdvancePercent(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded text-xs px-1.5 py-0.5 font-semibold text-slate-900"
              >
                <option value={10}>10% Advance</option>
                <option value={20}>20% Advance</option>
                <option value={25}>25% Advance (Default)</option>
                <option value={50}>50% Advance</option>
                <option value={100}>100% Full Payment</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Screen Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Simulated Device Canvas (Interactive Mobile-First Preview) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2 px-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Interactive UI Preview ({viewportMode.toUpperCase()})</span>
            <span className="font-mono text-[11px]">Step {activeStepIndex + 1} of 9</span>
          </div>

          <div
            className={`bg-white border border-slate-300 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
              viewportMode === 'mobile'
                ? 'w-[375px] min-h-[640px]'
                : viewportMode === 'tablet'
                ? 'w-[520px] min-h-[640px]'
                : 'w-full min-h-[640px]'
            }`}
          >
            {/* Simulated Smartphone Status Bar / App Header */}
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  aria-label="Previous Step"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-semibold truncate">Apex Grooming Lounge</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Step {activeStep.stepNumber}/9</span>
            </div>

            {/* Progress Stepper Bar */}
            <div className="w-full bg-slate-100 h-1">
              <div
                className="bg-blue-600 h-1 transition-all duration-300"
                style={{ width: `${((activeStepIndex + 1) / 9) * 100}%` }}
              />
            </div>

            {/* Simulated Step Body */}
            <div className="p-4 space-y-4 max-h-[540px] overflow-y-auto">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700">
                  {activeStep.name}
                </span>
                <h3 className="font-bold text-slate-900 text-base leading-tight mt-0.5">
                  {activeStep.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeStep.subtitle}
                </p>
              </div>

              {/* STEP 1: SELECT SERVICE */}
              {activeStepIndex === 0 && (
                <div className="space-y-2.5">
                  {[
                    { id: 's-fade', title: 'Signature Skin Fade & Scissor Cut', duration: '35 mins', price: 650, isPopular: true, desc: 'Precision clipper taper with hot lather razor line finish.' },
                    { id: 's-shave', title: 'Traditional Hot Towel Straight Razor Shave', duration: '30 mins', price: 450, isPopular: false, desc: 'Steamed towel prep with pre-shave oil and badger brush lather.' },
                    { id: 's-beard', title: 'Beard Sculpting & Lather Contour', duration: '25 mins', price: 400, isPopular: false, desc: 'Trimming, length balance, straight razor neck definition.' }
                  ].map((svc) => (
                    <div
                      key={svc.id}
                      className="p-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-white space-y-2 cursor-pointer transition-colors"
                      onClick={() => setActiveStepIndex(1)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-sm">{svc.title}</span>
                        {svc.isPopular && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{svc.desc}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{svc.duration}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 font-mono">₹{svc.price}</span>
                          <span className="text-[10px] text-emerald-700 block">
                            ₹{Math.round((svc.price * configurableAdvancePercent) / 100)} advance ({configurableAdvancePercent}%)
                          </span>
                        </div>
                      </div>
                      <button className="w-full mt-1 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold">
                        Select Service
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 2: SELECT PACKAGE (OPTIONAL) */}
              {activeStepIndex === 1 && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                    <div>
                      <strong className="block font-semibold">Single Service Selected: Skin Fade</strong>
                      <span className="text-[11px] text-amber-800">Upgrade to a bundle to save ₹350 or proceed directly.</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border-2 border-slate-900 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 text-sm">The Executive Grooming Ritual</strong>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Save ₹350</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                      <li>Signature Skin Fade & Styling</li>
                      <li>Hot Towel Straight Razor Shave</li>
                      <li>Eucalyptus Scalp Tension Massage</li>
                    </ul>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-mono">
                      <span className="text-slate-500">75 mins combined</span>
                      <div>
                        <span className="font-bold text-slate-900 text-sm">₹1,150 </span>
                        <span className="text-slate-400 line-through text-[11px]">₹1,500</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveStepIndex(2)}
                      className="w-full py-2 bg-blue-600 text-white rounded text-xs font-bold"
                    >
                      Upgrade to Bundle
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveStepIndex(2)}
                    className="w-full py-2 text-slate-600 hover:text-slate-900 text-xs font-medium border border-slate-200 rounded"
                  >
                    Skip to Specialist (Keep Single Service) &rarr;
                  </button>
                </div>
              )}

              {/* STEP 3: SELECT STAFF */}
              {activeStepIndex === 2 && (
                <div className="space-y-2.5">
                  {MOCK_BOOKING_STAFF.map((staff) => {
                    const isSelected = selectedStaffId === staff.id;
                    return (
                      <div
                        key={staff.id}
                        onClick={() => setSelectedStaffId(staff.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {staff.id === 'staff-any' ? (
                              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                                <Zap className="w-4 h-4 fill-slate-900" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                                {staff.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                            )}
                            <div>
                              <strong className="block text-xs font-semibold">{staff.name}</strong>
                              <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                {staff.role}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[11px]">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{staff.rating}</span>
                          </div>
                        </div>

                        <p className={`text-[11px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                          {staff.specialization}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/20 text-[10px]">
                          <span className={staff.isAvailableToday ? 'text-emerald-400' : 'text-slate-400'}>
                            ● {staff.isAvailableToday ? 'Available Today' : 'Off Duty Today'}
                          </span>
                          <span className={isSelected ? 'text-slate-200' : 'text-slate-500 font-mono'}>
                            Next: {staff.nextSlotTime}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => setActiveStepIndex(3)}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold mt-2"
                  >
                    Confirm Specialist &amp; Continue &rarr;
                  </button>
                </div>
              )}

              {/* STEP 4: SELECT DATE */}
              {activeStepIndex === 3 && (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-900 block mb-2">October 2026</span>
                    <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px]">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
                        <span key={idx} className="text-slate-400 font-bold">{d}</span>
                      ))}
                      {[
                        { day: 12, status: 'Past' },
                        { day: 13, status: 'Past' },
                        { day: 14, status: 'Past' },
                        { day: 15, status: 'Selected' },
                        { day: 16, status: 'Available' },
                        { day: 17, status: 'Available' },
                        { day: 18, status: 'Available' },
                        { day: 19, status: 'Unavailable' },
                        { day: 20, status: 'Available' },
                        { day: 21, status: 'Available' }
                      ].map((item) => {
                        const isSel = item.day === 15;
                        return (
                          <button
                            key={item.day}
                            disabled={item.status === 'Past' || item.status === 'Unavailable'}
                            onClick={() => setSelectedDate(`2026-10-${item.day}`)}
                            className={`py-2 rounded text-xs transition-colors ${
                              isSel
                                ? 'bg-slate-900 text-white font-bold'
                                : item.status === 'Available'
                                ? 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200'
                                : 'text-slate-300 line-through cursor-not-allowed'
                            }`}
                          >
                            {item.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center justify-between">
                    <span>Selected Date:</span>
                    <strong className="font-mono text-slate-900">Thursday, Oct 15, 2026</strong>
                  </div>

                  <button
                    onClick={() => setActiveStepIndex(4)}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
                  >
                    Confirm Date &rarr; Select Time Slot
                  </button>
                </div>
              )}

              {/* STEP 5: SELECT TIME */}
              {activeStepIndex === 4 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Morning (9 AM – 12 PM)</span>
                    <div className="grid grid-cols-3 gap-2">
                      {MOCK_TIME_SLOTS.filter((s) => s.period === 'Morning').map((slot) => {
                        const isSel = selectedSlotId === slot.id;
                        return (
                          <button
                            key={slot.id}
                            disabled={slot.status === 'Booked' || slot.status === 'Past'}
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`py-2 px-1 text-center text-xs font-mono rounded border transition-colors ${
                              isSel
                                ? 'bg-slate-900 text-white font-bold border-slate-900'
                                : slot.status === 'Available'
                                ? 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                                : 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Afternoon (12 PM – 5 PM)</span>
                    <div className="grid grid-cols-3 gap-2">
                      {MOCK_TIME_SLOTS.filter((s) => s.period === 'Afternoon').map((slot) => {
                        const isSel = selectedSlotId === slot.id;
                        return (
                          <button
                            key={slot.id}
                            disabled={slot.status === 'Booked' || slot.status === 'Past'}
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`py-2 px-1 text-center text-xs font-mono rounded border transition-colors ${
                              isSel
                                ? 'bg-slate-900 text-white font-bold border-slate-900'
                                : slot.status === 'Available'
                                ? 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                                : 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveStepIndex(5)}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
                  >
                    Confirm Time (11:15 AM) &rarr; Contact Info
                  </button>
                </div>
              )}

              {/* STEP 6: CUSTOMER DETAILS */}
              {activeStepIndex === 5 && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Rahul Sharma"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Mobile Number (For Pass & SMS)</label>
                    <div className="flex gap-1.5">
                      <span className="px-2.5 py-2 bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-700">+91</span>
                      <input
                        type="tel"
                        defaultValue="9876543210"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
                        placeholder="10-digit mobile"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Optional Notes for Stylist</label>
                    <textarea
                      rows={2}
                      defaultValue="Prefer low skin fade with scissors on top."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      placeholder="Any preferences or scalp sensitivities..."
                    />
                  </div>

                  <button
                    onClick={() => setActiveStepIndex(6)}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
                  >
                    Review Summary &rarr;
                  </button>
                </div>
              )}

              {/* STEP 7: BOOKING SUMMARY & FINANCIAL BREAKDOWN */}
              {activeStepIndex === 6 && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Business:</span>
                      <strong className="text-slate-900">Apex Grooming Lounge</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Service:</span>
                      <strong className="text-slate-900">Skin Fade & Beard Sculpt</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Specialist:</span>
                      <strong className="text-slate-900">Marco Silva</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Date & Time:</span>
                      <strong className="text-slate-900 font-mono">Thu, Oct 15 · 11:15 AM</strong>
                    </div>

                    {/* Financial Ledger Section */}
                    <div className="pt-1 space-y-1.5 font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>Treatment Subtotal:</span>
                        <span>₹{serviceSubtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-2 rounded border border-emerald-200">
                        <span>Advance Payable Now ({configurableAdvancePercent}%):</span>
                        <span>₹{advanceAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px] pt-1">
                        <span>Remaining Balance at Salon:</span>
                        <span>₹{remainingAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-start gap-1.5 p-2 bg-blue-50/60 rounded border border-blue-200 text-blue-900">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-700" />
                    <span>Free rescheduling up to 4 hours before your start time.</span>
                  </div>

                  <button
                    onClick={() => setActiveStepIndex(7)}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                  >
                    Proceed to Advance Payment (₹{advanceAmount}) &rarr;
                  </button>
                </div>
              )}

              {/* STEP 8: ADVANCE PAYMENT UI */}
              {activeStepIndex === 7 && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Advance Deposit Payable:</span>
                    <div className="text-2xl font-bold font-mono text-emerald-400">₹{advanceAmount}</div>
                    <p className="text-[10px] text-slate-300">Remaining ₹{remainingAmount} is collected in-person after service.</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-slate-700 block">Select Instant Payment Method:</span>
                    {['Google Pay / PhonePe UPI', 'Credit / Debit Card', 'Net Banking (All Indian Banks)'].map((method, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                        <span className="font-semibold text-slate-800">{method}</span>
                        <input type="radio" name="payment-method" defaultChecked={idx === 0} />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveStepIndex(8)}
                    className="w-full py-3 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-emerald-500 transition-colors"
                  >
                    Simulate Payment &amp; Confirm Booking &rarr;
                  </button>
                </div>
              )}

              {/* STEP 9: CONFIRMATION */}
              {activeStepIndex === 8 && (
                <div className="space-y-3 text-xs text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700">Booking Confirmed</span>
                    <h4 className="text-lg font-bold text-slate-900 mt-0.5">Booking #NEX-88219</h4>
                    <p className="text-slate-500 text-[11px]">SMS & WhatsApp confirmation pass delivered to +91 9876543210.</p>
                  </div>

                  {/* Boarding Pass Box */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2 font-mono text-xs">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Service:</span>
                      <strong className="text-slate-900">Skin Fade & Shave</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Specialist:</span>
                      <strong className="text-slate-900">Marco Silva</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Schedule:</span>
                      <strong className="text-slate-900">Oct 15 · 11:15 AM</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5 text-emerald-800">
                      <span>Advance Paid:</span>
                      <strong>₹{advanceAmount}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Balance at Venue:</span>
                      <strong>₹{remainingAmount}</strong>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold">
                      View My Booking & QR Pass
                    </button>
                    <button
                      onClick={() => setActiveStepIndex(0)}
                      className="w-full py-2 text-slate-600 hover:text-slate-900 text-xs font-medium"
                    >
                      Book Another Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Architectural Specification Inspector for the Active Step */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                  Screen Specification · Step {activeStep.stepNumber} of 9
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {activeStep.title}
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                ID: {activeStep.id}
              </span>
            </div>

            {/* Purpose */}
            <div>
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">Purpose</h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                {activeStep.purpose}
              </p>
            </div>

            {/* Components Used */}
            <div>
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                Component Mapping
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeStep.componentsUsed.map((comp) => (
                  <span key={comp} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-mono">
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Responsive Layout Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-semibold">Desktop Layout (1024px and above)</strong>
                <p className="text-slate-600 text-[11px]">{activeStep.desktopLayout}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-semibold">Mobile Behavior (360px+)</strong>
                <p className="text-slate-600 text-[11px]">{activeStep.mobileLayout}</p>
              </div>
            </div>

            {/* Interactive States */}
            <div>
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                Documented States
              </h4>
              <div className="space-y-1.5 text-xs">
                {activeStep.states.map((st) => (
                  <div key={st.stateName} className="p-2 rounded bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900">{st.stateName}:</strong>{' '}
                    <span className="text-slate-600">{st.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error, Empty & Loading States */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <h4 className="font-semibold text-slate-900 uppercase text-[10px] tracking-wider">
                Edge State Handling
              </h4>
              <div className="space-y-1 text-slate-700">
                <p>
                  <strong className="text-red-700">Error State: </strong>
                  {activeStep.errorState}
                </p>
                <p>
                  <strong className="text-amber-800">Empty State: </strong>
                  {activeStep.emptyState}
                </p>
                <p>
                  <strong className="text-blue-700">Loading State: </strong>
                  {activeStep.loadingState}
                </p>
              </div>
            </div>

            {/* Financial Configuration Rule Notice */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Configurable Advance Rule Architecture:</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                The advance percentage is governed by the tenant property <code className="font-mono font-bold">tenantAdvancePercentage</code> (default: 25%). 
                The UI never hardcodes 25%; it dynamically calculates <code className="font-mono">advance = (subtotal * tenantAdvancePercentage) / 100</code> and <code className="font-mono">remaining = subtotal - advance</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
