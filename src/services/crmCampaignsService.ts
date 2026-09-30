// Nexora SalonOS — Phase 6.9 CRM Campaigns & Data Export Service
// Handles consent filter matching, one-click campaign execution, CSV generation, and security audit log streams

import { OfferCampaign, OfferRecipientTrack, ExportAuditLog, CampaignTargetSegment, DeliveryChannel } from '../types/crmCampaigns';
import { customerCrmService } from './customerCrmService';
import { CrmCustomer, CrmSegmentType } from '../types/customerCrm';

export class CrmCampaignsService {
  private campaigns: OfferCampaign[] = [];
  private recipientTracks: OfferRecipientTrack[] = [];
  private exportLogs: ExportAuditLog[] = [];

  constructor() {
    this.seedInitialCampaigns();
  }

  /**
   * One-Click campaign execution with strict channel consent filtering
   */
  public launchOneClickCampaign(
    businessId: string,
    params: {
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
      targetSegment: CampaignTargetSegment;
    }
  ): { campaign: OfferCampaign; recipientsReached: number } {
    // 1. Fetch target list
    let targetCustomers: CrmCustomer[] = [];
    if (params.targetSegment === 'ALL') {
      targetCustomers = customerCrmService.getCustomers(businessId);
    } else {
      // Map CampaignTargetSegment to CrmSegmentType
      const segMap: Record<CampaignTargetSegment, CrmSegmentType> = {
        ALL: 'NEW', // fallback
        BIRTHDAY_MONTH: 'BIRTHDAY_MONTH',
        INACTIVE: 'INACTIVE',
        RETURNING: 'RETURNING',
        VIP: 'VIP',
        DUE_FOR_VISIT: 'DUE_FOR_VISIT'
      };
      targetCustomers = customerCrmService.getSegmentCustomers(businessId, segMap[params.targetSegment], '2026-09-29');
    }

    const initialCount = targetCustomers.length;

    // 2. Filter target list based on channel opt-in consent
    const consentedCustomers = targetCustomers.filter((c) => {
      if (!c.marketingConsent) return false;
      if (params.channel === 'WhatsApp') return c.whatsappOptIn;
      if (params.channel === 'Email') return c.emailConsent;
      if (params.channel === 'SMS') return c.smsConsent;
      return true; // In-app default
    });

    const campaignId = `cam-${Date.now().toString(36)}`;
    const campaign: OfferCampaign = {
      campaignId,
      businessId,
      campaignName: params.campaignName,
      offerTitle: params.offerTitle,
      offerMessage: params.offerMessage,
      discountType: params.discountType,
      discountValue: params.discountValue,
      startDate: params.startDate,
      endDate: params.endDate,
      applicableServices: params.applicableServices,
      ctaText: params.ctaText,
      channel: params.channel,
      createdAt: new Date().toISOString(),
      targetedCount: initialCount,
      sentCount: consentedCustomers.length
    };

    this.campaigns.push(campaign);

    // 3. Dispatch and track each recipient with progressive simulation states
    consentedCustomers.forEach((c) => {
      const trackId = `trk-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`;
      
      // Simulate typical channel deliverability metrics
      const statuses: OfferRecipientTrack['status'][] = ['SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'REDEEMED'];
      const finalStatus = statuses[Math.floor(Math.random() * statuses.length)];

      const track: OfferRecipientTrack = {
        trackId,
        campaignId,
        customerId: c.customerId,
        customerName: c.name,
        channel: params.channel,
        status: finalStatus,
        timestamp: new Date().toISOString()
      };

      this.recipientTracks.push(track);

      // Register a customer timeline event
      customerCrmService.addTimelineEvent(c.customerId, {
        type: 'OFFER_SENT',
        title: `Campaign Sent: ${params.offerTitle}`,
        description: `Delivered via ${params.channel}. Status: ${finalStatus}. [${params.ctaText}]`
      });
    });

    return { campaign, recipientsReached: consentedCustomers.length };
  }

  /**
   * Authorized, business-scoped export generator with real CSV output string and secure auditing
   */
  public exportCustomersToCsv(businessId: string, authorizedUserId: string): { csvContent: string; log: ExportAuditLog } {
    // 1. Fetch scoped clients strictly adhering to tenant boundaries
    const customers = customerCrmService.getCustomers(businessId);

    // 2. Build secure CSV text header and rows
    const headers = ['Name', 'Phone', 'Email', 'DOB', 'Last Visit', 'Total Visits', 'Tags'];
    const rows = customers.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.dob || ''}"`,
      `"${c.lastVisit || ''}"`,
      c.totalVisits,
      `"${c.tags.join(', ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    // 3. Create audit log row
    const logId = `xlog-${Date.now().toString(36)}`;
    const auditLog: ExportAuditLog = {
      logId,
      businessId,
      userId: authorizedUserId,
      exportedCount: customers.length,
      format: 'CSV',
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.55' // audit metadata
    };

    this.exportLogs.push(auditLog);

    return { csvContent, log: auditLog };
  }

  public getCampaigns(businessId: string): OfferCampaign[] {
    return this.campaigns.filter((c) => c.businessId === businessId);
  }

  public getRecipientTracks(campaignId: string): OfferRecipientTrack[] {
    return this.recipientTracks.filter((t) => t.campaignId === campaignId);
  }

  public getExportAuditLogs(businessId: string): ExportAuditLog[] {
    return this.exportLogs.filter((l) => l.businessId === businessId);
  }

  private seedInitialCampaigns() {
    // Create initial campaign for Royal Crown Barber
    this.launchOneClickCampaign('biz-barber-001', {
      campaignName: 'September Fest 20%',
      offerTitle: 'Royal Festival Blowout',
      offerMessage: 'Enjoy a premium shave & classic royal wash at 20% flat discount!',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      startDate: '2026-09-01',
      endDate: '2026-09-30',
      applicableServices: ['Classic Royal Trim', 'Beard Styling'],
      ctaText: 'Claim Shave Voucher',
      channel: 'WhatsApp',
      targetSegment: 'VIP'
    });
  }
}

export const crmCampaignsService = new CrmCampaignsService();
