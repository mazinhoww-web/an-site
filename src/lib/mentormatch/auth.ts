import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { eq } from 'drizzle-orm';
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

// Returns all accounts for an email, ordered so that the cookie tenant's account
// (if any) comes first. The mm-tenant cookie is only a tie-breaker for the
// multi-tenant-same-email case (D-05); it must NOT block login for accounts in
// other tenants, for the super admin, or for freshly registered users whose
// tenantId is still null.
async function candidatesForLogin(email: string, tenantSlug?: string) {
  const candidates = await db.select().from(mmUser).where(eq(mmUser.email, email));
  if (candidates.length <= 1 || !tenantSlug) return candidates;

  const tenant = await db
    .select({ id: mmTenant.id })
    .from(mmTenant)
    .where(eq(mmTenant.slug, tenantSlug))
    .limit(1);
  const tid = tenant[0]?.id;
  if (!tid) return candidates;

  const inTenant = candidates.filter((c) => c.tenantId === tid);
  const others = candidates.filter((c) => c.tenantId !== tid);
  return [...inTenant, ...others];
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
        const { password, tenantSlug } = parsed.data;
        const email = parsed.data.email.toLowerCase();

        const candidates = await candidatesForLogin(email, tenantSlug);
        // Pick the first account (cookie tenant preferred) whose password matches.
        for (const user of candidates) {
          if (user.password && (await bcrypt.compare(password, user.password))) {
            // Minimal identity; claims are hydrated from the DB in the jwt callback.
            return { id: user.id, email: user.email, name: user.name, image: user.image };
          }
        }
        return null;
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
