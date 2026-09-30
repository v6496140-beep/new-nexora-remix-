// Nexora SalonOS — Phase 6.5 Daily Business Withdrawal Engine Service
// Strict Idempotency, Tokenized Payout Identifiers, and Rollback State Recovery

import { WithdrawalBatch, PayoutSettings, WithdrawalEligibilityState } from '../types/withdrawalEngine';
import { NexoraLedgerService } from './nexoraLedgerService';

export class WithdrawalEngineService {
  private ledgerService: NexoraLedgerService;
  private batches: Map<string, WithdrawalBatch> = new Map();
  private settings: Map<string, PayoutSettings> = new Map();

  // Simulated balances map to track states for payments (in cents)
  private paymentStates: Map<string, {
    paymentId: string;
    businessId: string;
    amountCents: number;
    withdrawableCents: number;
    commissionCents: number;
    state: WithdrawalEligibilityState;
  }> = new Map();

  constructor(ledgerService?: NexoraLedgerService) {
    this.ledgerService = ledgerService || new NexoraLedgerService();
  }

  public getSettings(businessId: string): PayoutSettings {
    let s = this.settings.get(businessId);
    if (!s) {
      s = {
        businessId,
        manualWithdrawalEnabled: false,
        secureBankReferenceToken: `tok_bank_ref_${Math.random().toString(36).substr(2, 6)}`,
        nextWithdrawalTime: '10:00 PM'
      };
      this.settings.set(businessId, s);
    }
    return s;
  }

  public updateManualWithdrawalMode(businessId: string, enabled: boolean) {
    const s = this.getSettings(businessId);
    s.manualWithdrawalEnabled = enabled;
  }

  /**
   * Register simulated booking payment under specific eligibility track
   */
  public registerPaymentTrack(params: {
    paymentId: string;
    businessId: string;
    amountCents: number;
    state: WithdrawalEligibilityState;
  }) {
    const split = this.ledgerService.calculateCollectionSplit(params.amountCents);
    this.paymentStates.set(params.paymentId, {
      paymentId: params.paymentId,
      businessId: params.businessId,
      amountCents: params.amountCents,
      withdrawableCents: split.businessWithdrawableCents,
      commissionCents: split.platformCommissionCents,
      state: params.state
    });
  }

  /**
   * Change eligibility state (e.g. from PENDING to AVAILABLE)
   */
  public advancePaymentState(paymentId: string, newState: WithdrawalEligibilityState) {
    const item = this.paymentStates.get(paymentId);
    if (item) {
      item.state = newState;
    }
  }

  /**
   * Fetch current balance breakdowns
   */
  public getBalanceSummary(businessId: string): {
    currentBalance: number;
    pendingBalance: number;
    availableBalance: number;
    todayEarnings: number;
  } {
    let pending = 0;
    let available = 0;
    let total = 0;

    for (const item of this.paymentStates.values()) {
      if (item.businessId === businessId) {
        if (item.state === 'PENDING') {
          pending += item.withdrawableCents;
          total += item.withdrawableCents;
        } else if (item.state === 'AVAILABLE') {
          available += item.withdrawableCents;
          total += item.withdrawableCents;
        } else if (item.state === 'PAID') {
          // Already paid
        } else {
          total += item.withdrawableCents;
        }
      }
    }

    return {
      currentBalance: total,
      pendingBalance: pending,
      availableBalance: available,
      todayEarnings: total
    };
  }

  /**
   * Trigger 10:00 PM cutoff extraction batch
   */
  public createDailyCutoffBatch(businessId: string, dateStr: string): WithdrawalBatch | null {
    // Check if a batch already exists for this business on this date to prevent duplicate batch runs
    for (const batch of this.batches.values()) {
      if (batch.businessId === businessId && batch.date === dateStr) {
        throw new Error(`DUPLICATE_BATCH_RUN_BLOCKED: Batch already processed for ${dateStr}`);
      }
    }

    // Accumulate eligible AVAILABLE items
    let eligibleAmount = 0;
    let commission = 0;
    let finalWithdrawalAmount = 0;
    const targetedPaymentIds: string[] = [];

    for (const item of this.paymentStates.values()) {
      if (item.businessId === businessId && item.state === 'AVAILABLE') {
        eligibleAmount += item.amountCents;
        commission += item.commissionCents;
        finalWithdrawalAmount += item.withdrawableCents;
        targetedPaymentIds.push(item.paymentId);
      }
    }

    if (finalWithdrawalAmount <= 0) {
      return null;
    }

    // Place targets to PROCESSING so duplicate payout requests are blocked
    for (const pid of targetedPaymentIds) {
      const item = this.paymentStates.get(pid);
      if (item) item.state = 'PROCESSING';
    }

    const batchId = `bat-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
    const newBatch: WithdrawalBatch = {
      batchId,
      businessId,
      date: dateStr,
      eligibleAmount,
      commission,
      adjustments: 0,
      finalWithdrawalAmount,
      status: 'PROCESSING',
      createdAt: new Date().toISOString()
    };

    this.batches.set(batchId, newBatch);
    return newBatch;
  }

  /**
   * Confirm payout succeeded with external payment gateway transaction reference (UTR)
   */
  public confirmPayoutSuccess(batchId: string, utr: string) {
    const batch = this.batches.get(batchId);
    if (!batch) return;

    batch.status = 'PAID';
    batch.utr = utr;

    // Transition related targets to PAID
    for (const item of this.paymentStates.values()) {
      if (item.businessId === batch.businessId && item.state === 'PROCESSING') {
        item.state = 'PAID';
      }
    }
  }

  /**
   * Mark Payout Failed and restore funds according to strict safety recovery policy
   */
  public markPayoutFailed(batchId: string, policy: 'RETURN_AVAILABLE' | 'HOLD' = 'RETURN_AVAILABLE') {
    const batch = this.batches.get(batchId);
    if (!batch) return;

    batch.status = 'FAILED';

    const targetState: WithdrawalEligibilityState = policy === 'RETURN_AVAILABLE' ? 'AVAILABLE' : 'ON_HOLD';

    for (const item of this.paymentStates.values()) {
      if (item.businessId === batch.businessId && item.state === 'PROCESSING') {
        item.state = targetState;
      }
    }
  }

  public listBatches(businessId?: string): WithdrawalBatch[] {
    const list = Array.from(this.batches.values());
    if (businessId) {
      return list.filter((b) => b.businessId === businessId);
    }
    return list;
  }
}

export const withdrawalEngineService = new WithdrawalEngineService();
