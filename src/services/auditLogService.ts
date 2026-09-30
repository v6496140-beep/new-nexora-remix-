// Nexora SalonOS — Phase 7.14 Enterprise Audit Logging Engine
import { 
  AuditAction, 
  AuditEntity, 
  AuditLogEntry, 
  AuditFilterOptions, 
  AuditUser 
} from '../types/audit';
import { UserRole } from '../types';
import { UserSession } from './authContext';
import { SecurityError } from '../lib/permissions';

// Pre-seeded immutable audit events representing authentic historical system actions
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-log-101',
    user: { id: 'usr-super-1', name: 'Rajnish Sharma', email: 'rajnish@nexora.io' },
    role: 'SUPER_ADMIN',
    businessId: 'biz-barber-01',
    businessName: 'The Royal Crown Barber & Lounge',
    action: 'BUSINESS_VERIFICATION',
    entity: 'Business',
    entityId: 'biz-barber-01',
    timestamp: '2026-09-29T10:15:30.000Z',
    metadata: {
      previousStatus: 'under_review',
      newStatus: 'verified',
      reason: 'GSTIN, municipal salon trade license, and photo KYC authenticated',
      verifier: 'Rajnish Sharma'
    },
    ipAddress: '103.21.124.8'
  },
  {
    id: 'aud-log-102',
    user: { id: 'usr-owner-1', name: 'Vikram Singhania', email: 'owner@royalcrown.in' },
    role: 'BUSINESS_OWNER',
    businessId: 'biz-barber-01',
    businessName: 'The Royal Crown Barber & Lounge',
    action: 'SERVICE_PRICE_CHANGE',
    entity: 'Service',
    entityId: 'srv-classic-cut',
    timestamp: '2026-09-29T14:22:10.000Z',
    metadata: {
      serviceName: 'Royal Signature Razor Cut',
      oldPrice: 1200,
      newPrice: 1500,
      currency: 'INR',
      effectiveImmediately: true
    },
    ipAddress: '49.36.112.44'
  },
  {
    id: 'aud-log-103',
    user: { id: 'usr-manager-1', name: 'Sameer Patel', email: 'manager@royalcrown.in' },
    role: 'MANAGER',
    businessId: 'biz-barber-01',
    businessName: 'The Royal Crown Barber & Lounge',
    action: 'BOOKING_STATUS_CHANGE',
    entity: 'Booking',
    entityId: 'bk-99201',
    timestamp: '2026-09-29T16:05:00.000Z',
    metadata: {
      customerName: 'Kabir Oberoi',
      service: 'Artisanal Hot Towel Shave',
      previousStatus: 'confirmed',
      newStatus: 'checked_in',
      slotTime: '16:00'
    },
    ipAddress: '49.36.112.44'
  },
  {
    id: 'aud-log-104',
    user: { id: 'usr-owner-1', name: 'Vikram Singhania', email: 'owner@royalcrown.in' },
    role: 'BUSINESS_OWNER',
    businessId: 'biz-barber-01',
    businessName: 'The Royal Crown Barber & Lounge',
    action: 'WEBSITE_PUBLISH',
    entity: 'Website',
    entityId: 'web-royal-crown',
    timestamp: '2026-09-29T18:40:15.000Z',
    metadata: {
      templateId: 'tmpl-barber-luxury',
      themePreset: 'luxury',
      version: 4,
      publishedDomain: 'royalcrown.nexora.salon'
    },
    ipAddress: '49.36.112.44'
  },
  {
    id: 'aud-log-105',
    user: { id: 'usr-owner-1', name: 'Vikram Singhania', email: 'owner@royalcrown.in' },
    role: 'BUSINESS_OWNER',
    businessId: 'biz-barber-01',
    businessName: 'The Royal Crown Barber & Lounge',
    action: 'WITHDRAWAL_ACTION',
    entity: 'Withdrawal',
    entityId: 'wd-2026-09-001',
    timestamp: '2026-09-30T02:10:00.000Z',
    metadata: {
      amount: 45000,
      currency: 'INR',
      destinationAccount: 'HDFC Bank ****4921',
      status: 'initiated'
    },
    ipAddress: '49.36.112.44'
  },
  {
    id: 'aud-log-106',
    user: { id: 'usr-owner-1', name: 'Vikram Singhania', email: 'owner@royalcrown.in' },
    role: 'BUSINESS_OWNER',
    businessId: 'biz-barber-01',
    businessName: 'The Royal Crown Barber & Lounge',
    action: 'SETTINGS_CHANGE',
    entity: 'Settings',
    entityId: 'cfg-biz-barber-01',
    timestamp: '2026-09-30T03:00:22.000Z',
    metadata: {
      settingKey: 'cancellationWindowHours',
      oldValue: 2,
      newValue: 4,
      reason: 'Align with weekend peak slot reservation policies'
    },
    ipAddress: '49.36.112.44'
  },
  {
    id: 'aud-log-107',
    user: { id: 'usr-super-1', name: 'Rajnish Sharma', email: 'rajnish@nexora.io' },
    role: 'SUPER_ADMIN',
    businessId: 'biz-spa-02',
    businessName: 'Zenith Stone Spa & Sanctuary',
    action: 'BUSINESS_SUSPENSION',
    entity: 'Business',
    entityId: 'biz-spa-02',
    timestamp: '2026-09-30T04:15:00.000Z',
    metadata: {
      previousStatus: 'verified',
      newStatus: 'suspended',
      reason: 'Routine regulatory compliance inquiry regarding commercial hygiene licensing renewal',
      authorizedBy: 'Rajnish Sharma'
    },
    ipAddress: '103.21.124.8'
  },
  {
    id: 'aud-log-108',
    user: { id: 'usr-super-1', name: 'Rajnish Sharma', email: 'rajnish@nexora.io' },
    role: 'SUPER_ADMIN',
    businessId: 'biz-nail-03',
    businessName: 'Gloss & Chic Nail Bar',
    action: 'PERMISSION_CHANGE',
    entity: 'Security',
    entityId: 'usr-manager-2',
    timestamp: '2026-09-30T04:45:10.000Z',
    metadata: {
      targetUser: 'Pooja Varma',
      previousRole: 'STAFF',
      newRole: 'MANAGER',
      grantedPermissions: ['Bookings.manage', 'Staff.schedules']
    },
    ipAddress: '103.21.124.8'
  },
  {
    id: 'aud-log-109',
    user: { id: 'usr-super-1', name: 'Rajnish Sharma', email: 'rajnish@nexora.io' },
    role: 'SUPER_ADMIN',
    businessId: 'biz-barber-01',
    businessName: 'The Royal Crown Barber & Lounge',
    action: 'PAYMENT_ADMIN_ACTION',
    entity: 'Payment',
    entityId: 'tx-rev-8910',
    timestamp: '2026-09-30T05:00:00.000Z',
    metadata: {
      actionType: 'FORCE_CAPTURE_OVERRIDE',
      gatewayTxId: 'pg_razor_990141',
      settlementBatchId: 'stl-batch-0930',
      authorizedBy: 'Rajnish Sharma'
    },
    ipAddress: '103.21.124.8'
  },
  {
    id: 'aud-log-110',
    user: { id: 'usr-customer-1', name: 'Rahul Kapoor', email: 'rahul.customer@example.com' },
    role: 'CUSTOMER',
    businessId: null,
    action: 'LOGIN',
    entity: 'Auth',
    entityId: 'usr-customer-1',
    timestamp: '2026-09-30T05:12:00.000Z',
    metadata: { authProvider: 'email_password', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)' },
    ipAddress: '157.34.88.19'
  }
];

