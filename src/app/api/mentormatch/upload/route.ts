import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { fileTypeFromName } from '@/lib/mentormatch/format';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
// Hardening: `svg` removido da allow-list (vetor de XSS — SVG pode carregar
// script). Demais formatos de documento/imagem/video mantidos.
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
]);

// Uploads to Vercel Blob (public) and returns the URL + inferred fileType.
// Used by the library and tenant-logo flows (e avatar no onboarding).
export async function POST(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  // Hardening: limita uploads por usuario (anti-abuso do blob publico).
  try {
    await rateLimit(`mm-upload:${user.id}`, 30, 3600);
  } catch {
    return NextResponse.json({ error: 'Muitos uploads. Tente novamente mais tarde.' }, { status: 429 });
  }

  // Parsing do multipart isolado: requisicao malformada -> 400 (nao 500).
  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: 'Requisicao invalida (esperado multipart/form-data)' }, { status: 400 });
  }

  try {
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
    console.error('[MM_API_ERROR]', { endpoint: 'upload#POST', userId: user.id, error });
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 });
  }
}
