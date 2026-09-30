// Nexora SalonOS — Phase 5.10 Operations Security & Authorization Service
// Role-Based Access Control (RBAC), Tenant Isolation Enforcement, and Immutable Audit Trails

export type UserRole = 'BUSINESS_OWNER' | 'MANAGER' | 'STAFF' | 'CUSTOMER' | 'SUPER_ADMIN';

export interface AuditLogEntity {
  auditId: string;
  businessId: string;
  actorId: string;
  actorRole: UserRole;
  action: string;
  targetEntity: string;
  details: string;
  timestamp: string;
}

export class SecurityHardeningService {
  private auditLogs: AuditLogEntity[] = [];

  /**
   * Enforce Role Authorization & Tenant Isolation
   */
  public authorize(
    actorRole: UserRole,
    actorTenantId: string,
    targetTenantId: string,
    action: string
  ): { allowed: boolean; reason?: string } {
    // Super admin has global access
    if (actorRole === 'SUPER_ADMIN') {
      return { allowed: true };
    }

    // Tenant Isolation Check
    if (actorTenantId !== targetTenantId && actorRole !== 'CUSTOMER') {
      return { allowed: false, reason: 'Tenant Isolation Violation: Cross-business access prohibited.' };
    }

    // Role-based action matrix
    if (actorRole === 'CUSTOMER') {
      const customerAllowedActions = ['VIEW_PROFILE', 'EDIT_PROFILE', 'CREATE_BOOKING', 'VIEW_OWN_BOOKINGS', 'CANCEL_OWN_BOOKING', 'CREATE_REVIEW'];
      if (!customerAllowedActions.includes(action)) {
        return { allowed: false, reason: `Role 'CUSTOMER' is unauthorized for action '${action}'.` };
      }
      return { allowed: true };
    }

    if (actorRole === 'STAFF') {
      const staffAllowedActions = ['VIEW_OWN_APPOINTMENTS', 'UPDATE_OWN_SCHEDULE', 'VIEW_CUSTOMER_INFO', 'VIEW_OWN_PROFILE', 'CHECK_IN_BOOKING', 'START_BOOKING', 'COMPLETE_BOOKING'];
      if (!staffAllowedActions.includes(action)) {
        return { allowed: false, reason: `Role 'STAFF' is unauthorized for action '${action}' (restricted from financial/administrative controls).` };
      }
      return { allowed: true };
    }

    if (actorRole === 'MANAGER') {
      const forbiddenForManager = ['MANAGE_TAX_CONFIGURATION', 'MANAGE_PLATFORM_COMMISSION', 'MANAGE_SETTLEMENT_CONTROLS'];
      if (forbiddenForManager.includes(action)) {
        return { allowed: false, reason: `Role 'MANAGER' does not possess financial/compliance authority for '${action}'.` };
      }
      return { allowed: true };
    }

    if (actorRole === 'BUSINESS_OWNER') {
      return { allowed: true };
    }

    return { allowed: false, reason: 'Unauthorized role.' };
  }

  /**
   * Record immutable audit log
   */
  public logAudit(
    businessId: string,
    actorId: string,
    actorRole: UserRole,
    action: string,
    targetEntity: string,
    details: string
  ): AuditLogEntity {
    const entry: AuditLogEntity = {
      auditId: `audit-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      businessId,
      actorId,
      actorRole,
      action,
      targetEntity,
      details,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  public listAuditLogs(businessId?: string): AuditLogEntity[] {
    if (!businessId) return [...this.auditLogs];
    return this.auditLogs.filter((l) => l.businessId === businessId);
  }
}

export const securityHardeningService = new SecurityHardeningService();
