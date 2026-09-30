// Nexora SalonOS — Phase 4.5 Customer Booking Flow Domain Types
// 8-Step Customer Journey, Re-Validation Envelopes, and Authoritative Execution State

import { BookingFinancialSnapshot, BookingEntity } from './bookingEngine';

export type BookingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface CustomerBookingDraft {
  businessId: string;
  itemType: 'SERVICE' | 'PACKAGE';
  serviceId?: string;
  packageId?: string;
  staffId: string; // Specific ID or 'ANY_AVAILABLE'
  date: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm'
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes?: string;
  slotLockId?: string;
}

export interface AuthoritativeRevalidationResult {
  valid: boolean;
  errors: string[];
  authoritativePriceCents: number;
  authoritativeDurationMinutes: number;
  authoritativeBufferMinutes: number;
  authoritativeAdvancePercentage: number;
  financialSnapshot?: BookingFinancialSnapshot;
  resolvedStaffId?: string;
  resolvedStaffName?: string;
  itemTitle?: string;
  itemCategory?: string;
  calculatedEndTime?: string;
}

export interface BookingSubmissionPayload {
  draft: CustomerBookingDraft;
  paymentIntentId: string;
  gatewayTransactionRef?: string;
  idempotencyKey?: string;
}

export interface BookingSubmissionResult {
  success: boolean;
  booking?: BookingEntity;
  revalidationErrors?: string[];
  error?: string;
}
