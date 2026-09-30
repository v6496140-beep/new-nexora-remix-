// Nexora SalonOS — Phase 6.10 Re-engagement Automation Service
// Engineered with robust provider abstractions, message templating engines, idempotency filters, and scheduler evaluation loops.

import {
  AutomationTriggerType,
  AutomationStatus,
  AutomationLogEntry,
  AutomationConfig,
  WhatsAppProvider
} from '../types/crmAutomations';
import { customerCrmService } from './customerCrmService';
import { CrmCustomer } from '../types/customerCrm';

// Concrete WhatsApp Providers
export class MetaCloudApiProvider implements WhatsAppProvider {
  public providerName = 'Meta Cloud API (Official)';
  public async sendWhatsAppMessage(toPhone: string, messageText: string) {
    if (toPhone.includes('99999')) {
      // Simulate API failure for testing
      return { success: false, errorMessage: 'Carrier routing timeout or rate limit exceeded' };
    }
    return { success: true, providerMessageId: `meta-${Math.random().toString(36).substr(2, 9)}` };
  }
}

export class TwilioWhatsAppProvider implements WhatsAppProvider {
  public providerName = 'Twilio API for WhatsApp';
  public async sendWhatsAppMessage(toPhone: string, messageText: string) {
    return { success: true, providerMessageId: `twilio-${Math.random().toString(36).substr(2, 9)}` };
  }
}

export class CrmAutomationsService {
  private configs: Map<string, AutomationConfig> = new Map();
  private logs: AutomationLogEntry[] = [];
  private activeProvider: WhatsAppProvider = new MetaCloudApiProvider();

  constructor() {
    this.seedDefaultConfigs();
  }

  public getActiveProviderName(): string {
    return this.activeProvider.providerName;
  }

  public setActiveProvider(provider: WhatsAppProvider) {
    this.activeProvider = provider;
  }

  public getConfig(businessId: string): AutomationConfig {
    let cfg = this.configs.get(businessId);
    if (!cfg) {
      cfg = {
        businessId,
        birthdayWishEnabled: true,
        birthdayOfferEnabled: true,
        visitReminderDays: 30,
        visitReminderEnabled: true,
        bookingReminderEnabled: true,
        reviewRequestEnabled: true,
        isBusinessSuspended: false
      };
      this.configs.set(businessId, cfg);
    }
    return cfg;
  }

  public updateConfig(businessId: string, fields: Partial<AutomationConfig>) {
    const cfg = this.getConfig(businessId);
    Object.assign(cfg, fields);
  }

  public getLogs(businessId: string): AutomationLogEntry[] {
    return this.logs.filter((l) => l.businessId === businessId);
  }

  /**
   * Safe replacement parser supporting standard CRM message tags
   */
  public compileTemplate(
    template: string,
    vars: {
      customerName: string;
      businessName: string;
      serviceName?: string;
      bookingDate?: string;
      bookingTime?: string;
      offerTitle?: string;
      offerValue?: string;
    }
  ): string {
    let out = template;
    out = out.replace(/\{\{customerName\}\}/g, vars.customerName);
    out = out.replace(/\{\{businessName\}\}/g, vars.businessName);
    out = out.replace(/\{\{serviceName\}\}/g, vars.serviceName || 'Premium Services');
    out = out.replace(/\{\{bookingDate\}\}/g, vars.bookingDate || 'Upcoming Date');
    out = out.replace(/\{\{bookingTime\}\}/g, vars.bookingTime || 'Scheduled Time');
    out = out.replace(/\{\{offerTitle\}\}/g, vars.offerTitle || 'Birthday Surprise');
    out = out.replace(/\{\{offerValue\}\}/g, vars.offerValue || '20% Off');
    return out;
  }

