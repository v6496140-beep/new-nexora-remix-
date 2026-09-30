import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CreditCard, 
  Settings, 
  Menu, 
  X,
  FileText, 
  CheckCircle, 
  Star, 
  Palette, 
  Calendar, 
  Layout,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

export const SuperAdminShell: React.FC<{ 
  children: React.ReactNode; 
  activeId: string; 
  onNavigate: (id: string) => void; 
}> = ({ children, activeId, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navGroups = [
    { 
      label: 'Overview', 
      items: [{ id: 'sa-dashboard', label: 'Dashboard', icon: LayoutDashboard }] 
    },
    { 
      label: 'Businesses', 
      items: [
        { id: 'sa-businesses', label: 'Businesses', icon: Briefcase },
        { id: 'sa-network', label: 'Network Members', icon: Users },
        { id: 'sa-featured', label: 'Featured', icon: Star },
        { id: 'sa-verification', label: 'Verification', icon: CheckCircle }
      ]
    },
    { 
      label: 'Catalog', 
      items: [
        { id: 'sa-categories', label: 'Categories', icon: FileText },
        { id: 'sa-templates', label: 'Templates', icon: FileText },
        { id: 'sa-themes', label: 'Themes', icon: Palette }
      ]
    },
    { 
      label: 'Platform', 
      items: [
        { id: 'sa-bookings', label: 'Bookings', icon: Calendar },
        { id: 'sa-ads', label: 'Banner Ads', icon: Layout },
        { id: 'sa-transactions', label: 'Transactions', icon: CreditCard },
        { id: 'sa-commission', label: 'Commission', icon: CreditCard },
        { id: 'sa-withdrawals', label: 'Withdrawals', icon: CreditCard },
        { id: 'sa-settlements', label: 'Settlements', icon: CreditCard }
      ]
    },
    { 
      label: 'System & Security', 
      items: [
        { id: 'sa-audit', label: 'Audit Logs', icon: ShieldAlert },
        { id: 'sa-notifications', label: 'Notifications', icon: Settings },
        { id: 'sa-settings', label: 'Platform Settings', icon: Settings }
      ]
    }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-slate-900 text-white px-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-sm text-white">
            N
          </div>
          <span className="font-black text-base tracking-tight">Nexora SuperAdmin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          className="p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white p-5 flex flex-col justify-between
        transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="overflow-y-auto pr-1 space-y-6">
          <div className="hidden lg:flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-indigo-500/20">
              N
            </div>
            <div>
              <div className="font-black text-base text-white tracking-tight">Nexora</div>
              <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Platform SuperAdmin</div>
            </div>
          </div>

          <nav className="space-y-5" aria-label="SuperAdmin navigation">
            {navGroups.map(group => (
              <div key={group.label} className="space-y-1.5">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3">
                  {group.label}
                </h3>
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const isActive = activeId === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left
                          ${isActive 
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'}
                        `}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Exit to Business Admin */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-left"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit to Salon Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
