// Nexora SalonOS — Phase 4.2 Services + Packages Booking Configuration
// Strict Multi-Tenant Schema, Eligible Staff Bindings, Catalog vs Bookable State, and Snapshot Generators

import { BookingItem } from './bookingEngine';

export type StaffAssignmentMode = 'ANY_AVAILABLE' | 'CUSTOMER_SELECTS' | 'ADMIN_ASSIGNED';

export interface SalonStaffMember {
  id: string;
  businessId: string;
  name: string;
  role: string;
  photo?: string;
  specializations: string[];
  active: boolean;
  rating?: number;
}

export interface ServiceBookingConfig {
  id: string;
  businessId: string;
  categoryId: string;
  name: string;
  description: string;
  image?: string;
  price: number; // in base currency (e.g. INR)
  duration: number; // in minutes
  bufferTime: number; // in minutes (post-service cleanup/prep)
  active: boolean; // Catalog active
  bookable: boolean; // Online booking enabled (can be active=true, bookable=false for in-salon display only)
  featured: boolean;
  advancePercentage?: number; // e.g. 25% (overrides tenant default if set)
  sortOrder: number;
  staffAssignmentMode?: StaffAssignmentMode;
  eligibleStaffIds: string[]; // Relationship allowing service to be assigned only to qualified staff
}

export interface PackageBookingConfig {
  id: string;
  businessId: string;
  name: string;
  description: string;
  image?: string;
  price: number; // Bundled price
  originalPrice?: number; // Strikethrough price for value comparison
  duration: number; // Combined duration in minutes
  active: boolean;
  bookable: boolean;
  validFrom?: string; // ISO 8601 or YYYY-MM-DD
  validUntil?: string; // ISO 8601 or YYYY-MM-DD
  featured: boolean;
  serviceIds: string[]; // Services bundled within this package
  eligibleStaffIds?: string[];
}

// ----------------------------------------------------------------------------
// DOMAIN RULES & EVALUATION HELPERS
// ----------------------------------------------------------------------------

/**
 * Checks if a service is available for online booking.
 * Must be BOTH active in catalog AND explicitly marked bookable.
 */
export function isServiceBookable(service: ServiceBookingConfig): boolean {
  return Boolean(service.active && service.bookable);
}

/**
 * Checks if a package is available for online booking.
 * Must be active, bookable, and within valid date window (if date range defined).
 */
export function isPackageBookable(pkg: PackageBookingConfig, checkDateIso?: string): boolean {
  if (!pkg.active || !pkg.bookable) return false;

  if (checkDateIso) {
    if (pkg.validFrom && checkDateIso < pkg.validFrom) return false;
    if (pkg.validUntil && checkDateIso > pkg.validUntil) return false;
  }

  return true;
}

/**
 * Filter staff eligible to perform a specific service.
 * Only active staff assigned in eligibleStaffIds are returned.
 */
export function getEligibleStaffForService(
  service: ServiceBookingConfig,
  allStaff: SalonStaffMember[]
): SalonStaffMember[] {
  return allStaff.filter(
    (staff) => staff.active && service.eligibleStaffIds.includes(staff.id)
  );
}

/**
 * Filter staff eligible to perform a package bundle.
 */
export function getEligibleStaffForPackage(
  pkg: PackageBookingConfig,
  allStaff: SalonStaffMember[],
  allServices: ServiceBookingConfig[]
): SalonStaffMember[] {
  if (pkg.eligibleStaffIds && pkg.eligibleStaffIds.length > 0) {
    return allStaff.filter(
      (staff) => staff.active && pkg.eligibleStaffIds?.includes(staff.id)
    );
  }

  // Fallback: Staff eligible for ALL individual services in the package
  const bundledServices = allServices.filter((s) => pkg.serviceIds.includes(s.id));
  if (bundledServices.length === 0) return [];

  return allStaff.filter((staff) =>
    staff.active && bundledServices.every((s) => s.eligibleStaffIds.includes(staff.id))
  );
}

/**
 * Creates an immutable historical BookingItem snapshot from a Service.
 * Once created, future modifications to the Service price/name will NEVER alter this item.
 */
