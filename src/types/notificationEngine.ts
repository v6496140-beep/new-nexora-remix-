// Nexora SalonOS — Phase 4.7 Notification & Event Engine Types
// Decoupled notification architecture, multi-channel adapters, and fault-tolerant audit logs

import { BookingEntity } from './bookingEngine';

export type NotificationEventType =
  | 'BOOKING_CREATED'
  | 'ADVANCE_PAYMENT_RECEIVED'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_RESCHEDULED'
  | 'BOOKING_REMINDER'
  | 'PAYMENT_FAILED'
  | 'REFUND_COMPLETED';

export type NotificationChannel = 'EMAIL' | 'WHATSAPP' | 'SMS' | 'IN_APP';

export type NotificationStatus = 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED';

/**
 * Immutable Notification Audit Record (Phase 4.7 Requirement)
 */
export interface NotificationRecord {
  notificationId: string;
  businessId: string;
  userId: string; // Customer or Admin user ID
  bookingId: string;
  event: NotificationEventType;
  channel: NotificationChannel;
  status: NotificationStatus;
  recipient: string; // e.g. email address, phone number, or user ID
  subject?: string;
  body: string;
  providerMessageId?: string;
  createdAtIso: string;
  sentAtIso?: string;
  failedAtIso?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
}

/**
 * Decoupled Channel Provider Interface
 * Allows attaching Twilio, SendGrid, WhatsApp Cloud API, or Firebase FCM without modifying domain logic
 */
export interface NotificationSendParams {
  record: NotificationRecord;
  simulateFailure?: boolean;
}

export interface NotificationSendResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
}

export interface NotificationChannelProvider {
  channel: NotificationChannel;
  send(params: NotificationSendParams): Promise<NotificationSendResult>;
}

/**
 * Structured Booking Confirmation Display Model (Phase 4.7 Requirement)
 */
export interface BookingConfirmationSummary {
  bookingId: string;
  businessName: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  bookingTime: string;
  durationMinutes: number;
  totalAmountRupees: number;
  advancePaidRupees: number;
  remainingAmountRupees: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  confirmedAtIso: string;
}

/**
 * Dispatch Event Request
 */
export interface DispatchEventOptions {
  event: NotificationEventType;
  booking: BookingEntity;
  businessName?: string;
  channels?: NotificationChannel[];
  simulateFailureChannels?: NotificationChannel[];
}
