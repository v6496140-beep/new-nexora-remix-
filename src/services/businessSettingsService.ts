// Nexora SalonOS — Comprehensive Business Settings Service (Phase 7.16)
import { 
  ComprehensiveBusinessSettings, 
  BusinessInfoSettings, 
  BookingRuleSettings, 
  BookingPolicySettings, 
  PaymentGatewaySettings, 
  NotificationAutomationSettings, 
  MarketingConsentSettings 
} from '../types/businessSettings';
import { staffScheduleService } from './staffScheduleService';
import { auditLogService } from './auditLogService';
import { UserSession } from './authContext';
import { enforceTenantIsolation, assertPermission, SecurityError } from '../lib/permissions';
import { DayOfWeek, BusinessDailyHours } from '../types/staffSchedule';

const DEFAULT_WEEKLY_HOURS: Record<DayOfWeek, BusinessDailyHours> = {
  MONDAY: { isOpen: false, openingTime: '00:00', closingTime: '00:00', breaks: [] },
  TUESDAY: { isOpen: true, openingTime: '09:00', closingTime: '20:00', breaks: [{ startTime: '14:00', endTime: '14:30', label: 'Salon Sanitization' }] },
  WEDNESDAY: { isOpen: true, openingTime: '09:00', closingTime: '20:00', breaks: [{ startTime: '14:00', endTime: '14:30', label: 'Salon Sanitization' }] },
  THURSDAY: { isOpen: true, openingTime: '09:00', closingTime: '20:00', breaks: [{ startTime: '14:00', endTime: '14:30', label: 'Salon Sanitization' }] },
  FRIDAY: { isOpen: true, openingTime: '09:00', closingTime: '20:00', breaks: [{ startTime: '14:00', endTime: '14:30', label: 'Salon Sanitization' }] },
  SATURDAY: { isOpen: true, openingTime: '09:00', closingTime: '21:00', breaks: [] },
  SUNDAY: { isOpen: true, openingTime: '09:00', closingTime: '21:00', breaks: [] }
};

const SEEDED_BARBER_SETTINGS: ComprehensiveBusinessSettings = {
  businessId: 'biz-barber-01',
  info: {
    name: 'The Royal Crown Barber & Lounge',
    tagline: 'Artisanal Grooming & Classic Razor Rituals',
    logoUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&auto=format&fit=crop&q=80',
    phone: '+91 98200 12345',
    email: 'contact@royalcrown.in',
    whatsapp: '+91 98200 12345',
    address: 'Hill Road, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '400050',
    instagram: 'https://instagram.com/royalcrownbarber',
    facebook: 'https://facebook.com/royalcrownbarber'
  },
  hours: {
    businessId: 'biz-barber-01',
    timezone: 'Asia/Kolkata',
    weeklyHours: DEFAULT_WEEKLY_HOURS,
    holidays: [{ date: '2026-11-08', name: 'Diwali Festive Holiday' }]
  },
  booking: {
    advancePaymentPercentage: 25, // default: 25%
    slotIntervalMinutes: 15,
    minAdvanceBookingHours: 2,
    maxAdvanceBookingDays: 30,
    bufferTimeMinutes: 10,
    cancellationWindowHours: 4,
    rescheduleWindowHours: 2,
    enableOnlineAdvance: true,
    enableWalkins: true
  },
  policies: {
    cancellationPolicy: 'Cancellations made 4+ hours prior to slot receive full advance refund or wallet credit. Cancellations within 4 hours forfeit the 25% advance reservation fee.',
    reschedulePolicy: 'Appointments can be rescheduled up to 2 hours before the scheduled slot at no penalty (maximum 2 reschedules per booking).',
    noShowPolicy: 'No-show appointments after 15 minutes past the start time will forfeit advance payment and automatically release the specialist.',
    advancePaymentPolicy: 'A 25% online advance deposit is required to reserve time with our master barbers and stylists.'
  },
  payment: {
    nexoraQrEnabled: true,
    merchantUpiVpa: 'royalcrown@icici',
    paymentProvider: 'RAZORPAY',
    currency: 'INR',
    currencySymbol: '₹',
    settlementMode: 'AUTOMATIC_SPLIT',
    taxGstRate: 18,
    taxTdsRate: 10,
    providerStatus: 'CONNECTED'
  },
  notifications: {
    bookingConfirmation: { email: true, sms: true, whatsapp: true },
    reminder24h: { email: true, sms: true, whatsapp: true },
    reminder2h: { email: false, sms: true, whatsapp: true },
    postVisitReviewRequest: { enabled: true, delayHours: 2, channel: 'whatsapp' },
    birthdayGreetings: { enabled: true, voucherDiscountPercent: 15 },
    revisit30DayNudge: { enabled: true, autoFollowUp: true }
  },
  marketing: {
    enforceExplicitConsent: true,
    respectDndRegistry: true,
    allowPromotionalBroadcasts: true,
    consentAuditLogRetentionDays: 365
  },
  updatedAt: '2026-09-29T12:00:00Z',
  updatedBy: 'usr-owner-1'
};

