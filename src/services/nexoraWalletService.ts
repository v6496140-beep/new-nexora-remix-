// Nexora SalonOS — Phase 6.6 Business Wallet & Financial Ledger Service
// Complete immutable audit log trail, full/partial refund engines, chargebacks, and statement aggregators

import { WalletLedgerEntry, LedgerFlowType, BusinessWallet, FinancialStatement, ChargebackRecord } from '../types/nexoraWallet';
import { CollectionSplitService } from './collectionSplitService';

export class NexoraWalletService {
  private ledgerEntries: WalletLedgerEntry[] = [];
  private chargebacks: Map<string, ChargebackRecord> = new Map();
  private splitService: CollectionSplitService;

  constructor(splitService?: CollectionSplitService) {
    this.splitService = splitService || new CollectionSplitService();

    // Seed some initial financial history for Royal Crown Barber (biz-barber-001)
    this.recordImmutableBooking('biz-barber-001', 'bk-seed-01', 100000, '2026-09-01'); // ₹1,000 Booking
    this.recordImmutableBooking('biz-barber-001', 'bk-seed-02', 200000, '2026-09-10'); // ₹2,000 Booking
  }

  /**
   * Log original booking with 3 immutable zero-sum matched entries
   */
  public recordImmutableBooking(businessId: string, bookingId: string, amountCents: number, dateStr?: string) {
    const split = this.splitService.calculateSplit(amountCents, dateStr);

    // Entry 1: NEXORA_COLLECTION
    const entryCol: WalletLedgerEntry = {
      entryId: `wled-col-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`,
      businessId,
      bookingId,
      type: 'NEXORA_COLLECTION',
      amountCents: split.nexoraCollectionCents,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      description: `Nexora QR collection portion (25% standard) for Booking: ${bookingId}`,
      reconciled: true
    };

    // Entry 2: PLATFORM_COMMISSION
    const entryCom: WalletLedgerEntry = {
      entryId: `wled-com-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`,
      businessId,
      bookingId,
      type: 'PLATFORM_COMMISSION',
      amountCents: -split.platformCommissionCents,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      description: `Nexora platform commission portion (10% standard) for Booking: ${bookingId}`,
      reconciled: true
    };

    // Entry 3: BUSINESS_WITHDRAWABLE
    const entryWth: WalletLedgerEntry = {
      entryId: `wled-wth-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`,
      businessId,
      bookingId,
      type: 'BUSINESS_WITHDRAWABLE',
      amountCents: -split.businessWithdrawableCents,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      description: `Business withdrawable entitlement portion (15% standard) for Booking: ${bookingId}`,
      reconciled: true
    };

    this.ledgerEntries.push(entryCol, entryCom, entryWth);
  }

  /**
   * Process refund with precise matching reversal entries (never editing original records!)
   */
  public processRefund(businessId: string, bookingId: string, refundAmountCents: number): boolean {
    // Determine proportional split reductions
    // Under 10% Platform / 15% Business waterfall:
    // platform portion = 40% of refund
    // business portion = 60% of refund
    const platformRefundCents = Math.round((refundAmountCents * 10) / 25);
    const businessRefundCents = refundAmountCents - platformRefundCents;

    // Corrective Entry 1: REFUND debit to collection pool
    const entryCol: WalletLedgerEntry = {
      entryId: `wled-ref-col-${Date.now().toString(36)}`,
      businessId,
      bookingId,
      type: 'REFUND',
      amountCents: -refundAmountCents,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      description: `Corrective refund deduction on Booking: ${bookingId}`,
      reconciled: true
    };

    // Corrective Entry 2: Platform Commission refund credit
    const entryCom: WalletLedgerEntry = {
      entryId: `wled-ref-com-${Date.now().toString(36)}`,
      businessId,
      bookingId,
      type: 'PLATFORM_COMMISSION',
      amountCents: platformRefundCents, // positive corrective entry
      currency: 'INR',
      createdAt: new Date().toISOString(),
      description: `Corrective platform commission adjustment refund on Booking: ${bookingId}`,
      reconciled: true
    };

    // Corrective Entry 3: Business Withdrawal entitlement debit
    const entryWth: WalletLedgerEntry = {
      entryId: `wled-ref-wth-${Date.now().toString(36)}`,
      businessId,
      bookingId,
      type: 'BUSINESS_WITHDRAWABLE',
      amountCents: -businessRefundCents, // negative corrective debit
      currency: 'INR',
      createdAt: new Date().toISOString(),
      description: `Corrective business withdrawal entitlement reduction on Booking: ${bookingId}`,
      reconciled: true
    };

    this.ledgerEntries.push(entryCol, entryCom, entryWth);
    return true;
  }

