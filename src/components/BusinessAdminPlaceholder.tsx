import React from 'react';
import { Layers } from 'lucide-react';

export function BusinessAdminPlaceholder({ title = 'Module Under Construction', description = 'This operational section is being prepared according to tenant access policies.' }: { title?: string; description?: string }) {
  return (
    <div className="bg-white p-12 rounded-3xl border-2 border-slate-100 shadow-sm text-center max-w-2xl mx-auto my-8 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
        <Layers className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
    </div>
  );
}
