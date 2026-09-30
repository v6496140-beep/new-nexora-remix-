import React, { useState } from 'react';
import { useTenant } from '../routing/TenantContext';
import { getPublicBusinessBySlug } from '../data/seededPublicBusinesses';
import { resolveTemplateData } from '../services/templateResolver';
import { PublicWebsiteRenderer } from '../components/public/PublicWebsiteRenderer';
import { Button, Badge, Typography } from '../design-system';
import { CATEGORY_THEMES } from '../design-system/tokens';
import { MapPin, Phone, CalendarCheck, Clock, User, Menu, X, ArrowLeft } from 'lucide-react';

export interface PublicBusinessShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children?: React.ReactNode;
}

export const PublicBusinessShell: React.FC<PublicBusinessShellProps> = ({
  currentPath,
  onNavigate,
  children
}) => {
  const { businessSlug } = useTenant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic business resolution from local development seeds
  const seededBusiness = getPublicBusinessBySlug(businessSlug);

  if (!seededBusiness) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <Typography variant="h2">Salon Not Found</Typography>
          <Typography variant="body" className="text-slate-500">
            No active salon matches identifier <code>/b/{businessSlug}</code>.
          </Typography>
          <Button onClick={() => onNavigate('/')}>Return to Platform Home</Button>
        </div>
      </div>
    );
  }

  // Resolve template data and category config
  const templateData = resolveTemplateData(seededBusiness.category, seededBusiness.templateId);
  const theme = templateData?.themeTokens || {
    primaryColor: '#1a1917',
    textColor: '#1a1917',
    accentColor: '#c5a880',
    backgroundColor: '#faf9f6',
    surfaceColor: '#ffffff',
    fontFamilyHeading: 'serif',
    fontFamilyBody: 'sans-serif'
  };

  const publicNavLinks = [
    { label: 'Home', path: `/b/${businessSlug}` },
    { label: 'Services', path: `/b/${businessSlug}/services` },
    { label: 'Packages', path: `/b/${businessSlug}/packages` },
    { label: 'Gallery', path: `/b/${businessSlug}/gallery` },
    { label: 'About', path: `/b/${businessSlug}/about` },
    { label: 'Contact', path: `/b/${businessSlug}/contact` }
  ];

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-left"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      {/* 1. ANNOUNCEMENT TOP BAR */}
      <div
        className="text-xs py-2 px-4 border-b"
        style={{
          backgroundColor: theme.primaryColor,
          color: '#ffffff',
          borderColor: '#334155'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 opacity-90">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>{seededBusiness.address}, {seededBusiness.city}</span>
            </span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span className="hidden sm:flex items-center gap-1 opacity-90">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{seededBusiness.phone}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              onClick={() => onNavigate(`/b/${businessSlug}/my-bookings`)}
              className="font-medium hover:underline cursor-pointer text-[11px]"
              style={{ color: theme.accentColor }}
            >
              My Bookings
            </span>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR */}
      <header
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b"
        style={{ borderColor: '#e2e8f0' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => onNavigate(`/b/${businessSlug}`)}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {seededBusiness.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight" style={{ fontFamily: theme.fontFamilyHeading }}>
                {seededBusiness.name}
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">{seededBusiness.tagline}</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {publicNavLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? 'font-bold underline underline-offset-4'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  style={{
                    color: isActive ? theme.primaryColor : undefined
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Fast Booking CTA */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onNavigate(`/b/${businessSlug}/book`)}
              style={{ backgroundColor: theme.primaryColor, color: '#ffffff' }}
            >
              <CalendarCheck className="w-3.5 h-3.5 mr-1" />
              <span>Book ({seededBusiness.config.advancePaymentPercentage}% Adv)</span>
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b p-4 bg-white space-y-2">
            {publicNavLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t flex flex-col gap-2">
              <Button size="sm" onClick={() => { onNavigate(`/b/${businessSlug}/book`); setMobileMenuOpen(false); }}>
                Book Appointment ({seededBusiness.config.advancePaymentPercentage}% Advance)
              </Button>
              <button
                onClick={() => { onNavigate(`/b/${businessSlug}/my-bookings`); setMobileMenuOpen(false); }}
                className="text-xs text-center py-1.5 text-slate-600 font-medium"
              >
                Lookup Existing Booking
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. DYNAMIC WEBSITE CONTENT CANVAS */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {templateData ? (
          <PublicWebsiteRenderer
            business={seededBusiness}
            templateData={templateData}
            currentPath={currentPath}
            onNavigate={onNavigate}
          />
        ) : (
          children
        )}
      </main>

      {/* 4. FOOTER */}
      <footer
        className="py-8 px-4 border-t text-xs text-center mt-auto"
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          color: '#64748b'
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 {seededBusiness.name}. Powered by Nexora SalonOS.</p>
          <div className="flex items-center gap-3">
            <span>{seededBusiness.config.advancePaymentPercentage}% Online Advance Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer" onClick={() => onNavigate(`/b/${businessSlug}/contact`)}>
              Directions & Hours
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
