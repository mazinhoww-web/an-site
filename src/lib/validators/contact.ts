import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.enum(['contato', 'evento', 'consultoria', 'imersao-lovable', 'imersao-claude', 'outro'], 'Selecione um assunto'),
  message: z.string().min(20, 'Mensagem deve ter pelo menos 20 caracteres'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
