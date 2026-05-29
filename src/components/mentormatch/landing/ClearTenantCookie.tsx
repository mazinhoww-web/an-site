'use client';

import { useEffect } from 'react';

// On the public root, clear the mm-tenant cookie so the user is no longer scoped
// to a branded tenant. Uses the tenant/clear endpoint (Fase 10).
export function ClearTenantCookie() {
  useEffect(() => {
    void fetch('/api/mentormatch/tenant/clear', { method: 'POST' }).catch(() => {});
  }, []);
  return null;
}
