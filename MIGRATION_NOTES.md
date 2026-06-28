# Astro 7 Migration Notes

- Upgraded Astro to 7.x and official integrations used by the site: `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`, and `@astrojs/check`.
- Replaced `@astrojs/tailwind` with the Astro 7-compatible Tailwind 4 Vite plugin path using `@tailwindcss/vite`.
- Migrated the small Tailwind configuration into `src/styles/global.css` with Tailwind 4 CSS-first directives:
  - `@import "tailwindcss"`
  - `@plugin "@tailwindcss/typography"`
  - `@custom-variant dark` for class-based dark mode
  - `@theme` font stacks for Inter and Lora
- Preserved existing Astro integrations for MDX, sitemap generation, RSS, `ClientRouter`, and the `review-loop` dev integration.
- Moved legacy `src/content/config.ts` to Astro 7's `src/content.config.ts` format and added file-backed `glob()` loaders for the existing Markdown/MDX collections.
- Added `pnpm-workspace.yaml` `allowBuilds` entries for `esbuild` and `sharp` because pnpm 11 requires explicit approval for those dependency build scripts.
- Caveat: `review-loop@0.9.0` still declares Astro 5/Vite 5-6 peer dependencies and has no newer release. It remains installed because the integration is part of the requested behavior.
