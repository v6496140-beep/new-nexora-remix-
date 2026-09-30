import React from 'react';
import { BusinessSeedData } from '../../data/seededPublicBusinesses';
import { ResolvedTemplateData } from '../../services/templateResolver';
import { Button, Card, Badge, Typography, Avatar } from '../../design-system';
import {
  Sparkles,
  ArrowRight,
  CalendarCheck,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface PublicComponentProps {
  business: BusinessSeedData;
  templateData: ResolvedTemplateData;
  onNavigate: (path: string) => void;
}

// 1. HERO SECTION
export const PublicHero: React.FC<PublicComponentProps> = ({ business, templateData, onNavigate }) => {
  const content = templateData.template.defaultContent.hero;
  const theme = templateData.themeTokens;

  return (
    <section className="py-12 sm:py-16 lg:py-20 text-center relative overflow-hidden rounded-3xl mb-12 border" style={{ backgroundColor: theme.surfaceColor, borderColor: '#e2e8f0' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {content?.badge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold shadow-xs border" style={{ backgroundColor: '#f1f5f9', color: theme.primaryColor, borderColor: '#cbd5e1' }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
            <span>{content.badge}</span>
          </div>
        )}

        {business.verificationStatus === 'verified' && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Nexora Verified Entity</span>
            </div>
          </div>
        )}

        <Typography variant="display" className="tracking-tight font-black" style={{ color: theme.textColor, fontFamily: theme.fontFamilyHeading }}>
          {content?.title || business.name}
        </Typography>

        <Typography variant="body" className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: theme.fontFamilyBody }}>
          {content?.subtitle || business.tagline}
        </Typography>

        {/* CTA Stack */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() => onNavigate(`/b/${business.slug}/book`)}
            className="w-full sm:w-auto font-bold shadow-md cursor-pointer"
            style={{ backgroundColor: theme.primaryColor, color: '#ffffff' }}
          >
            <CalendarCheck className="w-4 h-4 mr-1.5" />
            <span>{content?.primaryCTA || `Book Chair (25% Adv)`}</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate(`/b/${business.slug}/services`)}
            className="w-full sm:w-auto font-semibold cursor-pointer"
          >
            <span>{content?.secondaryCTA || 'Explore Menu'}</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>

        {/* Advance Policy Guarantee Strip */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>25% Online Advance</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Verified Specialists</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Free cancellation up to 4 hrs</span>
          </span>
        </div>
      </div>
    </section>
  );
};

