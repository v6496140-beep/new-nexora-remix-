// Nexora SalonOS — Phase 4.4 Availability + Slot Engine
// Multi-Tenant Slot Generation, Conflict Overlap Matrix, Concurrency Locking & Multi-Staff Aggregation

import {
  SlotEngineQuery,
  SlotEngineResult,
  TimeSlot,
  SlotIntervalMinutes,
  AvailableStaffSlotInfo,
  SlotLock
} from '../types/slotEngine';
import {
  DayOfWeek,
  parseTimeToMinutes,
  formatMinutesToTime,
  getDayOfWeekFromDate
} from '../types/staffSchedule';
import { StaffScheduleService } from './staffScheduleService';
import { ServicePackageConfigService } from './servicePackageService';
import { BookingEntity } from '../types/bookingEngine';
import { SEEDED_BOOKINGS } from '../data/seededBookings';

// ----------------------------------------------------------------------------
// 1. SHORT-LIVED CONCURRENCY LOCK MANAGER (Anti-Race Condition Engine)
// ----------------------------------------------------------------------------

export class SlotLockManager {
  private locks: Map<string, SlotLock> = new Map();

  /**
   * Clears expired locks based on reference or current time
   */
  public purgeExpiredLocks(nowIso: string = new Date().toISOString()): void {
    for (const [id, lock] of this.locks.entries()) {
      if (lock.expiresAtIso <= nowIso) {
        this.locks.delete(id);
      }
    }
  }

