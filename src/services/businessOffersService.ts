// Nexora SalonOS — Business Admin Offers & Discounts Service (Phase 7.17)
// Multi-Tenant Isolation, Authoritative Server-Side Validation, Campaign Integration, and RBAC

import {
  BusinessOffer,
  CreateOfferPayload,
  UpdateOfferPayload,
  OfferValidationRequest,
  OfferValidationResult,
  OfferRedemptionRecord,
  OfferStatus
} from '../types/offers';
import { UserSession } from './authContext';
import { assertPermission, enforceTenantIsolation, SecurityError } from '../lib/permissions';
import { auditLogService } from './auditLogService';
import { crmCampaignsService } from './crmCampaignsService';
import { DeliveryChannel, CampaignTargetSegment } from '../types/crmCampaigns';

const SEEDED_OFFERS: BusinessOffer[] = [
  // 1. Royal Crown Barber Offers (biz-barber-01)
  {
    id: 'off-rc-001',
    businessId: 'biz-barber-01',
    code: 'ROYALFEST20',
    name: 'Festive Royal Grooming Special',
    title: '20% Off Artisanal Grooming & Shaves',
    description: 'Enjoy 20% discount on all Master haircuts and hot towel razor rituals.',
    discountType: 'PERCENTAGE',
    discountValue: 20, // 20%
    minimumBookingAmountCents: 50000, // ₹500
    maxDiscountCents: 30000, // ₹300 max
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    usageLimit: 200,
    usageCount: 42,
    perCustomerLimit: 1,
    targetSegment: 'ALL',
    applicableServices: ['srv-rc-1', 'srv-rc-2', 'srv-rc-3'],
    applicablePackages: ['pkg-rc-executive-ritual'],
    status: 'ACTIVE',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z',
    createdById: 'usr-owner-1'
  },
  {
    id: 'off-rc-002',
    businessId: 'biz-barber-01',
    code: 'VIPFLAT150',
    name: 'VIP Client Exclusive Flat Reward',
    title: 'Flat ₹150 Off on Royal Beard Sculpting',
    description: 'Exclusive seasonal reward for our top tier returning clients.',
    discountType: 'FIXED_AMOUNT',
    discountValue: 15000, // ₹150 in cents
    minimumBookingAmountCents: 40000, // ₹400
    maxDiscountCents: null,
    startDate: '2026-09-15',
    endDate: '2026-10-31',
    usageLimit: 100,
    usageCount: 18,
    perCustomerLimit: 2,
    targetSegment: 'VIP',
    applicableServices: ['srv-rc-2'],
    applicablePackages: [],
    status: 'ACTIVE',
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-09-25T14:00:00Z',
    createdById: 'usr-owner-1'
  },
  {
    id: 'off-rc-003',
    businessId: 'biz-barber-01',
    code: 'WELCOME10',
    name: 'New Client Welcome Discount',
    title: '10% Off First Appointment',
    description: 'Welcome discount for first-time visitors to Royal Crown.',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minimumBookingAmountCents: 30000, // ₹300
    maxDiscountCents: 15000, // ₹150 max
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: null,
    usageCount: 89,
    perCustomerLimit: 1,
    targetSegment: 'NEW',
    applicableServices: [],
    applicablePackages: [],
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    createdById: 'usr-owner-1'
  },

  // 2. Glow & Grace Spa Offers (biz-spa-02)
  {
    id: 'off-spa-001',
    businessId: 'biz-spa-02',
    code: 'SPASANCTUARY25',
    name: 'Sanctuary Spa Package 25% Off',
    title: '25% Off Full Sanctuary Renewal',
    description: 'Restorative escape: Deep Tissue Muscle Release bundled with Himalayan Salt Scrub.',
    discountType: 'PERCENTAGE',
    discountValue: 25,
    minimumBookingAmountCents: 200000, // ₹2,000
    maxDiscountCents: 100000, // ₹1,000 max
    startDate: '2026-09-01',
    endDate: '2026-12-15',
    usageLimit: 50,
    usageCount: 14,
    perCustomerLimit: 1,
    targetSegment: 'RETURNING',
    applicableServices: ['srv-spa-2', 'srv-spa-3'],
    applicablePackages: ['pkg-spa-sanctuary-escape'],
    status: 'ACTIVE',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-28T12:00:00Z',
    createdById: 'usr-owner-2'
  }
];

