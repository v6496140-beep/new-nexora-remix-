// Nexora SalonOS — Phase 6.5 Daily Business Withdrawal Engine Types

export type WithdrawalEligibilityState =
  | 'PENDING'
  | 'AVAILABLE'
  | 'ON_HOLD'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'REVERSED';

export interface WithdrawalBatch {
  batchId: string;
  businessId: string;
  date: string; // YYYY-MM-DD
  eligibleAmount: number; // in cents
  commission: number; // in cents
  adjustments: number; // in cents
  finalWithdrawalAmount: number; // in cents
  status: 'PROCESSING' | 'PAID' | 'FAILED';
  utr?: string;
  createdAt: string;
}

export interface PayoutSettings {
  businessId: string;
  manualWithdrawalEnabled: boolean;
  secureBankReferenceToken?: string; // Tokenized reference instead of sensitive banking info
  nextWithdrawalTime: string; // "10:00 PM"
}
