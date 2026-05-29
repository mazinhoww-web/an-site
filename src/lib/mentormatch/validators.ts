import { z } from 'zod';

// Zod schemas for MentorMatch auth/onboarding. Shared by client forms and the
// route handlers so validation never diverges.

export const mmRegisterSchema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('Email invalido'),
  password: z.string().min(8, 'Minimo de 8 caracteres'),
});
export type MmRegisterInput = z.infer<typeof mmRegisterSchema>;

export const mmLoginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Informe a senha'),
});
export type MmLoginInput = z.infer<typeof mmLoginSchema>;

export const mmCompleteProfileSchema = z.object({
  role: z.enum(['MENTOR', 'MENTEE']),
  name: z.string().min(2, 'Informe seu nome'),
  headline: z.string().max(160).optional(),
  bio: z.string().max(2000).optional(),
  education: z.string().max(500).optional(),
  experience: z.string().max(2000).optional(),
  linkedin: z.string().url('URL invalida').or(z.literal('')).optional(),
  whatsapp: z.string().max(40).optional(),
  image: z.string().url().optional(),
  skills: z.array(z.string().uuid()).min(1, 'Selecione ao menos uma habilidade'),
});
export type MmCompleteProfileInput = z.infer<typeof mmCompleteProfileSchema>;

// Form half of the wizard (role comes from the route, not the form).
export const mmOnboardingFormSchema = mmCompleteProfileSchema.omit({ role: true, skills: true });
export type MmOnboardingFormInput = z.infer<typeof mmOnboardingFormSchema>;

// --- Matching / waitlist / notifications (Fase 6) -------------------------

export const mmConnectionRequestSchema = z.object({
  mentorId: z.string().uuid(),
  message: z.string().min(10, 'Mensagem muito curta').max(500, 'Mensagem muito longa').optional(),
});
export type MmConnectionRequestInput = z.infer<typeof mmConnectionRequestSchema>;

export const mmConnectionRespondSchema = z.object({
  connectionId: z.string().uuid(),
  status: z.enum(['ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED']),
});
export type MmConnectionRespondInput = z.infer<typeof mmConnectionRespondSchema>;

export const mmWaitlistReorderSchema = z.object({
  entries: z
    .array(z.object({ id: z.string().uuid(), position: z.number().int().min(1) }))
    .min(1),
});
export type MmWaitlistReorderInput = z.infer<typeof mmWaitlistReorderSchema>;

export const mmWaitlistDeleteSchema = z.object({ id: z.string().uuid() });
export type MmWaitlistDeleteInput = z.infer<typeof mmWaitlistDeleteSchema>;

export const mmNotificationPatchSchema = z
  .object({ id: z.string().uuid().optional(), all: z.boolean().optional() })
  .refine((v) => v.all === true || typeof v.id === 'string', {
    message: 'Informe id ou all:true',
  });
export type MmNotificationPatchInput = z.infer<typeof mmNotificationPatchSchema>;
