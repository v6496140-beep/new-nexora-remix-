import React, { useState } from 'react';
import { SEEDED_PUBLIC_BUSINESSES, getPublicBusinessBySlug, BusinessSeedData } from '../data/seededPublicBusinesses';
import { resolveTemplateData } from '../services/templateResolver';
import { PublicWebsiteRenderer } from './public/PublicWebsiteRenderer';
import { Button, Card, Badge, Typography, Tabs } from '../design-system';
import {
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Scissors,
  ArrowRight
} from 'lucide-react';

export const Phase35PublicWebsiteShowcase: React.FC = () => {
  // Active test business
  const [selectedSlug, setSelectedSlug] = useState<string>('royal-crown');
  // Simulated sub-path
  const [currentSubPath, setCurrentSubPath] = useState<string>('home');
  // Device viewport simulator
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const business = getPublicBusinessBySlug(selectedSlug) || SEEDED_PUBLIC_BUSINESSES['royal-crown'];
  const templateData = resolveTemplateData(business.category, business.templateId);

  const fullPath = currentSubPath === 'home' ? `/b/${business.slug}` : `/b/${business.slug}/${currentSubPath}`;

  const handleNavigate = (path: string) => {
    const slugPrefix = `/b/${business.slug}`;
    if (path === slugPrefix) {
      setCurrentSubPath('home');
    } else {
      setCurrentSubPath(path.replace(`${slugPrefix}/`, ''));
    }
  };

  const viewportWidthClasses = {
    desktop: 'w-full',
    tablet: 'max-w-3xl mx-auto',
    mobile: 'max-w-sm mx-auto'
  };

  return (
    <div className="space-y-6 text-left">
      {/* Scope Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Phase 3.5 Implementation Mode
              </span>
              <span className="text-xs text-slate-400 font-mono">Dynamic Multi-Tenant Public Website Engine</span>
            </div>
            <Typography variant="h1" className="text-white">
              Public Business Website Foundation
            </Typography>
            <Typography variant="small" className="text-slate-400 mt-1 max-w-3xl">
              Clean component composition rendering dynamically from business metadata + category schema + template architecture + theme tokens. Tested across Barber, Spa, Nail, and Tattoo verticals.
            </Typography>
          </div>

          {/* Viewport Width Controls */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewportMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewportMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewportMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (380px)"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Required Category Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2 shrink-0">Test Verticals:</span>
          {[
            { slug: 'royal-crown', label: '1. Barber & Men Grooming', cat: 'Barber' },
            { slug: 'zenith-spa', label: '2. Spa & Sanctuary', cat: 'Spa' },
            { slug: 'gloss-chic', label: '3. Nail & Lash Studio', cat: 'Nail' },
            { slug: 'mono-tattoo', label: '4. Tattoo & Body Art', cat: 'Tattoo' }
          ].map((item) => (
            <button
              key={item.slug}
              onClick={() => {
                setSelectedSlug(item.slug);
                setCurrentSubPath('home');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                selectedSlug === item.slug
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{item.label}</span>
              <Badge variant="brand" size="sm">{item.cat}</Badge>
            </button>
          ))}
        </div>

        {/* Sub-page Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          {[
            { id: 'home', label: 'Home' },
            { id: 'services', label: 'Services' },
            { id: 'packages', label: 'Packages' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'about', label: 'About' },
            { id: 'contact', label: 'Contact' },
            { id: 'book', label: 'Book Flow' }
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setCurrentSubPath(sub.id)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                currentSubPath === sub.id
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Website Render Frame */}
      {templateData && (
        <div className={`transition-all duration-300 ${viewportWidthClasses[viewportMode]}`}>
          <div className="rounded-3xl border border-slate-300 shadow-2xl overflow-hidden bg-white">
            {/* Top URL Bar Preview */}
            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-200 font-bold ml-2">https://nexora.app{fullPath}</span>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-[11px]">
                <span>Template: <strong>{templateData.template.name}</strong></span>
                <span>·</span>
                <span>Theme: <strong className="text-amber-400">{templateData.themePreset}</strong></span>
              </div>
            </div>

            {/* Public Business Shell Output */}
            <div
              className="p-4 sm:p-6 min-h-[650px]"
              style={{
                backgroundColor: templateData.themeTokens.backgroundColor,
                color: templateData.themeTokens.textColor
              }}
            >
              <PublicWebsiteRenderer
                business={business}
                templateData={templateData}
                currentPath={fullPath}
                onNavigate={handleNavigate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