// 2. FEATURED SERVICES
export const PublicFeaturedServices: React.FC<PublicComponentProps> = ({ business, templateData, onNavigate }) => {
  const content = templateData.template.defaultContent.services;
  const services = templateData.defaultServices.slice(0, 3);
  const theme = templateData.themeTokens;

  return (
    <section className="py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Badge variant="brand">{templateData.category.terminology.services}</Badge>
          <Typography variant="h2" className="mt-1" style={{ fontFamily: theme.fontFamilyHeading }}>
            {content?.heading || `Featured ${templateData.category.terminology.services}`}
          </Typography>
          <Typography variant="small" className="text-slate-500">
            {content?.description || `Signature treatments curated by our specialists.`}
          </Typography>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onNavigate(`/b/${business.slug}/services`)}>
          <span>View All ({templateData.defaultServices.length})</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((srv) => (
          <Card key={srv.id} padding="md" hoverEffect className="flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {srv.categoryTag}
                </span>
                {srv.isPopular && <Badge variant="brand" size="sm">Popular</Badge>}
              </div>
              <Typography variant="h3">{srv.name}</Typography>
              <Typography variant="small" className="text-slate-600 line-clamp-2">
                {srv.description}
              </Typography>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">{srv.durationMinutes} mins</span>
                <span className="font-bold text-slate-900 text-base">₹{srv.basePrice}</span>
              </div>
              <Button size="sm" onClick={() => onNavigate(`/b/${business.slug}/book`)}>
                Book
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

// 3. FEATURED PACKAGES
export const PublicFeaturedPackages: React.FC<PublicComponentProps> = ({ business, templateData, onNavigate }) => {
  const content = templateData.template.defaultContent.packages;
  const packages = templateData.defaultPackages;
  const theme = templateData.themeTokens;

  if (packages.length === 0) return null;

  return (
    <section className="py-10 space-y-6">
      <div>
        <Badge variant="success">Experience Bundles</Badge>
        <Typography variant="h2" className="mt-1" style={{ fontFamily: theme.fontFamilyHeading }}>
          {content?.heading || 'Signature Combination Packages'}
        </Typography>
        <Typography variant="small" className="text-slate-500">
          {content?.description || 'Multi-service bundled experiences with bundled savings.'}
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id} padding="lg" hoverEffect className="border-2 border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">{pkg.totalDurationMinutes} mins total</span>
                {pkg.badge && <Badge variant="success">{pkg.badge}</Badge>}
              </div>
              <Typography variant="h3">{pkg.name}</Typography>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Treatments Included:</span>
                <p className="text-xs text-slate-700 font-medium">{pkg.serviceNames.join(' + ')}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="line-through text-xs text-slate-400 mr-2">₹{pkg.originalPrice}</span>
                <span className="font-bold text-emerald-700 text-lg">₹{pkg.bundlePrice}</span>
              </div>
              <Button size="sm" onClick={() => onNavigate(`/b/${business.slug}/book`)}>
                Book Package
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

// 4. ABOUT & CRAFT
export const PublicAbout: React.FC<PublicComponentProps> = ({ business, templateData }) => {
  const content = templateData.template.defaultContent.about;
  const theme = templateData.themeTokens;

  return (
    <section className="py-12 border-y border-slate-200 bg-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 my-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <Badge variant="brand">{content?.badge || 'About Our Atelier'}</Badge>
          <Typography variant="h2" style={{ fontFamily: theme.fontFamilyHeading }}>
            {content?.heading || `The Craft & Ethos of ${business.name}`}
          </Typography>
          <Typography variant="body" className="text-slate-600 leading-relaxed">
            {content?.story || `${business.name} is dedicated to providing bespoke ${templateData.category.name.toLowerCase()} experiences in ${business.city}. We combine master craftsmanship with modern clinical hygiene.`}
          </Typography>

          {content?.highlights && (
            <div className="space-y-2 pt-2">
              {content.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs text-slate-700">
          <Typography variant="h4">Sanctuary Details & Standards</Typography>
          <div className="space-y-2">
            <p className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Location:</span>
              <span className="font-bold text-slate-900">{business.address}, {business.city}</span>
            </p>
            <p className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Advance Deposit:</span>
              <span className="font-bold text-indigo-700">{business.config.advancePaymentPercentage}% Online Reserve</span>
            </p>
            <p className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Free Cancellation:</span>
              <span className="font-bold text-slate-900">Up to {business.config.cancellationWindowHours} hours prior</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-500">Hygiene Standard:</span>
              <span className="font-bold text-emerald-700">Autoclave & UV Sterilized</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// 5. STAFF SPECIALISTS
export const PublicStaff: React.FC<PublicComponentProps> = ({ business, templateData, onNavigate }) => {
  const staff = business.staffMembers;
  const theme = templateData.themeTokens;

  return (
    <section className="py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Badge variant="brand">{templateData.category.terminology.staffPlural}</Badge>
          <Typography variant="h2" className="mt-1" style={{ fontFamily: theme.fontFamilyHeading }}>
            Meet Our Resident Specialists
          </Typography>
          <Typography variant="small" className="text-slate-500">
            Book directly with your preferred master specialist.
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {staff.map((member) => (
          <Card key={member.id} padding="md" hoverEffect className="flex flex-col items-center text-center space-y-3">
            <Avatar name={member.name} size="lg" />
            <div>
              <Typography variant="h4">{member.name}</Typography>
              <Typography variant="caption" className="text-slate-500">{member.roleTitle}</Typography>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{member.rating}</span>
              <span className="text-slate-400 font-normal">({member.reviewsCount} reviews)</span>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => onNavigate(`/b/${business.slug}/book`)}>
              Select Specialist
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
};

// 6. GALLERY PREVIEW
export const PublicGallery: React.FC<PublicComponentProps> = ({ business, templateData, onNavigate }) => {
  const images = business.galleryImages.slice(0, 4);
  const theme = templateData.themeTokens;

  return (
    <section className="py-10 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <Badge variant="neutral">Visual Portfolio</Badge>
          <Typography variant="h2" className="mt-1" style={{ fontFamily: theme.fontFamilyHeading }}>
            Our Work & Ambiance
          </Typography>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onNavigate(`/b/${business.slug}/gallery`)}>
          <span>Full Gallery</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="group relative rounded-xl overflow-hidden aspect-4/3 bg-slate-200 border border-slate-200 shadow-xs">
            <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-3 text-white">
              <span className="text-xs font-semibold">{img.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 7. TESTIMONIALS
export const PublicTestimonials: React.FC<PublicComponentProps> = ({ business, templateData }) => {
  const testimonials = business.testimonials;
  const theme = templateData.themeTokens;

  return (
    <section className="py-10 space-y-6">
      <div>
        <Badge variant="brand">Verified Reviews</Badge>
        <Typography variant="h2" className="mt-1" style={{ fontFamily: theme.fontFamilyHeading }}>
          Client Experiences
        </Typography>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <Card key={t.id} padding="md" className="space-y-3 bg-white">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed">"{t.comment}"</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">{t.author}</span>
              <span className="text-slate-400">{t.role}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

// 8. FAST BOOKING CALLOUT
export const PublicBookingCTA: React.FC<PublicComponentProps> = ({ business, templateData, onNavigate }) => {
  const theme = templateData.themeTokens;

  return (
    <section className="my-12 p-8 sm:p-12 rounded-3xl text-center space-y-4 shadow-xl text-white" style={{ backgroundColor: theme.primaryColor }}>
      <Typography variant="h2" className="text-white">
        Reserve Your Next Appointment
      </Typography>
      <Typography variant="body" className="text-slate-300 max-w-xl mx-auto text-sm">
        Lock in your preferred specialist and time slot. 25% advance deposit secures your booking instantly.
      </Typography>
      <div className="pt-2">
        <Button size="lg" onClick={() => onNavigate(`/b/${business.slug}/book`)} className="bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-md cursor-pointer">
          <CalendarCheck className="w-4 h-4 mr-2 text-indigo-600" />
          <span>Book Chair Now (25% Adv)</span>
        </Button>
      </div>
    </section>
  );
};

// 9. LOCATION & CONTACT
export const PublicContact: React.FC<PublicComponentProps> = ({ business, templateData }) => {
  return (
    <section className="py-10 border-t border-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-left">
        <div className="space-y-1">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span>Salon Address</span>
          </span>
          <p className="text-slate-600">{business.address}</p>
          <p className="text-slate-600">{business.city} - {business.postalCode}</p>
        </div>

        <div className="space-y-1">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-slate-500" />
            <span>Contact & Inquiries</span>
          </span>
          <p className="text-slate-600">{business.phone}</p>
          <p className="text-slate-600">{business.email}</p>
        </div>

        <div className="space-y-1">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Standard Hours</span>
          </span>
          <p className="text-slate-600">Tue - Sun: 09:00 AM - 08:30 PM</p>
          <p className="text-slate-400">Monday: Closed for Sanitization</p>
        </div>
      </div>
    </section>
  );
};
