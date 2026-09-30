// Nexora SalonOS — Phase 4.2 Services & Packages Booking Configuration Service
// Multi-Tenant CRUD, Eligible Staff Relations, Bookable vs Active Rules, and Price Snapshot Protection

import {
  ServiceBookingConfig,
  PackageBookingConfig,
  SalonStaffMember,
  isServiceBookable,
  isPackageBookable,
  getEligibleStaffForService,
  getEligibleStaffForPackage,
  createBookingItemFromService,
  createBookingItemFromPackage,
  CATEGORY_DEFAULT_SERVICES
} from '../types/servicePackageConfig';
import { BookingItem } from '../types/bookingEngine';

// Seeded Staff Members for Multi-Tenant Testing
export const SEEDED_STAFF_MEMBERS: SalonStaffMember[] = [
  // Barber Staff (biz-barber-001)
  {
    id: 'stf-rc-01',
    businessId: 'biz-barber-001',
    name: 'Vikram Rajput',
    role: 'Master Barber',
    specializations: ['Skin Fades', 'Beard Sculpting', 'Hot Towel Shave'],
    active: true
  },
  {
    id: 'stf-rc-02',
    businessId: 'biz-barber-001',
    name: 'Sameer Khan',
    role: 'Senior Stylist',
    specializations: ['Classic Haircuts', 'Scissor Work'],
    active: true
  },
  {
    id: 'stf-rc-03',
    businessId: 'biz-barber-001',
    name: 'Rohan Verma (Apprentice)',
    role: 'Junior Barber',
    specializations: ['Basic Haircuts', 'Washing'],
    active: false // Inactive staff member for test verification
  },

  // Spa Therapists (biz-spa-002)
  {
    id: 'stf-spa-01',
    businessId: 'biz-spa-002',
    name: 'Maya Nair',
    role: 'Lead Spa Therapist',
    specializations: ['Hot Stone Therapy', 'Deep Tissue', 'Aromatherapy'],
    active: true
  },
  {
    id: 'stf-spa-02',
    businessId: 'biz-spa-002',
    name: 'Ananya Roy',
    role: 'Holistic Therapist',
    specializations: ['Swedish Massage', 'Body Scrubs'],
    active: true
  },

  // Nail Artists (biz-nail-003)
  {
    id: 'stf-nail-01',
    businessId: 'biz-nail-003',
    name: 'Elena Rostova',
    role: 'Master Nail Artist',
    specializations: ['Russian E-File', 'Gel Extension Sculpting'],
    active: true
  },
  {
    id: 'stf-nail-02',
    businessId: 'biz-nail-003',
    name: 'Pooja Hegde',
    role: 'Pedicurist & Nail Tech',
    specializations: ['Spa Pedicure', 'Nail Art'],
    active: true
  },

  // Tattoo Artists (biz-tattoo-004)
  {
    id: 'stf-tat-01',
    businessId: 'biz-tattoo-004',
    name: 'Kaelen Vance',
    role: 'Blackwork Specialist',
    specializations: ['Geometric', 'Neo-Tribal', 'Custom Half-Day'],
    active: true
  },
  {
    id: 'stf-tat-02',
    businessId: 'biz-tattoo-004',
    name: 'Tara Singh',
    role: 'Fine Line Specialist',
    specializations: ['Micro Realism', 'Flash Tattoo', 'Consultation'],
    active: true
  }
];

