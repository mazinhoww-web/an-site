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
