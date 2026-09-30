// Nexora SalonOS — Phase 4.1 Booking Domain Model & State Machine
// Strict Multi-Tenant Schema, Immutable Snapshots, Financial Arithmetic & Transition Validation

// ----------------------------------------------------------------------------
// 1. BOOKING STATUS STATE MACHINE DEFINITIONS
// ----------------------------------------------------------------------------

export type BookingStatus =
  | 'DRAFT'
  | 'PAYMENT_PENDING'
  | 'ADVANCE_PAID'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'REFUND_PENDING'
  | 'REFUNDED';

export type PaymentStatus =
  | 'UNPAID'
  | 'ADVANCE_PENDING'
  | 'ADVANCE_PAID'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

// ----------------------------------------------------------------------------
// 2. FINANCIAL SNAPSHOT & MONETARY UTILITIES (SAFE INTEGER CENTS/PAISE ARITHMETIC)
// ----------------------------------------------------------------------------

export interface BookingFinancialSnapshot {
  currency: string; // e.g., 'INR'
  subtotalCents: number; // Stored in minor units (paise/cents) to prevent floating-point loss
  discountCents: number;
  totalCents: number;
  advancePercentage: number; // e.g. 25
  advanceAmountCents: number;
  remainingAmountCents: number;
  taxGstCents: number;
}

// ----------------------------------------------------------------------------
// 3. BOOKING ITEM (IMMUTABLE HISTORICAL SNAPSHOT)
// ----------------------------------------------------------------------------

export interface BookingItem {
  id: string;
  bookingId: string;
  itemType: 'SERVICE' | 'PACKAGE';
  referenceId: string; // Original service or package ID
  // Historical Snapshots: Never changes even if service catalog price/name updates later
  nameSnapshot: string;
  categorySnapshot: string;
  unitPriceCents: number;
  durationMinutesSnapshot: number;
  staffId?: string;
  staffNameSnapshot?: string;
}

// ----------------------------------------------------------------------------
// 4. AUDITABLE STATUS HISTORY RECORD
// ----------------------------------------------------------------------------

export interface BookingStatusAuditLog {
  id: string;
  bookingId: string;
  oldStatus: BookingStatus;
  newStatus: BookingStatus;
  changedByUserId: string;
  changedByRole: string;
  reason?: string;
  timestamp: string; // ISO 8601
}

// ----------------------------------------------------------------------------
// 5. MAIN BOOKING ENTITY (MULTI-TENANT BY businessId)
// ----------------------------------------------------------------------------

export interface BookingEntity {
  id: string;
  // Multi-Tenant Isolation: Every booking belongs to exactly one business
  businessId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;

  // Single or Primary Staff Reference
  staffId?: string;
  staffNameSnapshot?: string;

  // Single Service / Package Direct References (for quick querying)
  serviceId?: string;
  packageId?: string;

  // Booking Line Items (Multi-item support with historical snapshots)
  items: BookingItem[];

  // Schedule & Timing
  bookingDate: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm' e.g. '14:30'
  endTime: string; // 'HH:mm' e.g. '15:30'
  duration: number; // in minutes

  // Safe Monetary Snapshots
  subtotal: number;
  discount: number;
  totalAmount: number;
  advancePercentage: number;
  advanceAmount: number;
  remainingAmount: number;
  currency: string;
  financials: BookingFinancialSnapshot;

  // State Machine Separations
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  gatewayTransactionRef?: string;

  // Audit Logs (Immutable transition history)
  statusHistory: BookingStatusAuditLog[];

  // Metadata & Timestamps
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  checkedInAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
}

// ----------------------------------------------------------------------------
// 6. CENTRALIZED STATE MACHINE TRANSITION MATRIX
// ----------------------------------------------------------------------------

export const VALID_BOOKING_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  DRAFT: ['PAYMENT_PENDING', 'CANCELLED'],
  PAYMENT_PENDING: ['ADVANCE_PAID', 'CANCELLED'],
  ADVANCE_PAID: ['CONFIRMED', 'CANCELLED', 'REFUND_PENDING'],
  CONFIRMED: ['CHECKED_IN', 'CANCELLED', 'NO_SHOW', 'REFUND_PENDING'],
  CHECKED_IN: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: ['REFUND_PENDING'],
  CANCELLED: ['REFUND_PENDING', 'REFUNDED'],
  NO_SHOW: ['REFUND_PENDING'],
  REFUND_PENDING: ['REFUNDED', 'CANCELLED'],
  REFUNDED: [] // Terminal state
};

// ----------------------------------------------------------------------------
// 7. TRANSITION VALIDATOR & STATE ENGINE
// ----------------------------------------------------------------------------

export interface TransitionValidationResult {
  valid: boolean;
  error?: string;
}

export function validateBookingStatusTransition(
  currentStatus: BookingStatus,
  nextStatus: BookingStatus
): TransitionValidationResult {
  if (currentStatus === nextStatus) {
    return { valid: true };
  }

  const allowedTransitions = VALID_BOOKING_TRANSITIONS[currentStatus];
  if (!allowedTransitions || !allowedTransitions.includes(nextStatus)) {
    return {
      valid: false,
      error: `Invalid transition from "${currentStatus}" to "${nextStatus}". Allowed target states: [${(allowedTransitions || []).join(', ')}]`
    };
  }

  return { valid: true };
}

// ----------------------------------------------------------------------------
// 8. FINANCIAL ARITHMETIC FACTORY (SAFE INTEGER UNITS)
// ----------------------------------------------------------------------------

export function createFinancialSnapshot(
  subtotal: number,
  discount: number = 0,
  advancePercentage: number = 25,
  taxGstRate: number = 18,
  currency: string = 'INR'
): BookingFinancialSnapshot {
  // Convert standard numbers to minor integer units (paise/cents) to eliminate float rounding errors
  const subtotalCents = Math.round(subtotal * 100);
  const discountCents = Math.round(discount * 100);
  const netCents = Math.max(0, subtotalCents - discountCents);

  // Safe tax calculation (rounded integer)
  const taxGstCents = Math.round((netCents * taxGstRate) / 100);
  const totalCents = netCents + taxGstCents;

  // Safe advance computation (e.g. 25% rule)
  const advanceAmountCents = Math.round((totalCents * advancePercentage) / 100);
  const remainingAmountCents = totalCents - advanceAmountCents;

  return {
    currency,
    subtotalCents,
    discountCents,
    totalCents,
    advancePercentage,
    advanceAmountCents,
    remainingAmountCents,
    taxGstCents
  };
}

export const calculateFinancialSnapshot = createFinancialSnapshot;

export function centsToRupees(cents: number): number {
  return Math.round(cents) / 100;
}

// ----------------------------------------------------------------------------
// 9. MULTI-TENANT ISOLATION GUARD
// ----------------------------------------------------------------------------

export function verifyTenantOwnership(
  booking: BookingEntity,
  requestedBusinessId: string
): boolean {
  return booking.businessId === requestedBusinessId;
}
