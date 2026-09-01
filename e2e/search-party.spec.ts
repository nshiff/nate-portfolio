import { test, expect } from '@playwright/test';

test('whoami returns "player"', async ({ page }) => {
  await page.goto('/demo/zork-roguelike/index.html');
  const input = page.locator('#cmd');
  await input.fill('whoami');
  await input.press('Enter');
  await expect(page.locator('#output')).toContainText('player');
});