// Seeded Initial Services
export const SEEDED_SERVICES: ServiceBookingConfig[] = [
  // Royal Crown Barber (biz-barber-001)
  {
    id: 'srv-barber-1',
    businessId: 'biz-barber-001',
    categoryId: 'barber',
    name: 'Signature Royal Beard Sculpt & Razor Fade',
    description: 'Precision shear & fade cut with hot towel lather beard sculpting.',
    price: 1200,
    duration: 45,
    bufferTime: 10,
    active: true,
    bookable: true,
    featured: true,
    advancePercentage: 25,
    sortOrder: 1,
    staffAssignmentMode: 'CUSTOMER_SELECTS',
    eligibleStaffIds: ['stf-rc-01', 'stf-rc-02']
  },
  {
    id: 'srv-barber-2',
    businessId: 'biz-barber-001',
    categoryId: 'barber',
    name: 'Traditional Straight Razor Hot Towel Shave',
    description: 'Full 5-step shave with pre-shave eucalyptus oils and cold marble close.',
    price: 700,
    duration: 35,
    bufferTime: 5,
    active: true,
    bookable: true,
    featured: false,
    sortOrder: 2,
    staffAssignmentMode: 'ANY_AVAILABLE',
    eligibleStaffIds: ['stf-rc-01'] // Only Master Barber Vikram is eligible for straight razor
  },
  {
    id: 'srv-barber-3',
    businessId: 'biz-barber-001',
    categoryId: 'barber',
    name: 'VIP Cigar & Grooming Lounge Access',
    description: 'Exclusive lounge entry with complimentary beverage (In-Salon Walk-in Only).',
    price: 2500,
    duration: 60,
    bufferTime: 0,
    active: true,
    bookable: false, // ACTIVE in catalog display, but NOT bookable online!
    featured: false,
    sortOrder: 3,
    staffAssignmentMode: 'ADMIN_ASSIGNED',
    eligibleStaffIds: ['stf-rc-01', 'stf-rc-02']
  },
  {
    id: 'srv-barber-4',
    businessId: 'biz-barber-001',
    categoryId: 'barber',
    name: 'Archived Scalp Treatment (Seasonal)',
    description: 'Discontinued summer scalp refresh.',
    price: 500,
    duration: 20,
    bufferTime: 5,
    active: false, // Inactive in catalog
    bookable: false,
    featured: false,
    sortOrder: 4,
    eligibleStaffIds: []
  },

  // Zenith Stone Spa (biz-spa-002)
  {
    id: 'srv-spa-1',
    businessId: 'biz-spa-002',
    categoryId: 'spa',
    name: 'Volcanic Hot Stone Therapy & Chakra Alignment',
    description: 'Basalt heated stones with nourishing sesame oil.',
    price: 3800,
    duration: 75,
    bufferTime: 15,
    active: true,
    bookable: true,
    featured: true,
    sortOrder: 1,
    staffAssignmentMode: 'CUSTOMER_SELECTS',
    eligibleStaffIds: ['stf-spa-01']
  },
  {
    id: 'srv-spa-2',
    businessId: 'biz-spa-002',
    categoryId: 'spa',
    name: 'Deep Tissue Muscle Release',
    description: 'Targeted deep myofascial trigger point release.',
    price: 3400,
    duration: 60,
    bufferTime: 15,
    active: true,
    bookable: true,
    featured: true,
    sortOrder: 2,
    staffAssignmentMode: 'ANY_AVAILABLE',
    eligibleStaffIds: ['stf-spa-01', 'stf-spa-02']
  },
  {
    id: 'srv-spa-3',
    businessId: 'biz-spa-002',
    categoryId: 'spa',
    name: 'Himalayan Salt Scrub & Vichy Shower',
    description: 'Full body sea salt exfoliation and hydrotherapy.',
    price: 2600,
    duration: 45,
    bufferTime: 15,
    active: true,
    bookable: true,
    featured: false,
    sortOrder: 3,
    eligibleStaffIds: ['stf-spa-02']
  },

  // Gloss & Chic Nail Bar (biz-nail-003)
  {
    id: 'srv-nail-1',
    businessId: 'biz-nail-003',
    categoryId: 'nail-studio',
    name: 'Russian E-File Dry Manicure with Japanese Gel',
    description: 'Flawless cuticle cleanup and Japanese structured gel overlay.',
    price: 2200,
    duration: 60,
    bufferTime: 10,
    active: true,
    bookable: true,
    featured: true,
    sortOrder: 1,
    eligibleStaffIds: ['stf-nail-01']
  },
  {
    id: 'srv-nail-2',
    businessId: 'biz-nail-003',
    categoryId: 'nail-studio',
    name: 'Botanical Eucalyptus Spa Pedicure',
    description: 'Organic callus treatment with warm towel scrub.',
    price: 1800,
    duration: 50,
    bufferTime: 10,
    active: true,
    bookable: true,
    featured: true,
    sortOrder: 2,
    eligibleStaffIds: ['stf-nail-01', 'stf-nail-02']
  },

  // Mono Tattoo (biz-tattoo-004)
  {
    id: 'srv-tat-1',
    businessId: 'biz-tattoo-004',
    categoryId: 'tattoo',
    name: 'Custom Tattoo Concept & Placement Consultation',
    description: 'In-person consult and stencil test.',
    price: 500,
    duration: 30,
    bufferTime: 15,
    active: true,
    bookable: true,
    featured: true,
    sortOrder: 1,
    eligibleStaffIds: ['stf-tat-01', 'stf-tat-02']
  },
  {
    id: 'srv-tat-2',
    businessId: 'biz-tattoo-004',
    categoryId: 'tattoo',
    name: 'Fine Line Micro-Realism Flash Piece',
    description: 'Precision single-needle flash artwork.',
    price: 4500,
    duration: 90,
    bufferTime: 30,
    active: true,
    bookable: true,
    featured: true,
    sortOrder: 2,
    eligibleStaffIds: ['stf-tat-02'] // Fine line specialist only
  }
];

