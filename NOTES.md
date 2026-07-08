# Build Journal

## 2026-07-08

- Starting full Pokédex build from SPEC.md
- Requirements: SvelteKit + Svelte 5, adapter-static, Tailwind v4, oxlint/oxfmt via ultracite, lefthook, zod, vitest, Playwright
- Deploy target: GitHub Pages at https://azagatti.github.io/pokedex-tw-on-2/
- Definition of Done: All features, tests pass, lint clean, CI green, Lighthouse ≥90, wow README
- ✓ Build tooling set up (ultracite, oxlint, oxfmt, lefthook)
- ✓ SvelteKit configured for static deployment with paths.base
- ✓ Data layer created (API client, cache, zod schemas)
- Note: lucide-svelte is deprecated, installed @lucide/svelte instead
- ✓ All pages created: home with infinite scroll, detail page, berries pages, favorites
- ✓ Search & filters implemented with debounce, generation/type filters, sort
- ✓ Theme toggle with localStorage persistence
- Found: ultracite requires oxfmt/oxlint as peer dependencies - need to install
