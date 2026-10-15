# Redesign validation

Validated on October 15, 2026 against the production build at `/codehub-extension/`.

- `npm run check`: no errors or warnings. One editor hint flags the intentionally retained legacy clipboard fallback as deprecated.
- `npm run build`: static HTML and bundled assets generated successfully.
- `npm test`: 14 browser tests passed, covering 320px, 390px, 768px, 1024px, and 1440px layouts, local assets, provider logos, the actual horizontal scroll animation, motion pause persistence, reduced motion, keyboard controls, clipboard copying, clipboard-denial recovery, static SEO content, and a no-JavaScript FAQ fallback.
- Axe WCAG A/AA checks: no violations in light or dark mode, for both the landing page and Ask AI dialog.
- Mobile Lighthouse: performance 94, accessibility 100, best practices 100, SEO 100. First contentful paint 1.6 seconds, largest contentful paint 2.9 seconds, total blocking time 30 milliseconds, cumulative layout shift 0. These are local lab measurements, not field data or a search ranking guarantee.
- Dependency audit after updating Astro and Sharp: zero known vulnerabilities reported.
- Prettier, sitemap XML validation, and Git whitespace checks passed.

The existing production site has not been changed. The Pages workflow now builds `dist/` when this branch is eventually merged into `main`. All screenshots and legal/documentation files retain their public URLs.
