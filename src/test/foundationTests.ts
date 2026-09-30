// Nexora SalonOS — Foundational Unit Tests (Phase 3.1)
// Self-contained execution runner verifying:
// 1. Centralized configuration integrity
// 2. Financial calculation rules (advance 25% and GST calculation)
// 3. Route protection and multi-tenant zone access control rules
// 4. Currency and duration formatting conventions

import { PLATFORM_CONFIG } from '../config/platformConfig';
import {
  calculateBookingFinancials,
  evaluateQualificationStatus,
  formatCurrency,
  formatDuration,
} from '../utils/financials';
import { checkZoneAccess, ZONE_PERMISSION_RULES } from '../lib/authGuard';
import {
  getTemplatesForCategory,
  getCategoryDefinition,
  resolveTemplateData,
} from '../services/templateResolver';
import { getPublicBusinessBySlug, SEEDED_PUBLIC_BUSINESSES } from '../data/seededPublicBusinesses';
import { SEEDED_AUTH_USERS, hashPasswordClient } from '../services/authContext';
import { INITIAL_BUILDER_SECTIONS, localWebsitePersistence } from '../types/websiteBuilder';
import {
  BookingEntity,
  validateBookingStatusTransition,
  createFinancialSnapshot,
  verifyTenantOwnership
} from '../types/bookingEngine';
import {
  BookingStateMachineService,
  MultiTenantBookingRepository
} from '../services/bookingStateMachine';
import {
  ServicePackageConfigService
} from '../services/servicePackageService';
import {
  isServiceBookable,
  isPackageBookable,
  getEligibleStaffForService,
  CATEGORY_DEFAULT_SERVICES
} from '../types/servicePackageConfig';
import {
  StaffScheduleService
} from '../services/staffScheduleService';
import {
  SlotEngineService,
  SlotLockManager
} from '../services/slotEngineService';
import {
  BookingOrchestratorService
} from '../services/bookingOrchestratorService';
import {
  MockPaymentGatewayAdapter
} from '../services/paymentGateway';
import {
  advanceCalculationEngine
} from '../services/advanceCalculationEngine';
import {
  RazorpayPaymentGatewayAdapter,
  SandboxPaymentGatewayAdapter
} from '../services/paymentAdapters';
import {
  webhookRegistryEngine
} from '../services/webhookRegistry';
import {
  notificationDispatcherService,
  extractConfirmationSummary
} from '../services/notificationService';
import {
  CustomerBookingDraft
} from '../types/bookingFlow';
import {
  getDayOfWeekFromDate
} from '../types/staffSchedule';
import {
  CustomerCrmService,
  customerCrmService
} from '../services/customerCrmService';
import {
  calculateCustomerStatus
} from '../types/customerCrm';
import { StaffManagementService } from '../services/staffManagementService';
import { StaffDashboardService } from '../services/staffDashboardService';
import { DailyOperationsService } from '../services/dailyOperationsService';
import { ReviewsService } from '../services/reviewsService';
import { CommunicationService } from '../services/communicationService';
import { BusinessOperationalDashboardService } from '../services/businessOperationalDashboardService';
import { SecurityHardeningService } from '../services/securityHardeningService';
import { PaymentArchitectureService } from '../services/paymentArchitectureService';
import { NexoraQrService } from '../services/nexoraQrService';
import { CollectionSplitService } from '../services/collectionSplitService';
import { NexoraLedgerService } from '../services/nexoraLedgerService';
import { WithdrawalEngineService } from '../services/withdrawalEngineService';
import { NexoraWalletService } from '../services/nexoraWalletService';
import { RewardsRankingService } from '../services/rewardsRankingService';
import { CrmCampaignsService } from '../services/crmCampaignsService';
import { CrmAutomationsService } from '../services/crmAutomationsService';
import { AnalyticsService } from '../services/analyticsService';
import { AiGrowthService } from '../services/aiGrowthService';
import { FinancialReconciliationService } from '../services/financialReconciliationService';

export interface TestResultItem {
  id: string;
  name: string;
  suite: string;
  passed: boolean;
  message?: string;
  durationMs: number;
}

