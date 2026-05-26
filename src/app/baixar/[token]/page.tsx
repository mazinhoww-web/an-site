import { db } from '@/db';
import { downloads, subscribers, skills } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Hairline } from '@/components/brand/Hairline';

export const dynamic = 'force-dynamic';

type Props = { params: { token: string } };

export default async function DownloadPage({ params }: Props) {
  const { token } = params;

  const records = await db
    .select({
      id: downloads.id,
      skillId: downloads.skillId,
      subscriberId: downloads.subscriberId,
      expiresAt: downloads.expiresAt,
      usedAt: downloads.usedAt,
      assetBlobKey: skills.assetBlobKey,
      assetFilename: skills.assetFilename,
      skillName: skills.name,
      subscriberEmail: subscribers.email,
    })
    .from(downloads)
    .innerJoin(skills, eq(downloads.skillId, skills.id))
    .innerJoin(subscribers, eq(downloads.subscriberId, subscribers.id))
    .where(eq(downloads.token, token))
    .limit(1);

  const record = records[0];
  if (!record) notFound();

  if (record.usedAt) {
    return <InvalidLink reason="used" />;
  }
  if (record.expiresAt && record.expiresAt < new Date()) {
    return <InvalidLink reason="expired" />;
  }
  if (!record.assetBlobKey) {
    return <InvalidLink reason="no-asset" />;
  }

  await db
    .update(downloads)
    .set({ usedAt: new Date() })
    .where(eq(downloads.id, record.id));

  if (record.subscriberId) {
    await db
      .update(subscribers)
      .set({ confirmed: true })
      .where(and(eq(subscribers.id, record.subscriberId), eq(subscribers.confirmed, false)));
  }

  const cookieStore = await cookies();
  cookieStore.set('consent_lgpd_email', record.subscriberEmail, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });

  const blobBaseUrl = process.env.BLOB_PUBLIC_URL ?? `https://${process.env.VERCEL_BLOB_STORE_ID ?? 'blob'}.public.blob.vercel-storage.com`;
  const blobUrl = `${blobBaseUrl}/${record.assetBlobKey}`;

  redirect(blobUrl);
}

function InvalidLink({ reason }: { reason: 'expired' | 'used' | 'no-asset' }) {
  const messages = {
    expired: 'Este link expirou. Peça um novo na página da skill.',
    used: 'Este link já foi usado. Cada link só funciona uma vez.',
    'no-asset': 'Asset não disponível para esta skill.',
  };

  return (
    <main className="mx-auto max-w-container px-6 py-24 md:px-12 lg:px-16">
      <h1 className="font-heading text-h2">Link inválido</h1>
      <p className="mt-4 text-body text-graphite">{messages[reason]}</p>
      <Hairline className="my-8" />
      <Link
        href="/skills"
        className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
      >
        VER SKILLS
      </Link>
    </main>
  );
}
