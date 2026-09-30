# Nexora Verification Security Specification

## Data Invariants
1. A Business must always have an `ownerId` matching the creator's UID.
2. `verificationStatus` can only be transitioned by a Super Admin, except for 'pending' which is set by the owner on submission.
3. Once a status is 'verified', only a Super Admin can change it (to 'suspended').
4. Every change to `verificationStatus` MUST be accompanied by an atomic entry in `verification_history`.

## The "Dirty Dozen" Payloads (Deny List)
1. **Self-Verification**: Owner tries to set `verificationStatus` to 'verified'.
2. **Identity Spoofing**: Owner tries to create a business with someone else's `ownerId`.
3. **Role Escalation**: Regular user tries to create a profile with role 'SUPER_ADMIN'.
4. **History Bypass**: Admin updates status without creating a history document.
5. **Unauthorized Suspension**: Business Owner tries to suspend their own verification status.
6. **Ghost Rejection**: Admin rejects without providing a `rejectionReason`.
7. **Malicious ID**: Attacker tries to create a document with a 2MB string as ID.
8. **PII Leak**: Regular customer tries to read `verificationNotes` or `verifiedBy` (internal admin fields).
9. **Status Shortcutting**: Owner tries to move from 'rejected' directly to 'verified'.
10. **Shadow Profile Update**: User tries to change their `role` in their own profile.
11. **Orphaned History**: History record created for a non-existent business.
12. **Future Verification**: User tries to set `verifiedAt` to a future date.

## Authorization Matrix
| Resource | Customer | Business Owner | Super Admin |
| :--- | :--- | :--- | :--- |
| Business (Public) | Read (name, slug, city, status) | Read (All) | Read (All) |
| Business (Private Fields) | Denied | Read | Read |
| Verification History | Denied | Read (Own) | Read (All) |
| Profiles | Read (Basic) | Read (Own) | Read (All) |
