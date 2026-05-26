import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isLoginRoute = pathname === '/admin/login';
  const isAuthApiRoute = pathname.startsWith('/api/auth');

  // Login page e auth APIs sempre passam
  if (isLoginRoute || isAuthApiRoute) {
    return NextResponse.next();
  }

  // Outras rotas /admin/* exigem sessão
  if (pathname.startsWith('/admin') && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
