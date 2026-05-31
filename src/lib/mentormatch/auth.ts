import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { and, eq, isNull } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/db';
import { mmTenant, mmUser } from '@/lib/mentormatch/db/schema';
import type { MMRole, MMSessionUser, MMTokenClaims, MMUserStatus } from '@/types/mentormatch';

// ---------------------------------------------------------------------------
// MentorMatch authentication — a SEPARATE Auth.js v5 instance from the an-site
// admin auth. Uses JWT + Credentials (required: Credentials cannot run on the
// site's database-session strategy). Mounted under /api/mentormatch/auth with
// its own `mm.*` cookies so it never collides with the site session.
//
// Golden rule (D-06): authorization decisions re-read the database. The JWT
// only identifies the user (id/email); claims are hydrated from the DB at
// sign-in and on session update().
// ---------------------------------------------------------------------------

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  tenantSlug: z.string().optional(),
});

const isProd = process.env.NODE_ENV === 'production';

async function findMmUserForLogin(email: string, tenantSlug?: string) {
  if (tenantSlug) {
    const tenant = await db
      .select({ id: mmTenant.id })
      .from(mmTenant)
      .where(and(eq(mmTenant.slug, tenantSlug), eq(mmTenant.active, true)))
      .limit(1);
    // Unknown/inactive tenant in the cookie must not block login: fall back to
    // resolving by email alone instead of failing the sign-in.
    if (tenant[0]) {
      // Prefer the account already assigned to this tenant.
      const inTenant = await db
        .select()
        .from(mmUser)
        .where(and(eq(mmUser.email, email), eq(mmUser.tenantId, tenant[0].id)))
        .limit(1);
      if (inTenant[0]) return inTenant[0];
      // Fall back to a not-yet-assigned account (public registration mid-
      // onboarding). complete-profile claims it for this same tenant via the
      // mm-tenant cookie, so a tenantId IS NULL account belongs to this flow.
      const unassigned = await db
        .select()
        .from(mmUser)
        .where(and(eq(mmUser.email, email), isNull(mmUser.tenantId)))
        .limit(1);
      if (unassigned[0]) return unassigned[0];
      return null;
    }
  }
  // No tenant context (e.g. super admin): resolve by email alone.
  const rows = await db.select().from(mmUser).where(eq(mmUser.email, email)).limit(1);
  return rows[0] ?? null;
}

export const {
  handlers,
  auth: mmAuth,
  signIn: mmSignIn,
  signOut: mmSignOut,
} = NextAuth({
  basePath: '/api/mentormatch/auth',
  trustHost: true,
  secret: process.env.MM_AUTH_SECRET ?? process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/mentormatch/login',
    error: '/mentormatch/login',
  },
  cookies: {
    sessionToken: {
      name: 'mm.session-token',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: isProd },
    },
    callbackUrl: {
      name: 'mm.callback-url',
      options: { sameSite: 'lax', path: '/', secure: isProd },
    },
    csrfToken: {
      name: 'mm.csrf-token',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: isProd },
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        tenantSlug: {},
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password, tenantSlug } = parsed.data;

        const user = await findMmUserForLogin(email.toLowerCase(), tenantSlug);
        if (!user?.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        // Minimal identity; claims are hydrated from the DB in the jwt callback.
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Hydrate MM claims from the database at sign-in and on update() — never
      // trust a stale token for authorization (D-06).
      const claims = token as typeof token & MMTokenClaims;
      const userId = user?.id ?? token.sub;
      if ((user || trigger === 'update') && userId) {
        const rows = await db.select().from(mmUser).where(eq(mmUser.id, userId)).limit(1);
        const dbUser = rows[0];
        if (dbUser) {
          claims.mmRole = (dbUser.role as MMRole | null) ?? null;
          claims.mmStatus = (dbUser.status as MMUserStatus | null) ?? null;
          claims.mmTenantId = dbUser.tenantId ?? null;
          claims.mmOnboardingDone = dbUser.onboardingDone;
          claims.mmTenantSlug = null;
          if (dbUser.tenantId) {
            const t = await db
              .select()
              .from(mmTenant)
              .where(eq(mmTenant.id, dbUser.tenantId))
              .limit(1);
            claims.mmTenantSlug = t[0]?.slug ?? null;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      const claims = token as typeof token & MMTokenClaims;
      const u = session.user as unknown as MMSessionUser;
      u.id = token.sub ?? '';
      u.role = claims.mmRole ?? null;
      u.status = claims.mmStatus ?? null;
      u.tenantId = claims.mmTenantId ?? null;
      u.tenantSlug = claims.mmTenantSlug ?? null;
      u.onboardingDone = claims.mmOnboardingDone ?? false;
      return session;
    },
  },
});
