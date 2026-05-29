import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmTenant } from '@/lib/mentormatch/db/schema';
import { canAdminTenant, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { mmSettingsPatchSchema } from '@/lib/mentormatch/validators';

export const dynamic = 'force-dynamic';

// GET ?slug — tenant settings (ADMIN of that tenant / SUPER).
export async function GET(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  const slug = new URL(req.url).searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug obrigatorio' }, { status: 400 });

  const rows = await db.select().from(mmTenant).where(eq(mmTenant.slug, slug)).limit(1);
  const tenant = rows[0];
  if (!tenant) return NextResponse.json({ error: 'Tenant nao encontrado' }, { status: 404 });
  if (!canAdminTenant(user, tenant.id)) return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });

  return NextResponse.json({
    name: tenant.name,
    slug: tenant.slug,
    brandColor: tenant.brandColor,
    secondaryColor: tenant.secondaryColor,
    logoUrl: tenant.logoUrl,
    themeKey: tenant.themeKey,
    maxMenteesPerMentor: tenant.maxMenteesPerMentor,
  });
}

// PATCH — update tenant settings; persists maxMenteesPerMentor (D-08).
export async function PATCH(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = mmSettingsPatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
  const data = parsed.data;

  try {
    const rows = await db.select().from(mmTenant).where(eq(mmTenant.slug, data.slug)).limit(1);
    const tenant = rows[0];
    if (!tenant) return NextResponse.json({ error: 'Tenant nao encontrado' }, { status: 404 });
    if (!canAdminTenant(user, tenant.id)) return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });

    const updated = await db
      .update(mmTenant)
      .set({
        name: data.name ?? tenant.name,
        brandColor: data.brandColor ?? tenant.brandColor,
        secondaryColor: data.secondaryColor ?? tenant.secondaryColor,
        logoUrl: data.logoUrl === '' ? null : data.logoUrl ?? tenant.logoUrl,
        themeKey: data.themeKey ?? tenant.themeKey,
        maxMenteesPerMentor: data.maxMenteesPerMentor ?? tenant.maxMenteesPerMentor,
        updatedAt: new Date(),
      })
      .where(eq(mmTenant.id, tenant.id))
      .returning();
    const t = updated[0]!;
    return NextResponse.json({
      name: t.name,
      slug: t.slug,
      brandColor: t.brandColor,
      secondaryColor: t.secondaryColor,
      logoUrl: t.logoUrl,
      themeKey: t.themeKey,
      maxMenteesPerMentor: t.maxMenteesPerMentor,
    });
  } catch (error) {
    console.error('[MM_API_ERROR]', { endpoint: 'admin/settings#PATCH', userId: user.id, error });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
