// Nexora SalonOS — Phase 7.14 Permission Matrix & Tenant Isolation Engine
import { UserRole } from '../types';
import { UserSession } from '../services/authContext';

export type ProtectedResource =
  | 'Dashboard'
  | 'Bookings'
  | 'Customers'
  | 'Services'
  | 'Packages'
  | 'Staff'
  | 'Gallery'
  | 'Reviews'
  | 'Website'
  | 'Offers'
  | 'Automations'
  | 'Payments'
  | 'Transactions'
  | 'Commission'
  | 'Wallet'
  | 'Withdrawals'
  | 'Settlements'
  | 'Settings';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'manage'
  | 'export'
  | 'publish'
  | 'execute';

export interface ResourceAccessRule {
  allowedActions: PermissionAction[];
  scope: 'own_only' | 'assigned_only' | 'business_only' | 'platform_wide' | 'none';
}

/**
 * Standard Role-Permission Matrix across all 18 Protected Resources
 */
export const ROLE_PERMISSION_MATRIX: Record<UserRole, Record<ProtectedResource, ResourceAccessRule>> = {
  // 1. CUSTOMER: only own profile, own bookings, own reviews
  CUSTOMER: {
    Dashboard: { allowedActions: [], scope: 'none' },
    Bookings: { allowedActions: ['view', 'create', 'edit'], scope: 'own_only' },
    Customers: { allowedActions: [], scope: 'none' },
    Services: { allowedActions: ['view'], scope: 'platform_wide' }, // public view of catalog
    Packages: { allowedActions: ['view'], scope: 'platform_wide' },
    Staff: { allowedActions: ['view'], scope: 'platform_wide' },
    Gallery: { allowedActions: ['view'], scope: 'platform_wide' },
    Reviews: { allowedActions: ['view', 'create'], scope: 'own_only' }, // can read public reviews, create own
    Website: { allowedActions: ['view'], scope: 'platform_wide' },
    Offers: { allowedActions: ['view'], scope: 'platform_wide' },
    Automations: { allowedActions: [], scope: 'none' },
    Payments: { allowedActions: ['create'], scope: 'own_only' }, // checkout only
    Transactions: { allowedActions: [], scope: 'none' },
    Commission: { allowedActions: [], scope: 'none' },
    Wallet: { allowedActions: [], scope: 'none' },
    Withdrawals: { allowedActions: [], scope: 'none' },
    Settlements: { allowedActions: [], scope: 'none' },
    Settings: { allowedActions: [], scope: 'none' }
  },

  // 2. STAFF: only authorized staff/business data
  STAFF: {
    Dashboard: { allowedActions: ['view'], scope: 'assigned_only' },
    Bookings: { allowedActions: ['view', 'edit'], scope: 'assigned_only' },
    Customers: { allowedActions: ['view'], scope: 'assigned_only' }, // appointment clients only, no export/PII dumping
    Services: { allowedActions: ['view'], scope: 'business_only' },
    Packages: { allowedActions: ['view'], scope: 'business_only' },
    Staff: { allowedActions: ['view', 'edit'], scope: 'own_only' }, // own profile and schedule
    Gallery: { allowedActions: ['view', 'create'], scope: 'business_only' },
    Reviews: { allowedActions: ['view'], scope: 'assigned_only' },
    Website: { allowedActions: ['view'], scope: 'business_only' },
    Offers: { allowedActions: ['view'], scope: 'business_only' },
    Automations: { allowedActions: [], scope: 'none' },
    Payments: { allowedActions: ['view'], scope: 'assigned_only' },
    Transactions: { allowedActions: [], scope: 'none' },
    Commission: { allowedActions: ['view'], scope: 'own_only' },
    Wallet: { allowedActions: [], scope: 'none' },
    Withdrawals: { allowedActions: [], scope: 'none' },
    Settlements: { allowedActions: [], scope: 'none' },
    Settings: { allowedActions: [], scope: 'none' }
  },

  // 3. MANAGER: operational permissions according to configuration
  MANAGER: {
    Dashboard: { allowedActions: ['view'], scope: 'business_only' },
    Bookings: { allowedActions: ['view', 'create', 'edit', 'delete', 'manage'], scope: 'business_only' },
    Customers: { allowedActions: ['view', 'create', 'edit', 'manage'], scope: 'business_only' },
    Services: { allowedActions: ['view', 'create', 'edit'], scope: 'business_only' },
    Packages: { allowedActions: ['view', 'create', 'edit'], scope: 'business_only' },
    Staff: { allowedActions: ['view', 'edit'], scope: 'business_only' }, // schedules, but cannot modify bank accounts
    Gallery: { allowedActions: ['view', 'create', 'edit', 'delete'], scope: 'business_only' },
    Reviews: { allowedActions: ['view', 'edit'], scope: 'business_only' }, // respond to reviews
    Website: { allowedActions: ['view', 'edit'], scope: 'business_only' }, // edit drafts, cannot delete
    Offers: { allowedActions: ['view', 'create', 'edit', 'manage'], scope: 'business_only' },
    Automations: { allowedActions: ['view', 'create', 'edit'], scope: 'business_only' },
    Payments: { allowedActions: ['view', 'create'], scope: 'business_only' }, // POS check-in/cash entry
    Transactions: { allowedActions: ['view'], scope: 'business_only' },
    Commission: { allowedActions: ['view'], scope: 'business_only' },
    Wallet: { allowedActions: ['view'], scope: 'business_only' },
    Withdrawals: { allowedActions: [], scope: 'none' }, // Only Business Owner can execute withdrawals
    Settlements: { allowedActions: ['view'], scope: 'business_only' },
    Settings: { allowedActions: ['view', 'edit'], scope: 'business_only' } // operational settings only, no payout config
  },

  // 4. BUSINESS_OWNER: full access to own business
  BUSINESS_OWNER: {
    Dashboard: { allowedActions: ['view', 'export'], scope: 'business_only' },
    Bookings: { allowedActions: ['view', 'create', 'edit', 'delete', 'manage', 'export'], scope: 'business_only' },
    Customers: { allowedActions: ['view', 'create', 'edit', 'delete', 'manage', 'export'], scope: 'business_only' },
    Services: { allowedActions: ['view', 'create', 'edit', 'delete', 'manage'], scope: 'business_only' },
    Packages: { allowedActions: ['view', 'create', 'edit', 'delete', 'manage'], scope: 'business_only' },
    Staff: { allowedActions: ['view', 'create', 'edit', 'delete', 'manage'], scope: 'business_only' },
    Gallery: { allowedActions: ['view', 'create', 'edit', 'delete', 'manage'], scope: 'business_only' },
    Reviews: { allowedActions: ['view', 'edit', 'delete', 'manage'], scope: 'business_only' },
    Website: { allowedActions: ['view', 'create', 'edit', 'delete', 'manage', 'publish'], scope: 'business_only' },
    Offers: { allowedActions: ['view', 'create', 'edit', 'delete', 'manage'], scope: 'business_only' },
    Automations: { allowedActions: ['view', 'create', 'edit', 'delete', 'manage'], scope: 'business_only' },
    Payments: { allowedActions: ['view', 'create', 'edit', 'manage', 'export'], scope: 'business_only' },
    Transactions: { allowedActions: ['view', 'export'], scope: 'business_only' },
    Commission: { allowedActions: ['view', 'export'], scope: 'business_only' },
    Wallet: { allowedActions: ['view', 'manage'], scope: 'business_only' },
    Withdrawals: { allowedActions: ['view', 'create', 'execute', 'export'], scope: 'business_only' },
    Settlements: { allowedActions: ['view', 'export'], scope: 'business_only' },
    Settings: { allowedActions: ['view', 'edit', 'manage'], scope: 'business_only' }
  },

  // 5. SUPER_ADMIN: platform-level access
  SUPER_ADMIN: {
    Dashboard: { allowedActions: ['view', 'manage', 'export'], scope: 'platform_wide' },
    Bookings: { allowedActions: ['view', 'manage', 'export'], scope: 'platform_wide' },
    Customers: { allowedActions: ['view', 'manage', 'export'], scope: 'platform_wide' },
    Services: { allowedActions: ['view', 'manage'], scope: 'platform_wide' },
    Packages: { allowedActions: ['view', 'manage'], scope: 'platform_wide' },
    Staff: { allowedActions: ['view', 'manage'], scope: 'platform_wide' },
    Gallery: { allowedActions: ['view', 'manage'], scope: 'platform_wide' },
    Reviews: { allowedActions: ['view', 'manage'], scope: 'platform_wide' },
    Website: { allowedActions: ['view', 'manage'], scope: 'platform_wide' },
    Offers: { allowedActions: ['view', 'manage'], scope: 'platform_wide' },
    Automations: { allowedActions: ['view', 'manage'], scope: 'platform_wide' },
    Payments: { allowedActions: ['view', 'manage', 'export'], scope: 'platform_wide' },
    Transactions: { allowedActions: ['view', 'manage', 'export'], scope: 'platform_wide' },
    Commission: { allowedActions: ['view', 'manage', 'export'], scope: 'platform_wide' },
    Wallet: { allowedActions: ['view', 'manage'], scope: 'platform_wide' },
    Withdrawals: { allowedActions: ['view', 'manage', 'execute', 'export'], scope: 'platform_wide' },
    Settlements: { allowedActions: ['view', 'manage', 'execute', 'export'], scope: 'platform_wide' },
    Settings: { allowedActions: ['view', 'edit', 'manage'], scope: 'platform_wide' }
  }
};

