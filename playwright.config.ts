import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
    {
      // The prerendered production build, for prerender.spec.ts
      command: 'npm run build && npx vite preview --port 4173 --strictPort',
      url: 'http://localhost:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
  projects: [
    {
      name: 'dev',
      testIgnore: /prerender\.spec\.ts/,
      use: { baseURL: 'http://localhost:5173' },
    },
    {
      name: 'prerender',
      testMatch: /prerender\.spec\.ts/,
      use: { baseURL: 'http://localhost:4173' },
    },
  ],
});
