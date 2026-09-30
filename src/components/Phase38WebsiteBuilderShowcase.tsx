import React, { useState } from 'react';
import {
  WebsiteBuilderDraft,
  SectionEditorItem,
  INITIAL_BUILDER_SECTIONS,
  localWebsitePersistence
} from '../types/websiteBuilder';
import { SEEDED_PUBLIC_BUSINESSES, BusinessSeedData } from '../data/seededPublicBusinesses';
import { resolveTemplateData, ResolvedTemplateData } from '../services/templateResolver';
import {
  PublicHero,
  PublicFeaturedServices,
  PublicFeaturedPackages,
  PublicAbout,
  PublicStaff,
  PublicGallery,
  PublicTestimonials,
  PublicBookingCTA,
  PublicContact
} from './public/PublicWebsiteComponents';
import { Button, Input, Card, Badge, Typography } from '../design-system';
import {
  Eye,
  Save,
  Layers,
  ArrowUp,
  ArrowDown,
  EyeOff,
  Sparkles,
  Sliders,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Undo2,
  Globe,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronRight,
  FileText
} from 'lucide-react';

export const Phase38WebsiteBuilderShowcase: React.FC = () => {
  // Persistence Draft State
  const [draft, setDraft] = useState<WebsiteBuilderDraft>(() => {
    const defaultSlug = 'royal-crown';
    const saved = localWebsitePersistence.loadDraft(defaultSlug);
    if (saved) return saved;

    return {
      businessSlug: defaultSlug,
      businessName: 'The Royal Crown Barber & Lounge',
      category: 'barber',
      templateId: 'tmpl-barber-luxury',
      theme: 'luxury',
      activePage: 'home',
      selectedSectionId: 'sec-hero',
      pages: {
        home: {
          pageId: 'home',
          name: 'Home Page',
          sections: INITIAL_BUILDER_SECTIONS
        },
        services: {
          pageId: 'services',
          name: 'Services Menu',
          sections: [INITIAL_BUILDER_SECTIONS[1]]
        },
        packages: {
          pageId: 'packages',
          name: 'Packages & Combos',
          sections: [INITIAL_BUILDER_SECTIONS[2]]
        },
        gallery: {
          pageId: 'gallery',
          name: 'Visual Gallery',
          sections: [INITIAL_BUILDER_SECTIONS[5]]
        },
        about: {
          pageId: 'about',
          name: 'About & Ethos',
          sections: [INITIAL_BUILDER_SECTIONS[3], INITIAL_BUILDER_SECTIONS[4]]
        },
        contact: {
          pageId: 'contact',
          name: 'Contact & Hours',
          sections: [INITIAL_BUILDER_SECTIONS[8]]
        }
      },
      updatedAt: new Date().toISOString()
    };
  });

  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Active Selected Section
  const currentPageSections = draft.pages[draft.activePage]?.sections || [];
  const selectedSection = currentPageSections.find((s) => s.id === draft.selectedSectionId) || currentPageSections[0];

  // SECTION REORDERING CONTROLS
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sections = [...currentPageSections];
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index < 0) return;

    if (direction === 'up' && index > 0) {
      const temp = sections[index];
      sections[index] = sections[index - 1];
      sections[index - 1] = temp;
    } else if (direction === 'down' && index < sections.length - 1) {
      const temp = sections[index];
      sections[index] = sections[index + 1];
      sections[index + 1] = temp;
    }

    setDraft((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [prev.activePage]: {
          ...prev.pages[prev.activePage],
          sections
        }
      }
    }));
  };

  // SECTION VISIBILITY TOGGLE
  const handleToggleVisibility = (sectionId: string) => {
    const sections = currentPageSections.map((s) =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    );
    setDraft((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [prev.activePage]: {
          ...prev.pages[prev.activePage],
          sections
        }
      }
    }));
  };

  // PROPERTY FIELD UPDATE
  const handleUpdateSectionProperty = (field: keyof SectionEditorItem, value: any) => {
    if (!selectedSection) return;
    const sections = currentPageSections.map((s) =>
      s.id === selectedSection.id ? { ...s, [field]: value } : s
    );
    setDraft((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [prev.activePage]: {
          ...prev.pages[prev.activePage],
          sections
        }
      }
    }));
  };

  // SAVE TO LOCAL PERSISTENCE
  const handleSaveDraft = async () => {
    setSaveStatus('Saving changes...');
    const ok = await localWebsitePersistence.saveDraft(draft);
    if (ok) {
      setSaveStatus('Draft saved to storage!');
      setTimeout(() => setSaveStatus(''), 2500);
    } else {
      setSaveStatus('Failed to save draft.');
    }
  };

  // SYNCHRONIZED SEED BUSINESS OBJECT FOR LIVE PREVIEW
  const baseSeed = SEEDED_PUBLIC_BUSINESSES[draft.businessSlug] || SEEDED_PUBLIC_BUSINESSES['royal-crown'];
  const livePreviewBusiness: BusinessSeedData = {
    ...baseSeed,
    name: draft.businessName
  };

  // DYNAMICALLY SYNTHESIZE TEMPLATE CONTENT FROM EDITOR SECTIONS (ZERO COMPONENT DUPLICATION)
  const baseTemplateData = resolveTemplateData(draft.category, draft.templateId)!;
  const livePreviewTemplateData: ResolvedTemplateData = {
    ...baseTemplateData,
    template: {
      ...baseTemplateData.template,
      defaultContent: {
        ...baseTemplateData.template.defaultContent,
        hero: {
          badge: currentPageSections.find((s) => s.type === 'hero')?.badge,
          title: currentPageSections.find((s) => s.type === 'hero')?.heading || draft.businessName,
          subtitle: currentPageSections.find((s) => s.type === 'hero')?.description || '',
          description: '',
          primaryCTA: currentPageSections.find((s) => s.type === 'hero')?.buttonText || 'Book Chair',
          secondaryCTA: 'Explore Menu'
        },
        services: {
          badge: currentPageSections.find((s) => s.type === 'services')?.badge,
          heading: currentPageSections.find((s) => s.type === 'services')?.heading || 'Services',
          description: currentPageSections.find((s) => s.type === 'services')?.description || ''
        },
        about: {
          badge: currentPageSections.find((s) => s.type === 'about')?.badge,
          heading: currentPageSections.find((s) => s.type === 'about')?.heading || 'About Atelier',
          story: currentPageSections.find((s) => s.type === 'about')?.story || currentPageSections.find((s) => s.type === 'about')?.description || '',
          highlights: ['Master Barbers', 'UV Sterilization', '25% Advance Hold']
        }
      }
    }
  };

  const viewportWidthClasses = {
    desktop: 'w-full',
    tablet: 'max-w-2xl mx-auto',
    mobile: 'max-w-sm mx-auto'
  };

  return (
    <div className="space-y-4 text-left">
      {/* ------------------------------------------------------------- */}
      {/* TOP BAR: BUSINESS NAME, VIEWPORT SIMULATOR, SAVE ACTIONS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{draft.businessName}</span>
              <Badge variant="brand" size="sm">Editor Active</Badge>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Editing: /b/{draft.businessSlug}</span>
          </div>
        </div>

        {/* Center Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 mx-auto">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
              viewportMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
              viewportMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
              viewportMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {saveStatus && <span className="text-xs text-emerald-400 font-bold font-mono animate-pulse">{saveStatus}</span>}
          <Button size="sm" onClick={handleSaveDraft} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer">
            <Save className="w-4 h-4 mr-1" /> Save Draft
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3-COLUMN EDITOR WORKBENCH */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ============================================================= */}
        {/* LEFT PANEL: PAGES & SECTIONS (3 COLS) */}
        {/* ============================================================= */}
        <div className="lg:col-span-3 space-y-4">
          {/* Pages Navigator */}
          <Card padding="sm" className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 block">Pages Navigator:</span>
            <div className="space-y-1 text-xs">
              {[
                { id: 'home', label: 'Home Page' },
                { id: 'services', label: 'Services Menu' },
                { id: 'packages', label: 'Packages & Bundles' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'about', label: 'About & Story' },
                { id: 'contact', label: 'Contact & Location' }
              ].map((pg) => {
                const isActive = draft.activePage === pg.id;
                return (
                  <button
                    key={pg.id}
                    onClick={() => setDraft((p) => ({ ...p, activePage: pg.id as any }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                      isActive ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{pg.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Section Stack & Controls */}
          <Card padding="sm" className="space-y-2">
            <div className="flex items-center justify-between pl-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {draft.activePage.toUpperCase()} Sections ({currentPageSections.length}):
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {currentPageSections.map((sec, idx) => {
                const isSelected = selectedSection?.id === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => setDraft((p) => ({ ...p, selectedSectionId: sec.id }))}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] font-mono font-bold text-slate-400 w-3">{idx + 1}</span>
                      <span className={`font-bold truncate ${sec.visible ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                        {sec.title}
                      </span>
                    </div>

                    {/* Section Control Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSection(sec.id, 'up');
                        }}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSection(sec.id, 'down');
                        }}
                        disabled={idx === currentPageSections.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(sec.id);
                        }}
                        className={`p-1 cursor-pointer ${sec.visible ? 'text-indigo-600' : 'text-slate-400'}`}
                        title={sec.visible ? 'Hide section' : 'Show section'}
                      >
                        {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ============================================================= */}
        {/* CENTER PANEL: LIVE SAME-COMPONENT PREVIEW (6 COLS) */}
        {/* ============================================================= */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Live Website Rendering Canvas
            </span>
            <Badge variant="brand">Real-time Reactive</Badge>
          </div>

          <div className={`transition-all duration-300 ${viewportWidthClasses[viewportMode]}`}>
            <div className="rounded-3xl border border-slate-300 shadow-xl overflow-hidden bg-white min-h-[600px] p-4">
              {draft.activePage === 'home' ? (
                <div className="space-y-6">
                  {currentPageSections.map((sec) => {
                    if (!sec.visible) return null;
                    if (sec.type === 'hero') {
                      return <PublicHero key={sec.id} business={livePreviewBusiness} templateData={livePreviewTemplateData} onNavigate={() => {}} />;
                    }
                    if (sec.type === 'services') {
                      return <PublicFeaturedServices key={sec.id} business={livePreviewBusiness} templateData={livePreviewTemplateData} onNavigate={() => {}} />;
                    }
                    if (sec.type === 'packages') {
                      return <PublicFeaturedPackages key={sec.id} business={livePreviewBusiness} templateData={livePreviewTemplateData} onNavigate={() => {}} />;
                    }
                    if (sec.type === 'about') {
                      return <PublicAbout key={sec.id} business={livePreviewBusiness} templateData={livePreviewTemplateData} onNavigate={() => {}} />;
                    }
                    if (sec.type === 'staff') {
                      return <PublicStaff key={sec.id} business={livePreviewBusiness} templateData={livePreviewTemplateData} onNavigate={() => {}} />;
                    }
                    if (sec.type === 'gallery') {
                      return <PublicGallery key={sec.id} business={livePreviewBusiness} templateData={livePreviewTemplateData} onNavigate={() => {}} />;
                    }
                    if (sec.type === 'testimonials') {
                      return <PublicTestimonials key={sec.id} business={livePreviewBusiness} templateData={livePreviewTemplateData} onNavigate={() => {}} />;
                    }
                    if (sec.type === 'booking') {
                      return <PublicBookingCTA key={sec.id} business={livePreviewBusiness} templateData={livePreviewTemplateData} onNavigate={() => {}} />;
                    }
                    if (sec.type === 'contact') {
                      return <PublicContact key={sec.id} business={livePreviewBusiness} templateData={livePreviewTemplateData} onNavigate={() => {}} />;
                    }
                    return null;
                  })}
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <Badge variant="brand">{draft.activePage.toUpperCase()} SUB-PAGE</Badge>
                  <Typography variant="h2">{currentPageSections[0]?.heading || draft.activePage}</Typography>
                  <Typography variant="body" className="text-slate-500 max-w-md mx-auto">
                    {currentPageSections[0]?.description || 'Sub-page section content canvas.'}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* RIGHT PANEL: PROPERTIES INSPECTOR (3 COLS) */}
        {/* ============================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <Typography variant="h3">Properties</Typography>
                <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">{selectedSection?.type}</span>
              </div>
              {selectedSection?.visible ? (
                <Badge variant="success">Visible</Badge>
              ) : (
                <Badge variant="neutral">Hidden</Badge>
              )}
            </div>

            {selectedSection ? (
              <div className="space-y-3.5 text-xs">
                {/* Heading */}
                <Input
                  label="Section Heading"
                  value={selectedSection.heading}
                  onChange={(e) => handleUpdateSectionProperty('heading', e.target.value)}
                />

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Description / Subtitle</label>
                  <textarea
                    rows={3}
                    value={selectedSection.description}
                    onChange={(e) => handleUpdateSectionProperty('description', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-hidden font-sans"
                  />
                </div>

                {/* Badge Tag */}
                <Input
                  label="Badge Tag (Optional)"
                  value={selectedSection.badge || ''}
                  onChange={(e) => handleUpdateSectionProperty('badge', e.target.value)}
                />

                {/* Story (for About) */}
                {selectedSection.type === 'about' && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Atelier Story Paragraph</label>
                    <textarea
                      rows={3}
                      value={selectedSection.story || ''}
                      onChange={(e) => handleUpdateSectionProperty('story', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-hidden font-sans"
                    />
                  </div>
                )}

                {/* Button Text */}
                {['hero', 'services', 'booking'].includes(selectedSection.type) && (
                  <Input
                    label="Primary CTA Text"
                    value={selectedSection.buttonText || ''}
                    onChange={(e) => handleUpdateSectionProperty('buttonText', e.target.value)}
                  />
                )}

                {/* Alignment */}
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-semibold text-slate-700 block">Text Alignment</label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        type="button"
                        onClick={() => handleUpdateSectionProperty('alignment', align)}
                        className={`py-1 text-[11px] font-bold rounded capitalize transition-colors cursor-pointer ${
                          selectedSection.alignment === align ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-700 font-semibold">Section Visibility</span>
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(selectedSection.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      selectedSection.visible ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {selectedSection.visible ? 'Published' : 'Hidden'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs text-center py-4">No section selected.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
