import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://rishijain07.github.io',
  base: '/codehub-extension',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
