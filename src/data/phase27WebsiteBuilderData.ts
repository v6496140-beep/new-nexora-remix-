// Nexora SalonOS — Phase 2.7 Website Builder UI Specification Data

export interface BuilderPage {
  id: string;
  name: string;
  slug: string;
  isDefault?: boolean;
  sectionIds: string[];
}

export interface BuilderSectionProperty {
  heading?: string;
  subheading?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  imageUrl?: string;
  imageAlt?: string;
  layout: 'center' | 'split-left' | 'split-right' | 'grid-3' | 'grid-4' | 'carousel';
  spacing: 'compact' | 'normal' | 'spacious';
  background: 'white' | 'slate-50' | 'dark' | 'brand-tint';
  visible: boolean;
  labels?: Record<string, string>;
  itemsCount?: number;
}

export interface BuilderSection {
  id: string;
  type: 'Hero' | 'About' | 'Services' | 'Packages' | 'Staff' | 'Gallery' | 'Testimonials' | 'Booking CTA' | 'Contact' | 'Footer';
  name: string;
  description: string;
  iconName: string;
  properties: BuilderSectionProperty;
}

export interface ThemeConfig {
  preset: 'Luxury' | 'Minimal' | 'Modern' | 'Bold' | 'Elegant' | 'Dark';
  primaryColor: string;
  accentColor: string;
  fontFamily: 'Playfair Display + Inter' | 'Inter + Inter' | 'Cinzel + Montserrat' | 'Plus Jakarta Sans' | 'Syne + Outfit';
  buttonStyle: 'rounded-full' | 'rounded-lg' | 'rounded-md' | 'rounded-none' | 'pill-outline';
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  spacingDensity: 'compact' | 'comfortable' | 'spacious';
}

export const THEME_PRESETS: Record<string, ThemeConfig> = {
  Luxury: {
    preset: 'Luxury',
    primaryColor: '#1a1917',
    accentColor: '#c5a880',
    fontFamily: 'Playfair Display + Inter',
    buttonStyle: 'rounded-none',
    radius: 'none',
    spacingDensity: 'spacious'
  },
  Minimal: {
    preset: 'Minimal',
    primaryColor: '#0f172a',
    accentColor: '#64748b',
    fontFamily: 'Inter + Inter',
    buttonStyle: 'rounded-md',
    radius: 'sm',
    spacingDensity: 'comfortable'
  },
  Modern: {
    preset: 'Modern',
    primaryColor: '#4f46e5',
    accentColor: '#06b6d4',
    fontFamily: 'Plus Jakarta Sans',
    buttonStyle: 'rounded-lg',
    radius: 'md',
    spacingDensity: 'comfortable'
  },
  Bold: {
    preset: 'Bold',
    primaryColor: '#000000',
    accentColor: '#f59e0b',
    fontFamily: 'Syne + Outfit',
    buttonStyle: 'rounded-none',
    radius: 'none',
    spacingDensity: 'comfortable'
  },
  Elegant: {
    preset: 'Elegant',
    primaryColor: '#3b2f2f',
    accentColor: '#e0a96d',
    fontFamily: 'Cinzel + Montserrat',
    buttonStyle: 'rounded-full',
    radius: 'lg',
    spacingDensity: 'spacious'
  },
  Dark: {
    preset: 'Dark',
    primaryColor: '#09090b',
    accentColor: '#38bdf8',
    fontFamily: 'Plus Jakarta Sans',
    buttonStyle: 'rounded-lg',
    radius: 'md',
    spacingDensity: 'comfortable'
  }
};

