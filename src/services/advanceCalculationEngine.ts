// Nexora SalonOS — Phase 4.6 Advance Payment Calculation Engine
// Money-safe integer minor-unit calculation (paise) with business percentage configuration

import { AdvanceCalculationResult } from '../types/paymentEngine';

export class AdvanceCalculationEngine {
  /**
   * Default business advance deposit percentage (25% as per spec)
   */
  public static DEFAULT_ADVANCE_PERCENTAGE = 25;

  /**
   * Converts major currency unit (Rupees) to integer minor unit (Paise)
   * Prevents floating-point precision issues by rounding to nearest integer
   */
  public static rupeesToPaise(rupees: number): number {
    if (isNaN(rupees) || rupees < 0) return 0;
    return Math.round(rupees * 100);
  }

  /**
   * Converts integer minor unit (Paise) to major unit (Rupees)
   */
  public static paiseToRupees(paise: number): number {
    if (isNaN(paise) || paise < 0) return 0;
    return paise / 100;
  }

  /**
   * Formats paise into human-readable INR string
   * e.g., 25000 -> "₹250.00"
   */
  public static formatPaise(paise: number, currency: string = 'INR'): string {
    const rupees = this.paiseToRupees(paise);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(rupees);
  }

  /**
   * Authoritatively calculates Advance Amount and Remaining Balance in integer paise
   * Ensures strict equality: advanceAmountPaise + remainingAmountPaise === totalAmountPaise
   */
  public calculateAdvance(
    totalAmountPaise: number,
    advancePercentage: number = AdvanceCalculationEngine.DEFAULT_ADVANCE_PERCENTAGE,
    currency: string = 'INR'
  ): AdvanceCalculationResult {
    // Sanitize input integer minor units
    const safeTotal = Math.max(0, Math.round(totalAmountPaise));

    // Clamp percentage between 0% and 100%
    const safePercentage = Math.max(0, Math.min(100, Number(advancePercentage) || 0));

    // Integer minor-unit calculation with standard rounding
    const advanceAmountPaise = Math.round((safeTotal * safePercentage) / 100);

    // Exact residual balance calculation to eliminate floating-point penny loss
    const remainingAmountPaise = safeTotal - advanceAmountPaise;

    return {
      totalAmountPaise: safeTotal,
      advancePercentage: safePercentage,
      advanceAmountPaise,
      remainingAmountPaise,
      currency
    };
  }

  /**
   * Convenience wrapper accepting total in Rupees and returning integer calculation result
   */
  public calculateAdvanceFromRupees(
    totalRupees: number,
    advancePercentage: number = AdvanceCalculationEngine.DEFAULT_ADVANCE_PERCENTAGE,
    currency: string = 'INR'
  ): AdvanceCalculationResult {
    const totalPaise = AdvanceCalculationEngine.rupeesToPaise(totalRupees);
    return this.calculateAdvance(totalPaise, advancePercentage, currency);
  }
}

export const advanceCalculationEngine = new AdvanceCalculationEngine();
