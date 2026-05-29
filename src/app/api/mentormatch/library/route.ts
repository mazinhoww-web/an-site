import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmLibraryItem } from '@/lib/mentormatch/db/schema';
import { canAdminTenant, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { fileTypeFromName } from '@/lib/mentormatch/format';
import { mmLibraryCreateSchema } from '@/lib/mentormatch/validators';

export const dynamic = 'force-dynamic';

// GET ?tenantId — library items of a tenant.
export async function GET(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  const tenantId = new URL(req.url).searchParams.get('tenantId');
  if (!tenantId) return NextResponse.json({ error: 'tenantId obrigatorio' }, { status: 400 });
  if (user.role !== 'SUPER_ADMIN' && user.tenantId !== tenantId) {
    return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
  }
  const rows = await db
    .select()
    .from(mmLibraryItem)
    .where(eq(mmLibraryItem.tenantId, tenantId))
    .orderBy(desc(mmLibraryItem.createdAt));
  return NextResponse.json(rows);
}

// POST ?tenantId — create a library item (ADMIN or MENTOR — R16).
export async function POST(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  const tenantId = new URL(req.url).searchParams.get('tenantId');
  if (!tenantId) return NextResponse.json({ error: 'tenantId obrigatorio' }, { status: 400 });

  const isAdmin = canAdminTenant(user, tenantId);
  const isMentorOfTenant = user.role === 'MENTOR' && user.tenantId === tenantId;
  if (!isAdmin && !isMentorOfTenant) {
    return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = mmLibraryCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });

  try {
    const fileType = parsed.data.fileType ?? fileTypeFromName(parsed.data.fileUrl);
    const inserted = await db
      .insert(mmLibraryItem)
      .values({
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        fileUrl: parsed.data.fileUrl,
        fileType,
        fileSize: parsed.data.fileSize ?? null,
        tenantId,
        uploadedById: user.id,
      })
      .returning();
    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error('[MM_API_ERROR]', { endpoint: 'library#POST', userId: user.id, error });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// DELETE ?id — remove a library item (ADMIN — D-03). Best-effort blob delete.
export async function DELETE(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id obrigatorio' }, { status: 400 });

  try {
    const rows = await db.select().from(mmLibraryItem).where(eq(mmLibraryItem.id, id)).limit(1);
    const item = rows[0];
    if (!item) return NextResponse.json({ error: 'Nao encontrado' }, { status: 404 });
    if (!canAdminTenant(user, item.tenantId)) {
      return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
    }
    await db.delete(mmLibraryItem).where(eq(mmLibraryItem.id, id));
    try {
      await del(item.fileUrl);
    } catch {
      // best-effort; the DB row is gone regardless
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[MM_API_ERROR]', { endpoint: 'library#DELETE', userId: user.id, error });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
