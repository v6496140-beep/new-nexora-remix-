// Nexora SalonOS — Phase 6.1 Payment & Transaction Service
// Clean Provider Adapters, Immutable Transactions Ledger, and Channel Controls

import {
  PaymentEntity,
  TransactionEntity,
  PaymentType,
  CollectionChannel,
  PaymentStatus,
  TransactionType,
  TransactionStatus
} from '../types/paymentArchitecture';

export interface PaymentProviderAdapter {
  providerName: string;
  createOrder(amount: number, currency: string, bookingId: string): Promise<{ providerOrderId: string; status: 'CREATED' | 'FAILED' }>;
  verifyPayment(providerOrderId: string, providerPaymentId: string, signature: string): Promise<{ success: boolean }>;
}

// 1. Mock Razorpay Adapter
export class RazorpayPaymentAdapter implements PaymentProviderAdapter {
  providerName = 'RAZORPAY';

  async createOrder(amount: number, currency: string, bookingId: string) {
    const providerOrderId = `rzp_order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    return { providerOrderId, status: 'CREATED' as const };
  }

  async verifyPayment(providerOrderId: string, providerPaymentId: string, signature: string) {
    // Basic valid signature simulation
    const isValid = signature.startsWith('sig_') && providerOrderId.length > 0 && providerPaymentId.length > 0;
    return { success: isValid };
  }
}

// 2. Main Service
export class PaymentArchitectureService {
  private payments: Map<string, PaymentEntity> = new Map();
  private transactionsLedger: TransactionEntity[] = [];
  private adapters: Map<string, PaymentProviderAdapter> = new Map();

  constructor() {
    // Register Default Adapters
    this.registerAdapter('RAZORPAY', new RazorpayPaymentAdapter());
  }

  public registerAdapter(name: string, adapter: PaymentProviderAdapter) {
    this.adapters.set(name.toUpperCase(), adapter);
  }

  /**
   * Create New Payment Record (Separate from Booking)
   */
  public async initPayment(params: {
    businessId: string;
    bookingId: string;
    customerId: string;
    amount: number; // in cents
    currency: string;
    paymentType: PaymentType;
    collectionChannel: CollectionChannel;
    providerName: string;
  }): Promise<PaymentEntity> {
    const paymentId = `pay-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
    let providerOrderId: string | undefined;

    // Call adapter if online channel
    if (params.collectionChannel === 'NEXORA_QR' || params.providerName !== 'CASH') {
      const adapter = this.adapters.get(params.providerName.toUpperCase());
      if (adapter) {
        const orderRes = await adapter.createOrder(params.amount, params.currency, params.bookingId);
        if (orderRes.status === 'CREATED') {
          providerOrderId = orderRes.providerOrderId;
        }
      }
    }

    const newPayment: PaymentEntity = {
      paymentId,
      businessId: params.businessId,
      bookingId: params.bookingId,
      customerId: params.customerId,
      provider: params.providerName,
      providerOrderId,
      amount: params.amount,
      currency: params.currency,
      paymentType: params.paymentType,
      collectionChannel: params.collectionChannel,
      status: 'CREATED',
      createdAt: new Date().toISOString()
    };

    this.payments.set(paymentId, newPayment);
    return newPayment;
  }

  /**
   * Confirm/Capture Payment & Create Immutable Transaction Log
   */
  public async confirmPayment(
    paymentId: string,
    providerPaymentId?: string,
    signature?: string
  ): Promise<{ success: boolean; payment: PaymentEntity; transaction?: TransactionEntity }> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error(`Payment record '${paymentId}' not found.`);
    }

    if (payment.status === 'CAPTURED') {
      return { success: true, payment };
    }

    // Verify online payments
    if (payment.collectionChannel === 'NEXORA_QR' && payment.providerOrderId) {
      const adapter = this.adapters.get(payment.provider.toUpperCase());
      if (adapter) {
        const verified = await adapter.verifyPayment(
          payment.providerOrderId,
          providerPaymentId || '',
          signature || ''
        );
        if (!verified.success) {
          payment.status = 'FAILED';
          return { success: false, payment };
        }
      }
    }

    // Update payment record (verified state)
    payment.status = 'CAPTURED';
    payment.providerPaymentId = providerPaymentId;
    payment.verifiedAt = new Date().toISOString();

    // Generate Immutable Transaction record
    const transactionId = `txn-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
    
    // Check if channel is Nexora-controlled
    const txType: TransactionType = payment.paymentType === 'REFUND' ? 'REFUND_DEBIT' : 'CREDIT';

    const newTx: TransactionEntity = {
      transactionId,
      businessId: payment.businessId,
      bookingId: payment.bookingId,
      paymentId: payment.paymentId,
      type: txType,
      grossAmount: payment.amount,
      channel: payment.collectionChannel,
      status: 'SUCCESS',
      referenceId: providerPaymentId,
      createdAt: new Date().toISOString()
    };

    this.transactionsLedger.push(newTx);

    return { success: true, payment, transaction: newTx };
  }

  /**
   * Fetch All Immutable Transactions (Filterable by Nexora Payout Control)
   */
  public listTransactions(businessId?: string, forceNexoraOnly: boolean = false): TransactionEntity[] {
    let list = [...this.transactionsLedger];
    if (businessId) {
      list = list.filter((tx) => tx.businessId === businessId);
    }
    if (forceNexoraOnly) {
      // Only NEXORA_QR enters the commission/payout ledger matching config
      list = list.filter((tx) => tx.channel === 'NEXORA_QR');
    }
    return list;
  }

  public getPayment(paymentId: string): PaymentEntity | null {
    return this.payments.get(paymentId) || null;
  }
}

export const paymentArchitectureService = new PaymentArchitectureService();
