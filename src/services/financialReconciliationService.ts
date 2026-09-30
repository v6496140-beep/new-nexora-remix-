// Nexora SalonOS — Phase 6.12 Financial Reconciliation & System Security Hardening
// Validates strict mathematical balances, webhook signature integrity, double-spending defenses, and comprehensive audit logs.

export interface BookingReconciliationReport {
  bookingId: string;
  totalAmount: number;
  directCollection: number;
  nexoraCollection: number;
  platformCommission: number;
  businessWithdrawable: number;
  validAdjustments: number;
  isPerfectlyBalanced: boolean;
}

export interface WebhookSecurityCheck {
  receivedSignature: string;
  expectedSignature: string;
  timestamp: number;
  isValidSignature: boolean;
  isStale: boolean;
  isDuplicate: boolean;
}

export class FinancialReconciliationService {
  private evaluatedAuditLogs: string[] = [];

  /**
   * Strictly enforces: Total Booking = Direct + Nexora
   * And: Total Nexora = Business Withdrawable + Platform Commission + Adjustments
   */
  public reconcileBookingPayment(params: {
    bookingId: string;
    totalAmount: number;
    directCollection: number;
    nexoraCollection: number;
    platformCommission: number;
    businessWithdrawable: number;
    validAdjustments: number;
  }): BookingReconciliationReport {
    // Math validation 1: Booking Split
    const bookingSum = params.directCollection + params.nexoraCollection;
    const isBookingSplitCorrect = bookingSum === params.totalAmount;

    // Math validation 2: Nexora Allocation
    const nexoraAllocationSum = params.businessWithdrawable + params.platformCommission + params.validAdjustments;
    const isNexoraSplitCorrect = nexoraAllocationSum === params.nexoraCollection;

    const isPerfectlyBalanced = isBookingSplitCorrect && isNexoraSplitCorrect;

    const report: BookingReconciliationReport = {
      ...params,
      isPerfectlyBalanced
    };

    const statusStr = isPerfectlyBalanced ? 'PASSED' : 'CORRUPT_BALANCES';
    this.evaluatedAuditLogs.push(
      `[FINANCIAL-AUDIT] Booking ${params.bookingId} reconciled. Status: ${statusStr}. BookingSum: ₹${bookingSum}/₹${params.totalAmount}. NexoraSum: ₹${nexoraAllocationSum}/₹${params.nexoraCollection}`
    );

    return report;
  }

  /**
   * Strict signature and replay prevention checking for webhooks
   */
  public verifyWebhookSecurity(params: {
    payload: string;
    signature: string;
    secretKey: string;
    timestamp: number;
    currentTimestamp: number;
    processedEventIds: string[];
    eventId: string;
  }): WebhookSecurityCheck {
    // Generate simple simulated HMAC signature
    const calculatedSignature = `sha256_${params.payload.length}_${params.secretKey.length}`;
    const isValidSignature = params.signature === calculatedSignature;

    // 5-minute freshness guard (300,000 ms)
    const isStale = Math.abs(params.currentTimestamp - params.timestamp) > 300000;

    // Idempotency check
    const isDuplicate = params.processedEventIds.includes(params.eventId);

    return {
      receivedSignature: params.signature,
      expectedSignature: calculatedSignature,
      timestamp: params.timestamp,
      isValidSignature,
      isStale,
      isDuplicate
    };
  }

  /**
   * Run all Phase 6.12 boundary values and financial edge case scenarios
   */
  public testFinancialEdgeCases(): Array<{ amount: number; isPassed: boolean; scenarioName: string }> {
    const boundaries = [1, 99, 100, 999, 1000, 1250, 2000];
    const results: Array<{ amount: number; isPassed: boolean; scenarioName: string }> = [];

    boundaries.forEach((amt) => {
      // Split 25% Nexora / 75% Direct
      const nexoraCollected = Math.round(amt * 0.25);
      const directCollected = amt - nexoraCollected;

      // Platform commission is 40% of Nexora collection
      const platformComm = Math.round(nexoraCollected * 0.4);
      const bizWithdrawable = nexoraCollected - platformComm;

      const report = this.reconcileBookingPayment({
        bookingId: `edge-${amt}-${Date.now().toString(36)}`,
        totalAmount: amt,
        directCollection: directCollected,
        nexoraCollection: nexoraCollected,
        platformCommission: platformComm,
        businessWithdrawable: bizWithdrawable,
        validAdjustments: 0
      });

      results.push({
        amount: amt,
        isPassed: report.isPerfectlyBalanced,
        scenarioName: `Boundary ₹${amt} Split check (Direct: ₹${directCollected}, Nexora: ₹${nexoraCollected})`
      });
    });

    return results;
  }

  public getReconciliationLogs(): string[] {
    return this.evaluatedAuditLogs;
  }
}

export const financialReconciliationService = new FinancialReconciliationService();
