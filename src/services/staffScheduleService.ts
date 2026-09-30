// Nexora SalonOS — Phase 4.3 Staff Availability & Schedule Evaluation Engine
// Pure Domain Logic, Multi-Tenant Calendars, Timezone Awareness, and Intersection Rules

import {
  DayOfWeek,
  StaffAvailabilityStatus,
  StaffScheduleConfig,
  StaffLeaveRecord,
  BusinessScheduleConfig,
  BusinessHoliday,
  AvailabilityCheckRequest,
  AvailabilityCheckResult,
  parseTimeToMinutes,
  formatMinutesToTime,
  getDayOfWeekFromDate,
  TimeRange
} from '../types/staffSchedule';
import { ServiceBookingConfig, SalonStaffMember } from '../types/servicePackageConfig';

// ----------------------------------------------------------------------------
// SEEDED BUSINESS OPERATING SCHEDULES
// ----------------------------------------------------------------------------

export const SEEDED_BUSINESS_SCHEDULES: Record<string, BusinessScheduleConfig> = {
  // 1. Royal Crown Barber (biz-barber-001) — Open Tue-Sun 09:00 - 20:00 (Mon Closed)
  'biz-barber-001': {
    businessId: 'biz-barber-001',
    timezone: 'Asia/Kolkata',
    weeklyHours: {
      MONDAY: { isOpen: false, openingTime: '00:00', closingTime: '00:00', breaks: [] },
      TUESDAY: { isOpen: true, openingTime: '09:00', closingTime: '20:00', breaks: [{ startTime: '14:00', endTime: '14:30', label: 'Salon Sanitization' }] },
      WEDNESDAY: { isOpen: true, openingTime: '09:00', closingTime: '20:00', breaks: [{ startTime: '14:00', endTime: '14:30', label: 'Salon Sanitization' }] },
      THURSDAY: { isOpen: true, openingTime: '09:00', closingTime: '20:00', breaks: [{ startTime: '14:00', endTime: '14:30', label: 'Salon Sanitization' }] },
      FRIDAY: { isOpen: true, openingTime: '09:00', closingTime: '20:00', breaks: [{ startTime: '14:00', endTime: '14:30', label: 'Salon Sanitization' }] },
      SATURDAY: { isOpen: true, openingTime: '09:00', closingTime: '21:00', breaks: [] },
      SUNDAY: { isOpen: true, openingTime: '09:00', closingTime: '21:00', breaks: [] }
    },
    holidays: [
      { date: '2026-10-02', name: 'Gandhi Jayanti' },
      { date: '2026-10-20', name: 'Diwali Festive Holiday' },
      { date: '2026-12-25', name: 'Christmas Day' }
    ]
  },

  // 2. Zenith Stone Spa (biz-spa-002) — Open 7 days 08:00 - 21:00
  'biz-spa-002': {
    businessId: 'biz-spa-002',
    timezone: 'Asia/Kolkata',
    weeklyHours: {
      MONDAY: { isOpen: true, openingTime: '08:00', closingTime: '21:00', breaks: [] },
      TUESDAY: { isOpen: true, openingTime: '08:00', closingTime: '21:00', breaks: [] },
      WEDNESDAY: { isOpen: true, openingTime: '08:00', closingTime: '21:00', breaks: [] },
      THURSDAY: { isOpen: true, openingTime: '08:00', closingTime: '21:00', breaks: [] },
      FRIDAY: { isOpen: true, openingTime: '08:00', closingTime: '21:00', breaks: [] },
      SATURDAY: { isOpen: true, openingTime: '08:00', closingTime: '22:00', breaks: [] },
      SUNDAY: { isOpen: true, openingTime: '08:00', closingTime: '22:00', breaks: [] }
    },
    holidays: [
      { date: '2026-10-02', name: 'National Holiday' },
      { date: '2026-12-25', name: 'Christmas Day' }
    ]
  },

  // 3. Gloss & Chic Nail Bar (biz-nail-003)
  'biz-nail-003': {
    businessId: 'biz-nail-003',
    timezone: 'Asia/Kolkata',
    weeklyHours: {
      MONDAY: { isOpen: true, openingTime: '10:00', closingTime: '19:00', breaks: [] },
      TUESDAY: { isOpen: true, openingTime: '10:00', closingTime: '19:00', breaks: [] },
      WEDNESDAY: { isOpen: true, openingTime: '10:00', closingTime: '19:00', breaks: [] },
      THURSDAY: { isOpen: true, openingTime: '10:00', closingTime: '19:00', breaks: [] },
      FRIDAY: { isOpen: true, openingTime: '10:00', closingTime: '20:00', breaks: [] },
      SATURDAY: { isOpen: true, openingTime: '10:00', closingTime: '20:00', breaks: [] },
      SUNDAY: { isOpen: false, openingTime: '00:00', closingTime: '00:00', breaks: [] }
    },
    holidays: [{ date: '2026-12-25', name: 'Christmas' }]
  },

  // 4. Mono Tattoo Studio (biz-tattoo-004)
  'biz-tattoo-004': {
    businessId: 'biz-tattoo-004',
    timezone: 'Asia/Kolkata',
    weeklyHours: {
      MONDAY: { isOpen: false, openingTime: '00:00', closingTime: '00:00', breaks: [] },
      TUESDAY: { isOpen: true, openingTime: '12:00', closingTime: '20:00', breaks: [] },
      WEDNESDAY: { isOpen: true, openingTime: '12:00', closingTime: '20:00', breaks: [] },
      THURSDAY: { isOpen: true, openingTime: '12:00', closingTime: '20:00', breaks: [] },
      FRIDAY: { isOpen: true, openingTime: '12:00', closingTime: '22:00', breaks: [] },
      SATURDAY: { isOpen: true, openingTime: '12:00', closingTime: '22:00', breaks: [] },
      SUNDAY: { isOpen: true, openingTime: '12:00', closingTime: '18:00', breaks: [] }
    },
    holidays: [{ date: '2026-10-02', name: 'National Holiday' }]
  }
};

