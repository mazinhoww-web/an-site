'use client';

import { useEffect } from 'react';

// Sets the (non-httpOnly) mm-tenant cookie client-side. RSC cannot set cookies
// during render, and this cookie is meant to be readable on both sides. Read
// server-side by resolveOnboardingTenant / resolveThemeKey.
export function SetTenantCookie({ slug }: { slug: string }) {
  useEffect(() => {
    document.cookie = `mm-tenant=${encodeURIComponent(slug)}; path=/; max-age=86400; samesite=lax`;
  }, [slug]);
  return null;
}
