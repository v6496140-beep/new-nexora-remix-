// Nexora SalonOS — Complete Unified Customer Growth CRM Types (Phase 6.8 & Legacy Compat)

export type CrmSegmentType =
  | 'NEW'
  | 'RETURNING'
  | 'VIP'
  | 'INACTIVE'
  | 'BIRTHDAY_MONTH'
  | 'DUE_FOR_VISIT'
  | 'HIGH_SPENDING'
  | 'FREQUENT';

export type CustomerStatus = 'NEW' | 'ACTIVE' | 'INACTIVE' | 'VIP';

export interface CustomerFilterParams {
  searchQuery?: string;
  tag?: string;
  status?: string;
  customerType?: string;
}

export interface DuplicateDetectionResult {
  isPotentialDuplicate: boolean;
  matchReason?: string;
}

export interface CrmNote {
  id: string;
  content: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
}

export interface CrmCustomer {
  customerId: string;
  businessId: string; // Tenant Isolation
  name: string;
  phone: string;
  email: string;
  dob?: string; // YYYY-MM-DD
  gender?: string;
  lastVisit?: string; // YYYY-MM-DD
  nextBooking?: string; // YYYY-MM-DD
  totalVisits: number;
  totalSpendCents: number;
  favoriteServices: string[];
  tags: string[];
  notes: any; // Can be string or CrmNote[] for backward compatibility
  marketingConsent: boolean;
  whatsappOptIn: boolean;
  emailConsent: boolean;
  smsConsent: boolean;

  // Legacy fields
  id: string;
  tenantId: string;
  status: string;
  createdAt: string;
  lastVisitAt?: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  avatar?: string;
  totalSpend: number; // legacy getter fallback
  dateOfBirth?: string; // legacy dob fallback
}

export type CustomerProfile = CrmCustomer; // legacy alias

export interface TimelineEvent {
  eventId: string;
  customerId: string;
  type: 'BOOKING' | 'PAYMENT' | 'VISIT' | 'REVIEW' | 'OFFER_SENT' | 'OFFER_REDEEMED' | 'MESSAGE_SENT' | 'CUSTOMER_CREATED' | 'BOOKING_CREATED' | 'BOOKING_CONFIRMED' | 'VISIT_COMPLETED' | 'BOOKING_CANCELLED';
  timestamp: string;
  title: string;
  description: string;
  // legacy alias
  id?: string;
}

export function calculateCustomerStatus(customer: any, referenceDateIso?: string): string {
  const refDate = referenceDateIso ? new Date(referenceDateIso) : new Date();
  
  // Rule: NEW: Created within 30 days and <= 1 booking
  const createdDate = new Date(customer.createdAt || new Date().toISOString());
  const diffTime = Math.abs(refDate.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 30 && (customer.totalBookings ?? 0) <= 1) {
    return 'NEW';
  }

  // Rule: INACTIVE: Last visit older than 90 days
  if (customer.lastVisitAt) {
    const lastVisitDate = new Date(customer.lastVisitAt);
    const lastVisitDiff = Math.abs(refDate.getTime() - lastVisitDate.getTime());
    const lastVisitDays = Math.ceil(lastVisitDiff / (1000 * 60 * 60 * 24));
    if (lastVisitDays > 90) {
      return 'INACTIVE';
    }
  }

  return 'ACTIVE';
}
export const calculateCustomerStatusRule = calculateCustomerStatus;
