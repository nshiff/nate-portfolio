import { test, expect } from '@playwright/test';
import { projects } from '../src/data/projects';
import { pageMeta } from '../src/data/meta';

// Runs against the production build (see playwright.config.ts), where every page is prerendered.
const PAGES = ['/', ...projects.map((p) => `/project/${p.id}`)];

/** The raw HTML a crawler gets: no JavaScript runs. */
async function fetchHtml(request: import('@playwright/test').APIRequestContext, path: string) {
  const response = await request.get(path);
  expect(response.ok(), path).toBe(true);
  return response.text();
}

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

test('the home page lists the bio and every project as plain HTML', async ({ request }) => {
  const html = await fetchHtml(request, '/');
  expect(html).toContain('Software developer skilled with React');
  for (const p of projects) {
    expect(html, p.id).toContain(`href="/project/${p.id}"`);
    expect(html, p.id).toContain(p.title.replace(/'/g, '&#x27;'));
    expect(html, p.id).toContain(p.description.replace(/'/g, '&#x27;'));
  }
});

for (const path of PAGES) {
  test(`${path} has its own title, description, and Open Graph tags`, async ({ request }) => {
    const html = await fetchHtml(request, path);
    const { title, description } = pageMeta(path);
    expect(html).toContain(`<title>${title}</title>`);
    expect(html).toContain(`<meta name="description" content="${escape(description)}" />`);
    expect(html).toContain(`<meta property="og:title" content="${escape(title)}" />`);
    expect(html).toContain(`<meta property="og:url" content="https://nate-portfolio.onrender.com${path}" />`);
  });

  test(`${path} hydrates without a mismatch`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(path);
    await expect(page.getByRole('link', { name: "Nate's Portfolio" })).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });
}

test('project titles are distinct from the home page title', () => {
  const home = pageMeta('/').title;
  for (const p of projects) {
    expect(pageMeta(`/project/${p.id}`).title).not.toBe(home);
  }
});
