// Nexora SalonOS — Phase 3.4 Category & Template Engine Types
import { ThemePreset } from './index';

export type CategoryId =
  | 'barber'
  | 'hair-salon'
  | 'beauty'
  | 'nail-studio'
  | 'spa'
  | 'massage'
  | 'tattoo'
  | 'unisex-salon'
  | 'makeup-studio'
  | 'wellness';

export type SectionType =
  | 'hero'
  | 'services'
  | 'packages'
  | 'about'
  | 'staff'
  | 'gallery'
  | 'testimonials'
  | 'booking'
  | 'contact'
  | 'faq'
  | 'footer';

export interface CategoryTerminology {
  service: string;
  services: string;
  staff: string;
  staffPlural: string;
  appointment: string;
  chairOrRoom: string;
  customer: string;
}

export interface BookingTerminology {
  selectService: string;
  selectStaff: string;
  selectDate: string;
  advanceDepositNotice: string;
  venueBalanceNotice: string;
  confirmButton: string;
}

export interface DefaultServiceSeed {
  id: string;
  name: string;
  categoryTag: string;
  description: string;
  durationMinutes: number;
  basePrice: number;
  isPopular?: boolean;
}

export interface DefaultPackageSeed {
  id: string;
  name: string;
  badge?: string;
  serviceNames: string[];
  totalDurationMinutes: number;
  bundlePrice: number;
  originalPrice: number;
}

export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  terminology: CategoryTerminology;
  bookingTerminology: BookingTerminology;
  staffRoles: string[];
  defaultTheme: ThemePreset;
  homepageSections: SectionType[];
  galleryCategories: string[];
  defaultServices: DefaultServiceSeed[];
  defaultPackages: DefaultPackageSeed[];
}

export interface SectionContentConfig {
  hero?: {
    badge?: string;
    title: string;
    subtitle: string;
    description: string;
    primaryCTA: string;
    secondaryCTA: string;
  };
  services?: {
    badge?: string;
    heading: string;
    description: string;
  };
  packages?: {
    badge?: string;
    heading: string;
    description: string;
  };
  about?: {
    badge?: string;
    heading: string;
    story: string;
    highlights: string[];
  };
  staff?: {
    badge?: string;
    heading: string;
    description: string;
  };
  gallery?: {
    badge?: string;
    heading: string;
    description: string;
  };
  testimonials?: {
    badge?: string;
    heading: string;
  };
  booking?: {
    badge?: string;
    heading: string;
    description: string;
    advanceHighlight: string;
  };
  contact?: {
    badge?: string;
    heading: string;
    description: string;
  };
}

export interface TemplateDefinition {
  templateId: string;
  category: CategoryId;
  name: string;
  theme: ThemePreset;
  layout: 'editorial-luxury' | 'modern-grid' | 'minimal-split' | 'bold-monochrome' | 'warm-organic';
  sections: SectionType[];
  defaultContent: SectionContentConfig;
}