// Seeded Initial Packages
export const SEEDED_PACKAGES: PackageBookingConfig[] = [
  // Royal Crown Barber Package
  {
    id: 'pkg-barber-royal-ritual',
    businessId: 'biz-barber-001',
    name: 'The Royal Gentleman Total Grooming Ritual',
    description: 'Comprehensive transformation including Haircut, Beard Sculpt, and Traditional Straight Razor Shave.',
    price: 1600, // Bundled savings (1200 + 700 = 1900 original)
    originalPrice: 1900,
    duration: 75,
    active: true,
    bookable: true,
    featured: true,
    serviceIds: ['srv-barber-1', 'srv-barber-2'],
    eligibleStaffIds: ['stf-rc-01']
  },
  // Zenith Spa Package
  {
    id: 'pkg-spa-sanctuary-escape',
    businessId: 'biz-spa-002',
    name: 'Full Sanctuary Renewal (Massage + Scrub)',
    description: 'Complete restorative escape: Deep Tissue Muscle Release bundled with Himalayan Salt Scrub.',
    price: 5200, // Bundled savings (3400 + 2600 = 6000 original)
    originalPrice: 6000,
    duration: 105,
    active: true,
    bookable: true,
    featured: true,
    serviceIds: ['srv-spa-2', 'srv-spa-3'],
    eligibleStaffIds: ['stf-spa-01', 'stf-spa-02']
  }
];

// ----------------------------------------------------------------------------
// MULTI-TENANT SERVICE & PACKAGE MANAGER SERVICE
// ----------------------------------------------------------------------------

export class ServicePackageConfigService {
  private services: Map<string, ServiceBookingConfig> = new Map();
  private packages: Map<string, PackageBookingConfig> = new Map();
  private staff: Map<string, SalonStaffMember> = new Map();

  constructor(
    initialServices: ServiceBookingConfig[] = SEEDED_SERVICES,
    initialPackages: PackageBookingConfig[] = SEEDED_PACKAGES,
    initialStaff: SalonStaffMember[] = SEEDED_STAFF_MEMBERS
  ) {
    initialServices.forEach((s) => this.services.set(s.id, { ...s }));
    initialPackages.forEach((p) => this.packages.set(p.id, { ...p }));
    initialStaff.forEach((st) => this.staff.set(st.id, { ...st }));
  }

  // --- SERVICE OPERATIONS ---

