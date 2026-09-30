import React, { useState } from 'react';
import { Search, Plus, Edit2, Power, Eye, Info, X, Check } from 'lucide-react';
import { CATEGORIES_REGISTRY } from '../../../config/categoriesRegistry';
import { TEMPLATES_REGISTRY } from '../../../config/templatesRegistry';
import { SEEDED_PUBLIC_BUSINESSES } from '../../../data/seededPublicBusinesses';
import { CategoryDefinition, CategoryId } from '../../../types/categoryEngine';

export function CategoryManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingCategory, setViewingCategory] = useState<CategoryDefinition | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryDefinition | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'defaults' | 'terminology'>('info');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // SESSION STATE: Initialized from registry
  const [localCategories, setLocalCategories] = useState<CategoryDefinition[]>(Object.values(CATEGORIES_REGISTRY));
  const [categoryStatuses, setCategoryStatuses] = useState<Record<string, 'Active' | 'Inactive'>>(
    Object.fromEntries(Object.keys(CATEGORIES_REGISTRY).map(id => [id, 'Active']))
  );

  const filteredCategories = localCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTemplateCount = (catId: string) => {
    return TEMPLATES_REGISTRY.filter(t => t.category === catId).length;
  };

  const isCategoryInUse = (catId: string) => {
    return Object.values(SEEDED_PUBLIC_BUSINESSES).some(biz => biz.category === catId);
  };

  const validateCategory = (name: string, slug: string, id?: string) => {
    const newErrors: Record<string, string> = {};
    
    // Format validation
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    // Uniqueness validation
    const nameExists = localCategories.some(cat => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== id);
    const slugExists = localCategories.some(cat => cat.slug === slug && cat.id !== id);

    if (nameExists) newErrors.name = 'A category with this name already exists';
    if (slugExists) newErrors.slug = 'This slug is already taken';

    return newErrors;
  };

  const handleToggleStatus = (catId: string) => {
    const currentStatus = categoryStatuses[catId] || 'Active';
    if (currentStatus === 'Active' && isCategoryInUse(catId)) {
      alert(`Safety Lock: Cannot deactivate "${catId}" because existing businesses depend on it.`);
      return;
    }
    
    setCategoryStatuses(prev => ({
      ...prev,
      [catId]: currentStatus === 'Active' ? 'Inactive' : 'Active'
    }));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    const validationErrors = validateCategory(editingCategory.name, editingCategory.slug, editingCategory.id);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLocalCategories(prev => prev.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
    setErrors({});
    alert('Changes saved to session state.');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;

    const validationErrors = validateCategory(name, slug);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const newCat: CategoryDefinition = {
      id: slug as any,
      name,
      slug,
      description,
      terminology: {
        service: 'Service', services: 'Services', staff: 'Staff', staffPlural: 'Staff Members',
        appointment: 'Appointment', chairOrRoom: 'Station', customer: 'Customer'
      },
      bookingTerminology: {
        selectService: 'Select Service', selectStaff: 'Select Professional', selectDate: 'Pick Date',
        advanceDepositNotice: '25% Advance', venueBalanceNotice: 'Pay at venue', confirmButton: 'Confirm'
      },
      staffRoles: ['Lead', 'Assistant'],
      defaultTheme: 'modern',
      homepageSections: ['hero', 'services', 'contact'],
      galleryCategories: ['General'],
      defaultServices: [],
      defaultPackages: []
    };

    setLocalCategories(prev => [newCat, ...prev]);
    setCategoryStatuses(prev => ({ ...prev, [newCat.id]: 'Active' }));
    setIsCreating(false);
    setErrors({});
    alert(`Category "${name}" created in current session.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500 text-sm">Define business categories and their global baseline configurations</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm font-bold text-xs uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, slug or description..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr className="text-left border-b">
                <th className="p-4">Name & Slug</th>
                <th className="p-4 w-1/3">Description</th>
                <th className="p-4 text-center">Templates</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{cat.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{cat.slug}</div>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-500 line-clamp-2 text-xs leading-relaxed">
                      {cat.description}
                    </p>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {getTemplateCount(cat.id)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                      (categoryStatuses[cat.id] || 'Active') === 'Active' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {categoryStatuses[cat.id] || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => setViewingCategory(cat)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setEditingCategory(cat)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                        title="Edit Configuration"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(cat.id)}
                        className={`p-1.5 rounded-md transition-all ${
                          (categoryStatuses[cat.id] || 'Active') === 'Active' 
                            ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' 
                            : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={(categoryStatuses[cat.id] || 'Active') === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreate} 
            aria-label="Category Form"
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900 font-display">New Platform Category</h3>
              <button type="button" onClick={() => setIsCreating(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Category Name</label>
                  <input 
                    name="name" 
                    required 
                    placeholder="e.g. Yoga Studio" 
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-0 outline-none transition-all ${errors.name ? 'border-rose-500 focus:border-rose-600' : 'border-slate-100 focus:border-indigo-500'}`} 
                  />
                  {errors.name && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.name}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Slug</label>
                  <input 
                    name="slug" 
                    required 
                    placeholder="yoga-studio" 
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-0 outline-none font-mono transition-all ${errors.slug ? 'border-rose-500 focus:border-rose-600' : 'border-slate-100 focus:border-indigo-500'}`} 
                  />
                  {errors.slug && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.slug}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                <textarea name="description" required rows={3} placeholder="Brief overview for the landing page..." className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none text-sm" />
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-[10px] text-indigo-700 leading-relaxed">
                <Info className="w-3 h-3 inline-block mr-1 mb-0.5" /> 
                Creating a category sets up the global terminology and default service seeds. 
                You can configure full defaults after creation.
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-2.5 border-2 rounded-xl font-bold text-slate-600 hover:bg-white transition-all text-xs uppercase tracking-widest">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-xs uppercase tracking-widest">Create Category</button>
            </div>
          </form>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingCategory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Category Detail</h3>
              <button onClick={() => setViewingCategory(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-black text-slate-900">{viewingCategory.name}</h4>
                  <p className="text-sm font-mono text-indigo-600">/{viewingCategory.slug}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  (categoryStatuses[viewingCategory.id] || 'Active') === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  {categoryStatuses[viewingCategory.id] || 'Active'}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-4">
                "{viewingCategory.description}"
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Available Templates</p>
                  <p className="text-lg font-bold text-slate-900">{getTemplateCount(viewingCategory.id)} Layouts</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">In-Use By</p>
                  <p className="text-lg font-bold text-slate-900">{Object.values(SEEDED_PUBLIC_BUSINESSES).filter(b => b.category === viewingCategory.id).length} Businesses</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button 
                onClick={() => {
                  setEditingCategory(viewingCategory);
                  setViewingCategory(null);
                }}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Open Full Editor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Drawer Overlay */}
      {editingCategory && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit Category: {editingCategory.name}</h2>
                <p className="text-sm text-slate-500">Configure global defaults and terminology</p>
              </div>
              <button 
                onClick={() => setEditingCategory(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Tabs */}
              <div className="flex border-b">
                {(['info', 'terminology', 'defaults'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-bold border-b-4 uppercase tracking-wider transition-colors ${
                      activeTab === tab 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Category Name</label>
                      <input 
                        type="text" 
                        value={editingCategory.name}
                        onChange={(e) => {
                          setEditingCategory({ ...editingCategory, name: e.target.value });
                          if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                        }}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-0 outline-none font-medium transition-all ${errors.name ? 'border-rose-500 focus:border-rose-600' : 'border-slate-100 focus:border-indigo-500'}`} 
                      />
                      {errors.name && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Slug (Read Only)</label>
                      <input 
                        type="text" 
                        defaultValue={editingCategory.slug}
                        className="w-full px-4 py-2.5 border-2 border-slate-50 rounded-xl bg-slate-50 font-mono text-xs text-slate-400 cursor-not-allowed" 
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                    <textarea 
                      value={editingCategory.description}
                      onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none min-h-[120px] text-sm leading-relaxed" 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'terminology' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(editingCategory.terminology).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input 
                          type="text" 
                          value={value}
                          onChange={(e) => setEditingCategory({
                            ...editingCategory,
                            terminology: { ...editingCategory.terminology, [key]: e.target.value }
                          })}
                          className="w-full px-4 py-2 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none text-sm font-medium" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'defaults' && (
                <div className="space-y-8 pb-12">
                  {/* Services */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest">
                      Default Seed Services <Info className="w-3 h-3 text-indigo-400" />
                    </label>
                    <div className="grid gap-3">
                      {editingCategory.defaultServices.map((service) => (
                        <div key={service.id} className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-2xl bg-white hover:border-indigo-100 transition-all group">
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                            {service.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-slate-900">{service.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">₹{service.basePrice} · {service.durationMinutes}m</div>
                          </div>
                          <button type="button" className="text-slate-300 hover:text-indigo-600 p-2 opacity-0 group-hover:opacity-100 transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button type="button" className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all text-xs font-bold uppercase tracking-widest">
                        + Add New Seed Service
                      </button>
                    </div>
                  </div>

                  {/* Packages */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 tracking-widest">
                      Default Seed Packages
                    </label>
                    <div className="grid gap-3">
                      {editingCategory.defaultPackages.map((pkg) => (
                        <div key={pkg.id} className="p-4 border-2 border-slate-100 rounded-2xl bg-white hover:border-indigo-100 transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-sm font-bold text-slate-900">{pkg.name}</div>
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-bold uppercase">{pkg.badge || 'PROMO'}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mb-3">
                            Includes: {pkg.serviceNames.join(', ')}
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                            <span className="text-slate-400">Total: ₹{pkg.bundlePrice}</span>
                            <button type="button" className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                          </div>
                        </div>
                      ))}
                      <button type="button" className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all text-xs font-bold uppercase tracking-widest">
                        + Add New Seed Package
                      </button>
                    </div>
                  </div>

                  {/* Staff Roles */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Default Staff Roles</label>
                    <div className="flex flex-wrap gap-2">
                      {editingCategory.staffRoles.map((role) => (
                        <span key={role} className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-bold uppercase tracking-tight border border-indigo-100">
                          {role}
                        </span>
                      ))}
                      <button type="button" className="px-4 py-1.5 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                        + Role
                      </button>
                    </div>
                  </div>

                  {/* Gallery Categories */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Default Gallery Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {editingCategory.galleryCategories.map((cat) => (
                        <span key={cat} className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-tight border border-slate-200">
                          {cat}
                        </span>
                      ))}
                      <button type="button" className="px-4 py-1.5 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                        + Gallery Tag
                      </button>
                    </div>
                  </div>

                  {/* Homepage Sections */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Default Homepage Sections</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['hero', 'services', 'packages', 'about', 'staff', 'gallery', 'testimonials', 'booking', 'contact', 'faq', 'footer'].map((section) => (
                        <label key={section} className="flex items-center gap-3 p-3 border-2 border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                          <input 
                            type="checkbox" 
                            checked={editingCategory.homepageSections.includes(section as any)}
                            onChange={(e) => {
                              const sections = e.target.checked 
                                ? [...editingCategory.homepageSections, section as any]
                                : editingCategory.homepageSections.filter(s => s !== section);
                              setEditingCategory({ ...editingCategory, homepageSections: sections });
                            }}
                            className="w-4 h-4 text-indigo-600 rounded-lg border-slate-300 focus:ring-0"
                          />
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{section}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-slate-50 flex gap-4">
              <button 
                type="button"
                onClick={() => setEditingCategory(null)}
                className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors uppercase text-xs tracking-widest"
              >
                Discard
              </button>
              <button 
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 uppercase text-xs tracking-widest"
              >
                Save Config
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
