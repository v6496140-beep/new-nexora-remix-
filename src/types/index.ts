// Nexora SalonOS — Foundational Data Contracts (Phase 3.1)
// Clean domain models supporting Multi-tenant SaaS, Category Templates, Booking Engine, Financial Ledger, and Super Admin.

/**
 * Platform Core Roles across multi-tenant boundaries
 */
export type UserRole = 'SUPER_ADMIN' | 'BUSINESS_OWNER' | 'MANAGER' | 'STAFF' | 'CUSTOMER';

/**
 * Seven standardized business categories
 */
export type BusinessCategory =
  | 'barber'
  | 'hair_salon'
  | 'beauty'
  | 'nail'
  | 'spa'
  | 'massage'
  | 'tattoo';

/**
 * Standard booking statuses throughout the customer & salon lifecycle
 */
export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'checked_in'
  | 'in_service'
  | 'completed'
  | 'cancelled_by_customer'
  | 'cancelled_by_salon'
  | 'no_show';

/**
 * Payment and settlement lifecycle statuses
 */
export type PaymentStatus =
  | 'initiated'
  | 'captured'
  | 'refunded'
  | 'partially_refunded'
  | 'failed';

export type SettlementStatus =
  | 'pending'
  | 'processing'
  | 'settled'
  | 'on_hold'
  | 'failed';

/**
 * Business verification lifecycle
 */
export type VerificationStatus = 
  | 'pending'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'suspended';

/**
 * Design system theme presets supported by template generator
 */
export type ThemePreset =
  | 'luxury'
  | 'minimal'
  | 'modern'
  | 'bold'
  | 'elegant'
  | 'dark';

// -------------------------------------------------------------
// USER & AUTH CONTRACTS
// -------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: UserRole;
  tenantId?: string; // Nullable for global SUPER_ADMIN
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// MULTI-TENANT BUSINESS CONTRACT
// -------------------------------------------------------------

export interface BusinessConfig {
  advancePaymentPercentage: number; // e.g., 25 (%)
  cancellationWindowHours: number; // e.g., 4 hours
  slotIntervalMinutes: number; // e.g., 15, 30
  currency: string; // e.g., "INR"
  currencySymbol: string; // e.g., "₹"
  taxGstRate: number; // e.g., 18 (%)
  taxTdsRate: number; // e.g., 10 (%)
  enableOnlineAdvance: boolean;
  enableWalkins: boolean;
}

export interface Business {
  id: string;
  code: string; // e.g. "NEX-BOM-004"
  slug: string; // e.g. "the-royal-crown"
  name: string;
  tagline?: string;
  category: BusinessCategory;
  ownerId: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  postalCode: string;
  country: string;
  logoUrl?: string;
  config: BusinessConfig;
  templateId: string;
  themeId: string;
  status: 'active' | 'suspended' | 'pending_verification';
  // Preferred verification fields
  verificationStatus: VerificationStatus;
  verificationSubmittedAt?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  rejectionReason?: string | null;
  suspensionReason?: string | null;
  verificationNotes?: string | null;
  isFeatured?: boolean;
  featuredUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export * from './verification';

// -------------------------------------------------------------
// THEME & TEMPLATE CONTRACTS
// -------------------------------------------------------------

export interface ThemeTokens {
  preset: ThemePreset;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  fontFamilyHeading: string;
  fontFamilyBody: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  buttonStyle: 'sharp' | 'rounded' | 'pill';
  spacingDensity: 'compact' | 'comfortable' | 'spacious';
}

export interface WebsiteTheme {
  id: string;
  businessId: string;
  tokens: ThemeTokens;
  updatedAt: string;
}

export interface CategoryTemplate {
  id: string;
  category: BusinessCategory;
  name: string;
  description: string;
  defaultThemePreset: ThemePreset;
  defaultServiceIds: string[];
  defaultPackageIds: string[];
  defaultSectionKeys: string[];
  isGlobal: boolean;
}

// -------------------------------------------------------------
// SERVICES & PACKAGES
// -------------------------------------------------------------

export interface Service {
  id: string;
  businessId: string;
  name: string;
  categoryTag: string;
  description: string;
  durationMinutes: number;
  bufferMinutes: number;
  basePrice: number;
  discountPrice?: number;
  isPopular?: boolean;
  isActive: boolean;
  assignedStaffIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PackageItem {
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
}

export interface ServicePackage {
  id: string;
  businessId: string;
  name: string;
  description: string;
  badgeLabel?: string;
  services: PackageItem[];
  totalDurationMinutes: number;
  originalPrice: number;
  bundlePrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// STAFF & ROSTER
// -------------------------------------------------------------

export interface StaffScheduleDay {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0
  isOpen: boolean;
  startTime: string; // "09:00"
  endTime: string; // "20:00"
  breakStartTime?: string;
  breakEndTime?: string;
}

export interface Staff {
  id: string;
  businessId: string;
  userId?: string;
  name: string;
  email?: string;
  phone?: string;
  roleTitle: string; // e.g., "Master Barber", "Lead Colorist"
  specializations: string[];
  avatarUrl?: string;
  avatarInitials: string;
  ratingAverage: number;
  totalReviews: number;
  weeklySchedule: StaffScheduleDay[];
  commissionPercentage: number; // e.g. 30 (%)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// BOOKING & APPOINTMENT CONTRACTS
// -------------------------------------------------------------

export interface BookingFinancials {
  subtotal: number;
  discountAmount: number;
  taxAmount: number; // Calculated GST
  totalGrossAmount: number;
  advancePercentage: number; // e.g., 25 (%)
  advanceAmountRequired: number; // 25% of totalGrossAmount
  advanceAmountPaid: number;
  outstandingBalanceAtVenue: number;
}

export interface Booking {
  id: string;
  code: string; // e.g. "NEX-88219"
  businessId: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId?: string;
  serviceName: string;
  packageId?: string;
  packageName?: string;
  staffId: string; // Specific specialist or 'ANY_AVAILABLE'
  staffName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "11:15"
  endTime: string; // "12:00"
  durationMinutes: number;
  status: BookingStatus;
  financials: BookingFinancials;
  customerNotes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// PAYMENTS, TRANSACTIONS & SETTLEMENTS
// -------------------------------------------------------------

export interface Payment {
  id: string;
  businessId: string;
  bookingId: string;
  bookingCode: string;
  amount: number;
  currency: string;
  type: 'advance_online' | 'venue_pos_balance' | 'refund';
  method: 'upi' | 'card' | 'netbanking' | 'pos_terminal' | 'cash';
  gatewayProvider: 'razorpay' | 'stripe' | 'phonepe' | 'cash_pos';
  gatewayReference?: string;
  status: PaymentStatus;
  createdAt: string;
  settlementId?: string;
}

export interface PlatformTransaction {
  id: string;
  txnReference: string; // e.g. "TXN-NEX-99841"
  businessId: string;
  businessName: string;
  bookingId: string;
  bookingCode: string;
  grossAmount: number;
  platformCommissionRate: number; // e.g. 0.05 (5%)
  platformCommissionAmount: number;
  gstAmount: number; // Standard 18% GST split
  netPayableToBusiness: number;
  status: SettlementStatus;
  bankUtr?: string;
  settlementBatchId?: string;
  timestamp: string;
}

export * from './servicePackageConfig';
export * from './staffSchedule';
export * from './slotEngine';
export * from './paymentEngine';
export * from './bookingFlow';
