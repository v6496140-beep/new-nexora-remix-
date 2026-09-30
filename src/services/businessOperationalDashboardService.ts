// Nexora SalonOS — Phase 5.9 Business Operational Dashboard Service
// Operational Summary, Staff Status, Service Performance, Customer Snapshot, and Alerts

import { BookingEntity, BookingStatus } from '../types/bookingEngine';
import { MultiTenantBookingRepository } from './bookingStateMachine';
import { StaffManagementService } from './staffManagementService';
import { communicationService } from '../services/communicationService';

export interface OperationalDashboardSummary {
  todaysAppointments: number;
  upcoming: number;
  completedToday: number;
  pending: number;
  cancelled: number;
  noShow: number;
}

export interface StaffOperationalStatus {
  staffId: string;
  staffName: string;
  status: 'AVAILABLE' | 'BUSY' | 'ON_BREAK' | 'LEAVE' | 'OFFLINE';
  nextAppointmentTime?: string;
}

export interface OperationalAlert {
  id: string;
  type: 'PAYMENT_PENDING' | 'UNCONFIRMED_BOOKING' | 'BOOKING_CONFLICT' | 'STAFF_LEAVE' | 'FAILED_NOTIFICATION';
  severity: 'WARNING' | 'CRITICAL' | 'INFO';
  message: string;
  referenceId?: string;
}

export class BusinessOperationalDashboardService {
  private bookingRepo: MultiTenantBookingRepository;
  private staffManagement: StaffManagementService;

  constructor(bookingRepo?: MultiTenantBookingRepository, staffManagement?: StaffManagementService) {
    this.bookingRepo = bookingRepo || new MultiTenantBookingRepository();
    this.staffManagement = staffManagement || new StaffManagementService();
  }

  /**
   * Compute top summary metrics for a business and date
   */
  public getSummary(businessId: string, todayIsoDate: string = '2026-10-20'): OperationalDashboardSummary {
    const allBookings = this.bookingRepo.listBookingsByTenant(businessId);

    const todays = allBookings.filter((b) => b.bookingDate === todayIsoDate);
    const upcoming = allBookings.filter((b) => b.bookingDate > todayIsoDate && !['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(b.status));
    const completedToday = todays.filter((b) => b.status === 'COMPLETED');
    const pending = allBookings.filter((b) => b.status === 'DRAFT' || b.paymentStatus === 'ADVANCE_PENDING' || b.paymentStatus === 'UNPAID');
    const cancelled = allBookings.filter((b) => b.status === 'CANCELLED');
    const noShow = allBookings.filter((b) => b.status === 'NO_SHOW');

    return {
      todaysAppointments: todays.length,
      upcoming: upcoming.length,
      completedToday: completedToday.length,
      pending: pending.length,
      cancelled: cancelled.length,
      noShow: noShow.length
    };
  }

  /**
   * Determine staff operational status
   */
  public getStaffOperationalStatuses(businessId: string, todayIsoDate: string = '2026-10-20'): StaffOperationalStatus[] {
    const staffList = this.staffManagement.listStaffForBusiness(businessId);
    const bookings = this.bookingRepo.listBookingsByTenant(businessId).filter((b) => b.bookingDate === todayIsoDate);

    return staffList.map((staff) => {
      const staffBookings = bookings.filter((b) => b.staffId === staff.id && b.status !== 'CANCELLED');
      const inProgress = staffBookings.find((b) => b.status === 'IN_PROGRESS');
      const nextAppt = staffBookings
        .filter((b) => ['CONFIRMED', 'CHECKED_IN'].includes(b.status))
        .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

      let status: 'AVAILABLE' | 'BUSY' | 'ON_BREAK' | 'LEAVE' | 'OFFLINE' = 'AVAILABLE';
      if (!staff.active) status = 'OFFLINE';
      else if (inProgress) status = 'BUSY';
      else if (staffBookings.length === 0) status = 'AVAILABLE';

      return {
        staffId: staff.id,
        staffName: staff.name,
        status,
        nextAppointmentTime: nextAppt ? nextAppt.startTime : undefined
      };
    });
  }

  /**
   * Compute service performance metrics (bookings by service and staff)
   */
  public getServicePerformance(businessId: string): { byService: Record<string, number>; byStaff: Record<string, number> } {
    const bookings = this.bookingRepo.listBookingsByTenant(businessId);
    const byService: Record<string, number> = {};
    const byStaff: Record<string, number> = {};

    bookings.forEach((b) => {
      const serviceName = b.items[0]?.nameSnapshot || 'General Service';
      byService[serviceName] = (byService[serviceName] || 0) + 1;

      if (b.staffId) {
        byStaff[b.staffId] = (byStaff[b.staffId] || 0) + 1;
      }
    });

    return { byService, byStaff };
  }

  /**
   * Compute customer snapshot
   */
  public getCustomerSnapshot(businessId: string, todayIsoDate: string = '2026-10-20'): { newCustomers: number; returningCustomers: number; upcomingVisits: number } {
    const bookings = this.bookingRepo.listBookingsByTenant(businessId);
    const customerIds = new Set(bookings.map((b) => b.customerId));
    const upcomingVisits = bookings.filter((b) => b.bookingDate >= todayIsoDate && !['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(b.status)).length;

    // Estimate new vs returning based on booking count per customer
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      counts[b.customerId] = (counts[b.customerId] || 0) + 1;
    });

    let newCustomers = 0;
    let returningCustomers = 0;
    Object.values(counts).forEach((c) => {
      if (c === 1) newCustomers++;
      else returningCustomers++;
    });

    return {
      newCustomers,
      returningCustomers,
      upcomingVisits
    };
  }

  /**
   * Generate operational alerts
   */
  public getOperationalAlerts(businessId: string): OperationalAlert[] {
    const bookings = this.bookingRepo.listBookingsByTenant(businessId);
    const logs = communicationService.listMessageLogs(businessId);
    const alerts: OperationalAlert[] = [];

    // Check unconfirmed bookings
    const unconfirmed = bookings.filter((b) => b.status === 'DRAFT');
    unconfirmed.forEach((b) => {
      alerts.push({
        id: `alert-unc-${b.id}`,
        type: 'UNCONFIRMED_BOOKING',
        severity: 'WARNING',
        message: `Booking ${b.id} for ${b.customerName} remains unconfirmed (Draft).`,
        referenceId: b.id
      });
    });

    // Check failed notifications
    const failedLogs = logs.filter((l) => l.status === 'FAILED');
    if (failedLogs.length > 0) {
      alerts.push({
        id: `alert-notif-fail`,
        type: 'FAILED_NOTIFICATION',
        severity: 'CRITICAL',
        message: `${failedLogs.length} customer notification(s) failed delivery. Check communication logs.`
      });
    }

    return alerts;
  }
}
