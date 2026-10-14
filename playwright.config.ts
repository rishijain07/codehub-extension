import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4321/codehub-extension/',
    trace: 'retain-on-failure',
  },
  reporter: 'list',
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: 'http://127.0.0.1:4321/codehub-extension/',
    reuseExistingServer: !process.env.CI,
    env: { ASTRO_TELEMETRY_DISABLED: '1' },
  },
});