// ----------------------------------------------------------------------------
// SEEDED STAFF INDIVIDUAL WORKING SCHEDULES
// ----------------------------------------------------------------------------

export const SEEDED_STAFF_SCHEDULES: Record<string, StaffScheduleConfig> = {
  // Vikram Rajput (Master Barber @ Royal Crown) — Works Tue-Sat 09:00-18:00 with lunch break 13:00-14:00
  'stf-rc-01': {
    staffId: 'stf-rc-01',
    businessId: 'biz-barber-001',
    timezone: 'Asia/Kolkata',
    active: true,
    weeklySchedule: {
      MONDAY: { dayOfWeek: 'MONDAY', isWorking: false, startTime: '00:00', endTime: '00:00', breaks: [] },
      TUESDAY: { dayOfWeek: 'TUESDAY', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '13:00', endTime: '14:00', label: 'Lunch Break' }] },
      WEDNESDAY: { dayOfWeek: 'WEDNESDAY', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '13:00', endTime: '14:00', label: 'Lunch Break' }] },
      THURSDAY: { dayOfWeek: 'THURSDAY', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '13:00', endTime: '14:00', label: 'Lunch Break' }] },
      FRIDAY: { dayOfWeek: 'FRIDAY', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '13:00', endTime: '14:00', label: 'Lunch Break' }] },
      SATURDAY: { dayOfWeek: 'SATURDAY', isWorking: true, startTime: '09:00', endTime: '17:00', breaks: [{ startTime: '13:00', endTime: '14:00', label: 'Lunch Break' }] },
      SUNDAY: { dayOfWeek: 'SUNDAY', isWorking: false, startTime: '00:00', endTime: '00:00', breaks: [] }
    }
  },

  // Sameer Khan (Senior Stylist @ Royal Crown) — Works Wed-Sun 11:00-20:00 with lunch break 15:00-16:00
  'stf-rc-02': {
    staffId: 'stf-rc-02',
    businessId: 'biz-barber-001',
    timezone: 'Asia/Kolkata',
    active: true,
    weeklySchedule: {
      MONDAY: { dayOfWeek: 'MONDAY', isWorking: false, startTime: '00:00', endTime: '00:00', breaks: [] },
      TUESDAY: { dayOfWeek: 'TUESDAY', isWorking: false, startTime: '00:00', endTime: '00:00', breaks: [] },
      WEDNESDAY: { dayOfWeek: 'WEDNESDAY', isWorking: true, startTime: '11:00', endTime: '20:00', breaks: [{ startTime: '15:00', endTime: '16:00', label: 'Lunch Break' }] },
      THURSDAY: { dayOfWeek: 'THURSDAY', isWorking: true, startTime: '11:00', endTime: '20:00', breaks: [{ startTime: '15:00', endTime: '16:00', label: 'Lunch Break' }] },
      FRIDAY: { dayOfWeek: 'FRIDAY', isWorking: true, startTime: '11:00', endTime: '20:00', breaks: [{ startTime: '15:00', endTime: '16:00', label: 'Lunch Break' }] },
      SATURDAY: { dayOfWeek: 'SATURDAY', isWorking: true, startTime: '11:00', endTime: '20:00', breaks: [{ startTime: '15:00', endTime: '16:00', label: 'Lunch Break' }] },
      SUNDAY: { dayOfWeek: 'SUNDAY', isWorking: true, startTime: '10:00', endTime: '19:00', breaks: [{ startTime: '14:00', endTime: '15:00', label: 'Lunch Break' }] }
    }
  },

  // Rohan Verma (Inactive staff member)
  'stf-rc-03': {
    staffId: 'stf-rc-03',
    businessId: 'biz-barber-001',
    timezone: 'Asia/Kolkata',
    active: false,
    weeklySchedule: {
      MONDAY: { dayOfWeek: 'MONDAY', isWorking: false, startTime: '00:00', endTime: '00:00', breaks: [] },
      TUESDAY: { dayOfWeek: 'TUESDAY', isWorking: true, startTime: '10:00', endTime: '18:00', breaks: [] },
      WEDNESDAY: { dayOfWeek: 'WEDNESDAY', isWorking: true, startTime: '10:00', endTime: '18:00', breaks: [] },
      THURSDAY: { dayOfWeek: 'THURSDAY', isWorking: true, startTime: '10:00', endTime: '18:00', breaks: [] },
      FRIDAY: { dayOfWeek: 'FRIDAY', isWorking: true, startTime: '10:00', endTime: '18:00', breaks: [] },
      SATURDAY: { dayOfWeek: 'SATURDAY', isWorking: true, startTime: '10:00', endTime: '18:00', breaks: [] },
      SUNDAY: { dayOfWeek: 'SUNDAY', isWorking: false, startTime: '00:00', endTime: '00:00', breaks: [] }
    }
  },

  // Maya Nair (Lead Spa Therapist @ Zenith)
  'stf-spa-01': {
    staffId: 'stf-spa-01',
    businessId: 'biz-spa-002',
    timezone: 'Asia/Kolkata',
    active: true,
    weeklySchedule: {
      MONDAY: { dayOfWeek: 'MONDAY', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '13:30', endTime: '14:30', label: 'Therapist Rest' }] },
      TUESDAY: { dayOfWeek: 'TUESDAY', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '13:30', endTime: '14:30', label: 'Therapist Rest' }] },
      WEDNESDAY: { dayOfWeek: 'WEDNESDAY', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '13:30', endTime: '14:30', label: 'Therapist Rest' }] },
      THURSDAY: { dayOfWeek: 'THURSDAY', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '13:30', endTime: '14:30', label: 'Therapist Rest' }] },
      FRIDAY: { dayOfWeek: 'FRIDAY', isWorking: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '13:30', endTime: '14:30', label: 'Therapist Rest' }] },
      SATURDAY: { dayOfWeek: 'SATURDAY', isWorking: false, startTime: '00:00', endTime: '00:00', breaks: [] },
      SUNDAY: { dayOfWeek: 'SUNDAY', isWorking: false, startTime: '00:00', endTime: '00:00', breaks: [] }
    }
  }
};

