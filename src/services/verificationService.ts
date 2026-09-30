// Nexora SalonOS — Verification Engine & Audit Service
// Enforces verification data model, security boundary (RLS logic), and history auditing.

import { supabase } from '../lib/supabase';
import { SEEDED_PUBLIC_BUSINESSES } from '../data/seededPublicBusinesses';
import { 
  Business, 
  VerificationStatus, 
  BusinessVerificationHistory, 
  PublicVerificationState, 
  OwnerVerificationView, 
  AdminVerificationView 
} from '../types';

// In-memory audit history store seeded with historical compliance actions
const INITIAL_HISTORY: BusinessVerificationHistory[] = [
  {
    id: 'hist-rc-001',
    businessId: 'biz-barber-01', // The Royal Crown Barber
    previousStatus: null,
    newStatus: 'pending',
    reason: 'Initial business registration submitted',
    notes: 'Awaiting tax documentation and photo ID verification',
    changedBy: 'usr-1',
    createdAt: '2026-08-15T10:00:00.000Z'
  },
  {
    id: 'hist-rc-002',
    businessId: 'biz-barber-01',
    previousStatus: 'pending',
    newStatus: 'under_review',
    reason: 'Owner submitted identity and commercial license documents',
    notes: 'Submitted GSTIN 27AAACN0123A1Z5 and salon premise lease agreement',
    changedBy: 'usr-1',
    createdAt: '2026-08-16T14:30:00.000Z'
  },
  {
    id: 'hist-rc-003',
    businessId: 'biz-barber-01',
    previousStatus: 'under_review',
    newStatus: 'verified',
    reason: 'All documentation verified against national business register',
    notes: 'Tier-1 enterprise certification granted. Zero compliance violations.',
    changedBy: 'user-sa-001', // Super Admin
    createdAt: '2026-08-18T09:15:00.000Z'
  },
  {
    id: 'hist-spa-001',
    businessId: 'biz-spa-02', // Zenith Spa
    previousStatus: 'pending',
    newStatus: 'under_review',
    reason: 'Renewal submission',
    notes: 'Documents pending secondary physical address verification check',
    changedBy: 'usr-3',
    createdAt: '2026-09-01T11:20:00.000Z'
  },
  {
    id: 'hist-nail-001',
    businessId: 'biz-nail-03', // Gloss & Chic
    previousStatus: null,
    newStatus: 'verified',
    reason: 'Registration authenticated with Delhi commercial trade registry',
    notes: 'Approved under fast-track trust tier',
    changedBy: 'user-sa-001',
    createdAt: '2026-09-10T08:00:00.000Z'
  }
];

class VerificationService {
  private businesses: Map<string, Business> = new Map();
  private history: BusinessVerificationHistory[] = [...INITIAL_HISTORY];

  constructor() {
    // Populate store from seeded records with all preferred logical verification fields initialized
    Object.values(SEEDED_PUBLIC_BUSINESSES).forEach(biz => {
      this.businesses.set(biz.id, {
        ...biz,
        verificationStatus: biz.verificationStatus || 'pending',
        verificationSubmittedAt: biz.verificationSubmittedAt ?? null,
        verifiedAt: biz.verifiedAt ?? null,
        verifiedBy: biz.verifiedBy ?? null,
        rejectionReason: biz.rejectionReason ?? null,
        suspensionReason: biz.suspensionReason ?? null,
        verificationNotes: biz.verificationNotes ?? null
      });
    });
  }

  /**
   * Helper to lookup business by ID or slug
   */
  public getBusiness(idOrSlug: string): Business | undefined {
    for (const biz of this.businesses.values()) {
      if (biz.id === idOrSlug || biz.slug === idOrSlug) {
        return { ...biz };
      }
    }
    return undefined;
  }

  /**
   * Get all businesses (admin view)
   */
  public getAllBusinesses(): Business[] {
    return Array.from(this.businesses.values());
  }

  /**
   * CUSTOMER FACING: Public verification state.
   * Customers should ONLY see public verification state. Sensitive fields are strictly stripped.
   */
  public getPublicVerificationState(businessIdOrSlug: string): PublicVerificationState | null {
    const business = this.getBusiness(businessIdOrSlug);
    if (!business) return null;

    return {
      businessId: business.id,
      verificationStatus: business.verificationStatus,
      verifiedAt: business.verificationStatus === 'verified' ? business.verifiedAt || business.updatedAt : null,
      isVerified: business.verificationStatus === 'verified'
    };
  }

  /**
   * BUSINESS OWNER FACING: Access verification details for own business.
   * Business owners should only access their own business verification data.
   * Internal admin notes (verificationNotes) and admin UID (verifiedBy) are redacted.
   */
  public getOwnerVerificationData(businessIdOrSlug: string, requestingOwnerId: string): OwnerVerificationView {
    const business = this.getBusiness(businessIdOrSlug);
    if (!business) {
      throw new Error(`Business not found: ${businessIdOrSlug}`);
    }

    if (business.ownerId !== requestingOwnerId) {
      throw new Error('Access Denied: Business owners should only access their own business verification data.');
    }

    return {
      businessId: business.id,
      verificationStatus: business.verificationStatus,
      verificationSubmittedAt: business.verificationSubmittedAt,
      verifiedAt: business.verifiedAt,
      rejectionReason: business.rejectionReason,
      suspensionReason: business.suspensionReason
    };
  }

