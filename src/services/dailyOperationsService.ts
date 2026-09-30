// Nexora SalonOS — Phase 5.6 Daily Appointment Operations Service
// Operational Workflow, Timeline Aggregation, and Centralized Booking State Transitions

import { TimelineSlot, OperationalActionPayload } from '../types/dailyOperations';
import { BookingEntity, BookingStatus } from '../types/bookingEngine';
import { MultiTenantBookingRepository, BookingStateMachineService } from './bookingStateMachine';
import { SEEDED_BOOKINGS } from '../data/seededBookings';

export class DailyOperationsService {
  private bookingRepo: MultiTenantBookingRepository;

  constructor(bookingRepo?: MultiTenantBookingRepository) {
    this.bookingRepo = bookingRepo || new MultiTenantBookingRepository(SEEDED_BOOKINGS);
  }

  /**
   * Get operational timeline slots for a business and date
   */
  public getDailyTimeline(businessId: string, dateStr: string = '2026-10-20'): TimelineSlot[] {
    const allBookings = this.bookingRepo.listBookingsByTenant(businessId);
    const dateBookings = allBookings.filter((b: BookingEntity) => b.bookingDate === dateStr && b.status !== 'CANCELLED');

    // Generate standard hourly / half-hourly slots from 09:00 to 20:00
    const slotTimes = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30', '19:00', '19:30', '20:00'
    ];

    return slotTimes.map((timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      const matchingBookings = dateBookings.filter((b: BookingEntity) => b.startTime === timeStr);

      return {
        timeStr,
        hour: h,
        minute: m,
        bookings: matchingBookings
      };
    });
  }

  /**
   * Execute operational status transition via centralized state machine
   */
  public executeOperationalAction(
    payload: OperationalActionPayload,
    actorId: string = 'opr-admin-01',
    actorRole: string = 'MANAGER'
  ): { success: boolean; updatedBooking?: BookingEntity; error?: string } {
    const { bookingId, businessId, action, reason } = payload;

    const booking = this.bookingRepo.getBookingById(bookingId, businessId);
    if (!booking) {
      return { success: false, error: `Booking '${bookingId}' not found for business '${businessId}'` };
    }

    let targetStatus: BookingStatus = booking.status;
    if (action === 'CHECK_IN') targetStatus = 'CHECKED_IN';
    else if (action === 'START') targetStatus = 'IN_PROGRESS';
    else if (action === 'COMPLETE') targetStatus = 'COMPLETED';
    else if (action === 'NO_SHOW') targetStatus = 'NO_SHOW';
    else if (action === 'CANCEL') targetStatus = 'CANCELLED';

    const res = BookingStateMachineService.transitionStatus(booking, targetStatus, {
      changedByUserId: actorId,
      changedByRole: actorRole,
      reason: reason || `Operational action: ${action}`
    });

    if (res.success && res.updatedBooking) {
      this.bookingRepo.saveBooking(res.updatedBooking, businessId);
      return { success: true, updatedBooking: res.updatedBooking };
    }

    return { success: false, error: res.error || 'Invalid transition or state machine rejection' };
  }
}