// ----------------------------------------------------------------------------
// SEEDED STAFF LEAVE RECORDS
// ----------------------------------------------------------------------------

export const SEEDED_STAFF_LEAVES: StaffLeaveRecord[] = [
  {
    id: 'lev-01',
    staffId: 'stf-rc-01', // Vikram Rajput on approved annual leave Oct 15-18, 2026
    businessId: 'biz-barber-001',
    startDate: '2026-10-15',
    endDate: '2026-10-18',
    leaveType: 'VACATION',
    reason: 'Annual family festival leave',
    status: 'APPROVED',
    createdAt: '2026-09-20T10:00:00Z'
  },
  {
    id: 'lev-02',
    staffId: 'stf-spa-01', // Maya Nair on sick leave Oct 08, 2026
    businessId: 'biz-spa-002',
    startDate: '2026-10-08',
    endDate: '2026-10-08',
    leaveType: 'SICK_LEAVE',
    reason: 'Medical recovery',
    status: 'APPROVED',
    createdAt: '2026-09-28T08:00:00Z'
  }
];

// ----------------------------------------------------------------------------
// STAFF AVAILABILITY & WORKING SCHEDULE SERVICE
// ----------------------------------------------------------------------------

export class StaffScheduleService {
  private businessSchedules: Map<string, BusinessScheduleConfig> = new Map();
  private staffSchedules: Map<string, StaffScheduleConfig> = new Map();
  private staffLeaves: StaffLeaveRecord[] = [];

