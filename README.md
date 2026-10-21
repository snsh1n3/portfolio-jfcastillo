# portfolio-jfcastillo

Personal CV / portfolio of Juan Felipe Castillo Collazos. Static site (Astro) served from a Cloudflare Worker with Static Assets at `jfcastillo.chusquisimas.com`. English at `/`, Spanish at `/es/`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Astro dev server |
| `npm run check` | Type and content-schema check |
| `npm run build` | `astro check` + build + `scripts/verify-dist.mjs` (hreflang parity, no `tel:`, no plain-text email, CSP-safe markup) |
| `npm run preview` | Serve `dist/` locally with Wrangler (applies `_headers`) |
| `npm run deploy` | Build and `wrangler deploy` (run by the owner, never from CI by default) |

## License

All rights reserved (see `LICENSE`). The repo is public for transparency only; fonts keep their OFL license.

Requires Node ≥ 22.12.

## Structure

- `src/content/profile.yaml` and `src/content/experience/*.yaml` — all copy, every string with `en` and `es`; the build fails if one is missing.
- `src/styles/` — design tokens, base, print.
- `src/layouts/Base.astro` — head, SEO, hreflang, JSON-LD.
- `public/_headers` — security headers and strict CSP; `public/fonts` — self-hosted fonts (OFL).
- `public/cv/juan-castillo-cv.pdf` — downloadable CV (added by the owner).

## Deploy prerequisites

1. Review the Cloudflare zone: no wildcard Worker route, DNS wildcard or Access application may capture `jfcastillo.chusquisimas.com`.
2. Update `compatibility_date` in `wrangler.jsonc` and verify the `custom_domain` route syntax.
3. Add the CV PDF, then `npm run deploy`.

No analytics are loaded. If Cloudflare Web Analytics is enabled later, extend the CSP in `public/_headers`.
