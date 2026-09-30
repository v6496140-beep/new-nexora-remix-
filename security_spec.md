# Nexora Verification Security Specification

## Verification Data Model
Preferred logical fields on business entities:
- `verification_status`: (`pending` | `under_review` | `verified` | `rejected` | `suspended`) — Public verification state visible to customers.
- `verification_submitted_at`: Timestamp when the business owner submitted verification materials.
- `verified_at`: Timestamp when the business was authenticated and granted verified status.
- `verified_by`: Reference to the Super Admin profile who authorized verification. (Sensitive / Internal)
- `rejection_reason`: Reason provided by admin upon rejection. (Private to Owner & Admin)
- `suspension_reason`: Reason provided by admin upon suspension. (Private to Owner & Admin)
- `verification_notes`: Internal compliance audit notes. (Restricted to Super Admin)

## Audit Log Structure: `business_verification_history`
To preserve historical records without overwriting past compliance data:
- `id`: UUID (Primary Key)
- `business_id`: UUID (Foreign Key to businesses)
- `previous_status`: Status prior to transition (`pending`, `under_review`, `verified`, `rejected`, `suspended`, or `null` for initial creation)
- `new_status`: Status after transition
- `reason`: Explanation for status change (mandatory for `rejected` and `suspended`)
- `notes`: Internal auditor observations or notes
- `changed_by`: UUID of the profile who initiated the change
- `created_at`: Immutable timestamp of the transition event

## Data Invariants & Authorization Constraints
1. **Public Information Boundary**: Do not store sensitive verification information in public fields. Customers can ONLY see public verification state (`verification_status`, `verified_at`).
2. **Access Control**: Business owners can only access their own business verification data.
3. **Admin Privilege**: Only authorized admin users (`SUPER_ADMIN`) can approve, reject, or suspend a business.
4. **Self-Verification Guard**: Business owners cannot transition a business directly to `verified`, `rejected`, or `suspended`.
5. **Audit Trail**: Every modification to `verification_status` must generate an immutable entry in `business_verification_history`.
6. **Reason Mandate**: Rejection or suspension requires a non-empty `reason`.

## The "Dirty Dozen" Payloads (Deny List)
1. **Self-Verification**: Owner tries to set `verification_status` to 'verified'.
2. **Identity Spoofing**: Owner tries to create a business with someone else's `owner_id`.
3. **Role Escalation**: Regular user tries to create a profile with role 'SUPER_ADMIN'.
4. **History Bypass**: Admin updates status without creating a history document.
5. **Unauthorized Suspension**: Business Owner tries to suspend their own verification status.
6. **Ghost Rejection**: Admin rejects without providing a `rejection_reason`.
7. **Malicious ID**: Attacker tries to create a document with a 2MB string as ID.
8. **PII Leak**: Regular customer tries to read `verification_notes` or `verified_by` (internal admin fields).
9. **Status Shortcutting**: Owner tries to move from 'rejected' directly to 'verified'.
10. **Shadow Profile Update**: User tries to change their `role` in their own profile.
11. **Orphaned History**: History record created for a non-existent business.
12. **Future Verification**: User tries to set `verified_at` to a future date.

## Authorization Matrix
| Resource | Customer | Business Owner | Super Admin |
| :--- | :--- | :--- | :--- |
| Business (Public Fields & Verification Status) | Read (`name`, `slug`, `city`, `verification_status`) | Read (All) | Read (All) |
| Sensitive Verification Fields (`verification_notes`, `rejection_reason`, `suspension_reason`, `verified_by`) | **Denied** | Read (Own business only; notes redacted) | Read (All) |
| Business Verification History (`business_verification_history`) | **Denied** | Read (Own business only) | Read & Write (All) |
| Verification Decision (Approve / Reject / Suspend) | **Denied** | **Denied** | **Allowed** |
| Verification Submission (Submit for Review) | **Denied** | **Allowed** (Own business) | **Allowed** |
| User Profiles | Read (Public/Basic) | Read (Own) | Read (All) |