export class BusinessOffersService {
  private offers: Map<string, BusinessOffer> = new Map();
  private redemptions: OfferRedemptionRecord[] = [];

  constructor(initialOffers = SEEDED_OFFERS) {
    initialOffers.forEach((o) => this.offers.set(o.id, { ...o }));
  }

  private normalizeBusinessId(bizId: string): string {
    if (bizId === 'biz-barber-001') return 'biz-barber-01';
    if (bizId === 'biz-spa-002') return 'biz-spa-02';
    return bizId;
  }

  private verifyTenantIsolation(targetBusinessId: string, requestorBusinessId: string): boolean {
    if (requestorBusinessId === 'platform_wide') return true;
    return this.normalizeBusinessId(targetBusinessId) === this.normalizeBusinessId(requestorBusinessId);
  }

  /**
   * List offers for a business with optional status filter
   */
  public listOffers(
    businessId: string,
    filter?: { status?: OfferStatus | 'ALL'; targetSegment?: string },
    userSession?: UserSession | null
  ): BusinessOffer[] {
    const normId = this.normalizeBusinessId(businessId);
    if (userSession && userSession.role !== 'SUPER_ADMIN') {
      enforceTenantIsolation(userSession, normId, 'Offers');
    }

    let list = Array.from(this.offers.values()).filter(
      (o) => this.normalizeBusinessId(o.businessId) === normId
    );

    // Auto-update EXPIRED status based on current date
    const today = new Date().toISOString().split('T')[0];
    list = list.map((o) => {
      if (o.status === 'ACTIVE' && o.endDate < today) {
        o.status = 'EXPIRED';
      }
      return o;
    });

    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter((o) => o.status === filter.status);
    }
    if (filter?.targetSegment && filter.targetSegment !== 'ALL') {
      list = list.filter((o) => o.targetSegment === filter.targetSegment || o.targetSegment === 'ALL');
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get single offer by ID
   */
  public getOfferById(
    businessId: string,
    offerId: string,
    userSession?: UserSession | null
  ): BusinessOffer | null {
    const normId = this.normalizeBusinessId(businessId);
    if (userSession && userSession.role !== 'SUPER_ADMIN') {
      enforceTenantIsolation(userSession, normId, 'Offers');
    }

    const offer = this.offers.get(offerId);
    if (!offer) return null;
    if (this.normalizeBusinessId(offer.businessId) !== normId) {
      return null;
    }
    return { ...offer };
  }

  /**
   * Create new Offer
   */
  public createOffer(
    businessId: string,
    payload: CreateOfferPayload,
    userSession: UserSession | null
  ): BusinessOffer {
    const normId = this.normalizeBusinessId(businessId);
    assertPermission(userSession, 'Offers', 'create', { targetBusinessId: normId });
    enforceTenantIsolation(userSession, normId, 'Offers');

    // Code uniqueness check within business
    const existingCode = Array.from(this.offers.values()).find(
      (o) =>
        this.normalizeBusinessId(o.businessId) === normId &&
        o.code.toUpperCase() === payload.code.toUpperCase().trim()
    );
    if (existingCode) {
      throw new Error(`An offer with promo code "${payload.code.toUpperCase()}" already exists.`);
    }

    const id = `off-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`;
    const now = new Date().toISOString();

    const newOffer: BusinessOffer = {
      id,
      businessId: normId,
      code: payload.code.toUpperCase().trim(),
      name: payload.name.trim(),
      title: payload.title.trim(),
      description: payload.description.trim(),
      discountType: payload.discountType,
      discountValue: payload.discountValue,
      minimumBookingAmountCents: payload.minimumBookingAmountCents || 0,
      maxDiscountCents: payload.maxDiscountCents || null,
      startDate: payload.startDate,
      endDate: payload.endDate,
      usageLimit: payload.usageLimit || null,
      usageCount: 0,
      perCustomerLimit: payload.perCustomerLimit || 1,
      targetSegment: payload.targetSegment || 'ALL',
      applicableServices: payload.applicableServices || [],
      applicablePackages: payload.applicablePackages || [],
      status: payload.status || 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      createdById: userSession?.userId || 'usr-unknown'
    };

    this.offers.set(id, newOffer);

    // Audit log
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
      entityId: id,
      metadata: {
        action: 'OFFER_CREATED',
        offerCode: newOffer.code,
        discountType: newOffer.discountType,
        discountValue: newOffer.discountValue
      }
    });

