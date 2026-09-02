import { test, expect } from '@playwright/test';

test('whoami returns "player"', async ({ page }) => {
  await page.goto('/demo/zork-roguelike/index.html');
  const input = page.locator('#cmd');
  await input.fill('whoami');
  await input.press('Enter');
  await expect(page.locator('#output')).toContainText('player');
});

test('walk from BEDROOM all the way to OUTLOOK', async ({ page }) => {
  await page.goto('/demo/zork-roguelike/index.html');
  const input = page.locator('#cmd');
  const output = page.locator('#output');

  // BEDROOM -> LIVINGROOM -> FRONTLAWN -> CITYPARK -> OUTLOOK
  const route = ['LIVINGROOM', 'FRONTLAWN', 'CITYPARK', 'OUTLOOK'];
  for (const room of route) {
    await input.fill(`walk ${room}`);
    await input.press('Enter');
  }

  // last room's description confirms arrival
  await expect(output).toContainText('From the OUTLOOK you can see');
  // and it was never reported as unreachable along the way
  await expect(output).not.toContainText("You can't walk to");
});

test('sleep works in LIVINGROOM but not on FRONTLAWN', async ({ page }) => {
  await page.goto('/demo/zork-roguelike/index.html');
  const input = page.locator('#cmd');
  const output = page.locator('#output');

  const run = async (cmd: string) => {
    await input.fill(cmd);
    await input.press('Enter');
  };

  await run('walk LIVINGROOM');
  await run('sleep');
  await expect(output).toContainText('You awake feeling');

  await run('walk FRONTLAWN');
  await run('sleep');
  await expect(output).toContainText("You can't sleep here.");
});
