// Nexora SalonOS — Phase 4.3 Staff Availability + Working Schedule
// Multi-Tenant Schedules, Business Hours, Leave Management, and Availability Evaluator

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type StaffAvailabilityStatus =
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'ON_LEAVE'
  | 'SICK_LEAVE'
  | 'HOLIDAY'
  | 'BLOCKED';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LeaveType = 'VACATION' | 'SICK_LEAVE' | 'CASUAL' | 'PERSONAL';

export interface TimeRange {
  startTime: string; // 'HH:mm' e.g. '13:00'
  endTime: string; // 'HH:mm' e.g. '14:00'
  label?: string; // e.g. 'Lunch Break'
}

export interface StaffDailySchedule {
  dayOfWeek: DayOfWeek;
  isWorking: boolean;
  startTime: string; // e.g. '09:00'
  endTime: string; // e.g. '18:00'
  breaks: TimeRange[]; // e.g. [{ startTime: '13:00', endTime: '14:00', label: 'Lunch' }]
}

export interface StaffScheduleConfig {
  staffId: string;
  businessId: string;
  timezone: string; // e.g. 'Asia/Kolkata'
  active: boolean;
  weeklySchedule: Record<DayOfWeek, StaffDailySchedule>;
}

export interface StaffLeaveRecord {
  id: string;
  staffId: string;
  businessId: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  startTime?: string; // 'HH:mm' optional partial day leave
  endTime?: string; // 'HH:mm' optional partial day leave
  leaveType: LeaveType;
  reason?: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface BusinessDailyHours {
  dayOfWeek?: DayOfWeek;
  isOpen: boolean;
  openingTime: string; // e.g. '09:00'
  closingTime: string; // e.g. '20:00'
  breaks: TimeRange[]; // e.g. cleaning/sanitization break
}

export interface BusinessHoliday {
  date: string; // 'YYYY-MM-DD'
  name: string; // e.g. 'Diwali', 'Christmas', 'National Day'
}

export interface BusinessScheduleConfig {
  businessId: string;
  timezone: string; // e.g. 'Asia/Kolkata'
  weeklyHours: Record<DayOfWeek, BusinessDailyHours>;
  holidays: BusinessHoliday[];
}

export interface AvailabilityCheckRequest {
  businessId: string;
  staffId: string;
  serviceId?: string;
  serviceDurationMinutes: number; // e.g. 60
  bufferTimeMinutes?: number; // e.g. 15
  bookingDate: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm' e.g. '10:00'
}

export interface AvailabilityCheckResult {
  available: boolean;
  status: StaffAvailabilityStatus;
  reason?: string;
  code:
    | 'AVAILABLE'
    | 'OUTSIDE_BUSINESS_HOURS'
    | 'OUTSIDE_STAFF_HOURS'
    | 'STAFF_ON_BREAK'
    | 'BUSINESS_ON_BREAK'
    | 'STAFF_ON_LEAVE'
    | 'BUSINESS_HOLIDAY'
    | 'STAFF_INACTIVE'
    | 'STAFF_NOT_ELIGIBLE'
    | 'BUFFER_OVERFLOW'
    | 'STAFF_NOT_FOUND'
    | 'BUSINESS_NOT_FOUND';
  slotDetails?: {
    bookingDate: string;
    startTime: string;
    endTime: string;
    serviceDurationMinutes: number;
    bufferTimeMinutes: number;
    totalOccupancyMinutes: number;
    businessTimezone: string;
  };
}

// ----------------------------------------------------------------------------
// HELPER TIME & DATE UTILITIES
// ----------------------------------------------------------------------------

export function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function formatMinutesToTime(totalMinutes: number): string {
  const normalized = totalMinutes % (24 * 60);
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function getDayOfWeekFromDate(dateStr: string): DayOfWeek {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const dayIndex = dateObj.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
  const days: DayOfWeek[] = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY'
  ];
  return days[dayIndex];
}
