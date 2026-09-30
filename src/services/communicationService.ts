// Nexora SalonOS — Phase 5.8 Customer Communication Service
// Provider Adapters, Template Interpolation Engine, Consent Verification, and Message Logging

import {
  CommunicationEvent,
  CommunicationChannel,
  MessageStatus,
  MessageLogEntity,
  CustomerCommunicationPreferences,
  TemplateVariables
} from '../types/communication';

// Provider Adapter Interface
export interface MessageProviderAdapter {
  channel: CommunicationChannel;
  send(recipient: string, content: string): Promise<{ success: boolean; providerMessageId?: string; error?: string }>;
}

// Mock Adapters
export class MockEmailAdapter implements MessageProviderAdapter {
  channel: CommunicationChannel = 'EMAIL';
  public shouldFail: boolean = false;

  async send(recipient: string, content: string) {
    if (this.shouldFail) {
      return { success: false, error: 'SMTP connection timeout' };
    }
    return { success: true, providerMessageId: `email-${Date.now().toString(36)}` };
  }
}

export class MockWhatsAppAdapter implements MessageProviderAdapter {
  channel: CommunicationChannel = 'WHATSAPP';
  public shouldFail: boolean = false;

  async send(recipient: string, content: string) {
    if (this.shouldFail) {
      return { success: false, error: 'WhatsApp Cloud API rate limit exceeded' };
    }
    return { success: true, providerMessageId: `wa-${Date.now().toString(36)}` };
  }
}

export class MockSmsAdapter implements MessageProviderAdapter {
  channel: CommunicationChannel = 'SMS';
  public shouldFail: boolean = false;

  async send(recipient: string, content: string) {
    if (this.shouldFail) {
      return { success: false, error: 'SMS Gateway unreachable' };
    }
    return { success: true, providerMessageId: `sms-${Date.now().toString(36)}` };
  }
}

export class MockInAppAdapter implements MessageProviderAdapter {
  channel: CommunicationChannel = 'IN_APP';
  public shouldFail: boolean = false;

  async send(recipient: string, content: string) {
    return { success: true, providerMessageId: `inapp-${Date.now().toString(36)}` };
  }
}

export class CommunicationService {
  private messageLogs: MessageLogEntity[] = [];
  private preferences: Map<string, CustomerCommunicationPreferences> = new Map();
  private emailAdapter = new MockEmailAdapter();
  private waAdapter = new MockWhatsAppAdapter();
  private smsAdapter = new MockSmsAdapter();
  private inAppAdapter = new MockInAppAdapter();

  // Default templates per event
  private defaultTemplates: Record<CommunicationEvent, string> = {
    BOOKING_CREATED: 'Hi {{customerName}}, your booking (ID: {{bookingId}}) at {{businessName}} for {{serviceName}} on {{bookingDate}} at {{bookingTime}} has been created. Advance payment remaining: {{remainingAmount}}.',
    ADVANCE_PAYMENT_RECEIVED: 'Thank you {{customerName}}! Advance payment received for {{businessName}} booking {{bookingId}}.',
    BOOKING_CONFIRMED: 'Your booking {{bookingId}} at {{businessName}} with {{staffName}} on {{bookingDate}} at {{bookingTime}} is confirmed!',
    BOOKING_REMINDER: 'Reminder: You have an upcoming appointment for {{serviceName}} at {{businessName}} on {{bookingDate}} at {{bookingTime}}.',
    BOOKING_RESCHEDULED: 'Your booking {{bookingId}} at {{businessName}} has been rescheduled to {{bookingDate}} at {{bookingTime}}.',
    BOOKING_CANCELLED: 'Your booking {{bookingId}} at {{businessName}} has been cancelled.',
    BOOKING_COMPLETED: 'Thank you for visiting {{businessName}}, {{customerName}}! We hope you enjoyed your {{serviceName}} session.',
    REVIEW_REQUEST: 'Hi {{customerName}}, how was your experience with {{staffName}} at {{businessName}}? Tap to leave a review!'
  };

