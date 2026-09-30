// Nexora SalonOS — Phase 4.4 Availability + Slot Engine Domain Types
// Pure Slot Generation, Conflict Engine, Concurrency Locking & Multi-Staff Aggregation

import { DayOfWeek } from './staffSchedule';

export type SlotIntervalMinutes = 15 | 30 | 45 | 60;

export interface SlotEngineQuery {
  businessId: string;
  serviceId?: string;
  packageId?: string;
  staffId?: string; // If undefined or 'ANY_AVAILABLE', evaluates all eligible staff
  date: string; // 'YYYY-MM-DD'
  slotIntervalMinutes?: SlotIntervalMinutes; // Default 15 or 30
  timezone?: string; // Fallback to business timezone if omitted
  referenceNowIso?: string; // Current timestamp in ISO 8601 for deterministic past-time filtering
}

export interface AvailableStaffSlotInfo {
  staffId: string;
  staffName: string;
  role: string;
  isAvailable: boolean;
  unavailableReason?: string;
}

export interface TimeSlot {
  id: string; // Unique deterministic slot ID e.g. 'slot-2026-10-06-1100'
  date: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm' e.g. '10:00'
  endTime: string; // 'HH:mm' e.g. '11:00' (service finish)
  occupancyEndTime: string; // 'HH:mm' e.g. '11:15' (service finish + buffer cleanup)
  serviceDurationMinutes: number;
  bufferTimeMinutes: number;
  totalOccupancyMinutes: number;
  available: boolean;
  conflictCode?:
    | 'AVAILABLE'
    | 'PAST_TIME'
    | 'OUTSIDE_BUSINESS_HOURS'
    | 'OUTSIDE_STAFF_HOURS'
    | 'BUSINESS_ON_BREAK'
    | 'STAFF_ON_BREAK'
    | 'BUSINESS_HOLIDAY'
    | 'STAFF_ON_LEAVE'
    | 'EXISTING_BOOKING_CONFLICT'
    | 'SLOT_LOCKED_CONCURRENT'
    | 'NO_ELIGIBLE_STAFF_AVAILABLE';
  reason?: string;
  // Available staff details for this specific slot
  availableStaffIds: string[];
  eligibleStaffDetails: AvailableStaffSlotInfo[];
  primaryStaffId?: string;
  primaryStaffName?: string;
}

export interface SlotEngineResult {
  businessId: string;
  date: string;
  dayOfWeek: DayOfWeek;
  businessTimezone: string;
  serviceId?: string;
  serviceName?: string;
  serviceDurationMinutes: number;
  bufferTimeMinutes: number;
  slotIntervalMinutes: SlotIntervalMinutes;
  slots: TimeSlot[];
  totalSlotsCount: number;
  availableSlotsCount: number;
}

// ----------------------------------------------------------------------------
// SHORT-LIVED CONCURRENCY LOCK RECORD (Anti-Race Condition Engine)
// ----------------------------------------------------------------------------

export interface SlotLock {
  id: string;
  businessId: string;
  staffId: string;
  date: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  customerId: string;
  expiresAtIso: string; // ISO 8601 timestamp
  createdAtIso: string;
}
