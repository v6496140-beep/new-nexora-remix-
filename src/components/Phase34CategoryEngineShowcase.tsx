import React, { useState } from 'react';
import {
  getAllCategoryIds,
  getCategoryDefinition,
  getTemplatesForCategory,
  resolveTemplateData
} from '../services/templateResolver';
import { CategoryId, TemplateDefinition } from '../types/categoryEngine';
import { Button, Card, Badge, Typography, Tabs } from '../design-system';
import {
  Layers,
  Sparkles,
  Palette,
  CheckCircle2,
  Scissors,
  Eye,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code,
  Box
} from 'lucide-react';

export const Phase34CategoryEngineShowcase: React.FC = () => {
  const categoryIds = getAllCategoryIds();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('barber');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl-barber-luxury');
  const [activeTab, setActiveTab] = useState<'resolver' | 'matrix' | 'content' | 'services'>('resolver');

  const resolved = resolveTemplateData(selectedCategory, selectedTemplateId);
  const availableTemplates = getTemplatesForCategory(selectedCategory);

  const handleCategoryChange = (cat: CategoryId) => {
    setSelectedCategory(cat);
    const tmpls = getTemplatesForCategory(cat);
    if (tmpls.length > 0) {
      setSelectedTemplateId(tmpls[0].templateId);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Scope Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Phase 3.4 Implementation Mode
              </span>
              <span className="text-xs text-slate-400 font-mono">10 Categories · 24 Reusable Templates</span>
            </div>
            <Typography variant="h1" className="text-white">
              Category & Template Configuration Engine
            </Typography>
            <Typography variant="small" className="text-slate-400 mt-1 max-w-3xl">
              One Codebase. One Component System. Infinite Category Blueprints. Adding any new industry requires zero code changes to core website renderers.
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-xs text-emerald-400 font-mono font-bold rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolver Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Category Horizontal Pill Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categoryIds.map((catId) => {
          const def = getCategoryDefinition(catId);
          const isSelected = selectedCategory === catId;
          const templateCount = getTemplatesForCategory(catId).length;

          return (
            <button
              key={catId}
              onClick={() => handleCategoryChange(catId)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-102'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{def?.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {templateCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Navigation Sub-Tabs */}
      <Tabs
        tabs={[
          { id: 'resolver', label: '1. Central Template Resolver', badge: 'Live' },
          { id: 'matrix', label: '2. 24 Seeded Templates Matrix', badge: '24' },
          { id: 'content', label: '3. Structured Content Objects', badge: 'JSON' },
          { id: 'services', label: '4. Default Services & Packages', badge: 'Menu' }
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* TAB 1: CENTRAL TEMPLATE RESOLVER */}
      {activeTab === 'resolver' && resolved && (
        <div className="space-y-6">
          {/* Template Selector Cards for Active Category */}
          <div className="space-y-2">
            <Typography variant="label">Available Templates for {resolved.category.name}:</Typography>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {availableTemplates.map((tmpl) => {
                const isTmplSelected = selectedTemplateId === tmpl.templateId;
                return (
                  <div
                    key={tmpl.templateId}
                    onClick={() => setSelectedTemplateId(tmpl.templateId)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isTmplSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-600/30 bg-indigo-50/40 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {tmpl.layout}
                      </span>
                      <Badge variant="brand">{tmpl.theme}</Badge>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mt-2">{tmpl.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {tmpl.defaultContent.hero?.subtitle || 'Pre-configured section architecture.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unified Resolution Data Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Terminology & Schema Contracts */}
            <Card padding="md" className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <Typography variant="h3">Industry Terminology Mapping</Typography>
                <Badge variant="neutral">{resolved.category.id}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Service Label</span>
                  <span className="font-bold text-slate-800">{resolved.category.terminology.service}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Staff Title</span>
                  <span className="font-bold text-slate-800">{resolved.category.terminology.staff}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Appointment Term</span>
                  <span className="font-bold text-slate-800">{resolved.category.terminology.appointment}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Seat / Suite</span>
                  <span className="font-bold text-slate-800">{resolved.category.terminology.chairOrRoom}</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1.5 text-xs">
                <span className="font-bold text-indigo-900">Booking Engine Terminology:</span>
                <p className="text-indigo-800 flex justify-between">
                  <span>Step 1:</span>
                  <span className="font-semibold">{resolved.category.bookingTerminology.selectService}</span>
                </p>
                <p className="text-indigo-800 flex justify-between">
                  <span>Step 2:</span>
                  <span className="font-semibold">{resolved.category.bookingTerminology.selectStaff}</span>
                </p>
                <p className="text-indigo-800 flex justify-between">
                  <span>CTA Action:</span>
                  <span className="font-bold">{resolved.category.bookingTerminology.confirmButton}</span>
                </p>
              </div>
            </Card>

            {/* Box 2: Bound Theme & Section Stack */}
            <Card padding="md" className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <Typography variant="h3">Bound Theme & Section Stack</Typography>
                <Badge variant="brand">Theme: {resolved.themePreset}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">Primary</span>
                  <span className="font-mono font-bold text-xs" style={{ color: resolved.themeTokens.primaryColor }}>
                    {resolved.themeTokens.primaryColor}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">Accent</span>
                  <span className="font-mono font-bold text-xs" style={{ color: resolved.themeTokens.accentColor }}>
                    {resolved.themeTokens.accentColor}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">Radius</span>
                  <span className="font-bold text-xs capitalize">{resolved.themeTokens.borderRadius}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700">Resolved Homepage Sections (DOM Order):</span>
                <div className="flex flex-wrap gap-1.5">
                  {resolved.sections.map((sec, idx) => (
                    <span key={sec} className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono font-semibold text-slate-700">
                      {idx + 1}. {sec}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: SEEDED TEMPLATES MATRIX */}
      {activeTab === 'matrix' && (
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h3">24 Seeded Website Templates Matrix</Typography>
              <Typography variant="caption">Minimum 3 for primary verticals (Barber, Salon, Beauty, Nail, Spa, Massage, Tattoo)</Typography>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Template ID</th>
                  <th className="py-3 px-4">Template Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Bound Theme</th>
                  <th className="py-3 px-4">Layout Architecture</th>
                  <th className="py-3 px-4 text-center">Sections</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categoryIds.flatMap((catId) => getTemplatesForCategory(catId)).map((t) => (
                  <tr key={t.templateId} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{t.templateId}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-800">{t.name}</td>
                    <td className="py-2.5 px-4">
                      <Badge variant="neutral">{t.category}</Badge>
                    </td>
                    <td className="py-2.5 px-4 capitalize font-semibold">{t.theme}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">{t.layout}</td>
                    <td className="py-2.5 px-4 text-center font-bold text-indigo-700">{t.sections.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: STRUCTURED CONTENT OBJECTS */}
      {activeTab === 'content' && resolved && (
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="h3">Structured Content Schema: {resolved.template.name}</Typography>
            <Badge variant="brand">{resolved.template.layout}</Badge>
          </div>

          <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800 max-h-96">
            <pre>{JSON.stringify(resolved.template.defaultContent, null, 2)}</pre>
          </div>
        </Card>
      )}

      {/* TAB 4: DEFAULT SERVICES & PACKAGES */}
      {activeTab === 'services' && resolved && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card padding="md" className="space-y-3">
            <Typography variant="h3">Default {resolved.category.name} Services</Typography>
            <div className="space-y-2">
              {resolved.defaultServices.map((srv) => (
                <div key={srv.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-start text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{srv.name}</span>
                      {srv.isPopular && <Badge variant="brand" size="sm">Popular</Badge>}
                    </div>
                    <p className="text-slate-500 mt-0.5">{srv.description}</p>
                    <span className="text-[11px] text-slate-400 font-mono">{srv.durationMinutes} mins · {srv.categoryTag}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-sm">₹{srv.basePrice}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="md" className="space-y-3">
            <Typography variant="h3">Default Experience Packages</Typography>
            <div className="space-y-2">
              {resolved.defaultPackages.map((pkg) => (
                <div key={pkg.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{pkg.name}</span>
                    {pkg.badge && <Badge variant="success" size="sm">{pkg.badge}</Badge>}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Includes: {pkg.serviceNames.join(' + ')}
                  </div>
                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-200 text-xs">
                    <span className="text-slate-500 font-mono">{pkg.totalDurationMinutes} mins total</span>
                    <div>
                      <span className="line-through text-slate-400 mr-2">₹{pkg.originalPrice}</span>
                      <span className="font-bold text-emerald-700 text-sm">₹{pkg.bundlePrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
