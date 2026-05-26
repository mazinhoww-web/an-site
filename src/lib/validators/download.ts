import { z } from 'zod';

export const downloadGateSchema = z.object({
  email: z.string().email('Email inválido'),
  skillSlug: z.string().min(1),
  consentLgpd: z.literal(true),
  consentNewsletter: z.boolean().optional().default(false),
});

export type DownloadGateData = z.infer<typeof downloadGateSchema>;
