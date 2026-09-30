import React, { useState } from 'react';
import { Search, Plus, Edit2, Copy, Power, Filter, Eye, X, Check } from 'lucide-react';
import { TEMPLATES_REGISTRY } from '../../../config/templatesRegistry';
import { CATEGORIES_REGISTRY } from '../../../config/categoriesRegistry';
import { TemplateDefinition, CategoryId } from '../../../types/categoryEngine';
import { CatalogPreviewPanel } from './CatalogPreviewPanel';

export function TemplateManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [editingTemplate, setEditingTemplate] = useState<TemplateDefinition | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // SESSION STATE
  const [localTemplates, setLocalTemplates] = useState<TemplateDefinition[]>(TEMPLATES_REGISTRY);

  const categories = Object.values(CATEGORIES_REGISTRY);

  const filteredTemplates = localTemplates.filter(tpl => {
    const matchesSearch = tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tpl.templateId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDuplicate = (template: TemplateDefinition) => {
    const newId = `${template.templateId}-copy-${Date.now()}`;
    const newTemplate: TemplateDefinition = {
      ...template,
      templateId: newId,
      name: `${template.name} (Copy)`
    };
    setLocalTemplates(prev => [newTemplate, ...prev]);
    alert(`Duplicated template: ${newTemplate.name} in current session.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    setLocalTemplates(prev => prev.map(t => 
      t.templateId === editingTemplate.templateId ? editingTemplate : t
    ));
    setEditingTemplate(null);
    alert('Template changes saved to session.');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const catId = formData.get('category') as CategoryId;
    const baseCategory = CATEGORIES_REGISTRY[catId];

    const newTpl: TemplateDefinition = {
      templateId: `tmpl-${catId}-${Date.now()}`,
      category: catId,
      name: formData.get('name') as string,
      theme: formData.get('theme') as any,
      layout: formData.get('layout') as any,
      sections: baseCategory.homepageSections,
      defaultContent: {
        hero: {
          badge: 'New Template',
          title: 'Exquisite Services',
          subtitle: 'Book your session today',
          description: 'Premium experience guaranteed',
          primaryCTA: 'Book Now',
          secondaryCTA: 'Learn More'
        }
      }
    };

    setLocalTemplates(prev => [newTpl, ...prev]);
    setIsCreating(false);
    alert(`New template created for ${catId}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Website Templates</h1>
          <p className="text-slate-500 text-sm">Manage category-specific layouts and default content seeds</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm font-bold text-xs uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" /> Create Template
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search templates..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-600"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr className="text-left border-b">
                <th className="p-4">Template Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Theme</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTemplates.map((tpl) => (
                <tr key={tpl.templateId} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{tpl.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{tpl.templateId}</div>
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-slate-600 font-medium">{tpl.category.replace('-', ' ')}</span>
                  </td>
                  <td className="p-4">
                    <span className="capitalize px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-tight border border-indigo-100">
                      {tpl.theme}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                        title="Live Preview"
                        onClick={() => setPreviewTemplate(tpl)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                        title="Edit Template"
                        onClick={() => setEditingTemplate(tpl)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                        title="Duplicate"
                        onClick={() => handleDuplicate(tpl)}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                        title="Archive"
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTemplates.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No templates found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">New Website Template</h3>
              <button type="button" onClick={() => setIsCreating(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Template Name</label>
                <input name="name" required placeholder="e.g. Zen Retreat v2" className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                  <select name="category" required className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none text-sm capitalize">
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Initial Theme</label>
                  <select name="theme" required className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none text-sm">
                    <option value="modern">Modern</option>
                    <option value="luxury">Luxury</option>
                    <option value="minimal">Minimal</option>
                    <option value="bold">Bold</option>
                    <option value="elegant">Elegant</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Layout Engine</label>
                <select name="layout" required className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none text-sm">
                  <option value="modern-grid">Modern Grid</option>
                  <option value="editorial-luxury">Editorial Luxury</option>
                  <option value="minimal-split">Minimal Split</option>
                  <option value="bold-monochrome">Bold Monochrome</option>
                  <option value="warm-organic">Warm Organic</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-2.5 border-2 rounded-xl font-bold text-slate-600 hover:bg-white transition-all text-xs uppercase tracking-widest">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg text-xs uppercase tracking-widest">Create Template</button>
            </div>
          </form>
        </div>
      )}

      {/* Live Preview Panel */}
      {previewTemplate && (
        <CatalogPreviewPanel 
          categoryId={previewTemplate.category}
          templateId={previewTemplate.templateId}
          onClose={() => setPreviewTemplate(null)}
        />
      )}

      {/* Template Editor Modal/Drawer */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit Template: {editingTemplate.name}</h2>
                <p className="text-sm text-slate-500">Modify layout sections and default content seeds</p>
              </div>
              <button 
                onClick={() => setEditingTemplate(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Template Name</label>
                  <input 
                    type="text" 
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none font-medium" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                  <select 
                    value={editingTemplate.category}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value as CategoryId })}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none capitalize"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Active Sections</label>
                <div className="grid grid-cols-2 gap-3">
                  {['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'faq', 'footer'].map((section) => (
                    <label key={section} className="flex items-center gap-3 p-3 border-2 border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                      <input 
                        type="checkbox" 
                        checked={editingTemplate.sections.includes(section as any)}
                        onChange={(e) => {
                          const sections = e.target.checked 
                            ? [...editingTemplate.sections, section as any]
                            : editingTemplate.sections.filter(s => s !== section);
                          setEditingTemplate({ ...editingTemplate, sections });
                        }}
                        className="w-4 h-4 text-indigo-600 rounded-lg border-slate-300 focus:ring-0"
                      />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{section}</span>
                    </label>
                  ))}
                </div>
              </div>

              {editingTemplate.defaultContent.hero && (
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Default Content: Hero</label>
                  <div className="space-y-4 p-5 border-2 border-slate-100 rounded-2xl bg-slate-50">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Badge Text</label>
                      <input 
                        type="text" 
                        value={editingTemplate.defaultContent.hero.badge} 
                        onChange={(e) => setEditingTemplate({
                          ...editingTemplate,
                          defaultContent: {
                            ...editingTemplate.defaultContent,
                            hero: { ...editingTemplate.defaultContent.hero!, badge: e.target.value }
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-xl text-sm" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Headline</label>
                      <input 
                        type="text" 
                        value={editingTemplate.defaultContent.hero.title} 
                        onChange={(e) => setEditingTemplate({
                          ...editingTemplate,
                          defaultContent: {
                            ...editingTemplate.defaultContent,
                            hero: { ...editingTemplate.defaultContent.hero!, title: e.target.value }
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-xl text-sm font-bold" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-slate-50 flex gap-4">
              <button 
                onClick={() => setEditingTemplate(null)}
                className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors uppercase text-xs tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg uppercase text-xs tracking-widest"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