  constructor(
    initialBusinessSchedules = SEEDED_BUSINESS_SCHEDULES,
    initialStaffSchedules = SEEDED_STAFF_SCHEDULES,
    initialLeaves = SEEDED_STAFF_LEAVES
  ) {
    Object.entries(initialBusinessSchedules).forEach(([bizId, cfg]) => {
      this.businessSchedules.set(bizId, JSON.parse(JSON.stringify(cfg)));
    });
    Object.entries(initialStaffSchedules).forEach(([stfId, cfg]) => {
      this.staffSchedules.set(stfId, JSON.parse(JSON.stringify(cfg)));
    });
    this.staffLeaves = [...initialLeaves];
  }

  // --- BUSINESS SCHEDULE GET / SET ---

  public getBusinessSchedule(businessId: string): BusinessScheduleConfig | null {
    return this.businessSchedules.get(businessId) || null;
  }

  public updateBusinessHours(
    businessId: string,
    weeklyHours: Record<DayOfWeek, any>
  ): void {
    const existing = this.businessSchedules.get(businessId);
    if (existing) {
      existing.weeklyHours = weeklyHours;
    }
  }

  public addBusinessHoliday(businessId: string, holiday: BusinessHoliday): void {
    const existing = this.businessSchedules.get(businessId);
    if (existing) {
      if (!existing.holidays) existing.holidays = [];
      // Remove duplicate if date exists then push
      existing.holidays = existing.holidays.filter((h) => h.date !== holiday.date);
      existing.holidays.push(holiday);
    }
  }

  public removeBusinessHoliday(businessId: string, date: string): void {
    const existing = this.businessSchedules.get(businessId);
    if (existing && existing.holidays) {
      existing.holidays = existing.holidays.filter((h) => h.date !== date);
    }
  }

  // --- STAFF SCHEDULE GET / SET ---

  public getStaffSchedule(staffId: string): StaffScheduleConfig | null {
    return this.staffSchedules.get(staffId) || null;
  }

  public updateStaffDailySchedule(
    staffId: string,
    day: DayOfWeek,
    schedule: any
  ): void {
    const existing = this.staffSchedules.get(staffId);
    if (existing && existing.weeklySchedule) {
      existing.weeklySchedule[day] = schedule;
    }
  }

  // --- LEAVE MANAGEMENT ---

  public listStaffLeaves(staffId: string): StaffLeaveRecord[] {
    return this.staffLeaves.filter((l) => l.staffId === staffId);
  }

  public addStaffLeave(leaveRecord: StaffLeaveRecord): void {
    this.staffLeaves.push(leaveRecord);
  }

  public listBusinessLeaves(businessId: string): StaffLeaveRecord[] {
    return this.staffLeaves.filter((l) => l.businessId === businessId);
  }

