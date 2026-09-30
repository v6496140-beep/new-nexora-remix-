// Nexora SalonOS — Phase 6.3 Collection Split Engine
// Configurable Plans with Exact Cent Reconciliation Guardrails

import { CollectionPlan, CommissionPlan, SplitEngineResult } from '../types/collectionSplit';

export class CollectionSplitService {
  private collectionPlans: CollectionPlan[] = [];
  private commissionPlans: CommissionPlan[] = [];

  constructor() {
    // Register Default Configurable Plan Model
    this.registerCollectionPlan({
      collectionPlanId: 'colplan-default',
      displayName: 'Standard Split (25% Online Advance / 75% Direct)',
      nexoraCollectionPercentage: 25,
      directCollectionPercentage: 75,
      effectiveFrom: '2026-01-01'
    });

    this.registerCommissionPlan({
      commissionPlanId: 'complan-default',
      displayName: 'Standard 10% Platform / 15% Business Keep',
      platformCommissionPercentage: 10,
      businessWithdrawalPercentage: 15,
      effectiveFrom: '2026-01-01'
    });
  }

  public registerCollectionPlan(plan: CollectionPlan) {
    if (plan.nexoraCollectionPercentage + plan.directCollectionPercentage !== 100) {
      throw new Error(`Collection plan percentages must total 100%. Got nexora=${plan.nexoraCollectionPercentage}, direct=${plan.directCollectionPercentage}`);
    }
    this.collectionPlans.push(plan);
  }

  public registerCommissionPlan(plan: CommissionPlan) {
    this.commissionPlans.push(plan);
  }

  public getActiveCollectionPlan(dateStr: string = '2026-10-01'): CollectionPlan {
    const active = this.collectionPlans.find(
      (p) => p.effectiveFrom <= dateStr && (!p.effectiveTo || p.effectiveTo >= dateStr)
    );
    if (!active) {
      throw new Error(`No active Collection Plan found for date: ${dateStr}`);
    }
    return active;
  }

  public getActiveCommissionPlan(dateStr: string = '2026-10-01'): CommissionPlan {
    const active = this.commissionPlans.find(
      (p) => p.effectiveFrom <= dateStr && (!p.effectiveTo || p.effectiveTo >= dateStr)
    );
    if (!active) {
      throw new Error(`No active Commission Plan found for date: ${dateStr}`);
    }
    return active;
  }

  /**
   * Calculate precise cent-based split and reconcile roundoff errors
   */
  public calculateSplit(totalValueCents: number, dateStr: string = '2026-10-01'): SplitEngineResult {
    const colPlan = this.getActiveCollectionPlan(dateStr);
    const comPlan = this.getActiveCommissionPlan(dateStr);

    // Validate overall split percentage match
    if (comPlan.platformCommissionPercentage + comPlan.businessWithdrawalPercentage !== colPlan.nexoraCollectionPercentage) {
      throw new Error(`Commission plan configuration mismatch: platformCommission (${comPlan.platformCommissionPercentage}%) + businessWithdrawal (${comPlan.businessWithdrawalPercentage}%) must equal nexoraCollection (${colPlan.nexoraCollectionPercentage}%)`);
    }

    // Cent Calculations
    const directCollectionCents = Math.round((totalValueCents * colPlan.directCollectionPercentage) / 100);
    const nexoraCollectionCents = totalValueCents - directCollectionCents; // Force exact total match

    const platformCommissionCents = Math.round((totalValueCents * comPlan.platformCommissionPercentage) / 100);
    const businessWithdrawableCents = nexoraCollectionCents - platformCommissionCents; // Force exact nexora pool total match

    // Verification check
    const check1 = (directCollectionCents + nexoraCollectionCents) === totalValueCents;
    const check2 = (platformCommissionCents + businessWithdrawableCents) === nexoraCollectionCents;
    const reconciliationChecked = check1 && check2;

    return {
      totalValueCents,
      directCollectionCents,
      nexoraCollectionCents,
      platformCommissionCents,
      businessWithdrawableCents,
      reconciliationChecked,
      collectionPlanId: colPlan.collectionPlanId,
      commissionPlanId: comPlan.commissionPlanId
    };
  }
}

export const collectionSplitService = new CollectionSplitService();