/**
 * Custom error class for unauthorized access & security boundary violations
 */
export class SecurityError extends Error {
  public statusCode: number;
  public reason: string;
  public details?: Record<string, any>;

  constructor(message: string, statusCode = 403, details?: Record<string, any>) {
    super(message);
    this.name = 'SecurityError';
    this.statusCode = statusCode;
    this.reason = message;
    this.details = details;
  }
}

export interface SecurityContext {
  targetBusinessId?: string;
  targetUserId?: string;
  assignedStaffId?: string;
  bookingCustomerId?: string;
  bookingStaffId?: string;
}

/**
 * CORE SECURITY CHECK: Checks if user has permission to perform an action on a resource.
 */
export function hasPermission(
  user: UserSession | null,
  resource: ProtectedResource,
  action: PermissionAction,
  context?: SecurityContext
): boolean {
  if (!user) return false;

  const roleRules = ROLE_PERMISSION_MATRIX[user.role];
  if (!roleRules) return false;

  const resourceRule = roleRules[resource];
  if (!resourceRule || !resourceRule.allowedActions.includes(action)) {
    return false;
  }

  // Super Admin has platform-wide clearance
  if (user.role === 'SUPER_ADMIN') {
    return true;
  }

  // Check tenant isolation
  if (context?.targetBusinessId && resourceRule.scope === 'business_only') {
    if (user.businessId !== context.targetBusinessId) {
      return false; // Tenant Isolation violation!
    }
  }

  // Check own_only scoping
  if (resourceRule.scope === 'own_only') {
    if (context?.targetUserId && context.targetUserId !== user.userId) {
      return false;
    }
    if (context?.bookingCustomerId && context.bookingCustomerId !== user.userId) {
      return false;
    }
  }

  // Check assigned_only scoping (Staff)
  if (resourceRule.scope === 'assigned_only') {
    if (user.businessId !== context?.targetBusinessId) {
      return false;
    }
    if (context?.bookingStaffId && context.bookingStaffId !== user.userId) {
      return false;
    }
  }

  return true;
}

