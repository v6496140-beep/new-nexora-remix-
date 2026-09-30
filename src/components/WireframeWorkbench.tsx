import React, { useState } from 'react';
import { SALON_CATEGORIES, SalonCategorySpec } from '../data/productArchitectureData';
import {
  Smartphone,
  Tablet,
  Monitor,
  Calendar,
  Clock,
  User,
  Shield,
  Layers,
  ArrowRight,
  Check,
  Info,
  ChevronDown,
  X,
  ExternalLink,
} from 'lucide-react';

export const WireframeWorkbench: React.FC = () => {
  const [activeWireframe, setActiveWireframe] = useState<
    'public-site' | 'booking-flow' | 'onboarding' | 'builder' | 'admin-dash' | 'staff-commission' | 'super-admin'
  >('public-site');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('barber');
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);

  const currentCategory =
    SALON_CATEGORIES.find((c) => c.slug === selectedCategorySlug) || SALON_CATEGORIES[0];

  const wireframeTabs = [
    { id: 'public-site', label: '1. Public Business Website' },
    { id: 'booking-flow', label: '2. Booking Experience' },
    { id: 'onboarding', label: '3. Business Onboarding' },
    { id: 'builder', label: '4. Website Builder' },
    { id: 'admin-dash', label: '5. Business Admin Dashboard' },
    { id: 'staff-commission', label: '6. Staff & Commission Ledger' },
    { id: 'super-admin', label: '7. Platform Super Admin' },
  ];

  return (
    <div className="space-y-6">
      {/* Control Bar: Wireframe Selector, Category switcher, Viewport switcher & Annotations */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
              <span>Low-Fidelity Blueprint Studio</span>
              <span aria-hidden="true">·</span>
              <span>Monochrome Wireframe Spec</span>
              <span aria-hidden="true">·</span>
              <span>Slot-Based Responsive Geometry</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Interactive Wireframe Workbench
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Switcher (for shared template demonstration) */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Category:</span>
              <select
                value={selectedCategorySlug}
                onChange={(e) => setSelectedCategorySlug(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded px-2.5 py-1.5 font-medium focus:ring-1 focus:ring-slate-900"
              >
                {SALON_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.defaultTemplate.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Viewport Width Controls */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
              <button
                onClick={() => setViewport('desktop')}
                title="Desktop (1440px baseline)"
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                  viewport === 'desktop'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setViewport('tablet')}
                title="Tablet (768px)"
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                  viewport === 'tablet'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setViewport('mobile')}
                title="Mobile (375px)"
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                  viewport === 'mobile'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Blueprint Annotations Toggle */}
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`px-2.5 py-1.5 rounded text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                showAnnotations
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Annotations {showAnnotations ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Wireframe Screens Sub-navigation */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
          {wireframeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveWireframe(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeWireframe === tab.id
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wireframe Canvas Container */}
      <div className="bg-slate-200/60 p-4 sm:p-8 rounded-xl border border-slate-300 min-h-[700px] flex justify-center items-start overflow-x-auto">
        <div
          className={`transition-all duration-300 bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden ${
            viewport === 'desktop'
              ? 'w-full max-w-[1180px]'
              : viewport === 'tablet'
              ? 'w-[768px]'
              : 'w-[375px]'
          }`}
        >
          {/* Browser Chrome Simulation Bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="ml-2 text-[11px] text-slate-600 hidden sm:inline">
                https://{currentCategory.sampleBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.nexorasalon.com
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              [WIREFRAME: {activeWireframe.toUpperCase()}]
            </div>
          </div>

          {/* ========================================================================= */}
          {/* WIREFRAME 1: PUBLIC BUSINESS WEBSITE */}
          {/* ========================================================================= */}
          {activeWireframe === 'public-site' && (
            <div className="divide-y divide-slate-200 text-slate-900 text-xs font-sans">
              {/* Annotation Banner */}
              {showAnnotations && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-amber-900 text-[11px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">[NOTE 1.0]</span>
                    <span>
                      Shared Template Engine binding to <strong>{currentCategory.name}</strong> category. Same navbar, hero, services, packages, and gallery slots.
                    </span>
                  </div>
                  <button
                    onClick={() => setBookingModalOpen(true)}
                    className="font-semibold underline ml-2 hover:text-amber-800"
                  >
                    Test "Book Now" Trigger →
                  </button>
                </div>
              )}

              {/* 1. Global Navigation Bar */}
              <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-slate-900 text-white rounded flex items-center justify-center font-bold text-xs">
                    {currentCategory.sampleBrand.charAt(0)}
                  </div>
                  <span className="font-bold text-sm text-slate-900 tracking-tight">
                    {currentCategory.sampleBrand}
                  </span>
                </div>

                {/* Nav Links: Home, Services, Packages, Gallery, About, Contact, My Bookings */}
                {viewport !== 'mobile' && (
                  <nav className="flex items-center gap-5 text-xs text-slate-600 font-medium">
                    <span className="text-slate-900 font-semibold cursor-pointer">Home</span>
                    <span className="cursor-pointer hover:text-slate-900">Services</span>
                    <span className="cursor-pointer hover:text-slate-900">Packages</span>
                    <span className="cursor-pointer hover:text-slate-900">Gallery</span>
                    <span className="cursor-pointer hover:text-slate-900">About</span>
                    <span className="cursor-pointer hover:text-slate-900">Contact</span>
                    <span className="cursor-pointer hover:text-slate-900">My Bookings</span>
                  </nav>
                )}

                {/* Actions: Sign In / Up + Primary CTA "Book Now" */}
                <div className="flex items-center gap-2.5">
                  {viewport !== 'mobile' && (
                    <button className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1">
                      Sign In
                    </button>
                  )}
                  <button
                    onClick={() => setBookingModalOpen(true)}
                    className="bg-slate-900 text-white px-3.5 py-1.5 rounded text-xs font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    Book Now
                  </button>
                </div>
              </header>

              {/* 2. Hero Section */}
              <section className="p-8 sm:p-12 bg-slate-50 border-b border-slate-200 relative">
                <div className="max-w-3xl space-y-4">
                  {showAnnotations && (
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      [SLOT: HeroSection · Theme: {currentCategory.themeStyle}]
                    </div>
                  )}
                  <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
                    {currentCategory.sampleBrand}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                    {currentCategory.tagline}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setBookingModalOpen(true)}
                      className="bg-slate-900 text-white px-5 py-2.5 rounded text-xs font-semibold hover:bg-slate-800"
                    >
                      Book Appointment
                    </button>
                    <button className="border border-slate-300 bg-white text-slate-700 px-4 py-2.5 rounded text-xs font-medium hover:bg-slate-50">
                      Explore {currentCategory.serviceTerminology}
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-200">
                    <span>Open Today: 9:00 AM – 8:00 PM</span>
                    <span aria-hidden="true">·</span>
                    <span>Verified Hygiene & Safety</span>
                    <span aria-hidden="true">·</span>
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </section>

              {/* 3. Services Grid Section */}
              <section className="p-8 sm:p-12 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
                  <div>
                    {showAnnotations && (
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                        [SLOT: ServicesGrid · Terminology: "{currentCategory.serviceTerminology}"]
                      </div>
                    )}
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                      Signature {currentCategory.serviceTerminology}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Select a service to reserve your specialist and scheduled time.
                    </p>
                  </div>
                  <div className="text-xs text-slate-500">
                    Showing {currentCategory.sampleServices.length} core treatments
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCategory.sampleServices.map((svc, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-lg p-5 bg-white space-y-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{svc.name}</h3>
                          <span className="text-xs text-slate-500 font-mono mt-0.5 inline-block">
                            Duration: {svc.duration}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-slate-900 text-sm shrink-0">
                          {svc.priceRange}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {svc.description}
                      </p>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <span className="text-[11px] text-slate-500">
                          Available with all {currentCategory.staffTerminology}
                        </span>
                        <button
                          onClick={() => setBookingModalOpen(true)}
                          className="bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                        >
                          Book Service
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. Packages Section */}
              <section className="p-8 sm:p-12 bg-slate-50 space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  {showAnnotations && (
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      [SLOT: PackagesShowcase · Multi-service bundles]
                    </div>
                  )}
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    Curated Experience Packages
                  </h2>
                  <p className="text-xs text-slate-500">
                    Bundled rituals providing comprehensive care with special pricing.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCategory.samplePackages.map((pkg, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-300 rounded-lg p-5 bg-white space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-slate-900">{pkg.name}</h3>
                        <span className="font-mono font-bold text-base text-slate-900">
                          {pkg.price}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        <strong>Includes:</strong> {pkg.includes}
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => setBookingModalOpen(true)}
                          className="w-full bg-slate-900 text-white py-2 rounded text-xs font-semibold hover:bg-slate-800"
                        >
                          Reserve Package
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Gallery / Lookbook Section */}
              <section className="p-8 sm:p-12 space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  {showAnnotations && (
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      [SLOT: LookbookGallery · Visual showcase]
                    </div>
                  )}
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    Studio Gallery & Client Work
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-slate-100 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-3 text-center text-slate-400 text-xs font-mono"
                    >
                      <Layers className="w-5 h-5 mb-1" />
                      <span>[Photo {i}]</span>
                      <span className="text-[10px] text-slate-500">
                        {currentCategory.name} Showcase
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. About & Philosophy */}
              <section className="p-8 sm:p-12 bg-slate-50 space-y-4">
                {showAnnotations && (
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    [SLOT: AboutSection · Philosophy & Team]
                  </div>
                )}
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  About Our Studio
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  Dedicated to excellence in modern salon care. Our team of {currentCategory.staffTerminology.toLowerCase()} holds certifications in {currentCategory.typicalQualifications.join(', ')}.
                </p>
              </section>

              {/* 7. Footer */}
              <footer className="p-8 border-t border-slate-200 bg-white text-xs text-slate-500 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-slate-900">{currentCategory.sampleBrand}</span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      Powered by Nexora SalonOS Shared Platform Engine
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span>Terms & Cancellation Policy</span>
                    <span>Privacy Policy</span>
                    <span>Health & Safety Compliance</span>
                  </div>
                </div>
              </footer>
            </div>
          )}

          {/* ========================================================================= */}
          {/* WIREFRAME 2: BOOKING EXPERIENCE FLOW (MODAL / SCREEN) */}
          {/* ========================================================================= */}
          {activeWireframe === 'booking-flow' && (
            <div className="p-6 sm:p-8 bg-slate-50 space-y-6 text-xs text-slate-900">
              {showAnnotations && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded text-amber-900 text-[11px]">
                  <strong>[NOTE 2.0 - Booking Experience Wireframe (Area E)]:</strong> 5-step conversion funnel. Holds slot lock timer (10 mins), calculates dynamic service durations, maps staff availability, and secures deposit.
                </div>
              )}

              {/* Progress Steps Header */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-medium">
                  {[
                    { num: 1, label: 'Services' },
                    { num: 2, label: 'Specialist' },
                    { num: 3, label: 'Date & Time' },
                    { num: 4, label: 'Intake / Info' },
                    { num: 5, label: 'Confirm & Pay' },
                  ].map((s) => (
                    <button
                      key={s.num}
                      onClick={() => setBookingStep(s.num)}
                      className={`p-2 rounded border text-left sm:text-center transition-colors ${
                        bookingStep === s.num
                          ? 'bg-slate-900 text-white border-slate-900'
                          : bookingStep > s.num
                          ? 'bg-slate-100 text-slate-800 border-slate-200'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      <span className="font-mono block text-[10px]">Step {s.num}</span>
                      <span className="font-semibold truncate">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step Content Container */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                {/* STEP 1: Select Service */}
                {bookingStep === 1 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Step 1: Select {currentCategory.serviceTerminology}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Choose your primary treatment and optional add-on enhancements.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {currentCategory.sampleServices.map((svc, i) => (
                        <div
                          key={i}
                          className="border border-slate-200 p-3 rounded-lg flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                        >
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-900 block">{svc.name}</span>
                            <span className="text-[11px] text-slate-500">
                              Duration: {svc.duration} · {svc.priceRange}
                            </span>
                          </div>
                          <input
                            type="radio"
                            name="selected-service"
                            defaultChecked={i === 0}
                            className="w-4 h-4 text-slate-900"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Select Specialist */}
                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Step 2: Choose Your {currentCategory.staffTerminology}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Select an accredited professional or allow the system to allocate fastest availability.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="border-2 border-slate-900 p-4 rounded-lg bg-slate-50 space-y-2 text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center mx-auto text-xs">
                          ★
                        </div>
                        <div className="font-bold text-slate-900 text-xs">Any Available Professional</div>
                        <div className="text-[11px] text-slate-500">Maximum slot flexibility</div>
                      </div>

                      <div className="border border-slate-200 p-4 rounded-lg bg-white space-y-2 text-center hover:border-slate-300">
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center mx-auto text-xs">
                          JD
                        </div>
                        <div className="font-bold text-slate-900 text-xs">Julian Vance</div>
                        <div className="text-[11px] text-slate-500">Senior Specialist · 8 yrs exp</div>
                      </div>

                      <div className="border border-slate-200 p-4 rounded-lg bg-white space-y-2 text-center hover:border-slate-300">
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center mx-auto text-xs">
                          ER
                        </div>
                        <div className="font-bold text-slate-900 text-xs">Elena Rostova</div>
                        <div className="text-[11px] text-slate-500">Lead Master · 11 yrs exp</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Date & Time */}
                {bookingStep === 3 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Step 3: Select Date & Available Time Slot
                      </h3>
                      <p className="text-xs text-slate-500">
                        Slots dynamically filtered according to staff roster and treatment duration.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="border border-slate-200 p-3 rounded-lg space-y-2">
                        <div className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>Interactive Calendar Picker</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded text-center text-slate-500 font-mono text-[11px] space-y-1">
                          <div>[October 2026]</div>
                          <div className="grid grid-cols-7 gap-1 pt-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                              <span key={i} className="text-slate-400 font-semibold">{d}</span>
                            ))}
                            {[...Array(14)].map((_, i) => (
                              <button
                                key={i}
                                className={`p-1.5 rounded ${
                                  i === 3
                                    ? 'bg-slate-900 text-white font-bold'
                                    : 'hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="border border-slate-200 p-3 rounded-lg space-y-2">
                        <div className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Available Time Slots (Selected Date)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                          {['09:30 AM', '10:45 AM', '01:15 PM', '02:30 PM', '04:00 PM', '05:15 PM'].map(
                            (time, i) => (
                              <button
                                key={i}
                                className={`p-2 rounded border text-center ${
                                  i === 1
                                    ? 'bg-slate-900 text-white font-bold border-slate-900'
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                {time}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Client Info & Category Intake */}
                {bookingStep === 4 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Step 4: Customer Details & Health Intake Form
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tailored compliance questionnaire for {currentCategory.name}.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">Full Name</label>
                        <input
                          type="text"
                          defaultValue="Jane Doe"
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-slate-50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">Phone Number (SMS confirm)</label>
                        <input
                          type="text"
                          defaultValue="+1 (555) 234-8900"
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-slate-50 font-mono"
                        />
                      </div>
                    </div>

                    <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
                      <span className="font-semibold text-slate-900 block text-[11px]">
                        Category Intake Requirements ({currentCategory.name})
                      </span>
                      <div className="space-y-1.5 text-[11px] text-slate-600">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="w-3.5 h-3.5" />
                          <span>I confirm I do not have active skin infections or contraindications.</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="w-3.5 h-3.5" />
                          <span>I agree to the 24-hour cancellation policy.</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Payment & Confirmation */}
                {bookingStep === 5 && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Step 5: Review & Reservation Lock
                      </h3>
                      <p className="text-xs text-slate-500">
                        Slot held for 09:42 minutes. Confirm booking below.
                      </p>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-2 font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Service:</span>
                        <span className="font-semibold text-slate-900">
                          {currentCategory.sampleServices[0].name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Specialist:</span>
                        <span className="font-semibold text-slate-900">Elena Rostova</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Date & Slot:</span>
                        <span className="font-semibold text-slate-900">Oct 14 · 10:45 AM (45m)</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-200">
                        <span className="text-slate-500">Estimated Total:</span>
                        <span className="font-bold text-slate-900 text-sm">$65.00</span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-[11px]">
                        <span>Deposit Required Now (Area I):</span>
                        <span className="font-bold">$20.00</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-100 rounded text-center text-slate-600 text-[11px] font-mono">
                      [PAYMENT GATEWAY INTEGRATION: Card / Apple Pay / UPI Mockup]
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <button
                    disabled={bookingStep === 1}
                    onClick={() => setBookingStep((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 border border-slate-200 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    onClick={() =>
                      setBookingStep((p) => (p === 5 ? 1 : Math.min(5, p + 1)))
                    }
                    className="px-5 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                  >
                    {bookingStep === 5 ? 'Confirm Reservation' : 'Continue to Next Step →'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* WIREFRAME 3: BUSINESS ONBOARDING WIZARD */}
          {/* ========================================================================= */}
          {activeWireframe === 'onboarding' && (
            <div className="p-6 sm:p-10 bg-slate-50 space-y-6 text-xs text-slate-900">
              {showAnnotations && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded text-amber-900 text-[11px]">
                  <strong>[NOTE 3.0 - Business Onboarding Wizard (Area B)]:</strong> 4-step wizard turning category choice into a fully populated website and salon workspace draft.
                </div>
              )}

              <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <div className="text-[11px] font-mono text-slate-500 uppercase">
                    Stage 01: Category Selection
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Select Your Business Category
                  </h3>
                  <p className="text-xs text-slate-600">
                    Nexora SalonOS will pre-seed your website, services, and compliance rules based on your selection.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {SALON_CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategorySlug(cat.slug)}
                      className={`p-3 rounded border text-center text-xs transition-all ${
                        selectedCategorySlug === cat.slug
                          ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                  <div className="font-semibold text-slate-900 text-xs">
                    Business Profile & Location Setup
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Salon / Studio Name"
                      defaultValue={currentCategory.sampleBrand}
                      className="p-2 border border-slate-200 rounded text-xs bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Subdomain (e.g. nobleblade.nexora...)"
                      defaultValue={currentCategory.sampleBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}
                      className="p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Street Address & City"
                      defaultValue="420 Boulevard Ave, Suite 102"
                      className="p-2 border border-slate-200 rounded text-xs bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Business Phone Number"
                      defaultValue="+1 (555) 789-0123"
                      className="p-2 border border-slate-200 rounded text-xs bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 border border-slate-200 rounded bg-white text-xs space-y-1">
                  <span className="font-semibold text-slate-900 block text-[11px]">
                    Auto-Seeded Catalog Items for {currentCategory.name}:
                  </span>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {currentCategory.sampleServices.map((s) => s.name).join(' · ')}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveWireframe('builder')}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded font-semibold text-xs hover:bg-slate-800"
                  >
                    Generate Website & Open Builder →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* WIREFRAME 4: WEBSITE BUILDER */}
          {/* ========================================================================= */}
          {activeWireframe === 'builder' && (
            <div className="p-6 bg-slate-100 min-h-[500px] text-xs text-slate-900 space-y-4">
              {showAnnotations && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded text-amber-900 text-[11px]">
                  <strong>[NOTE 4.0 - Website Builder (Area H)]:</strong> No-code section reordering, theme token switching, and live preview prior to publishing.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left Sidebar: Section Controls */}
                <div className="md:col-span-4 bg-white border border-slate-200 rounded-lg p-4 space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm">Website Builder</h3>
                    <span className="text-[11px] text-slate-500">
                      Editing: {currentCategory.sampleBrand}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                      Page Sections (Reorder / Toggle)
                    </span>
                    {[
                      '1. Global Navigation Bar',
                      '2. Hero Section & Tagline',
                      '3. Services Menu Grid',
                      '4. Curated Packages',
                      '5. Studio Lookbook Gallery',
                      '6. Team & Qualifications',
                      '7. Client Reviews & Trust',
                      '8. Contact & Working Hours',
                    ].map((sec, idx) => (
                      <div
                        key={idx}
                        className="p-2 border border-slate-200 rounded bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-700">{sec}</span>
                        <span className="text-slate-400 text-[10px] font-mono">Visible</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                      Theme Tokens
                    </span>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50 space-y-1 text-[11px]">
                      <div>Preset: <strong>{currentCategory.themeStyle}</strong></div>
                      <div>Font Pair: <strong>Satoshi / Plus Jakarta Sans</strong></div>
                    </div>
                  </div>

                  <button className="w-full bg-slate-900 text-white py-2 rounded font-semibold text-xs hover:bg-slate-800">
                    Publish to Live Domain
                  </button>
                </div>

                {/* Right: Live Canvas Preview */}
                <div className="md:col-span-8 bg-white border border-slate-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-[11px] text-slate-500 font-mono">
                    <span>WYSIWYG VIEWPORT PREVIEW</span>
                    <span>Status: Draft (Unpublished edits)</span>
                  </div>

                  <div className="border border-slate-200 rounded p-4 bg-slate-50 space-y-3">
                    <div className="text-lg font-bold text-slate-900">
                      {currentCategory.sampleBrand}
                    </div>
                    <div className="text-xs text-slate-600">
                      {currentCategory.tagline}
                    </div>
                    <div className="p-3 bg-white border border-dashed border-slate-300 rounded text-center text-slate-400 font-mono text-xs">
                      [Live Interactive Component Slot Canvas]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* WIREFRAME 5: BUSINESS ADMIN DASHBOARD */}
          {/* ========================================================================= */}
          {activeWireframe === 'admin-dash' && (
            <div className="p-6 bg-slate-50 space-y-6 text-xs text-slate-900">
              {showAnnotations && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded text-amber-900 text-[11px]">
                  <strong>[NOTE 5.0 - Business Admin Dashboard (Area F)]:</strong> Operational command center for owners & managers. Shows multi-chair calendar, occupancy rate, and fast walk-in check-in.
                </div>
              )}

              {/* KPI Header Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1">
                  <span className="text-[11px] text-slate-500">Today's Occupancy</span>
                  <div className="text-xl font-bold font-mono text-slate-900">84.2%</div>
                  <span className="text-[10px] text-slate-400">18 / 22 slots booked</span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1">
                  <span className="text-[11px] text-slate-500">Projected Day Revenue</span>
                  <div className="text-xl font-bold font-mono text-slate-900">$1,420.00</div>
                  <span className="text-[10px] text-slate-400">$380 online deposits</span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1">
                  <span className="text-[11px] text-slate-500">Active Staff on Shift</span>
                  <div className="text-xl font-bold font-mono text-slate-900">4 Stylists</div>
                  <span className="text-[10px] text-slate-400">All credentials verified</span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1">
                  <span className="text-[11px] text-slate-500">Average Ticket Value</span>
                  <div className="text-xl font-bold font-mono text-slate-900">$78.80</div>
                  <span className="text-[10px] text-slate-400">+12% with add-ons</span>
                </div>
              </div>

              {/* Multi-Chair Master Schedule Grid */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Daily Master Schedule</h3>
                    <span className="text-[11px] text-slate-500 font-mono">Today: Friday, Oct 14, 2026</span>
                  </div>
                  <button className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-800">
                    + Walk-in Booking
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[600px] border border-slate-200 rounded divide-y divide-slate-100 font-mono text-[11px]">
                    <div className="grid grid-cols-5 bg-slate-50 p-2 font-semibold text-slate-700">
                      <span>Time</span>
                      <span>Chair 1 (Julian)</span>
                      <span>Chair 2 (Elena)</span>
                      <span>Chair 3 (Marcus)</span>
                      <span>Room 1 (Therapy)</span>
                    </div>

                    <div className="grid grid-cols-5 p-2 items-center">
                      <span className="text-slate-400">09:00 AM</span>
                      <span className="bg-slate-200 text-slate-800 p-1.5 rounded">Jane D. (Cut)</span>
                      <span className="text-slate-300">Available</span>
                      <span className="bg-slate-200 text-slate-800 p-1.5 rounded">Bob M. (Fade)</span>
                      <span className="text-slate-300">Available</span>
                    </div>

                    <div className="grid grid-cols-5 p-2 items-center bg-slate-50/50">
                      <span className="text-slate-400">10:00 AM</span>
                      <span className="bg-slate-900 text-white p-1.5 rounded">[In Service]</span>
                      <span className="bg-slate-200 text-slate-800 p-1.5 rounded">Sarah K. (Color)</span>
                      <span className="text-slate-300">Available</span>
                      <span className="bg-slate-200 text-slate-800 p-1.5 rounded">Aura Salt Wrap</span>
                    </div>

                    <div className="grid grid-cols-5 p-2 items-center">
                      <span className="text-slate-400">11:00 AM</span>
                      <span className="text-slate-300">Available</span>
                      <span className="bg-slate-900 text-white p-1.5 rounded">[In Service]</span>
                      <span className="bg-slate-200 text-slate-800 p-1.5 rounded">Dave R. (Beard)</span>
                      <span className="text-slate-300">Cleaning Buffer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* WIREFRAME 6: STAFF & COMMISSION / QUALIFICATION LEDGER */}
          {/* ========================================================================= */}
          {activeWireframe === 'staff-commission' && (
            <div className="p-6 bg-slate-50 space-y-6 text-xs text-slate-900">
              {showAnnotations && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded text-amber-900 text-[11px]">
                  <strong>[NOTE 6.0 - Staff & Commission / Qualification Ledger (Areas G, K, L)]:</strong> Links staff credentials to service eligibility, computes commission splits, and handles TDS tax deductions.
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Staff Credentials & Qualification Tracker</h3>
                    <span className="text-[11px] text-slate-500">
                      Ensures regulatory compliance before allowing service bookings.
                    </span>
                  </div>
                  <button className="border border-slate-300 bg-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-50">
                    + Upload Certificate
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <th className="p-2">Staff Member</th>
                        <th className="p-2">Credential / License</th>
                        <th className="p-2">License #</th>
                        <th className="p-2">Expiry Date</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Unlocked Services</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-semibold">Julian Vance</td>
                        <td className="p-2">{currentCategory.typicalQualifications[0]}</td>
                        <td className="p-2 text-slate-500">LIC-98421</td>
                        <td className="p-2 text-slate-600">2027-04-15</td>
                        <td className="p-2"><span className="text-slate-900 font-bold">VERIFIED</span></td>
                        <td className="p-2 text-slate-500">All Core Services</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Elena Rostova</td>
                        <td className="p-2">{currentCategory.typicalQualifications[1] || 'Cosmetology Board'}</td>
                        <td className="p-2 text-slate-500">LIC-61902</td>
                        <td className="p-2 text-amber-700 font-bold">2026-11-01 (18 days)</td>
                        <td className="p-2"><span className="text-amber-800 font-bold">RENEWAL REQ</span></td>
                        <td className="p-2 text-slate-500">Advanced Treatments</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Commission Statement Wireframe */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-sm text-slate-900">
                    Commission & Payout Breakdown (Current Settlement Cycle)
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Formula: (Gross Services × 45%) + (Retail Sales × 10%) + 100% Client Tips - TDS Withholding
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="text-slate-500 text-[10px]">Total Service Commission</span>
                    <div className="text-base font-bold text-slate-900 mt-1">$1,890.00</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="text-slate-500 text-[10px]">Client Tips (Direct Pass-through)</span>
                    <div className="text-base font-bold text-slate-900 mt-1">$435.00</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <span className="text-slate-500 text-[10px]">TDS Tax Withheld (Area N)</span>
                    <div className="text-base font-bold text-slate-900 mt-1">-$189.00</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* WIREFRAME 7: PLATFORM SUPER ADMIN */}
          {/* ========================================================================= */}
          {activeWireframe === 'super-admin' && (
            <div className="p-6 bg-slate-50 space-y-6 text-xs text-slate-900">
              {showAnnotations && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded text-amber-900 text-[11px]">
                  <strong>[NOTE 7.0 - Platform Super Admin (Area P)]:</strong> High-level platform governance, category template engine management, and multi-tenant health telemetry.
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="bg-white border border-slate-200 p-4 rounded-lg">
                  <span className="text-[10px] text-slate-500">Total Active Tenants</span>
                  <div className="text-xl font-bold text-slate-900">1,248 Salons</div>
                  <span className="text-[10px] text-slate-400">Across 10 categories</span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-lg">
                  <span className="text-[10px] text-slate-500">Platform GMV (30 Days)</span>
                  <div className="text-xl font-bold text-slate-900">$4.18M</div>
                  <span className="text-[10px] text-slate-400">Take rate: 2.5%</span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-lg">
                  <span className="text-[10px] text-slate-500">Monthly SaaS ARR</span>
                  <div className="text-xl font-bold text-slate-900">$186,000</div>
                  <span className="text-[10px] text-slate-400">98.2% retention</span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-lg">
                  <span className="text-[10px] text-slate-500">Category Templates</span>
                  <div className="text-xl font-bold text-slate-900">10 Unified</div>
                  <span className="text-[10px] text-slate-400">Single shared engine</span>
                </div>
              </div>

              {/* Multi-Tenant Directory */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Global Tenant Registry</h3>
                    <span className="text-[11px] text-slate-500">
                      Multi-tenant isolation and subscription status monitoring.
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search tenant by name or domain..."
                    className="p-1.5 border border-slate-200 rounded text-xs bg-slate-50 w-56"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <th className="p-2">Tenant Name</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Subdomain</th>
                        <th className="p-2">Subscription</th>
                        <th className="p-2">Monthly GMV</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-semibold">The Noble Blade</td>
                        <td className="p-2">Barber</td>
                        <td className="p-2 text-slate-500">nobleblade.nexora...</td>
                        <td className="p-2">Pro Tier ($99/mo)</td>
                        <td className="p-2 font-bold">$24,200</td>
                        <td className="p-2"><span className="text-slate-900 font-bold">ACTIVE</span></td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Aura Thermal Spa</td>
                        <td className="p-2">Spa</td>
                        <td className="p-2 text-slate-500">auraspa.nexora...</td>
                        <td className="p-2">Enterprise ($249/mo)</td>
                        <td className="p-2 font-bold">$78,500</td>
                        <td className="p-2"><span className="text-slate-900 font-bold">ACTIVE</span></td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Iron & Oak Tattoo</td>
                        <td className="p-2">Tattoo Studio</td>
                        <td className="p-2 text-slate-500">ironoak.nexora...</td>
                        <td className="p-2">Pro Tier ($99/mo)</td>
                        <td className="p-2 font-bold">$38,900</td>
                        <td className="p-2"><span className="text-slate-900 font-bold">ACTIVE</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Simulated Booking Modal Trigger Overlay */}
          {bookingModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl border border-slate-300 w-full max-w-xl p-6 space-y-4 text-xs text-slate-900 relative">
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="absolute right-4 top-4 p-1 rounded hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    [Area E: Booking Modal Wireframe Triggered]
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    Schedule with {currentCategory.sampleBrand}
                  </h3>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                  <div className="font-semibold text-slate-900 text-xs">
                    Quick Booking Experience Preview
                  </div>
                  <div className="text-slate-600 text-[11px] leading-relaxed">
                    This triggers the 5-step booking engine funnel mapped in Wireframe 2. Click "View Full Funnel" to switch the wireframe workbench to the detailed multi-step booking engine.
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="px-3 py-1.5 border border-slate-200 rounded text-slate-700 hover:bg-slate-50 font-medium text-xs"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => {
                      setBookingModalOpen(false);
                      setActiveWireframe('booking-flow');
                    }}
                    className="px-4 py-1.5 bg-slate-900 text-white rounded font-semibold text-xs hover:bg-slate-800"
                  >
                    View Full 5-Step Funnel →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
