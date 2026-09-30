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
  X,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../services/authContext';

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
    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
      active
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
    <span>{item.label}</span>
  </button>
);

const NavGroupComponent: React.FC<{ group: NavGroup; activeId: string; onNavigate: (id: string) => void }> = ({ group, activeId, onNavigate }) => (
  <div className="py-2 space-y-1">
    <h3 className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{group.label}</h3>
    <div className="space-y-0.5">
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
  children: React.ReactNode; 
  activeId?: string; 
  onNavigate?: (id: string) => void; 
}> = ({ children, activeId = 'dashboard', onNavigate = () => {} }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { session, signOut } = useAuth();

  const businessDisplayName = session?.businessId === 'biz-spa-02' 
    ? 'Glow & Grace Luxury Spa' 
    : 'The Royal Crown Barber';

  const navGroups: NavGroup[] = [
    { label: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '#' }] },
    { label: 'Appointments', items: [
      { id: 'bookings', label: 'Bookings', icon: Calendar, path: '#' },
      { id: 'calendar', label: 'Calendar Planner', icon: Calendar, path: '#' }
    ]},
    { label: 'Customers', items: [
      { id: 'customers', label: 'Customers', icon: Users, path: '#' },
      { id: 'segments', label: 'Client Segments', icon: Users, path: '#' }
    ]},
    { label: 'Business', items: [
      { id: 'services', label: 'Services Catalog', icon: Briefcase, path: '#' },
      { id: 'packages', label: 'Service Packages', icon: Briefcase, path: '#' },
      { id: 'staff', label: 'Staff & Team', icon: Users, path: '#' },
      { id: 'availability', label: 'Staff Availability', icon: Calendar, path: '#' },
      { id: 'leave', label: 'Leave Roster', icon: Calendar, path: '#' }
    ]},
    { label: 'Online Presence', items: [
      { id: 'website-overview', label: 'Website Builder', icon: Globe, path: '#' },
      { id: 'gallery', label: 'Photo Gallery', icon: Globe, path: '#' },
      { id: 'reviews', label: 'Customer Reviews', icon: Users, path: '#' },
      { id: 'business', label: 'Verification & Profile', icon: ShieldCheck, path: '#' }
    ]},
    { label: 'Growth Engine', items: [
      { id: 'offers', label: 'Promotions & Offers', icon: TrendingUp, path: '#' },
      { id: 'automations', label: 'CRM Automations', icon: TrendingUp, path: '#' },
      { id: 'whatsapp', label: 'WhatsApp Marketing', icon: TrendingUp, path: '#' },
      { id: 'rewards', label: 'Customer Loyalty', icon: TrendingUp, path: '#' },
      { id: 'analytics', label: 'Business Analytics', icon: TrendingUp, path: '#' }
    ]},
    { label: 'Financials & Payouts', items: [
      { id: 'payments', label: 'Payments & POS', icon: CreditCard, path: '#' },
      { id: 'transactions', label: 'Transactions', icon: CreditCard, path: '#' },
      { id: 'commission', label: 'Commission Ledger', icon: CreditCard, path: '#' },
      { id: 'wallet', label: 'Nexora Wallet', icon: CreditCard, path: '#' },
      { id: 'withdrawals', label: 'Withdrawal Engine', icon: CreditCard, path: '#' },
      { id: 'settlements', label: 'Settlement Reconciliation', icon: CreditCard, path: '#' }
    ]},
    { label: 'Settings', items: [
      { id: 'business_settings', label: 'Salon Settings', icon: Settings, path: '#' },
      { id: 'booking_settings', label: 'Booking Rules', icon: Settings, path: '#' },
      { id: 'payment_settings', label: 'Payout Accounts', icon: Settings, path: '#' },
      { id: 'notifications', label: 'Alert Policies', icon: Settings, path: '#' }
    ]}
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-sm text-white">
            N
          </div>
          <span className="font-black text-lg text-slate-900 tracking-tight">Nexora SalonOS</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between
        transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 hidden lg:flex items-center px-6 border-b border-slate-100 gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-sm shadow-indigo-600/30 shrink-0">
            N
          </div>
          <div className="min-w-0">
            <span className="text-sm font-black text-slate-900 tracking-tight block truncate">{businessDisplayName}</span>
            <span className="text-[10px] text-slate-400 font-mono block">Tenant: {session?.businessId || 'biz-barber-01'}</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-4" aria-label="Tenant Admin navigation">
          {navGroups.map((group, i) => (
            <NavGroupComponent key={i} group={group} activeId={activeId} onNavigate={handleItemClick} />
          ))}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button 
              onClick={() => handleItemClick('sa-dashboard')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-all shadow-md shadow-slate-900/10"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Settings className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">Super Admin Portal</span>
              </div>
              {session?.role !== 'SUPER_ADMIN' && (
                <span className="text-[9px] bg-rose-900/80 text-rose-300 px-1.5 py-0.5 rounded uppercase font-mono font-bold tracking-tight shrink-0">
                  Protected
                </span>
              )}
            </button>
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
