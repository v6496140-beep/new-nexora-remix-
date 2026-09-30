import React, { useState } from 'react';
import { Button, Badge, Typography } from '../design-system';
import { Globe, ArrowRight, Menu, X, CheckCircle2, Sparkles, Shield, Clock } from 'lucide-react';

export interface MarketingShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children?: React.ReactNode;
}

export const MarketingShell: React.FC<MarketingShellProps> = ({
  currentPath,
  onNavigate,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Platform Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: 'Website Templates', path: '/templates' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Nexora SalonOS Platform Live</span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline text-slate-400">Multi-tenant booking & website engine for modern salons</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-amber-400">25% Advance Configured</span>
          </div>
        </div>
      </div>

      {/* Marketing Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
              N
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900">Nexora <span className="text-indigo-600">SalonOS</span></span>
              <span className="block text-[10px] text-slate-400 font-medium">Next-Gen SaaS Platform</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  currentPath === link.path
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigate('/sign-in')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 cursor-pointer"
            >
              Sign In
            </button>
            <Button size="sm" onClick={() => onNavigate('/onboarding')}>
              <span>Launch Salon</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white p-4 space-y-3">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    onNavigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                    currentPath === link.path ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={() => { onNavigate('/sign-in'); setMobileMenuOpen(false); }}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => { onNavigate('/onboarding'); setMobileMenuOpen(false); }}>
                Launch Salon Onboarding
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Marketing Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Nexora SalonOS. Multi-tenant Architecture.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('/categories')}>Categories</span>
            <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('/templates')}>Templates</span>
            <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('/sign-in')}>Client Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
