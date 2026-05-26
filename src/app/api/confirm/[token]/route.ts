import { db } from '@/db';
import { subscribers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { token: string } },
) {
  const { token } = params;

  const rows = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.confirmationToken, token))
    .limit(1);

  if (rows[0]) {
    await db
      .update(subscribers)
      .set({ confirmed: true })
      .where(eq(subscribers.id, rows[0].id));
  }

  redirect('/?confirmed=1');
}
