import { describe, it, expect, beforeEach } from 'vitest';
import { verificationService } from '../services/verificationService';
import { 
  VerificationStatus, 
  BusinessVerificationHistory, 
  BusinessVerificationFields,
  DbBusinessVerificationHistory 
} from '../types';

describe('3. VERIFICATION DATA MODEL & AUDIT SPECIFICATION', () => {
  const BIZ_ID = 'biz-barber-01'; // The Royal Crown Barber
  const OWNER_ID = 'usr-1';
  const OTHER_OWNER_ID = 'user-own-999';
  const ADMIN_ID = 'user-sa-001';

  beforeEach(() => {
    // Reset service test state if needed
  });

  describe('Logical Field Schema Verification', () => {
    it('contains all preferred logical fields defined in specification', () => {
      const biz = verificationService.getBusiness(BIZ_ID);
      expect(biz).toBeDefined();

      // Check existence of preferred fields on business model
      expect(biz).toHaveProperty('verificationStatus');
      expect(biz).toHaveProperty('verificationSubmittedAt');
      expect(biz).toHaveProperty('verifiedAt');
      expect(biz).toHaveProperty('verifiedBy');
      expect(biz).toHaveProperty('rejectionReason');
      expect(biz).toHaveProperty('suspensionReason');
      expect(biz).toHaveProperty('verificationNotes');
    });

    it('validates schema type contract for business verification fields', () => {
      const sampleDbFields: BusinessVerificationFields = {
        verification_status: 'verified',
        verification_submitted_at: '2026-08-16T14:30:00.000Z',
        verified_at: '2026-08-18T09:15:00.000Z',
        verified_by: ADMIN_ID,
        rejection_reason: null,
        suspension_reason: null,
        verification_notes: 'Tier-1 enterprise certification granted.'
      };

      expect(sampleDbFields.verification_status).toBe('verified');
      expect(sampleDbFields.verified_by).toBe(ADMIN_ID);
    });
  });

  describe('Dedicated History/Audit Table: business_verification_history', () => {
    it('adheres to the logical structure (id, business_id, previous_status, new_status, reason, notes, changed_by, created_at)', () => {
      const historyRecord: DbBusinessVerificationHistory = {
        id: 'hist-rc-003',
        business_id: BIZ_ID,
        previous_status: 'under_review',
        new_status: 'verified',
        reason: 'All documentation verified against national business register',
        notes: 'Tier-1 enterprise certification granted. Zero compliance violations.',
        changed_by: ADMIN_ID,
        created_at: '2026-08-18T09:15:00.000Z'
      };

      expect(historyRecord.id).toBeDefined();
      expect(historyRecord.business_id).toBe(BIZ_ID);
      expect(historyRecord.previous_status).toBe('under_review');
      expect(historyRecord.new_status).toBe('verified');
      expect(historyRecord.reason).toContain('verified');
      expect(historyRecord.notes).toContain('Tier-1');
      expect(historyRecord.changed_by).toBe(ADMIN_ID);
      expect(historyRecord.created_at).toBeDefined();
    });

    it('records state transitions rather than overwriting historical information', async () => {
      const initialHistory = verificationService.getVerificationHistory(BIZ_ID, ADMIN_ID, 'SUPER_ADMIN');
      const initialCount = initialHistory.length;

      // Super admin rejects entity with reason
      await verificationService.rejectVerification(
        BIZ_ID,
        ADMIN_ID,
        'SUPER_ADMIN',
        'Tax document address does not match physical storefront premise',
        'Auditor flagged discrepancy in utility bills'
      );

      const updatedHistory = verificationService.getVerificationHistory(BIZ_ID, ADMIN_ID, 'SUPER_ADMIN');
      expect(updatedHistory.length).toBe(initialCount + 1);

      // Latest record is at top or contains the new transition
      const latest = updatedHistory[0];
      expect(latest.businessId).toBe(BIZ_ID);
      expect(latest.newStatus).toBe('rejected');
      expect(latest.reason).toBe('Tax document address does not match physical storefront premise');
      expect(latest.notes).toBe('Auditor flagged discrepancy in utility bills');
      expect(latest.changedBy).toBe(ADMIN_ID);

      // Historical records are preserved!
      const previousVerifiedRecord = updatedHistory.find(h => h.newStatus === 'verified');
      expect(previousVerifiedRecord).toBeDefined();
    });
  });

  describe('Customer Privacy & Public Field Security', () => {
    it('customers should ONLY see public verification state, redacting sensitive fields', () => {
      const publicState = verificationService.getPublicVerificationState(BIZ_ID);
      expect(publicState).not.toBeNull();

      // Public allowed fields
      expect(publicState).toHaveProperty('businessId');
      expect(publicState).toHaveProperty('verificationStatus');
      expect(publicState).toHaveProperty('isVerified');

      // Sensitive internal compliance fields MUST NOT exist on public view
      expect((publicState as any).verificationNotes).toBeUndefined();
      expect((publicState as any).rejectionReason).toBeUndefined();
      expect((publicState as any).suspensionReason).toBeUndefined();
      expect((publicState as any).verifiedBy).toBeUndefined();
    });

    it('denies customers access to audit history logs', () => {
      expect(() => {
        verificationService.getVerificationHistory(BIZ_ID, 'cust-user-123', 'CUSTOMER');
      }).toThrow(/Access Denied/);
    });
  });

  describe('Business Owner Authorization & Scoping', () => {
    it('allows business owners to access their own business verification data', () => {
      const ownerView = verificationService.getOwnerVerificationData(BIZ_ID, OWNER_ID);
      expect(ownerView).toBeDefined();
      expect(ownerView.businessId).toBe(BIZ_ID);
      expect(ownerView.verificationStatus).toBeDefined();

      // Internal admin audit notes and admin UID should not be exposed to owner
      expect((ownerView as any).verificationNotes).toBeUndefined();
      expect((ownerView as any).verifiedBy).toBeUndefined();
    });

    it('denies business owners access to OTHER businesses verification data', () => {
      expect(() => {
        verificationService.getOwnerVerificationData(BIZ_ID, OTHER_OWNER_ID);
      }).toThrow(/Access Denied/);
    });

    it('allows business owners to view their own verification history only', () => {
      const ownerHistory = verificationService.getVerificationHistory(BIZ_ID, OWNER_ID, 'BUSINESS_OWNER');
      expect(Array.isArray(ownerHistory)).toBe(true);

      // Attempting to view another salon history throws error
      expect(() => {
        verificationService.getVerificationHistory(BIZ_ID, OTHER_OWNER_ID, 'BUSINESS_OWNER');
      }).toThrow(/Access Denied/);
    });

    it('prohibits business owners from self-approving or self-verifying', async () => {
      await expect(
        verificationService.approveVerification(BIZ_ID, OWNER_ID, 'BUSINESS_OWNER')
      ).rejects.toThrow(/Only authorized admin users can approve/);
    });
  });

  describe('Super Admin Verification Control', () => {
    it('only authorized admin users can approve', async () => {
      const approved = await verificationService.approveVerification(
        BIZ_ID,
        ADMIN_ID,
        'SUPER_ADMIN',
        'Official certificate re-verified with state chamber of commerce'
      );

      expect(approved.verificationStatus).toBe('verified');
      expect(approved.verifiedBy).toBe(ADMIN_ID);
      expect(approved.verifiedAt).toBeDefined();
    });

    it('only authorized admin users can suspend', async () => {
      const suspended = await verificationService.suspendVerification(
        BIZ_ID,
        ADMIN_ID,
        'SUPER_ADMIN',
        'Customer safety audit pending following operational review'
      );

      expect(suspended.verificationStatus).toBe('suspended');
      expect(suspended.suspensionReason).toBe('Customer safety audit pending following operational review');
    });

    it('requires a reason when rejecting or suspending', async () => {
      await expect(
        verificationService.rejectVerification(BIZ_ID, ADMIN_ID, 'SUPER_ADMIN', '')
      ).rejects.toThrow(/rejection reason must be provided/);

      await expect(
        verificationService.suspendVerification(BIZ_ID, ADMIN_ID, 'SUPER_ADMIN', '   ')
      ).rejects.toThrow(/suspension reason must be provided/);
    });

    it('super admin can access full verification data including notes and history', () => {
      const adminView = verificationService.getAdminVerificationData(BIZ_ID, 'SUPER_ADMIN');
      expect(adminView).toBeDefined();
      expect(adminView.verificationStatus).toBeDefined();
      expect(adminView.history).toBeDefined();
      expect(Array.isArray(adminView.history)).toBe(true);
    });
  });
});
