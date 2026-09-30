// Nexora SalonOS — Phase 6.9 CRM Campaigns & Data Export Types

export type CampaignTargetSegment = 'ALL' | 'BIRTHDAY_MONTH' | 'INACTIVE' | 'RETURNING' | 'VIP' | 'DUE_FOR_VISIT';

export type DeliveryChannel = 'WhatsApp' | 'Email' | 'SMS' | 'In-app';

export interface OfferCampaign {
  campaignId: string;
  businessId: string;
  campaignName: string;
  offerTitle: string;
  offerMessage: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  startDate: string;
  endDate: string;
  applicableServices: string[];
  ctaText: string;
  channel: DeliveryChannel;
  createdAt: string;
  targetedCount: number;
  sentCount: number;
}

export interface OfferRecipientTrack {
  trackId: string;
  campaignId: string;
  customerId: string;
  customerName: string;
  channel: DeliveryChannel;
  status: 'SENT' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'REDEEMED' | 'EXPIRED';
  timestamp: string;
}

export interface ExportAuditLog {
  logId: string;
  businessId: string;
  userId: string;
  exportedCount: number;
  format: 'CSV' | 'EXCEL';
  timestamp: string;
  ipAddress: string;
}