export function createBookingItemFromService(
  service: ServiceBookingConfig,
  bookingId: string,
  assignedStaff?: SalonStaffMember
): BookingItem {
  return {
    id: `bki-${bookingId}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
    bookingId,
    itemType: 'SERVICE',
    referenceId: service.id,
    nameSnapshot: service.name,
    categorySnapshot: service.categoryId,
    unitPriceCents: Math.round(service.price * 100),
    durationMinutesSnapshot: service.duration,
    staffId: assignedStaff?.id,
    staffNameSnapshot: assignedStaff?.name
  };
}

/**
 * Creates an immutable historical BookingItem snapshot from a Package.
 */
export function createBookingItemFromPackage(
  pkg: PackageBookingConfig,
  bookingId: string,
  assignedStaff?: SalonStaffMember
): BookingItem {
  return {
    id: `bki-${bookingId}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
    bookingId,
    itemType: 'PACKAGE',
    referenceId: pkg.id,
    nameSnapshot: pkg.name,
    categorySnapshot: 'package',
    unitPriceCents: Math.round(pkg.price * 100),
    durationMinutesSnapshot: pkg.duration,
    staffId: assignedStaff?.id,
    staffNameSnapshot: assignedStaff?.name
  };
}

// ----------------------------------------------------------------------------
// CATEGORY DEFAULTS FACTORY (Editable Templates for Onboarding & Service Setup)
// ----------------------------------------------------------------------------

export interface CategoryServiceTemplate {
  name: string;
  description: string;
  price: number;
  duration: number;
  bufferTime: number;
  featured: boolean;
  bookable: boolean;
}

export const CATEGORY_DEFAULT_SERVICES: Record<string, CategoryServiceTemplate[]> = {
  barber: [
    {
      name: 'Classic Haircut',
      description: 'Precision shear & clipper cut with hot lather neck shave and styling.',
      price: 650,
      duration: 30,
      bufferTime: 5,
      featured: true,
      bookable: true
    },
    {
      name: 'Beard Trim & Shape',
      description: 'Sculpting with hot towel steam, organic beard butter, and razor edge finish.',
      price: 450,
      duration: 25,
      bufferTime: 5,
      featured: true,
      bookable: true
    },
    {
      name: 'Hair + Beard Combo',
      description: 'Full signature haircut and luxury beard grooming session.',
      price: 1000,
      duration: 50,
      bufferTime: 10,
      featured: true,
      bookable: true
    },
    {
      name: 'Traditional Straight Razor Shave',
      description: 'Multi-step hot towel treatment with pre-shave oil and cold stone close.',
      price: 550,
      duration: 35,
      bufferTime: 5,
      featured: false,
      bookable: true
    }
  ],
  spa: [
    {
      name: 'Swedish Massage',
      description: 'Full body tension relief utilizing long gliding strokes and botanical oils.',
      price: 2800,
      duration: 60,
      bufferTime: 15,
      featured: true,
      bookable: true
    },
    {
      name: 'Deep Tissue Massage',
      description: 'Therapeutic pressure targeting chronic muscle knots and structural tension.',
      price: 3400,
      duration: 60,
      bufferTime: 15,
      featured: true,
      bookable: true
    },
    {
      name: 'Aromatherapy Ritual',
      description: 'Sensory journey featuring custom essential oil blends for nervous system calming.',
      price: 3100,
      duration: 75,
      bufferTime: 15,
      featured: false,
      bookable: true
    },
    {
      name: 'Himalayan Salt Body Scrub',
      description: 'Exfoliating mineral glow treatment followed by warm hydrating emulsion.',
      price: 2400,
      duration: 45,
      bufferTime: 15,
      featured: false,
      bookable: true
    }
  ],
  'nail-studio': [
    {
      name: 'Classic Russian E-File Manicure',
      description: 'Hardware dry cuticle prep, precision nail shaping, and conditioning treatment.',
      price: 1200,
      duration: 45,
      bufferTime: 10,
      featured: true,
      bookable: true
    },
    {
      name: 'Spa Pedicure Ritual',
      description: 'Callus buffing, eucalyptus soak, sugar scrub exfoliation, and massage.',
      price: 1600,
      duration: 55,
      bufferTime: 10,
      featured: true,
      bookable: true
    },
    {
      name: 'Gel Nails & Builder Overlay',
      description: 'Strengthening structured gel application with long-lasting high gloss sheen.',
      price: 2200,
      duration: 70,
      bufferTime: 10,
      featured: true,
      bookable: true
    }
  ],
  tattoo: [
    {
      name: 'Tattoo Consultation',
      description: '1-on-1 concept ideation, sizing review, skin placement, and custom quote calculation.',
      price: 500,
      duration: 30,
      bufferTime: 10,
      featured: true,
      bookable: true
    },
    {
      name: 'Small Flash Tattoo',
      description: 'Fine line or blackwork flash piece up to 2x2 inches.',
      price: 3500,
      duration: 60,
      bufferTime: 20,
      featured: true,
      bookable: true
    },
    {
      name: 'Custom Tattoo Session (Half Day)',
      description: 'Multi-hour customized original artwork and shading session.',
      price: 12000,
      duration: 240,
      bufferTime: 30,
      featured: true,
      bookable: true
    }
  ]
};