  /**
   * Scheduled trigger execution simulator adhering to security & duplicate protection rules
   */
  public async evaluateScheduledAutomationsForCustomer(
    businessId: string,
    customerId: string,
    triggerType: AutomationTriggerType,
    evaluationDateIsoStr: string,
    customTimezone: string = 'Asia/Kolkata'
  ): Promise<AutomationLogEntry> {
    const config = this.getConfig(businessId);
    const customer = customerCrmService.getCustomerById(customerId, businessId);

    const baseLog: Omit<AutomationLogEntry, 'status' | 'idempotencyKey' | 'createdAt'> = {
      automationId: `aut-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`,
      businessId,
      customerId,
      trigger: triggerType,
      channel: 'WhatsApp',
      message: '',
      timezoneUsed: customTimezone
    };

    // 1. DUPLICATE PROTECTION: Calculate strict idempotency key
    // For birthday wishes, can't receive more than one in the same year.
    // For 30-day reminders, based on the last completed visit date.
    const evalYear = evaluationDateIsoStr.substring(0, 4);
    const lvDate = customer?.lastVisit || customer?.lastVisitAt || 'never';
    const idempotencyKey = `${customerId}-${triggerType}-${triggerType.includes('BIRTHDAY') ? evalYear : lvDate}`;

    // Check if duplicate job is already tracked under this business
    const existingLog = this.logs.find((l) => l.idempotencyKey === idempotencyKey);
    if (existingLog) {
      return existingLog; // Idempotent return (protection active)
    }

    if (!customer) {
      const failedLog: AutomationLogEntry = {
        ...baseLog,
        status: 'FAILED',
        idempotencyKey,
        createdAt: new Date().toISOString(),
        failedAt: new Date().toISOString(),
        failureReason: 'Customer profile does not exist under active tenant scope'
      };
      this.logs.push(failedLog);
      return failedLog;
    }

    // 2. EXCLUSION CHECK: Opt-out consent check
    if (!customer.marketingConsent || !customer.whatsappOptIn) {
      const skipLog: AutomationLogEntry = {
        ...baseLog,
        status: 'SKIPPED_OPT_OUT',
        idempotencyKey,
        createdAt: new Date().toISOString()
      };
      this.logs.push(skipLog);
      return skipLog;
    }

    // 3. EXCLUSION CHECK: Business Suspension Check
    if (config.isBusinessSuspended) {
      const skipLog: AutomationLogEntry = {
        ...baseLog,
        status: 'SKIPPED_SUSPENDED',
        idempotencyKey,
        createdAt: new Date().toISOString()
      };
      this.logs.push(skipLog);
      return skipLog;
    }

    // 4. EXCLUSION CHECK: Automation configuration toggle
    const isEnabled =
      triggerType === 'BIRTHDAY_WISH'
        ? config.birthdayWishEnabled
        : triggerType === 'BIRTHDAY_OFFER'
        ? config.birthdayOfferEnabled
        : triggerType === 'VISIT_REMINDER_30_DAY'
        ? config.visitReminderEnabled
        : triggerType === 'BOOKING_REMINDER'
        ? config.bookingReminderEnabled
        : config.reviewRequestEnabled;

    if (!isEnabled) {
      const skipLog: AutomationLogEntry = {
        ...baseLog,
        status: 'SKIPPED_DISABLED',
        idempotencyKey,
        createdAt: new Date().toISOString()
      };
      this.logs.push(skipLog);
      return skipLog;
    }

    // 5. EXCLUSION CHECK: Customer already rebooked check (Upcoming Booking existence)
    if (customer.nextBooking) {
      const skipLog: AutomationLogEntry = {
        ...baseLog,
        status: 'SKIPPED_REBOOKED',
        idempotencyKey,
        createdAt: new Date().toISOString()
      };
      this.logs.push(skipLog);
      return skipLog;
    }

    // Prepare compiled template message
    const bizName = businessId === 'biz-barber-001' ? 'Royal Crown Barber' : 'Zenith Stone Spa';
    let rawTemplate = '';

    if (triggerType === 'BIRTHDAY_WISH') {
      rawTemplate = 'Happy Birthday {{customerName}}! We at {{businessName}} hope you have an incredible year ahead.';
    } else if (triggerType === 'BIRTHDAY_OFFER') {
      rawTemplate = 'Happy Birthday {{customerName}}! Enjoy your special birthday gift: {{offerTitle}} at {{businessName}}!';
    } else if (triggerType === 'VISIT_REMINDER_30_DAY') {
      rawTemplate = 'Hey {{customerName}}, its been {{offerValue}} since your last visit. We miss you at {{businessName}}! Book your next {{serviceName}} today!';
    } else if (triggerType === 'BOOKING_REMINDER') {
      rawTemplate = 'Friendly booking reminder {{customerName}}: Your appointment for {{serviceName}} at {{businessName}} is scheduled on {{bookingDate}} at {{bookingTime}}.';
    } else if (triggerType === 'REVIEW_REQUEST') {
      rawTemplate = 'Hey {{customerName}}, thank you for visiting {{businessName}}. How was your service? Please share your reviews!';
    }

    const compiledMessage = this.compileTemplate(rawTemplate, {
      customerName: customer.name,
      businessName: bizName,
      serviceName: customer.favoriteServices[0] || 'Signature Haircut',
      bookingDate: '2026-10-05',
      bookingTime: '11:30 AM',
      offerTitle: 'Royal Birthday Shave Spa Treat',
      offerValue: `${config.visitReminderDays} Days`
    });

    const newLog: AutomationLogEntry = {
      ...baseLog,
      message: compiledMessage,
      status: 'PENDING',
      idempotencyKey,
      createdAt: new Date().toISOString()
    };

    // 6. Deliver via Active WhatsApp Provider Abstraction
    const result = await this.activeProvider.sendWhatsAppMessage(customer.phone, compiledMessage);
    if (result.success) {
      newLog.status = 'SENT';
      newLog.providerMessageId = result.providerMessageId;
      newLog.sentAt = new Date().toISOString();
    } else {
      newLog.status = 'FAILED';
      newLog.failedAt = new Date().toISOString();
      newLog.failureReason = result.errorMessage;
    }

    this.logs.push(newLog);

    // Register customer timeline activity too
    customerCrmService.addTimelineEvent(customerId, {
      type: 'MESSAGE_SENT',
      title: `Auto-Trigger: ${triggerType}`,
      description: `Delivery Status: ${newLog.status}. Message: ${compiledMessage}`
    });

    return newLog;
  }

  private seedDefaultConfigs() {
    this.getConfig('biz-barber-001');
    this.getConfig('biz-spa-002');
  }
}

export const crmAutomationsService = new CrmAutomationsService();
