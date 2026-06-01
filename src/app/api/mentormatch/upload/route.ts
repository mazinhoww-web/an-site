import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { fileTypeFromName } from '@/lib/mentormatch/format';
import { alert5xx } from '@/lib/mentormatch/observability';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXT = new Set([
  'pdf',
  'mp4',
  'mov',
  'webm',
  'mkv',
  'md',
  'txt',
  'doc',
  'docx',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'svg',
]);

// Uploads to Vercel Blob (public) and returns the URL + inferred fileType.
// Used by the library and tenant-logo flows.
export async function POST(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Arquivo ausente' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Arquivo excede 10MB' }, { status: 400 });
    }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: 'Tipo de arquivo nao permitido' }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const blob = await put(`mentormatch/${crypto.randomUUID()}-${safeName}`, file, {
      access: 'public',
    });
    return NextResponse.json({ url: blob.url, fileSize: file.size, fileType: fileTypeFromName(file.name) });
  } catch (error) {
    alert5xx('upload#POST', error, { userId: user.id });
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 });
  }
}
