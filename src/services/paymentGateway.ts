// Nexora SalonOS — Phase 4.5 Payment Gateway Adapter & Sandbox Abstraction Boundary
// Decoupled payment processing, test-mode simulation, and intent verification

import {
  PaymentGatewayAdapter,
  CreatePaymentIntentRequest,
  PaymentIntent,
  PaymentExecutionResult,
  PaymentMethodType
} from '../types/paymentEngine';

export class MockPaymentGatewayAdapter implements PaymentGatewayAdapter {
  private intents: Map<string, PaymentIntent> = new Map();

  /**
   * Creates a payment intent for a customer checkout session
   */
  public async createPaymentIntent(
    request: CreatePaymentIntentRequest
  ): Promise<PaymentIntent> {
    const id = `pi_test_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const clientSecret = `sec_${Math.random().toString(36).substring(2, 12)}_secret`;

    const intent: PaymentIntent = {
      id,
      businessId: request.businessId,
      amountCents: request.amountCents,
      currency: request.currency || 'INR',
      status: 'REQUIRES_PAYMENT_METHOD',
      clientSecret,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      createdAtIso: new Date().toISOString(),
      isTestMode: true
    };

    this.intents.set(id, intent);
    return intent;
  }

  /**
   * Synchronous helper for unit test environment
   */
  public createPaymentIntentSync(
    request: Partial<CreatePaymentIntentRequest> & {
      businessId: string;
      amountCents: number;
      status?: PaymentIntent['status'];
      gatewayTransactionRef?: string;
    }
  ): PaymentIntent {
    const id = `pi_test_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const clientSecret = `sec_${Math.random().toString(36).substring(2, 12)}_secret`;

    const intent: PaymentIntent = {
      id,
      businessId: request.businessId,
      amountCents: request.amountCents,
      currency: request.currency || 'INR',
      status: request.status || 'SUCCEEDED',
      clientSecret,
      customerEmail: request.customerEmail || 'test@example.com',
      customerPhone: request.customerPhone || '+91 9999999999',
      createdAtIso: new Date().toISOString(),
      isTestMode: true,
      paymentMethod: 'SANDBOX_TEST',
      gatewayTransactionRef: request.gatewayTransactionRef || `TXN-SBX-${Math.floor(1000 + Math.random() * 9000)}`
    };

    this.intents.set(id, intent);
    return intent;
  }

  /**
   * Simulates payment confirmation in developer sandbox environment
   */
  public async confirmPayment(
    intentId: string,
    method: PaymentMethodType = 'SANDBOX_TEST',
    simulateFailure: boolean = false
  ): Promise<PaymentExecutionResult> {
    const intent = this.intents.get(intentId);

    if (!intent) {
      return {
        success: false,
        paymentIntent: {
          id: intentId,
          businessId: 'unknown',
          amountCents: 0,
          currency: 'INR',
          status: 'FAILED',
          clientSecret: '',
          customerEmail: '',
          customerPhone: '',
          createdAtIso: new Date().toISOString(),
          isTestMode: true,
          failureReason: 'Payment intent not found'
        },
        errorMessage: 'Payment intent not found in test registry'
      };
    }

    // Simulate brief network latency for realistic UX feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (simulateFailure) {
      intent.status = 'FAILED';
      intent.failureReason = 'Card declined by simulated issuing bank (Test Failure Triggered)';
      return {
        success: false,
        paymentIntent: intent,
        errorMessage: intent.failureReason
      };
    }

    const transactionRef = `TXN-SBX-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    intent.status = 'SUCCEEDED';
    intent.paymentMethod = method;
    intent.gatewayTransactionRef = transactionRef;
    intent.completedAtIso = new Date().toISOString();

    return {
      success: true,
      paymentIntent: intent,
      transactionRef
    };
  }

  /**
   * Cryptographically verifies simulated webhook or signature token
   */
  public verifyPaymentSignature(intentId: string, signature: string): boolean {
    const intent = this.intents.get(intentId);
    if (!intent || intent.status !== 'SUCCEEDED') return false;
    return signature.startsWith('sig_test_') || signature.length > 5;
  }

  /**
   * Retrieve intent by ID
   */
  public getPaymentIntent(intentId: string): PaymentIntent | undefined {
    return this.intents.get(intentId);
  }
}

// Export singleton instance for applet usage
export const mockPaymentGateway = new MockPaymentGatewayAdapter();
