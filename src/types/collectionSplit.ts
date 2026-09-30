// Nexora SalonOS — Phase 6.3 Collection Split Engine Types

export interface CollectionPlan {
  collectionPlanId: string;
  displayName: string;
  nexoraCollectionPercentage: number; // e.g. 25
  directCollectionPercentage: number;  // e.g. 75
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo?: string;  // YYYY-MM-DD
}

export interface CommissionPlan {
  commissionPlanId: string;
  displayName: string;
  platformCommissionPercentage: number; // e.g. 10 of total booking value
  businessWithdrawalPercentage: number;  // e.g. 15 of total booking value (nexora - platformCommission)
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo?: string;  // YYYY-MM-DD
}

export interface SplitEngineResult {
  totalValueCents: number;
  directCollectionCents: number;
  nexoraCollectionCents: number;
  platformCommissionCents: number;
  businessWithdrawableCents: number;
  reconciliationChecked: boolean;
  collectionPlanId: string;
  commissionPlanId: string;
}
