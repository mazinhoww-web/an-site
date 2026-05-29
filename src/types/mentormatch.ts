// Types for the MentorMatch module. MentorMatch runs as a SEPARATE Auth.js
// instance (JWT + Credentials), so we keep its session shape standalone instead
// of re-declaring the global next-auth `Session.user` (which the site already
// augments with a required `isAdmin`). MM code reads these via explicit casts;
// authorization decisions always re-read the database (defect D-06).

export type MMRole = 'SUPER_ADMIN' | 'ADMIN' | 'MENTOR' | 'MENTEE';
export type MMUserStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type MMConnectionStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED';
export type MMFileType = 'PDF' | 'VIDEO' | 'ARTICLE' | 'OTHER';
export type MMNotificationType =
  | 'CONNECTION_REQUEST'
  | 'CONNECTION_ACCEPTED'
  | 'CONNECTION_REJECTED'
  | 'WAITLIST_PROMOTED'
  | 'NEW_MATERIAL'
  | 'ACCOUNT_APPROVED'
  | 'SYSTEM';

export interface MMSessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: MMRole | null;
  status?: MMUserStatus | null;
  tenantId?: string | null;
  tenantSlug?: string | null;
  onboardingDone?: boolean;
}

export interface MMSession {
  user: MMSessionUser;
  expires: string;
}

// MentorMatch JWT claims. The next-auth JWT type carries an `[key: string]:
// unknown` index signature, so module augmentation is unreliable; MM auth
// callbacks intersect the token with this shape instead.
export interface MMTokenClaims {
  mmRole?: MMRole | null;
  mmStatus?: MMUserStatus | null;
  mmTenantId?: string | null;
  mmTenantSlug?: string | null;
  mmOnboardingDone?: boolean;
}
