// Writes one finished HTML file per page into dist/, so crawlers and link previews
// that don't run JavaScript still see each page's content, title, and description.
// Runs after `vite build` (the browser bundle) and `vite build --ssr` (dist-ssr/).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { render, pageMeta, PATHS, SITE_URL } from '../dist-ssr/entry-server.js';

const escape = (text) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function head(pathname) {
  const { title, description } = pageMeta(pathname);
  const url = SITE_URL + pathname;
  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
  ].join('\n  ');
}

const template = await readFile('dist/index.html', 'utf8');

for (const pathname of PATHS) {
  const body = await render(pathname);
  // Function replacers, so a "$" in the page isn't read as a replacement pattern
  const html = template
    .replace('<!--app-head-->', () => head(pathname))
    .replace('<!--app-html-->', () => body);
  // Hosts differ on whether /project/05 is served from project/05.html or
  // project/05/index.html, so write both.
  const files = pathname === '/'
    ? ['dist/index.html']
    : [`dist${pathname}.html`, `dist${pathname}/index.html`];
  for (const file of files) {
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
  }
}

console.log(`Prerendered ${PATHS.length} pages.`);