  /**
   * SUPER ADMIN FACING: Access full verification details including history and internal notes.
   * Only authorized admin users can view complete internal compliance data.
   */
  public getAdminVerificationData(businessIdOrSlug: string, userRole: string): AdminVerificationView {
    if (userRole !== 'SUPER_ADMIN') {
      throw new Error('Access Denied: Only authorized admin users can access full compliance data.');
    }

    const business = this.getBusiness(businessIdOrSlug);
    if (!business) {
      throw new Error(`Business not found: ${businessIdOrSlug}`);
    }

    const history = this.history.filter(h => h.businessId === business.id);

    return {
      businessId: business.id,
      verificationStatus: business.verificationStatus,
      verificationSubmittedAt: business.verificationSubmittedAt,
      verifiedAt: business.verifiedAt,
      verifiedBy: business.verifiedBy,
      rejectionReason: business.rejectionReason,
      suspensionReason: business.suspensionReason,
      verificationNotes: business.verificationNotes,
      history
    };
  }

  /**
   * VERIFICATION AUDIT LOG (business_verification_history)
   * Enforces multi-role RLS / authorization rules:
   * - Customers: Denied
   * - Business Owners: Can ONLY access their own business verification history
   * - Super Admins: Can access history for any business
   */
  public getVerificationHistory(
    businessIdOrSlug: string, 
    userId: string, 
    userRole: string
  ): BusinessVerificationHistory[] {
    const business = this.getBusiness(businessIdOrSlug);
    if (!business) {
      throw new Error(`Business not found: ${businessIdOrSlug}`);
    }

    // Customer check
    if (userRole === 'CUSTOMER' || !userRole) {
      throw new Error('Access Denied: Customers cannot access verification audit logs.');
    }

    // Owner check: can only view own business history
    if (userRole === 'BUSINESS_OWNER' && business.ownerId !== userId) {
      throw new Error('Access Denied: Business owners should only access their own business verification data.');
    }

    // Filter audit logs for the business
    return this.history
      .filter(h => h.businessId === business.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * ACTION: Business Owner submits documents for verification
   * Transitions status to 'under_review' and records submission in business_verification_history.
   */
  public async submitForReview(
    businessIdOrSlug: string, 
    ownerId: string, 
    notes?: string
  ): Promise<Business> {
    const business = this.getBusiness(businessIdOrSlug);
    if (!business) throw new Error('Business not found');

    if (business.ownerId !== ownerId) {
      throw new Error('Access Denied: Only the business owner can submit verification for this entity.');
    }

    if (business.verificationStatus === 'verified') {
      throw new Error('Business is already verified.');
    }

    const previousStatus = business.verificationStatus;
    const newStatus: VerificationStatus = 'under_review';
    const now = new Date().toISOString();

    business.verificationStatus = newStatus;
    business.verificationSubmittedAt = now;
    business.updatedAt = now;
    if (notes) {
      business.verificationNotes = notes;
    }

    this.businesses.set(business.id, { ...business });

    // Append to dedicated audit table: business_verification_history
    const historyEntry: BusinessVerificationHistory = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      businessId: business.id,
      previousStatus,
      newStatus,
      reason: 'Owner submitted identity and commercial registration materials',
      notes: notes || 'Submission entered compliance queue',
      changedBy: ownerId,
      createdAt: now
    };
    this.history.push(historyEntry);

    // Sync with Supabase if online
    try {
      await supabase
        .from('businesses')
        .update({
          verification_status: newStatus,
          verification_submitted_at: now
        })
        .eq('id', business.id);

      await supabase
        .from('business_verification_history')
        .insert({
          business_id: business.id,
          previous_status: previousStatus,
          new_status: newStatus,
          reason: historyEntry.reason,
          notes: historyEntry.notes,
          changed_by: ownerId,
          created_at: now
        });
    } catch {
      // Offline fallback
    }

    return { ...business };
  }

  /**
   * ACTION: Super Admin Approves Business
   * Only authorized admin users can approve.
   */
  public async approveVerification(
    businessIdOrSlug: string, 
    adminId: string, 
    adminRole: string, 
    notes?: string
  ): Promise<Business> {
    if (adminRole !== 'SUPER_ADMIN') {
      throw new Error('Access Denied: Only authorized admin users can approve verification.');
    }

    const business = this.getBusiness(businessIdOrSlug);
    if (!business) throw new Error('Business not found');

    const previousStatus = business.verificationStatus;
    const newStatus: VerificationStatus = 'verified';
    const now = new Date().toISOString();

    business.verificationStatus = newStatus;
    business.verifiedAt = now;
    business.verifiedBy = adminId;
    business.rejectionReason = null;
    business.suspensionReason = null;
    business.verificationNotes = notes || 'Compliance verified against regulatory registry';
    business.updatedAt = now;

    this.businesses.set(business.id, { ...business });

    // Record in business_verification_history
    const historyEntry: BusinessVerificationHistory = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      businessId: business.id,
      previousStatus,
      newStatus,
      reason: 'Entity authentication and compliance requirements met',
      notes: business.verificationNotes,
      changedBy: adminId,
      createdAt: now
    };
    this.history.push(historyEntry);

    // Sync with Supabase if online
    try {
      await supabase
        .from('businesses')
        .update({
          verification_status: newStatus,
          verified_at: now,
          verified_by: adminId,
          verification_notes: business.verificationNotes
        })
        .eq('id', business.id);

      await supabase
        .from('business_verification_history')
        .insert({
          business_id: business.id,
          previous_status: previousStatus,
          new_status: newStatus,
          reason: historyEntry.reason,
          notes: historyEntry.notes,
          changed_by: adminId,
          created_at: now
        });
    } catch {
      // Offline fallback
    }

    return { ...business };
  }

