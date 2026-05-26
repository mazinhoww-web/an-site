import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug: apenas letras minúsculas, números e hífens'),
  description: z.string().min(10, 'Descrição mínima: 10 caracteres'),
  content: z.string().min(1, 'Conteúdo obrigatório'),
  category: z.string().min(1, 'Categoria obrigatória'),
  version: z.string().optional().default('1.0.0'),
  published: z.boolean().optional().default(true),
});

export type SkillFormData = z.infer<typeof skillSchema>;
