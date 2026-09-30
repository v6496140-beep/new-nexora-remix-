import React, { useState } from 'react';
import {
  PUBLIC_COMPONENTS_25,
  POLYMORPHIC_SERVICE_CARDS,
  PUBLIC_NAV_SPEC,
  PublicComponentDetail,
  CategoryCardAdaptation
} from '../data/phase22PublicComponentData';
import {
  Layout,
  Layers,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Search,
  Sliders,
  Compass,
  ArrowRight,
  Clock,
  User,
  Star,
  Phone,
  Calendar,
  Lock,
  Menu,
  X
} from 'lucide-react';

export const Phase22PublicComponentView: React.FC = () => {
  const [subTab, setSubTab] = useState<'inventory' | 'hierarchy' | 'polymorphic' | 'navigation'>('inventory');
  const [selectedComp, setSelectedComp] = useState<PublicComponentDetail>(PUBLIC_COMPONENTS_25[5]); // ServiceCard default
  const [compFilter, setCompFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePolymorphicCard, setActivePolymorphicCard] = useState<CategoryCardAdaptation>(POLYMORPHIC_SERVICE_CARDS[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const filteredComponents = PUBLIC_COMPONENTS_25.filter((c) => {
    const matchesFilter = compFilter === 'All' || c.category === compFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Phase 2.2 Active
              </span>
              <span className="text-xs text-slate-500 font-mono">Public Website Component Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Nexora SalonOS: Public Website Component System
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              One unified component system powering all 10 salon categories. 25 reusable, polymorphic components 
              governed by strict token props, responsive behavior, and WCAG 2.2 AA accessibility standards.
            </p>
          </div>

          <div className="flex items-center">
            <div className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PHASE 2.2 COMPLETE — WAITING FOR NEXT SECTION</span>
            </div>
          </div>
        </div>

        {/* Phase 2.2 Internal Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-200 mt-6 pt-4 text-xs font-medium scrollbar-thin">
          {[
            { id: 'inventory', label: '1. 25 Component Inventory & Props', icon: Layout },
            { id: 'hierarchy', label: '2. Component Hierarchy (Atoms -> Organisms)', icon: Layers },
            { id: 'polymorphic', label: '3. Polymorphic Category Behavior (Barber, Spa, Nail, Tattoo)', icon: Sparkles },
            { id: 'navigation', label: '4. Public Website Navigation System', icon: Compass }
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

      {/* SUB-VIEW 1: 25 COMPONENT INVENTORY & DEEP PROPS INSPECTOR */}
      {subTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Filterable List of 25 Components */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Public Components ({filteredComponents.length}/25)
              </h3>
              <select
                value={compFilter}
                onChange={(e) => setCompFilter(e.target.value)}
                className="text-[11px] border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700"
              >
                <option value="All">All Categories</option>
                <option value="Primitives">Primitives</option>
                <option value="Content Cards">Content Cards</option>
                <option value="Grids & Sliders">Grids & Sliders</option>
                <option value="Navigation & Layout">Navigation & Layout</option>
                <option value="Sections & CTAs">Sections & CTAs</option>
              </select>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search component or prop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
              />
            </div>

            {/* List */}
            <div className="space-y-1 max-h-[580px] overflow-y-auto">
              {filteredComponents.map((comp) => {
                const isSelected = selectedComp.id === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedComp(comp)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold shadow-sm'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <span className="truncate">{comp.name}</span>
                      <span className={`block text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {comp.hierarchyLevel} · {comp.category}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0 ml-1" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Architectural Specification Inspector */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-mono font-semibold uppercase">
                    {selectedComp.hierarchyLevel}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Category: {selectedComp.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  {selectedComp.name}
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded">
                {selectedComp.props.length} Props · {selectedComp.variants.length} Variants
              </span>
            </div>

            {/* Purpose */}
            <div>
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">Purpose</h4>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                {selectedComp.purpose}
              </p>
            </div>

            {/* Props Table */}
            <div>
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                TypeScript Props Contract
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Prop Name</th>
                      <th className="py-2 px-3 font-semibold">Type</th>
                      <th className="py-2 px-3 font-semibold">Required</th>
                      <th className="py-2 px-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedComp.props.map((p) => (
                      <tr key={p.name} className="hover:bg-slate-50/60">
                        <td className="py-2 px-3 font-mono font-semibold text-slate-900">{p.name}</td>
                        <td className="py-2 px-3 font-mono text-blue-600 text-[11px]">{p.type}</td>
                        <td className="py-2 px-3">
                          {p.required ? (
                            <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Optional</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-slate-600 text-[11px]">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Variants & States */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider mb-2">Variants</h4>
                <ul className="space-y-1.5">
                  {selectedComp.variants.map((v) => (
                    <li key={v.name} className="text-slate-700">
                      <strong className="text-slate-900">{v.name}:</strong> {v.description}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider mb-2">Interactive States</h4>
                <ul className="space-y-1.5">
                  {selectedComp.states.map((s) => (
                    <li key={s.name} className="text-slate-700">
                      <strong className="text-slate-900">{s.name}:</strong> {s.visualSpec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Responsive Behaviors */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <h4 className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider">
                Responsive Behavior Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold mb-1">
                    <Monitor className="w-3.5 h-3.5 text-slate-500" />
                    <span>Desktop (1024px+)</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{selectedComp.desktopBehavior}</p>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold mb-1">
                    <Tablet className="w-3.5 h-3.5 text-slate-500" />
                    <span>Tablet (768px+)</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{selectedComp.tabletBehavior}</p>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-800 font-semibold mb-1">
                    <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Mobile (360px+)</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{selectedComp.mobileBehavior}</p>
                </div>
              </div>
            </div>

            {/* Accessibility & Category Customization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Accessibility Requirements (WCAG 2.2 AA)</span>
                </div>
                <ul className="space-y-1 text-[11px] list-disc list-inside text-emerald-800">
                  {selectedComp.accessibilityRequirements.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-4 h-4 text-blue-700" />
                  <span>Category Customization Rules</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  {selectedComp.categoryCustomization}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: COMPONENT HIERARCHY */}
      {subTab === 'hierarchy' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Deliverable 2: Public Website Component Hierarchy (Atomic Composition)
            </h3>
            <p className="text-xs text-slate-500">
              Structured relationship showing how 4 atomic primitives assemble into 10 molecules, which then compose 11 organisms and full page templates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* ATOMS */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Level 1: Atoms</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono text-[10px]">Primitives</span>
              </div>
              <ul className="space-y-2 text-slate-700">
                {[
                  { name: 'BookNowButton', desc: '48px touch CTA button with focus ring' },
                  { name: 'PriceDisplay', desc: 'Tabular numerals with advance split' },
                  { name: 'RatingDisplay', desc: 'Star badge with review counter' },
                  { name: 'SocialLinks', desc: '44px accessible social platform icons' }
                ].map((atom) => (
                  <li key={atom.name} className="p-2.5 bg-white rounded border border-slate-200">
                    <strong className="text-slate-900 block font-mono text-xs">{atom.name}</strong>
                    <span className="text-[11px] text-slate-500">{atom.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* MOLECULES */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Level 2: Molecules</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-mono text-[10px]">Compound Cards</span>
              </div>
              <ul className="space-y-2 text-slate-700">
                {[
                  { name: 'ServiceCard', desc: 'Service item + PriceDisplay + BookNowButton' },
                  { name: 'PackageCard', desc: 'Bundle checklist + PriceDisplay + CTA' },
                  { name: 'StaffCard', desc: 'Avatar + RatingDisplay + Specialty chips' },
                  { name: 'TestimonialCard', desc: 'Quote text + RatingDisplay + Verified badge' },
                  { name: 'SectionHeader', desc: 'Badge + Title + Subtitle' },
                  { name: 'AnnouncementBar', desc: 'Message + CTA Link + Close trigger' },
                  { name: 'OpeningHours', desc: '7-day list + Live Open/Closed badge' },
                  { name: 'BusinessInfo', desc: 'Address + Phone + WhatsApp trigger' },
                  { name: 'Breadcrumb', desc: 'Hierarchical navigation trail' },
                  { name: 'GalleryFilter', desc: 'Category filter chip strip' }
                ].map((mol) => (
                  <li key={mol.name} className="p-2 bg-white rounded border border-slate-200">
                    <strong className="text-slate-900 block font-mono text-xs">{mol.name}</strong>
                    <span className="text-[11px] text-slate-500">{mol.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ORGANISMS */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Level 3: Organisms</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px]">Sections & Grids</span>
              </div>
              <ul className="space-y-2 text-slate-700">
                {[
                  { name: 'Navbar', desc: 'Logo + NavLinks + Auth + BookNowButton' },
                  { name: 'MobileMenu', desc: 'Full-viewport slide-over drawer' },
                  { name: 'Hero', desc: 'H1 + RatingDisplay + Dual CTAs + ImageSlot' },
                  { name: 'ServiceGrid', desc: 'Category filter + Array of ServiceCards' },
                  { name: 'PackageGrid', desc: 'Multi-column array of PackageCards' },
                  { name: 'StaffGrid', desc: 'Specialist team array with carousel fallback' },
                  { name: 'GalleryGrid', desc: 'Masonry or square portfolio showcase' },
                  { name: 'TestimonialSlider', desc: 'Multi-review carousel with swipe' },
                  { name: 'BookingCTA', desc: 'Full-width pre-footer conversion section' },
                  { name: 'ContactSection', desc: 'Map pin + BusinessInfo + OpeningHours' },
                  { name: 'Footer', desc: 'Brand + Links + Hours + GSTIN + SocialLinks' }
                ].map((org) => (
                  <li key={org.name} className="p-2 bg-white rounded border border-slate-200">
                    <strong className="text-slate-900 block font-mono text-xs">{org.name}</strong>
                    <span className="text-[11px] text-slate-500">{org.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: POLYMORPHIC CATEGORY BEHAVIOR DEMO */}
      {subTab === 'polymorphic' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold text-[10px] uppercase">
                  Polymorphic Architecture
                </span>
                <span className="text-xs text-slate-500 font-mono">Zero Code Duplication Guarantee</span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">
                One ServiceCard Component Across 4 Business Categories
              </h3>
              <p className="text-xs text-slate-600 max-w-3xl">
                Demonstrating how the exact same <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono font-semibold">ServiceCard</code> component 
                displays Barber (Beard Trim), Spa (Swedish Massage), Nail Studio (Gel Extensions), and Tattoo Studio (Custom Ink) 
                strictly via theme tokens, without duplicating a single line of component code.
              </p>
            </div>

            {/* Category Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POLYMORPHIC_SERVICE_CARDS.map((card) => {
                const isSelected = activePolymorphicCard.category === card.category;
                return (
                  <button
                    key={card.category}
                    onClick={() => setActivePolymorphicCard(card)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-bold truncate">{card.category}</div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {card.serviceTitle.split(' ')[0]} {card.serviceTitle.split(' ')[1]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Interactive Polymorphic ServiceCard Demonstration */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Rendering Active Profile:
                  </span>
                  <h4 className="font-bold text-slate-900 text-base">{activePolymorphicCard.category}</h4>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                    Radius: {activePolymorphicCard.borderRadius}
                  </span>
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                    Button: {activePolymorphicCard.buttonStyle}
                  </span>
                </div>
              </div>

              {/* The Live Rendered Polymorphic Card */}
              <div className="max-w-md mx-auto bg-white p-5 border border-slate-200 shadow-sm transition-all duration-300"
                style={{
                  borderRadius: activePolymorphicCard.borderRadius === 'rounded-none' ? '0px' :
                               activePolymorphicCard.borderRadius === 'rounded-md' ? '8px' :
                               activePolymorphicCard.borderRadius === 'rounded-xl' ? '12px' : '16px'
                }}
              >
                {/* Category Micro Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded"
                    style={{
                      backgroundColor: `${activePolymorphicCard.accentColor}15`,
                      color: activePolymorphicCard.accentColor
                    }}
                  >
                    {activePolymorphicCard.categoryBadge}
                  </span>
                  <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{activePolymorphicCard.duration}</span>
                  </div>
                </div>

                {/* Service Title & Description */}
                <h5 className="font-bold text-slate-900 text-base leading-snug">
                  {activePolymorphicCard.serviceTitle}
                </h5>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {activePolymorphicCard.description}
                </p>

                {/* Special Category Metadata Slot */}
                <div className="mt-3 p-2 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                  <span className="font-semibold block text-[10px] uppercase text-slate-400">Treatment Feature:</span>
                  <span>{activePolymorphicCard.specialMetadataTag}</span>
                </div>

                {/* Price Display Block (Tabular Numerals + 25% Advance Split) */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-base font-bold text-slate-900 font-mono">
                      ₹{activePolymorphicCard.price.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      ₹{activePolymorphicCard.advanceAmount} advance (25%) · ₹{activePolymorphicCard.remainingAmount} at salon
                    </div>
                  </div>

                  {/* Accessible Category-Styled Button */}
                  <button
                    className="px-4 py-2 text-xs font-semibold text-white shadow-xs transition-transform active:scale-95"
                    style={{
                      backgroundColor: activePolymorphicCard.accentColor,
                      borderRadius: activePolymorphicCard.borderRadius === 'rounded-none' ? '0px' :
                                   activePolymorphicCard.borderRadius === 'rounded-md' ? '4px' :
                                   activePolymorphicCard.borderRadius === 'rounded-xl' ? '8px' : '9999px'
                    }}
                  >
                    Select Service
                  </button>
                </div>
              </div>

              {/* Architectural Explanation */}
              <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
                <strong className="text-slate-900 block font-semibold">How Zero Duplication Works:</strong>
                <p className="text-slate-600">
                  The <code className="text-blue-700 font-mono">ServiceCard</code> consumes standardized props: <code className="font-mono text-slate-800">title</code>, <code className="font-mono text-slate-800">price</code>, <code className="font-mono text-slate-800">durationMinutes</code>, <code className="font-mono text-slate-800">advancePercent</code>, and <code className="font-mono text-slate-800">description</code>.
                  It wraps child primitives <code className="text-blue-700 font-mono">PriceDisplay</code> and <code className="text-blue-700 font-mono">BookNowButton</code>. 
                  The host page passes the category theme context (<code className="font-mono text-slate-800">theme.accentColor</code>, <code className="font-mono text-slate-800">theme.borderRadius</code>, <code className="font-mono text-slate-800">theme.buttonStyle</code>), allowing seamless transformation from a sharp slate Barber cut card to a soft pill Nail extension card.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: PUBLIC WEBSITE NAVIGATION SYSTEM */}
      {subTab === 'navigation' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Deliverable 4: Public Website Navigation System (Desktop & Mobile)
            </h3>
            <p className="text-xs text-slate-500">
              Standardized public salon navigation structure supporting 7 main pages, authentication access, and conversion triggers.
            </p>
          </div>

          {/* Desktop Navigation Preview */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Desktop Header Bar Preview (1024px and above)</span>
              <span className="text-[11px] font-mono text-slate-500">Height: 68px · Sticky Glass Effect</span>
            </div>

            <div className="p-4 bg-white flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                  N
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block leading-none">Apex Grooming Lounge</span>
                  <span className="text-[10px] text-slate-500">Open Today · 9 AM – 9 PM</span>
                </div>
              </div>

              {/* 7 Navigation Links */}
              <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600">
                {PUBLIC_NAV_SPEC.links.map((link) => (
                  <span key={link.label} className="hover:text-slate-900 cursor-pointer transition-colors">
                    {link.label}
                  </span>
                ))}
              </nav>

              {/* Auth Shortcuts & Book Now CTA */}
              <div className="flex items-center gap-3">
                <button className="text-xs text-slate-600 hover:text-slate-900 font-medium">
                  {PUBLIC_NAV_SPEC.auth.signIn.label}
                </button>
                <button className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md shadow-xs hover:bg-slate-800 transition-colors">
                  {PUBLIC_NAV_SPEC.cta.label}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Preview */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Mobile Header Bar (under 1024px) &amp; Full Viewport Drawer</span>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[11px] bg-white border border-slate-300 px-2 py-0.5 rounded text-blue-700 font-semibold"
              >
                {mobileMenuOpen ? 'Close Drawer Preview' : 'Test Open Mobile Drawer'}
              </button>
            </div>

            <div className="p-4 bg-white relative">
              {/* Mobile Top Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    N
                  </div>
                  <span className="font-bold text-slate-900 text-xs">Apex Grooming</span>
                </div>

                <div className="flex items-center gap-2">
                  <a href="tel:+919876543210" className="p-2 text-slate-700 bg-slate-100 rounded-full">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-slate-700 bg-slate-100 rounded-md"
                    aria-label="Toggle navigation menu"
                  >
                    {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Simulated Drawer Open State */}
              {mobileMenuOpen && (
                <div className="mt-3 p-4 bg-slate-900 text-white rounded-xl space-y-4 animate-in fade-in duration-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Mobile Navigation Drawer (All 7 Pages)
                  </div>
                  <ul className="space-y-2 text-sm font-medium">
                    {PUBLIC_NAV_SPEC.links.map((link) => (
                      <li key={link.label} className="border-b border-slate-800 pb-1.5 flex items-center justify-between">
                        <span>{link.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                    <button className="flex-1 py-2 bg-slate-800 text-slate-200 rounded font-medium">
                      Sign In
                    </button>
                    <button className="flex-1 py-2 bg-slate-800 text-slate-200 rounded font-medium">
                      Sign Up
                    </button>
                  </div>

                  <button className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded shadow-sm">
                    Book Appointment Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
