import { defineConfig } from '@playwright/test';

// E2E do MentorMatch a nivel HTTP (Playwright `request`), exercitando auth +
// banco real (seedado) sem depender de browser. O job de CI sobe Postgres,
// aplica o schema, roda o seed e executa esta suite. Localmente reaproveita um
// `next dev` ja em execucao.
const PORT = Number(process.env.PORT ?? 3000);
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  timeout: 30_000,
  use: { baseURL, extraHTTPHeaders: { 'content-type': 'application/json' } },
  projects: [{ name: 'api' }],
  webServer: {
    command: 'node_modules/.bin/next dev -p ' + PORT,
    url: `${baseURL}/mentormatch/default`,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
