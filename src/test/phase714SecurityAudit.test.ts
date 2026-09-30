// Nexora SalonOS — Phase 7.14 Permission Matrix, Tenant Isolation & Audit Security Test Suite
import { describe, it, expect, beforeEach } from 'vitest';
import { 
  hasPermission, 
  assertPermission, 
  enforceTenantIsolation, 
  ROLE_PERMISSION_MATRIX,
  SecurityError,
  ProtectedResource
} from '../lib/permissions';
import { auditLogService } from '../services/auditLogService';
import { UserSession } from '../services/authContext';
import { AuditAction } from '../types/audit';

describe('PHASE 7.14 — PERMISSIONS + AUDIT + SECURITY', () => {
  // Test User Contexts
  const superAdminSession: UserSession = {
    userId: 'usr-super-1',
    name: 'Rajnish Sharma',
    email: 'rajnish@nexora.io',
    phone: '+91 99999 00000',
    role: 'SUPER_ADMIN',
    token: 'jwt_super',
    expiresAt: Date.now() + 3600000
  };

  const businessOwnerA: UserSession = {
    userId: 'usr-owner-A',
    name: 'Owner A',
    email: 'owner@salon-a.in',
    phone: '+91 98000 11111',
    role: 'BUSINESS_OWNER',
    businessId: 'biz-tenant-A',
    businessSlug: 'salon-a',
    token: 'jwt_owner_a',
    expiresAt: Date.now() + 3600000
  };

  const businessOwnerB: UserSession = {
    userId: 'usr-owner-B',
    name: 'Owner B',
    email: 'owner@salon-b.in',
    phone: '+91 98000 22222',
    role: 'BUSINESS_OWNER',
    businessId: 'biz-tenant-B',
    businessSlug: 'salon-b',
    token: 'jwt_owner_b',
    expiresAt: Date.now() + 3600000
  };

  const managerA: UserSession = {
    userId: 'usr-manager-A',
    name: 'Manager A',
    email: 'manager@salon-a.in',
    phone: '+91 98000 33333',
    role: 'MANAGER',
    businessId: 'biz-tenant-A',
    businessSlug: 'salon-a',
    token: 'jwt_mgr_a',
    expiresAt: Date.now() + 3600000
  };

  const staffA: UserSession = {
    userId: 'usr-staff-A',
    name: 'Stylist A',
    email: 'staff@salon-a.in',
    phone: '+91 98000 44444',
    role: 'STAFF',
    businessId: 'biz-tenant-A',
    businessSlug: 'salon-a',
    token: 'jwt_staff_a',
    expiresAt: Date.now() + 3600000
  };

  const customer1: UserSession = {
    userId: 'usr-cust-1',
    name: 'Customer 1',
    email: 'cust1@gmail.com',
    phone: '+91 98000 55555',
    role: 'CUSTOMER',
    token: 'jwt_cust_1',
    expiresAt: Date.now() + 3600000
  };

  const customer2: UserSession = {
    userId: 'usr-cust-2',
    name: 'Customer 2',
    email: 'cust2@gmail.com',
    phone: '+91 98000 66666',
    role: 'CUSTOMER',
    token: 'jwt_cust_2',
    expiresAt: Date.now() + 3600000
  };

  describe('1. Standard Role Permissions (18 Resources)', () => {
    const allResources: ProtectedResource[] = [
      'Dashboard', 'Bookings', 'Customers', 'Services', 'Packages', 'Staff',
      'Gallery', 'Reviews', 'Website', 'Offers', 'Automations', 'Payments',
      'Transactions', 'Commission', 'Wallet', 'Withdrawals', 'Settlements', 'Settings'
    ];

    it('verifies all 18 protected resources are explicitly governed in ROLE_PERMISSION_MATRIX', () => {
      const roles = ['BUSINESS_OWNER', 'MANAGER', 'STAFF', 'CUSTOMER', 'SUPER_ADMIN'] as const;
      roles.forEach(role => {
        allResources.forEach(resource => {
          expect(ROLE_PERMISSION_MATRIX[role]).toHaveProperty(resource);
          expect(ROLE_PERMISSION_MATRIX[role][resource]).toHaveProperty('allowedActions');
          expect(ROLE_PERMISSION_MATRIX[role][resource]).toHaveProperty('scope');
        });
      });
    });

    it('CUSTOMER rule: only own profile, own bookings, own reviews', () => {
      // Allowed: own booking view and creation
      expect(hasPermission(customer1, 'Bookings', 'view', { bookingCustomerId: customer1.userId })).toBe(true);
      expect(hasPermission(customer1, 'Bookings', 'create')).toBe(true);

      // Denied: viewing another customer booking
      expect(hasPermission(customer1, 'Bookings', 'view', { bookingCustomerId: customer2.userId })).toBe(false);

      // Denied: business management & financial resources
      expect(hasPermission(customer1, 'Dashboard', 'view')).toBe(false);
      expect(hasPermission(customer1, 'Customers', 'view')).toBe(false);
      expect(hasPermission(customer1, 'Transactions', 'view')).toBe(false);
      expect(hasPermission(customer1, 'Commission', 'view')).toBe(false);
      expect(hasPermission(customer1, 'Wallet', 'view')).toBe(false);
      expect(hasPermission(customer1, 'Withdrawals', 'execute')).toBe(false);
      expect(hasPermission(customer1, 'Settlements', 'view')).toBe(false);
      expect(hasPermission(customer1, 'Settings', 'edit')).toBe(false);
      expect(hasPermission(customer1, 'Automations', 'manage')).toBe(false);
    });

    it('STAFF rule: only authorized staff/business data', () => {
      // Allowed: view assigned bookings
      expect(hasPermission(staffA, 'Bookings', 'view', { 
        targetBusinessId: 'biz-tenant-A',
        bookingStaffId: staffA.userId 
      })).toBe(true);

      // Denied: unassigned bookings
      expect(hasPermission(staffA, 'Bookings', 'view', { 
        targetBusinessId: 'biz-tenant-A',
        bookingStaffId: 'other-staff-99' 
      })).toBe(false);

      // Denied: high-privilege business financials
      expect(hasPermission(staffA, 'Transactions', 'view')).toBe(false);
      expect(hasPermission(staffA, 'Wallet', 'view')).toBe(false);
      expect(hasPermission(staffA, 'Withdrawals', 'create')).toBe(false);
      expect(hasPermission(staffA, 'Settlements', 'view')).toBe(false);
      expect(hasPermission(staffA, 'Settings', 'edit')).toBe(false);
      expect(hasPermission(staffA, 'Automations', 'view')).toBe(false);
    });

    it('MANAGER rule: operational permissions according to configuration', () => {
      // Allowed: manage bookings, customers, services, gallery, offers
      expect(hasPermission(managerA, 'Bookings', 'manage', { targetBusinessId: 'biz-tenant-A' })).toBe(true);
      expect(hasPermission(managerA, 'Customers', 'manage', { targetBusinessId: 'biz-tenant-A' })).toBe(true);
      expect(hasPermission(managerA, 'Services', 'edit', { targetBusinessId: 'biz-tenant-A' })).toBe(true);
      expect(hasPermission(managerA, 'Offers', 'create', { targetBusinessId: 'biz-tenant-A' })).toBe(true);
      expect(hasPermission(managerA, 'Website', 'edit', { targetBusinessId: 'biz-tenant-A' })).toBe(true);

      // Denied: financial withdrawal execution (only business owner can withdraw)
      expect(hasPermission(managerA, 'Withdrawals', 'execute', { targetBusinessId: 'biz-tenant-A' })).toBe(false);
      expect(hasPermission(managerA, 'Withdrawals', 'create', { targetBusinessId: 'biz-tenant-A' })).toBe(false);
    });

    it('BUSINESS_OWNER rule: full access to own business', () => {
      allResources.forEach(res => {
        expect(hasPermission(businessOwnerA, res, 'view', { targetBusinessId: 'biz-tenant-A' })).toBe(true);
      });
      // Withdrawal execution allowed for owner
      expect(hasPermission(businessOwnerA, 'Withdrawals', 'execute', { targetBusinessId: 'biz-tenant-A' })).toBe(true);
      expect(hasPermission(businessOwnerA, 'Website', 'publish', { targetBusinessId: 'biz-tenant-A' })).toBe(true);
      expect(hasPermission(businessOwnerA, 'Settings', 'manage', { targetBusinessId: 'biz-tenant-A' })).toBe(true);
    });

    it('SUPER_ADMIN rule: platform-level access across all tenants', () => {
      allResources.forEach(res => {
        expect(hasPermission(superAdminSession, res, 'view', { targetBusinessId: 'biz-tenant-B' })).toBe(true);
        expect(hasPermission(superAdminSession, res, 'manage', { targetBusinessId: 'biz-tenant-B' })).toBe(true);
      });
    });
  });

  describe('2. Tenant Isolation Engine (Business A must NEVER access Business B data)', () => {
    it('enforces isolation for Customers', () => {
      expect(() => {
        enforceTenantIsolation(businessOwnerA, 'biz-tenant-B', 'Customers');
      }).toThrow(SecurityError);
    });

    it('enforces isolation for Bookings', () => {
      expect(() => {
        enforceTenantIsolation(businessOwnerA, 'biz-tenant-B', 'Bookings');
      }).toThrow(/Cross-Tenant Breach Blocked/);
    });

    it('enforces isolation for Staff', () => {
      expect(() => {
        assertPermission(businessOwnerA, 'Staff', 'view', { targetBusinessId: 'biz-tenant-B' });
      }).toThrow(/Tenant Isolation Violation/);
    });

    it('enforces isolation for Services', () => {
      expect(() => {
        assertPermission(managerA, 'Services', 'edit', { targetBusinessId: 'biz-tenant-B' });
      }).toThrow(/Tenant Isolation Violation/);
    });

    it('enforces isolation for Website', () => {
      expect(() => {
        assertPermission(businessOwnerA, 'Website', 'publish', { targetBusinessId: 'biz-tenant-B' });
      }).toThrow(/Tenant Isolation Violation/);
    });

    it('enforces isolation for Transactions', () => {
      expect(() => {
        assertPermission(businessOwnerA, 'Transactions', 'view', { targetBusinessId: 'biz-tenant-B' });
      }).toThrow(/Tenant Isolation Violation/);
    });

    it('allows Super Admin global cross-tenant visibility', () => {
      expect(() => {
        enforceTenantIsolation(superAdminSession, 'biz-tenant-B', 'Transactions');
      }).not.toThrow();
    });
  });

  describe('3. Audit Log System', () => {
    const requiredActions: AuditAction[] = [
      'LOGIN',
      'LOGOUT',
      'PERMISSION_CHANGE',
      'BUSINESS_VERIFICATION',
      'BUSINESS_SUSPENSION',
      'STAFF_CHANGE',
      'SERVICE_PRICE_CHANGE',
      'BOOKING_STATUS_CHANGE',
      'WEBSITE_PUBLISH',
      'PAYMENT_ADMIN_ACTION',
      'WITHDRAWAL_ACTION',
      'SETTINGS_CHANGE'
    ];

    it('records all 12 specified audit actions accurately', () => {
      requiredActions.forEach(action => {
        const entry = auditLogService.recordAuditLog({
          user: { id: businessOwnerA.userId, name: businessOwnerA.name, email: businessOwnerA.email },
          role: businessOwnerA.role,
          businessId: businessOwnerA.businessId,
          businessName: 'Salon A',
          action,
          entity: 'Booking',
          entityId: 'ent-123',
          metadata: { testAction: action }
        });

        expect(entry).toHaveProperty('id');
        expect(entry.action).toBe(action);
        expect(entry.user.name).toBe(businessOwnerA.name);
        expect(entry.businessId).toBe(businessOwnerA.businessId);
        expect(entry.timestamp).toBeDefined();
        expect(entry.metadata?.testAction).toBe(action);
      });
    });

    it('prevents normal users and tenants from editing or deleting audit history', () => {
      expect(() => {
        auditLogService.deleteAuditLog(businessOwnerA, 'aud-log-101');
      }).toThrow(/Compliance Violation: Audit records are legally immutable/);

      expect(() => {
        auditLogService.updateAuditLog(businessOwnerA, 'aud-log-101');
      }).toThrow(/Compliance Violation: Audit records are immutable/);

      expect(() => {
        auditLogService.deleteAuditLog(customer1, 'aud-log-101');
      }).toThrow(/Compliance Violation/);
    });

    it('allows Super Admin to view platform logs and filter by action, role, and search', () => {
      const allLogs = auditLogService.getAuditLogs(superAdminSession);
      expect(allLogs.length).toBeGreaterThan(0);

      // Filter by action
      const verificationLogs = auditLogService.getAuditLogs(superAdminSession, { action: 'BUSINESS_VERIFICATION' });
      expect(verificationLogs.every(l => l.action === 'BUSINESS_VERIFICATION')).toBe(true);

      // Filter by role
      const ownerLogs = auditLogService.getAuditLogs(superAdminSession, { role: 'BUSINESS_OWNER' });
      expect(ownerLogs.every(l => l.role === 'BUSINESS_OWNER')).toBe(true);

      // Search term
      const searchResults = auditLogService.getAuditLogs(superAdminSession, { searchTerm: 'Vikram' });
      expect(searchResults.every(l => 
        l.user.name.includes('Vikram') || l.user.email.includes('Vikram') || l.businessName?.includes('Vikram')
      )).toBe(true);
    });

    it('restricts Business Owner audit queries to their own tenant logs', () => {
      const ownerLogs = auditLogService.getAuditLogs(businessOwnerA);
      expect(ownerLogs.every(l => l.businessId === businessOwnerA.businessId)).toBe(true);
    });

    it('rejects unauthorized roles (Customer, Staff) from accessing audit logs', () => {
      expect(() => {
        auditLogService.getAuditLogs(customer1);
      }).toThrow(SecurityError);

      expect(() => {
        auditLogService.getAuditLogs(staffA);
      }).toThrow(SecurityError);
    });
  });
});
