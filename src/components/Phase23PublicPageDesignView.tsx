import React, { useState } from 'react';
import {
  PUBLIC_PAGES_9,
  HOME_PAGE_12_SECTIONS,
  CATEGORY_HOME_PERSONALIZATIONS,
  PageSpecification,
  HomeSectionSpec,
  CategoryHomePersonalization
} from '../data/phase23PublicPageDesignData';
import {
  Compass,
  Layout,
  Layers,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Clock,
  Tag,
  ShieldCheck,
  Search,
  Sliders,
  Calendar,
  Phone,
  FileText,
  Lock,
  Eye
} from 'lucide-react';

export const Phase23PublicPageDesignView: React.FC = () => {
  const [subTab, setSubTab] = useState<'pages' | 'home-blueprint' | 'personalization'>('pages');
  const [selectedPage, setSelectedPage] = useState<PageSpecification>(PUBLIC_PAGES_9[0]);
  const [selectedCategoryPersonalization, setSelectedCategoryPersonalization] = useState<CategoryHomePersonalization>(CATEGORY_HOME_PERSONALIZATIONS[0]);
  const [selectedSectionNumber, setSelectedSectionNumber] = useState<number>(3); // Hero default

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Phase 2.3 Active
              </span>
              <span className="text-xs text-slate-500 font-mono">Public Website Page Design & Specifications</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Nexora SalonOS: Public Website Page Architecture
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Page-by-page design specifications for all 9 public storefront surfaces: Home (12-section blueprint), 
              Services, Packages, Gallery, About, Contact, My Bookings, Sign In, and Sign Up. 
              One reusable system adapted across 7 salon categories.
            </p>
          </div>

          <div className="flex items-center">
            <div className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PHASE 2.3 COMPLETE — WAITING FOR NEXT SECTION</span>
            </div>
          </div>
        </div>

        {/* Phase 2.3 Internal Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-200 mt-6 pt-4 text-xs font-medium scrollbar-thin">
          {[
            { id: 'pages', label: '1. All 9 Public Pages Specifications', icon: Layout },
            { id: 'home-blueprint', label: '2. Home Page 12-Section Blueprint', icon: Layers },
            { id: 'personalization', label: '3. Category Personalization Matrix (7 Categories)', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-VIEW 1: ALL 9 PUBLIC PAGES SPECIFICATIONS */}
      {subTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: List of 9 Pages */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Storefront Pages (9)
            </h3>
            <div className="space-y-1">
              {PUBLIC_PAGES_9.map((page) => {
                const isSelected = selectedPage.id === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => setSelectedPage(page)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold shadow-sm'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{page.name}</div>
                      <code className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {page.route}
                      </code>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Page Specification */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                  Storefront Page Specification
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  {selectedPage.name}
                </h2>
              </div>
              <div className="text-xs font-mono bg-slate-100 px-3 py-1 rounded text-slate-700">
                Route: {selectedPage.route}
              </div>
            </div>

            {/* Purpose & Primary User */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Page Purpose</span>
                <p className="text-slate-800 mt-0.5 leading-relaxed">{selectedPage.purpose}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Primary User</span>
                <p className="text-slate-800 mt-0.5 font-medium">{selectedPage.primaryUser}</p>
              </div>
            </div>

            {/* Layout Structure Sequence */}
            <div>
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                Page Layout Sequence
              </h4>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                {selectedPage.layoutStructure.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Components Used Chips */}
            <div>
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                Reusable Components Assigned
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedPage.componentsUsed.map((comp) => (
                  <span key={comp} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-mono">
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Desktop & Mobile Responsive Layouts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Monitor className="w-3.5 h-3.5 text-slate-600" />
                  <span>Desktop Layout Specification (1024px and above)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{selectedPage.desktopLayout}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Mobile Layout Specification (&lt;768px)</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{selectedPage.mobileLayout}</p>
              </div>
            </div>

            {/* Data Contract, Empty & Error States */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <h4 className="font-semibold text-slate-900 uppercase text-[10px] tracking-wider">
                Data Schema & Edge Handling
              </h4>
              <div className="space-y-1 text-slate-700">
                <p>
                  <strong className="text-slate-900">Data Contract: </strong>
                  {selectedPage.dataContract.join(' · ')}
                </p>
                <p>
                  <strong className="text-slate-900">Empty State: </strong>
                  {selectedPage.emptyState}
                </p>
                <p>
                  <strong className="text-slate-900">Error State: </strong>
                  {selectedPage.errorState}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: HOME PAGE 12-SECTION BLUEPRINT */}
      {subTab === 'home-blueprint' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px] uppercase">
                  Home Page Anatomy
                </span>
                <span className="text-xs text-slate-500 font-mono">12 Mandatory Modular Sections</span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">
                Home Page 12-Section Component Blueprint
              </h3>
              <p className="text-xs text-slate-500 max-w-3xl">
                The identical 12-section linear blueprint powers all 10 salon categories. Click on any section below 
                to inspect its Purpose, Content, CTA, Component used, Desktop layout, and Mobile layout.
              </p>
            </div>

            {/* 12 Section Stepper Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {HOME_PAGE_12_SECTIONS.map((sec) => {
                const isSelected = selectedSectionNumber === sec.sectionNumber;
                return (
                  <button
                    key={sec.sectionNumber}
                    onClick={() => setSelectedSectionNumber(sec.sectionNumber)}
                    className={`p-2 rounded-lg border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span className="text-[10px] block opacity-70 font-mono">§{sec.sectionNumber}</span>
                    <strong className="truncate block font-semibold">{sec.name}</strong>
                  </button>
                );
              })}
            </div>

            {/* Active Section Inspector Card */}
            {(() => {
              const activeSec = HOME_PAGE_12_SECTIONS.find((s) => s.sectionNumber === selectedSectionNumber) || HOME_PAGE_12_SECTIONS[2];
              return (
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-700 font-mono">
                        Section {activeSec.sectionNumber} of 12
                      </span>
                      <h4 className="text-xl font-bold text-slate-900">{activeSec.name}</h4>
                    </div>
                    <span className="text-xs font-mono bg-white border border-slate-200 px-2.5 py-1 rounded text-slate-700">
                      Component: {activeSec.componentUsed}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Purpose</span>
                      <p className="text-slate-800 mt-1 leading-relaxed">{activeSec.purpose}</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Content Elements</span>
                      <p className="text-slate-800 mt-1 leading-relaxed">{activeSec.content}</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Call To Action (CTA)</span>
                      <p className="text-slate-800 mt-1 leading-relaxed font-semibold">{activeSec.cta}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                        <Monitor className="w-3.5 h-3.5 text-slate-600" />
                        <span>Desktop Layout (1024px+)</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{activeSec.desktopLayout}</p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                        <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                        <span>Mobile Layout (360px+)</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{activeSec.mobileLayout}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: CATEGORY PERSONALIZATION MATRIX (7 CATEGORIES) */}
      {subTab === 'personalization' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold text-[10px] uppercase">
                  Category Personalization
                </span>
                <span className="text-xs text-slate-500 font-mono">1 System · 7 Distinct Experiences</span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">
                How Home Page Adapts Across 7 Business Categories
              </h3>
              <p className="text-xs text-slate-500 max-w-3xl">
                The identical 12-section architecture stays 100% reusable. Only content, imagery, color tokens, 
                terminology, service offerings, packages, and specialist roles change.
              </p>
            </div>

            {/* 7 Category Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {CATEGORY_HOME_PERSONALIZATIONS.map((cat) => {
                const isSelected = selectedCategoryPersonalization.categoryId === cat.categoryId;
                return (
                  <button
                    key={cat.categoryId}
                    onClick={() => setSelectedCategoryPersonalization(cat)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="font-bold truncate">{cat.categoryName}</div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {cat.terminology.serviceLabel.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Category Personalization Details */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: selectedCategoryPersonalization.themeTokens.accentColor }} />
                    <h4 className="font-bold text-slate-900 text-xl">{selectedCategoryPersonalization.categoryName}</h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedCategoryPersonalization.tagline}</p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                    Hero: {selectedCategoryPersonalization.themeTokens.heroStyle}
                  </span>
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                    Radius: {selectedCategoryPersonalization.themeTokens.borderRadius}
                  </span>
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                    Button: {selectedCategoryPersonalization.themeTokens.buttonStyle}
                  </span>
                </div>
              </div>

              {/* Terminology Differences */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Niche-Specific Terminology Adaptation
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Services Menu:</span>
                    <strong className="text-slate-900">{selectedCategoryPersonalization.terminology.serviceLabel}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Packages Header:</span>
                    <strong className="text-slate-900">{selectedCategoryPersonalization.terminology.packageLabel}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Staff Specialists:</span>
                    <strong className="text-slate-900">{selectedCategoryPersonalization.terminology.staffLabel}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CTA Button:</span>
                    <strong className="text-slate-900">{selectedCategoryPersonalization.terminology.bookingAction}</strong>
                  </div>
                </div>
              </div>

              {/* Simulated Hero Section for This Category */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Section 3: Hero Simulation
                </span>
                <div className="border border-dashed border-slate-300 p-4 rounded-lg bg-slate-50/50">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: selectedCategoryPersonalization.themeTokens.accentColor }}>
                    ★ Premium Certified {selectedCategoryPersonalization.categoryName}
                  </span>
                  <h3 className="font-bold text-slate-900 text-xl mt-1 max-w-2xl">
                    {selectedCategoryPersonalization.heroHeadline}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                    {selectedCategoryPersonalization.heroSubheadline}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      className="px-4 py-2 text-xs font-semibold text-white shadow-xs"
                      style={{
                        backgroundColor: selectedCategoryPersonalization.themeTokens.accentColor,
                        borderRadius: selectedCategoryPersonalization.themeTokens.borderRadius === 'rounded-none' ? '0px' :
                                     selectedCategoryPersonalization.themeTokens.borderRadius === 'rounded-md' ? '4px' :
                                     selectedCategoryPersonalization.themeTokens.borderRadius === 'rounded-xl' ? '8px' : '9999px'
                      }}
                    >
                      {selectedCategoryPersonalization.terminology.bookingAction}
                    </button>
                    <button className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded">
                      Explore {selectedCategoryPersonalization.terminology.serviceLabel}
                    </button>
                  </div>
                </div>
              </div>

              {/* Featured Services & Packages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Services */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Section 4: Featured {selectedCategoryPersonalization.terminology.serviceLabel} (3)
                  </span>
                  <div className="space-y-2">
                    {selectedCategoryPersonalization.featuredServices.map((svc) => (
                      <div key={svc.name} className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div>
                          <strong className="text-slate-900 block">{svc.name}</strong>
                          <span className="text-[11px] text-slate-500">{svc.duration} · ₹{svc.advance} advance</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">₹{svc.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Packages & Specialists */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Section 5: Featured {selectedCategoryPersonalization.terminology.packageLabel} (2)
                    </span>
                    <div className="space-y-1.5 mt-1">
                      {selectedCategoryPersonalization.featuredPackages.map((pkg) => (
                        <div key={pkg.name} className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div>
                            <strong className="text-slate-900 block">{pkg.name}</strong>
                            <span className="text-[10px] text-slate-500">{pkg.duration}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-slate-900 block">₹{pkg.price}</span>
                            <span className="text-[10px] text-slate-400 line-through">₹{pkg.originalPrice}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Section 7: Specialists ({selectedCategoryPersonalization.terminology.staffLabel})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCategoryPersonalization.staffRoles.map((role) => (
                        <span key={role} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
