// Nexora SalonOS — Phase 4.6 Advance Payment Architecture Types
// Provider-independent payment abstraction, minor-unit money safety, and webhook idempotency

export type PaymentMethodType = 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET' | 'SANDBOX_TEST';

export type PaymentType = 'ADVANCE' | 'REMAINING' | 'REFUND';

export type PaymentStatus = 'CREATED' | 'PENDING' | 'VERIFIED' | 'FAILED' | 'REFUNDED';

export type PaymentProvider = 'RAZORPAY' | 'SANDBOX' | 'MOCK';

export type PaymentIntentStatus =
  | 'REQUIRES_PAYMENT_METHOD'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED';

/**
 * Immutable Payment Record (Phase 4.6 Requirement)
 * Stores full audit payload in integer minor units (paise/cents)
 */
export interface PaymentRecord {
  paymentId: string;
  businessId: string;
  bookingId: string;
  customerId: string;
  provider: PaymentProvider;
  orderId: string;
  transactionId?: string;
  amountPaise: number; // Integer minor units (e.g., 25000 = ₹250.00)
  currency: string; // 'INR'
  paymentType: PaymentType;
  status: PaymentStatus;
  createdAtIso: string;
  verifiedAtIso?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
}

/**
 * Money Safety & Advance Calculation Breakdown
 */
export interface AdvanceCalculationResult {
  totalAmountPaise: number;
  advancePercentage: number;
  advanceAmountPaise: number;
  remainingAmountPaise: number;
  currency: string;
}

/**
 * Provider-Independent Order Creation Request
 */
export interface CreateOrderParams {
  businessId: string;
  bookingId: string;
  customerId: string;
  amountPaise: number;
  currency?: string; // Default 'INR'
  paymentType: PaymentType;
  metadata?: Record<string, any>;
}

/**
 * Provider-Independent Payment Initiation Request
 */
export interface InitiatePaymentParams {
  orderId: string;
  paymentMethod?: PaymentMethodType;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
}

export interface InitiatePaymentResponse {
  orderId: string;
  paymentId: string;
  provider: PaymentProvider;
  checkoutUrl?: string;
  clientSecret?: string;
  gatewayTransactionRef?: string;
  amountPaise: number;
  currency: string;
}

/**
 * Server-Side Payment Verification Request
 */
export interface VerifyPaymentParams {
  orderId: string;
  transactionId: string;
  signature: string;
  simulateFailure?: boolean;
}

export interface VerifyPaymentResult {
  verified: boolean;
  paymentRecord: PaymentRecord;
  error?: string;
}

/**
 * Webhook Event Payload & Audit Log
 */
export interface WebhookPayload {
  eventId: string;
  eventType: string; // e.g. 'payment.captured', 'payment.failed'
  createdAt: number;
  payload: {
    orderId: string;
    transactionId: string;
    amountPaise: number;
    status: 'authorized' | 'captured' | 'failed';
    failureReason?: string;
  };
}

export interface WebhookProcessingResult {
  success: boolean;
  eventId: string;
  idempotent: boolean; // true if duplicate event was cleanly ignored
  paymentRecord?: PaymentRecord;
  message: string;
}

export interface WebhookAuditLogEntry {
  id: string;
  eventId: string;
  eventType: string;
  receivedAtIso: string;
  provider: PaymentProvider;
  signatureVerified: boolean;
  idempotentDuplicate: boolean;
  status: 'PROCESSED' | 'DUPLICATE_IGNORED' | 'INVALID_SIGNATURE' | 'FAILED';
  details: string;
}

/**
 * Refund Request & Result
 */
export interface RefundParams {
  paymentId: string;
  amountPaise: number;
  reason?: string;
}

export interface RefundResult {
  success: boolean;
  refundRecord: PaymentRecord;
  error?: string;
}

/**
 * Legacy Phase 4.5 Compatibility Interfaces
 */
export interface CreatePaymentIntentRequest {
  businessId: string;
  amountCents: number;
  currency: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  metadata: {
    bookingDraftId: string;
    serviceId?: string;
    packageId?: string;
    date: string;
    startTime: string;
    description: string;
  };
}

export interface PaymentIntent {
  id: string;
  businessId: string;
  amountCents: number;
  currency: string;
  status: PaymentIntentStatus;
  clientSecret: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod?: PaymentMethodType;
  gatewayTransactionRef?: string;
  createdAtIso: string;
  completedAtIso?: string;
  isTestMode: true;
  failureReason?: string;
}

export interface PaymentExecutionResult {
  success: boolean;
  paymentIntent: PaymentIntent;
  transactionRef?: string;
  errorMessage?: string;
}

export interface PaymentGatewayAdapter {
  createPaymentIntent(request: CreatePaymentIntentRequest): Promise<PaymentIntent>;
  confirmPayment(intentId: string, method: PaymentMethodType, simulateFailure?: boolean): Promise<PaymentExecutionResult>;
  verifyPaymentSignature(intentId: string, signature: string): boolean;
}

/**
 * Core Provider-Independent Payment Gateway Provider Interface (Phase 4.6 Requirement)
 * Enables Razorpay, Sandbox, or future PSP adapters without changing domain booking logic
 */
export interface PaymentGatewayProvider {
  providerId: PaymentProvider;
  createOrder(params: CreateOrderParams): Promise<PaymentRecord>;
  initiatePayment(params: InitiatePaymentParams): Promise<InitiatePaymentResponse>;
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult>;
  handleWebhook(payload: WebhookPayload, signatureHeader: string): Promise<WebhookProcessingResult>;
  refundPayment(params: RefundParams): Promise<RefundResult>;
  getPaymentStatus(paymentIdOrOrderId: string): Promise<PaymentRecord | undefined>;
}
