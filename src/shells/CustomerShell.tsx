import React from 'react';
import { Button, Badge, Typography, Avatar } from '../design-system';
import { User, Calendar, History, LogOut, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';

export interface CustomerShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children?: React.ReactNode;
}

export const CustomerShell: React.FC<CustomerShellProps> = ({
  currentPath,
  onNavigate,
  children
}) => {
  const customerTabs = [
    { label: 'Active Pass', path: '/customer', icon: Calendar },
    { label: 'My Bookings', path: '/customer/bookings', icon: History },
    { label: 'Profile & Formulas', path: '/customer/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-sm font-bold tracking-tight">Nexora Client Portal</span>
              <span className="block text-[10px] text-emerald-400 font-medium">Verified Customer Session</span>
            </div>
          </div>

          {/* User Status */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-200">Rahul Kapoor</p>
              <p className="text-[10px] text-slate-400">+91 98200 12345</p>
            </div>
            <Avatar name="Rahul Kapoor" size="sm" />
            <button
              onClick={() => onNavigate('/sign-in')}
              className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Customer Sub Navigation */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-slate-800 overflow-x-auto">
          {customerTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPath === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => onNavigate(tab.path)}
                className={`py-2.5 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-400 text-emerald-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
};
