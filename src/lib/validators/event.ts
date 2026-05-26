import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug inválido'),
  eventType: z.enum(['summit', 'painel', 'meetup', 'conferencia', 'workshop', 'webinar', 'mesa-redonda', 'mentoria', 'demoday']),
  role: z.enum(['palestrante', 'painelista', 'jurado', 'mediador', 'mentor', 'host', 'convidado']),
  topic: z.string().min(3, 'Tema obrigatório'),
  descriptionShort: z.string().min(10, 'Descrição mínima: 10 caracteres'),
  descriptionMd: z.string().optional(),
  eventDate: z.string().min(1, 'Data obrigatória'),
  city: z.string().optional(),
  state: z.string().optional(),
  organizer: z.string().min(1, 'Organizador obrigatório'),
  audienceSize: z.number().int().optional(),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(true),
});

export type EventFormData = z.infer<typeof eventSchema>;
