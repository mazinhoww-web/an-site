import NextAuth from 'next-auth';
import Resend from 'next-auth/providers/resend';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM,
    }),
  ],
  pages: {
    signIn: '/admin/login',
    verifyRequest: '/admin/login?check=email',
    error: '/admin/login?error=',
  },
  callbacks: {
    async session({ session, user }) {
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') ?? [];
      session.user.isAdmin = adminEmails.includes(user.email);
      return session;
    },
  },
});
