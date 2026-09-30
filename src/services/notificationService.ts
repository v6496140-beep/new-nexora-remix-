// Nexora SalonOS — Phase 4.7 Notification & Event Dispatcher Service
// Multi-channel notifications, provider decoupling, template engine, and fault-tolerant event isolation

import { BookingEntity } from '../types/bookingEngine';
import {
  NotificationEventType,
  NotificationChannel,
  NotificationStatus,
  NotificationRecord,
  NotificationChannelProvider,
  NotificationSendParams,
  NotificationSendResult,
  BookingConfirmationSummary,
  DispatchEventOptions
} from '../types/notificationEngine';

/**
 * Extracts structured confirmation details for Phase 4.7 UI display
 */
export function extractConfirmationSummary(
  booking: BookingEntity,
  businessName: string = 'Nexora Premium Salon'
): BookingConfirmationSummary {
  const serviceName =
    booking.items && booking.items.length > 0
      ? booking.items[0].nameSnapshot
      : 'Salon Treatment';

  return {
    bookingId: booking.id,
    businessName,
    serviceName,
    staffName: booking.staffNameSnapshot || 'Assigned Professional',
    bookingDate: booking.bookingDate,
    bookingTime: booking.startTime,
    durationMinutes: booking.duration,
    totalAmountRupees: booking.totalAmount,
    advancePaidRupees: booking.advanceAmount,
    remainingAmountRupees: booking.remainingAmount,
    currency: booking.currency || 'INR',
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    customerEmail: booking.customerEmail,
    confirmedAtIso: booking.updatedAt || booking.createdAt
  };
}

/**
 * Template Renderer for Notification Content
 */
export class NotificationTemplateEngine {
  public static renderTemplate(
    event: NotificationEventType,
    channel: NotificationChannel,
    summary: BookingConfirmationSummary
  ): { subject?: string; body: string } {
    const totalFmt = `₹${summary.totalAmountRupees.toLocaleString('en-IN')}`;
    const advanceFmt = `₹${summary.advancePaidRupees.toLocaleString('en-IN')}`;
    const remainingFmt = `₹${summary.remainingAmountRupees.toLocaleString('en-IN')}`;

    switch (event) {
      case 'BOOKING_CONFIRMED':
        if (channel === 'EMAIL') {
          return {
            subject: `Appointment Confirmed [${summary.bookingId}] - ${summary.businessName}`,
            body: `Dear ${summary.customerName},\n\nYour appointment at ${summary.businessName} is officially CONFIRMED!\n\n` +
              `• Booking ID: ${summary.bookingId}\n` +
              `• Service: ${summary.serviceName}\n` +
              `• Specialist: ${summary.staffName}\n` +
              `• Date & Time: ${summary.bookingDate} at ${summary.bookingTime}\n\n` +
              `FINANCIAL BREAKDOWN:\n` +
              `• Total Amount: ${totalFmt}\n` +
              `• Advance Paid: ${advanceFmt} (Received)\n` +
              `• Remaining Due at Salon: ${remainingFmt}\n\n` +
              `Thank you for choosing ${summary.businessName}!`
          };
        } else if (channel === 'WHATSAPP') {
          return {
            body: `✨ *APPOINTMENT CONFIRMED* ✨\n\nHi ${summary.customerName}, your booking *${summary.bookingId}* at *${summary.businessName}* is confirmed!\n\n` +
              `📅 *Date:* ${summary.bookingDate} @ ${summary.bookingTime}\n` +
              `💇 *Service:* ${summary.serviceName}\n` +
              `👤 *Staff:* ${summary.staffName}\n\n` +
              `💳 *Advance Paid:* ${advanceFmt}\n` +
              `🪙 *Remaining at Salon:* ${remainingFmt}\n\n` +
              `See you soon!`
          };
        } else if (channel === 'SMS') {
          return {
            body: `Confirmed! Booking ${summary.bookingId} for ${summary.serviceName} on ${summary.bookingDate} ${summary.bookingTime} at ${summary.businessName}. Advance paid: ${advanceFmt}. Bal: ${remainingFmt}.`
          };
        } else {
          // IN_APP
          return {
            subject: 'Appointment Confirmed!',
            body: `Your booking ${summary.bookingId} for ${summary.serviceName} with ${summary.staffName} on ${summary.bookingDate} is confirmed. Advance: ${advanceFmt}.`
          };
        }

      case 'ADVANCE_PAYMENT_RECEIVED':
        return {
          subject: `Payment Receipt: ${advanceFmt} for ${summary.bookingId}`,
          body: `Payment of ${advanceFmt} for booking ${summary.bookingId} received successfully. Remaining balance: ${remainingFmt}.`
        };

      case 'BOOKING_CANCELLED':
        return {
          subject: `Booking Cancelled - ${summary.bookingId}`,
          body: `Your booking ${summary.bookingId} for ${summary.serviceName} at ${summary.businessName} has been cancelled.`
        };

      case 'BOOKING_RESCHEDULED':
        return {
          subject: `Booking Rescheduled - ${summary.bookingId}`,
          body: `Your booking ${summary.bookingId} has been rescheduled to ${summary.bookingDate} at ${summary.bookingTime}.`
        };

      case 'BOOKING_REMINDER':
        return {
          subject: `Reminder: Upcoming Appointment Tomorrow - ${summary.bookingId}`,
          body: `Reminder: You have an appointment for ${summary.serviceName} at ${summary.businessName} on ${summary.bookingDate} at ${summary.bookingTime}.`
        };

      case 'PAYMENT_FAILED':
        return {
          subject: `Payment Attempt Failed - ${summary.bookingId}`,
          body: `Your payment attempt for booking ${summary.bookingId} failed. Please retry your payment to confirm your slot.`
        };

      case 'REFUND_COMPLETED':
        return {
          subject: `Refund Processed - ${summary.bookingId}`,
          body: `Your refund of ${advanceFmt} for booking ${summary.bookingId} has been successfully processed.`
        };

      case 'BOOKING_CREATED':
      default:
        return {
          subject: `Booking Draft Created - ${summary.bookingId}`,
          body: `Your booking draft ${summary.bookingId} for ${summary.serviceName} has been initiated.`
        };
    }
  }
}

