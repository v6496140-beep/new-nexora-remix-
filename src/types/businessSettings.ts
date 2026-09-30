// Nexora SalonOS — Business Settings Type Contracts (Phase 7.16)
import { DayOfWeek, BusinessDailyHours, BusinessHoliday, BusinessScheduleConfig } from './staffSchedule';

export interface BusinessInfoSettings {
  name: string;
  tagline: string;
  logoUrl: string;
  coverImageUrl: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  instagram: string;
  facebook: string;
}

export interface BookingRuleSettings {
  advancePaymentPercentage: number; // default: 25 (%)
  slotIntervalMinutes: number; // 15, 30, 45, 60
  minAdvanceBookingHours: number; // e.g. 1, 2, 4
  maxAdvanceBookingDays: number; // e.g. 30, 60, 90
  bufferTimeMinutes: number; // 5, 10, 15, 20
  cancellationWindowHours: number; // e.g. 4
  rescheduleWindowHours: number; // e.g. 2
  enableOnlineAdvance: boolean;
  enableWalkins: boolean;
}

export interface BookingPolicySettings {
  cancellationPolicy: string;
  reschedulePolicy: string;
  noShowPolicy: string;
  advancePaymentPolicy: string;
}

export interface PaymentGatewaySettings {
  nexoraQrEnabled: boolean;
  merchantUpiVpa: string;
  paymentProvider: 'RAZORPAY' | 'STRIPE' | 'NEXORA_SPLIT';
  currency: string;
  currencySymbol: string;
  settlementMode: 'AUTOMATIC_SPLIT' | 'MANUAL_WITHDRAWAL';
  taxGstRate: number;
  taxTdsRate: number;
  providerStatus: 'CONNECTED' | 'PENDING_KYC' | 'DISABLED';
}

export interface NotificationChannelToggle {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface NotificationAutomationSettings {
  bookingConfirmation: NotificationChannelToggle;
  reminder24h: NotificationChannelToggle;
  reminder2h: NotificationChannelToggle;
  postVisitReviewRequest: {
    enabled: boolean;
    delayHours: number;
    channel: 'whatsapp' | 'sms' | 'email';
  };
  birthdayGreetings: {
    enabled: boolean;
    voucherDiscountPercent: number;
  };
  revisit30DayNudge: {
    enabled: boolean;
    autoFollowUp: boolean;
  };
}

export interface MarketingConsentSettings {
  enforceExplicitConsent: boolean;
  respectDndRegistry: boolean;
  allowPromotionalBroadcasts: boolean;
  consentAuditLogRetentionDays: number;
}

export interface ComprehensiveBusinessSettings {
  businessId: string;
  info: BusinessInfoSettings;
  hours: BusinessScheduleConfig;
  booking: BookingRuleSettings;
  policies: BookingPolicySettings;
  payment: PaymentGatewaySettings;
  notifications: NotificationAutomationSettings;
  marketing: MarketingConsentSettings;
  updatedAt: string;
  updatedBy: string;
}
