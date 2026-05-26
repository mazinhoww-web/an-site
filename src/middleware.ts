import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthApiRoute = pathname.startsWith('/api/auth');
  const isLoginRoute = pathname === '/admin/login';

  if (isAuthApiRoute || isLoginRoute) {
    return NextResponse.next();
  }

  if (isAdminRoute && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
