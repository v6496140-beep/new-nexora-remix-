import React, { useState } from 'react';
import { X, Smartphone, Monitor, RefreshCw } from 'lucide-react';
import { PublicWebsiteRenderer } from '../../public/PublicWebsiteRenderer';
import { resolveTemplateData } from '../../../services/templateResolver';
import { SEEDED_PUBLIC_BUSINESSES } from '../../../data/seededPublicBusinesses';
import { ThemePreset } from '../../../types';

interface CatalogPreviewPanelProps {
  categoryId: string;
  templateId?: string;
  themeId?: ThemePreset;
  onClose: () => void;
}

export const CatalogPreviewPanel: React.FC<CatalogPreviewPanelProps> = ({
  categoryId,
  templateId,
  themeId,
  onClose
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [currentPath, setCurrentPath] = useState(`/b/preview`);

  const templateData = resolveTemplateData(categoryId, templateId);
  
  // If we have an override themeId (for theme preview), inject it
  if (templateData && themeId) {
    templateData.themePreset = themeId;
  }

  // Use a seeded business as a base for preview data (e.g., gallery images, etc.)
  const baseBusiness = Object.values(SEEDED_PUBLIC_BUSINESSES).find(b => b.category === categoryId) 
    || SEEDED_PUBLIC_BUSINESSES['royal-crown'];

  const previewBusiness = {
    ...baseBusiness,
    name: 'Nexora Preview Studio',
    slug: 'preview',
    templateId: templateId || baseBusiness.templateId,
    themeId: themeId || (templateData?.themePreset as any) || baseBusiness.themeId,
  };

  if (!templateData) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl text-center">
          <p className="text-slate-500 mb-4">Failed to resolve template data.</p>
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex flex-col">
      {/* Header */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Live Preview: {templateId ? templateData.template.name : (themeId ? `${themeId} Theme` : templateData.category.name)}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Platform Preview Engine · Real Components
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewport('desktop')}
            className={`p-2 rounded-lg transition-all ${viewport === 'desktop' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewport('mobile')}
            className={`p-2 rounded-lg transition-all ${viewport === 'mobile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-slate-500" />
        </button>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 overflow-hidden bg-slate-200/50 flex justify-center p-8">
        <div 
          className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden flex flex-col ${
            viewport === 'desktop' ? 'w-full max-w-5xl rounded-2xl' : 'w-[375px] rounded-[3rem] border-[12px] border-slate-900'
          }`}
        >
          {/* Internal Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Fake Browser Header for Desktop */}
            {viewport === 'desktop' && (
              <div className="h-10 bg-slate-50 border-b flex items-center px-4 gap-2 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-white border rounded h-6 flex items-center px-3 text-[10px] text-slate-400 font-mono">
                  https://nexora.salon/b/preview
                </div>
              </div>
            )}

            {/* THE REAL COMPONENT RENDERER */}
            <div className="p-4 sm:p-0">
              <PublicWebsiteRenderer 
                business={previewBusiness as any} 
                templateData={templateData}
                currentPath={currentPath}
                onNavigate={(path) => {
                  // In preview, we stay on "home" mostly but allow clicking around if logic allows
                  console.log('Preview Navigate:', path);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="h-12 bg-white border-t flex items-center justify-center px-6 shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-8">
        <span>Theme: {templateData.themePreset}</span>
        <span>Layout: {templateId ? templateData.template.layout : 'Default'}</span>
        <span>Sections: {templateData.sections.length}</span>
      </div>
    </div>
  );
};
