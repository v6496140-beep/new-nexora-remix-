import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react';

// Mock Gallery Service for now, replacing with real integration if needed
const galleryService = {
  getGallery: (tenantId: string) => [
    { id: 'g1', title: 'Modern Fade', visible: true, featured: true },
    { id: 'g2', title: 'Beard Trim', visible: true, featured: false },
    { id: 'g3', title: 'Transformation', visible: false, featured: false },
  ],
};

export function GalleryPage() {
  const tenantId = 'biz-barber-001';
  const [items] = useState(galleryService.getGallery(tenantId));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Gallery Management</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="h-40 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
              Image Preview
            </div>
            <h3 className="font-semibold">{item.title}</h3>
            <div className="flex justify-between mt-4">
              <div className="flex gap-2">
                <button>{item.visible ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}</button>
                <button>{item.featured ? <Star className="w-4 h-4 text-amber-500" /> : <Star className="w-4 h-4 text-slate-300" />}</button>
              </div>
              <div className="flex gap-2">
                <button className="text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                <button className="text-rose-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
