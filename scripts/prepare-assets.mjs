import { cp, mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Public URLs stay stable while Astro owns the generated HTML and bundles.
await mkdir('public/assets/brands', { recursive: true });
for (const file of [
  'logo128.png',
  'chrome-logo.svg',
  'stats-popup.webp',
  'stats.png',
  'popup-auth.png',
  'welcome.png',
  'device-code.png',
  'auth.png',
  'copy.png',
  'codehub-social-card.png',
]) {
  await cp(`assets/${file}`, `public/assets/${file}`);
}
for (const file of [
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'privacypolicy.txt',
  '.nojekyll',
]) {
  await cp(file, `public/${file}`);
}
await cp('docs/asset-attribution.md', 'public/assets/attribution.txt');
for (const name of [
  'leetcode',
  'geeksforgeeks',
  'codeforces',
  'codechef',
  'hackerrank',
  'github',
]) {
  await cp(
    `node_modules/simple-icons/icons/${name}.svg`,
    `public/assets/brands/${name}.svg`,
  );
}
for (const name of ['claude', 'gemini-color', 'perplexity', 'grok', 'openai']) {
  await cp(
    `node_modules/@lobehub/icons-static-svg/icons/${name}.svg`,
    `public/assets/brands/${name}.svg`,
  );
}
await sharp('assets/stats-popup.webp')
  .extract({ left: 1740, top: 185, width: 730, height: 980 })
  .resize(650)
  .webp({ quality: 88 })
  .toFile('public/assets/popup-detail.webp');
await sharp('assets/stats.png')
  .webp({ quality: 85 })
  .toFile('public/assets/dashboard.webp');
await sharp('assets/popup-auth.png')
  .resize({ width: 1000, withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile('public/assets/auth-detail.webp');
await sharp('assets/welcome.png')
  .resize({ width: 1200, withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile('public/assets/setup-detail.webp');
for (const name of ['dashboard', 'auth-detail', 'setup-detail']) {
  for (const width of [480, 800]) {
    await sharp(`public/assets/${name}.webp`)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(`public/assets/${name}-${width}.webp`);
  }
}
await writeFile(
  'public/404.html',
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Page not found | CodeHub</title><body style="font-family:system-ui;padding:8vw"><h1>This page moved.</h1><p><a href="/codehub-extension/">Go to CodeHub</a></p></body></html>',
);
