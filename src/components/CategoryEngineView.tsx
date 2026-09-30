import React, { useState } from 'react';
import { SALON_CATEGORIES, SalonCategorySpec } from '../data/productArchitectureData';
import { ArrowDown, Check, Layers, Sparkles, Copy, Sliders, Palette, FileText } from 'lucide-react';

export const CategoryEngineView: React.FC = () => {
  const [selectedCatId, setSelectedCatId] = useState<string>('cat-barber');

  const selectedCategory: SalonCategorySpec =
    SALON_CATEGORIES.find((c) => c.id === selectedCatId) || SALON_CATEGORIES[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Shared Architecture Explanation */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Shared Template Scaffolding</span>
          <span aria-hidden="true">·</span>
          <span>10 Salon Categories</span>
          <span aria-hidden="true">·</span>
          <span>Zero Code Duplication</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          The Category Engine Architecture
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Nexora SalonOS is intentionally engineered around <strong>one universal template engine</strong> rather than ten disconnected products. Industry differentiation occurs through declarative composition layers:
        </p>

        {/* 5-Stage Transformation Pipeline */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            {/* Step 1: Category */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase">Stage 01</div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-700" />
                <span>CATEGORY</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Determines industry service taxonomy, duration defaults, intake questionnaires, and required compliance licenses.
              </p>
            </div>

            {/* Step 2: Template */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase">Stage 02</div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-700" />
                <span>TEMPLATE</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Reusable layout structure: Hero slot, Services grid, Package bundles, Lookbook gallery, About story, Booking drawer.
              </p>
            </div>

            {/* Step 3: Theme */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase">Stage 03</div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-slate-700" />
                <span>THEME</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Design token system: Curated typography scale, disciplined neutral palette, accent budget, border radii, and visual density.
              </p>
            </div>

            {/* Step 4: Content */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase">Stage 04</div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-700" />
                <span>CONTENT</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Business-specific data: Salon name, address, hours, staff rosters, real pricing, customer reviews, and photos.
              </p>
            </div>

            {/* Step 5: Public Website */}
            <div className="bg-slate-900 text-white rounded-lg p-3.5 space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase">Stage 05</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-200" />
                <span>PUBLIC WEBSITE</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Published responsive web application with active booking engine, SEO metadata, and SSL custom domain.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Category Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 10 Categories List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            Supported Categories (10)
          </div>
          <div className="space-y-1">
            {SALON_CATEGORIES.map((cat, idx) => {
              const isSelected = cat.id === selectedCategory.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] opacity-60">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="font-semibold">{cat.name}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded truncate max-w-[120px] ${
                      isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.defaultTemplate}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: How the Shared Engine Instantiates This Category */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
            {/* Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Category Instance Inspection</span>
                <span aria-hidden="true">·</span>
                <span>Template Binding Specification</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedCategory.name} Category Spec
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Demonstrating how a single unified codebase automatically adapts its vocabulary, visual treatment, and service taxonomy.
              </p>
            </div>

            {/* Token Mappings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Default Template Binding
                </span>
                <div className="font-semibold text-slate-900">{selectedCategory.defaultTemplate}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Theme Aesthetic Token
                </span>
                <div className="font-semibold text-slate-900">{selectedCategory.themeStyle}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Service Terminology
                </span>
                <div className="font-mono font-medium text-slate-800">{selectedCategory.serviceTerminology}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">
                  Staff Terminology
                </span>
                <div className="font-mono font-medium text-slate-800">{selectedCategory.staffTerminology}</div>
              </div>
            </div>

            {/* Generated Mock Brand Sample */}
            <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Generated Mock Business Profile
              </span>
              <div className="text-sm font-bold text-slate-900">{selectedCategory.sampleBrand}</div>
              <div className="text-slate-600 italic">"{selectedCategory.tagline}"</div>
            </div>

            {/* Sample Pre-Seeded Services */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Auto-Seeded Service Catalog ({selectedCategory.sampleServices.length})</span>
                <span className="text-[11px] text-slate-500 font-normal">Pre-loaded into Onboarding</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedCategory.sampleServices.map((svc, i) => (
                  <div
                    key={i}
                    className="p-3 border border-slate-200 rounded bg-white space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{svc.name}</span>
                      <span className="font-mono text-slate-600">{svc.priceRange}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{svc.description}</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Duration: {svc.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Packages */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Pre-Seeded Packages ({selectedCategory.samplePackages.length})
              </div>
              <div className="space-y-2 text-xs">
                {selectedCategory.samplePackages.map((pkg, i) => (
                  <div
                    key={i}
                    className="p-3 border border-slate-200 rounded bg-white flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{pkg.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{pkg.includes}</div>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-sm ml-4 shrink-0">
                      {pkg.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory Qualifications */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Mandatory Regulatory Qualifications (Area L)
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedCategory.typicalQualifications.map((qual, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded font-mono text-[11px]"
                  >
                    ✓ {qual}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Component Registry Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-2">
          Universal Reusable Component Registry
        </h3>
        <p className="text-xs text-slate-600 mb-4 max-w-3xl">
          The same core UI component modules are instantiated across all 10 categories. Only token styling (fonts, colors, corner radii) and data schemas vary:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Component Slot</th>
                <th className="py-2.5 px-3 font-semibold">Universal Scaffolding</th>
                <th className="py-2.5 px-3 font-semibold">Dynamic Category Binding</th>
                <th className="py-2.5 px-3 font-semibold">Interactive Behavior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">&lt;GlobalNavbar /&gt;</td>
                <td className="py-2.5 px-3">Home, Services, Packages, Gallery, About, Contact, My Bookings</td>
                <td className="py-2.5 px-3">Logo wordmark, accent color, brand typography</td>
                <td className="py-2.5 px-3">Sticky 1-row header, triggers Booking Modal & Auth</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">&lt;HeroSection /&gt;</td>
                <td className="py-2.5 px-3">Primary headline, value proposition, Trust badges, dual CTA</td>
                <td className="py-2.5 px-3">Category photography backdrop, tagline, operating hours badge</td>
                <td className="py-2.5 px-3">Primary CTA triggers "Book Now", secondary scrolls to services</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">&lt;ServicesGrid /&gt;</td>
                <td className="py-2.5 px-3">Grouped service cards with title, duration, price, and description</td>
                <td className="py-2.5 px-3">Category terminology ("Grooming" vs "Rituals" vs "Bodywork")</td>
                <td className="py-2.5 px-3">Direct "Book Service" button deep-linking into checkout drawer</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">&lt;PackagesShowcase /&gt;</td>
                <td className="py-2.5 px-3">Multi-item value bundles with included treatments & savings</td>
                <td className="py-2.5 px-3">Category bundle recipes (e.g. Grooming Duo vs Bridal Glow)</td>
                <td className="py-2.5 px-3">Selects all included services into the booking session</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">&lt;LookbookGallery /&gt;</td>
                <td className="py-2.5 px-3">Curated visual showcase grid with filter categories</td>
                <td className="py-2.5 px-3">Hairstyles vs Nail Art vs Tattoo flash vs Spa ambiance</td>
                <td className="py-2.5 px-3">Lightbox zoom and "Request this style" direct booking link</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">&lt;TeamRoster /&gt;</td>
                <td className="py-2.5 px-3">Staff portraits, titles, specialties, verified qualifications</td>
                <td className="py-2.5 px-3">"Master Barbers" vs "Licensed Therapists" vs "Resident Artists"</td>
                <td className="py-2.5 px-3">"Book with Specialist" button opening modal with staff locked</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">&lt;BookingDrawer /&gt;</td>
                <td className="py-2.5 px-3">5-step slideover / modal: Service → Staff → Date/Time → Client → Pay</td>
                <td className="py-2.5 px-3">Category intake forms (e.g. skin allergy waiver vs tattoo consent)</td>
                <td className="py-2.5 px-3">Slot reservation hold timer, instant receipt confirmation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
