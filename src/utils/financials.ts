// Nexora SalonOS — Foundational Mathematical & Formatting Utilities
// Clean, testable functions for advance payments, taxes, currency formatting, and date utilities.

import { PLATFORM_CONFIG } from '../config/platformConfig';
import { BookingFinancials } from '../types';

/**
 * Calculates a complete financial split for a booking given a subtotal and optional advance percentage.
 * Default advance percentage is loaded directly from PLATFORM_CONFIG.bookingDefaults.advancePercentage (25%).
 */
export function calculateBookingFinancials(
  subtotal: number,
  discount: number = 0,
  advancePercent: number = PLATFORM_CONFIG.bookingDefaults.advancePercentage,
  taxRatePercent: number = PLATFORM_CONFIG.taxRules.gstStandardRate
): BookingFinancials {
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = Number(((taxableAmount * taxRatePercent) / 100).toFixed(2));
  const totalGrossAmount = Number((taxableAmount + taxAmount).toFixed(2));

  // Advance calculation (percentage of total gross)
  const advanceAmountRequired = Number(
    ((totalGrossAmount * advancePercent) / 100).toFixed(2)
  );
  const outstandingBalanceAtVenue = Number(
    (totalGrossAmount - advanceAmountRequired).toFixed(2)
  );

  return {
    subtotal,
    discountAmount: discount,
    taxAmount,
    totalGrossAmount,
    advancePercentage: advancePercent,
    advanceAmountRequired,
    advanceAmountPaid: 0,
    outstandingBalanceAtVenue,
  };
}

/**
 * Formats a numeric value into the salon's standard Indian Rupee currency string (e.g., ₹1,250.00).
 */
export function formatCurrency(
  amount: number,
  symbol: string = PLATFORM_CONFIG.app.currencySymbol,
  decimals: number = 0
): string {
  const formatted = amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbol}${formatted}`;
}

/**
 * Formats duration in minutes into clean readable text (e.g. 45 mins, 1 hr 15 mins).
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hr ${remainingMins} mins`;
}

/**
 * Evaluates whether a specialist or salon meets the qualification threshold based on daily run rate.
 */
export function evaluateQualificationStatus(
  dailyVolume: number,
  threshold: number = PLATFORM_CONFIG.bookingDefaults.dailyQualificationThreshold
): { isQualified: boolean; progressPercentage: number; gap: number } {
  const progress = Math.min(100, Math.round((dailyVolume / threshold) * 100));
  const gap = Math.max(0, threshold - dailyVolume);
  return {
    isQualified: dailyVolume >= threshold,
    progressPercentage: progress,
    gap,
  };
}