/**
 * Mock Channel Provider Adapters
 */
export class MockEmailChannelProvider implements NotificationChannelProvider {
  public channel: NotificationChannel = 'EMAIL';

  public async send(params: NotificationSendParams): Promise<NotificationSendResult> {
    if (params.simulateFailure) {
      return { success: false, error: 'Simulated Email SMTP server connection timeout' };
    }
    const providerMessageId = `msg_email_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    return { success: true, providerMessageId };
  }
}

export class MockWhatsAppChannelProvider implements NotificationChannelProvider {
  public channel: NotificationChannel = 'WHATSAPP';

  public async send(params: NotificationSendParams): Promise<NotificationSendResult> {
    if (params.simulateFailure) {
      return { success: false, error: 'Simulated WhatsApp Cloud API rate limit exceeded' };
    }
    const providerMessageId = `msg_wa_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    return { success: true, providerMessageId };
  }
}

export class MockSmsChannelProvider implements NotificationChannelProvider {
  public channel: NotificationChannel = 'SMS';

  public async send(params: NotificationSendParams): Promise<NotificationSendResult> {
    if (params.simulateFailure) {
      return { success: false, error: 'Simulated SMS Gateway undeliverable route' };
    }
    const providerMessageId = `msg_sms_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    return { success: true, providerMessageId };
  }
}

export class MockInAppChannelProvider implements NotificationChannelProvider {
  public channel: NotificationChannel = 'IN_APP';

  public async send(params: NotificationSendParams): Promise<NotificationSendResult> {
    if (params.simulateFailure) {
      return { success: false, error: 'Simulated WebSocket push notification stream error' };
    }
    const providerMessageId = `msg_push_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    return { success: true, providerMessageId };
  }
}

/**
 * Notification Dispatcher & Audit Store (Phase 4.7 Requirement)
 * Loosely coupled event bus with strict fault isolation.
 */
