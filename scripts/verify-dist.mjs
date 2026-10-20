// Post-build checks on ./dist. Fails the build pipeline on regressions.
import { existsSync, readFileSync } from 'node:fs';

const errors = [];
const need = (p) => { if (!existsSync(p)) errors.push(`missing: ${p}`); };
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');

['dist/_headers', 'dist/index.html', 'dist/es/index.html', 'dist/404.html', 'dist/sitemap-index.xml', 'dist/robots.txt'].forEach(need);

for (const [file, lang] of [['dist/index.html', 'en'], ['dist/es/index.html', 'es']]) {
  const html = read(file);
  if (!html.includes(`<html lang="${lang}"`)) errors.push(`${file}: wrong <html lang>`);
  for (const h of ['en', 'es', 'x-default']) {
    if (!html.includes(`hreflang="${h}"`)) errors.push(`${file}: missing hreflang=${h}`);
  }
  if (/href="tel:/i.test(html)) errors.push(`${file}: contains a tel: link (phone must not be published)`);
  if (/jfcastilloc\.95@gmail\.com/.test(html)) errors.push(`${file}: plain-text email found (must be obfuscated)`);
  if (/<style[\s>]/.test(html)) errors.push(`${file}: inline <style> would violate CSP style-src 'self'`);
  if (/<script(?![^>]*(application\/ld\+json|src=))[^>]*>/.test(html)) errors.push(`${file}: inline script would violate CSP`);
}

if (errors.length) {
  console.error('verify-dist FAILED:\n - ' + errors.join('\n - '));
  process.exit(1);
}
console.log('verify-dist OK');
