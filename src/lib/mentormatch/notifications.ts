import { db } from '@/db';
import { mmNotification } from '@/lib/mentormatch/db/schema';
import type { MMNotificationType } from '@/types/mentormatch';

// Transaction handle type (same object passed to db.transaction's callback).
export type MmTx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type CreateNotificationInput = {
  userId: string;
  tenantId: string;
  type: MMNotificationType;
  title: string;
  message: string;
  metadata?: unknown;
};

// Creates an in-app notification within the caller's transaction so it is
// atomic with the operation that triggered it (R10). In-app notifications are
// DB rows — unlike email, they are NOT best-effort here.
export async function createNotification(input: CreateNotificationInput, tx: MmTx) {
  await tx.insert(mmNotification).values({
    userId: input.userId,
    tenantId: input.tenantId,
    type: input.type,
    title: input.title,
    message: input.message,
    metadata: input.metadata ?? null,
  });
}
