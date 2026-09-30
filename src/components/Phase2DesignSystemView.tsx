import React, { useState } from 'react';
import {
  DESIGN_TOKENS,
  CATEGORY_THEMES,
  TYPOGRAPHY_SYSTEM,
  PUBLIC_COMPONENT_SYSTEM,
  ADMIN_COMPONENT_SYSTEM,
  WEBSITE_BUILDER_SPEC,
  RESPONSIVE_RULES,
  ACCESSIBILITY_SPECIFICATIONS,
  WIREFRAME_UI_MAPPINGS,
  CategoryTheme,
  ComponentSpec
} from '../data/phase2DesignSystemData';
import {
  Palette,
  Type,
  Layout,
  Sliders,
  CheckCircle2,
  Smartphone,
  Tablet,
  Monitor,
  ShieldCheck,
  Compass,
  ArrowRight,
  Eye,
  Layers,
  Code2,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Lock,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export const Phase2DesignSystemView: React.FC = () => {
  const [subTab, setSubTab] = useState<string>('deliverables');
  const [selectedCategoryTheme, setSelectedCategoryTheme] = useState<CategoryTheme>(CATEGORY_THEMES[0]);
  const [selectedPublicComp, setSelectedPublicComp] = useState<ComponentSpec>(PUBLIC_COMPONENT_SYSTEM[0]);
  const [selectedAdminComp, setSelectedAdminComp] = useState<ComponentSpec>(ADMIN_COMPONENT_SYSTEM[0]);
  const [builderViewport, setBuilderViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedBuilderSection, setSelectedBuilderSection] = useState<string>('Hero');

  return (
    <div className="space-y-6">
      {/* Phase 2 Header & Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Phase 2 Specification Mode
              </span>
              <span className="text-xs text-slate-500 font-mono">Nexora SalonOS Design System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Design System & UI Component Specifications
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Production-grade architectural blueprints for the Public Salon Website, Admin Multi-Tenant Shell, 
              and Website Builder Studio. Strictly structural, tokens-grounded, and WCAG 2.2 AA compliant.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PHASE 2 COMPLETE — WAITING FOR IMPLEMENTATION APPROVAL</span>
            </div>
          </div>
        </div>

        {/* Phase 2 Internal Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-200 mt-6 pt-4 text-xs font-medium scrollbar-thin">
          {[
            { id: 'deliverables', label: '11 Deliverables Matrix', icon: CheckCircle2 },
            { id: 'tokens', label: 'Design Tokens & Typography', icon: Palette },
            { id: 'category-themes', label: '10 Category Themes', icon: Sparkles },
            { id: 'public-components', label: 'Public Component System (15)', icon: Layout },
            { id: 'admin-components', label: 'Admin Component System (18)', icon: Sliders },
            { id: 'builder-ui', label: 'Website Builder Studio UI', icon: Code2 },
            { id: 'responsive', label: 'Responsive Rules (360px–1440px)', icon: Smartphone },
            { id: 'accessibility', label: 'WCAG 2.2 AA Accessibility', icon: ShieldCheck },
            { id: 'mapping', label: 'Wireframe → UI Mapping', icon: Compass }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
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

      {/* SUB-VIEW 1: 11 DELIVERABLES MATRIX */}
      {subTab === 'deliverables' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                num: '1',
                title: 'Design Tokens',
                summary: 'Colors, Spacing (4px–80px), Radii (0px–9999px), Elevation shadows, and z-index layers.',
                targetTab: 'tokens',
                badge: 'Complete'
              },
              {
                num: '2',
                title: 'Category Theme System',
                summary: '10 tailored salon niche themes (Barber, Spa, Tattoo, Nails, etc.) with fonts, colors, and button styles.',
                targetTab: 'category-themes',
                badge: '10 Categories'
              },
              {
                num: '3',
                title: 'Typography System',
                summary: 'Scale (11px to 48px), line heights, font weights, and 4 high-contrast font pairings.',
                targetTab: 'tokens',
                badge: 'Complete'
              },
              {
                num: '4',
                title: 'Component Inventory',
                summary: '33 total components (15 Public + 18 Admin) with full property schemas and variants.',
                targetTab: 'public-components',
                badge: '33 Components'
              },
              {
                num: '5',
                title: 'Component Hierarchy',
                summary: 'Atomic architecture: Atoms (Badges, Buttons) → Molecules (Cards, Inputs) → Organisms (Navbar, Grid) → Shells.',
                targetTab: 'public-components',
                badge: 'Strict Hierarchy'
              },
              {
                num: '6',
                title: 'Responsive Rules',
                summary: 'Detailed viewport guidelines for 360px+, 768px+, 1024px+, and 1440px+ across mobile nav, tables, and forms.',
                targetTab: 'responsive',
                badge: '4 Breakpoints'
              },
              {
                num: '7',
                title: 'Public Website UI Spec',
                summary: 'Complete technical specification for all 15 public components from Hero to Sticky Booking CTA.',
                targetTab: 'public-components',
                badge: '15 Specs'
              },
              {
                num: '8',
                title: 'Admin UI Specification',
                summary: 'Detailed specification for multi-tenant AppShell, Drawers, Calendar, Tables, and Financial Cards.',
                targetTab: 'admin-components',
                badge: '18 Specs'
              },
              {
                num: '9',
                title: 'Website Builder UI Spec',
                summary: 'Streamlined 4-zone editor layout: Top Bar, Left Section Tree, Center Live Canvas, Right Property Inspector.',
                targetTab: 'builder-ui',
                badge: '4-Zone Studio'
              },
              {
                num: '10',
                title: 'Accessibility Specification',
                summary: 'WCAG 2.2 AA compliance rules for focus rings, touch targets (44px), contrast ratios, and ARIA announcements.',
                targetTab: 'accessibility',
                badge: 'WCAG 2.2 AA'
              },
              {
                num: '11',
                title: 'Page-to-Component Mapping',
                summary: 'Direct mapping from all 50+ Phase 1 wireframe screens to reusable UI components, data needs, and responsive rules.',
                targetTab: 'mapping',
                badge: '100% Mapped'
              }
            ].map((item) => (
              <div
                key={item.num}
                onClick={() => setSubTab(item.targetTab)}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center">
                    {item.num}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {item.summary}
                </p>
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <span>Inspect Specification</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Component Hierarchy Diagram */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              <span>Deliverable 5: Architectural Component Hierarchy</span>
            </h2>
            <p className="text-xs text-slate-600 mb-4">
              How Nexora SalonOS organizes reusable UI building blocks from primitive atoms to composed page templates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px] uppercase">
                  Level 1 · Atoms
                </span>
                <h4 className="font-semibold text-slate-900 mt-2 mb-1">Primitive Tokens & Controls</h4>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>BookingButton (44px min)</li>
                  <li>PriceDisplay (Tabular nums)</li>
                  <li>StatusBadge (Dot & text)</li>
                  <li>Input & Select controls</li>
                  <li>Design tokens & color fills</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold text-[10px] uppercase">
                  Level 2 · Molecules
                </span>
                <h4 className="font-semibold text-slate-900 mt-2 mb-1">Compound Cards & Blocks</h4>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>ServiceCard (Price + Duration)</li>
                  <li>PackageCard (Multi-bundle)</li>
                  <li>StaffCard (Avatar + Rating)</li>
                  <li>OpeningHours (7-day list)</li>
                  <li>FilterBar & Search field</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[10px] uppercase">
                  Level 3 · Organisms
                </span>
                <h4 className="font-semibold text-slate-900 mt-2 mb-1">Structured Complex Sections</h4>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>Navbar (Header + drawer)</li>
                  <li>Hero (Split / Centered)</li>
                  <li>GalleryGrid (Masonry / Tiles)</li>
                  <li>DataTable (Sortable rows)</li>
                  <li>Calendar (Staff resource lanes)</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px] uppercase">
                  Level 4 · Shells & Pages
                </span>
                <h4 className="font-semibold text-slate-900 mt-2 mb-1">Master Layouts & Views</h4>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>Public Website Template</li>
                  <li>Multi-Tenant AppShell</li>
                  <li>Website Builder Studio</li>
                  <li>Mobile-First Booking Drawer</li>
                  <li>Platform Admin Console</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: DESIGN TOKENS & TYPOGRAPHY */}
      {subTab === 'tokens' && (
        <div className="space-y-6">
          {/* Design Tokens Groups */}
          <div className="space-y-4">
            {DESIGN_TOKENS.map((group, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="mb-3">
                  <h3 className="font-bold text-slate-900 text-sm">{group.category}</h3>
                  <p className="text-xs text-slate-500">{group.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {group.tokens.map((token, tIdx) => (
                    <div key={tIdx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-slate-800">{token.name}</span>
                        <code className="text-[10px] bg-slate-200 px-1 py-0.5 rounded text-slate-700 font-mono">
                          {token.token}
                        </code>
                      </div>
                      <div className="font-mono text-slate-900 font-medium text-xs mb-1">
                        {token.value}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {token.usage}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Typography Scale */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-700" />
              <span>Deliverable 3: Typography System Scale & Pairings</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Responsive typographical scale enforcing geometric vertical rhythm and maximum readability.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                    <th className="py-2.5 px-3 font-semibold">Hierarchy Level</th>
                    <th className="py-2.5 px-3 font-semibold">Desktop / Mobile Size</th>
                    <th className="py-2.5 px-3 font-semibold">Line Height</th>
                    <th className="py-2.5 px-3 font-semibold">Font Weight</th>
                    <th className="py-2.5 px-3 font-semibold">Application Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {TYPOGRAPHY_SYSTEM.scale.map((lvl, lIdx) => (
                    <tr key={lIdx} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{lvl.level}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{lvl.size}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{lvl.lineHeight}</td>
                      <td className="py-2.5 px-3 text-slate-700">{lvl.weight}</td>
                      <td className="py-2.5 px-3 text-slate-500">{lvl.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Typography Pairings */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
                Curated Category Font Pairings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {TYPOGRAPHY_SYSTEM.pairings.map((p, pIdx) => (
                  <div key={pIdx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-900 block mb-1">{p.vibe}</span>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <p><strong className="text-slate-700">Heading:</strong> {p.heading}</p>
                      <p><strong className="text-slate-700">Body:</strong> {p.body}</p>
                      <p className="text-[10px] text-slate-500 italic mt-1">{p.tone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: 10 CATEGORY THEME SYSTEM */}
      {subTab === 'category-themes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Deliverable 2: Category Theme System (10 Salon Niches)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select any of the 10 business categories to inspect its tailored design tokens, typography, hero layout, and button styling.
            </p>

            {/* Category Select Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
              {CATEGORY_THEMES.map((theme) => {
                const isSelected = selectedCategoryTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedCategoryTheme(theme)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-semibold truncate">{theme.name}</div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {theme.buttonStyle}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Theme Spec Card */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedCategoryTheme.accentColor }} />
                    <h4 className="font-bold text-slate-900 text-lg">{selectedCategoryTheme.name} Theme</h4>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                      {selectedCategoryTheme.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedCategoryTheme.tagline}</p>
                </div>

                <div className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Brand Vibe:</span> {selectedCategoryTheme.brandVibe}
                </div>
              </div>

              {/* Theme Tokens Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Accent Color</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: selectedCategoryTheme.accentColor }} />
                    <code className="font-mono text-xs">{selectedCategoryTheme.accentColor}</code>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Heading Typography</span>
                  <div className="font-medium text-slate-800 mt-1 truncate">
                    {selectedCategoryTheme.fontFamilyHeading}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Border Radius Token</span>
                  <div className="font-mono text-slate-800 mt-1">
                    {selectedCategoryTheme.borderRadius}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Hero Layout Style</span>
                  <div className="font-medium text-slate-800 mt-1">
                    {selectedCategoryTheme.heroLayout}
                  </div>
                </div>
              </div>

              {/* Live Preview Sample */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Live Themed Component Sample
                </span>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${selectedCategoryTheme.accentText}`}>
                      ★ Premium Salon Treatment
                    </span>
                    <h5 className="font-bold text-slate-900 text-base mt-0.5">
                      Signature Styling & Conditioning Treatment
                    </h5>
                    <p className="text-xs text-slate-500">60 mins · ₹1,200 · ₹300 Advance (25%)</p>
                  </div>
                  <button
                    className={`px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 ${selectedCategoryTheme.borderRadius}`}
                    style={{ backgroundColor: selectedCategoryTheme.accentColor }}
                  >
                    Book Appointment Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: PUBLIC WEBSITE COMPONENT SYSTEM (15 COMPONENTS) */}
      {subTab === 'public-components' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Component List */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Public Components (15)
            </h3>
            <div className="space-y-1">
              {PUBLIC_COMPONENT_SYSTEM.map((comp) => {
                const isSelected = selectedPublicComp.name === comp.name;
                return (
                  <button
                    key={comp.name}
                    onClick={() => setSelectedPublicComp(comp)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold shadow-sm'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{comp.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Component Specification Inspector */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    Public Website Component Spec
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {selectedPublicComp.name}
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedPublicComp.props.length} Props · {selectedPublicComp.variants.length} Variants
                </span>
              </div>

              {/* Purpose */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">Purpose</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedPublicComp.purpose}
                </p>
              </div>

              {/* Props Table */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">Props Contract</h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <th className="py-2 px-3">Prop</th>
                        <th className="py-2 px-3">Type</th>
                        <th className="py-2 px-3">Required</th>
                        <th className="py-2 px-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedPublicComp.props.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-mono text-slate-800 font-medium">{p.name}</td>
                          <td className="py-2 px-3 font-mono text-blue-600 text-[11px]">{p.type}</td>
                          <td className="py-2 px-3">
                            {p.required ? (
                              <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                                Yes
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">No</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <h4 className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider mb-2">Variants</h4>
                  <ul className="space-y-1.5">
                    {selectedPublicComp.variants.map((v, idx) => (
                      <li key={idx} className="text-slate-700">
                        <strong className="text-slate-900">{v.name}:</strong> {v.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <h4 className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider mb-2">States</h4>
                  <ul className="space-y-1.5">
                    {selectedPublicComp.states.map((s, idx) => (
                      <li key={idx} className="text-slate-700">
                        <strong className="text-slate-900">{s.state}:</strong> {s.visualSpec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Responsive Behavior */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-xs">
                <h4 className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider mb-1">Responsive Behavior</h4>
                <ul className="space-y-1">
                  {selectedPublicComp.responsiveBehavior.map((r, idx) => (
                    <li key={idx} className="text-slate-600">
                      <strong className="text-slate-800">{r.breakpoint}:</strong> {r.behavior}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: ADMIN COMPONENT SYSTEM (18 COMPONENTS) */}
      {subTab === 'admin-components' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Admin Component List */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Admin Components (18)
            </h3>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {ADMIN_COMPONENT_SYSTEM.map((comp) => {
                const isSelected = selectedAdminComp.name === comp.name;
                return (
                  <button
                    key={comp.name}
                    onClick={() => setSelectedAdminComp(comp)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold shadow-sm'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{comp.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin Component Inspector */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                    Admin System Component Spec
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {selectedAdminComp.name}
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedAdminComp.props.length} Props · {selectedAdminComp.variants.length} Variants
                </span>
              </div>

              {/* Purpose */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">Purpose</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedAdminComp.purpose}
                </p>
              </div>

              {/* Props Table */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">Props Contract</h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <th className="py-2 px-3">Prop</th>
                        <th className="py-2 px-3">Type</th>
                        <th className="py-2 px-3">Required</th>
                        <th className="py-2 px-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedAdminComp.props.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-mono text-slate-800 font-medium">{p.name}</td>
                          <td className="py-2 px-3 font-mono text-purple-600 text-[11px]">{p.type}</td>
                          <td className="py-2 px-3">
                            {p.required ? (
                              <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                                Yes
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">No</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <h4 className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider mb-2">Variants</h4>
                  <ul className="space-y-1.5">
                    {selectedAdminComp.variants.map((v, idx) => (
                      <li key={idx} className="text-slate-700">
                        <strong className="text-slate-900">{v.name}:</strong> {v.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                  <h4 className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider mb-2">States</h4>
                  <ul className="space-y-1.5">
                    {selectedAdminComp.states.map((s, idx) => (
                      <li key={idx} className="text-slate-700">
                        <strong className="text-slate-900">{s.state}:</strong> {s.visualSpec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Responsive Behavior */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-xs">
                <h4 className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider mb-1">Responsive Behavior</h4>
                <ul className="space-y-1">
                  {selectedAdminComp.responsiveBehavior.map((r, idx) => (
                    <li key={idx} className="text-slate-600">
                      <strong className="text-slate-800">{r.breakpoint}:</strong> {r.behavior}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 6: WEBSITE BUILDER UI STUDIO SPECIFICATION */}
      {subTab === 'builder-ui' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Deliverable 9: Website Builder Studio UI Specification
                </h3>
                <p className="text-xs text-slate-500">
                  {WEBSITE_BUILDER_SPEC.architecture} — Simple, intuitive, and merchant-friendly.
                </p>
              </div>

              {/* Viewport switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { id: 'desktop', icon: Monitor, label: 'Desktop' },
                  { id: 'tablet', icon: Tablet, label: 'Tablet' },
                  { id: 'mobile', icon: Smartphone, label: 'Mobile' }
                ].map((vp) => {
                  const Icon = vp.icon;
                  const isActive = builderViewport === vp.id;
                  return (
                    <button
                      key={vp.id}
                      onClick={() => setBuilderViewport(vp.id as any)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors ${
                        isActive ? 'bg-white shadow-xs font-semibold text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{vp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated 4-Zone Builder Layout */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm bg-slate-100">
              {/* ZONE 1: TOP BAR */}
              <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-200">Nexora Builder</span>
                  <span className="text-slate-600">/</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-[11px]">
                    Home Page · Executive Barber
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    All changes saved
                  </span>
                  <button className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded text-xs hover:bg-slate-700">
                    Preview
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-500">
                    Publish Website
                  </button>
                </div>
              </div>

              {/* 3-COLUMN WORKSPACE: LEFT (SECTIONS) + CENTER (PREVIEW) + RIGHT (PROPERTY INSPECTOR) */}
              <div className="grid grid-cols-12 min-h-[500px]">
                {/* LEFT PANE: Page & Section List (3 cols) */}
                <div className="col-span-12 md:col-span-3 bg-white border-r border-slate-200 p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Left Pane · Sections (12)
                    </div>
                    <div className="space-y-1">
                      {[
                        'Announcement Bar',
                        'Navbar',
                        'Hero Section',
                        'Featured Services',
                        'Packages & Rituals',
                        'About & Story',
                        'Staff Specialists',
                        'Lookbook Gallery',
                        'Testimonials',
                        'Booking CTA Banner',
                        'Contact & Location',
                        'Footer'
                      ].map((sec) => {
                        const isSelected = selectedBuilderSection === sec;
                        return (
                          <div
                            key={sec}
                            onClick={() => setSelectedBuilderSection(sec)}
                            className={`px-2.5 py-1.5 rounded text-xs flex items-center justify-between cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-slate-900 text-white font-medium'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span>{sec}</span>
                            <Eye className="w-3 h-3 opacity-60" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button className="w-full mt-3 py-1.5 border border-dashed border-slate-300 text-slate-600 text-xs font-medium rounded hover:bg-slate-50">
                    + Add New Section
                  </button>
                </div>

                {/* CENTER PANE: Simulated Live Preview Canvas (6 cols) */}
                <div className="col-span-12 md:col-span-6 bg-slate-200/60 p-4 flex items-center justify-center overflow-auto">
                  <div
                    className={`bg-white rounded-lg shadow-md border border-slate-300 overflow-hidden transition-all duration-300 ${
                      builderViewport === 'mobile'
                        ? 'w-[320px] min-h-[460px]'
                        : builderViewport === 'tablet'
                        ? 'w-[480px] min-h-[460px]'
                        : 'w-full min-h-[460px]'
                    }`}
                  >
                    {/* Simulated browser header */}
                    <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <span className="font-mono text-slate-600">barbershop.nexora.app</span>
                      <Maximize2 className="w-2.5 h-2.5" />
                    </div>

                    {/* Simulated section content */}
                    <div className="p-4 space-y-4">
                      <div className="border border-dashed border-blue-400 bg-blue-50/40 p-3 rounded text-center">
                        <span className="text-[10px] uppercase font-bold text-blue-700">
                          Active Section: {selectedBuilderSection}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">
                          Master Grooming & Modern Cuts
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Experience bespoke barbering with hot towel finish.
                        </p>
                        <button className="mt-2 px-3 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold">
                          Book Appointment Now
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-left">
                        <div className="p-2 border border-slate-200 rounded bg-slate-50 text-[11px]">
                          <strong>Classic Skin Fade</strong>
                          <p className="text-slate-500">30 min · ₹600</p>
                        </div>
                        <div className="p-2 border border-slate-200 rounded bg-slate-50 text-[11px]">
                          <strong>Hot Towel Shave</strong>
                          <p className="text-slate-500">25 min · ₹450</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT PANE: Property Inspector (3 cols) */}
                <div className="col-span-12 md:col-span-3 bg-white border-l border-slate-200 p-3 text-xs space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Right Pane · Properties
                  </div>

                  <div className="font-semibold text-slate-900 border-b border-slate-100 pb-2">
                    Editing: {selectedBuilderSection}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">Headline Text</label>
                      <input
                        type="text"
                        defaultValue="Master Grooming & Modern Cuts"
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">Subheadline</label>
                      <textarea
                        rows={2}
                        defaultValue="Experience bespoke barbering with hot towel finish."
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">Primary Button CTA</label>
                      <input
                        type="text"
                        defaultValue="Book Appointment Now"
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">Background Surface</label>
                      <select className="w-full px-2 py-1 border border-slate-300 rounded text-xs">
                        <option>Clean White (Neutral-0)</option>
                        <option>Subdued Gray (Neutral-50)</option>
                        <option>Dark Accent (Theme Base)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <button className="text-slate-500 hover:text-slate-800">Reset Defaults</button>
                    <button className="px-2.5 py-1 bg-slate-900 text-white rounded font-medium">Apply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 7: RESPONSIVE RULES (360px to 1440px) */}
      {subTab === 'responsive' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Deliverable 6: Responsive Breakpoint Rules (360px+ to 1440px+)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Definitive behavioral specs for Mobile Navigation, Tablet Layouts, Desktop Sidebar, Tables, Booking Stepper, and Forms.
            </p>

            <div className="space-y-4">
              {RESPONSIVE_RULES.map((rule, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{rule.breakpoint}</span>
                      <code className="text-xs font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                        {rule.range}
                      </code>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Mobile & Tablet Navigation</strong>
                      <p className="text-slate-600">{rule.mobileNav}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Tables & Data Grids</strong>
                      <p className="text-slate-600">{rule.tables}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Booking Flow & Steppers</strong>
                      <p className="text-slate-600">{rule.bookingFlow}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Forms & Input Targets</strong>
                      <p className="text-slate-600">{rule.forms}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Admin Shell & Sidebar</strong>
                      <p className="text-slate-600">{rule.desktopSidebar}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Website Builder Studio</strong>
                      <p className="text-slate-600">{rule.builderBehavior}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 8: WCAG 2.2 AA ACCESSIBILITY SPECIFICATION */}
      {subTab === 'accessibility' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Deliverable 10: Accessibility Specification (WCAG 2.2 AA)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Comprehensive accessibility standards enforced across all Public Salon Websites and Admin Dashboards.
            </p>

            <div className="divide-y divide-slate-200">
              {ACCESSIBILITY_SPECIFICATIONS.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <h4 className="font-semibold text-slate-900 text-sm">{item.rule}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {item.criterion}
                      </span>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {item.level}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-2">
                    {item.specification}
                  </p>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                    <strong className="text-slate-900">Implementation Token Rule: </strong>
                    {item.implementationGuideline}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 9: WIREFRAME TO UI MAPPING */}
      {subTab === 'mapping' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Deliverable 11: Wireframe → UI Component Mapping
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Direct mapping from Phase 1 wireframe screens to Phase 2 reusable UI components, data schemas, and responsive rules.
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="py-3 px-3 font-semibold">Wireframe Screen</th>
                    <th className="py-3 px-3 font-semibold">User Role</th>
                    <th className="py-3 px-3 font-semibold">Assigned UI Components</th>
                    <th className="py-3 px-3 font-semibold">Required Data Schema</th>
                    <th className="py-3 px-3 font-semibold">Responsive Behavior</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {WIREFRAME_UI_MAPPINGS.map((row) => (
                    <tr key={row.screenId} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3">
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded block w-fit mb-0.5">
                          {row.screenId}
                        </span>
                        <strong className="text-slate-900 font-semibold">{row.screenName}</strong>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-800 font-medium">
                          {row.userType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {row.uiComponents.map((c, cIdx) => (
                            <span key={cIdx} className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[10px]">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-[200px]">
                        {row.dataRequired.join(' ')}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-[220px]">
                        {row.responsiveBehavior}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
