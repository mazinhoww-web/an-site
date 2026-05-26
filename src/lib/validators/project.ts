import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(2, 'Título obrigatório'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug: apenas letras minúsculas, números e hífens'),
  summary: z.string().min(10, 'Resumo mínimo: 10 caracteres'),
  contentMd: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  year: z.number().int().min(2014).max(2030).optional(),
  externalUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(false),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
