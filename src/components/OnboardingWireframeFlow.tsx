import React, { useState } from 'react';
import { SALON_CATEGORIES, SalonCategorySpec } from '../data/productArchitectureData';
import {
  Check,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Search,
  Sparkles,
  Info,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  MapPin,
  Building,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Eye,
  Sliders,
  Palette,
  CheckCircle2,
  Copy,
  QrCode,
  Calendar,
} from 'lucide-react';

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  aesthetic: string;
  bestFor: string;
  fontPairing: string;
  heroLayout: 'centered-editorial' | 'split-media' | 'asymmetric-showcase';
}

const TEMPLATE_PRESETS: TemplateOption[] = [
  {
    id: 'tmpl-classic-heritage',
    name: 'Classic Heritage & Craft',
    description: 'Timeless typography with bold structured grids, deep tones, and vintage badge accents.',
    aesthetic: 'Traditional luxury, high contrast, warm wood and charcoal hues.',
    bestFor: 'Barbershops, traditional spas, and heritage grooming clubs.',
    fontPairing: 'Clash Display + Plus Jakarta Sans',
    heroLayout: 'split-media',
  },
  {
    id: 'tmpl-modern-minimalist',
    name: 'Modern Atelier Minimalist',
    description: 'Generous whitespace, ultra-fine hairline dividers, and high-fashion editorial pacing.',
    aesthetic: 'High-fashion editorial, clean ivory/black neutrals with quiet accents.',
    bestFor: 'High-end hair salons, unisex style labs, and luxury makeup ateliers.',
    fontPairing: 'Cabinet Grotesk + Satoshi',
    heroLayout: 'centered-editorial',
  },
  {
    id: 'tmpl-botanical-zen',
    name: 'Botanical Sanctuary & Zen',
    description: 'Organic curved radii, calm earthy backgrounds, and serene wellness rhythm.',
    aesthetic: 'Earthy travertine, soft sage, warm terracotta, and calming textures.',
    bestFor: 'Day spas, holistic wellness studios, and massage therapy clinics.',
    fontPairing: 'Fraunces + General Sans',
    heroLayout: 'centered-editorial',
  },
  {
    id: 'tmpl-bold-noir',
    name: 'Obsidian Noir & Bold Art',
    description: 'High-contrast monochrome framing, stark architectural typography, and raw creative grid.',
    aesthetic: 'Darkroom aesthetic, pure black canvas, crisp white typography, and sharp geometry.',
    bestFor: 'Tattoo studios, avant-garde nail lounges, and piercing collectives.',
    fontPairing: 'Syne + JetBrains Mono',
    heroLayout: 'asymmetric-showcase',
  },
];

