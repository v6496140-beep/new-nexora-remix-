// Nexora SalonOS — Phase 5.5 Staff Dashboard Service
// Secure Staff-Scoped Data Access, Appointment Action Orchestration, Self-Profile Management & Leave Requests

import { StaffDashboardSummary, StaffAppointmentActionPayload } from '../types/staffDashboard';
import { BookingEntity, BookingStatus } from '../types/bookingEngine';
import { StaffProfileEntity, UpdateStaffPayload } from '../types/staffManagement';
import { StaffLeaveRecord, LeaveType } from '../types/staffSchedule';
import { MultiTenantBookingRepository, BookingStateMachineService } from './bookingStateMachine';
import { StaffManagementService } from './staffManagementService';
import { StaffScheduleService } from './staffScheduleService';

export class StaffDashboardService {
  private bookingRepo: MultiTenantBookingRepository;
  private stateMachine: BookingStateMachineService;
  private staffManagement: StaffManagementService;
  private scheduleService: StaffScheduleService;

  constructor(
    bookingRepo?: MultiTenantBookingRepository,
    stateMachine?: BookingStateMachineService,
    staffManagement?: StaffManagementService,
    scheduleService?: StaffScheduleService
  ) {
    this.bookingRepo = bookingRepo || new MultiTenantBookingRepository();
    this.stateMachine = stateMachine || new BookingStateMachineService();
    this.staffManagement = staffManagement || new StaffManagementService();
    this.scheduleService = scheduleService || new StaffScheduleService();
  }

  /**
   * Get staff dashboard summary for home view
   */
  public getStaffSummary(staffId: string, businessId: string, todayIsoDate: string = '2026-10-20'): StaffDashboardSummary {
    const staff = this.staffManagement.getStaffById(staffId, businessId);
    if (!staff) {
      throw new Error(`Staff member '${staffId}' not found or unauthorized for business '${businessId}'`);
    }

    const allBookings = this.bookingRepo.getStaffBookings(staffId, businessId);

    const todaysAppts = allBookings.filter((b) => b.bookingDate === todayIsoDate && b.status !== 'CANCELLED');
    const completedToday = todaysAppts.filter((b) => b.status === 'COMPLETED');
    const upcoming = allBookings.filter((b) => b.bookingDate >= todayIsoDate && !['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(b.status));

    // Next appointment (earliest upcoming)
    const sortedUpcoming = [...upcoming].sort((a, b) => `${a.bookingDate} ${a.startTime}`.localeCompare(`${b.bookingDate} ${b.startTime}`));
    const nextAppts = sortedUpcoming.length > 0 ? sortedUpcoming[0] : null;

    return {
      staffId,
      staffName: staff.name,
      role: staff.role,
      businessId,
      todaysAppointmentsCount: todaysAppts.length,
      completedTodayCount: completedToday.length,
      upcomingCount: upcoming.length,
      nextAppointment: nextAppts,
      availabilityStatus: staff.active ? 'ON_DUTY' : 'OFF_DUTY'
    };
  }

  /**
   * Get today's appointments for a staff member
   */
  public getTodaysAppointments(staffId: string, businessId: string, todayIsoDate: string = '2026-10-20'): BookingEntity[] {
    const allBookings = this.bookingRepo.getStaffBookings(staffId, businessId);
    return allBookings
      .filter((b) => b.bookingDate === todayIsoDate && b.status !== 'CANCELLED')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  /**
   * Get upcoming appointments for a staff member
   */
  public getUpcomingAppointments(staffId: string, businessId: string, todayIsoDate: string = '2026-10-20'): BookingEntity[] {
    const allBookings = this.bookingRepo.getStaffBookings(staffId, businessId);
    return allBookings
      .filter((b) => b.bookingDate >= todayIsoDate && !['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(b.status))
      .sort((a, b) => `${a.bookingDate} ${a.startTime}`.localeCompare(`${b.bookingDate} ${b.startTime}`));
  }

  /**
   * Execute staff appointment lifecycle action (Check In, Start, Complete)
   */
  public executeAppointmentAction(payload: StaffAppointmentActionPayload, requestorBusinessId: string): { success: boolean; updatedBooking?: BookingEntity; error?: string } {
    const { bookingId, staffId, action } = payload;

    const booking = this.bookingRepo.getBookingById(bookingId, requestorBusinessId);
    if (!booking) {
      return { success: false, error: `Booking '${bookingId}' not found or access denied.` };
    }

    // Security: Ensure staff member is assigned to this booking
    if (booking.staffId && booking.staffId !== staffId) {
      return { success: false, error: `Unauthorized: Staff member '${staffId}' cannot modify booking assigned to staff '${booking.staffId}'` };
    }

    let targetStatus: BookingStatus = booking.status;
    if (action === 'CHECK_IN') targetStatus = 'CHECKED_IN';
    else if (action === 'START') targetStatus = 'IN_PROGRESS';
    else if (action === 'COMPLETE') targetStatus = 'COMPLETED';

    const res = BookingStateMachineService.transitionStatus(booking, targetStatus, {
      changedByUserId: staffId,
      changedByRole: 'STAFF',
      reason: `Staff action: ${action}`
    });

    if (res.success && res.updatedBooking) {
      this.bookingRepo.saveBooking(res.updatedBooking, requestorBusinessId);
      return { success: true, updatedBooking: res.updatedBooking };
    }

    return { success: false, error: res.error || 'State transition failed' };
  }

  /**
   * Allow staff to update their own permitted profile attributes
   */
  public updateStaffSelfProfile(staffId: string, businessId: string, payload: UpdateStaffPayload): StaffProfileEntity {
    // Restrict updates strictly to permitted fields (photo, bio, phone, email, specializations)
    const sanitizedPayload: UpdateStaffPayload = {
      photo: payload.photo,
      bio: payload.bio,
      phone: payload.phone,
      email: payload.email,
      specializations: payload.specializations
    };

    return this.staffManagement.updateStaff(staffId, sanitizedPayload, businessId);
  }

  /**
   * Allow staff to request leave (created as PENDING status)
   */
  public requestStaffLeave(
    staffId: string,
    businessId: string,
    startDate: string,
    endDate: string,
    leaveType: LeaveType,
    reason: string,
    startTime?: string,
    endTime?: string
  ): StaffLeaveRecord {
    return this.scheduleService.createStaffLeave({
      staffId,
      businessId,
      startDate,
      endDate,
      startTime,
      endTime,
      leaveType,
      reason,
      status: 'PENDING' // Requires manager approval
    });
  }

  /**
   * Security check for unauthorized features
   */
  public verifyStaffSecurityAccess(feature: 'FINANCIALS' | 'COMMISSION' | 'TAX' | 'SUPER_ADMIN'): boolean {
    // Staff are strictly prohibited from accessing business-critical financial settings
    if (feature === 'FINANCIALS' || feature === 'COMMISSION' || feature === 'TAX' || feature === 'SUPER_ADMIN') {
      return false;
    }
    return true;
  }
}
