// Nexora SalonOS — Phase 7.16 Business Settings Unit & Security Test Suite
import { describe, it, expect, beforeEach } from 'vitest';
import { businessSettingsService } from '../services/businessSettingsService';
import { staffScheduleService } from '../services/staffScheduleService';
import { auditLogService } from '../services/auditLogService';
import { UserSession } from '../services/authContext';
import { SecurityError } from '../lib/permissions';

describe('PHASE 7.16 — BUSINESS SETTINGS SPECIFICATION', () => {
  const BIZ_A = 'biz-barber-01';
  const BIZ_B = 'biz-spa-02';

  const ownerSessionA: UserSession = {
    userId: 'usr-owner-1',
    name: 'Vikram Singhania',
    email: 'owner@royalcrown.in',
    phone: '+91 98200 88990',
    role: 'BUSINESS_OWNER',
    businessId: BIZ_A,
    businessSlug: 'royal-crown',
    token: 'jwt_owner_a',
    expiresAt: Date.now() + 3600000
  };

  const ownerSessionB: UserSession = {
    userId: 'usr-owner-2',
    name: 'Ananya Deshmukh',
    email: 'owner@glowgrace.in',
    phone: '+91 98200 99001',
    role: 'BUSINESS_OWNER',
    businessId: BIZ_B,
    businessSlug: 'glow-and-grace',
    token: 'jwt_owner_b',
    expiresAt: Date.now() + 3600000
  };

  const managerSessionA: UserSession = {
    userId: 'usr-manager-1',
    name: 'Sameer Patel',
    email: 'manager@royalcrown.in',
    phone: '+91 98200 77112',
    role: 'MANAGER',
    businessId: BIZ_A,
    businessSlug: 'royal-crown',
    token: 'jwt_mgr_a',
    expiresAt: Date.now() + 3600000
  };

  const staffSessionA: UserSession = {
    userId: 'usr-staff-1',
    name: 'Marco Silva',
    email: 'marco@royalcrown.in',
    phone: '+91 98200 33445',
    role: 'STAFF',
    businessId: BIZ_A,
    businessSlug: 'royal-crown',
    token: 'jwt_staff_a',
    expiresAt: Date.now() + 3600000
  };

  const customerSession: UserSession = {
    userId: 'usr-cust-1',
    name: 'Rahul Kapoor',
    email: 'rahul@example.com',
    phone: '+91 98200 12345',
    role: 'CUSTOMER',
    token: 'jwt_cust',
    expiresAt: Date.now() + 3600000
  };

  beforeEach(() => {
    // Reset state to default presets
    businessSettingsService.resetToDefaults(BIZ_A, ownerSessionA);
    businessSettingsService.resetToDefaults(BIZ_B, ownerSessionB);
  });

  describe('1. Business Information', () => {
    it('provides and updates all required business information fields', () => {
      const settings = businessSettingsService.getSettings(BIZ_A);
      expect(settings.info).toHaveProperty('name');
      expect(settings.info).toHaveProperty('logoUrl');
      expect(settings.info).toHaveProperty('coverImageUrl');
      expect(settings.info).toHaveProperty('phone');
      expect(settings.info).toHaveProperty('email');
      expect(settings.info).toHaveProperty('whatsapp');
      expect(settings.info).toHaveProperty('address');
      expect(settings.info).toHaveProperty('city');
      expect(settings.info).toHaveProperty('state');
      expect(settings.info).toHaveProperty('country');
      expect(settings.info).toHaveProperty('instagram');
      expect(settings.info).toHaveProperty('facebook');

      const updated = businessSettingsService.updateSection(
        BIZ_A,
        'info',
        {
          ...settings.info,
          name: 'The Royal Crown Lounge & Spa',
          whatsapp: '+91 98200 99999'
        },
        ownerSessionA
      );

      expect(updated.info.name).toBe('The Royal Crown Lounge & Spa');
      expect(updated.info.whatsapp).toBe('+91 98200 99999');
    });
  });

  describe('2. Business Hours & Schedule Integration', () => {
    it('uses existing business-hours system and synchronizes with staffScheduleService', () => {
      const settings = businessSettingsService.getSettings(BIZ_A);
      expect(settings.hours).toBeDefined();
      expect(settings.hours.weeklyHours).toHaveProperty('TUESDAY');
      expect(settings.hours.weeklyHours.TUESDAY.isOpen).toBe(true);

      // Update Tuesday opening time to 08:30
      const updatedHours = {
        ...settings.hours,
        weeklyHours: {
          ...settings.hours.weeklyHours,
          TUESDAY: {
            ...settings.hours.weeklyHours.TUESDAY,
            openingTime: '08:30'
          }
        }
      };

      businessSettingsService.updateSection(BIZ_A, 'hours', updatedHours, ownerSessionA);

      // Verify synchronized in staffScheduleService
      const liveSchedule = staffScheduleService.getBusinessSchedule(BIZ_A);
      expect(liveSchedule?.weeklyHours.TUESDAY.openingTime).toBe('08:30');
    });
  });

  describe('3. Booking Settings & Default Advance', () => {
    it('configures advance percentage with 25% default, intervals, and buffer times', () => {
      const settings = businessSettingsService.getSettings(BIZ_A);
      expect(settings.booking.advancePaymentPercentage).toBe(25);
      expect(settings.booking.slotIntervalMinutes).toBe(15);
      expect(settings.booking.minAdvanceBookingHours).toBe(2);
      expect(settings.booking.maxAdvanceBookingDays).toBe(30);
      expect(settings.booking.bufferTimeMinutes).toBe(10);
      expect(settings.booking.cancellationWindowHours).toBe(4);
      expect(settings.booking.rescheduleWindowHours).toBe(2);

      const updated = businessSettingsService.updateSection(
        BIZ_A,
        'booking',
        {
          ...settings.booking,
          advancePaymentPercentage: 35,
          slotIntervalMinutes: 30
        },
        ownerSessionA
      );

      expect(updated.booking.advancePaymentPercentage).toBe(35);
      expect(updated.booking.slotIntervalMinutes).toBe(30);
    });
  });

  describe('4. Booking Policies', () => {
    it('allows editing all 4 policy types', () => {
      const settings = businessSettingsService.getSettings(BIZ_A);
      expect(settings.policies).toHaveProperty('cancellationPolicy');
      expect(settings.policies).toHaveProperty('reschedulePolicy');
      expect(settings.policies).toHaveProperty('noShowPolicy');
      expect(settings.policies).toHaveProperty('advancePaymentPolicy');

      const updated = businessSettingsService.updateSection(
        BIZ_A,
        'policies',
        {
          ...settings.policies,
          cancellationPolicy: 'Custom 6-hour cancellation notice required.'
        },
        ownerSessionA
      );

      expect(updated.policies.cancellationPolicy).toBe('Custom 6-hour cancellation notice required.');
    });
  });

  describe('5. Payment Settings & Secret Isolation', () => {
    it('contains payment provider, Nexora QR, and currency without leaking gateway secrets', () => {
      const settings = businessSettingsService.getSettings(BIZ_A);
      expect(settings.payment.nexoraQrEnabled).toBe(true);
      expect(settings.payment.paymentProvider).toBe('RAZORPAY');
      expect(settings.payment.currency).toBe('INR');
      expect(settings.payment.currencySymbol).toBe('₹');

      // Ensure no private API secrets exist in the model
      expect((settings.payment as any).secretKey).toBeUndefined();
      expect((settings.payment as any).apiSecret).toBeUndefined();
    });
  });

  describe('6. Notification Automations', () => {
    it('manages transactional alerts, review requests, birthdays, and 30-day reminders', () => {
      const settings = businessSettingsService.getSettings(BIZ_A);
      expect(settings.notifications.bookingConfirmation.whatsapp).toBe(true);
      expect(settings.notifications.reminder24h.email).toBe(true);
      expect(settings.notifications.postVisitReviewRequest.enabled).toBe(true);
      expect(settings.notifications.birthdayGreetings.enabled).toBe(true);
      expect(settings.notifications.revisit30DayNudge.enabled).toBe(true);
    });
  });

  describe('7. Marketing & Privacy Consent', () => {
    it('enforces customer consent governance and DND compliance', () => {
      const settings = businessSettingsService.getSettings(BIZ_A);
      expect(settings.marketing.enforceExplicitConsent).toBe(true);
      expect(settings.marketing.respectDndRegistry).toBe(true);
      expect(settings.marketing.allowPromotionalBroadcasts).toBe(true);
    });
  });

  describe('8. Security, RBAC & Tenant Isolation', () => {
    it('allows Business Owner and Manager to edit settings for their own business', () => {
      expect(() => {
        businessSettingsService.updateSettings(BIZ_A, { booking: { ...businessSettingsService.getSettings(BIZ_A).booking, advancePaymentPercentage: 20 } }, ownerSessionA);
      }).not.toThrow();

      expect(() => {
        businessSettingsService.updateSettings(BIZ_A, { booking: { ...businessSettingsService.getSettings(BIZ_A).booking, advancePaymentPercentage: 20 } }, managerSessionA);
      }).not.toThrow();
    });

    it('strictly BLOCKS Staff from modifying business settings', () => {
      expect(() => {
        businessSettingsService.updateSettings(BIZ_A, { booking: { ...businessSettingsService.getSettings(BIZ_A).booking, advancePaymentPercentage: 20 } }, staffSessionA);
      }).toThrow(SecurityError);
    });

    it('strictly BLOCKS Customer from modifying business settings', () => {
      expect(() => {
        businessSettingsService.updateSettings(BIZ_A, { booking: { ...businessSettingsService.getSettings(BIZ_A).booking, advancePaymentPercentage: 20 } }, customerSession);
      }).toThrow(SecurityError);
    });

    it('strictly ENFORCES Tenant Isolation: Business Owner A cannot modify Business B settings', () => {
      expect(() => {
        businessSettingsService.updateSettings(BIZ_B, { info: { ...businessSettingsService.getSettings(BIZ_B).info, name: 'Hacked Name' } }, ownerSessionA);
      }).toThrow(SecurityError);
    });

    it('records an audit log entry on settings modification', () => {
      const initialLogsCount = auditLogService.getAuditLogs(ownerSessionA, { action: 'SETTINGS_CHANGE' }).length;

      businessSettingsService.updateSection(
        BIZ_A,
        'info',
        { ...businessSettingsService.getSettings(BIZ_A).info, tagline: 'New Artisanal Tagline' },
        ownerSessionA
      );

      const logs = auditLogService.getAuditLogs(ownerSessionA, { action: 'SETTINGS_CHANGE' });
      expect(logs.length).toBeGreaterThan(initialLogsCount);
      expect(logs[0].action).toBe('SETTINGS_CHANGE');
      expect(logs[0].entity).toBe('Settings');
    });
  });
});