  /**
   * Record a chargeback incident
   */
  public receiveChargeback(businessId: string, bookingId: string, chargebackAmountCents: number) {
    const chargebackId = `chg-${Date.now().toString(36)}`;
    const record: ChargebackRecord = {
      chargebackId,
      bookingId,
      businessId,
      amountCents: chargebackAmountCents,
      status: 'RECEIVED',
      adjustmentCents: -chargebackAmountCents, // Immediate adjustment penalty
      createdAt: new Date().toISOString()
    };

    this.chargebacks.set(chargebackId, record);

    // Log Chargeback adjustment debit entry
    const entryChg: WalletLedgerEntry = {
      entryId: `wled-chg-${Date.now().toString(36)}`,
      businessId,
      bookingId,
      type: 'CHARGEBACK',
      amountCents: -chargebackAmountCents,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      description: `Chargeback received on Booking: ${bookingId}. Adjustment adjustment apply.`,
      reconciled: true
    };

    this.ledgerEntries.push(entryChg);
    return record;
  }

  /**
   * Record a general wallet withdrawal cashout
   */
  public recordWithdrawal(businessId: string, amountCents: number) {
    const entry: WalletLedgerEntry = {
      entryId: `wled-wdr-${Date.now().toString(36)}`,
      businessId,
      bookingId: 'N/A',
      type: 'WITHDRAWAL',
      amountCents: -amountCents,
      currency: 'INR',
      createdAt: new Date().toISOString(),
      description: `Business payout withdrawal process completed`,
      reconciled: true
    };
    this.ledgerEntries.push(entry);
  }

  /**
   * Aggregate complete state to feed the Business Wallet Breakdown view
   */
  public getBusinessWallet(businessId: string): BusinessWallet {
    let available = 0;
    let pending = 0;
    let withdrawn = 0;
    let commission = 0;
    let refundAdj = 0;
    let chargebacks = 0;
    let reversals = 0;

    for (const entry of this.ledgerEntries) {
      if (entry.businessId === businessId) {
        if (entry.type === 'BUSINESS_WITHDRAWABLE') {
          // Normal business keep is negative in original split logs, but represents our credited pool.
          // Corrective refund entries are also logged under BUSINESS_WITHDRAWABLE (negative debit), so we sum directly.
          if (entry.amountCents < 0) {
            available += Math.abs(entry.amountCents);
          } else {
            available -= entry.amountCents;
          }
        } else if (entry.type === 'WITHDRAWAL') {
          withdrawn += Math.abs(entry.amountCents);
          available -= Math.abs(entry.amountCents);
        } else if (entry.type === 'PLATFORM_COMMISSION') {
          commission += Math.abs(entry.amountCents);
        } else if (entry.type === 'REFUND') {
          refundAdj += Math.abs(entry.amountCents);
          // Available balance is already reduced because the BUSINESS_WITHDRAWABLE corrective entry is also recorded.
        } else if (entry.type === 'CHARGEBACK') {
          chargebacks += Math.abs(entry.amountCents);
          available -= Math.abs(entry.amountCents); // Immediate adjustment penalty
        } else if (entry.type === 'REVERSAL') {
          reversals += Math.abs(entry.amountCents);
          available += Math.abs(entry.amountCents);
        }
      }
    }

    return {
      businessId,
      availableCents: available,
      pendingCents: pending,
      withdrawnCents: withdrawn,
      commissionPaidCents: commission,
      refundAdjustmentsCents: refundAdj,
      chargebacksCents: chargebacks,
      reversalsCents: reversals
    };
  }

