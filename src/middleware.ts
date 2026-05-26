import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isLoginRoute = pathname === '/admin/login';
  const isAuthApiRoute = pathname.startsWith('/api/auth');

  if (isLoginRoute || isAuthApiRoute) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin') && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
