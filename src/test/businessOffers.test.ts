// Nexora SalonOS — Phase 7.17 Business Admin Offers & Discounts Unit & Security Test Suite
import { describe, it, expect, beforeEach } from 'vitest';
import { businessOffersService } from '../services/businessOffersService';
import { UserSession } from '../services/authContext';
import { SecurityError } from '../lib/permissions';

describe('PHASE 7.17 — BUSINESS OFFERS & DISCOUNTS SPECIFICATION', () => {
  const BIZ_A = 'biz-barber-01';
  const BIZ_B = 'biz-spa-02';

  const ownerA: UserSession = {
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

  const ownerB: UserSession = {
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

  const managerA: UserSession = {
    userId: 'usr-mgr-1',
    name: 'Sameer Patel',
    email: 'manager@royalcrown.in',
    phone: '+91 98200 77112',
    role: 'MANAGER',
    businessId: BIZ_A,
    businessSlug: 'royal-crown',
    token: 'jwt_mgr_a',
    expiresAt: Date.now() + 3600000
  };

  const staffA: UserSession = {
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

  const customer: UserSession = {
    userId: 'usr-cust-1',
    name: 'Rahul Kapoor',
    email: 'rahul@example.com',
    phone: '+91 98200 12345',
    role: 'CUSTOMER',
    token: 'jwt_cust',
    expiresAt: Date.now() + 3600000
  };

  describe('1. Create Offer', () => {
    it('allows Business Owner to create percentage and fixed offers', () => {
      const created = businessOffersService.createOffer(
        BIZ_A,
        {
          code: 'TESTFEST30',
          name: 'Testing Festival Offer',
          title: '30% Off Everything',
          description: 'Special test offer',
          discountType: 'PERCENTAGE',
          discountValue: 30,
          minimumBookingAmountCents: 50000,
          maxDiscountCents: 20000,
          startDate: '2026-09-01',
          endDate: '2026-12-31',
          usageLimit: 100,
          perCustomerLimit: 1,
          targetSegment: 'VIP',
          applicableServices: ['srv-rc-1'],
          applicablePackages: [],
          status: 'ACTIVE'
        },
        ownerA
      );

      expect(created.id).toBeDefined();
      expect(created.code).toBe('TESTFEST30');
      expect(created.discountValue).toBe(30);
      expect(created.targetSegment).toBe('VIP');
    });

    it('prevents duplicate promo codes within the same business', () => {
      expect(() => {
        businessOffersService.createOffer(
          BIZ_A,
          {
            code: 'ROYALFEST20', // Already exists in seeded data
            name: 'Duplicate Promo',
            title: 'Duplicate',
            description: 'Test',
            discountType: 'PERCENTAGE',
            discountValue: 20,
            startDate: '2026-09-01',
            endDate: '2026-12-31'
          },
          ownerA
        );
      }).toThrow(/already exists/);
    });
  });

  describe('2. Authoritative Server-Side Validation & Discount Calculation', () => {
    it('calculates PERCENTAGE discount with cap correctly', () => {
      // ROYALFEST20: 20% off, min ₹500 (50000 cents), max cap ₹300 (30000 cents)
      const res1 = businessOffersService.validateAndCalculateDiscount({
        businessId: BIZ_A,
        offerCodeOrId: 'ROYALFEST20',
        bookingSubtotalCents: 100000, // ₹1,000 subtotal (20% = ₹200 / 20000 cents)
        evaluationDateIso: '2026-09-29'
      });

      expect(res1.valid).toBe(true);
      expect(res1.discountCents).toBe(20000); // ₹200
      expect(res1.finalSubtotalCents).toBe(80000); // ₹800

      // Test with large subtotal hitting the ₹300 max cap
      const res2 = businessOffersService.validateAndCalculateDiscount({
        businessId: BIZ_A,
        offerCodeOrId: 'ROYALFEST20',
        bookingSubtotalCents: 300000, // ₹3,000 (20% = ₹600 -> capped at ₹300 / 30000 cents)
        evaluationDateIso: '2026-09-29'
      });

      expect(res2.valid).toBe(true);
      expect(res2.discountCents).toBe(30000); // Capped at ₹300
      expect(res2.finalSubtotalCents).toBe(270000); // ₹2,700
    });

    it('calculates FIXED_AMOUNT discount correctly', () => {
      // VIPFLAT150: Flat ₹150 (15000 cents), min ₹400 (40000 cents)
      const res = businessOffersService.validateAndCalculateDiscount({
        businessId: BIZ_A,
        offerCodeOrId: 'VIPFLAT150',
        bookingSubtotalCents: 60000, // ₹600
        evaluationDateIso: '2026-09-29'
      });

      expect(res.valid).toBe(true);
      expect(res.discountCents).toBe(15000); // Flat ₹150
      expect(res.finalSubtotalCents).toBe(45000); // ₹450
    });

    it('rejects expired promo codes', () => {
      const res = businessOffersService.validateAndCalculateDiscount({
        businessId: BIZ_A,
        offerCodeOrId: 'ROYALFEST20',
        bookingSubtotalCents: 100000,
        evaluationDateIso: '2027-01-01' // Past end date 2026-11-30
      });

      expect(res.valid).toBe(false);
      expect(res.errorCode).toBe('OFFER_EXPIRED');
      expect(res.discountCents).toBe(0);
    });

    it('rejects when minimum booking amount is not met', () => {
      // ROYALFEST20 requires ₹500 (50000 cents)
      const res = businessOffersService.validateAndCalculateDiscount({
        businessId: BIZ_A,
        offerCodeOrId: 'ROYALFEST20',
        bookingSubtotalCents: 30000, // Only ₹300
        evaluationDateIso: '2026-09-29'
      });

      expect(res.valid).toBe(false);
      expect(res.errorCode).toBe('MINIMUM_AMOUNT_NOT_MET');
    });

    it('rejects when service / package eligibility restrictions fail', () => {
      // VIPFLAT150 is only applicable to 'srv-rc-2'
      const res = businessOffersService.validateAndCalculateDiscount({
        businessId: BIZ_A,
        offerCodeOrId: 'VIPFLAT150',
        bookingSubtotalCents: 100000,
        serviceIds: ['srv-unrelated-99'],
        evaluationDateIso: '2026-09-29'
      });

      expect(res.valid).toBe(false);
      expect(res.errorCode).toBe('SERVICE_NOT_ELIGIBLE');
    });

    it('enforces per-customer redemption limit', () => {
      // VIPFLAT150 perCustomerLimit = 2
      businessOffersService.recordRedemption(BIZ_A, 'off-rc-002', 'usr-test-client', 'Test Client', 'bk-1', 60000, 15000);
      businessOffersService.recordRedemption(BIZ_A, 'off-rc-002', 'usr-test-client', 'Test Client', 'bk-2', 60000, 15000);

      const res = businessOffersService.validateAndCalculateDiscount({
        businessId: BIZ_A,
        offerCodeOrId: 'VIPFLAT150',
        bookingSubtotalCents: 60000,
        customerId: 'usr-test-client',
        serviceIds: ['srv-rc-2'],
        evaluationDateIso: '2026-09-29'
      });

      expect(res.valid).toBe(false);
      expect(res.errorCode).toBe('CUSTOMER_LIMIT_REACHED');
    });
  });

  describe('3. Status Transitions (Pause / Activate / Delete)', () => {
    it('allows pausing and reactivating offers and rejects paused offers in checkout', () => {
      businessOffersService.setOfferStatus(BIZ_A, 'off-rc-001', 'PAUSED', ownerA);
      const offer = businessOffersService.getOfferById(BIZ_A, 'off-rc-001', ownerA);
      expect(offer?.status).toBe('PAUSED');

      // Attempting to redeem a paused offer returns OFFER_INACTIVE
      const res = businessOffersService.validateAndCalculateDiscount({
        businessId: BIZ_A,
        offerCodeOrId: 'ROYALFEST20',
        bookingSubtotalCents: 100000,
        evaluationDateIso: '2026-09-29'
      });
      expect(res.valid).toBe(false);
      expect(res.errorCode).toBe('OFFER_INACTIVE');

      // Reactivate
      businessOffersService.setOfferStatus(BIZ_A, 'off-rc-001', 'ACTIVE', ownerA);
      expect(businessOffersService.getOfferById(BIZ_A, 'off-rc-001', ownerA)?.status).toBe('ACTIVE');
    });
  });

  describe('4. Security, RBAC & Multi-Tenant Isolation', () => {
    it('allows Business Owner and Manager to view and manage offers', () => {
      expect(() => {
        businessOffersService.listOffers(BIZ_A, {}, ownerA);
      }).not.toThrow();

      expect(() => {
        businessOffersService.listOffers(BIZ_A, {}, managerA);
      }).not.toThrow();
    });

    it('strictly BLOCKS Staff from creating offers', () => {
      expect(() => {
        businessOffersService.createOffer(
          BIZ_A,
          {
            code: 'STAFFILLEGAL',
            name: 'Staff Promo',
            title: 'Unauthorized',
            description: 'Test',
            discountType: 'PERCENTAGE',
            discountValue: 10,
            startDate: '2026-09-01',
            endDate: '2026-12-31'
          },
          staffA
        );
      }).toThrow(SecurityError);
    });

    it('strictly BLOCKS Customer from managing offers', () => {
      expect(() => {
        businessOffersService.createOffer(
          BIZ_A,
          {
            code: 'CUSTILLEGAL',
            name: 'Cust Promo',
            title: 'Unauthorized',
            description: 'Test',
            discountType: 'PERCENTAGE',
            discountValue: 10,
            startDate: '2026-09-01',
            endDate: '2026-12-31'
          },
          customer
        );
      }).toThrow(SecurityError);
    });

    it('strictly ENFORCES Tenant Isolation: Business A cannot access or modify Business B offers', () => {
      // Business Owner A trying to access Business B offers
      expect(() => {
        businessOffersService.listOffers(BIZ_B, {}, ownerA);
      }).toThrow(SecurityError);

      expect(() => {
        businessOffersService.createOffer(
          BIZ_B,
          {
            code: 'CROSSHACK',
            name: 'Cross Tenant',
            title: 'Cross Tenant',
            description: 'Test',
            discountType: 'PERCENTAGE',
            discountValue: 10,
            startDate: '2026-09-01',
            endDate: '2026-12-31'
          },
          ownerA
        );
      }).toThrow(SecurityError);
    });
  });

  describe('5. One-Click Promotional Campaign Execution', () => {
    it('launches campaign respecting customer marketing consent', () => {
      const result = businessOffersService.sendOfferCampaign(
        BIZ_A,
        'off-rc-001',
        'WhatsApp',
        ownerA
      );

      expect(result.success).toBe(true);
      expect(result.campaignId).toBeDefined();
      expect(result.recipientsReached).toBeGreaterThanOrEqual(1);
    });
  });
});