export const BUILDER_PAGES: BuilderPage[] = [
  { id: 'page-home', name: 'Home', slug: '/', isDefault: true, sectionIds: ['sec-hero', 'sec-services', 'sec-packages', 'sec-about', 'sec-staff', 'sec-gallery', 'sec-testimonials', 'sec-booking-cta', 'sec-contact', 'sec-footer'] },
  { id: 'page-services', name: 'Services', slug: '/services', sectionIds: ['sec-services', 'sec-booking-cta', 'sec-footer'] },
  { id: 'page-packages', name: 'Packages', slug: '/packages', sectionIds: ['sec-packages', 'sec-booking-cta', 'sec-footer'] },
  { id: 'page-gallery', name: 'Gallery', slug: '/gallery', sectionIds: ['sec-gallery', 'sec-booking-cta', 'sec-footer'] },
  { id: 'page-about', name: 'About', slug: '/about', sectionIds: ['sec-about', 'sec-staff', 'sec-testimonials', 'sec-footer'] },
  { id: 'page-contact', name: 'Contact', slug: '/contact', sectionIds: ['sec-contact', 'sec-footer'] }
];

export const INITIAL_SECTIONS: Record<string, BuilderSection> = {
  'sec-hero': {
    id: 'sec-hero',
    type: 'Hero',
    name: 'Hero Banner',
    description: 'First impression header with title, subtitle, image, and instant booking CTA.',
    iconName: 'Sparkles',
    properties: {
      heading: 'Precision Craftsmanship. Modern Elegance.',
      subheading: 'Award-Winning Grooming & Styling Lounge',
      description: 'Experience artisanal hair design, bespoke beard sculpting, and restorative head spa treatments tailored exclusively for you.',
      ctaText: 'Book Appointment (25% Advance)',
      ctaLink: '#book',
      secondaryCtaText: 'View Service Menu',
      imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Interior of luxury barbershop lounge',
      layout: 'split-right',
      spacing: 'spacious',
      background: 'dark',
      visible: true
    }
  },
  'sec-about': {
    id: 'sec-about',
    type: 'About',
    name: 'About Story & Craft',
    description: 'Heritage, hygiene protocols, master barber philosophy, and lounge ethos.',
    iconName: 'BookOpen',
    properties: {
      heading: 'A Sanctuary Dedicated to the Art of Refined Grooming',
      subheading: 'Our Ethos & Heritage',
      description: 'Founded with a singular conviction: salon visits should be an unhurried ritual of rejuvenation. We combine classic European scissor technique with clinical hygiene sterilization standards.',
      ctaText: 'Meet Our Master Stylists',
      ctaLink: '#staff',
      imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Master barber trimming client beard',
      layout: 'split-left',
      spacing: 'comfortable' as any,
      background: 'white',
      visible: true
    }
  },
  'sec-services': {
    id: 'sec-services',
    type: 'Services',
    name: 'Featured Services Menu',
    description: 'Grid of individual treatments with price, duration, and direct booking trigger.',
    iconName: 'Scissors',
    properties: {
      heading: 'Curated Treatments',
      subheading: 'Tailored Hair, Beard & Scalp Solutions',
      description: 'Every session begins with a diagnostic consultation to craft a personalized style.',
      ctaText: 'Explore All Treatments',
      ctaLink: '/services',
      layout: 'grid-3',
      spacing: 'comfortable' as any,
      background: 'slate-50',
      visible: true,
      itemsCount: 6
    }
  },
  'sec-packages': {
    id: 'sec-packages',
    type: 'Packages',
    name: 'Bundles & Packages',
    description: 'Curated multi-treatment bundles delivering premium value.',
    iconName: 'Layers',
    properties: {
      heading: 'Signature Experience Packages',
      subheading: 'Bundled Grooming Rituals',
      description: 'Comprehensive multi-service combinations engineered for weddings, executive refreshers, and monthly maintenance.',
      ctaText: 'Book Bundle Now',
      ctaLink: '#book',
      layout: 'grid-3',
      spacing: 'comfortable' as any,
      background: 'white',
      visible: true,
      itemsCount: 3
    }
  },
  'sec-staff': {
    id: 'sec-staff',
    type: 'Staff',
    name: 'Artisan Staff Roster',
    description: 'Specialist cards featuring certifications, ratings, and bios.',
    iconName: 'UserCheck',
    properties: {
      heading: 'Meet Your Specialists',
      subheading: 'Master Craftsmen & Stylists',
      description: 'Each member of our team brings over a decade of precision razor, hair sculpting, and aesthetic experience.',
      ctaText: 'Select Specialist & Book',
      ctaLink: '#book',
      layout: 'grid-4',
      spacing: 'comfortable' as any,
      background: 'slate-50',
      visible: true,
      itemsCount: 4
    }
  },
  'sec-gallery': {
    id: 'sec-gallery',
    type: 'Gallery',
    name: 'Visual Portfolio',
    description: 'High-definition showcase of haircut transformations and interior ambiance.',
    iconName: 'Image',
    properties: {
      heading: 'Our Work & Lounge Ambiance',
      subheading: 'Portfolio & Transformations',
      description: 'Explore recent cuts, balayage color transformations, and the serene interior of our lounge.',
      ctaText: 'Follow on Instagram',
      ctaLink: 'https://instagram.com',
      layout: 'grid-3',
      spacing: 'comfortable' as any,
      background: 'white',
      visible: true,
      itemsCount: 6
    }
  },
  'sec-testimonials': {
    id: 'sec-testimonials',
    type: 'Testimonials',
    name: 'Client Reviews & Social Proof',
    description: 'Verified reviews and ratings from repeat clientele.',
    iconName: 'Star',
    properties: {
      heading: 'Praised by Discerning Clients',
      subheading: '4.95 Average Star Rating Across 850+ Appointments',
      description: 'Read unvarnished feedback from executives, artists, and regulars who trust us with their image.',
      layout: 'grid-3',
      spacing: 'comfortable' as any,
      background: 'slate-50',
      visible: true,
      itemsCount: 3
    }
  },
  'sec-booking-cta': {
    id: 'sec-booking-cta',
    type: 'Booking CTA',
    name: 'Fast Booking Call-to-Action',
    description: 'High-conversion banner driving clients directly into the 25% advance booking engine.',
    iconName: 'CalendarCheck',
    properties: {
      heading: 'Reserve Your Exclusive Chair Today',
      subheading: 'Instant Online Reservation · 25% Advance Deposit',
      description: 'Slots fill rapidly during peak weekends. Secure your preferred stylist and preferred hour with transparent upfront booking.',
      ctaText: 'Start Fast Booking',
      ctaLink: '#book',
      layout: 'center',
      spacing: 'spacious',
      background: 'brand-tint',
      visible: true
    }
  },
  'sec-contact': {
    id: 'sec-contact',
    type: 'Contact',
    name: 'Location, Hours & Contact',
    description: 'Map location, phone numbers, parking advice, and operating schedule.',
    iconName: 'MapPin',
    properties: {
      heading: 'Visit The Lounge',
      subheading: 'Bandra West, Mumbai · Valet Parking Available',
      description: 'Located in the heart of Mumbai’s luxury quarter. Walk-ins welcomed subject to specialist availability.',
      ctaText: 'Get Driving Directions',
      ctaLink: 'https://maps.google.com',
      layout: 'split-right',
      spacing: 'comfortable' as any,
      background: 'white',
      visible: true
    }
  },
  'sec-footer': {
    id: 'sec-footer',
    type: 'Footer',
    name: 'Global Footer & Legal',
    description: 'Copyright, quick links, cancellation policy, and operating certifications.',
    iconName: 'AlignEndHorizontal',
    properties: {
      heading: 'The Royal Crown Barber & Lounge',
      subheading: 'Nexora SalonOS Verified Partner',
      description: '© 2026 The Royal Crown Barber & Lounge. All rights reserved. 25% advance booking policy applies to all reservations.',
      ctaText: 'Privacy & Terms',
      ctaLink: '/legal',
      layout: 'center',
      spacing: 'compact',
      background: 'dark',
      visible: true
    }
  }
};
