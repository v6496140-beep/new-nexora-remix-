// Nexora SalonOS — Phase 7.17 Business Admin Offers & Discounts Type Contracts

export type OfferDiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export type OfferStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED';

export type OfferTargetSegment = 
  | 'ALL' 
  | 'NEW' 
  | 'RETURNING' 
  | 'VIP' 
  | 'INACTIVE' 
  | 'BIRTHDAY_MONTH' 
  | 'DUE_FOR_VISIT';

export interface BusinessOffer {
  id: string;
  businessId: string;
  code: string; // e.g. "ROYALFEST20"
  name: string; // e.g. "Festive Grooming Discount"
  title: string; // e.g. "20% Off Royal Treatment"
  description: string;
  discountType: OfferDiscountType;
  discountValue: number; // e.g. 20 (for 20%) or 15000 (cents, ₹150)
  minimumBookingAmountCents: number; // e.g. 50000 (cents, ₹500)
  maxDiscountCents?: number | null; // e.g. 30000 (cents, ₹300 cap)
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  usageLimit?: number | null; // Total redemptions allowed across all clients
  usageCount: number; // Total redemptions executed
  perCustomerLimit: number; // Max redemptions per individual customer (e.g. 1)
  targetSegment: OfferTargetSegment;
  applicableServices: string[]; // Service IDs or names (empty = all services)
  applicablePackages: string[]; // Package IDs or names (empty = all packages)
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

export interface CreateOfferPayload {
  code: string;
  name: string;
  title: string;
  description: string;
  discountType: OfferDiscountType;
  discountValue: number;
  minimumBookingAmountCents?: number;
  maxDiscountCents?: number | null;
  startDate: string;
  endDate: string;
  usageLimit?: number | null;
  perCustomerLimit?: number;
  targetSegment?: OfferTargetSegment;
  applicableServices?: string[];
  applicablePackages?: string[];
  status?: OfferStatus;
}

export interface UpdateOfferPayload extends Partial<CreateOfferPayload> {
  status?: OfferStatus;
}

export interface OfferValidationRequest {
  businessId: string;
  offerCodeOrId: string;
  bookingSubtotalCents: number;
  customerId?: string;
  serviceIds?: string[];
  packageIds?: string[];
  evaluationDateIso?: string;
}

export interface OfferValidationResult {
  valid: boolean;
  offer?: BusinessOffer;
  discountCents: number;
  finalSubtotalCents: number;
  reason?: string;
  errorCode?: 
    | 'OFFER_NOT_FOUND'
    | 'OFFER_INACTIVE'
    | 'OFFER_EXPIRED'
    | 'OFFER_NOT_STARTED'
    | 'USAGE_LIMIT_REACHED'
    | 'CUSTOMER_LIMIT_REACHED'
    | 'MINIMUM_AMOUNT_NOT_MET'
    | 'SERVICE_NOT_ELIGIBLE';
}

export interface OfferRedemptionRecord {
  id: string;
  offerId: string;
  businessId: string;
  customerId: string;
  customerName: string;
  bookingId?: string;
  discountAppliedCents: number;
  orderSubtotalCents: number;
  timestamp: string;
}