  /**
   * Attempts to acquire a short-lived checkout lock (e.g. 10 minutes)
   */
  public acquireLock(
    businessId: string,
    staffId: string,
    date: string,
    startTime: string,
    durationMinutes: number,
    customerId: string,
    ttlSeconds: number = 600,
    nowIso: string = new Date().toISOString()
  ): { success: boolean; lock?: SlotLock; error?: string } {
    this.purgeExpiredLocks(nowIso);

    const startMin = parseTimeToMinutes(startTime);
    const endMin = startMin + durationMinutes;
    const endTime = formatMinutesToTime(endMin);

    // Check if conflicting active lock exists for this staff on this date
    for (const activeLock of this.locks.values()) {
      if (
        activeLock.businessId === businessId &&
        activeLock.staffId === staffId &&
        activeLock.date === date
      ) {
        const lockStart = parseTimeToMinutes(activeLock.startTime);
        const lockEnd = parseTimeToMinutes(activeLock.endTime);

        // Overlap condition: max(start, lockStart) < min(end, lockEnd)
        if (Math.max(startMin, lockStart) < Math.min(endMin, lockEnd)) {
          return {
            success: false,
            error: `Slot is currently held by another client checkout until ${new Date(activeLock.expiresAtIso).toLocaleTimeString()}`
          };
        }
      }
    }

    const expiresAt = new Date(new Date(nowIso).getTime() + ttlSeconds * 1000).toISOString();
    const lock: SlotLock = {
      id: `lck-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
      businessId,
      staffId,
      date,
      startTime,
      endTime,
      customerId,
      expiresAtIso: expiresAt,
      createdAtIso: nowIso
    };

    this.locks.set(lock.id, lock);
    return { success: true, lock };
  }

  /**
   * Release a previously acquired lock
   */
  public releaseLock(lockId: string): boolean {
    return this.locks.delete(lockId);
  }

  /**
   * Check if a staff member's time slot is locked by an ongoing checkout
   */
  public isSlotLocked(
    businessId: string,
    staffId: string,
    date: string,
    startMin: number,
    endMin: number,
    nowIso: string = new Date().toISOString()
  ): boolean {
    this.purgeExpiredLocks(nowIso);

    for (const lock of this.locks.values()) {
      if (
        lock.businessId === businessId &&
        lock.staffId === staffId &&
        lock.date === date
      ) {
        const lockStart = parseTimeToMinutes(lock.startTime);
        const lockEnd = parseTimeToMinutes(lock.endTime);
        if (Math.max(startMin, lockStart) < Math.min(endMin, lockEnd)) {
          return true;
        }
      }
    }
    return false;
  }
}

// ----------------------------------------------------------------------------
// 2. CORE AVAILABILITY & SLOT ENGINE SERVICE
// ----------------------------------------------------------------------------

export class SlotEngineService {
  private scheduleService: StaffScheduleService;
  private serviceManager: ServicePackageConfigService;
  private lockManager: SlotLockManager;
  private existingBookings: BookingEntity[];

  constructor(
    scheduleService = new StaffScheduleService(),
    serviceManager = new ServicePackageConfigService(),
    existingBookings = SEEDED_BOOKINGS,
    lockManager = new SlotLockManager()
  ) {
    this.scheduleService = scheduleService;
    this.serviceManager = serviceManager;
    this.existingBookings = [...existingBookings];
    this.lockManager = lockManager;
  }

  public getLockManager(): SlotLockManager {
    return this.lockManager;
  }

  public addBooking(booking: BookingEntity): void {
    this.existingBookings.push(booking);
  }

  /**
   * Primary Entry Point: Generates all time slots for a business, service, staff, and date
   */
  public generateSlots(query: SlotEngineQuery): SlotEngineResult {
    const {
      businessId,
      serviceId,
      packageId,
      staffId,
      date,
      slotIntervalMinutes = 30,
      referenceNowIso
    } = query;

    // 1. Resolve Business Operating Schedule & Timezone
    const bizConfig = this.scheduleService.getBusinessSchedule(businessId);
    const businessTimezone = query.timezone || bizConfig?.timezone || 'Asia/Kolkata';
    const dayOfWeek = getDayOfWeekFromDate(date);

    if (!bizConfig) {
      return {
        businessId,
        date,
        dayOfWeek,
        businessTimezone,
        serviceDurationMinutes: 0,
        bufferTimeMinutes: 0,
        slotIntervalMinutes,
        slots: [],
        totalSlotsCount: 0,
        availableSlotsCount: 0
      };
    }

    // 2. Resolve Service / Package Parameters
    let serviceName = 'Service';
    let serviceDurationMinutes = 45;
    let bufferTimeMinutes = 10;
    let eligibleStaffIds: string[] = [];

    if (serviceId) {
      const srv = this.serviceManager.getService(serviceId, businessId);
      if (srv) {
        serviceName = srv.name;
        serviceDurationMinutes = srv.duration;
        bufferTimeMinutes = srv.bufferTime;
        eligibleStaffIds = srv.eligibleStaffIds || [];
      }
    } else if (packageId) {
      const pkg = this.serviceManager.getPackage(packageId, businessId);
      if (pkg) {
        serviceName = pkg.name;
        serviceDurationMinutes = pkg.duration;
        bufferTimeMinutes = 15;
        eligibleStaffIds = pkg.eligibleStaffIds || [];
      }
    }

    const totalOccupancyMinutes = serviceDurationMinutes + bufferTimeMinutes;

    // 3. Resolve Candidate Staff List
    const allTenantStaff = this.serviceManager.listStaffByTenant(businessId);
    let candidateStaff = allTenantStaff.filter((s) => s.active);

    if (eligibleStaffIds.length > 0) {
      candidateStaff = candidateStaff.filter((s) => eligibleStaffIds.includes(s.id));
    }

    // If customer selected a specific staff member
    const isSingleStaffMode = Boolean(staffId && staffId !== 'ANY_AVAILABLE');
    if (isSingleStaffMode) {
      candidateStaff = candidateStaff.filter((s) => s.id === staffId);
    }

    // 4. Check Business Closed or Holiday
    const holiday = bizConfig.holidays.find((h) => h.date === date);
    const bizDayHours = bizConfig.weeklyHours[dayOfWeek];

    if (holiday || !bizDayHours || !bizDayHours.isOpen) {
      const unavailableReason = holiday
        ? `Closed for Holiday: ${holiday.name}`
        : `Business closed on ${dayOfWeek}`;

      return {
        businessId,
        date,
        dayOfWeek,
        businessTimezone,
        serviceId,
        serviceName,
        serviceDurationMinutes,
        bufferTimeMinutes,
        slotIntervalMinutes,
        slots: [
          {
            id: `slot-${date}-closed`,
            date,
            startTime: '00:00',
            endTime: '00:00',
            occupancyEndTime: '00:00',
            serviceDurationMinutes,
            bufferTimeMinutes,
            totalOccupancyMinutes,
            available: false,
            conflictCode: holiday ? 'BUSINESS_HOLIDAY' : 'OUTSIDE_BUSINESS_HOURS',
            reason: unavailableReason,
            availableStaffIds: [],
            eligibleStaffDetails: []
          }
        ],
        totalSlotsCount: 1,
        availableSlotsCount: 0
      };
    }

    // 5. Generate Candidate Start Times within Business Operating Window
    const bizOpenMin = parseTimeToMinutes(bizDayHours.openingTime);
    const bizCloseMin = parseTimeToMinutes(bizDayHours.closingTime);

    const generatedSlots: TimeSlot[] = [];

    for (let currentStartMin = bizOpenMin; currentStartMin < bizCloseMin; currentStartMin += slotIntervalMinutes) {
      const serviceEndMin = currentStartMin + serviceDurationMinutes;
      const occupancyEndMin = currentStartMin + totalOccupancyMinutes;

      const startTimeStr = formatMinutesToTime(currentStartMin);
      const serviceEndTimeStr = formatMinutesToTime(serviceEndMin);
      const occupancyEndTimeStr = formatMinutesToTime(occupancyEndMin);

      const slotId = `slot-${date}-${startTimeStr.replace(':', '')}`;

      // A. Check if appointment occupancy exceeds business closing time
      if (occupancyEndMin > bizCloseMin) {
        generatedSlots.push({
          id: slotId,
          date,
          startTime: startTimeStr,
          endTime: serviceEndTimeStr,
          occupancyEndTime: occupancyEndTimeStr,
          serviceDurationMinutes,
          bufferTimeMinutes,
          totalOccupancyMinutes,
          available: false,
          conflictCode: 'OUTSIDE_BUSINESS_HOURS',
          reason: `Service duration + buffer exceeds salon closing time (${bizDayHours.closingTime})`,
          availableStaffIds: [],
          eligibleStaffDetails: []
        });
        continue;
      }

      // B. Check Business Sanitization / Break Overlap
      let businessBreakCollision = false;
      let businessBreakLabel = '';
      for (const brk of bizDayHours.breaks || []) {
        const brkStart = parseTimeToMinutes(brk.startTime);
        const brkEnd = parseTimeToMinutes(brk.endTime);
        if (Math.max(currentStartMin, brkStart) < Math.min(occupancyEndMin, brkEnd)) {
          businessBreakCollision = true;
          businessBreakLabel = brk.label || 'Salon Cleaning';
          break;
        }
      }

      if (businessBreakCollision) {
        generatedSlots.push({
          id: slotId,
          date,
          startTime: startTimeStr,
          endTime: serviceEndTimeStr,
          occupancyEndTime: occupancyEndTimeStr,
          serviceDurationMinutes,
          bufferTimeMinutes,
          totalOccupancyMinutes,
          available: false,
          conflictCode: 'BUSINESS_ON_BREAK',
          reason: `Slot overlaps with ${businessBreakLabel}`,
          availableStaffIds: [],
          eligibleStaffDetails: []
        });
        continue;
      }

      // C. Past-Time Check (if referenceNowIso is provided)
      if (referenceNowIso) {
        const [year, month, day] = date.split('-').map(Number);
        const [hour, minute] = startTimeStr.split(':').map(Number);
        const slotDateObj = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
        const referenceNowObj = new Date(referenceNowIso);

        if (slotDateObj.getTime() <= referenceNowObj.getTime()) {
          generatedSlots.push({
            id: slotId,
            date,
            startTime: startTimeStr,
            endTime: serviceEndTimeStr,
            occupancyEndTime: occupancyEndTimeStr,
            serviceDurationMinutes,
            bufferTimeMinutes,
            totalOccupancyMinutes,
            available: false,
            conflictCode: 'PAST_TIME',
            reason: 'Cannot book past time slots',
            availableStaffIds: [],
            eligibleStaffDetails: []
          });
          continue;
        }
      }

      // D. Evaluate Each Eligible Staff Member for this Specific Time Slot
      const staffEvaluationDetails: AvailableStaffSlotInfo[] = [];
      const availableStaffIds: string[] = [];

      for (const staff of candidateStaff) {
        // 1. Shift, breaks, leaves evaluation
        const availCheck = this.scheduleService.evaluateAvailability({
          businessId,
          staffId: staff.id,
          serviceId,
          serviceDurationMinutes,
          bufferTimeMinutes,
          bookingDate: date,
          startTime: startTimeStr
        });

        if (!availCheck.available) {
          staffEvaluationDetails.push({
            staffId: staff.id,
            staffName: staff.name,
            role: staff.role,
            isAvailable: false,
            unavailableReason: availCheck.reason
          });
          continue;
        }

        // 2. Existing Bookings Conflict Check (Overlap Matrix)
        let hasBookingConflict = false;
        let conflictBookingId = '';

        for (const booking of this.existingBookings) {
          // Check active states
          if (
            booking.businessId === businessId &&
            booking.bookingDate === date &&
            ['CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'ADVANCE_PAID', 'PAYMENT_PENDING'].includes(booking.status)
          ) {
            // Check if booking is assigned to this staff member
            const isAssigned =
              booking.staffId === staff.id ||
              booking.items.some((item) => item.staffId === staff.id);

            if (isAssigned) {
              const bStartMin = parseTimeToMinutes(booking.startTime);
              const bEndMin = parseTimeToMinutes(booking.endTime);

              // Overlap check: max(slotStart, bookingStart) < min(slotOccupancyEnd, bookingEnd)
              if (Math.max(currentStartMin, bStartMin) < Math.min(occupancyEndMin, bEndMin)) {
                hasBookingConflict = true;
                conflictBookingId = booking.id;
                break;
              }
            }
          }
        }

        if (hasBookingConflict) {
          staffEvaluationDetails.push({
            staffId: staff.id,
            staffName: staff.name,
            role: staff.role,
            isAvailable: false,
            unavailableReason: `Conflicts with existing booking ${conflictBookingId}`
          });
          continue;
        }

        // 3. Concurrency Slot Lock Check (Short-lived checkout lock)
        const isLocked = this.lockManager.isSlotLocked(
          businessId,
          staff.id,
          date,
          currentStartMin,
          occupancyEndMin,
          referenceNowIso
        );

        if (isLocked) {
          staffEvaluationDetails.push({
            staffId: staff.id,
            staffName: staff.name,
            role: staff.role,
            isAvailable: false,
            unavailableReason: 'Temporarily reserved in another checkout'
          });
          continue;
        }

        // Staff is AVAILABLE for this slot!
        availableStaffIds.push(staff.id);
        staffEvaluationDetails.push({
          staffId: staff.id,
          staffName: staff.name,
          role: staff.role,
          isAvailable: true
        });
      }

      // E. Aggregate Final Slot Availability
      const isSlotAvailable = availableStaffIds.length > 0;
      let primaryStaffId: string | undefined;
      let primaryStaffName: string | undefined;

      if (isSlotAvailable) {
        primaryStaffId = availableStaffIds[0];
        const primary = candidateStaff.find((s) => s.id === primaryStaffId);
        primaryStaffName = primary?.name;
      }

      let conflictCode: TimeSlot['conflictCode'] = 'AVAILABLE';
      let reason: string | undefined;

      if (!isSlotAvailable) {
        if (candidateStaff.length === 0) {
          conflictCode = 'NO_ELIGIBLE_STAFF_AVAILABLE';
          reason = 'No qualified staff assigned to this service';
        } else if (isSingleStaffMode) {
          conflictCode = 'EXISTING_BOOKING_CONFLICT';
          reason = staffEvaluationDetails[0]?.unavailableReason || 'Selected staff member is unavailable';
        } else {
          conflictCode = 'NO_ELIGIBLE_STAFF_AVAILABLE';
          reason = 'All eligible staff members are busy or on leave during this slot';
        }
      }

      generatedSlots.push({
        id: slotId,
        date,
        startTime: startTimeStr,
        endTime: serviceEndTimeStr,
        occupancyEndTime: occupancyEndTimeStr,
        serviceDurationMinutes,
        bufferTimeMinutes,
        totalOccupancyMinutes,
        available: isSlotAvailable,
        conflictCode,
        reason,
        availableStaffIds,
        eligibleStaffDetails: staffEvaluationDetails,
        primaryStaffId,
        primaryStaffName
      });
    }

    const availableSlotsCount = generatedSlots.filter((s) => s.available).length;

    return {
      businessId,
      date,
      dayOfWeek,
      businessTimezone,
      serviceId,
      serviceName,
      serviceDurationMinutes,
      bufferTimeMinutes,
      slotIntervalMinutes,
      slots: generatedSlots,
      totalSlotsCount: generatedSlots.length,
      availableSlotsCount
    };
  }
}
