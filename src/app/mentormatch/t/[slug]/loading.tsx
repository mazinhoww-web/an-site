import { MentorMatchThemeRoot, Skeleton } from '@/mentormatch/design-system';

/**
 * Loading da resolucao de tenant (D004 DESIGN): skeleton com --surface-2,
 * nunca tela branca. Cobre a janela de fetch do layout/queries do tenant.
 */
export default function TenantLoading() {
  return (
    <MentorMatchThemeRoot style={{ minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Skeleton width={220} height={28} radius="var(--r-md)" />
          <Skeleton width={120} height={28} radius="var(--r-pill)" />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={180} radius="var(--r-lg)" />
          ))}
        </div>
      </div>
    </MentorMatchThemeRoot>
  );
}
