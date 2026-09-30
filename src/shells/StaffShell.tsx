import React from 'react';
import { Button, Badge, Avatar, Typography } from '../design-system';
import {
  Calendar,
  CalendarCheck,
  Clock,
  UserCheck,
  User,
  LogOut,
  ArrowLeft,
  Scissors
} from 'lucide-react';

export interface StaffShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children?: React.ReactNode;
}

export const StaffShell: React.FC<StaffShellProps> = ({
  currentPath,
  onNavigate,
  children
}) => {
  const staffTabs = [
    { label: 'Today Chair', path: '/staff', icon: Scissors },
    { label: 'My Schedule', path: '/staff/calendar', icon: Calendar },
    { label: 'Client History', path: '/staff/bookings', icon: CalendarCheck },
    { label: 'Shift Roster', path: '/staff/availability', icon: Clock },
    { label: 'Specialist Bio', path: '/staff/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Staff Header */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              MS
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight">Marco Silva (Master Barber)</span>
              <span className="block text-[10px] text-amber-400 font-medium">The Royal Crown · Chair #1</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="brand">8 Appointments Today</Badge>
            <button
              onClick={() => onNavigate('/sign-in')}
              className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Staff Sub-Tabs */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-slate-800 overflow-x-auto">
          {staffTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPath === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => onNavigate(tab.path)}
                className={`py-2.5 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-amber-400 text-amber-400 font-bold'
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
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 text-left">
        {children}
      </main>
    </div>
  );
};
