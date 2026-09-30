import React, { useState } from 'react';
import { Palette, Edit2, CheckCircle, Info, RefreshCcw, Plus, Eye, X } from 'lucide-react';
import { CATEGORY_THEMES, ThemeTokens } from '../../../design-system/tokens';
import { CatalogPreviewPanel } from './CatalogPreviewPanel';
import { ThemePreset } from '../../../types';

export function ThemeManagementPage() {
  const [editingThemeKey, setEditingThemeKey] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<ThemePreset | null>(null);
  
  // SESSION STATE
  const [localThemes, setLocalThemes] = useState(CATEGORY_THEMES);

  const themes = Object.entries(localThemes);

  const handleUpdateToken = (themeKey: string, tokenKey: keyof ThemeTokens, value: string) => {
    setLocalThemes(prev => ({
      ...prev,
      [themeKey]: {
        ...prev[themeKey as keyof typeof localThemes],
        tokens: {
          ...prev[themeKey as keyof typeof localThemes].tokens,
          [tokenKey]: value
        }
      }
    }));
  };

  const handleSaveTheme = () => {
    alert(`Theme "${editingThemeKey}" tokens updated in current session.`);
    setEditingThemeKey(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Themes</h1>
          <p className="text-slate-500 text-sm">Manage global design tokens and visual style presets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map(([key, theme]) => (
          <div key={key} className="bg-white rounded-xl border shadow-sm overflow-hidden group hover:shadow-md transition-all">
            {/* Visual Preview Header */}
            <div 
              className="h-32 p-4 flex flex-col justify-end relative overflow-hidden"
              style={{ backgroundColor: theme.tokens.background }}
            >
              <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                <Palette className="w-24 h-24 rotate-12" />
              </div>
              <div className="flex gap-2 relative z-10">
                <div className="w-8 h-8 rounded shadow-sm border border-black/5" style={{ backgroundColor: theme.tokens.primary }}></div>
                <div className="w-8 h-8 rounded shadow-sm border border-black/5" style={{ backgroundColor: theme.tokens.accent }}></div>
                <div className="w-8 h-8 rounded shadow-sm border border-slate-200" style={{ backgroundColor: theme.tokens.surface }}></div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 capitalize">{key.replace('_', ' ')} Theme</h3>
                  <p className="text-xs text-slate-500">{theme.name}</p>
                </div>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  onClick={() => setPreviewTheme(key as ThemePreset)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
                <button 
                  onClick={() => setEditingThemeKey(key)}
                  className="px-3 py-2 border rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Panel */}
      {previewTheme && (
        <CatalogPreviewPanel 
          categoryId="barber" // Default to barber for theme preview base
          themeId={previewTheme}
          onClose={() => setPreviewTheme(null)}
        />
      )}

      {/* Theme Editor Drawer */}
      {editingThemeKey && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900 capitalize">Edit Theme: {editingThemeKey.replace('_', ' ')}</h2>
                <p className="text-sm text-slate-500">Fine-tune design tokens for this theme preset</p>
              </div>
              <button 
                onClick={() => setEditingThemeKey(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Colors</h3>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(localThemes[editingThemeKey as keyof typeof localThemes].tokens)
                    .filter(([key]) => typeof localThemes[editingThemeKey as keyof typeof localThemes].tokens[key as keyof ThemeTokens] === 'string' && (localThemes[editingThemeKey as keyof typeof localThemes].tokens[key as keyof ThemeTokens] as string).startsWith('#'))
                    .map(([key, value]) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={value as string} 
                            onChange={(e) => handleUpdateToken(editingThemeKey, key as keyof ThemeTokens, e.target.value)}
                            className="w-10 h-10 rounded border p-1 cursor-pointer" 
                          />
                          <input 
                            type="text" 
                            value={value as string} 
                            onChange={(e) => handleUpdateToken(editingThemeKey, key as keyof ThemeTokens, e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none uppercase" 
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Typography & Shape</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Border Radius</label>
                    <select 
                      value={localThemes[editingThemeKey as keyof typeof localThemes].tokens.radius}
                      onChange={(e) => handleUpdateToken(editingThemeKey, 'radius', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="none">None (Sharp)</option>
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                      <option value="full">Full (Round)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Heading Font</label>
                    <input 
                      type="text" 
                      value={localThemes[editingThemeKey as keyof typeof localThemes].tokens.fontHeading}
                      onChange={(e) => handleUpdateToken(editingThemeKey, 'fontHeading', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-slate-50 flex gap-4">
              <button 
                onClick={() => setEditingThemeKey(null)}
                className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors uppercase text-xs tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveTheme}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 uppercase text-xs tracking-widest"
              >
                Update Theme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