const SEEDED_SPA_SETTINGS: ComprehensiveBusinessSettings = {
  businessId: 'biz-spa-02',
  info: {
    name: 'Glow & Grace Luxury Spa & Wellness',
    tagline: 'Holistic Rejuvenation & Thermal Hydrotherapy',
    logoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&auto=format&fit=crop&q=80',
    phone: '+91 98200 99001',
    email: 'contact@glowgrace.in',
    whatsapp: '+91 98200 99001',
    address: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    postalCode: '560038',
    instagram: 'https://instagram.com/glowandgracespa',
    facebook: 'https://facebook.com/glowandgracespa'
  },
  hours: {
    businessId: 'biz-spa-02',
    timezone: 'Asia/Kolkata',
    weeklyHours: {
      MONDAY: { isOpen: true, openingTime: '08:00', closingTime: '21:00', breaks: [] },
      TUESDAY: { isOpen: true, openingTime: '08:00', closingTime: '21:00', breaks: [] },
      WEDNESDAY: { isOpen: true, openingTime: '08:00', closingTime: '21:00', breaks: [] },
      THURSDAY: { isOpen: true, openingTime: '08:00', closingTime: '21:00', breaks: [] },
      FRIDAY: { isOpen: true, openingTime: '08:00', closingTime: '21:00', breaks: [] },
      SATURDAY: { isOpen: true, openingTime: '08:00', closingTime: '22:00', breaks: [] },
      SUNDAY: { isOpen: true, openingTime: '08:00', closingTime: '22:00', breaks: [] }
    },
    holidays: []
  },
  booking: {
    advancePaymentPercentage: 30,
    slotIntervalMinutes: 30,
    minAdvanceBookingHours: 4,
    maxAdvanceBookingDays: 60,
    bufferTimeMinutes: 15,
    cancellationWindowHours: 12,
    rescheduleWindowHours: 6,
    enableOnlineAdvance: true,
    enableWalkins: false
  },
  policies: {
    cancellationPolicy: 'Cancellations made 12+ hours prior receive 100% advance credit. Late cancellations forfeit deposit.',
    reschedulePolicy: 'Reschedule requests accepted up to 6 hours prior to treatment.',
    noShowPolicy: 'No-show forfeits 100% of the advance deposit.',
    advancePaymentPolicy: '30% advance required for all premium spa and wellness packages.'
  },
  payment: {
    nexoraQrEnabled: true,
    merchantUpiVpa: 'glowgrace@hdfc',
    paymentProvider: 'STRIPE',
    currency: 'INR',
    currencySymbol: '₹',
    settlementMode: 'AUTOMATIC_SPLIT',
    taxGstRate: 18,
    taxTdsRate: 10,
    providerStatus: 'CONNECTED'
  },
  notifications: {
    bookingConfirmation: { email: true, sms: true, whatsapp: true },
    reminder24h: { email: true, sms: true, whatsapp: true },
    reminder2h: { email: true, sms: true, whatsapp: true },
    postVisitReviewRequest: { enabled: true, delayHours: 4, channel: 'email' },
    birthdayGreetings: { enabled: true, voucherDiscountPercent: 20 },
    revisit30DayNudge: { enabled: true, autoFollowUp: true }
  },
  marketing: {
    enforceExplicitConsent: true,
    respectDndRegistry: true,
    allowPromotionalBroadcasts: true,
    consentAuditLogRetentionDays: 365
  },
  updatedAt: '2026-09-28T10:00:00Z',
  updatedBy: 'usr-owner-2'
};

const STORAGE_PREFIX = 'nexora_settings_v3_';

export class BusinessSettingsService {
  private cache: Map<string, ComprehensiveBusinessSettings> = new Map();

  constructor() {
    this.initTenant(SEEDED_BARBER_SETTINGS);
    this.initTenant(SEEDED_SPA_SETTINGS);
  }