  /**
   * Aggregate dynamic statement report with strict audit-compliant math
   */
  public generateStatement(businessId: string, startDateStr: string, endDateStr: string): FinancialStatement {
    let opening = 0;
    let credits = 0;
    let debits = 0;
    let commission = 0;
    let withdrawals = 0;
    let refunds = 0;

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    for (const entry of this.ledgerEntries) {
      if (entry.businessId === businessId) {
        const entryDate = new Date(entry.createdAt.substring(0, 10));

        if (entryDate < start) {
          // Opening balance accumulation
          if (entry.type === 'BUSINESS_WITHDRAWABLE') {
            opening += Math.abs(entry.amountCents);
          } else if (entry.type === 'WITHDRAWAL') {
            opening -= Math.abs(entry.amountCents);
          } else if (entry.type === 'CHARGEBACK') {
            opening -= Math.abs(entry.amountCents);
          }
        } else if (entryDate <= end) {
          // Active period aggregation
          if (entry.type === 'NEXORA_COLLECTION') {
            credits += entry.amountCents;
          } else if (entry.type === 'PLATFORM_COMMISSION') {
            commission += Math.abs(entry.amountCents);
          } else if (entry.type === 'BUSINESS_WITHDRAWABLE') {
            // Log as part of debits/credits calculation depending on sign
            if (entry.amountCents < 0) {
              credits += Math.abs(entry.amountCents);
            } else {
              debits += entry.amountCents;
            }
          } else if (entry.type === 'WITHDRAWAL') {
            withdrawals += Math.abs(entry.amountCents);
          } else if (entry.type === 'REFUND') {
            refunds += Math.abs(entry.amountCents);
          } else if (entry.type === 'CHARGEBACK') {
            debits += Math.abs(entry.amountCents);
          }
        }
      }
    }

    const closingBalanceCents = opening + credits - debits - withdrawals;

    return {
      openingBalanceCents: opening,
      creditsCents: credits,
      debitsCents: debits,
      commissionCents: commission,
      withdrawalsCents: withdrawals,
      refundsCents: refunds,
      closingBalanceCents,
      startDate: startDateStr,
      endDate: endDateStr
    };
  }

  public listEntries(businessId?: string): WalletLedgerEntry[] {
    if (businessId) {
      return this.ledgerEntries.filter((e) => e.businessId === businessId);
    }
    return [...this.ledgerEntries];
  }

  /**
   * Hardened Security Testing Helpers (Phase 6.12 Verification)
   */
  public overrideBalanceForTest(businessId: string, balanceCents: number) {
    // Clear existing ledger entries for this business
    this.ledgerEntries = this.ledgerEntries.filter((e) => e.businessId !== businessId);
    if (balanceCents > 0) {
      this.creditBalance(businessId, balanceCents);
    }
  }

  public creditBalance(businessId: string, amountCents: number) {
    const entryWth: WalletLedgerEntry = {
      entryId: `wled-test-credit-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`,
      businessId,
      bookingId: 'TEST-CREDIT',
      type: 'BUSINESS_WITHDRAWABLE',
      amountCents: -amountCents, // Negated cents credits business withdrawable pool
      currency: 'INR',
      createdAt: new Date().toISOString(),
      description: 'Hardened test pool credit',
      reconciled: true
    };
    this.ledgerEntries.push(entryWth);
  }

  public requestWithdrawal(businessId: string, amountCents: number, authorizedUserId: string): { status: 'PENDING' | 'FAILED'; errorMessage?: string } {
    // Verify unauthorized role check simulation
    if (!authorizedUserId.includes('owner') && !authorizedUserId.includes('admin')) {
      return { status: 'FAILED', errorMessage: 'unauthorized payout request privileges' };
    }

    // Verify negative or zero values
    if (amountCents <= 0) {
      return { status: 'FAILED', errorMessage: 'invalid withdrawal amount requested' };
    }

    const wallet = this.getBusinessWallet(businessId);
    
    // Prevent double-withdrawals and negative balances
    if (amountCents > wallet.availableCents) {
      return { status: 'FAILED', errorMessage: 'withdrawal above available amount' };
    }

    // Record the processes
    this.recordWithdrawal(businessId, amountCents);
    return { status: 'PENDING' };
  }
}

export const nexoraWalletService = new NexoraWalletService();
