// Nexora SalonOS — Phase 6.10 Automated Customer Re-engagement Types

export type AutomationTriggerType =
  | 'BIRTHDAY_WISH'
  | 'BIRTHDAY_OFFER'
  | 'VISIT_REMINDER_30_DAY'
  | 'BOOKING_REMINDER'
  | 'REVIEW_REQUEST';

export type AutomationStatus =
  | 'PENDING'
  | 'SENT'
  | 'FAILED'
  | 'SKIPPED_REBOOKED'
  | 'SKIPPED_CONSENT'
  | 'SKIPPED_SUSPENDED'
  | 'SKIPPED_DISABLED'
  | 'SKIPPED_OPT_OUT';

export interface AutomationLogEntry {
  automationId: string;
  businessId: string;
  customerId: string;
  trigger: AutomationTriggerType;
  channel: 'WhatsApp' | 'Email' | 'SMS';
  message: string;
  status: AutomationStatus;
  providerMessageId?: string;
  idempotencyKey: string;
  createdAt: string;
  sentAt?: string;
  failedAt?: string;
  failureReason?: string;
  timezoneUsed?: string;
}

export interface AutomationConfig {
  businessId: string;
  birthdayWishEnabled: boolean;
  birthdayOfferEnabled: boolean;
  visitReminderDays: number; // e.g. 30 days
  visitReminderEnabled: boolean;
  bookingReminderEnabled: boolean;
  reviewRequestEnabled: boolean;
  isBusinessSuspended: boolean;
}

export interface WhatsAppProvider {
  providerName: string;
  sendWhatsAppMessage(
    toPhone: string,
    messageText: string
  ): Promise<{ success: boolean; providerMessageId?: string; errorMessage?: string }>;
}
