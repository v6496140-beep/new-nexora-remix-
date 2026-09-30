import React from 'react';
import { Layers, ShieldCheck, FileText, Compass, LayoutGrid, GitBranch, Sparkles, Layout, Clock, UserCheck, LayoutDashboard, SlidersHorizontal, ShieldAlert, Cpu, Palette, Route, Boxes, Globe, Lock, Sliders, CalendarCheck2, Scissors, CalendarRange, Clock3, UserCheck2, CreditCard, Bell, Users, History, Star, QrCode, Percent, Wallet, TrendingUp, Shield } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wireframeCategory: string;
  setWireframeCategory: (cat: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    { id: 'phase612-hardening', label: 'Phase 6.12: Hardening & Testing', icon: Shield },
    { id: 'phase611-ai-growth', label: 'Phase 6.11: AI Growth & Analytics', icon: TrendingUp },
    { id: 'phase610-automations', label: 'Phase 6.10: Re-Engagement Automations', icon: Cpu },
    { id: 'phase69-offers', label: 'Phase 6.9: One-Click Offers', icon: Sparkles },
    { id: 'phase68-crm', label: 'Phase 6.8: Customer Growth CRM', icon: Users },
    { id: 'phase67-rewards', label: 'Phase 6.7: Network Directory & Milestone Rewards', icon: Compass },
    { id: 'phase66-wallet', label: 'Phase 6.6: Business Wallet & Ledger', icon: Wallet },
    { id: 'phase65-withdrawal', label: 'Phase 6.5: Daily Withdrawal Engine', icon: Clock },
    { id: 'phase64-ledger', label: 'Phase 6.4: Commission & Ledger', icon: Percent },
    { id: 'phase63-split', label: 'Phase 6.3: Collection Split Engine', icon: Percent },
    { id: 'phase62-nexora-qr', label: 'Phase 6.2: Nexora QR Collection', icon: QrCode },
    { id: 'phase61-payment', label: 'Phase 6.1: Payment & Transactions', icon: CreditCard },
    { id: 'phase510-security', label: 'Phase 5.10: Security & Deliverables Report', icon: ShieldCheck },
    { id: 'phase59-operational-dashboard', label: 'Phase 5.9: Business Operational Dashboard', icon: LayoutDashboard },
    { id: 'phase58-communication', label: 'Phase 5.8: Customer Communication', icon: Bell },
    { id: 'phase57-reviews', label: 'Phase 5.7: Reviews & Ratings', icon: Star },
    { id: 'phase56-daily-operations', label: 'Phase 5.6: Daily Appointment Operations', icon: Clock3 },
    { id: 'phase55-staff-dashboard', label: 'Phase 5.5: Staff Dashboard', icon: UserCheck },
    { id: 'phase54-staff-availability', label: 'Phase 5.4: Staff Availability & Leave', icon: CalendarRange },
    { id: 'phase53-staff-management', label: 'Phase 5.3: Business Staff Management', icon: Users },
    { id: 'phase52-customer-profile', label: 'Phase 5.2: Customer Profile & History', icon: History },
    { id: 'phase51-customer-crm', label: 'Phase 5.1: Customer Management / CRM', icon: Users },
    { id: 'phase49-booking-hardening', label: 'Phase 4.9: Booking Hardening & Testing', icon: ShieldCheck },
    { id: 'phase48-business-management', label: 'Phase 4.8: Business Management & Calendar', icon: LayoutDashboard },
    { id: 'phase47-booking-notifications', label: 'Phase 4.7: Confirmation & Notifications', icon: Bell },
    { id: 'phase46-advance-payment', label: 'Phase 4.6: Advance Payment', icon: CreditCard },
    { id: 'phase45-customer-booking', label: 'Phase 4.5: Customer Booking Flow', icon: UserCheck2 },
    { id: 'phase44-slot-engine', label: 'Phase 4.4: Slot Engine', icon: Clock3 },
    { id: 'phase43-staff-schedule', label: 'Phase 4.3: Staff Availability', icon: CalendarRange },
    { id: 'phase42-services-packages', label: 'Phase 4.2: Services & Packages', icon: Scissors },
    { id: 'phase41-booking-state-machine', label: 'Phase 4.1: Booking State Machine', icon: CalendarCheck2 },
    { id: 'phase38-website-builder', label: 'Phase 3.8: Website Builder', icon: Sliders },
    { id: 'phase37-onboarding', label: 'Phase 3.7: Onboarding', icon: Sparkles },
    { id: 'phase36-auth-foundation', label: 'Phase 3.6: Authentication', icon: Lock },
    { id: 'phase35-public-website', label: 'Phase 3.5: Public Website', icon: Globe },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-semibold text-sm tracking-wider">
              N
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                Nexora SalonOS
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-normal">
                Architecture & Low-Fi Blueprint (Phase 1)
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline-flex text-xs text-slate-600 border border-slate-200 bg-slate-50 px-2.5 py-1 rounded">
              Phase 1: Architecture & Wireframes Only
            </span>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-100 gap-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
