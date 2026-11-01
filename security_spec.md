# Security Specification for PAISAROAM

## 1. Data Invariants
- Admin operations (creating/editing/deleting destinations, guides, homepage content, announcements, packages, and viewing feedback) are strictly restricted to authenticated and verified admin users (`sangeethk467@gmail.com` or documents in `/admins/{adminId}`).
- Normal visitors have read-only access to published public content (destinations, packages, guides, homepage content, announcements).
- Normal visitors can submit feedback/queries with validated string lengths (no XSS or resource exhaustion).
- Feedback submissions cannot be modified by anonymous or non-admin visitors.
- Trip plans created by users are bound to their user ID or created anonymously with validation limits.
- Timestamps and string size limits must be enforced on every mutation.

## 2. The Dirty Dozen Payloads (Denied by Security Rules)
1. **Unauthenticated Destination Delete**: Anonymous DELETE on `/destinations/jaipur` -> PERMISSION_DENIED
2. **Unverified Admin Update**: Update on `/homepageContent/settings` with `email_verified: false` -> PERMISSION_DENIED
3. **Ghost Field Injection**: Adding unwhitelisted field `isSuperAdmin: true` to `/destinations/delhi` -> PERMISSION_DENIED
4. **Oversized Field Denial of Wallet**: Inserting a 2MB base64 string into `description` field -> PERMISSION_DENIED
5. **Unauthorized Feedback Read**: Non-admin querying list of all customer feedback submissions -> PERMISSION_DENIED
6. **Fake Admin Provisioning**: Normal authenticated user writing themselves into `/admins/newAdmin` -> PERMISSION_DENIED
7. **Package Price Tampering**: Regular visitor attempting to discount trip package price to 0 -> PERMISSION_DENIED
8. **Malicious Announcement Post**: Non-admin creating scam banner on `/announcements/1` -> PERMISSION_DENIED
9. **Feedback Status Modification**: Visitor updating feedback status to "resolved" -> PERMISSION_DENIED
10. **ID Poisoning Attack**: Writing to destination with invalid special characters or oversized document ID -> PERMISSION_DENIED
11. **Negative Budget Injection**: Saving a destination with negative budget value -> PERMISSION_DENIED
12. **Blind Role Spoofing**: Attempting write claiming custom token claims without database/email verification -> PERMISSION_DENIED
