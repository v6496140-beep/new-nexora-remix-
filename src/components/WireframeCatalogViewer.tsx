import React, { useState } from 'react';
import {
  WIREFRAMES_66,
  WireframeScreenSpec,
  WireframeSection,
  WireframeBlock,
} from '../data/lowFiWireframesCatalog';
import {
  Search,
  Monitor,
  Tablet,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileText,
  Filter,
} from 'lucide-react';

export const WireframeCatalogViewer: React.FC = () => {
  const [selectedScreenId, setSelectedScreenId] = useState<number>(13); // Default to Screen 13: Home
  const [selectedCluster, setSelectedCluster] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const clusters = [
    'All',
    'Marketing',
    'Business Onboarding',
    'Public Business Website',
    'Booking',
    'Customer',
    'Business Admin',
    'Staff',
    'Super Admin',
  ];

  const filteredScreens = WIREFRAMES_66.filter((screen) => {
    if (selectedCluster !== 'All' && screen.cluster !== selectedCluster) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      screen.name.toLowerCase().includes(q) ||
      screen.id.toString() === q ||
      screen.cluster.toLowerCase().includes(q) ||
      screen.description.toLowerCase().includes(q)
    );
  });

  const currentScreen: WireframeScreenSpec =
    WIREFRAMES_66.find((s) => s.id === selectedScreenId) || WIREFRAMES_66[12]; // Screen 13

  const currentScreenIndex = WIREFRAMES_66.findIndex((s) => s.id === currentScreen.id);

  const handlePrev = () => {
    if (currentScreenIndex > 0) {
      setSelectedScreenId(WIREFRAMES_66[currentScreenIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentScreenIndex < WIREFRAMES_66.length - 1) {
      setSelectedScreenId(WIREFRAMES_66[currentScreenIndex + 1].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Screen Navigator Bar */}
      <div className="bg-white border border-slate-300 rounded-lg p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5 font-mono">
              <span>LOW-FIDELITY STRUCTURAL SPECIFICATION</span>
              <span>·</span>
              <span>66 COMPLETE SCREENS</span>
              <span>·</span>
              <span>NO REAL IMAGES / NO STYLING</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Nexora SalonOS 66-Screen Wireframe Studio
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Viewport switch */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-300">
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

            {/* Direct Screen Jump Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <select
                value={selectedScreenId}
                onChange={(e) => setSelectedScreenId(Number(e.target.value))}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-slate-900 max-w-[240px]"
              >
                {WIREFRAMES_66.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id.toString().padStart(2, '0')}. {s.name} ({s.cluster})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cluster Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200">
          {clusters.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCluster(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                selectedCluster === c
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Screen Pagination Bar & Meta */}
      <div className="bg-white border border-slate-300 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono bg-slate-900 text-white font-bold px-2.5 py-1 rounded text-xs">
            SCREEN #{currentScreen.id.toString().padStart(2, '0')}
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{currentScreen.name}</h3>
            <span className="text-slate-500 font-mono text-[11px]">
              Cluster: {currentScreen.cluster} · {currentScreen.description}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentScreenIndex === 0}
            onClick={handlePrev}
            className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 font-mono text-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev Screen</span>
          </button>
          <span className="text-slate-400 font-mono text-xs px-1">
            {currentScreen.id} / 66
          </span>
          <button
            disabled={currentScreenIndex === WIREFRAMES_66.length - 1}
            onClick={handleNext}
            className="px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1 font-mono text-xs font-semibold"
          >
            <span>Next Screen</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Low-Fidelity Canvas */}
      <div className="bg-slate-200 p-4 sm:p-8 rounded-xl border border-slate-300 min-h-[600px] flex justify-center items-start overflow-x-auto">
        <div
          className={`transition-all duration-300 bg-white border-2 border-slate-400 shadow-xs rounded overflow-hidden ${
            viewport === 'desktop'
              ? 'w-full max-w-[1100px]'
              : viewport === 'tablet'
              ? 'w-[768px]'
              : 'w-[375px]'
          }`}
        >
          {/* Wireframe Chrome Header */}
          <div className="bg-slate-100 border-b border-slate-300 px-4 py-2 flex items-center justify-between text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border border-slate-400" />
              <span className="w-2.5 h-2.5 rounded-full border border-slate-400" />
              <span className="w-2.5 h-2.5 rounded-full border border-slate-400" />
              <span className="ml-2 font-bold text-slate-700">
                [LOW-FI WIREFRAME: SCREEN #{currentScreen.id.toString().padStart(2, '0')} - {currentScreen.name.toUpperCase()}]
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              [STRUCTURAL BLUEPRINT ONLY]
            </div>
          </div>

          {/* Wireframe Body: Render Sections & Blocks as simple labeled boxes */}
          <div className="p-6 space-y-6 bg-slate-50/50">
            {currentScreen.sections.map((section, sIdx) => (
              <div
                key={section.sectionId}
                className="border border-dashed border-slate-400 p-4 rounded bg-white space-y-3 relative"
              >
                {/* Section Header Wireframe Label */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-mono text-xs font-bold text-slate-900 uppercase">
                    &lt;SECTION: {section.title}&gt;
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    [Slot: #{section.sectionId}]
                  </span>
                </div>

                {/* Blocks Grid */}
                <div className="flex flex-wrap gap-2.5">
                  {section.blocks.map((block, bIdx) => {
                    // Width calculation
                    let widthClass = 'w-full';
                    if (block.width === '1/2') widthClass = 'w-full sm:w-[calc(50%-5px)]';
                    if (block.width === '1/3') widthClass = 'w-full sm:w-[calc(33.33%-7px)]';
                    if (block.width === '1/4') widthClass = 'w-full sm:w-[calc(25%-8px)]';
                    if (block.width === '1/6') widthClass = 'w-1/2 sm:w-[calc(16.66%-8px)]';
                    if (block.width === '2/3') widthClass = 'w-full sm:w-[calc(66.66%-5px)]';

                    // Height calculation
                    const heightClass = block.height || 'min-h-[44px]';

                    // Block Type Rendering
                    if (block.type === 'placeholder') {
                      return (
                        <div
                          key={bIdx}
                          className={`${widthClass} ${heightClass} border-2 border-dashed border-slate-400 bg-slate-100 flex items-center justify-center text-center p-3 font-mono text-xs text-slate-600 rounded`}
                        >
                          {block.label}
                        </div>
                      );
                    }

                    if (block.type === 'button') {
                      return (
                        <div
                          key={bIdx}
                          className={`${widthClass} border border-slate-800 bg-slate-900 text-white font-mono text-xs font-semibold px-4 py-2.5 rounded text-center shrink-0`}
                        >
                          {block.label}
                        </div>
                      );
                    }

                    if (block.type === 'input') {
                      return (
                        <div
                          key={bIdx}
                          className={`${widthClass} border border-slate-400 bg-slate-50 font-mono text-xs text-slate-700 p-2.5 rounded flex items-center`}
                        >
                          <span className="text-slate-400 mr-2">[INPUT]</span>
                          <span className="truncate">{block.label}</span>
                        </div>
                      );
                    }

                    if (block.type === 'nav') {
                      return (
                        <div
                          key={bIdx}
                          className={`${widthClass} border border-slate-400 bg-slate-100 font-mono text-xs font-bold text-slate-900 p-2.5 rounded flex items-center justify-center`}
                        >
                          {block.label}
                        </div>
                      );
                    }

                    if (block.type === 'badge') {
                      return (
                        <div
                          key={bIdx}
                          className={`${widthClass} bg-slate-200 border border-slate-400 font-mono text-[11px] font-bold text-slate-800 px-3 py-1 rounded text-center`}
                        >
                          {block.label}
                        </div>
                      );
                    }

                    if (block.type === 'metric') {
                      return (
                        <div
                          key={bIdx}
                          className={`${widthClass} border border-slate-300 bg-white p-3 rounded font-mono text-xs text-slate-800`}
                        >
                          <span className="text-slate-400 text-[10px] block mb-1">[METRIC]</span>
                          <span className="font-bold text-sm text-slate-900">{block.label}</span>
                        </div>
                      );
                    }

                    if (block.type === 'table') {
                      return (
                        <div
                          key={bIdx}
                          className={`${widthClass} ${heightClass} border border-slate-300 bg-white p-3 rounded font-mono text-xs text-slate-700 flex flex-col justify-between`}
                        >
                          <div className="font-bold text-slate-900 pb-1 border-b border-slate-200">
                            {block.label}
                          </div>
                          <div className="text-[11px] text-slate-400 italic">
                            [Low-Fidelity Tabular Rows Placeholder]
                          </div>
                        </div>
                      );
                    }

                    // Default Box
                    return (
                      <div
                        key={bIdx}
                        className={`${widthClass} ${heightClass} border border-slate-300 bg-white p-3 rounded font-mono text-xs text-slate-800 flex items-center justify-between`}
                      >
                        <span className="truncate">{block.label}</span>
                        <span className="text-[10px] text-slate-400 ml-2 font-mono shrink-0">[BOX]</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Wireframe Chrome Footer */}
          <div className="bg-slate-100 border-t border-slate-300 p-3 text-center font-mono text-[11px] text-slate-500">
            [END OF WIREFRAME SCREEN #{currentScreen.id.toString().padStart(2, '0')}] · NEXORA SALONOS SPECIFICATION
          </div>
        </div>
      </div>
    </div>
  );
};
