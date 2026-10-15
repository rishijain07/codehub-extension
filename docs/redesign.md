# CodeHub motion redesign

## Direction

An expressive developer product site built around the journey from an accepted solution to a durable GitHub history. Retain the original CodeHub logo and blue brand identity; retire the terminal mockup, repetitive panels, multi-colored provider buttons, and third-party image requests.

Palette: mineral #f2f4f8, porcelain #fcfdff, graphite #172139, muted steel #58647a, cobalt #2455dc, pale cobalt #e6edff. System dark mode uses the same semantic tokens with midnight surfaces and accessible blue. Display: Space Grotesk. Body: Manrope. Utility: IBM Plex Mono. Buttons and inputs use 10px radii; media and large surfaces use 20px; circular controls are reserved for single-icon buttons.

The signature visual is a dimensional contribution mosaic behind a real extension screenshot, followed by a pinned horizontal narrative through the actual authentication, setup, and dashboard screens. Mobile uses a vertical narrative. Reduced motion removes all pinning, drift, and reveals. A persistent motion control also offers a static experience.

## Research references

- [GitHub Features](https://github.com/features): communicate workflows with real product artifacts.
- [Raycast](https://www.raycast.com/): product imagery, deliberate typography, clear installation path.
- [GSAP](https://gsap.com/): coordinated sequences and scroll-linked storytelling.
- [shadcn Astro integration](https://ui.shadcn.com/docs/installation/astro): accessible React islands in a static marketing site.
- [Astro GitHub Pages](https://docs.astro.build/en/guides/deploy/github/): static builds with the correct repository base path.

## Delivery

Astro renders all core content to static HTML, including the FAQ answers. React islands are limited to platform selection, FAQs, and Ask AI. shadcn primitives supply buttons, dialog, toggle groups, fields, textarea, badges, and accordion. GSAP supplies the animation engine; no additional animation framework.

Preserve the canonical URL, Google verification token, social-image URL, legal text, existing section anchors, llms.txt, robots.txt, and privacy policy. No invented testimonials or adoption numbers. The sitemap lists the actual HTML landing page. Structured data describes the product and its free offer without invented ratings. Search rank depends on indexing, content, links, and competition; the implementation provides the technical foundation.
