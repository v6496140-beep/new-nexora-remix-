import React from 'react';
import { AdminShell } from '../../AdminShell';

export function WebsiteAdminLayout({ children, activeTab, onNavigate }: { children: React.ReactNode, activeTab: string, onNavigate: (id: string) => void }) {
  const tabs = [
    { id: 'website-overview', label: 'Overview' },
    { id: 'website-pages', label: 'Pages' },
    { id: 'website-sections', label: 'Sections' },
    { id: 'website-theme', label: 'Theme' },
    { id: 'website-content', label: 'Content' },
    { id: 'website-nav', label: 'Navigation' },
    { id: 'website-seo', label: 'SEO' },
    { id: 'website-preview', label: 'Preview' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`px-4 py-2 border-b-2 ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}
