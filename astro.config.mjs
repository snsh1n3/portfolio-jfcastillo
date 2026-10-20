// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Single source of truth for the public origin. If the site ever moves to its
// own domain, this is the only value to change (plus a 301 from the old host).
const SITE = 'https://jfcastillo.chusquisimas.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Keep CSS in external files so the CSP can stay `style-src 'self'`.
    inlineStylesheets: 'never',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
      // Error pages never belong in the sitemap.
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],
});