  private normalizeBusinessId(bizId: string): string {
    if (bizId === 'biz-barber-001') return 'biz-barber-01';
    if (bizId === 'biz-spa-002') return 'biz-spa-02';
    return bizId;
  }

  private initTenant(defaultSettings: ComprehensiveBusinessSettings) {
    const id = defaultSettings.businessId;
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
      if (stored) {
        this.cache.set(id, JSON.parse(stored));
        return;
      }
    } catch (e) {
      // localStorage may fail in test runners
    }
    this.cache.set(id, { ...defaultSettings });
  }

  /**
   * Get Settings for a business with fallback
   */
  public getSettings(businessId: string): ComprehensiveBusinessSettings {
    const normId = this.normalizeBusinessId(businessId);
    let s = this.cache.get(normId);
    if (!s) {
      // Create fallback settings
      const fallback: ComprehensiveBusinessSettings = {
        ...SEEDED_BARBER_SETTINGS,
        businessId: normId,
        info: {
          ...SEEDED_BARBER_SETTINGS.info,
          name: normId === 'biz-spa-02' ? 'Glow & Grace Luxury Spa' : 'Nexora Salon'
        }
      };
      this.cache.set(normId, fallback);
      s = fallback;
    }

    // Sync hours with existing staffScheduleService schedule engine
    const schedule = staffScheduleService.getBusinessSchedule(normId);
    if (schedule) {
      s.hours = schedule;
    }

    return JSON.parse(JSON.stringify(s));
  }

  /**
   * Update Settings with RBAC and Tenant Isolation Guards
   */
  public updateSettings(
    businessId: string,
    updates: Partial<ComprehensiveBusinessSettings>,
    userSession: UserSession | null
  ): ComprehensiveBusinessSettings {
    const normId = this.normalizeBusinessId(businessId);

    // 1. Programmatic RBAC security check
    assertPermission(userSession, 'Settings', 'edit', { targetBusinessId: normId });
    enforceTenantIsolation(userSession, normId, 'Business Settings');

    const current = this.getSettings(normId);
    const updated: ComprehensiveBusinessSettings = {
      ...current,
      ...updates,
      businessId: normId,
      updatedAt: new Date().toISOString(),
      updatedBy: userSession?.userId || 'unknown'
    };

    // 2. If hours updated, sync with existing staffScheduleService
    if (updates.hours) {
      staffScheduleService.updateBusinessSchedule(normId, updates.hours);
    }

    this.cache.set(normId, updated);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${normId}`, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    // 3. Emit Audit Log
    auditLogService.recordAuditLog({
      user: {
        id: userSession?.userId || 'usr-unknown',
        name: userSession?.name || 'Unknown User',
        email: userSession?.email || ''
      },
      role: userSession?.role || 'BUSINESS_OWNER',
      businessId: normId,
      action: 'SETTINGS_CHANGE',
      entity: 'Settings',
      entityId: normId,
      metadata: {
        updatedFields: Object.keys(updates),
        timestamp: updated.updatedAt
      }
    });

    return JSON.parse(JSON.stringify(updated));
  }

  /**
   * Update a specific section
   */
  public updateSection<K extends keyof ComprehensiveBusinessSettings>(
    businessId: string,
    section: K,
    data: ComprehensiveBusinessSettings[K],
    userSession: UserSession | null
  ): ComprehensiveBusinessSettings {
    return this.updateSettings(businessId, { [section]: data } as any, userSession);
  }

  /**
   * Reset to initial defaults
   */
  public resetToDefaults(
    businessId: string,
    userSession: UserSession | null
  ): ComprehensiveBusinessSettings {
    const normId = this.normalizeBusinessId(businessId);
    assertPermission(userSession, 'Settings', 'edit', { targetBusinessId: normId });
    enforceTenantIsolation(userSession, normId, 'Business Settings');

    const defaults = normId === 'biz-spa-02' ? SEEDED_SPA_SETTINGS : SEEDED_BARBER_SETTINGS;
    const reset = {
      ...defaults,
      updatedAt: new Date().toISOString(),
      updatedBy: userSession?.userId || 'unknown'
    };

    this.cache.set(normId, reset);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${normId}`, JSON.stringify(reset));
    } catch (e) {}

    return JSON.parse(JSON.stringify(reset));
  }
}

export const businessSettingsService = new BusinessSettingsService();
export const getSettings = (businessId: string) => businessSettingsService.getSettings(businessId);
export const updateSettings = (businessId: string, section: string, data: any) => 
  businessSettingsService.updateSection(businessId, section as any, data, null);