    return { ...newOffer };
  }

  /**
   * Update existing offer
   */
  public updateOffer(
    businessId: string,
    offerId: string,
    payload: UpdateOfferPayload,
    userSession: UserSession | null
  ): BusinessOffer {
    const normId = this.normalizeBusinessId(businessId);
    assertPermission(userSession, 'Offers', 'edit', { targetBusinessId: normId });
    enforceTenantIsolation(userSession, normId, 'Offers');

    const existing = this.offers.get(offerId);
    if (!existing || this.normalizeBusinessId(existing.businessId) !== normId) {
      throw new Error('Offer not found or unauthorized tenant access');
    }

    const updated: BusinessOffer = {
      ...existing,
      ...payload,
      code: payload.code ? payload.code.toUpperCase().trim() : existing.code,
      updatedAt: new Date().toISOString()
    };

    this.offers.set(offerId, updated);

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
      entityId: offerId,
      metadata: {
        action: 'OFFER_UPDATED',
        offerCode: updated.code
      }
    });

    return { ...updated };
  }

  /**
   * Toggle status (e.g. ACTIVE -> PAUSED, or PAUSED -> ACTIVE)
   */
  public setOfferStatus(
    businessId: string,
    offerId: string,
    status: OfferStatus,
    userSession: UserSession | null
  ): BusinessOffer {
    return this.updateOffer(businessId, offerId, { status }, userSession);
  }

  /**
   * Delete / Archive Offer
   */
  public deleteOffer(
    businessId: string,
    offerId: string,
    userSession: UserSession | null
  ): boolean {
    const normId = this.normalizeBusinessId(businessId);
    assertPermission(userSession, 'Offers', 'delete', { targetBusinessId: normId });
    enforceTenantIsolation(userSession, normId, 'Offers');

    const existing = this.offers.get(offerId);
    if (!existing || this.normalizeBusinessId(existing.businessId) !== normId) {
      throw new Error('Offer not found or unauthorized tenant access');
    }

    this.offers.delete(offerId);

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
      entityId: offerId,
      metadata: {
        action: 'OFFER_DELETED',
        offerCode: existing.code
      }
    });

    return true;
  }

  /**
   * AUTHORITATIVE SERVER-SIDE DISCOUNT VALIDATION & CALCULATION ENGINE
   * Never trusts client-sent discount amounts.
   */
  public validateAndCalculateDiscount(request: OfferValidationRequest): OfferValidationResult {
    const normId = this.normalizeBusinessId(request.businessId);
    const subtotal = request.bookingSubtotalCents;

    // 1. Locate Offer by Code or ID
    const query = request.offerCodeOrId.trim().toUpperCase();
    const offer = Array.from(this.offers.values()).find(
      (o) =>
        this.normalizeBusinessId(o.businessId) === normId &&
        (o.id === request.offerCodeOrId || o.code.toUpperCase() === query)
    );

    if (!offer) {
      return {
        valid: false,
        discountCents: 0,
        finalSubtotalCents: subtotal,
        errorCode: 'OFFER_NOT_FOUND',
        reason: `Promo code "${request.offerCodeOrId}" is invalid or does not exist for this salon.`
      };
    }

    // 2. Status Validation
    if (offer.status !== 'ACTIVE') {
      return {
        valid: false,
        offer,
        discountCents: 0,
        finalSubtotalCents: subtotal,
        errorCode: 'OFFER_INACTIVE',
        reason: `Offer "${offer.code}" is currently ${offer.status.toLowerCase()} and cannot be redeemed.`
      };
    }

    // 3. Date Horizon Validation
    const evalDate = request.evaluationDateIso
      ? request.evaluationDateIso.split('T')[0]
      : new Date().toISOString().split('T')[0];

    if (evalDate < offer.startDate) {
      return {
        valid: false,
        offer,
        discountCents: 0,
        finalSubtotalCents: subtotal,
        errorCode: 'OFFER_NOT_STARTED',
        reason: `Offer "${offer.code}" is valid starting from ${offer.startDate}.`
      };
    }

    if (evalDate > offer.endDate) {
      return {
        valid: false,
        offer,
        discountCents: 0,
        finalSubtotalCents: subtotal,
        errorCode: 'OFFER_EXPIRED',
        reason: `Offer "${offer.code}" expired on ${offer.endDate}.`
      };
    }

    // 4. Global Usage Limit Check
    if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
      return {
        valid: false,
        offer,
        discountCents: 0,
        finalSubtotalCents: subtotal,
        errorCode: 'USAGE_LIMIT_REACHED',
        reason: `Offer "${offer.code}" has reached its maximum total redemptions limit.`
      };
    }

    // 5. Per-Customer Usage Limit Check
    if (request.customerId && offer.perCustomerLimit) {
      const customerRedemptions = this.redemptions.filter(
        (r) => r.offerId === offer.id && r.customerId === request.customerId
      ).length;

      if (customerRedemptions >= offer.perCustomerLimit) {
        return {
          valid: false,
          offer,
          discountCents: 0,
          finalSubtotalCents: subtotal,
          errorCode: 'CUSTOMER_LIMIT_REACHED',
          reason: `You have already redeemed this promo code the maximum allowed times (${offer.perCustomerLimit}).`
        };
      }
    }

    // 6. Minimum Booking Amount Check
    if (subtotal < offer.minimumBookingAmountCents) {
      const minFormatted = (offer.minimumBookingAmountCents / 100).toFixed(0);
      return {
        valid: false,
        offer,
        discountCents: 0,
        finalSubtotalCents: subtotal,
        errorCode: 'MINIMUM_AMOUNT_NOT_MET',
        reason: `Minimum booking value of ₹${minFormatted} is required to apply "${offer.code}".`
      };
    }

    // 7. Applicable Services / Packages Eligibility Check
    const hasServiceRestrictions = offer.applicableServices && offer.applicableServices.length > 0;
    const hasPackageRestrictions = offer.applicablePackages && offer.applicablePackages.length > 0;

    if (hasServiceRestrictions || hasPackageRestrictions) {
      const selectedServices = request.serviceIds;
      const selectedPackages = request.packageIds;

      // If specific service or package IDs are passed in the request, enforce matching
      if (selectedServices !== undefined || selectedPackages !== undefined) {
        const servicesList = selectedServices || [];
        const packagesList = selectedPackages || [];

        const serviceMatches = servicesList.some((s) => offer.applicableServices.includes(s));
        const packageMatches = packagesList.some((p) => offer.applicablePackages.includes(p));

        if (!serviceMatches && !packageMatches) {
          return {
            valid: false,
            offer,
            discountCents: 0,
            finalSubtotalCents: subtotal,
            errorCode: 'SERVICE_NOT_ELIGIBLE',
            reason: `Offer "${offer.code}" is only applicable to selected services or packages.`
          };
        }
      }
    }

    // 8. Authoritative Discount Calculation
    let discountCents = 0;
    if (offer.discountType === 'PERCENTAGE') {
      discountCents = Math.round(subtotal * (offer.discountValue / 100));
      if (offer.maxDiscountCents && offer.maxDiscountCents > 0) {
        discountCents = Math.min(discountCents, offer.maxDiscountCents);
      }
    } else {
      // FIXED_AMOUNT
      discountCents = Math.min(subtotal, offer.discountValue);
    }

    const finalSubtotalCents = Math.max(0, subtotal - discountCents);

    return {
      valid: true,
      offer,
      discountCents,
      finalSubtotalCents,
      reason: `Promo code "${offer.code}" applied successfully! You saved ₹${(discountCents / 100).toFixed(0)}.`
    };
  }

  /**
   * Record actual redemption upon successful booking completion
   */
  public recordRedemption(
    businessId: string,
    offerId: string,
    customerId: string,
    customerName: string,
    bookingId: string,
    subtotalCents: number,
    discountCents: number
  ): OfferRedemptionRecord {
    const normId = this.normalizeBusinessId(businessId);
    const offer = this.offers.get(offerId);
    if (offer) {
      offer.usageCount += 1;
      offer.updatedAt = new Date().toISOString();
    }

    const rec: OfferRedemptionRecord = {
      id: `red-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`,
      offerId,
      businessId: normId,
      customerId,
      customerName,
      bookingId,
      discountAppliedCents: discountCents,
      orderSubtotalCents: subtotalCents,
      timestamp: new Date().toISOString()
    };

    this.redemptions.push(rec);
    return rec;
  }

  /**
   * ONE-CLICK CAMPAIGN EXECUTION
   * Connects to existing crmCampaignsService and respects customer opt-in consent
   */
  public sendOfferCampaign(
    businessId: string,
    offerId: string,
    channel: DeliveryChannel = 'WhatsApp',
    userSession: UserSession | null
  ): { success: boolean; campaignId: string; recipientsReached: number; offerCode: string } {
    const normId = this.normalizeBusinessId(businessId);
    assertPermission(userSession, 'Offers', 'edit', { targetBusinessId: normId });
    enforceTenantIsolation(userSession, normId, 'Offers');

    const offer = this.offers.get(offerId);
    if (!offer || this.normalizeBusinessId(offer.businessId) !== normId) {
      throw new Error('Offer not found or unauthorized tenant access');
    }

    // Map segment
    const segMap: Record<string, CampaignTargetSegment> = {
      ALL: 'ALL',
      NEW: 'ALL',
      RETURNING: 'RETURNING',
      VIP: 'VIP',
      INACTIVE: 'INACTIVE',
      BIRTHDAY_MONTH: 'BIRTHDAY_MONTH',
      DUE_FOR_VISIT: 'DUE_FOR_VISIT'
    };
    const targetSeg = segMap[offer.targetSegment] || 'ALL';

    const discountFormatted =
      offer.discountType === 'PERCENTAGE'
        ? `${offer.discountValue}% OFF`
        : `Flat ₹${(offer.discountValue / 100).toFixed(0)} OFF`;

    const { campaign, recipientsReached } = crmCampaignsService.launchOneClickCampaign(normId, {
      campaignName: `${offer.code} — ${offer.name}`,
      offerTitle: offer.title,
      offerMessage: `${offer.description} Use code ${offer.code} at checkout to get ${discountFormatted}! Valid until ${offer.endDate}.`,
      discountType: offer.discountType === 'PERCENTAGE' ? 'PERCENTAGE' : 'FIXED',
      discountValue: offer.discountType === 'PERCENTAGE' ? offer.discountValue : offer.discountValue / 100,
      startDate: offer.startDate,
      endDate: offer.endDate,
      applicableServices: offer.applicableServices,
      ctaText: `Claim ${offer.code}`,
      channel,
      targetSegment: targetSeg
    });

    return {
      success: true,
      campaignId: campaign.campaignId,
      recipientsReached,
      offerCode: offer.code
    };
  }
}

export const businessOffersService = new BusinessOffersService();
