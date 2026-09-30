// Nexora SalonOS — Phase 6.1 Payment + Transaction Architecture Types
// Strict Provider-Independent Definitions

export type PaymentType =
  | 'ADVANCE'
  | 'REMAINING'
  | 'FULL_PAYMENT'
  | 'REFUND'
  | 'ADJUSTMENT';

export type CollectionChannel =
  | 'NEXORA_QR'
  | 'SALON_OWN_QR'
  | 'CASH'
  | 'OTHER';

export type PaymentStatus =
  | 'CREATED'
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'REVERSED';

export interface PaymentEntity {
  paymentId: string;
  businessId: string;
  bookingId: string;
  customerId: string;
  provider: string; // e.g. 'RAZORPAY', 'STRIPE', 'CASH'
  providerOrderId?: string;
  providerPaymentId?: string;
  amount: number; // in cents
  currency: string;
  paymentType: PaymentType;
  collectionChannel: CollectionChannel;
  status: PaymentStatus;
  createdAt: string;
  verifiedAt?: string;
  metadata?: Record<string, any>;
}

export type TransactionType =
  | 'CREDIT'
  | 'DEBIT'
  | 'REFUND_DEBIT'
  | 'ADJUSTMENT_CREDIT'
  | 'ADJUSTMENT_DEBIT';

export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface TransactionEntity {
  transactionId: string;
  businessId: string;
  bookingId: string;
  paymentId: string;
  type: TransactionType;
  grossAmount: number; // in cents
  channel: CollectionChannel;
  status: TransactionStatus;
  referenceId?: string;
  createdAt: string;
}
