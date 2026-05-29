import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MM_TENANT_COOKIE } from '@/lib/mentormatch/tenant';

export const dynamic = 'force-dynamic';

// Clears the mm-tenant cookie (leave a tenant/branding). The public root landing
// (Fase 13) will call this; exposed now per the Fase 10 spec.
export async function POST() {
  const jar = await cookies();
  jar.set(MM_TENANT_COOKIE, '', { path: '/', maxAge: 0 });
  return NextResponse.json({ ok: true });
}
