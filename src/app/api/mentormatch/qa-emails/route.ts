import { NextResponse } from 'next/server';
import { clearCapturedEmails, getCapturedEmails } from '@/lib/mentormatch/email';

export const dynamic = 'force-dynamic';

// Endpoint SO de teste: expoe os emails capturados em memoria quando
// MM_EMAIL_CAPTURE=1. Em qualquer outro ambiente responde 404 (nao existe).
function enabled() {
  return process.env.MM_EMAIL_CAPTURE === '1';
}

export async function GET() {
  if (!enabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(getCapturedEmails());
}

export async function DELETE() {
  if (!enabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  clearCapturedEmails();
  return NextResponse.json({ ok: true });
}