  /**
   * ACTION: Super Admin Rejects Business
   * Only authorized admin users can reject. Rejection reason is required.
   */
  public async rejectVerification(
    businessIdOrSlug: string, 
    adminId: string, 
    adminRole: string, 
    reason: string, 
    notes?: string
  ): Promise<Business> {
    if (adminRole !== 'SUPER_ADMIN') {
      throw new Error('Access Denied: Only authorized admin users can reject verification.');
    }

    if (!reason || !reason.trim()) {
      throw new Error('Validation Error: A rejection reason must be provided.');
    }

    const business = this.getBusiness(businessIdOrSlug);
    if (!business) throw new Error('Business not found');

    const previousStatus = business.verificationStatus;
    const newStatus: VerificationStatus = 'rejected';
    const now = new Date().toISOString();

    business.verificationStatus = newStatus;
    business.rejectionReason = reason;
    business.verificationNotes = notes || reason;
    business.updatedAt = now;

    this.businesses.set(business.id, { ...business });

    // Record in business_verification_history
    const historyEntry: BusinessVerificationHistory = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      businessId: business.id,
      previousStatus,
      newStatus,
      reason: reason,
      notes: business.verificationNotes,
      changedBy: adminId,
      createdAt: now
    };
    this.history.push(historyEntry);

    // Sync with Supabase if online
    try {
      await supabase
        .from('businesses')
        .update({
          verification_status: newStatus,
          rejection_reason: reason,
          verification_notes: business.verificationNotes
        })
        .eq('id', business.id);

      await supabase
        .from('business_verification_history')
        .insert({
          business_id: business.id,
          previous_status: previousStatus,
          new_status: newStatus,
          reason: reason,
          notes: business.verificationNotes,
          changed_by: adminId,
          created_at: now
        });
    } catch {
      // Offline fallback
    }

    return { ...business };
  }

  /**
   * ACTION: Super Admin Suspends Business
   * Only authorized admin users can suspend. Suspension reason is required.
   */
  public async suspendVerification(
    businessIdOrSlug: string, 
    adminId: string, 
    adminRole: string, 
    reason: string, 
    notes?: string
  ): Promise<Business> {
    if (adminRole !== 'SUPER_ADMIN') {
      throw new Error('Access Denied: Only authorized admin users can suspend verification.');
    }

    if (!reason || !reason.trim()) {
      throw new Error('Validation Error: A suspension reason must be provided.');
    }

    const business = this.getBusiness(businessIdOrSlug);
    if (!business) throw new Error('Business not found');

    const previousStatus = business.verificationStatus;
    const newStatus: VerificationStatus = 'suspended';
    const now = new Date().toISOString();

    business.verificationStatus = newStatus;
    business.suspensionReason = reason;
    business.verificationNotes = notes || reason;
    business.updatedAt = now;

    this.businesses.set(business.id, { ...business });

    // Record in business_verification_history
    const historyEntry: BusinessVerificationHistory = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      businessId: business.id,
      previousStatus,
      newStatus,
      reason: reason,
      notes: business.verificationNotes,
      changedBy: adminId,
      createdAt: now
    };
    this.history.push(historyEntry);

    // Sync with Supabase if online
    try {
      await supabase
        .from('businesses')
        .update({
          verification_status: newStatus,
          suspension_reason: reason,
          verification_notes: business.verificationNotes
        })
        .eq('id', business.id);

      await supabase
        .from('business_verification_history')
        .insert({
          business_id: business.id,
          previous_status: previousStatus,
          new_status: newStatus,
          reason: reason,
          notes: business.verificationNotes,
          changed_by: adminId,
          created_at: now
        });
    } catch {
      // Offline fallback
    }

    return { ...business };
  }
}

export const verificationService = new VerificationService();