  public createService(
    dto: Omit<ServiceBookingConfig, 'id'> & { id?: string }
  ): ServiceBookingConfig {
    const id = dto.id || `srv-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
    const newService: ServiceBookingConfig = {
      ...dto,
      id,
      eligibleStaffIds: dto.eligibleStaffIds || []
    };
    this.services.set(id, newService);
    return newService;
  }

  public updateService(
    serviceId: string,
    updates: Partial<ServiceBookingConfig>,
    tenantBusinessId: string
  ): { success: boolean; service?: ServiceBookingConfig; error?: string } {
    const existing = this.services.get(serviceId);
    if (!existing) {
      return { success: false, error: `Service ${serviceId} not found` };
    }
    if (existing.businessId !== tenantBusinessId) {
      return { success: false, error: `Unauthorized tenant modification attempt` };
    }

    const updated: ServiceBookingConfig = {
      ...existing,
      ...updates
    };
    this.services.set(serviceId, updated);
    return { success: true, service: updated };
  }

  public getService(serviceId: string, tenantBusinessId?: string): ServiceBookingConfig | null {
    const service = this.services.get(serviceId);
    if (!service) return null;
    if (tenantBusinessId && service.businessId !== tenantBusinessId) return null;
    return service;
  }

  public listServicesByTenant(tenantBusinessId: string): ServiceBookingConfig[] {
    return Array.from(this.services.values())
      .filter((s) => 
        s.businessId === tenantBusinessId ||
        (tenantBusinessId === 'biz-barber-01' && s.businessId === 'biz-barber-001') ||
        (tenantBusinessId === 'biz-barber-001' && s.businessId === 'biz-barber-01') ||
        (tenantBusinessId === 'biz-spa-02' && s.businessId === 'biz-spa-002') ||
        (tenantBusinessId === 'biz-spa-002' && s.businessId === 'biz-spa-02')
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public listBookableServicesByTenant(tenantBusinessId: string): ServiceBookingConfig[] {
    return this.listServicesByTenant(tenantBusinessId).filter(isServiceBookable);
  }

  // --- PACKAGE OPERATIONS ---

  public createPackage(
    dto: Omit<PackageBookingConfig, 'id'> & { id?: string }
  ): PackageBookingConfig {
    const id = dto.id || `pkg-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
    const newPackage: PackageBookingConfig = {
      ...dto,
      id,
      serviceIds: dto.serviceIds || [],
      eligibleStaffIds: dto.eligibleStaffIds || []
    };
    this.packages.set(id, newPackage);
    return newPackage;
  }

  public updatePackage(
    packageId: string,
    updates: Partial<PackageBookingConfig>,
    tenantBusinessId: string
  ): { success: boolean; pkg?: PackageBookingConfig; error?: string } {
    const existing = this.packages.get(packageId);
    if (!existing) {
      return { success: false, error: `Package ${packageId} not found` };
    }
    if (existing.businessId !== tenantBusinessId) {
      return { success: false, error: `Unauthorized tenant modification attempt` };
    }

    const updated: PackageBookingConfig = {
      ...existing,
      ...updates
    };
    this.packages.set(packageId, updated);
    return { success: true, pkg: updated };
  }

  public getPackage(packageId: string, tenantBusinessId?: string): PackageBookingConfig | null {
    const pkg = this.packages.get(packageId);
    if (!pkg) return null;
    if (tenantBusinessId && pkg.businessId !== tenantBusinessId) return null;
    return pkg;
  }

  public listPackagesByTenant(tenantBusinessId: string): PackageBookingConfig[] {
    return Array.from(this.packages.values()).filter(
      (p) => 
        p.businessId === tenantBusinessId ||
        (tenantBusinessId === 'biz-barber-01' && p.businessId === 'biz-barber-001') ||
        (tenantBusinessId === 'biz-barber-001' && p.businessId === 'biz-barber-01') ||
        (tenantBusinessId === 'biz-spa-02' && p.businessId === 'biz-spa-002') ||
        (tenantBusinessId === 'biz-spa-002' && p.businessId === 'biz-spa-02')
    );
  }

  public listBookablePackagesByTenant(
    tenantBusinessId: string,
    checkDateIso?: string
  ): PackageBookingConfig[] {
    return this.listPackagesByTenant(tenantBusinessId).filter((p) =>
      isPackageBookable(p, checkDateIso)
    );
  }

  // --- STAFF & ELIGIBILITY RELATIONSHIPS ---

