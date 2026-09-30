// Nexora SalonOS — Route Protection & Zone Boundary Architecture (Phase 3.1)
// Clean conceptual guard defining authorization rules across the 5 domains:
// PUBLIC, CUSTOMER, BUSINESS_ADMIN, STAFF, SUPER_ADMIN.

import { UserRole } from '../types';

export type AppZone =
  | 'PUBLIC'
  | 'CUSTOMER'
  | 'BUSINESS_ADMIN'
  | 'STAFF'
  | 'SUPER_ADMIN';

export interface RoutePermissionRule {
  pathPattern: string;
  targetZone: AppZone;
  allowedRoles: UserRole[];
  requiresAuth: boolean;
  tenantScoped: boolean;
}

/**
 * Route protection registry mapping application URL segments to access boundaries.
 */
export const ZONE_PERMISSION_RULES: Record<AppZone, RoutePermissionRule> = {
  PUBLIC: {
    pathPattern: '/:salonSlug/*',
    targetZone: 'PUBLIC',
    allowedRoles: ['SUPER_ADMIN', 'BUSINESS_OWNER', 'MANAGER', 'STAFF', 'CUSTOMER'],
    requiresAuth: false,
    tenantScoped: true,
  },
  CUSTOMER: {
    pathPattern: '/account/*',
    targetZone: 'CUSTOMER',
    allowedRoles: ['CUSTOMER', 'BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'],
    requiresAuth: true,
    tenantScoped: false,
  },
  BUSINESS_ADMIN: {
    pathPattern: '/admin/*',
    targetZone: 'BUSINESS_ADMIN',
    allowedRoles: ['BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'],
    requiresAuth: true,
    tenantScoped: true,
  },
  STAFF: {
    pathPattern: '/staff/*',
    targetZone: 'STAFF',
    allowedRoles: ['STAFF', 'BUSINESS_OWNER', 'MANAGER', 'SUPER_ADMIN'],
    requiresAuth: true,
    tenantScoped: true,
  },
  SUPER_ADMIN: {
    pathPattern: '/superadmin/*',
    targetZone: 'SUPER_ADMIN',
    allowedRoles: ['SUPER_ADMIN'],
    requiresAuth: true,
    tenantScoped: false,
  },
};

/**
 * Validates whether an active user context has clearance to navigate to a target zone.
 */
export function checkZoneAccess(
  zone: AppZone,
  userRole: UserRole | null | undefined
): { allowed: boolean; redirectPath?: string } {
  const rule = ZONE_PERMISSION_RULES[zone];

  if (!rule.requiresAuth) {
    return { allowed: true };
  }

  if (!userRole) {
    return {
      allowed: false,
      redirectPath: zone === 'SUPER_ADMIN' ? '/superadmin/login' : '/signin',
    };
  }

  if (rule.allowedRoles.includes(userRole)) {
    return { allowed: true };
  }

  // Fallback redirect for unauthorized role
  return {
    allowed: false,
    redirectPath: userRole === 'CUSTOMER' ? '/account' : '/admin',
  };
}
