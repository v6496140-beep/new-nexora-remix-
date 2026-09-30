import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  Globe,
  TrendingUp,
  CreditCard,
  Settings,
  Menu,
  LogOut
} from 'lucide-react';
import { AdminHeader } from './AdminHeader';

// Shell Types
export type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

// Reusable Components
const NavItemComponent: React.FC<{ item: NavItem; active: boolean; onClick: () => void }> = ({ item, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <item.icon className="w-5 h-5" />
    {item.label}
  </button>
);

const NavGroupComponent: React.FC<{ group: NavGroup; activeId: string; onNavigate: (id: string) => void }> = ({ group, activeId, onNavigate }) => (
  <div className="py-2">
    <h3 className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{group.label}</h3>
    <div className="space-y-1">
      {group.items.map((item) => (
        <NavItemComponent
          key={item.id}
          item={item}
          active={activeId === item.id}
          onClick={() => onNavigate(item.id)}
        />
      ))}
    </div>
  </div>
);

// Admin Shell
export const AdminShell: React.FC<{ 
  children: React.ReactNode, 
  activeId?: string, 
  onNavigate?: (id: string) => void 
}> = ({ children, activeId = 'dashboard', onNavigate = () => {} }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navGroups: NavGroup[] = [
    { label: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '#' }] },
    { label: 'Appointments', items: [
      { id: 'bookings', label: 'Bookings', icon: Calendar, path: '#' },
      { id: 'calendar', label: 'Calendar', icon: Calendar, path: '#' }
    ]},
    { label: 'Customers', items: [
      { id: 'customers', label: 'Customers', icon: Users, path: '#' },
      { id: 'segments', label: 'Segments', icon: Users, path: '#' }
    ]},
    { label: 'Business', items: [
      { id: 'services', label: 'Services', icon: Briefcase, path: '#' },
      { id: 'packages', label: 'Packages', icon: Briefcase, path: '#' },
      { id: 'staff', label: 'Staff', icon: Users, path: '#' },
      { id: 'availability', label: 'Availability', icon: Calendar, path: '#' },
      { id: 'leave', label: 'Leave', icon: Calendar, path: '#' }
    ]},
    { label: 'Website', items: [
      { id: 'website-overview', label: 'Website Overview', icon: Globe, path: '#' },
      { id: 'gallery', label: 'Gallery', icon: Globe, path: '#' },
      { id: 'reviews', label: 'Reviews', icon: Users, path: '#' },
      { id: 'business', label: 'Business Settings', icon: Settings, path: '#' }
    ]},
    { label: 'Growth', items: [
      { id: 'offers', label: 'Offers', icon: TrendingUp, path: '#' },
      { id: 'automations', label: 'Automations', icon: TrendingUp, path: '#' },
      { id: 'whatsapp', label: 'WhatsApp', icon: TrendingUp, path: '#' },
      { id: 'rewards', label: 'Rewards', icon: TrendingUp, path: '#' },
      { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '#' }
    ]},
    { label: 'Money', items: [
      { id: 'payments', label: 'Payments', icon: CreditCard, path: '#' },
      { id: 'transactions', label: 'Transactions', icon: CreditCard, path: '#' },
      { id: 'commission', label: 'Commission', icon: CreditCard, path: '#' },
      { id: 'wallet', label: 'Wallet', icon: CreditCard, path: '#' },
      { id: 'withdrawals', label: 'Withdrawals', icon: CreditCard, path: '#' },
      { id: 'settlements', label: 'Settlements', icon: CreditCard, path: '#' }
    ]},
    { label: 'Settings', items: [
      { id: 'business_settings', label: 'Business Settings', icon: Settings, path: '#' },
      { id: 'booking_settings', label: 'Booking Settings', icon: Settings, path: '#' },
      { id: 'payment_settings', label: 'Payment Settings', icon: Settings, path: '#' },
      { id: 'notifications', label: 'Notifications', icon: Settings, path: '#' },
      { id: 'policies', label: 'Policies', icon: Settings, path: '#' }
    ]}
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-4 border-b border-slate-100">
          <span className="text-xl font-black text-indigo-600">Nexora</span>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-4">
          {navGroups.map((group, i) => (
            <NavGroupComponent key={i} group={group} activeId={activeId} onNavigate={onNavigate} />
          ))}
          <button 
            onClick={() => onNavigate('sa-dashboard')}
            className="w-full mt-2 flex items-center gap-3 px-4 py-2.5 bg-slate-900 text-slate-100 rounded-lg text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg"
          >
            <Settings className="w-5 h-5" />
            Super Admin Access
          </button>
          <button className="w-full mt-4 flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-rose-600 transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
