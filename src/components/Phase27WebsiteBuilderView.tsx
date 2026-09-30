import React, { useState } from 'react';
import {
  BUILDER_PAGES,
  INITIAL_SECTIONS,
  THEME_PRESETS,
  BuilderPage,
  BuilderSection,
  ThemeConfig
} from '../data/phase27WebsiteBuilderData';
import {
  Eye,
  Save,
  UploadCloud,
  Layers,
  FileText,
  Sliders,
  Palette,
  Type,
  ChevronUp,
  ChevronDown,
  EyeOff,
  Settings,
  Sparkles,
  Scissors,
  UserCheck,
  Star,
  Image,
  CalendarCheck,
  MapPin,
  AlignEndHorizontal,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Undo2,
  Redo2,
  Plus,
  Check,
  MoveUp,
  MoveDown,
  SlidersHorizontal,
  Info
} from 'lucide-react';

export const Phase27WebsiteBuilderView: React.FC = () => {
  // Navigation & Page State
  const [pages, setPages] = useState<BuilderPage[]>(BUILDER_PAGES);
  const [activePageId, setActivePageId] = useState<string>('page-home');
  const [activeLeftTab, setActiveLeftTab] = useState<'pages' | 'sections' | 'theme'>('sections');

  // Preview Mode
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Sections State
  const [sections, setSections] = useState<Record<string, BuilderSection>>(INITIAL_SECTIONS);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-hero');

  // Theme Config
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(THEME_PRESETS.Luxury);

  // Active Page Sections list
  const activePage = pages.find((p) => p.id === activePageId) || pages[0];
  const activePageSections = activePage.sectionIds.map((id) => sections[id]).filter(Boolean);
  const selectedSection = sections[selectedSectionId] || sections['sec-hero'];

  // Handlers for structured non-code editing
  const handleUpdateProperty = (key: string, value: any) => {
    setIsSaved(false);
    setSections((prev) => ({
      ...prev,
      [selectedSectionId]: {
        ...prev[selectedSectionId],
        properties: {
          ...prev[selectedSectionId].properties,
          [key]: value
        }
      }
    }));
  };

  const handleToggleVisibility = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(false);
    setSections((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        properties: {
          ...prev[sectionId].properties,
          visible: !prev[sectionId].properties.visible
        }
      }
    }));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(false);
    const newSectionIds = [...activePage.sectionIds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSectionIds.length) return;

    const temp = newSectionIds[index];
    newSectionIds[index] = newSectionIds[targetIndex];
    newSectionIds[targetIndex] = temp;

    setPages((prev) =>
      prev.map((p) => (p.id === activePage.id ? { ...p, sectionIds: newSectionIds } : p))
    );
  };

  const handleSave = () => {
    setIsSaved(true);
    setSaveToast('Draft saved successfully! All section modifications recorded.');
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handlePublish = () => {
    setIsSaved(true);
    setSaveToast('Website changes staged. Published live to client-facing domain.');
    setTimeout(() => setSaveToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Context Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Phase 2.7 Specification UI
              </span>
              <span className="text-xs text-slate-500 font-medium">Visual No-Code Builder</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Website Builder & Structured Content Studio
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Purpose-built for salon owners. Clean 3-panel architecture (Pages & Reorderable Sections on Left, Live Responsive Preview in Center, Structured Property Form on Right). No arbitrary code editing or convoluted canvas bloat.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Preset Theme:</span>
            <span className="px-3 py-1 bg-slate-900 text-amber-300 rounded-lg text-xs font-bold tracking-wide">
              {currentTheme.preset}
            </span>
          </div>
        </div>
      </div>

      {/* SAVE / PUBLISH NOTIFICATION TOAST */}
      {saveToast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-4">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold">
            <Check className="w-3 h-3 text-slate-900" />
          </div>
          <span className="font-medium">{saveToast}</span>
        </div>
      )}

      {/* MAIN BUILDER WORKSPACE SHELL */}
      <div className="bg-slate-900/5 rounded-2xl border border-slate-300 p-2 sm:p-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden flex flex-col min-h-[860px]">
          
          {/* ==========================================
              BUILDER TOP BAR
              ========================================== */}
          <header className="h-14 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0">
            {/* Left Zone: Business Identity & Page Selector */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  W
                </span>
                <div>
                  <h2 className="text-xs font-bold text-slate-900 leading-tight">
                    The Royal Crown Barber & Lounge
                  </h2>
                  <p className="text-[10px] text-slate-500 font-medium">Live Website Editor</p>
                </div>
              </div>

              <span className="h-4 w-px bg-slate-200 hidden sm:block"></span>

              {/* Quick Page Picker in Topbar */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Editing:</span>
                <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  {activePage.name} Page ({activePage.slug})
                </span>
              </div>
            </div>

            {/* Center Zone: Viewport Device Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setPreviewViewport('desktop')}
                title="Desktop Preview (1280px)"
                className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                  previewViewport === 'desktop'
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Desktop</span>
              </button>
              <button
                onClick={() => setPreviewViewport('tablet')}
                title="Tablet Preview (768px)"
                className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                  previewViewport === 'tablet'
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Tablet</span>
              </button>
              <button
                onClick={() => setPreviewViewport('mobile')}
                title="Mobile Preview (375px)"
                className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                  previewViewport === 'mobile'
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Mobile</span>
              </button>
            </div>

            {/* Right Zone: Preview, Save, Publish */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                <span>Save Draft</span>
              </button>

              <button
                onClick={handlePublish}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Publish</span>
              </button>
            </div>
          </header>

          {/* ==========================================
              3-PANEL BUILDER BODY
              ========================================== */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* ------------------------------------------
                PANEL 1: LEFT PANEL (PAGES, SECTIONS, THEME)
                ------------------------------------------ */}
            <aside className="w-full lg:w-72 bg-slate-50/80 border-r border-slate-200 flex flex-col shrink-0">
              {/* Tab Selector */}
              <div className="flex border-b border-slate-200 bg-white">
                <button
                  onClick={() => setActiveLeftTab('sections')}
                  className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                    activeLeftTab === 'sections'
                      ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Sections</span>
                </button>

                <button
                  onClick={() => setActiveLeftTab('pages')}
                  className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                    activeLeftTab === 'pages'
                      ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Pages</span>
                </button>

                <button
                  onClick={() => setActiveLeftTab('theme')}
                  className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                    activeLeftTab === 'theme'
                      ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Theme</span>
                </button>
              </div>

              {/* Sub-Panel: Sections Management */}
              {activeLeftTab === 'sections' && (
                <div className="flex-1 p-3 overflow-y-auto space-y-2">
                  <div className="flex items-center justify-between px-1 mb-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {activePage.name} Page Sections ({activePageSections.length})
                    </span>
                    <span className="text-[10px] text-slate-400">Reorder & Hide</span>
                  </div>

                  <div className="space-y-1.5">
                    {activePageSections.map((sec, idx) => {
                      const isSelected = selectedSectionId === sec.id;
                      const isVisible = sec.properties.visible;

                      return (
                        <div
                          key={sec.id}
                          onClick={() => setSelectedSectionId(sec.id)}
                          className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-50/80 border-indigo-400 text-indigo-950 shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          } ${!isVisible ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[11px] font-mono font-bold text-slate-400 w-4">
                              {idx + 1}
                            </span>
                            <div className="truncate">
                              <p className="text-xs font-bold truncate leading-tight">{sec.name}</p>
                              <p className="text-[10px] text-slate-500 truncate">{sec.type}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Move Up */}
                            <button
                              onClick={(e) => handleMoveSection(idx, 'up', e)}
                              disabled={idx === 0}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100"
                              title="Move section up"
                            >
                              <MoveUp className="w-3 h-3" />
                            </button>

                            {/* Move Down */}
                            <button
                              onClick={(e) => handleMoveSection(idx, 'down', e)}
                              disabled={idx === activePageSections.length - 1}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100"
                              title="Move section down"
                            >
                              <MoveDown className="w-3 h-3" />
                            </button>

                            {/* Visibility Toggle */}
                            <button
                              onClick={(e) => handleToggleVisibility(sec.id, e)}
                              className={`p-1 rounded transition-colors ${
                                isVisible ? 'text-indigo-600 hover:bg-indigo-100' : 'text-slate-400 hover:bg-slate-200'
                              }`}
                              title={isVisible ? 'Hide section from live website' : 'Show section'}
                            >
                              {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-Panel: Pages Selector */}
              {activeLeftTab === 'pages' && (
                <div className="flex-1 p-3 overflow-y-auto space-y-2">
                  <div className="flex items-center justify-between px-1 mb-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Website Pages (6)
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {pages.map((p) => {
                      const isCurrentPage = activePageId === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setActivePageId(p.id);
                            if (p.sectionIds.length > 0) {
                              setSelectedSectionId(p.sectionIds[0]);
                            }
                          }}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                            isCurrentPage
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold">{p.name}</p>
                            <p className={`text-[10px] ${isCurrentPage ? 'text-slate-400' : 'text-slate-500'}`}>
                              {p.slug}
                            </p>
                          </div>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              isCurrentPage ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {p.sectionIds.length} sections
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-Panel: Theme & Styling Controls */}
              {activeLeftTab === 'theme' && (
                <div className="flex-1 p-4 overflow-y-auto space-y-5 text-xs">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                      Design Preset
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(THEME_PRESETS).map((key) => {
                        const isPresetActive = currentTheme.preset === key;
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              setCurrentTheme(THEME_PRESETS[key]);
                              setIsSaved(false);
                            }}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                              isPresetActive
                                ? 'border-indigo-600 bg-indigo-50/70 font-bold text-indigo-900 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <p className="text-xs">{key}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-slate-300"
                                style={{ backgroundColor: THEME_PRESETS[key].primaryColor }}
                              ></span>
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-slate-300"
                                style={{ backgroundColor: THEME_PRESETS[key].accentColor }}
                              ></span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                      Brand Palette
                    </label>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Primary Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={currentTheme.primaryColor}
                            onChange={(e) => {
                              setCurrentTheme({ ...currentTheme, primaryColor: e.target.value });
                              setIsSaved(false);
                            }}
                            className="w-6 h-6 rounded cursor-pointer border border-slate-300 p-0"
                          />
                          <span className="font-mono text-[11px] text-slate-500 uppercase">{currentTheme.primaryColor}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Accent Color</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={currentTheme.accentColor}
                            onChange={(e) => {
                              setCurrentTheme({ ...currentTheme, accentColor: e.target.value });
                              setIsSaved(false);
                            }}
                            className="w-6 h-6 rounded cursor-pointer border border-slate-300 p-0"
                          />
                          <span className="font-mono text-[11px] text-slate-500 uppercase">{currentTheme.accentColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                      Typography Pairing
                    </label>
                    <select
                      value={currentTheme.fontFamily}
                      onChange={(e) => {
                        setCurrentTheme({ ...currentTheme, fontFamily: e.target.value as any });
                        setIsSaved(false);
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                    >
                      <option value="Playfair Display + Inter">Playfair Display + Inter (Luxury Editorial)</option>
                      <option value="Cinzel + Montserrat">Cinzel + Montserrat (Classic Aristocratic)</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
                      <option value="Inter + Inter">Inter + Inter (Minimal Technical)</option>
                      <option value="Syne + Outfit">Syne + Outfit (High Fashion Bold)</option>
                    </select>
                  </div>

                  {/* Button Style & Radius */}
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                      Button Geometry & Corner Radius
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: 'Square', radius: 'none', style: 'rounded-none' },
                        { label: 'Rounded', radius: 'md', style: 'rounded-lg' },
                        { label: 'Pill', radius: 'full', style: 'rounded-full' }
                      ].map((btn) => (
                        <button
                          key={btn.label}
                          onClick={() => {
                            setCurrentTheme({
                              ...currentTheme,
                              radius: btn.radius as any,
                              buttonStyle: btn.style as any
                            });
                            setIsSaved(false);
                          }}
                          className={`p-2 border text-[11px] font-semibold transition-all ${
                            currentTheme.radius === btn.radius
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-600'
                          } ${btn.style}`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </aside>

            {/* ------------------------------------------
                PANEL 2: CENTER CANVAS (LIVE WEBSITE PREVIEW)
                ------------------------------------------ */}
            <main className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto flex flex-col items-center">
              {/* Viewport Frame */}
              <div
                className={`bg-white shadow-xl rounded-xl border border-slate-200 transition-all duration-300 overflow-hidden flex flex-col ${
                  previewViewport === 'desktop'
                    ? 'w-full max-w-4xl'
                    : previewViewport === 'tablet'
                    ? 'w-[768px] max-w-full'
                    : 'w-[375px]'
                }`}
              >
                {/* Website Preview Mini-Navbar */}
                <div
                  className="px-6 py-4 flex items-center justify-between border-b"
                  style={{
                    backgroundColor: currentTheme.primaryColor === '#09090b' || currentTheme.primaryColor === '#000000' || currentTheme.primaryColor === '#1a1917' ? currentTheme.primaryColor : '#ffffff',
                    color: currentTheme.primaryColor === '#09090b' || currentTheme.primaryColor === '#000000' || currentTheme.primaryColor === '#1a1917' ? '#ffffff' : '#0f172a'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 flex items-center justify-center font-bold text-xs"
                      style={{ color: currentTheme.accentColor }}
                    >
                      👑
                    </span>
                    <span className="font-bold text-sm tracking-tight">The Royal Crown</span>
                  </div>

                  <nav className="hidden sm:flex items-center gap-4 text-xs font-medium">
                    {pages.map((p) => (
                      <span
                        key={p.id}
                        className={`cursor-pointer ${
                          p.id === activePageId
                            ? 'font-bold'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          color: p.id === activePageId ? currentTheme.accentColor : 'inherit'
                        }}
                      >
                        {p.name}
                      </span>
                    ))}
                  </nav>

                  <div
                    className={`px-3 py-1.5 text-xs font-bold cursor-pointer ${currentTheme.buttonStyle}`}
                    style={{
                      backgroundColor: currentTheme.accentColor,
                      color: '#000000'
                    }}
                  >
                    Book Now
                  </div>
                </div>

                {/* Render Selected Page Sections */}
                <div className="divide-y divide-slate-100">
                  {activePageSections.map((sec) => {
                    const isVisible = sec.properties.visible;
                    if (!isVisible) return null;

                    const isCurrentEditing = selectedSectionId === sec.id;
                    const props = sec.properties;

                    return (
                      <div
                        key={sec.id}
                        onClick={() => setSelectedSectionId(sec.id)}
                        className={`relative transition-all cursor-pointer group ${
                          isCurrentEditing
                            ? 'ring-2 ring-indigo-500 ring-offset-2 z-10'
                            : 'hover:outline hover:outline-1 hover:outline-indigo-300'
                        } ${
                          props.background === 'dark'
                            ? 'bg-slate-950 text-white'
                            : props.background === 'slate-50'
                            ? 'bg-slate-50 text-slate-900'
                            : props.background === 'brand-tint'
                            ? 'bg-amber-50/70 text-slate-900 border-y border-amber-200'
                            : 'bg-white text-slate-900'
                        } ${
                          props.spacing === 'compact'
                            ? 'py-8 px-6'
                            : props.spacing === 'spacious'
                            ? 'py-16 px-8'
                            : 'py-12 px-6'
                        }`}
                      >
                        {/* Selected Indicator Label */}
                        {isCurrentEditing && (
                          <div className="absolute top-2 left-2 z-20 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                            <span>Editing: {sec.name}</span>
                          </div>
                        )}

                        {/* SECTION TYPE: HERO */}
                        {sec.type === 'Hero' && (
                          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 space-y-4 text-left">
                              <span
                                className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded"
                                style={{
                                  backgroundColor: `${currentTheme.accentColor}25`,
                                  color: currentTheme.accentColor
                                }}
                              >
                                {props.subheading}
                              </span>
                              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                                {props.heading}
                              </h1>
                              <p className="text-sm opacity-80 leading-relaxed">{props.description}</p>
                              <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                  className={`px-5 py-2.5 text-xs font-bold transition-transform active:scale-95 ${currentTheme.buttonStyle}`}
                                  style={{
                                    backgroundColor: currentTheme.accentColor,
                                    color: '#000000'
                                  }}
                                >
                                  {props.ctaText}
                                </button>
                                {props.secondaryCtaText && (
                                  <button
                                    className={`px-5 py-2.5 text-xs font-semibold border transition-colors ${currentTheme.buttonStyle}`}
                                    style={{
                                      borderColor: 'currentColor',
                                      color: 'inherit'
                                    }}
                                  >
                                    {props.secondaryCtaText}
                                  </button>
                                )}
                              </div>
                            </div>
                            {props.imageUrl && (
                              <div className="flex-1 w-full max-w-sm rounded-xl overflow-hidden shadow-lg border border-white/10">
                                <img
                                  src={props.imageUrl}
                                  alt={props.imageAlt || 'Hero visual'}
                                  className="w-full h-64 object-cover"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* SECTION TYPE: ABOUT */}
                        {sec.type === 'About' && (
                          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                            {props.imageUrl && (
                              <div className="flex-1 w-full max-w-sm rounded-xl overflow-hidden shadow-md">
                                <img
                                  src={props.imageUrl}
                                  alt={props.imageAlt || 'About story'}
                                  className="w-full h-60 object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 space-y-3">
                              <p
                                className="text-xs font-bold uppercase tracking-wider"
                                style={{ color: currentTheme.accentColor }}
                              >
                                {props.subheading}
                              </p>
                              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{props.heading}</h2>
                              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {props.description}
                              </p>
                              {props.ctaText && (
                                <button
                                  className={`px-4 py-2 text-xs font-bold border ${currentTheme.buttonStyle}`}
                                  style={{ borderColor: currentTheme.primaryColor, color: currentTheme.primaryColor }}
                                >
                                  {props.ctaText}
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* SECTION TYPE: SERVICES */}
                        {sec.type === 'Services' && (
                          <div className="max-w-4xl mx-auto space-y-6 text-center">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                {props.subheading}
                              </p>
                              <h2 className="text-2xl font-bold mt-1">{props.heading}</h2>
                              <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1">{props.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                              {[
                                { title: 'Signature Skin Fade', price: '₹1,000', time: '45m', desc: 'Precision razor fade with hot towel finish.' },
                                { title: 'Traditional Beard Sculpt', price: '₹600', time: '30m', desc: 'Symmetrical trim, badger brush lather & oil.' },
                                { title: 'Restorative Head Spa', price: '₹1,200', time: '50m', desc: 'Botanical scalp exfoliation & acupressure.' }
                              ].map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
                                  <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                                    <span className="font-bold text-xs text-indigo-700">{item.price}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                                  <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100">
                                    <span>{item.time}</span>
                                    <span className="font-bold text-indigo-600 hover:underline">Book (25% Adv)</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* SECTION TYPE: PACKAGES */}
                        {sec.type === 'Packages' && (
                          <div className="max-w-4xl mx-auto space-y-6 text-center">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                {props.subheading}
                              </p>
                              <h2 className="text-2xl font-bold mt-1">{props.heading}</h2>
                              <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1">{props.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                              {[
                                { title: 'Executive Grooming Ritual', price: '₹1,750', orig: '₹2,200', badge: 'Most Popular' },
                                { title: 'Groom & Best Man Package', price: '₹3,500', orig: '₹4,500', badge: 'Wedding' },
                                { title: 'Monthly Maintenance Pass', price: '₹2,800', orig: '₹3,600', badge: 'Subscription' }
                              ].map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl border-2 border-indigo-500/40 bg-white space-y-3 shadow-sm">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                                    {item.badge}
                                  </span>
                                  <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-slate-900">{item.price}</span>
                                    <span className="text-xs text-slate-400 line-through">{item.orig}</span>
                                  </div>
                                  <button
                                    className={`w-full py-1.5 text-xs font-bold text-white bg-slate-900 ${currentTheme.buttonStyle}`}
                                  >
                                    Select Bundle
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* SECTION TYPE: STAFF */}
                        {sec.type === 'Staff' && (
                          <div className="max-w-4xl mx-auto space-y-6 text-center">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                {props.subheading}
                              </p>
                              <h2 className="text-2xl font-bold mt-1">{props.heading}</h2>
                              <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1">{props.description}</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                              {[
                                { name: 'Marco Silva', role: 'Master Barber', score: '4.95' },
                                { name: 'Priya Sharma', role: 'Lead Colorist', score: '4.92' },
                                { name: 'David Chen', role: 'Shave Artisan', score: '4.88' },
                                { name: 'Aisha Khan', role: 'Aesthetician', score: '4.97' }
                              ].map((st, idx) => (
                                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5">
                                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center mx-auto text-xs">
                                    {st.name.split(' ').map((n) => n[0]).join('')}
                                  </div>
                                  <h5 className="font-bold text-xs text-slate-800">{st.name}</h5>
                                  <p className="text-[10px] text-slate-500">{st.role}</p>
                                  <p className="text-[10px] font-bold text-amber-600">★ {st.score}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* SECTION TYPE: GALLERY */}
                        {sec.type === 'Gallery' && (
                          <div className="max-w-4xl mx-auto space-y-4 text-center">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                {props.subheading}
                              </p>
                              <h2 className="text-xl font-bold mt-1">{props.heading}</h2>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {[1, 2, 3].map((g) => (
                                <div key={g} className="h-28 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
                                  Portfolio Asset #{g}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* SECTION TYPE: TESTIMONIALS */}
                        {sec.type === 'Testimonials' && (
                          <div className="max-w-4xl mx-auto space-y-4 text-center">
                            <h2 className="text-xl font-bold">{props.heading}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                              {[
                                { text: '“The skin fade is razor sharp every visit. Worth every rupee.”', author: 'Rahul K., Tech Founder' },
                                { text: '“Breathtaking interior and pristine hygiene sterilizers.”', author: 'Ananya D., Architect' },
                                { text: '“Transparent advance payment makes booking frictionless.”', author: 'Vikram S., Director' }
                              ].map((t, idx) => (
                                <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                                  <p className="text-xs text-slate-700 italic">{t.text}</p>
                                  <p className="text-[10px] font-bold text-slate-500">{t.author}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* SECTION TYPE: BOOKING CTA */}
                        {sec.type === 'Booking CTA' && (
                          <div className="max-w-3xl mx-auto text-center space-y-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-200/60 text-amber-900">
                              {props.subheading}
                            </span>
                            <h2 className="text-2xl font-black">{props.heading}</h2>
                            <p className="text-xs text-slate-600 max-w-lg mx-auto">{props.description}</p>
                            <button
                              className={`px-6 py-3 text-xs font-bold text-white bg-slate-900 shadow-md ${currentTheme.buttonStyle}`}
                            >
                              {props.ctaText}
                            </button>
                          </div>
                        )}

                        {/* SECTION TYPE: CONTACT */}
                        {sec.type === 'Contact' && (
                          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
                            <div className="space-y-2">
                              <h3 className="text-lg font-bold">{props.heading}</h3>
                              <p className="text-xs text-slate-500">{props.subheading}</p>
                              <p className="text-xs text-slate-600">{props.description}</p>
                            </div>
                            <div className="p-3 bg-slate-100 rounded-lg text-xs space-y-1">
                              <p className="font-bold">Operating Hours</p>
                              <p className="text-slate-600">Tue - Sun: 09:00 AM – 08:00 PM</p>
                              <p className="text-slate-400">Monday: Closed for deep sanitation</p>
                            </div>
                          </div>
                        )}

                        {/* SECTION TYPE: FOOTER */}
                        {sec.type === 'Footer' && (
                          <div className="max-w-4xl mx-auto text-center space-y-2 text-xs">
                            <p className="font-bold">{props.heading}</p>
                            <p className="opacity-60 text-[11px]">{props.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </main>

            {/* ------------------------------------------
                PANEL 3: RIGHT PANEL (SECTION PROPERTIES)
                ------------------------------------------ */}
            <aside className="w-full lg:w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
              {/* Properties Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Properties</span>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">{selectedSection.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                  {selectedSection.type}
                </span>
              </div>

              {/* Properties Form Controls */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                
                {/* Heading Control */}
                {selectedSection.properties.heading !== undefined && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Section Heading</label>
                    <input
                      type="text"
                      value={selectedSection.properties.heading}
                      onChange={(e) => handleUpdateProperty('heading', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Subheading Control */}
                {selectedSection.properties.subheading !== undefined && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Subheading / Badge Label</label>
                    <input
                      type="text"
                      value={selectedSection.properties.subheading}
                      onChange={(e) => handleUpdateProperty('subheading', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Description Textarea */}
                {selectedSection.properties.description !== undefined && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Description Body Text</label>
                    <textarea
                      rows={3}
                      value={selectedSection.properties.description}
                      onChange={(e) => handleUpdateProperty('description', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Primary Button / CTA Text */}
                {selectedSection.properties.ctaText !== undefined && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Button Call-to-Action (CTA)</label>
                    <input
                      type="text"
                      value={selectedSection.properties.ctaText}
                      onChange={(e) => handleUpdateProperty('ctaText', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Secondary CTA Text */}
                {selectedSection.properties.secondaryCtaText !== undefined && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Secondary Link / Button</label>
                    <input
                      type="text"
                      value={selectedSection.properties.secondaryCtaText}
                      onChange={(e) => handleUpdateProperty('secondaryCtaText', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* Image URL & Alt */}
                {selectedSection.properties.imageUrl !== undefined && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[11px] font-bold text-slate-700">Image Asset URL</label>
                    <input
                      type="text"
                      value={selectedSection.properties.imageUrl}
                      onChange={(e) => handleUpdateProperty('imageUrl', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-indigo-500 truncate"
                    />
                    <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={selectedSection.properties.imageUrl}
                        alt="Preview asset"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Layout Alignment Options */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-[11px] font-bold text-slate-700">Layout Arrangement</label>
                  <select
                    value={selectedSection.properties.layout}
                    onChange={(e) => handleUpdateProperty('layout', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="center">Centered Editorial</option>
                    <option value="split-right">Split Content (Image on Right)</option>
                    <option value="split-left">Split Content (Image on Left)</option>
                    <option value="grid-3">3-Column Grid</option>
                    <option value="grid-4">4-Column Grid</option>
                  </select>
                </div>

                {/* Spacing Density */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700">Vertical Padding & Spacing</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['compact', 'normal', 'spacious'] as const).map((sp) => (
                      <button
                        key={sp}
                        onClick={() => handleUpdateProperty('spacing', sp)}
                        className={`py-1.5 rounded-lg border text-center capitalize text-xs ${
                          selectedSection.properties.spacing === sp
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Tint */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700">Section Background Canvas</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'white', label: 'Pure White', bg: 'bg-white border-slate-300' },
                      { id: 'slate-50', label: 'Light Slate', bg: 'bg-slate-100 border-slate-300' },
                      { id: 'dark', label: 'Midnight Dark', bg: 'bg-slate-950 text-white border-slate-900' },
                      { id: 'brand-tint', label: 'Amber Tint', bg: 'bg-amber-100/70 border-amber-300' }
                    ].map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => handleUpdateProperty('background', bg.id)}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 ${
                          selectedSection.properties.background === bg.id
                            ? 'ring-2 ring-indigo-500 border-indigo-500 font-bold'
                            : 'border-slate-200'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border ${bg.bg}`}></span>
                        <span className="text-[11px]">{bg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Structured Content Notice */}
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg text-[11px] text-indigo-900 flex items-start gap-2 mt-4">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Structured Content Guard:</strong> Text and assets strictly bind to the design system schema. No raw HTML or broken layout tags possible.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
