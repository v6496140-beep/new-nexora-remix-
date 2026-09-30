import React, { useState } from 'react';
import { Button, Badge, Avatar, Typography } from '../design-system';
import {
  Shield,
  Building2,
  Layers,
  Palette,
  CalendarCheck,
  CreditCard,
  Percent,
  Wallet,
  FileSpreadsheet,
  BarChart3,
  History,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export interface SuperAdminShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children?: React.ReactNode;
}

export const SuperAdminShell: React.FC<SuperAdminShellProps> = ({
  currentPath,
  onNavigate,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const superNavItems = [
    { label: 'Platform Command', path: '/super-admin', icon: BarChart3 },
    { label: 'All Salons (1,428)', path: '/super-admin/businesses', icon: Building2, badge: '1,428' },
    { label: 'Categories', path: '/super-admin/categories', icon: Layers },
    { label: 'Templates', path: '/super-admin/templates', icon: Layers },
    { label: 'Themes Registry', path: '/super-admin/themes', icon: Palette },
    { label: 'Global Bookings', path: '/super-admin/bookings', icon: CalendarCheck },
    { label: 'Transactions', path: '/super-admin/transactions', icon: CreditCard },
    { label: 'Commission (5%)', path: '/super-admin/commission', icon: Percent },
    { label: 'Settlements', path: '/super-admin/settlements', icon: Wallet },
    { label: 'Tax Rules & GST', path: '/super-admin/tax', icon: FileSpreadsheet },
    { label: 'Platform Reports', path: '/super-admin/reports', icon: BarChart3 },
    { label: 'Audit Logs', path: '/super-admin/audit', icon: History, badge: 'Live' },
    { label: 'Platform Settings', path: '/super-admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Super Admin Topbar */}
      <header className="h-14 bg-slate-950 text-white border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
              Ω
            </span>
            <span className="font-bold text-sm text-white">Nexora Global Cloud</span>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold ml-1">
              SUPER ADMIN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">Root: rajnish@nexora.io</span>
          <button
            onClick={() => onNavigate('/sign-in')}
            className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Super Admin Shell Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 p-3 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="overflow-y-auto space-y-1">
            <div className="flex items-center justify-between px-2 pt-2 md:hidden">
              <span className="font-bold text-sm text-white">Super Admin Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Governance & Ledger
            </p>

            {superNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
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

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 px-2">
            <p className="text-slate-400 font-semibold">Tier 0 Root Authorization</p>
            <p className="text-[10px]">1,428 Multi-Tenant Instances</p>
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