  public createStaffLeave(record: Omit<StaffLeaveRecord, 'id' | 'createdAt'>): StaffLeaveRecord {
    const newLeave: StaffLeaveRecord = {
      ...record,
      id: `lev-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    this.staffLeaves.push(newLeave);
    return newLeave;
  }

  public updateLeaveStatus(
    leaveId: string,
    status: StaffLeaveRecord['status']
  ): boolean {
    const leave = this.staffLeaves.find((l) => l.id === leaveId);
    if (!leave) return false;
    leave.status = status;
    return true;
  }

  // --------------------------------------------------------------------------
  // CORE AVAILABILITY EVALUATOR (THE INTERSECTION CONTRACT)
  // --------------------------------------------------------------------------

  public evaluateAvailability(
    req: AvailabilityCheckRequest,
    options?: {
      service?: ServiceBookingConfig;
      staffMember?: SalonStaffMember;
    }
  ): AvailabilityCheckResult {
    const {
      businessId,
      staffId,
      serviceDurationMinutes,
      bufferTimeMinutes = 0,
      bookingDate,
      startTime
    } = req;

    const totalOccupancyMinutes = serviceDurationMinutes + bufferTimeMinutes;
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = startMinutes + totalOccupancyMinutes;
    const endTime = formatMinutesToTime(endMinutes);

    // 1. Resolve Business Schedule
    const bizConfig = this.businessSchedules.get(businessId);
    if (!bizConfig) {
      return {
        available: false,
        status: 'UNAVAILABLE',
        code: 'BUSINESS_NOT_FOUND',
        reason: `Business schedule configuration for ${businessId} not found`
      };
    }

    const slotDetails = {
      bookingDate,
      startTime,
      endTime,
      serviceDurationMinutes,
      bufferTimeMinutes,
      totalOccupancyMinutes,
      businessTimezone: bizConfig.timezone
    };

    // 2. Resolve Staff Schedule & Active Status
    const staffConfig = this.staffSchedules.get(staffId);
    if (!staffConfig) {
      return {
        available: false,
        status: 'UNAVAILABLE',
        code: 'STAFF_NOT_FOUND',
        reason: `Staff schedule for ID ${staffId} not found`,
        slotDetails
      };
    }

    if (!staffConfig.active || (options?.staffMember && !options.staffMember.active)) {
      return {
        available: false,
        status: 'UNAVAILABLE',
        code: 'STAFF_INACTIVE',
        reason: 'Staff member is currently inactive',
        slotDetails
      };
    }

    // 3. Staff Eligibility for Service check
    if (options?.service) {
      if (
        options.service.eligibleStaffIds &&
        options.service.eligibleStaffIds.length > 0 &&
        !options.service.eligibleStaffIds.includes(staffId)
      ) {
        return {
          available: false,
          status: 'UNAVAILABLE',
          code: 'STAFF_NOT_ELIGIBLE',
          reason: `Staff member is not eligible to perform service "${options.service.name}"`,
          slotDetails
        };
      }
    }

    // 4. Resolve Day of Week
    const dayOfWeek = getDayOfWeekFromDate(bookingDate);

    // 5. Check Business Holiday
    const holidayMatch = bizConfig.holidays.find((h) => h.date === bookingDate);
    if (holidayMatch) {
      return {
        available: false,
        status: 'HOLIDAY',
        code: 'BUSINESS_HOLIDAY',
        reason: `Business is closed for holiday: ${holidayMatch.name}`,
        slotDetails
      };
    }

    // 6. Check Business Operating Hours on this Day of Week
    const bizHours = bizConfig.weeklyHours[dayOfWeek];
    if (!bizHours || !bizHours.isOpen) {
      return {
        available: false,
        status: 'UNAVAILABLE',
        code: 'OUTSIDE_BUSINESS_HOURS',
        reason: `Business is closed on ${dayOfWeek}`,
        slotDetails
      };
    }

    const bizOpenMin = parseTimeToMinutes(bizHours.openingTime);
    const bizCloseMin = parseTimeToMinutes(bizHours.closingTime);

    if (startMinutes < bizOpenMin || endMinutes > bizCloseMin) {
      return {
        available: false,
        status: 'UNAVAILABLE',
        code: 'OUTSIDE_BUSINESS_HOURS',
        reason: `Requested slot (${startTime} - ${endTime}) is outside business operating hours (${bizHours.openingTime} - ${bizHours.closingTime})`,
        slotDetails
      };
    }

    // Check Business Sanitization / Operating Breaks
    for (const brk of bizHours.breaks || []) {
      const brkStart = parseTimeToMinutes(brk.startTime);
      const brkEnd = parseTimeToMinutes(brk.endTime);
      // Check for overlap: max(startMinutes, brkStart) < min(endMinutes, brkEnd)
      if (Math.max(startMinutes, brkStart) < Math.min(endMinutes, brkEnd)) {
        return {
          available: false,
          status: 'UNAVAILABLE',
          code: 'BUSINESS_ON_BREAK',
          reason: `Requested slot overlaps with business break (${brk.startTime} - ${brk.endTime}: ${brk.label || 'Break'})`,
          slotDetails
        };
      }
    }

    // 7. Check Staff Working Day & Shift Hours
    const staffDaySchedule = staffConfig.weeklySchedule[dayOfWeek];
    if (!staffDaySchedule || !staffDaySchedule.isWorking) {
      return {
        available: false,
        status: 'UNAVAILABLE',
        code: 'OUTSIDE_STAFF_HOURS',
        reason: `Staff member does not work on ${dayOfWeek}`,
        slotDetails
      };
    }

    const staffStartMin = parseTimeToMinutes(staffDaySchedule.startTime);
    const staffEndMin = parseTimeToMinutes(staffDaySchedule.endTime);

    if (startMinutes < staffStartMin || endMinutes > staffEndMin) {
      return {
        available: false,
        status: 'UNAVAILABLE',
        code: 'OUTSIDE_STAFF_HOURS',
        reason: `Requested slot (${startTime} - ${endTime}) exceeds staff working shift (${staffDaySchedule.startTime} - ${staffDaySchedule.endTime})`,
        slotDetails
      };
    }

    // 8. Check Staff Breaks (e.g. Lunch break 13:00 - 14:00)
    for (const brk of staffDaySchedule.breaks || []) {
      const brkStart = parseTimeToMinutes(brk.startTime);
      const brkEnd = parseTimeToMinutes(brk.endTime);
      if (Math.max(startMinutes, brkStart) < Math.min(endMinutes, brkEnd)) {
        return {
          available: false,
          status: 'UNAVAILABLE',
          code: 'STAFF_ON_BREAK',
          reason: `Requested slot overlaps with staff ${brk.label || 'break'} (${brk.startTime} - ${brk.endTime})`,
          slotDetails
        };
      }
    }

    // 9. Check Staff Approved Leaves
    const activeLeave = this.staffLeaves.find((leave) => {
      if (leave.staffId !== staffId || leave.status !== 'APPROVED') return false;
      // Date range check (inclusive)
      if (bookingDate < leave.startDate || bookingDate > leave.endDate) return false;

      // Partial day leave check (if specified)
      if (leave.startTime && leave.endTime) {
        const leaveStart = parseTimeToMinutes(leave.startTime);
        const leaveEnd = parseTimeToMinutes(leave.endTime);
        return Math.max(startMinutes, leaveStart) < Math.min(endMinutes, leaveEnd);
      }
      // Full day leave
      return true;
    });

    if (activeLeave) {
      const leaveStatus: StaffAvailabilityStatus =
        activeLeave.leaveType === 'SICK_LEAVE' ? 'SICK_LEAVE' : 'ON_LEAVE';
      return {
        available: false,
        status: leaveStatus,
        code: 'STAFF_ON_LEAVE',
        reason: `Staff member is on approved ${activeLeave.leaveType} (${activeLeave.startDate} to ${activeLeave.endDate}${activeLeave.reason ? ': ' + activeLeave.reason : ''})`,
        slotDetails
      };
    }

    // 10. All checks passed: Staff is AVAILABLE
    return {
      available: true,
      status: 'AVAILABLE',
      code: 'AVAILABLE',
      reason: 'Staff and business operating schedules are open and available',
      slotDetails
    };
  }
}
