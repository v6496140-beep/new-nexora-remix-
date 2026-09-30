// Nexora SalonOS — Phase 5.6 Daily Appointment Operations Types
// Operational Workflow, Timeline Slots, and State Transition Actions

import { BookingEntity, BookingStatus } from './bookingEngine';

export interface TimelineSlot {
  timeStr: string; // e.g. '09:00', '09:30'
  hour: number;
  minute: number;
  bookings: BookingEntity[];
}

export interface OperationalActionPayload {
  bookingId: string;
  businessId: string;
  action: 'CHECK_IN' | 'START' | 'COMPLETE' | 'NO_SHOW' | 'CANCEL';
  reason?: string;
  staffId?: string;
}
