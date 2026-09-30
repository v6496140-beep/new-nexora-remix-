// Nexora SalonOS — Phase 6.4 Commission & Ledger Service
// Centralized calculation engine and ledger records with zero-sum reconciliation validation

import { LedgerEntry, LedgerEntryType, LedgerSummary } from '../types/nexoraLedger';
import { CollectionSplitService } from './collectionSplitService';

export class NexoraLedgerService {
  private ledgerEntries: LedgerEntry[] = [];
  private splitService: CollectionSplitService;

  constructor(splitService?: CollectionSplitService) {
    this.splitService = splitService || new CollectionSplitService();
  }

  // 1. Centralized Calculation Engine Functions
  public calculateCollectionSplit(totalValueCents: number, dateStr?: string) {
    return this.splitService.calculateSplit(totalValueCents, dateStr);
  }

  public calculateCommission(totalValueCents: number, dateStr?: string): number {
    const split = this.splitService.calculateSplit(totalValueCents, dateStr);
    return split.platformCommissionCents;
  }

  public calculateBusinessWithdrawal(totalValueCents: number, dateStr?: string): number {
    const split = this.splitService.calculateSplit(totalValueCents, dateStr);
    return split.businessWithdrawableCents;
  }

  /**
   * Log an operational transaction and produce matched, verified zero-sum entries
   */
  public logBookingPayment(businessId: string, bookingId: string, totalValueCents: number, dateStr?: string): {
    success: boolean;
    entries: LedgerEntry[];
    reconciliationSum: number;
  } {
    const split = this.calculateCollectionSplit(totalValueCents, dateStr);

    // Create Entry 1: NEXORA_COLLECTION (+)
    const entry1: LedgerEntry = {
      entryId: `ent-col-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`,
      businessId,
      bookingId,
      type: 'NEXORA_COLLECTION',
      amountCents: split.nexoraCollectionCents,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      reconciled: true
    };

    // Create Entry 2: PLATFORM_COMMISSION (-)
    const entry2: LedgerEntry = {
      entryId: `ent-com-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`,
      businessId,
      bookingId,
      type: 'PLATFORM_COMMISSION',
      amountCents: -split.platformCommissionCents,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      reconciled: true
    };

    // Create Entry 3: BUSINESS_WITHDRAWABLE (-)
    const entry3: LedgerEntry = {
      entryId: `ent-wth-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`,
      businessId,
      bookingId,
      type: 'BUSINESS_WITHDRAWABLE',
      amountCents: -split.businessWithdrawableCents,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      reconciled: true
    };

    // Verify Zero-Sum Reconciliation Rule (Nexora Collection - Commission - BusinessKeep = 0)
    const reconciliationSum = entry1.amountCents + entry2.amountCents + entry3.amountCents;
    const isZeroSum = reconciliationSum === 0;

    if (isZeroSum) {
      this.ledgerEntries.push(entry1, entry2, entry3);
    }

    return {
      success: isZeroSum,
      entries: [entry1, entry2, entry3],
      reconciliationSum
    };
  }

  /**
   * Log Refund with exact negative entries
   */
  public logRefund(businessId: string, bookingId: string, refundValueCents: number): {
    success: boolean;
    entries: LedgerEntry[];
  } {
    // Reverse proportion calculations
    const platformCommissionRefund = Math.round((refundValueCents * 10) / 25);
    const businessWithdrawalRefund = refundValueCents - platformCommissionRefund;

    const entry1: LedgerEntry = {
      entryId: `ent-ref-col-${Date.now().toString(36)}`,
      businessId,
      bookingId,
      type: 'REFUND_DEBIT',
      amountCents: -refundValueCents,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      reconciled: true
    };

    const entry2: LedgerEntry = {
      entryId: `ent-ref-com-${Date.now().toString(36)}`,
      businessId,
      bookingId,
      type: 'PLATFORM_COMMISSION',
      amountCents: platformCommissionRefund, // Credited back
      currency: 'INR',
      createdAt: new Date().toISOString(),
      reconciled: true
    };

    const entry3: LedgerEntry = {
      entryId: `ent-ref-wth-${Date.now().toString(36)}`,
      businessId,
      bookingId,
      type: 'BUSINESS_WITHDRAWABLE',
      amountCents: businessWithdrawalRefund, // Credited back
      currency: 'INR',
      createdAt: new Date().toISOString(),
      reconciled: true
    };

    this.ledgerEntries.push(entry1, entry2, entry3);

    return {
      success: true,
      entries: [entry1, entry2, entry3]
    };
  }

  /**
   * Fetch current Net Withdrawable balance for a Salon
   */
  public calculateNetNexoraBalance(businessId: string): number {
    let balance = 0;
    for (const entry of this.ledgerEntries) {
      if (entry.businessId === businessId) {
        if (entry.type === 'BUSINESS_WITHDRAWABLE') {
          // BUSINESS_WITHDRAWABLE is stored negative during ledger allocations to sum to zero,
          // so we take the absolute value of standard positive allocations, or sum appropriately.
          // Let's compute actual available balance = sum of absolute BUSINESS_WITHDRAWABLE entries
          balance += Math.abs(entry.amountCents);
        } else if (entry.type === 'REFUND_DEBIT') {
          // Reduce balance on customer refunds
          balance -= Math.round((Math.abs(entry.amountCents) * 15) / 25);
        }
      }
    }
    return balance;
  }

  public getSummary(businessId: string): LedgerSummary {
    let gross = 0;
    let direct = 0;
    let nexora = 0;
    let commission = 0;
    let withdrawable = 0;

    for (const entry of this.ledgerEntries) {
      if (entry.businessId === businessId) {
        if (entry.type === 'NEXORA_COLLECTION') {
          nexora += entry.amountCents;
          gross += Math.round((entry.amountCents * 100) / 25);
          direct += Math.round((entry.amountCents * 75) / 25);
        } else if (entry.type === 'PLATFORM_COMMISSION') {
          commission += Math.abs(entry.amountCents);
        } else if (entry.type === 'BUSINESS_WITHDRAWABLE') {
          withdrawable += Math.abs(entry.amountCents);
        } else if (entry.type === 'REFUND_DEBIT') {
          nexora -= Math.abs(entry.amountCents);
          gross -= Math.round((Math.abs(entry.amountCents) * 100) / 25);
          direct -= Math.round((Math.abs(entry.amountCents) * 75) / 25);
        }
      }
    }

    return {
      grossBookingCents: gross,
      directCollectionCents: direct,
      nexoraCollectionCents: nexora,
      platformCommissionCents: commission,
      businessWithdrawalCents: withdrawable
    };
  }

  public listEntries(businessId?: string): LedgerEntry[] {
    if (businessId) {
      return this.ledgerEntries.filter((e) => e.businessId === businessId);
    }
    return [...this.ledgerEntries];
  }
}

export const nexoraLedgerService = new NexoraLedgerService();
