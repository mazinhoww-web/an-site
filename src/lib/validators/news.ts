import { z } from 'zod';

export const newsSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug: apenas letras minúsculas, números e hífens'),
  excerpt: z.string().min(10, 'Resumo mínimo: 10 caracteres').max(180, 'Resumo máximo: 180 caracteres'),
  contentMd: z.string().min(1, 'Conteúdo obrigatório'),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  imageUrl: z.string().optional(),
});

export type NewsFormData = z.infer<typeof newsSchema>;
