// Nexora SalonOS — Phase 6.4 Commission & Ledger Types

export type LedgerEntryType =
  | 'NEXORA_COLLECTION'
  | 'PLATFORM_COMMISSION'
  | 'BUSINESS_WITHDRAWABLE'
  | 'REFUND_DEBIT'
  | 'PARTIAL_REFUND_DEBIT';

export interface LedgerEntry {
  entryId: string;
  businessId: string;
  bookingId: string;
  type: LedgerEntryType;
  amountCents: number; // can be positive or negative
  currency: string;
  createdAt: string;
  reconciled: boolean;
}

export interface LedgerSummary {
  grossBookingCents: number;
  directCollectionCents: number;
  nexoraCollectionCents: number;
  platformCommissionCents: number;
  businessWithdrawalCents: number;
}
