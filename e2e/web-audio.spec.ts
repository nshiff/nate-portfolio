import { test, expect } from '@playwright/test';

test('Play starts the music and Stop ends it, without errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/project/22');

  await expect(page.getByRole('img', { name: /Glowing curves/ })).toBeVisible();
  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByRole('button', { name: 'Stop' })).toBeVisible();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Stop' }).click();
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  expect(errors).toEqual([]);
});
