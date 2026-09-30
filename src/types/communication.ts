// Nexora SalonOS — Phase 5.8 Customer Communication Types
// Communication Events, Channels, Message Logs, Templates, and Preferences

export type CommunicationEvent =
  | 'BOOKING_CREATED'
  | 'ADVANCE_PAYMENT_RECEIVED'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_REMINDER'
  | 'BOOKING_RESCHEDULED'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_COMPLETED'
  | 'REVIEW_REQUEST';

export type CommunicationChannel = 'EMAIL' | 'WHATSAPP' | 'SMS' | 'IN_APP';

export type MessageStatus = 'SENT' | 'FAILED' | 'PENDING' | 'RETRYING';

export interface MessageLogEntity {
  notificationId: string;
  businessId: string;
  recipient: string; // e.g. email or phone number
  channel: CommunicationChannel;
  event: CommunicationEvent;
  status: MessageStatus;
  sentAt?: string;
  failedAt?: string;
  providerMessageId?: string;
  content: string;
  errorMessage?: string;
}

export interface CustomerCommunicationPreferences {
  customerId: string;
  emailConsent: boolean;
  smsConsent: boolean;
  whatsappConsent: boolean;
  inAppConsent: boolean;
}

export interface TemplateVariables {
  customerName: string;
  businessName: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  bookingTime: string;
  bookingId: string;
  remainingAmount: string;
  [key: string]: string;
}