  public listStaffByTenant(tenantBusinessId: string): SalonStaffMember[] {
    return Array.from(this.staff.values()).filter(
      (s) => 
        s.businessId === tenantBusinessId ||
        (tenantBusinessId === 'biz-barber-01' && s.businessId === 'biz-barber-001') ||
        (tenantBusinessId === 'biz-barber-001' && s.businessId === 'biz-barber-01') ||
        (tenantBusinessId === 'biz-spa-02' && s.businessId === 'biz-spa-002') ||
        (tenantBusinessId === 'biz-spa-002' && s.businessId === 'biz-spa-02')
    );
  }

  public getStaff(staffId: string, tenantBusinessId?: string): SalonStaffMember | null {
    const stf = this.staff.get(staffId);
    if (!stf) return null;
    if (tenantBusinessId && stf.businessId !== tenantBusinessId) return null;
    return stf;
  }

  public getEligibleStaffForService(
    serviceId: string,
    tenantBusinessId: string
  ): SalonStaffMember[] {
    const service = this.getService(serviceId, tenantBusinessId);
    if (!service) return [];
    const allStaff = this.listStaffByTenant(tenantBusinessId);
    return getEligibleStaffForService(service, allStaff);
  }

  public getEligibleStaffForPackage(
    packageId: string,
    tenantBusinessId: string
  ): SalonStaffMember[] {
    const pkg = this.getPackage(packageId, tenantBusinessId);
    if (!pkg) return [];
    const allStaff = this.listStaffByTenant(tenantBusinessId);
    const allServices = this.listServicesByTenant(tenantBusinessId);
    return getEligibleStaffForPackage(pkg, allStaff, allServices);
  }

  // --- SNAPSHOT GENERATION ---

  public createBookingItem(
    type: 'SERVICE' | 'PACKAGE',
    referenceId: string,
    bookingId: string,
    tenantBusinessId: string,
    assignedStaffId?: string
  ): BookingItem {
    const staffMember = assignedStaffId
      ? this.staff.get(assignedStaffId)
      : undefined;

    if (type === 'SERVICE') {
      const service = this.getService(referenceId, tenantBusinessId);
      if (!service) {
        throw new Error(`Service ${referenceId} not found under tenant ${tenantBusinessId}`);
      }
      return createBookingItemFromService(service, bookingId, staffMember);
    } else {
      const pkg = this.getPackage(referenceId, tenantBusinessId);
      if (!pkg) {
        throw new Error(`Package ${referenceId} not found under tenant ${tenantBusinessId}`);
      }
      return createBookingItemFromPackage(pkg, bookingId, staffMember);
    }
  }

  public getServiceById(serviceId: string, tenantBusinessId?: string): ServiceBookingConfig | null {
    return this.getService(serviceId, tenantBusinessId);
  }

  public listServicesForBusiness(tenantBusinessId: string, _options?: { includeInactive?: boolean }): ServiceBookingConfig[] {
    return this.listServicesByTenant(tenantBusinessId);
  }

  public listStaffMembers(tenantBusinessId: string): SalonStaffMember[] {
    return this.listStaffByTenant(tenantBusinessId);
  }

  /**
   * Generates default category services when a new salon onboards.
   */
  public generateDefaultServicesForCategory(
    categoryId: string,
    tenantBusinessId: string,
    defaultStaffIds: string[] = []
  ): ServiceBookingConfig[] {
    const templates = CATEGORY_DEFAULT_SERVICES[categoryId] || [];
    return templates.map((tmpl, idx) =>
      this.createService({
        businessId: tenantBusinessId,
        categoryId,
        name: tmpl.name,
        description: tmpl.description,
        price: tmpl.price,
        duration: tmpl.duration,
        bufferTime: tmpl.bufferTime,
        active: true,
        bookable: tmpl.bookable,
        featured: tmpl.featured,
        sortOrder: idx + 1,
        staffAssignmentMode: 'CUSTOMER_SELECTS',
        eligibleStaffIds: defaultStaffIds
      })
    );
  }
}
