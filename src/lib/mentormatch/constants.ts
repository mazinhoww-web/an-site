// Default skill catalog created for every new tenant. Single source of truth,
// shared by the seed and the super-admin "create tenant" flow.
export const MM_DEFAULT_SKILLS = ['Technology', 'Design', 'Management', 'Marketing', 'Career'];

// Slugs que NAO podem ser usados como tenant (D004): segmentos de rota, areas
// reservadas e o tenant de sistema. Bloqueados na criacao via super-admin.
// `default` e o tenant de sistema (seed) e nao pode ser recriado.
export const RESERVED_TENANT_SLUGS = [
  'default',
  't',
  'admin',
  'api',
  'app',
  'www',
  'mentormatch',
  'login',
  'register',
  'onboarding',
  'select-profile',
  'continue',
  'forgot-password',
  'reset-password',
  'demo',
  'new',
  'settings',
  'dashboard',
  'static',
  'assets',
  'public',
  '_next',
] as const;

/** True se o slug for reservado (case-insensitive). */
export function isReservedTenantSlug(slug: string): boolean {
  return (RESERVED_TENANT_SLUGS as readonly string[]).includes(slug.trim().toLowerCase());
}
