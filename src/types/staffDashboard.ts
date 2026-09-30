// Nexora SalonOS — Phase 5.5 Staff Dashboard Types
// Staff-Scoped Views, Appointment State Actions, Self-Service Profile & Leave Requests

import { BookingEntity, BookingStatus } from './bookingEngine';
import { StaffProfileEntity } from './staffManagement';
import { StaffLeaveRecord } from '../types/staffSchedule';

export interface StaffDashboardSummary {
  staffId: string;
  staffName: string;
  role: string;
  businessId: string;
  todaysAppointmentsCount: number;
  completedTodayCount: number;
  upcomingCount: number;
  nextAppointment: BookingEntity | null;
  availabilityStatus: 'AVAILABLE' | 'ON_DUTY' | 'ON_BREAK' | 'ON_LEAVE' | 'OFF_DUTY';
}

export interface StaffAppointmentActionPayload {
  bookingId: string;
  staffId: string;
  action: 'CHECK_IN' | 'START' | 'COMPLETE' | 'CANCEL';
  notes?: string;
}
