import { issueSignedToken, presignUrl, getDownloadUrl } from '@vercel/blob';

const TEN_MINUTES_MS = 10 * 60 * 1000;

export async function getSignedDownloadUrl(blobUrl: string): Promise<string> {
  const pathname = new URL(blobUrl).pathname.replace(/^\//, '');

  const signedToken = await issueSignedToken({
    pathname,
    operations: ['get'],
    validUntil: Date.now() + TEN_MINUTES_MS,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const { presignedUrl } = await presignUrl(signedToken, {
    operation: 'get',
    pathname,
    access: 'private',
  });

  return getDownloadUrl(presignedUrl);
}