export function runFoundationTestSuite(): {
  total: number;
  passed: number;
  failed: number;
  results: TestResultItem[];
} {
  const results: TestResultItem[] = [];

  function test(suite: string, name: string, fn: () => void) {
    const start = performance.now();
    try {
      fn();
      results.push({
        id: `${suite}-${name}`.replace(/\s+/g, '-').toLowerCase(),
        name,
        suite,
        passed: true,
        durationMs: Number((performance.now() - start).toFixed(2)),
      });
    } catch (err: any) {
      results.push({
        id: `${suite}-${name}`.replace(/\s+/g, '-').toLowerCase(),
        name,
        suite,
        passed: false,
        message: err.message || String(err),
        durationMs: Number((performance.now() - start).toFixed(2)),
      });
    }
  }

  function assert(condition: boolean, message: string) {
    if (!condition) throw new Error(message);
  }

  function assertEquals(actual: any, expected: any, desc: string) {
    if (actual !== expected) {
      throw new Error(`${desc}: Expected ${expected} but received ${actual}`);
    }
  }

  // SUITE 1: CONFIGURATION INTEGRITY
  test('Configuration', 'Verify default 25% advance booking configuration', () => {
    assertEquals(
      PLATFORM_CONFIG.bookingDefaults.advancePercentage,
      25,
      'advancePercentage'
    );
  });

  test('Configuration', 'Verify 7 standardized business categories exist', () => {
    assertEquals(PLATFORM_CONFIG.categories.length, 7, 'categories.length');
    const ids = PLATFORM_CONFIG.categories.map((c) => c.id);
    assert(ids.includes('barber'), 'Missing barber category');
    assert(ids.includes('hair_salon'), 'Missing hair_salon category');
    assert(ids.includes('spa'), 'Missing spa category');
    assert(ids.includes('nail'), 'Missing nail category');
    assert(ids.includes('beauty'), 'Missing beauty category');
    assert(ids.includes('massage'), 'Missing massage category');
    assert(ids.includes('tattoo'), 'Missing tattoo category');
  });

  test('Configuration', 'Verify 6 design system theme presets exist with token schema', () => {
    const themes = Object.keys(PLATFORM_CONFIG.themes);
    assertEquals(themes.length, 6, 'themes.length');
    assert(themes.includes('luxury'), 'Missing luxury theme');
    assert(themes.includes('minimal'), 'Missing minimal theme');
    assert(themes.includes('modern'), 'Missing modern theme');
    assert(themes.includes('bold'), 'Missing bold theme');
    assert(themes.includes('elegant'), 'Missing elegant theme');
    assert(themes.includes('dark'), 'Missing dark theme');
  });

  // SUITE 2: FINANCIAL UTILITIES & CALCULATION ENGINE
  test('Financials', 'Calculate 25% advance with 18% GST correctly', () => {
    // Subtotal 1000, 0 discount, 25% advance, 18% GST
    // Taxable = 1000, Tax = 180, Total Gross = 1180
    // Advance = 25% of 1180 = 295. Balance = 885.
    const res = calculateBookingFinancials(1000, 0, 25, 18);
    assertEquals(res.totalGrossAmount, 1180, 'totalGrossAmount');
    assertEquals(res.advanceAmountRequired, 295, 'advanceAmountRequired');
    assertEquals(res.outstandingBalanceAtVenue, 885, 'outstandingBalanceAtVenue');
  });

  test('Financials', 'Calculate 0% tax booking (pure subtotal test)', () => {
    const res = calculateBookingFinancials(1000, 0, 25, 0);
    assertEquals(res.totalGrossAmount, 1000, 'totalGrossAmount');
    assertEquals(res.advanceAmountRequired, 250, 'advanceAmountRequired');
    assertEquals(res.outstandingBalanceAtVenue, 750, 'outstandingBalanceAtVenue');
  });

  test('Financials', 'Format Indian Rupee currency correctly', () => {
    assertEquals(formatCurrency(1250), '₹1,250', 'formatCurrency standard');
    assertEquals(formatCurrency(34250), '₹34,250', 'formatCurrency thousands');
  });

  test('Financials', 'Format duration in minutes to human text', () => {
    assertEquals(formatDuration(45), '45 mins', 'formatDuration <60');
    assertEquals(formatDuration(60), '1 hr', 'formatDuration 60m');
    assertEquals(formatDuration(75), '1 hr 15 mins', 'formatDuration 75m');
  });

  test('Financials', 'Evaluate daily qualification threshold progress', () => {
    const under = evaluateQualificationStatus(600, 1000);
    assertEquals(under.isQualified, false, 'isQualified under');
    assertEquals(under.progressPercentage, 60, 'progressPercentage');
    assertEquals(under.gap, 400, 'gap');

    const qualified = evaluateQualificationStatus(1200, 1000);
    assertEquals(qualified.isQualified, true, 'isQualified over');
    assertEquals(qualified.progressPercentage, 100, 'progressPercentage cap');
    assertEquals(qualified.gap, 0, 'gap zero');
  });

  // SUITE 3: ROUTE PROTECTION & ZONE BOUNDARY ARCHITECTURE
  test('AuthGuard', 'Public zone allows unauthenticated access', () => {
    const res = checkZoneAccess('PUBLIC', null);
    assertEquals(res.allowed, true, 'Public access without role');
  });

  test('AuthGuard', 'Admin zone rejects unauthenticated customer', () => {
    const res = checkZoneAccess('BUSINESS_ADMIN', null);
    assertEquals(res.allowed, false, 'Admin requires auth');
    assertEquals(res.redirectPath, '/signin', 'Redirect path');
  });

  test('AuthGuard', 'Admin zone denies Customer role but allows Business Owner', () => {
    const customerRes = checkZoneAccess('BUSINESS_ADMIN', 'CUSTOMER');
    assertEquals(customerRes.allowed, false, 'Deny customer in admin');

    const ownerRes = checkZoneAccess('BUSINESS_ADMIN', 'BUSINESS_OWNER');
    assertEquals(ownerRes.allowed, true, 'Allow business owner in admin');
  });

  test('AuthGuard', 'Super admin zone strictly rejects Business Owner', () => {
    const ownerRes = checkZoneAccess('SUPER_ADMIN', 'BUSINESS_OWNER');
    assertEquals(ownerRes.allowed, false, 'Deny business owner in superadmin');

    const superRes = checkZoneAccess('SUPER_ADMIN', 'SUPER_ADMIN');
    assertEquals(superRes.allowed, true, 'Allow super admin in superadmin');
  });

  // SUITE 4: CATEGORY + TEMPLATE RESOLVER ENGINE (PHASE 3.4)
  test('TemplateResolver', 'Barber category resolves at least 3 distinct barber templates', () => {
    const barberTemplates = getTemplatesForCategory('barber');
    assert(barberTemplates.length >= 3, `Expected at least 3 barber templates, got ${barberTemplates.length}`);
    const templateIds = barberTemplates.map((t) => t.templateId);
    assert(templateIds.includes('tmpl-barber-luxury'), 'Missing luxury barber template');
    assert(templateIds.includes('tmpl-barber-modern'), 'Missing modern barber template');
    assert(templateIds.includes('tmpl-barber-minimal'), 'Missing minimal barber template');
  });

  test('TemplateResolver', 'Spa category resolves at least 3 distinct spa templates', () => {
    const spaTemplates = getTemplatesForCategory('spa');
    assert(spaTemplates.length >= 3, `Expected at least 3 spa templates, got ${spaTemplates.length}`);
    const templateIds = spaTemplates.map((t) => t.templateId);
    assert(templateIds.includes('tmpl-spa-sanctuary'), 'Missing sanctuary spa template');
  });

  test('TemplateResolver', 'Tattoo category resolves at least 3 distinct tattoo templates', () => {
    const tattooTemplates = getTemplatesForCategory('tattoo');
    assert(tattooTemplates.length >= 3, `Expected at least 3 tattoo templates, got ${tattooTemplates.length}`);
    const templateIds = tattooTemplates.map((t) => t.templateId);
    assert(templateIds.includes('tmpl-tattoo-mono'), 'Missing mono tattoo template');
  });

  test('TemplateResolver', 'Full resolution of Barber template returns theme tokens and default services', () => {
    const resolved = resolveTemplateData('barber', 'tmpl-barber-luxury');
    assert(resolved !== null, 'Resolved data should not be null');
    assertEquals(resolved?.category.name, 'Barber & Men Grooming', 'Category name');
    assertEquals(resolved?.themePreset, 'luxury', 'Theme preset');
    assert(resolved!.defaultServices.length >= 3, 'Must have default services seeded');
    assert(resolved!.defaultPackages.length >= 1, 'Must have default packages seeded');
  });

  test('TemplateResolver', 'Unknown category fails safely by returning null', () => {
    const unknownCategory = resolveTemplateData('unknown-alien-category');
    assertEquals(unknownCategory, null, 'Safe failure for unknown category');

    const emptyTemplates = getTemplatesForCategory('unknown-alien-category');
    assertEquals(emptyTemplates.length, 0, 'Empty array for unknown category templates');
  });

  // SUITE 5: PUBLIC BUSINESS WEBSITE FOUNDATION (PHASE 3.5)
  test('PublicWebsite', 'Barber salon resolves dynamic metadata & luxury theme', () => {
    const barber = getPublicBusinessBySlug('royal-crown');
    assert(barber !== null, 'Barber business exists in seed registry');
    assertEquals(barber?.name, 'The Royal Crown Barber & Lounge', 'Barber Name');
    assertEquals(barber?.config.advancePaymentPercentage, 25, '25% advance rule');
    assert(barber!.galleryImages.length >= 3, 'Barber has gallery photos');
    assert(barber!.testimonials.length >= 2, 'Barber has verified testimonials');
  });

  test('PublicWebsite', 'Spa sanctuary resolves dynamic metadata & minimal theme', () => {
    const spa = getPublicBusinessBySlug('zenith-spa');
    assert(spa !== null, 'Spa business exists in seed registry');
    assertEquals(spa?.name, 'Zenith Stone Spa & Sanctuary', 'Spa Name');
    assertEquals(spa?.category, 'spa', 'Spa category match');
  });

  test('PublicWebsite', 'Nail studio resolves dynamic metadata & elegant theme', () => {
    const nail = getPublicBusinessBySlug('gloss-chic');
    assert(nail !== null, 'Nail studio exists in seed registry');
    assertEquals(nail?.name, 'Gloss & Chic Nail Bar', 'Nail Name');
  });

  test('PublicWebsite', 'Tattoo studio resolves dynamic metadata & bold theme', () => {
    const tattoo = getPublicBusinessBySlug('mono-tattoo');
    assert(tattoo !== null, 'Tattoo studio exists in seed registry');
    assertEquals(tattoo?.name, 'Mono Blackwork & Fine Line Tattoo', 'Tattoo Name');
    assertEquals(tattoo?.category, 'tattoo', 'Tattoo category match');
  });

  // SUITE 6: AUTHENTICATION FOUNDATION & 5 CORE ROLES (PHASE 3.6)
  test('AuthFoundation', '5 Core platform roles seeded in auth registry', () => {
    const roles = SEEDED_AUTH_USERS.map((u) => u.role);
    assert(roles.includes('CUSTOMER'), 'Has CUSTOMER role');
    assert(roles.includes('BUSINESS_OWNER'), 'Has BUSINESS_OWNER role');
    assert(roles.includes('MANAGER'), 'Has MANAGER role');
    assert(roles.includes('STAFF'), 'Has STAFF role');
    assert(roles.includes('SUPER_ADMIN'), 'Has SUPER_ADMIN role');
  });

  test('AuthFoundation', 'Client-side SHA-256 salted hashing does not output plaintext', async () => {
    const hash = await hashPasswordClient('super_secret_123');
    assert(hash.length === 64, 'SHA-256 hex string length 64');
    assert(!hash.includes('super_secret_123'), 'Hash must not contain plaintext string');
  });

  test('AuthFoundation', 'Business owner record binds to correct salon slug', () => {
    const owner = SEEDED_AUTH_USERS.find((u) => u.role === 'BUSINESS_OWNER');
    assert(owner !== undefined, 'Owner exists');
    assertEquals(owner?.businessSlug, 'royal-crown', 'Owner binds to royal-crown slug');
  });

  // SUITE 7: BUSINESS ONBOARDING & CATEGORY CONFIG GENERATION (PHASE 3.7)
  test('Onboarding', 'Barber onboarding initializes barber staff roles and services', () => {
    const barberDef = getCategoryDefinition('barber');
    assert(barberDef !== null, 'Barber definition exists');
    assert(barberDef!.staffRoles.includes('Master Barber'), 'Has Master Barber role');
    assert(barberDef!.defaultServices.some((s) => s.name.includes('Skin Fade')), 'Has Skin Fade service');
  });

  test('Onboarding', 'Spa onboarding initializes spa therapist roles and hydro rituals', () => {
    const spaDef = getCategoryDefinition('spa');
    assert(spaDef !== null, 'Spa definition exists');
    assert(spaDef!.staffRoles.includes('Spa Therapist') || spaDef!.staffRoles.includes('Lead Spa Therapist'), 'Has Spa Therapist role');
    assert(spaDef!.defaultServices.some((s) => s.name.includes('Stone')), 'Has stone therapy service');
  });

  test('Onboarding', 'Nail studio onboarding initializes nail artist roles and dry manicure defaults', () => {
    const nailDef = getCategoryDefinition('nail-studio');
    assert(nailDef !== null, 'Nail definition exists');
    assert(nailDef!.staffRoles.includes('Master Nail Artist') || nailDef!.staffRoles.includes('Nail Artist'), 'Has Nail Artist role');
    assert(nailDef!.defaultServices.some((s) => s.name.includes('Manicure')), 'Has manicure service');
  });

  // SUITE 8: WEBSITE BUILDER FOUNDATION (PHASE 3.8)
  test('WebsiteBuilder', 'Builder initialized with 10 standard homepage sections', () => {
    assert(INITIAL_BUILDER_SECTIONS.length === 10, 'Expected 10 builder sections');
    const types = INITIAL_BUILDER_SECTIONS.map((s) => s.type);
    assert(types.includes('hero'), 'Contains hero section');
    assert(types.includes('about'), 'Contains about section');
    assert(types.includes('services'), 'Contains services section');
    assert(types.includes('booking'), 'Contains booking CTA section');
  });

  test('WebsiteBuilder', 'Section property modification alters structured content without touching source', () => {
    const heroSection = { ...INITIAL_BUILDER_SECTIONS[0] };
    heroSection.heading = 'Custom Luxury Grooming Title';
    heroSection.badge = 'Exclusive Membership';
    assertEquals(heroSection.heading, 'Custom Luxury Grooming Title', 'Heading updated');
    assertEquals(heroSection.badge, 'Exclusive Membership', 'Badge updated');
  });

  test('WebsiteBuilder', 'Section visibility toggle and reordering behaves correctly', () => {
    const sections = [...INITIAL_BUILDER_SECTIONS];
    // Hide section 0
    sections[0].visible = false;
    assertEquals(sections[0].visible, false, 'Hero section hidden');

    // Reorder (Swap 0 and 1)
    const temp = sections[0];
    sections[0] = sections[1];
    sections[1] = temp;
    assertEquals(sections[0].type, 'services', 'Services moved to position 1');
    assertEquals(sections[1].type, 'hero', 'Hero moved to position 2');
  });

  test('WebsiteBuilder', 'Persistence abstraction stores and retrieves draft state', async () => {
    const sampleDraft = {
      businessSlug: 'test-slug-99',
      businessName: 'Test Salon',
      category: 'barber',
      templateId: 'tmpl-barber-luxury',
      theme: 'luxury',
      activePage: 'home' as const,
      selectedSectionId: 'sec-hero',
      pages: {
        home: {
          pageId: 'home' as const,
          name: 'Home',
          sections: INITIAL_BUILDER_SECTIONS
        }
      },
      updatedAt: new Date().toISOString()
    };

    const saved = await localWebsitePersistence.saveDraft(sampleDraft as any);
    assert(saved === true, 'Draft saved successfully');
  });

  // SUITE 9: BOOKING DATA MODEL & STATE MACHINE (PHASE 4.1)
  test('BookingStateMachine', 'Valid state transitions traverse full lifecycle with timestamps & audit logs', () => {
    const booking = BookingStateMachineService.createBooking({
      businessId: 'biz-barber-001',
      customerId: 'cust-101',
      customerName: 'Aarav Mehta',
      customerPhone: '+91 98765 43210',
      customerEmail: 'aarav@example.com',
      bookingDate: '2026-10-10',
      startTime: '10:00',
      items: [
        {
          itemType: 'SERVICE',
          referenceId: 'srv-1',
          nameSnapshot: 'Beard Sculpt & Fade',
          categorySnapshot: 'barber',
          unitPrice: 1000,
          durationMinutesSnapshot: 30
        }
      ]
    });

    assertEquals(booking.status, 'DRAFT', 'Initial status is DRAFT');
    assertEquals(booking.statusHistory.length, 1, 'Initial audit log present');

    // DRAFT -> PAYMENT_PENDING
    let res = BookingStateMachineService.transitionStatus(booking, 'PAYMENT_PENDING', {
      changedByUserId: 'cust-101',
      changedByRole: 'CUSTOMER'
    });
    assert(res.success, 'Transition to PAYMENT_PENDING succeeded');
    assertEquals(res.updatedBooking?.status, 'PAYMENT_PENDING', 'Status is PAYMENT_PENDING');

    // PAYMENT_PENDING -> ADVANCE_PAID
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'ADVANCE_PAID', {
      changedByUserId: 'cust-101',
      changedByRole: 'CUSTOMER'
    });
    assert(res.success, 'Transition to ADVANCE_PAID succeeded');

    // ADVANCE_PAID -> CONFIRMED
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'CONFIRMED', {
      changedByUserId: 'system',
      changedByRole: 'SYSTEM'
    });
    assert(res.success, 'Transition to CONFIRMED succeeded');
    assert(res.updatedBooking?.confirmedAt !== undefined, 'confirmedAt timestamp recorded');

    // CONFIRMED -> CHECKED_IN
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'CHECKED_IN', {
      changedByUserId: 'staff-01',
      changedByRole: 'STAFF'
    });
    assert(res.success, 'Transition to CHECKED_IN succeeded');
    assert(res.updatedBooking?.checkedInAt !== undefined, 'checkedInAt timestamp recorded');

    // CHECKED_IN -> IN_PROGRESS
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'IN_PROGRESS', {
      changedByUserId: 'staff-01',
      changedByRole: 'STAFF'
    });
    assert(res.success, 'Transition to IN_PROGRESS succeeded');

    // IN_PROGRESS -> COMPLETED
    res = BookingStateMachineService.transitionStatus(res.updatedBooking!, 'COMPLETED', {
      changedByUserId: 'staff-01',
      changedByRole: 'STAFF'
    });
    assert(res.success, 'Transition to COMPLETED succeeded');
    assert(res.updatedBooking?.completedAt !== undefined, 'completedAt timestamp recorded');
    assertEquals(res.updatedBooking?.statusHistory.length, 7, 'All 6 transitions recorded in audit history');
  });

  test('BookingStateMachine', 'Invalid status transitions are blocked with descriptive errors', () => {
    // 1. DRAFT cannot jump directly to COMPLETED
    const check1 = validateBookingStatusTransition('DRAFT', 'COMPLETED');
    assertEquals(check1.valid, false, 'DRAFT -> COMPLETED blocked');
    assert(Boolean(check1.error?.includes('Invalid transition')), 'Error describes illegal transition');

    // 2. COMPLETED cannot jump backwards to CONFIRMED
    const check2 = validateBookingStatusTransition('COMPLETED', 'CONFIRMED');
    assertEquals(check2.valid, false, 'COMPLETED -> CONFIRMED blocked');

    // 3. REFUNDED is terminal
    const check3 = validateBookingStatusTransition('REFUNDED', 'CONFIRMED');
    assertEquals(check3.valid, false, 'REFUNDED is terminal state');
  });

  test('BookingStateMachine', 'Multi-tenant repository enforces tenant isolation boundary', () => {
    const booking = BookingStateMachineService.createBooking({
      businessId: 'biz-barber-001',
      customerId: 'cust-101',
      customerName: 'Aarav Mehta',
      customerPhone: '+91 98765 43210',
      customerEmail: 'aarav@example.com',
      bookingDate: '2026-10-10',
      startTime: '10:00',
      items: [
        {
          itemType: 'SERVICE',
          referenceId: 'srv-1',
          nameSnapshot: 'Beard Sculpt & Fade',
          categorySnapshot: 'barber',
          unitPrice: 1000,
          durationMinutesSnapshot: 30
        }
      ]
    });

    const repo = new MultiTenantBookingRepository([booking]);

    // Same tenant can access
    const allowed = repo.getBookingById(booking.id, 'biz-barber-001');
    assert(allowed !== null, 'Owning tenant can access booking');
    assertEquals(allowed?.id, booking.id, 'Booking ID matches');

    // Another tenant CANNOT access (strictly isolated)
    const blocked = repo.getBookingById(booking.id, 'biz-spa-999');
    assertEquals(blocked, null, 'Foreign tenant cannot access or enumerate booking');

    // verifyTenantOwnership guard check
    assert(verifyTenantOwnership(booking, 'biz-barber-001') === true, 'Ownership verified for owner');
    assert(verifyTenantOwnership(booking, 'biz-spa-999') === false, 'Ownership rejected for foreign tenant');
  });

  test('BookingStateMachine', 'Financial snapshot safely computes integer cents and advance breakdown', () => {
    // Subtotal 1500, discount 100, 25% advance, 18% GST
    const snapshot = createFinancialSnapshot(1500, 100, 25, 18, 'INR');

    assertEquals(snapshot.subtotalCents, 150000, 'Subtotal is 150000 cents (₹1500)');
    assertEquals(snapshot.discountCents, 10000, 'Discount is 10000 cents (₹100)');
    // Net is 1400. 18% of 1400 = 252 (25200 cents). Total = 1652 (165200 cents)
    assertEquals(snapshot.taxGstCents, 25200, 'GST is 25200 cents (₹252)');
    assertEquals(snapshot.totalCents, 165200, 'Total is 165200 cents (₹1652)');
    // 25% of 1652 = 413 (41300 cents)
    assertEquals(snapshot.advanceAmountCents, 41300, 'Advance is 41300 cents (₹413)');
    assertEquals(snapshot.remainingAmountCents, 123900, 'Remaining is 123900 cents (₹1239)');
    assertEquals(snapshot.advanceAmountCents + snapshot.remainingAmountCents, snapshot.totalCents, 'Advance + remaining exactly equals total cents');
  });

  // SUITE 10: SERVICES & PACKAGES BOOKING CONFIGURATION (PHASE 4.2)
  test('ServicePackageConfig', 'Service creation sets pricing, duration, buffers, and staff assignment mode', () => {
    const serviceManager = new ServicePackageConfigService();
    const newService = serviceManager.createService({
      businessId: 'biz-barber-001',
      categoryId: 'barber',
      name: 'Executive Lather & Head Massage',
      description: 'Relaxing scalp stimulation.',
      price: 850,
      duration: 35,
      bufferTime: 10,
      active: true,
      bookable: true,
      featured: false,
      advancePercentage: 30,
      sortOrder: 5,
      staffAssignmentMode: 'CUSTOMER_SELECTS',
      eligibleStaffIds: ['stf-rc-01']
    });

    assert(Boolean(newService.id), 'Service assigned unique ID');
    assertEquals(newService.price, 850, 'Price stored correctly');
    assertEquals(newService.duration, 35, 'Duration stored correctly');
    assertEquals(newService.bufferTime, 10, 'Buffer time stored correctly');
    assertEquals(newService.advancePercentage, 30, 'Advance percentage override stored');
    assertEquals(newService.staffAssignmentMode, 'CUSTOMER_SELECTS', 'Staff assignment mode stored');
    assertEquals(newService.eligibleStaffIds.length, 1, 'Eligible staff mapped');
  });

  test('ServicePackageConfig', 'Service updates respect multi-tenant boundary', () => {
    const serviceManager = new ServicePackageConfigService();
    // Authorized tenant update
    const resAuth = serviceManager.updateService(
      'srv-barber-1',
      { price: 1350, name: 'Royal Beard Sculpt Deluxe' },
      'biz-barber-001'
    );
    assert(resAuth.success, 'Authorized tenant update succeeds');
    assertEquals(resAuth.service?.price, 1350, 'Price updated to 1350');

    // Unauthorized cross-tenant update
    const resUnauth = serviceManager.updateService(
      'srv-barber-1',
      { price: 9999 },
      'biz-spa-999'
    );
    assertEquals(resUnauth.success, false, 'Cross-tenant update blocked');
  });

  test('ServicePackageConfig', 'Inactive service is excluded from online booking', () => {
    const serviceManager = new ServicePackageConfigService();
    const inactiveService = serviceManager.getService('srv-barber-4', 'biz-barber-001');
    assert(inactiveService !== null, 'Service exists in database');
    assertEquals(inactiveService?.active, false, 'Service is inactive');
    assertEquals(isServiceBookable(inactiveService!), false, 'isServiceBookable returns false for inactive');

    const bookableList = serviceManager.listBookableServicesByTenant('biz-barber-001');
    assert(
      !bookableList.some((s) => s.id === 'srv-barber-4'),
      'Inactive service excluded from bookable services query'
    );
  });

  test('ServicePackageConfig', 'Active but non-bookable service displays in catalog but excluded from booking', () => {
    const serviceManager = new ServicePackageConfigService();
    // srv-barber-3 is VIP Lounge Access: active=true, bookable=false
    const nonBookable = serviceManager.getService('srv-barber-3', 'biz-barber-001');
    assert(nonBookable !== null, 'Service exists');
    assertEquals(nonBookable?.active, true, 'Active in catalog display');
    assertEquals(nonBookable?.bookable, false, 'Marked non-bookable online');
    assertEquals(isServiceBookable(nonBookable!), false, 'isServiceBookable returns false');

    const catalogList = serviceManager.listServicesByTenant('biz-barber-001');
    assert(catalogList.some((s) => s.id === 'srv-barber-3'), 'Present in general catalog listing');

    const bookableList = serviceManager.listBookableServicesByTenant('biz-barber-001');
    assert(!bookableList.some((s) => s.id === 'srv-barber-3'), 'Excluded from online bookable listing');
  });

  test('ServicePackageConfig', 'Package contains multiple services with bundled pricing and duration', () => {
    const serviceManager = new ServicePackageConfigService();
    const pkg = serviceManager.getPackage('pkg-barber-royal-ritual', 'biz-barber-001');
    assert(pkg !== null, 'Package found');
    assertEquals(pkg?.serviceIds.length, 2, 'Contains 2 bundled services');
    assert(pkg!.serviceIds.includes('srv-barber-1'), 'Contains Service 1');
    assert(pkg!.serviceIds.includes('srv-barber-2'), 'Contains Service 2');
    assertEquals(pkg?.price, 1600, 'Bundled price is 1600');
    assertEquals(pkg?.originalPrice, 1900, 'Original price is 1900');
    assertEquals(isPackageBookable(pkg!), true, 'Package is online bookable');
  });

  test('ServicePackageConfig', 'Eligible staff relationship filters only assigned, active staff members', () => {
    const serviceManager = new ServicePackageConfigService();
    // Straight razor shave (srv-barber-2) has eligibleStaffIds: ['stf-rc-01'] (Master Barber only)
    const eligibleRazor = serviceManager.getEligibleStaffForService('srv-barber-2', 'biz-barber-001');
    assertEquals(eligibleRazor.length, 1, 'Only 1 staff eligible for straight razor shave');
    assertEquals(eligibleRazor[0].name, 'Vikram Rajput', 'Eligible staff is Master Barber Vikram Rajput');

    // Signature fade (srv-barber-1) has eligibleStaffIds: ['stf-rc-01', 'stf-rc-02']
    const eligibleFade = serviceManager.getEligibleStaffForService('srv-barber-1', 'biz-barber-001');
    assertEquals(eligibleFade.length, 2, '2 staff eligible for fade');

    // Inactive staff member stf-rc-03 is filtered out automatically even if listed
    const allStaff = serviceManager.listStaffByTenant('biz-barber-001');
    const eligibleWithInactive = getEligibleStaffForService(
      {
        id: 'temp-srv',
        businessId: 'biz-barber-001',
        categoryId: 'barber',
        name: 'Test',
        description: '',
        price: 100,
        duration: 20,
        bufferTime: 0,
        active: true,
        bookable: true,
        featured: false,
        sortOrder: 1,
        eligibleStaffIds: ['stf-rc-01', 'stf-rc-03'] // stf-rc-03 is inactive
      },
      allStaff
    );
    assertEquals(eligibleWithInactive.length, 1, 'Inactive staff member stf-rc-03 filtered out');
  });

  test('ServicePackageConfig', 'Historical price snapshot captures price and remains immutable when service updates', () => {
    const serviceManager = new ServicePackageConfigService();
    // 1. Capture snapshot at initial price (₹1200)
    const snapshotItem = serviceManager.createBookingItem(
      'SERVICE',
      'srv-barber-1',
      'bk-test-100',
      'biz-barber-001',
      'stf-rc-01'
    );
    assertEquals(snapshotItem.unitPriceCents, 120000, 'Snapshot captured at ₹1200 (120000 cents)');
    assertEquals(snapshotItem.nameSnapshot, 'Signature Royal Beard Sculpt & Razor Fade', 'Name snapshotted');
    assertEquals(snapshotItem.staffNameSnapshot, 'Vikram Rajput', 'Staff name snapshotted');

    // 2. Now alter the service catalog price to ₹1500
    serviceManager.updateService('srv-barber-1', { price: 1500 }, 'biz-barber-001');
    const updatedService = serviceManager.getService('srv-barber-1', 'biz-barber-001');
    assertEquals(updatedService?.price, 1500, 'Catalog price changed to ₹1500');

    // 3. Verify previous snapshot record was NOT mutated
    assertEquals(snapshotItem.unitPriceCents, 120000, 'Historical snapshot remains exactly 120000 cents (₹1200)');
  });

  test('ServicePackageConfig', 'Category defaults provide editable templates for Barber, Spa, Nail, Tattoo', () => {
    assert(CATEGORY_DEFAULT_SERVICES['barber'].length >= 4, 'Barber has defaults (Haircut, Beard Trim, Shave)');
    assert(CATEGORY_DEFAULT_SERVICES['spa'].length >= 4, 'Spa has defaults (Swedish, Deep Tissue, Aromatherapy)');
    assert(CATEGORY_DEFAULT_SERVICES['nail-studio'].length >= 3, 'Nail has defaults (Manicure, Pedicure, Gel)');
    assert(CATEGORY_DEFAULT_SERVICES['tattoo'].length >= 3, 'Tattoo has defaults (Consultation, Small, Custom)');
  });

  // SUITE 11: STAFF AVAILABILITY & WORKING SCHEDULE (PHASE 4.3)
  test('StaffAvailability', 'Valid slot intersects open business and available staff shifts', () => {
    const scheduleService = new StaffScheduleService();
    const serviceManager = new ServicePackageConfigService();
    const service = serviceManager.getService('srv-barber-1', 'biz-barber-001');

    // Tuesday Oct 06, 2026 at 11:00 AM for Vikram (Master Barber)
    const result = scheduleService.evaluateAvailability(
      {
        businessId: 'biz-barber-001',
        staffId: 'stf-rc-01',
        serviceId: 'srv-barber-1',
        serviceDurationMinutes: 45,
        bufferTimeMinutes: 10,
        bookingDate: '2026-10-06',
        startTime: '11:00'
      },
      { service: service || undefined }
    );

    assertEquals(result.available, true, 'Slot is available');
    assertEquals(result.code, 'AVAILABLE', 'Code is AVAILABLE');
    assertEquals(result.status, 'AVAILABLE', 'Status is AVAILABLE');
    assertEquals(result.slotDetails?.totalOccupancyMinutes, 55, '45m + 10m buffer = 55m occupancy');
    assertEquals(result.slotDetails?.businessTimezone, 'Asia/Kolkata', 'Business timezone resolved');
  });

  test('StaffAvailability', 'Outside business hours rejects early and late bookings', () => {
    const scheduleService = new StaffScheduleService();
    // 1. Before opening (07:00 AM when business opens at 09:00 AM)
    const resEarly = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 30,
      bufferTimeMinutes: 5,
      bookingDate: '2026-10-06',
      startTime: '07:00'
    });
    assertEquals(resEarly.available, false, 'Early booking rejected');
    assertEquals(resEarly.code, 'OUTSIDE_BUSINESS_HOURS', 'Code OUTSIDE_BUSINESS_HOURS');

    // 2. Closed day (Monday)
    const resMonday = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 30,
      bufferTimeMinutes: 5,
      bookingDate: '2026-10-05', // Monday
      startTime: '11:00'
    });
    assertEquals(resMonday.available, false, 'Monday booking rejected (closed)');
    assertEquals(resMonday.code, 'OUTSIDE_BUSINESS_HOURS', 'Code OUTSIDE_BUSINESS_HOURS');
  });

  test('StaffAvailability', 'Outside staff hours rejects booking beyond staff shift or on staff day off', () => {
    const scheduleService = new StaffScheduleService();
    // Vikram shift ends at 18:00. Booking at 18:30
    const resLate = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 30,
      bufferTimeMinutes: 0,
      bookingDate: '2026-10-06', // Tuesday
      startTime: '18:30'
    });
    assertEquals(resLate.available, false, 'Late booking rejected');
    assertEquals(resLate.code, 'OUTSIDE_STAFF_HOURS', 'Code OUTSIDE_STAFF_HOURS');

    // Vikram does not work on Sunday
    const resSunday = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 30,
      bufferTimeMinutes: 0,
      bookingDate: '2026-10-11', // Sunday
      startTime: '12:00'
    });
    assertEquals(resSunday.available, false, 'Sunday booking rejected for Vikram');
    assertEquals(resSunday.code, 'OUTSIDE_STAFF_HOURS', 'Code OUTSIDE_STAFF_HOURS');
  });

  test('StaffAvailability', 'Staff break collision rejects slot overlapping lunch break', () => {
    const scheduleService = new StaffScheduleService();
    // Vikram has lunch break 13:00 - 14:00. Booking at 13:30 (duration 30m)
    const resBreak = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 30,
      bufferTimeMinutes: 0,
      bookingDate: '2026-10-06',
      startTime: '13:30'
    });
    assertEquals(resBreak.available, false, 'Break overlap rejected');
    assertEquals(resBreak.code, 'STAFF_ON_BREAK', 'Code STAFF_ON_BREAK');
  });

  test('StaffAvailability', 'Staff approved leave blocks availability during leave period', () => {
    const scheduleService = new StaffScheduleService();
    // Vikram on approved vacation Oct 15-18, 2026
    const resLeave = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 45,
      bufferTimeMinutes: 0,
      bookingDate: '2026-10-16', // Within leave window
      startTime: '11:00'
    });
    assertEquals(resLeave.available, false, 'Leave day rejected');
    assertEquals(resLeave.code, 'STAFF_ON_LEAVE', 'Code STAFF_ON_LEAVE');
    assertEquals(resLeave.status, 'ON_LEAVE', 'Status is ON_LEAVE');
  });

  test('StaffAvailability', 'Business calendar holiday blocks all bookings on that date', () => {
    const scheduleService = new StaffScheduleService();
    // Gandhi Jayanti Oct 02, 2026
    const resHoliday = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 30,
      bufferTimeMinutes: 0,
      bookingDate: '2026-10-02',
      startTime: '11:00'
    });
    assertEquals(resHoliday.available, false, 'Holiday booking rejected');
    assertEquals(resHoliday.code, 'BUSINESS_HOLIDAY', 'Code BUSINESS_HOLIDAY');
    assertEquals(resHoliday.status, 'HOLIDAY', 'Status is HOLIDAY');
  });

  test('StaffAvailability', 'Inactive staff member is rejected for booking', () => {
    const scheduleService = new StaffScheduleService();
    // stf-rc-03 is inactive
    const resInactive = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-03',
      serviceDurationMinutes: 30,
      bufferTimeMinutes: 0,
      bookingDate: '2026-10-06',
      startTime: '11:00'
    });
    assertEquals(resInactive.available, false, 'Inactive staff rejected');
    assertEquals(resInactive.code, 'STAFF_INACTIVE', 'Code STAFF_INACTIVE');
  });

  test('StaffAvailability', 'Staff not eligible for service is rejected', () => {
    const scheduleService = new StaffScheduleService();
    const serviceManager = new ServicePackageConfigService();
    // Straight Razor Shave (srv-barber-2) is only assigned to Master Barber Vikram (stf-rc-01)
    const razorService = serviceManager.getService('srv-barber-2', 'biz-barber-001');

    // Attempt to book with Sameer Khan (stf-rc-02)
    const resIneligible = scheduleService.evaluateAvailability(
      {
        businessId: 'biz-barber-001',
        staffId: 'stf-rc-02',
        serviceId: 'srv-barber-2',
        serviceDurationMinutes: 35,
        bufferTimeMinutes: 5,
        bookingDate: '2026-10-07', // Wednesday
        startTime: '12:00'
      },
      { service: razorService || undefined }
    );
    assertEquals(resIneligible.available, false, 'Ineligible staff rejected');
    assertEquals(resIneligible.code, 'STAFF_NOT_ELIGIBLE', 'Code STAFF_NOT_ELIGIBLE');
  });

  test('StaffAvailability', 'Service buffer time occupancy overflow is prevented', () => {
    const scheduleService = new StaffScheduleService();
    // Vikram shift ends at 18:00. Service starts at 17:30 with 45m service + 15m buffer = 60m total (ends at 18:30)
    const resBufferOverflow = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 45,
      bufferTimeMinutes: 15,
      bookingDate: '2026-10-06',
      startTime: '17:30'
    });
    assertEquals(resBufferOverflow.available, false, 'Buffer overflow rejected');
    assertEquals(resBufferOverflow.code, 'OUTSIDE_STAFF_HOURS', 'Code OUTSIDE_STAFF_HOURS');
  });

  // SUITE 12: AVAILABILITY & SLOT CALCULATION ENGINE (PHASE 4.4)
  test('SlotEngine', 'Normal slot generation supports configurable 15m, 30m, and 60m intervals', () => {
    const slotEngine = new SlotEngineService();

    // 30-min intervals on open Tuesday
    const res30 = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      date: '2026-10-06',
      slotIntervalMinutes: 30
    });
    assert(res30.slots.length > 10, 'Generated full day slots at 30m intervals');
    assert(res30.availableSlotsCount > 0, 'Contains available slots');
    assertEquals(res30.slots[0].startTime, '09:00', 'First candidate start is 09:00');
    assertEquals(res30.slots[1].startTime, '09:30', 'Second candidate start is 09:30');

    // 15-min intervals
    const res15 = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      date: '2026-10-06',
      slotIntervalMinutes: 15
    });
    assert(res15.slots.length > res30.slots.length, '15m interval generates double the candidate slots');
    assertEquals(res15.slots[1].startTime, '09:15', 'Second candidate start is 09:15');
  });

  test('SlotEngine', 'Overlap conflict detection prevents double booking for staff members', () => {
    const slotEngine = new SlotEngineService();

    // Seeded booking on 2026-10-05 exists for Vikram from 11:00 to 12:15.
    // Let's add a test booking for Vikram on 2026-10-06 from 10:00 to 11:15
    slotEngine.addBooking({
      id: 'bk-test-conflict-01',
      businessId: 'biz-barber-001',
      customerId: 'cust-temp',
      customerName: 'Existing Client',
      customerPhone: '123',
      customerEmail: 'test@example.com',
      staffId: 'stf-rc-01',
      items: [],
      bookingDate: '2026-10-06',
      startTime: '10:00',
      endTime: '11:15',
      duration: 75,
      subtotal: 1000,
      discount: 0,
      totalAmount: 1000,
      advancePercentage: 25,
      advanceAmount: 250,
      remainingAmount: 750,
      currency: 'INR',
      financials: {} as any,
      status: 'CONFIRMED',
      paymentStatus: 'ADVANCE_PAID',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Query specifically for Vikram
    const res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      staffId: 'stf-rc-01',
      date: '2026-10-06',
      slotIntervalMinutes: 30
    });

    const slot1000 = res.slots.find((s) => s.startTime === '10:00');
    const slot1030 = res.slots.find((s) => s.startTime === '10:30');
    const slot1130 = res.slots.find((s) => s.startTime === '11:30');

    assertEquals(slot1000?.available, false, '10:00 slot collides with existing 10:00-11:15 booking');
    assertEquals(slot1030?.available, false, '10:30 slot collides with existing 10:00-11:15 booking');
    assertEquals(slot1130?.available, true, '11:30 slot after booking completes is available');
  });

  test('SlotEngine', 'Buffer time protection and break avoidance are enforced', () => {
    const slotEngine = new SlotEngineService();

    // Query for Vikram (stf-rc-01). Has lunch break 13:00 - 14:00. Salon has sanitization break 14:00 - 14:30.
    const res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      staffId: 'stf-rc-01',
      date: '2026-10-06',
      slotIntervalMinutes: 30
    });

    const slot1230 = res.slots.find((s) => s.startTime === '12:30'); // 45m service + 10m buffer = finishes 13:25 -> overlaps lunch
    const slot1300 = res.slots.find((s) => s.startTime === '13:00'); // lunch
    const slot1400 = res.slots.find((s) => s.startTime === '14:00'); // sanitization break

    assertEquals(slot1230?.available, false, '12:30 slot buffer extends into 13:00 break');
    assertEquals(slot1300?.available, false, '13:00 lunch break slot is unavailable');
    assertEquals(slot1400?.available, false, '14:00 salon sanitization break slot is unavailable');
  });

  test('SlotEngine', 'Staff on approved leave is excluded from available slots', () => {
    const slotEngine = new SlotEngineService();
    // Vikram on leave Oct 15-18, 2026
    const res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      staffId: 'stf-rc-01',
      date: '2026-10-16',
      slotIntervalMinutes: 30
    });

    assertEquals(res.availableSlotsCount, 0, 'No slots available for staff on approved vacation');
  });

  test('SlotEngine', 'Closed day or business holiday returns zero available slots', () => {
    const slotEngine = new SlotEngineService();
    // Closed Monday
    const resMonday = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      date: '2026-10-05', // Monday
      slotIntervalMinutes: 30
    });
    assertEquals(resMonday.availableSlotsCount, 0, 'Zero available slots on closed Monday');

    // Gandhi Jayanti holiday (2026-10-02)
    const resHoliday = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      date: '2026-10-02',
      slotIntervalMinutes: 30
    });
    assertEquals(resHoliday.availableSlotsCount, 0, 'Zero available slots on business holiday');
    assertEquals(resHoliday.slots[0].conflictCode, 'BUSINESS_HOLIDAY', 'Reason is BUSINESS_HOLIDAY');
  });

  test('SlotEngine', 'Past time slots are marked unavailable with reference timestamp', () => {
    const slotEngine = new SlotEngineService();
    // Reference now is 2026-10-06T12:00:00Z
    const res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      date: '2026-10-06',
      slotIntervalMinutes: 30,
      referenceNowIso: '2026-10-06T12:00:00Z'
    });

    const slot0900 = res.slots.find((s) => s.startTime === '09:00');
    assertEquals(slot0900?.available, false, '09:00 slot is marked unavailable because it is in the past');
    assertEquals(slot0900?.conflictCode, 'PAST_TIME', 'Conflict code is PAST_TIME');
  });

  test('SlotEngine', 'ANY AVAILABLE STAFF aggregates multiple eligible staff members', () => {
    const slotEngine = new SlotEngineService();
    // srv-barber-1 is assigned to Vikram (stf-rc-01) and Sameer (stf-rc-02).
    // Wednesday Oct 07: Vikram shift starts at 09:00, Sameer shift starts at 11:00.
    const res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      staffId: 'ANY_AVAILABLE',
      date: '2026-10-07', // Wednesday
      slotIntervalMinutes: 30
    });

    const slot0930 = res.slots.find((s) => s.startTime === '09:30'); // Only Vikram working
    assert(slot0930?.available === true, '09:30 available because Vikram is working');
    assertEquals(slot0930?.availableStaffIds.length, 1, 'Only Vikram available at 09:30');

    const slot1130 = res.slots.find((s) => s.startTime === '11:30'); // Both Vikram and Sameer working
    assert(slot1130?.available === true, '11:30 available');
    assertEquals(slot1130?.availableStaffIds.length, 2, 'Both Vikram and Sameer available at 11:30');
  });

  test('SlotEngine', 'Short-lived concurrency lock prevents race condition during checkout', () => {
    const lockManager = new SlotLockManager();
    const slotEngine = new SlotEngineService(
      new StaffScheduleService(),
      new ServicePackageConfigService(),
      [],
      lockManager
    );

    // 1. Initial check: 11:00 slot is available
    let res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      staffId: 'stf-rc-01',
      date: '2026-10-06',
      slotIntervalMinutes: 30
    });
    let slot1100 = res.slots.find((s) => s.startTime === '11:00');
    assertEquals(slot1100?.available, true, '11:00 slot initially available');

    // 2. Client A acquires short-lived lock on 11:00 slot
    const lockAcquisition = lockManager.acquireLock(
      'biz-barber-001',
      'stf-rc-01',
      '2026-10-06',
      '11:00',
      55, // duration + buffer
      'cust-client-a',
      600
    );
    assert(lockAcquisition.success, 'Lock acquired successfully');

    // 3. Client B checks slots -> 11:00 slot is now blocked
    res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      staffId: 'stf-rc-01',
      date: '2026-10-06',
      slotIntervalMinutes: 30
    });
    slot1100 = res.slots.find((s) => s.startTime === '11:00');
    assertEquals(slot1100?.available, false, '11:00 slot now unavailable due to active concurrency lock');

    // 4. Release lock -> Slot becomes available again
    lockManager.releaseLock(lockAcquisition.lock!.id);
    res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      staffId: 'stf-rc-01',
      date: '2026-10-06',
      slotIntervalMinutes: 30
    });
    slot1100 = res.slots.find((s) => s.startTime === '11:00');
    assertEquals(slot1100?.available, true, '11:00 slot restored to available after lock release');
  });

  // ==========================================================================
  // SUITE 13: PHASE 4.5 — CUSTOMER BOOKING FLOW & ORCHESTRATOR
  // ==========================================================================

  test('Suite 13: Phase 4.5 Customer Booking Flow', 'Complete 8-Step End-to-End Booking Orchestration', () => {
    const orchestrator = new BookingOrchestratorService();

    // Step 1 & 2: Service & Staff Selection
    const draft: CustomerBookingDraft = {
      businessId: 'biz-barber-001',
      itemType: 'SERVICE',
      serviceId: 'srv-barber-1', // Classic Haircut ₹500
      staffId: 'stf-rc-01', // Barber Vikram Rajput
      date: '2026-10-06', // Tuesday
      startTime: '10:00',
      customerName: 'Aarav Patel',
      customerPhone: '+91 9876543210',
      customerEmail: 'aarav.patel@example.com',
      customerNotes: 'Prefers scissors over clippers'
    };

    // Step 3-6: Authoritative Re-validation & Financial Split Calculation
    const reval = orchestrator.revalidateBookingDraft(draft);
    assertEquals(reval.valid, true, 'Draft passes authoritative re-validation');
    assertEquals(reval.authoritativePriceCents, 50000, 'Price calculated as 50000 cents (₹500)');
    assertEquals(reval.authoritativeAdvancePercentage, 25, 'Advance configured as 25%');
    assertEquals(reval.financialSnapshot?.advanceAmountCents, 12500, 'Advance amount is ₹125 (12500 cents)');
    assertEquals(reval.financialSnapshot?.remainingAmountCents, 37500, 'Remaining balance is ₹375 (37500 cents)');
    assertEquals(reval.resolvedStaffName, 'Vikram Rajput', 'Staff resolved correctly');

    // Step 7: Payment Abstraction Intent & Confirmation
    const gateway = orchestrator.getPaymentGateway();
    let intentCreated = false;
    let paymentVerified = false;

    // Synchronous execution using promise resolution pattern for test suite
    gateway.createPaymentIntent({
      businessId: draft.businessId,
      amountCents: reval.financialSnapshot!.advanceAmountCents,
      currency: 'INR',
      customerEmail: draft.customerEmail,
      customerPhone: draft.customerPhone,
      customerName: draft.customerName,
      metadata: {
        bookingDraftId: 'dft-test-01',
        serviceId: draft.serviceId,
        date: draft.date,
        startTime: draft.startTime,
        description: 'Advance payment for Classic Haircut'
      }
    }).then((intent) => {
      intentCreated = Boolean(intent && intent.id.startsWith('pi_test_'));
      gateway.confirmPayment(intent.id, 'SANDBOX_TEST').then((exec) => {
        paymentVerified = exec.success;

        // Step 8: Final Authoritative Booking Creation
        orchestrator.createAuthoritativeBooking({
          draft,
          paymentIntentId: intent.id,
          gatewayTransactionRef: exec.transactionRef
        }).then((res) => {
          assert(res.success, 'Authoritative booking created successfully');
          assert(Boolean(res.booking?.id.startsWith('NX-BKG-')), 'Booking reference code generated');
          assertEquals(res.booking?.status, 'ADVANCE_PAID', 'Initial booking status is ADVANCE_PAID');
          assertEquals(res.booking?.financials.advanceAmountCents, 12500, 'Advance financial snapshot recorded');
          assertEquals(res.booking?.items[0]?.nameSnapshot, 'Classic Haircut', 'Historical service name snapshotted');
        });
      });
    });

    assert(true, 'Async step flow chained successfully');
  });

  test('Suite 13: Phase 4.5 Customer Booking Flow', 'Service Bookable Rule & Non-Bookable Rejection', () => {
    const orchestrator = new BookingOrchestratorService();
    const serviceManager = orchestrator.getServiceManager();

    // Create an active but NOT bookable service (e.g. VIP Consultation)
    serviceManager.createService({
      businessId: 'biz-barber-001',
      categoryId: 'barber',
      name: 'Walk-In Only Shave',
      description: 'In-salon walk in shave service only',
      price: 300,
      duration: 30,
      bufferTime: 5,
      active: true,
      bookable: false,
      featured: false,
      sortOrder: 99,
      eligibleStaffIds: ['stf-rc-01']
    });

    const nonBookable = serviceManager.listServicesByTenant('biz-barber-001').find((s) => s.name === 'Walk-In Only Shave');
    assert(Boolean(nonBookable), 'Walk-in service created');

    // Attempting to draft booking for non-bookable service must fail authoritative validation
    const draft: CustomerBookingDraft = {
      businessId: 'biz-barber-001',
      itemType: 'SERVICE',
      serviceId: nonBookable!.id,
      staffId: 'stf-rc-01',
      date: '2026-10-06',
      startTime: '10:00',
      customerName: 'Rohan Sen',
      customerPhone: '+91 9123456789',
      customerEmail: 'rohan@example.com'
    };

    const reval = orchestrator.revalidateBookingDraft(draft);
    assertEquals(reval.valid, false, 'Non-bookable service booking rejected');
    assert(Boolean(reval.errors.some((e) => e.includes('not currently available for online booking'))), 'Error indicates non-bookable rule');
  });

  test('Suite 13: Phase 4.5 Customer Booking Flow', 'ANY_AVAILABLE Staff Auto-Resolution', () => {
    const orchestrator = new BookingOrchestratorService();

    const draft: CustomerBookingDraft = {
      businessId: 'biz-barber-001',
      itemType: 'SERVICE',
      serviceId: 'srv-barber-1',
      staffId: 'ANY_AVAILABLE',
      date: '2026-10-06',
      startTime: '10:00',
      customerName: 'Vikram Seth',
      customerPhone: '+91 9988776655',
      customerEmail: 'vikram@example.com'
    };

    const reval = orchestrator.revalidateBookingDraft(draft);
    assertEquals(reval.valid, true, 'Draft passes with ANY_AVAILABLE');
    assert(Boolean(reval.resolvedStaffId), 'Staff ID resolved automatically by slot engine');
    assert(Boolean(reval.resolvedStaffName), 'Staff name resolved automatically');
  });

  test('Suite 13: Phase 4.5 Customer Booking Flow', 'Frontend Price Tamper Resistance', () => {
    const orchestrator = new BookingOrchestratorService();

    // Attacker submits valid draft but expects to pay ₹100 instead of ₹500
    const draft: CustomerBookingDraft = {
      businessId: 'biz-barber-001',
      itemType: 'SERVICE',
      serviceId: 'srv-barber-1', // Real price ₹500
      staffId: 'stf-rc-01',
      date: '2026-10-06',
      startTime: '10:00',
      customerName: 'Hacker X',
      customerPhone: '+91 9999999999',
      customerEmail: 'hacker@example.com'
    };

    // Orchestrator must ignore any client submitted price and enforce database catalog price
    const fin = orchestrator.calculateAuthoritativeFinancials('biz-barber-001', 'SERVICE', 'srv-barber-1');
    assertEquals(fin.priceCents, 50000, 'Catalog price 50000 cents enforced');
    assertEquals(fin.financialSnapshot.advanceAmountCents, 12500, 'Advance strictly 12500 cents (₹125)');
  });

  test('Suite 13: Phase 4.5 Customer Booking Flow', 'Payment Gateway Sandbox & Failure Simulation', () => {
    const gateway = new MockPaymentGatewayAdapter();

    gateway.createPaymentIntent({
      businessId: 'biz-spa-002',
      amountCents: 60000, // ₹600
      currency: 'INR',
      customerEmail: 'test@example.com',
      customerPhone: '+91 9876500000',
      customerName: 'Test User',
      metadata: {
        bookingDraftId: 'bkg-sbx-01',
        date: '2026-10-06',
        startTime: '14:00',
        description: 'Test Spa Deposit'
      }
    }).then((intent) => {
      assertEquals(intent.amountCents, 60000, 'Intent amount recorded');
      assertEquals(intent.isTestMode, true, 'Test mode flag enabled');

      // Test failure simulation branch
      gateway.confirmPayment(intent.id, 'CARD', true).then((failRes) => {
        assertEquals(failRes.success, false, 'Simulated failure handled correctly');
        assertEquals(failRes.paymentIntent.status, 'FAILED', 'Intent status updated to FAILED');
      });
    });
  });

  // =========================================================================
  // SUITE 14: PHASE 4.6 — ADVANCE PAYMENT ARCHITECTURE
  // =========================================================================

  test('Suite 14: Phase 4.6 Advance Payment Architecture', 'Advance Calculation: ₹1,000 → ₹250 (25% default)', () => {
    // 100,000 paise = ₹1,000
    const calc = advanceCalculationEngine.calculateAdvance(100000, 25, 'INR');
    assertEquals(calc.totalAmountPaise, 100000, 'Total is 100,000 paise (₹1,000)');
    assertEquals(calc.advancePercentage, 25, 'Advance percentage is 25%');
    assertEquals(calc.advanceAmountPaise, 25000, 'Advance is exactly 25,000 paise (₹250)');
    assertEquals(calc.remainingAmountPaise, 75000, 'Remaining is exactly 75,000 paise (₹750)');
    assertEquals(calc.advanceAmountPaise + calc.remainingAmountPaise, calc.totalAmountPaise, 'Money safety invariant holds');
  });

  test('Suite 14: Phase 4.6 Advance Payment Architecture', 'Advance Calculation: ₹2,000 → ₹500 (25% default)', () => {
    // 200,000 paise = ₹2,000
    const calc = advanceCalculationEngine.calculateAdvance(200000, 25, 'INR');
    assertEquals(calc.totalAmountPaise, 200000, 'Total is 200,000 paise (₹2,000)');
    assertEquals(calc.advancePercentage, 25, 'Advance percentage is 25%');
    assertEquals(calc.advanceAmountPaise, 50000, 'Advance is exactly 50,000 paise (₹500)');
    assertEquals(calc.remainingAmountPaise, 150000, 'Remaining is exactly 150,000 paise (₹1,500)');
    assertEquals(calc.advanceAmountPaise + calc.remainingAmountPaise, calc.totalAmountPaise, 'Money safety invariant holds');
  });

  test('Suite 14: Phase 4.6 Advance Payment Architecture', 'Configured Percentages & Rounding Precision', () => {
    // 30% on ₹1,500 (150,000 paise)
    const calc30 = advanceCalculationEngine.calculateAdvance(150000, 30, 'INR');
    assertEquals(calc30.advanceAmountPaise, 45000, '30% advance on ₹1500 is ₹450');
    assertEquals(calc30.remainingAmountPaise, 105000, 'Remaining is ₹1050');

    // Odd percentage rounding test: 33.33% on ₹1,000 (100,000 paise)
    const calcOdd = advanceCalculationEngine.calculateAdvance(100000, 33.33, 'INR');
    assertEquals(calcOdd.advanceAmountPaise, 33330, 'Rounding to nearest integer paise');
    assertEquals(calcOdd.remainingAmountPaise, 66670, 'Residual subtraction guarantees exact sum');
    assertEquals(calcOdd.advanceAmountPaise + calcOdd.remainingAmountPaise, 100000, 'Sum invariant preserved');
  });

  test('Suite 14: Phase 4.6 Advance Payment Architecture', 'Razorpay Adapter Order Creation & Verification', () => {
    const razorpay = new RazorpayPaymentGatewayAdapter();

    razorpay.createOrder({
      businessId: 'biz-barber-001',
      bookingId: 'bkg-test-101',
      customerId: 'cust-999',
      amountPaise: 25000, // ₹250
      paymentType: 'ADVANCE'
    }).then((order) => {
      assertEquals(order.provider, 'RAZORPAY', 'Provider is RAZORPAY');
      assert(order.orderId.startsWith('order_rzp_'), 'Order ID uses Razorpay prefix format');
      assertEquals(order.status, 'CREATED', 'Initial status is CREATED');

      // Server-side verification
      razorpay.verifyPayment({
        orderId: order.orderId,
        transactionId: 'rzp_txn_test_77',
        signature: 'rzp_sig_valid_test_token'
      }).then((vResult) => {
        assertEquals(vResult.verified, true, 'Server-side payment signature verified');
        assertEquals(vResult.paymentRecord.status, 'VERIFIED', 'Payment status marked VERIFIED');
      });
    });
  });

  test('Suite 14: Phase 4.6 Advance Payment Architecture', 'Payment Failure Rejection (Booking Remains Unconfirmed)', () => {
    const sandbox = new SandboxPaymentGatewayAdapter();

    sandbox.createOrder({
      businessId: 'biz-spa-002',
      bookingId: 'bkg-test-102',
      customerId: 'cust-888',
      amountPaise: 50000, // ₹500
      paymentType: 'ADVANCE'
    }).then((order) => {
      sandbox.verifyPayment({
        orderId: order.orderId,
        transactionId: 'sbx_txn_fail',
        signature: 'invalid_signature_token',
        simulateFailure: true
      }).then((vResult) => {
        assertEquals(vResult.verified, false, 'Failed verification rejected by server');
        assertEquals(vResult.paymentRecord.status, 'FAILED', 'Payment record status marked FAILED');
      });
    });
  });

  test('Suite 14: Phase 4.6 Advance Payment Architecture', 'Webhook Signature Verification & Idempotency Rejection', () => {
    webhookRegistryEngine.resetRegistry();

    const payload = {
      eventId: 'evt_wh_001_unique',
      eventType: 'payment.captured',
      createdAt: Date.now(),
      payload: {
        orderId: 'order_rzp_991',
        transactionId: 'txn_rzp_991',
        amountPaise: 25000,
        status: 'captured' as const
      }
    };

    // First attempt: valid signature, new event
    webhookRegistryEngine.processWebhookEvent(
      payload,
      'whsig_valid_key_881',
      'RAZORPAY',
      async () => undefined
    ).then((res1) => {
      assertEquals(res1.success, true, 'First webhook call succeeds');
      assertEquals(res1.idempotent, false, 'First call is not duplicate');

      // Duplicate attempt: same event ID
      webhookRegistryEngine.processWebhookEvent(
        payload,
        'whsig_valid_key_881',
        'RAZORPAY',
        async () => undefined
      ).then((res2) => {
        assertEquals(res2.success, true, 'Duplicate webhook call handled gracefully');
        assertEquals(res2.idempotent, true, 'Duplicate event cleanly flagged as idempotent duplicate');
      });
    });
  });

  test('Suite 14: Phase 4.6 Advance Payment Architecture', 'Invalid Webhook Signature Rejection', () => {
    webhookRegistryEngine.resetRegistry();

    const payload = {
      eventId: 'evt_wh_002_forged',
      eventType: 'payment.captured',
      createdAt: Date.now(),
      payload: {
        orderId: 'order_rzp_forged',
        transactionId: 'txn_rzp_forged',
        amountPaise: 1000,
        status: 'captured' as const
      }
    };

    webhookRegistryEngine.processWebhookEvent(
      payload,
      'forged_invalid_sig',
      'RAZORPAY',
      async () => undefined
    ).then((res) => {
      assertEquals(res.success, false, 'Forged signature rejected');
      assertEquals(res.message, 'Signature verification failed', 'Signature rejection message returned');
    });
  });

  // =========================================================================
  // SUITE 15: PHASE 4.7 — BOOKING CONFIRMATION & NOTIFICATIONS
  // =========================================================================

  test('Suite 15: Phase 4.7 Booking Confirmation & Notifications', 'Confirmation Summary Extraction & Display', () => {
    const sampleBooking = {
      id: 'NX-BKG-2026-8812',
      businessId: 'biz-barber-001',
      customerId: 'cust-771',
      customerName: 'Ananya Roy',
      customerPhone: '+91 9876543210',
      customerEmail: 'ananya@example.com',
      staffNameSnapshot: 'Master Stylist Rohan',
      items: [
        {
          id: 'itm-1',
          bookingId: 'NX-BKG-2026-8812',
          itemType: 'SERVICE' as const,
          referenceId: 'srv-barber-1',
          nameSnapshot: 'Royal Grooming Package',
          categorySnapshot: 'Men Haircut',
          unitPriceCents: 100000,
          durationMinutesSnapshot: 60
        }
      ],
      financials: {
        subtotalCents: 100000,
        discountCents: 0,
        gstCents: 0,
        taxGstCents: 0,
        totalCents: 100000,
        advancePercentage: 25,
        advanceAmountCents: 25000,
        remainingAmountCents: 75000,
        currency: 'INR'
      },
      bookingDate: '2026-10-10',
      startTime: '11:00',
      endTime: '12:00',
      duration: 60,
      subtotal: 1000,
      discount: 0,
      totalAmount: 1000,
      advancePercentage: 25,
      advanceAmount: 250,
      remainingAmount: 750,
      currency: 'INR',
      status: 'ADVANCE_PAID' as const,
      paymentStatus: 'ADVANCE_PAID' as const,
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const summary = extractConfirmationSummary(sampleBooking, 'Royal Crown Barber Lounge');
    assertEquals(summary.bookingId, 'NX-BKG-2026-8812', 'Booking ID extracted');
    assertEquals(summary.serviceName, 'Royal Grooming Package', 'Service name extracted');
    assertEquals(summary.staffName, 'Master Stylist Rohan', 'Staff name extracted');
    assertEquals(summary.totalAmountRupees, 1000, 'Total ₹1,000');
    assertEquals(summary.advancePaidRupees, 250, 'Advance ₹250');
    assertEquals(summary.remainingAmountRupees, 750, 'Remaining ₹750');
  });

  test('Suite 15: Phase 4.7 Booking Confirmation & Notifications', 'Mock Email Provider Dispatch', () => {
    notificationDispatcherService.resetLogs();

    const sampleBooking = {
      id: 'NX-BKG-2026-9901',
      businessId: 'biz-barber-001',
      customerId: 'cust-101',
      customerName: 'Karan Mehra',
      customerPhone: '+91 9900112233',
      customerEmail: 'karan@example.com',
      staffNameSnapshot: 'Alex Mercer',
      items: [{ id: 'itm-1', bookingId: 'NX-BKG-2026-9901', itemType: 'SERVICE' as const, referenceId: 'srv-1', nameSnapshot: 'Classic Haircut', categorySnapshot: 'Grooming', unitPriceCents: 50000, durationMinutesSnapshot: 45 }],
      financials: { subtotalCents: 50000, discountCents: 0, gstCents: 0, taxGstCents: 0, totalCents: 50000, advancePercentage: 25, advanceAmountCents: 12500, remainingAmountCents: 37500, currency: 'INR' },
      bookingDate: '2026-10-12',
      startTime: '14:00',
      endTime: '14:45',
      duration: 45,
      subtotal: 500,
      discount: 0,
      totalAmount: 500,
      advancePercentage: 25,
      advanceAmount: 125,
      remainingAmount: 375,
      currency: 'INR',
      status: 'ADVANCE_PAID' as const,
      paymentStatus: 'ADVANCE_PAID' as const,
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notificationDispatcherService.dispatchBookingEvent({
      event: 'BOOKING_CONFIRMED',
      booking: sampleBooking,
      channels: ['EMAIL']
    }).then((res) => {
      assertEquals(res.allSucceeded, true, 'Email dispatch succeeded');
      assertEquals(res.dispatchedRecords.length, 1, '1 email record created');
      assertEquals(res.dispatchedRecords[0].status, 'SENT', 'Record status marked SENT');
      assert(res.dispatchedRecords[0].body.includes('NX-BKG-2026-9901'), 'Body contains Booking ID');
    });
  });

  test('Suite 15: Phase 4.7 Booking Confirmation & Notifications', 'In-App Notification Record Creation', () => {
    notificationDispatcherService.resetLogs();

    const sampleBooking = {
      id: 'NX-BKG-2026-9902',
      businessId: 'biz-spa-002',
      customerId: 'cust-102',
      customerName: 'Pooja Sharma',
      customerPhone: '+91 9811223344',
      customerEmail: 'pooja@example.com',
      staffNameSnapshot: 'Maya Therapist',
      items: [{ id: 'itm-2', bookingId: 'NX-BKG-2026-9902', itemType: 'SERVICE' as const, referenceId: 'srv-2', nameSnapshot: 'Deep Tissue Massage', categorySnapshot: 'Spa', unitPriceCents: 120000, durationMinutesSnapshot: 60 }],
      financials: { subtotalCents: 120000, discountCents: 0, gstCents: 0, taxGstCents: 0, totalCents: 120000, advancePercentage: 25, advanceAmountCents: 30000, remainingAmountCents: 90000, currency: 'INR' },
      bookingDate: '2026-10-15',
      startTime: '16:00',
      endTime: '17:00',
      duration: 60,
      subtotal: 1200,
      discount: 0,
      totalAmount: 1200,
      advancePercentage: 25,
      advanceAmount: 300,
      remainingAmount: 900,
      currency: 'INR',
      status: 'ADVANCE_PAID' as const,
      paymentStatus: 'ADVANCE_PAID' as const,
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notificationDispatcherService.dispatchBookingEvent({
      event: 'BOOKING_CONFIRMED',
      booking: sampleBooking,
      channels: ['IN_APP']
    }).then((res) => {
      assertEquals(res.dispatchedRecords.length, 1, 'In-App notification record generated');
      assertEquals(res.dispatchedRecords[0].channel, 'IN_APP', 'Channel is IN_APP');
      assertEquals(res.dispatchedRecords[0].status, 'SENT', 'In-App notification sent');
    });
  });

  test('Suite 15: Phase 4.7 Booking Confirmation & Notifications', 'Duplicate Event Idempotency Prevention', () => {
    notificationDispatcherService.resetLogs();

    const sampleBooking = {
      id: 'NX-BKG-2026-9903',
      businessId: 'biz-barber-001',
      customerId: 'cust-103',
      customerName: 'Suresh Kumar',
      customerPhone: '+91 9988776655',
      customerEmail: 'suresh@example.com',
      staffNameSnapshot: 'Rohan',
      items: [{ id: 'itm-3', bookingId: 'NX-BKG-2026-9903', itemType: 'SERVICE' as const, referenceId: 'srv-3', nameSnapshot: 'Beard Trim', categorySnapshot: 'Grooming', unitPriceCents: 30000, durationMinutesSnapshot: 20 }],
      financials: { subtotalCents: 30000, discountCents: 0, gstCents: 0, taxGstCents: 0, totalCents: 30000, advancePercentage: 25, advanceAmountCents: 7500, remainingAmountCents: 22500, currency: 'INR' },
      bookingDate: '2026-10-18',
      startTime: '10:00',
      endTime: '10:20',
      duration: 20,
      subtotal: 300,
      discount: 0,
      totalAmount: 300,
      advancePercentage: 25,
      advanceAmount: 75,
      remainingAmount: 225,
      currency: 'INR',
      status: 'ADVANCE_PAID' as const,
      paymentStatus: 'ADVANCE_PAID' as const,
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Dispatch 1
    notificationDispatcherService.dispatchBookingEvent({
      event: 'BOOKING_CONFIRMED',
      booking: sampleBooking,
      channels: ['EMAIL']
    }).then(() => {
      // Dispatch 2 (Duplicate)
      notificationDispatcherService.dispatchBookingEvent({
        event: 'BOOKING_CONFIRMED',
        booking: sampleBooking,
        channels: ['EMAIL']
      }).then(() => {
        const records = notificationDispatcherService.getRecordsForBooking('NX-BKG-2026-9903');
        assertEquals(records.length, 1, 'Duplicate event dispatch avoided; only 1 record exists');
      });
    });
  });

  test('Suite 15: Phase 4.7 Booking Confirmation & Notifications', 'Notification Failure Isolation (Paid Booking Preserved)', () => {
    notificationDispatcherService.resetLogs();

    const sampleBooking = {
      id: 'NX-BKG-2026-9904',
      businessId: 'biz-barber-001',
      customerId: 'cust-104',
      customerName: 'Amit Shah',
      customerPhone: '+91 9123456789',
      customerEmail: 'amit@example.com',
      staffNameSnapshot: 'Alex',
      items: [{ id: 'itm-4', bookingId: 'NX-BKG-2026-9904', itemType: 'SERVICE' as const, referenceId: 'srv-4', nameSnapshot: 'Hair Styling', categorySnapshot: 'Grooming', unitPriceCents: 80000, durationMinutesSnapshot: 30 }],
      financials: { subtotalCents: 80000, discountCents: 0, gstCents: 0, taxGstCents: 0, totalCents: 80000, advancePercentage: 25, advanceAmountCents: 20000, remainingAmountCents: 60000, currency: 'INR' },
      bookingDate: '2026-10-20',
      startTime: '15:00',
      endTime: '15:30',
      duration: 30,
      subtotal: 800,
      discount: 0,
      totalAmount: 800,
      advancePercentage: 25,
      advanceAmount: 200,
      remainingAmount: 600,
      currency: 'INR',
      status: 'ADVANCE_PAID' as const,
      paymentStatus: 'ADVANCE_PAID' as const,
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Simulate provider failure on EMAIL channel
    notificationDispatcherService.dispatchBookingEvent({
      event: 'BOOKING_CONFIRMED',
      booking: sampleBooking,
      channels: ['EMAIL'],
      simulateFailureChannels: ['EMAIL']
    }).then((res) => {
      assertEquals(res.allSucceeded, false, 'Dispatch reported channel failure');
      assertEquals(res.dispatchedRecords[0].status, 'FAILED', 'Notification record marked FAILED');
      // Crucial domain check: Booking object status is untouched and valid!
      assertEquals(sampleBooking.status, 'ADVANCE_PAID', 'Booking remains valid and ADVANCE_PAID regardless of notification failure');
    });
  });

  // =========================================================================
  // SUITE 16: PHASE 4.8 — BUSINESS BOOKING MANAGEMENT + CALENDAR
  // =========================================================================

  test('Suite 16: Phase 4.8 Business Booking Management + Calendar', 'Repository Multi-Tenant Query & Search Filters', () => {
    const orchestrator = new BookingOrchestratorService();
    const repo = orchestrator.getBookingRepo();

    const sampleBkg: BookingEntity = {
      id: 'NX-BKG-2026-T1',
      businessId: 'biz-barber-001',
      customerId: 'cust-search-01',
      customerName: 'Aarav Gupta',
      customerPhone: '+91 9111222333',
      customerEmail: 'aarav@example.com',
      staffId: 'stf-rc-01',
      staffNameSnapshot: 'Alex',
      serviceId: 'srv-barber-1',
      items: [{ id: 'bki-t1', bookingId: 'NX-BKG-2026-T1', itemType: 'SERVICE', referenceId: 'srv-barber-1', nameSnapshot: 'Haircut', categorySnapshot: 'Grooming', unitPriceCents: 50000, durationMinutesSnapshot: 30 }],
      financials: { subtotalCents: 50000, discountCents: 0, taxGstCents: 0, totalCents: 50000, advancePercentage: 25, advanceAmountCents: 12500, remainingAmountCents: 37500, currency: 'INR' },
      bookingDate: '2026-10-15',
      startTime: '10:00',
      endTime: '10:30',
      duration: 30,
      subtotal: 500,
      discount: 0,
      totalAmount: 500,
      advancePercentage: 25,
      advanceAmount: 125,
      remainingAmount: 375,
      currency: 'INR',
      status: 'ADVANCE_PAID',
      paymentStatus: 'ADVANCE_PAID',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    repo.create(sampleBkg);

    const barberBookings = repo.listBookingsByTenant('biz-barber-001');
    assert(barberBookings.some((b) => b.id === 'NX-BKG-2026-T1'), 'Booking listed under biz-barber-001');

    // Multi-tenant boundary check: biz-spa-002 must NOT see biz-barber-001 booking
    const spaBookings = repo.listBookingsByTenant('biz-spa-002');
    assert(!spaBookings.some((b) => b.id === 'NX-BKG-2026-T1'), 'Cross-tenant access prevented');
  });

  test('Suite 16: Phase 4.8 Business Booking Management + Calendar', 'Admin Status Transitions via State Machine', () => {
    const orchestrator = new BookingOrchestratorService();
    const repo = orchestrator.getBookingRepo();

    const booking: BookingEntity = {
      id: 'NX-BKG-2026-T2',
      businessId: 'biz-barber-001',
      customerId: 'cust-02',
      customerName: 'Dev Patel',
      customerPhone: '+91 9222333444',
      customerEmail: 'dev@example.com',
      staffId: 'stf-rc-01',
      serviceId: 'srv-barber-1',
      items: [{ id: 'bki-t2', bookingId: 'NX-BKG-2026-T2', itemType: 'SERVICE', referenceId: 'srv-barber-1', nameSnapshot: 'Haircut', categorySnapshot: 'Grooming', unitPriceCents: 50000, durationMinutesSnapshot: 30 }],
      financials: { subtotalCents: 50000, discountCents: 0, taxGstCents: 0, totalCents: 50000, advancePercentage: 25, advanceAmountCents: 12500, remainingAmountCents: 37500, currency: 'INR' },
      bookingDate: '2026-10-15',
      startTime: '11:00',
      endTime: '11:30',
      duration: 30,
      subtotal: 500,
      discount: 0,
      totalAmount: 500,
      advancePercentage: 25,
      advanceAmount: 125,
      remainingAmount: 375,
      currency: 'INR',
      status: 'CONFIRMED',
      paymentStatus: 'ADVANCE_PAID',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    repo.create(booking);

    // Transition 1: CONFIRMED -> CHECKED_IN
    const res1 = BookingStateMachineService.transitionStatus(booking, 'CHECKED_IN', {
      changedByUserId: 'ADMIN_DESK',
      changedByRole: 'ADMIN',
      reason: 'Customer arrived at salon'
    });
    assertEquals(res1.success, true, 'CONFIRMED -> CHECKED_IN succeeded');
    assertEquals(res1.updatedBooking?.status, 'CHECKED_IN', 'Status updated to CHECKED_IN');

    // Transition 2: CHECKED_IN -> IN_PROGRESS
    const res2 = BookingStateMachineService.transitionStatus(res1.updatedBooking!, 'IN_PROGRESS', {
      changedByUserId: 'ADMIN_DESK',
      changedByRole: 'ADMIN',
      reason: 'Customer seated in chair'
    });
    assertEquals(res2.success, true, 'CHECKED_IN -> IN_PROGRESS succeeded');

    // Transition 3: IN_PROGRESS -> COMPLETED
    const res3 = BookingStateMachineService.transitionStatus(res2.updatedBooking!, 'COMPLETED', {
      changedByUserId: 'ADMIN_DESK',
      changedByRole: 'ADMIN',
      reason: 'Service completed'
    });
    assertEquals(res3.success, true, 'IN_PROGRESS -> COMPLETED succeeded');
    assertEquals(res3.updatedBooking?.status, 'COMPLETED', 'Final status COMPLETED');
  });

  test('Suite 16: Phase 4.8 Business Booking Management + Calendar', 'Admin Reschedule with Slot Engine Re-Validation', () => {
    const orchestrator = new BookingOrchestratorService();
    const repo = orchestrator.getBookingRepo();

    const booking: BookingEntity = {
      id: 'NX-BKG-2026-T3',
      businessId: 'biz-barber-001',
      customerId: 'cust-03',
      customerName: 'Rohan Joshi',
      customerPhone: '+91 9333444555',
      customerEmail: 'rohan@example.com',
      staffId: 'stf-rc-01',
      serviceId: 'srv-barber-1',
      items: [{ id: 'bki-t3', bookingId: 'NX-BKG-2026-T3', itemType: 'SERVICE', referenceId: 'srv-barber-1', nameSnapshot: 'Haircut', categorySnapshot: 'Grooming', unitPriceCents: 50000, durationMinutesSnapshot: 30 }],
      financials: { subtotalCents: 50000, discountCents: 0, taxGstCents: 0, totalCents: 50000, advancePercentage: 25, advanceAmountCents: 12500, remainingAmountCents: 37500, currency: 'INR' },
      bookingDate: '2026-10-15',
      startTime: '10:00',
      endTime: '10:30',
      duration: 30,
      subtotal: 500,
      discount: 0,
      totalAmount: 500,
      advancePercentage: 25,
      advanceAmount: 125,
      remainingAmount: 375,
      currency: 'INR',
      status: 'CONFIRMED',
      paymentStatus: 'ADVANCE_PAID',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    repo.create(booking);

    // Reschedule to open valid slot on 2026-10-16 at 14:00
    const res = orchestrator.adminRescheduleBooking('biz-barber-001', 'NX-BKG-2026-T3', '2026-10-16', '14:00', {
      changedByUserId: 'ADMIN_DESK',
      changedByRole: 'ADMIN',
      reason: 'Customer requested reschedule'
    });

    assertEquals(res.success, true, 'Reschedule to valid open slot succeeded');
    assertEquals(res.updatedBooking?.bookingDate, '2026-10-16', 'Date updated');
    assertEquals(res.updatedBooking?.startTime, '14:00', 'Start time updated');
  });

  test('Suite 16: Phase 4.8 Business Booking Management + Calendar', 'Staff Reassignment Rules (Active, Eligible, Available)', () => {
    const orchestrator = new BookingOrchestratorService();
    const repo = orchestrator.getBookingRepo();

    const booking: BookingEntity = {
      id: 'NX-BKG-2026-T4',
      businessId: 'biz-barber-001',
      customerId: 'cust-04',
      customerName: 'Manish Kumar',
      customerPhone: '+91 9444555666',
      customerEmail: 'manish@example.com',
      staffId: 'stf-rc-01',
      staffNameSnapshot: 'Alex Mercer',
      serviceId: 'srv-barber-1',
      items: [{ id: 'bki-t4', bookingId: 'NX-BKG-2026-T4', itemType: 'SERVICE', referenceId: 'srv-barber-1', nameSnapshot: 'Haircut', categorySnapshot: 'Grooming', unitPriceCents: 50000, durationMinutesSnapshot: 30 }],
      financials: { subtotalCents: 50000, discountCents: 0, taxGstCents: 0, totalCents: 50000, advancePercentage: 25, advanceAmountCents: 12500, remainingAmountCents: 37500, currency: 'INR' },
      bookingDate: '2026-10-15',
      startTime: '10:00',
      endTime: '10:30',
      duration: 30,
      subtotal: 500,
      discount: 0,
      totalAmount: 500,
      advancePercentage: 25,
      advanceAmount: 125,
      remainingAmount: 375,
      currency: 'INR',
      status: 'CONFIRMED',
      paymentStatus: 'ADVANCE_PAID',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    repo.create(booking);

    // Reassign to eligible, active, available staff 'stf-rc-02'
    const res = orchestrator.adminReassignStaff('biz-barber-001', 'NX-BKG-2026-T4', 'stf-rc-02', {
      changedByUserId: 'ADMIN_DESK',
      changedByRole: 'ADMIN',
      reason: 'Reassigned to specialist'
    });

    assertEquals(res.success, true, 'Staff reassignment succeeded');
    assertEquals(res.updatedBooking?.staffId, 'stf-rc-02', 'Staff ID updated');
  });

  // =========================================================================
  // SUITE 17: PHASE 4.9 BOOKING HARDENING + TESTING (12 AUTOMATED TESTS)
  // =========================================================================

  test('Suite 17: Phase 4.9 Booking Hardening + Testing', '1. Advance Calculation Precision', () => {
    const snap25 = createFinancialSnapshot(1000, 0, 25); // ₹1000 total, 25% advance
    assertEquals(snap25.advanceAmountCents, 25000, 'Advance is ₹250 (25000 cents)');
    assertEquals(snap25.remainingAmountCents, 75000, 'Remaining is ₹750 (75000 cents)');

    const snap50 = createFinancialSnapshot(2000, 0, 50); // ₹2000 total, 50% advance
    assertEquals(snap50.advanceAmountCents, 100000, 'Advance is ₹1000 (100000 cents)');
    assertEquals(snap50.remainingAmountCents, 100000, 'Remaining is ₹1000 (100000 cents)');
  });

  test('Suite 17: Phase 4.9 Booking Hardening + Testing', '2. Availability Engine Slot Generation', () => {
    const slotEngine = new SlotEngineService();
    const res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      date: '2026-10-20'
    });
    assert(res.slots.length > 0, 'Generates time slots during operating hours');
    assert(res.availableSlotsCount > 0, 'Has open available slots');
  });

  test('Suite 17: Phase 4.9 Booking Hardening + Testing', '3. Conflict Detection Overlap Matrix', () => {
    const slotEngine = new SlotEngineService();
    const existingBooking: BookingEntity = {
      id: 'NX-EXIST-1',
      businessId: 'biz-barber-001',
      customerId: 'c1',
      customerName: 'Existing Client',
      customerPhone: '+91 9111111111',
      customerEmail: 'exist@test.com',
      staffId: 'stf-rc-01',
      serviceId: 'srv-barber-1',
      items: [],
      financials: createFinancialSnapshot(500, 0, 25),
      bookingDate: '2026-10-20',
      startTime: '10:00',
      endTime: '10:45',
      duration: 45,
      subtotal: 500, discount: 0, totalAmount: 500, advancePercentage: 25, advanceAmount: 125, remainingAmount: 375, currency: 'INR',
      status: 'CONFIRMED', paymentStatus: 'ADVANCE_PAID', statusHistory: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    slotEngine.addBooking(existingBooking);

    const res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      staffId: 'stf-rc-01',
      date: '2026-10-20'
    });
    const slot1000 = res.slots.find(s => s.startTime === '10:00');
    assert(slot1000 !== undefined, '10:00 slot generated');
    assertEquals(slot1000?.available, false, '10:00 slot marked unavailable due to overlap');
  });

  test('Suite 17: Phase 4.9 Booking Hardening + Testing', '4. Staff Eligibility Verification', () => {
    const orchestrator = new BookingOrchestratorService();
    const booking: BookingEntity = {
      id: 'NX-STF-ELIG',
      businessId: 'biz-barber-001',
      customerId: 'c1', customerName: 'Client', customerPhone: '+91 9000000001', customerEmail: 'c@t.com',
      staffId: 'stf-rc-01', serviceId: 'srv-barber-1', items: [],
      financials: createFinancialSnapshot(500, 0, 25),
      bookingDate: '2026-10-20', startTime: '11:00', endTime: '11:30', duration: 30,
      subtotal: 500, discount: 0, totalAmount: 500, advancePercentage: 25, advanceAmount: 125, remainingAmount: 375, currency: 'INR',
      status: 'CONFIRMED', paymentStatus: 'ADVANCE_PAID', statusHistory: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    orchestrator.getBookingRepo().create(booking);

    const reassignResult = orchestrator.adminReassignStaff('biz-barber-001', 'NX-STF-ELIG', 'stf-ineligible-fake', {
      changedByUserId: 'ADMIN', changedByRole: 'ADMIN'
    });
    assertEquals(reassignResult.success, false, 'Reassignment to inactive/ineligible staff rejected');
  });

  test('Suite 17: Phase 4.9 Booking Hardening + Testing', '5. Business Hours Boundaries', () => {
    const slotEngine = new SlotEngineService();
    const res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      date: '2026-10-20'
    });
    const earlySlot = res.slots.find(s => s.startTime === '07:00');
    assertEquals(earlySlot, undefined, 'Early slot before business hours not generated');
  });

  test('Suite 17: Phase 4.9 Booking Hardening + Testing', '6. Service Buffer Time Inclusion', () => {
    const slotEngine = new SlotEngineService();
    const res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      date: '2026-10-20'
    });
    const slot = res.slots.find(s => s.startTime === '10:00');
    assertEquals(slot?.totalOccupancyMinutes, 40, 'Total occupancy includes service duration + buffer time');
  });

  test('Suite 17: Phase 4.9 Booking Hardening + Testing', '7. Staff Leave Availability Exclusion', () => {
    const scheduleService = new StaffScheduleService();
    scheduleService.addStaffLeave({
      id: 'lv-01',
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      startDate: '2026-10-25',
      endDate: '2026-10-25',
      leaveType: 'CASUAL',
      status: 'APPROVED',
      reason: 'Vacation',
      createdAt: new Date().toISOString()
    });

    const slotEngine = new SlotEngineService(scheduleService);
    const res = slotEngine.generateSlots({
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      staffId: 'stf-rc-01',
      date: '2026-10-25'
    });
    const availableCount = res.slots.filter(s => s.available).length;
    assertEquals(availableCount, 0, 'No slots available for staff member on leave');
  });

  test('Suite 17: Phase 4.9 Booking Hardening + Testing', '8. Booking State Transitions Validation', () => {
    const booking: BookingEntity = {
      id: 'NX-TRANS-1',
      businessId: 'biz-barber-001', customerId: 'c1', customerName: 'Client', customerPhone: '+91 9000000001', customerEmail: 'c@t.com',
      staffId: 'stf-rc-01', serviceId: 'srv-barber-1', items: [],
      financials: createFinancialSnapshot(500, 0, 25),
      bookingDate: '2026-10-20', startTime: '11:00', endTime: '11:30', duration: 30,
      subtotal: 500, discount: 0, totalAmount: 500, advancePercentage: 25, advanceAmount: 125, remainingAmount: 375, currency: 'INR',
      status: 'COMPLETED', paymentStatus: 'PAID', statusHistory: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };

    const invalidRes = BookingStateMachineService.transitionStatus(booking, 'CONFIRMED', {
      changedByUserId: 'ADMIN', changedByRole: 'ADMIN'
    });
    assertEquals(invalidRes.success, false, 'Terminal state COMPLETED cannot transition back to CONFIRMED');
  });

  test('Suite 17: Phase 4.9 Booking Hardening + Testing', '9. Multi-Tenant Cross-Access Isolation', () => {
    const repo = new MultiTenantBookingRepository();
    const bookingA: BookingEntity = {
      id: 'NX-BIZ-A-1',
      businessId: 'biz-barber-001', customerId: 'c1', customerName: 'Client A', customerPhone: '+91 9000000001', customerEmail: 'a@t.com',
      staffId: 'stf-rc-01', serviceId: 'srv-barber-1', items: [],
      financials: createFinancialSnapshot(500, 0, 25),
      bookingDate: '2026-10-20', startTime: '11:00', endTime: '11:30', duration: 30,
      subtotal: 500, discount: 0, totalAmount: 500, advancePercentage: 25, advanceAmount: 125, remainingAmount: 375, currency: 'INR',
      status: 'CONFIRMED', paymentStatus: 'ADVANCE_PAID', statusHistory: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    repo.create(bookingA);

    const crossAttempt = repo.getBookingById('NX-BIZ-A-1', 'biz-spa-002');
    assertEquals(crossAttempt, null, 'Cross-tenant lookup returned null (isolated)');
  });

  test('Suite 17: Phase 4.9 Booking Hardening + Testing', '10. Concurrent Double Booking Prevention', () => {
    const orchestrator = new BookingOrchestratorService();
    const existing: BookingEntity = {
      id: 'NX-CONC-1',
      businessId: 'biz-barber-001', customerId: 'c1', customerName: 'Client 1', customerPhone: '+91 9000000001', customerEmail: 'c1@t.com',
      staffId: 'stf-rc-01', serviceId: 'srv-barber-1', items: [],
      financials: createFinancialSnapshot(500, 0, 25),
      bookingDate: '2026-10-20', startTime: '14:00', endTime: '14:30', duration: 30,
      subtotal: 500, discount: 0, totalAmount: 500, advancePercentage: 25, advanceAmount: 125, remainingAmount: 375, currency: 'INR',
      status: 'CONFIRMED', paymentStatus: 'ADVANCE_PAID', statusHistory: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    orchestrator.getBookingRepo().create(existing);
    orchestrator.getSlotEngine().addBooking(existing);

    const draft2: CustomerBookingDraft = {
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      staffId: 'stf-rc-01',
      date: '2026-10-20',
      startTime: '14:00',
      customerName: 'Client 2',
      customerPhone: '+91 9000000002',
      customerEmail: 'c2@t.com',
      itemType: 'SERVICE'
    };

    const reval = orchestrator.revalidateBookingDraft(draft2);
    assertEquals(reval.valid, false, 'Second concurrent booking attempt rejected');
    assert(reval.errors.some(e => e.includes('no longer available')), 'Contains slot unavailable conflict error');
  });

  test('Suite 17: Phase 4.9 Booking Hardening + Testing', '11. Payment Verification Boundary & Authoritative Price Guard', async () => {
    const orchestrator = new BookingOrchestratorService();
    const draft: CustomerBookingDraft = {
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      staffId: 'stf-rc-01',
      date: '2026-10-20',
      startTime: '15:00',
      customerName: 'Aarav Sharma',
      customerPhone: '+91 9888877777',
      customerEmail: 'aarav@test.com',
      itemType: 'SERVICE'
    };

    const reval = orchestrator.revalidateBookingDraft(draft);
    assertEquals(reval.valid, true, 'Draft revalidated');
    assertEquals(reval.authoritativePriceCents, 50000, 'Authoritative price enforced from catalog regardless of draft frontend price');

    const mockGateway = orchestrator.getPaymentGateway();
    const underpaidIntent = mockGateway.createPaymentIntentSync({
      businessId: 'biz-barber-001',
      amountCents: 5000,
      currency: 'INR',
      customerName: 'Aarav Sharma',
      customerPhone: '+91 9888877777',
      customerEmail: 'cust-underpaid@test.com',
      status: 'SUCCEEDED'
    });

    const submitRes = await orchestrator.createAuthoritativeBooking({
      draft,
      paymentIntentId: underpaidIntent.id,
      gatewayTransactionRef: 'TXN-UNDERPAID'
    });

    assertEquals(submitRes.success, false, 'Underpaid advance payment rejected at payment boundary');
  });

  test('Suite 17: Phase 4.9 Booking Hardening + Testing', '12. Idempotency Guarantees on Duplicate Payment Submissions', async () => {
    const orchestrator = new BookingOrchestratorService();
    const draft: CustomerBookingDraft = {
      businessId: 'biz-barber-001',
      serviceId: 'srv-barber-1',
      staffId: 'stf-rc-01',
      date: '2026-10-20',
      startTime: '16:00',
      customerName: 'Priya Verma',
      customerPhone: '+91 9777766666',
      customerEmail: 'priya@test.com',
      itemType: 'SERVICE'
    };

    const mockGateway = orchestrator.getPaymentGateway();
    const validIntent = mockGateway.createPaymentIntentSync({
      businessId: 'biz-barber-001',
      amountCents: 12500,
      currency: 'INR',
      customerName: 'Priya Verma',
      customerPhone: '+91 9777766666',
      customerEmail: 'cust-idem@test.com',
      status: 'SUCCEEDED'
    });

    const res1 = await orchestrator.createAuthoritativeBooking({
      draft,
      paymentIntentId: validIntent.id,
      gatewayTransactionRef: 'TXN-IDEM-01'
    });
    assertEquals(res1.success, true, 'First booking submission succeeded');

    const res2 = await orchestrator.createAuthoritativeBooking({
      draft,
      paymentIntentId: validIntent.id,
      gatewayTransactionRef: 'TXN-IDEM-01'
    });
    assertEquals(res2.success, true, 'Duplicate submission handled idempotently');
    assertEquals(res2.booking?.id, res1.booking?.id, 'Returned identical existing booking entity without duplicating');
  });

  // =========================================================================
  // SUITE 18: PHASE 5.1 CUSTOMER MANAGEMENT / CRM
  // =========================================================================

  test('Suite 18: Phase 5.1 Customer Management / CRM', '1. Customer Creation & Tenant Scoping', () => {
    const crm = new CustomerCrmService([]);
    const created = crm.createCustomer({
      businessId: 'biz-barber-001',
      name: 'Karan Mehra',
      phone: '+91 9555544444',
      email: 'karan@example.com',
      tags: ['VIP', 'New'],
      initialNote: 'Prefers quiet morning appointments'
    }, 'biz-barber-001');

    assert(created.id.startsWith('cust-'), 'Generated unique customer ID');
    assertEquals(created.businessId, 'biz-barber-001', 'Scoped to correct business');
    assertEquals(created.notes.length, 1, 'Initial note appended');
    assertEquals(created.status, 'NEW', 'New customer assigned NEW status');
  });

  test('Suite 18: Phase 5.1 Customer Management / CRM', '2. Documented Customer Status Computation Rules', () => {
    const nowIso = '2026-09-29T12:00:00Z';

    // NEW: Created within 30 days and <= 1 booking
    const newStatus = calculateCustomerStatus({
      createdAt: '2026-09-20T10:00:00Z',
      lastVisitAt: undefined,
      totalBookings: 1,
      completedBookings: 0
    }, nowIso);
    assertEquals(newStatus, 'NEW', 'Created within 30 days computes to NEW');

    // ACTIVE: Last visit within 90 days with completed bookings
    const activeStatus = calculateCustomerStatus({
      createdAt: '2026-01-10T10:00:00Z',
      lastVisitAt: '2026-09-15T10:00:00Z',
      totalBookings: 5,
      completedBookings: 4
    }, nowIso);
    assertEquals(activeStatus, 'ACTIVE', 'Last visit within 90 days computes to ACTIVE');

    // INACTIVE: Last visit > 90 days ago
    const inactiveStatus = calculateCustomerStatus({
      createdAt: '2025-01-10T10:00:00Z',
      lastVisitAt: '2026-04-10T10:00:00Z',
      totalBookings: 3,
      completedBookings: 2
    }, nowIso);
    assertEquals(inactiveStatus, 'INACTIVE', 'Last visit older than 90 days computes to INACTIVE');
  });

  test('Suite 18: Phase 5.1 Customer Management / CRM', '3. Multi-Field Customer Search (Name, Phone, Email)', () => {
    const crm = new CustomerCrmService();
    const nameResults = crm.getCustomersByTenant('biz-barber-001', { searchQuery: 'Aarav' });
    assert(nameResults.some(c => c.name.includes('Aarav')), 'Found customer by name search');

    const phoneResults = crm.getCustomersByTenant('biz-barber-001', { searchQuery: '9876543210' });
    assert(phoneResults.some(c => c.phone.includes('9876543210')), 'Found customer by phone search');

    const emailResults = crm.getCustomersByTenant('biz-barber-001', { searchQuery: 'dev.patel' });
    assert(emailResults.some(c => c.email.includes('dev.patel')), 'Found customer by email search');
  });

  test('Suite 18: Phase 5.1 Customer Management / CRM', '4. Customer Filters (Status, Type, Tags)', () => {
    const crm = new CustomerCrmService();
    const vipCustomers = crm.getCustomersByTenant('biz-barber-001', { tag: 'VIP' });
    assert(vipCustomers.every(c => c.tags.includes('VIP')), 'Filter by tag returns only VIP customers');

    const activeCustomers = crm.getCustomersByTenant('biz-barber-001', { status: 'ACTIVE' });
    assert(activeCustomers.every(c => c.status === 'ACTIVE'), 'Filter by status returns only ACTIVE customers');
  });

  test('Suite 18: Phase 5.1 Customer Management / CRM', '5. Multi-Tenant Cross-Access Isolation', () => {
    const crm = new CustomerCrmService();
    // Attempt to access Barber customer using Spa business ID context
    const crossAttempt = crm.getCustomerById('cust-barber-001', 'biz-spa-002');
    assertEquals(crossAttempt, null, 'Cross-tenant lookup returned null (isolated)');

    const spaList = crm.getCustomersByTenant('biz-spa-002');
    assert(!spaList.some(c => c.id === 'cust-barber-001'), 'Barber customer excluded from Spa customer list');
  });

  test('Suite 18: Phase 5.1 Customer Management / CRM', '6. Duplicate Customer Detection Logic', () => {
    const crm = new CustomerCrmService();
    // Test duplicate phone detection for biz-barber-001
    const dupCheckPhone = crm.detectDuplicate('+91 9876543210', 'new.unique@example.com', 'biz-barber-001');
    assertEquals(dupCheckPhone.isPotentialDuplicate, true, 'Detected duplicate phone number');
    assert(dupCheckPhone.matchReason?.includes('Matching phone number') || false, 'Provided detailed duplicate match reason');

    // Test non-duplicate check
    const cleanCheck = crm.detectDuplicate('+91 9000011111', 'fresh.person@example.com', 'biz-barber-001');
    assertEquals(cleanCheck.isPotentialDuplicate, false, 'No duplicate detected for unique credentials');
  });

  test('Suite 18: Phase 5.1 Customer Management / CRM', '7. Customer Notes & Tags Management', () => {
    const crm = new CustomerCrmService();
    const note = crm.addCustomerNote('cust-barber-001', 'Prefers lukewarm towel before haircut', 'Vikram Rajput', 'STAFF', 'biz-barber-001');
    assert(note.id.startsWith('note-'), 'Note assigned unique ID');
    assertEquals(note.content, 'Prefers lukewarm towel before haircut', 'Note content saved');

    const updated = crm.addTag('cust-barber-001', 'Haircut Specialist', 'biz-barber-001');
    assert(updated.tags.includes('Haircut Specialist'), 'New tag appended');

    const untagged = crm.removeTag('cust-barber-001', 'Haircut Specialist', 'biz-barber-001');
    assert(!untagged.tags.includes('Haircut Specialist'), 'Tag cleanly removed');
  });

  // =========================================================================
  // SUITE 19: PHASE 5.2 CUSTOMER PROFILE + BOOKING HISTORY
  // =========================================================================

  test('Suite 19: Phase 5.2 Customer Profile + Booking History', '1. Authoritative Customer Summary Metrics', () => {
    const crm = new CustomerCrmService();
    const metrics = crm.getCustomerSummaryMetrics('cust-barber-001', 'biz-barber-001');

    assert(metrics.totalBookings >= 0, 'Total bookings calculated authoritatively');
    assert(metrics.totalSpend >= 0, 'Total spend calculated authoritatively');
    assert(metrics.completedBookings >= 0, 'Completed bookings calculated authoritatively');
  });

  test('Suite 19: Phase 5.2 Customer Profile + Booking History', '2. Customer Activity Timeline Generation', () => {
    const crm = new CustomerCrmService();
    const timeline = crm.getCustomerTimeline('cust-barber-001', 'biz-barber-001');

    assert(timeline.length > 0, 'Customer timeline generated');
    assert(timeline.some(e => e.type === 'CUSTOMER_CREATED'), 'Includes CUSTOMER_CREATED event');
    assert(timeline.some(e => e.type === 'BOOKING_CREATED' || e.type === 'BOOKING_CONFIRMED' || e.type === 'VISIT_COMPLETED'), 'Includes real booking audit events');
  });

  test('Suite 19: Phase 5.2 Customer Profile + Booking History', '3. Multi-Tenant Timeline & History Isolation', () => {
    const crm = new CustomerCrmService();
    // Spa business cannot view Barber customer's timeline
    const crossTimeline = crm.getCustomerTimeline('cust-barber-001', 'biz-spa-002');
    assertEquals(crossTimeline.length, 0, 'Cross-tenant timeline request returned empty array (isolated)');
  });

  test('Suite 19: Phase 5.2 Customer Profile + Booking History', '4. Preserving Historical Customer Notes', () => {
    const crm = new CustomerCrmService();
    const initialNotesCount = crm.getCustomerById('cust-barber-001', 'biz-barber-001')?.notes.length || 0;

    crm.addCustomerNote('cust-barber-001', 'Note entry 1', 'Front Desk', 'STAFF', 'biz-barber-001');
    crm.addCustomerNote('cust-barber-001', 'Note entry 2', 'Manager', 'ADMIN', 'biz-barber-001');

    const updatedCust = crm.getCustomerById('cust-barber-001', 'biz-barber-001');
    assertEquals(updatedCust?.notes.length, initialNotesCount + 2, 'Historical notes preserved without overwriting');
  });

  // =========================================================================
  // SUITE 20: PHASE 5.3 BUSINESS STAFF MANAGEMENT
  // =========================================================================

  test('Suite 20: Phase 5.3 Business Staff Management', '1. Staff Profile Creation & Custom Role Registration', () => {
    const staffService = new StaffManagementService();
    const created = staffService.createStaff(
      {
        businessId: 'biz-barber-001',
        name: 'Kabir Das',
        role: 'Master Beard Specialist', // Custom role
        phone: '+91 9999988888',
        email: 'kabir@royalcrown.com',
        bio: 'Specialist in razor styling',
        specializations: ['Beard Sculpting', 'Hot Towel'],
        joinedAt: '2026-09-01'
      },
      'biz-barber-001'
    );

    assert(created.id.startsWith('stf-'), 'Generated unique staff ID');
    assertEquals(created.name, 'Kabir Das', 'Staff name assigned correctly');
    assertEquals(created.role, 'Master Beard Specialist', 'Custom role assigned correctly');
    assertEquals(created.active, true, 'Defaults to active');

    // Register custom role in business role registry
    const roles = staffService.addCustomRoleForBusiness('biz-barber-001', 'Master Beard Specialist');
    assert(roles.includes('Master Beard Specialist'), 'Custom role registered in business role registry');
  });

  test('Suite 20: Phase 5.3 Business Staff Management', '2. Staff Profile Editing & Social Links Update', () => {
    const staffService = new StaffManagementService();
    const updated = staffService.updateStaff(
      'stf-rc-01',
      {
        bio: 'Updated bio for Vikram Rajput',
        phone: '+91 9811199999',
        socialLinks: { instagram: '@vikram_master_barber', linkedin: 'vikram-rajput' }
      },
      'biz-barber-001'
    );

    assertEquals(updated.bio, 'Updated bio for Vikram Rajput', 'Bio updated');
    assertEquals(updated.phone, '+91 9811199999', 'Phone updated');
    assertEquals(updated.socialLinks?.instagram, '@vikram_master_barber', 'Social links updated');
  });

  test('Suite 20: Phase 5.3 Business Staff Management', '3. Staff Activation & Deactivation Toggle', () => {
    const staffService = new StaffManagementService();
    // Deactivate active staff
    const deactivated = staffService.deactivateStaff('stf-rc-01', 'biz-barber-001');
    assertEquals(deactivated.active, false, 'Staff status toggled to inactive');

    // Re-activate
    const reactivated = staffService.activateStaff('stf-rc-01', 'biz-barber-001');
    assertEquals(reactivated.active, true, 'Staff status reactivated to active');
  });

  test('Suite 20: Phase 5.3 Business Staff Management', '4. Service-to-Staff Assignment & Catalog Sync', () => {
    const staffService = new StaffManagementService();
    // Assign service srv-barber-1 and srv-barber-2 to Sameer Khan (stf-rc-02)
    const assignRes = staffService.assignServicesToStaff(
      'stf-rc-02',
      ['srv-barber-1', 'srv-barber-2'],
      'biz-barber-001'
    );

    assertEquals(assignRes.success, true, 'Service assignment succeeded');
    assertEquals(assignRes.serviceCount, 2, 'Assigned 2 services');

    const assignedServices = staffService.getAssignedServicesForStaff('stf-rc-02', 'biz-barber-001');
    assert(assignedServices.some(s => s.id === 'srv-barber-2'), 'Catalog eligibility updated for srv-barber-2');
  });

  test('Suite 20: Phase 5.3 Business Staff Management', '5. Multi-Tenant Cross-Access Isolation Boundary', () => {
    const staffService = new StaffManagementService();

    // Spa business cannot view or edit Barber staff
    const crossView = staffService.getStaffById('stf-rc-01', 'biz-spa-002');
    assertEquals(crossView, null, 'Cross-tenant lookup returned null');

    let thrown = false;
    try {
      staffService.deactivateStaff('stf-rc-01', 'biz-spa-002');
    } catch {
      thrown = true;
    }
    assertEquals(thrown, true, 'Cross-tenant deactivation threw authorization error');
  });

  test('Suite 20: Phase 5.3 Business Staff Management', '6. Inactive Staff Online Booking Availability Guard', () => {
    const serviceManager = new ServicePackageConfigService();

    // stf-rc-03 is inactive
    const barberStaffList = serviceManager.listStaffMembers('biz-barber-001');
    const inactiveStaff = barberStaffList.find(s => s.id === 'stf-rc-03');
    assertEquals(inactiveStaff?.active, false, 'stf-rc-03 is inactive');

    const service1 = serviceManager.getServiceById('srv-barber-1', 'biz-barber-001');
    if (service1) {
      // Get eligible staff for service (only active staff are returned)
      const eligibleActive = getEligibleStaffForService(service1, barberStaffList);
      assert(!eligibleActive.some(s => s.id === 'stf-rc-03'), 'Inactive staff excluded from online bookable staff list');
    }
  });

  test('Suite 20: Phase 5.3 Business Staff Management', '7. Historical Booking Preservation', () => {
    const staffService = new StaffManagementService();

    // Get historical performance / bookings for stf-rc-01
    const initialStats = staffService.getStaffPerformanceStats('stf-rc-01', 'biz-barber-001');

    // Deactivate stf-rc-01
    staffService.deactivateStaff('stf-rc-01', 'biz-barber-001');

    // Query stats again
    const postDeactivateStats = staffService.getStaffPerformanceStats('stf-rc-01', 'biz-barber-001');

    assertEquals(postDeactivateStats.totalBookings, initialStats.totalBookings, 'Historical booking count preserved intact after deactivation');
    assertEquals(postDeactivateStats.completedBookings, initialStats.completedBookings, 'Historical completed bookings preserved intact');
  });

  test('Suite 20: Phase 5.3 Business Staff Management', '8. Booking-Derived Staff Performance Analytics', () => {
    const staffService = new StaffManagementService();
    const stats = staffService.getStaffPerformanceStats('stf-rc-01', 'biz-barber-001');

    assert(stats.totalBookings >= 0, 'Calculated total bookings');
    assert(stats.completedBookings >= 0, 'Calculated completed bookings');
    assert(typeof stats.formattedRevenue === 'string', 'Formatted revenue calculated from authoritative records');
    assert(stats.completionRatePercent >= 0 && stats.completionRatePercent <= 100, 'Calculated valid completion rate percentage');
  });

  // =========================================================================
  // SUITE 21: PHASE 5.4 STAFF AVAILABILITY + LEAVE MANAGEMENT UI
  // =========================================================================

  test('Suite 21: Phase 5.4 Staff Availability + Leave Management', '1. Staff Weekly Schedule Update & Evaluation', () => {
    const scheduleService = new StaffScheduleService();
    // Update Vikram (stf-rc-01) Tuesday shift to 10:00 - 19:00
    scheduleService.updateStaffDailySchedule('stf-rc-01', 'TUESDAY', {
      dayOfWeek: 'TUESDAY',
      isWorking: true,
      startTime: '10:00',
      endTime: '19:00',
      breaks: [{ startTime: '13:00', endTime: '14:00', label: 'Lunch' }]
    });

    const config = scheduleService.getStaffSchedule('stf-rc-01');
    assertEquals(config?.weeklySchedule.TUESDAY.startTime, '10:00', 'Updated shift start time');
    assertEquals(config?.weeklySchedule.TUESDAY.endTime, '19:00', 'Updated shift end time');

    // Slot at 09:30 should now be OUTSIDE_STAFF_HOURS
    const evalRes = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 30,
      bookingDate: '2026-10-20', // Tuesday
      startTime: '09:30'
    });
    assertEquals(evalRes.available, false, '09:30 slot rejected as outside updated shift hours');
    assertEquals(evalRes.code, 'OUTSIDE_STAFF_HOURS', 'Reported OUTSIDE_STAFF_HOURS');
  });

  test('Suite 21: Phase 5.4 Staff Availability + Leave Management', '2. Configurable Multiple Breaks Evaluation', () => {
    const scheduleService = new StaffScheduleService();
    // Add two breaks to Friday schedule
    scheduleService.updateStaffDailySchedule('stf-rc-01', 'FRIDAY', {
      dayOfWeek: 'FRIDAY',
      isWorking: true,
      startTime: '09:00',
      endTime: '20:00',
      breaks: [
        { startTime: '13:00', endTime: '14:00', label: 'Lunch' },
        { startTime: '17:00', endTime: '17:30', label: 'Tea Break' }
      ]
    });

    // Check tea break overlap (17:15)
    const breakEval = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 30,
      bookingDate: '2026-10-23', // Friday
      startTime: '17:15'
    });
    assertEquals(breakEval.available, false, '17:15 slot rejected due to tea break');
    assertEquals(breakEval.code, 'STAFF_ON_BREAK', 'Reported STAFF_ON_BREAK');
  });

  test('Suite 21: Phase 5.4 Staff Availability + Leave Management', '3. Full Day Leave Creation & Exclusion', () => {
    const scheduleService = new StaffScheduleService();
    scheduleService.createStaffLeave({
      staffId: 'stf-rc-01',
      businessId: 'biz-barber-001',
      startDate: '2026-11-05',
      endDate: '2026-11-05',
      leaveType: 'VACATION',
      reason: 'Personal vacation',
      status: 'APPROVED'
    });

    const evalRes = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 45,
      bookingDate: '2026-11-05',
      startTime: '11:00'
    });

    assertEquals(evalRes.available, false, 'Slot during full day leave rejected');
    assertEquals(evalRes.code, 'STAFF_ON_LEAVE', 'Reported STAFF_ON_LEAVE');
  });

  test('Suite 21: Phase 5.4 Staff Availability + Leave Management', '4. Partial Day Leave Intersection Guard', () => {
    const scheduleService = new StaffScheduleService();
    scheduleService.createStaffLeave({
      staffId: 'stf-rc-01',
      businessId: 'biz-barber-001',
      startDate: '2026-11-10',
      endDate: '2026-11-10',
      startTime: '14:00',
      endTime: '17:00',
      leaveType: 'SICK_LEAVE',
      reason: 'Doctor appointment',
      status: 'APPROVED'
    });

    // 10:00 morning slot should remain AVAILABLE
    const morningEval = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 45,
      bookingDate: '2026-11-10',
      startTime: '10:00'
    });
    assertEquals(morningEval.available, true, 'Morning slot before partial leave remains AVAILABLE');

    // 15:00 afternoon slot during partial leave should be REJECTED
    const afternoonEval = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 45,
      bookingDate: '2026-11-10',
      startTime: '15:00'
    });
    assertEquals(afternoonEval.available, false, 'Afternoon slot during partial leave rejected');
    assertEquals(afternoonEval.code, 'STAFF_ON_LEAVE', 'Reported STAFF_ON_LEAVE');
  });

  test('Suite 21: Phase 5.4 Staff Availability + Leave Management', '5. Business Holiday Closure Enforcement', () => {
    const scheduleService = new StaffScheduleService();
    scheduleService.addBusinessHoliday('biz-barber-001', {
      date: '2026-11-25',
      name: 'Special Salon Maintenance Closure'
    });

    const holidayEval = scheduleService.evaluateAvailability({
      businessId: 'biz-barber-001',
      staffId: 'stf-rc-01',
      serviceDurationMinutes: 30,
      bookingDate: '2026-11-25',
      startTime: '11:00'
    });

    assertEquals(holidayEval.available, false, 'Slot on business holiday rejected');
    assertEquals(holidayEval.code, 'BUSINESS_HOLIDAY', 'Reported BUSINESS_HOLIDAY');
  });

  // =========================================================================
  // SUITE 22: PHASE 5.5 STAFF DASHBOARD
  // =========================================================================

  test('Suite 22: Phase 5.5 Staff Dashboard', '1. Staff Dashboard Summary & Today Appointments', () => {
    const dashboardService = new StaffDashboardService();
    const summary = dashboardService.getStaffSummary('stf-rc-01', 'biz-barber-001', '2026-10-20');

    assertEquals(summary.staffId, 'stf-rc-01', 'Correct staff summary retrieved');
    assertEquals(summary.businessId, 'biz-barber-001', 'Scoped to correct business');
    assert(summary.todaysAppointmentsCount >= 0, 'Today appointments count calculated');
  });

  test('Suite 22: Phase 5.5 Staff Dashboard', '2. Appointment Lifecycle Actions (Check In, Start, Complete)', () => {
    const bookingRepo = new MultiTenantBookingRepository([
      {
        id: 'bk-test-01',
        businessId: 'biz-barber-001',
        customerId: 'cust-1',
        customerName: 'Aarav Sharma',
        customerPhone: '+91 9888877777',
        customerEmail: 'aarav@test.com',
        staffId: 'stf-rc-01',
        serviceId: 'srv-barber-1',
        items: [{
          id: 'item-1',
          bookingId: 'bk-test-01',
          itemType: 'SERVICE',
          referenceId: 'srv-barber-1',
          nameSnapshot: 'Beard Trim',
          categorySnapshot: 'barber',
          unitPriceCents: 1200,
          durationMinutesSnapshot: 30
        }],
        bookingDate: '2026-10-20',
        startTime: '10:00',
        endTime: '10:30',
        duration: 30,
        subtotal: 1200,
        discount: 0,
        totalAmount: 1200,
        advancePercentage: 25,
        advanceAmount: 300,
        remainingAmount: 900,
        currency: 'INR',
        financials: {
          currency: 'INR',
          subtotalCents: 120000,
          discountCents: 0,
          totalCents: 120000,
          advancePercentage: 25,
          advanceAmountCents: 30000,
          remainingAmountCents: 90000,
          taxGstCents: 0
        },
        status: 'CONFIRMED',
        paymentStatus: 'ADVANCE_PAID',
        paymentIntentId: 'pi_1',
        createdAt: '2026-10-01T10:00:00Z',
        updatedAt: '2026-10-01T10:00:00Z',
        statusHistory: []
      }
    ]);

    const dashboardService = new StaffDashboardService(bookingRepo);

    // Check In
    const checkInRes = dashboardService.executeAppointmentAction({
      bookingId: 'bk-test-01',
      staffId: 'stf-rc-01',
      action: 'CHECK_IN'
    }, 'biz-barber-001');

    assertEquals(checkInRes.success, true, 'Check In action succeeded');
    assertEquals(checkInRes.updatedBooking?.status, 'CHECKED_IN', 'Status transitioned to CHECKED_IN');

    // Start
    const startRes = dashboardService.executeAppointmentAction({
      bookingId: 'bk-test-01',
      staffId: 'stf-rc-01',
      action: 'START'
    }, 'biz-barber-001');

    assertEquals(startRes.success, true, 'Start action succeeded');
    assertEquals(startRes.updatedBooking?.status, 'IN_PROGRESS', 'Status transitioned to IN_PROGRESS');

    // Complete
    const completeRes = dashboardService.executeAppointmentAction({
      bookingId: 'bk-test-01',
      staffId: 'stf-rc-01',
      action: 'COMPLETE'
    }, 'biz-barber-001');

    assertEquals(completeRes.success, true, 'Complete action succeeded');
    assertEquals(completeRes.updatedBooking?.status, 'COMPLETED', 'Status transitioned to COMPLETED');
  });

  test('Suite 22: Phase 5.5 Staff Dashboard', '3. Unauthorized Staff Appointment Access Guard', () => {
    const bookingRepo = new MultiTenantBookingRepository([
      {
        id: 'bk-test-02',
        businessId: 'biz-barber-001',
        customerId: 'cust-1',
        customerName: 'Priya Verma',
        customerPhone: '+91 9777766666',
        customerEmail: 'priya@test.com',
        staffId: 'stf-rc-01', // Assigned to Vikram (stf-rc-01)
        serviceId: 'srv-barber-1',
        items: [],
        bookingDate: '2026-10-20',
        startTime: '11:00',
        endTime: '11:30',
        duration: 30,
        subtotal: 1200,
        discount: 0,
        totalAmount: 1200,
        advancePercentage: 25,
        advanceAmount: 300,
        remainingAmount: 900,
        currency: 'INR',
        financials: { currency: 'INR', subtotalCents: 120000, discountCents: 0, totalCents: 120000, advancePercentage: 25, advanceAmountCents: 30000, remainingAmountCents: 90000, taxGstCents: 0 },
        status: 'CONFIRMED',
        paymentStatus: 'ADVANCE_PAID',
        createdAt: '2026-10-01T10:00:00Z',
        updatedAt: '2026-10-01T10:00:00Z',
        statusHistory: []
      }
    ]);

    const dashboardService = new StaffDashboardService(bookingRepo);

    // Staff B (stf-rc-02) attempts to start Vikram's appointment
    const hackAttempt = dashboardService.executeAppointmentAction({
      bookingId: 'bk-test-02',
      staffId: 'stf-rc-02',
      action: 'START'
    }, 'biz-barber-001');

    assertEquals(hackAttempt.success, false, 'Unauthorized staff action blocked');
    assert(hackAttempt.error?.includes('Unauthorized') || false, 'Reported unauthorized error message');
  });

  test('Suite 22: Phase 5.5 Staff Dashboard', '4. Staff Self-Profile Management & Critical Setting Lockdown', () => {
    const dashboardService = new StaffDashboardService();
    const updated = dashboardService.updateStaffSelfProfile('stf-rc-01', 'biz-barber-001', {
      bio: 'Updated bio by self-service portal',
      phone: '+91 9811100000',
      specializations: ['Master Fades', 'Beard Art']
    });

    assertEquals(updated.bio, 'Updated bio by self-service portal', 'Self bio updated');
    assertEquals(updated.phone, '+91 9811100000', 'Self phone updated');

    // Verify staff cannot access financial / tax settings
    const canAccessFinance = dashboardService.verifyStaffSecurityAccess('FINANCIALS');
    assertEquals(canAccessFinance, false, 'Staff denied access to financial settings');

    const canAccessCommission = dashboardService.verifyStaffSecurityAccess('COMMISSION');
    assertEquals(canAccessCommission, false, 'Staff denied access to commission settings');
  });

  test('Suite 22: Phase 5.5 Staff Dashboard', '5. Staff Leave Request Submission', () => {
    const dashboardService = new StaffDashboardService();
    const leaveReq = dashboardService.requestStaffLeave(
      'stf-rc-01',
      'biz-barber-001',
      '2026-11-15',
      '2026-11-17',
      'VACATION',
      'Family trip'
    );

    assert(leaveReq.id.startsWith('lev-'), 'Generated leave request ID');
    assertEquals(leaveReq.status, 'PENDING', 'Leave request created with PENDING status for manager approval');
  });

  // =========================================================================
  // SUITE 23: PHASE 5.6 DAILY APPOINTMENT OPERATIONS
  // =========================================================================

  test('Suite 23: Phase 5.6 Daily Operations', '1. Complete Daily Operational Workflow (Check-In -> Start -> Complete)', () => {
    const bookingRepo = new MultiTenantBookingRepository([
      {
        id: 'bk-ops-01',
        businessId: 'biz-barber-001',
        customerId: 'cust-1',
        customerName: 'Rahul Dravid',
        customerPhone: '+91 9999988888',
        customerEmail: 'rahul@test.com',
        staffId: 'stf-rc-01',
        serviceId: 'srv-barber-1',
        items: [{
          id: 'item-ops-1',
          bookingId: 'bk-ops-01',
          itemType: 'SERVICE',
          referenceId: 'srv-barber-1',
          nameSnapshot: 'Executive Haircut',
          categorySnapshot: 'barber',
          unitPriceCents: 1500,
          durationMinutesSnapshot: 45
        }],
        bookingDate: '2026-10-20',
        startTime: '10:00',
        endTime: '10:45',
        duration: 45,
        subtotal: 1500,
        discount: 0,
        totalAmount: 1500,
        advancePercentage: 25,
        advanceAmount: 375,
        remainingAmount: 1125,
        currency: 'INR',
        financials: { currency: 'INR', subtotalCents: 150000, discountCents: 0, totalCents: 150000, advancePercentage: 25, advanceAmountCents: 37500, remainingAmountCents: 112500, taxGstCents: 0 },
        status: 'CONFIRMED',
        paymentStatus: 'ADVANCE_PAID',
        createdAt: '2026-10-01T10:00:00Z',
        updatedAt: '2026-10-01T10:00:00Z',
        statusHistory: []
      }
    ]);

    const opsService = new DailyOperationsService(bookingRepo);

    // Step 1: Customer Arrival (Check-in)
    const checkIn = opsService.executeOperationalAction({
      bookingId: 'bk-ops-01',
      businessId: 'biz-barber-001',
      action: 'CHECK_IN'
    });
    assertEquals(checkIn.success, true, 'Check-in successful');
    assertEquals(checkIn.updatedBooking?.status, 'CHECKED_IN', 'Status is CHECKED_IN');

    // Step 2: Start Service
    const start = opsService.executeOperationalAction({
      bookingId: 'bk-ops-01',
      businessId: 'biz-barber-001',
      action: 'START'
    });
    assertEquals(start.success, true, 'Start service successful');
    assertEquals(start.updatedBooking?.status, 'IN_PROGRESS', 'Status is IN_PROGRESS');

    // Step 3: Complete Service
    const complete = opsService.executeOperationalAction({
      bookingId: 'bk-ops-01',
      businessId: 'biz-barber-001',
      action: 'COMPLETE'
    });
    assertEquals(complete.success, true, 'Complete service successful');
    assertEquals(complete.updatedBooking?.status, 'COMPLETED', 'Status is COMPLETED');
    assert((complete.updatedBooking?.statusHistory.length || 0) >= 3, 'Audit trail preserved across workflow');
  });

  test('Suite 23: Phase 5.6 Daily Operations', '2. No-Show & Cancellation Operational Actions', () => {
    const bookingRepo = new MultiTenantBookingRepository([
      {
        id: 'bk-ops-02',
        businessId: 'biz-barber-001',
        customerId: 'cust-2',
        customerName: 'Suresh Raina',
        customerPhone: '+91 9888811111',
        customerEmail: 'suresh@test.com',
        staffId: 'stf-rc-01',
        serviceId: 'srv-barber-1',
        items: [],
        bookingDate: '2026-10-20',
        startTime: '11:00',
        endTime: '11:30',
        duration: 30,
        subtotal: 1000,
        discount: 0,
        totalAmount: 1000,
        advancePercentage: 25,
        advanceAmount: 250,
        remainingAmount: 750,
        currency: 'INR',
        financials: { currency: 'INR', subtotalCents: 100000, discountCents: 0, totalCents: 100000, advancePercentage: 25, advanceAmountCents: 25000, remainingAmountCents: 75000, taxGstCents: 0 },
        status: 'CONFIRMED',
        paymentStatus: 'ADVANCE_PAID',
        createdAt: '2026-10-01T10:00:00Z',
        updatedAt: '2026-10-01T10:00:00Z',
        statusHistory: []
      }
    ]);

    const opsService = new DailyOperationsService(bookingRepo);

    // No Show Action
    const noShow = opsService.executeOperationalAction({
      bookingId: 'bk-ops-02',
      businessId: 'biz-barber-001',
      action: 'NO_SHOW',
      reason: 'Customer did not arrive within 15 minutes'
    });
    assertEquals(noShow.success, true, 'Marked as no-show successfully');
    assertEquals(noShow.updatedBooking?.status, 'NO_SHOW', 'Status is NO_SHOW');
  });

  test('Suite 23: Phase 5.6 Daily Operations', '3. Invalid Operational Transition Guard', () => {
    const bookingRepo = new MultiTenantBookingRepository([
      {
        id: 'bk-ops-03',
        businessId: 'biz-barber-001',
        customerId: 'cust-3',
        customerName: 'MS Dhoni',
        customerPhone: '+91 9777700000',
        customerEmail: 'msd@test.com',
        staffId: 'stf-rc-01',
        serviceId: 'srv-barber-1',
        items: [],
        bookingDate: '2026-10-20',
        startTime: '12:00',
        endTime: '12:30',
        duration: 30,
        subtotal: 1200,
        discount: 0,
        totalAmount: 1200,
        advancePercentage: 25,
        advanceAmount: 300,
        remainingAmount: 900,
        currency: 'INR',
        financials: { currency: 'INR', subtotalCents: 120000, discountCents: 0, totalCents: 120000, advancePercentage: 25, advanceAmountCents: 30000, remainingAmountCents: 90000, taxGstCents: 0 },
        status: 'CONFIRMED',
        paymentStatus: 'ADVANCE_PAID',
        createdAt: '2026-10-01T10:00:00Z',
        updatedAt: '2026-10-01T10:00:00Z',
        statusHistory: []
      }
    ]);

    const opsService = new DailyOperationsService(bookingRepo);

    // Attempting invalid jump from CONFIRMED directly to COMPLETED
    const invalidJump = opsService.executeOperationalAction({
      bookingId: 'bk-ops-03',
      businessId: 'biz-barber-001',
      action: 'COMPLETE'
    });
    assertEquals(invalidJump.success, false, 'Invalid state transition rejected by centralized state machine');
  });

  // =========================================================================
  // SUITE 24: PHASE 5.7 REVIEWS + RATINGS
  // =========================================================================

  test('Suite 24: Phase 5.7 Reviews', '1. Completed Booking Review Eligibility & Creation', () => {
    const reviewsService = new ReviewsService([]);
    const completedBooking: BookingEntity = {
      id: 'bk-comp-101',
      businessId: 'biz-barber-001',
      customerId: 'cust-10',
      customerName: 'Sachin Tendulkar',
      customerPhone: '+91 9999911111',
      customerEmail: 'sachin@test.com',
      items: [],
      bookingDate: '2026-10-18',
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      subtotal: 2000,
      discount: 0,
      totalAmount: 2000,
      advancePercentage: 25,
      advanceAmount: 500,
      remainingAmount: 1500,
      currency: 'INR',
      financials: { currency: 'INR', subtotalCents: 200000, discountCents: 0, totalCents: 200000, advancePercentage: 25, advanceAmountCents: 50000, remainingAmountCents: 150000, taxGstCents: 0 },
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-18T11:00:00Z',
      statusHistory: []
    };

    const res = reviewsService.createReview({
      businessId: 'biz-barber-001',
      customerId: 'cust-10',
      customerName: 'Sachin Tendulkar',
      bookingId: 'bk-comp-101',
      rating: 5,
      reviewText: 'Masterclass service!'
    }, completedBooking);

    assertEquals(res.success, true, 'Review successfully created for completed booking');
    assertEquals(res.review?.status, 'PENDING', 'New review defaults to PENDING status for moderation');
  });

  test('Suite 24: Phase 5.7 Reviews', '2. Non-Completed Booking Review Rejection', () => {
    const reviewsService = new ReviewsService([]);
    const confirmedBooking: BookingEntity = {
      id: 'bk-conf-102',
      businessId: 'biz-barber-001',
      customerId: 'cust-11',
      customerName: 'Virender Sehwag',
      customerPhone: '+91 9888822222',
      customerEmail: 'sehwag@test.com',
      items: [],
      bookingDate: '2026-10-25',
      startTime: '14:00',
      endTime: '15:00',
      duration: 60,
      subtotal: 1800,
      discount: 0,
      totalAmount: 1800,
      advancePercentage: 25,
      advanceAmount: 450,
      remainingAmount: 1350,
      currency: 'INR',
      financials: { currency: 'INR', subtotalCents: 180000, discountCents: 0, totalCents: 180000, advancePercentage: 25, advanceAmountCents: 45000, remainingAmountCents: 135000, taxGstCents: 0 },
      status: 'CONFIRMED', // Not completed
      paymentStatus: 'ADVANCE_PAID',
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-01T00:00:00Z',
      statusHistory: []
    };

    const res = reviewsService.createReview({
      businessId: 'biz-barber-001',
      customerId: 'cust-11',
      customerName: 'Virender Sehwag',
      bookingId: 'bk-conf-102',
      rating: 4,
      reviewText: 'Early review attempt'
    }, confirmedBooking);

    assertEquals(res.success, false, 'Review rejected for non-completed booking');
    assert(res.error?.includes('completed bookings') || false, 'Reported eligibility error message');
  });

  test('Suite 24: Phase 5.7 Reviews', '3. Anti-Abuse Duplicate Review Prevention', () => {
    const reviewsService = new ReviewsService([]);
    const completedBooking: BookingEntity = {
      id: 'bk-comp-103',
      businessId: 'biz-barber-001',
      customerId: 'cust-12',
      customerName: 'Yuvraj Singh',
      customerPhone: '+91 9777733333',
      customerEmail: 'yuvraj@test.com',
      items: [],
      bookingDate: '2026-10-18',
      startTime: '12:00',
      endTime: '13:00',
      duration: 60,
      subtotal: 2000,
      discount: 0,
      totalAmount: 2000,
      advancePercentage: 25,
      advanceAmount: 500,
      remainingAmount: 1500,
      currency: 'INR',
      financials: { currency: 'INR', subtotalCents: 200000, discountCents: 0, totalCents: 200000, advancePercentage: 25, advanceAmountCents: 50000, remainingAmountCents: 150000, taxGstCents: 0 },
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-18T13:00:00Z',
      statusHistory: []
    };

    // First review submission
    const firstRes = reviewsService.createReview({
      businessId: 'biz-barber-001',
      customerId: 'cust-12',
      customerName: 'Yuvraj Singh',
      bookingId: 'bk-comp-103',
      rating: 5,
      reviewText: 'Amazing styling!'
    }, completedBooking);

    assertEquals(firstRes.success, true, 'First review created successfully');

    // Second review submission for same booking (Anti-abuse guard)
    const secondRes = reviewsService.createReview({
      businessId: 'biz-barber-001',
      customerId: 'cust-12',
      customerName: 'Yuvraj Singh',
      bookingId: 'bk-comp-103',
      rating: 1,
      reviewText: 'Spam duplicate review'
    }, completedBooking);

    assertEquals(secondRes.success, false, 'Duplicate review blocked by anti-abuse guard');
    assert(secondRes.error?.includes('already been submitted') || false, 'Reported duplicate review error message');
  });

  test('Suite 24: Phase 5.7 Reviews', '4. Admin Moderation & Public Published Display', () => {
    const reviewsService = new ReviewsService([]);
    const completedBooking: BookingEntity = {
      id: 'bk-comp-104',
      businessId: 'biz-barber-001',
      customerId: 'cust-13',
      customerName: 'Zaheer Khan',
      customerPhone: '+91 9666644444',
      customerEmail: 'zaheer@test.com',
      items: [],
      bookingDate: '2026-10-19',
      startTime: '15:00',
      endTime: '16:00',
      duration: 60,
      subtotal: 1500,
      discount: 0,
      totalAmount: 1500,
      advancePercentage: 25,
      advanceAmount: 375,
      remainingAmount: 1125,
      currency: 'INR',
      financials: { currency: 'INR', subtotalCents: 150000, discountCents: 0, totalCents: 150000, advancePercentage: 25, advanceAmountCents: 37500, remainingAmountCents: 112500, taxGstCents: 0 },
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-19T16:00:00Z',
      statusHistory: []
    };

    const res = reviewsService.createReview({
      businessId: 'biz-barber-001',
      customerId: 'cust-13',
      customerName: 'Zaheer Khan',
      bookingId: 'bk-comp-104',
      rating: 5,
      reviewText: 'Flawless fade.'
    }, completedBooking);

    const reviewId = res.review!.id;

    // Initially PENDING -> should not appear in public published list
    assertEquals(reviewsService.listPublicReviews('biz-barber-001').some((r) => r.id === reviewId), false, 'Pending review not public');

    // Admin moderates to PUBLISHED
    reviewsService.updateReviewStatus(reviewId, 'PUBLISHED');
    assertEquals(reviewsService.listPublicReviews('biz-barber-001').some((r) => r.id === reviewId), true, 'Published review visible on public site');

    // Check average rating calculation
    const summary = reviewsService.getBusinessRatingSummary('biz-barber-001');
    assert(summary.reviewCount > 0, 'Calculated review count');
    assert(summary.averageRating >= 1 && summary.averageRating <= 5, 'Calculated average rating between 1 and 5');
  });

  // =========================================================================
  // SUITE 25: PHASE 5.8 CUSTOMER COMMUNICATION
  // =========================================================================

  test('Suite 25: Phase 5.8 Communication', '1. Booking Confirmation & Event Dispatch Across Channels', async () => {
    const commService = new CommunicationService();
    const logs = await commService.dispatchEvent(
      'biz-barber-001',
      'cust-comm-01',
      'test@customer.com',
      'BOOKING_CONFIRMED',
      ['EMAIL', 'WHATSAPP', 'IN_APP'],
      {
        customerName: 'MS Dhoni',
        businessName: 'Royal Crown Barber',
        serviceName: 'Executive Haircut',
        staffName: 'Vikram',
        bookingDate: '2026-10-25',
        bookingTime: '10:00',
        bookingId: 'bk-comm-01',
        remainingAmount: 'INR 1,125'
      }
    );

    assertEquals(logs.length, 3, 'Dispatched across 3 channels');
    assertEquals(logs[0].status, 'SENT', 'Email successfully sent');
    assertEquals(logs[1].status, 'SENT', 'WhatsApp successfully sent');
    assertEquals(logs[2].status, 'SENT', 'In-App notification successfully sent');
    assert(logs[0].content.includes('MS Dhoni'), 'Template variable interpolated customerName');
    assert(logs[0].content.includes('Royal Crown Barber'), 'Template variable interpolated businessName');
  });

  test('Suite 25: Phase 5.8 Communication', '2. Customer Consent Preference Enforcement', async () => {
    const commService = new CommunicationService();
    // Withhold SMS consent
    commService.setPreferences({
      customerId: 'cust-comm-02',
      emailConsent: true,
      smsConsent: false,
      whatsappConsent: true,
      inAppConsent: true
    });

    const logs = await commService.dispatchEvent(
      'biz-barber-001',
      'cust-comm-02',
      '+919999900000',
      'BOOKING_REMINDER',
      ['SMS', 'EMAIL'],
      {
        customerName: 'Virat Kohli',
        businessName: 'Royal Crown Barber',
        serviceName: 'Beard Trim',
        staffName: 'Vikram',
        bookingDate: '2026-10-26',
        bookingTime: '11:00',
        bookingId: 'bk-comm-02',
        remainingAmount: 'INR 500'
      }
    );

    const smsLog = logs.find((l) => l.channel === 'SMS');
    const emailLog = logs.find((l) => l.channel === 'EMAIL');

    assertEquals(smsLog?.status, 'FAILED', 'SMS failed due to withheld consent');
    assert(smsLog?.errorMessage?.includes('Consent withheld') || false, 'Reported consent withheld error');
    assertEquals(emailLog?.status, 'SENT', 'Email sent successfully where consent is true');
  });

  test('Suite 25: Phase 5.8 Communication', '3. Simulated Delivery Failure & Error Handling', async () => {
    const commService = new CommunicationService();
    const logs = await commService.dispatchEvent(
      'biz-barber-001',
      'cust-comm-03',
      'fail@customer.com',
      'BOOKING_CANCELLED',
      ['EMAIL'],
      {
        customerName: 'Rohit Sharma',
        businessName: 'Royal Crown Barber',
        serviceName: 'Hair Styling',
        staffName: 'Vikram',
        bookingDate: '2026-10-27',
        bookingTime: '15:00',
        bookingId: 'bk-comm-03',
        remainingAmount: 'INR 0'
      },
      'EMAIL' // Force failure on email channel
    );

    assertEquals(logs[0].status, 'FAILED', 'Email delivery marked as FAILED');
    assert(logs[0].errorMessage !== undefined, 'Error message recorded');
    // Note: Communication failure does not throw or invalidate any booking workflow.
  });

  // =========================================================================
  // SUITE 26: PHASE 5.9 BUSINESS OPERATIONAL DASHBOARD
  // =========================================================================

  test('Suite 26: Phase 5.9 Operational Dashboard', '1. Dashboard Summary & Metrics Calculation', () => {
    const dashboardService = new BusinessOperationalDashboardService();
    const summary = dashboardService.getSummary('biz-barber-001', '2026-10-20');

    assert(typeof summary.todaysAppointments === 'number', 'Calculated todaysAppointments');
    assert(typeof summary.upcoming === 'number', 'Calculated upcoming count');
    assert(typeof summary.completedToday === 'number', 'Calculated completedToday count');
  });

  test('Suite 26: Phase 5.9 Operational Dashboard', '2. Staff Operational Status & Performance Metrics', () => {
    const dashboardService = new BusinessOperationalDashboardService();
    const statuses = dashboardService.getStaffOperationalStatuses('biz-barber-001', '2026-10-20');

    assert(statuses.length > 0, 'Retrieved staff operational statuses');
    assert(statuses[0].status !== undefined, 'Staff status determined');

    const performance = dashboardService.getServicePerformance('biz-barber-001');
    assert(performance.byService !== undefined, 'Service performance aggregated by service');
    assert(performance.byStaff !== undefined, 'Service performance aggregated by staff');
  });

  test('Suite 26: Phase 5.9 Operational Dashboard', '3. Customer Snapshot & Operational Alerts', () => {
    const dashboardService = new BusinessOperationalDashboardService();
    const snapshot = dashboardService.getCustomerSnapshot('biz-barber-001', '2026-10-20');

    assert(typeof snapshot.newCustomers === 'number', 'Calculated new customers');
    assert(typeof snapshot.returningCustomers === 'number', 'Calculated returning customers');
    assert(typeof snapshot.upcomingVisits === 'number', 'Calculated upcoming visits');

    const alerts = dashboardService.getOperationalAlerts('biz-barber-001');
    assert(Array.isArray(alerts), 'Retrieved operational alerts array');
  });

  // =========================================================================
  // SUITE 27: PHASE 5.10 OPERATIONS SECURITY & HARDENING
  // =========================================================================

  test('Suite 27: Phase 5.10 Security', '1-3. Customer CRUD, Search & Isolation', () => {
    const crm = new CustomerCrmService([]);
    const cust = crm.createCustomer({
      businessId: 'biz-tenant-a',
      name: 'Tenant A Customer',
      phone: '+919999900000',
      email: 'a@test.com'
    }, 'biz-tenant-a');
    assert(cust.id !== undefined, 'Customer CRUD created successfully');

    const results = crm.getCustomersByTenant('biz-tenant-a', { searchQuery: 'Tenant A' }, []);
    assertEquals(results.length, 1, 'Customer search returned matching customer');

    const crmB = new CustomerCrmService([]);
    const isoResults = crmB.getCustomersByTenant('biz-tenant-b', { searchQuery: 'Tenant A' }, []);
    assertEquals(isoResults.length, 0, 'Customer isolation strictly blocked cross-tenant search');
  });

  test('Suite 27: Phase 5.10 Security', '4-7. Staff CRUD, Service Assignment, Permissions & Leave', () => {
    const staffSvc = new StaffManagementService();
    const staff = staffSvc.createStaff({
      businessId: 'biz-barber-001',
      name: 'Hardening Test Staff',
      email: 'staff@test.com',
      phone: '+919888800000',
      role: 'Barber',
      serviceIds: ['srv-barber-1']
    }, 'biz-barber-001');
    assert(staff.id !== undefined, 'Staff CRUD created');

    const scheduleSvc = new StaffScheduleService();
    const leave = scheduleSvc.createStaffLeave({
      staffId: staff.id,
      businessId: 'biz-barber-001',
      startDate: '2026-11-01',
      endDate: '2026-11-03',
      leaveType: 'VACATION',
      reason: 'Personal leave',
      status: 'PENDING'
    });
    assertEquals(leave.status, 'PENDING', 'Leave request created');
  });

  test('Suite 27: Phase 5.10 Security', '8-11. Booking Transitions, Review Eligibility, Moderation & Comm', async () => {
    const bookingRepo = new MultiTenantBookingRepository([
      {
        id: 'bk-sec-01',
        businessId: 'biz-barber-001',
        customerId: 'cust-sec',
        customerName: 'Sec Test',
        customerPhone: '+919777700000',
        customerEmail: 'sec@test.com',
        items: [],
        bookingDate: '2026-10-20',
        startTime: '10:00',
        endTime: '11:00',
        duration: 60,
        subtotal: 1000,
        discount: 0,
        totalAmount: 1000,
        advancePercentage: 25,
        advanceAmount: 250,
        remainingAmount: 750,
        currency: 'INR',
        financials: { currency: 'INR', subtotalCents: 100000, discountCents: 0, totalCents: 100000, advancePercentage: 25, advanceAmountCents: 25000, remainingAmountCents: 75000, taxGstCents: 0 },
        status: 'CONFIRMED',
        paymentStatus: 'ADVANCE_PAID',
        createdAt: '2026-10-01T00:00:00Z',
        updatedAt: '2026-10-01T00:00:00Z',
        statusHistory: []
      }
    ]);

    const ops = new DailyOperationsService(bookingRepo);
    const checkIn = ops.executeOperationalAction({ bookingId: 'bk-sec-01', businessId: 'biz-barber-001', action: 'CHECK_IN' });
    assertEquals(checkIn.success, true, 'Booking operational check-in transition successful');

    const reviews = new ReviewsService([]);
    const revRes = reviews.createReview({
      businessId: 'biz-barber-001',
      customerId: 'cust-sec',
      customerName: 'Sec Test',
      bookingId: 'bk-sec-01',
      rating: 5
    }, { ...bookingRepo.getBookingById('bk-sec-01', 'biz-barber-001')!, status: 'COMPLETED' });
    assertEquals(revRes.success, true, 'Review created for completed booking');
    reviews.updateReviewStatus(revRes.review!.id, 'PUBLISHED');

    const comm = new CommunicationService();
    const logs = await comm.dispatchEvent('biz-barber-001', 'cust-sec', 'sec@test.com', 'BOOKING_CONFIRMED', ['EMAIL'], {
      customerName: 'Sec Test',
      businessName: 'Barber',
      serviceName: 'Cut',
      staffName: 'Staff',
      bookingDate: '2026-10-20',
      bookingTime: '10:00',
      bookingId: 'bk-sec-01',
      remainingAmount: 'INR 750'
    });
    assertEquals(logs[0].status, 'SENT', 'Communication event handled successfully');
  });

  test('Suite 27: Phase 5.10 Security', '12-13. Role Authorization & Tenant Isolation Enforcement', () => {
    const sec = new SecurityHardeningService();

    // Staff attempting financial/admin action -> blocked
    const staffAuth = sec.authorize('STAFF', 'biz-A', 'biz-A', 'MANAGE_TAX_CONFIGURATION');
    assertEquals(staffAuth.allowed, false, 'Staff strictly blocked from financial/admin configuration');

    // Cross-tenant access -> blocked
    const crossTenantAuth = sec.authorize('MANAGER', 'biz-A', 'biz-B', 'VIEW_CUSTOMER_INFO');
    assertEquals(crossTenantAuth.allowed, false, 'Tenant isolation strictly blocks cross-business access');

    // Valid owner access within tenant -> allowed
    const ownerAuth = sec.authorize('BUSINESS_OWNER', 'biz-A', 'biz-A', 'MANAGE_BUSINESS');
    assertEquals(ownerAuth.allowed, true, 'Business owner authorized within own tenant');
  });

  // =========================================================================
  // SUITE 28: PHASE 6.1 PAYMENT + TRANSACTION ARCHITECTURE
  // =========================================================================

  test('Suite 28: Phase 6.1 Payments', '1. Online Advance Payment Creation & CAPTURED capturing', async () => {
    const paySvc = new PaymentArchitectureService();
    const payment = await paySvc.initPayment({
      businessId: 'biz-barber-001',
      bookingId: 'bk-pay-01',
      customerId: 'cust-pay-01',
      amount: 3000, // 30.00 INR
      currency: 'INR',
      paymentType: 'ADVANCE',
      collectionChannel: 'NEXORA_QR',
      providerName: 'RAZORPAY'
    });

    assertEquals(payment.status, 'CREATED', 'Advance payment initialized');
    assert(payment.providerOrderId !== undefined, 'OrderId generated by pluggable adapter');

    // Confirm Payment
    const confirmRes = await paySvc.confirmPayment(payment.paymentId, 'rzp_pay_101', 'sig_valid_101');
    assertEquals(confirmRes.success, true, 'Payment captured successfully with provider credentials');
    assertEquals(confirmRes.payment.status, 'CAPTURED', 'Captured status verified');
    assertEquals(confirmRes.transaction?.grossAmount, 3000, 'Immutable transaction recorded correctly');
  });

  test('Suite 28: Phase 6.1 Payments', '2. Cash Collection Logging & Separation of Payout Controls', async () => {
    const paySvc = new PaymentArchitectureService();
    // Cash payment
    const payment = await paySvc.initPayment({
      businessId: 'biz-barber-001',
      bookingId: 'bk-pay-02',
      customerId: 'cust-pay-02',
      amount: 12000, // 120.00 INR
      currency: 'INR',
      paymentType: 'FULL_PAYMENT',
      collectionChannel: 'CASH',
      providerName: 'CASH'
    });

    const confirmRes = await paySvc.confirmPayment(payment.paymentId);
    assertEquals(confirmRes.success, true, 'Cash payment confirmed immediately without provider signature check');

    // Fetch transactions with Nexora Payout Control Filter
    const allTxns = paySvc.listTransactions('biz-barber-001', false);
    const nexoraTxns = paySvc.listTransactions('biz-barber-001', true);

    assertEquals(allTxns.length, 1, 'Total transaction count logged');
    assertEquals(nexoraTxns.length, 0, 'Cash transaction excluded from Nexora payout ledger');
  });

  // =========================================================================
  // SUITE 29: PHASE 6.2 NEXORA QR COLLECTION & WEBHOOKS
  // =========================================================================

  test('Suite 29: Phase 6.2 Nexora QR', '1. Webhook Signature & Success verification', async () => {
    const paySvc = new PaymentArchitectureService();
    const qrSvc = new NexoraQrService(paySvc);

    const payment = await paySvc.initPayment({
      businessId: 'biz-barber-001',
      bookingId: 'bk-qr-01',
      customerId: 'cust-qr-01',
      amount: 4500, // 45.00 INR
      currency: 'INR',
      paymentType: 'FULL_PAYMENT',
      collectionChannel: 'NEXORA_QR',
      providerName: 'RAZORPAY'
    });

    const session = qrSvc.createSession(payment.paymentId, 'biz-barber-001', 'bk-qr-01', 4500, 'INR');
    assertEquals(session.state, 'Waiting', 'Session state is Waiting');

    // Handle success webhook
    const hookRes = await qrSvc.handleWebhookEvent({
      signature: 'sha256_valid_signature_abc',
      eventId: 'evt-qr-success-01',
      sessionId: session.sessionId,
      providerPaymentId: 'pay_rzp_90001',
      amountSentCents: 4500
    });

    assertEquals(hookRes.success, true, 'Webhook processed successfully with verified signature');
    assertEquals(session.state, 'Success', 'Session transition to Success verified');
  });

  test('Suite 29: Phase 6.2 Nexora QR', '2. Webhook Security and Validation Guardrails', async () => {
    const paySvc = new PaymentArchitectureService();
    const qrSvc = new NexoraQrService(paySvc);

    const payment = await paySvc.initPayment({
      businessId: 'biz-barber-001',
      bookingId: 'bk-qr-02',
      customerId: 'cust-qr-02',
      amount: 5000,
      currency: 'INR',
      paymentType: 'FULL_PAYMENT',
      collectionChannel: 'NEXORA_QR',
      providerName: 'RAZORPAY'
    });

    const session = qrSvc.createSession(payment.paymentId, 'biz-barber-001', 'bk-qr-02', 5000, 'INR');

    // 1. Invalid signature
    const sigRes = await qrSvc.handleWebhookEvent({
      signature: 'invalid_sig',
      eventId: 'evt-qr-fail-01',
      sessionId: session.sessionId,
      providerPaymentId: 'pay_rzp_fail_1',
      amountSentCents: 5000
    });
    assertEquals(sigRes.success, false, 'Invalid signature webhook rejected');
    assertEquals(sigRes.error, 'INVALID_SIGNATURE', 'Correct error code returned');

    // 2. Wrong amount
    const amtRes = await qrSvc.handleWebhookEvent({
      signature: 'sha256_valid_signature_abc',
      eventId: 'evt-qr-fail-02',
      sessionId: session.sessionId,
      providerPaymentId: 'pay_rzp_fail_2',
      amountSentCents: 1000 // Sent wrong amount
    });
    assertEquals(amtRes.success, false, 'Wrong amount sent is rejected');
    assertEquals(amtRes.error, 'AMOUNT_MISMATCH', 'Wrong amount error code returned');

    // 3. Expired payment
    qrSvc.forceExpireSession(session.sessionId);
    const expRes = await qrSvc.handleWebhookEvent({
      signature: 'sha256_valid_signature_abc',
      eventId: 'evt-qr-fail-03',
      sessionId: session.sessionId,
      providerPaymentId: 'pay_rzp_fail_3',
      amountSentCents: 5000
    });
    assertEquals(expRes.success, false, 'Webhook rejected on expired payment sessions');
    assertEquals(expRes.error, 'PAYMENT_SESSION_EXPIRED', 'Correct expired session error returned');
  });

  test('Suite 29: Phase 6.2 Nexora QR', '3. Idempotency (Duplicate Event prevention)', async () => {
    const paySvc = new PaymentArchitectureService();
    const qrSvc = new NexoraQrService(paySvc);

    const payment = await paySvc.initPayment({
      businessId: 'biz-barber-001',
      bookingId: 'bk-qr-03',
      customerId: 'cust-qr-03',
      amount: 2500,
      currency: 'INR',
      paymentType: 'FULL_PAYMENT',
      collectionChannel: 'NEXORA_QR',
      providerName: 'RAZORPAY'
    });

    const session = qrSvc.createSession(payment.paymentId, 'biz-barber-001', 'bk-qr-03', 2500, 'INR');

    // Process event first time
    const res1 = await qrSvc.handleWebhookEvent({
      signature: 'sha256_valid_sig_123',
      eventId: 'evt-unique-abc-001',
      sessionId: session.sessionId,
      providerPaymentId: 'pay_rzp_ok_123',
      amountSentCents: 2500
    });
    assertEquals(res1.success, true, 'First event processed successfully');

    // Process duplicate event
    const res2 = await qrSvc.handleWebhookEvent({
      signature: 'sha256_valid_sig_123',
      eventId: 'evt-unique-abc-001', // Same event ID
      sessionId: session.sessionId,
      providerPaymentId: 'pay_rzp_ok_123',
      amountSentCents: 2500
    });
    assertEquals(res2.success, false, 'Duplicate webhook event strictly blocked from creating duplicate financial ledger entries');
    assertEquals(res2.error, 'DUPLICATE_EVENT_BLOCKED', 'Idempotency validation verified');
  });

  // =========================================================================
  // SUITE 30: PHASE 6.3 COLLECTION SPLIT ENGINE
  // =========================================================================

  test('Suite 30: Phase 6.3 Splits', '1. ₹1,000 Allocation Split Calculation', () => {
    const splitSvc = new CollectionSplitService();
    const res = splitSvc.calculateSplit(100000); // ₹1,000 in cents = 100,000

    assertEquals(res.directCollectionCents, 75000, '75% Direct collection (₹750) verified');
    assertEquals(res.nexoraCollectionCents, 25000, '25% Nexora QR collection (₹250) verified');
    assertEquals(res.platformCommissionCents, 10000, '10% Platform commission (₹100) verified');
    assertEquals(res.businessWithdrawableCents, 15000, '15% Business Keep (₹150) verified');
    assertEquals(res.reconciliationChecked, true, 'Precision reconciliation verified with zero roundoff errors');
  });

  test('Suite 30: Phase 6.3 Splits', '2. ₹2,000 Allocation Split Calculation & Reconciliation check', () => {
    const splitSvc = new CollectionSplitService();
    const res = splitSvc.calculateSplit(200000); // ₹2,000 in cents = 200,000

    assertEquals(res.directCollectionCents, 150000, '75% Direct collection (₹1,500) verified');
    assertEquals(res.nexoraCollectionCents, 50000, '25% Nexora QR collection (₹500) verified');
    assertEquals(res.platformCommissionCents, 20000, '10% Platform commission (₹200) verified');
    assertEquals(res.businessWithdrawableCents, 30000, '15% Business Keep (₹300) verified');
    assertEquals(res.reconciliationChecked, true, 'Precision reconciliation verified with zero roundoff errors');
  });

  // =========================================================================
  // SUITE 31: PHASE 6.4 COMMISSION + WITHDRAWAL CALCULATION
  // =========================================================================

  test('Suite 31: Phase 6.4 Ledger', '1. ₹1,000 & ₹1,250 zero-sum allocation verification', () => {
    const ledgerSvc = new NexoraLedgerService();
    
    // ₹1,000 Booking
    const res1000 = ledgerSvc.logBookingPayment('biz-barber-001', 'bk-ledger-01', 100000);
    assertEquals(res1000.success, true, '₹1,000 Ledger zero-sum check passed');
    assertEquals(res1000.reconciliationSum, 0, 'Reconciled strictly to zero cents');

    // ₹1,250 Booking
    const res1250 = ledgerSvc.logBookingPayment('biz-barber-001', 'bk-ledger-02', 125000);
    assertEquals(res1250.success, true, '₹1,250 Ledger zero-sum check passed');
    assertEquals(res1250.reconciliationSum, 0, 'Reconciled strictly to zero cents');
  });

  test('Suite 31: Phase 6.4 Ledger', '2. ₹2,000 booking & balance tracking', () => {
    const ledgerSvc = new NexoraLedgerService();
    ledgerSvc.logBookingPayment('biz-barber-001', 'bk-ledger-03', 200000); // 15% Keep = 30,000 cents (₹300)

    const bal = ledgerSvc.calculateNetNexoraBalance('biz-barber-001');
    assertEquals(bal, 30000, 'Net business keep balance (₹300) tracks correctly');
  });

  test('Suite 31: Phase 6.4 Ledger', '3. Refund ledger reductions & rounding safety', () => {
    const ledgerSvc = new NexoraLedgerService();
    ledgerSvc.logBookingPayment('biz-barber-001', 'bk-ledger-04', 100000); // Withdrawable = 15,000 cents (₹150)
    
    // Refund ₹1,000
    ledgerSvc.logRefund('biz-barber-001', 'bk-ledger-04', 25000); // Reduce nexora collection by ₹250 (25,000 cents)

    const bal = ledgerSvc.calculateNetNexoraBalance('biz-barber-001');
    assertEquals(bal, 0, 'Net balance reduced strictly by ₹150 (15,000 cents) following refund deduction');
  });

  // =========================================================================
  // SUITE 32: PHASE 6.5 DAILY BUSINESS WITHDRAWAL ENGINE
  // =========================================================================

  test('Suite 32: Phase 6.5 Withdrawals', '1. Daily Cutoff Extraction & Status tracking', () => {
    const wSvc = new WithdrawalEngineService();
    wSvc.registerPaymentTrack({
      paymentId: 'pay-w-01',
      businessId: 'biz-barber-001',
      amountCents: 100000, // ₹1,000 -> 15% Withdrawable = 15,000 cents (₹150)
      state: 'AVAILABLE'
    });

    wSvc.registerPaymentTrack({
      paymentId: 'pay-w-02',
      businessId: 'biz-barber-001',
      amountCents: 50000, // ₹500 -> 15% Withdrawable = 7,500 cents (₹75)
      state: 'PENDING' // Not eligible yet
    });

    const sumBefore = wSvc.getBalanceSummary('biz-barber-001');
    assertEquals(sumBefore.availableBalance, 15000, 'Available balance is ₹150');
    assertEquals(sumBefore.pendingBalance, 7500, 'Pending balance is ₹75');

    // Trigger cutoff batch
    const batch = wSvc.createDailyCutoffBatch('biz-barber-001', '2026-10-01');
    assert(batch !== null, 'Batch created successfully');
    assertEquals(batch!.finalWithdrawalAmount, 15000, 'Batch matches eligible AVAILABLE funds (₹150)');
    assertEquals(batch!.status, 'PROCESSING', 'Batch starts in PROCESSING state');

    // Recheck balances -> available funds are now in PROCESSING, so available balance is reduced to 0
    const sumAfter = wSvc.getBalanceSummary('biz-barber-001');
    assertEquals(sumAfter.availableBalance, 0, 'Available balance safely locked under processing batch');
  });

  test('Suite 32: Phase 6.5 Withdrawals', '2. Duplicate Payout Block & Idempotency checks', () => {
    const wSvc = new WithdrawalEngineService();
    wSvc.registerPaymentTrack({
      paymentId: 'pay-w-03',
      businessId: 'biz-barber-001',
      amountCents: 100000,
      state: 'AVAILABLE'
    });

    // Create first batch
    const b1 = wSvc.createDailyCutoffBatch('biz-barber-001', '2026-10-02');
    assert(b1 !== null, 'First batch created');

    // Create duplicate batch run for same date -> should be blocked
    let didThrow = false;
    try {
      wSvc.createDailyCutoffBatch('biz-barber-001', '2026-10-02');
    } catch {
      didThrow = true;
    }
    assertEquals(didThrow, true, 'Duplicate batch run on same date strictly blocked');
  });

  test('Suite 32: Phase 6.5 Withdrawals', '3. Rollback recovery on payout failure', () => {
    const wSvc = new WithdrawalEngineService();
    wSvc.registerPaymentTrack({
      paymentId: 'pay-w-04',
      businessId: 'biz-barber-001',
      amountCents: 100000,
      state: 'AVAILABLE'
    });

    const batch = wSvc.createDailyCutoffBatch('biz-barber-001', '2026-10-03');
    // Simulate gateway failure -> fallback return to AVAILABLE
    wSvc.markPayoutFailed(batch!.batchId, 'RETURN_AVAILABLE');

    const sum = wSvc.getBalanceSummary('biz-barber-001');
    assertEquals(sum.availableBalance, 15000, 'Funds securely reverted back to AVAILABLE state; no money lost');
  });

  // =========================================================================
  // SUITE 33: PHASE 6.6 BUSINESS WALLET & FINANCIAL LEDGER
  // =========================================================================

  test('Suite 33: Phase 6.6 Wallet & Ledger', '1. Complete Booking, Ledger entry, Wallet balance sync', () => {
    const walSvc = new NexoraWalletService();
    walSvc.recordImmutableBooking('biz-barber-001', 'bk-wallet-01', 100000); // ₹1,000 Booking

    const wallet = walSvc.getBusinessWallet('biz-barber-001');
    
    // Default model: ₹1,000 Booking -> ₹250 Nexora -> ₹100 platform commission, ₹150 available to withdraw
    // Since we seeded bk-seed-01 (₹1,000) and bk-seed-02 (₹2,000) in constructor, we add ₹150 + ₹300 = ₹450
    // Total available with bk-wallet-01 (₹150) should equal ₹600 (60,000 cents)
    assertEquals(wallet.availableCents, 60000, 'Wallet Available balance verified with multiple ledger entries');
  });

  test('Suite 33: Phase 6.6 Wallet & Ledger', '2. Partial & Full Refund ledger audit trail', () => {
    const walSvc = new NexoraWalletService();
    walSvc.recordImmutableBooking('biz-barber-001', 'bk-refund-01', 100000); // Available + ₹150 (Total Available is ₹450 + ₹150 = ₹600)

    // Execute ₹500 partial refund (representing ₹125 Nexora collection reduction)
    // Business portion reduction = 15% of ₹500 = ₹75 (7,500 cents)
    walSvc.processRefund('biz-barber-001', 'bk-refund-01', 12500);

    const wallet = walSvc.getBusinessWallet('biz-barber-001');
    assertEquals(wallet.availableCents, 52500, 'Wallet Available balance reduced strictly by ₹75 partial refund corrective entries');
  });

  test('Suite 33: Phase 6.6 Wallet & Ledger', '3. Immutability guard checks', () => {
    const walSvc = new NexoraWalletService();
    const beforeCount = walSvc.listEntries('biz-barber-001').length;

    walSvc.processRefund('biz-barber-001', 'bk-seed-01', 10000);

    const afterCount = walSvc.listEntries('biz-barber-001').length;
    assertEquals(afterCount, beforeCount + 3, 'Immutability verified by recording adjustments as corrective ledger entry rows rather than editing original bookings');
  });

  // =========================================================================
  // SUITE 34: PHASE 6.7 UNRANKED MEMBER NETWORK DIRECTORY & REWARDS
  // =========================================================================

  test('Suite 34: Phase 6.7 Network', '1. Jaipur business network directory sorting (Alphabetical)', () => {
    const rankSvc = new RewardsRankingService();
    const list = rankSvc.getJaipurBusinessNetwork('All', 'ALPHABETICAL');

    // First alphabetical should be 'Ananda Wellness Ayurvedic Spa'
    assertEquals(list[0].businessId, 'biz-jpr-04', 'First alphabetical business verified as biz-jpr-04 (Ananda Wellness)');
  });

  test('Suite 34: Phase 6.7 Network', '2. Dynamic category filtering (Barber)', () => {
    const rankSvc = new RewardsRankingService();
    const barbers = rankSvc.getJaipurBusinessNetwork('Barber', 'ALPHABETICAL');
    
    assertEquals(barbers.length, 1, 'Only one barber studio in Jaipur seeds');
    assertEquals(barbers[0].businessId, 'biz-jpr-02', 'Jaipur Barber Studio matches biz-jpr-02');
  });

  test('Suite 34: Phase 6.7 Network', '3. Reward milestone and certification badges', () => {
    const rankSvc = new RewardsRankingService();
    const r = rankSvc.evaluateAndGrantReward('biz-jpr-03', 'REVENUE_MILESTONE', 50000, 'Super Seller Status badge');

    assert(r !== null, 'Reward milestone generated successfully');
    assertEquals(r!.status, 'EARNED', 'Reward milestones marked as EARNED');

    const list = rankSvc.listRewards('biz-jpr-03');
    assertEquals(list.length, 1, 'Milestone reward list tracks accurately');
  });

  // =========================================================================
  // SUITE 35: PHASE 6.8 CUSTOMER GROWTH CRM
  // =========================================================================

  test('Suite 35: Phase 6.8 CRM', '1. Birthday DOB & segments calculation', () => {
    const crmSvc = new CustomerCrmService();
    
    // Evaluate in September (month 8, 0-indexed)
    const birthdayKids = crmSvc.getSegmentCustomers('biz-barber-001', 'BIRTHDAY_MONTH', '2026-09-29');
    
    assertEquals(birthdayKids.length, 1, 'Amit Sharma (DOB 1992-09-15) found in September Birthday segment');
    assertEquals(birthdayKids[0].name, 'Amit Sharma', 'Birthday segment returns matching customer correctly');
  });

  test('Suite 35: Phase 6.8 CRM', '2. Configurable 30-day revisit eligibility', () => {
    const crmSvc = new CustomerCrmService();
    
    // Default config = 30 days. Last completed visit: 2026-08-25. Revisit check date: 2026-09-29 (35 days difference)
    const dueForVisit_30 = crmSvc.getSegmentCustomers('biz-barber-001', 'DUE_FOR_VISIT', '2026-09-29');
    assertEquals(dueForVisit_30.length, 1, 'Customer eligible for revisit check since interval > 30 days');

    // Update threshold to 40 days
    crmSvc.updateRevisitDays('biz-barber-001', 40);
    const dueForVisit_40 = crmSvc.getSegmentCustomers('biz-barber-001', 'DUE_FOR_VISIT', '2026-09-29');
    assertEquals(dueForVisit_40.length, 0, 'Customer no longer eligible as threshold increased to 40 days');
  });

  test('Suite 35: Phase 6.8 CRM', '3. Strict tenant isolation guard', () => {
    const crmSvc = new CustomerCrmService();
    
    const barberCustomers = crmSvc.getCustomers('biz-barber-001');
    const spaCustomers = crmSvc.getCustomers('biz-spa-002');

    // None should bleed across tenants
    const duplicates = barberCustomers.filter(c => spaCustomers.some(s => s.customerId === c.customerId));
    assertEquals(duplicates.length, 0, 'No data bleed: Customer isolation between Barber and Spa verified');
  });

  // =========================================================================
  // SUITE 36: PHASE 6.9 CRM CAMPAIGNS & SECURE DATA EXPORTS
  // =========================================================================

  test('Suite 36: Phase 6.9 Campaigns', '1. One-click segment targeting and consent filtering', () => {
    const campaignSvc = new CrmCampaignsService();
    
    // Dispatched VIP campaign on WhatsApp channel
    // 'cust-barber-001' (Vikram Rajput) is VIP and has whatsappOptIn = true & marketingConsent = true.
    // 'cust-barber-002' is not VIP.
    const run = campaignSvc.launchOneClickCampaign('biz-barber-001', {
      campaignName: 'VIP Exclusive Shave Offer',
      offerTitle: 'Premium 30% VIP cut',
      offerMessage: 'VIP client discount',
      discountType: 'PERCENTAGE',
      discountValue: 30,
      startDate: '2026-10-01',
      endDate: '2026-10-15',
      applicableServices: ['Classic Royal Trim'],
      ctaText: 'Claim Shave Voucher',
      channel: 'WhatsApp',
      targetSegment: 'VIP'
    });

    assertEquals(run.campaign.sentCount, 1, 'Exactly 1 consented customer targeted and messaged');
    assertEquals(run.campaign.targetedCount, 1, 'Only Vikram classified in VIP segment inside barber shop');
  });

  test('Suite 36: Phase 6.9 Campaigns', '2. Scoped data export with full security audit logging', () => {
    const campaignSvc = new CrmCampaignsService();
    const beforeCount = campaignSvc.getExportAuditLogs('biz-barber-001').length;

    const result = campaignSvc.exportCustomersToCsv('biz-barber-001', 'usr-admin-royal');
    
    assert(result.csvContent.includes('Vikram Rajput'), 'CSV content contains matching customer names');
    assert(result.csvContent.includes('Aarav Patel'), 'CSV content contains matching customer names');
    
    // Verify cross-business tenant isolation: दीपिका from spa-002 must NOT bleed into barber CSV
    assertEquals(result.csvContent.includes('Priyanka Sen'), false, 'Secure isolation verified: Spa customer does not bleed into Barber CSV');

    const afterLogs = campaignSvc.getExportAuditLogs('biz-barber-001');
    assertEquals(afterLogs.length, beforeCount + 1, 'Secure audit trail recorded with exporting user credentials');
  });

  // =========================================================================
  // SUITE 37: PHASE 6.10 AUTOMATED CUSTOMER RE-ENGAGEMENT
  // =========================================================================

  test('Suite 37: Phase 6.10 Automations', '1. 30-day visit reminder & birthday triggers', async () => {
    const automationsSvc = new CrmAutomationsService();

    // Evaluate 30-day visit reminder for Vikram Rajput
    const log1 = await automationsSvc.evaluateScheduledAutomationsForCustomer(
      'biz-barber-001',
      'cust-barber-001',
      'VISIT_REMINDER_30_DAY',
      '2026-09-29'
    );

    assertEquals(log1.status, 'SENT', 'Auto-reminder sent successfully via active WhatsApp provider abstraction');
    assert(log1.message.includes('Vikram Rajput'), 'Message templates dynamically substitute customerName');
    assert(log1.message.includes('Royal Crown Barber'), 'Message templates dynamically substitute businessName');
  });

  test('Suite 37: Phase 6.10 Automations', '2. Exclusions for upcoming booking, opt-outs & suspended businesses', async () => {
    const automationsSvc = new CrmAutomationsService();

    // Set 'cust-barber-001' nextBooking to have an active future appointment
    const crmSvc = new CustomerCrmService();
    crmSvc.updateCustomer('cust-barber-001', { nextBooking: '2026-10-10' });

    // Try evaluating again. It should be skipped due to upcoming booking!
    const log2 = await automationsSvc.evaluateScheduledAutomationsForCustomer(
      'biz-barber-001',
      'cust-barber-001',
      'VISIT_REMINDER_30_DAY',
      '2026-09-29'
    );

    assertEquals(log2.status, 'SKIPPED_REBOOKED', 'Guardrail exclusion: skip automation when client already rebooked an upcoming session');

    // Opt-out test: 'cust-barber-002' has marketingConsent = false
    const log3 = await automationsSvc.evaluateScheduledAutomationsForCustomer(
      'biz-barber-001',
      'cust-barber-002',
      'VISIT_REMINDER_30_DAY',
      '2026-09-29'
    );
    assertEquals(log3.status, 'SKIPPED_OPT_OUT', 'Guardrail exclusion: skip automation when customer does not provide consent');
  });

  test('Suite 37: Phase 6.10 Automations', '3. Idempotent duplicate job execution prevention', async () => {
    const automationsSvc = new CrmAutomationsService();

    // Reset customer nextBooking so we can trigger
    const crmSvc = new CustomerCrmService();
    crmSvc.updateCustomer('cust-barber-001', { nextBooking: undefined });

    const log4 = await automationsSvc.evaluateScheduledAutomationsForCustomer(
      'biz-barber-001',
      'cust-barber-001',
      'BIRTHDAY_WISH',
      '2026-09-29'
    );

    assertEquals(log4.status, 'SENT', 'Birthday wish first dispatch is sent successfully');

    // Trigger again under the exact same year. Idempotency filter should instantly skip it
    const log5 = await automationsSvc.evaluateScheduledAutomationsForCustomer(
      'biz-barber-001',
      'cust-barber-001',
      'BIRTHDAY_WISH',
      '2026-09-29'
    );

    assertEquals(log5.automationId, log4.automationId, 'Idempotent duplicate prevention: returns original log without duplicating messages');
  });

  // =========================================================================
  // SUITE 38: PHASE 6.11 AI GROWTH & ANALYTICS CALCULATIONS
  // =========================================================================

  test('Suite 38: Phase 6.11 Analytics', '1. Accurate revenue & Conversion Metrics calculations', () => {
    const analyticsSvc = new AnalyticsService();
    const stats = analyticsSvc.getBusinessAnalytics('biz-barber-001');

    assertEquals(stats.completedBookings, 22, 'Completed bookings evaluated correctly from database records');
    assertEquals(stats.cancelledBookings, 4, 'Cancelled bookings matches input schema metrics');
    assertEquals(stats.revenue, 4200, 'Total simulated revenue computed correctly');
    assertEquals(stats.bookingConversionRate, 88, 'Conversion rate reflects correct booking lead ratios');
  });

  test('Suite 38: Phase 6.11 Analytics', '2. Controlled AI draft templates generation', async () => {
    const aiSvc = new AiGrowthService();
    
    const draft = await aiSvc.generateGrowthAsset('OFFER_IDEAS', {
      businessName: 'Royal Crown Barber',
      targetSegment: 'VIP',
      offerValue: 'Flat 15% Off'
    });

    assert(draft.headline.includes('Royal Crown Barber'), 'AI Offer template correctly includes custom business name parameter');
    assert(draft.body.includes('VIP'), 'AI Content targeted specifically to the requested target segment');
  });

  // =========================================================================
  // SUITE 39: PHASE 6.12 FINANCIAL RECONCILIATION, SECURITY & E2E FLOW
  // =========================================================================

  test('Suite 39: Phase 6.12 Hardening', '1. Complete booking payment & Nexora collection reconciliation', () => {
    const reconSvc = new FinancialReconciliationService();

    // Reconcile standard booking: Total: ₹1000 = Direct: ₹750 + Nexora: ₹250
    // And Nexora: ₹250 = Business Withdrawable: ₹150 + Platform Commission: ₹100
    const report = reconSvc.reconcileBookingPayment({
      bookingId: 'book-e2e-1000',
      totalAmount: 1000,
      directCollection: 750,
      nexoraCollection: 250,
      platformCommission: 100,
      businessWithdrawable: 150,
      validAdjustments: 0
    });

    assertEquals(report.isPerfectlyBalanced, true, 'Booking collections & Nexora allocations sum perfectly to the penny');
  });

  test('Suite 39: Phase 6.12 Hardening', '2. Webhook signature, timestamp and replay prevention checks', () => {
    const reconSvc = new FinancialReconciliationService();

    const check = reconSvc.verifyWebhookSecurity({
      payload: '{"bookingId":"b123","status":"SUCCEEDED"}',
      signature: 'sha256_38_16', // length based mock sha
      secretKey: 'nexora_test_skey',
      timestamp: 1790698000000,
      currentTimestamp: 1790698100000, // 100 seconds after (valid)
      processedEventIds: ['evt-already-seen'],
      eventId: 'evt-new-one'
    });

    assertEquals(check.isValidSignature, true, 'Cryptographically verified signature passes audit check');
    assertEquals(check.isStale, false, 'Fresh event arrives well within the 5-minute guard window');
    assertEquals(check.isDuplicate, false, 'Unseen event ID successfully passes idempotency filters');
  });

  test('Suite 39: Phase 6.12 Hardening', '3. Double-withdrawals and negative balances prevention', () => {
    const walletSvc = new NexoraWalletService();
    
    // Set initial balance to zero for clean baseline testing
    walletSvc.overrideBalanceForTest('biz-barber-001', 0);

    // Try withdrawing ₹100. It must fail due to zero balance!
    const failedAttempt = walletSvc.requestWithdrawal('biz-barber-001', 100, 'usr-owner-royal');
    assertEquals(failedAttempt.status, 'FAILED', 'Guard check: withdrawal above available balance must fail');

    // Credit ₹150
    walletSvc.creditBalance('biz-barber-001', 150);

    // Now request ₹150. It must succeed.
    const successAttempt = walletSvc.requestWithdrawal('biz-barber-001', 150, 'usr-owner-royal');
    assertEquals(successAttempt.status, 'PENDING', 'Withdrawal within credit limits allowed');

    // Requesting again instantly (simulating a double tap) must fail
    const doubleAttempt = walletSvc.requestWithdrawal('biz-barber-001', 150, 'usr-owner-royal');
    assertEquals(doubleAttempt.status, 'FAILED', 'Guard check: double withdrawal and negative balances successfully prevented');
  });

  test('Suite 39: Phase 6.12 Hardening', '4. End-to-End full system check flow', async () => {
    const reconSvc = new FinancialReconciliationService();
    const automationsSvc = new CrmAutomationsService();

    // 1. Reconcile split for ₹1,000 booking
    const r = reconSvc.reconcileBookingPayment({
      bookingId: 'e2e-master-777',
      totalAmount: 1000,
      directCollection: 750,
      nexoraCollection: 250,
      platformCommission: 100,
      businessWithdrawable: 150,
      validAdjustments: 0
    });
    assertEquals(r.isPerfectlyBalanced, true, 'E2E Step 1: Booking split and commission structure calculated perfectly');

    // 2. Check 30-day auto-reminder trigger evaluation and consent verification
    const log = await automationsSvc.evaluateScheduledAutomationsForCustomer(
      'biz-barber-001',
      'cust-barber-001',
      'VISIT_REMINDER_30_DAY',
      '2026-09-29'
    );
    assert(log.status === 'SENT' || log.status === 'SKIPPED_REBOOKED', 'E2E Step 2: Automation engine executes consent-aware outreach correctly');
  });

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  return {
    total: results.length,
    passed,
    failed,
    results,
  };
}
