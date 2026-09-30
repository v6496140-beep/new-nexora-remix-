import React from 'react';
import { BusinessSeedData } from '../../data/seededPublicBusinesses';
import { ResolvedTemplateData } from '../../services/templateResolver';
import {
  PublicHero,
  PublicFeaturedServices,
  PublicFeaturedPackages,
  PublicAbout,
  PublicStaff,
  PublicGallery,
  PublicTestimonials,
  PublicBookingCTA,
  PublicContact
} from './PublicWebsiteComponents';
import { Button, Card, Badge, Typography, Table } from '../../design-system';
import { Sparkles, CalendarCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface PageViewProps {
  business: BusinessSeedData;
  templateData: ResolvedTemplateData;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const PublicWebsiteRenderer: React.FC<PageViewProps> = ({
  business,
  templateData,
  currentPath,
  onNavigate
}) => {
  // Normalize sub-path: e.g. "/b/royal-crown/services" -> "services"
  const slugPrefix = `/b/${business.slug}`;
  const subRoute = currentPath === slugPrefix ? 'home' : currentPath.replace(`${slugPrefix}/`, '');

  // 1. HOME PAGE
  if (subRoute === 'home') {
    return (
      <div className="space-y-4">
        <PublicHero business={business} templateData={templateData} onNavigate={onNavigate} />
        <PublicFeaturedServices business={business} templateData={templateData} onNavigate={onNavigate} />
        <PublicFeaturedPackages business={business} templateData={templateData} onNavigate={onNavigate} />
        <PublicAbout business={business} templateData={templateData} onNavigate={onNavigate} />
        <PublicStaff business={business} templateData={templateData} onNavigate={onNavigate} />
        <PublicGallery business={business} templateData={templateData} onNavigate={onNavigate} />
        <PublicTestimonials business={business} templateData={templateData} onNavigate={onNavigate} />
        <PublicBookingCTA business={business} templateData={templateData} onNavigate={onNavigate} />
        <PublicContact business={business} templateData={templateData} onNavigate={onNavigate} />
      </div>
    );
  }

  // 2. SERVICES PAGE
  if (subRoute === 'services') {
    return (
      <div className="space-y-8 text-left py-4">
        <div className="border-b border-slate-200 pb-5">
          <Badge variant="brand">{templateData.category.terminology.services}</Badge>
          <Typography variant="h1" className="mt-1">Full Treatment Menu</Typography>
          <Typography variant="body" className="text-slate-500">
            Explore our artisanal menu with transparent pricing and online advance reservation.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templateData.defaultServices.map((srv) => (
            <Card key={srv.id} padding="md" className="flex justify-between items-start space-y-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Typography variant="h3">{srv.name}</Typography>
                  {srv.isPopular && <Badge variant="brand">Popular</Badge>}
                </div>
                <Typography variant="small" className="text-slate-600">{srv.description}</Typography>
                <span className="text-[11px] text-slate-400 font-mono block">{srv.durationMinutes} mins · {srv.categoryTag}</span>
              </div>
              <div className="text-right shrink-0 pl-4">
                <span className="font-bold text-slate-900 text-lg block">₹{srv.basePrice}</span>
                <span className="text-[10px] text-indigo-700 block font-bold mb-2">25% Adv: ₹{Math.round(srv.basePrice * 0.25)}</span>
                <Button size="sm" onClick={() => onNavigate(`/b/${business.slug}/book`)}>Book Slot</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 3. PACKAGES PAGE
  if (subRoute === 'packages') {
    return (
      <div className="space-y-8 text-left py-4">
        <div className="border-b border-slate-200 pb-5">
          <Badge variant="success">Experience Bundles</Badge>
          <Typography variant="h1" className="mt-1">Signature Packages & Combos</Typography>
          <Typography variant="body" className="text-slate-500">
            Curated combinations offering maximum value and complete sensory relaxation.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templateData.defaultPackages.map((pkg) => (
            <Card key={pkg.id} padding="lg" className="border-2 border-slate-200 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <Typography variant="h2">{pkg.name}</Typography>
                  <span className="text-xs text-slate-400 font-mono">{pkg.totalDurationMinutes} mins total duration</span>
                </div>
                {pkg.badge && <Badge variant="success">{pkg.badge}</Badge>}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1 text-xs">
                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Includes Treatments:</span>
                <p className="text-slate-800 font-medium">{pkg.serviceNames.join(' + ')}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="line-through text-slate-400 text-xs mr-2">₹{pkg.originalPrice}</span>
                  <span className="font-bold text-emerald-700 text-xl">₹{pkg.bundlePrice}</span>
                </div>
                <Button size="md" onClick={() => onNavigate(`/b/${business.slug}/book`)}>
                  Book Package
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 4. GALLERY PAGE
  if (subRoute === 'gallery') {
    return (
      <div className="space-y-8 text-left py-4">
        <div className="border-b border-slate-200 pb-5">
          <Badge variant="neutral">Visual Portfolio</Badge>
          <Typography variant="h1" className="mt-1">Gallery & Transformations</Typography>
          <Typography variant="body" className="text-slate-500">
            Visual record of our transformations, sterilization standards, and salon lounge.
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {business.galleryImages.map((img, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              <div className="aspect-4/3 overflow-hidden bg-slate-100">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <Badge variant="neutral" size="sm">{img.category}</Badge>
                <Typography variant="h4" className="mt-1">{img.title}</Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. ABOUT PAGE
  if (subRoute === 'about') {
    return (
      <div className="space-y-6 text-left py-4">
        <PublicAbout business={business} templateData={templateData} onNavigate={onNavigate} />
        <PublicStaff business={business} templateData={templateData} onNavigate={onNavigate} />
      </div>
    );
  }

  // 6. CONTACT PAGE
  if (subRoute === 'contact') {
    return (
      <div className="space-y-6 text-left py-4">
        <div className="border-b border-slate-200 pb-5">
          <Badge variant="neutral">Reach Us</Badge>
          <Typography variant="h1" className="mt-1">Location & Booking Inquiries</Typography>
        </div>
        <PublicContact business={business} templateData={templateData} onNavigate={onNavigate} />
      </div>
    );
  }

  // 7. MY BOOKINGS PLACEHOLDER
  if (subRoute === 'my-bookings' || subRoute === 'book') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <Card padding="lg" className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <Typography variant="h2">{subRoute === 'book' ? 'Booking Flow Entry' : 'Guest Booking Lookup'}</Typography>
          <Typography variant="body" className="text-slate-600">
            {subRoute === 'book'
              ? `Interactive 4-step booking wizard (Service → Specialist → Slot → 25% Advance Gateway) will be mounted in Phase 3.6.`
              : `Phone OTP & Booking Code verification pass lookup will be mounted in Phase 3.7.`}
          </Typography>
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={() => onNavigate(`/b/${business.slug}`)}>
              Back to Salon Homepage
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-12 text-center">
      <Typography variant="h3">404 - Page Not Found</Typography>
      <Button className="mt-4" onClick={() => onNavigate(`/b/${business.slug}`)}>Back to Home</Button>
    </div>
  );
};