  /**
   * Set or update customer communication consent
   */
  public setPreferences(prefs: CustomerCommunicationPreferences): void {
    this.preferences.set(prefs.customerId, prefs);
  }

  public getPreferences(customerId: string): CustomerCommunicationPreferences {
    return (
      this.preferences.get(customerId) || {
        customerId,
        emailConsent: true,
        smsConsent: true,
        whatsappConsent: true,
        inAppConsent: true
      }
    );
  }

  /**
   * Interpolate template variables
   */
  public renderTemplate(template: string, vars: TemplateVariables): string {
    let result = template;
    Object.entries(vars).forEach(([key, val]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, val || '');
    });
    return result;
  }

  /**
   * Dispatch communication event across permitted channels
   */
  public async dispatchEvent(
    businessId: string,
    customerId: string,
    recipient: string,
    event: CommunicationEvent,
    channels: CommunicationChannel[],
    variables: TemplateVariables,
    forceFailureChannel?: CommunicationChannel
  ): Promise<MessageLogEntity[]> {
    const prefs = this.getPreferences(customerId);
    const template = this.defaultTemplates[event] || 'Notification from {{businessName}}';
    const content = this.renderTemplate(template, variables);

    const logs: MessageLogEntity[] = [];

    for (const channel of channels) {
      // Check consent
      let hasConsent = true;
      if (channel === 'EMAIL' && !prefs.emailConsent) hasConsent = false;
      if (channel === 'SMS' && !prefs.smsConsent) hasConsent = false;
      if (channel === 'WHATSAPP' && !prefs.whatsappConsent) hasConsent = false;
      if (channel === 'IN_APP' && !prefs.inAppConsent) hasConsent = false;

      const notificationId = `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
      const nowIso = new Date().toISOString();

      if (!hasConsent) {
        const log: MessageLogEntity = {
          notificationId,
          businessId,
          recipient,
          channel,
          event,
          status: 'FAILED',
          failedAt: nowIso,
          content,
          errorMessage: 'Consent withheld by customer preference'
        };
        this.messageLogs.push(log);
        logs.push(log);
        continue;
      }

      // Select adapter
      let adapter: MessageProviderAdapter = this.emailAdapter;
      if (channel === 'WHATSAPP') adapter = this.waAdapter;
      if (channel === 'SMS') adapter = this.smsAdapter;
      if (channel === 'IN_APP') adapter = this.inAppAdapter;

      // Simulate failure if forced
      if (forceFailureChannel === channel) {
        if (adapter instanceof MockEmailAdapter) adapter.shouldFail = true;
        if (adapter instanceof MockWhatsAppAdapter) adapter.shouldFail = true;
        if (adapter instanceof MockSmsAdapter) adapter.shouldFail = true;
      }

      const sendRes = await adapter.send(recipient, content);

      // Reset mock failure flag
      if (adapter instanceof MockEmailAdapter) adapter.shouldFail = false;
      if (adapter instanceof MockWhatsAppAdapter) adapter.shouldFail = false;
      if (adapter instanceof MockSmsAdapter) adapter.shouldFail = false;

      const log: MessageLogEntity = {
        notificationId,
        businessId,
        recipient,
        channel,
        event,
        status: sendRes.success ? 'SENT' : 'FAILED',
        sentAt: sendRes.success ? nowIso : undefined,
        failedAt: !sendRes.success ? nowIso : undefined,
        providerMessageId: sendRes.providerMessageId,
        content,
        errorMessage: sendRes.error
      };

      this.messageLogs.push(log);
      logs.push(log);
    }

    return logs;
  }

  public listMessageLogs(businessId?: string): MessageLogEntity[] {
    if (!businessId) return [...this.messageLogs];
    return this.messageLogs.filter((l) => l.businessId === businessId);
  }
}

export const communicationService = new CommunicationService();