/**
 * SECURITY GUARD: Throws SecurityError if user does not have permission.
 * Non-bypassable programmatic security check.
 */
export function assertPermission(
  user: UserSession | null,
  resource: ProtectedResource,
  action: PermissionAction,
  context?: SecurityContext
): void {
  if (!user) {
    throw new SecurityError('Authentication Required: Please sign in to access this resource.', 401);
  }

  const roleRules = ROLE_PERMISSION_MATRIX[user.role];
  if (!roleRules) {
    throw new SecurityError(`Invalid role configuration: ${user.role}`, 403);
  }

  const resourceRule = roleRules[resource];
  if (!resourceRule || !resourceRule.allowedActions.includes(action)) {
    throw new SecurityError(
      `Permission Denied: Role [${user.role}] cannot perform action [${action}] on resource [${resource}].`,
      403,
      { user: user.userId, role: user.role, resource, action }
    );
  }

  // Enforce Tenant Isolation: Business A must NEVER access Business B data
  if (context?.targetBusinessId && user.role !== 'SUPER_ADMIN') {
    if (!user.businessId || user.businessId !== context.targetBusinessId) {
      throw new SecurityError(
        `Tenant Isolation Violation: Access to business [${context.targetBusinessId}] denied for user [${user.userId}] of tenant [${user.businessId || 'NONE'}].`,
        403,
        { targetBusiness: context.targetBusinessId, userTenant: user.businessId }
      );
    }
  }

  // Enforce Customer Isolation: Can only view own bookings / profile
  if (user.role === 'CUSTOMER') {
    if (context?.bookingCustomerId && context.bookingCustomerId !== user.userId) {
      throw new SecurityError(
        `Customer Isolation Violation: Cannot access booking belonging to customer [${context.bookingCustomerId}].`,
        403
      );
    }
  }

  // Enforce Staff Assignment: Can only access assigned data
  if (user.role === 'STAFF') {
    if (context?.bookingStaffId && context.bookingStaffId !== user.userId) {
      throw new SecurityError(
        `Staff Access Restriction: Staff [${user.userId}] cannot view unassigned booking.`,
        403
      );
    }
  }
}

/**
 * ENFORCE TENANT ISOLATION: Specifically guards data sets against cross-tenant leaks.
 */
export function enforceTenantIsolation(
  user: UserSession | null,
  targetBusinessId: string,
  resourceName: string
): void {
  if (!user) {
    throw new SecurityError('Authentication Required', 401);
  }

  if (user.role === 'SUPER_ADMIN') {
    return; // Super admin has global cross-tenant visibility
  }

  if (!user.businessId || user.businessId !== targetBusinessId) {
    throw new SecurityError(
      `Cross-Tenant Breach Blocked: User from tenant [${user.businessId || 'NONE'}] attempted to access ${resourceName} of tenant [${targetBusinessId}].`,
      403,
      { userTenant: user.businessId, targetBusinessId, resource: resourceName }
    );
  }
}