export class NotificationDispatcherService {
  private providers: Map<NotificationChannel, NotificationChannelProvider> = new Map();
  private auditRecords: NotificationRecord[] = [];
  private processedEventKeys: Set<string> = new Set();

  constructor() {
    this.registerProvider(new MockEmailChannelProvider());
    this.registerProvider(new MockWhatsAppChannelProvider());
    this.registerProvider(new MockSmsChannelProvider());
    this.registerProvider(new MockInAppChannelProvider());
  }

  public registerProvider(provider: NotificationChannelProvider): void {
    this.providers.set(provider.channel, provider);
  }

  /**
   * Dispatches event notifications across specified channels.
   * STRICT FAULT ISOLATION: Never throws or fails the paid booking if notifications fail!
   */
  public async dispatchBookingEvent(
    options: DispatchEventOptions
  ): Promise<{ dispatchedRecords: NotificationRecord[]; allSucceeded: boolean }> {
    const { event, booking, businessName = 'Nexora Premium Salon', options: extraOptions } = options as any;
    const channels = options.channels || ['EMAIL', 'WHATSAPP', 'SMS', 'IN_APP'];
    const simulateFailureChannels = options.simulateFailureChannels || [];

    const summary = extractConfirmationSummary(booking, businessName);
    const dispatchedRecords: NotificationRecord[] = [];
    let allSucceeded = true;

    for (const channel of channels) {
      const eventKey = `${event}_${booking.id}_${channel}`;

      // Idempotency check for duplicate event dispatch
      if (this.processedEventKeys.has(eventKey)) {
        const existing = this.auditRecords.find(
          (r) => r.bookingId === booking.id && r.event === event && r.channel === channel
        );
        if (existing) {
          dispatchedRecords.push(existing);
        }
        continue;
      }

      this.processedEventKeys.add(eventKey);

      const recipient =
        channel === 'EMAIL'
          ? booking.customerEmail
          : channel === 'WHATSAPP' || channel === 'SMS'
          ? booking.customerPhone
          : booking.customerId || 'user_guest';

      const { subject, body } = NotificationTemplateEngine.renderTemplate(event, channel, summary);

      const notificationId = `ntf_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      const nowIso = new Date().toISOString();

      const record: NotificationRecord = {
        notificationId,
        businessId: booking.businessId,
        userId: booking.customerId || 'user_guest',
        bookingId: booking.id,
        event,
        channel,
        status: 'QUEUED',
        recipient,
        subject,
        body,
        createdAtIso: nowIso
      };

      const provider = this.providers.get(channel);
      const shouldSimulateFailure = simulateFailureChannels.includes(channel);

      // Fault Isolation Wrapper
      try {
        if (!provider) {
          record.status = 'FAILED';
          record.failedAtIso = new Date().toISOString();
          record.failureReason = `No provider adapter registered for channel ${channel}`;
          allSucceeded = false;
        } else {
          const sendRes = await provider.send({ record, simulateFailure: shouldSimulateFailure });
          if (sendRes.success) {
            record.status = 'SENT';
            record.sentAtIso = new Date().toISOString();
            record.providerMessageId = sendRes.providerMessageId;
          } else {
            record.status = 'FAILED';
            record.failedAtIso = new Date().toISOString();
            record.failureReason = sendRes.error || 'Channel dispatch failed';
            allSucceeded = false;
          }
        }
      } catch (err: any) {
        // Absolute safety catch: Notification failure MUST NOT affect booking!
        record.status = 'FAILED';
        record.failedAtIso = new Date().toISOString();
        record.failureReason = err.message || 'Unexpected exception during notification dispatch';
        allSucceeded = false;
      }

      this.auditRecords.unshift(record);
      dispatchedRecords.push(record);
    }

    return { dispatchedRecords, allSucceeded };
  }

  public getRecordsForBooking(bookingId: string): NotificationRecord[] {
    return this.auditRecords.filter((r) => r.bookingId === bookingId);
  }

  public getAllRecords(): NotificationRecord[] {
    return [...this.auditRecords];
  }

  public resetLogs(): void {
    this.auditRecords = [];
    this.processedEventKeys.clear();
  }
}

export const notificationDispatcherService = new NotificationDispatcherService();
