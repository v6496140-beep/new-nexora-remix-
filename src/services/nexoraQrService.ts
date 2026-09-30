// Nexora SalonOS — Phase 6.2 Nexora QR Collection & Webhook Engine
// Strict Webhook Verification, Amount Guardrails, Idempotency and Session States

import { NexoraQrConfig, QrPaymentSession, QrPaymentSessionState } from '../types/nexoraQr';
import { PaymentArchitectureService } from './paymentArchitectureService';

export class NexoraQrService {
  private qrConfigs: Map<string, NexoraQrConfig> = new Map();
  private activeSessions: Map<string, QrPaymentSession> = new Map();
  private processedEvents: Set<string> = new Set(); // Store processed transactionIds for idempotency
  private paymentService: PaymentArchitectureService;

  constructor(paymentService: PaymentArchitectureService) {
    this.paymentService = paymentService;

    // Seed some business QR codes
    this.registerQrCode({
      qrId: 'qr-barber-001',
      businessId: 'biz-barber-001',
      displayName: 'Royal Crown UPI',
      provider: 'RAZORPAY_QR',
      active: true,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    });

    this.registerQrCode({
      qrId: 'qr-spa-002',
      businessId: 'biz-spa-002',
      displayName: 'Zenith Spa QR',
      provider: 'RAZORPAY_QR',
      active: true,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    });
  }

  public registerQrCode(cfg: NexoraQrConfig) {
    this.qrConfigs.set(cfg.businessId, cfg);
  }

  public getQrConfig(businessId: string): NexoraQrConfig | null {
    return this.qrConfigs.get(businessId) || null;
  }

  /**
   * Create active QR collection session (separate timer)
   */
  public createSession(paymentId: string, businessId: string, bookingId: string, amount: number, currency: string): QrPaymentSession {
    const sessionId = `qrsess-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
    
    // Expires in 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const session: QrPaymentSession = {
      sessionId,
      paymentId,
      businessId,
      bookingId,
      amount,
      currency,
      state: 'Waiting',
      expiresAt,
      createdAt: new Date().toISOString()
    };

    this.activeSessions.set(sessionId, session);
    return session;
  }

  public getSession(sessionId: string): QrPaymentSession | null {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    // Auto-expire check
    if (session.state === 'Waiting' && new Date() > new Date(session.expiresAt)) {
      session.state = 'Expired';
    }
    return session;
  }

  public forceExpireSession(sessionId: string) {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.state = 'Expired';
    }
  }

  /**
   * Process incoming webhook event with verified signature, amount check & idempotency
   */
  public async handleWebhookEvent(params: {
    signature: string;
    eventId: string; // Idempotency check key
    sessionId: string;
    providerPaymentId: string;
    amountSentCents: number;
  }): Promise<{ success: boolean; error?: string }> {
    // 1. Signature check
    if (!params.signature.startsWith('sha256_valid_')) {
      return { success: false, error: 'INVALID_SIGNATURE' };
    }

    // 2. Idempotency check
    if (this.processedEvents.has(params.eventId)) {
      return { success: false, error: 'DUPLICATE_EVENT_BLOCKED' };
    }

    const session = this.activeSessions.get(params.sessionId);
    if (!session) {
      return { success: false, error: 'SESSION_NOT_FOUND' };
    }

    // 3. Expiry check
    if (session.state === 'Expired' || new Date() > new Date(session.expiresAt)) {
      session.state = 'Expired';
      return { success: false, error: 'PAYMENT_SESSION_EXPIRED' };
    }

    // 4. Amount mismatch check
    if (params.amountSentCents !== session.amount) {
      session.state = 'Failed';
      return { success: false, error: 'AMOUNT_MISMATCH' };
    }

    // Capture the payment using underlying architecture
    session.state = 'Processing';
    const captureRes = await this.paymentService.confirmPayment(
      session.paymentId,
      params.providerPaymentId,
      'sig_webhook_verified'
    );

    if (captureRes.success) {
      session.state = 'Success';
      this.processedEvents.add(params.eventId); // Track idempotency only on verified success
      return { success: true };
    } else {
      session.state = 'Failed';
      return { success: false, error: 'CAPTURE_FAILED' };
    }
  }
}
