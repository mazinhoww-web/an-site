import { z } from 'zod';

export const newsletterSchema = z.object({
  subject: z.string().min(3, 'Assunto obrigatório'),
  contentMd: z.string().min(10, 'Conteúdo mínimo: 10 caracteres'),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
