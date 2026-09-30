import React, { useState } from 'react';
import {
  TYPOGRAPHY_TOKENS,
  SPACING_TOKENS,
  CONTAINER_TOKENS,
  ELEVATION_TOKENS,
  COMPONENT_RULES,
  CATEGORY_THEME_ARCHITECTURES,
  ACCESSIBILITY_RULES,
  CategoryThemeOverride,
  ComponentStyleRule
} from '../data/phase21DesignFoundationData';
import {
  Palette,
  Type,
  Maximize2,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Eye,
  Layers,
  ArrowRight,
  ChevronRight,
  Lock,
  Search,
  Grid
} from 'lucide-react';

export const Phase21DesignFoundationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'typography' | 'spacing' | 'responsive' | 'components' | 'categories' | 'accessibility'>('tokens');
  const [selectedTheme, setSelectedTheme] = useState<CategoryThemeOverride>(CATEGORY_THEME_ARCHITECTURES[0]);
  const [selectedRule, setSelectedRule] = useState<ComponentStyleRule>(COMPONENT_RULES[0]);
  const [componentFilter, setComponentFilter] = useState<string>('All');

  const filteredComponentRules = componentFilter === 'All'
    ? COMPONENT_RULES
    : COMPONENT_RULES.filter((c) => c.category === componentFilter);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Phase 2.1 Active
              </span>
              <span className="text-xs text-slate-500 font-mono">Visual Design Foundation & Token Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Nexora SalonOS: Design Foundation & Tokens
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Strictly establishing typography scales, geometric spacing, elevation tokens, 25 component styling contracts, 
              4 responsive breakpoints, 10 category theme override architectures, and WCAG 2.2 AA accessibility rules.
            </p>
          </div>

          <div className="flex items-center">
            <div className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PHASE 2.1 COMPLETE — WAITING FOR NEXT SECTION</span>
            </div>
          </div>
        </div>

        {/* Phase 2.1 Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-200 mt-6 pt-4 text-xs font-medium scrollbar-thin">
          {[
            { id: 'tokens', label: 'A. Design Tokens', icon: Palette },
            { id: 'typography', label: 'B. Typography Scale', icon: Type },
            { id: 'spacing', label: 'C. Spacing & Containers', icon: Grid },
            { id: 'responsive', label: 'D. Breakpoints', icon: Smartphone },
            { id: 'components', label: 'E. Component Rules (25)', icon: Sliders },
            { id: 'categories', label: 'F. 10 Category Themes', icon: Sparkles },
            { id: 'accessibility', label: 'G. WCAG 2.2 AA Rules', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

      {/* SECTION A: DESIGN TOKEN STRUCTURE */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          {/* Aesthetic Boundary Contract */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-sm mb-0.5">Strict Visual Boundary Contract (Zero AI-Slop Discipline)</strong>
              <span>
                Engineered exclusively for premium salon SaaS. Strictly prohibited: cheap template styling, excessive glassmorphism, 
                muddy gradients, cartoonishly round cards, or heavy drop shadows. All surfaces adhere to clean 1px borders, subtle elevation tokens, 
                and high-contrast typography.
              </span>
            </div>
          </div>

          {/* Color & Border Tokens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Semantic Neutrals & Surface Colors</h3>
                <p className="text-xs text-slate-500">Universal tokens applied across public templates and admin shell.</p>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Canvas Base', hex: '#FAFAFA', desc: 'Global page body background' },
                  { name: 'Surface Default', hex: '#FFFFFF', desc: 'Card surfaces, modals, popovers' },
                  { name: 'Surface Subdued', hex: '#F4F4F5', desc: 'Input field backgrounds, muted containers' },
                  { name: 'Border Subtle', hex: '#E4E4E7', desc: 'Internal dividers, table row borders, card outlines' },
                  { name: 'Border Strong', hex: '#D4D4D8', desc: 'Interactive input borders, active tab borders' },
                  { name: 'Text Subdued', hex: '#71717A', desc: 'Placeholder text, secondary metadata (4.5:1 on dark)' },
                  { name: 'Text Secondary', hex: '#3F3F46', desc: 'Body copy, descriptions (7.2:1 contrast ratio)' },
                  { name: 'Text Primary', hex: '#18181B', desc: 'Headlines, prices, primary titles (15.3:1 contrast ratio)' }
                ].map((c) => (
                  <div key={c.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded border border-slate-300 shadow-xs shrink-0" style={{ backgroundColor: c.hex }} />
                      <div>
                        <strong className="text-slate-900 block">{c.name}</strong>
                        <span className="text-[11px] text-slate-500">{c.desc}</span>
                      </div>
                    </div>
                    <code className="text-[11px] font-mono font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                      {c.hex}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            {/* System Feedback & Elevation */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">System Feedback & Elevation Tokens</h3>
                <p className="text-xs text-slate-500">Booking states, payment indicators, and geometric depths.</p>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Confirmed / Paid', hex: '#15803D', bg: '#DCFCE7', desc: 'Active appointments, successful settlements' },
                  { name: 'Pending / Advance Due', hex: '#B45309', bg: '#FEF3C7', desc: 'Pending advance deposit, awaiting confirmation' },
                  { name: 'Cancelled / Refund', hex: '#B91C1C', bg: '#FEE2E2', desc: 'Cancelled bookings, refund processed, off duty' },
                  { name: 'In-Service Active', hex: '#0369A1', bg: '#E0F2FE', desc: 'Active chair service timer, in-progress treatment' }
                ].map((f) => (
                  <div key={f.name} className="flex items-center justify-between p-2 rounded-lg text-xs" style={{ backgroundColor: f.bg }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.hex }} />
                      <strong style={{ color: f.hex }}>{f.name}</strong>
                    </div>
                    <span className="text-[11px] text-slate-600 font-medium">{f.desc}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">Shadow & Elevation Scale</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {ELEVATION_TOKENS.shadows.map((s) => (
                    <div key={s.token} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <code className="text-[10px] font-mono text-blue-600 block">{s.token}</code>
                      <span className="text-slate-800 font-medium text-[11px] block mt-0.5">{s.usage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: TYPOGRAPHY SCALE */}
      {activeTab === 'typography' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Section B: Typography Scale & Typographic Tokens</h3>
            <p className="text-xs text-slate-500">
              Responsive typographical scale enforcing geometric vertical rhythm, line heights, letter spacing, and semantic tag mapping.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Hierarchy Level</th>
                  <th className="py-2.5 px-3 font-semibold">HTML Tag</th>
                  <th className="py-2.5 px-3 font-semibold">Desktop / Mobile Size</th>
                  <th className="py-2.5 px-3 font-semibold">Line Height</th>
                  <th className="py-2.5 px-3 font-semibold">Letter Spacing</th>
                  <th className="py-2.5 px-3 font-semibold">Font Weight</th>
                  <th className="py-2.5 px-3 font-semibold">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {TYPOGRAPHY_TOKENS.map((t) => (
                  <tr key={t.level} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{t.level}</td>
                    <td className="py-2.5 px-3 font-mono text-blue-600 text-[11px]">{t.element}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{t.sizePx}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{t.lineHeight}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{t.letterSpacing}</td>
                    <td className="py-2.5 px-3 text-slate-700">{t.weight}</td>
                    <td className="py-2.5 px-3 text-slate-500">{t.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION C: SPACING & CONTAINER WIDTHS */}
      {activeTab === 'spacing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Section C: Spacing Scale (4px/8px Geometric Grid)</h3>
              <p className="text-xs text-slate-500">
                Spatial harmony tokens ensuring mathematical consistency across mobile, tablet, and widescreen layouts.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {SPACING_TOKENS.map((s) => (
                <div key={s.token} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <code className="font-mono text-blue-700 font-bold">{s.token}</code>
                    <span className="font-mono font-semibold text-slate-900">{s.px}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mb-1">{s.rem}</div>
                  <p className="text-[11px] text-slate-600 leading-tight">{s.usage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Container Widths & 12-Column Grid */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Container Widths & 12-Column Grid Architecture</h3>
              <p className="text-xs text-slate-500">
                Container constraints, responsive gutters, column counts, and spatial gutters across viewports.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {CONTAINER_TOKENS.map((c) => (
                <div key={c.name} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                      {c.breakpoint}
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-600 text-[11px]">
                    <p><strong className="text-slate-800">Max Container:</strong> {c.maxWidth}</p>
                    <p><strong className="text-slate-800">Side Gutter:</strong> {c.gutter}</p>
                    <p><strong className="text-slate-800">Column Count:</strong> {c.columns} Columns</p>
                    <p><strong className="text-slate-800">Column Gap:</strong> {c.gap}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION D: RESPONSIVE BREAKPOINTS */}
      {activeTab === 'responsive' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Section D: Responsive Breakpoint Rules</h3>
            <p className="text-xs text-slate-500">
              Clear viewport rules for Mobile (360px+), Tablet (768px+), Desktop (1024px+), and Large Desktop (1440px+).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-slate-700" />
                  <strong className="text-slate-900 text-sm">Mobile Breakpoint (360px – 767px)</strong>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono text-[10px]">360px+</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li><strong>Touch Minimum:</strong> All interactive buttons and slots have min-height 48px.</li>
                <li><strong>Navigation:</strong> Slide-out drawer overlay; persistent sticky bottom "Book Now" CTA.</li>
                <li><strong>Data Grids:</strong> Tables collapse into stacked 3-line vertical summary cards.</li>
                <li><strong>Booking Stepper:</strong> Single-column full width with step dots indicator.</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-slate-700" />
                  <strong className="text-slate-900 text-sm">Tablet Breakpoint (768px – 1023px)</strong>
                </div>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-mono text-[10px]">768px+</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li><strong>Grid Layout:</strong> 2-column cards for services, specialists, and packages.</li>
                <li><strong>Navigation:</strong> Horizontal links with primary CTA button in top bar.</li>
                <li><strong>Booking Flow:</strong> 2-column split (Left 40% sticky summary, Right 60% step content).</li>
                <li><strong>Admin Shell:</strong> Sidebar collapses to 64px icon rail or sheet drawer.</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-slate-700" />
                  <strong className="text-slate-900 text-sm">Desktop Standard (1024px – 1439px)</strong>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px]">1024px+</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li><strong>Admin Shell:</strong> 260px fixed persistent left sidebar with smooth internal scroll.</li>
                <li><strong>Tables:</strong> Full multi-column data table with sortable column headers and row actions.</li>
                <li><strong>Public Website:</strong> 3-column service grid, 4-column specialist grid, side-by-side hero.</li>
                <li><strong>Website Builder:</strong> Full 3-pane layout (Left Tree 280px + Center Canvas + Right 320px).</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-700" />
                  <strong className="text-slate-900 text-sm">Large Desktop / Widescreen (1440px+)</strong>
                </div>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono text-[10px]">1440px+</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li><strong>Max-Width Lock:</strong> Content containers locked at 1280px or 1400px to prevent awkward stretching.</li>
                <li><strong>Spatial Breathing Room:</strong> 80px to 96px vertical section padding for luxury presentation.</li>
                <li><strong>Data Density:</strong> Comprehensive audit ledger visible without horizontal scrolling.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION E: COMPONENT STYLING RULES (25 ITEMS) */}
      {activeTab === 'components' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List of Component Rules */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Component Rules ({COMPONENT_RULES.length})
              </h3>
              <select
                value={componentFilter}
                onChange={(e) => setComponentFilter(e.target.value)}
                className="text-[11px] border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700"
              >
                <option value="All">All Categories</option>
                <option value="Primitives & Inputs">Primitives & Inputs</option>
                <option value="Surfaces & Feedback">Surfaces & Feedback</option>
                <option value="Navigation & Layout">Navigation & Layout</option>
              </select>
            </div>

            <div className="space-y-1 max-h-[560px] overflow-y-auto">
              {filteredComponentRules.map((rule) => {
                const isSelected = selectedRule.name === rule.name;
                return (
                  <button
                    key={rule.name}
                    onClick={() => setSelectedRule(rule)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold shadow-sm'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{rule.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0 ml-1" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Component Rule Inspector */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                  {selectedRule.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedRule.name}
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {selectedRule.dimensions}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1">Anatomy</h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {selectedRule.anatomy}
              </p>
            </div>

            {/* Tokens */}
            <div>
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">Token Mappings</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Background</span>
                  <code className="text-slate-800 font-mono text-[11px]">{selectedRule.tokens.background}</code>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Border</span>
                  <code className="text-slate-800 font-mono text-[11px]">{selectedRule.tokens.border}</code>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Text Color</span>
                  <code className="text-slate-800 font-mono text-[11px]">{selectedRule.tokens.text}</code>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase">Radius</span>
                  <code className="text-slate-800 font-mono text-[11px]">{selectedRule.tokens.radius}</code>
                </div>
              </div>
            </div>

            {/* States */}
            <div>
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">Interactive States</h4>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900">Default:</strong> <span className="text-slate-600">{selectedRule.states.default}</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900">Hover:</strong> <span className="text-slate-600">{selectedRule.states.hover}</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900">Focus:</strong> <span className="text-slate-600">{selectedRule.states.focus}</span>
                </div>
                {selectedRule.states.error && (
                  <div className="p-2 rounded bg-red-50/60 border border-red-200">
                    <strong className="text-red-900">Error:</strong> <span className="text-red-700">{selectedRule.states.error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Accessibility Note */}
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Accessibility Standard: </strong>
                <span>{selectedRule.accessibilityNote}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION F: 10 CATEGORY THEME ARCHITECTURES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Section F: Category Theme Architecture (10 Salon Categories)</h3>
              <p className="text-xs text-slate-500">
                Single unified architecture with 12 distinct token override slots per category. Zero code duplication.
              </p>
            </div>

            {/* Category Switcher Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORY_THEME_ARCHITECTURES.map((theme) => {
                const isSelected = selectedTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-semibold truncate">{theme.categoryName}</div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {theme.buttonStyle.split(' ')[0]} {theme.buttonStyle.split(' ')[1]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 12-Slot Override Inspector */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{selectedTheme.categoryName}</h4>
                  <p className="text-xs text-slate-600">{selectedTheme.personality}</p>
                </div>
                <span className="text-xs font-mono bg-slate-200 text-slate-800 px-2 py-0.5 rounded w-fit">
                  Theme ID: {selectedTheme.id}
                </span>
              </div>

              {/* 12 Token Override Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">1. Primary Token</span>
                  <span className="font-mono text-slate-900 font-semibold mt-0.5 block">{selectedTheme.primary}</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">2. Secondary Token</span>
                  <span className="font-mono text-slate-900 font-semibold mt-0.5 block">{selectedTheme.secondary}</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">3. Accent Token</span>
                  <span className="font-mono text-slate-900 font-semibold mt-0.5 block">{selectedTheme.accent}</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">4. Background Token</span>
                  <span className="font-mono text-slate-900 font-semibold mt-0.5 block">{selectedTheme.background}</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">5. Surface Token</span>
                  <span className="font-mono text-slate-900 font-semibold mt-0.5 block">{selectedTheme.surface}</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">6. Text Token</span>
                  <span className="font-mono text-slate-900 font-semibold mt-0.5 block">{selectedTheme.text}</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">7. Muted Text Token</span>
                  <span className="font-mono text-slate-900 font-semibold mt-0.5 block">{selectedTheme.mutedText}</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">8. Border Token</span>
                  <span className="font-mono text-slate-900 font-semibold mt-0.5 block">{selectedTheme.border}</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">9. Button Style</span>
                  <span className="text-slate-800 text-[11px] mt-0.5 block">{selectedTheme.buttonStyle}</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">10. Typography Personality</span>
                  <span className="text-slate-800 text-[11px] mt-0.5 block">
                    {selectedTheme.typographyPersonality.headingFont} + {selectedTheme.typographyPersonality.bodyFont}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">11. Card Style</span>
                  <span className="text-slate-800 text-[11px] mt-0.5 block">{selectedTheme.cardStyle}</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">12. Image Treatment</span>
                  <span className="text-slate-800 text-[11px] mt-0.5 block">{selectedTheme.imageTreatment}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION G: ACCESSIBILITY RULES */}
      {activeTab === 'accessibility' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Section G: Accessibility Rules (WCAG 2.2 AA Principles)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Mandatory tokens and design constraints safeguarding contrast, visible focus, touch targets, reduced motion, and error handling.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-slate-900 font-semibold text-sm">1. Accessible Contrast Ratios</strong>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px]">WCAG 1.4.3 & 1.4.11</span>
              </div>
              <p className="text-slate-600">{ACCESSIBILITY_RULES.contrast.normalText}</p>
              <div className="mt-2 text-[11px] text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                <strong>Token Rule:</strong> {ACCESSIBILITY_RULES.contrast.tokenEnforcement}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-slate-900 font-semibold text-sm">2. Visible Focus States</strong>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px]">WCAG 2.4.7 & 2.4.11</span>
              </div>
              <p className="text-slate-600">{ACCESSIBILITY_RULES.visibleFocus.specification}</p>
              <div className="mt-2 text-[11px] text-slate-700 bg-white p-2.5 rounded border border-slate-200 font-mono">
                {ACCESSIBILITY_RULES.visibleFocus.tokenClass}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-slate-900 font-semibold text-sm">3. Touch Target Sizing</strong>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px]">WCAG 2.5.8</span>
              </div>
              <p className="text-slate-600">{ACCESSIBILITY_RULES.touchTargets.minimumSize} {ACCESSIBILITY_RULES.touchTargets.spatialMargin}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-slate-900 font-semibold text-sm">4. Reduced Motion Support</strong>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px]">WCAG 2.3.3</span>
              </div>
              <p className="text-slate-600">{ACCESSIBILITY_RULES.reducedMotion.specification}</p>
              <div className="mt-2 text-[11px] text-slate-700 bg-white p-2.5 rounded border border-slate-200 font-mono">
                {ACCESSIBILITY_RULES.reducedMotion.tokenRule}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-slate-900 font-semibold text-sm">5. Form Error States & Announcements</strong>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px]">WCAG 3.3.1 & 4.1.3</span>
              </div>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                {ACCESSIBILITY_RULES.formErrors.rules.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
