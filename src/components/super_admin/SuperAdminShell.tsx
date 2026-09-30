import React, { useState } from 'react';
import { LayoutDashboard, Users, Briefcase, Globe, TrendingUp, CreditCard, Settings, Menu, LogOut, FileText, CheckCircle, Star, Palette, Calendar, Layout } from 'lucide-react';

export const SuperAdminShell: React.FC<{ children: React.ReactNode, activeId: string, onNavigate: (id: string) => void }> = ({ children, activeId, onNavigate }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navGroups = [
    { label: 'Overview', items: [{ id: 'sa-dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '#' }] },
    { label: 'Businesses', items: [
      { id: 'sa-businesses', label: 'Businesses', icon: Briefcase, path: '#' },
      { id: 'sa-network', label: 'Network Members', icon: Users, path: '#' },
      { id: 'sa-featured', label: 'Featured', icon: Star, path: '#' },
      { id: 'sa-verification', label: 'Verification', icon: CheckCircle, path: '#' }
    ]},
    { label: 'Catalog', items: [
      { id: 'sa-categories', label: 'Categories', icon: FileText, path: '#' },
      { id: 'sa-templates', label: 'Templates', icon: FileText, path: '#' },
      { id: 'sa-themes', label: 'Themes', icon: Palette, path: '#' }
    ]},
    { label: 'Platform', items: [
      { id: 'sa-bookings', label: 'Bookings', icon: Calendar, path: '#' },
      { id: 'sa-ads', label: 'Banner Ads', icon: Layout, path: '#' },
      { id: 'sa-transactions', label: 'Transactions', icon: CreditCard, path: '#' },
      { id: 'sa-commission', label: 'Commission', icon: CreditCard, path: '#' },
      { id: 'sa-withdrawals', label: 'Withdrawals', icon: CreditCard, path: '#' },
      { id: 'sa-settlements', label: 'Settlements', icon: CreditCard, path: '#' }
    ]},
    { label: 'System', items: [
      { id: 'sa-notifications', label: 'Notifications', icon: Settings, path: '#' },
      { id: 'sa-audit', label: 'Audit Logs', icon: Settings, path: '#' },
      { id: 'sa-settings', label: 'Platform Settings', icon: Settings, path: '#' }
    ]}
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white p-4">
        <div className="text-xl font-bold mb-8">Nexora SuperAdmin</div>
        <nav className="space-y-6">
          {navGroups.map(group => (
            <div key={group.label}>
              <h3 className="text-xs font-bold text-slate-500 uppercase">{group.label}</h3>
              {group.items.map(item => (
                <button key={item.id} onClick={() => onNavigate(item.id)} className="block w-full text-left py-2 hover:text-indigo-400">
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

