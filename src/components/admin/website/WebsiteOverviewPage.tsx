import React from 'react';
import { WebsiteAdminLayout } from './WebsiteAdminLayout';

export function WebsiteOverviewPage({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <WebsiteAdminLayout activeTab="website-overview" onNavigate={onNavigate}>
      <div className="p-6 bg-white rounded-xl border border-slate-200">
        <h2 className="text-xl font-bold">Website Overview</h2>
        <p className="text-slate-600 mt-2">Status: PUBLISHED</p>
        <p className="text-sm text-slate-500 mt-4">URL: /b/royal-crown-barber</p>
        <div className="mt-6 flex gap-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Publish</button>
            <button className="px-4 py-2 border rounded-lg" onClick={() => onNavigate('website-editor')}>Edit Website</button>
        </div>
      </div>
    </WebsiteAdminLayout>
  );
}
