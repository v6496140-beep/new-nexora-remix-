// Nexora SalonOS — Phase 7.14 Audit & Security Data Contracts
import { UserRole } from './index';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'PERMISSION_CHANGE'
  | 'BUSINESS_VERIFICATION'
  | 'BUSINESS_SUSPENSION'
  | 'STAFF_CHANGE'
  | 'SERVICE_PRICE_CHANGE'
  | 'BOOKING_STATUS_CHANGE'
  | 'WEBSITE_PUBLISH'
  | 'PAYMENT_ADMIN_ACTION'
  | 'WITHDRAWAL_ACTION'
  | 'SETTINGS_CHANGE';

export type AuditEntity =
  | 'Auth'
  | 'User'
  | 'Business'
  | 'Staff'
  | 'Service'
  | 'Package'
  | 'Booking'
  | 'Website'
  | 'Payment'
  | 'Withdrawal'
  | 'Settlement'
  | 'Settings'
  | 'Security';

export interface AuditUser {
  id: string;
  name: string;
  email: string;
}

export interface AuditLogEntry {
  id: string;
  user: AuditUser;
  role: UserRole;
  businessId?: string | null;
  businessName?: string | null;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  timestamp: string; // ISO 8601
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export interface AuditFilterOptions {
  searchTerm?: string;
  action?: AuditAction | 'all';
  role?: UserRole | 'all';
  businessId?: string | 'all';
  dateRange?: 'all' | 'today' | '7days' | '30days';
}
