import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const isNetlify = process.env.DEPLOY_TARGET === 'netlify';

export default defineConfig({
  site: isNetlify ? 'https://codehub-extension.netlify.app' : 'https://rishijain07.github.io',
  base: isNetlify ? '/' : '/codehub-extension',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