export const OnboardingWireframeFlow: React.FC = () => {
  // Step State: 1 = Category, 2 = Template & Theme, 3 = Business Info, 4 = Services, 5 = Site Review, 6 = Publish
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCatSlug, setSelectedCatSlug] = useState<string>('barber');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl-classic-heritage');
  const [selectedColorPreset, setSelectedColorPreset] = useState<string>('charcoal');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [categorySearch, setCategorySearch] = useState<string>('');

  // Business Info Form State (low-fi wireframe simulated inputs)
  const currentCategory: SalonCategorySpec =
    SALON_CATEGORIES.find((c) => c.slug === selectedCatSlug) || SALON_CATEGORIES[0];

  const [businessName, setBusinessName] = useState<string>(currentCategory.sampleBrand);
  const [subdomain, setSubdomain] = useState<string>(
    currentCategory.sampleBrand.toLowerCase().replace(/[^a-z0-9]/g, '')
  );
  const [phone, setPhone] = useState<string>('+1 (555) 839-2041');
  const [email, setEmail] = useState<string>('concierge@nobleblade.com');
  const [streetAddress, setStreetAddress] = useState<string>('742 Everglade Boulevard, Suite 14');
  const [city, setCity] = useState<string>('Austin, TX 78701');
  const [taxId, setTaxId] = useState<string>('US-EIN 82-9481029');
  const [currency, setCurrency] = useState<string>('USD ($)');

  // Services Catalog Seed State
  const [servicesList, setServicesList] = useState(currentCategory.sampleServices);
  const [isPublished, setIsPublished] = useState<boolean>(false);

  // Update business profile when category changes
  const handleCategorySelect = (slug: string) => {
    setSelectedCatSlug(slug);
    const cat = SALON_CATEGORIES.find((c) => c.slug === slug);
    if (cat) {
      setBusinessName(cat.sampleBrand);
      setSubdomain(cat.sampleBrand.toLowerCase().replace(/[^a-z0-9]/g, ''));
      setServicesList(cat.sampleServices);
    }
  };

  const stepsList = [
    { num: 1, title: 'Select Category', label: '10 Verticals' },
    { num: 2, title: 'Choose Template', label: 'Layout & Theme' },
    { num: 3, title: 'Business Profile', label: 'Location & Hours' },
    { num: 4, title: 'Seed Services', label: 'Catalogue Setup' },
    { num: 5, title: 'Generated Preview', label: 'WYSIWYG Review' },
    { num: 6, title: 'Publish & Launch', label: 'Live Subdomain' },
  ];

  const selectedTemplate =
    TEMPLATE_PRESETS.find((t) => t.id === selectedTemplateId) || TEMPLATE_PRESETS[0];

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
              <span>Tenant Onboarding Engine</span>
              <span aria-hidden="true">·</span>
              <span>Area B Wireframe Blueprint</span>
              <span aria-hidden="true">·</span>
              <span>Zero-to-Published in 6 Steps</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Business Onboarding Flow Wireframes
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Walk through each screen and user interaction of the merchant setup experience.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Viewport switch */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 ${
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
                className={`p-1.5 rounded text-xs flex items-center gap-1 ${
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
                className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                  viewport === 'mobile'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Annotations Toggle */}
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`px-3 py-1.5 rounded text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                showAnnotations
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Blueprint Annotations: {showAnnotations ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* 6-Step Stepper Header */}
        <div className="pt-3 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {stepsList.map((st) => {
              const isActive = currentStep === st.num;
              const isPast = currentStep > st.num;
              return (
                <button
                  key={st.num}
                  onClick={() => setCurrentStep(st.num)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : isPast
                      ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold">
                      STEP 0{st.num}
                    </span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />}
                  </div>
                  <div className="font-semibold truncate">{st.title}</div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {st.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Wireframe Canvas */}
      <div className="bg-slate-200/60 p-4 sm:p-8 rounded-xl border border-slate-300 min-h-[750px] flex justify-center items-start overflow-x-auto">
        <div
          className={`transition-all duration-300 bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden ${
            viewport === 'desktop'
              ? 'w-full max-w-[1140px]'
              : viewport === 'tablet'
              ? 'w-[768px]'
              : 'w-[375px]'
          }`}
        >
          {/* Wireframe Browser Header */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="ml-2 text-[11px] text-slate-600 hidden sm:inline">
                https://onboarding.nexorasalon.com/wizard/step-{currentStep}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              [ONBOARDING SCREEN {currentStep} OF 6]
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCREEN 1: CATEGORY SELECTION */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="p-6 sm:p-10 space-y-6 text-xs text-slate-900">
              {showAnnotations && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded text-amber-900 text-[11px] space-y-1">
                  <div className="flex items-center gap-2 font-bold font-mono">
                    <Info className="w-3.5 h-3.5" />
                    <span>[WIREFRAME 1.0: Category Selection Gateway]</span>
                  </div>
                  <p>
                    <strong>User Interaction:</strong> Business owner searches or selects 1 of the 10 supported industry verticals.
                    <br />
                    <strong>System Response:</strong> Immediately filters available templates, sets default service duration granularity (e.g. 15m vs 60m), seeds compliance certifications, and stages the category token pipeline.
                  </p>
                </div>
              )}

              {/* Screen Title & Subheader */}
              <div className="max-w-2xl space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  Step 1 · Industry Architecture
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  What type of business are you building?
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Select your primary vertical. Nexora SalonOS will automatically configure your booking engine, pre-load industry-standard services, and apply tailored compliance rules.
                </p>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex items-center gap-2 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search 10 categories (e.g., Barber, Spa, Tattoo)..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category Grid (10 Verticals) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {SALON_CATEGORIES.filter((c) =>
                  c.name.toLowerCase().includes(categorySearch.toLowerCase())
                ).map((cat, idx) => {
                  const isSelected = cat.slug === selectedCatSlug;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`p-4 rounded-lg border text-left transition-all relative ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`font-mono text-[10px] font-semibold ${
                            isSelected ? 'text-slate-400' : 'text-slate-400'
                          }`}
                        >
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <h3 className="font-bold text-sm truncate">{cat.name}</h3>
                      <p
                        className={`text-[11px] mt-1 line-clamp-2 ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {cat.tagline}
                      </p>
                      <div
                        className={`mt-3 pt-2 border-t text-[10px] font-mono flex items-center justify-between ${
                          isSelected ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                        }`}
                      >
                        <span>{cat.sampleServices.length} seed services</span>
                        <span className="font-semibold">{isSelected ? 'SELECTED' : 'SELECT'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Category Deep Blueprint Info */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    Selected Vertical: {currentCategory.name}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    Default Template: {currentCategory.defaultTemplate}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                  <div>
                    <strong>Service Terminology:</strong> {currentCategory.serviceTerminology}
                  </div>
                  <div>
                    <strong>Staff Title:</strong> {currentCategory.staffTerminology}
                  </div>
                  <div>
                    <strong>Compliance:</strong> {currentCategory.typicalQualifications[0]}
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-slate-500 text-xs">
                  Step 1 of 6 · Category sets the architectural foundation
                </span>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded font-semibold text-xs hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <span>Continue to Template & Theme</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 2: TEMPLATE & THEME SELECTION */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="p-6 sm:p-10 space-y-6 text-xs text-slate-900">
              {showAnnotations && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded text-amber-900 text-[11px] space-y-1">
                  <div className="flex items-center gap-2 font-bold font-mono">
                    <Info className="w-3.5 h-3.5" />
                    <span>[WIREFRAME 2.0: Template Scaffolding & Theme Tokens]</span>
                  </div>
                  <p>
                    <strong>User Interaction:</strong> Business owner selects 1 of 4 reusable structural layouts, previewing hero arrangements, typographic hierarchies, and color presets.
                    <br />
                    <strong>System Response:</strong> Binds chosen template component tree to the tenant profile. Zero code duplication—all templates reuse identical underlying slot interfaces.
                  </p>
                </div>
              )}

              {/* Title */}
              <div className="max-w-2xl space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  Step 2 · Visual Scaffolding
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Choose a layout template & aesthetic theme
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tailored for your <strong>{currentCategory.name}</strong> business. All templates are responsive, optimized for booking conversion, and fully customizable in the builder.
                </p>
              </div>

              {/* 4 Template Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {TEMPLATE_PRESETS.map((tmpl) => {
                  const isSelected = tmpl.id === selectedTemplateId;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Wireframe Thumbnail Placeholder */}
                        <div className="aspect-[4/3] bg-slate-100 border border-slate-200 rounded p-2.5 flex flex-col justify-between font-mono text-[9px] text-slate-400">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                            <span className="w-12 h-1.5 bg-slate-300 rounded" />
                            <div className="flex gap-1">
                              <span className="w-3 h-1.5 bg-slate-200 rounded" />
                              <span className="w-3 h-1.5 bg-slate-200 rounded" />
                              <span className="w-5 h-1.5 bg-slate-800 rounded" />
                            </div>
                          </div>
                          <div className="space-y-1 my-auto text-center py-2">
                            <span className="block font-bold text-slate-700 text-[10px]">
                              [Hero: {tmpl.heroLayout}]
                            </span>
                            <span className="block text-[8px] text-slate-500">
                              3-Zone Navigation Header
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-200">
                            <span className="h-3 bg-slate-200 rounded" />
                            <span className="h-3 bg-slate-200 rounded" />
                            <span className="h-3 bg-slate-200 rounded" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-sm">{tmpl.name}</h3>
                            {isSelected && (
                              <span className="text-[10px] font-mono font-bold text-slate-900">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">{tmpl.description}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-[10px]">
                        <div>
                          <span className="text-slate-400">Typography: </span>
                          <strong className="text-slate-700">{tmpl.fontPairing}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Best For: </span>
                          <span className="text-slate-600">{tmpl.bestFor}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Theme Palette Tokens Selector */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <span className="font-bold text-slate-900 text-xs block">
                  Select Theme Palette Preset (60-30-10 Disciplined Distribution)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'charcoal', name: 'Charcoal & Crisp White', swatch: 'bg-slate-900' },
                    { id: 'taupe', name: 'Warm Taupe & Sandstone', swatch: 'bg-stone-700' },
                    { id: 'forest', name: 'Botanical Forest & Linen', swatch: 'bg-emerald-900' },
                    { id: 'monochrome', name: 'Pure Obsidian Monochrome', swatch: 'bg-black' },
                  ].map((clr) => (
                    <button
                      key={clr.id}
                      onClick={() => setSelectedColorPreset(clr.id)}
                      className={`p-2.5 rounded border text-left flex items-center gap-2.5 transition-all ${
                        selectedColorPreset === clr.id
                          ? 'border-slate-900 bg-white shadow-xs font-semibold'
                          : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${clr.swatch}`} />
                      <span className="text-[11px] truncate">{clr.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-slate-200 rounded font-semibold text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Category</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded font-semibold text-xs hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <span>Continue to Business Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 3: BUSINESS INFORMATION & LOCATION INTAKE */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="p-6 sm:p-10 space-y-6 text-xs text-slate-900">
              {showAnnotations && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded text-amber-900 text-[11px] space-y-1">
                  <div className="flex items-center gap-2 font-bold font-mono">
                    <Info className="w-3.5 h-3.5" />
                    <span>[WIREFRAME 3.0: Business Profile & Operations Intake]</span>
                  </div>
                  <p>
                    <strong>User Interaction:</strong> Business owner enters business name, unique subdomain, physical address, contact telephone, email, and operating hours.
                    <br />
                    <strong>System Response:</strong> Validates subdomain availability, parses address coordinates for Google Maps widget (Area C), and initializes working shift matrices for calendar slot calculation (Area E/F).
                  </p>
                </div>
              )}

              {/* Title */}
              <div className="max-w-2xl space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  Step 3 · Identity & Operations
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Enter your business & location particulars
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  These details will appear across your public header, contact footer, Google Maps locator, and automated customer booking confirmation emails.
                </p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Identity & Web Route */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-800 text-[11px]">
                      Salon / Studio Business Name *
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-800 text-[11px] flex justify-between">
                      <span>Nexora Custom Subdomain *</span>
                      <span className="text-emerald-700 font-mono text-[10px]">✓ Available</span>
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded overflow-hidden">
                      <input
                        type="text"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="w-full p-2.5 bg-transparent text-xs font-mono focus:outline-none"
                      />
                      <span className="text-slate-400 px-3 text-[11px] font-mono bg-slate-100 border-l border-slate-200 py-2.5 shrink-0">
                        .nexorasalon.com
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-800 text-[11px]">
                        Business Phone Number *
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-800 text-[11px]">
                        Booking Contact Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-800 text-[11px]">
                        Tax ID / GSTIN / EIN
                      </label>
                      <input
                        type="text"
                        value={taxId}
                        onChange={(e) => setTaxId(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-800 text-[11px]">
                        Operating Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs"
                      >
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>CAD ($)</option>
                        <option>INR (₹)</option>
                        <option>AUD ($)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Column 2: Physical Address & Weekly Operating Schedule */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-800 text-[11px]">
                      Street Address & Building *
                    </label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-800 text-[11px]">
                      City, State & Postal Code *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs"
                    />
                  </div>

                  {/* Weekly Operating Hours Matrix */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <span className="font-semibold text-slate-900 text-xs block">
                      Standard Weekly Operating Hours
                    </span>
                    <div className="space-y-1 text-[11px] font-mono text-slate-700">
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span>Monday – Friday:</span>
                        <span className="font-bold">09:00 AM – 08:00 PM</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span>Saturday:</span>
                        <span className="font-bold">08:30 AM – 07:00 PM</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Sunday:</span>
                        <span className="text-slate-500">10:00 AM – 05:00 PM (Limited Slots)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 border border-slate-200 rounded font-semibold text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Template</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded font-semibold text-xs hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <span>Continue to Catalogue Seeding</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 4: SERVICE CATALOGUE SEEDING & CUSTOMIZATION */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="p-6 sm:p-10 space-y-6 text-xs text-slate-900">
              {showAnnotations && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded text-amber-900 text-[11px] space-y-1">
                  <div className="flex items-center gap-2 font-bold font-mono">
                    <Info className="w-3.5 h-3.5" />
                    <span>[WIREFRAME 4.0: Service Catalogue Seeding & Customization]</span>
                  </div>
                  <p>
                    <strong>User Interaction:</strong> Business owner reviews pre-seeded industry treatments, modifies prices/durations, or adds new signature items.
                    <br />
                    <strong>System Response:</strong> Seeds the tenant database catalog (Area B to Area C/E). These items directly populate the ServicesGrid component and Booking Modal slot duration calculator.
                  </p>
                </div>
              )}

              {/* Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="max-w-2xl space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    Step 4 · Catalogue Architecture
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Review pre-loaded {currentCategory.serviceTerminology}
                  </h1>
                  <p className="text-xs text-slate-600">
                    We pre-populated your menu with {currentCategory.name} industry favorites. You can edit any item or add your signature services.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newItem = {
                      name: 'Signature Express Care',
                      duration: '30 mins',
                      priceRange: '$35',
                      description: 'Custom quick-service option for walk-ins and express visits.',
                    };
                    setServicesList([...servicesList, newItem]);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded text-xs font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Service</span>
                </button>
              </div>

              {/* Service Rows */}
              <div className="space-y-3">
                {servicesList.map((svc, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-slate-200 rounded-lg bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 text-[10px]">
                          #0{idx + 1}
                        </span>
                        <input
                          type="text"
                          defaultValue={svc.name}
                          className="font-bold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:outline-none w-full sm:w-auto"
                        />
                      </div>
                      <p className="text-xs text-slate-500">{svc.description}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <select
                          defaultValue={svc.duration}
                          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                        >
                          <option>15 mins</option>
                          <option>30 mins</option>
                          <option>45 mins</option>
                          <option>60 mins</option>
                          <option>75 mins</option>
                          <option>90 mins</option>
                          <option>120 mins</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">$</span>
                        <input
                          type="text"
                          defaultValue={svc.priceRange.replace(/[^0-9-]/g, '') || '50'}
                          className="w-16 p-1 bg-slate-50 border border-slate-200 rounded text-center text-xs font-bold"
                        />
                      </div>

                      <button
                        onClick={() =>
                          setServicesList(servicesList.filter((_, i) => i !== idx))
                        }
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Remove service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Regulatory Requirement Gate Banner */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-slate-900" />
                  <span>
                    Mandatory staff license for these services: <strong>{currentCategory.typicalQualifications.join(', ')}</strong>
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  Compliance Rule Active
                </span>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 border border-slate-200 rounded font-semibold text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Business Info</span>
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded font-semibold text-xs hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <span>Generate Website Preview →</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 5: AUTOMATED WEBSITE GENERATION & LIVE PREVIEW */}
          {/* ========================================================================= */}
          {currentStep === 5 && (
            <div className="divide-y divide-slate-200 text-xs text-slate-900">
              {showAnnotations && (
                <div className="bg-amber-50 p-3.5 text-amber-900 text-[11px] space-y-1">
                  <div className="flex items-center gap-2 font-bold font-mono">
                    <Info className="w-3.5 h-3.5" />
                    <span>[WIREFRAME 5.0: Automated Generation & WYSIWYG Review (Area H)]</span>
                  </div>
                  <p>
                    <strong>User Interaction:</strong> Business owner inspects the instantly synthesized website draft. All inputs from Steps 1–4 are seamlessly rendered across the standard component hierarchy.
                    <br />
                    <strong>System Response:</strong> Renders responsive preview, provisions draft state, and activates the live publish button.
                  </p>
                </div>
              )}

              {/* Generated Site Controls Bar */}
              <div className="bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-xs text-slate-900">
                    Draft Generated Successfully
                  </span>
                  <span className="text-slate-400 font-mono">
                    ({subdomain}.nexorasalon.com)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-3 py-1.5 border border-slate-200 rounded text-slate-700 hover:bg-white text-xs font-medium"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => setCurrentStep(6)}
                    className="bg-slate-900 text-white px-4 py-1.5 rounded text-xs font-semibold hover:bg-slate-800"
                  >
                    Proceed to Publish →
                  </button>
                </div>
              </div>

              {/* Simulated Live Generated Navbar */}
              <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-slate-900 text-white rounded flex items-center justify-center font-bold text-xs">
                    {businessName.charAt(0)}
                  </div>
                  <span className="font-bold text-sm text-slate-900">{businessName}</span>
                </div>

                {viewport !== 'mobile' && (
                  <nav className="flex items-center gap-4 text-slate-600 text-xs">
                    <span className="font-semibold text-slate-900">Home</span>
                    <span>Services</span>
                    <span>Packages</span>
                    <span>Gallery</span>
                    <span>About</span>
                    <span>Contact</span>
                    <span>My Bookings</span>
                  </nav>
                )}

                <div className="flex items-center gap-2">
                  <button className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-semibold">
                    Book Now
                  </button>
                </div>
              </header>

              {/* Simulated Generated Hero Section */}
              <section className="p-8 sm:p-12 bg-slate-50 space-y-4">
                <div className="max-w-2xl space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    [Hero Slot · Template: {selectedTemplate.name}]
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Welcome to {businessName}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {currentCategory.tagline} Located at {streetAddress}, {city}.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-semibold">
                      Book an Appointment
                    </button>
                    <button className="border border-slate-300 bg-white px-4 py-2 rounded text-xs font-medium text-slate-700">
                      View Menu
                    </button>
                  </div>
                </div>
              </section>

              {/* Simulated Generated Services Section */}
              <section className="p-8 sm:p-12 space-y-4 bg-white">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-base font-bold text-slate-900">
                    Signature {currentCategory.serviceTerminology}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Instant online reservation with our verified {currentCategory.staffTerminology.toLowerCase()}.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicesList.slice(0, 4).map((svc, i) => (
                    <div
                      key={i}
                      className="p-4 border border-slate-200 rounded-lg space-y-1 bg-white"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900">{svc.name}</span>
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          {svc.priceRange}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{svc.description}</p>
                      <div className="text-[10px] text-slate-400 font-mono pt-1">
                        Duration: {svc.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 6: PUBLISH READINESS & LAUNCH CONFIRMATION */}
          {/* ========================================================================= */}
          {currentStep === 6 && (
            <div className="p-6 sm:p-10 space-y-6 text-xs text-slate-900">
              {showAnnotations && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded text-amber-900 text-[11px] space-y-1">
                  <div className="flex items-center gap-2 font-bold font-mono">
                    <Info className="w-3.5 h-3.5" />
                    <span>[WIREFRAME 6.0: Pre-Flight Checklist & Publishing Gateway]</span>
                  </div>
                  <p>
                    <strong>User Interaction:</strong> Business owner completes the pre-flight verification checklist and clicks "Publish Website Live".
                    <br />
                    <strong>System Response:</strong> Provisions production SSL route, binds custom subdomain, activates the booking engine (Area E), creates the tenant dashboard (Area F), and displays launch credentials.
                  </p>
                </div>
              )}

              {!isPublished ? (
                <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                  {/* Pre-Flight Checklist Header */}
                  <div className="border-b border-slate-200 pb-4">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                      Step 6 · Final Launch Verification
                    </span>
                    <h1 className="text-xl font-bold text-slate-900 mt-1">
                      Ready to launch {businessName}?
                    </h1>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Review your pre-flight readiness checklist before publishing to the live web.
                    </p>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2.5">
                    {[
                      {
                        title: 'Category Architecture & Schema Linked',
                        detail: `${currentCategory.name} taxonomy, terminology & rules bound`,
                        status: 'Ready',
                      },
                      {
                        title: 'Template & Theme Compilation',
                        detail: `${selectedTemplate.name} with ${selectedColorPreset} palette`,
                        status: 'Compiled',
                      },
                      {
                        title: 'Catalogue Menu Seeded',
                        detail: `${servicesList.length} services configured with durations and prices`,
                        status: 'Configured',
                      },
                      {
                        title: 'Subdomain & SSL Certificate',
                        detail: `https://${subdomain}.nexorasalon.com`,
                        status: 'Reserved',
                      },
                      {
                        title: 'Booking Engine & Slot Capacity Engine',
                        detail: '10-minute hold lock and schedule matrix initialized',
                        status: 'Active',
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <div className="font-semibold text-slate-900">{item.title}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {item.detail}
                            </div>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Publish Trigger */}
                  <div className="pt-2">
                    <button
                      onClick={() => setIsPublished(true)}
                      className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Publish Website Live</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Post-Publish Success State */
                <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-lg p-8 text-center space-y-6">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      Congratulations! Your Website is Live!
                    </h2>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      <strong>{businessName}</strong> is now accepting client bookings online. Your custom subdomain is secured with SSL.
                    </p>
                  </div>

                  {/* Live URL Card */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg max-w-md mx-auto flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-700 font-bold truncate">
                      https://{subdomain}.nexorasalon.com
                    </span>
                    <button
                      onClick={() => alert(`Simulated link: https://${subdomain}.nexorasalon.com`)}
                      className="ml-2 text-slate-900 hover:text-slate-600 flex items-center gap-1 shrink-0 font-semibold"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* QR Code and Salon Marketing Card */}
                  <div className="p-4 border border-dashed border-slate-300 rounded-lg max-w-md mx-auto flex items-center gap-4 text-left">
                    <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-slate-500 font-mono text-[9px] shrink-0">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">Print Salon Counter QR Code</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Place at your reception desk so clients can scan and rebook appointments on their mobile devices.
                      </div>
                    </div>
                  </div>

                  {/* Handover to Admin Dashboard */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setIsPublished(false);
                        setCurrentStep(1);
                      }}
                      className="px-4 py-2 border border-slate-200 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Start New Onboarding
                    </button>
                    <button
                      onClick={() => {
                        alert('Onboarding complete. In Phase 2+, this transitions directly to the Business Admin Dashboard (Area F).');
                      }}
                      className="bg-slate-900 text-white px-5 py-2 rounded text-xs font-bold hover:bg-slate-800"
                    >
                      Go to Business Admin Dashboard (Area F) →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
