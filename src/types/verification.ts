// Nexora SalonOS — Verification Data Model Contracts
// Standardized types for Verification Engine, Audit History, and RLS / Multi-Role Access Control

export type VerificationStatus = 
  | 'pending'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'suspended';

/**
 * Preferred logical fields for verification data structure
 */
export interface BusinessVerificationFields {
  verification_status: VerificationStatus;
  verification_submitted_at?: string | null;
  verified_at?: string | null;
  verified_by?: string | null;
  rejection_reason?: string | null;
  suspension_reason?: string | null;
  verification_notes?: string | null;
}

/**
 * CamelCase application representation of the verification fields
 */
export interface BusinessVerificationDomainFields {
  verificationStatus: VerificationStatus;
  verificationSubmittedAt?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  rejectionReason?: string | null;
  suspensionReason?: string | null;
  verificationNotes?: string | null;
}

/**
 * Dedicated History/Audit Table: business_verification_history
 * Captures status changes rather than overwriting historical information.
 */
export interface BusinessVerificationHistory {
  id: string;
  businessId: string;
  previousStatus: VerificationStatus | null;
  newStatus: VerificationStatus;
  reason?: string | null;
  notes?: string | null;
  changedBy: string;
  createdAt: string;
}

/**
 * Raw Database row schema for business_verification_history (PostgreSQL convention)
 */
export interface DbBusinessVerificationHistory {
  id: string;
  business_id: string;
  previous_status: VerificationStatus | null;
  new_status: VerificationStatus;
  reason?: string | null;
  notes?: string | null;
  changed_by: string;
  created_at: string;
}

/**
 * Public Verification State
 * Customers should ONLY see public verification state. Sensitive fields are strictly excluded.
 */
export interface PublicVerificationState {
  businessId: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string | null;
  isVerified: boolean;
}

/**
 * Business Owner Verification Access View
 * Business owners should only access their own business verification data.
 */
export interface OwnerVerificationView {
  businessId: string;
  verificationStatus: VerificationStatus;
  verificationSubmittedAt?: string | null;
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  suspensionReason?: string | null;
  // Notice: verificationNotes (internal admin audit notes) and verifiedBy (admin UID) are omitted/redacted for owners
}

/**
 * Super Admin Full Verification View
 * Only authorized admin users can view complete internal compliance data and approve/reject/suspend.
 */
export interface AdminVerificationView {
  businessId: string;
  verificationStatus: VerificationStatus;
  verificationSubmittedAt?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  rejectionReason?: string | null;
  suspensionReason?: string | null;
  verificationNotes?: string | null;
  history: BusinessVerificationHistory[];
}