class AuditLogService {
  private logs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];

  /**
   * Append an immutable audit log record.
   * Can be invoked by system controllers or authenticated services.
   */
  public recordAuditLog(params: {
    user: AuditUser;
    role: UserRole;
    action: AuditAction;
    entity: AuditEntity;
    entityId: string;
    businessId?: string | null;
    businessName?: string | null;
    metadata?: Record<string, any>;
    ipAddress?: string;
  }): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `aud-log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user: params.user,
      role: params.role,
      businessId: params.businessId || null,
      businessName: params.businessName || null,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      timestamp: new Date().toISOString(),
      metadata: params.metadata || {},
      ipAddress: params.ipAddress || '127.0.0.1'
    };

    // Immutability: only unshift/push
    this.logs.unshift(entry);
    return entry;
  }

  /**
   * Query audit logs with authorization guards:
   * - Super Admin can view all platform logs.
   * - Business Owners can view logs scoped strictly to their business.
   * - Other roles are rejected.
   */
  public getAuditLogs(
    requestingUser: UserSession | null,
    options?: AuditFilterOptions
  ): AuditLogEntry[] {
    if (!requestingUser) {
      throw new SecurityError('Authentication Required to access audit logs.', 401);
    }

    if (requestingUser.role !== 'SUPER_ADMIN' && requestingUser.role !== 'BUSINESS_OWNER') {
      throw new SecurityError('Access Denied: Only Super Admins and Business Owners can access audit logs.', 403);
    }

    let results = [...this.logs];

    // Tenant Scoping: Business Owners only see their own business
    if (requestingUser.role === 'BUSINESS_OWNER') {
      if (!requestingUser.businessId) {
        return [];
      }
      results = results.filter(l => l.businessId === requestingUser.businessId);
    }

    // Filter by action
    if (options?.action && options.action !== 'all') {
      results = results.filter(l => l.action === options.action);
    }

    // Filter by role
    if (options?.role && options.role !== 'all') {
      results = results.filter(l => l.role === options.role);
    }

    // Filter by business (for Super Admin)
    if (options?.businessId && options.businessId !== 'all') {
      results = results.filter(l => l.businessId === options.businessId);
    }

    // Filter by date range
    if (options?.dateRange && options.dateRange !== 'all') {
      const now = new Date().getTime();
      const cutoff = options.dateRange === 'today' 
        ? now - (24 * 60 * 60 * 1000)
        : options.dateRange === '7days'
        ? now - (7 * 24 * 60 * 60 * 1000)
        : now - (30 * 24 * 60 * 60 * 1000);

      results = results.filter(l => new Date(l.timestamp).getTime() >= cutoff);
    }

    // Search filter
    if (options?.searchTerm && options.searchTerm.trim()) {
      const term = options.searchTerm.toLowerCase();
      results = results.filter(l => 
        l.user.name.toLowerCase().includes(term) ||
        l.user.email.toLowerCase().includes(term) ||
        l.action.toLowerCase().includes(term) ||
        l.entity.toLowerCase().includes(term) ||
        l.entityId.toLowerCase().includes(term) ||
        (l.businessName && l.businessName.toLowerCase().includes(term))
      );
    }

    return results;
  }

  /**
   * IMMUTABILITY ENFORCEMENT:
   * Normal users cannot edit or delete audit history.
   * Attempting to delete throws a fatal SecurityError.
   */
  public deleteAuditLog(requestingUser: UserSession | null, logId: string): void {
    throw new SecurityError(
      `Compliance Violation: Audit records are legally immutable and cannot be deleted by [${requestingUser?.role || 'ANONYMOUS'}]. Log ID: ${logId}`,
      403
    );
  }

  public updateAuditLog(requestingUser: UserSession | null, logId: string): void {
    throw new SecurityError(
      `Compliance Violation: Audit records are immutable and cannot be modified. Log ID: ${logId}`,
      403
    );
  }
}

export const auditLogService = new AuditLogService();
