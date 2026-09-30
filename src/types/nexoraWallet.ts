// Nexora SalonOS — Phase 6.6 Business Wallet & Financial Ledger Types

export type LedgerFlowType =
  | 'NEXORA_COLLECTION'
  | 'PLATFORM_COMMISSION'
  | 'BUSINESS_WITHDRAWABLE'
  | 'WITHDRAWAL'
  | 'REFUND'
  | 'REVERSAL'
  | 'CHARGEBACK'
  | 'ADJUSTMENT';

export interface WalletLedgerEntry {
  entryId: string;
  businessId: string;
  bookingId: string;
  type: LedgerFlowType;
  amountCents: number; // Positive = Credit, Negative = Debit
  currency: string;
  createdAt: string; // ISO String
  description: string;
  reconciled: boolean;
}

export interface BusinessWallet {
  businessId: string;
  availableCents: number;
  pendingCents: number;
  withdrawnCents: number;
  commissionPaidCents: number;
  refundAdjustmentsCents: number;
  chargebacksCents: number;
  reversalsCents: number;
}

export interface FinancialStatement {
  openingBalanceCents: number;
  creditsCents: number;
  debitsCents: number;
  commissionCents: number;
  withdrawalsCents: number;
  refundsCents: number;
  closingBalanceCents: number;
  startDate: string;
  endDate: string;
}

export interface ChargebackRecord {
  chargebackId: string;
  bookingId: string;
  businessId: string;
  amountCents: number;
  status: 'RECEIVED' | 'RESOLVED' | 'REVERSED';
  adjustmentCents: number;
  createdAt: string;
}
