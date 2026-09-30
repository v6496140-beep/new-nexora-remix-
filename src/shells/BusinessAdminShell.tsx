import React, { useState } from 'react';
import { Button, Badge, Avatar, Typography } from '../design-system';
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  Users,
  Scissors,
  Layers,
  UserCheck,
  Star,
  Image,
  Globe,
  Palette,
  FileText,
  CreditCard,
  FileCheck2,
  Percent,
  Award,
  Wallet,
  FileSpreadsheet,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  LogOut,
  ExternalLink
} from 'lucide-react';

export interface BusinessAdminShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children?: React.ReactNode;
}

export const BusinessAdminShell: React.FC<BusinessAdminShellProps> = ({
  currentPath,
  onNavigate,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNavSections = [
    {
      group: 'Operations',
      items: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck, badge: '14' },
        { label: 'Calendar Dispatch', path: '/admin/calendar', icon: Calendar },
        { label: 'Customers', path: '/admin/customers', icon: Users }
      ]
    },
    {
      group: 'Catalog & Team',
      items: [
        { label: 'Services', path: '/admin/services', icon: Scissors },
        { label: 'Packages', path: '/admin/packages', icon: Layers },
        { label: 'Staff Roster', path: '/admin/staff', icon: UserCheck },
        { label: 'Availability', path: '/admin/availability', icon: Calendar }
      ]
    },
    {
      group: 'Marketing & CMS',
      items: [
        { label: 'Gallery', path: '/admin/gallery', icon: Image },
        { label: 'Reviews', path: '/admin/reviews', icon: Star },
        { label: 'Website Builder', path: '/admin/website', icon: Globe },
        { label: 'Theme Tokens', path: '/admin/theme', icon: Palette },
        { label: 'Content Copy', path: '/admin/content', icon: FileText }
      ]
    },
    {
      group: 'Finance & Payouts',
      items: [
        { label: 'Payments (25% Adv)', path: '/admin/payments', icon: CreditCard },
        { label: 'Transactions', path: '/admin/transactions', icon: FileCheck2 },
        { label: 'Commission', path: '/admin/commission', icon: Percent },
        { label: 'Qualification', path: '/admin/qualification', icon: Award },
        { label: 'Settlements', path: '/admin/settlements', icon: Wallet },
        { label: 'Tax / TDS GST', path: '/admin/tax', icon: FileSpreadsheet }
      ]
    },
    {
      group: 'System',
      items: [
        { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
        { label: 'Settings', path: '/admin/settings', icon: Settings }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Admin Topbar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              N
            </span>
            <span>Nexora <span className="text-slate-500 font-normal">Admin</span></span>
          </div>
          <span className="h-4 w-px bg-slate-200 hidden sm:block" />
          <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
            The Royal Crown Barber & Lounge (NEX-BOM-004)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/b/royal-crown')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 cursor-pointer"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-2 text-xs pl-2 border-l border-slate-200">
            <Avatar name="Vikram Singhania" size="sm" />
            <div className="hidden md:block text-left">
              <p className="font-bold text-slate-800 leading-tight">Vikram S.</p>
              <p className="text-[10px] text-slate-400">Business Owner</p>
            </div>
            <button
              onClick={() => onNavigate('/sign-in')}
              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Shell Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 p-3 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="overflow-y-auto space-y-4">
            <div className="flex items-center justify-between px-2 pt-2 md:hidden">
              <span className="font-bold text-sm text-white">Menu Navigation</span>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {adminNavSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-0.5">
                <p className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {section.group}
                </p>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        onNavigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-800 text-slate-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 px-2">
            <p className="text-slate-400 font-semibold">Salon OS v3.3</p>
            <p className="text-[10px]">Advance 25% Configured</p>
          </div>
        </aside>

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] text-left">
          {children}
        </main>
      </div>
    </div>
  );
};
