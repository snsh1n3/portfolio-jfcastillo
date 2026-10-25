// Post-build checks on ./dist. Fails the build pipeline on regressions.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = process.argv[2] ?? 'dist';
const errors = [];
const need = (p) => { if (!existsSync(join(DIST, p))) errors.push(`missing: ${DIST}/${p}`); };
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');

function* htmlFiles(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) yield full;
  }
}

['_headers', 'index.html', 'es/index.html', '404.html', 'sitemap-index.xml', 'robots.txt', 'og/og-en.png', 'og/og-es.png', 'cv/juan-castillo-cv.pdf'].forEach(need);

// Language and SEO pairing: only the two home pages.
for (const [file, lang] of [['index.html', 'en'], ['es/index.html', 'es']]) {
  const html = read(join(DIST, file));
  if (!html.includes(`<html lang="${lang}"`)) errors.push(`${file}: wrong <html lang>`);
  for (const h of ['en', 'es', 'x-default']) {
    if (!html.includes(`hreflang="${h}"`)) errors.push(`${file}: missing hreflang=${h}`);
  }
  if (!html.includes(`/og/og-${lang}.png`)) errors.push(`${file}: missing og:image for ${lang}`);
  if (!/<script[^>]+type="module"[^>]+src="\/_astro\//.test(html)) errors.push(`${file}: external site script missing`);
}

// Personal data, CSP and colour rules: every published HTML page, including 404
// and any page added later.
const pages = [...htmlFiles(DIST)];
if (pages.length < 3) errors.push(`expected at least 3 HTML pages in ${DIST}, found ${pages.length}`);
for (const full of pages) {
  const file = relative(DIST, full);
  const html = read(full);
  if (/href="tel:/i.test(html)) errors.push(`${file}: contains a tel: link (phone must not be published)`);
  if (/jfcastilloc\.95@gmail\.com/.test(html)) errors.push(`${file}: plain-text email found (must be obfuscated)`);
  if (/mailto:/i.test(html)) errors.push(`${file}: static mailto: link (address must be assembled client-side)`);
  if (/#[0-9a-f]{3,8}\b/i.test(html.replace(/stroke="#fc523b"|fill="#6e6e6e"/g, ''))) errors.push(`${file}: stray hard-coded colour in markup`);
  if (/<style[\s>]/.test(html)) errors.push(`${file}: inline <style> would violate CSP style-src 'self'`);
  if (/<script(?![^>]*(application\/ld\+json|src=))[^>]*>/.test(html)) errors.push(`${file}: inline script would violate CSP`);
}

if (errors.length) {
  console.error('verify-dist FAILED:\n - ' + errors.join('\n - '));
  process.exit(1);
}
console.log(`verify-dist OK (${pages.length} HTML pages)`);
